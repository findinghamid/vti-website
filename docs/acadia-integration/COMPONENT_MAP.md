# Acadia Component & Page Mapping

This document maps each Acadia HTML template file and component directly to its corresponding Next.js file, React component, and backend data provider.

---

## 1. Global Shell & Navigation

| Template Source | Next.js Target File | Component Role | Key Features |
| :--- | :--- | :--- | :--- |
| `index-11.html` (`tp-header-11-top`, `tp-header-11-menu`) | `src/components/layout/PublicNavbar.tsx` | Main Header & Navigation | Top announcement bar, sticky navigation, category dropdown, search input, cart trigger with counter badge, authentication dropdown with logout. |
| `index-11.html` (`cartmini__area`) | `src/components/cart/CartDrawer.tsx` | Mini Cart Slide-over | Slide-over drawer with item count, pricing breakdown, remove item, free shipping progress bar, checkout CTA. |
| `index-11.html` (`offcanvas__area`) | `src/components/layout/MobileNav.tsx` | Mobile Navigation Drawer | Mobile menu with accordion navigation, search input, and direct student links. |
| `index-11.html` (`footer.tp-footer-2`) | `src/components/layout/PublicFooter.tsx` | Global Footer | 4-column layout: About VTI & contact button; Categories; Student & Instructor links; Newsletter & direct contact details. |

---

## 2. Public Marketplace & Homepage

| Template Source | Next.js Target File | Component Role | Key Features |
| :--- | :--- | :--- | :--- |
| `index-2.html` (`tp-hero-2-wrap`) + `index-7.html` (`tp-hero-7-wrap`) | `src/app/(public)/page.tsx` + `src/components/home/HomeHero.tsx` | Hybrid Homepage Hero | Left: Subtitle pill + bold headline with SVG underline + search bar + CTA buttons + instructor avatar stack + student counter.<br>Right: Floating interactive featured course card. |
| `index-2.html` (`course-area tp-course-wrapper`) | `src/components/home/HomeCoursesSection.tsx` | Homepage Course Showcase | Tabbed filter navigation ("All", "Trending", "Popular", "Featured") connected to real courses from `CourseService`. |
| `index-11.html` (`tp-service-11-area`) | `src/components/home/HomeFeaturesSection.tsx` | Value Proposition Grid | 4-column feature highlights (Expert Instructors, Lifetime Access, Practical Sandbox, Verified Certs). |
| `index-3.html` (`cta-area tp-cta-3-bg`) | `src/components/home/HomeInquiryForm.tsx` | Contact & Lead Capture | 2-column contact section (**strictly without cartoon shapes**). |
| `index-11.html` (`tp-testimonial-6-ptb`) | `src/components/home/HomeTestimonialsSection.tsx` | Verified Student Testimonials | Testimonial cards with quote marks, ratings, student names, and photos. |
| `index-12.html` (`tp-blog-12-area`) | `src/components/home/HomeBlogSection.tsx` | Latest Articles & News | 1 featured large article + 3 horizontal side articles (**strictly without butterfly shapes**). |

---

## 3. Course Catalog & Details

| Template Source | Next.js Target File | Component Role | Key Features |
| :--- | :--- | :--- | :--- |
| `course-with-sidebar.html` + `course-with-filter.html` | `src/app/(public)/courses/page.tsx` | Course Discovery Page | Desktop sticky sidebar filter + Mobile offcanvas slide-over drawer; category, instructor, price, rating filters. |
| `index-2.html` (`tp-course-item`) | `src/components/marketplace/CourseCard.tsx` | Course Card Component | Image thumbnail with hover zoom, level tag, instructor badge, star rating, price with strikethrough. |
| `course-details-3.html` (`tp-breadcrumb__area details3`) | `src/components/course/CourseHero.tsx` | Course Detail Banner | Dark high-contrast header banner with category, title, instructor chip, rating, and last updated date. |
| `course-details-3.html` (`tp-course-details-3-widget`) | `src/components/course/StickyEnrollCard.tsx` | Sticky Enrollment Card | Video thumbnail with preview modal trigger, pricing, discount pill, social sharing, "Add to Cart", "Buy Course" CTAs. |
| `course-details-3.html` (`tp-course-details-2-content`) | `src/components/course/CurriculumAccordion.tsx` + `InstructorBioCard.tsx` + `ReviewsSummary.tsx` | Course Information Tabs | Course overview, "What you'll learn", interactive curriculum accordion, instructor bio card, verified reviews break-down. |

---

## 4. Commerce & Authentication

| Template Source | Next.js Target File | Component Role | Key Features |
| :--- | :--- | :--- | :--- |
| `cart.html` | `src/app/(public)/cart/page.tsx` | Cart Page | Order item table, coupon validation input, subtotal, and proceeds to checkout. |
| `checkout.html` | `src/app/(public)/checkout/page.tsx` | Multi-step Checkout | Email collection with intelligent account check: existing users prompt for password; new users auto-create account & prompt to create password. |
| `login.html` | `src/app/(public)/login/page.tsx` | Login Page | Clean Acadia authentication form with email, password, and social sign-in. |
| `register.html` | `src/app/(public)/signup/page.tsx` | Registration Page | Student registration form with name, email, password, and role selection. |

---

## 5. Student Dashboard & Portal

| Template Source | Next.js Target File | Component Role | Key Features |
| :--- | :--- | :--- | :--- |
| `student-dashboard.html` (`tpd-user-sidebar`) | `src/components/layout/StudentSidebar.tsx` + `src/app/(student)/student/layout.tsx` | Student Dashboard Shell | Persistent dashboard sidebar menu with user avatar, name, and active route indicators. |
| `student-dashboard.html` (`tp-fact-wrapper`) + `student-enroll-course.html` | `src/app/(student)/student/learning/page.tsx` | Enrolled Learning Hub | Overview stats + grid of enrolled courses with progress bars and "Resume" buttons. |
| `instructor-certificate.html` | `src/app/(student)/student/certificates/page.tsx` | Certificate Hub | Verifiable certificates with PDF preview and verification links. |
| `student-order.html` | `src/app/(student)/student/orders/page.tsx` | Order History | Invoices, purchase dates, amounts, and payment statuses. |
| `membership-plans.html` | `src/app/(student)/student/subscription/page.tsx` | Subscription Hub | Current active tier, renewal date, and upgrade/cancel buttons. |
| `instructor-setting-password.html` | `src/app/(student)/student/settings/page.tsx` | Account & Security Settings | Profile settings tab + password change form. |
