import { test, describe } from "node:test";
import assert from "node:assert";
import { LearningService } from "../src/server/services/learning.service";
import { ValidationError, ForbiddenError } from "../src/server/api/errors";

describe("Milestone 9: Learning Service & Course Player", () => {
  const testStudentId = "demo-learning-student-1";
  const demoCourseSlug = "mastering-nextjs-16-typescript-enterprise-architecture";

  test("should format timestamps accurately into MM:SS format", () => {
    assert.strictEqual(LearningService.formatTimestamp(0), "00:00");
    assert.strictEqual(LearningService.formatTimestamp(65), "01:05");
    assert.strictEqual(LearningService.formatTimestamp(620), "10:20");
    assert.strictEqual(LearningService.formatTimestamp(3665), "61:05");
  });

  test("should resolve full player context, active lecture, and curriculum hierarchy", async () => {
    const context = await LearningService.getCoursePlayerContext(testStudentId, demoCourseSlug);

    assert.ok(context.course);
    assert.strictEqual(context.course.slug, demoCourseSlug);
    assert.ok(context.sections.length > 0, "Curriculum sections must be populated");
    assert.ok(context.currentLesson, "Current lesson must be resolved");
    assert.strictEqual(typeof context.currentLesson.title, "string");
    assert.strictEqual(typeof context.progress.progressPct, "number");
  });

  test("should resolve next and previous lecture pointers accurately", async () => {
    const context = await LearningService.getCoursePlayerContext(
      testStudentId,
      demoCourseSlug,
      "course-introduction-architecture-tour"
    );

    assert.ok(context.currentLesson);
    // Since first lecture, prevLesson is null
    assert.strictEqual(context.prevLesson, null);
    // Next lesson must be resolved
    assert.ok(context.nextLesson);
    assert.strictEqual(typeof context.nextLesson.title, "string");
  });

  test("should update playback position and mark lecture complete", async () => {
    const lessonId = "les-1";

    const update1 = await LearningService.updateLessonProgress(testStudentId, lessonId, 145, false);
    assert.strictEqual(update1.lastPositionSec, 145);
    assert.strictEqual(update1.isCompleted, false);

    const update2 = await LearningService.updateLessonProgress(testStudentId, lessonId, 620, true);
    assert.strictEqual(update2.lastPositionSec, 620);
    assert.strictEqual(update2.isCompleted, true);
    assert.ok(update2.progressPct > 0);
  });
});

describe("Milestone 9: Timestamped Student Lecture Notes", () => {
  const testStudentId = "demo-notes-student-1";
  const lessonId = "les-2";

  test("should create and retrieve timestamped notes for lecture", async () => {
    // 1. Create notes at different timestamps
    const note1 = await LearningService.createNote(
      testStudentId,
      lessonId,
      125,
      "Important Next.js 16 Server Components rule: Data access belongs on server."
    );
    assert.ok(note1.id);
    assert.strictEqual(note1.timestampSec, 125);
    assert.strictEqual(note1.formattedTimestamp, "02:05");

    const note2 = await LearningService.createNote(
      testStudentId,
      lessonId,
      45,
      "Turbopack bundle architecture notes."
    );
    assert.strictEqual(note2.timestampSec, 45);
    assert.strictEqual(note2.formattedTimestamp, "00:45");

    // 2. Retrieve notes — must be ordered by timestamp ascending
    const notes = await LearningService.getNotes(testStudentId, lessonId);
    assert.ok(notes.length >= 2);
    assert.strictEqual(notes[0].timestampSec, 45, "Earlier timestamp must come first");
    assert.strictEqual(notes[1].timestampSec, 125);
  });

  test("should reject creating note with empty content", async () => {
    await assert.rejects(
      async () => {
        await LearningService.createNote(testStudentId, lessonId, 60, "   ");
      },
      (err: unknown) => {
        assert.ok(err instanceof ValidationError);
        assert.match((err as Error).message, /cannot be empty/i);
        return true;
      }
    );
  });

  test("should delete student note", async () => {
    const note = await LearningService.createNote(
      testStudentId,
      lessonId,
      300,
      "Temporary note to delete"
    );

    await LearningService.deleteNote(testStudentId, note.id);

    const remaining = await LearningService.getNotes(testStudentId, lessonId);
    assert.strictEqual(remaining.some((n) => n.id === note.id), false);
  });
});
