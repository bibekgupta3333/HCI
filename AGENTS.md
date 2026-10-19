# AGENTS.md

**Current decision — images rejected (2026-10-19):** `CURRENT_PROTOCOL` returns to `calibrated-full-v1`: new sessions are text-only and display each post’s original likes/reposts. Keep eight posts and `full-v1` (16 ratings per part, 64 total). `calibrated-media-full-v1` remains supported only for historical saved sessions, with their saved media/count profile and questionnaire; do not migrate or relabel them. Remove image captions from the UI, including historical media sessions; retain descriptive alt text for historical images. Do not generate new images or use generic topic photographs by default. Default practice is text-only with original counts; `GET /api/practice?contextMedia=1` is historical compatibility only. Schema 5 and historical assets/prompts remain preserved. Dashboard/KPI defaults return to the text-only full cohort; keep presentation cohorts separate. See [image suitability audit and historical provenance](docs/media-and-engagement-design.md). No new browser or visual verification is claimed for this reversal.

**Full questionnaire restored (2026-10-19):** new sessions use `calibrated-full-v1` with `questionnaireVersion=full-v1`. After EACH of four parts, collect the original 12 Jian-based trust items, two fairness items, tension and frustration: 16 ratings per part, 64 total. Keep eight posts (two per part), appropriate reliance as primary, the unchanged paper title and the interface-package limitation. Trust is now measured separately for each explanation condition. Preserve previously started `calibrated-brief-v1` sessions and their brief surveys on resume; do not mix or relabel their data. Dashboard/KPI exports default to the restored full cohort. Earlier brief-default descriptions below document the superseded revision and apply only to saved brief sessions. Schema 4 preserves all earlier responses. Pilot the restored questionnaire burden; no completion-time or power guarantee is established.

Guidance for every coding agent working in this repository. Read this before changing the app. This is a working project guide, not a claim that the study is approved or its findings are established.

## 1. Project and current scope

CEN5728 Advanced HCI, Group 4: **When the AI label is wrong, do explanations help people catch it, and how do they make people feel?**

This is a working, self-guided research website. New participants judge 8 distinct fictional social media posts (two per part, sampled from the 24-post bank) with scripted AI accuracy labels and optional fact sheets. Some labels deliberately contradict the facts. The experiment compares four explanation interface packages, appropriate reliance, error detection, full condition-specific trust, fairness and affect. It uses **Wizard-of-Oz** decisions: no model, LLM, external fact-check service or live social-media feed runs.

Current requirements:

- Anyone eligible can start without a researcher or admin approval.
- One submission per participation code; unfinished sessions can resume.
- A fast, interactive flow on desktop and phone; shortened to eight trials; duration remains an estimate pending pilot confirmation.
- SQLite persists study responses on the server.
- Admin is for monitoring, exports and session management, not starting participants.
- After successful completion, remove participant browser storage so the next person on a shared device can start normally.
- A public landing page introduces the study; admin CSV exports support analysis.

**Version names:** v3 describes the social-media-label domain. App contract v2 describes the later self-guided interaction changes; it does not mean a return to the earlier domain.

## 2. Sources of truth and historical material

| Source | Purpose |
|---|---|
| `app/README.md` | Setup, running, deployment, backups and exports |
| `app/CONTRACT.md` | Current API, module interfaces, response shapes and export columns |
| `app/shared/types.ts`, `app/shared/api.ts` | Implemented TypeScript domain and API types |
| `app/server/db/schema.sql`, `db.ts`, `repo.ts` | Actual SQLite schema, migrations and persistence |
| `docs/_shared-decisions.md` | Study conditions, post-bank structure, counterbalancing and hypotheses |
| `docs/stimuli.md` | Canonical participant-facing post, explanation and fact-sheet wording |
| `app/shared/data/posts.json` | Executable bank: 24 posts plus practice, with truth fields; server-only |
| `app/shared/data/surveyItems.json` | Executable questionnaire wording and scale definitions |
| `docs/data-model.md` | Field meanings and conceptual data model |
| `docs/study-protocol.md` | Recruitment, eligibility, consent, debrief, pilot and data handling |
| `docs/wireframes.md`, `system-design.md` | Screen intent and study-flow specifications |
| `docs/parts-and-study-defense.md` | Current short-design rationale, each part’s role and defense questions |
| `docs/research-positioning.md` | Proposed contribution and literature gaps requiring verification |
| `docs/README.md` | Index to the remaining architecture, AI, sequence and implementation docs |

