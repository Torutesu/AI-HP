# Design QA

- Source visual truth: `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_FVE6SD/スクリーンショット 2026-07-18 15.26.20.png`, `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_cZPx1C/スクリーンショット 2026-07-18 15.26.28.png`, `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_SqjdIA/スクリーンショット 2026-07-18 15.26.35.png`
- Implementation: local Next.js AI operating system page browser capture
- Viewports: 1440 x 1000, 390 x 844
- State: equation, cost-down, sales-up, and pricing-reason cards

## Full-view comparison evidence

- All desktop card rows align to four equal columns, with the equation row using three equal columns.
- Mobile reports no document-level horizontal overflow at 390 px.
- Mobile equation and feature cards resolve to the same 342 px content width.

## Focused region comparison evidence

- Line icons were removed from all four requested card groups.
- Each card now uses a relevant existing visual, a controlled navy overlay, an index, and a concise category label.
- Light and dark source images maintain readable white card copy through the shared overlay system.

## Comparison history

1. P1: generic blue line icons made the sections feel interchangeable. Fixed by replacing icons with full-card imagery.
2. P2: different source-image brightness could reduce text contrast. Fixed with layered directional and bottom overlays.
3. P2: large imagery could make mobile excessively tall. Fixed with a 260 px mobile card height and single-column flow.

## Verification

- Production build completed successfully.
- Desktop and mobile browser captures completed successfully.
- No production build errors or document-level horizontal overflow.

final result: passed
