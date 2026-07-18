import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import styles from "./page.module.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  alternates: { canonical: "/company/" },
  title: "会社概要",
  description:
    "AI Nativeといえば、AI総戦研。試すだけで終わらせず、経営の数字が動く形で企業に実装します。",
};

// Light scrim over each photo so the aspirational imagery reads softly behind
// the card while the dark text on top stays crisp.
const cardScrim =
  "linear-gradient(165deg, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.80) 52%, rgba(255,255,255,0.94) 100%)";

const cardStyle = (image: string) => ({
  border: "0.5px solid var(--line-strong)",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
  backgroundColor: "#fff",
  backgroundImage: `${cardScrim}, url(${image})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const cards = [
  {
    icon: "flag",
    eyebrow: "MISSION",
    title: "AI Native企業を産み出す",
    body: "実験で止めない。経営の数字が動く企業へと、実装で押し上げる。",
    bodyColor: "var(--fg-2)",
    style: cardStyle("/img/company/mission.jpg"),
  },
  {
    icon: "crosshair",
    eyebrow: "POSITION",
    title: "実装型AIパートナー",
    body: "戦略から内製AIまで、貴社専属のSIerとして汗をかく。",
    bodyColor: "var(--fg-2)",
    style: cardStyle("/img/company/position.jpg"),
  },
  {
    icon: "handshake",
    eyebrow: "PROMISE",
    title: "投資に、成果で応える",
    body: "まず削減から、次に売上へ。投資対効果にこだわり抜く。",
    bodyColor: "var(--fg-1)",
    style: cardStyle("/img/company/promise.jpg"),
  },
];

const companyRows: {
  label: string;
  value: ReactNode;
  valueColor: string;
  lineHeight?: string;
}[] = [
  { label: "会社名", value: "株式会社Select", valueColor: "var(--fg-1)" },
  { label: "英名", value: "Select, Inc.", valueColor: "var(--fg-1)" },
  {
    label: "事業内容",
    value: "ShogunAI（海外向けToC SaaS）の企画・開発・運営、AI総合戦略研究所（日本国内向け事業）",
    valueColor: "var(--fg-1)",
    lineHeight: "1.8",
  },
  { label: "設立", value: "2021年8月", valueColor: "var(--fg-1)" },
  { label: "代表者", value: "田野徹", valueColor: "var(--fg-1)" },
  { label: "所在地", value: "東京都渋谷区恵比寿西1-16-11", valueColor: "var(--fg-1)" },
  { label: "主要取引銀行", value: "三井住友銀行", valueColor: "var(--fg-1)" },
  {
    label: "株主",
    value: (
      <a href="https://theseed.vc/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
        THESEED
      </a>
    ),
    valueColor: "var(--fg-1)",
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "会社概要" }]}
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
                <Reveal key={card.eyebrow} delay={i * 0.08} className="card-pad" style={card.style}>
                  <span style={{ color: "var(--accent)" }}>
                    <Icon name={card.icon} size={26} />
                  </span>
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
              <SectionHeading title="会社情報" align="left" />
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
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <Reveal className={styles.ctaPanel}>
              <span className={styles.ctaImage} aria-hidden="true" />
              <span className={styles.ctaOverlay} aria-hidden="true" />
              <div className={styles.ctaCopy}>
                <span className={styles.ctaEyebrow}>START AI NATIVE</span>
                <h2 className={styles.ctaTitle}>一緒に、AI Nativeへ。</h2>
                <p className={styles.ctaText}>
                  まずは資料と無料相談から。貴社の第一歩をご提案します。
                </p>
              </div>
              <div className={styles.ctaAction}>
                <Button href="/download" variant="secondary" size="lg" className={styles.ctaButton}>
                  資料をダウンロード
                  <Icon name="arrow-right" size={17} />
                </Button>
                <span className={styles.ctaNote}>構想から実装まで、最短ルートをご提案</span>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
