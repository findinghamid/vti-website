# Acadia Design System — Tokens & Styling Reference

This document defines the design tokens extracted from the **Acadia HTML5 Template** (`index-11.html` + `index-12.html`) and their direct mapping into **Next.js 16 + Tailwind CSS v4**.

---

## 1. Color Palette

### Core Brand Colors
| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| `--color-primary` | `#556DF5` | Primary brand color (buttons, active tabs, links, accent highlights) |
| `--color-primary-hover` | `#4056E0` | Hover state for primary buttons and interactive elements |
| `--color-accent` | `#FF7162` | Coral accent for highlight badges, notification pills, underline SVGs |
| `--color-accent-orange` | `#FE4D01` | Secondary bright accent for tags and star ratings |
| `--color-heading` | `#161821` | High-contrast heading text (titles, card titles, hero headers) |
| `--color-heading-navy` | `#0A1D3A` | Deep navy heading variant for breadcrumbs and dark footers |
| `--color-body` | `#57595F` | Main body copy, lesson descriptions, subtitle paragraphs |
| `--color-muted` | `#84807B` | Secondary muted text, dates, review counts |
| `--color-border` | `#EAEBED` | Standard card borders, divider lines, inputs |
| `--color-border-subtle` | `#F1F3F9` | Inner dividers, table borders |
| `--color-bg-light` | `#F8F8FA` | Neutral soft background for alternate homepage sections |
| `--color-bg-parchment` | `#FAF9F6` | Warm parchment background (derived from `index-12.html`) |

### Status & Feedback Colors
| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `--color-success` | `#0F9F55` | Discount pills, verified badges, completed lessons |
| `--color-warning` | `#FFB21D` | Star ratings, best-seller badges, pending moderation |
| `--color-danger` | `#FF4D4F` | Error states, cancel subscription, destructive actions |
| `--color-info` | `#5974FF` | Informational callouts, active filters |

---

## 2. Typography

### Font Families
1. **Heading Font**: `Outfit`, sans-serif
   - Google Font: `https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap`
   - Characteristics: Geometric, approachable, highly legible at large scales.
2. **Body Font**: `Outfit` / `Inter`, sans-serif
   - Google Font: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`
   - Characteristics: Optimal micro-legibility for curriculum lists, pricing, and metadata.
3. **Editorial Accent Font**: `Marcellus` or `Rufina`, serif
   - Used sparingly for italicized or stylized subtitle accents in hero/section headings.

### Scale & Spacing
- Hero Headline: `clamp(2.5rem, 5vw, 4rem)` (40px - 64px), line-height: 1.15, tracking: -0.02em
- Section Title: `2.25rem` (36px), line-height: 1.25, tracking: -0.015em
- Card Title: `1.125rem` (18px), line-height: 1.4, font-weight: 700
- Body Text: `1rem` (16px), line-height: 1.6, font-weight: 400
- Small / Metadata: `0.8125rem` (13px), line-height: 1.5, font-weight: 500

---

## 3. Radii, Shadows & Elevations

### Border Radius
- `radius-sm`: `6px` (tags, badge pills)
- `radius-md`: `10px` (inputs, select menus, buttons)
- `radius-lg`: `16px` (course cards, feature cards, modal dialogs)
- `radius-xl`: `24px` (hero banners, testimonial boxes)
- `radius-full`: `9999px` (avatar circles, round pill buttons)

### Box Shadows
- `shadow-subtle`: `0 2px 8px rgba(0, 0, 0, 0.04)`
- `shadow-card`: `0 6px 20px rgba(0, 0, 0, 0.05)`
- `shadow-card-hover`: `0 14px 35px rgba(0, 0, 0, 0.09)`
- `shadow-dropdown`: `0 10px 40px rgba(0, 0, 0, 0.12)`

---

## 4. Acadia Decorative Vectors
Acadia uses signature SVG shapes that must be included:
1. `hero-2-svg-1.svg` / `course-2-svg-1.svg`: The playful curved underline SVG that sits directly beneath highlighted words (e.g. `Online` or `Courses`).
2. `queto.png` / `quote.svg`: The decorative quotation mark behind testimonials.
3. Overlapping avatar ring style for instructor & student social proof (`tp-hero-6-user-thumb`).
