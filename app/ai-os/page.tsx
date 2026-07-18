import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import styles from "./AiOsPage.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/ai-os/" },
  title: "AI経営基盤",
  description:
    "企業が儲かる = 売上UP × コストDOWN × 利益率UP。この式に、貴社専属のAIとして直接はたらきかける経営基盤です。",
};

const LAYER1 = [
  {
    title: "汎用SaaS代替",
    text: "同等機能を、より軽い構造で内製化。払い続けるモデルから抜ける。",
    image: "/img/why/owned-system.jpg",
    label: "FIXED COST",
  },
  {
    title: "業務の自動化",
    text: "定型・繰り返し業務をAIに置換。工数を構造から圧縮する。",
    image: "/img/why/modules.jpg",
    label: "AUTOMATION",
  },
  {
    title: "書類・データ処理",
    text: "バックオフィスの処理を自動化。人の時間を、判断に戻す。",
    image: "/img/cases/back-office.jpg",
    label: "BACK OFFICE",
  },
  {
    title: "問い合わせ対応",
    text: "一次対応と要約を自動化。CS対応時間を減らす。",
    image: "/img/cases/customer-success.jpg",
    label: "CUSTOMER SUCCESS",
  },
];

const LAYER2 = [
  { title: "リード獲得AI", text: "見込み客を発掘し、獲得の量と質を引き上げる。", image: "/img/cases/sales.jpg", label: "LEAD GENERATION" },
  { title: "提案書自動生成", text: "商談準備を高速化。提案の質とスピードを両立。", image: "/img/service/consulting-card.jpg", label: "PROPOSAL" },
  { title: "顧客分析・ランク付け", text: "優先すべき顧客を見極め、営業の的を絞る。", image: "/img/cases/management.jpg", label: "SCORING" },
  { title: "コンテンツ生成", text: "マーケの制作量を増やし、露出を拡大する。", image: "/img/cases/marketing.jpg", label: "CONTENT" },
  { title: "営業支援AI", text: "商談を分析し、次の一手を現場に提示する。", image: "/img/cases/sales.jpg", label: "SALES COPILOT" },
  { title: "価格最適化", text: "需要に合わせた価格設計で、利益を最大化。", image: "/img/industries/retail.jpg", label: "PRICING" },
  { title: "マーケ最適化AI", text: "配信と分析を自動化し、獲得効率を上げる。", image: "/img/cases/marketing.jpg", label: "MARKETING" },
];

const WHY = [
  { title: "AIを、開発の中核に", text: "開発そのものをAIで加速。人月の構造を変える。", image: "/img/why/owned-system.jpg", label: "AI NATIVE" },
  { title: "既存モジュール群", text: "開発済みの部品を組み合わせる。ゼロから作らない。", image: "/img/why/modules.jpg", label: "MODULES" },
  { title: "最先端のオープン技術", text: "世界最先端のオープン技術を活かして開発する。", image: "/img/why/open-tech.jpg", label: "OPEN TECHNOLOGY" },
  { title: "グローバル事例の知見", text: "アプリケーションレイヤーの事例を常にキャッチアップ。", image: "/img/why/case-intelligence.jpg", label: "CASE INTELLIGENCE" },
];

