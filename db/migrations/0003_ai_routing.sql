-- Phase 3.1: score-based routing columns for existing databases.
-- New databases already get these from db/schema.sql.
--
--   wrangler d1 execute ai-hp-leads --file=./db/migrations/0003_ai_routing.sql --remote
-- (or paste into the D1 Console in the Cloudflare dashboard).

ALTER TABLE leads ADD COLUMN ai_priority_reason TEXT; -- なぜそのスコアか
ALTER TABLE leads ADD COLUMN ai_next_action     TEXT; -- 推奨する次の一手
ALTER TABLE leads ADD COLUMN ai_handling        TEXT; -- 'human' | 'auto'
ALTER TABLE leads ADD COLUMN ai_talking_points  TEXT; -- 商談の切り口
