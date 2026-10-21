# DATABASE & DOMAIN MODEL SPECIFICATION
## PostgreSQL + Prisma ORM Architecture

---

## 1. DOMAIN BOUNDARIES & ENTITY GROUPS

The data model is partitioned into 9 domain boundaries:
1. **Identity & Access**: Users, Sessions, Accounts, Roles, Permissions, UserPermissions.
2. **Profiles**: StudentProfiles, InstructorProfiles (credentials, biography, social links, payout details).
3. **Marketplace & Taxonomy**: Categories, Subcategories, Topics, Courses, CourseInstructors.
4. **Curriculum & Learning Content**: Sections, Lessons (Video, Article, PDF, Quiz, Assignment), Resources, MediaAssets.
5. **Progress & Learning Tracking**: Enrollments, LessonProgress, CourseProgress, Note (timestamped), QuizAttempt, QuizAnswer.
6. **Commerce & Billing**: Cart, CartItems, Orders, OrderItems, Payments, PaymentEvents, Invoices, Refunds, Coupons, PromotionRules, Subscriptions, SubscriptionPlans, Bundles.
7. **Social & Engagement**: Reviews, Ratings, CourseQuestions (Q&A), CourseAnswers, CommunityPosts, CommunityReplies.
8. **Support & Operations**: SupportTickets, SupportMessages, DeletionRequests, ModerationActions, AuditLogs.
9. **Platform & CMS**: SiteSettings, BrandSettings, FeatureFlags, Announcements, FAQs, Certificates.

---

## 2. CORE PRISMA SCHEMA DESIGN

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==========================================
// 1. IDENTITY & ACCESS DOMAIN
// ==========================================

enum UserRole {
  SUPER_ADMIN
  ADMIN
  INSTRUCTOR
  STUDENT
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DEACTIVATED
  ARCHIVED
}

model User {
  id            String      @id @default(cuid())
  email         String      @unique
  passwordHash  String
  name          String
  avatarUrl     String?
  role          UserRole    @default(STUDENT)
  status        UserStatus  @default(ACTIVE)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  deletedAt     DateTime?

  // Relations
  studentProfile     StudentProfile?
  instructorProfile  InstructorProfile?
  sessions           Session[]
  permissions        UserPermission[]
  enrollments        Enrollment[]
  orders             Order[]
  cart               Cart?
  wishlistItems      WishlistItem[]
  reviews            Review[]
  notes              Note[]
  courseQuestions    CourseQuestion[]
  courseAnswers      CourseAnswer[]
  supportTickets     SupportTicket[]
  deletionRequests   DeletionRequest[] @relation("RequesterRelation")
  approvedDeletions  DeletionRequest[] @relation("ReviewerRelation")
  auditLogs          AuditLog[]
  certificates       Certificate[]
  notifications      Notification[]
  badges             StudentBadge[]

  @@index([role, status])
  @@index([email])
}

model Permission {
  id          String   @id @default(cuid())
  code        String   @unique // e.g. "courses.publish", "refunds.manage"
  description String
  users       UserPermission[]
}

