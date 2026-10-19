# Design docs

**Current decision — images rejected (2026-10-19):** `CURRENT_PROTOCOL` returns to `calibrated-full-v1`: new sessions are text-only and display each post’s original likes/reposts. Keep eight posts and `full-v1` (16 ratings per part, 64 total). `calibrated-media-full-v1` remains supported only for historical saved sessions, with their saved media/count profile and questionnaire; do not migrate or relabel them. Remove image captions from the UI, including historical media sessions; retain descriptive alt text for historical images. Do not generate new images or use generic topic photographs by default. Default practice is text-only with original counts; `GET /api/practice?contextMedia=1` is historical compatibility only. Schema 5 and historical assets/prompts remain preserved. Dashboard/KPI defaults return to the text-only full cohort; keep presentation cohorts separate. See [image suitability audit and historical provenance](media-and-engagement-design.md). No new browser or visual verification is claimed for this reversal.

**Full questionnaire restored (2026-10-19):** new sessions use `calibrated-full-v1` with `questionnaireVersion=full-v1`. After EACH of four parts, collect the original 12 Jian-based trust items, two fairness items, tension and frustration: 16 ratings per part, 64 total. Keep eight posts (two per part), appropriate reliance as primary, the unchanged paper title and the interface-package limitation. Trust is now measured separately for each explanation condition. Preserve previously started `calibrated-brief-v1` sessions and their brief surveys on resume; do not mix or relabel their data. Dashboard/KPI exports default to the restored full cohort. Earlier brief-default descriptions below document the superseded revision and apply only to saved brief sessions. Schema 4 preserves all earlier responses. Pilot the restored questionnaire burden; no completion-time or power guarantee is established.

**Historical brief measurement revision:** saved brief sessions prioritize appropriate reliance and collect 12 block ratings rather than 64. The questionnaire is versioned; legacy sessions retain original full items. A–D are interface packages, not a pure interactivity test. The paper title stays unchanged. Start with [methods and limitations](methods-and-limitations.md), [pilot and analysis plan](pilot-and-analysis-plan.md), and [study defense](parts-and-study-defense.md).

**Current short version:** new participants see 2 posts per part (8 total), sampled from the 24-post bank. Existing six-post-per-part sessions remain supported. See [parts-and-study-defense.md](parts-and-study-defense.md) and [study-protocol.md](study-protocol.md) for the current rationale and procedure. Older diagrams/PDFs may still depict the full-length design; do not treat them as current session-count specifications.

These are the design docs for the Group 4 CEN5728 study app. The code is in [`../app/`](../app/README.md), and its run guide is [`app/README.md`](../app/README.md). All diagrams are Mermaid and render on GitHub.

**Stack:** React 18 + TypeScript + Vite client, served by a local Node server (Express 5) that stores all responses in one SQLite file (`better-sqlite3`, `app/data/study.db`) and exports CSV/JSON from `/admin`. Ground truth stays on the server; the browser keeps only the active session id. This replaced the earlier plan of a static SPA with `localStorage` persistence (see [architecture.md](architecture.md), ADR-4).

**v3 domain: AI accuracy labels on social media posts** (Deepthi's proposal). New participants read eight made-up posts sampled from a 24-post bank in a fictional town. Each post carries an AI label, "Likely accurate" or "Likely misleading", and a fact sheet that proves the post true or false. The bank contains eight wrong labels; new participants see four (two false alarms and two misses). There are four explanation conditions:
- A: no explanation
- B: a static reason
- C: an interactive "Why?"
- D: a counterfactual ("would be labeled … if …")

The primary behavioral measure is appropriate reliance, decomposed into correct acceptance and wrong rejection. Condition-specific Jian-based trust, fairness, tension, single-item frustration, confidence, time and clicks are secondary; custom single-item trust applies only to saved brief sessions.

Main question: *When the AI label is wrong, do explanations help people catch it, and how do they make people feel?*

`proposal.txt` and `literature.txt` still describe the original loan-approval design. The v2.1 design (an AI agent's permission prompts) is archived in [archive/v2.1-agent-permission/](archive/v2.1-agent-permission/).

| Doc | What's in it |
|---|---|
| [_shared-decisions.md](_shared-decisions.md) | The source of truth: domain, the 24-post bank, conditions, counterbalancing, measures, hypotheses |
| [architecture.md](architecture.md) | Context and component diagrams, source tree, deployment view, ADRs |
| [system-design.md](system-design.md) | Requirements, flows, screen specs, counterbalancing tables (pid 1–16), analysis plan, team, risks |
| [sequence-diagrams.md](sequence-diagrams.md) | Sequence diagrams for assignment, trials A–D, fact sheet, wrong labels, surveys, recovery, export |
| [data-model.md](data-model.md) | ER diagram, field dictionary, TypeScript types, `posts.json` examples, SQLite tables, exports, validation |
| [ai-design.md](ai-design.md) | The Wizard-of-Oz labeller, ground truth, explanation design, error taxonomy, affect rationale |
| [stimuli.md](stimuli.md) | Final wording for all 24 posts, fact sheets and explanations |
| [wireframes.md](wireframes.md) | Wireframes for every screen, plus the screen flow |
| [research-positioning.md](research-positioning.md) | Decision history, the gap and how strong it is, contributions, venues, the literature search still to do |
| [implementation-plan.md](implementation-plan.md) | Build plan by week, gantt chart, per-member tasks, critical path |
| [study-protocol.md](study-protocol.md) | Consent and debrief drafts, moderator script, pilot, data handling |
| [design-summary.pdf](design-summary.pdf) | A short summary of these docs with simplified diagrams |

## Still to be decided by the team
- **Approvals:** Professor Hamam's approval of the topic change, and ethics approval for the deception and stress measures.
- **The full literature search:** Google Scholar and the ACM DL, before the gap is claimed. Someone needs to be assigned this week.
- **Made-up posts only.** Is the team happy with that?
- **C content confound:** the implemented true comparison remains; report interface-package effects, with equal-content comparison proposed only as follow-up.
- **Optional extras:** the consequence banner and the anxiety scale are off by default; drop them if the session runs too long.
- **Sample size:** N=32 is the exploratory balance/resource target; pilot burden and report realized balance, without claiming established power.
