import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/service/" },
  title: "サービス",
  description:
    "貴社の事業を紐解き、コストを整え、売上を伸ばす。診断・設計・開発・改善までを、一気通貫でご支援します。",
};

const cards = [
  {
    href: "/ai-os",
    icon: "layout-grid",
    eyebrow: "AI OS",
    title: "AI経営基盤",
    body: "売上UP × コストDOWN × 利益率UP。儲けの方程式を、貴社専属のAIとして内製する。削減の層と向上の層、両面から経営の数字を動かす。",
    tags: ["SaaS代替", "業務自動化", "売上支援AI"],
  },
  {
    href: "/consulting",
    icon: "compass",
    eyebrow: "CONSULTING",
    title: "コンサルティング",
    body: "戦略コンサルのように、商売そのものから入る。可視化・診断から改善の伴走まで。研修では終わらせない、成果に紐づく最適化を続ける。",
    tags: ["AI経営診断", "ロードマップ設計", "改善伴走"],
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "サービス" }]}
          title={
            <>
              戦略から、内製AIまで。<br />ひとつのチームで。
            </>
          }
          lead="貴社の事業を紐解き、コストを整え、売上を伸ばす。診断・設計・開発・改善までを、一気通貫でご支援します。"
          bgImage="/img/service/hero.jpg"
        />

        <section style={{ padding: "96px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div
              className="dc-collapse"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
            >
              {cards.map((card, i) => (
                <Reveal
                  key={card.href}
                  delay={i * 0.08}
                  className="hover-panel"
                  style={{
                    display: "block",
                    background: "var(--surface-card)",
                    border: "0.5px solid var(--line-strong)",
                    borderRadius: "12px",
                    padding: "44px 42px",
                    transition: "border-color .2s",
                  }}
                >
                  <a href={card.href} style={{ display: "block" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "54px",
                        height: "54px",
                        borderRadius: "10px",
                        border: "0.5px solid var(--line-strong)",
                        background: "var(--blue-tint)",
                        color: "var(--accent)",
                        marginBottom: "24px",
                      }}
                    >
                      <Icon name={card.icon} size={28} />
                    </span>
                    <h2
                      style={{
                        fontSize: "26px",
                        fontWeight: 700,
                        color: "var(--fg-0)",
                        letterSpacing: "-0.01em",
                        margin: "0 0 14px",
                      }}
                    >
                      {card.title}
                    </h2>
                    <p
                      style={{
                        margin: "0 0 22px",
                        fontSize: "14px",
                        lineHeight: 1.9,
                        color: "var(--fg-2)",
                      }}
                    >
                      {card.body}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "24px",
                      }}
                    >
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "12px",
                            color: "var(--fg-1)",
                            background: "var(--white)",
                            border: "0.5px solid var(--line-strong)",
                            borderRadius: "999px",
                            padding: "6px 13px",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--accent)",
                      }}
                    >
                      詳細を見る
                      <Icon name="arrow-right" size={16} />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "24px 0 96px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <Reveal
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "12px",
                border: "0.5px solid var(--panel-border)",
                background: "var(--panel-grad)",
                padding: "56px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "32px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "var(--fg-0)",
                    margin: "0 0 10px",
                  }}
                >
                  どちらが合うか、診断から。
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14.5px",
                    color: "var(--fg-2)",
                    lineHeight: 1.8,
                  }}
                >
                  貴社の状況に合わせて、最適な入り口をご提案します。
                </p>
              </div>
              <Button href="/download" variant="primary" size="lg">
                資料をダウンロード
              </Button>
            </Reveal>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
