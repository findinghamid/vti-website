import React from "react";
import { notFound } from "next/navigation";
import { BundleService } from "@/server/services/bundle.service";
import { BundleDetailClient } from "@/components/bundles/BundleDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = await BundleService.getBundleBySlug(slug);

  if (!bundle) {
    return { title: "Bundle Not Found | VTI Marketplace" };
  }

  return {
    title: `${bundle.title} | Curated Course Bundle`,
    description: bundle.description || "Accelerate your mastery with this curated course bundle.",
  };
}

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = await BundleService.getBundleBySlug(slug);

  if (!bundle) {
    notFound();
  }

  return <BundleDetailClient bundle={bundle} />;
}
