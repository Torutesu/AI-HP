# Design QA

- Source visual truth: `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_ZKP0bI/スクリーンショット 2026-07-18 15.08.18.png`
- Implementation: local Next.js homepage browser capture
- Viewports: 1440 x 1000, 390 x 844
- State: homepage issue cards at rest

## Full-view comparison evidence

- Desktop keeps all four issue cards aligned at equal height with consistent image and copy proportions.
- Mobile reports no document-level horizontal overflow at 390 px.
- Mobile presents the cards as a 286 px-wide snap carousel with the next card visible as a navigation cue.

## Focused region comparison evidence

- Each issue uses a distinct image that maps to visibility, adoption, ROI, or recurring cost.
- Dark lower gradients preserve white-text contrast without hiding the image subject.
- Japanese titles and body copy remain fully visible at desktop and mobile widths.

## Comparison history

1. P1: the original cards relied on small generic icons and did not visually communicate each business problem. Fixed with full-card contextual imagery.
2. P2: the original long copy made the row feel text-heavy. Fixed by shortening each description while retaining the business meaning.
3. P2: a full-width mobile card would hide the horizontal relationship. Fixed with an 80% snap width and a visible next-card cue.

## Verification

- Production build completed successfully.
- Desktop and mobile browser captures completed successfully.
- No production build errors or document-level horizontal overflow.

final result: passed
