# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

No application code exists yet. The repo holds only the planning documents for a CEN5728 (Advanced HCI) Group 4 course project:

- `proposal.txt`: the approved study design (conditions, case bank, research questions, implementation plan).
- `literature.txt`: the literature review. Sections 8–9 set out the methodology and the hypotheses (H1–H5) that the app must produce data for.
- `implementation.txt`: what the final submission must contain.

The design for the app is in `docs/` (start with `docs/README.md`). Follow `docs/_shared-decisions.md` for cross-cutting choices, and use `docs/data-model.md` as the authority on field names and the case bank. When code is added, update this file with the real build, run, and test commands.

## What is being built

A web-based **Wizard-of-Oz** study app on the question "Do people trust AI more when it explains itself?". Participants review loan applications and accept or reject a pre-scripted "AI" decision. No ML model is involved: every decision is hard-coded in the case bank.

### Three interface conditions (each owned and built separately)
- **A – Black Box**: shows only "Approved" / "Rejected".
- **B – Static Explanation**: the decision plus one fixed written reason.
- **C – Interactive Explanation**: the decision plus a "Why?" control that expands a per-factor breakdown (income vs. threshold, credit history length, debt-to-income ratio).

All three variants must read from **one shared case bank**. A JSON file is enough; the proposal says not to use a database.

### Case bank (~15 loan scenarios)
- Some AI decisions are correct given the stated criteria. Others are **deliberately wrong**: the decision contradicts the applicant's own numbers shown on screen. A wrong case only works for the study if the participant can check it against the data on screen.
- Each case needs a ground-truth correctness flag, so the analysis can separate agreement on correct cases from agreement on incorrect ones (H3a/H3b).

### Study design constraints the code must enforce
- **Within-subjects**: every participant sees all three conditions, each on different cases.
- **Counterbalance** condition order, case order, the condition–case pairing, **and where the wrong cases fall**. Seeing an AI error lowers trust for the rest of the session, so this matters.

### Data to capture per trial and per participant
- Agreement with the AI (yes/no), per case.
- **Time-to-decision**, per case (H5 links longer times to better error detection).
- For condition C, which factors were expanded and when. This isn't in the proposal, but it's needed to tell whether people actually checked the breakdown.
- Trust on a Likert scale, using Jian et al.'s Trust in Automation scale, per condition.
- Perceived fairness rating, per condition.
- Participant ID, assigned condition order, and case assignment, so each session can be reconstructed.

The survey layer can be custom and in-app, or an embedded Qualtrics or Google Form.

### Stack
The proposal allows React or plain HTML/JS. Nothing has been chosen yet. Put the effort into interface polish and study infrastructure, not modeling.

## Submission deliverables (`implementation.txt`)
The final submission is a source `.zip`, a demo video, and a report. The report covers: a project summary, the technologies used, target devices, step-by-step run-from-source instructions, how to interact with the app, code screenshots with explanations, screenshots of the running app, and screenshots of group members using it. Keep the run steps simple and reproducible from a clean checkout, because the report has to document them.