The current user instruction takes precedence over older documents. Verify running behavior against code and tests. Some planning sections are stale: they mention moderated sessions, 30–35 minutes, localStorage response storage, a Next button, or no implemented code. These do not override the implemented self-start flow, SQLite persistence or current contract. Surface mismatches and update affected documentation when changing behavior.

`app/CONTRACT-v2.md` is historical; its self-guided changes are folded into `CONTRACT.md`. Its old browser completion flag is superseded.

`proposal.txt` and `literature.txt` are the submitted **loan-approval** proposal and review; do not rewrite them as the current app design. `implementation.txt` defines submission deliverables. The intermediate agent-permission design is archived under `docs/archive/v2.1-agent-permission/`; preserve it as history. A generated PDF can lag behind code; regenerate and visually check it before calling it current.

## 3. Discovery and working rules

- Use codebase-memory-mcp first for code discovery: `search_graph`, `trace_path`, `get_code_snippet`, `query_graph`, `search_code`, and `get_architecture`. Check `list_projects`; index this repository with `index_repository` if absent. The project was indexed as `HCI`; refresh when results are stale.
- Read a file before editing it. Use direct text/config/doc reads freely. Fall back to local code searches when graph tools are unavailable or insufficient, and say so when material.
- Preserve unrelated user changes, staged work, real participant data and historical archives.
- Multi-agent ownership tables in the contract describe previous build rounds, not permanent user-approval requirements. For new parallel work, assign nonoverlapping files and agree on shared types/API first; integrate and verify the combined result afterwards.
- Complete authorized reversible fixes without repeatedly asking permission. Do not commit, publish or deploy merely because a previous agent offered to do so.
- Never claim servers are running, tests pass, a backup exists, or approval was granted without current evidence. Temporary files can disappear between sessions.

## Historical brief measurement revision — calibrated reliance (2026-10-18)

The paper title is unchanged: **Do People Trust AI More When It Explains Itself? A Comparative Study of Explanation**. Primary outcomes are accepting correct labels and rejecting wrong ones, combined as behavioral appropriate reliance. Greater agreement or trust alone is not success.

- New sessions persist `protocolVersion=calibrated-brief-v1`; old sessions remain `legacy-full-v1` after migration, regardless of 8/24 planned trials. Never select questionnaires by plan length or upgrade a resumed session.
- New block surveys collect `questionnaireVersion=brief-v1`: custom `briefTrust` 1–7, tension 1–7 and frustration 0–100, three ratings per part/twelve total. Do not call briefTrust a validated or shortened Jian scale. Fairness and the full Jian items are not collected in this protocol.
- Full-v1 questionnaires remain for saved legacy sessions. For brief-v1, store legacy trust/fairness scores as null and trust arrays empty, never zero, repeated single-item values or imputed scores. Use separate fields for `briefTrustMean` and historical Jian `trustMean`.
- Report correctAcceptanceRate, wrongRejectionRate, appropriateRelianceRate, overrelianceRate and underrelianceRate with counts and clear denominators. No eligible trials means null, not zero. All-agree and all-reject strategies are both incomplete reliance behaviors.
- A–D are interface packages. C's factual comparison is deliberately unchanged, so a C advantage cannot isolate interactivity or explanation depth. An equal-information static follow-up is proposed, not implemented.
- Dashboard/KPI exports default to the current protocol; raw response exports preserve all versions and include protocol/questionnaire identifiers. Do not pool cohorts or compare custom single-item trust directly with Jian means.
- Keep the eight-post design exploratory. Pilot separately before formal collection; N=32 is an assignment/feasibility target, not established power. See `docs/pilot-and-analysis-plan.md` and `docs/methods-and-limitations.md` for the analysis/reporting plan and transparent simulated-AI description. Do not reveal planted errors in recruitment copy.

