import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { articles, getArticle, isoDate, isoPublished } from "@/lib/magazine";
import { SITE_URL as SITE } from "@/lib/site";

const abs = (p: string) => (p.startsWith("http") ? p : `${SITE}${p.startsWith("/") ? "" : "/"}${p}`);
const DEFAULT_IMAGE = `${SITE}/logo-mark.png`;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const url = `${SITE}/magazine/${a.slug}/`;
  const image = a.image ? abs(a.image) : DEFAULT_IMAGE;
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.excerpt,
      url,
      publishedTime: isoPublished(a),
      modifiedTime: isoDate(a),
      section: a.category,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.excerpt, images: [image] },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const iso = isoPublished(a);
  const url = `${SITE}/magazine/${a.slug}/`;
  const image = a.image ? abs(a.image) : DEFAULT_IMAGE;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    image: [image],
    datePublished: isoPublished(a),
    dateModified: isoDate(a),
    articleSection: a.category,
    inLanguage: "ja",
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "AI総合戦略研究所 編集部", url: `${SITE}/editorial-policy/` },
    publisher: {
      "@type": "Organization",
      name: "AI総合戦略研究所",
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/logo-mark.png` },
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "マガジン", item: `${SITE}/magazine/` },
      { "@type": "ListItem", position: 3, name: a.title, item: url },
    ],
  };

  const related = articles.filter((x) => x.slug !== a.slug && x.category === a.category).slice(0, 2);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        {/* Article header */}
        <section style={{ position: "relative", overflow: "hidden", background: "#05070c" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: "radial-gradient(64% 82% at 78% -6%, rgba(43,124,255,0.20), transparent 58%)",
            }}
          />
          <div style={{ position: "relative", maxWidth: "820px", margin: "0 auto", padding: "108px 24px 72px" }}>
            <nav style={{ fontSize: "12.5px", color: "rgba(255,255,255,.5)", marginBottom: "24px" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,.62)" }}>ホーム</Link>
              {" ／ "}
              <Link href="/magazine" style={{ color: "rgba(255,255,255,.62)" }}>マガジン</Link>
              {" ／ "}
              <span style={{ color: "rgba(255,255,255,.75)" }}>{a.title}</span>
            </nav>
            <div
              style={{
                display: "inline-block",
                fontSize: "11.5px",
                fontWeight: 600,
                color: "#fff",
                background: "var(--blue-600)",
                borderRadius: "999px",
                padding: "4px 12px",
                marginBottom: "18px",
              }}
            >
              {a.category}
            </div>
            <h1
              style={{
                fontSize: "clamp(26px, 4.4vw, 40px)",
                fontWeight: 700,
                lineHeight: 1.4,
                letterSpacing: "-0.02em",
                color: "#fff",
                margin: "0 0 18px",
              }}
            >
              {a.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="/editorial-policy/"
                style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,.85)" }}
              >
                AI総戦研 編集部
              </Link>
              <span style={{ color: "rgba(255,255,255,.3)" }}>·</span>
              <time dateTime={iso} style={{ fontSize: "13px", color: "rgba(255,255,255,.6)" }}>
                {a.updatedAt ? `${a.updatedAt} 更新` : a.date}
              </time>
            </div>
          </div>
        </section>

        {/* Body — blocks follow the conventions documented on Article.body */}
        <article style={{ maxWidth: "820px", margin: "0 auto", padding: "56px 24px 72px" }}>
          {a.body.map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    lineHeight: 1.5,
                    letterSpacing: "-0.01em",
                    color: "var(--fg-0)",
                    margin: i === 0 ? "0 0 18px" : "44px 0 18px",
                    paddingLeft: "14px",
                    borderLeft: "3px solid var(--blue-600)",
                  }}
                >
                  {block.slice(3)}
                </h2>
              );
            }
            if (block.startsWith("- ")) {
              return (
                <ul key={i} style={{ margin: "0 0 28px", paddingLeft: "1.4em" }}>
                  {block.split("\n").map((item, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: "16px",
                        lineHeight: 1.9,
                        color: "var(--fg-1)",
                        marginBottom: "8px",
                      }}
                    >
                      {item.replace(/^- /, "")}
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.startsWith("※")) {
              return (
                <p
                  key={i}
                  style={{
                    fontSize: "12.5px",
                    lineHeight: 1.8,
                    color: "var(--fg-3)",
                    margin: "-16px 0 28px",
                  }}
                >
                  {block}
                </p>
              );
            }
            return (
              <p
                key={i}
                style={{
                  fontSize: "16px",
                  lineHeight: 2,
                  color: "var(--fg-1)",
                  margin: "0 0 28px",
                }}
              >
                {block}
              </p>
            );
          })}

          <div style={{ marginTop: "8px", paddingTop: "32px", borderTop: "0.5px solid var(--line-strong)" }}>
            <Link
              href="/magazine"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "var(--accent)" }}
            >
              <Icon name="arrow-right" size={16} />マガジン一覧へ戻る
            </Link>
          </div>
        </article>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ padding: "0 0 64px" }}>
            <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--fg-0)", marginBottom: "16px" }}>
                関連する記事
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/magazine/${r.slug}`}
                    className="hover-panel"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                      background: "var(--surface-card)",
                      border: "0.5px solid var(--line-strong)",
                      borderRadius: "10px",
                      padding: "18px 22px",
                      transition: "border-color .2s",
                    }}
                  >
                    <span style={{ fontSize: "14.5px", fontWeight: 600, color: "var(--fg-0)" }}>{r.title}</span>
                    <span style={{ flex: "none", color: "var(--accent)" }}><Icon name="arrow-right" size={16} /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section style={{ padding: "0 0 96px" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px" }}>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "12px",
                border: "0.5px solid var(--panel-border)",
                background: "var(--panel-grad)",
                padding: "40px 40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--fg-0)", margin: "0 0 8px" }}>
                  貴社の一手を、数字で。
                </h2>
                <p style={{ margin: 0, fontSize: "14px", color: "var(--fg-2)", lineHeight: 1.8 }}>
                  無料のAI経営診断から、はじめられます。
                </p>
              </div>
              <Button href="/contact" variant="primary" size="lg">無料相談する</Button>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
