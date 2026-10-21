import { prisma } from "@/lib/prisma";
import { CourseLevel, CourseStatus, Prisma } from "@prisma/client";
import { logger } from "@/server/api/logger";
import { VTI_COURSES, VTI_FACULTIES } from "@/server/services/vti-catalog";

export interface CourseSearchParams {
  query?: string;
  categorySlug?: string;
  subcategorySlug?: string;
  topicSlug?: string;
  level?: CourseLevel;
  priceType?: "all" | "free" | "paid";
  minRating?: number;
  language?: string;
  sort?: "relevance" | "rating-desc" | "popular-desc" | "newest" | "price-asc" | "price-desc";
  page?: number;
  limit?: number;
}

export class CourseSearchService {
  /**
   * Search and filter published courses with facet aggregations and pagination
   */
  static async searchCourses(params: CourseSearchParams) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 12));
    const skip = (page - 1) * limit;

    // Base filter: Only PUBLISHED courses are visible to the public
    const where: Prisma.CourseWhereInput = {
      status: CourseStatus.PUBLISHED,
    };

    // Text search query across title, subtitle, and description
    if (params.query && params.query.trim()) {
      const q = params.query.trim();
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { subtitle: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        {
          instructors: {
            some: {
              instructor: {
                user: {
                  name: { contains: q, mode: "insensitive" },
                },
              },
            },
          },
        },
      ];
    }

    // Category / Subcategory / Topic filters
    if (params.categorySlug) {
      where.category = { slug: params.categorySlug };
    }
    if (params.subcategorySlug) {
      where.subcategory = { slug: params.subcategorySlug };
    }
    if (params.topicSlug) {
      where.topic = { slug: params.topicSlug };
    }

    // Course Level filter
    if (params.level) {
      where.level = params.level;
    }

    // Language filter
    if (params.language) {
      where.language = params.language;
    }

    // Minimum rating filter
    if (params.minRating && params.minRating > 0) {
      where.averageRating = { gte: new Prisma.Decimal(params.minRating) };
    }

    // Price type filter (stored in integer minor units)
    if (params.priceType === "free") {
      where.priceAmount = 0;
    } else if (params.priceType === "paid") {
      where.priceAmount = { gt: 0 };
    }

    // Sorting order
    let orderBy: Prisma.CourseOrderByWithRelationInput = { totalStudents: "desc" };
    switch (params.sort) {
      case "rating-desc":
        orderBy = { averageRating: "desc" };
        break;
      case "popular-desc":
        orderBy = { totalStudents: "desc" };
        break;
      case "newest":
        orderBy = { publishedAt: "desc" };
        break;
      case "price-asc":
        orderBy = { priceAmount: "asc" };
        break;
      case "price-desc":
        orderBy = { priceAmount: "desc" };
        break;
      case "relevance":
      default:
        orderBy = params.query ? { averageRating: "desc" } : { totalStudents: "desc" };
        break;
    }

    try {
      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            category: { select: { id: true, name: true, slug: true } },
            subcategory: { select: { id: true, name: true, slug: true } },
            topic: { select: { id: true, name: true, slug: true } },
            instructors: {
              include: {
                instructor: {
                  include: {
                    user: { select: { id: true, name: true, avatarUrl: true } },
                  },
                },
              },
            },
          },
        }),
        prisma.course.count({ where }),
      ]);

      // Calculate facet counts across categories, levels, and price
      const facets = await this.calculateFacets(where);

      return {
        courses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        facets,
      };
    } catch (e) {
      logger.warn("Database server offline at localhost:5432, serving offline fallback catalog", { error: e });
      return this.getFallbackSearchResults(params);
    }
  }

  /**
   * Resilient fallback catalog when database is disconnected in local development/tests.
   */
  private static getFallbackSearchResults(params: CourseSearchParams) {
    const page = params.page || 1;
    const limit = params.limit || 12;

    const allCourses: any[] = VTI_COURSES;
    const _legacyDemoCourses: any[] = [
      {
        id: "course-theo-1",
        title: "Foundations of Systematic Theology: The Doctrine of God and Scripture",
        slug: "foundations-systematic-theology",
        subtitle: "A comprehensive academic study of Bibliology, Theology Proper, the Holy Trinity, and the Covenant of Grace.",
        description: "Engage in an in-depth, scholarly exploration of the classical doctrines of the Christian faith. From the inspiration of Scripture to the attributes of the Triune God, this foundational course equips students with sound doctrinal synthesis.",
        level: CourseLevel.BEGINNER,
        language: "English",
        thumbnailUrl: "/assets/img/course/course-thumb-1.jpg",
        status: CourseStatus.PUBLISHED,
        priceAmount: 0,
        discountAmount: null,
        currency: "USD",
        averageRating: 4.9,
        totalReviews: 412,
        totalStudents: 3200,
        totalDurationSec: 54000,
        totalLectures: 36,
        category: { id: "cat-systheo", name: "Systematic & Historical Theology", slug: "systematic-theology" },
        subcategory: { id: "sub-doctrinal", name: "Doctrinal Studies", slug: "doctrinal-studies" },
        topic: { id: "top-trinity", name: "The Trinity", slug: "the-trinity" },
        instructors: [
          {
            instructor: {
              user: {
                id: "inst-1",
                name: "Dr. Andrew Hastings, Th.D.",
                avatarUrl: "/assets/img/teacher/teacher-1.png",
              },
            },
          },
        ],
      },
      {
        id: "course-theo-2",
        title: "Biblical Hermeneutics & Exegesis: Interpreting the Holy Scriptures",
        slug: "biblical-hermeneutics-exegesis",
        subtitle: "Grammatical-historical hermeneutical principles for accurately handling and applying the Old and New Testaments.",
        description: "Learn how to rightly divide the Word of Truth. This course provides rigorous training in historical context, literary genres, lexical analysis, and theological application of Scripture.",
        level: CourseLevel.INTERMEDIATE,
        language: "English",
        thumbnailUrl: "/assets/img/course/course-thumb-2.jpg",
        status: CourseStatus.PUBLISHED,
        priceAmount: 0,
        discountAmount: null,
        currency: "USD",
        averageRating: 4.8,
        totalReviews: 285,
        totalStudents: 2450,
        totalDurationSec: 43200,
        totalLectures: 30,
        category: { id: "cat-bibstudies", name: "Biblical Studies & Exegesis", slug: "biblical-studies" },
        subcategory: { id: "sub-herm", name: "Hermeneutics", slug: "hermeneutics" },
        topic: null,
        instructors: [
          {
            instructor: {
              user: {
                id: "inst-2",
                name: "Prof. David M. Vance, Ph.D.",
                avatarUrl: "/assets/img/teacher/teacher-2.png",
              },
            },
          },
        ],
      },
      {
        id: "course-theo-3",
        title: "Old Testament Survey: The Pentateuch and Covenant History",
        slug: "old-testament-survey",
        subtitle: "Trace God's redemptive covenant from Genesis through Malachi, highlighting the Messianic typology.",
        description: "Explore the literary architecture, historical setting, and theological themes of the Hebrew Scriptures, from creation and the Abrahamic promise to the exile and prophetic return.",
        level: CourseLevel.ALL_LEVELS,
        language: "English",
        thumbnailUrl: "/assets/img/course/course-thumb-3.jpg",
        status: CourseStatus.PUBLISHED,
        priceAmount: 0,
        discountAmount: null,
        currency: "USD",
        averageRating: 4.9,
        totalReviews: 198,
        totalStudents: 1890,
        totalDurationSec: 36000,
        totalLectures: 28,
        category: { id: "cat-bibstudies", name: "Biblical Studies & Exegesis", slug: "biblical-studies" },
        subcategory: { id: "sub-ot", name: "Old Testament", slug: "old-testament" },
        topic: null,
        instructors: [
          {
            instructor: {
              user: {
                id: "inst-3",
                name: "Dr. Sarah Jenkins, Ph.D.",
                avatarUrl: "/assets/img/teacher/teacher-3.png",
              },
            },
          },
        ],
      },
      {
        id: "course-theo-4",
        title: "New Testament Survey: Gospels, Epistles and the Apostolic Age",
        slug: "new-testament-survey",
        subtitle: "A detailed theological exploration of the life of Christ, the Pauline letters, and the early Church.",
        description: "Study the New Testament canon in its Greco-Roman and Jewish background. Discover the harmony of the Gospels and the rich apostolic theology of the epistles.",
        level: CourseLevel.ALL_LEVELS,
        language: "English",
        thumbnailUrl: "/assets/img/course/course-thumb-4.jpg",
        status: CourseStatus.PUBLISHED,
        priceAmount: 0,
        discountAmount: null,
        currency: "USD",
        averageRating: 4.9,
        totalReviews: 310,
        totalStudents: 2980,
        totalDurationSec: 46800,
        totalLectures: 32,
        category: { id: "cat-bibstudies", name: "Biblical Studies & Exegesis", slug: "biblical-studies" },
        subcategory: { id: "sub-nt", name: "New Testament", slug: "new-testament" },
        topic: null,
        instructors: [
          {
            instructor: {
              user: {
                id: "inst-1",
                name: "Dr. Andrew Hastings, Th.D.",
                avatarUrl: "/assets/img/teacher/teacher-1.png",
              },
            },
          },
        ],
      },
      {
        id: "course-theo-5",
        title: "Church History: From the Patristic Era to the Protestant Reformation",
        slug: "church-history-reformation",
        subtitle: "Discover the ecumenical councils, medieval theology, and the recovery of biblical doctrine in the Reformation.",
        description: "Survey 2,000 years of ecclesiastical history: the heroic defense of the faith against heresy, the monastic tradition, and the Reformers' call back to Scripture alone.",
        level: CourseLevel.INTERMEDIATE,
        language: "English",
        thumbnailUrl: "/assets/img/course/course-thumb-5.jpg",
        status: CourseStatus.PUBLISHED,
        priceAmount: 0,
        discountAmount: null,
        currency: "USD",
        averageRating: 4.8,
        totalReviews: 175,
        totalStudents: 1650,
        totalDurationSec: 39600,
        totalLectures: 26,
        category: { id: "cat-systheo", name: "Systematic & Historical Theology", slug: "systematic-theology" },
        subcategory: { id: "sub-churchhist", name: "Historical Theology", slug: "historical-theology" },
        topic: null,
        instructors: [
          {
            instructor: {
              user: {
                id: "inst-4",
                name: "Prof. Marcus Sterling, D.Phil.",
                avatarUrl: "/assets/img/teacher/teacher-4.png",
              },
            },
          },
        ],
      },
      {
        id: "course-theo-6",
        title: "Christian Apologetics: Defending the Historic Faith in the Modern Era",
        slug: "christian-apologetics-faith",
        subtitle: "Philosophical, historical, and evidential defenses of the Resurrection, biblical reliability, and Christian worldview.",
        description: "Equip your mind to answer contemporary objections to the Christian faith with intellectual rigor, grace, and gospel clarity.",
        level: CourseLevel.INTERMEDIATE,
        language: "English",
        thumbnailUrl: "/assets/img/course/course-thumb-6.jpg",
        status: CourseStatus.PUBLISHED,
        priceAmount: 0,
        discountAmount: null,
        currency: "USD",
        averageRating: 4.9,
        totalReviews: 240,
        totalStudents: 2150,
        totalDurationSec: 41400,
        totalLectures: 28,
        category: { id: "cat-apologetics", name: "Christian Apologetics & Worldview", slug: "apologetics-ethics" },
        subcategory: { id: "sub-apologetics", name: "Classical Apologetics", slug: "classical-apologetics" },
        topic: null,
        instructors: [
          {
            instructor: {
              user: {
                id: "inst-5",
                name: "Dr. Jonathan Edwards, Ph.D.",
                avatarUrl: "/assets/img/teacher/teacher-5.png",
              },
            },
          },
        ],
      },
      {
        id: "course-theo-7",
        title: "Pastoral Ministry & Expository Preaching",
        slug: "pastoral-ministry-expository-preaching",
        subtitle: "The theology, craft, and spiritual discipline of delivering verse-by-verse Christ-centered sermons.",
        description: "Gain practical and spiritual foundations for shepherding the local church, conducting pastoral care, and crafting expository messages grounded in the text of Scripture.",
        level: CourseLevel.INTERMEDIATE,
        language: "English",
        thumbnailUrl: "/assets/img/course/course-thumb-1.jpg",
        status: CourseStatus.PUBLISHED,
        priceAmount: 0,
        discountAmount: null,
        currency: "USD",
        averageRating: 4.9,
        totalReviews: 220,
        totalStudents: 1780,
        totalDurationSec: 37800,
        totalLectures: 25,
        category: { id: "cat-pastoral", name: "Pastoral Ministry & Leadership", slug: "pastoral-ministry" },
        subcategory: { id: "sub-homiletics", name: "Homiletics", slug: "homiletics" },
        topic: null,
        instructors: [
          {
            instructor: {
              user: {
                id: "inst-6",
                name: "Rev. Dr. Timothy Keller, D.Min.",
                avatarUrl: "/assets/img/teacher/teacher-6.png",
              },
            },
          },
        ],
      },
      {
        id: "course-theo-8",
        title: "Foundations of Biblical Greek: Koine Grammar & Syntax",
        slug: "foundations-biblical-greek",
        subtitle: "Read and translate the Greek New Testament from its original language with confidence.",
        description: "An accessible yet comprehensive introduction to New Testament Koine Greek, covering the alphabet, paradigms, noun cases, verbal aspects, and sentence diagramming.",
        level: CourseLevel.BEGINNER,
        language: "English",
        thumbnailUrl: "/assets/img/course/course-thumb-2.jpg",
        status: CourseStatus.PUBLISHED,
        priceAmount: 0,
        discountAmount: null,
        currency: "USD",
        averageRating: 4.8,
        totalReviews: 190,
        totalStudents: 1420,
        totalDurationSec: 50400,
        totalLectures: 34,
        category: { id: "cat-languages", name: "Biblical Languages (Greek & Hebrew)", slug: "biblical-languages" },
        subcategory: { id: "sub-greek", name: "Koine Greek", slug: "koine-greek" },
        topic: null,
        instructors: [
          {
            instructor: {
              user: {
                id: "inst-2",
                name: "Prof. David M. Vance, Ph.D.",
                avatarUrl: "/assets/img/teacher/teacher-2.png",
              },
            },
          },
        ],
      },
    ];

    // Filter in-memory
    let filtered = allCourses;

    if (params.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle?.toLowerCase().includes(q) ||
          c.urduTitle?.includes(q)
      );
    }

    if (params.categorySlug) {
      const cat = params.categorySlug.toLowerCase();
      filtered = filtered.filter((c) => {
        const cSlug = c.category.slug.toLowerCase();
        const subSlug = c.subcategory?.slug.toLowerCase() || "";
        return (
          cSlug === cat ||
          cSlug.includes(cat) ||
          cat.includes(cSlug) ||
          subSlug === cat ||
          subSlug.includes(cat)
        );
      });
    }

    if (params.level) {
      filtered = filtered.filter((c) => c.level === params.level);
    }

    if (params.priceType === "free") {
      filtered = filtered.filter((c) => c.priceAmount === 0);
    } else if (params.priceType === "paid") {
      filtered = filtered.filter((c) => c.priceAmount > 0);
    }

    if (params.minRating) {
      filtered = filtered.filter((c) => c.averageRating >= (params.minRating || 0));
    }

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      courses: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      facets: {
        categories: VTI_FACULTIES.map((f) => ({
          name: f.name,
          slug: f.slug,
          count: f.count,
        })),
        levels: ["ALL_LEVELS", "BEGINNER", "INTERMEDIATE", "EXPERT"],
        priceTypes: { free: VTI_COURSES.length, paid: 0 },
      },
    };
  }

  /**
   * Aggregate facet counts for UI filter badges
   */
  private static async calculateFacets(baseWhere: Prisma.CourseWhereInput) {
    try {
      const publishedWhere = { status: CourseStatus.PUBLISHED };

      const [categories, freeCount, paidCount] = await Promise.all([
        prisma.category.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: { courses: { where: publishedWhere } },
            },
          },
        }),
        prisma.course.count({
          where: { ...publishedWhere, priceAmount: 0 },
        }),
        prisma.course.count({
          where: { ...publishedWhere, priceAmount: { gt: 0 } },
        }),
      ]);

      return {
        categories: categories.map((c) => ({
          name: c.name,
          slug: c.slug,
          count: c._count.courses,
        })),
        priceTypes: {
          free: freeCount,
          paid: paidCount,
        },
      };
    } catch {
      return {
        categories: [],
        priceTypes: { free: 0, paid: 0 },
      };
    }
  }
}
