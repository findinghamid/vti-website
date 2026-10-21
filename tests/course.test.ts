import { test, describe } from "node:test";
import assert from "node:assert";
import { CourseService } from "../src/server/services/course.service";

describe("Milestone 5: Course Modeling & Data Service", () => {
  test("should format course duration properly", () => {
    assert.strictEqual(CourseService.formatDuration(0), "0m");
    assert.strictEqual(CourseService.formatDuration(1800), "30m");
    assert.strictEqual(CourseService.formatDuration(3600), "1h");
    assert.strictEqual(CourseService.formatDuration(54000), "15h");
    assert.strictEqual(CourseService.formatDuration(55800), "15h 30m");
  });

  test("should format lesson duration in MM:SS properly", () => {
    assert.strictEqual(CourseService.formatLessonDuration(0), "00:00");
    assert.strictEqual(CourseService.formatLessonDuration(65), "01:05");
    assert.strictEqual(CourseService.formatLessonDuration(620), "10:20");
    assert.strictEqual(CourseService.formatLessonDuration(1440), "24:00");
  });

  test("should format integer minor unit prices correctly", () => {
    assert.strictEqual(CourseService.formatPrice(0), "Free");
    assert.strictEqual(CourseService.formatPrice(1999), "$19.99");
    assert.strictEqual(CourseService.formatPrice(4999), "$49.99");
    assert.strictEqual(CourseService.formatPrice(5000, "EUR"), "€50.00");
    assert.strictEqual(CourseService.formatPrice(2500, "GBP"), "£25.00");
  });

  test("should compute discount percentage accurately", () => {
    // If price is 4999 and discount is 2000, original price is 6999 -> 2000 / 6999 = ~29%
    const pct = CourseService.calculateDiscountPercent(4999, 2000);
    assert.strictEqual(pct, 29);

    // No discount
    assert.strictEqual(CourseService.calculateDiscountPercent(4999, 0), null);
    assert.strictEqual(CourseService.calculateDiscountPercent(4999, null), null);

    // Free course discount
    assert.strictEqual(CourseService.calculateDiscountPercent(0, 2000), null);
  });

  test("should retrieve course details with full relations or resilient fallback", async () => {
    const course = await CourseService.getCourseBySlug("mastering-nextjs-16-typescript-enterprise-architecture");
    assert.ok(course, "Course should be resolved");
    assert.strictEqual(course.slug, "mastering-nextjs-16-typescript-enterprise-architecture");
    assert.ok(course.learningOutcomes.length > 0, "Should have learning outcomes");
    assert.ok(course.requirements.length > 0, "Should have requirements");
    assert.ok(course.intendedLearners.length > 0, "Should have intended learners");
    assert.ok(course.sections.length > 0, "Should have curriculum sections");
    assert.ok(course.instructors.length > 0, "Should have instructor profile");
    assert.strictEqual(typeof course.formattedPrice, "string");
  });

  test("should handle non-existent course slug gracefully", async () => {
    const course = await CourseService.getCourseBySlug("completely-non-existent-course-slug-xyz");
    // Should return null for unknown slugs unless database fallback handles default
    assert.strictEqual(course, null);
  });

  test("should retrieve instructor courses gracefully", async () => {
    const courses = await CourseService.getInstructorCourses("inst-test-id", 4);
    assert.ok(Array.isArray(courses), "Should return array of courses");
  });
});
