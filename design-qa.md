# Design QA

- Source visual truth: `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_Wy05pe/スクリーンショット 2026-07-18 11.06.42.png`
- Implementation: local Next.js homepage browser capture
- Viewports: 1440 x 1000, 768 x 1024, 390 x 844
- State: homepage FV and AI OS section; default and `提案書自動生成` tab states

## Full-view comparison evidence

- Desktop keeps the three FV badges aligned at equal height with consistent outer padding.
- Tablet and mobile report no document-level horizontal overflow.
- Mobile stacks the two content-heavy AI OS layer panels vertically instead of clipping them in a horizontal carousel.

## Focused region comparison evidence

- FV: badge title, accent, description, and presenter content remain inside each card at desktop and mobile widths.
- AI OS: tabs remain horizontally reachable; KPI values remain on one line; table labels and actions wrap within their rows.
- Japanese body copy uses strict line breaking and balanced/pretty wrapping where supported.

## Comparison history

1. P1: mobile AI OS detail panels were wider than the viewport and required horizontal swiping. Fixed by switching the layer panels to a single-column mobile grid.
2. P2: KPI values could split before their unit on narrow screens. Fixed with a responsive type scale and no-wrap numeric values.
3. P2: tablet FV badge copy was dense. Fixed by reducing badge padding and type size while preserving card hierarchy.

## Verification

- Production build completed successfully.
- Primary tab interaction tested: `提案書自動生成` updates the KPI and table content.
- No production build errors. Development-only CSS hot-reload errors were observed during live CSS replacement and did not reproduce as build failures.

final result: passed
