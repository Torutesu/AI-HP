/**
 * リード管理ダッシュボードを「実データ」で生成するスクリプト。
 *
 * Cloudflare D1 の HTTP API からリードを取得し、静的な HTML ダッシュボードを
 * 書き出す。生成された HTML は Claude Code が Artifact として公開する運用。
 *
 * 必要な環境変数（またはコマンド引数）:
 *   CLOUDFLARE_API_TOKEN   D1 Read 権限のAPIトークン
 *   CLOUDFLARE_ACCOUNT_ID  CloudflareアカウントID
 *   D1_DATABASE_ID         D1データベースID（既定: ai-hp-leads）
 *
 * 使い方:
 *   node scripts/render-leads.mjs [出力パス]
 */

const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID;
const DB_ID = process.env.D1_DATABASE_ID || "68391b6e-588c-482f-b1df-87ea374a60a4";
const OUT = process.argv[2] || "leads-live.html";

if (!API_TOKEN || !ACCOUNT_ID) {
  console.error(
    "環境変数が不足しています。CLOUDFLARE_API_TOKEN と CLOUDFLARE_ACCOUNT_ID を設定してください。"
  );
  process.exit(1);
}

const SQL = `
  SELECT id, created_at, type, company, pref, size, role, title,
         last_name, first_name, email, phone, kind, message, asset, themes, roi,
         ai_summary, ai_intent, ai_priority, ai_priority_reason,
         ai_next_action, ai_handling, ai_talking_points, ai_reply, ai_status
  FROM leads
  ORDER BY ai_priority DESC, created_at DESC
  LIMIT 500
`;

// Use curl rather than fetch: outbound HTTPS in this environment goes through a
// pre-configured proxy that curl honors (via HTTPS_PROXY) but Node's fetch does
// not by default. curl keeps this a single-command workflow.
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileP = promisify(execFile);

