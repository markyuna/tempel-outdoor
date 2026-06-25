import type { MetadataRoute } from "next";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { SITE_URL, locales } from "@/lib/seo";

const STATIC_PATHS = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/a-propos", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/realisations", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/bien-etre", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/bien-etre/spa", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/bien-etre/sauna", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/loisirs/baby-foot", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/loisirs/billard", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/fitness", priority: 0.9, changeFrequency: "weekly" as const },
];

function hreflangAlternates(path: string) {
  return Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`]));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority, changeFrequency } of STATIC_PATHS) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages: hreflangAlternates(path) },
      });
    }
  }

  const { data: products } = await supabaseAdmin
    .from("products")
    .select("slug, updated_at")
    .eq("status", "active");

  for (const product of products ?? []) {
    const productPath = `/products/${product.slug}`;
    const lastModified = product.updated_at ? new Date(product.updated_at) : new Date();

    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${productPath}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages: hreflangAlternates(productPath) },
      });
    }
  }

  return entries;
}
