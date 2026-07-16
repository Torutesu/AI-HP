// Canonical site origin. Set NEXT_PUBLIC_SITE_URL in the Cloudflare Pages
// environment (and locally in .env) to your real domain once it's connected;
// the fallback keeps builds working before that.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ai-strategy-institute.example"
).replace(/\/$/, "");

export const SITE_NAME = "AI総合戦略研究所";
export const SITE_NAME_EN = "AI Strategy Institute";
export const SITE_DESCRIPTION =
  "AIを「試して終わり」にさせません。戦略設計から内製AI開発まで、コスト削減・売上向上・利益率改善という経営の数字が動くところまで伴走する、実装型のAIパートナーです。";