This historical section applies to saved brief sessions only. The restored full-questionnaire revision at the top governs new sessions.

## Questionnaire presentation

The participant interface runs in a web browser, with desktop/laptop readability and existing responsive support. Neutral survey instructions ask participants to rate the AI labeling system used in the completed part, rather than the post authors or website design. Do not redefine abstract trust items, coach answers or reveal planted errors. Keep canonical wording, item order, scale endpoints and full/brief version-specific validation unchanged. Before interaction, the frustration slider says “Move the slider to select your answer”; its underlying start of 50 is not a submitted answer. An intentional selection of 50 remains valid. UI clarity does not establish psychometric validity or measured burden; pilot the presentation.

## 4. Study design and invariants

### Conditions

| Condition | Explanation beneath the label |
|---|---|
| A — No explanation | Label only |
| B — Static | One scripted reason |
| C — Interactive | A **Why?** button opening Source, Claim vs record and Wording rows; each row expands independently |
| D — Counterfactual | One scripted “This would be labeled … if …” sentence |

All participants see every condition, with a different set of posts in each. The same post card, label controls and fact-sheet access are shared across conditions. C's Claim vs record row shows the true comparison, including contradictions on wrong-label posts. This is a deliberate feature of C, not a signal to correct the scripted label.

B, C's rationale text, and D may support a wrong AI label. Do not automatically make labels or persuasive explanations truthful: planted errors are essential stimuli. Preserve the canonical wording and true comparison values.

### Post bank

- Fictional Riverton/Alder County setting, accounts and agencies; topics: environment (`env`), public services (`svc`) and local events (`evt`).
- IDs `p01`–`p24`, partitioned into `S1`–`S4`, six per set. One separate practice post is not an analysed trial.
- Each set has four correct labels and two wrong labels: one `false_alarm` and one `miss`. Total: 16 correct and 8 wrong.
- `false_alarm`: TRUE post labeled `misleading`. `miss`: FALSE post labeled `accurate`.
- Each error type has two clear and two subtle instances. p15 is subtle, p16 is clear. Do not reintroduce the old difficulty imbalance.
- p10 is the parking-fee claim ($4 versus the actual $2 per hour), replacing a discarded flu-shot-fee claim.
- A fact sheet establishes truth for each post and is the same across explanation conditions.
- Truth validation compares canonical `keyFact.claimValue` with `recordValue`; do not infer truth from verified badges, emotional wording or account names.
- B text is 8–14 words; D text is 10–16 words. Changes must satisfy bank validation and stay synchronized with `stimuli.md`.

### Active short-session design (2026-10-18)

The user explicitly shortened NEW sessions to two posts per part (8 total). The full 24-post bank remains canonical. Each part samples one correct and one wrong label from its assigned set; posts never repeat across parts. Each participant sees two false alarms and two misses overall. The wrong-label type is selected by condition index plus the 16-person-cycle parity, and flips in the next cycle; condition × error-type balance therefore needs 32 participants. Shuffle both positions; do not always put the wrong post second.

This is a short exploratory study: one wrong trial per condition cannot estimate both error types within that condition for an individual. For the current protocol use three custom block ratings (12 overall); the original 12-item Jian and fairness questionnaire remains only for saved legacy sessions. Do not promise a full-paper result or a validated time estimate.

Existing sessions retain their persisted six-post block plans. All cursor transitions, progress, survey eligibility and debrief counts must use saved block lengths. Never shorten an existing session or delete responses. CSVs append `plannedTrials` and `studyVariant` (`short-8` / `legacy-24`); analyse these versions separately. For formal short-cohort collection, use a new `DB_PATH` and preserve the old file: legacy pids occupying slots can otherwise prevent 32 additional short participants from completing the intended 32-slot balance. Admin monitoring may show both, with an explicit warning.

