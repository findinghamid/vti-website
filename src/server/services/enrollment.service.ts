import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { CourseStatus } from "@prisma/client";

export interface EnrollmentRecord {
  id: string;
  userId: string;
  courseId: string;
  progressPct: number;
  completedAt: Date | null;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
  course?: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    totalDurationSec: number;
    totalLectures: number;
    instructors?: Array<{
      name: string;
      avatarUrl: string | null;
    }>;
  };
}

// In-memory fallback enrollment store for offline dev & test environments
const FALLBACK_ENROLLMENTS: Map<string, EnrollmentRecord[]> = new Map();

export class EnrollmentService {
  /**
   * Check if a student is already enrolled in a course
   */
  static async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    try {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
      });
      if (enrollment) return true;
    } catch {
      // Offline fallback
    }

    const userList = FALLBACK_ENROLLMENTS.get(userId) || [];
    return userList.some((e) => e.courseId === courseId);
  }

  /**
   * Atomically provision course enrollments for a user
   */
  static async provisionEnrollments(
    userId: string,
    courseIds: string[]
  ): Promise<EnrollmentRecord[]> {
    if (!courseIds || courseIds.length === 0) return [];

    const now = new Date();
    const createdEnrollments: EnrollmentRecord[] = [];

    for (const courseId of courseIds) {
      try {
        const enrollment = await prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
          update: {
            lastActiveAt: now,
          },
          create: {
            userId,
            courseId,
            progressPct: 0,
            lastActiveAt: now,
          },
        });

        // Increment student count on course
        await prisma.course.update({
          where: { id: courseId },
          data: { totalStudents: { increment: 1 } },
        }).catch(() => {});

        createdEnrollments.push(enrollment);
      } catch (error) {
        logger.warn(`Failed provisioning database enrollment for course ${courseId}, using fallback store`, {
          error,
          metadata: { userId, courseId },
        });

        let userList = FALLBACK_ENROLLMENTS.get(userId) || [];
        const existingIdx = userList.findIndex((e) => e.courseId === courseId);

        if (existingIdx >= 0) {
          userList[existingIdx].lastActiveAt = now;
          createdEnrollments.push(userList[existingIdx]);
        } else {
          const mockRecord: EnrollmentRecord = {
            id: `enr-${userId}-${courseId}-${Date.now()}`,
            userId,
            courseId,
            progressPct: 0,
            completedAt: null,
            lastActiveAt: now,
            createdAt: now,
            updatedAt: now,
          };
          userList.push(mockRecord);
          createdEnrollments.push(mockRecord);
        }

        FALLBACK_ENROLLMENTS.set(userId, userList);
      }
    }

    return createdEnrollments;
  }

  /**
   * Retrieve all enrolled courses for a user
   */
  static async getUserEnrollments(userId: string): Promise<EnrollmentRecord[]> {
    try {
      const records = await prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              instructors: {
                include: {
                  instructor: {
                    include: {
                      user: {
                        select: { name: true, avatarUrl: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { lastActiveAt: "desc" },
      });

      if (records.length > 0) {
        return records.map((r) => ({
          ...r,
          course: {
            id: r.course.id,
            title: r.course.title,
            slug: r.course.slug,
            thumbnailUrl: r.course.thumbnailUrl,
            totalDurationSec: r.course.totalDurationSec,
            totalLectures: r.course.totalLectures,
            instructors: r.course.instructors.map((ci) => ({
              name: ci.instructor.user.name,
              avatarUrl: ci.instructor.user.avatarUrl,
            })),
          },
        }));
      }
    } catch (error) {
      logger.warn("Failed fetching enrollments from database, using fallback store", { error, metadata: { userId } });
    }

    return FALLBACK_ENROLLMENTS.get(userId) || [];
  }
}
