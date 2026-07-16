#!/usr/bin/env node
/**
 * Weekly keyword-rank monitor.
 *
 * Pulls average positions from the Google Search Console Search Analytics API
 * for the last 7 days vs the previous 7 days, and posts a Slack alert for any
 * monitored keyword whose position dropped by 5 or more places.
 *
 * Env:
 *   GOOGLE_SERVICE_ACCOUNT_KEY  Service-account JSON (as a string) with GSC access
 *   GSC_SITE_URL                GSC property (e.g. "sc-domain:example.com" or
 *                               "https://example.com/")
 *   SLACK_WEBHOOK_URL           Slack Incoming Webhook URL
 *
 * Config: scripts/keywords.json (array of keyword strings).
 * Runs on Node 20+ (uses global fetch). No external dependencies.
 */

import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const DROP_THRESHOLD = 5; // places
const DATA_LAG_DAYS = 3; // GSC data is typically 2-3 days behind
const DROPPED_OUT_POSITION = 100; // assumed position when a keyword falls out of results

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function b64url(input) {
  return Buffer.from(input).toString("base64url");
}

function signJwt(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claim))}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(sa.private_key);
  return `${unsigned}.${b64url(signature)}`;
}

async function getAccessToken(sa) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signJwt(sa),
    }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(`Token request failed: ${JSON.stringify(json)}`);
  return json.access_token;
}

function ymd(date) {
  return date.toISOString().slice(0, 10);
}

async function queryPositions(token, siteUrl, startDate, endDate) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    siteUrl
  )}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ startDate, endDate, dimensions: ["query"], rowLimit: 25000 }),
  });
  const json = await res.json();
  if (json.error) throw new Error(`GSC query failed: ${JSON.stringify(json.error)}`);
  const map = new Map();
  for (const row of json.rows ?? []) {
    map.set(String(row.keys[0]).toLowerCase(), row.position);
  }
  return map;
}

async function postSlack(webhook, text) {
  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Slack post failed: ${res.status} ${await res.text()}`);
}

async function main() {
  const sa = JSON.parse(requireEnv("GOOGLE_SERVICE_ACCOUNT_KEY"));
  const siteUrl = requireEnv("GSC_SITE_URL");
  const slack = requireEnv("SLACK_WEBHOOK_URL");

  const here = path.dirname(fileURLToPath(import.meta.url));
  const keywords = JSON.parse(await readFile(path.join(here, "keywords.json"), "utf8"));

  // Windows: current = last 7 days ending (today - lag); previous = the 7 before.
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - DATA_LAG_DAYS);
  const curStart = new Date(end);
  curStart.setUTCDate(curStart.getUTCDate() - 6);
  const prevEnd = new Date(curStart);
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setUTCDate(prevStart.getUTCDate() - 6);

  const token = await getAccessToken(sa);
  const [cur, prev] = await Promise.all([
    queryPositions(token, siteUrl, ymd(curStart), ymd(end)),
    queryPositions(token, siteUrl, ymd(prevStart), ymd(prevEnd)),
  ]);

  const alerts = [];
  for (const kw of keywords) {
    const key = String(kw).toLowerCase();
    const prevPos = prev.get(key);
    if (prevPos == null) continue; // no baseline last week — nothing to compare
    const curPos = cur.get(key) ?? DROPPED_OUT_POSITION;
    const diff = curPos - prevPos; // positive = dropped (worse)
    if (diff >= DROP_THRESHOLD) {
      alerts.push({ kw, prevPos, curPos, diff, droppedOut: !cur.has(key) });
    }
  }

  const range = `${ymd(curStart)}〜${ymd(end)}（前週: ${ymd(prevStart)}〜${ymd(prevEnd)}）`;
  if (alerts.length === 0) {
    console.log(`No rank drops >= ${DROP_THRESHOLD} places. Range: ${range}`);
    return;
  }

  alerts.sort((a, b) => b.diff - a.diff);
  const lines = alerts.map((a) => {
    const cur = a.droppedOut ? "圏外" : a.curPos.toFixed(1);
    return `• *${a.kw}*: ${a.prevPos.toFixed(1)}位 → ${cur}（${a.diff >= DROPPED_OUT_POSITION - 50 && a.droppedOut ? "大幅" : `-${a.diff.toFixed(1)}`}位下落）`;
  });
  const text = `:rotating_light: *検索順位の下落アラート*  ${range}\n監視キーワードで${DROP_THRESHOLD}位以上の下落を検知しました。\n${lines.join("\n")}`;

  await postSlack(slack, text);
  console.log(`Posted ${alerts.length} alert(s) to Slack.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
