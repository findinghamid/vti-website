import test, { describe } from "node:test";
import assert from "node:assert";
import { AssessmentService } from "../src/server/services/assessment.service";
import { LearningService } from "../src/server/services/learning.service";

describe("Milestone 10: Assessment & Quiz System", () => {
  const testUserId = `usr_test_${Date.now()}`;
  const quizLessonId = "les-4";

  test("should retrieve sanitized quiz without exposing correct answers to client", async () => {
    const clientQuiz = await AssessmentService.getQuizByLessonId(quizLessonId);

    assert.ok(clientQuiz, "Quiz should be returned");
    assert.strictEqual(clientQuiz.lessonId, quizLessonId);
    assert.strictEqual(clientQuiz.passScorePct, 70);
    assert.ok(clientQuiz.questions.length > 0, "Should have questions");

    // CRITICAL: Ensure `isCorrect` is stripped from every option
    for (const q of clientQuiz.questions) {
      assert.ok(q.prompt, "Question prompt must be present");
      assert.ok(q.options.length >= 2, "Question must have at least 2 options");
      for (const opt of q.options) {
        assert.ok(opt.id, "Option must have an id");
        assert.ok(opt.text, "Option must have text");
        assert.strictEqual(
          (opt as any).isCorrect,
          undefined,
          "isCorrect MUST NOT be exposed on client quiz payload"
        );
      }
    }
  });

  test("should accurately score a passing quiz attempt and mark lesson completed", async () => {
    // les-4 has 4 questions:
    // Q1: Server Components -> opt-4-1-b
    // Q2: Integer minor units -> opt-4-2-b
    // Q3: HttpOnly cookie -> opt-4-3-b
    // Q4: Multi-select -> opt-4-4-a, opt-4-4-b, opt-4-4-d
    const passingSubmissions = [
      { questionId: "q-4-1", selectedOptionId: "opt-4-1-b" },
      { questionId: "q-4-2", selectedOptionId: "opt-4-2-b" },
      { questionId: "q-4-3", selectedOptionId: "opt-4-3-b" },
      { questionId: "q-4-4", selectedOptionIds: ["opt-4-4-a", "opt-4-4-b", "opt-4-4-d"] },
    ];

    const result = await AssessmentService.submitQuizAttempt(testUserId, quizLessonId, passingSubmissions);

    assert.ok(result, "Attempt result should be returned");
    assert.strictEqual(result.scorePct, 100);
    assert.strictEqual(result.passed, true);
    assert.strictEqual(result.correctCount, 4);
    assert.strictEqual(result.totalQuestions, 4);
    assert.strictEqual(result.lessonCompleted, true);

    // Verify detailed question feedback
    assert.strictEqual(result.feedback.length, 4);
    for (const fb of result.feedback) {
      assert.strictEqual(fb.isCorrect, true);
      assert.ok(fb.explanation.length > 0, "Explanation should be provided");
    }
  });

  test("should fail attempt when score falls below passing threshold (70%)", async () => {
    // Submit only 1 correct answer out of 4 (25% score)
    const failingSubmissions = [
      { questionId: "q-4-1", selectedOptionId: "opt-4-1-b" }, // Correct
      { questionId: "q-4-2", selectedOptionId: "opt-4-2-a" }, // Incorrect
      { questionId: "q-4-3", selectedOptionId: "opt-4-3-a" }, // Incorrect
      { questionId: "q-4-4", selectedOptionIds: ["opt-4-4-c"] }, // Incorrect
    ];

    const result = await AssessmentService.submitQuizAttempt(testUserId, quizLessonId, failingSubmissions);

    assert.strictEqual(result.scorePct, 25);
    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.correctCount, 1);
    assert.strictEqual(result.lessonCompleted, false);

    const q1 = result.feedback.find((f) => f.questionId === "q-4-1");
    const q2 = result.feedback.find((f) => f.questionId === "q-4-2");
    assert.strictEqual(q1?.isCorrect, true);
    assert.strictEqual(q2?.isCorrect, false);
  });

  test("should require all correct options for multiple-choice questions", async () => {
    // For Q4, submitting only 2 of the 3 correct options should be marked incorrect
    const partialSubmissions = [
      { questionId: "q-4-1", selectedOptionId: "opt-4-1-b" },
      { questionId: "q-4-2", selectedOptionId: "opt-4-2-b" },
      { questionId: "q-4-3", selectedOptionId: "opt-4-3-b" },
      { questionId: "q-4-4", selectedOptionIds: ["opt-4-4-a", "opt-4-4-b"] }, // Missing opt-4-4-d
    ];

    const result = await AssessmentService.submitQuizAttempt(testUserId, quizLessonId, partialSubmissions);

    const q4Feedback = result.feedback.find((f) => f.questionId === "q-4-4");
    assert.strictEqual(q4Feedback?.isCorrect, false, "Partial answer should not score 100%");
    assert.strictEqual(result.correctCount, 3);
    assert.strictEqual(result.scorePct, 75);
    assert.strictEqual(result.passed, true); // 75% >= 70% threshold
  });

  test("should record and retrieve attempt history for active student", async () => {
    const attempts = await AssessmentService.getQuizAttempts(testUserId, quizLessonId);

    assert.ok(attempts.length >= 2, "Should record multiple attempts");
    assert.ok(attempts[0].createdAt, "Attempt must have timestamp");
    assert.ok(typeof attempts[0].scorePct === "number");
  });
});

