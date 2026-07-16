import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { articles } from "@/lib/magazine";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/service",
    "/cases",
    "/ai-os",
    "/consulting",
    "/company",
    "/magazine",
    "/contact",
    "/download",
    "/privacy",
  ];

  const pages: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${SITE_URL}${r}/`,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/magazine/${a.slug}/`,
    lastModified: a.date.replace(/\./g, "-"),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