const EQUATION = [
  {
    label: "COST STRUCTURE",
    title: "コスト DOWN",
    text: "SaaS代替と工数削減。無駄な固定費・人件費・外注費を、構造から落とす。",
    image: "/img/os/cost-down-bg.png",
    number: "01",
  },
  {
    label: "GROWTH ENGINE",
    title: "売上 UP",
    text: "自動化で空いた人的リソースを、本来の商売へ。営業・マーケの現場を強くする。",
    image: "/img/os/sales-up-bg.png",
    number: "02",
  },
  {
    label: "BUSINESS IMPACT",
    title: "利益率 UP",
    text: "削減と向上、両方が効く。だから結果的に、利益率が上がる。",
    image: "/img/os/profit-up-bg.png",
    number: "03",
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        <PageHero
          crumbs={[
            { label: "ホーム", href: "/" },
            { label: "サービス", href: "/service" },
            { label: "AI経営基盤" },
          ]}
          title={
            <>
              利益を生む方程式を、<br />そのまま実装する。
            </>
          }
          lead="企業が儲かる = 売上UP × コストDOWN × 利益率UP。この式に、貴社専属のAIとして直接はたらきかける経営基盤です。"
        />

        {/* ===================== 方程式（3カード） ===================== */}
        <section
          style={{
            padding: "88px 0",
            background: "var(--ink-900)",
            borderBottom: "0.5px solid var(--line-strong)",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div className={styles.equationGrid}>
              {EQUATION.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.08} className={styles.equationCard}>
                  <div
                    className={styles.equationVisual}
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className={styles.equationTopline}>
                    <span>{item.label}</span>
                    <span>{item.number}</span>
                  </div>
                  <div className={styles.equationContent}>
                    <h2>{item.title}</h2>
                    <p>{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== LAYER 1 ===================== */}
        <section
          style={{
            padding: "96px 0",
            borderBottom: "0.5px solid var(--line-strong)",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <Reveal>
              <SectionHeading
                title="Cost Down Layer — 削減の層"
                lead="無駄な工数・人件費・外注費・汎用SaaS費を削減する層。業務そのものを、AIに置き換える。"
                align="left"
              />
            </Reveal>
            <div
              className="dc-collapse-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginTop: "44px",
              }}
            >
              {LAYER1.map((c, i) => (
                <Reveal
                  key={c.title}
                  delay={i * 0.08}
                  className={styles.featureCard}
                >
                  <div
                    className={styles.featureImage}
                    style={{ backgroundImage: `url(${c.image})` }}
                  />
                  <div className={styles.featureNumber}>{String(i + 1).padStart(2, "0")}</div>
                  <div className={styles.featureContent}>
                    <span>{c.label}</span>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== LAYER 2 ===================== */}
        <section
          style={{
            padding: "96px 0",
            background: "var(--ink-900)",
            borderBottom: "0.5px solid var(--line-strong)",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <Reveal>
              <SectionHeading
                title="Sales Up Layer — 向上の層"
                lead="削減で空いた力を、売上に変える層。現場で使えるAIを、貴社に内製する。"
                align="left"
              />
            </Reveal>
            <div
              className="dc-collapse-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginTop: "44px",
              }}
            >
              {LAYER2.map((c, i) => (
                <Reveal
                  key={c.title}
                  delay={i * 0.08}
                  className={`${styles.featureCard} ${styles.featureCardDark}`}
                >
                  <div
                    className={styles.featureImage}
                    style={{ backgroundImage: `url(${c.image})` }}
                  />
                  <div className={styles.featureNumber}>{String(i + 1).padStart(2, "0")}</div>
                  <div className={styles.featureContent}>
                    <span>{c.label}</span>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </Reveal>
              ))}
              <Reveal
                delay={7 * 0.08}
                className={`${styles.featureCard} ${styles.featureCardDark} ${styles.featureCardFinal}`}
              >
                <div
                  className={styles.featureImage}
                  style={{ backgroundImage: "url(/img/service/ai-os-card.jpg)" }}
                />
                <div className={styles.featureNumber}>∞</div>
                <div className={styles.featureContent}>
                  <span>CUSTOM BUILD</span>
                  <h3>貴社専用に、組む。</h3>
                  <p>商売に合わせて、必要なAIだけを内製化。</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ===================== WHY ===================== */}
        <section style={{ padding: "96px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <Reveal>
              <SectionHeading title="なぜ、この値段で提供できるのか。" />
            </Reveal>
            <div
              className="dc-collapse-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginTop: "44px",
              }}
            >
              {WHY.map((c, i) => (
                <Reveal
                  key={c.title}
                  delay={i * 0.08}
                  className={`${styles.featureCard} ${styles.whyCard}`}
                >
                  <div
                    className={styles.featureImage}
                    style={{ backgroundImage: `url(${c.image})` }}
                  />
                  <div className={styles.featureNumber}>{String(i + 1).padStart(2, "0")}</div>
                  <div className={styles.featureContent}>
                    <span>{c.label}</span>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== CTA ===================== */}
        <section style={{ padding: "0 0 96px" }}>
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
                  まず、貴社の削減余地から。
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14.5px",
                    color: "var(--fg-2)",
                    lineHeight: "1.8",
                  }}
                >
                  AI経営診断で、コストと売上の伸びしろを数字にします。
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
