# Acadia Theme Integration — Master Plan & Technical Strategy

## 1. Project Background & Objective
The VTI Marketplace LMS is a production-grade educational platform built with Next.js 16 (App Router), React 19, Tailwind CSS 4, Prisma ORM, and PostgreSQL. It combines a commercial Udemy-style marketplace with an enterprise Coursera-grade learning management system.

The objective is to integrate the visual design system, UI components, responsive layouts, and user experience of the **Acadia HTML5 Template** (`D:/VTI/Template/acadia/`) into the existing Next.js application while preserving 100% of existing functionality, data models, APIs, and security rules.

---

## 2. Core Architectural Principles

1. **Native Next.js 16 + Tailwind CSS 4 Integration**:
   - Rather than dumping conflicting legacy Bootstrap CSS and heavy vendor bundles into Next.js, we extract Acadia's design tokens (colors, typography, radii, shadows, decorative SVGs) directly into Tailwind CSS 4 directives in `src/app/globals.css`.
   - Components are built as native React 19 server and client components utilizing Lucide icons alongside Acadia's custom vector SVG shapes (curved underlines, quote shapes, badge stars).

2. **Single Coherent Global Theme (No "Tutti-Frutti")**:
   - **Primary Reference**: `index-11.html` is the dominant global visual identity (spacing, card anatomy, button language, typography rhythm, header, footer, testimonials).
   - **Secondary Accent**: `index-12.html` provides the refined color palette warmth and editorial blog layout.
   - All components from other demo pages (`index-2`, `index-7`, `index-3`, `course-details-3`, etc.) are normalized to follow this dominant theme.

3. **Explicit Exclusions**:
   - **Cartoon / Mascot Illustrations**: The cartoon illustration shapes near the footer/form area in `index-3.html` (`cta-3-shape-1/2/3.png`) are strictly excluded.
   - **Butterfly Elements**: The floating butterfly parallax shapes in `index-12.html` (`blog-shape-1/2.png`) are strictly excluded.

4. **Zero Functionality Regression**:
   - All backend APIs (`/api/v1/...`), authentication cookies, role-based access control (Student, Instructor, Admin, Super Admin), cart persistence, and Stripe checkout engines remain completely intact and active.

---

## 3. Key Design Decisions

### A. Color System
- **Brand Primary**: `#556DF5` (Acadia Royal Indigo)
- **Brand Primary Hover**: `#4056E0`
- **Brand Accent / Highlight**: `#FF7162` / `#FE4D01` (Warm Sunset Coral)
- **Deep Headings**: `#161821` / `#0A1D3A` (Deep Ink Navy)
- **Body Text**: `#57595F` / `#64748B` (Refined Slate)
- **Surface & Backgrounds**:
  - Main background: `#FFFFFF`
  - Soft section tint: `#F8F8FA` / `#FAF9F6`
  - Card background: `#FFFFFF` with `border: 1px solid #EAEBED`
- **Utility / Status**:
  - Success / Discount: `#0F9F55`
  - Warning / Rating: `#FFB21D` (5-star amber)
  - Destructive: `#FF4D4F`

### B. Typography
- **Headings**: `Outfit`, sans-serif (700 / 600 weight, tight letter-spacing) with decorative serif accents (`Marcellus` / `Rufina`) for high-impact editorial subtitles.
- **Body / Navigation**: `Outfit` / `Inter`, sans-serif (400 / 500 weight, relaxed line-height).

### C. Homepage Section Hierarchy
1. **Hybrid Hero**: Left column: Subtitle pill + bold heading with Acadia SVG underline + search bar + CTA buttons + instructor avatar stack ("200+ Instructors") + student counter ("9.4k+ Active Students"). Right column: Featured course preview card with discount pill, instructor tag, and preview trigger. (Blends `index-2.html` & `index-7.html`).
2. **Category Carousel / Grid**: Category pills with icons linking to `/courses?category=[slug]`.
3. **Our Courses (`index-2.html`)**: Tabbed course showcase ("All", "Trending", "Popular", "Featured") rendering dynamic database courses with Acadia course cards.
4. **Value Proposition Grid (`index-11.html`)**: 4 modern feature cards.
5. **Contact / Inquiry Form (`index-3.html`)**: Clean 2-column contact section without cartoon shapes.
6. **Testimonials (`index-11.html`)**: Testimonial cards with quote marks and student reviews.
7. **Latest Articles (`index-12.html`)**: 1 large featured article + 3 horizontal side articles without butterfly shapes.
8. **Global Footer (`index-11.html`)**: 4-column footer with newsletter, branding, quick links, and social channels.

### D. Header & User Menu (Global Shell)
- Top info bar with announcement and contact.
- Sticky main navbar with category explore dropdown, search bar, cart drawer trigger with counter, wishlist.
- **User Authentication Dropdown**: When logged in, shows user avatar, name, email, role badge, portal links (Student Learning / Instructor Studio / Admin Governance), Wishlist, Purchase History, Subscription, Settings, and Sign Out. When logged out, shows "Log in" and "Sign up" buttons.

### E. Course Discovery & Detail
- **Discovery (`/courses`)**: Combined desktop sidebar (`course-with-sidebar.html`) and mobile offcanvas filter drawer (`course-with-filter.html`).
- **Detail (`/courses/[slug]`)**: Rich dark header banner, sticky checkout card (`course-details-3.html`), tabbed navigation, "What You'll Learn" checklist, curriculum accordions, instructor bio, and verified reviews.

### F. Guest-to-Account Intelligent Checkout Flow
- If guest email exists -> Prompt for password / inline login.
- If guest email is new -> Automatically create student account, prompt for password on the checkout screen, and issue order seamlessly.

---

## 4. Phase Execution Roadmap

| Phase | Description | Key Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Design System & Asset Pipeline | Fonts, Tailwind v4 theme tokens in `globals.css`, core UI primitives, asset sync (no cartoons/butterflies). | Ready |
| **Phase 2** | Global Shell (Header, Footer, Drawers) | `PublicNavbar`, `PublicFooter`, `CartDrawer`, `MobileNav`, user dropdown with auth states. | Pending |
| **Phase 3** | Homepage Transformation | Blended Hero (index-2 + index-7), Courses section (index-2), Testimonials (index-11), Contact (index-3), Blog (index-12). | Pending |
| **Phase 4** | Course Discovery & Catalog (`/courses`) | `CourseCard` redesign, desktop sidebar + mobile filter drawer integration. | Pending |
| **Phase 5** | Course Detail Page (`/courses/[slug]`) | Banner, sticky enroll card, tabs, curriculum accordion, instructor card, reviews. | Pending |
| **Phase 6** | Cart, Checkout & Intelligent Auth Flow | Cart page, multi-step checkout with auto-account creation & password prompt, login/signup pages. | Pending |
| **Phase 7** | Student Dashboard & Account Settings | Dashboard layout with sidebar (`tpd-user-sidebar`), learning, certs, orders, settings/password form. | Pending |
| **Phase 8** | Content, Blog & Supporting Pages | Blog list & detail (`blog-details.html`), About, Contact, 404 (`error.html`). | Pending |
| **Phase 9** | Instructor Studio, Admin Polish & Audit | Apply Acadia dashboard styling to Instructor and Admin portals, full build & performance audit. | Pending |
