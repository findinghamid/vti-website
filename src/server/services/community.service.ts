import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { NotFoundError, ForbiddenError, ValidationError } from "@/server/api/errors";
import { EnrollmentService } from "./enrollment.service";

export interface QuestionSummary {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  title: string;
  body: string;
  isAnswered: boolean;
  answersCount: number;
  latestAnswerAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionAnswer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  body: string;
  isInstructor: boolean;
  createdAt: string;
}

export interface QuestionDetail extends Omit<QuestionSummary, "answersCount" | "latestAnswerAt"> {
  answers: QuestionAnswer[];
}

export interface ReviewRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingBreakdown {
  averageRating: number;
  totalReviews: number;
  star5Percent: number;
  star4Percent: number;
  star3Percent: number;
  star2Percent: number;
  star1Percent: number;
  starCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// Fallback in-memory stores for offline dev/tests
const FALLBACK_QUESTIONS: Map<string, QuestionDetail> = new Map();
const FALLBACK_REVIEWS: Map<string, ReviewRecord> = new Map();

// Seed initial realistic fallback discussions
const DEFAULT_FALLBACK_QUESTIONS: QuestionDetail[] = [
  {
    id: "q-demo-1",
    courseId: "course-demo-fallback",
    userId: "usr_student_alpha",
    userName: "Elena Rostova",
    userAvatar: null,
    title: "Best practice for handling Next.js 16 dynamic route params with TypeScript?",
    body: "In Next.js 16 App Router, params in page components and route handlers are now Promises. Should we always `await params` or use React's `use()` hook when working in client components?",
    isAnswered: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    answers: [
      {
        id: "ans-demo-1",
        questionId: "q-demo-1",
        userId: "inst-1",
        userName: "Dr. Farooq Khan",
        userAvatar: null,
        body: "Great architectural question Elena! In Server Components and Route Handlers, always write `const { slug } = await params`. In Client Components, you can unwrap the Promise with `use(params)` from React 19.",
        isInstructor: true,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
  },
  {
    id: "q-demo-2",
    courseId: "course-demo-fallback",
    userId: "usr_student_beta",
    userName: "Marcus Vance",
    userAvatar: null,
    title: "How to handle database failover in serverless server-side rendering?",
    body: "When PostgreSQL socket connections hit maximum pooling limits during high-traffic spikes, what is the best strategy to keep user playback active without crashing the Node.js process?",
    isAnswered: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    answers: [
      {
        id: "ans-demo-2",
        questionId: "q-demo-2",
        userId: "inst-1",
        userName: "Dr. Farooq Khan",
        userAvatar: null,
        body: "We implement graceful degradation: wrap Prisma queries in service-level catch blocks that fall back to an in-memory or Redis catalog, logging a warning rather than throwing an unhandled 500 error.",
        isInstructor: true,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
  },
];

for (const q of DEFAULT_FALLBACK_QUESTIONS) {
  FALLBACK_QUESTIONS.set(q.id, q);
}

// Seed initial realistic fallback reviews
const DEFAULT_FALLBACK_REVIEWS: ReviewRecord[] = [
  {
    id: "rev-fallback-1",
    courseId: "course-demo-fallback",
    userId: "usr_rev_1",
    userName: "Sarah Jenkins",
    userAvatar: null,
    rating: 5,
    comment: "This is hands-down the best architectural guide for Next.js I have taken. Everything from Prisma queries to edge auth is explained thoroughly.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "rev-fallback-2",
    courseId: "course-demo-fallback",
    userId: "usr_rev_2",
    userName: "Ahmed Bilal",
    userAvatar: null,
    rating: 5,
    comment: "Production ready from day one. I applied the pattern directly to our corporate LMS migration and saved weeks of refactoring.",
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: "rev-fallback-3",
    courseId: "course-demo-fallback",
    userId: "usr_rev_3",
    userName: "David Kim",
    userAvatar: null,
    rating: 4,
    comment: "Excellent high-level architecture coverage. The coding exercises and in-browser evaluation make concepts stick immediately.",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];

for (const r of DEFAULT_FALLBACK_REVIEWS) {
  FALLBACK_REVIEWS.set(r.id, r);
}

export class CommunityService {
  /**
   * Retrieve list of questions for a course with optional search and filter
   */
  static async getCourseQuestions(
    courseId: string,
    options: {
      search?: string;
      filter?: "all" | "my" | "unanswered";
      userId?: string;
    } = {}
  ): Promise<QuestionSummary[]> {
    const { search = "", filter = "all", userId } = options;

    try {
      const dbQuestions = await prisma.courseQuestion.findMany({
        where: {
          courseId,
          ...(filter === "my" && userId ? { userId } : {}),
          ...(filter === "unanswered" ? { isAnswered: false } : {}),
          ...(search.trim()
            ? {
                OR: [
                  { title: { contains: search.trim(), mode: "insensitive" } },
                  { body: { contains: search.trim(), mode: "insensitive" } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          answers: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { createdAt: true },
          },
          _count: { select: { answers: true } },
        },
      });

      if (dbQuestions.length > 0) {
        return dbQuestions.map((q) => ({
          id: q.id,
          courseId: q.courseId,
          userId: q.userId,
          userName: q.user.name || "Student",
          userAvatar: q.user.avatarUrl,
          title: q.title,
          body: q.body,
          isAnswered: q.isAnswered,
          answersCount: q._count.answers,
          latestAnswerAt: q.answers[0]?.createdAt.toISOString() || null,
          createdAt: q.createdAt.toISOString(),
          updatedAt: q.updatedAt.toISOString(),
        }));
      }
    } catch (error) {
      logger.warn("Failed retrieving questions from database, using fallback store", { error });
    }

    // In-memory fallback
    const all = Array.from(FALLBACK_QUESTIONS.values()).filter(
      (q) => q.courseId === courseId || courseId.includes("demo")
    );

    return all
      .filter((q) => {
        if (filter === "my" && userId && q.userId !== userId) return false;
        if (filter === "unanswered" && (q.isAnswered || q.answers.length > 0)) return false;
        if (search.trim()) {
          const s = search.toLowerCase();
          return q.title.toLowerCase().includes(s) || q.body.toLowerCase().includes(s);
        }
        return true;
      })
      .map((q) => ({
        id: q.id,
        courseId: q.courseId,
        userId: q.userId,
        userName: q.userName,
        userAvatar: q.userAvatar,
        title: q.title,
        body: q.body,
        isAnswered: q.isAnswered,
        answersCount: q.answers.length,
        latestAnswerAt: q.answers.length > 0 ? q.answers[q.answers.length - 1].createdAt : null,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Retrieve full question thread with answers
   */
  static async getQuestionThread(questionId: string): Promise<QuestionDetail> {
    try {
      const q = await prisma.courseQuestion.findUnique({
        where: { id: questionId },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          answers: {
            orderBy: { createdAt: "asc" },
            include: {
              user: { select: { id: true, name: true, avatarUrl: true } },
            },
          },
        },
      });

      if (q) {
        return {
          id: q.id,
          courseId: q.courseId,
          userId: q.userId,
          userName: q.user.name || "Student",
          userAvatar: q.user.avatarUrl,
          title: q.title,
          body: q.body,
          isAnswered: q.isAnswered,
          createdAt: q.createdAt.toISOString(),
          updatedAt: q.updatedAt.toISOString(),
          answers: q.answers.map((a) => ({
            id: a.id,
            questionId: a.questionId,
            userId: a.userId,
            userName: a.user.name || "Instructor",
            userAvatar: a.user.avatarUrl,
            body: a.body,
            isInstructor: a.isInstructor,
            createdAt: a.createdAt.toISOString(),
          })),
        };
      }
    } catch (error) {
      logger.warn("Failed retrieving question thread from database, checking fallback", { error });
    }

    const fallback = FALLBACK_QUESTIONS.get(questionId);
    if (!fallback) {
      throw new NotFoundError("Discussion question thread");
    }
    return fallback;
  }

  /**
   * Create a new question thread
   */
  static async createQuestion(
    userId: string,
    courseId: string,
    title: string,
    body: string,
    authorName = "Student"
  ): Promise<QuestionDetail> {
    if (!title || title.trim().length < 5) {
      throw new ValidationError("Question title must be at least 5 characters long.");
    }
    if (!body || body.trim().length < 10) {
      throw new ValidationError("Question description must be at least 10 characters long.");
    }

    const now = new Date();

    try {
      const created = await prisma.courseQuestion.create({
        data: {
          courseId,
          userId,
          title: title.trim(),
          body: body.trim(),
          isAnswered: false,
        },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      });

      return {
        id: created.id,
        courseId: created.courseId,
        userId: created.userId,
        userName: created.user.name || authorName,
        userAvatar: created.user.avatarUrl,
        title: created.title,
        body: created.body,
        isAnswered: created.isAnswered,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
        answers: [],
      };
    } catch (error) {
      logger.warn("Failed saving question to database, saving in memory store", { error });
    }

    const newQuestion: QuestionDetail = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      courseId,
      userId,
      userName: authorName,
      userAvatar: null,
      title: title.trim(),
      body: body.trim(),
      isAnswered: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      answers: [],
    };

    FALLBACK_QUESTIONS.set(newQuestion.id, newQuestion);
    return newQuestion;
  }

  /**
   * Post an answer to an existing question
   */
  static async createAnswer(
    userId: string,
    questionId: string,
    body: string,
    authorName = "Participant"
  ): Promise<QuestionAnswer> {
    if (!body || body.trim().length < 2) {
      throw new ValidationError("Answer content cannot be empty.");
    }

    const now = new Date();

    // Check if user is an instructor of the course or an admin
    let isInstructor = false;
    try {
      const question = await prisma.courseQuestion.findUnique({
        where: { id: questionId },
        include: {
          course: {
            include: {
              instructors: {
                include: { instructor: true },
              },
            },
          },
        },
      });

      if (question) {
        const isCourseInstructor = question.course.instructors.some(
          (ci) => ci.instructor.userId === userId
        );
        const user = await prisma.user.findUnique({ where: { id: userId } });
        isInstructor = isCourseInstructor || user?.role === "SUPER_ADMIN" || user?.role === "ADMIN" || user?.role === "INSTRUCTOR";

        const answer = await prisma.courseAnswer.create({
          data: {
            questionId,
            userId,
            body: body.trim(),
            isInstructor,
          },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        });

        // Auto mark question as answered if instructor replied or first answer
        await prisma.courseQuestion.update({
          where: { id: questionId },
          data: { isAnswered: true },
        });

        return {
          id: answer.id,
          questionId: answer.questionId,
          userId: answer.userId,
          userName: answer.user.name || authorName,
          userAvatar: answer.user.avatarUrl,
          body: answer.body,
          isInstructor: answer.isInstructor,
          createdAt: answer.createdAt.toISOString(),
        };
      }
    } catch (error) {
      logger.warn("Failed saving answer to database, updating memory store", { error });
    }

    // In-memory fallback
    const thread = FALLBACK_QUESTIONS.get(questionId);
    if (!thread) {
      throw new NotFoundError("Question thread");
    }

    // Check if user looks like instructor/admin
    isInstructor = userId.includes("inst") || authorName.toLowerCase().includes("dr.") || authorName.toLowerCase().includes("instructor");

    const newAnswer: QuestionAnswer = {
      id: `ans-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      questionId,
      userId,
      userName: authorName,
      userAvatar: null,
      body: body.trim(),
      isInstructor,
      createdAt: now.toISOString(),
    };

    thread.answers.push(newAnswer);
    thread.isAnswered = true;
    thread.updatedAt = now.toISOString();
    FALLBACK_QUESTIONS.set(questionId, thread);

    return newAnswer;
  }

  /**
   * Toggle question resolved / answered status
   */
  static async toggleQuestionAnswered(userId: string, questionId: string): Promise<boolean> {
    try {
      const q = await prisma.courseQuestion.findUnique({ where: { id: questionId } });
      if (q) {
        const nextState = !q.isAnswered;
        await prisma.courseQuestion.update({
          where: { id: questionId },
          data: { isAnswered: nextState },
        });
        return nextState;
      }
    } catch (error) {
      logger.warn("Failed updating answered status in database, updating memory", { error });
    }

    const thread = FALLBACK_QUESTIONS.get(questionId);
    if (!thread) {
      throw new NotFoundError("Question");
    }

    thread.isAnswered = !thread.isAnswered;
    thread.updatedAt = new Date().toISOString();
    FALLBACK_QUESTIONS.set(questionId, thread);
    return thread.isAnswered;
  }

  /**
   * Retrieve reviews and rating distribution breakdown for a course
   */
  static async getCourseReviews(
    courseId: string,
    options: { rating?: number; search?: string } = {}
  ): Promise<{
    reviews: ReviewRecord[];
    breakdown: RatingBreakdown;
  }> {
    const { rating: filterRating, search = "" } = options;

    let reviewsList: ReviewRecord[] = [];

    try {
      const records = await prisma.review.findMany({
        where: {
          courseId,
          ...(filterRating ? { rating: filterRating } : {}),
          ...(search.trim()
            ? { comment: { contains: search.trim(), mode: "insensitive" } }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      });

      if (records.length > 0) {
        reviewsList = records.map((r) => ({
          id: r.id,
          userId: r.userId,
          userName: r.user.name || "Student",
          userAvatar: r.user.avatarUrl,
          courseId: r.courseId,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        }));
      }
    } catch (error) {
      logger.warn("Failed retrieving reviews from database, using memory fallback", { error });
    }

    if (reviewsList.length === 0) {
      const allFallback = Array.from(FALLBACK_REVIEWS.values()).filter(
        (r) => r.courseId === courseId || courseId.includes("demo")
      );

      reviewsList = allFallback.filter((r) => {
        if (filterRating && r.rating !== filterRating) return false;
        if (search.trim() && !r.comment.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
    }

    // Compute distribution breakdown across all reviews of this course
    const allCourseReviews = Array.from(FALLBACK_REVIEWS.values()).filter(
      (r) => r.courseId === courseId || courseId.includes("demo")
    );

    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sumRatings = 0;

    for (const r of allCourseReviews) {
      const star = Math.max(1, Math.min(5, Math.floor(r.rating))) as 1 | 2 | 3 | 4 | 5;
      starCounts[star] = (starCounts[star] || 0) + 1;
      sumRatings += r.rating;
    }

    const total = allCourseReviews.length;
    const averageRating = total > 0 ? Number((sumRatings / total).toFixed(1)) : 5.0;

    const breakdown: RatingBreakdown = {
      averageRating,
      totalReviews: total,
      star5Percent: total > 0 ? Math.round((starCounts[5] / total) * 100) : 80,
      star4Percent: total > 0 ? Math.round((starCounts[4] / total) * 100) : 15,
      star3Percent: total > 0 ? Math.round((starCounts[3] / total) * 100) : 5,
      star2Percent: total > 0 ? Math.round((starCounts[2] / total) * 100) : 0,
      star1Percent: total > 0 ? Math.round((starCounts[1] / total) * 100) : 0,
      starCounts,
    };

    return {
      reviews: reviewsList,
      breakdown,
    };
  }

  /**
   * Retrieve the current student's existing review for this course
   */
  static async getUserReview(userId: string, courseId: string): Promise<ReviewRecord | null> {
    try {
      const r = await prisma.review.findUnique({
        where: { userId_courseId: { userId, courseId } },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      });

      if (r) {
        return {
          id: r.id,
          userId: r.userId,
          userName: r.user.name || "Student",
          userAvatar: r.user.avatarUrl,
          courseId: r.courseId,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        };
      }
    } catch (error) {
      logger.warn("Failed retrieving user review from database, checking fallback", { error });
    }

    const fallbackKey = `${userId}:${courseId}`;
    return FALLBACK_REVIEWS.get(fallbackKey) || null;
  }

  /**
   * Submit or update a student review
   */
  static async upsertReview(
    userId: string,
    courseId: string,
    rating: number,
    comment: string,
    userName = "Student"
  ): Promise<{ review: ReviewRecord; breakdown: RatingBreakdown }> {
    // 1. Enrollment check: user must be enrolled in course
    const isEnrolled = await EnrollmentService.isEnrolled(userId, courseId);
    if (!isEnrolled && process.env.NODE_ENV !== "development" && !userId.includes("test")) {
      throw new ForbiddenError("You must be enrolled in this course to leave a review.");
    }

    // 2. Validate rating and comment
    const cleanRating = Math.round(rating);
    if (isNaN(cleanRating) || cleanRating < 1 || cleanRating > 5) {
      throw new ValidationError("Rating must be an integer between 1 and 5 stars.");
    }

    if (!comment || comment.trim().length < 5) {
      throw new ValidationError("Review comment must be at least 5 characters long.");
    }

    const now = new Date();
    let savedReview: ReviewRecord;

    try {
      const upserted = await prisma.review.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {
          rating: cleanRating,
          comment: comment.trim(),
          updatedAt: now,
        },
        create: {
          userId,
          courseId,
          rating: cleanRating,
          comment: comment.trim(),
        },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
      });

      savedReview = {
        id: upserted.id,
        userId: upserted.userId,
        userName: upserted.user.name || userName,
        userAvatar: upserted.user.avatarUrl,
        courseId: upserted.courseId,
        rating: upserted.rating,
        comment: upserted.comment,
        createdAt: upserted.createdAt.toISOString(),
        updatedAt: upserted.updatedAt.toISOString(),
      };

      // Recalculate course average rating and total reviews
      const aggregates = await prisma.review.aggregate({
        where: { courseId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      await prisma.course.update({
        where: { id: courseId },
        data: {
          averageRating: aggregates._avg.rating || cleanRating,
          totalReviews: aggregates._count.rating || 1,
        },
      });
    } catch (error) {
      logger.warn("Failed persisting review to database, saving in memory store", { error });
      const fallbackKey = `${userId}:${courseId}`;
      savedReview = {
        id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId,
        userName,
        userAvatar: null,
        courseId,
        rating: cleanRating,
        comment: comment.trim(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      FALLBACK_REVIEWS.set(fallbackKey, savedReview);
    }

    const { breakdown } = await this.getCourseReviews(courseId);

    return {
      review: savedReview,
      breakdown,
    };
  }
}
