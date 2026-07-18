# Design QA

- Source visual truth: `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_EtZ9Tz/スクリーンショット 2026-07-18 15.27.03.png`, `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_2lTGrl/スクリーンショット 2026-07-18 15.27.12.png`
- Implementation: local Next.js consulting page browser capture
- Viewports: 1440 x 1000, 390 x 844
- State: training contrast, four-step process, and closing CTA

## Full-view comparison evidence

- The desktop process row aligns to four equal-height image cards.
- Mobile reports no document-level horizontal overflow at 390 px.
- Mobile contrast and process cards resolve to the same 342 px content width.

## Focused region comparison evidence

- The three training contrasts now communicate `NO` and `YES` through imagery, typography, and color rather than icons.
- The four consulting steps use distinct visuals, process numbers, and concise English category labels.
- The closing CTA uses a full visual backdrop, white copy, and a high-contrast white action button.

## Comparison history

1. P1: icon-based contrast rows looked like generic notices. Fixed with image-backed `NO / YES` cards.
2. P1: the pale closing banner did not create a strong conversion endpoint. Fixed with a dark visual CTA and white button.
3. P2: rich cards could become oversized on mobile. Fixed with 94 px contrast cards, 264 px process cards, and a 360 px CTA.

## Verification

- Production build completed successfully.
- Desktop and mobile browser captures completed successfully.
- No production build errors or document-level horizontal overflow.

final result: passed
