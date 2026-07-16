import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import HeroVideo from "@/components/HeroVideo";
import CountUp from "@/components/CountUp";
import styles from "./page.module.css";

const PARTNERS = [
  { alt: "Tesla", src: "https://cdn.sceneai.art/logos/67179a5f-501b-48c1-a6b6-8f4f3c676ba4.png" },
  { alt: "Perplexity", src: "https://cdn.sceneai.art/logos/5360e43f-332b-40b0-84de-db847c00fae6.png" },
  { alt: "NASA", src: "https://cdn.sceneai.art/logos/9a17d5b4-0ad2-44b6-832f-b46153f7b156.png" },
  { alt: "NVIDIA", src: "https://cdn.sceneai.art/logos/23385a15-55a1-405a-accd-51abf2f987cf.png" },
  { alt: "Google", src: "https://cdn.sceneai.art/logos/bdb8a52e-00a4-4fb1-8ab2-c07977e5dc72.png" },
];

const ISSUES = [
  { icon: "eye-off", title: "活用状況が見えない", text: "誰が、どのツールを、どれだけ活用しているか。即座に把握できている企業は多くありません。" },
  { icon: "book-open", title: "研修が現場に根づかない", text: "学んだ知識が業務に定着せず、数か月後に活用しているのは一部の社員のみ、という状況に陥りがちです。" },
  { icon: "pie-chart", title: "ROIを説明できない", text: "投資に対して何が得られたのか。役員会で示せる客観的な数字が、手元にありません。" },
  { icon: "receipt", title: "ツール費用がかさむ", text: "十分に使われないライセンスに毎月の固定費。汎用SaaSの請求だけが、静かに積み上がっていきます。" },
];

const WHY = [
  { icon: "blocks", title: "独自のモジュール群", text: "開発済みの部品を組み合わせて構築します。ゼロから作らないため、速く、無駄がありません。" },
  { icon: "globe", title: "最先端のオープン技術", text: "世界最先端のオープン技術を活用して開発することで、開発コストを構造から圧縮します。" },
  { icon: "layers", title: "高い事例の解像度", text: "グローバルのアプリケーションレイヤー事例を、常にキャッチアップしています。" },
  { icon: "unplug", title: "払い続けない構造", text: "汎用SaaSに毎月払い続ける必要はありません。同等の機能を、より軽い構造で内製化します。" },
];

const STEPS = [
  { no: "STEP 01", title: "可視化", text: "メンバー・ツール別の活用度と費用対効果を診断し、経営が判断できる形で現状を数字にします。" },
  { no: "STEP 02", title: "設計", text: "グローバル事例を土台に貴社の勝ち筋を見極め、削減と成長、両面の打ち手を優先順位とともに設計します。" },
  { no: "STEP 03", title: "改善", text: "実装して終わりにはしません。成果を毎月数字で確かめ、改善が回り続ける体制まで伴走します。" },
];

const STATS = [
  { icon: "users", cat: "営業", note: "商談分析・提案資料自動生成", value: "-40%", label: "営業工数削減" },
  { icon: "headphones", cat: "カスタマーサクセス", note: "問い合わせ自動化・要約", value: "-30%", label: "CS対応時間削減" },
  { icon: "megaphone", cat: "マーケティング", note: "コンテンツ生成・分析自動化", value: "-50%", label: "コンテンツ作成時間削減" },
  { icon: "file-text", cat: "バックオフィス", note: "書類・データ処理自動化", value: "-60%", label: "業務工数削減" },
  { icon: "trending-up", cat: "経営・意思決定", note: "データ分析・予測精度向上", value: "+25%", label: "意思決定スピード向上" },
];

const SALES_TAGS = ["リード獲得AI", "提案書自動生成", "顧客分析・ランキング付け", "コンテンツ生成", "営業支援AI", "価格最適化", "マーケ最適化AI"];

