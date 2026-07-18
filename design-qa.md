# Design QA

- Source visual truth: article title, summary, excerpt, and headings in `lib/magazine.ts`
- Implementation: local Next.js magazine list and article detail
- Viewports: 1280 x 720, 390 x 844
- State: 23 article-specific generated thumbnails

## Full-view comparison evidence

- Desktop renders a featured article followed by a three-column thumbnail grid.
- Mobile renders a single-column list with intact 16:9 crops and no horizontal overflow.
- The first seven visible entries use distinct article-specific subjects while sharing one editorial palette.

## Focused region comparison evidence

- Meeting minutes uses a conference table and an audio-to-action workflow.
- AI adoption cost uses a physical descending cost model.
- Subsidies use an application folder and a converging selection path.
- Article detail uses the same generated asset for the hero background and Open Graph image.

## Pipeline evidence

- `npm run magazine:thumbnail-briefs` reports 23 ready and 0 pending.
- `npm run magazine:thumbnail-check` reports all briefs current.
- Source and image hashes are stored separately, so article edits return stale thumbnails to pending.
- All thumbnails are 1600 x 900 WebP assets; the full set is approximately 1.6 MB.

## Verification

- Production build completed successfully.
- Desktop and mobile browser captures completed successfully.
- No production build errors or document-level horizontal overflow.

final result: passed
