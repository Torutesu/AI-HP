import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import CountUp from "@/components/CountUp";
import type { Metadata } from "next";
import cx from "./cases.module.css";

export const metadata: Metadata = {
  title: "導入事例",
  description:
    "貴社に近い業種で、どこにコストのムダがあり、どこに売上の伸びしろがあるか。代表的なシミュレーションをご紹介します。",
};

type Scenario = {
  icon: string;
  title: string;
  body: string;
  // Background illustration. Drop files in public/img/industries/ and set the
  // path here (e.g. "/img/industries/manufacturing.png") to replace the
  // line-icon fallback with the real illustration.
  image?: string;
  stats: { value: string; label: string }[];
};

const scenarios: Scenario[] = [
  {
    icon: "factory",
    image: "/img/industries/manufacturing.jpg",
    title: "製造業",
    body: "見積・図面対応や問い合わせ処理をAIに置換。属人化した工程知識を、全社で使える形にする。",
    stats: [
      { value: "-45%", label: "見積作成工数" },
      { value: "+18%", label: "受注対応スピード" },
    ],
  },
  {
    icon: "stethoscope",
    image: "/img/industries/healthcare.jpg",
    title: "医療・ヘルスケア",
    body: "予約・問い合わせ・記録作成を自動化。専門職の時間を、人にしかできない業務へ戻す。",
    stats: [
      { value: "-50%", label: "事務工数" },
      { value: "+22%", label: "対応可能件数" },
    ],
  },
  {
    icon: "shopping-bag",
    image: "/img/industries/retail.jpg",
    title: "小売・EC",
    body: "商品説明・接客・レコメンドをAI化。制作量を増やし、CS対応を軽くしながら売上を伸ばす。",
    stats: [
      { value: "-55%", label: "コンテンツ制作時間" },
      { value: "+15%", label: "CVR" },
    ],
  },
  {
    icon: "landmark",
    image: "/img/industries/finance.jpg",
    title: "金融・保険",
    body: "書類審査・レポート作成・照会対応を自動化。分析精度を上げ、意思決定を速くする。",
    stats: [
      { value: "-60%", label: "書類処理工数" },
      { value: "+25%", label: "意思決定スピード" },
    ],
  },
  {
    icon: "building-2",
    image: "/img/industries/realestate.jpg",
    title: "不動産・建設",
    body: "物件・案件情報の整理と提案書作成をAI化。反響対応を速め、成約までの距離を縮める。",
    stats: [
      { value: "-40%", label: "提案準備工数" },
      { value: "+20%", label: "反響対応率" },
    ],
  },
  {
    icon: "briefcase",
    image: "/img/industries/professional.jpg",
    title: "士業・専門サービス",
    body: "調査・ドラフト作成・照会対応をAIで加速。専門家の時間単価を、より高い業務に集中させる。",
    stats: [
      { value: "-48%", label: "下調べ工数" },
      { value: "+30%", label: "対応案件数" },
    ],
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "導入事例" }]}
          eyebrow="SCENARIOS"
          title={<>業種別の、活用シナリオ。</>}
          lead="貴社に近い業種で、どこにコストのムダがあり、どこに売上の伸びしろがあるか。代表的なシミュレーションをご紹介します。"
        />

        <section style={{ padding: "96px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
            <div className={cx.grid}>
              {scenarios.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.08} className={cx.card}>
                  <div className={cx.media}>
                    <div className={cx.mediaFallback}>
                      <Icon name={s.icon} size={64} />
                    </div>
                    {s.image ? (
                      <div
                        className={cx.photo}
                        style={{ backgroundImage: `url(${s.image})` }}
                        role="img"
                        aria-label={`${s.title}のイメージ`}
                      />
                    ) : null}
                  </div>
                  <div className={cx.body}>
                    <div className={cx.head}>
                      <span className={cx.badge}><Icon name={s.icon} size={22} /></span>
                      <div className={cx.title}>{s.title}</div>
                    </div>
                    <p className={cx.desc}>{s.body}</p>
                    <div className={cx.stats}>
                      {s.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className={cx.statValue}><CountUp value={stat.value} /></div>
                          <div className={cx.statLabel}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <p
              style={{
                textAlign: "center",
                marginTop: "32px",
                fontSize: "12px",
                color: "var(--fg-3)",
              }}
            >
              ※ 上記は代表的なシミュレーション事例であり、効果を保証するものではありません。
            </p>
          </div>
        </section>

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
                  貴社の業種で、試算する。
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14.5px",
                    color: "var(--fg-2)",
                    lineHeight: 1.8,
                  }}
                >
                  現状に合わせた削減余地と売上の伸びしろを、数字でご提案します。
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