export default function Home() {
  return (
    <>
      <SiteHeader />
      {/* ===================== HERO ===================== */}
      <div className={styles.hero}>
        <HeroVideo
          className={styles.heroVideo}
          src="https://cdn.sceneai.art/Hero Section Video/c0429648-6382-40e5-977a-be50ff2af8d5.mp4"
        />
        <div className={styles.heroOverlay} />

        <div className={styles.heroBody}>
          <Reveal immediate delay={0.2} y={20}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.ycBadge}
              src="/img/badge/yc-transparent.png"
              alt="Winner of YC RFS Hackathon 2026 — Presented by Transpose"
              width={720}
              height={256}
            />
          </Reveal>
          <Reveal immediate delay={0.32} y={20}>
            <h1 className={styles.heroTitle}>AIを、<br />たしかな経営成果へ。</h1>
          </Reveal>
          <Reveal immediate delay={0.32} y={20}>
            <div className={styles.heroSub}>「試して終わり」に、させません。</div>
          </Reveal>
          <Reveal immediate delay={0.44} y={20}>
            <p className={styles.heroLead}>
              貴社の事業に深く根ざす形で、コストのムダを整え、売上の芽を育てる。<br />
              AIが経営の数字を動かすところまで、伴走してご支援します。
            </p>
          </Reveal>
          <Reveal immediate delay={0.58} y={20} className={styles.heroCtas}>
            <a className="whiteCta" href="/download">
              資料をダウンロード<Icon name="arrow-right" size={17} />
            </a>
          </Reveal>
        </div>

        <Reveal immediate delay={0.58} y={20} className={styles.partnerRow}>
          <span className={styles.partnerNote}>世界の先端AI事例を、日々リサーチしています</span>
          <div className={styles.partnerLogos}>
            {PARTNERS.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.alt} src={p.src} alt={p.alt} />
            ))}
          </div>
        </Reveal>
      </div>

      {/* ===================== OUR BELIEF ===================== */}
      <section className={styles.belief}>
        <div className={styles.beliefGlow} />
        <Reveal className={styles.beliefInner}>
          <span className={styles.beliefEyebrow}><span />OUR BELIEF<span /></span>
          <h2 className={styles.beliefTitle}>テクノロジーの進化を、<br />経営の成果へと翻訳する。</h2>
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
            <Reveal>
              <span className={styles.eyebrowRule}><span />PHILOSOPHY</span>
              <h2 className={styles.philosophyTitle}>「学ぶ」だけでは、<br />成果は動きません。</h2>
              <p className={styles.philosophyText}>研修や講座を受けるだけでは、現場も数字も変わりません。知識は、貴社の事業に結びついて、はじめて成果になります。</p>
              <p className={styles.philosophyText}>AIモデルも活用の手法も、日進月歩で進化しています。私たちは常に最新の打ち手を取り入れ、貴社に最適な形で実装し続けます。</p>
            </Reveal>
            <div className={styles.cardStack}>
              <Reveal delay={0.05} className={`${styles.rowCard} liftCard`}>
                <div className={styles.iconTile}><Icon name="search" size={22} /></div>
                <div>
                  <div className={styles.rowCardTitle}>事業の理解から、始める。</div>
                  <p className={styles.rowCardText}>戦略コンサルティングの視点で、貴社がどのように価値を生み、どこで稼ぐのかを丁寧に紐解きます。すべては、ここから始まります。</p>
                </div>
              </Reveal>
              <Reveal delay={0.13} className={`${styles.rowCard} liftCard`}>
                <div className={styles.iconTile}><Icon name="wrench" size={22} /></div>
                <div>
                  <div className={styles.rowCardTitle}>貴社専属の、開発チーム。</div>
                  <p className={styles.rowCardText}>改善策とシステム構成をともに描き、現場で確かに使える内製AIを開発します。業績につながる仕組みを、伴走しながら形にします。</p>
                </div>
              </Reveal>
              <Reveal delay={0.21} className={`${styles.rowCard} ${styles.rowCardHighlight} liftCard`}>
                <div className={`${styles.iconTile} ${styles.iconTileWhite}`}><Icon name="badge-check" size={22} /></div>
                <div>
                  <div className={styles.rowCardTitle}>投資に、成果で応える。</div>
                  <p className={styles.rowCardText}>まずコスト削減から、次に売上向上へ。人員計画の見直しにまで踏み込み、投資対効果にこだわってご支援します。</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ISSUES ===================== */}
      <section className={`${styles.sectionAlt} ${styles.pain}`}>
        <div className={styles.container}>
          <Reveal><SectionHeading eyebrow="ISSUES" title="なぜ、AIが経営の数字に結びつかないのか。" /></Reveal>
          <div className={styles.grid4}>
            {ISSUES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} className={`${styles.featureCard} liftCard`}>
                <div className={styles.featureIcon}><Icon name={c.icon} size={24} /></div>
                <div className={styles.featureTitle}>{c.title}</div>
                <p className={styles.featureText}>{c.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== AI OS ===================== */}
      <section className={`${styles.section} ${styles.os}`}>
        <div className={styles.container}>
          <Reveal>
            <SectionHeading
              eyebrow="AI OS / AI経営基盤"
              title="利益を生む方程式を、実装する。"
              lead="コストを削り、売上を伸ばす。両輪がかみ合うことで、利益率が高まります。貴社専属のAI経営基盤です。"
            />
          </Reveal>

          <div className={styles.osTop}>
            <Reveal className={`${styles.osTopCard} liftCard`}>
              <span className={styles.osTopLabel}><Icon name="trending-down" size={22} />コスト DOWN</span>
              <p className={styles.osTopText}>汎用SaaSの代替と業務の自動化により、余分な固定費・外注費を構造から見直します。</p>
            </Reveal>
            <Reveal delay={0.1} className={`${styles.osTopCard} liftCard`}>
              <span className={styles.osTopLabel}><Icon name="trending-up" size={22} />売上 UP</span>
              <p className={styles.osTopText}>自動化で生まれた人的リソースを、本来注力すべき事業へと振り向けます。</p>
            </Reveal>
            <Reveal delay={0.2} className={`${styles.osTopCard} ${styles.osTopCardHighlight} liftCard`}>
              <span className={styles.osTopLabel}><Icon name="percent" size={20} />利益率 UP</span>
              <p className={styles.osTopText} style={{ color: "var(--fg-1)" }}>削減と向上の両方が効くことで、結果として利益率が高まっていきます。</p>
            </Reveal>
          </div>

          <div className={styles.osSplit}>
            <Reveal className={styles.osPanel}>
              <span className={styles.osPanelEyebrow}><span />COST DOWN LAYER</span>
              <div className={styles.osPanelTitle}>削減の層</div>
              <p className={styles.osPanelText}>余分な工数・人件費・外注費・汎用SaaS費を削減する層です。業務そのものを、AIへと置き換えていきます。</p>
              <div className={styles.osPanelFoot}>業務置換 — Replacement</div>
            </Reveal>
            <Reveal delay={0.1} className={`${styles.osPanel} ${styles.osPanelHighlight}`}>
              <span className={styles.osPanelEyebrow}><span />SALES UP LAYER</span>
              <div className={styles.osPanelTitle}>向上の層</div>
              <p className={styles.osPanelText}>生まれた力を、売上へと変える層です。営業やマーケティングの現場で使えるAIを、貴社に内製します。</p>
              <div className={styles.chips}>
                {SALES_TAGS.map((t) => <span key={t} className={styles.chip}>{t}</span>)}
              </div>
            </Reveal>
          </div>

          <Reveal className={styles.centerRow} style={{ marginTop: 44 }}>
            <a className={styles.detailLink} href="/ai-os">AI経営基盤の詳細を見る<Icon name="arrow-right" size={16} /></a>
          </Reveal>
        </div>
      </section>

      {/* ===================== WHY US ===================== */}
      <section className={`${styles.section} ${styles.why}`}>
        <div className={styles.container}>
          <Reveal><SectionHeading eyebrow="WHY US" title="なぜ、1/3のコストで実現できるのか。" /></Reveal>
          <div className={styles.grid4}>
            {WHY.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} className={`${styles.featureCard} liftCard`}>
                <div className={styles.featureIcon}><Icon name={c.icon} size={24} /></div>
                <div className={styles.featureTitle}>{c.title}</div>
                <p className={styles.featureText}>{c.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PROCESS ===================== */}
      <section className={`${styles.sectionAlt} ${styles.process}`}>
        <div className={styles.container}>
          <Reveal><SectionHeading eyebrow="PROCESS" title="成果に至るまで、3つのステップ。" /></Reveal>
          <div className={styles.processGrid}>
            {STEPS.map((s, i) => (
              <Reveal key={s.no} delay={i * 0.1} className={`${styles.stepCard} liftCard`}>
                <div className={styles.stepNo}>{s.no}</div>
                <div className={styles.stepTitle}>{s.title}</div>
                <p className={styles.stepText}>{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SIMULATION / CASES ===================== */}
      <section className={styles.cases}>
        <div className={styles.container}>
          <Reveal><SectionHeading eyebrow="SIMULATION" title="活用領域とシミュレーション事例" /></Reveal>
          <div className={styles.casesGrid}>
            {STATS.map((s, i) => (
              <Reveal key={s.cat} delay={i * 0.08}>
                <div className={styles.statcard}>
                  <div className={styles.statRow}>
                    <span className={styles.statIcon}><Icon name={s.icon} size={18} /></span>
                    <span className={styles.statCat}>{s.cat}</span>
                  </div>
                  <div className={styles.statNote}>{s.note}</div>
                  <div className={styles.statValue}><CountUp value={s.value} /></div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className={styles.disclaimer}>※ 上記は代表的なシミュレーション事例であり、効果を保証するものではありません。</p>
          <Reveal className={styles.centerRow} style={{ marginTop: 28 }}>
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
              <span className={styles.ctaEyebrow}>FREE AI ASSESSMENT</span>
              <h2 className={styles.ctaTitle}>“試して終わり”を、<br />成果に変える。</h2>
              <p className={styles.ctaText}>
                まずは無料のAI経営診断から。コスト削減と売上の伸びしろを、数字でご提示します。サービス資料は3分でお読みいただけます。
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Button href="/contact" variant="primary" size="lg">
                無料でAI経営診断を受ける<Icon name="arrow-right" size={17} />
              </Button>
              <Button href="/download" variant="secondary" size="lg">資料をダウンロード</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