describe("Milestone 10: Sandboxed Coding Exercises", () => {
  const testUserId = `usr_code_test_${Date.now()}`;
  const codingLessonId = "les-coding";

  test("should retrieve coding exercise definition and visible test cases", async () => {
    const exercise = await AssessmentService.getCodingExercise(codingLessonId);

    assert.ok(exercise);
    assert.strictEqual(exercise.lessonId, codingLessonId);
    assert.ok(exercise.title.includes("LRU Session Cache"));
    assert.ok(exercise.starterCode.includes("class SessionCache"));
    assert.ok(exercise.testCases.length >= 3);

    const visibleCases = exercise.testCases.filter((tc) => !tc.isHidden);
    assert.ok(visibleCases.length >= 2, "Must provide visible test cases");
  });

  test("should successfully execute a valid coding solution in sandbox", async () => {
    const validSolution = `
class SessionCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}
    `.trim();

    const result = await AssessmentService.executeCodingExercise(
      testUserId,
      codingLessonId,
      validSolution,
      "javascript"
    );

    assert.strictEqual(result.passed, true);
    assert.strictEqual(result.status, "PASSED");
    assert.strictEqual(result.passedTests, result.totalTests);
    assert.strictEqual(result.lessonCompleted, true);
    assert.ok(result.executionTimeMs >= 0);
  });

  test("should catch assertion failures and report expected vs actual", async () => {
    // Incomplete solution that always returns null
    const faultySolution = `
class SessionCache {
  constructor(capacity) {}
  get(key) { return null; }
  put(key, value) {}
}
    `.trim();

    const result = await AssessmentService.executeCodingExercise(
      testUserId,
      codingLessonId,
      faultySolution,
      "javascript"
    );

    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.status, "FAILED");
    assert.ok(result.passedTests < result.totalTests);
    assert.strictEqual(result.lessonCompleted, false);

    const failedCase = result.testResults.find((r) => !r.passed);
    assert.ok(failedCase, "Should contain failed test case");
    assert.ok(failedCase?.error, "Should report assertion error");
  });

  test("should prevent infinite loops with timeout protection", async () => {
    const infiniteLoopSolution = `
class SessionCache {
  constructor(capacity) {
    while (true) {} // Infinite loop!
  }
  get(key) { return -1; }
  put(key, value) {}
}
    `.trim();

    const result = await AssessmentService.executeCodingExercise(
      testUserId,
      codingLessonId,
      infiniteLoopSolution,
      "javascript"
    );

    assert.strictEqual(result.passed, false);
    assert.strictEqual(result.status, "TIMEOUT");
    assert.strictEqual(result.lessonCompleted, false);
  });

  test("should capture sandbox console logs", async () => {
    const loggingSolution = `
class SessionCache {
  constructor(capacity) {
    console.log("Initializing SessionCache with capacity:", capacity);
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    console.log("Accessing key:", key);
    if (!this.cache.has(key)) return -1;
    const v = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, v);
    return v;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}
    `.trim();

    const result = await AssessmentService.executeCodingExercise(
      testUserId,
      codingLessonId,
      loggingSolution,
      "javascript"
    );

    assert.strictEqual(result.passed, true);
    assert.ok(result.logs.length > 0, "Console logs should be captured");
    assert.ok(
      result.logs.some((l) => l.includes("Initializing SessionCache")),
      "Captured log should match code output"
    );
  });
});
