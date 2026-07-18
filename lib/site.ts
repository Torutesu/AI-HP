// Canonical site origin. Drives every absolute URL on the site: metadataBase
// (OG/canonical), per-page canonicals, sitemap.xml, robots.txt, feed.xml,
// llms.txt and the JSON-LD (Article/Organization/breadcrumb). The fallback is
// the live production domain, so canonicals are correct even if the env var is
// unset. Override with NEXT_PUBLIC_SITE_URL in the Cloudflare Pages environment
// when a custom domain is connected (set it to that domain, no trailing slash).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ai-hp.pages.dev"
).replace(/\/$/, "");

export const SITE_NAME = "AI総合戦略研究所";
export const SITE_NAME_EN = "AI Strategy Institute";
export const SITE_DESCRIPTION =
  "AIを「試して終わり」にさせません。戦略設計から内製AI開発まで、コスト削減・売上向上・利益率改善という経営の数字が動くところまで伴走する、実装型のAIパートナーです。";

// External media assets, centralized so self-hosting later is a one-place swap.
// Drop the file into public/ (e.g. public/media/hero.mp4) and change the URL to
// the local path ("/media/hero.mp4"). The current CDN is hotlink-protected, so
// the files can't be fetched server-side — the real files need to be supplied.
export const HERO_VIDEO_URL =
  "https://cdn.sceneai.art/Hero Section Video/c0429648-6382-40e5-977a-be50ff2af8d5.mp4";

export const PARTNER_LOGOS: { alt: string; src: string }[] = [
  { alt: "Tesla", src: "https://cdn.sceneai.art/logos/67179a5f-501b-48c1-a6b6-8f4f3c676ba4.png" },
  { alt: "Perplexity", src: "https://cdn.sceneai.art/logos/5360e43f-332b-40b0-84de-db847c00fae6.png" },
  { alt: "NASA", src: "https://cdn.sceneai.art/logos/9a17d5b4-0ad2-44b6-832f-b46153f7b156.png" },
  { alt: "NVIDIA", src: "https://cdn.sceneai.art/logos/23385a15-55a1-405a-accd-51abf2f987cf.png" },
  { alt: "Google", src: "https://cdn.sceneai.art/logos/bdb8a52e-00a4-4fb1-8ab2-c07977e5dc72.png" },
];
