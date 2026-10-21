import { PrismaClient, CourseLevel, CourseStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PERMISSIONS = [
  { code: "courses.view", description: "View all courses including drafts" },
  { code: "courses.create", description: "Create new courses" },
  { code: "courses.edit", description: "Edit existing courses" },
  { code: "courses.publish", description: "Publish approved courses" },
  { code: "courses.unpublish", description: "Unpublish live courses" },
  { code: "courses.moderate", description: "Moderate submitted courses" },
  { code: "courses.delete_request", description: "Submit course deletion requests" },
  { code: "students.view", description: "View registered students" },
  { code: "students.edit", description: "Edit student profile information" },
  { code: "students.enroll", description: "Manually enroll students in courses" },
  { code: "students.suspend", description: "Suspend student accounts" },
  { code: "instructors.view", description: "View instructor profiles" },
  { code: "instructors.create", description: "Provision new instructor accounts" },
  { code: "instructors.edit", description: "Edit instructor details" },
  { code: "instructors.assign", description: "Assign instructors to courses" },
  { code: "orders.view", description: "View all order transactions" },
  { code: "payments.view", description: "View payment gateway records" },
  { code: "refunds.manage", description: "Process and approve student refunds" },
  { code: "coupons.manage", description: "Create and configure discount coupons" },
  { code: "reviews.moderate", description: "Moderate and approve course reviews" },
  { code: "support.manage", description: "Manage and escalate support tickets" },
  { code: "announcements.manage", description: "Publish platform announcements" },
  { code: "reports.view", description: "View platform analytical reports" },
  { code: "audit.view", description: "View system audit logs" },
  { code: "settings.manage", description: "Configure platform settings" },
  { code: "deletions.request", description: "Submit deletion requests for sensitive entities" },
  { code: "deletions.approve", description: "Approve or reject deletion requests (Super Admin only)" },
];

async function main() {
  console.log("🌱 Starting VTI Marketplace LMS seed...");

  // 1. Seed Permissions
  console.log("Seeding permissions...");
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: { description: perm.description },
      create: { code: perm.code, description: perm.description },
    });
  }

  const defaultPasswordHash = await bcrypt.hash("Password123!", 12);

  // 2. Seed Super Admin Persona
  console.log("Seeding Super Admin (superadmin@vti.edu)...");
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@vti.edu" },
    update: { role: "SUPER_ADMIN", status: "ACTIVE" },
    create: {
      email: "superadmin@vti.edu",
      name: "Super Administrator",
      passwordHash: defaultPasswordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });

  // 3. Seed Admin Persona
  console.log("Seeding Admin (admin@vti.edu)...");
  const admin = await prisma.user.upsert({
    where: { email: "admin@vti.edu" },
    update: { role: "ADMIN", status: "ACTIVE" },
    create: {
      email: "admin@vti.edu",
      name: "Operations Admin",
      passwordHash: defaultPasswordHash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // Assign standard admin permissions
  const adminPermissions = await prisma.permission.findMany({
    where: {
      code: {
        in: [
          "courses.view",
          "courses.create",
          "courses.edit",
          "courses.moderate",
          "students.view",
          "students.edit",
          "instructors.view",
          "instructors.create",
          "instructors.assign",
          "orders.view",
          "payments.view",
          "reviews.moderate",
          "support.manage",
          "announcements.manage",
          "reports.view",
          "audit.view",
          "deletions.request",
        ],
      },
    },
  });

  for (const perm of adminPermissions) {
    await prisma.userPermission.upsert({
      where: {
        userId_permissionId: {
          userId: admin.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        userId: admin.id,
        permissionId: perm.id,
      },
    });
  }

  // 4. Seed Instructor Persona
  console.log("Seeding Instructor (instructor@vti.edu)...");
  const instructor = await prisma.user.upsert({
    where: { email: "instructor@vti.edu" },
    update: { role: "INSTRUCTOR", status: "ACTIVE" },
    create: {
      email: "instructor@vti.edu",
      name: "Dr. Farooq Khan",
      passwordHash: defaultPasswordHash,
      role: "INSTRUCTOR",
      status: "ACTIVE",
    },
  });

  const instructorProfile = await prisma.instructorProfile.upsert({
    where: { userId: instructor.id },
    update: {},
    create: {
      userId: instructor.id,
      title: "Senior Full-Stack Cloud Architect & Educator",
      bio: "15+ years of experience in distributed systems, modern web engineering, and enterprise architecture.",
      credentials: "M.S. Computer Science, AWS Certified Solutions Architect Professional",
      expertise: ["Next.js", "TypeScript", "PostgreSQL", "Cloud Computing", "System Design"],
      education: "University of Edinburgh",
      totalStudents: 1250,
      averageRating: 4.9,
      totalReviews: 380,
    },
  });

  // 5. Seed Student Persona
  console.log("Seeding Student (student@vti.edu)...");
  const student = await prisma.user.upsert({
    where: { email: "student@vti.edu" },
    update: { role: "STUDENT", status: "ACTIVE" },
    create: {
      email: "student@vti.edu",
      name: "Ahmad Raza",
      passwordHash: defaultPasswordHash,
      role: "STUDENT",
      status: "ACTIVE",
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      headline: "Aspiring Cloud & Full-Stack Engineer",
      interests: ["Web Development", "Next.js", "Cloud Architecture"],
      totalPoints: 120,
      currentStreak: 5,
    },
  });

  await prisma.cart.upsert({
    where: { userId: student.id },
    update: {},
    create: { userId: student.id },
  });

  // 6. Seed 3-Tier Marketplace Taxonomy
  console.log("Seeding 3-tier marketplace taxonomy...");
  const devCategory = await prisma.category.upsert({
    where: { slug: "development" },
    update: {},
    create: {
      name: "Web & Software Development",
      slug: "development",
      displayOrder: 1,
    },
  });

  const fullStackSub = await prisma.subcategory.upsert({
    where: { slug: "full-stack-web" },
    update: {},
    create: {
      categoryId: devCategory.id,
      name: "Full-Stack Web Development",
      slug: "full-stack-web",
      displayOrder: 1,
    },
  });

  const nextjsTopic = await prisma.topic.upsert({
    where: { slug: "nextjs" },
    update: {},
    create: {
      subcategoryId: fullStackSub.id,
      name: "Next.js",
      slug: "nextjs",
    },
  });

  const cloudCategory = await prisma.category.upsert({
    where: { slug: "cloud-devops" },
    update: {},
    create: {
      name: "Cloud Computing & DevOps",
      slug: "cloud-devops",
      displayOrder: 2,
    },
  });

  const cloudArchSub = await prisma.subcategory.upsert({
    where: { slug: "cloud-architecture" },
    update: {},
    create: {
      categoryId: cloudCategory.id,
      name: "Cloud Architecture",
      slug: "cloud-architecture",
      displayOrder: 1,
    },
  });

  const dataCategory = await prisma.category.upsert({
    where: { slug: "data-science-ai" },
    update: {},
    create: {
      name: "Data Science & Artificial Intelligence",
      slug: "data-science-ai",
      displayOrder: 3,
    },
  });

  // 7. Seed Sample Courses
  console.log("Seeding sample published courses...");
  const sampleCourses = [
    {
      title: "Mastering Next.js 16 & TypeScript Enterprise Architecture",
      slug: "mastering-nextjs-16-typescript-enterprise-architecture",
      subtitle: "Build scalable, commercial-grade web applications with App Router, TanStack Query, and PostgreSQL.",
      description: "Comprehensive guide to architecting production web apps using Next.js 16, TypeScript, Redux Toolkit, and Tailwind CSS.",
      categoryId: devCategory.id,
      subcategoryId: fullStackSub.id,
      topicId: nextjsTopic.id,
      level: CourseLevel.INTERMEDIATE,
      priceAmount: 4999, // $49.99
      discountAmount: 2000,
      currency: "USD",
      averageRating: 4.9,
      totalReviews: 380,
      totalStudents: 1250,
      totalLectures: 48,
      totalDurationSec: 54000, // 15 hours
      status: CourseStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "Cloud Infrastructure with Docker, Kubernetes & AWS",
      slug: "cloud-infrastructure-docker-kubernetes-aws",
      subtitle: "Deploy, orchestrate, and automate resilient cloud services on AWS with Docker and Kubernetes.",
      description: "Learn hands-on container orchestration, CI/CD pipelines, and cloud security from scratch.",
      categoryId: cloudCategory.id,
      subcategoryId: cloudArchSub.id,
      level: CourseLevel.EXPERT,
      priceAmount: 5999, // $59.99
      currency: "USD",
      averageRating: 4.8,
      totalReviews: 210,
      totalStudents: 940,
      totalLectures: 36,
      totalDurationSec: 43200,
      status: CourseStatus.PUBLISHED,
      publishedAt: new Date(),
    },
    {
      title: "Modern Web Foundations: HTML, CSS & JavaScript",
      slug: "modern-web-foundations-html-css-javascript",
      subtitle: "The definitive zero-to-hero starter guide to modern web development.",
      description: "Master modern semantic HTML5, responsive CSS3 with Flexbox/Grid, and modern ES6+ JavaScript.",
      categoryId: devCategory.id,
      subcategoryId: fullStackSub.id,
      level: CourseLevel.BEGINNER,
      priceAmount: 0, // FREE course!
      currency: "USD",
      averageRating: 4.7,
      totalReviews: 150,
      totalStudents: 2400,
      totalLectures: 24,
      totalDurationSec: 28800,
      status: CourseStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  ];

  for (const c of sampleCourses) {
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });

    // Associate lead instructor
    await prisma.courseInstructor.upsert({
      where: {
        courseId_instructorId: {
          courseId: course.id,
          instructorId: instructorProfile.id,
        },
      },
      update: {},
      create: {
        courseId: course.id,
        instructorId: instructorProfile.id,
        isPrimary: true,
      },
    });
  }

  // 8. Record Initial Audit Log
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: "PLATFORM_INITIALIZED",
      entity: "SYSTEM",
      metadata: {
        superAdminId: superAdmin.id,
        environment: process.env.NODE_ENV ?? "development",
        seedDate: new Date().toISOString(),
      },
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("Default credentials for all seeded personas:");
  console.log("  Password: Password123!");
  console.log("  Super Admin: superadmin@vti.edu");
  console.log("  Admin:       admin@vti.edu");
  console.log("  Instructor:  instructor@vti.edu");
  console.log("  Student:     student@vti.edu");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
