import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://marketplace.vti.edu";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/courses", "/courses/*", "/bundles", "/bundles/*", "/pricing", "/verify/*"],
        disallow: [
          "/admin",
          "/admin/*",
          "/student",
          "/student/*",
          "/instructor",
          "/instructor/*",
          "/api/*",
          "/cart",
          "/checkout",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
