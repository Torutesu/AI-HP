-- Phase 3: AI enrichment columns for existing databases created with the
-- original schema. New databases already get these from db/schema.sql.
--
--   wrangler d1 execute ai-hp-leads --file=./db/migrations/0002_ai_enrichment.sql --remote

ALTER TABLE leads ADD COLUMN ai_summary  TEXT;
ALTER TABLE leads ADD COLUMN ai_intent   TEXT;
ALTER TABLE leads ADD COLUMN ai_priority INTEGER;
ALTER TABLE leads ADD COLUMN ai_reply    TEXT;
ALTER TABLE leads ADD COLUMN ai_status   TEXT;
