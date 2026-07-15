# AI総合戦略研究所 — Next.js site (`web/`)

The corporate site rebuilt in **Next.js (App Router, TypeScript)**, statically
exported for **Cloudflare Pages**. Styling keeps the original design tokens
(CSS variables in `app/globals.css`) plus per-component CSS Modules. Animations
use **Framer Motion**; icons are **lucide-react** (bundled, no CDN). Fonts
(Inter + Noto Sans JP) are self-hosted via `next/font`.

> The plain static HTML site still lives at the repo root as reference. This
> Next.js app is the active version — **all 9 pages migrated**, fully
> responsive with a mobile menu and Framer Motion animations.

## Pages

| Route | Page | Notes |
| --- | --- | --- |
| `/` | トップページ | hero video + scroll reveals |
| `/service` | サービス | |
| `/cases` | 導入事例 | |
| `/ai-os` | AI経営基盤 | |
| `/consulting` | コンサルティング | |
| `/company` | 会社概要 | |
| `/magazine` | マガジン | |
| `/contact` | お問い合わせ・無料相談 | working form → `/api/contact` |
| `/download` | 資料ダウンロード | working form → `/api/download` |

## Forms

`contact` and `download` are client components that POST JSON to Cloudflare
Pages Functions (`functions/api/*`). Each Function:

1. **Notifies the team** via a **Slack or Discord** incoming webhook
   (`NOTIFY_WEBHOOK_URL`, auto-detected by URL).
2. **Auto-replies (自動返信) to the submitter** via **Resend** — the contact
   form sends a thank-you; the download form sends the material link.
   (Auto-reply is optional: if the Resend vars are unset, the form still works
   and only the webhook notification fires.)

## Structure

```
web/
  app/
    layout.tsx        root layout, next/font, metadata
    globals.css       design tokens + base + shared component classes
    page.tsx          トップページ (top page)
    page.module.css   top-page section styles (fluid type, responsive grids)
  components/
    SiteHeader.tsx    dark overlay header + mobile hamburger (Framer Motion)
    SiteFooter.tsx
    Icon.tsx          lucide-react wrapper (registry by name)
    Button.tsx        pill button (Link or <button>)
    SectionHeading.tsx
    Reveal.tsx        scroll / mount reveal (Framer Motion)
  functions/
    api/contact.ts    Cloudflare Pages Function — POST /api/contact → Resend
  public/logo-mark.png
  next.config.mjs     output: 'export' (static) + images.unoptimized
```

## Local development

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

## Build (static export)

```bash
npm run build      # outputs to web/out/
```

## Deploy to Cloudflare Pages

### Option A — connect to Git (recommended; auto-deploys on every push)

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick this repo and the branch you want to deploy.
2. Build settings:
   - **Root directory (Project root):** `web`
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
   (These also live in `web/wrangler.toml`.)
3. Add the environment variables below, then **Save and Deploy**. Every later
   push to the connected branch triggers a new deploy automatically.

### Option B — deploy from the CLI with an API token

```bash
cd web
export CLOUDFLARE_API_TOKEN=...   # token with "Cloudflare Pages: Edit"
export CLOUDFLARE_ACCOUNT_ID=...
npm run deploy                    # = next build && wrangler pages deploy out
```

### Environment variables (both options)

Set under Pages → **Settings → Environment variables** (see `.env.example`):

- `NOTIFY_WEBHOOK_URL` — Slack or Discord incoming webhook (required)
- `RESEND_API_KEY` — for the auto-reply (optional)
- `AUTOREPLY_FROM_EMAIL` — a domain verified in Resend (optional)
- `DOC_DOWNLOAD_URL` — PDF link included in the download auto-reply (optional)

### Custom domain

Add your Cloudflare-registered domain under the Pages project's *Custom domains*
tab (DNS is automatic since the domain is on Cloudflare).

The `functions/` directory is picked up automatically by Cloudflare Pages and
deployed as serverless Functions alongside the static export — so `/api/contact`
works in production without a separate server.

### Local Function testing

```bash
npx wrangler pages dev out          # after `npm run build`
# put secrets in web/.dev.vars (see .env.example)
```

## Notes / TODO

- The hero background video and partner logos currently load from
  `cdn.sceneai.art` (the design's assets). Consider self-hosting them under
  `public/` for full independence and offline resilience.
- Form submissions are not persisted anywhere beyond the Slack/Discord
  notification + auto-reply. Add a datastore (KV/D1/sheet) if you want a record.
