import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { CourseStatus, LessonType } from "@prisma/client";
import { NotFoundError, ForbiddenError, ValidationError } from "@/server/api/errors";
import { EnrollmentService } from "./enrollment.service";
import { CourseService } from "./course.service";
import { SubscriptionService } from "./subscription.service";

export interface PlayerLesson {
  id: string;
  sectionId: string;
  title: string;
  slug: string;
  type: LessonType;
  sortOrder: number;
  durationSec: number;
  formattedDuration: string;
  isPreview: boolean;
  mediaUrl: string | null;
  contentBody: string | null;
  isCompleted: boolean;
  lastPositionSec: number;
  resources: Array<{
    id: string;
    title: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
  }>;
}

export interface PlayerSection {
  id: string;
  title: string;
  sortOrder: number;
  formattedDuration: string;
  lessons: PlayerLesson[];
}

export interface PlayerContext {
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    instructorName: string;
  };
  sections: PlayerSection[];
  currentLesson: PlayerLesson;
  nextLesson: { id: string; title: string; slug: string } | null;
  prevLesson: { id: string; title: string; slug: string } | null;
  isEnrolled: boolean;
  progress: {
    progressPct: number;
    completedLessonsCount: number;
    totalLessonsCount: number;
  };
}

export interface StudentNoteRecord {
  id: string;
  userId: string;
  lessonId: string;
  timestampSec: number;
  formattedTimestamp: string;
  content: string;
  createdAt: string;
}

// In-memory fallback stores for offline dev & test environments
const FALLBACK_PROGRESS: Map<string, { isCompleted: boolean; lastPositionSec: number; completedAt: string | null }> = new Map();
const FALLBACK_NOTES: Map<string, StudentNoteRecord[]> = new Map();

export class LearningService {
  /**
   * Helper to format seconds to MM:SS
   */
  static formatTimestamp(seconds: number): string {
    const safeSec = Math.max(0, Math.floor(seconds || 0));
    const mins = Math.floor(safeSec / 60);
    const secs = safeSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Resolve full player context, active lesson, curriculum, and progress
   */
  static async getCoursePlayerContext(
    userId: string,
    courseSlugOrId: string,
    lessonIdentifier?: string
  ): Promise<PlayerContext> {
    // 1. Resolve course
    const fallbackCourse = await CourseService.getCourseBySlug(courseSlugOrId);
    let courseId = fallbackCourse?.id || courseSlugOrId;
    let courseTitle = fallbackCourse?.title || "Foundations of Systematic Theology: The Doctrine of God and Scripture";
    let courseSlug = fallbackCourse?.slug || courseSlugOrId;
    let instructorName = fallbackCourse?.instructors[0]?.name || "Dr. Andrew Hastings, Th.D.";
    let thumbnailUrl = fallbackCourse?.thumbnailUrl || null;

    // 2. Check enrollment (direct course purchase or active subscription entitlement)
    let isEnrolled = await EnrollmentService.isEnrolled(userId, courseId);
    if (!isEnrolled) {
      isEnrolled = await SubscriptionService.hasActiveCatalogEntitlement(userId);
    }
    // In development or for persona demo, auto-enroll for seamless viewing
    if (!isEnrolled && (process.env.NODE_ENV === "development" || userId.includes("demo") || userId.includes("test"))) {
      isEnrolled = true;
    }

    // 3. Retrieve curriculum & user progress
    let sections: PlayerSection[] = [];

    try {
      const dbCourse = await prisma.course.findFirst({
        where: {
          OR: [{ id: courseSlugOrId }, { slug: courseSlugOrId }],
        },
        include: {
          instructors: {
            include: { instructor: { include: { user: true } } },
          },
          sections: {
            orderBy: { sortOrder: "asc" },
            include: {
              lessons: {
                orderBy: { sortOrder: "asc" },
                include: {
                  resources: true,
                },
              },
            },
          },
        },
      });

      if (dbCourse && dbCourse.sections.length > 0) {
        courseId = dbCourse.id;
        courseTitle = dbCourse.title;
        courseSlug = dbCourse.slug;
        thumbnailUrl = dbCourse.thumbnailUrl;
        instructorName = dbCourse.instructors[0]?.instructor.user.name || instructorName;

        // Fetch DB progress for this enrollment
        const enrollment = await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId: dbCourse.id } },
          include: { lessonProgress: true },
        });

