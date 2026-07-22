import { SITE_URL, SITE_NAME, SITE_NAME_EN } from "@/lib/site";
import { publishedArticles } from "@/lib/magazine";

// Generated as a static file (/llms.txt) at build time. Uses SITE_URL so the
// links reflect the real domain once NEXT_PUBLIC_SITE_URL is set.
// Format follows https://llmstxt.org/
export const dynamic = "force-static";

export function GET() {
  const pages = [
    ["トップページ", "/", "サービス概要と価値提供"],
    ["サービス", "/service/", "提供サービスの全体像"],
    ["AI経営基盤", "/ai-os/", "コスト削減×売上向上×利益率改善を内製で実装するAI OS"],
    ["コンサルティング", "/consulting/", "可視化・診断から改善の伴走まで"],
    ["パートナー募集", "/partners/", "紹介パートナーと代理店拡販パートナーの募集"],
    ["導入事例", "/cases/", "業種別の活用シナリオとシミュレーション"],
    ["会社概要", "/company/", "運営会社（株式会社Select）情報"],
    ["マガジン", "/magazine/", "経営とAIの実装知に関する記事"],
    ["お問い合わせ", "/contact/", "無料相談・AI経営診断の受付"],
    ["資料ダウンロード", "/download/", "サービス資料（PDF）"],
    ["編集方針", "/editorial-policy/", "編集部の方針・一次情報主義・訂正方針（E-E-A-T）"],
  ];

  const body = `# ${SITE_NAME} (${SITE_NAME_EN})

> AIを「試して終わり」にさせない、実装型のAIパートナー。戦略設計から内製AI開発まで一気通貫で支援し、コスト削減・売上向上・利益率改善という経営の数字が動くところまで伴走します。運営：株式会社Select。

${SITE_NAME}は、従業員50名以上の企業の経営層・IT意思決定者に向けて、AIを経営成果に結びつける支援を提供します。汎用SaaSの代替と業務自動化によるコスト削減、営業・マーケティングAIの内製による売上向上、そして両輪がかみ合うことでの利益率改善を、貴社専属のAI経営基盤（AI OS）として実装します。研修や実証実験で終わらせず、毎月の数字で成果を確かめ、改善が回り続ける体制まで伴走するのが特徴です。

## 主要ページ
${pages.map(([t, p, d]) => `- [${t}](${SITE_URL}${p}): ${d}`).join("\n")}

## マガジン記事
${publishedArticles.map((a) => `- [${a.title}](${SITE_URL}/magazine/${a.slug}/): ${a.excerpt}`).join("\n")}

## コンテンツのテーマ・対象読者
- テーマ: AI導入支援 / コスト削減 / 売上向上 / 内製AI開発 / AI経営基盤（AI OS）/ 業務自動化 / ROI可視化
- 対象読者: 従業員50名以上の企業の経営者・役員・情報システム/事業の意思決定者

## 更新情報
- RSSフィード: ${SITE_URL}/feed.xml

## 連絡先
- お問い合わせ・無料相談: ${SITE_URL}/contact/
- 運営会社: 株式会社Select（東京都渋谷区恵比寿西1-16-11）
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