The first two posts in each part show compact, dismissible condition-specific interaction guidance. Guidance must not disclose correct answers, force fact-sheet checking or introduce a new information source in only one condition. A remains label-only, B static, C expandable Why, D counterfactual. See `docs/parts-and-study-defense.md`.

Participant-facing attribution: **HCI experiment conducted as part of graduate study at Florida Polytechnic University.** Remove unfinished IRB/contact/professor placeholders from the app; do not replace them with invented contacts, approval numbers or claims of university endorsement. Keep voluntary consent, adult eligibility and factual data-handling explanations.

### Counterbalancing (bank and legacy plan; short-session override above)

- Four blocks/parts, two trials each for new sessions (six for saved legacy sessions); one condition per block, with a survey after every block.
- Williams orders: `ABDC`, `BCAD`, `CDBA`, `DACB`.
- `order = WILLIAMS[(pid - 1) % 4]`.
- `rotation = floor((pid - 1) / 4) % 4`.
- For condition index `c` (A=0 through D=3), set index is `(c + rotation) % 4`.
- `pid` seeds mulberry32; Fisher–Yates shuffles each block using the reproducible stream. Reshuffle if both wrong labels occupy positions 1–2.
- A full assignment cycle is 16 participants. Target N=32; one cycle is a balancing minimum, not a power-analysis guarantee.
- Indices: `blockIndex` 1–4, `positionInBlock` 1–6, `trialIndex` 1–24.
- A displayed `trialId` contains pid/block/position but is not globally unique: abandoned pid slots can be reused. Database identity includes `sessionId`.

### Research interpretation

RQ1 compares error detection across explanation conditions and false alarms versus misses. RQ2 asks which explanation helps most. RQ3 examines tension/frustration and whether persuasive explanations make wrong labels feel believable or less stressful. Trust/agreement, fairness, decision time and verification clicks are additional outcomes.

Use the current v3 hypotheses in `_shared-decisions.md`, not the original loan hypotheses. These are predictions, not results. Do not claim novelty is proven, that N=32 guarantees a full paper, or that faster interactions establish a measured 15–20 minute duration. The literature gap and piloted completion time require evidence.

## 5. Participant experience and routes

| Route | Screen and behavior |
|---|---|
| `/` | Public landing: introduction, Take part, three steps, eligibility, privacy, FAQ; Continue banner when an active session is stored |
| `/start` | Participation-code entry, Back link, Start/Enter, resume and server duplicate-code messages |
| `/consent` | Short summary, full text disclosure and consent/18+ confirmation |
| `/instructions` | Brief instructions plus one inline practice post; no forced reading lock |
| `/trial/:block/:pos` | Post, checking state, label, assigned explanation, fact sheet, decision, inline confidence and progress |
| `/survey/:block` | Compact trust matrix, fairness, tension and frustration |
| `/exit` | Demographics, social-media use, label exposure, preference and optional comment |
| `/debrief` | Reveals scripted wrong labels and factual corrections; Next participant returns to `/` |
| `/admin` | Data/KPIs, sessions, exports and management; no participant-start form |

Landing/recruitment copy must not reveal planted errors before participation. Eligibility is adults 18+ able to read English; no social-media or AI expertise is required. Follow the protocol for pilot/team-member handling and prior-knowledge recording. Do not invent approval numbers or contacts; participant-facing placeholder text has been removed at the user’s request.

Trial interaction: preload the next presentation; show the common 800 ms checking state; start timing after the label paints; Agree/Disagree, then confidence 1–7 on the same screen. A short 1-second Undo window allows correction before saving; there is no separate Next step per post. Keyboard: A agree, D disagree, 1–7 confidence, F fact sheet, W Why (C), Esc close panel. Shortcuts must not interfere with text inputs or dialogs. Progress shows both part/post-in-part and overall post count.

