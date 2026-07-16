import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Icon from "@/components/Icon";
import DownloadForm from "@/components/DownloadForm";
import styles from "./download.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/download/" },
  title: "資料請求",
  description:
    "AI総合戦略研究所のご提案資料を無料でリクエスト。提供価値・導入効果の見込み・業界別の活用事例・導入までの進め方を一冊にまとめてお送りします。",
};

const features = [
  { icon: "target", title: "サービス全体のご紹介", text: "提供価値・特徴・体制を整理" },
  { icon: "trending-up", title: "導入による効果の見込み", text: "コスト削減・売上向上の可能性" },
  { icon: "building-2", title: "業界別の活用事例", text: "類似企業の成功パターンを掲載" },
  { icon: "route", title: "導入までの進め方", text: "ステップ・体制・サポートを解説" },
];

const bars = [40, 60, 50, 76, 66, 92];

export default function DownloadPage() {
  return (
    <>
      <SiteHeader variant="solid" />
      <section className={styles.section}>
        <div className={styles.grid}>
          {/* Left — value */}
          <div>
            <h1 className={styles.title}>
              AI経営の可能性を、<br />
              <em>具体的な戦略と事例</em>でご提案します。
            </h1>
            <p className={styles.lead}>
              貴社の課題解決に向けたアプローチや、導入メリット、他社事例などをまとめたご提案資料をお送りします。
            </p>

            <div className={styles.deck}>
              <div className={`${styles.deckCard} ${styles.deckChart}`}>
                <div className={styles.chartTitle}>導入効果のイメージ</div>
                <div className={styles.bars}>
                  {bars.map((h, i) => (
                    <span key={i} className={styles.bar} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className={styles.chips}>
                  <span className={styles.chip}>売上向上 +32%</span>
                  <span className={styles.chip}>業務工数 -45%</span>
                </div>
              </div>
              <div className={`${styles.deckCard} ${styles.deckCover}`}>
                <div className={styles.coverGlow} />
                <div className={styles.coverBrand}>AI総合戦略研究所</div>
                <div className={styles.coverTitle}>AI経営基盤<br />ご提案資料</div>
                <div className={styles.coverSub}>サービス概要・導入事例・効果</div>
                <div className={styles.coverRule} />
                <div className={styles.coverConf}>CONFIDENTIAL</div>
              </div>
            </div>

            <div className={styles.features}>
              {features.map((f) => (
                <div key={f.title} className={styles.feature}>
                  <span className={styles.featIcon}><Icon name={f.icon} size={20} /></span>
                  <div>
                    <div className={styles.featTitle}>{f.title}</div>
                    <div className={styles.featText}>{f.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.trust}>
              <span><Icon name="shield-check" size={17} /></span>
              ご入力いただいた情報は、資料の送付およびご提案目的のみに使用します。
            </div>
          </div>

          {/* Right — form */}
          <DownloadForm />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
