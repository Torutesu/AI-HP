import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import DownloadForm from "@/components/DownloadForm";

export const metadata: Metadata = {
  title: "資料ダウンロード",
  description: "AI総合戦略研究所のサービス資料を無料でダウンロード。サービス概要・事例・進め方を一冊にまとめた全18ページ。約3分でお読みいただけます。",
};

const CONTENTS = [
  { icon: "layout-grid", text: "サービス全体像と、提供の流れ" },
  { icon: "trending-down", text: "コスト削減・売上向上の考え方" },
  { icon: "layers", text: "業種別のシミュレーション事例" },
  { icon: "route", text: "導入までの進め方と体制" },
];

export default function DownloadPage() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "資料ダウンロード" }]}
          eyebrow="DOCUMENT"
          title="サービス資料を、無料でダウンロード。"
          lead="サービス概要・事例・進め方を一冊に。3分でお読みいただけます。ご入力のアドレスへPDFをお送りします。"
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
              gridTemplateColumns: "0.85fr 1.15fr",
              gap: "56px",
              alignItems: "start",
            }}
          >
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "14px" }}>
                INSIDE THE MATERIAL
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--fg-0)", letterSpacing: "-0.01em", margin: "0 0 20px" }}>
                お送りする資料の中身。
              </div>

              <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "28px" }}>
                <div style={{ flex: "none", width: "132px", borderRadius: "8px", overflow: "hidden", border: "0.5px solid var(--line-strong)", boxShadow: "0 12px 30px rgba(12,21,36,0.12)" }}>
                  <div style={{ position: "relative", aspectRatio: "3 / 4", background: "linear-gradient(150deg, #0B1B3A 0%, #123A86 55%, #1E63E6 100%)", padding: "16px 15px", display: "flex", flexDirection: "column" }}>
                    <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "96px", height: "96px", borderRadius: "999px", background: "radial-gradient(circle, rgba(255,255,255,0.22), transparent 68%)" }} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo-mark.png" alt="" style={{ height: "20px", width: "auto", filter: "brightness(0) invert(1)", marginBottom: "auto" }} />
                    <div style={{ fontSize: "8px", fontWeight: 600, letterSpacing: "0.14em", color: "rgba(255,255,255,.7)", marginBottom: "6px" }}>SERVICE GUIDE 2026</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.5, color: "#fff" }}>AI経営基盤<br />サービスご紹介</div>
                    <div style={{ marginTop: "10px", height: "1px", background: "rgba(255,255,255,.25)" }} />
                    <div style={{ marginTop: "8px", fontSize: "7.5px", letterSpacing: "0.1em", color: "rgba(255,255,255,.6)" }}>AI総合戦略研究所</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "2px" }}>
                  {CONTENTS.map((c) => (
                    <div key={c.text} style={{ display: "flex", gap: "9px", alignItems: "flex-start", fontSize: "13px", lineHeight: 1.5, color: "var(--fg-1)" }}>
                      <span style={{ flex: "none", color: "var(--accent)", marginTop: "1px" }}><Icon name={c.icon} size={15} /></span>
                      {c.text}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "18px", padding: "14px 18px", background: "var(--surface-card)", border: "0.5px solid var(--line-strong)", borderRadius: "8px", marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", color: "var(--fg-2)" }}>
                  <span style={{ color: "var(--accent)" }}><Icon name="file-text" size={15} /></span>全18ページ
                </div>
                <div style={{ width: "1px", height: "16px", background: "var(--line-strong)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", color: "var(--fg-2)" }}>
                  <span style={{ color: "var(--accent)" }}><Icon name="clock" size={15} /></span>約3分で読了
                </div>
                <div style={{ width: "1px", height: "16px", background: "var(--line-strong)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", color: "var(--fg-2)" }}>PDF・無料</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "13px", color: "var(--fg-2)" }}>
                  <span style={{ color: "var(--accent)" }}><Icon name="shield-check" size={17} /></span>無理な営業は行いません
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center", fontSize: "13px", color: "var(--fg-2)" }}>
                  <span style={{ color: "var(--accent)" }}><Icon name="lock" size={17} /></span>いただいた情報は厳重に管理します
                </div>
              </div>
            </div>

            <DownloadForm />
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
