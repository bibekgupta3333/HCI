# Visual quality review

**Current decision — images rejected (2026-10-19):** `CURRENT_PROTOCOL` returns to `calibrated-full-v1`: new sessions are text-only and display each post’s original likes/reposts. Keep eight posts and `full-v1` (16 ratings per part, 64 total). `calibrated-media-full-v1` remains supported only for historical saved sessions, with their saved media/count profile and questionnaire; do not migrate or relabel them. Remove image captions from the UI, including historical media sessions; retain descriptive alt text for historical images. Do not generate new images or use generic topic photographs by default. Default practice is text-only with original counts; `GET /api/practice?contextMedia=1` is historical compatibility only. Schema 5 and historical assets/prompts remain preserved. Dashboard/KPI defaults return to the text-only full cohort; keep presentation cohorts separate.

**Verification boundary:** this documentation update adds no browser captures, visual testing, code-test or build results. Earlier media evidence below is historical and does not verify the current text-only/caption-free UI.

Historical evidence below is for the earlier media revision of app v0.4.0, protocol `calibrated-media-full-v1`, captured on 2026-10-19 with Chromium through Playwright and an isolated SQLite database. It supersedes the earlier blocked capture attempts for this presentation. Saved text-only cohorts were covered by regression tests, not this screenshot run.

## Historical verified media presentation (before image rejection)

| Package | Visual check |
|---|---|
| A | Post, context image and label; empty explanation frame intentionally preserves common decision placement. No extra rationale was added. |
| B | One readable scripted reason, same image/frame/control treatment as A. |
| C | Why? and independent Source, Claim vs record and Wording rows; expanded details scroll inside the common frame. The last detail was reachable without moving decision controls. |
| D | One scripted counterfactual sentence, with the same layout; no editable simulator implied. |

On wide media trials (at least 1100 px), the post sits beside label/explanation/decision controls. At the tested 1280 × 800 viewport, the decision row was about y=655 px for all four samples, versus about y=1042 px in the first stacked-media capture. A–D use the same 264 px explanation frame and 160 px image frame there. Narrower screens retain a stacked layout and page scrolling. A's reserved blank space is a deliberate comparison control, not missing content.

Final captures covered 1280, 1024, 768 and 360 px widths: **32 screenshots, no page errors and no horizontal overflow**. Images loaded, fact sheets opened, and C was checked collapsed, open, expanded and scrolled. Native label-fade animations were disabled for screenshots to avoid recording intermediate opacity; normal app timing was preserved. Layout measurements are in [metrics.json](artifacts/media-v1/metrics.json).

## Historical reviewable evidence

- [A at 1280 px](artifacts/media-v1/A-1280.png)
- [B at 1280 px](artifacts/media-v1/B-1280.png)
- [C expanded at 1280 px](artifacts/media-v1/C-expanded-1280.png)
- [D at 1280 px](artifacts/media-v1/D-1280.png)
- [C scrolled at 360 px](artifacts/media-v1/C-scrolled-360.png)
- [C fact sheet](artifacts/media-v1/C-fact.png)

The earlier media review recorded **438 passing tests** and a passing production build; these are historical results, not rerun or verified in this documentation update. Tests preserve original stimulus wording/truth and earlier sessions, verify A's decorative spacer and C's valid disclosure targets, guard dialog shortcuts, and check media balancing, error fallback, scores and persistence. No real participant database was used for verification.

## Historical limits and remaining checks

This is local Chromium evidence, not a Safari/Firefox, assistive-technology, slow-network or human-usability pass. Fixed-size image frames prevent load/error layout collapse; three PNGs total about 9.55 MB, so pilot cold-cache latency and failure behavior. Those checks applied to the superseded media proposal. For the current text-only return and caption removal, fresh layout, scrolling, keyboard focus and flow checks remain for the implementation owner; no pass is claimed here. Screenshots do not establish realism, better decisions, psychometric validity or research findings. C still contains extra factual comparison: compare interface packages, not pure interactivity.

## Current implementation checks reported by user

The user reports **438/438 tests passing** and a **passing production build** for the current implementation. This documentation task did not rerun those checks. These results provide no new browser QA evidence for the text-only return or caption removal; the captures above remain historical.

See [media and engagement design](media-and-engagement-design.md) for frozen assets, prompts, counts and cohort separation.
