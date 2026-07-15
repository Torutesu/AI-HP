import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会社概要",
  description:
    "AI Nativeといえば、AI総戦研。試すだけで終わらせず、経営の数字が動く形で企業に実装します。",
};

const cards = [
  {
    icon: "flag",
    eyebrow: "MISSION",
    title: "AI Native企業を産み出す",
    body: "実験で止めない。経営の数字が動く企業へと、実装で押し上げる。",
    bodyColor: "var(--fg-2)",
    style: {
      background: "var(--surface-card)",
      border: "0.5px solid var(--line-strong)",
      borderRadius: "12px",
      padding: "34px 32px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },
  },
  {
    icon: "crosshair",
    eyebrow: "POSITION",
    title: "実装型AIパートナー",
    body: "戦略から内製AIまで、貴社専属のSIerとして汗をかく。",
    bodyColor: "var(--fg-2)",
    style: {
      background: "var(--surface-card)",
      border: "0.5px solid var(--line-strong)",
      borderRadius: "12px",
      padding: "34px 32px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },
  },
  {
    icon: "handshake",
    eyebrow: "PROMISE",
    title: "絶対に、元を取ってもらう",
    body: "まず削減から、次に売上へ。投資に必ずリターンを返す。",
    bodyColor: "var(--fg-1)",
    style: {
      border: "0.5px solid var(--panel-border)",
      borderRadius: "12px",
      padding: "34px 32px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
      backgroundImage: "linear-gradient(120deg, #F4F8FF, #FFFFFF)",
    },
  },
];

const companyRows = [
  { label: "会社名", value: "AI総合戦略研究所（略称：AI総戦研）", valueColor: "var(--fg-1)", lineHeight: undefined },
  { label: "英名", value: "AI Strategy Institute", valueColor: "var(--fg-1)", lineHeight: undefined },
  {
    label: "事業内容",
    value: "AI経営基盤（AI OS）の提供、AI活用コンサルティング、内製AIの設計・開発",
    valueColor: "var(--fg-1)",
    lineHeight: "1.8",
  },
  { label: "設立", value: "（記載準備中）", valueColor: "var(--fg-3)", lineHeight: undefined },
  { label: "代表者", value: "（記載準備中）", valueColor: "var(--fg-3)", lineHeight: undefined },
  { label: "所在地", value: "（記載準備中）", valueColor: "var(--fg-3)", lineHeight: undefined },
];

export default function Page() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "会社概要" }]}
          eyebrow="ABOUT"
          title={
            <>
              AI Native企業を、<br />産み出す。
            </>
          }
          lead="AI Nativeといえば、AI総戦研。試すだけで終わらせず、経営の数字が動く形で企業に実装します。"
        />

        <section
          style={{
            padding: "96px 0",
            background: "var(--ink-900)",
            borderBottom: "0.5px solid var(--line-strong)",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div
              className="dc-collapse-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
              }}
            >
              {cards.map((card, i) => (
                <Reveal key={card.eyebrow} delay={i * 0.08} style={card.style}>
                  <span style={{ color: "var(--accent)" }}>
                    <Icon name={card.icon} size={26} />
                  </span>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      color: "var(--accent)",
                    }}
                  >
                    {card.eyebrow}
                  </div>
                  <div style={{ fontSize: "19px", fontWeight: 700, color: "var(--fg-0)" }}>
                    {card.title}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      lineHeight: "1.85",
                      color: card.bodyColor,
                    }}
                  >
                    {card.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "96px 0" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
            <Reveal>
              <SectionHeading eyebrow="COMPANY" title="会社情報" align="left" />
            </Reveal>
            <Reveal>
              <div style={{ marginTop: "40px", borderTop: "0.5px solid var(--line-strong)" }}>
                {companyRows.map((row) => (
                  <div
                    key={row.label}
                    className="dc-collapse"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "200px 1fr",
                      gap: "20px",
                      padding: "22px 4px",
                      borderBottom: "0.5px solid var(--line-soft)",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--fg-1)" }}>
                      {row.label}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: row.valueColor,
                        ...(row.lineHeight ? { lineHeight: row.lineHeight } : {}),
                      }}
                    >
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--fg-3)" }}>
              ※ 設立・代表者・所在地などは、確定情報をいただき次第反映します。
            </p>
          </div>
        </section>

        <section style={{ padding: "0 0 96px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <Reveal
              className="dc-collapse"
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
                  一緒に、AI Nativeへ。
                </h2>
                <p style={{ margin: 0, fontSize: "14.5px", color: "var(--fg-2)", lineHeight: "1.8" }}>
                  まずは資料と無料相談から。貴社の第一歩をご提案します。
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
