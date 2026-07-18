# AI総合戦略研究所 — コーポレートサイト

**Next.js (App Router, TypeScript)** で構築したコーポレートサイト。**Cloudflare
Pages** 向けに静的エクスポート（`output: 'export'`）します。デザイントークンは
CSS変数（`app/globals.css`）＋コンポーネントごとのCSS Modules、アニメーションは
**Framer Motion**、アイコンは **lucide-react**（バンドル）、フォント（Inter + Noto
Sans JP）は `next/font` でセルフホストしています。

> これが本番の実装です。（初期に作った素のHTML版は本コミットで撤去し、Next.js版に
> 一本化しました。履歴には残っています。）

## ページ

| Route | ページ | 備考 |
| --- | --- | --- |
| `/` | トップページ | ヒーロー動画 + スクロールリビール |
| `/service` | サービス | |
| `/cases` | 導入事例 | |
| `/ai-os` | AI経営基盤 | |
| `/consulting` | コンサルティング | |
| `/company` | 会社概要 | |
| `/magazine` | マガジン | |
| `/contact` | お問い合わせ・無料相談 | 動作フォーム → `/api/contact` |
| `/download` | 資料ダウンロード | 動作フォーム → `/api/download` |

## フォーム

`contact` / `download` はクライアントコンポーネントで、Cloudflare Pages Functions
（`functions/api/*`）へJSONをPOSTします。各Functionは:

1. **社内通知** — Slack または Discord の incoming webhook（`NOTIFY_WEBHOOK_URL`、
   URLで自動判別）へ送信。
2. **自動返信** — 送信者へ **Resend** で返信（お問い合わせ＝お礼、資料DL＝資料リンク）。
   Resendの環境変数が未設定でもフォームは動作し、通知のみ行います。

## 構成

```
app/
  layout.tsx        ルートレイアウト、next/font、metadata
  globals.css       デザイントークン + base + 共通クラス
  page.tsx          トップページ
  page.module.css   トップページのセクションスタイル
  service/ … download/   各ページ
components/          SiteHeader / SiteFooter / PageHero / Icon / Button /
                    SectionHeading / Reveal / ContactForm / DownloadForm
functions/
  api/contact.ts    Cloudflare Pages Function — POST /api/contact
  api/download.ts   POST /api/download
public/logo-mark.png
next.config.mjs     output: 'export' + images.unoptimized
wrangler.toml       Cloudflare Pages 設定（出力先 = out/）
```

## ローカル開発

```bash
npm install
npm run dev        # http://localhost:3000
```

## ビルド（静的エクスポート）

```bash
npm run build      # out/ に出力
```

## Cloudflare Pages へデプロイ

### 方法A — GitHub連携（推奨・pushごとに自動デプロイ）

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → 本リポジトリとデプロイするブランチを選択。
2. ビルド設定（リポジトリ直下がNext.jsなので Root は変更不要）:
   - **Root directory（プロジェクトルート）:** リポジトリ直下（空欄のまま）
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   （`wrangler.toml` にも記載済み）
3. 下記の環境変数を追加して **Save and Deploy**。以降、連携ブランチへのpushで自動再デプロイ。

### 方法B — CLI（APIトークン）でデプロイ

```bash
export CLOUDFLARE_API_TOKEN=...   # 権限「Cloudflare Pages: Edit」
export CLOUDFLARE_ACCOUNT_ID=...
npm run deploy                    # = next build && wrangler pages deploy out
```

### 環境変数（共通）

Pages → **Settings → Environment variables**（`.env.example` 参照）:

- `NOTIFY_WEBHOOK_URL` — Slack または Discord の incoming webhook（必須）
- `RESEND_API_KEY` — 自動返信用（任意）
- `AUTOREPLY_FROM_EMAIL` — Resendで検証済みの送信元（任意）
- `ASSETS_BASE_URL` — 配布アセット（`lib/assets.ts`）の相対パスに前置するベースURL（R2等・任意）
- `DOC_DOWNLOAD_URL` — `service-guide` の後方互換フォールバックリンク（任意）

