# REQUIREMENTS TRACEABILITY MATRIX
## Specification to Implementation Mapping (79 Pages)

---

| Section / Page | Specification Requirement Summary | Implementation Layer | Target Milestone | Verification & Test Strategy |
|---|---|---|---|---|
| **P1–P4 (Sec 0–1)** | Udemy-class learning marketplace + Enterprise LMS + VTI operations; original design system; commercial reusability | Full Stack Architecture | M01, M03 | Multi-tenant readiness, white-label settings |
| **P5–P6 (Sec 2–3)** | Greenfield discovery; 3-tier architecture (Marketplace, LMS, Operations, Platform Services) | Project Setup & Architecture | M01 | Clean Next.js + Prisma directory scaffold |
| **P7–P10 (Sec 4–6)** | User Roles: Super Admin, Admin, Instructor, Student; Granular RBAC permissions; No hardcoded role checks | `src/server/auth/rbac.ts`, `UserPermission` | M02 | RBAC unit & middleware 401/403 tests |
| **P11–P12 (Sec 7)** | Admin Deletion Request Workflow (Two-person approval rule for important entities) | `DeletionRequest` model, API, Admin UI | M02, M13 | Request creation & approval integration test |
| **P12–P13 (Sec 8)** | Instructor Model: Real authenticated User with `InstructorProfile`, assigned courses, bio, socials | `InstructorProfile`, `CourseInstructor` | M02, M06 | Profile update & course association tests |
| **P13–P15 (Sec 9–10)** | Marketplace Model: Course discovery, public browsing, filtering, sorting, preview lectures | `Course` model, Marketplace catalog | M04, M05 | Catalog filter matrix tests |
| **P15–P17 (Sec 11–12)** | 3-Tier Taxonomy: Category → Subcategory → Topic; Admin management | `Category`, `Subcategory`, `Topic` models | M04 | Relational cascade & taxonomy API tests |
| **P17–P18 (Sec 13)** | Course Landing Page: Above the fold, sticky buy card, what you'll learn, curriculum, instructor bio | `app/(public)/courses/[slug]/page.tsx` | M05 | Responsive layout & video preview modal tests |
| **P18–P19 (Sec 14)** | Course Curriculum & Lesson Types: Video, Article, PDF, Quiz, Assignment | `Section`, `Lesson` models & components | M05, M06 | Curriculum tree rendering & API tests |
| **P19–P20 (Sec 15)** | Video System: Object storage, CDN/Streaming, Signed URLs, no large video in Postgres | Storage Adapters (`src/server/adapters/storage`) | M06 | Signed URL generation & expiration tests |
| **P21–P22 (Sec 16)** | Course Player: Sidebar curriculum, video player, speed, captions, fullscreen, pip, auto-save | `app/(student)/student/course/[id]/learn/` | M09 | Player keyboard & progress heartbeat tests |
| **P22 (Sec 17)** | Student Notes: Timestamped notes linked to video playback, search, seek navigation | `Note` model, Player Notes Tab | M09 | Note creation & video seek tests |
| **P23 (Sec 18)** | Course-scoped Q&A: Questions, answers, instructor filters, search | `CourseQuestion`, `CourseAnswer` | M11 | Q&A thread creation & instructor badge tests |
| **P23–P24 (Sec 19)** | Support Tickets: Multi-tier escalation (Student → Instructor → Admin → Super Admin), SLA | `SupportTicket`, `SupportMessage` | M12 | SLA timer & escalation flow tests |
| **P24–P25 (Sec 20)** | Course Community: Enrolled student posts, replies, announcements | `CommunityPost`, `CommunityReply` | M11 | Enrolled access restriction tests |
| **P25 (Sec 21)** | Shopping Cart: Add/remove, multi-item checkout, duplicate enrollment prevention | `Cart`, `CartItem`, Redux + API | M07 | Duplicate enrollment rejection tests |
| **P25–P26 (Sec 22)** | Wishlist: Persistent for authenticated users, move to cart | `WishlistItem` model, API, UI | M07 | Wishlist persistence & move-to-cart tests |
| **P26–P27 (Sec 23–24)** | Pricing Engine & Coupons: Server-calculated discounts, minor integer units, fixed/percentage | `PricingService`, `Coupon` model | M07 | Pure server pricing engine unit tests |
| **P27–P29 (Sec 25)** | Payment System: Polymorphic adapter (Stripe, PayPal, Mock), webhooks, idempotency | `PaymentProvider`, `Payment`, `Order` | M08 | Webhook signature & idempotency tests |
| **P29 (Sec 26)** | Configurable Refunds: Standard window + VTI completion-based policy, admin approval | `Refund` model, Refund engine | M08 | Progress threshold rejection tests |
| **P29–P30 (Sec 27–29)**| Subscriptions, Bundles & Gifting: Multi-course access, recurring billing readiness | `SubscriptionPlan`, `Bundle` models | M14 | Bundle auto-enrollment tests |
| **P31–P32 (Sec 30)** | Reviews & Ratings: Verified student check, 1-5 rating, single authoritative distribution | `Review` model, Authoritative rating query | M11 | Unenrolled review block & rating aggregate tests |
| **P32–P33 (Sec 31–32)**| Instructor Studio & Analytics: Dashboard, revenue, enrollments, ratings, Q&A volume | Instructor Portal (`/instructor/`) | M06, M13 | Analytics aggregation query tests |
| **P34–P35 (Sec 33–34)**| Guided Course Builder (16 stages) & Moderation Lifecycle (Draft → Review → Published) | Multi-step Wizard & Moderation Engine | M06 | Stage validation & moderation queue tests |
| **P36–P37 (Sec 35–37)**| Student Dashboard & Recommendations: Continue learning, recommendations service | Student Portal (`/student/`) | M04, M09 | Recommendation engine output tests |
| **P38–P39 (Sec 38–39)**| Certificates & Gamification: Auto-issuance, unique ID, public verification, badges, streaks | `Certificate`, `StudentBadge`, `/verify/[id]` | M10, M14 | Snapshot immutability & verification lookup |
| **P39–P41 (Sec 40–42)**| Notifications & CMS-Lite: In-app center, dynamic homepage sections, site settings | `Notification`, `SiteSetting` | M03, M12 | Notification dispatch & CMS setting tests |
| **P41–P45 (Sec 43–47)**| Complete Route Architecture: Public, Student, Instructor, and Admin route trees | Next.js App Router Structure | M03, M05–M13 | Route navigation & layout rendering tests |
| **P45–P49 (Sec 48)** | PostgreSQL + Prisma Modular Domain Schema | `prisma/schema.prisma` | M01, M02 | Migration generation & relational integrity |
| **P49–P51 (Sec 49)** | API Architecture: `/api/v1/`, Route → Auth → RBAC → Service → Repo → DB | Standardized API routing pattern | M01–M15 | API contract & schema validation tests |
| **P51–P53 (Sec 50–51)**| Security & Audit Logging: Server authoritative, secure cookies, rate limit, audit log | `AuditLog`, security middleware | M02, M15 | Security penetration & audit trail tests |
| **P53–P56 (Sec 52–54)**| Responsive Design & UX Quality: Mobile-first player, empty/loading/error/forbidden states | Tailwind CSS, shadcn/ui components | M03, M09 | Responsive viewport & accessibility checks |
| **P56–P59 (Sec 55–59)**| Observability & Testing Strategy: Unit, Integration, API, E2E tests, structured logs | Vitest, Playwright, Pino/custom logger | M01–M15 | Full test suite execution |
| **P61–P64 (Sec 60–62)**| Definition of Done & Dependency-first vertical development | Project Execution Protocol | All | DoD compliance audit per milestone |
| **P67–P70 (Sec 66–70)**| Reusability, White-labeling, Feature Flags, Multi-tenant readiness | `BrandSettings`, `FeatureFlags` | M03, M14 | Rebranding & feature toggling tests |
| **P71–P74 (Sec 71–74)**| SEO, Accessibility (WCAG), Multi-currency minor units, i18n readiness | JSON-LD schema, sitemaps, ARIA | M15 | Schema validation & currency minor tests |
| **P75–P79 (Sec 75–78)**| Final Product Structure & Quality Bar: Zero fake features, production readiness | Platform Integration & Review | M15 | End-to-end critical journey test suite |
