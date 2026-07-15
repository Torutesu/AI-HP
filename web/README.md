# AI総合戦略研究所 — Next.js site (`web/`)

The corporate site rebuilt in **Next.js (App Router, TypeScript)**, statically
exported for **Cloudflare Pages**. Styling keeps the original design tokens
(CSS variables in `app/globals.css`) plus per-component CSS Modules. Animations
use **Framer Motion**; icons are **lucide-react** (bundled, no CDN). Fonts
(Inter + Noto Sans JP) are self-hosted via `next/font`.

> This is the in-progress migration. The plain static HTML site still lives at
> the repo root as reference. Current scope: **shared components + top page**
> (`/`), fully responsive with a mobile menu. Remaining pages (service, cases,
> ai-os, consulting, company, magazine, contact, download) come next.

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

1. **Create a Pages project** connected to this repo.
2. Build settings:
   - **Root directory:** `web`
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
3. **Environment variables** (Settings → Environment variables) — needed by the
   contact form Function:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL`
   - `CONTACT_FROM_EMAIL` (a domain verified in Resend)
4. **Domain:** add your Cloudflare-registered domain under the Pages project's
   *Custom domains* tab (DNS is automatic since the domain is on Cloudflare).

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
- Contact/download form pages are not migrated yet; when built they will POST
  to `/api/contact` (and a sibling `/api/download`).
