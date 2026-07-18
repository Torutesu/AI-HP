-- AI-HP lead store (Cloudflare D1).
-- Source of truth for every contact / download form submission.
--
-- Apply once against your D1 database:
--   wrangler d1 execute ai-hp-leads --file=./db/schema.sql --remote
-- (or paste this into the D1 console in the Cloudflare dashboard).

CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT NOT NULL,            -- ISO 8601 (UTC)
  type        TEXT NOT NULL,            -- 'contact' | 'download'
  company     TEXT,
  pref        TEXT,
  size        TEXT,
  role        TEXT,
  title       TEXT,
  last_name   TEXT,
  first_name  TEXT,
  email       TEXT,
  phone       TEXT,
  kind        TEXT,                     -- contact: お問い合わせ種別
  message     TEXT,                     -- contact: 本文
  asset       TEXT,                     -- download: 請求資料
  themes      TEXT,                     -- download: 関心テーマ（、区切り）
  roi         TEXT,                     -- contact: ROIシミュレーター試算
  country     TEXT,                     -- CF-IPCountry（PII最小化のためIPは保存しない）
  raw         TEXT,                     -- 送信ペイロード全体（バックアップ）
  -- AI enrichment (Phase 3, Workers AI — 追記される)
  ai_summary  TEXT,                     -- 一文要約
  ai_intent   TEXT,                     -- 意図分類
  ai_priority INTEGER,                  -- 優先度 1〜5
  ai_reply    TEXT,                     -- 返信ドラフト
  ai_status   TEXT                      -- 'done' | 'error' | NULL(未処理)
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email      ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_type       ON leads (type);
