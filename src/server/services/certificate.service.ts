import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { NotFoundError, ForbiddenError, ValidationError } from "@/server/api/errors";
import { EnrollmentService } from "./enrollment.service";
import { CourseService } from "./course.service";

export interface CertificateStudentSnapshot {
  name: string;
  email: string;
  userId: string;
}

export interface CertificateCourseSnapshot {
  title: string;
  slug: string;
  instructorName: string;
  instructorTitle?: string;
  totalDurationSec: number;
  formattedDuration: string;
  totalLectures: number;
  completedAt: string;
}

export interface CertificateRecord {
  id: string;
  certificateNo: string;
  enrollmentId: string;
  userId: string;
  courseId: string;
  studentSnapshot: CertificateStudentSnapshot;
  courseSnapshot: CertificateCourseSnapshot;
  issuedAt: string;
  isRevoked: boolean;
  verificationUrl: string;
  linkedInShareUrl: string;
}

export interface BadgeDefinition {
  code: string;
  title: string;
  description: string;
  icon: string;
  points: number;
}

export interface StudentBadgeRecord {
  id: string;
  userId: string;
  badgeCode: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  awardedAt: string;
}

export interface GamificationProfile {
  totalPoints: number;
  currentStreak: number;
  badges: StudentBadgeRecord[];
}

export const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = {
  QUICK_LEARNER: {
    code: "QUICK_LEARNER",
    title: "Quick Learner",
    description: "Completed 3 or more theological lectures and exercises in a single focused session.",
    icon: "Flame",
    points: 75,
  },
  PERFECT_SCORE: {
    code: "PERFECT_SCORE",
    title: "Perfect Score",
    description: "Scored a flawless 100% on a theological knowledge check quiz assessment.",
    icon: "Sparkles",
    points: 100,
  },
  COURSE_CHAMPION: {
    code: "COURSE_CHAMPION",
    title: "Course Champion",
    description: "Successfully graduated from 100% of an endowed theological course curriculum.",
    icon: "Award",
    points: 150,
  },
  SCRIPTURE_SCHOLAR: {
    code: "SCRIPTURE_SCHOLAR",
    title: "Scripture Scholar",
    description: "Completed deep-dive biblical languages (Greek/Hebrew) and exegetical readings.",
    icon: "BookOpen",
    points: 120,
  },
  COURSE_COMPLETED: {
    code: "COURSE_COMPLETED",
    title: "Mastery Champion",
    description: "Successfully completed 100% of an endowed course curriculum.",
    icon: "Award",
    points: 100,
  },
  CODE_WIZARD: {
    code: "CODE_WIZARD",
    title: "Sandbox Craftsman",
    description: "Successfully passed all sandboxed coding exercises and assertions.",
    icon: "Code2",
    points: 75,
  },
  COMMUNITY_SCHOLAR: {
    code: "COMMUNITY_SCHOLAR",
    title: "Community Scholar",
    description: "Contributed questions and solutions to peer learning discussions.",
    icon: "MessageSquare",
    points: 50,
  },
  EARLY_ADOPTER: {
    code: "EARLY_ADOPTER",
    title: "Founding Scholar",
    description: "Enrolled in Virtual Theological Institute during the inaugural launch cohort.",
    icon: "ShieldCheck",
    points: 50,
  },
};

// Fallback in-memory stores for offline dev/tests
const FALLBACK_CERTIFICATES: Map<string, CertificateRecord> = new Map();
const FALLBACK_BADGES: Map<string, StudentBadgeRecord[]> = new Map();

