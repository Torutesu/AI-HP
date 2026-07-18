# Design QA

- Source visual truth: `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_SiNvNO/スクリーンショット 2026-07-18 15.09.19.png`
- Implementation: local Next.js magazine article browser capture
- Viewports: 1440 x 1000, 390 x 844
- State: magazine article CTA at rest

## Full-view comparison evidence

- Desktop keeps the CTA inside the 820 px article measure with balanced copy and action columns.
- Mobile reports no document-level horizontal overflow at 390 px.
- Mobile stacks copy, diagnostic points, and the full-width action inside a 358 px panel.

## Focused region comparison evidence

- The data-network image creates depth while preserving a clear path toward the CTA.
- The dark responsive overlay maintains legible white copy across desktop and mobile crops.
- Diagnostic points and CTA labels remain fully visible without awkward Japanese line breaks.

## Comparison history

1. P1: the original pale banner lacked visual weight at the conversion point. Fixed with a full-bleed business-data image and dark premium treatment.
2. P2: the original CTA explained only that consultation was free. Fixed by showing the three concrete outputs of the diagnosis.
3. P2: the original oversized blue button competed with the copy. Fixed with a compact white action that remains full width on mobile.

## Verification

- Production build completed successfully.
- Desktop and mobile browser captures completed successfully.
- No production build errors or document-level horizontal overflow.

final result: passed
