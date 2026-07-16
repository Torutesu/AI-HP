import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { articles, isoDate, isoPublished } from "@/lib/magazine";

// Generated as a static file (/feed.xml) at build time — same force-static
// pattern as llms.txt. RSS 2.0 from the magazine articles.
export const dynamic = "force-static";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const rfc822 = (isoYmd: string) => new Date(`${isoYmd}T00:00:00Z`).toUTCString();

export function GET() {
  // Newest article date drives lastBuildDate (deterministic — not the deploy time).
  const latest = articles
    .map((a) => isoDate(a))
    .sort()
    .at(-1) as string;

  const items = articles
    .map((a) => {
      const link = `${SITE_URL}/magazine/${a.slug}/`;
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${esc(a.excerpt)}</description>
      <category>${esc(a.category)}</category>
      <pubDate>${rfc822(isoPublished(a))}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE_NAME)} マガジン</title>
    <link>${SITE_URL}/magazine/</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${esc(SITE_DESCRIPTION)}</description>
    <language>ja</language>
    <lastBuildDate>${rfc822(latest)}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
