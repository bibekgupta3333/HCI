# Visual quality review

**Status: NOT VISUALLY VERIFIED — visual capture NOT RUN.**

Automatic approval review rejected both capture attempts for capacity reasons before execution. No rendered-screen review or screenshots were produced. A–D visual quality is unverified, not failed. Source inspection cannot establish that A looks bad or that a CSS change improves appearance.

## Scope and evidence

Code discovery used the HCI knowledge graph; source and stylesheet review informed the observations below. Final fix and validation evidence was supplied by the coordinating agent; those checks were not independently rerun for this report. Staged work is preserved; this documentation task makes no commits or database writes.

| Package | Code-reviewed behavior and intended presentation |
|---|---|
| A | Decorative blank explanation spacer is intentional. Reserved space supports comparable decision-control locations; it is not evidence of missing content. |
| B | One static scripted reason; no explanation interaction controls. |
| C | Why? opens independently expandable Source, Claim vs record and Wording rows. True factual comparison remains visible through this additional evidence route; overflowing content must scroll without moving decision controls. |
| D | One static scripted counterfactual sentence; not an editable simulator. |

All packages share optional fact-sheet access and decision/confidence controls. Compare decision locations at the same viewport and interaction state; opening the responsive fact sheet may change available space. C changes evidence access as well as interaction, so package comparisons cannot isolate interactivity.

## Reported fixes and checks

| Fix | Evidence boundary |
|---|---|
| A hidden landmark | Empty explanation remains a decorative `div` with `aria-hidden`; spacer retained. |
| C valid targets | Controlled targets remain present while hidden, preserving valid `aria-controls` relationships. |
| Dialog shortcut guard | Trial shortcuts ignore dialog targets so dialog actions do not answer the trial behind them. |
| C responsive grid/wrapping | Explicit grid placement keeps the mobile mark in the third column beside the label, rather than an unintended extra row; wrapping/placement only. Appearance has not been rendered or verified. |

The coordinating agent reports **323 non-HTTP tests passed** and **production build passed**, including the final CSS change. These checks do not verify browser appearance or establish HTTP/end-to-end coverage.

## Pending browser verification

| Viewport width | Planned checks | Status |
|---|---|---|
| 1280 px | A–D baseline; stable decisions; fact sheet; C collapsed and all rows expanded | NOT RUN |
| 1024 px | Desktop spacing, panel clearance, focus and readable explanation text | NOT RUN |
| 768 px | Mid-width fact-sheet flow, C scrolling and controls, no clipped text | NOT RUN |
| 360 px | Responsive wrapping/grid marks, bottom sheet, touch/focus access, no horizontal overflow | NOT RUN |

When capture capacity is available, the coordinating agent must render these states using an isolated test database, record browser/viewport/build, compare baseline and final screenshots, and attach actual evidence before changing this status. Keep A’s reserved space, common fact sheets, C’s true comparison, static D, scripted labels, eight-post assignment, timing, scales and scoring intact. The temporary capture script path is not a durable report artifact.
