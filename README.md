# VTI Marketplace LMS
> **Commercial-Grade Learning Marketplace + Enterprise LMS Platform**  
> Built with Next.js 15+, TypeScript, TanStack Query, Redux Toolkit, Tailwind CSS, and PostgreSQL (Prisma).

---

## 🚀 Overview
**VTI Marketplace LMS** is an enterprise-scale education platform combining the high-converting consumer marketplace dynamics of platforms like **Udemy** with the governance, compliance, and learning administration of an enterprise Learning Management System (LMS).

Designed with a **white-label first, API-first architecture**, the core engine can be rebranded and adapted for multiple educational institutions, enterprises, or commercial course marketplaces.

---

## 🏛️ Architecture Highlights
- **Framework**: Next.js 15+ (App Router) with React Server Components for SEO and Client Components for rich interactivity.
- **Data & Persistence**: PostgreSQL with Prisma ORM (modular domain schema spanning Identity, Courses, Curriculum, Progress, Commerce, Reviews, and Support).
- **Dual State Architecture**:
  - **TanStack Query**: Server-state synchronization, caching, pagination, and optimistic updates.
  - **Redux Toolkit**: Client-only UI state (interactive course player progress, offline cart drawer state, multi-stage course builder drafts).
- **Design System**: Tailored, accessible (WCAG compliant) design system using Tailwind CSS and shadcn/ui.
- **Security & Integrity**:
  - Server-authoritative pricing, coupon validation, enrollment, and quiz scoring.
  - Two-person rule: Administrative deletion request and approval workflow with immutable audit logging.
  - Pluggable payment and media storage adapters (Stripe, PayPal, Local Disk, AWS S3 / Cloudflare R2).

---

## 📚 Complete Project Documentation
Comprehensive living documentation is maintained in the [`/docs`](file:///d:/VTI/docs) directory:
- [**Project State & Session Handoff**](file:///d:/VTI/PROJECT_STATE.md) — Real-time development status and next steps.
- [**Architecture Specification**](file:///d:/VTI/docs/ARCHITECTURE.md) — System topology, domain separation, and API design.
- [**Database & Domain Models**](file:///d:/VTI/docs/DATABASE_SPEC.md) — PostgreSQL Prisma schema, ERD, and relational integrity.
- [**Master Roadmap & Tasks**](file:///d:/VTI/docs/ROADMAP.md) — 15 Milestones broken into session-sized tasks.
- [**Requirements Traceability Matrix**](file:///d:/VTI/docs/TRACEABILITY_MATRIX.md) — 79-page PDF specification mapping.
- [**Quality Assurance & Testing**](file:///d:/VTI/docs/QUALITY_AND_TESTING.md) — Testing pyramid and mandatory E2E flows.
- [**Documentation & Commercial Presentation**](file:///d:/VTI/docs/DOCUMENTATION_STRATEGY.md) — Upwork and client showcase standards.

---

## 🚦 Project Lifecycle & Multi-Session Development
This project is systematically developed across independent AI engineering sessions following strict dependency ordering.

Current Status: **Milestone 1 Ready to Begin** (See [`PROJECT_STATE.md`](file:///d:/VTI/PROJECT_STATE.md)).