The fact sheet is an optional verification aid, a side panel on wide screens and a bottom sheet on phones. Preserve keyboard access, visible focus, reduced-motion support and touch targets around 44 px. Check layouts from 360 px to desktop.

### Diagnosing “Why?” and empty space

- **Part 1 is not necessarily condition A.** Check the stored `conditionOrder` and presentation `condition`. All posts in that part should share it.
- A visible Why button identifies C; it is not expected in A, B or D.
- A fixed-height explanation area keeps decision controls comparable across conditions. Empty space can occur in A, when C is collapsed, or below short B/D content. Whitespace alone does not establish the condition or a load failure.
- Inspect `TrialScreen`, the condition registry/view, and explanation-container CSS before changing spacing. Distinguish reserved space from duplicated wrappers, clipped rows or missing content.
- Do not silently collapse only A or change C's fact comparison. This changes the experimental presentation. Apply requested layout changes consistently and update affected design docs.

## 6. Participation identity, resume and completion

1. `POST /api/sessions` accepts `{ participantCode, consequenceBanner? }`, not a manually chosen pid.
2. Normalize with `trim().toLowerCase()`, validate 3–120 characters, store only `HMAC-SHA256(salt, normalizedCode)`. Never log raw codes or include codes/hashes in analysis exports.
3. New code: 201 with a new session. Existing in-progress code: 200 resuming that session. Completed or abandoned code: 409 `already_participated`.
4. Assignment is transactional. The server sweeps stale in-progress sessions, then allocates the lowest available non-pilot pid; abandoned slots can be reused with a new `sessionId`. Automatic allocation avoids pilot range 900+.
5. `last_activity_at` records participant writes. Stale sweeping occurs during session creation; do not describe it as a continuously running background timer.
6. Browser localStorage holds `xai-study:activeSessionId` only during participation. A same-browser Continue resumes it; entering the same code can resume on another device.
7. The server cursor is authoritative; update client state before navigating after a save. Resumed unfinished trials are flagged `resumed` and their timing restarts.
8. After the exit survey saves successfully, flush final events and invoke `clearParticipantStorage`: remove all `xai-study:` keys in localStorage/sessionStorage except `xai-study:adminToken`. Do not use global `localStorage.clear()` or delete unrelated origin data.
9. Preserve completed session/debrief state in memory. Next participant resets it and returns to the landing page; a refresh after completion also starts fresh. Never restore a browser-wide participated flag.
10. **Exit study** is available on every active participant screen. Confirming calls `POST /api/sessions/:id/cancel`, preserves saved rows, marks the session abandoned, clears participant storage after success, and shows an early-exit debrief. Keep participating/Escape dismisses confirmation. No admin permission is needed; cancellation does not submit unfinished survey answers. Already-abandoned requests are safe to retry, completed sessions cannot be cancelled.
11. Failed response saves must remain retryable; do not clear active-session storage prematurely or delete SQLite responses during browser cleanup.

Limitations: a different code bypasses the check; codes are not verified identity. Deleting a session also removes its stored duplicate-check record. Abandoned codes are blocked, including stale sessions; don't promise indefinite resume. Changing or losing the HMAC salt breaks recognition of earlier codes. Hash-based linkage is pseudonymous, not a guarantee of absolute anonymity.

## 7. Measures, scoring and logging

| Level | Required information |
|---|---|
| Trial | Assignment/post identifiers, agreement, required confidence 1–7, truth/error type derived on server, decision timing, hidden/blur counts, fact-sheet use/time, C interactions, resumed flag |
| Block | Current brief-v1: custom perceived trust1–7, tension1–7, frustration0–100(step5), detected-error count; saved full-v1: original Jian/fairness measures |
| Session | pid and UUID sessionId, assignment/seed, cursor/status, timestamps, resume count, post-bank hash and app version, exit answers |
| Event | Monotonic session sequence, optional trial identifiers, event type/factor, relative performance time and wall-clock time |

