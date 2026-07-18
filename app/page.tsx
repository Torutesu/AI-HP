import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import HeroVideo from "@/components/HeroVideo";
import CountUp from "@/components/CountUp";
import RoiSimulator from "@/components/RoiSimulator";
import MobileCarousel from "@/components/MobileCarousel";
import AiOsShowcase from "@/components/AiOsShowcase";
import CostDownShowcase from "@/components/CostDownShowcase";
import { HERO_VIDEO_URL, PARTNER_LOGOS as PARTNERS } from "@/lib/site";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const ISSUES = [
  { icon: "eye-off", title: "活用状況が見えない", text: "誰が、どのツールを、どれだけ活用しているか。即座に把握できている企業は多くありません。" },
  { icon: "book-open", title: "研修が現場に根づかない", text: "学んだ知識が業務に定着せず、数か月後に活用しているのは一部の社員のみ、という状況に陥りがちです。" },
  { icon: "pie-chart", title: "ROIを説明できない", text: "投資に対して何が得られたのか。役員会で示せる客観的な数字が、手元にありません。" },
  { icon: "receipt", title: "ツール費用がかさむ", text: "十分に使われないライセンスに毎月の固定費。汎用SaaSの請求だけが、静かに積み上がっていきます。" },
];

const WHY = [
  { image: "/img/why/modules.jpg", title: "独自のモジュール群", text: "開発済みの部品を組み合わせて構築します。ゼロから作らないため、速く、無駄がありません。" },
  { image: "/img/why/open-tech.jpg", title: "最先端のオープン技術", text: "世界最先端のオープン技術を活用して開発することで、開発コストを構造から圧縮します。" },
  { image: "/img/why/case-intelligence.jpg", title: "高い事例の解像度", text: "グローバルのアプリケーションレイヤー事例を、常にキャッチアップしています。" },
  { image: "/img/why/owned-system.jpg", title: "払い続けない構造", text: "汎用SaaSに毎月払い続ける必要はありません。同等の機能を、より軽い構造で内製化します。" },
];

const STATS = [
  { image: "/img/cases/sales.jpg", position: "50% 34%", cat: "営業", value: "-40%", label: "営業工数削減" },
  { image: "/img/cases/customer-success.jpg", position: "46% 42%", cat: "カスタマーサクセス", value: "-30%", label: "CS対応時間削減" },
  { image: "/img/cases/marketing.jpg", position: "38% 42%", cat: "マーケティング", value: "-50%", label: "制作時間削減" },
  { image: "/img/cases/back-office.jpg", position: "50% 42%", cat: "バックオフィス", value: "-60%", label: "業務工数削減" },
  { image: "/img/cases/management.jpg", position: "50% 42%", cat: "経営・意思決定", value: "+25%", label: "意思決定速度向上" },
];

const STRENGTHS: {
  color: string;
  markText?: string;
  markIcon?: string;
  label: string;
  title: string;
  description?: string;
  accent?: string;
  visual?: "yc" | "research" | "impact";
  href?: string;
  /** When set, the badge renders this image instead of the CSS layout.
   *  AI事例 / ROI will get their own images later; drop the files in
   *  public/img/badge/ and set `image` here to swap them in. */
  image?: string;
}[] = [
  {
    color: "#F26522",
    markText: "Y",
    label: "Winner of",
    title: "YC RFS Hackathon 2026",
    description: "世界トップアクセラレーター Y Combinator が日本で開催した RFS Hackathon で優勝。",
    accent: "世界トップアクセラレーター発",
    visual: "yc",
    href: "https://x.com/KyosukeTogami/status/2075136867461460299",
    image: "/img/badge/yc-transparent.png",
  },
  {
    color: "#2B7CFF",
    label: "Research Archive",
    title: "AI事例 5万件",
    description: "海外を含むAI活用事例を、業界・用途・成果別に整理。提案や設計の母集団があります。",
    accent: "業界別に整理済み",
    visual: "research",
    image: "/img/badge/research-archive.png",
  },
  {
    color: "#E0A800",
    label: "Business Impact",
    title: "初年度から費用対効果を体感",
    description: "まずは削減から効かせ、次に売上へ。役員会で説明できる数字まで最短で持っていきます。",
    accent: "最初に効くのはコスト",
    visual: "impact",
    image: "/img/badge/business-impact.png",
  },
];

