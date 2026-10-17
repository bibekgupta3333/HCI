# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

No application code exists yet. The repo holds only the planning documents for a CEN5728 (Advanced HCI) Group 4 course project:

- `proposal.txt`: the approved study design (conditions, case bank, research questions, implementation plan).
- `literature.txt`: the literature review. Sections 8–9 set out the methodology and the hypotheses (H1–H5) that the app must produce data for.
- `implementation.txt`: what the final submission must contain.

The design for the app is in `docs/` (start with `docs/README.md`). Follow `docs/_shared-decisions.md` for cross-cutting choices, and use `docs/data-model.md` as the authority on field names and the case bank. When code is added, update this file with the real build, run, and test commands.

## What is being built

A web-based **Wizard-of-Oz** study app on the question "Do people trust AI more when it explains itself?". Participants supervise a scripted AI assistant agent ("TaskPilot"). The agent proposes actions on the participant's behalf (purchases, emails, file shares), checks each one against the participant's delegation policy, and says ALLOW or BLOCK. The participant clicks Agree or Override. No ML model or LLM runs: every call is hard-coded in the case bank.

**Domain change.** `proposal.txt` and `literature.txt` describe a **loan-approval** domain. The docs (v2) switched to agent permission prompts, because loan approval is already heavily studied. `docs/research-positioning.md` explains why. The research questions and the A/B/C design are unchanged, but H4 now measures perceived control instead of fairness, and H3c is new. The instructor has to approve the change. Don't edit `proposal.txt` or `literature.txt`, which are submitted course documents.

### Three interface conditions (each owned and built separately)
- **A – Black Box**: shows only "ALLOW" / "BLOCK".
- **B – Static Explanation**: the decision plus one fixed written reason.
- **C – Interactive Explanation**: the decision plus a "Why?" control that expands a per-factor breakdown against the three policy rules (cost ≤ $50, recipient on the trusted list, requested by you rather than by text in an email or web page).

All three variants must read from **one shared case bank**. A JSON file is enough; the proposal says not to use a database.

### Case bank (15 action scenarios)
- Some AI decisions are correct given the stated criteria. Others are **deliberately wrong**: the call contradicts the policy as applied to the action details shown on screen (over budget, a lookalike recipient address, or a prompt-injected trigger). A wrong case only works for the study if the participant can check it against the data on screen.
- Each case needs a ground-truth correctness flag, so the analysis can separate agreement on correct cases from agreement on incorrect ones (H3a/H3b).

### Study design constraints the code must enforce
- **Within-subjects**: every participant sees all three conditions, each on different cases.
- **Counterbalance** condition order, case order, the condition–case pairing, **and where the wrong cases fall**. Seeing an AI error lowers trust for the rest of the session, so this matters.

### Data to capture per trial and per participant
- Agreement with the AI (yes/no), per case.
- **Time-to-decision**, per case (H5 links longer times to better error detection).
- For condition C, which factors were expanded and when. This isn't in the proposal, but it's needed to tell whether people actually checked the breakdown.
- Trust on a Likert scale, using Jian et al.'s Trust in Automation scale, per condition.
- Perceived control/accountability rating, per condition (replaces fairness in v2).
- Participant ID, assigned condition order, and case assignment, so each session can be reconstructed.

The survey layer can be custom and in-app, or an embedded Qualtrics or Google Form.

### Stack
The docs settle on React 18 + TypeScript + Vite, a static SPA with localStorage persistence and CSV/JSON export (see `docs/architecture.md`). Put the effort into interface polish and study infrastructure, not modeling.

## Submission deliverables (`implementation.txt`)
The final submission is a source `.zip`, a demo video, and a report. The report covers: a project summary, the technologies used, target devices, step-by-step run-from-source instructions, how to interact with the app, code screenshots with explanations, screenshots of the running app, and screenshots of group members using it. Keep the run steps simple and reproducible from a clean checkout, because the report has to document them.
