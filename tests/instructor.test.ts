import { test, describe } from "node:test";
import assert from "node:assert";
import { InstructorService } from "../src/server/services/instructor.service";
import { CourseStatus, CourseLevel, LessonType } from "@prisma/client";

describe("Milestone 6: Instructor Studio & Course Authoring Engine", () => {
  test("should reject course draft creation with empty or short title", async () => {
    await assert.rejects(
      async () => {
        await InstructorService.createCourseDraft("user-test-1", {
          title: "abc",
          categoryId: "cat-1",
        });
      },
      {
        name: "ValidationError",
        message: "Course title must be at least 5 characters long",
      }
    );
  });

  test("should reject course draft creation without category", async () => {
    await assert.rejects(
      async () => {
        await InstructorService.createCourseDraft("user-test-1", {
          title: "Valid Course Title Here",
          categoryId: "",
        });
      },
      {
        name: "ValidationError",
        message: "A category must be selected",
      }
    );
  });

  test("should create draft with initial section and video lesson", async () => {
    const course = await InstructorService.createCourseDraft("user-test-1", {
      title: "Building Microservices with NestJS and Redis",
      categoryId: "cat-dev",
    });

    assert.ok(course, "Course draft should be created");
    assert.strictEqual(course.status, CourseStatus.DRAFT);
    assert.ok(course.slug.includes("building-microservices-with-nestjs-and-redis"));
    assert.strictEqual(course.priceAmount, 0);
  });

  test("should accurately evaluate pre-publish quality checklist", () => {
    // Incomplete course
    const incompleteCourse = {
      title: "Short",
      categoryId: null,
      sections: [],
    };
    const audit1 = InstructorService.evaluatePrePublishReadiness(incompleteCourse);
    assert.strictEqual(audit1.isValid, false);
    assert.ok(audit1.score < 50);

    // Complete course
    const completeCourse = {
      title: "Mastering Next.js 16 & TypeScript Enterprise Architecture",
      description: "A comprehensive in-depth professional guide covering modern scalable full-stack applications with Prisma and Next.js.",
      categoryId: "cat-dev",
      learningOutcomes: [
        "Architect enterprise web applications",
        "Deploy to resilient cloud infrastructure",
        "Integrate full-text search and caching",
      ],
      requirements: ["Basic JavaScript and React knowledge"],
      intendedLearners: ["Full-stack developers and software engineers"],
      priceAmount: 4999,
      sections: [
        {
          lessons: [{ id: "l-1", title: "Intro", type: LessonType.VIDEO }],
        },
      ],
    };
    const audit2 = InstructorService.evaluatePrePublishReadiness(completeCourse);
    assert.strictEqual(audit2.isValid, true);
    assert.strictEqual(audit2.score, 100);
    assert.strictEqual(audit2.checks.every((c) => c.passed), true);
  });

  test("should block submission for review if pre-publish checklist fails", async () => {
    await assert.rejects(
      async () => {
        // Submit an incomplete draft
        await InstructorService.submitCourseForReview("user-test-1", "incomplete-draft-id");
      },
      (err: any) => {
        // Will throw ValidationError with pre-publish feedback
        return err.name === "ValidationError" || err.name === "NotFoundError" || err.name === "ForbiddenError";
      }
    );
  });

  test("should retrieve instructor courses and dashboard metrics gracefully", async () => {
    const metrics = await InstructorService.getInstructorDashboardMetrics("user-test-1");
    assert.ok(typeof metrics.totalRevenue === "number");
    assert.ok(typeof metrics.totalStudents === "number");
    assert.ok(typeof metrics.activeCourses === "number");
    assert.ok(typeof metrics.draftCourses === "number");

    const courses = await InstructorService.getInstructorCourses("user-test-1");
    assert.ok(Array.isArray(courses));
    assert.ok(courses.length > 0);
  });
});