- `detectedError = !agreed` on wrong labels; **null on correct labels**. It measures behavioral disagreement, not proof of the participant's reasoning.
- **Legacy full-v1 only:** trust items 1–5 reverse score `8 - raw`; items 6–12 remain raw. Compute trust and fairness means on the server. Keep raw and scored trust values in exports.
- The frustration slider starts at 50 and requires interaction (`frustrationTlxTouched`) before submit. Do not report its single item as a full weighted NASA-TLX score.
- `nWrongDetected` is the server-derived count per block, 0–2.
- `decisionTimeMs = decisionTimeRawMs - hiddenMs`; timing flag is set for hidden periods or adjusted time over 120000 ms. Do not silently discard flagged trials.
- Outside C: `explanationOpened = null`, `timeToFirstExpandMs = null`, `factorsExpanded = []`. In C, timeToFirstExpand measures the first **Why open**, not the first row expansion.
- Mount one `LoggerProvider` per active session. `nextEventSeq` from the server continues sequence numbering after resume; restarting at 1 silently loses events because inserts are deduplicated by session/sequence.
- Buffer events and flush around saves, periodically and on pagehide. Preserve retry behavior; check decisions, confidence, fact-sheet, Why/row, visibility, block and completion events when modifying flows.
- Optional consequence-banner/anxiety fields are not additional default experiment arms. Verify actual support before enabling them or advertising them.

## 8. Architecture and module map

```text
React client → /api → Express → repository → SQLite
                     ├─ labelEngine + scripted post bank
                     ├─ counterbalance + seeded RNG
                     └─ KPI calculations + CSV/JSON exporters
```

| Path | Responsibility |
|---|---|
| `app/src/App.tsx`, `main.tsx` | Mounting, routing, guards, session logger |
| `app/src/state/StudyContext.tsx`, `studyReducer.ts` | Active session, resume, cursor synchronization, participant-storage cleanup |
| `app/src/api/client.ts` | Typed fetch wrapper, API errors and admin token handling |
| `app/src/study/` | Landing, welcome, consent, practice, trial, surveys, exit and debrief |
| `app/src/components/` | Post/label cards, panels, scales, matrix, confidence strip and progress |
| `app/src/conditions/` | A–D views and `conditionRegistry` |
| `app/src/logging/` | Event buffer and trial timer |
| `app/src/admin/` | Dashboard, KPI charts and export panel |
| `app/src/styles/global.css` | Shared stylesheet and responsive behavior |
| `app/shared/types.ts`, `api.ts` | Domain and HTTP types |
| `app/shared/labelEngine.ts` | Validation, presentation allow-list and post-bank hash; server truth logic |
| `app/shared/counterbalance.ts`, `rng.ts` | Deterministic assignment/shuffling |
| `app/server/index.ts`, `app.ts` | Configuration, database startup, Express factory and production serving |
| `app/server/routes/` | Participant, session and admin endpoints |
| `app/server/db/` | Schema, idempotent migration/startup and repository mapping |
| `app/server/kpi.ts` | Dashboard aggregates and cohort filtering |
| `app/server/export/` | CSV serialization, seven exports and export index |

Stack: React 18, TypeScript, React Router 6, Vite, Express 5, better-sqlite3, tsx, Vitest and Testing Library. Imports are relative; server runs via tsx. Do not replace SQLite with browser storage or add model infrastructure for this scripted study.

Truth boundary: only server code imports `posts.json` and truth functions. `buildPresentation` copies an explicit allow-list and sends only condition-appropriate explanation fields. Participant payloads must not include `groundTruth`, `isAiCorrect`, `errorType`, `difficulty`, or `keyFact`. C's visible true comparison and fact sheets are intentional aids; debrief corrections are intentional after completion. Protect the client bundle from accidentally importing the full bank.

## 9. SQLite persistence and HTTP behavior

