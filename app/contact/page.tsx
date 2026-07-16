import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
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

        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "var(--white)" }}>
          <div
            className="dc-collapse"
            style={{
              maxWidth: "1080px",
              margin: "0 auto",
              padding: "8px 24px 96px",
              position: "relative",
              display: "grid",
              gridTemplateColumns: "0.82fr 1.18fr",
              gap: "56px",
              alignItems: "start",
            }}
          >
            <div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg-0)", letterSpacing: "-0.01em", margin: "0 0 8px" }}>
                こんなご相談を、承ります。
              </div>
              <p style={{ fontSize: "14px", lineHeight: 1.9, color: "var(--fg-2)", margin: "0 0 24px" }}>
                どんな些細なことでも構いません。まずはお気軽にご相談ください。
              </p>
              <div style={{ background: "var(--surface-card)", border: "0.5px solid var(--line-strong)", borderRadius: "12px", padding: "28px 30px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {CHECKS.map((c) => (
                  <div key={c} style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "14px", lineHeight: 1.6, color: "var(--fg-1)" }}>
                    <span style={{ flex: "none", color: "var(--accent)", marginTop: "1px" }}><Icon name="check" size={18} /></span>
                    {c}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "13px", lineHeight: 1.9, color: "var(--fg-2)", margin: "24px 0 0" }}>
                資料だけご覧になりたい方は、<a href="/download" style={{ color: "var(--accent)" }}>資料ダウンロード</a>もご利用いただけます。
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
