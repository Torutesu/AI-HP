# Design QA

- Source visual truth: `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_DMun0L/スクリーンショット 2026-07-18 15.24.28.png`
- Implementation: local Next.js homepage browser capture
- Viewports: 1440 x 1000, 390 x 844
- State: homepage WHY cards at 1440 x 1000 and 390 x 844

## Full-view comparison evidence

- All four desktop cards resolve to an equal 340 px height.
- Mobile reports no document-level horizontal overflow at 390 px.
- Desktop title and body start positions differ by no more than 2 px across the row.

## Focused region comparison evidence

- The updated `最先端のオープンソース技術` label remains on one line at desktop width.
- Shared title and body blocks align cards with different copy lengths.
- Mobile removes the desktop alignment minimums and preserves the compact swipe-card layout.

## Comparison history

1. P1: the second feature used the broader `オープン技術` wording. Fixed to the requested `オープンソース技術` wording.
2. P2: variable body line counts shifted title positions across the row. Fixed with shared title and body minimum heights.
3. P2: desktop alignment constraints could add empty space on mobile. Fixed by resetting those minimums below 640 px.

## Verification

- Production build completed successfully.
- Desktop and mobile browser captures completed successfully.
- No production build errors or document-level horizontal overflow.

final result: passed
