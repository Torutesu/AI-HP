// Magazine content source.
// A single, typed data module drives the list page, the category filter, the
// per-article detail pages (/magazine/[slug]) and the sitemap. To publish a new
// article, add an entry here (or migrate to MDX/CMS later — see README).

export type Article = {
  slug: string;
  category: string;
  title: string;
  date: string; // published, "YYYY.MM.DD"
  updatedAt?: string; // last updated, "YYYY.MM.DD"; falls back to `date`
  excerpt: string;
  featured?: boolean;
  image?: string; // absolute or root-relative OG/Article image; falls back site-wide
  body: string[]; // paragraphs (plain text)
};

/** Published/updated date as an ISO (YYYY-MM-DD) string for schema + sitemap. */
export function isoDate(a: Article): string {
  return (a.updatedAt ?? a.date).replace(/\./g, "-");
}
export function isoPublished(a: Article): string {
  return a.date.replace(/\./g, "-");
}

export const CATEGORIES = [
  "コスト削減",
  "売上向上",
  "事例・シナリオ",
  "経営・組織",
  "技術トレンド",
] as const;

export const articles: Article[] = [
  {
    slug: "poc-to-results",
    category: "経営・組織",
    title: "「AIを試した」で止まる会社と、数字が動く会社の違い",
    date: "2026.07.10",
    featured: true,
    excerpt:
      "PoCの先へ進めない最大の理由は、技術ではなく設計にある。経営の数字から逆算する実装の型を解説します。",
    body: [
      "多くの企業がAIの実証実験（PoC）までは到達します。しかし、そこから経営の数字が動く実装へと進める企業は多くありません。両者を分けるのは、モデルの性能でも予算でもなく、「どの数字を、いくら動かすのか」を最初に定義できているかどうかです。",
      "成果が出る会社は、コスト削減・売上向上・利益率という経営指標から逆算し、AIが介在すべき業務を特定します。実装は業務単位で区切られ、毎月の数字で効果が検証され、改善が回り続けます。試して終わりにしない体制が、はじめから設計されているのです。",
      "反対に止まる会社は、ツール導入そのものが目的化し、活用度も費用対効果も可視化されません。まずは現状の可視化と診断から。ここが、数字を動かす実装の出発点になります。",
    ],
  },
  {
    slug: "saas-cost-one-third",
    category: "コスト削減",
    title: "汎用SaaSの固定費を、内製で1/3にする考え方",
    date: "2026.07.08",
    excerpt:
      "毎月積み上がる汎用SaaSの固定費を、内製AIで構造から見直す。削減の考え方と進め方を整理します。",
    body: [
      "十分に使われていないライセンス、機能の一部しか使っていない高額なSaaS——汎用SaaSの固定費は、静かに利益を圧迫します。内製化は、この構造そのものを見直す打ち手です。",
      "鍵は、ゼロから作らないこと。開発済みのモジュールと最先端のオープン技術を組み合わせることで、同等の機能をより軽い構造で実装できます。結果として、汎用SaaSに払い続ける必要がなくなり、コストは大きく圧縮されます。",
    ],
  },
  {
    slug: "sales-ai-win-rate",
    category: "売上向上",
    title: "営業支援AIで商談の勝率を上げる、3つの実装パターン",
    date: "2026.07.05",
    excerpt:
      "商談分析・提案書自動生成・顧客ランキング。営業の現場で効く3つの実装パターンを紹介します。",
    body: [
      "営業支援AIは、単なる効率化にとどまりません。商談内容の分析、提案書の自動生成、顧客の優先度付けを通じて、勝てる商談に資源を集中させます。",
      "第一に商談分析。会話内容を構造化し、次の一手を示唆します。第二に提案書自動生成。準備時間を削り、提案の質と量を両立します。第三に顧客ランキング。受注確度の高い相手を見極め、営業の時間を最適配分します。",
    ],
  },
  {
    slug: "application-layer-cases",
    category: "技術トレンド",
    title: "アプリケーションレイヤーの最新事例と、日本企業への示唆",
    date: "2026.07.02",
    excerpt:
      "グローバルのアプリケーションレイヤー事例から、日本企業が取り入れるべき勝ち筋を読み解きます。",
    body: [
      "AIの価値は、基盤モデルそのものよりも、それを業務に落とし込むアプリケーションレイヤーで生まれます。世界の先端事例は、日々このレイヤーで更新されています。",
      "重要なのは、事例をそのまま輸入するのではなく、自社の事業構造に最適な形へ翻訳すること。解像度の高い事例研究が、貴社の次の一手を具体化します。",
    ],
  },
  {
    slug: "manufacturing-estimate",
    category: "事例・シナリオ",
    title: "製造業の見積工数を半減させた、AI置換の進め方",
    date: "2026.06.28",
    excerpt:
      "属人化しがちな見積・図面対応をAIに置換。工程知識を全社の資産に変える進め方を解説します。",
    body: [
      "製造業では、見積や図面対応、問い合わせ処理といった業務が特定の熟練者に集中しがちです。属人化した知識は、退職や多忙によって滞りを生みます。",
      "これらの業務をAIに置換することで、見積作成の工数を大きく削減し、対応スピードを引き上げられます。あわせて、工程知識を全社で使える形に整えることが、継続的な効果につながります。",
    ],
  },
  {
    slug: "roi-visualization",
    category: "経営・組織",
    title: "AI活用度を役員会で語るための、ROI可視化フレーム",
    date: "2026.06.24",
    excerpt:
      "投資対効果を役員会で説明できる形に。活用度とROIを可視化するフレームを紹介します。",
    body: [
      "AI投資に対して「何が得られたのか」を役員会で客観的な数字として示せる企業は多くありません。可視化の欠如が、次の投資判断を鈍らせます。",
      "メンバー・ツール別の活用度、削減できた工数、生まれた売上——これらを一貫した指標で捉えることで、投資対効果を経営の言葉で語れるようになります。",
    ],
  },
  {
    slug: "license-audit",
    category: "コスト削減",
    title: "使われないライセンスを見つける、活用度診断のはじめ方",
    date: "2026.06.20",
    excerpt:
      "誰が、どのツールを、どれだけ使っているか。活用度診断から、無駄な固定費を洗い出します。",
    body: [
      "多くの企業では、契約しているツールの活用状況を即座に把握できていません。使われないライセンスは、そのまま毎月の固定費になります。",
      "活用度診断は、コスト削減の第一歩です。現状を数字で捉えることで、削るべき固定費と、伸ばすべき活用が明確になります。",
    ],
  },
  {
    slug: "back-office-automation",
    category: "事例・シナリオ",
    title: "バックオフィスの書類処理を6割減らす、自動化の設計",
    date: "2026.06.16",
    excerpt:
      "請求・経費・データ入力といった定型業務を自動化し、人の時間を判断業務へ戻す設計を解説します。",
    body: [
      "バックオフィスの定型業務は、量が多く、ミスも生まれやすい領域です。書類・データ処理の自動化は、工数削減と品質向上を同時に実現します。",
      "重要なのは、業務フロー全体を見渡し、どこをAIに任せ、どこを人が判断するかを設計すること。切り分けの精度が、自動化の効果を決めます。",
    ],
  },
  {
    slug: "ai-native-organization",
    category: "経営・組織",
    title: "AI Native企業への移行を、現場に定着させる組織設計",
    date: "2026.06.12",
    excerpt:
      "研修だけでは定着しない。AI活用を現場の業務に根づかせる組織設計の勘所をまとめます。",
    body: [
      "AI活用は、研修を受けるだけでは現場に定着しません。学んだ知識が業務に結びついてはじめて、成果につながります。",
      "現場が日常的に使う業務に組み込み、成果を数字で確かめ、改善を回す。この体制づくりこそが、AI Native企業への移行を確かなものにします。",
    ],
  },
  {
    slug: "open-tech-cost",
    category: "技術トレンド",
    title: "最先端のオープン技術で、開発コストを構造から圧縮する",
    date: "2026.06.08",
    excerpt:
      "世界最先端のオープン技術をどう活用すれば、開発コストを構造から下げられるのかを解説します。",
    body: [
      "AIモデルも活用手法も、日進月歩で進化しています。最先端のオープン技術を取り入れることで、開発コストを構造から圧縮できます。",
      "自社に閉じた開発ではなく、グローバルの進化を取り込み続ける。この姿勢が、軽くて速い内製化を支えます。",
    ],
  },
];

export const featuredArticle = articles.find((a) => a.featured) ?? articles[0];
export const listArticles = articles.filter((a) => !a.featured);

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
