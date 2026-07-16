import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import MagazineList from "@/components/MagazineList";
import { CATEGORIES, featuredArticle, listArticles } from "@/lib/magazine";

export const metadata: Metadata = {
  alternates: { canonical: "/magazine/" },
  title: "マガジン",
  description:
    "経営とAIの実装知。グローバル事例の解像度で、貴社の次の一手を、ともに考えます。",
};

export default function Page() {
  const f = featuredArticle;
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "マガジン" }]}
          title={<>AI総戦研マガジン</>}
          lead="経営とAIの実装知。グローバル事例の解像度で、貴社の次の一手を、ともに考えます。"
        />

        {/* Featured */}
        <section style={{ padding: "56px 0 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <Reveal>
              <Link
                href={`/magazine/${f.slug}`}
                className="hover-panel dc-collapse"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 0.9fr",
                  gap: "40px",
                  alignItems: "center",
                  background: "var(--surface-card)",
                  border: "0.5px solid var(--line-strong)",
                  borderRadius: "12px",
                  padding: "12px",
                  transition: "border-color .2s",
                }}
              >
                <div
                  style={{
                    aspectRatio: "16/10",
                    borderRadius: "8px",
                    background: "linear-gradient(130deg, #EEF4FF, #D7E4FE)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                  }}
                >
                  <Icon name="image" size={40} />
                </div>
                <div style={{ padding: "20px 32px 20px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#fff",
                        background: "var(--accent)",
                        borderRadius: "999px",
                        padding: "4px 11px",
                      }}
                    >
                      PICK UP
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--fg-3)" }}>{f.category}</span>
                  </div>
                  <h2
                    style={{
                      fontSize: "26px",
                      fontWeight: 700,
                      lineHeight: 1.4,
                      color: "var(--fg-0)",
                      letterSpacing: "-0.01em",
                      margin: "0 0 14px",
                    }}
                  >
                    {f.title}
                  </h2>
                  <p style={{ margin: "0 0 20px", fontSize: "14px", lineHeight: 1.85, color: "var(--fg-2)" }}>
                    {f.excerpt}
                  </p>
                  <span style={{ fontSize: "12.5px", color: "var(--fg-3)" }}>{f.date}</span>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* List with working filter + load-more */}
        <section style={{ padding: "0 0 96px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <MagazineList articles={listArticles} categories={CATEGORIES} />
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
