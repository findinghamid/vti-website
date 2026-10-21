import { Metadata } from "next";

export const SITE_URL = "https://vti-edu.org";
export const SITE_NAME = "Virtual Theological Institute (VTI)";
export const DEFAULT_DESCRIPTION =
  "Non-denominational Urdu Bible learning platform providing accessible, tuition-free theological education, Christian foundational courses, and ministry training. Bible Education for Everyone, Everywhere.";

export interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  canonical?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Standard Next.js Metadata generator complying with Agentic-SEO specifications:
 * - Dynamic Title Template
 * - Concise, compelling Meta Description
 * - Canonical URL tags
 * - OpenGraph & Twitter Card tags
 * - Language alternates (en, ur)
 */
export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "",
  canonical,
  image = "/assets/img/logo/vti-logo.png",
  keywords = [
    "Urdu Bible courses",
    "Virtual Theology Institute",
    "VTI",
    "free Christian theology",
    "Bible Education for Everyone Everywhere",
    "Pakistani Christian education",
    "Urdu Christian ministry",
    "biblical studies",
    "Christian foundational beliefs",
  ],
  type = "website",
}: SeoProps = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Bible Education for Everyone, Everywhere`;
  const effectivePath = canonical || path;
  const canonicalUrl = `${SITE_URL}${effectivePath.startsWith("/") ? effectivePath : `/${effectivePath}`}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  return {
    title: pageTitle,
    description,
    keywords,
    authors: [{ name: "Virtual Theological Institute Faculty" }],
    creator: "Virtual Theological Institute",
    publisher: "Virtual Theological Institute",
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${pageTitle} - Virtual Theological Institute`,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl],
      creator: "@vtiedu",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * JSON-LD Schema Generators for Rich Snippets & Knowledge Graph (E-E-A-T)
 */

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Virtual Theological Institute",
    alternateName: "VTI",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/img/logo/vti-logo.png`,
    slogan: "Bible Education for Everyone, Everywhere",
    description:
      "A non-denominational Urdu Bible learning platform committed to offering Bible courses tailored to the spiritual and educational needs of the Pakistani Christian community and global believers.",
    email: "admissions@vti-edu.org",
    sameAs: [
      "https://facebook.com/vtiedu",
      "https://youtube.com/@vtiedu",
      "https://instagram.com/vtiedu",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
    },
    knowsAbout: [
      "Christian Theology",
      "Urdu Bible Education",
      "Biblical Hermeneutics",
      "Christian Apologetics",
      "Spiritual Growth",
    ],
  };
}

export function generateCourseSchema({
  title,
  description,
  slug,
  instructorName,
  imageUrl,
  category,
}: {
  title: string;
  description: string;
  slug: string;
  instructorName?: string;
  imageUrl?: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: title,
    description: description,
    provider: {
      "@type": "EducationalOrganization",
      name: "Virtual Theological Institute",
      sameAs: SITE_URL,
    },
    url: `${SITE_URL}/courses/${slug}`,
    image: imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `${SITE_URL}${imageUrl}`) : `${SITE_URL}/assets/img/logo/vti-logo.png`,
    offers: {
      "@type": "Offer",
      category: "Free",
      price: "0.00",
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder", // Reflecting Coming Soon status
    },
    educationalLevel: "All Levels",
    about: category || "Christian Theology",
    inLanguage: ["ur", "en"],
    instructor: instructorName
      ? {
          "@type": "Person",
          name: instructorName,
        }
      : undefined,
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
