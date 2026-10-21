import { prisma } from "@/lib/prisma";
import { NotFoundError, ConflictError, ValidationError } from "@/server/api/errors";
import { logger } from "@/server/api/logger";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CreateCategoryInput {
  name: string;
  icon?: string;
  displayOrder?: number;
}

export interface CreateSubcategoryInput {
  categoryId: string;
  name: string;
  displayOrder?: number;
}

export interface CreateTopicInput {
  subcategoryId: string;
  name: string;
}

export class TaxonomyService {
  /**
   * List complete hierarchical taxonomy tree (Categories -> Subcategories -> Topics)
   */
  static async listTaxonomy() {
    try {
      return await prisma.category.findMany({
        orderBy: { displayOrder: "asc" },
        include: {
          subcategories: {
            orderBy: { displayOrder: "asc" },
            include: {
              topics: {
                orderBy: { name: "asc" },
              },
            },
          },
        },
      });
    } catch (e) {
      logger.warn("Database server offline at localhost:5432, serving offline fallback taxonomy", { error: e });
      return this.getFallbackTaxonomy();
    }
  }

  /**
   * Get single category by slug with its subcategories and topics
   */
  static async getCategoryBySlug(slug: string) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          subcategories: {
            orderBy: { displayOrder: "asc" },
            include: {
              topics: {
                orderBy: { name: "asc" },
              },
            },
          },
        },
      });

      if (!category) {
        const fallback = this.getFallbackTaxonomy().find((c) => c.slug === slug);
        if (fallback) return fallback;
        throw new NotFoundError("Category");
      }

      return category;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      const fallback = this.getFallbackTaxonomy().find((c) => c.slug === slug);
      if (fallback) return fallback;
      throw new NotFoundError("Category");
    }
  }

  /**
   * Resilient fallback taxonomy categories.
   */
  private static getFallbackTaxonomy() {
    return [
      {
        id: "cat-dev",
        name: "Development & Engineering",
        slug: "development",
        icon: "Code",
        displayOrder: 1,
        subcategories: [
          {
            id: "sub-fullstack",
            categoryId: "cat-dev",
            name: "Full-Stack Development",
            slug: "full-stack",
            displayOrder: 1,
            topics: [
              { id: "top-nextjs", subcategoryId: "sub-fullstack", name: "Next.js", slug: "nextjs" },
              { id: "top-react", subcategoryId: "sub-fullstack", name: "React", slug: "react" },
            ],
          },
        ],
      },
      {
        id: "cat-cloud",
        name: "Cloud & DevOps",
        slug: "cloud-devops",
        icon: "Cloud",
        displayOrder: 2,
        subcategories: [
          {
            id: "sub-cloudarch",
            categoryId: "cat-cloud",
            name: "Cloud Architecture",
            slug: "cloud-architecture",
            displayOrder: 1,
            topics: [
              { id: "top-docker", subcategoryId: "sub-cloudarch", name: "Docker", slug: "docker" },
              { id: "top-k8s", subcategoryId: "sub-cloudarch", name: "Kubernetes", slug: "kubernetes" },
            ],
          },
        ],
      },
      {
        id: "cat-ai",
        name: "Data Science & AI",
        slug: "data-science-ai",
        icon: "Brain",
        displayOrder: 3,
        subcategories: [
          {
            id: "sub-ml",
            categoryId: "cat-ai",
            name: "Machine Learning",
            slug: "machine-learning",
            displayOrder: 1,
            topics: [
              { id: "top-python", subcategoryId: "sub-ml", name: "Python", slug: "python" },
            ],
          },
        ],
      },
    ];
  }

  /**
   * Get subcategory by slug with its parent category and child topics
   */
  static async getSubcategoryBySlug(slug: string) {
    const subcategory = await prisma.subcategory.findUnique({
      where: { slug },
      include: {
        category: true,
        topics: {
          orderBy: { name: "asc" },
        },
      },
    });

    if (!subcategory) {
      throw new NotFoundError("Subcategory");
    }

    return subcategory;
  }

  /**
   * Admin: Create a top-level category
   */
  static async createCategory(input: CreateCategoryInput) {
    if (!input.name || input.name.trim().length < 2) {
      throw new ValidationError("Category name must be at least 2 characters long");
    }

    const slug = slugify(input.name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError(`Category with slug "${slug}" already exists`);
    }

    const category = await prisma.category.create({
      data: {
        name: input.name.trim(),
        slug,
        icon: input.icon,
        displayOrder: input.displayOrder ?? 0,
      },
    });

    logger.info(`Category created: ${category.name}`, {
      action: "CATEGORY_CREATED",
      entity: "CATEGORY",
      entityId: category.id,
    });

    return category;
  }

  /**
   * Admin: Create a subcategory under a category
   */
  static async createSubcategory(input: CreateSubcategoryInput) {
    if (!input.name || input.name.trim().length < 2) {
      throw new ValidationError("Subcategory name must be at least 2 characters long");
    }

    const parent = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!parent) {
      throw new NotFoundError("Parent category");
    }

    const slug = slugify(input.name);
    const existing = await prisma.subcategory.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError(`Subcategory with slug "${slug}" already exists`);
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        categoryId: input.categoryId,
        name: input.name.trim(),
        slug,
        displayOrder: input.displayOrder ?? 0,
      },
    });

    logger.info(`Subcategory created: ${subcategory.name}`, {
      action: "SUBCATEGORY_CREATED",
      entity: "SUBCATEGORY",
      entityId: subcategory.id,
    });

    return subcategory;
  }

  /**
   * Admin: Create a topic under a subcategory
   */
  static async createTopic(input: CreateTopicInput) {
    if (!input.name || input.name.trim().length < 2) {
      throw new ValidationError("Topic name must be at least 2 characters long");
    }

    const parent = await prisma.subcategory.findUnique({ where: { id: input.subcategoryId } });
    if (!parent) {
      throw new NotFoundError("Parent subcategory");
    }

    const slug = slugify(input.name);
    const existing = await prisma.topic.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError(`Topic with slug "${slug}" already exists`);
    }

    const topic = await prisma.topic.create({
      data: {
        subcategoryId: input.subcategoryId,
        name: input.name.trim(),
        slug,
      },
    });

    logger.info(`Topic created: ${topic.name}`, {
      action: "TOPIC_CREATED",
      entity: "TOPIC",
      entityId: topic.id,
    });

    return topic;
  }
}