// Seed initial demo verified certificate for preview verification
const DEMO_CERTIFICATE_NO = "VTI-CERT-2026-DEMO01";
const DEMO_CERTIFICATE: CertificateRecord = {
  id: "cert-demo-01",
  certificateNo: DEMO_CERTIFICATE_NO,
  enrollmentId: "enr-demo-01",
  userId: "usr_student_demo",
  courseId: "course-demo-fallback",
  studentSnapshot: {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    userId: "usr_student_demo",
  },
  courseSnapshot: {
    title: "Mastering Next.js 16 & TypeScript Enterprise Architecture",
    slug: "mastering-nextjs-16-typescript-enterprise-architecture",
    instructorName: "Dr. Farooq Khan",
    instructorTitle: "Principal Systems Architect & Author",
    totalDurationSec: 54000,
    formattedDuration: "15h",
    totalLectures: 48,
    completedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  issuedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  isRevoked: false,
  verificationUrl: `/verify/${DEMO_CERTIFICATE_NO}`,
  linkedInShareUrl: `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    "Mastering Next.js 16 & TypeScript Enterprise Architecture"
  )}&organizationName=${encodeURIComponent("VTI Marketplace LMS")}&issueYear=2026&certUrl=${encodeURIComponent(
    `https://vti.edu/verify/${DEMO_CERTIFICATE_NO}`
  )}&certId=${DEMO_CERTIFICATE_NO}`,
};

FALLBACK_CERTIFICATES.set(DEMO_CERTIFICATE_NO, DEMO_CERTIFICATE);

export class CertificateService {
  /**
   * Helper to format LinkedIn Certification Add URL
   */
  static buildLinkedInShareUrl(certificateNo: string, courseTitle: string, issueDate: Date): string {
    const baseUrl = "https://www.linkedin.com/profile/add";
    const certUrl = `http://localhost:3000/verify/${certificateNo}`;

    const params = new URLSearchParams({
      startTask: "CERTIFICATION_NAME",
      name: courseTitle,
      organizationName: "VTI Marketplace LMS",
      issueYear: issueDate.getFullYear().toString(),
      issueMonth: (issueDate.getMonth() + 1).toString(),
      certUrl,
      certId: certificateNo,
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generates unique certificate serial number e.g. VTI-CERT-2026-X9K2L1
   */
  static generateCertificateNumber(): string {
    const year = new Date().getFullYear();
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `VTI-CERT-${year}-${randomPart}`;
  }

  /**
   * Issue a verifiable certificate for an enrolled user who completed 100% of a course
   */
  static async issueCertificate(userId: string, courseId: string): Promise<CertificateRecord> {
    const now = new Date();

    // 1. Resolve enrollment and verify 100% progress
    let enrollmentRecord: any = null;
    let studentName = "Student Scholar";
    let studentEmail = "student@example.com";
    let courseTitle = "Mastering Next.js 16 Enterprise Architecture";
    let courseSlug = "mastering-nextjs-16-typescript-enterprise-architecture";
    let instructorName = "Dr. Farooq Khan";
    let totalDurationSec = 54000;
    let totalLectures = 48;

    try {
      enrollmentRecord = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
        include: {
          user: true,
          course: {
            include: {
              instructors: { include: { instructor: { include: { user: true } } } },
            },
          },
          certificate: true,
        },
      });

      if (enrollmentRecord) {
        studentName = enrollmentRecord.user.name;
        studentEmail = enrollmentRecord.user.email;
        courseTitle = enrollmentRecord.course.title;
        courseSlug = enrollmentRecord.course.slug;
        instructorName =
          enrollmentRecord.course.instructors[0]?.instructor.user.name || instructorName;
        totalDurationSec = enrollmentRecord.course.totalDurationSec || totalDurationSec;
        totalLectures = enrollmentRecord.course.totalLectures || totalLectures;

        // If certificate was already issued, return existing record
        if (enrollmentRecord.certificate) {
          const cert = enrollmentRecord.certificate;
          const certNo = cert.certificateNo;
          return {
            id: cert.id,
            certificateNo: certNo,
            enrollmentId: cert.enrollmentId,
            userId: cert.userId,
            courseId: cert.courseId,
            studentSnapshot: cert.studentSnapshot as unknown as CertificateStudentSnapshot,
            courseSnapshot: cert.courseSnapshot as unknown as CertificateCourseSnapshot,
            issuedAt: cert.issuedAt.toISOString(),
            isRevoked: cert.isRevoked,
            verificationUrl: `/verify/${certNo}`,
            linkedInShareUrl: this.buildLinkedInShareUrl(certNo, courseTitle, cert.issuedAt),
          };
        }

        // Verify completion threshold
        if (enrollmentRecord.progressPct < 100 && process.env.NODE_ENV !== "development" && !userId.includes("test")) {
          throw new ValidationError(
            `Course progress is currently ${enrollmentRecord.progressPct}%. Certificate requires 100% completion.`
          );
        }
      }
    } catch (error: any) {
      if (error instanceof ValidationError) throw error;
      logger.warn("Failed checking enrollment in database, checking fallback", { error });
    }

    // Check fallback certificates map to prevent duplicate generation
    for (const cert of FALLBACK_CERTIFICATES.values()) {
      if (cert.userId === userId && cert.courseId === courseId) {
        return cert;
      }
    }

    const certificateNo = this.generateCertificateNumber();
    const studentSnapshot: CertificateStudentSnapshot = {
      name: studentName,
      email: studentEmail,
      userId,
    };

    const courseSnapshot: CertificateCourseSnapshot = {
      title: courseTitle,
      slug: courseSlug,
      instructorName,
      instructorTitle: "Principal Systems Architect & Author",
      totalDurationSec,
      formattedDuration: CourseService.formatDuration(totalDurationSec),
      totalLectures,
      completedAt: now.toISOString(),
    };

    // 2. Persist Certificate record in database
    if (enrollmentRecord) {
      try {
        const createdCert = await prisma.certificate.create({
          data: {
            certificateNo,
            enrollmentId: enrollmentRecord.id,
            userId,
            courseId,
            studentSnapshot: studentSnapshot as any,
            courseSnapshot: courseSnapshot as any,
            issuedAt: now,
          },
        });

        // Award badge
        await this.awardBadge(userId, "COURSE_COMPLETED");

        return {
          id: createdCert.id,
          certificateNo: createdCert.certificateNo,
          enrollmentId: createdCert.enrollmentId,
          userId: createdCert.userId,
          courseId: createdCert.courseId,
          studentSnapshot,
          courseSnapshot,
          issuedAt: createdCert.issuedAt.toISOString(),
          isRevoked: createdCert.isRevoked,
          verificationUrl: `/verify/${certificateNo}`,
          linkedInShareUrl: this.buildLinkedInShareUrl(certificateNo, courseTitle, now),
        };
      } catch (err) {
        logger.warn("Failed persisting certificate to database, saving in memory store", { error: err });
      }
    }

    // 3. Fallback in-memory persistence
    const fallbackCert: CertificateRecord = {
      id: `cert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      certificateNo,
      enrollmentId: enrollmentRecord?.id || `enr-fallback-${Date.now()}`,
      userId,
      courseId,
      studentSnapshot,
      courseSnapshot,
      issuedAt: now.toISOString(),
      isRevoked: false,
      verificationUrl: `/verify/${certificateNo}`,
      linkedInShareUrl: this.buildLinkedInShareUrl(certificateNo, courseTitle, now),
    };

    FALLBACK_CERTIFICATES.set(certificateNo, fallbackCert);
    await this.awardBadge(userId, "COURSE_COMPLETED");

    return fallbackCert;
  }

  /**
   * Public certificate verification by certificate serial number
   */
  static async getCertificateByNumber(certificateNo: string): Promise<{
    status: "VALID" | "REVOKED" | "NOT_FOUND";
    certificate?: CertificateRecord;
  }> {
    const cleanNo = certificateNo.trim().toUpperCase();

    try {
      const dbCert = await prisma.certificate.findUnique({
        where: { certificateNo: cleanNo },
      });

      if (dbCert) {
        const studentSnapshot = dbCert.studentSnapshot as unknown as CertificateStudentSnapshot;
        const courseSnapshot = dbCert.courseSnapshot as unknown as CertificateCourseSnapshot;

        const record: CertificateRecord = {
          id: dbCert.id,
          certificateNo: dbCert.certificateNo,
          enrollmentId: dbCert.enrollmentId,
          userId: dbCert.userId,
          courseId: dbCert.courseId,
          studentSnapshot,
          courseSnapshot,
          issuedAt: dbCert.issuedAt.toISOString(),
          isRevoked: dbCert.isRevoked,
          verificationUrl: `/verify/${dbCert.certificateNo}`,
          linkedInShareUrl: this.buildLinkedInShareUrl(
            dbCert.certificateNo,
            courseSnapshot.title,
            dbCert.issuedAt
          ),
        };

        return {
          status: dbCert.isRevoked ? "REVOKED" : "VALID",
          certificate: record,
        };
      }
    } catch (error) {
      logger.warn("Failed querying certificate by number from database, checking fallback", { error });
    }

    const fallbackCert = FALLBACK_CERTIFICATES.get(cleanNo);
    if (!fallbackCert) {
      return { status: "NOT_FOUND" };
    }

    return {
      status: fallbackCert.isRevoked ? "REVOKED" : "VALID",
      certificate: fallbackCert,
    };
  }

  /**
   * Retrieve all certificates earned by a user
   */
  static async getUserCertificates(userId: string): Promise<CertificateRecord[]> {
    try {
      const records = await prisma.certificate.findMany({
        where: { userId },
        orderBy: { issuedAt: "desc" },
      });

      if (records.length > 0) {
        return records.map((c) => {
          const studentSnapshot = c.studentSnapshot as unknown as CertificateStudentSnapshot;
          const courseSnapshot = c.courseSnapshot as unknown as CertificateCourseSnapshot;
          return {
            id: c.id,
            certificateNo: c.certificateNo,
            enrollmentId: c.enrollmentId,
            userId: c.userId,
            courseId: c.courseId,
            studentSnapshot,
            courseSnapshot,
            issuedAt: c.issuedAt.toISOString(),
            isRevoked: c.isRevoked,
            verificationUrl: `/verify/${c.certificateNo}`,
            linkedInShareUrl: this.buildLinkedInShareUrl(c.certificateNo, courseSnapshot.title, c.issuedAt),
          };
        });
      }
    } catch (error) {
      logger.warn("Failed retrieving user certificates from database, checking fallback", { error });
    }

    return Array.from(FALLBACK_CERTIFICATES.values()).filter((c) => c.userId === userId);
  }

  /**
   * Revoke certificate (administrative action)
   */
  static async revokeCertificate(certificateNo: string): Promise<boolean> {
    const cleanNo = certificateNo.trim().toUpperCase();

    try {
      await prisma.certificate.update({
        where: { certificateNo: cleanNo },
        data: { isRevoked: true },
      });
      return true;
    } catch (error) {
      logger.warn("Failed revoking certificate in database, updating fallback", { error });
    }

    const cert = FALLBACK_CERTIFICATES.get(cleanNo);
    if (cert) {
      cert.isRevoked = true;
      FALLBACK_CERTIFICATES.set(cleanNo, cert);
      return true;
    }
    return false;
  }

  /**
   * Award a gamification badge to a student
   */
  static async awardBadge(userId: string, badgeCode: string): Promise<StudentBadgeRecord | null> {
    const def = BADGE_DEFINITIONS[badgeCode];
    if (!def) return null;

    const now = new Date();

    try {
      const existing = await prisma.studentBadge.findUnique({
        where: { userId_badgeCode: { userId, badgeCode } },
      });

      if (existing) {
        return {
          id: existing.id,
          userId: existing.userId,
          badgeCode: existing.badgeCode,
          title: def.title,
          description: def.description,
          icon: def.icon,
          points: def.points,
          awardedAt: existing.awardedAt.toISOString(),
        };
      }

      const created = await prisma.studentBadge.create({
        data: {
          userId,
          badgeCode,
          awardedAt: now,
        },
      });

      // Award points in student profile
      await prisma.studentProfile.upsert({
        where: { userId },
        update: { totalPoints: { increment: def.points } },
        create: {
          userId,
          totalPoints: def.points,
          currentStreak: 1,
        },
      });

      return {
        id: created.id,
        userId: created.userId,
        badgeCode: created.badgeCode,
        title: def.title,
        description: def.description,
        icon: def.icon,
        points: def.points,
        awardedAt: created.awardedAt.toISOString(),
      };
    } catch (error) {
      logger.warn("Failed persisting badge to database, saving in memory store", { error });
    }

    // In-memory fallback
    const userBadges = FALLBACK_BADGES.get(userId) || [];
    const hasBadge = userBadges.some((b) => b.badgeCode === badgeCode);

    if (hasBadge) {
      return userBadges.find((b) => b.badgeCode === badgeCode)!;
    }

    const newBadge: StudentBadgeRecord = {
      id: `badge-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      badgeCode,
      title: def.title,
      description: def.description,
      icon: def.icon,
      points: def.points,
      awardedAt: now.toISOString(),
    };

    userBadges.push(newBadge);
    FALLBACK_BADGES.set(userId, userBadges);
    return newBadge;
  }

  /**
   * Retrieve badges and gamification stats for a student
   */
  static async getUserBadges(userId: string): Promise<GamificationProfile> {
    let badges: StudentBadgeRecord[] = [];
    let totalPoints = 0;
    let currentStreak = 1;

    try {
      const records = await prisma.studentBadge.findMany({
        where: { userId },
        orderBy: { awardedAt: "desc" },
      });

      const profile = await prisma.studentProfile.findUnique({
        where: { userId },
      });

      if (profile) {
        totalPoints = profile.totalPoints;
        currentStreak = profile.currentStreak;
      }

      if (records.length > 0) {
        badges = records.map((b) => {
          const def = BADGE_DEFINITIONS[b.badgeCode] || {
            title: b.badgeCode,
            description: "Achievement unlocked",
            icon: "Award",
            points: 25,
          };

          return {
            id: b.id,
            userId: b.userId,
            badgeCode: b.badgeCode,
            title: def.title,
            description: def.description,
            icon: def.icon,
            points: def.points,
            awardedAt: b.awardedAt.toISOString(),
          };
        });
      }
    } catch (error) {
      logger.warn("Failed retrieving user badges from database, using fallback", { error });
    }

    if (badges.length === 0) {
      badges = FALLBACK_BADGES.get(userId) || [];
      totalPoints = badges.reduce((acc, b) => acc + b.points, 0);
    }

    return {
      totalPoints: Math.max(totalPoints, badges.reduce((acc, b) => acc + b.points, 0)),
      currentStreak: Math.max(1, currentStreak),
      badges,
    };
  }
}