model UserPermission {
  id           String     @id @default(cuid())
  userId       String
  permissionId String
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  permission   Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([userId, permissionId])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  ipAddress    String?
  userAgent    String?
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

// ==========================================
// 2. PROFILES DOMAIN
// ==========================================

model StudentProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  headline    String?
  interests   String[]
  totalPoints Int      @default(0)
  currentStreak Int    @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model InstructorProfile {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title        String
  bio          String   @db.Text
  credentials  String?
  expertise    String[]
  education    String?
  websiteUrl   String?
  twitterUrl   String?
  linkedinUrl  String?
  youtubeUrl   String?
  totalStudents Int     @default(0)
  averageRating Decimal @default(0.0) @db.Decimal(3, 2)
  totalReviews  Int     @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  courses      CourseInstructor[]
}

// ==========================================
// 3. TAXONOMY & COURSE DOMAIN
// ==========================================

model Category {
  id            String        @id @default(cuid())
  name          String
  slug          String        @unique
  icon          String?
  displayOrder  Int           @default(0)
  subcategories Subcategory[]
  courses       Course[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Subcategory {
  id           String    @id @default(cuid())
  categoryId   String
  category     Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  name         String
  slug         String    @unique
  displayOrder Int       @default(0)
  topics       Topic[]
  courses      Course[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@index([categoryId])
}

model Topic {
  id            String      @id @default(cuid())
  subcategoryId String
  subcategory   Subcategory @relation(fields: [subcategoryId], references: [id], onDelete: Cascade)
  name          String
  slug          String      @unique
  courses       Course[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([subcategoryId])
}

enum CourseStatus {
  DRAFT
  READY_FOR_REVIEW
  UNDER_REVIEW
  CHANGES_REQUESTED
  APPROVED
  PUBLISHED
  UNPUBLISHED
  ARCHIVED
}

enum CourseLevel {
  ALL_LEVELS
  BEGINNER
  INTERMEDIATE
  EXPERT
}

model Course {
  id               String        @id @default(cuid())
  title            String
  slug             String        @unique
  subtitle         String?       @db.VarChar(300)
  description      String?       @db.Text
  categoryId       String
  category         Category      @relation(fields: [categoryId], references: [id])
  subcategoryId    String?
  subcategory      Subcategory?  @relation(fields: [subcategoryId], references: [id])
  topicId          String?
  topic            Topic?        @relation(fields: [topicId], references: [id])
  level            CourseLevel   @default(ALL_LEVELS)
  language         String        @default("en")
  thumbnailUrl     String?
  previewVideoUrl  String?
  status           CourseStatus  @default(DRAFT)
  
  // Pricing stored in integer minor units (e.g. cents)
  priceAmount      Int           @default(0) 
  discountAmount   Int?          
  currency         String        @default("USD")

  // Learning Outcomes & Requirements
  learningOutcomes String[]
  requirements     String[]
  intendedLearners String[]

  // Aggregates for performance
  averageRating    Decimal       @default(0.0) @db.Decimal(3, 2)
  totalReviews     Int           @default(0)
  totalStudents    Int           @default(0)
  totalDurationSec Int           @default(0)
  totalLectures    Int           @default(0)

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  publishedAt      DateTime?

  // Relations
  instructors      CourseInstructor[]
  sections         Section[]
  enrollments      Enrollment[]
  reviews          Review[]
  questions        CourseQuestion[]
  orderItems       OrderItem[]
  cartItems        CartItem[]
  wishlistItems    WishlistItem[]
  certificates     Certificate[]
  moderationLogs   ModerationLog[]

  @@index([status, categoryId])
  @@index([slug])
  @@index([averageRating, totalStudents])
}

model CourseInstructor {
  id           String            @id @default(cuid())
  courseId     String
  instructorId String
  isPrimary    Boolean           @default(false)
  sharePercent Int               @default(100)
  course       Course            @relation(fields: [courseId], references: [id], onDelete: Cascade)
  instructor   InstructorProfile @relation(fields: [instructorId], references: [id], onDelete: Cascade)

  @@unique([courseId, instructorId])
}

// ==========================================
// 4. CURRICULUM & LESSON DOMAIN
// ==========================================

model Section {
  id           String   @id @default(cuid())
  courseId     String
  title        String
  description  String?
  sortOrder    Int      @default(0)
  course       Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons      Lesson[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([courseId, sortOrder])
}

enum LessonType {
  VIDEO
  ARTICLE
  PDF
  QUIZ
  ASSIGNMENT
}

model Lesson {
  id           String         @id @default(cuid())
  sectionId    String
  title        String
  slug         String
  type         LessonType     @default(VIDEO)
  sortOrder    Int            @default(0)
  durationSec  Int            @default(0)
  isPreview    Boolean        @default(false)
  contentBody  String?        @db.Text
  mediaUrl     String?        // Signed/Stream storage URL
  captionUrl   String?
  section      Section        @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  resources    LessonResource[]
  progress     LessonProgress[]
  notes        Note[]
  quiz         Quiz?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  @@index([sectionId, sortOrder])
}

model LessonResource {
  id          String   @id @default(cuid())
  lessonId    String
  title       String
  fileUrl     String
  fileSize    Int
  fileType    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
}

// ==========================================
// 5. PROGRESS, QUIZZES & NOTES DOMAIN
// ==========================================

model Enrollment {
  id           String         @id @default(cuid())
  userId       String
  courseId     String
  progressPct  Int            @default(0)
  completedAt  DateTime?
  lastActiveAt DateTime       @default(now())
  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  course       Course         @relation(fields: [courseId], references: [id])
  lessonProgress LessonProgress[]
  certificate  Certificate?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt

  @@unique([userId, courseId])
  @@index([userId])
}

model LessonProgress {
  id           String     @id @default(cuid())
  enrollmentId String
  lessonId     String
  isCompleted  Boolean    @default(false)
  lastPositionSec Int     @default(0)
  completedAt  DateTime?
  enrollment   Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  lesson       Lesson     @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  updatedAt    DateTime   @updatedAt

  @@unique([enrollmentId, lessonId])
}

model Note {
  id           String   @id @default(cuid())
  userId       String
  lessonId     String
  timestampSec Int      @default(0)
  content      String   @db.Text
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson       Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId, lessonId])
}

model Quiz {
  id             String         @id @default(cuid())
  lessonId       String         @unique
  lesson         Lesson         @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  passScorePct   Int            @default(70)
  questions      QuizQuestion[]
  attempts       QuizAttempt[]
}

model QuizQuestion {
  id          String       @id @default(cuid())
  quizId      String
  prompt      String       @db.Text
  sortOrder   Int          @default(0)
  quiz        Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
  options     QuizOption[]
  answers     QuizAnswer[]
}

model QuizOption {
  id          String       @id @default(cuid())
  questionId  String
  text        String
  isCorrect   Boolean      @default(false)
  question    QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
}

model QuizAttempt {
  id          String       @id @default(cuid())
  quizId      String
  userId      String
  scorePct    Int
  passed      Boolean
  answers     QuizAnswer[]
  quiz        Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
  createdAt   DateTime     @default(now())
}

model QuizAnswer {
  id          String       @id @default(cuid())
  attemptId   String
  questionId  String
  selectedOptionId String
  attempt     QuizAttempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  question    QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
}

// ==========================================
// 6. COMMERCE DOMAIN
// ==========================================

model Cart {
  id        String     @id @default(cuid())
  userId    String     @unique
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     CartItem[]
  updatedAt DateTime   @updatedAt
}

model CartItem {
  id        String   @id @default(cuid())
  cartId    String
  courseId  String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([cartId, courseId])
}

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, courseId])
}

enum OrderStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

model Order {
  id            String      @id @default(cuid())
  orderNumber   String      @unique
  userId        String
  subtotalMinor Int         // integer cents
  discountMinor Int         @default(0)
  taxMinor      Int         @default(0)
  totalMinor    Int         // integer cents
  currency      String      @default("USD")
  status        OrderStatus @default(PENDING)
  couponCode    String?
  user          User        @relation(fields: [userId], references: [id])
  items         OrderItem[]
  payments      Payment[]
  refunds       Refund[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([userId, status])
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  courseId    String
  priceMinor  Int
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  course      Course   @relation(fields: [courseId], references: [id])
}

model Payment {
  id            String   @id @default(cuid())
  orderId       String
  provider      String   // STRIPE, PAYPAL, RAZORPAY, MOCK
  providerRefId String   @unique // Provider Charge/Intent ID
  amountMinor   Int
  currency      String
  status        String   // SUCCEEDED, FAILED
  rawPayload    Json?
  order         Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  createdAt     DateTime @default(now())
}

model Refund {
  id            String   @id @default(cuid())
  orderId       String
  amountMinor   Int
  reason        String
  status        String   // PENDING, APPROVED, REJECTED, COMPLETED
  providerRefId String?
  order         Order    @relation(fields: [orderId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Coupon {
  id            String    @id @default(cuid())
  code          String    @unique
  discountType  String    // PERCENT, FIXED
  discountValue Int       // minor units or percentage points
  maxUses       Int?
  usedCount     Int       @default(0)
  minSpendMinor Int?
  startsAt      DateTime?
  expiresAt     DateTime?
  isActive      Boolean   @default(true)
}

// ==========================================
// 7. OPERATIONS, AUDIT & DELETIONS
// ==========================================

enum DeletionStatus {
  PENDING
  APPROVED
  REJECTED
}

model DeletionRequest {
  id             String         @id @default(cuid())
  entityType     String         // "COURSE", "INSTRUCTOR", "STUDENT"
  entityId       String
  reason         String         @db.Text
  requesterId    String
  reviewerId     String?
  status         DeletionStatus @default(PENDING)
  decisionReason String?        @db.Text
  requestedAt    DateTime       @default(now())
  decidedAt      DateTime?

  requester      User           @relation("RequesterRelation", fields: [requesterId], references: [id])
  reviewer       User?          @relation("ReviewerRelation", fields: [reviewerId], references: [id])

  @@index([status])
}

model AuditLog {
  id         String   @id @default(cuid())
  userId     String?
  action     String   // "USER_LOGIN", "COURSE_PUBLISHED", "DELETION_APPROVED"
  entity     String
  entityId   String?
  ipAddress  String?
  requestId  String?
  metadata   Json?
  createdAt  DateTime @default(now())
  user       User?    @relation(fields: [userId], references: [id])

  @@index([action, createdAt])
}

model ModerationLog {
  id         String   @id @default(cuid())
  courseId   String
  adminId    String
  action     String   // "APPROVED", "CHANGES_REQUESTED"
  feedback   String?  @db.Text
  createdAt  DateTime @default(now())
  course     Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
}

// ==========================================
// 8. SOCIAL, REVIEWS & Q&A
// ==========================================

model Review {
  id        String   @id @default(cuid())
  userId    String
  courseId  String
  rating    Int      // 1 to 5
  comment   String   @db.Text
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, courseId])
  @@index([courseId, rating])
}

model CourseQuestion {
  id        String         @id @default(cuid())
  courseId  String
  userId    String
  title     String
  body      String         @db.Text
  isAnswered Boolean       @default(false)
  course    Course         @relation(fields: [courseId], references: [id], onDelete: Cascade)
  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers   CourseAnswer[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  @@index([courseId, isAnswered])
}

model CourseAnswer {
  id         String         @id @default(cuid())
  questionId String
  userId     String
  body       String         @db.Text
  isInstructor Boolean      @default(false)
  question   CourseQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)
  user       User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt  DateTime       @default(now())
  updatedAt  DateTime       @updatedAt
}

// ==========================================
// 9. CERTIFICATES & SETTINGS
// ==========================================

model Certificate {
  id             String     @id @default(cuid())
  certificateNo  String     @unique // e.g. VTI-CERT-2026-XXXXX
  enrollmentId   String     @unique
  userId         String
  courseId       String
  studentSnapshot Json     // immutable snapshot of name, completion date
  courseSnapshot  Json     // immutable snapshot of title, hours, instructor
  issuedAt       DateTime   @default(now())
  isRevoked      Boolean    @default(false)

  enrollment     Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)
  user           User       @relation(fields: [userId], references: [id])
  course         Course     @relation(fields: [courseId], references: [id])
}

model SiteSetting {
  id        String   @id @default(cuid())
  key       String   @unique // e.g. "BRANDING_LOGO", "FEATURE_WISHLIST"
  value     Json
  updatedAt DateTime @updatedAt
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String
  type      String   // SYSTEM, ENROLLMENT, PAYMENT, QNA
  link      String?
  readAt    DateTime?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, readAt])
}

model StudentBadge {
  id        String   @id @default(cuid())
  userId    String
  badgeCode String   // e.g. "PERFECT_SCORE", "QUICK_LEARNER"
  awardedAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, badgeCode])
}
```

---

## 3. RELATIONAL INTEGRITY & FINANCIAL ACCURACY RULES
1. **Integer Minor Units**: All monetary values (`priceAmount`, `discountAmount`, `subtotalMinor`, `taxMinor`, `totalMinor`) must be stored as 64-bit/32-bit integers in minor currency units (e.g. cents, pence, paisas).
2. **Immutable Snapshots**: Certificates and Orders must store snapshot JSON of course names, student names, and pricing at the exact moment of issuance/purchase so later edits to course titles never distort historical certificates or invoices.
3. **Soft-Delete vs. Hard-Delete vs. Historical Retention**: Financial records (`Order`, `Payment`, `Refund`) and compliance records (`AuditLog`, `Certificate`) must **NEVER** be deleted, even if a user account is deleted or anonymized.