SQLite file defaults to `app/data/study.db`. File databases use WAL and foreign keys; tests may use `:memory:`. `db.ts` applies schema and migrations; `repo.ts` owns snake_case ↔ camelCase mapping.

| Table | Purpose / identity |
|---|---|
| `meta` | Schema metadata and generated participant salt |
| `sessions` | UUID identity, pid, code hash, assignment, cursor, status and activity |
| `blocks` | Stored condition/set/post order, keyed by session/block |
| `trials` | Responses/scoring, keyed by session/block/position |
| `events` | Deduplicated event sequence, keyed by session/seq |
| `block_surveys` | Versioned questionnaire per session/block; nullable uncollected legacy scores and separate brief trust |
| `exit_surveys` | One exit survey per session |

Statuses: `in_progress`, `completed`, `abandoned`. Cursor phases include consent, instructions, trial/post_rating, block_survey, exit_survey and done. A block survey requires all trials in that saved block plan (two new / six legacy); completion requires four saved block surveys. Reject duplicate trial/survey writes and validate ranges and assigned post IDs. The server derives correctness and scores; never trust client-supplied truth.

Key API groups (exact payloads and columns: `CONTRACT.md` and `shared/api.ts`):

- `GET /api/health`, `GET /api/practice`.
- `POST /api/sessions`; `GET /api/sessions/:id`; POST resume and consent.
- GET presentation by assigned block/position; POST trials and events; PUT cursor.
- POST block-surveys and exit-survey.
- Admin GET sessions, kpis, assignment preview and export index/files; POST abandon and DELETE session.

Errors use `{ error, detail? }`: 400 invalid input, 404 missing resource, 409 conflict/duplicate/already-participated, and admin access errors. Preserve sendBeacon event support. Session UUIDs are sensitive access identifiers; the app has no participant account/password system.

Protect real data: use a temporary/separate DB for pilots and browser tests. Never reset/delete the study DB to make a test pass. Withdrawal deletion cascades; abandoning preserves responses. For a file backup, stop the server before copying or use a SQLite-aware backup; a live WAL database cannot safely be backed up by copying only its main file. Analysis exports omit the participant hash and generated salt and are not a full identity-preserving database backup.

## 10. Admin, KPIs and exports

Admin never grants permission to join and cannot start sessions. It polls approximately every 15 seconds and provides completion/progress cards, duration statistics, condition/error detection, trust/fairness/affect, fact-sheet use, balance counts, session management and exports.

KPI analysis cohorts use completed non-pilot sessions; pilot pids ≥900 are excluded. Session status counts additionally describe in-progress/abandoned sessions. Check `computeKpis` for each denominator rather than assuming every KPI counts all rows. Assignment balance and experimental outcome summaries are different concepts.

Admin API requires `ADMIN_TOKEN` when configured, via `x-admin-token` or query token for downloads. Without a token it accepts loopback requests only. Configure a token for network/proxy deployment; do not rely on proxy networking alone to secure admin. Never print tokens or real participation codes in diagnostics.

| Export | Meaning |
|---|---|
| `participants.csv` | Start here: one row per **session**, all statuses, pilot flag, overall/error-type detection, per-condition summaries and exit answers |
| `trials.csv` | Per-trial responses, scoring/truth, timing and interactions |
| `surveys.csv` | Per-block raw/scored trust, fairness and affect |
| `events.csv` | Per-interaction sequence and timestamps |
| `exit.csv` | Exit survey answers |
| `kpis.csv` | Dashboard metrics in long form: section, key, metric, value |
| `sessions.json` | Full nested analysis sessions; excludes participation hash/salt |

`GET /api/admin/export` returns seven descriptions and current row counts. `GET /api/admin/export/:name` downloads an allow-listed file. Names include date and study prefix. CSV uses UTF-8 BOM, RFC 4180 quoting, TRUE/FALSE booleans, blank nulls and pipe-separated arrays; rates are fractions, not percentages. Preserve fixed column order. Download all CSVs triggers six downloads; raw JSON is optional. Export descriptions must wrap so row counts and download buttons remain visible.