async function queryD1() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}/query`;
  const { stdout } = await execFileP(
    "curl",
    [
      "-s", "-X", "POST", url,
      "-H", `Authorization: Bearer ${API_TOKEN}`,
      "-H", "Content-Type: application/json",
      "--data", JSON.stringify({ sql: SQL }),
    ],
    { maxBuffer: 32 * 1024 * 1024 }
  );
  let json;
  try {
    json = JSON.parse(stdout);
  } catch {
    throw new Error(`D1 応答がJSONではありません: ${stdout.slice(0, 200)}`);
  }
  if (!json.success) {
    throw new Error(`D1 query failed: ${JSON.stringify(json.errors || json)}`);
  }
  return json.result?.[0]?.results ?? [];
}

// ---- HTML helpers -----------------------------------------------------------

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtDate(iso) {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tokyo",
    }).format(new Date(iso));
  } catch {
    return String(iso ?? "");
  }
}

function clampP(v) {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(5, Math.max(1, n)) : 0;
}

function points(s) {
  const items = String(s ?? "")
    .split(/[・\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
  if (!items.length) return "";
  return `<div class="points">${items.map((x) => `<span>${esc(x)}</span>`).join("")}</div>`;
}

function detailField(label, value) {
  if (!value) return "";
  return `<div class="f"><span class="fl">${esc(label)}</span><span class="fv">${esc(value)}</span></div>`;
}

function renderCard(l, openDefault) {
  const p = clampP(l.ai_priority);
  const pending = l.ai_status !== "done";
  const human = l.ai_handling === "human";
  const name = `${l.last_name ?? ""} ${l.first_name ?? ""}`.trim();
  const kindLabel = l.type === "contact" ? "問い合わせ" : "資料DL";
  const kindClass = l.type === "contact" ? "contact" : "download";
  const meta = [name, l.title, l.size && `${l.size}名`, l.pref].filter(Boolean).join(" · ");
  const summary =
    l.ai_summary ||
    (l.ai_status === "error" ? "AI分析に失敗しました" : pending ? "AI分析中…" : "");
  const content =
    l.type === "contact"
      ? [l.kind, l.message].filter(Boolean).join("｜")
      : [l.asset, l.themes].filter(Boolean).join("｜");

  const railClass = p ? `r${p}` : "r0";
  const pBadge = p
    ? `<div class="pBadge b${p}">${p}</div>`
    : `<div class="pBadge b0">–</div>`;
  const pill = human
    ? `<span class="pill human"><span class="d"></span>要対応</span>`
    : l.ai_handling === "auto"
    ? `<span class="pill auto"><span class="d"></span>自動可</span>`
    : "";

  const triage =
    l.ai_priority_reason || l.ai_next_action || l.ai_talking_points
      ? `<div class="ai">
          <div class="aiHead"><span class="glyph">AI</span><span class="ht">トリアージ</span></div>
          <div class="aiBody">
            ${l.ai_priority_reason ? `<div class="aiRow"><span class="ak">根拠</span><span>${esc(l.ai_priority_reason)}</span></div>` : ""}
            ${l.ai_next_action ? `<div class="aiRow"><span class="ak">次の一手</span><span>${esc(l.ai_next_action)}</span></div>` : ""}
            ${l.ai_talking_points ? `<div class="aiRow"><span class="ak">切り口</span>${points(l.ai_talking_points)}</div>` : ""}
          </div>
        </div>`
      : "";

  const draft = l.ai_reply
    ? `<div class="draft">
        <div class="dh"><span class="dl">AI返信ドラフト（低スコア/自動対応向け）</span>
          <button class="copy" onclick="navigator.clipboard&&navigator.clipboard.writeText(this.closest('.draft').querySelector('.draftText').innerText);this.textContent='コピーしました';setTimeout(()=>this.textContent='返信文をコピー',1500)">返信文をコピー</button>
        </div>
        <p class="draftText">${esc(l.ai_reply)}</p>
      </div>`
    : "";

  return `<article class="card${openDefault ? " open" : ""}">
    <div class="lead" onclick="this.closest('.card').classList.toggle('open')">
      <div class="rail ${railClass}"></div>
      <div class="pWrap">${pBadge}</div>
      <div class="body">
        <div class="l1">
          <span class="co">${esc(l.company || "（会社名なし）")}</span>
          <span class="tag ${kindClass}">${kindLabel}</span>
          ${pill}
        </div>
        <div class="l2">${esc(meta || "—")}</div>
        ${summary ? `<div class="summary">${esc(summary)}</div>` : ""}
      </div>
      <div class="aside">
        ${l.ai_next_action ? `<div class="action"><span class="lbl">次の一手</span>${esc(l.ai_next_action)}</div>` : ""}
        <div class="when">${esc(fmtDate(l.created_at))}</div>
      </div>
    </div>
    <div class="detail">
      <div class="grid">
        ${detailField("メール", l.email)}
        ${detailField("電話", l.phone)}
        ${detailField("役回り", l.role)}
        ${detailField("AI意図", l.ai_intent)}
      </div>
      ${content ? `<div class="block"><span class="fl">${l.type === "contact" ? "お問い合わせ内容" : "請求資料・関心テーマ"}</span><p class="blockText">${esc(content)}</p></div>` : ""}
      ${l.roi ? `<div class="block"><span class="fl">ROI試算</span><p class="blockText">${esc(l.roi)}</p></div>` : ""}
      ${triage}
      ${draft}
    </div>
  </article>`;
}

function renderHtml(leads) {
  const sorted = [...leads].sort((a, b) => {
    const pa = clampP(a.ai_priority), pb = clampP(b.ai_priority);
    if (pb !== pa) return pb - pa;
    return String(b.created_at).localeCompare(String(a.created_at));
  });

  const total = leads.length;
  const hot = leads.filter((l) => l.ai_handling === "human").length;
  const todayJst = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const todayCount = leads.filter((l) => {
    try { return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(l.created_at)) === todayJst; } catch { return false; }
  }).length;
  const scored = leads.map((l) => clampP(l.ai_priority)).filter((p) => p > 0);
  const avg = scored.length ? (scored.reduce((s, p) => s + p, 0) / scored.length).toFixed(1) : "—";
  const distCount = [1, 2, 3, 4, 5].map((p) => scored.filter((x) => x === p).length);
  const distMax = Math.max(1, ...distCount);
  const dist = distCount.map((c, i) => `<span style="flex:${Math.max(0.4, (c / distMax) * 10).toFixed(2)};background:var(--p${i + 1});" title="優先度${i + 1}: ${c}件"></span>`).join("");

  const cards = sorted.length
    ? sorted.map((l, i) => renderCard(l, i === 0 && l.ai_handling === "human")).join("\n")
    : `<div class="empty">まだリードがありません。フォームから送信すると、ここに表示されます。</div>`;

  const generatedAt = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date());

  return `<title>リード管理ダッシュボード</title>
