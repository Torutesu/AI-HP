import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import styles from "./ConsultingPage.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/consulting/" },
  title: "コンサルティング",
  description:
    "戦略コンサルティングの視点で、貴社がどのように稼いでいるかを紐解く。可視化・診断から改善の伴走まで、成果に結びつく最適化を続けます。",
};

export default function Page() {
  const steps = [
    {
      step: "STEP 01",
      title: "商売の解剖",
      body: "どう稼ぎ、どこに無駄があるか。事業構造を戦略コンサルのように分解する。",
      image: "/img/company/position.jpg",
      label: "BUSINESS MODEL",
    },
    {
      step: "STEP 02",
      title: "AI経営診断",
      body: "メンバー・ツール別の活用度とROIを可視化。経営が判断できる数字にする。",
      image: "/img/cases/management.jpg",
      label: "DIAGNOSIS",
    },
    {
      step: "STEP 03",
      title: "設計・実装",
      body: "削減と成長、両面の打ち手を優先順位付きで設計。内製AIを一緒に作る。",
      image: "/img/method/semantic-tree-visual.png",
      label: "DESIGN & BUILD",
    },
    {
      step: "STEP 04",
      title: "改善の伴走",
      body: "成果を毎月数字で証明。改善が回り続ける体制まで介入する。",
      image: "/img/company/promise.jpg",
      label: "CONTINUOUS GROWTH",
    },
  ];

  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        <PageHero
          crumbs={[
            { label: "ホーム", href: "/" },
            { label: "サービス", href: "/service" },
            { label: "コンサルティング" },
          ]}
          title={
            <>
              事業の理解から、始める。<br />
              研修では、終わらせない。
            </>
          }
          lead="戦略コンサルティングの視点で、貴社がどのように稼いでいるかを紐解く。可視化・診断から改善の伴走まで、成果に結びつく最適化を続けます。"
        />

        <section
          style={{
            padding: "88px 0",
            background: "var(--ink-900)",
            borderBottom: "0.5px solid var(--line-strong)",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div
              className="dc-collapse"
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr",
                gap: "48px",
                alignItems: "center",
              }}
            >
              <Reveal>
                <div>
                  <h2
                    style={{
                      fontSize: "30px",
                      fontWeight: 700,
                      color: "var(--fg-0)",
                      letterSpacing: "-0.01em",
                      margin: "0 0 20px",
                      lineHeight: 1.35,
                    }}
                  >
                    なぜ、研修をやらないのか。
                  </h2>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.95,
                      color: "var(--fg-2)",
                      margin: "0 0 16px",
                    }}
                  >
                    講座を受けるだけでは、実務に落ちない。モデルもアプリケーションレイヤーも日々ドラスティックに進化し、1ヶ月前のやり方はもう古いことも多い。
                  </p>
                  <p
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.95,
                      color: "var(--fg-2)",
                      margin: 0,
                    }}
                  >
                    だから、貴社の商売に最適な形で、最適化をし続ける。汗をかいて、現場で使えるものにする。（ご要望があれば、最適な形で研修も検討します。）
                  </p>
                </div>
              </Reveal>
              <div className={styles.contrastStack}>
                <Reveal delay={0} className={styles.contrastCard}>
                  <div
                    className={styles.contrastImage}
                    style={{ backgroundImage: "url(/img/why/case-intelligence.jpg)" }}
                  />
                  <span>NO / 01</span>
                  <strong>受けて終わる研修</strong>
                </Reveal>
                <Reveal delay={0.08} className={styles.contrastCard}>
                  <div
                    className={styles.contrastImage}
                    style={{ backgroundImage: "url(/img/why/modules.jpg)" }}
                  />
                  <span>NO / 02</span>
                  <strong>汎用的な一律メニュー</strong>
                </Reveal>
                <Reveal delay={0.16} className={`${styles.contrastCard} ${styles.contrastCardPositive}`}>
                  <div
                    className={styles.contrastImage}
                    style={{ backgroundImage: "url(/img/service/consulting-card.jpg)" }}
                  />
                  <span>YES / 03</span>
                  <strong>商売に紐づく、継続最適化</strong>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "96px 0", borderBottom: "0.5px solid var(--line-strong)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <SectionHeading title="診断から、改善の伴走まで。" />
            <div
              className="dc-collapse-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginTop: "48px",
              }}
            >
              {steps.map((s, i) => (
                <Reveal key={s.step} delay={i * 0.08} className={styles.stepCard}>
                  <div
                    className={styles.stepImage}
                    style={{ backgroundImage: `url(${s.image})` }}
                  />
                  <div className={styles.stepTopline}>
                    <span>{s.step}</span>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className={styles.stepContent}>
                    <span>{s.label}</span>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "0 0 96px", paddingTop: "96px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <Reveal className={styles.cta}>
              <div className={styles.ctaImage} />
              <div className={styles.ctaTopline}>AI BUSINESS DIAGNOSIS</div>
              <div className={styles.ctaInner}>
                <div>
                  <h2>まず、無料の経営診断から。</h2>
                  <p>
                    貴社の課題に合わせて、最適な第一歩をご提案します。
                  </p>
                </div>
                <Button href="/download" variant="primary" size="lg" className={styles.ctaButton} analyticsLabel="consulting_download" analyticsLocation="consulting_cta">
                  資料をダウンロード
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
