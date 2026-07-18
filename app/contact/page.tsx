import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/contact/" },
  title: "お問い合わせ・無料相談",
  description: "AI総合戦略研究所へのお問い合わせ・無料相談フォーム。サービス内容、費用感、無料のAI経営診断など、どんなご相談もお気軽にどうぞ。",
};

const CHECKS = [
  "サービスについて詳しく知りたい",
  "金額や費用感を知りたい",
  "自社の規模や課題に合わせた提案が欲しい",
  "まず、無料のAI経営診断を受けたい",
  "社内へのAI活用の進め方を相談したい",
];

export default function ContactPage() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "お問い合わせ" }]}
          title="お問い合わせ・無料相談。"
          lead="フォームに必要事項とご相談内容をご記入ください。確認後、担当者よりご返信いたします。"
        />

        <div className={styles.contactSection}>
          <div className={styles.contactLayout}>
            <div className={styles.intro}>
              <h2 className={styles.introTitle}>お気軽にお問い合わせください。</h2>
              <p className={styles.introText}>
                ご相談内容が固まっていなくても構いません。課題の整理からお手伝いします。
              </p>
              <div className={styles.checkList}>
                {CHECKS.map((c) => (
                  <div key={c} className={styles.checkItem}>
                    <span className={styles.checkIcon}><Icon name="check" size={18} /></span>
                    {c}
                  </div>
                ))}
              </div>
              <p className={styles.downloadNote}>
                資料だけご覧になりたい方は、<a href="/download">資料ダウンロード</a>もご利用いただけます。
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
