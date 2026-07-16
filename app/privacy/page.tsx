import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy/" },
  title: "プライバシーポリシー",
  description:
    "株式会社Select（AI総合戦略研究所）の個人情報の取り扱いに関する方針（プライバシーポリシー）です。",
};

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. 事業者情報",
    body: [
      "名称：株式会社Select（AI総合戦略研究所）",
      "所在地：東京都渋谷区恵比寿西1-16-11",
      "代表者：田野徹",
    ],
  },
  {
    heading: "2. 取得する情報",
    body: [
      "当社は、お問い合わせ・資料ダウンロード・各種お申し込みの際に、会社名、氏名、役職、メールアドレス、電話番号、ご相談内容などの情報を取得します。",
      "また、サービス向上のため、Cookieやアクセス解析ツールを通じて、閲覧履歴やアクセス状況などの情報を取得する場合があります。",
    ],
  },
  {
    heading: "3. 利用目的",
    body: [
      "取得した情報は、以下の目的で利用します。",
      "・お問い合わせ・ご相談への対応、資料の送付のため",
      "・当社サービスのご案内、ご提案のため",
      "・サービスの提供、維持、改善、および新サービスの開発のため",
      "・法令に基づく対応のため",
    ],
  },
  {
    heading: "4. 第三者提供",
    body: [
      "当社は、次の場合を除き、あらかじめご本人の同意を得ることなく、個人情報を第三者に提供しません。",
      "・法令に基づく場合",
      "・人の生命、身体または財産の保護のために必要であり、ご本人の同意を得ることが困難な場合",
      "・業務を委託する場合において、委託先に対して必要な範囲で提供し、適切な監督を行う場合",
    ],
  },
  {
    heading: "5. 安全管理措置",
    body: [
      "当社は、取得した個人情報の漏えい、滅失またはき損の防止その他個人情報の安全管理のために、必要かつ適切な措置を講じます。",
    ],
  },
  {
    heading: "6. Cookie・アクセス解析について",
    body: [
      "当社のウェブサイトでは、利便性の向上やアクセス状況の把握のためにCookieを利用する場合があります。ブラウザの設定によりCookieを無効化することができますが、一部の機能がご利用いただけない場合があります。",
    ],
  },
  {
    heading: "7. 開示・訂正・利用停止等の請求",
    body: [
      "ご本人からの個人情報の開示、訂正、追加、削除、利用停止等のご請求については、下記のお問い合わせ窓口にて、ご本人であることを確認のうえ、法令に従い対応いたします。",
    ],
  },
  {
    heading: "8. 本ポリシーの改定",
    body: [
      "当社は、法令の変更やサービス内容の変更に応じて、本ポリシーを予告なく改定することがあります。改定後の内容は、本ページに掲載した時点から効力を生じるものとします。",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div style={{ background: "var(--white)" }}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "プライバシーポリシー" }]}
          title="プライバシーポリシー"
          lead="株式会社Select（AI総合戦略研究所）は、お客様の個人情報を適切に取り扱い、その保護に努めます。"
        />

        <article style={{ maxWidth: "820px", margin: "0 auto", padding: "64px 24px 40px" }}>
          {sections.map((s) => (
            <section key={s.heading} style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg-0)", margin: "0 0 14px" }}>
                {s.heading}
              </h2>
              {s.body.map((p, i) => (
                <p key={i} style={{ margin: "0 0 10px", fontSize: "14.5px", lineHeight: 1.95, color: "var(--fg-2)" }}>
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section style={{ marginBottom: "8px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--fg-0)", margin: "0 0 14px" }}>
              9. お問い合わせ窓口
            </h2>
            <p style={{ margin: "0 0 10px", fontSize: "14.5px", lineHeight: 1.95, color: "var(--fg-2)" }}>
              本ポリシーおよび個人情報の取り扱いに関するお問い合わせは、
              <Link href="/contact" style={{ color: "var(--accent)" }}>お問い合わせフォーム</Link>
              よりご連絡ください。
            </p>
          </section>

          <p style={{ marginTop: "24px", fontSize: "12.5px", color: "var(--fg-3)" }}>制定日：2026年7月15日</p>
        </article>
      </div>
      <SiteFooter />
    </>
  );
}
