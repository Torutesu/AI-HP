# Design QA

- Source visual truth: user feedback requesting a denser 390 px mobile layout
- Implementation: local Next.js homepage browser capture
- Viewports: 1440 x 1000, 390 x 844
- State: homepage FV and Select Semantic Tree Method section at 390 x 844

## Full-view comparison evidence

- Desktop styles are unchanged by the mobile-only overrides.
- Mobile reports no document-level horizontal overflow at 390 px.
- All three mobile FV badges resolve to an equal 80 px height.

## Focused region comparison evidence

- FV badge accents and descriptions are hidden on mobile while the three proof points remain visible.
- Mobile section spacing, card padding, card heights, headings, and body copy are reduced without clipping.
- Semantic Tree theory and application panels both resolve to 350 px at mobile width.

## Comparison history

1. P1: mobile FV badges included desktop descriptions and made the hero excessively tall. Fixed by retaining only the badge core.
2. P2: research and impact badges resolved at different heights because of their media aspect ratios. Fixed with an explicit 62 px badge core.
3. P2: mobile section cards and typography still felt oversized. Fixed with mobile-only density reductions of roughly 10-20%.

## Verification

- Production build completed successfully.
- Desktop and mobile browser captures completed successfully.
- No production build errors or document-level horizontal overflow.

final result: passed
