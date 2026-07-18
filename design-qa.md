# Design QA

- Source visual truth: `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_JvMCXs/スクリーンショット 2026-07-18 15.25.37.png`
- Implementation: local Next.js homepage browser capture
- Viewports: 1440 x 1000, 390 x 844
- State: desktop service dropdown and open mobile navigation

## Full-view comparison evidence

- The desktop dropdown remains fully inside the 1440 px viewport and opens directly below `サービス`.
- Mobile reports no document-level horizontal overflow at 390 px.
- The mobile direct links resolve to equal 165 x 58 px tap targets.

## Focused region comparison evidence

- `AI経営基盤` links to `/ai-os/` and `コンサルティング` links to `/consulting/` in both layouts.
- Desktop uses a two-card dropdown without changing the header height.
- Mobile keeps both services visible immediately below the parent service link.

## Comparison history

1. P1: `サービス` only linked to the overview page. Fixed with direct links to both core offerings.
2. P2: a desktop-only dropdown would hide the direct path on mobile. Fixed with two persistent mobile service cards.
3. P2: dropdown hover gaps could close the menu while moving the pointer. Fixed with a transparent interaction bridge.

## Verification

- Production build completed successfully.
- Desktop and mobile browser captures completed successfully.
- No production build errors or document-level horizontal overflow.

final result: passed
