import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  alternates: { canonical: "/editorial-policy/" },
  title: "編集方針",
  description:
    "AI総合戦略研究所 編集部の編集方針。一次情報主義、出典の明示、実務資料の全文公開、更新ポリシー、AIの利用と検証体制、訂正方針について定めています。",
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "運営主体",
    body: [
      "本メディア「AI総合戦略研究所」は、AI総合戦略研究所 編集部が運営しています（運営会社：株式会社Select）。経営とAIの実装に関する実務知を、意思決定に使える形で発信することを目的としています。",
    ],
  },
  {
    heading: "編集方針",
    body: [
      "私たちは一次情報主義を採用しています。公的機関の統計、原典となる論文・技術文書、自社の実装から得られた知見など、出典をたどれる情報を土台に記事を構成します。",
      "出典を明示できない統計や数字は掲載しません。伝聞や出所不明のデータに基づく主張は行わず、確からしさを担保できる範囲で記述します。",
    ],
  },
  {
    heading: "実務資料の公開方針",
    body: [
      "テンプレートや雛形は、実務でそのまま使える完成度で全文公開します。読者が現場で活用できることを最優先に、抜粋や断片ではなく、必要な要素を満たした形で提供します。",
      "資料は継続的に見直し、実務の変化に合わせて改訂します。",
    ],
  },
  {
    heading: "更新ポリシー",
    body: [
      "制度・技術・市場など、時点に依存する記述には「YYYY年M月時点」であることを明記します。情報は定期的に洗い替え、古くなった内容は更新または注記します。",
      "各記事の最終更新日は記事上部に表示し、いつ時点の情報かを読者が確認できるようにしています。",
    ],
  },
  {
    heading: "AIの利用について",
    body: [
      "記事の執筆や構成にはAIを積極的に活用しています。一方で、事実関係・数値・出典については編集部が確認し、検証を経たうえで公開します。",
      "AIはあくまで執筆を支援する道具であり、最終的な内容の責任は編集部が負います。",
    ],
  },
  {
    heading: "訂正について",
    body: [
      "掲載後に誤りが判明した場合は、速やかに修正します。読者の理解に影響する重要な訂正については、記事内にその旨を明記します。",
      "ご指摘やお問い合わせは、お問い合わせフォームより承っています。",
    ],
  },
];

export default function EditorialPolicyPage() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "編集方針" }]}
          title={<>編集方針</>}
          lead="AI総合戦略研究所 編集部が、記事と実務資料をどのような考えで制作・公開しているかを定めています。"
        />

        <section style={{ padding: "64px 0 96px" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 24px" }}>
            {sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 0.04} style={{ marginBottom: "44px" }}>
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--fg-0)",
                    letterSpacing: "-0.01em",
                    margin: "0 0 14px",
                  }}
                >
                  {s.heading}
                </h2>
                {s.body.map((p, j) => (
                  <p
                    key={j}
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.95,
                      color: "var(--fg-1)",
                      margin: "0 0 14px",
                    }}
                  >
                    {p}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
