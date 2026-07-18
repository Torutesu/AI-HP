import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const root = process.cwd();
const sourcePath = path.join(root, "lib/magazine.ts");
const manifestPath = path.join(root, "content/magazine-thumbnails.json");
const imageDir = path.join(root, "public/img/magazine");
const checkOnly = process.argv.includes("--check");

const CATEGORY_SCENES = {
  "コスト削減": "a physical cost model that makes waste, recurring fees, or process compression immediately visible",
  "売上向上": "a precise commercial workflow that makes prioritization, conversion, or next actions immediately visible",
  "事例・シナリオ": "a recognizable real-world business workspace focused on the task being transformed",
  "経営・組織": "an executive decision model showing governance, adoption, investment, or organizational change",
  "技術トレンド": "an evaluation bench of modular technology components showing differences, selection, or compatibility",
};

function loadArticles() {
  const source = fs.readFileSync(sourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
    fileName: sourcePath,
  }).outputText;
  const module = { exports: {} };
  const localRequire = createRequire(sourcePath);
  new Function("module", "exports", "require", output)(module, module.exports, localRequire);
  return module.exports.articles;
}

function plainText(value) {
  return value
    .replace(/^##\s*/u, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, "$1")
    .replace(/\s+/gu, " ")
    .trim();
}

function sourceHash(article) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      summary: article.summary,
      body: article.body,
    }))
    .digest("hex")
    .slice(0, 12);
}

function fileHash(filePath) {
  return fs.existsSync(filePath)
    ? crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex").slice(0, 12)
    : undefined;
}

function buildPrompt(article) {
  const headings = article.body
    .filter((block) => block.startsWith("## "))
    .slice(0, 4)
    .map(plainText);
  const context = [article.summary, article.excerpt]
    .filter(Boolean)
    .map(plainText)
    .join(" ")
    .slice(0, 520);
  const scene = CATEGORY_SCENES[article.category] ?? CATEGORY_SCENES["事例・シナリオ"];

  return [
    "Use case: productivity-visual",
    "Asset type: premium editorial thumbnail for a Japanese AI strategy magazine, 16:9 landscape",
    `Article title: ${article.title}`,
    `Editorial context: ${context}`,
    headings.length ? `Key sections: ${headings.join(" / ")}` : null,
    `Primary visual direction: ${scene}. Choose one concrete object or workflow from the article as the focal subject. The image must communicate the article before decoration.`,
    "Style/medium: premium photorealistic editorial still life blended with subtle architectural data visualization, sophisticated Japanese B2B design, realistic materials, not sci-fi",
    "Composition/framing: one strong focal subject, generous negative space, balanced 16:9 crop, readable at small card size",
    "Lighting/mood: soft daylight, calm, precise, trustworthy",
    "Color palette: white, very pale cool gray, restrained cobalt blue accents, subtle navy shadows",
    "Constraints: no people, no faces, no visible brand, no legible text, no letters, no numbers, no logos, no watermark",
    "Avoid: generic glowing AI brain, humanoid robots, neon cyberpunk, floating hologram overload, stock-photo handshake, clutter, saturated gradients",
  ].filter(Boolean).join("\n");
}

const previous = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : { version: 1, articles: {} };
const articles = loadArticles();
const nextEntries = {};

for (const article of articles) {
  const current = previous.articles?.[article.slug] ?? {};
  const webpPath = path.join(imageDir, `${article.slug}.webp`);
  const pngPath = path.join(imageDir, `${article.slug}.png`);
  const asset = fs.existsSync(webpPath)
    ? `/img/magazine/${article.slug}.webp`
    : fs.existsSync(pngPath)
      ? `/img/magazine/${article.slug}.png`
      : undefined;
  const hash = sourceHash(article);
  const assetPath = fs.existsSync(webpPath) ? webpPath : fs.existsSync(pngPath) ? pngPath : undefined;
  const imageHash = assetPath ? fileHash(assetPath) : undefined;
  const imageChanged = Boolean(imageHash && imageHash !== current.imageHash);
  const approvedSourceHash = imageChanged ? hash : current.approvedSourceHash;

  nextEntries[article.slug] = {
    status: asset && approvedSourceHash === hash ? "ready" : "pending",
    ...(asset ? { path: asset } : {}),
    sourceHash: hash,
    ...(imageHash ? { imageHash } : {}),
    ...(approvedSourceHash ? { approvedSourceHash } : {}),
    updatedAt:
      current.sourceHash === hash && !imageChanged
        ? current.updatedAt
        : new Date().toISOString().slice(0, 10),
    prompt: buildPrompt(article),
  };
}

const manifest = {
  version: 1,
  artDirection: "Premium Japanese B2B editorial still life. White and cool-gray space, restrained cobalt and navy, one clear business object, no people, no text, no logos, no generic AI imagery.",
  articles: nextEntries,
};
const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
const existing = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, "utf8") : "";

if (checkOnly) {
  if (serialized !== existing) {
    console.error("Magazine thumbnail briefs are stale. Run: npm run magazine:thumbnail-briefs");
    process.exit(1);
  }
  console.log(`Magazine thumbnail briefs are current (${articles.length} articles).`);
} else {
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, serialized);
  const ready = Object.values(nextEntries).filter((entry) => entry.status === "ready").length;
  console.log(`Updated ${manifestPath}: ${ready} ready, ${articles.length - ready} pending.`);
}
