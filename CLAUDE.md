# CLAUDE.md

**Current implementation (2026-10-18):** follow [AGENTS.md](AGENTS.md). New sessions have two posts per part (8 total), sampled from the unchanged 24-post bank. Existing 24-post sessions retain saved assignments. The app now uses graduate HCI experiment attribution at Florida Polytechnic University and contains no unfinished approval/contact placeholders. Earlier count/copy descriptions below are legacy; the current contract, protocol and [study defense](docs/parts-and-study-defense.md) supersede them.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

The app lives in `app/` (run guide: `app/README.md`; binding build contract with file ownership, module signatures and the HTTP API: `app/CONTRACT.md`, which has the v2 addendum `app/CONTRACT-v2.md` folded in). The repo also holds the planning documents for this CEN5728 (Advanced HCI) Group 4 course project:

- `proposal.txt`: the approved study design (conditions, case bank, research questions, implementation plan).
- `literature.txt`: the literature review. Sections 8–9 set out the methodology and the hypotheses (H1–H5) that the app must produce data for.
- `implementation.txt`: what the final submission must contain.

The design for the app is in `docs/` (start with `docs/README.md`). Follow `docs/_shared-decisions.md` for cross-cutting choices, and use `docs/data-model.md` as the authority on field names, and `docs/stimuli.md` as the authority on participant-facing wording.

## What is being built

A web-based **Wizard-of-Oz** study app (v3) on the question "When the AI label is wrong, do explanations help people catch it, and how do they make people feel?". Participants read 24 made-up social media posts, set in a fictional town. Each post carries a scripted AI label, "Likely accurate" or "Likely misleading". A fact sheet proves each post true or false. The participant clicks "Agree with label" or "Disagree with label". No ML model or LLM runs: every label is hard-coded in `app/shared/data/posts.json`.

**Self-guided, once per person (v2).** No researcher is needed to start. Anyone opens the site (lab laptop or their own desktop or phone), reads the public landing page (`/`: how it works, who can take part, privacy, FAQ, a "session in progress — Continue" banner), taps **Take part**, types a short participation code on the Welcome screen (`/start`) and goes; a session takes about 15–20 minutes. The server stores only `HMAC-SHA256(salt, normalisedCode)` in `sessions.participant_hash`, so a repeated code is refused (409) or, if still in progress, resumed. The server assigns the pid (lowest free slot; stale sessions older than `STALE_MINUTES` are abandoned and their pids reused). `/admin` is read-only data and KPIs (`GET /api/admin/kpis`) plus exports, Abandon and Delete; it cannot start sessions. Exports (`GET /api/admin/export/<name>`; `GET /api/admin/export` is a JSON index with descriptions and row counts): `participants.csv` (one analysis-ready row per session, never the participant hash; start here), `trials.csv`, `surveys.csv`, `events.csv`, `exit.csv`, `kpis.csv` (dashboard KPIs, long form) and `sessions.json`. Client routes: `/`, `/start`, `/consent`, `/instructions`, `/trial/:block/:pos`, `/survey/:block`, `/exit`, `/debrief`, `/admin`. Trials take two taps (Agree/Disagree, then an inline confidence chip with a 1 s Undo), with keyboard shortcuts, a progress bar, a one-screen survey matrix and a phone layout.

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

**Per session:** pid, condition order and set assignment, so each session can be reconstructed; `last_activity_at` and timing flags (`hiddenMs`, `blurCount`, `timingFlag`) serve as attention signals for the unmoderated sessions.

### Stack
React 18 + TypeScript + Vite client, plus a local Node server (Express 5) that stores every response in one SQLite file via `better-sqlite3` (`app/data/study.db`, set by `DB_PATH`), with CSV/JSON export from `/admin` (see `docs/architecture.md`, ADR-4). Ground truth (`posts.json`, the truth parts of `labelEngine`) is imported only by server code, so the client bundle never contains it; the browser keeps only the active session id in `localStorage` during a session. There is no browser "participated" flag (once-only is the server's hashed-code check, 409 `already_participated`); after the exit survey is saved the client flushes events and removes every `xai-study:` key from `localStorage`/`sessionStorage` except `xai-study:adminToken`, and the debrief has a **Next participant** button back to `/` (the landing page). Shared pure-TS domain code (`labelEngine`, `counterbalance`, `rng`) is in `app/shared/`. Put the effort into interface polish and study infrastructure, not modeling.

## Commands
All from `app/` (Node.js 22+):

```bash
cd app
npm install                     # once
npm run dev                     # API on :3001 + Vite on :5173 (proxies /api); participant at http://localhost:5173/ (landing page), dashboard at /admin
npm test                        # all Vitest suites
npx vitest run <path>           # a single test file, e.g. npx vitest run shared/counterbalance.test.ts
npm run typecheck               # tsc --noEmit
npm run build                   # type-check + client build to dist/
npm start                       # production: API + dist/ on :3001; participants open /, researcher /admin
```

Env vars: `PORT` (3001), `HOST` (`127.0.0.1`; `0.0.0.0` for other devices, behind an HTTPS reverse proxy), `DB_PATH` (`data/study.db`, relative to `app/`), `ADMIN_TOKEN` (optional; when set every admin route requires it, when unset admin answers only from loopback), `PARTICIPANT_SALT` (HMAC secret for participation codes; generated once into `meta.participant_salt` if unset; never change mid-study), `STALE_MINUTES` (120). Component tests start with `// @vitest-environment jsdom`.

## Submission deliverables (`implementation.txt`)
The final submission is a source `.zip`, a demo video, and a report. The report covers: a project summary, the technologies used, target devices, step-by-step run-from-source instructions, how to interact with the app, code screenshots with explanations, screenshots of the running app, and screenshots of group members using it. Keep the run steps simple and reproducible from a clean checkout, because the report has to document them.