配布物を増やす場合は `lib/assets.ts` の `ASSETS` に `{ id, label, path }` を追加。
フォームは `?asset=<id>` を hidden で受け取り、`download.ts` が id を検証して返信メール／通知に載せます。

### リード保存（D1 ＋ Google Sheets）

問い合わせ・資料DLの送信内容は、通知／自動返信に加えて **Cloudflare D1（正本）** に保存し、
**非公開の Google スプレッドシート（運用ビュー）** に1行追記します（`lib/leadStore.ts`）。
どちらも best-effort（`waitUntil` で非同期・失敗しても送信自体は成功）で、未設定でも通知だけで動作します。
PII最小化のため IP は保存せず、国（`CF-IPCountry`）のみ記録します。

**D1（保存の正本）:**

1. `wrangler d1 create ai-hp-leads`
2. `wrangler d1 execute ai-hp-leads --file=./db/schema.sql --remote`（スキーマ適用）
3. Pages → **Settings → Functions → Bindings → D1** で、変数名 **`DB`** として上記DBをバインド
   （または `wrangler.toml` の `[[d1_databases]]` を有効化）

**Google Sheets 同期（任意・安全な繋ぎ方）:**

1. スプレッドシートを作成し、タブ名を **`Leads`**（または `SHEETS_TAB` で指定）に。1行目の見出しは
   `lib/leadStore.ts` の `SHEET_HEADER` の順に用意
2. Google Cloud で **サービスアカウント** ＋ JSON鍵を作成し、**Sheets API** を有効化
3. スプレッドシートを **サービスアカウントのメールに「編集者」で共有**（"リンクを知る全員" は使わない／アカウントは2段階認証）
4. Pages の環境変数に登録:
   - `GOOGLE_SERVICE_ACCOUNT_KEY` — サービスアカウントのJSON（文字列）
   - `SHEETS_SPREADSHEET_ID` — スプレッドシートID（URLの `/d/<ID>/` 部分）
   - `SHEETS_TAB` — タブ名（既定 `Leads`）

認証はサービスアカウントのJWT（Workers の Web Crypto でRS256署名）→ OAuthトークン。
スプレッドシートは非公開のまま、鍵はサーバー側のみで扱います（ブラウザ・リポジトリに出しません）。

### GitHub Actions（検索順位モニタ）

`.github/workflows/rank-check.yml` が毎週月曜 09:00 JST に `scripts/rank-check.mjs` を実行し、
前週比で順位が下落したキーワードを検知します（5位以上→Slack通知 / 3位以上→Issue自動起票、
結果JSONはartifactに保存）。**Settings → Secrets and variables → Actions** に登録:

- `GOOGLE_SERVICE_ACCOUNT_KEY` — GSC閲覧権限を持つサービスアカウントのJSON（文字列）
- `GSC_SITE_URL` — GSCプロパティ（例 `sc-domain:example.com` / `https://example.com/`）
- `SLACK_WEBHOOK_URL` — Slack Incoming Webhook
- `GITHUB_TOKEN` — Issue起票用（Actionsが自動付与するため設定不要）

### カスタムドメイン

Pagesプロジェクトの *Custom domains* から、Cloudflareで取得したドメインを追加
（ドメインがCloudflare管理下ならDNSは自動）。

### ローカルでFunctionを試す

```bash
npm run preview     # = next build && wrangler pages dev out
# シークレットは .dev.vars に（.env.example 参照）
```

## Notes / TODO

- ヒーロー背景動画とパートナーロゴのURLは `lib/site.ts`（`HERO_VIDEO_URL` / `PARTNER_LOGOS`）に
  集約済み。現状は `cdn.sceneai.art`（ホットリンク保護）。完全な独立性のため実ファイルを
  `public/` に置き、定数のURLをローカルパスに差し替え推奨（1箇所）。
- フォーム送信はSlack/Discord通知＋自動返信のみで、どこにも保存していません。記録を残す
  なら KV / D1 / スプレッドシート等の追加を。
