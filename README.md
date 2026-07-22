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
| `/recruiting` | 採用情報 | 動作フォーム → `/api/recruiting` |

## フォーム

`contact` / `download` はクライアントコンポーネントで、Cloudflare Pages Functions
（`functions/api/*`）へJSONをPOSTします。`recruiting` は `multipart/form-data` で添付つき送信です。各Functionは:

1. **社内通知** — Slack または Discord の incoming webhook（`NOTIFY_WEBHOOK_URL`、
   URLで自動判別）へ送信。
2. **自動返信** — 送信者へ **Resend** で返信（お問い合わせ＝お礼、資料DL＝資料リンク）。
   Resendの環境変数が未設定でもフォームは動作し、通知のみ行います。

採用応募は `multipart/form-data` で送信し、履歴書・職務経歴書を添付できます。  
`RECRUIT_REVIEW_EMAIL` が設定されていれば、添付つきのレビュー用メールも社内に届きます。

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

- `NEXT_PUBLIC_SITE_URL` — canonical URL / sitemap / llms.txt の基準URL
- `NEXT_PUBLIC_GTM_ID` — Google Tag Manager（優先。GA4はGTM内で配信）
- `NEXT_PUBLIC_GA4_ID` — GTM未導入時の直接GA4計測
- `NEXT_PUBLIC_CLARITY_ID` — Microsoft Clarity（ヒートマップ）
- `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` — Cloudflare Web Analytics
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` — Google Search Console の所有権確認
- `NEXT_PUBLIC_BING_SITE_VERIFICATION` — Bing Webmaster Tools の所有権確認
- `NOTIFY_WEBHOOK_URL` — Slack または Discord の incoming webhook（必須）
- `RESEND_API_KEY` — 自動返信用（任意）
- `AUTOREPLY_FROM_EMAIL` — Resendで検証済みの送信元（任意）
- `RECRUIT_REVIEW_EMAIL` — 採用応募の添付ファイルを受け取る社内レビュー先（任意）
- `ASSETS_BASE_URL` — 配布アセット（`lib/assets.ts`）の相対パスに前置するベースURL（R2等・任意）
- `DOC_DOWNLOAD_URL` — `service-guide` の後方互換フォールバックリンク（任意）

#### おすすめの導入順

1. **Google Tag Manager**  
   まず `NEXT_PUBLIC_GTM_ID` を入れる。以後の計測はGTM側に寄せると運用が楽。
2. **GA4**  
   GTMに GA4 タグを追加して、ページビューと主要イベントを計測する。
3. **Search Console / Bing Webmaster Tools**  
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` と `NEXT_PUBLIC_BING_SITE_VERIFICATION` を入れて所有権確認。
4. **Microsoft Clarity**  
   `NEXT_PUBLIC_CLARITY_ID` を入れて、ヒートマップと録画で導線を確認する。
5. **Cloudflare Web Analytics**  
   すでにCloudflare Pagesを使っているので、軽量な補助計測として足すと便利。

#### まず入れるイベント

- `page_view` — ページ閲覧
- `cta_click` — CTAクリック
- `lead_submit` — 問い合わせ / 資料請求の送信結果

主要CTAの `location` は以下を使っています。

- `home_hero`
- `home_cta_band`
- `service_cta`
- `consulting_cta`
- `aios_cta`
- `partners_cta`
- `recruiting_cta`
- `cases_cta`
- `company_cta`
- `roi_simulator`
- `header_actions`
- `header_nav`
- `header_dropdown`
- `mobile_actions`
- `mobile_nav`

#### Search Console と Clarity の初期設定

1. **Google Search Console** で `ai-hp.pages.dev`（または独自ドメイン）を追加し、HTMLタグ or DNS で所有権確認する。
2. `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` を Cloudflare Pages の環境変数に入れる。
3. **Bing Webmaster Tools** も同様に登録し、`NEXT_PUBLIC_BING_SITE_VERIFICATION` を入れる。
4. **Microsoft Clarity** でプロジェクトを作成し、`NEXT_PUBLIC_CLARITY_ID` を入れる。
5. その後、Clarity の録画とヒートマップで、CTAやフォームの詰まりを確認する。

#### GA4 のイベント設計メモ

- 無料相談: `cta_click` → `label=hero_free_consultation` / `home_cta_free_diagnosis`
- 資料請求: `cta_click` → `label=hero_download` / `home_cta_download`
- 送信成功: `lead_submit` → `type=contact|download`, `status=success`
- 送信失敗: `lead_submit` → `type=contact|download`, `status=error`
- ROI試算から相談: `cta_click` → `label=roi_simulator_contact`

#### X（旧Twitter）からの流入を見るとき

- 投稿ごとに `utm_source=x&utm_medium=social&utm_campaign=...` を付ける
- GA4 の「集客」→「トラフィック獲得」で確認する
- リンク短縮やプロフィールリンクも同じUTM設計にそろえる

配布物を増やす場合は `lib/assets.ts` の `ASSETS` に `{ id, label, path }` を追加。
フォームは `?asset=<id>` を hidden で受け取り、`download.ts` が id を検証して返信メール／通知に載せます。

### リード保存（D1 ＋ Google Sheets）

問い合わせ・資料DL・採用応募の送信内容は、通知／自動返信に加えて **Cloudflare D1（正本）** に保存し、
**非公開の Google スプレッドシート（運用ビュー）** に1行追記します（`lib/leadStore.ts`）。
どちらも best-effort（`waitUntil` で非同期・失敗しても送信自体は成功）で、未設定でも通知だけで動作します。
PII最小化のため IP は保存せず、国（`CF-IPCountry`）のみ記録します。

**D1（保存の正本）:**

1. `wrangler d1 create ai-hp-leads`
2. `wrangler d1 execute ai-hp-leads --file=./db/schema.sql --remote`（スキーマ適用）
3. 採用応募の列を既存DBへ追加する場合は `wrangler d1 execute ai-hp-leads --file=./db/migrations/0004_recruiting_application.sql --remote`
4. Pages → **Settings → Functions → Bindings → D1** で、変数名 **`DB`** として上記DBをバインド
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

### 管理画面（Phase 2）＋ AIエンリッチ（Phase 3）

`/admin` に受信一覧（検索・種別フィルタ・CSV）を表示します。**Cloudflare Access**
（Zero Trust・無料50人まで）で `/admin` と `/api/admin/*` を保護し、Function側でも
Access JWT を検証します（`lib/accessAuth.ts`）。Pages 環境変数:

- `ACCESS_TEAM_DOMAIN` — 例 `yourteam.cloudflareaccess.com`
- `ACCESS_AUD` — Access アプリケーションの Application Audience (AUD) Tag

**AIエンリッチ**は保存時に **Workers AI**（`env.AI` バインディング・`@cf/meta/llama-3.1-8b-instruct`）で
要約・意図分類・優先度(1〜5)・返信ドラフトを生成し、D1に追記→管理画面に表示します
（`lib/enrichLead.ts`）。**データはCloudflare内で完結し、外部LLMにPIIを送りません。**

- 既存DBには AIカラムを追加: `wrangler d1 execute ai-hp-leads --file=./db/migrations/0002_ai_enrichment.sql --remote`
- Workers AI バインディングを **`AI`** の名前で追加（ダッシュボード or `wrangler.toml`）
- 未設定でも保存は動作（AI列が空になるだけ）

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