const ROI_REASONS = [
  {
    icon: "blocks",
    title: "最速で、実装する。",
    text: "ゼロから作りません。開発済みの自社モジュール群を組み合わせるから、圧倒的に速く、無駄なく形にします。",
  },
  {
    icon: "globe",
    title: "最適な人材を、世界から。",
    text: "国境にはこだわりません。案件ごとに世界の複数国から最適なエンジニアをアサインし、品質とコストを両立します。",
  },
];

const OS_TOP = [
  {
    label: "コスト DOWN",
    sub: "削減の起点をつくる",
    text: "汎用SaaSの代替と業務の自動化により、余分な固定費・外注費を構造から見直します。",
    kind: "cost" as const,
    bgImage: "/img/os/cost-down-bg.png",
  },
  {
    label: "売上 UP",
    sub: "人的リソースを解放する",
    text: "自動化で生まれた人的リソースを、本来注力すべき事業へと振り向けます。",
    kind: "sales" as const,
    bgImage: "/img/os/sales-up-bg.png",
  },
  {
    label: "利益率 UP",
    sub: "結果として高まる",
    text: "削減と向上の両方が効くことで、結果として利益率が高まっていきます。",
    kind: "profit" as const,
    highlight: true,
    bgImage: "/img/os/profit-up-bg.png",
  },
];

