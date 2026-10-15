# Design docs

These are the planning docs for the Group 4 CEN5728 study app: "Do People Trust AI More When It Explains Itself?". No code exists yet. These docs are the build plan, taken from `../proposal.txt` and sections 8–9 of `../literature.txt`. All diagrams are Mermaid and render on GitHub.

| Doc | What's in it |
|---|---|
| [architecture.md](architecture.md) | Context diagram, layered component diagram, source tree, deployment view, ADRs, quality attributes |
| [system-design.md](system-design.md) | Requirements with traceability to H1–H5, participant and admin state flows, screen specs and wireframes for A/B/C, counterbalancing tables (pid 1–18), timing design, analysis plan, team ownership, risks, pilot and tests |
| [sequence-diagrams.md](sequence-diagrams.md) | 8 sequence diagrams: session assignment, a trial in each of A/B/C, wrong-case handling, block survey, refresh recovery, admin export |
| [data-model.md](data-model.md) | ER diagram (no database: a JSON case bank plus localStorage), field dictionary, TypeScript types, the full 15-case bank, trust-scale file, export CSV formats, validation rules |
| [ai-design.md](ai-design.md) | The Wizard-of-Oz "AI": decision pipeline, rule evaluator, explanation authoring, depth-to-hypothesis model, error-injection taxonomy, persona and debrief |
| [_shared-decisions.md](_shared-decisions.md) | The cross-doc decisions every doc follows (stack, rules, counterbalancing, measures), plus how disagreements between drafts were settled |

## Still to be decided by the team
- **What the C breakdown shows on wrong cases.** The recommendation is the applicant's true pass/fail values, so a participant can catch the error ([ai-design.md](ai-design.md)).
- **Work split.** The team ownership in [system-design.md](system-design.md) is a proposal.
- **Survey wording.** The fairness items and trust-scale anchor labels in [data-model.md](data-model.md) are placeholders.
