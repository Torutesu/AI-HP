import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { publishedArticles, isoDate } from "@/lib/magazine";

export const dynamic = "force-static";

// Fixed dates — hard-coded on purpose so a deploy never stamps every page as
// "updated today". Bump a page's date here only when its content actually
// changes. Article pages derive lastModified from the article data instead.
const STATIC_LASTMOD: Record<string, string> = {
  "": "2026-07-16",
  "/service": "2026-07-16",
  "/cases": "2026-07-16",
  "/ai-os": "2026-07-16",
  "/consulting": "2026-07-16",
  "/partners": "2026-07-22",
  "/company": "2026-07-16",
  "/magazine": "2026-07-16",
  "/contact": "2026-07-15",
  "/download": "2026-07-15",
  "/privacy": "2026-07-15",
  "/editorial-policy": "2026-07-16",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = Object.entries(STATIC_LASTMOD).map(([r, lastModified]) => ({
    url: `${SITE_URL}${r}/`,
    lastModified,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = publishedArticles.map((a) => ({
    url: `${SITE_URL}/magazine/${a.slug}/`,
    lastModified: isoDate(a), // article's updatedAt ?? date — never the deploy date
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
