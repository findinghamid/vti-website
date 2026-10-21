import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { slugify } from "../src/server/services/taxonomy.service";

describe("Milestone 4: Taxonomy Engine & Slug Generation", () => {
  it("should generate clean URL-friendly slugs", () => {
    assert.equal(slugify("Web Development"), "web-development");
    assert.equal(slugify("Cloud Computing & DevOps!"), "cloud-computing-devops");
    assert.equal(slugify("  Next.js 16 (App Router)  "), "nextjs-16-app-router");
    assert.equal(slugify("Python / Machine Learning"), "python-machine-learning");
  });

  it("should handle already slugified strings gracefully", () => {
    assert.equal(slugify("full-stack-web"), "full-stack-web");
    assert.equal(slugify("docker"), "docker");
  });
});
