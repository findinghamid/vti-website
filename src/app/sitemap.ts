import { MetadataRoute } from "next";
import { BundleService } from "@/server/services/bundle.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://marketplace.vti.edu";
  const now = new Date();

  // Core static marketplace pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bundles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Dynamic curated bundles
  const bundles = await BundleService.getAllBundles();
  const bundleRoutes: MetadataRoute.Sitemap = bundles.map((bundle) => ({
    url: `${baseUrl}/bundles/${bundle.slug}`,
    lastModified: new Date(bundle.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Standard demo courses
  const demoCourses = [
    "mastering-nextjs-16-typescript-enterprise-architecture",
    "cloud-infrastructure-docker-kubernetes-aws",
    "modern-web-foundations-html-css-javascript",
    "nextjs-16-enterprise-architecture",
    "aws-cloud-native-microservices",
    "fullstack-typescript-tanstack",
  ];

  const courseRoutes: MetadataRoute.Sitemap = demoCourses.map((slug) => ({
    url: `${baseUrl}/courses/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...bundleRoutes, ...courseRoutes];
}
