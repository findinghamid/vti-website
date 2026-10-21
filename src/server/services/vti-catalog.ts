import { CourseLevel, CourseStatus, LessonType } from "@prisma/client";

export interface VtiCourseCatalogItem {
  id: string;
  title: string;
  urduTitle: string;
  slug: string;
  subtitle: string;
  description: string;
  level: CourseLevel;
  language: string;
  thumbnailUrl: string;
  status: CourseStatus;
  priceAmount: number;
  discountAmount: number | null;
  currency: string;
  averageRating: number;
  totalReviews: number;
  totalStudents: number;
  totalDurationSec: number;
  totalLectures: number;
  progressPercent: number;
  isComingSoon: boolean;
  category: { id: string; name: string; slug: string };
  subcategory?: { id: string; name: string; slug: string } | null;
  topic?: { id: string; name: string; slug: string } | null;
  instructors: Array<{
    instructor: {
      user: {
        id: string;
        name: string;
        avatarUrl: string | null;
      };
    };
  }>;
}

export const VTI_FACULTIES = [
  {
    id: "cat-found",
    name: "Christian Foundation",
    urduName: "مسیحی بنیاد",
    slug: "christian-foundation",
    description: "Fundamental doctrines of historic Christian faith, the nature of God, salvation, and the Church.",
    count: 1,
  },
  {
    id: "cat-interp",
    name: "Bible Understanding and Interpretation",
    urduName: "بائبل کو سمجھنا اور تشریح",
    slug: "bible-understanding-and-interpretation",
    description: "Biblical hermeneutics, grammatical-historical exegesis, Old and New Testament surveys.",
    count: 2,
  },
  {
    id: "cat-growth",
    name: "Spiritual Growth and Christian Living",
    urduName: "روحانی ترقی اور مسیحی زندگی",
    slug: "spiritual-growth-and-christian-living",
    description: "Personal prayer, holy living, biblical discipleship, Christian ethics, and emotional comfort in Christ.",
    count: 3,
  },
  {
    id: "cat-apologetics",
    name: "Christian Apologetics",
    urduName: "مسیحی دفاعیات",
    slug: "christian-apologetics",
    description: "Defending the inerrancy, preservation, manuscript reliability, and divine authority of the Bible.",
    count: 1,
  },
];