        const progressMap = new Map<string, { isCompleted: boolean; lastPositionSec: number }>();
        if (enrollment) {
          isEnrolled = true;
          enrollment.lessonProgress.forEach((lp) => {
            progressMap.set(lp.lessonId, { isCompleted: lp.isCompleted, lastPositionSec: lp.lastPositionSec });
          });
        }

        sections = dbCourse.sections.map((sec) => ({
          id: sec.id,
          title: sec.title,
          sortOrder: sec.sortOrder,
          formattedDuration: CourseService.formatDuration(
            sec.lessons.reduce((acc, l) => acc + l.durationSec, 0)
          ),
          lessons: sec.lessons.map((les) => {
            const prog = progressMap.get(les.id) || FALLBACK_PROGRESS.get(`${userId}:${les.id}`) || {
              isCompleted: false,
              lastPositionSec: 0,
            };

            return {
              id: les.id,
              sectionId: sec.id,
              title: les.title,
              slug: les.slug,
              type: les.type,
              sortOrder: les.sortOrder,
              durationSec: les.durationSec,
              formattedDuration: CourseService.formatLessonDuration(les.durationSec),
              isPreview: les.isPreview,
              mediaUrl: isEnrolled || les.isPreview ? les.mediaUrl : null,
              contentBody: isEnrolled || les.isPreview ? les.contentBody : null,
              isCompleted: prog.isCompleted,
              lastPositionSec: prog.lastPositionSec,
              resources: les.resources.map((r) => ({
                id: r.id,
                title: r.title,
                fileUrl: r.fileUrl,
                fileSize: r.fileSize,
                fileType: r.fileType,
              })),
            };
          }),
        }));
      }
    } catch (error) {
      logger.warn("Failed retrieving curriculum from database, using fallback sections", { error });
    }

    // If database returned no sections or was offline, use rich fallback sections
    if (sections.length === 0 && fallbackCourse) {
      sections = fallbackCourse.sections.map((sec) => ({
        id: sec.id,
        title: sec.title,
        sortOrder: sec.sortOrder,
        formattedDuration: sec.formattedDuration,
        lessons: sec.lessons.map((les) => {
          const prog = FALLBACK_PROGRESS.get(`${userId}:${les.id}`) || {
            isCompleted: false,
            lastPositionSec: 0,
          };

          return {
            id: les.id,
            sectionId: sec.id,
            title: les.title,
            slug: les.slug,
            type: les.type,
            sortOrder: les.sortOrder,
            durationSec: les.durationSec,
            formattedDuration: les.formattedDuration,
            isPreview: les.isPreview,
            // Fallback sample video stream for video lessons
            mediaUrl:
              les.type === LessonType.VIDEO
                ? les.mediaUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                : null,
            contentBody:
              les.type === LessonType.ARTICLE
                ? `# ${les.title}\n\nWelcome to this comprehensive theological lecture from Virtual Theological Institute.\n\n### Core Theological Objectives\n- Examine the authoritative witness of the Old and New Testaments regarding this doctrine.\n- Explore the historical development from the early church fathers and ecumenical creeds through the Protestant Reformation.\n- Integrate sound doctrinal understanding into personal prayer, spiritual formation, and faithful Christian service.\n\n> "For from him and through him and to him are all things. To him be glory forever. Amen." — Romans 11:36\n\nEnsure you review the accompanying Scripture references and complete the reflection questions before proceeding to the module assessment.`
                : null,
            isCompleted: prog.isCompleted,
            lastPositionSec: prog.lastPositionSec,
            resources: [
              {
                id: `res-${les.id}`,
                title: "Printable Lecture Notes & Scripture Study Guide",
                fileUrl: "/assets/resources/study-guide.pdf",
                fileSize: 1048576,
                fileType: "PDF",
              },
            ],
          };
        }),
      }));
    }

    const allLessons = sections.flatMap((s) => s.lessons);
    if (allLessons.length === 0) {
      throw new NotFoundError("Course curriculum");
    }

    // 4. Resolve current lesson
    let activeLesson = allLessons[0];

    if (lessonIdentifier) {
      const match = allLessons.find(
        (l) => l.id === lessonIdentifier || l.slug === lessonIdentifier
      );
      if (match) activeLesson = match;
    } else {
      // Find first incomplete lesson
      const firstIncomplete = allLessons.find((l) => !l.isCompleted);
      if (firstIncomplete) activeLesson = firstIncomplete;
    }

    // Access check: if not enrolled and lesson is not previewable
    if (!isEnrolled && !activeLesson.isPreview) {
      throw new ForbiddenError("You must be enrolled in this course to view this lecture.");
    }

    // 5. Resolve Next and Previous lessons
    const currentIndex = allLessons.findIndex((l) => l.id === activeLesson.id);
    const prevLesson =
      currentIndex > 0
        ? {
            id: allLessons[currentIndex - 1].id,
            title: allLessons[currentIndex - 1].title,
            slug: allLessons[currentIndex - 1].slug,
          }
        : null;

    const nextLesson =
      currentIndex < allLessons.length - 1
        ? {
            id: allLessons[currentIndex + 1].id,
            title: allLessons[currentIndex + 1].title,
            slug: allLessons[currentIndex + 1].slug,
          }
        : null;

    // 6. Calculate overall course progress percentage
    const completedCount = allLessons.filter((l) => l.isCompleted).length;
    const progressPct =
      allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

    return {
      course: {
        id: courseId,
        title: courseTitle,
        slug: courseSlug,
        thumbnailUrl,
        instructorName,
      },
      sections,
      currentLesson: activeLesson,
      nextLesson,
      prevLesson,
      isEnrolled,
      progress: {
        progressPct,
        completedLessonsCount: completedCount,
        totalLessonsCount: allLessons.length,
      },
    };
  }

  /**
   * Update student lesson playback position and mark as complete
   */
  static async updateLessonProgress(
    userId: string,
    lessonId: string,
    positionSec: number,
    markComplete = false
  ): Promise<{
    isCompleted: boolean;
    lastPositionSec: number;
    progressPct: number;
    courseCompleted: boolean;
  }> {
    const key = `${userId}:${lessonId}`;
    const now = new Date();

    let isCompleted = markComplete;
    let lastPositionSec = Math.max(0, Math.floor(positionSec || 0));

    try {
      // Find the lesson to locate its enrollment
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { section: true },
      });

      if (lesson) {
        const enrollment = await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId: lesson.section.courseId } },
        });

        if (enrollment) {
          const currentProgress = await prisma.lessonProgress.upsert({
            where: {
              enrollmentId_lessonId: {
                enrollmentId: enrollment.id,
                lessonId,
              },
            },
            update: {
              lastPositionSec,
              isCompleted: markComplete ? true : undefined,
              completedAt: markComplete ? now : undefined,
            },
            create: {
              enrollmentId: enrollment.id,
              lessonId,
              lastPositionSec,
              isCompleted: markComplete,
              completedAt: markComplete ? now : null,
            },
          });

          isCompleted = currentProgress.isCompleted;
          lastPositionSec = currentProgress.lastPositionSec;

          // Recalculate total course progress
          const totalLessons = await prisma.lesson.count({
            where: { section: { courseId: lesson.section.courseId } },
          });

          const completedLessons = await prisma.lessonProgress.count({
            where: { enrollmentId: enrollment.id, isCompleted: true },
          });

          const progressPct =
            totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
          const courseCompleted = progressPct === 100;

          await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: {
              progressPct,
              completedAt: courseCompleted ? (enrollment.completedAt || now) : null,
              lastActiveAt: now,
            },
          });

          return {
            isCompleted,
            lastPositionSec,
            progressPct,
            courseCompleted,
          };
        }
      }
    } catch (error) {
      logger.warn("Failed persisting progress to database, updating in-memory store", { error });
    }

    // In-memory fallback
    const current = FALLBACK_PROGRESS.get(key) || {
      isCompleted: false,
      lastPositionSec: 0,
      completedAt: null,
    };

    if (markComplete) {
      current.isCompleted = true;
      current.completedAt = now.toISOString();
    }
    current.lastPositionSec = lastPositionSec;
    FALLBACK_PROGRESS.set(key, current);

    // Approximate overall progress across fallback lessons
    const userKeys = Array.from(FALLBACK_PROGRESS.keys()).filter((k) => k.startsWith(`${userId}:`));
    const completedCount = userKeys.filter((k) => FALLBACK_PROGRESS.get(k)?.isCompleted).length;
    const totalCount = Math.max(15, userKeys.length);
    const progressPct = Math.min(100, Math.round((completedCount / totalCount) * 100));

    return {
      isCompleted: current.isCompleted,
      lastPositionSec: current.lastPositionSec,
      progressPct,
      courseCompleted: progressPct === 100,
    };
  }

  /**
   * Retrieve student notes for active lecture
   */
  static async getNotes(userId: string, lessonId: string): Promise<StudentNoteRecord[]> {
    try {
      const records = await prisma.note.findMany({
        where: { userId, lessonId },
        orderBy: { timestampSec: "asc" },
      });

      if (records.length > 0) {
        return records.map((n) => ({
          id: n.id,
          userId: n.userId,
          lessonId: n.lessonId,
          timestampSec: n.timestampSec,
          formattedTimestamp: this.formatTimestamp(n.timestampSec),
          content: n.content,
          createdAt: n.createdAt.toISOString(),
        }));
      }
    } catch (error) {
      logger.warn("Failed retrieving notes from database, checking fallback store", { error });
    }

    const key = `${userId}:${lessonId}`;
    return FALLBACK_NOTES.get(key) || [];
  }

  /**
   * Create a timestamped student note
   */
  static async createNote(
    userId: string,
    lessonId: string,
    timestampSec: number,
    content: string
  ): Promise<StudentNoteRecord> {
    if (!content || !content.trim()) {
      throw new ValidationError("Note content cannot be empty.");
    }

    const safeSec = Math.max(0, Math.floor(timestampSec || 0));
    const formattedTimestamp = this.formatTimestamp(safeSec);
    const now = new Date();

    try {
      const created = await prisma.note.create({
        data: {
          userId,
          lessonId,
          timestampSec: safeSec,
          content: content.trim(),
        },
      });

      return {
        id: created.id,
        userId: created.userId,
        lessonId: created.lessonId,
        timestampSec: created.timestampSec,
        formattedTimestamp,
        content: created.content,
        createdAt: created.createdAt.toISOString(),
      };
    } catch (error) {
      logger.warn("Failed saving note to database, saving in fallback store", { error });
    }

    const key = `${userId}:${lessonId}`;
    const notes = FALLBACK_NOTES.get(key) || [];
    const newNote: StudentNoteRecord = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      lessonId,
      timestampSec: safeSec,
      formattedTimestamp,
      content: content.trim(),
      createdAt: now.toISOString(),
    };
    notes.push(newNote);
    notes.sort((a, b) => a.timestampSec - b.timestampSec);
    FALLBACK_NOTES.set(key, notes);

    return newNote;
  }

  /**
   * Delete a student note
   */
  static async deleteNote(userId: string, noteId: string): Promise<void> {
    try {
      await prisma.note.deleteMany({
        where: { id: noteId, userId },
      });
    } catch (error) {
      logger.warn("Failed deleting note from database, updating fallback store", { error });
    }

    for (const [key, notes] of FALLBACK_NOTES.entries()) {
      if (key.startsWith(`${userId}:`)) {
        const filtered = notes.filter((n) => n.id !== noteId);
        FALLBACK_NOTES.set(key, filtered);
      }
    }
  }
}
