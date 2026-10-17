# Design docs

These are the planning docs for the Group 4 CEN5728 study app: "Do People Trust AI More When It Explains Itself?". No code exists yet. These docs are the build plan, taken from `../proposal.txt` and sections 8–9 of `../literature.txt`. All diagrams are Mermaid and render on GitHub.

**v2 domain: approving actions proposed by an AI agent.** The proposal used loan approval. The docs now use a scripted assistant, "TaskPilot", that asks permission before it acts, checking each action against a 3-rule delegation policy (cost, trusted recipient, requested by you). The reason is novelty for a later paper, explained in [research-positioning.md](research-positioning.md). The original loan-domain design isn't kept in the repo. `proposal.txt` and `literature.txt` still describe it.

| Doc | What's in it |
|---|---|
| [architecture.md](architecture.md) | Context diagram, layered component diagram, source tree, deployment view, ADRs, quality attributes |
| [system-design.md](system-design.md) | Requirements with traceability to H1–H5, participant and admin state flows, screen specs and wireframes for A/B/C, counterbalancing tables (pid 1–18), timing design, analysis plan, team ownership, risks, pilot and tests |
| [sequence-diagrams.md](sequence-diagrams.md) | 8 sequence diagrams: session assignment, a trial in each of A/B/C, wrong-case handling, block survey, refresh recovery, admin export |
| [data-model.md](data-model.md) | ER diagram (no database: a JSON case bank plus localStorage), field dictionary, TypeScript types, the full 15-case bank, trust-scale file, export CSV formats, validation rules |
| [ai-design.md](ai-design.md) | The Wizard-of-Oz "AI": decision pipeline, rule evaluator, explanation authoring, depth-to-hypothesis model, error-injection taxonomy, persona and debrief |
| [implementation-plan.md](implementation-plan.md) | Build plan: phases by week, a gantt chart, per-member tasks, critical path, definition of done, checklist for the report deliverables |
| [study-protocol.md](study-protocol.md) | How to run a session: ethics and consent drafts, moderator and debrief scripts, lab checklist, incident handling, data handling, pilot |
| [stimuli.md](stimuli.md) | The final participant-facing text for all 15 cases (action cards, B sentences, C rows), plus drafts for Extension 1 and 2 |
| [wireframes.md](wireframes.md) | Low-fidelity wireframes for every screen, plus the screen flow |
| [research-positioning.md](research-positioning.md) | Why the domain changed, domains considered, nearest prior work and the gap, contributions, Study 1 vs Study 2, venues, threats to validity |
| [design-summary.pdf](design-summary.pdf) | A 5-page summary of these docs with simplified diagrams |
| [_shared-decisions.md](_shared-decisions.md) | The cross-doc decisions every doc follows (stack, rules, counterbalancing, measures), plus how disagreements between drafts were settled |

**v2.1 additions (from Deepthi's proposal):**
- Tension and NASA-TLX frustration ratings after each block (H6).
- A headline comparison of missed errors (agent overreach) vs false alarms (over-caution) (H3d).
- A counterfactual explanation as a future condition D (Extension 2).

Her social-media-label domain was considered but not adopted; see `_shared-decisions.md` → "Alternatives considered".

## Still to be decided by the team
- **Instructor approval for the domain change** from loan approval to agent permission prompts, and the H4 change from fairness to perceived control.
- **Study 2.** Whether to run the explanation-style arm (fluent vs terse) for the paper. It needs N = 36.
- **What the C breakdown shows on wrong calls.** The recommendation is the true ✓/✗ values, so a participant can catch the error ([ai-design.md](ai-design.md)).
- **Work split.** The team ownership in [system-design.md](system-design.md) is a proposal.
- **Survey wording.** The perceived-control items and trust-scale anchor labels in [data-model.md](data-model.md) are placeholders.
