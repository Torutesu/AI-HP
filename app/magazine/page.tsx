import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "マガジン",
  description:
    "経営とAIの実装知。グローバル事例の解像度で、貴社の次の一手を、ともに考えます。",
};

const filters = [
  "コスト削減",
  "売上向上",
  "事例・シナリオ",
  "経営・組織",
  "技術トレンド",
];

const articles = [
  {
    category: "コスト削減",
    title: "汎用SaaSの固定費を、内製で1/3にする考え方",
    date: "2026.07.08",
  },
  {
    category: "売上向上",
    title: "営業支援AIで商談の勝率を上げる、3つの実装パターン",
    date: "2026.07.05",
  },
  {
    category: "技術トレンド",
    title: "アプリケーションレイヤーの最新事例と、日本企業への示唆",
    date: "2026.07.02",
  },
  {
    category: "事例・シナリオ",
    title: "製造業の見積工数を半減させた、AI置換の進め方",
    date: "2026.06.28",
  },
  {
    category: "経営・組織",
    title: "AI活用度を役員会で語るための、ROI可視化フレーム",
    date: "2026.06.24",
  },
  {
    category: "コスト削減",
    title: "使われないライセンスを見つける、活用度診断のはじめ方",
    date: "2026.06.20",
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "マガジン" }]}
          eyebrow="MAGAZINE"
          title={<>AI総戦研マガジン</>}
          lead="経営とAIの実装知。グローバル事例の解像度で、貴社の次の一手を、ともに考えます。"
        />

        <section style={{ padding: "64px 0 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#fff",
                  background: "var(--accent)",
                  borderRadius: "999px",
                  padding: "8px 16px",
                }}
              >
                すべて
              </span>
              {filters.map((label) => (
                <span
                  key={label}
                  style={{
                    fontSize: "12.5px",
                    color: "var(--fg-1)",
                    background: "var(--white)",
                    border: "0.5px solid var(--line-strong)",
                    borderRadius: "999px",
                    padding: "8px 16px",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "0 0 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <Reveal>
              <a
                href="#"
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
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
                    <span style={{ fontSize: "12px", color: "var(--fg-3)" }}>
                      経営・組織
                    </span>
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
                    「AIを試した」で止まる会社と、数字が動く会社の違い
                  </h2>
                  <p
                    style={{
                      margin: "0 0 20px",
                      fontSize: "14px",
                      lineHeight: 1.85,
                      color: "var(--fg-2)",
                    }}
                  >
                    PoCの先へ進めない最大の理由は、技術ではなく設計にある。経営の数字から逆算する実装の型を解説する。
                  </p>
                  <span style={{ fontSize: "12.5px", color: "var(--fg-3)" }}>
                    2026.07.10
                  </span>
                </div>
              </a>
            </Reveal>
          </div>
        </section>

        <section style={{ padding: "0 0 96px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div
              className="dc-collapse-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
              }}
            >
              {articles.map((a, i) => (
                <Reveal key={a.title} delay={i * 0.08}>
                  <a
                    href="#"
                    className="hover-panel"
                    style={{
                      display: "block",
                      background: "var(--surface-card)",
                      border: "0.5px solid var(--line-strong)",
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "border-color .2s",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "16/9",
                        background: "linear-gradient(130deg, #F3F6FB, #E9F1FF)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--blue-300)",
                      }}
                    >
                      <Icon name="image" size={32} />
                    </div>
                    <div style={{ padding: "24px 26px" }}>
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "var(--accent)",
                          fontWeight: 600,
                        }}
                      >
                        {a.category}
                      </span>
                      <h3
                        style={{
                          fontSize: "16.5px",
                          fontWeight: 700,
                          lineHeight: 1.5,
                          color: "var(--fg-0)",
                          margin: "10px 0 14px",
                        }}
                      >
                        {a.title}
                      </h3>
                      <span style={{ fontSize: "12px", color: "var(--fg-3)" }}>
                        {a.date}
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "44px",
              }}
            >
              <Button variant="secondary" size="md">
                もっと読む
              </Button>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