export const VTI_COURSES: VtiCourseCatalogItem[] = [
  {
    id: "course-vti-1",
    title: "Christian Foundational Beliefs",
    urduTitle: "مسیحی بنیادی عقیدے",
    slug: "christian-foundational-beliefs",
    subtitle: "A 14-module foundational course covering core orthodox doctrines: God, Trinity, Holy Spirit, Fall, Salvation, Baptism, Resurrection, and the Church.",
    description: "Engage in an in-depth, scholarly exploration of the classical doctrines of the Christian faith in Urdu. From the inspiration of Scripture to the attributes of the Triune God, this foundational course equips students with sound doctrinal synthesis.",
    level: CourseLevel.BEGINNER,
    language: "Urdu / English",
    thumbnailUrl: "/assets/img/course/christian-foundational-beliefs.webp",
    status: CourseStatus.PUBLISHED,
    priceAmount: 0,
    discountAmount: null,
    currency: "USD",
    averageRating: 5.0,
    totalReviews: 0,
    totalStudents: 0,
    totalDurationSec: 75600,
    totalLectures: 42,
    progressPercent: 85,
    isComingSoon: true,
    category: {
      id: "cat-found",
      name: "Christian Foundation",
      slug: "christian-foundation",
    },
    subcategory: {
      id: "sub-doctrinal",
      name: "Systematic Theology",
      slug: "systematic-theology",
    },
    topic: {
      id: "top-trinity",
      name: "The Trinity",
      slug: "the-trinity",
    },
    instructors: [
      {
        instructor: {
          user: {
            id: "inst-1",
            name: "Dr. Junaid Javed, Ph.D.",
            avatarUrl: "/assets/img/teacher/teacher-1.png",
          },
        },
      },
    ],
  },
  {
    id: "course-vti-2",
    title: "Exodus: Journey of Faith",
    urduTitle: "خروج: ایمان کا سفر",
    slug: "exodus-journey-of-faith",
    subtitle: "Trace Israel's historic deliverance from Egyptian bondage through the Red Sea and wilderness into covenant life with Yahweh.",
    description: "Explore the literary architecture, historical setting, and theological typology of the book of Exodus. Follow God's redemptive hand from Egyptian slavery to the Tabernacle of His presence.",
    level: CourseLevel.ALL_LEVELS,
    language: "Urdu / English",
    thumbnailUrl: "/assets/img/course/exodus-journey-of-faith.webp",
    status: CourseStatus.PUBLISHED,
    priceAmount: 0,
    discountAmount: null,
    currency: "USD",
    averageRating: 5.0,
    totalReviews: 0,
    totalStudents: 0,
    totalDurationSec: 43200,
    totalLectures: 18,
    progressPercent: 70,
    isComingSoon: true,
    category: {
      id: "cat-interp",
      name: "Bible Understanding and Interpretation",
      slug: "bible-understanding-and-interpretation",
    },
    subcategory: {
      id: "sub-ot",
      name: "Old Testament",
      slug: "old-testament",
    },
    topic: null,
    instructors: [
      {
        instructor: {
          user: {
            id: "inst-2",
            name: "Robin Sarfraz, M.Div.",
            avatarUrl: "/assets/img/teacher/teacher-2.png",
          },
        },
      },
    ],
  },
  {
    id: "course-vti-3",
    title: "Principles of Reading and Understanding the Bible",
    urduTitle: "بائبل پڑھنے اور سمجھنے کے اصول",
    slug: "principles-reading-understanding-bible",
    subtitle: "Essential grammatical-historical hermeneutical principles for accurately interpreting, contextualizing, and applying Scripture.",
    description: "Learn how to rightly divide the Word of Truth. This course provides rigorous training in historical context, literary genres, lexical analysis, and theological application of Scripture.",
    level: CourseLevel.BEGINNER,
    language: "Urdu / English",
    thumbnailUrl: "/assets/img/course/principles-reading-understanding-bible.webp",
    status: CourseStatus.PUBLISHED,
    priceAmount: 0,
    discountAmount: null,
    currency: "USD",
    averageRating: 5.0,
    totalReviews: 0,
    totalStudents: 0,
    totalDurationSec: 43200,
    totalLectures: 18,
    progressPercent: 80,
    isComingSoon: true,
    category: {
      id: "cat-interp",
      name: "Bible Understanding and Interpretation",
      slug: "bible-understanding-and-interpretation",
    },
    subcategory: {
      id: "sub-herm",
      name: "Hermeneutics",
      slug: "hermeneutics",
    },
    topic: null,
    instructors: [
      {
        instructor: {
          user: {
            id: "inst-3",
            name: "Prof. David M. Vance, Ph.D.",
            avatarUrl: "/assets/img/teacher/teacher-3.png",
          },
        },
      },
    ],
  },
  {
    id: "course-vti-4",
    title: "You Are Not Alone",
    urduTitle: "آپ اکیلے نہیں ہیں",
    slug: "you-are-not-alone",
    subtitle: "Biblical comfort, spiritual resilience, and overcoming emotional and spiritual isolation through Christ.",
    description: "A compassionate, Scripture-steeped exploration of God's abiding presence, the fellowship of believers, and overcoming fear and loneliness.",
    level: CourseLevel.ALL_LEVELS,
    language: "Urdu / English",
    thumbnailUrl: "/assets/img/course/you-are-not-alone.jpg",
    status: CourseStatus.PUBLISHED,
    priceAmount: 0,
    discountAmount: null,
    currency: "USD",
    averageRating: 5.0,
    totalReviews: 0,
    totalStudents: 0,
    totalDurationSec: 28800,
    totalLectures: 12,
    progressPercent: 60,
    isComingSoon: true,
    category: {
      id: "cat-growth",
      name: "Spiritual Growth and Christian Living",
      slug: "spiritual-growth-and-christian-living",
    },
    subcategory: {
      id: "sub-disc",
      name: "Discipleship",
      slug: "discipleship",
    },
    topic: null,
    instructors: [
      {
        instructor: {
          user: {
            id: "inst-2",
            name: "Robin Sarfraz, M.Div.",
            avatarUrl: "/assets/img/avatars/student-2.jpg",
          },
        },
      },
    ],
  },
  {
    id: "course-vti-5",
    title: "Spiritual Life",
    urduTitle: "روحانی زندگی",
    slug: "spiritual-life",
    subtitle: "Nurturing an authentic daily walk with Christ through prayer, fasting, holiness, and the fruit of the Holy Spirit.",
    description: "Deepen your personal communion with God. Cultivate essential spiritual disciplines including private prayer, Scripture meditation, and abiding fellowship in Christ.",
    level: CourseLevel.INTERMEDIATE,
    language: "Urdu / English",
    thumbnailUrl: "/assets/img/course/spiritual-life.jpg",
    status: CourseStatus.PUBLISHED,
    priceAmount: 0,
    discountAmount: null,
    currency: "USD",
    averageRating: 5.0,
    totalReviews: 0,
    totalStudents: 0,
    totalDurationSec: 32400,
    totalLectures: 14,
    progressPercent: 65,
    isComingSoon: true,
    category: {
      id: "cat-growth",
      name: "Spiritual Growth and Christian Living",
      slug: "spiritual-growth-and-christian-living",
    },
    subcategory: {
      id: "sub-prayer",
      name: "Spiritual Disciplines",
      slug: "spiritual-disciplines",
    },
    topic: null,
    instructors: [
      {
        instructor: {
          user: {
            id: "inst-1",
            name: "Dr. Junaid Javed, Ph.D.",
            avatarUrl: "/assets/img/avatars/scholar-dr-junaid.jpg",
          },
        },
      },
    ],
  },
  {
    id: "course-vti-6",
    title: "Christian Ethics",
    urduTitle: "مسیحی اخلاقیات",
    slug: "christian-ethics",
    subtitle: "Navigating contemporary moral dilemmas with biblical truth, personal integrity, and Christ-like character in the community.",
    description: "Engage biblical principles of moral decision making, human dignity, truthfulness, marriage, family, and public Christian witness in contemporary society.",
    level: CourseLevel.INTERMEDIATE,
    language: "Urdu / English",
    thumbnailUrl: "/assets/img/course/christian-ethics.jpg",
    status: CourseStatus.PUBLISHED,
    priceAmount: 0,
    discountAmount: null,
    currency: "USD",
    averageRating: 5.0,
    totalReviews: 0,
    totalStudents: 0,
    totalDurationSec: 28800,
    totalLectures: 12,
    progressPercent: 50,
    isComingSoon: true,
    category: {
      id: "cat-growth",
      name: "Spiritual Growth and Christian Living",
      slug: "spiritual-growth-and-christian-living",
    },
    subcategory: {
      id: "sub-ethics",
      name: "Moral Theology",
      slug: "moral-theology",
    },
    topic: null,
    instructors: [
      {
        instructor: {
          user: {
            id: "inst-2",
            name: "Robin Sarfraz, M.Div.",
            avatarUrl: "/assets/img/avatars/student-2.jpg",
          },
        },
      },
    ],
  },
  {
    id: "course-vti-7",
    title: "Unchanged Words",
    urduTitle: "غیر متغیر کلام",
    slug: "unchanged-words",
    subtitle: "Examining the divine preservation, manuscript history, inerrancy, and enduring authority of the Word of God.",
    description: "Equip yourself to defend the supernatural inspiration, preservation, and textual reliability of the Bible against historical and philosophical skepticism.",
    level: CourseLevel.INTERMEDIATE,
    language: "Urdu / English",
    thumbnailUrl: "/assets/img/course/unchanged-words.jpg",
    status: CourseStatus.PUBLISHED,
    priceAmount: 0,
    discountAmount: null,
    currency: "USD",
    averageRating: 5.0,
    totalReviews: 0,
    totalStudents: 0,
    totalDurationSec: 28800,
    totalLectures: 12,
    progressPercent: 55,
    isComingSoon: true,
    category: {
      id: "cat-apologetics",
      name: "Christian Apologetics",
      slug: "christian-apologetics",
    },
    subcategory: {
      id: "sub-text",
      name: "Textual Reliability",
      slug: "textual-reliability",
    },
    topic: null,
    instructors: [
      {
        instructor: {
          user: {
            id: "inst-3",
            name: "Prof. David M. Vance, Ph.D.",
            avatarUrl: "/assets/img/teacher/teacher-3.png",
          },
        },
      },
    ],
  },
];

export function getVtiCourseBySlug(slug: string): VtiCourseCatalogItem | undefined {
  const normalized = slug.toLowerCase();
  return (
    VTI_COURSES.find((c) => c.slug === normalized) ||
    VTI_COURSES.find((c) => normalized.includes(c.slug) || c.slug.includes(normalized))
  );
}

export function getAllVtiCourses(): VtiCourseCatalogItem[] {
  return VTI_COURSES;
}
