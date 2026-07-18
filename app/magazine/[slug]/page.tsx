import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { articles, publishedArticles, getArticle, isPublished, isoDate, isoPublished } from "@/lib/magazine";
import { SITE_URL as SITE } from "@/lib/site";
import styles from "./article.module.css";

const abs = (p: string) => (p.startsWith("http") ? p : `${SITE}${p.startsWith("/") ? "" : "/"}${p}`);
const DEFAULT_IMAGE = `${SITE}/logo-mark.png`;

const linkStyle = {
  color: "var(--accent)",
  fontWeight: 600,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  textDecorationThickness: "0.5px",
} as const;

// Render body text with inline markdown links "[label](/magazine/slug)".
// Internal (root-relative) links use next/link; external ones a plain anchor.
function renderInline(text: string): ReactNode {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    parts.push(
      href.startsWith("/") ? (
        <Link key={key++} href={href} style={linkStyle}>
          {label}
        </Link>
      ) : (
        <a key={key++} href={href} style={linkStyle} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ),
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length > 0 ? parts : text;
}

function visualInsertIndex(body: string[]): number {
  const firstList = body.findIndex((block, i) => i > 0 && block.startsWith("- "));
  if (firstList >= 0) return firstList;

  const firstHeading = body.findIndex((block) => block.startsWith("## "));
  if (firstHeading >= 0) return Math.min(firstHeading + 2, body.length - 1);

  return Math.min(2, body.length - 1);
}

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
    // Drafts are previewable by URL but must not be indexed until approved.
    ...(isPublished(a) ? {} : { robots: { index: false, follow: false } }),
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

  const faqLd = a.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: a.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  // Topic-cluster internal links: curated `related` first (may cross category),
  // topped up with same-category articles, deduped, capped at 3.
  const curated = (a.related ?? [])
    .map(getArticle)
    .filter((x): x is NonNullable<typeof x> => Boolean(x) && isPublished(x!));
  const seen = new Set([a.slug, ...curated.map((x) => x.slug)]);
  const byCategory = publishedArticles.filter((x) => !seen.has(x.slug) && x.category === a.category);
  const related = [...curated, ...byCategory].slice(0, 3);
  const insertVisualAfter = visualInsertIndex(a.body);
  const articleHeadings = a.body
    .filter((block) => block.startsWith("## "))
    .map((block) => block.slice(3))
    .slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <SiteHeader variant="solid" />
      {!isPublished(a) && (
        <div
          style={{
            background: "#7a2e00",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            textAlign: "center",
            padding: "8px 16px",
          }}
        >
          レビュー中の下書きです（未公開・検索非対象）。公開前に人間のレビューが必要です。
        </div>
      )}
      <div style={{ background: "var(--white)" }}>
        {/* Article header */}
        <section style={{ position: "relative", overflow: "hidden", background: "#05070c" }}>
          {a.image ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${a.image})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                opacity: 0.22,
              }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(5,7,12,0.72), rgba(5,7,12,0.9))",
            }}
          />
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
        <article className={styles.articleBody}>
          {a.summary && (
            <section className={styles.summaryPanel}>
              <span className={styles.summaryImage} style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
              <span className={styles.summaryOverlay} aria-hidden="true" />
              <div className={styles.summaryContent}>
                <span className={styles.summaryEyebrow}>SHORT ANSWER</span>
                <h2 className={styles.summaryTitle}>この記事の結論</h2>
                <p className={styles.summaryText}>{renderInline(a.summary)}</p>
              </div>
            </section>
          )}
          {a.body.map((block, i) => {
            const visualBreak = i === insertVisualAfter && a.image ? (
              <aside key={`visual-${i}`} className={styles.articleVisual}>
                <div
                  className={styles.articleVisualImage}
                  style={{ backgroundImage: `url(${a.image})` }}
                  aria-hidden="true"
                />
                <div className={styles.articleVisualCaption}>
                  <span>{a.category}</span>
                  <p>{articleHeadings[0] ?? a.title}</p>
                  {articleHeadings.length > 1 && (
                    <div className={styles.articleVisualChips} aria-label="記事の主な論点">
                      {articleHeadings.map((heading) => (
                        <em key={heading}>{heading}</em>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            ) : null;

            if (block.startsWith("## ")) {
              return [
                <h2
                  key={i}
                  className={styles.proseHeading}
                >
                  {block.slice(3)}
                </h2>,
                visualBreak,
              ];
            }
            if (block.startsWith("- ")) {
              return [
                <ul key={i} className={styles.proseList}>
                  {block.split("\n").map((item, j) => (
                    <li key={j}>
                      {renderInline(item.replace(/^- /, ""))}
                    </li>
                  ))}
                </ul>,
                visualBreak,
              ];
            }
            if (block.startsWith("※")) {
              return [
                <p key={i} className={styles.proseNote}>{block}</p>,
                visualBreak,
              ];
            }
            return [
              <p key={i} className={styles.proseParagraph}>
                {renderInline(block)}
              </p>,
              visualBreak,
            ];
          })}

          {a.faq && a.faq.length > 0 && (
            <div style={{ marginTop: "48px", paddingTop: "40px", borderTop: "0.5px solid var(--line-strong)" }}>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  lineHeight: 1.5,
                  letterSpacing: "-0.01em",
                  color: "var(--fg-0)",
                  margin: "0 0 24px",
                }}
              >
                よくある質問
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {a.faq.map((f, i) => (
                  <details
                    key={i}
                    style={{
                      background: "var(--surface-card)",
                      border: "0.5px solid var(--line-strong)",
                      borderRadius: "10px",
                      padding: "18px 22px",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        fontSize: "15.5px",
                        fontWeight: 600,
                        color: "var(--fg-0)",
                        lineHeight: 1.6,
                        listStyle: "none",
                      }}
                    >
                      Q. {f.q}
                    </summary>
                    <p
                      style={{
                        margin: "14px 0 0",
                        fontSize: "15px",
                        lineHeight: 1.95,
                        color: "var(--fg-1)",
                      }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

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
                    className="hover-panel magazine-motion-card"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "160px 1fr auto",
                      gap: "16px",
                      background: "var(--surface-card)",
                      border: "0.5px solid var(--line-strong)",
                      borderRadius: "10px",
                      padding: "12px",
                      transition: "border-color .2s",
                    }}
                  >
                    <div
                      className="magazine-motion-image"
                      style={{
                        minHeight: "96px",
                        borderRadius: "8px",
                        backgroundImage: `linear-gradient(180deg, rgba(5, 7, 12, 0.04), rgba(5, 7, 12, 0.18)), url(${r.image})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    />
                    <div style={{ alignSelf: "center", padding: "8px 0" }}>
                      <div style={{ fontSize: "11.5px", color: "var(--accent)", fontWeight: 600, marginBottom: "8px" }}>
                        {r.category}
                      </div>
                      <span style={{ fontSize: "14.5px", fontWeight: 600, color: "var(--fg-0)", lineHeight: 1.6 }}>{r.title}</span>
                    </div>
                    <span className="magazine-motion-arrow" style={{ flex: "none", color: "var(--accent)" }}><Icon name="arrow-right" size={16} /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <div className={styles.ctaPanel}>
              <span className={styles.ctaImage} aria-hidden="true" />
              <span className={styles.ctaOverlay} aria-hidden="true" />
              <div className={styles.ctaCopy}>
                <span className={styles.ctaEyebrow}>FREE AI BUSINESS DIAGNOSIS</span>
                <h2 className={styles.ctaTitle}>貴社の一手を、<br />数字で。</h2>
                <p className={styles.ctaText}>
                  コスト削減余地と売上の伸びしろを整理し、<br className={styles.desktopBreak} />経営会議で使える次の一手をご提案します。
                </p>
                <div className={styles.ctaPoints} aria-label="診断でわかること">
                  <span>削減余地</span>
                  <span>売上余地</span>
                  <span>実行優先度</span>
                </div>
              </div>
              <div className={styles.ctaAction}>
                <span className={styles.ctaActionLabel}>CONSULTATION / FREE</span>
                <Button href="/contact" variant="secondary" size="lg" className={styles.ctaButton}>
                  無料相談する<Icon name="arrow-right" size={17} />
                </Button>
                <span className={styles.ctaNote}>相談内容が固まっていなくても構いません</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
