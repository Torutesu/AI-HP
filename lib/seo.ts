import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./site";

export const HOME_TITLE = "AI総研｜AI導入支援・AIコンサルティング";
export const SOCIAL_IMAGE = "/social/brand-og-20260905.jpg";

// Next.js shallow-merges metadata: each route must own its entire social block.
export function buildPageMetadata({
  title, description = SITE_DESCRIPTION, path,
}: { title: string; description?: string; path: string }): Metadata {
  const url = new URL(path, SITE_URL).href;
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website", locale: "ja_JP", siteName: SITE_NAME,
      title: fullTitle, description, url,
      images: [{ url: SOCIAL_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} — AIを、たしかな経営成果へ。` }],
    },
    twitter: {
      card: "summary_large_image", site: "@AIsouseiken", creator: "@AIsouseiken",
      title: fullTitle, description, images: [SOCIAL_IMAGE],
    },
  };
}
