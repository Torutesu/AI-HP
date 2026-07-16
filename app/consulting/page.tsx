import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
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
      accent: false,
    },
    {
      step: "STEP 02",
      title: "AI経営診断",
      body: "メンバー・ツール別の活用度とROIを可視化。経営が判断できる数字にする。",
      accent: false,
    },
    {
      step: "STEP 03",
      title: "設計・実装",
      body: "削減と成長、両面の打ち手を優先順位付きで設計。内製AIを一緒に作る。",
      accent: false,
    },
    {
      step: "STEP 04",
      title: "改善の伴走",
      body: "成果を毎月数字で証明。改善が回り続ける体制まで介入する。",
      accent: true,
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
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <Reveal delay={0}>
                  <div
                    style={{
                      background: "var(--surface-card)",
                      border: "0.5px solid var(--line-strong)",
                      borderRadius: "10px",
                      padding: "22px 26px",
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "var(--accent)" }}>
                      <Icon name="x-circle" size={22} />
                    </span>
                    <div style={{ fontSize: "14.5px", fontWeight: 600, color: "var(--fg-0)" }}>
                      やらないこと ： 受けて終わる研修
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <div
                    style={{
                      background: "var(--surface-card)",
                      border: "0.5px solid var(--line-strong)",
                      borderRadius: "10px",
                      padding: "22px 26px",
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "var(--accent)" }}>
                      <Icon name="x-circle" size={22} />
                    </span>
                    <div style={{ fontSize: "14.5px", fontWeight: 600, color: "var(--fg-0)" }}>
                      やらないこと ： 汎用的な一律メニュー
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.16}>
                  <div
                    style={{
                      border: "0.5px solid var(--panel-border)",
                      borderRadius: "10px",
                      padding: "22px 26px",
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                      backgroundImage: "linear-gradient(120deg, #F4F8FF, #FFFFFF)",
                    }}
                  >
                    <span style={{ color: "var(--accent)" }}>
                      <Icon name="check-circle-2" size={22} />
                    </span>
                    <div style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--fg-0)" }}>
                      やること ： 商売に紐づく、継続最適化
                    </div>
                  </div>
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
                <Reveal key={s.step} delay={i * 0.08}>
                  <div
                    style={
                      s.accent
                        ? {
                            border: "0.5px solid var(--panel-border)",
                            borderRadius: "8px",
                            padding: "30px 26px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            backgroundImage: "linear-gradient(120deg, #F4F8FF, #FFFFFF)",
                          }
                        : {
                            background: "var(--surface-card)",
                            border: "0.5px solid var(--line-strong)",
                            borderRadius: "8px",
                            padding: "30px 26px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }
                    }
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.18em",
                        color: "var(--accent)",
                      }}
                    >
                      {s.step}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg-0)" }}>
                      {s.title}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        lineHeight: 1.8,
                        color: s.accent ? "var(--fg-1)" : "var(--fg-2)",
                      }}
                    >
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "0 0 96px", paddingTop: "96px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <Reveal>
              <div
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
                    まず、無料の経営診断から。
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14.5px",
                      color: "var(--fg-2)",
                      lineHeight: 1.8,
                    }}
                  >
                    貴社の課題に合わせて、最適な第一歩をご提案します。
                  </p>
                </div>
                <Button href="/download" variant="primary" size="lg">
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
