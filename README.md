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
- `DOC_DOWNLOAD_URL` — 資料DL自動返信に載せるPDFリンク（任意）

### カスタムドメイン

Pagesプロジェクトの *Custom domains* から、Cloudflareで取得したドメインを追加
（ドメインがCloudflare管理下ならDNSは自動）。

### ローカルでFunctionを試す

```bash
npm run preview     # = next build && wrangler pages dev out
# シークレットは .dev.vars に（.env.example 参照）
```

## Notes / TODO

- ヒーロー背景動画とパートナーロゴは現在 `cdn.sceneai.art`（デザインのアセット）から
  読み込みます。完全な独立性のため `public/` へのセルフホストを推奨。
- フォーム送信はSlack/Discord通知＋自動返信のみで、どこにも保存していません。記録を残す
  なら KV / D1 / スプレッドシート等の追加を。