Raw exports include unfinished/abandoned sessions; filter by status/pilot for analysis. Do not equate `participants.csv` rows with unique verified people. Protect downloaded responses, including demographics and free text.

## 11. Running and configuration

All commands run from `app/`, Node.js 22+:

```bash
cd app
npm install
npm run dev            # Express :3001 + Vite :5173; Vite proxies /api
npm run dev:server     # API only, watch mode
npm run dev:client     # Vite only
npm test               # all Vitest suites
npx vitest run shared/counterbalance.test.ts
npm run typecheck
npm run build          # typecheck + client build to dist/
npm start              # production API + dist/ on :3001
```

Development participants: `http://localhost:5173/`; admin: `/admin` on that origin. Production participants: `http://localhost:3001/`. Do not send development participants to the API-only origin or a bare trial URL. No lint script is currently defined. Preserve the protocol-aware migration and run its retention tests for changes to survey schemas. `npm start` uses POSIX environment syntax; Windows needs Git Bash/WSL or the workaround in the README.

| Environment | Default / purpose |
|---|---|
| `PORT` | 3001, backend port |
| `HOST` | 127.0.0.1; use 0.0.0.0 only when intentionally exposing the backend |
| `DB_PATH` | data/study.db relative to app; separate path for tests/pilots |
| `ADMIN_TOKEN` | Optional locally; set for shared deployment |
| `PARTICIPANT_SALT` | Stable HMAC secret; generated once in meta if absent; preserve across the study |
| `STALE_MINUTES` | 120, inactivity threshold evaluated during self-start |

Other devices cannot use this laptop's localhost URL. Remote access needs a reachable host, HTTPS and correctly configured frontend/API/proxy routing; exposing HOST alone is not a deployment. Check health and page responses before reporting a server as running. Stop only task-related processes; avoid broad process kills.

## 12. Verification and change discipline

Documentation-only changes: check formatting, relative links and consistency; no need to rerun the entire app suite. Code changes: run relevant tests, typecheck and build as appropriate, then broaden only for unresolved risk. Component tests use `// @vitest-environment jsdom`; API tests use temporary/in-memory SQLite and Supertest.

For changes spanning the participant flow, verify:

1. Landing → Take part → code → consent → practice → trials/surveys → exit → debrief.
2. All four explanation conditions, correct set/order assignment, fixed layout and readable C rows.
3. Agreement/confidence, Undo, keyboard/touch, fact sheet, timing and saved cursor.
4. Refresh/resume without duplicate trials or reused event sequence numbers.
5. Final save followed by participant-storage cleanup, then a second participant in the same browser without incognito.
6. Reusing the completed code is blocked by the server even after browser cleanup.
7. Admin cohort counts/exports agree with SQLite; no raw code/hash leaks into analysis exports or client bundle.
8. Desktop and phone layouts, visible focus, no horizontal overflow, no page errors.

Use temporary participation codes and a separate test DB. Do not preserve brittle test-count claims in this file; run and report the current counts. Document any untested platform or feature honestly.

## 13. Research, documentation and submission boundaries

The app is a graduate-study HCI experiment at Florida Polytechnic University. Removing unfinished approval/contact placeholders does not establish institutional approval. Do not fabricate approval or endorsement claims. Preserve voluntary participation and truthful data handling. The software remains self-start; do not add an admin gate.

The user authorized the eight-trial design described above. Do not silently change that design again, remove measures, enable optional anxiety/consequence manipulations, change explanation conditions or alter counterbalancing to make the app faster. These are study changes. Preserve the common presentation and synchronize code, contract, stimuli/protocol and design docs for authorized changes.

Submission (`implementation.txt`): source ZIP, demo video and report covering project summary, technologies, devices, reproducible setup/use, code screenshots with responsibilities, running-app screenshots and group-member interaction photos. Exclude real SQLite responses, secrets and node_modules from shared source artifacts. Keep runnable instructions reproducible from a clean checkout.
