# Design QA

- Source visual truth: `/var/folders/73/8h5shzqn3nj4zmn32ntdtp6c0000gn/T/TemporaryItems/NSIRD_screencaptureui_bebRgi/スクリーンショット 2026-07-18 15.34.18.png`
- Implementation: local Next.js homepage philosophy section browser capture
- Viewports: 1440 x 1000, 390 x 844
- State: knowledge-to-impact message and three delivery steps

## Full-view comparison evidence

- The desktop visual panel aligns with the combined height of the three process cards.
- Mobile reports no document-level horizontal overflow at 390 px.
- Mobile uses a 360 px message panel and compact 150 px process cards.

## Focused region comparison evidence

- Two long explanatory paragraphs and three icon statistics were removed from the left panel.
- The three right-side descriptions were reduced to one short sentence each.
- Full-card imagery, navy overlays, process labels, and numbers communicate the removed detail visually.

## Comparison history

1. P1: the section repeated its message across five long text blocks. Fixed by reducing it to one message and three outcomes.
2. P1: generic line icons carried little meaning. Fixed by using business, module, and growth imagery.
3. P2: the desktop composition could become too tall on mobile. Fixed with dedicated 360 px and 150 px mobile card heights.

## Verification

- Production build completed successfully.
- Desktop and mobile browser captures completed successfully.
- No production build errors or document-level horizontal overflow.

final result: passed
