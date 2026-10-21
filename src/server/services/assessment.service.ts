import { prisma } from "@/lib/prisma";
import { logger } from "@/server/api/logger";
import { NotFoundError, ValidationError } from "@/server/api/errors";
import { LearningService } from "./learning.service";
import vm from "node:vm";

export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE";

export interface ClientQuizOption {
  id: string;
  text: string;
}

export interface ClientQuizQuestion {
  id: string;
  quizId: string;
  prompt: string;
  sortOrder: number;
  type: QuestionType;
  options: ClientQuizOption[];
}

export interface ClientQuiz {
  id: string;
  lessonId: string;
  passScorePct: number;
  questionsCount: number;
  questions: ClientQuizQuestion[];
}

export interface FullQuizOption extends ClientQuizOption {
  isCorrect: boolean;
}

export interface FullQuizQuestion extends Omit<ClientQuizQuestion, "options"> {
  options: FullQuizOption[];
  explanation: string;
}

export interface FullQuiz {
  id: string;
  lessonId: string;
  passScorePct: number;
  questions: FullQuizQuestion[];
}

export interface QuizAnswerSubmission {
  questionId: string;
  selectedOptionId?: string;
  selectedOptionIds?: string[];
}

export interface QuestionFeedback {
  questionId: string;
  prompt: string;
  type: QuestionType;
  isCorrect: boolean;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  explanation: string;
}

export interface QuizAttemptResult {
  id: string;
  quizId: string;
  lessonId: string;
  userId: string;
  scorePct: number;
  passed: boolean;
  passScorePct: number;
  totalQuestions: number;
  correctCount: number;
  createdAt: string;
  lessonCompleted: boolean;
  feedback: QuestionFeedback[];
}

