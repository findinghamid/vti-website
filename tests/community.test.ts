import test, { describe } from "node:test";
import assert from "node:assert";
import { CommunityService } from "../src/server/services/community.service";

describe("Milestone 11: Course Q&A & Discussion Forums", () => {
  const courseId = "course-demo-fallback";
  const studentUserId = `usr_test_student_${Date.now()}`;
  const instructorUserId = `inst_test_instructor_${Date.now()}`;
  let createdQuestionId: string;

  test("should reject question with invalid or short title and body", async () => {
    await assert.rejects(
      async () => {
        await CommunityService.createQuestion(studentUserId, courseId, "Hi", "Short");
      },
      {
        name: "ValidationError",
      }
    );
  });

  test("should create a valid course question thread", async () => {
    const question = await CommunityService.createQuestion(
      studentUserId,
      courseId,
      "How does database connection pooling interact with Turbopack fast refresh?",
      "During hot reloading in development mode, are PostgreSQL database connections closed and re-opened or kept in a shared process pool?",
      "Alex Morgan"
    );

    assert.ok(question.id);
    assert.strictEqual(question.courseId, courseId);
    assert.strictEqual(question.userId, studentUserId);
    assert.strictEqual(question.isAnswered, false);
    assert.strictEqual(question.answers.length, 0);

    createdQuestionId = question.id;
  });

  test("should retrieve question thread by ID", async () => {
    assert.ok(createdQuestionId, "Question ID must be set");
    const thread = await CommunityService.getQuestionThread(createdQuestionId);

    assert.strictEqual(thread.id, createdQuestionId);
    assert.ok(thread.title.includes("connection pooling"));
    assert.strictEqual(Array.isArray(thread.answers), true);
  });

  test("should post an answer and automatically mark question as answered", async () => {
    const answer = await CommunityService.createAnswer(
      instructorUserId,
      createdQuestionId,
      "Turbopack and Next.js keep a global singleton on globalThis.prisma so connections are reused across fast-refresh cycles without exhausting sockets.",
      "Dr. Farooq Khan"
    );

    assert.ok(answer.id);
    assert.strictEqual(answer.questionId, createdQuestionId);
    assert.strictEqual(answer.isInstructor, true); // Instructor identified by name/inst ID

    // Check that question is now marked answered
    const updatedThread = await CommunityService.getQuestionThread(createdQuestionId);
    assert.strictEqual(updatedThread.isAnswered, true);
    assert.strictEqual(updatedThread.answers.length, 1);
  });

  test("should filter questions by keyword search and unanswered status", async () => {
    const searchResults = await CommunityService.getCourseQuestions(courseId, {
      search: "Turbopack",
    });
    assert.ok(searchResults.length > 0);
    assert.ok(searchResults.some((q) => q.id === createdQuestionId));

    const unansweredList = await CommunityService.getCourseQuestions(courseId, {
      filter: "unanswered",
    });
    // Our question is answered, so it shouldn't be in unansweredList
    assert.strictEqual(unansweredList.some((q) => q.id === createdQuestionId), false);
  });

  test("should toggle question resolved status", async () => {
    const nextState = await CommunityService.toggleQuestionAnswered(
      studentUserId,
      createdQuestionId
    );
    assert.strictEqual(nextState, false); // Toggled from true to false

    const toggledAgain = await CommunityService.toggleQuestionAnswered(
      studentUserId,
      createdQuestionId
    );
    assert.strictEqual(toggledAgain, true); // Toggled back to true
  });
});

describe("Milestone 11: Student Reviews & Rating Calculations", () => {
  const courseId = "course-demo-fallback";
  const student1 = `usr_reviewer_1_${Date.now()}`;
  const student2 = `usr_reviewer_2_${Date.now()}`;

  test("should reject review with invalid star rating", async () => {
    await assert.rejects(
      async () => {
        await CommunityService.upsertReview(student1, courseId, 6, "Great course!", "Alice");
      },
      {
        name: "ValidationError",
      }
    );
  });

  test("should reject review with short comment", async () => {
    await assert.rejects(
      async () => {
        await CommunityService.upsertReview(student1, courseId, 5, "Ok", "Alice");
      },
      {
        name: "ValidationError",
      }
    );
  });

  test("should submit a 5-star review and calculate rating breakdown", async () => {
    const result = await CommunityService.upsertReview(
      student1,
      courseId,
      5,
      "Superb architectural insights into Next.js 16 and Prisma ORM.",
      "Alice Developer"
    );

    assert.ok(result.review.id);
    assert.strictEqual(result.review.rating, 5);
    assert.strictEqual(result.review.userId, student1);

    assert.ok(result.breakdown);
    assert.ok(result.breakdown.totalReviews > 0);
    assert.ok(result.breakdown.averageRating >= 4.0);
    assert.ok(result.breakdown.star5Percent > 0);
  });

  test("should update existing review idempotently without creating duplicate", async () => {
    const initialReviews = await CommunityService.getCourseReviews(courseId);
    const initialCount = initialReviews.breakdown.totalReviews;

    // Student 1 updates their review from 5 stars to 4 stars
    const updatedResult = await CommunityService.upsertReview(
      student1,
      courseId,
      4,
      "Updated review: Still great, but Section 3 could have more exercises.",
      "Alice Developer"
    );

    assert.strictEqual(updatedResult.review.rating, 4);

    const postReviews = await CommunityService.getCourseReviews(courseId);
    assert.strictEqual(
      postReviews.breakdown.totalReviews,
      initialCount,
      "Total reviews count must not duplicate on review update"
    );
  });

  test("should retrieve student personal review", async () => {
    const userReview = await CommunityService.getUserReview(student1, courseId);

    assert.ok(userReview);
    assert.strictEqual(userReview.userId, student1);
    assert.strictEqual(userReview.rating, 4);
  });
});
