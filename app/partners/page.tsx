import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import SectionHeading from "@/components/SectionHeading";
import type { Metadata } from "next";
import styles from "./partners.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/partners/" },
  title: "パートナー募集",
  description:
    "紹介パートナーと代理店拡販パートナーを募集。見込み顧客のご紹介から販売・導入・運用まで、役割に応じた提携モデルをご案内します。",
};

const referralPoints = [
  "見込み顧客をご紹介いただくだけでOK",
  "商談・契約・導入・運用は当社が対応",
  "成約時に紹介料をお支払い",
];

const resellerPoints = [
  "当社のAI経営基盤・DX支援を自ら販売",
  "紹介代理店を広げながら収益を積み上げる",
  "代理店経由の成約でも手数料を還元",
];

const referralCases = [
  "AI活用に課題を感じている既存顧客がいる",
  "詳しい提案や導入の設計は専門チームに任せたい",
  "人材育成・業務改善・IT導入の相談窓口になっている",
];

const resellerCases = [
  "代理店網を広げて収益を伸ばしたい",
  "顧客・パートナーを巻き込みながら拡販したい",
  "ストック型で積み上がる収益モデルをつくりたい",
];

const flow = [
  {
    step: "01",
    title: "お問い合わせ",
    body: "まずは現在の立場と、どの案件を紹介・販売したいかをお聞かせください。",
  },
  {
    step: "02",
    title: "提携モデルの整理",
    body: "紹介型か拡販型か、役割と収益設計をすり合わせます。",
  },
  {
    step: "03",
    title: "商談・資料の共有",
    body: "必要に応じて提案資料や説明資料をお渡しし、営業をサポートします。",
  },
  {
    step: "04",
    title: "提携開始",
    body: "案件の紹介や販売を進めながら、運用方法を一緒に磨いていきます。",
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div className={styles.page}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "パートナー募集" }]}
          eyebrow="PARTNER PROGRAM"
          title={
            <>
              紹介から拡販まで。<br />
              一緒に案件を育てるパートナー募集。
            </>
          }
          lead="見込み顧客のご紹介から、販売・導入・運用まで。ご自身の強みを活かしながら、AI経営基盤とコンサルティングの案件を広げていける仕組みをご用意します。"
          bgImage="/img/company/mission.jpg"
        />

        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="TWO MODELS"
              title="役割に合わせて、2つの提携モデルをご用意します。"
              lead="紹介だけに集中する形と、自ら販売しながら広げていく拡販型。どちらも無理なく始められるよう、提携の進め方を整理しています。"
            />

            <div className={styles.modelGrid}>
              <Reveal className={styles.modelCard}>
                <span className={styles.modelMedia} aria-hidden="true">
                  <span
                    className={styles.modelImage}
                    style={{ backgroundImage: "url(/img/company/promise.jpg)" }}
                  />
                </span>
                <div className={styles.modelCopy}>
                  <span className={styles.modelEyebrow}>INTRODUCTION PARTNER</span>
                  <h2>紹介パートナー</h2>
                  <p>
                    見込み顧客をご紹介いただくだけでOK。
                    商談・契約・導入・運用はすべて当社が対応します。
                  </p>
                  <div className={styles.modelPills}>
                    {referralPoints.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal className={`${styles.modelCard} ${styles.modelCardAccent}`}>
                <span className={styles.modelMedia} aria-hidden="true">
                  <span
                    className={styles.modelImage}
                    style={{ backgroundImage: "url(/img/service/consulting-card.jpg)" }}
                  />
                </span>
                <div className={styles.modelCopy}>
                  <span className={styles.modelEyebrow}>DISTRIBUTION PARTNER</span>
                  <h2>代理店拡販パートナー</h2>
                  <p>
                    当社のAI経営基盤・DX支援を取り扱い、
                    自ら販売しながら、紹介代理店を広げていく拡販モデルです。
                  </p>
                  <div className={styles.modelPills}>
                    {resellerPoints.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="RECOMMENDED"
              title="こんな場合におすすめです。"
              align="left"
            />

            <div className={styles.recommendGrid}>
              <Reveal className={styles.recommendCard}>
                <span className={styles.recommendLabel}>紹介パートナー</span>
                <ul>
                  {referralCases.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className={styles.recommendCard}>
                <span className={styles.recommendLabel}>代理店拡販パートナー</span>
                <ul>
                  {resellerCases.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="HOW IT WORKS"
              title="提携の流れは、シンプルです。"
              lead="いきなり契約ありきではなく、まずは役割と案件の相性を整理してから始めます。"
            />

            <div className={styles.flowGrid}>
              {flow.map((item, index) => (
                <Reveal key={item.step} delay={index * 0.08} className={styles.flowCard}>
                  <span className={styles.flowStep}>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionBottom}>
          <div className={styles.container}>
            <Reveal className={styles.cta}>
              <span className={styles.ctaImage} aria-hidden="true" />
              <span className={styles.ctaOverlay} aria-hidden="true" />
              <div className={styles.ctaCopy}>
                <span className={styles.ctaEyebrow}>PARTNER INQUIRY</span>
                <h2>まずは、案件の相性からご相談ください。</h2>
                <p>
                  紹介だけで始めるか、拡販まで担うか。貴社の得意領域に合わせて、
                  最適な提携のかたちをご案内します。
                </p>
              </div>
              <div className={styles.ctaAction}>
                <Button href="/contact" variant="secondary" size="lg" className={styles.ctaButton}>
                  お問い合わせ
                  <Icon name="arrow-right" size={17} />
                </Button>
                <Button href="/download" variant="ghost" size="md" className={styles.ctaSubButton}>
                  資料をダウンロード
                </Button>
                <span className={styles.ctaNote}>小さなご紹介からでも歓迎です。</span>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