export interface CodingTestCase {
  id: string;
  description: string;
  inputCode: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface CodingExerciseDefinition {
  id: string;
  lessonId: string;
  title: string;
  instructions: string;
  starterCode: string;
  solutionCode?: string;
  language: string;
  testCases: CodingTestCase[];
}

export interface CodingTestResult {
  id: string;
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
  isHidden: boolean;
}

export interface CodingExecutionResult {
  passed: boolean;
  status: "PASSED" | "FAILED" | "RUNTIME_ERROR" | "TIMEOUT";
  executionTimeMs: number;
  passedTests: number;
  totalTests: number;
  testResults: CodingTestResult[];
  logs: string[];
  error?: string;
  lessonCompleted: boolean;
}

// Fallback in-memory attempt store for offline and test environments
const FALLBACK_ATTEMPTS: Map<string, QuizAttemptResult[]> = new Map();

// Built-in quizzes catalog mapped to lessons
const BUILTIN_QUIZZES: Record<string, FullQuiz> = {
  "les-4": {
    id: "quiz-les-4",
    lessonId: "les-4",
    passScorePct: 70,
    questions: [
      {
        id: "q-4-1",
        quizId: "quiz-les-4",
        prompt: "Which component model is rendered exclusively on the server by default in the Next.js 16 App Router?",
        sortOrder: 1,
        type: "SINGLE_CHOICE",
        options: [
          { id: "opt-4-1-a", text: "Client Components (with 'use client' directive)", isCorrect: false },
          { id: "opt-4-1-b", text: "React Server Components (RSC)", isCorrect: true },
          { id: "opt-4-1-c", text: "Legacy getServerSideProps functions", isCorrect: false },
          { id: "opt-4-1-d", text: "getStaticPaths prerender builders", isCorrect: false },
        ],
        explanation: "In Next.js 16 App Router, all files in the app directory are React Server Components by default unless marked with the 'use client' boundary directive.",
      },
      {
        id: "q-4-2",
        quizId: "quiz-les-4",
        prompt: "What is the primary architectural benefit of storing monetary amounts in integer minor units (e.g., cents) in the database?",
        sortOrder: 2,
        type: "SINGLE_CHOICE",
        options: [
          { id: "opt-4-2-a", text: "Reduces database disk footprint by 75%", isCorrect: false },
          { id: "opt-4-2-b", text: "Completely eliminates floating-point rounding errors in commercial transactions", isCorrect: true },
          { id: "opt-4-2-c", text: "Enables automatic multi-currency real-time forex conversions", isCorrect: false },
          { id: "opt-4-2-d", text: "Required by PostgreSQL primary key constraints", isCorrect: false },
        ],
        explanation: "Standard IEEE 754 floating-point numbers lead to precision calculation bugs (e.g. 0.1 + 0.2 = 0.30000000000000004). Integer minor units (e.g., 4999 cents for $49.99) guarantee absolute financial precision.",
      },
      {
        id: "q-4-3",
        quizId: "quiz-les-4",
        prompt: "Which HTTP cookie flag prevents malicious JavaScript scripts from accessing session tokens?",
        sortOrder: 3,
        type: "SINGLE_CHOICE",
        options: [
          { id: "opt-4-3-a", text: "Secure", isCorrect: false },
          { id: "opt-4-3-b", text: "HttpOnly", isCorrect: true },
          { id: "opt-4-3-c", text: "SameSite=Lax", isCorrect: false },
          { id: "opt-4-3-d", text: "Path=/", isCorrect: false },
        ],
        explanation: "The 'HttpOnly' flag instructs the client browser that the cookie cannot be accessed via `document.cookie`, mitigating token theft via Cross-Site Scripting (XSS).",
      },
      {
        id: "q-4-4",
        quizId: "quiz-les-4",
        prompt: "Select all characteristics of a production-grade idempotent payment fulfillment engine (Select all that apply):",
        sortOrder: 4,
        type: "MULTIPLE_CHOICE",
        options: [
          { id: "opt-4-4-a", text: "Generates or accepts a unique idempotency key per transaction", isCorrect: true },
          { id: "opt-4-4-b", text: "Verifies current order status before processing to prevent duplicate fulfillment", isCorrect: true },
          { id: "opt-4-4-c", text: "Stores plain credit card CVV codes in local storage for faster retries", isCorrect: false },
          { id: "opt-4-4-d", text: "Executes an atomic database transaction to provision course enrollments", isCorrect: true },
        ],
        explanation: "Production idempotency requires unique keys, state verification before fulfillment, and atomic transactions. Raw credit card data must NEVER be stored in local storage.",
      },
    ],
  },
  "les-15": {
    id: "quiz-les-15",
    lessonId: "les-15",
    passScorePct: 70,
    questions: [
      {
        id: "q-15-1",
        quizId: "quiz-les-15",
        prompt: "Why is database connection pooling essential in serverless Next.js production deployments?",
        sortOrder: 1,
        type: "SINGLE_CHOICE",
        options: [
          { id: "opt-15-1-a", text: "To prevent exhausting maximum PostgreSQL connection limits during high concurrency", isCorrect: true },
          { id: "opt-15-1-b", text: "To compress SQL payloads sent over the wire", isCorrect: false },
          { id: "opt-15-1-c", text: "To bypass foreign key validations in Prisma", isCorrect: false },
          { id: "opt-15-1-d", text: "To replace Redis caching entirely", isCorrect: false },
        ],
        explanation: "Each serverless function instance opens a new database connection. Connection poolers like PgBouncer manage and reuse a controlled number of actual connections to PostgreSQL.",
      },
      {
        id: "q-15-2",
        quizId: "quiz-les-15",
        prompt: "True or False: In Prisma ORM, upsert operations require both 'create' and 'update' clauses to handle concurrent records idempotently.",
        sortOrder: 2,
        type: "TRUE_FALSE",
        options: [
          { id: "opt-15-2-true", text: "True", isCorrect: true },
          { id: "opt-15-2-false", text: "False", isCorrect: false },
        ],
        explanation: "Prisma's upsert API requires { where, create, update }, ensuring that if a record exists it is safely updated; otherwise it is created without duplicate key collisions.",
      },
      {
        id: "q-15-3",
        quizId: "quiz-les-15",
        prompt: "When the primary database is momentarily offline, what strategy ensures high availability for the course player?",
        sortOrder: 3,
        type: "SINGLE_CHOICE",
        options: [
          { id: "opt-15-3-a", text: "Crashing the Node process with exit code 1", isCorrect: false },
          { id: "opt-15-3-b", text: "Graceful fallback to cached mock catalog and in-memory progress synchronization", isCorrect: true },
          { id: "opt-15-3-c", text: "Displaying an unhandled 500 error page to students", isCorrect: false },
          { id: "opt-15-3-d", text: "Deleting all active user sessions", isCorrect: false },
        ],
        explanation: "Resilient systems degrade gracefully: if the database is offline, in-memory caches allow students to continue reviewing curriculum without disruptions.",
      },
    ],
  },
};

// Built-in coding exercises
const BUILTIN_CODING_EXERCISES: Record<string, CodingExerciseDefinition> = {
  "les-coding": {
    id: "code-les-lru",
    lessonId: "les-coding",
    title: "Implement a High-Performance LRU Session Cache",
    language: "javascript",
    instructions: `
### Exercise: Implement an LRU (Least Recently Used) Cache

In high-concurrency authentication systems, frequently checking database session tokens introduces database latency. Implement an in-memory **LRU Session Cache** in JavaScript.

#### Requirements:
1. \`constructor(capacity)\`: Initialize cache with a positive integer capacity.
2. \`get(key)\`: Return the session value if key exists, otherwise return \`-1\`. Accessing a key must mark it as **most recently used**.
3. \`put(key, value)\`: Update or insert the key-value pair. If number of keys exceeds capacity, **evict the least recently used key**.
4. Both \`get\` and \`put\` should operate in **O(1)** time complexity.

*Hint: JavaScript's built-in \`Map\` preserves insertion order. You can delete and re-insert a key to move it to the end.*
    `.trim(),
    starterCode: `class SessionCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    // Mark as recently used
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first element in Map)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}
`,
    testCases: [
      {
        id: "tc-1",
        description: "Store and retrieve session values accurately",
        inputCode: `
const cache = new SessionCache(2);
cache.put("sess_usr_1", "tok_alpha");
cache.put("sess_usr_2", "tok_beta");
assert.strictEqual(cache.get("sess_usr_1"), "tok_alpha");
assert.strictEqual(cache.get("sess_usr_2"), "tok_beta");
        `,
        expectedOutput: "Values stored and retrieved correctly",
        isHidden: false,
      },
      {
        id: "tc-2",
        description: "Return -1 for non-existent session keys",
        inputCode: `
const cache = new SessionCache(2);
assert.strictEqual(cache.get("unknown_key"), -1);
        `,
        expectedOutput: "-1 returned for missing key",
        isHidden: false,
      },
      {
        id: "tc-3",
        description: "Evict the least recently used key when capacity is reached",
        inputCode: `
const cache = new SessionCache(2);
cache.put("k1", 100);
cache.put("k2", 200);
cache.put("k3", 300); // Should evict k1
assert.strictEqual(cache.get("k1"), -1, "k1 should have been evicted");
assert.strictEqual(cache.get("k2"), 200);
assert.strictEqual(cache.get("k3"), 300);
        `,
        expectedOutput: "k1 evicted after capacity exceeded",
        isHidden: true,
      },
      {
        id: "tc-4",
        description: "Accessing a key via get() marks it as recently used and prevents its eviction",
        inputCode: `
const cache = new SessionCache(2);
cache.put("k1", 100);
cache.put("k2", 200);
cache.get("k1"); // Marks k1 as recently used
cache.put("k3", 300); // Should evict k2, NOT k1!
assert.strictEqual(cache.get("k2"), -1, "k2 should have been evicted");
assert.strictEqual(cache.get("k1"), 100, "k1 should have been retained");
        `,
        expectedOutput: "k1 preserved and k2 evicted",
        isHidden: true,
      },
    ],
  },
};

export class AssessmentService {
  /**
   * Sanitizes a quiz for client consumption (strips out `isCorrect` and explanations)
   */
  static sanitizeQuiz(quiz: FullQuiz): ClientQuiz {
    return {
      id: quiz.id,
      lessonId: quiz.lessonId,
      passScorePct: quiz.passScorePct,
      questionsCount: quiz.questions.length,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        quizId: q.quizId,
        prompt: q.prompt,
        sortOrder: q.sortOrder,
        type: q.type,
        options: q.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
        })),
      })),
    };
  }

  /**
   * Helper to generate a default dynamic quiz for any lesson without built-in quiz
   */
  private static generateDefaultQuiz(lessonId: string): FullQuiz {
    return {
      id: `quiz-${lessonId}`,
      lessonId,
      passScorePct: 70,
      questions: [
        {
          id: `q-${lessonId}-1`,
          quizId: `quiz-${lessonId}`,
          prompt: "What is the primary objective of this module's architecture implementation?",
          sortOrder: 1,
          type: "SINGLE_CHOICE",
          options: [
            { id: "opt-1-a", text: "Deliver enterprise reliability, type safety, and scalability", isCorrect: true },
            { id: "opt-1-b", text: "Minimize unit test coverage to accelerate development", isCorrect: false },
            { id: "opt-1-c", text: "Rely exclusively on unvalidated client-side state", isCorrect: false },
            { id: "opt-1-d", text: "Remove authentication route guards", isCorrect: false },
          ],
          explanation: "Enterprise systems prioritize type safety, resilience, and maintainability across all layers.",
        },
        {
          id: `q-${lessonId}-2`,
          quizId: `quiz-${lessonId}`,
          prompt: "True or False: Server-authoritative validation is required even when client forms have client-side validation.",
          sortOrder: 2,
          type: "TRUE_FALSE",
          options: [
            { id: "opt-2-true", text: "True", isCorrect: true },
            { id: "opt-2-false", text: "False", isCorrect: false },
          ],
          explanation: "Client validation improves UX, but server validation is strictly required for data integrity and security.",
        },
        {
          id: `q-${lessonId}-3`,
          quizId: `quiz-${lessonId}`,
          prompt: "Which practices ensure optimal database performance in production web apps? (Select all that apply):",
          sortOrder: 3,
          type: "MULTIPLE_CHOICE",
          options: [
            { id: "opt-3-a", text: "Adding indexes on frequently queried columns and foreign keys", isCorrect: true },
            { id: "opt-3-b", text: "Selecting only required fields using projection rather than select *", isCorrect: true },
            { id: "opt-3-c", text: "Executing raw unparameterized SQL strings directly from request queries", isCorrect: false },
            { id: "opt-3-d", text: "Using connection pooling to manage database socket lifecycles", isCorrect: true },
          ],
          explanation: "Indexes, field projection, and connection pooling are fundamental for database performance.",
        },
      ],
    };
  }

  /**
   * Retrieve quiz for a lesson (client-safe without correct answers)
   */
  static async getQuizByLessonId(lessonId: string): Promise<ClientQuiz> {
    const fullQuiz = await this.getFullQuiz(lessonId);
    return this.sanitizeQuiz(fullQuiz);
  }

  /**
   * Retrieve full quiz including answers for scoring
   */
  static async getFullQuiz(lessonId: string): Promise<FullQuiz> {
    // 1. Check database
    try {
      const dbQuiz = await prisma.quiz.findUnique({
        where: { lessonId },
        include: {
          questions: {
            orderBy: { sortOrder: "asc" },
            include: { options: true },
          },
        },
      });

      if (dbQuiz && dbQuiz.questions.length > 0) {
        return {
          id: dbQuiz.id,
          lessonId: dbQuiz.lessonId,
          passScorePct: dbQuiz.passScorePct,
          questions: dbQuiz.questions.map((q) => {
            const isMulti = q.options.filter((o) => o.isCorrect).length > 1;
            const isTF = q.options.length === 2 && q.options.some((o) => o.text.toLowerCase() === "true");
            const qType: QuestionType = isTF ? "TRUE_FALSE" : isMulti ? "MULTIPLE_CHOICE" : "SINGLE_CHOICE";

            return {
              id: q.id,
              quizId: q.quizId,
              prompt: q.prompt,
              sortOrder: q.sortOrder,
              type: qType,
              explanation: "Review the lecture material for a complete walkthrough of this concept.",
              options: q.options.map((opt) => ({
                id: opt.id,
                text: opt.text,
                isCorrect: opt.isCorrect,
              })),
            };
          }),
        };
      }
    } catch (error) {
      logger.warn("Failed retrieving quiz from database, falling back to catalog", { error, metadata: { lessonId } });
    }

    // 2. Check built-in quizzes catalog
    if (BUILTIN_QUIZZES[lessonId]) {
      return BUILTIN_QUIZZES[lessonId];
    }

    // 3. Generate dynamic fallback quiz
    return this.generateDefaultQuiz(lessonId);
  }

  /**
   * Submit quiz attempt, score answers, record result, and mark lesson complete if passed
   */
  static async submitQuizAttempt(
    userId: string,
    lessonId: string,
    submissions: QuizAnswerSubmission[]
  ): Promise<QuizAttemptResult> {
    const fullQuiz = await this.getFullQuiz(lessonId);
    const submissionMap = new Map<string, string[]>();

    for (const sub of submissions) {
      const selected = sub.selectedOptionIds || (sub.selectedOptionId ? [sub.selectedOptionId] : []);
      submissionMap.set(sub.questionId, selected);
    }

    let correctCount = 0;
    const feedback: QuestionFeedback[] = [];

    for (const q of fullQuiz.questions) {
      const studentAnswers = submissionMap.get(q.id) || [];
      const correctOptionIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);

      // Check if student answers exactly match correct answers
      const isCorrect =
        correctOptionIds.length === studentAnswers.length &&
        correctOptionIds.every((id) => studentAnswers.includes(id));

      if (isCorrect) {
        correctCount += 1;
      }

      feedback.push({
        questionId: q.id,
        prompt: q.prompt,
        type: q.type,
        isCorrect,
        selectedOptionIds: studentAnswers,
        correctOptionIds,
        explanation: q.explanation,
      });
    }

    const totalQuestions = fullQuiz.questions.length;
    const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePct >= fullQuiz.passScorePct;
    const now = new Date();

    const attemptResult: QuizAttemptResult = {
      id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      quizId: fullQuiz.id,
      lessonId,
      userId,
      scorePct,
      passed,
      passScorePct: fullQuiz.passScorePct,
      totalQuestions,
      correctCount,
      createdAt: now.toISOString(),
      lessonCompleted: passed,
      feedback,
    };

    // 1. Record attempt in DB if available
    try {
      await prisma.quizAttempt.create({
        data: {
          quizId: fullQuiz.id,
          userId,
          scorePct,
          passed,
          answers: {
            create: submissions.flatMap((s) => {
              const ids = s.selectedOptionIds || (s.selectedOptionId ? [s.selectedOptionId] : []);
              return ids.map((optId) => ({
                questionId: s.questionId,
                selectedOptionId: optId,
              }));
            }),
          },
        },
      });
    } catch (error) {
      logger.warn("Failed recording quiz attempt to database, saving in memory", { error });
    }

    // 2. Save in fallback memory store
    const key = `${userId}:${lessonId}`;
    const userAttempts = FALLBACK_ATTEMPTS.get(key) || [];
    userAttempts.unshift(attemptResult);
    FALLBACK_ATTEMPTS.set(key, userAttempts);

    // 3. If passed, automatically mark lesson completed in LearningService
    if (passed) {
      try {
        await LearningService.updateLessonProgress(userId, lessonId, 0, true);
        attemptResult.lessonCompleted = true;
      } catch (err) {
        logger.warn("Failed updating lesson progress after passing quiz", { error: err });
      }
    }

    return attemptResult;
  }

  /**
   * Retrieve past quiz attempts for a student
   */
  static async getQuizAttempts(userId: string, lessonId: string): Promise<QuizAttemptResult[]> {
    const key = `${userId}:${lessonId}`;

    try {
      const records = await prisma.quizAttempt.findMany({
        where: {
          quiz: { lessonId },
          userId,
        },
        orderBy: { createdAt: "desc" },
      });

      if (records.length > 0) {
        const fullQuiz = await this.getFullQuiz(lessonId);
        return records.map((r) => ({
          id: r.id,
          quizId: r.quizId,
          lessonId,
          userId: r.userId,
          scorePct: r.scorePct,
          passed: r.passed,
          passScorePct: fullQuiz.passScorePct,
          totalQuestions: fullQuiz.questions.length,
          correctCount: Math.round((r.scorePct / 100) * fullQuiz.questions.length),
          createdAt: r.createdAt.toISOString(),
          lessonCompleted: r.passed,
          feedback: [],
        }));
      }
    } catch (error) {
      logger.warn("Failed retrieving quiz attempts from database, using memory store", { error });
    }

    return FALLBACK_ATTEMPTS.get(key) || [];
  }

  /**
   * Get coding exercise definition for a lesson
   */
  static async getCodingExercise(lessonId: string): Promise<CodingExerciseDefinition> {
    if (BUILTIN_CODING_EXERCISES[lessonId]) {
      return BUILTIN_CODING_EXERCISES[lessonId];
    }

    // Default coding exercise if not specifically configured
    return {
      id: `code-${lessonId}`,
      lessonId,
      title: "Interactive Coding Challenge: Array Deduplication and Frequency",
      language: "javascript",
      instructions: `
### Exercise: High-Throughput Tag Deduplication

In modern marketplaces, courses have numerous search tags and categories. Build a utility function to deduplicate tags and sort them by frequency of appearance.

#### Requirements:
1. Implement \`getTopTags(tags, limit)\`.
2. Given an array of lowercase strings \`tags\` and integer \`limit\`, return the top \`limit\` unique tags sorted in descending order of frequency.
3. If two tags have the same frequency, sort them alphabetically.
      `.trim(),
      starterCode: `function getTopTags(tags, limit) {
  // TODO: Count occurrences, sort by frequency (desc) then name (asc), and return top 'limit'
  const counts = new Map();
  for (const tag of tags) {
    counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  
  return Array.from(counts.keys())
    .sort((a, b) => {
      const diff = counts.get(b) - counts.get(a);
      if (diff !== 0) return diff;
      return a.localeCompare(b);
    })
    .slice(0, limit);
}
`,
      testCases: [
        {
          id: "tc-tag-1",
          description: "Deduplicate tags and sort by frequency",
          inputCode: `
const tags = ["react", "nextjs", "react", "typescript", "react", "nextjs"];
const result = getTopTags(tags, 2);
assert.deepStrictEqual(result, ["react", "nextjs"]);
          `,
          expectedOutput: "['react', 'nextjs']",
          isHidden: false,
        },
        {
          id: "tc-tag-2",
          description: "Alphabetical tie-breaking when frequency is identical",
          inputCode: `
const tags = ["docker", "aws", "docker", "aws"];
const result = getTopTags(tags, 2);
assert.deepStrictEqual(result, ["aws", "docker"]);
          `,
          expectedOutput: "['aws', 'docker']",
          isHidden: false,
        },
        {
          id: "tc-tag-3",
          description: "Handle empty array input gracefully",
          inputCode: `
const result = getTopTags([], 5);
assert.deepStrictEqual(result, []);
          `,
          expectedOutput: "[]",
          isHidden: true,
        },
      ],
    };
  }

  /**
   * Execute code in an isolated Node.js vm sandbox against test assertions
   */
  static async executeCodingExercise(
    userId: string,
    lessonId: string,
    userCode: string,
    language = "javascript"
  ): Promise<CodingExecutionResult> {
    const exercise = await this.getCodingExercise(lessonId);
    const logs: string[] = [];
    const testResults: CodingTestResult[] = [];
    const startTime = Date.now();

    // Prepare sandbox
    const sandboxConsole = {
      log: (...args: any[]) => {
        logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      },
      error: (...args: any[]) => {
        logs.push("[ERROR] " + args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      },
      warn: (...args: any[]) => {
        logs.push("[WARN] " + args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
      },
    };

    // Assertion helpers inside sandbox
    const sandboxAssert = {
      strictEqual: (actual: any, expected: any, msg?: string) => {
        if (actual !== expected) {
          throw new Error(msg || `Expected ${JSON.stringify(expected)} but received ${JSON.stringify(actual)}`);
        }
      },
      deepStrictEqual: (actual: any, expected: any, msg?: string) => {
        const aStr = JSON.stringify(actual);
        const eStr = JSON.stringify(expected);
        if (aStr !== eStr) {
          throw new Error(msg || `Expected ${eStr} but received ${aStr}`);
        }
      },
    };

    // First, validate syntax of user code
    try {
      new vm.Script(userCode, { filename: "student_solution.js" });
    } catch (syntaxErr: any) {
      return {
        passed: false,
        status: "RUNTIME_ERROR",
        executionTimeMs: Date.now() - startTime,
        passedTests: 0,
        totalTests: exercise.testCases.length,
        testResults: exercise.testCases.map((tc) => ({
          id: tc.id,
          description: tc.description,
          passed: false,
          expected: tc.expectedOutput,
          actual: syntaxErr.message,
          error: syntaxErr.message,
          isHidden: tc.isHidden,
        })),
        logs,
        error: syntaxErr.message || "Syntax error in solution",
        lessonCompleted: false,
      };
    }

    let hasTimeout = false;

    // Run each test case in an isolated execution sandbox
    for (const tc of exercise.testCases) {
      try {
        const combinedCode = `\n${userCode}\n;\n${tc.inputCode}\n`;
        const testScript = new vm.Script(combinedCode, { filename: `test_${tc.id}.js` });
        const context = vm.createContext({
          console: sandboxConsole,
          assert: sandboxAssert,
          Map,
          Set,
          Array,
          Object,
          Math,
          String,
          Number,
          Boolean,
          JSON,
          RegExp,
          Date,
          parseInt,
          parseFloat,
        });

        testScript.runInContext(context, { timeout: 1000 });

        testResults.push({
          id: tc.id,
          description: tc.description,
          passed: true,
          expected: tc.expectedOutput,
          actual: tc.expectedOutput,
          isHidden: tc.isHidden,
        });
      } catch (tcErr: any) {
        const isTimeout =
          tcErr.code === "ERR_SCRIPT_EXECUTION_TIMEOUT" ||
          tcErr.message?.toLowerCase().includes("timed out");

        if (isTimeout) {
          hasTimeout = true;
        }

        testResults.push({
          id: tc.id,
          description: tc.description,
          passed: false,
          expected: tc.expectedOutput,
          actual: isTimeout ? "Execution timed out (infinite loop detected)" : tcErr.message || "Assertion failed",
          error: tcErr.message,
          isHidden: tc.isHidden,
        });
      }
    }

    const passedCount = testResults.filter((r) => r.passed).length;
    const allPassed = passedCount === exercise.testCases.length;
    const executionTimeMs = Date.now() - startTime;

    // If all tests passed, automatically mark the lesson as completed
    if (allPassed) {
      try {
        await LearningService.updateLessonProgress(userId, lessonId, 0, true);
      } catch (err) {
        logger.warn("Failed updating lesson progress after passing coding exercise", { error: err });
      }
    }

    return {
      passed: allPassed,
      status: allPassed ? "PASSED" : hasTimeout ? "TIMEOUT" : "FAILED",
      executionTimeMs,
      passedTests: passedCount,
      totalTests: exercise.testCases.length,
      testResults,
      logs,
      lessonCompleted: allPassed,
    };
  }
}