<style>${CSS}</style>
<div class="app">
  <div class="note"><span class="pulse"></span><span><b>実データ</b>・${esc(generatedAt)} 時点のスナップショット。行をクリックで詳細が開きます。</span></div>
  <header class="head">
    <div class="brand">
      <div class="mark">AI</div>
      <div><p class="eyebrow">Lead Cockpit</p><h1 class="title">リード管理</h1></div>
    </div>
    <div class="actions"><span class="viewer"><span class="av">T</span>t.tano@eraxai.info</span></div>
  </header>
  <section class="kpis">
    <div class="tile"><p class="k">総リード</p><div class="v tnum">${total}</div></div>
    <div class="tile hot"><span class="flame">🔥</span><p class="k">要対応（人間）</p><div class="v tnum">${hot}</div><div class="sub">優先度4以上</div></div>
    <div class="tile"><p class="k">本日の新規</p><div class="v tnum">${todayCount}</div></div>
    <div class="tile"><p class="k">優先度の分布</p><div class="v tnum" style="font-size:20px;">平均 ${avg}</div><div class="dist">${dist}</div></div>
  </section>
  <div class="count"><b>${total}</b> 件・優先度の高い順</div>
  <div class="list">${cards}</div>
</div>`;
}

const CSS = `
:root{color-scheme:light dark;--bg:#eef1f8;--bg-grad:radial-gradient(1200px 500px at 85% -10%,#e3ebff 0%,rgba(227,235,255,0) 60%);--panel:#fff;--panel-2:#f7f9fd;--ink:#0c1424;--ink-soft:#37415a;--muted:#6a7488;--faint:#98a1b4;--line:#e5e9f2;--line-2:#eef1f7;--accent:#2f5bff;--accent-soft:#eaf0ff;--p5:#e5484d;--p4:#ef8a1a;--p3:#2f5bff;--p2:#7b8698;--p1:#aab2c2;--p0:#cbd2de;--human-bg:#fff1e2;--human-fg:#c0620c;--auto-bg:#eef1f7;--auto-fg:#6a7488;--contact-bg:#e9f0ff;--contact-fg:#2451d6;--download-bg:#e6f7ee;--download-fg:#17864e;--shadow:0 1px 2px rgba(12,20,36,.04),0 8px 24px -12px rgba(12,20,36,.16);--shadow-sm:0 1px 2px rgba(12,20,36,.05);}
@media (prefers-color-scheme:dark){:root{--bg:#080b12;--bg-grad:radial-gradient(1200px 520px at 85% -10%,#16224a 0%,rgba(22,34,74,0) 62%);--panel:#121826;--panel-2:#0e131f;--ink:#eef1f8;--ink-soft:#c3ccdd;--muted:#8b97ac;--faint:#5f6b81;--line:#212a3b;--line-2:#1a2130;--accent:#6c92ff;--accent-soft:#16223f;--p5:#ff5c60;--p4:#ffa03e;--p3:#6c92ff;--p2:#8b97ac;--p1:#59647a;--p0:#3a4557;--human-bg:#33220f;--human-fg:#ffb066;--auto-bg:#1a2130;--auto-fg:#8b97ac;--contact-bg:#16264d;--contact-fg:#9bb6ff;--download-bg:#10301f;--download-fg:#63d597;--shadow:0 1px 2px rgba(0,0,0,.4),0 12px 30px -14px rgba(0,0,0,.7);--shadow-sm:0 1px 2px rgba(0,0,0,.4);}}
:root[data-theme="light"]{color-scheme:light;--bg:#eef1f8;--panel:#fff;--panel-2:#f7f9fd;--ink:#0c1424;--ink-soft:#37415a;--muted:#6a7488;--faint:#98a1b4;--line:#e5e9f2;--line-2:#eef1f7;--accent:#2f5bff;--accent-soft:#eaf0ff;--p5:#e5484d;--p4:#ef8a1a;--p3:#2f5bff;--p2:#7b8698;--p1:#aab2c2;--p0:#cbd2de;--human-bg:#fff1e2;--human-fg:#c0620c;--auto-bg:#eef1f7;--auto-fg:#6a7488;--contact-bg:#e9f0ff;--contact-fg:#2451d6;--download-bg:#e6f7ee;--download-fg:#17864e;--bg-grad:radial-gradient(1200px 500px at 85% -10%,#e3ebff 0%,rgba(227,235,255,0) 60%);}
:root[data-theme="dark"]{color-scheme:dark;--bg:#080b12;--panel:#121826;--panel-2:#0e131f;--ink:#eef1f8;--ink-soft:#c3ccdd;--muted:#8b97ac;--faint:#5f6b81;--line:#212a3b;--line-2:#1a2130;--accent:#6c92ff;--accent-soft:#16223f;--p5:#ff5c60;--p4:#ffa03e;--p3:#6c92ff;--p2:#8b97ac;--p1:#59647a;--p0:#3a4557;--human-bg:#33220f;--human-fg:#ffb066;--auto-bg:#1a2130;--auto-fg:#8b97ac;--contact-bg:#16264d;--contact-fg:#9bb6ff;--download-bg:#10301f;--download-fg:#63d597;--bg-grad:radial-gradient(1200px 520px at 85% -10%,#16224a 0%,rgba(22,34,74,0) 62%);}
*{box-sizing:border-box;}
body{margin:0;background:var(--bg);background-image:var(--bg-grad);color:var(--ink);font-family:'Noto Sans JP','Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic','YuGothic',Meiryo,system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.6;}
.app{max-width:1180px;margin:0 auto;padding:26px 22px 72px;}
.tnum{font-variant-numeric:tabular-nums;}
.note{display:flex;align-items:center;gap:10px;background:var(--accent-soft);border:1px solid color-mix(in srgb,var(--accent) 26%,var(--line));color:var(--ink-soft);font-size:12.5px;padding:10px 14px;border-radius:11px;margin-bottom:20px;}
.note b{color:var(--accent);}
.note .pulse{flex:none;width:8px;height:8px;border-radius:50%;background:var(--accent);animation:pulse 2.4s infinite;}
@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 50%,transparent);}70%{box-shadow:0 0 0 7px transparent;}100%{box-shadow:0 0 0 0 transparent;}}
@media (prefers-reduced-motion:reduce){.pulse{animation:none;}}
.head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px;}
.brand{display:flex;align-items:center;gap:12px;}
.mark{width:40px;height:40px;border-radius:11px;flex:none;background:linear-gradient(150deg,#12244d,#0b1b3a);color:#fff;display:grid;place-items:center;font-weight:800;font-size:17px;box-shadow:inset 0 1px 0 rgba(255,255,255,.14),var(--shadow-sm);}
.eyebrow{font-size:10.5px;font-weight:700;letter-spacing:.16em;color:var(--faint);text-transform:uppercase;margin:0 0 2px;}
.title{font-size:21px;font-weight:800;margin:0;}
.actions{display:flex;align-items:center;gap:9px;}
.viewer{font-size:12px;color:var(--muted);display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border:1px solid var(--line);border-radius:999px;background:var(--panel);}
.viewer .av{width:18px;height:18px;border-radius:50%;background:linear-gradient(140deg,#2f5bff,#7aa0ff);color:#fff;font-size:10px;font-weight:700;display:grid;place-items:center;}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px;}
.tile{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:15px 16px;box-shadow:var(--shadow-sm);overflow:hidden;}
.tile .k{font-size:11px;font-weight:700;letter-spacing:.04em;color:var(--muted);margin:0 0 8px;}
.tile .v{font-size:27px;font-weight:800;line-height:1;}
.tile .sub{font-size:11.5px;color:var(--faint);margin-top:7px;}
.tile.hot{background:linear-gradient(160deg,color-mix(in srgb,var(--p5) 12%,var(--panel)),var(--panel));border-color:color-mix(in srgb,var(--p5) 34%,var(--line));}
.tile.hot .v{color:var(--p5);}
.tile.hot .flame{position:absolute;top:13px;right:14px;font-size:15px;}
.dist{display:flex;height:7px;border-radius:6px;overflow:hidden;margin-top:11px;gap:2px;}
.dist span{display:block;border-radius:2px;}
.count{font-size:12.5px;color:var(--muted);margin:2px 2px 10px;}
.count b{color:var(--ink);}
.list{display:flex;flex-direction:column;gap:9px;}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow-sm);overflow:hidden;transition:box-shadow .15s,border-color .15s;}
.card:hover{box-shadow:var(--shadow);}
.card.open{box-shadow:var(--shadow);border-color:color-mix(in srgb,var(--accent) 30%,var(--line));}
.card .detail{display:none;}
.card.open .detail{display:block;}
.lead{display:grid;grid-template-columns:4px 54px 1fr auto;align-items:center;cursor:pointer;}
.rail{align-self:stretch;}
.rail.r5{background:var(--p5);}.rail.r4{background:var(--p4);}.rail.r3{background:var(--p3);}.rail.r2{background:var(--p2);}.rail.r1{background:var(--p1);}.rail.r0{background:var(--p0);}
.pWrap{display:grid;place-items:center;padding:14px 0;}
.pBadge{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;font-size:15px;font-weight:800;color:#fff;}
.b5{background:var(--p5);}.b4{background:var(--p4);}.b3{background:var(--p3);}.b2{background:var(--p2);}.b1{background:var(--p1);}.b0{background:var(--p0);}
.body{padding:12px 14px 12px 4px;min-width:0;}
.l1{display:flex;align-items:center;gap:9px;flex-wrap:wrap;}
.co{font-size:15px;font-weight:750;}
.l2{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:4px;font-size:12.5px;color:var(--muted);}
.summary{margin-top:7px;font-size:13px;color:var(--ink-soft);line-height:1.55;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;}
.tag{display:inline-flex;align-items:center;font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;white-space:nowrap;}
.tag.contact{background:var(--contact-bg);color:var(--contact-fg);}
.tag.download{background:var(--download-bg);color:var(--download-fg);}
.pill{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:3px 9px 3px 7px;border-radius:999px;white-space:nowrap;}
.pill.human{background:var(--human-bg);color:var(--human-fg);}
.pill.auto{background:var(--auto-bg);color:var(--auto-fg);}
.pill .d{width:6px;height:6px;border-radius:50%;background:currentColor;}
.aside{display:flex;flex-direction:column;align-items:flex-end;gap:7px;padding:12px 16px;text-align:right;}
.action{font-size:12.5px;font-weight:700;color:var(--ink);}
.action .lbl{display:block;font-size:9.5px;font-weight:700;letter-spacing:.1em;color:var(--faint);text-transform:uppercase;margin-bottom:2px;}
.when{font-size:11.5px;color:var(--faint);}
.detail{border-top:1px dashed var(--line);padding:16px 18px 18px;background:var(--panel-2);}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px 22px;}
.f .fl,.block .fl{display:block;font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--faint);text-transform:uppercase;margin-bottom:3px;}
.f .fv{font-size:13px;color:var(--ink);}
.block{margin-top:14px;}
.blockText{margin:2px 0 0;font-size:13px;line-height:1.7;color:var(--ink-soft);white-space:pre-wrap;}
.ai{margin-top:15px;border:1px solid color-mix(in srgb,var(--accent) 22%,var(--line));border-radius:12px;overflow:hidden;background:var(--panel);}
.aiHead{display:flex;align-items:center;gap:9px;padding:10px 14px;background:linear-gradient(100deg,color-mix(in srgb,var(--accent) 12%,var(--panel)),var(--panel));border-bottom:1px solid var(--line-2);}
.aiHead .glyph{width:22px;height:22px;border-radius:6px;background:var(--accent);color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center;}
.aiHead .ht{font-size:12px;font-weight:800;letter-spacing:.04em;color:var(--ink);}
.aiBody{padding:6px 14px 12px;}
.aiRow{display:grid;grid-template-columns:96px 1fr;gap:12px;padding:8px 0;border-bottom:1px solid var(--line-2);font-size:13px;line-height:1.65;color:var(--ink-soft);}
.aiRow:last-child{border-bottom:0;}
.aiRow .ak{font-size:10.5px;font-weight:700;letter-spacing:.04em;color:var(--faint);text-transform:uppercase;padding-top:3px;}
.points{display:flex;flex-direction:column;gap:4px;}
.points span{position:relative;padding-left:15px;}
.points span::before{content:"›";position:absolute;left:2px;color:var(--accent);font-weight:800;}
.draft{margin-top:14px;}
.draft .dh{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px;}
.draft .dl{font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--faint);text-transform:uppercase;}
.copy{font-size:11.5px;font-weight:700;color:var(--accent);background:var(--accent-soft);border:1px solid color-mix(in srgb,var(--accent) 28%,var(--line));border-radius:7px;padding:6px 12px;cursor:pointer;}
.draftText{margin:0;font-size:13px;line-height:1.85;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:13px 15px;white-space:pre-wrap;}
.empty{text-align:center;color:var(--faint);padding:60px 0;font-size:14px;}
@media (max-width:820px){.kpis{grid-template-columns:repeat(2,1fr);}}
@media (max-width:560px){.app{padding:18px 13px 56px;}.lead{grid-template-columns:4px 46px 1fr;}.aside{grid-column:2/-1;flex-direction:row;align-items:center;justify-content:space-between;padding:0 14px 12px;text-align:left;}}
`;

// ---- main -------------------------------------------------------------------

import { writeFile } from "node:fs/promises";

try {
  const leads = await queryD1();
  const html = renderHtml(leads);
  await writeFile(OUT, html, "utf8");
  console.log(`OK: ${leads.length} 件のリードを ${OUT} に書き出しました。`);
} catch (err) {
  console.error("失敗:", err.message);
  process.exit(1);
}
