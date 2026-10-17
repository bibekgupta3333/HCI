# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

No application code exists yet. The repo holds only the planning documents for a CEN5728 (Advanced HCI) Group 4 course project:

- `proposal.txt`: the approved study design (conditions, case bank, research questions, implementation plan).
- `literature.txt`: the literature review. Sections 8–9 set out the methodology and the hypotheses (H1–H5) that the app must produce data for.
- `implementation.txt`: what the final submission must contain.

The design for the app is in `docs/` (start with `docs/README.md`). Follow `docs/_shared-decisions.md` for cross-cutting choices, and use `docs/data-model.md` as the authority on field names, and `docs/stimuli.md` as the authority on participant-facing wording. When code is added, update this file with the real build, run, and test commands.

## What is being built

A web-based **Wizard-of-Oz** study app (v3) on the question "When the AI label is wrong, do explanations help people catch it, and how do they make people feel?". Participants read 24 made-up social media posts, set in a fictional town. Each post carries a scripted AI label, "Likely accurate" or "Likely misleading". A fact sheet proves each post true or false. The participant clicks "Agree with label" or "Disagree with label". No ML model or LLM runs: every label is hard-coded in `src/data/posts.json`.

**Domain history.** `proposal.txt` and `literature.txt` describe the original **loan-approval** design. The docs moved first to AI-agent permission prompts (v2.1, archived in `docs/archive/v2.1-agent-permission/`), then to Deepthi's content-label proposal (v3). The change needs Professor Hamam's approval, and ethics approval for the deception and stress measures. Don't edit `proposal.txt` or `literature.txt`, which are submitted course documents.

### Four interface conditions (within subjects)
- **A – No explanation**: the label only.
- **B – Static**: the label plus one fixed reason.
- **C – Interactive**: the label plus a "Why?" breakdown with three rows: Source, Claim vs record, and Wording.
  - The Claim vs record row shows the true comparison against the fact sheet.
- **D – Counterfactual**: the label plus "This would be labeled … if …".

### Post bank (24 posts, 4 matched sets of 6)
- 8 labels are **deliberately wrong**, split into two error types that are compared head to head:
  - 4 **false alarms**: a true post labeled misleading.
  - 4 **misses**: a false post labeled accurate.
- Every wrong label can be checked against the post's fact sheet, which is identical in every condition.
- The bank, with ground truth and error types, is in `docs/_shared-decisions.md`. The final wording is in `docs/stimuli.md`.

### Study design constraints the code must enforce
- **Within-subjects**: 4 blocks × 6 posts. Each condition gets a different set.
- **Counterbalancing**:
  - A 4×4 Williams design orders the conditions (ABDC, BCAD, CDBA, DACB).
  - A 4-set rotation pairs sets with conditions.
  - Post order within each block uses a seeded shuffle, and the 2 wrong labels are never both in positions 1–2.
  - A full cycle takes 16 participants. The target is N = 32.

### Data to capture
**Per trial:**
- agreement and `detectedError` (analysed by `errorType`)
- confidence (1–7)
- time to decide, excluding time the tab was hidden
- fact-sheet opens and time open
- "Why?" and row expansions (C only)

**Per block:**
- Jian trust (12 items)
- fairness (2 items)
- tension (1–7)
- NASA-TLX frustration (0–100)
- the number of wrong labels the participant caught

**Per session:** pid, condition order and set assignment, so each session can be reconstructed.

### Stack
React 18 + TypeScript + Vite, a static SPA with localStorage persistence and CSV/JSON export (see `docs/architecture.md`). Put the effort into interface polish and study infrastructure, not modeling.

## Submission deliverables (`implementation.txt`)
The final submission is a source `.zip`, a demo video, and a report. The report covers: a project summary, the technologies used, target devices, step-by-step run-from-source instructions, how to interact with the app, code screenshots with explanations, screenshots of the running app, and screenshots of group members using it. Keep the run steps simple and reproducible from a clean checkout, because the report has to document them.
