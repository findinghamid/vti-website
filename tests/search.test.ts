import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CourseSearchService } from "../src/server/services/search.service";

describe("Milestone 4: Course Search & Discovery Service", () => {
  it("should return empty pagination contract gracefully when database is offline in tests", async () => {
    const result = await CourseSearchService.searchCourses({
      query: "Next.js",
      page: 1,
      limit: 10,
    });

    assert.equal(typeof result, "object");
    assert.equal(Array.isArray(result.courses), true);
    assert.equal(typeof result.pagination, "object");
    assert.equal(typeof result.facets, "object");
  });

  it("should handle multi-faceted filter queries without throwing errors", async () => {
    const result = await CourseSearchService.searchCourses({
      categorySlug: "development",
      priceType: "paid",
      minRating: 4.5,
      sort: "rating-desc",
    });

    assert.equal(Array.isArray(result.courses), true);
    assert.equal(result.pagination.limit, 12);
  });
});
