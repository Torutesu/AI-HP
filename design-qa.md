# Design QA

- Source visual truth: the two user-provided screenshots from 2026-07-18 15:16 and 15:17
- Implementation: local Next.js homepage browser capture
- Viewports: 1440 x 1000, 390 x 844
- State: homepage FV and Select Semantic Tree Method section at rest

## Full-view comparison evidence

- Desktop keeps all three FV badges aligned while accommodating the longer 15万件 research title.
- Mobile reports no document-level horizontal overflow at 390 px.
- Mobile stacks the theory and application panels while preserving readable Japanese line breaks.

## Focused region comparison evidence

- The supplied report screenshot remains recognizable inside the FV research badge at desktop and mobile widths.
- The Semantic Tree visual is cropped from the supplied reference so embedded slide text does not compete with HTML copy.
- The external source link opens the supplied Reddit AMA in a new tab with safe link attributes.

## Comparison history

1. P1: the FV badge showed a generic archive illustration and the outdated 5万件 count. Fixed with the supplied report visual and 15万件 copy.
2. P1: the proprietary method had no dedicated explanation on the homepage. Fixed with a full two-panel feature section.
3. P2: using the full supplied slide as a background created duplicate text. Fixed by cropping a dedicated Semantic Tree visual from the source.

## Verification

- Production build completed successfully.
- Desktop and mobile browser captures completed successfully.
- No production build errors or document-level horizontal overflow.

final result: passed