/** Small trend sparkline: descending for cost, ascending for sales/profit. */
function OsTrend({ kind, color }: { kind: "cost" | "sales" | "profit"; color: string }) {
  const up = kind !== "cost";
  const bars = up ? [10, 15, 21, 28, 36, 45, 54] : [54, 45, 36, 28, 21, 15, 10];
  const line = up
    ? "M6,54 C46,50 74,40 116,31 S182,13 214,8"
    : "M6,8 C46,12 74,22 116,31 S182,49 214,54";
  const tip = up ? { x: 214, y: 8, rot: -33 } : { x: 214, y: 54, rot: 33 };
  return (
    <svg className={styles.osChart} viewBox="0 0 220 64" fill="none" preserveAspectRatio="none">
      {bars.map((h, i) => (
        <rect key={i} x={6 + i * 30} y={60 - h} width="15" height={h} rx="3" fill={color} opacity="0.13" />
      ))}
      <path d={line} stroke={color} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path
        d="M0,-4 L5,0 L0,4 Z"
        fill={color}
        transform={`translate(${tip.x},${tip.y}) rotate(${tip.rot})`}
      />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      {/* ===================== HERO ===================== */}
      <div className={styles.hero}>
        <HeroVideo
          className={styles.heroVideo}
          src={HERO_VIDEO_URL}
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroBody}>
          <Reveal immediate delay={0.2} y={20}>
            <h1 className={styles.heroTitle}>AIを、<br />たしかな経営成果へ。</h1>
          </Reveal>
          <Reveal immediate delay={0.28} y={20}>
            <div className={styles.heroSub}>「試して終わり」に、させません。</div>
          </Reveal>
          <Reveal immediate delay={0.4} y={20}>
            <p className={styles.heroLead}>
              貴社の事業に深く根ざす形で、コストのムダを整え、売上の芽を育てる。<br />
              AIが経営の数字を動かすところまで、伴走してご支援します。
            </p>
          </Reveal>
          <Reveal immediate delay={0.52} y={20} className={styles.heroCtas}>
            <a className="whiteCta" href="/contact">
              無料相談<Icon name="arrow-right" size={17} />
            </a>
            <a className="heroOutlineCta" href="/download">
              資料をダウンロード<Icon name="download" size={16} />
            </a>
          </Reveal>
          <Reveal immediate delay={0.62} y={20} className={styles.fvBadges}>
            {STRENGTHS.map((b) => {
              const inner = (
                <>
                  <span className={styles.fvBody}>
                    <span className={`${styles.fvTopBadge} ${b.visual === "yc" ? styles.fvTopBadgeYc : ""} ${b.visual === "research" ? styles.fvTopBadgeResearch : ""} ${b.visual === "impact" ? styles.fvTopBadgeImpact : ""}`}>
                      {b.visual === "yc" ? (
                        <span className={styles.fvMediaYc}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className={styles.fvImg} src={b.image} alt={b.title} />
                        </span>
                      ) : null}
                      {b.visual === "research" ? (
                        <span className={styles.fvMediaResearch} aria-hidden>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className={styles.fvAssetImage} src={b.image} alt="" />
                        </span>
                      ) : null}
                      {b.visual === "impact" ? (
                        <span className={styles.fvMediaImpact} aria-hidden>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className={styles.fvAssetImage} src={b.image} alt="" />
                        </span>
                      ) : null}
                      {b.visual !== "yc" ? (
                        <span className={styles.fvTopCopy}>
                          <span className={styles.fvLabel}>{b.label}</span>
                          <span className={styles.fvTitle}>{b.title}</span>
                        </span>
                      ) : null}
                    </span>
                    {b.accent ? <span className={styles.fvAccent}>{b.accent}</span> : null}
                    {b.description ? <span className={styles.fvDesc}>{b.description}</span> : null}
                  </span>
                </>
              );
              return b.href ? (
                <a key={b.title} className={styles.fvBadge} href={b.href} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <span key={b.title} className={styles.fvBadge}>{inner}</span>
              );
            })}
          </Reveal>
        </div>

        <Reveal immediate delay={0.58} y={20} className={styles.partnerRow}>
          <div className={styles.partnerViewport}>
            <div className={styles.partnerLogos}>
              {[0, 1].map((set) => (
                <div key={set} className={styles.partnerLogoSet} aria-hidden={set === 1}>
                  {PARTNERS.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={`${set}-${p.alt}`} src={p.src} alt={set === 0 ? p.alt : ""} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <span className={styles.partnerNote}>世界の先端AI事例を、日々リサーチしています</span>
        </Reveal>
      </div>

      {/* ===================== STRENGTHS ===================== */}
      <section className={`${styles.section} ${styles.strengths}`}>
        <div className={styles.container}>
          <div className={styles.roiWrap}>
            <Reveal className={styles.roiReasons}>
              <h2 className={styles.roiHeading}>ROIにこだわり抜く2つの理由。</h2>
              <div className={styles.roiList}>
                {ROI_REASONS.map((r) => (
                  <div key={r.title} className={styles.roiItem}>
                    <span className={styles.roiIcon}><Icon name={r.icon} size={20} /></span>
                    <div>
                      <div className={styles.roiItemTitle}>{r.title}</div>
                      <p className={styles.roiItemText}>{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className={styles.roiSimCol}>
              <RoiSimulator />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== OUR BELIEF ===================== */}
      <section className={styles.belief}>
        <div className={styles.beliefGlow} />
        <Reveal className={styles.beliefInner}>
          <h2 className={styles.beliefTitle}>テクノロジーの進化を、<br />経営の成果へと繋げる。</h2>
          <p className={styles.beliefText}>
            日々生まれる最先端のAIを、貴社の事業に最適な形へ。実験で終わらせず、確かな数字の変化として届けます。
          </p>
        </Reveal>
        <div className={styles.beliefFade} />
      </section>

      {/* ===================== PHILOSOPHY ===================== */}
      <section className={`${styles.section} ${styles.philosophy}`}>
        <div className={styles.container}>
          <div className={styles.philosophyGrid}>
            <Reveal className={styles.philLeft}>
              <div className={styles.philLeftBody}>
                <h2 className={styles.philosophyTitle}>「学ぶ」だけでは、<br />成果につながりません。</h2>
                <p className={styles.philLead}>戦略から実装、成果までを一気通貫で。</p>
                <p className={styles.philosophyText}>研修や講座を受けるだけでは、現場も数字も変わりません。知識は、貴社の事業に結びついて、はじめて成果になります。</p>
                <p className={styles.philosophyText}>AIモデルも活用の手法も、日進月歩で進化しています。私たちは常に最新の打ち手を取り入れ、貴社に最適な形で実装し続けます。</p>
              </div>
              <div className={styles.philStats}>
                {[
                  { icon: "route", value: "一気通貫", label: "戦略から実装・改善まで" },
                  { icon: "cpu", value: "内製で構築", label: "貴社の資産として残す" },
                  { icon: "handshake", value: "伴走型", label: "成果が出るまで、伴走" },
                ].map((s) => (
                  <div key={s.value} className={styles.philStat}>
                    <span className={styles.philStatIcon}><Icon name={s.icon} size={18} /></span>
                    <div className={styles.philStatValue}>{s.value}</div>
                    <div className={styles.philStatLabel}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className={styles.cardStack}>
              {[
                {
                  no: "01",
                  icon: "compass",
                  title: "事業の理解から、始める。",
                  text: "戦略コンサルティングの視点で、貴社がどのように価値を生み、どこで稼ぐのかを丁寧に紐解きます。すべては、ここから始まります。",
                },
                {
                  no: "02",
                  icon: "workflow",
                  title: "貴社専属の、開発チーム。",
                  text: "改善策とシステム構成をともに描き、現場で確かに使える内製AIを開発します。業績につながる仕組みを、伴走しながら形にします。",
                },
                {
                  no: "03",
                  icon: "trending-up",
                  title: "投資に、成果で応える。",
                  text: "まずコスト削減から、次に売上向上へ。人員計画の見直しにまで踏み込み、投資対効果にこだわってご支援します。",
                  highlight: true,
                },
              ].map((c, i) => (
                <Reveal
                  key={c.no}
                  delay={0.05 + i * 0.08}
                  className={`${styles.philCard}${c.highlight ? ` ${styles.philCardHi}` : ""} liftCard`}
                >
                  <span className={styles.philCardIcon}><Icon name={c.icon} size={22} /></span>
                  <div className={styles.philCardBodyText}>
                    <div className={styles.philCardHead}>
                      <span className={styles.philCardNo}>{c.no}</span>
                      <span className={styles.philCardTitle}>{c.title}</span>
                    </div>
                    <p className={styles.philCardText}>{c.text}</p>
                  </div>
                  <span className={styles.philCardWm} aria-hidden>{c.no}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ISSUES ===================== */}
      <section className={`${styles.sectionAlt} ${styles.pain}`}>
        <div className={styles.container}>
          <Reveal><SectionHeading title="なぜ、AIが経営の数字に結びつかないのか。" /></Reveal>
          <MobileCarousel className={styles.grid4}>
            {ISSUES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} className={`${styles.featureCard} liftCard`}>
                <div className={styles.featureIcon}><Icon name={c.icon} size={24} /></div>
                <div className={styles.featureTitle}>{c.title}</div>
                <p className={styles.featureText}>{c.text}</p>
              </Reveal>
            ))}
          </MobileCarousel>
        </div>
      </section>

      {/* ===================== AI OS ===================== */}
      <section className={`${styles.section} ${styles.os}`}>
        <div className={styles.container}>
          <Reveal>
            <SectionHeading
              title="利益を生む方程式を、実装する。"
              lead="コストを削り、売上を伸ばす。両輪がかみ合うことで、利益率が高まります。貴社専属のAI経営基盤です。"
            />
          </Reveal>

          <MobileCarousel className={styles.osTop}>
            {OS_TOP.map((c, i) => (
              <Reveal
                key={c.label}
                delay={i * 0.1}
                className={`${styles.osTopCard}${c.highlight ? ` ${styles.osTopCardHighlight}` : ""} liftCard`}
              >
                <div className={styles.osTopBg} style={{ backgroundImage: `url(${c.bgImage})` }} />
                <div className={styles.osTopSweep} />
                <span className={styles.osTopLabel}>{c.label}</span>
                <div className={styles.osTopSub}>{c.sub}</div>
                <p className={styles.osTopText}>{c.text}</p>
                <div className={styles.osChartWrap}>
                  <span className={styles.osChartLabel}>{c.kind.toUpperCase()}</span>
                  <OsTrend kind={c.kind} color="#2B7CFF" />
                </div>
              </Reveal>
            ))}
          </MobileCarousel>

          <MobileCarousel className={styles.osSplit}>
            <Reveal className={`${styles.osPanel} ${styles.osPanelMedia}`}>
              <CostDownShowcase />
            </Reveal>
            <Reveal delay={0.1} className={`${styles.osPanel} ${styles.osPanelHighlight}`}>
              <AiOsShowcase />
            </Reveal>
          </MobileCarousel>

          <Reveal className={styles.centerRow} style={{ marginTop: 44 }}>
            <a className={styles.detailLink} href="/ai-os">AI経営基盤の詳細を見る<Icon name="arrow-right" size={16} /></a>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHY US ===================== */}
      <section className={`${styles.section} ${styles.why}`}>
        <div className={styles.container}>
          <Reveal><SectionHeading title="なぜ、他社や既存ソリューションの 1/3〜1/5コストで実現できるのか。" /></Reveal>
          <MobileCarousel className={styles.grid4}>
            {WHY.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} className={`${styles.featureCard} liftCard`}>
                <span
                  className={styles.featureImage}
                  style={{ backgroundImage: `url(${c.image})` }}
                  aria-hidden="true"
                />
                <span className={styles.featureWash} aria-hidden="true" />
                <div className={styles.featureTitle}>{c.title}</div>
                <p className={styles.featureText}>{c.text}</p>
              </Reveal>
            ))}
          </MobileCarousel>
        </div>
      </section>

      {/* ===================== SIMULATION / CASES ===================== */}
      <section className={styles.cases}>
        <div className={styles.container}>
          <Reveal><SectionHeading title="活用領域とシミュレーション事例" /></Reveal>
          <MobileCarousel className={styles.casesGrid}>
            {STATS.map((s, i) => (
              <Reveal key={s.cat} delay={i * 0.08}>
                <div className={styles.statcard}>
                  <span
                    className={styles.statBg}
                    style={{ backgroundImage: `url(${s.image})`, backgroundPosition: s.position }}
                    aria-hidden="true"
                  />
                  <span className={styles.statShade} aria-hidden="true" />
                  <div className={styles.statContent}>
                    <div className={styles.statCat}>{s.cat}</div>
                    <div className={styles.statValue}><CountUp value={s.value} /></div>
                    <div className={styles.statLabel}>{s.label}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </MobileCarousel>
          <p className={styles.disclaimer}>※ 上記は代表的なシミュレーション事例であり、効果を保証するものではありません。</p>
          <Reveal className={styles.centerRow} style={{ marginTop: 20 }}>
            <a className={styles.detailLink} href="/cases">業種別の活用シナリオを見る<Icon name="arrow-right" size={16} /></a>
          </Reveal>
        </div>
      </section>

      {/* ===================== CTA BAND ===================== */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <Reveal className={styles.ctaBand}>
            <div className={styles.ctaGlow} />
            <div className={styles.ctaCopy}>
              <span className={styles.ctaEyebrow}>無料AI経営診断</span>
              <h2 className={styles.ctaTitle}>AIへの投資を、<br />利益に変える。</h2>
              <p className={styles.ctaText}>
                コスト削減余地と売上の伸びしろを、経営会議で使える数字に整理します。診断は無料、資料は3分でご覧いただけます。
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Button href="/contact" variant="primary" size="lg">
                無料で診断する<Icon name="arrow-right" size={17} />
              </Button>
              <Button href="/download" variant="secondary" size="lg">サービス資料を見る</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
