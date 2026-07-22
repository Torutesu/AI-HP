import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import RecruitingForm from "@/components/RecruitingForm";
import type { Metadata } from "next";
import styles from "./recruiting.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/recruiting/" },
  title: "採用情報",
  description:
    "AI総合戦略研究所では、AI Native企業を一緒につくる仲間を募集しています。戦略から実装まで、成果が動くところまでやり切る人を歓迎します。",
};

const values = [
  {
    title: "成果で語る",
    text: "見た目の派手さより、経営の数字が動いたかを大事にします。",
    image: "/img/company/promise.jpg",
  },
  {
    title: "仮説で速く動く",
    text: "完璧を待たず、小さく作って確かめ、学びながら前に進みます。",
    image: "/img/company/position.jpg",
  },
  {
    title: "現場に入る",
    text: "机上の設計で終わらせず、使われるところまで一緒に詰めます。",
    image: "/img/company/mission.jpg",
  },
];

const roles = [
  {
    title: "AIコンサル / 事業設計",
    body: "顧客の事業構造を整理し、AI導入の優先順位と実装方針を設計します。",
  },
  {
    title: "AIエンジニア / 実装",
    body: "LLMや業務自動化の仕組みを、現場で使えるかたちに落とし込みます。",
  },
  {
    title: "セールス / パートナー推進",
    body: "提携先や見込み顧客との接点を広げ、提案から受注までを前に進めます。",
  },
];

const process = [
  { step: "01", title: "カジュアル面談", text: "まずはお互いの仕事観と関心領域を軽く話します。" },
  { step: "02", title: "業務のすり合わせ", text: "お任せしたい役割と、できることを具体的に整理します。" },
  { step: "03", title: "実務の確認", text: "必要に応じて、実際の仕事に近い形で見ます。" },
  { step: "04", title: "参画", text: "条件が合えば、実装フェーズから一緒に入っていきます。" },
];

export default function Page() {
  return (
    <>
      <SiteHeader variant="solid" />
      <div className={styles.page}>
        <PageHero
          crumbs={[{ label: "ホーム", href: "/" }, { label: "採用情報" }]}
          eyebrow="RECRUIT"
          title={
            <>
              AI Native企業を、<br />
              一緒につくる。
            </>
          }
          lead="AI総合戦略研究所では、戦略から実装まで、成果が動くところまでやり切る仲間を募集しています。今ある枠に合わせるというより、事業を前に進める役割を一緒に作っていく採用です。"
          bgImage="/img/company/mission.jpg"
        />

        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="WHAT WE VALUE"
              title="採用で大切にしていること"
              lead="肩書きよりも、何を前に進められるか。そんな見方で一緒に仕事をします。"
            />

            <div className={styles.valueGrid}>
              {values.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08} className={styles.valueCard}>
                  <span
                    className={styles.valueImage}
                    style={{ backgroundImage: `url(${item.image})` }}
                    aria-hidden="true"
                  />
                  <span className={styles.valueOverlay} aria-hidden="true" />
                  <div className={styles.valueCopy}>
                    <h2>{item.title}</h2>
                    <p>{item.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="ROLES"
              title="今、歓迎したい役割"
              lead="フルタイム前提だけでなく、得意領域がはっきりしている方も歓迎します。"
              align="left"
            />

            <div className={styles.roleGrid}>
              {roles.map((role, i) => (
                <Reveal key={role.title} delay={i * 0.08} className={styles.roleCard}>
                  <span className={styles.roleIndex}>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{role.title}</h3>
                  <p>{role.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHeading
              eyebrow="PROCESS"
              title="採用の進め方"
              lead="いきなり応募ではなく、まずは話してみるところから始めましょう。"
            />

            <div className={styles.processGrid}>
              {process.map((item) => (
                <Reveal key={item.step} className={styles.processCard}>
                  <span className={styles.processStep}>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionBottom}>
          <div className={styles.container}>
            <Reveal className={styles.applicationBand}>
              <div className={styles.applicationCopy}>
                <span className={styles.applicationEyebrow}>JOIN US</span>
                <h2>まずは、応募から。履歴書や職務経歴書を添えてご連絡ください。</h2>
                <p>
                  いきなり完璧な応募でなくて大丈夫です。どの職種に関心があるかを選んで、
                  必要書類を添付していただければ、担当者が確認します。
                </p>
                <ul className={styles.applicationList}>
                  <li>応募職種は「オープンポジション」「その他」も選べます。</li>
                  <li>履歴書・職務経歴書は1ファイル添付してください。</li>
                  <li>ご相談ベースでも、そのまま送信いただけます。</li>
                </ul>
              </div>
              <RecruitingForm />
            </Reveal>
          </div>
        </section>
      </div>
      <SiteFooter />
    </>
  );
}
