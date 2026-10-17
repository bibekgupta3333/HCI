# Design docs

These are the planning docs for the Group 4 CEN5728 study app. No code exists yet. All diagrams are Mermaid and render on GitHub.

**v3 domain: AI accuracy labels on social media posts** (Deepthi's proposal). Participants read 24 made-up posts from a fictional town. Each post carries an AI label, "Likely accurate" or "Likely misleading", and a fact sheet that proves the post true or false. 8 of the labels are deliberately wrong: 4 false alarms and 4 misses. There are four explanation conditions:
- A: no explanation
- B: a static reason
- C: an interactive "Why?"
- D: a counterfactual ("would be labeled … if …")

The study measures error detection, agreement, trust, fairness, tension, NASA-TLX frustration, confidence, time and clicks.

Main question: *When the AI label is wrong, do explanations help people catch it, and how do they make people feel?*

`proposal.txt` and `literature.txt` still describe the original loan-approval design. The v2.1 design (an AI agent's permission prompts) is archived in [archive/v2.1-agent-permission/](archive/v2.1-agent-permission/).

| Doc | What's in it |
|---|---|
| [_shared-decisions.md](_shared-decisions.md) | The source of truth: domain, the 24-post bank, conditions, counterbalancing, measures, hypotheses |
| [architecture.md](architecture.md) | Context and component diagrams, source tree, deployment view, ADRs |
| [system-design.md](system-design.md) | Requirements, flows, screen specs, counterbalancing tables (pid 1–16), analysis plan, team, risks |
| [sequence-diagrams.md](sequence-diagrams.md) | Sequence diagrams for assignment, trials A–D, fact sheet, wrong labels, surveys, recovery, export |
| [data-model.md](data-model.md) | ER diagram (no database), field dictionary, TypeScript types, `posts.json` examples, exports, validation |
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
- **What C's "Claim vs record" row shows on wrong labels.** The recommendation is the true comparison.
- **Optional extras:** the consequence banner and the anxiety scale are off by default; drop them if the session runs too long.
- **Sample size:** N = 32 (two full counterbalancing cycles) is the target, and 16 is the minimum.
