# Build contract (read before writing code)

> v2 changes folded in from CONTRACT-v2.md (kept for history). Where the two differ, the v2 rules below win.

This file is binding for everyone who builds the app. The design docs are in `../docs/`; `../docs/_shared-decisions.md` is the source of truth for the study, `../docs/stimuli.md` for wording, `../docs/data-model.md` for field names.

**Change from the docs: persistence is SQLite on a local server, not `localStorage`.** The app is a React 18 + TS + Vite client plus an Express 5 + `better-sqlite3` server, both in `app/`. One host runs `npm start` (one process: API + built client). Participants open the site themselves (lab laptop or their own desktop/phone) and self-start with a participation code; each person takes part once. The researcher uses `/admin` only for data, KPIs and exports. Target session length: 15–20 minutes. The client never receives correctness fields: posts with ground truth live only on the server.

## Layout and ownership
Each path has exactly one owner. Don't edit files you don't own; if you need a change in someone else's file, write what you need in your final report.

| # | Owner (agent) | Files |
|---|---|---|
| 1 | data | `shared/data/posts.json`, `shared/data/surveyItems.json`, `shared/data/data.test.ts` |
| 2 | engine | `shared/labelEngine.ts`, `shared/labelEngine.test.ts` |
| 3 | counterbalance | `shared/counterbalance.ts`, `shared/rng.ts`, `shared/counterbalance.test.ts`, `shared/rng.test.ts` |
| 4 | db | `server/db/db.ts`, `server/db/repo.ts`, `server/db/repo.test.ts` (schema.sql is fixed; ask before changing) |
| 5 | api | `server/app.ts`, `server/index.ts`, `server/routes/sessions.ts`, `server/routes/participant.ts`, `server/routes/sessions.test.ts` |
| 6 | admin-api | `server/routes/admin.ts`, `server/routes/admin.test.ts` |
| 7 | export | `server/export/csv.ts`, `server/export/exporters.ts`, `server/export/exporters.test.ts` |
| 8 | client-core | `src/main.tsx`, `src/App.tsx`, `src/api/client.ts`, `src/state/StudyContext.tsx`, `src/state/studyReducer.ts`, `src/state/studyReducer.test.ts` |
| 9 | logger | `src/logging/logger.ts`, `src/logging/useTrialTimer.ts`, `src/logging/logger.test.ts` |
| 10 | components | `src/components/PostCard.tsx`, `LabelPanel.tsx`, `FactSheetPanel.tsx`, `LikertScale.tsx`, `SliderScale.tsx`, `PostRatingStrip.tsx`, `src/components/components.test.tsx` |
| 11 | conditions | `src/conditions/NoExplanationView.tsx`, `StaticExplanationView.tsx`, `InteractiveExplanationView.tsx`, `CounterfactualView.tsx`, `conditionRegistry.ts`, `src/conditions/conditions.test.tsx` |
| 12 | trial | `src/study/TrialScreen.tsx`, `src/study/TrialScreen.test.tsx` |
| 13 | flow-screens | `src/study/ConsentScreen.tsx`, `InstructionsScreen.tsx`, `ExitSurveyScreen.tsx`, `DebriefScreen.tsx`, `src/study/flowScreens.test.tsx` |
| 14 | survey + admin UI | `src/study/BlockSurveyScreen.tsx`, `src/admin/AdminScreen.tsx`, `src/study/BlockSurveyScreen.test.tsx`, `src/admin/AdminScreen.test.tsx` |
| 15 | styles + docs | `src/styles/global.css`, `README.md` (app run guide), and docs updates in `../docs/` + `../CLAUDE.md` for the SQLite change |

**v2 round ownership** (overrides the table above for these files): server-flow = `server/db/schema.sql`, `db.ts`, `repo.ts`, `server/routes/sessions.ts`, `participant.ts`, `server/app.ts`, `server/index.ts`, `shared/api.ts`; kpi-api = `server/kpi.ts`, `server/routes/admin.ts` (+ tests); admin-ui = `src/admin/AdminScreen.tsx`, `src/admin/KpiCharts.tsx`; client-core + welcome = `src/App.tsx`, `src/state/*`, `src/api/client.ts`, `src/study/WelcomeScreen.tsx`; trial-fast = `TrialScreen.tsx`, `PostRatingStrip.tsx`, `ProgressBar.tsx`; survey-fast = `BlockSurveyScreen.tsx`, `LikertScale.tsx`, `LikertMatrix.tsx`, `SliderScale.tsx`; flow-screens = Consent/Instructions/Exit/Debrief screens; style = `global.css`, `FactSheetPanel.tsx`; protocol = `../docs/study-protocol.md`; docs = this file, `README.md`, `../docs/*` (except study-protocol), `../CLAUDE.md`. `schema.sql` and `shared/api.ts` are no longer frozen: the server-flow agent owns them.

Already written (don't edit): `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.setup.ts`, `index.html`, `shared/types.ts`, `shared/api.ts`, `server/db/schema.sql`, this file.

Commands: `npm run dev` (server on 3001 + Vite on 5173 with `/api` proxy), `npm test` (Vitest), `npm run typecheck`, `npm run build`, `npm start`. Component tests start with `// @vitest-environment jsdom`. Imports between modules are relative, without file extensions (`../../shared/types`). Server code runs under `tsx`.

## Module signatures (implement exactly; import by these names)

### shared (used by server; client may import `rng`, `counterbalance`, types, `surveyItems.json` — NEVER `posts.json` or `labelEngine`'s truth functions)
```ts
// shared/rng.ts
export function mulberry32(seed: number): () => number;          // [0,1)
// shared/counterbalance.ts
export const WILLIAMS: readonly ["ABDC","BCAD","CDBA","DACB"];
export function assign(pid: number, setPosts: Record<SetId, string[]>, wrongIds: Set<string>): Assignment;
//   order = WILLIAMS[(pid-1)%4]; rotation = floor((pid-1)/4)%4; set for condition index c = S[(c+rotation)%4] (A=0..D=3)
//   seed = pid; one mulberry32 stream, Fisher–Yates per block in block order, reshuffle (same stream) while both wrong ids sit in positions 1–2. Throws on pid < 1 or non-integer.
// shared/labelEngine.ts
export function loadPostBank(raw: unknown): PostBank;             // validates shape + every post via validatePost; throws with a clear message
export function validatePost(p: Post): string[];                  // [] when valid. Checks: groundTruth === (keyFact.claimValue === keyFact.recordValue ? "TRUE" : "FALSE"); isAiCorrect === ((aiLabel==="accurate") === (groundTruth==="TRUE")); errorType/difficulty consistent; factors keys in order source, claimVsRecord, wording; claimVsRecord.passes === (groundTruth==="TRUE"); B 8–14 words, D 10–16 words
export function buildPresentation(p: Post, condition: Condition): Presentation; // allow-list copy, condition-specific fields only
export function buildPracticePresentation(p: PracticePost): PracticePresentation;
export function postBankHash(bank: PostBank): string;             // sha-256 hex of JSON.stringify(bank) (node:crypto, server only)
```

### server
```ts
// server/db/db.ts
export function openDb(path: string): Database.Database;          // ':memory:' allowed; runs schema.sql; WAL mode for files; foreign_keys ON
//   v2 migration: ALTER TABLE sessions ADD COLUMN participant_hash TEXT / last_activity_at TEXT when missing, then
//   CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_participant_hash ON sessions(participant_hash) WHERE participant_hash IS NOT NULL
// server/db/repo.ts — all functions take the db first; snake_case <-> camelCase mapping lives here only
export function createSession(db, a: Assignment, opts: { consequenceBanner: boolean; anxiety: boolean; postBankHash: string; appVersion: string }): SessionView;
export function getSession(db, sessionId: string): SessionView | null;
export function listSessions(db): AdminSessionRow[];
export function findInProgressByPid(db, pid: number): SessionView | null;
export function recordConsent(db, sessionId: string, at: string): void;
export function updateCursor(db, sessionId: string, c: Cursor): void;
export function incrementResume(db, sessionId: string): void;
export function insertTrial(db, sessionId: string, t: Trial): void;   // throws ConflictError if (session, block, position) exists
export function getTrials(db, sessionId: string): Trial[];
export function insertEvents(db, sessionId: string, evs: EventSubmission[]): number; // INSERT OR IGNORE on (session_id, seq); returns inserted count
export function insertBlockSurvey(db, sessionId: string, s: BlockSurvey): void; // throws ConflictError on duplicate
export function insertExitSurvey(db, sessionId: string, s: ExitSurvey): void;
export function setStatus(db, sessionId: string, status: SessionStatus, at?: string): void;
export function deleteSession(db, sessionId: string): void;          // withdrawal: cascades
export class ConflictError extends Error {}
// export rows for exporters:
export function allTrialRows(db): Record<string, unknown>[]; allSurveyRows(db); allEventRows(db); allExitRows(db); allSessionsFull(db): unknown[];
// server/export/csv.ts
export function toCsv(rows: Record<string, unknown>[], columns: string[]): string; // RFC 4180 quoting, booleans TRUE/FALSE, null -> empty, arrays pipe-joined
// server/export/exporters.ts
export function trialsCsv(db): string; surveysCsv(db): string; eventsCsv(db): string; exitCsv(db): string; sessionsJson(db): string;
export function participantsCsv(db): string; kpisCsv(db, now?: Date): string; exportIndex(db): ExportIndexEntry[]; // participant_hash is never selected
// server/app.ts
export function createApp(deps: { db: Database.Database; bank: PostBank; appVersion: string; adminToken?: string; staticDir?: string }): express.Express;
// server/kpi.ts (v2): computeKpis(db): Kpis — pure SQL + TS, unit-tested; completed sessions only for condition/error KPIs; pids >= 900 excluded
// server/index.ts: reads PORT (3001), HOST (127.0.0.1), DB_PATH (data/study.db), ADMIN_TOKEN (optional), PARTICIPANT_SALT (optional; else 32 random bytes kept in meta.participant_salt), STALE_MINUTES (120); loads shared/data/posts.json via loadPostBank; serves dist/ when NODE_ENV=production; SPA fallback to index.html for non-/api routes.
```

### client
```ts
// src/api/client.ts — thin fetch wrapper; throws ApiClientError(status, body) on non-2xx
export const api: {
  createSession(req: CreateSessionRequest): Promise<SessionView>;   // v2: { participantCode, consequenceBanner? }
  getSession(id: string): Promise<SessionView>;
  resumeSession(id: string): Promise<SessionView>;
  consent(id: string): Promise<SessionView>;
  getPractice(): Promise<PracticePresentation>;
  getPresentation(id: string, blockIndex: number, position: number): Promise<Presentation>;
  submitTrial(id: string, t: TrialSubmission): Promise<TrialSaved>;
  submitEvents(id: string, evs: EventSubmission[]): Promise<{ inserted: number }>;
  setCursor(id: string, c: Cursor): Promise<void>;
  submitBlockSurvey(id: string, s: BlockSurveySubmission): Promise<{ nWrongDetected: number; cursor: Cursor }>;
  submitExitSurvey(id: string, s: ExitSurveySubmission): Promise<SessionView>;
  admin: { listSessions(): Promise<AdminSessionRow[]>; getKpis(): Promise<Kpis>; getAssignmentPreview(pid: number): Promise<Assignment>; abandon(id: string): Promise<void>; remove(id: string): Promise<void>; getExportIndex(): Promise<ExportIndexEntry[]>; exportUrl(name: ExportName): string }; // ExportName = one of EXPORT_NAMES (the 7 files)
};
// src/state/StudyContext.tsx
export function StudyProvider(props: { children: React.ReactNode }): JSX.Element;
export function useStudy(): { state: StudyState; dispatch: React.Dispatch<StudyAction>; session: SessionView | null; startSession(participantCode: string, opts?): Promise<"started" | "resumed">; /* throws AlreadyParticipatedError on 409 */ resume(): Promise<boolean>; advance(c: Cursor): Promise<void> };
// Browser keeps only: localStorage "xai-study:activeSessionId", and only while a session is in progress. There is NO "xai-study:participated" flag; once-only is enforced only by the server (409 already_participated).
// After submitExitSurvey succeeds: flush the logger, then remove every "xai-study:" key from localStorage and sessionStorage except "xai-study:adminToken", keeping pid + debrief data in memory only; then navigate to /debrief. Nothing is stored in the browser after completion.
// src/logging/logger.ts — one logger per session; buffers events and flushes via api.submitEvents (on trial submit, on block survey, every 5 s, on pagehide via navigator.sendBeacon to POST /api/sessions/:id/events)
export function createLogger(sessionId: string, startSeq?: number): Logger;
export interface Logger { log(e: Omit<EventSubmission,"seq"|"perfNow"|"wallClock">): void; flush(): Promise<void>; nextSeq(): number }
// src/logging/useTrialTimer.ts — React hook; performance.now() timing; visibilitychange → hiddenMs/hiddenCount; window blur → blurCount; fact-sheet open time accumulation; first "Why?" time
export function useTrialTimer(): { markShown(): void; shownAtIso: string | null; onFactSheet(open: boolean): void; onWhy(open: boolean): void; onFactorExpand(key: FactorKey): void; snapshot(): TimerSnapshot; reset(): void };
export interface TimerSnapshot { labelShownAt: string; respondedAt: string; decisionTimeRawMs: number; hiddenMs: number; hiddenCount: number; blurCount: number; factSheetOpened: boolean; factSheetOpenMs: number; explanationOpened: boolean; factorsExpanded: FactorKey[]; timeToFirstExpandMs: number | null }
// src/conditions/conditionRegistry.ts
export interface ExplanationProps { presentation: Presentation; onWhy?(open: boolean): void; onFactorToggle?(key: FactorKey, expanded: boolean): void }
export const conditionRegistry: Record<Condition, React.ComponentType<ExplanationProps>>;
// src/components — props
PostCard({ author, text, postedAgo, likes, reposts })
LabelPanel({ label: Label; checking: boolean })                 // checking=true shows "AI is checking…"
FactSheetPanel({ factSheet: FactSheet; open: boolean; onToggle(open: boolean): void })
LikertScale({ name, label, min=1, max=7, minLabel, maxLabel, value: number|null, onChange(v) })
SliderScale({ name, label, min=0, max=100, step=5, start=50, minLabel, maxLabel, value, touched, onChange(v), onTouch() })
PostRatingStrip({ item: ScaleItem; onSubmit(confidence: Likert7): void })
```

## HTTP API (JSON; errors `{error, detail?}` with 400 validation / 404 not found / 409 conflict)
| Method & path | Body → response | Rules |
|---|---|---|
| `GET /api/health` | → `{ok:true, postBankHash, appVersion}` | |
| `POST /api/sessions` | `{ participantCode, consequenceBanner? }` → 201 `SessionView` (new) · 200 `SessionView` (this code has an `in_progress` session: resumed, resume_count +1) · 409 `{error:"already_participated"}` (code has a `completed` or `abandoned` session) · 400 invalid code | public, self-start. Code normalised `trim().toLowerCase()`, 3–120 chars; only `participant_hash = HMAC-SHA256(salt, code)` hex is stored, raw code never stored or logged. In one `BEGIN IMMEDIATE` transaction: mark `in_progress` sessions with `last_activity_at` older than `STALE_MINUTES` abandoned, then pid = lowest integer ≥ 1 with no `in_progress`/`completed` session (abandoned pids are reused; pilot pids 901+ never auto-assigned). The old `{pid}` body is removed. |
| `GET /api/sessions/:id` | → `SessionView` | |
| `POST /api/sessions/:id/resume` | → `SessionView` | increments resume_count, logs nothing itself |
| `POST /api/sessions/:id/consent` | → `SessionView` | sets consent_at, cursor phase → instructions |
| `GET /api/practice` | → `PracticePresentation` | |
| `GET /api/sessions/:id/presentation/:block/:pos` | → `Presentation` | post id from the stored block plan; 404 out of range; never includes correctness |
| `POST /api/sessions/:id/trials` | `TrialSubmission` → 201 `TrialSaved` | 400 if postId ≠ plan, confidence ∉1–7, etc.; 409 duplicate; server derives the rest (see `shared/api.ts`); timingFlag = hiddenCount>0 or decisionTimeMs>120000; cursor → next post (phase trial) or block_survey after position 6 |
| `POST /api/sessions/:id/events` | `{events: EventSubmission[]}` → `{inserted}` | also accepts `text/plain` JSON body (sendBeacon) |
| `PUT /api/sessions/:id/cursor` | `Cursor` → 204 | |
| `POST /api/sessions/:id/block-surveys` | `BlockSurveySubmission` → 201 `{nWrongDetected, cursor}` | requires the block's 6 trials saved; trust 12 items 1–7; reverse items 1–5 (8 − raw); trustMean, fairnessMean computed; frustrationTlx multiple of 5 and touched; nWrongDetected = count of detected_error=1 in the block; cursor → next block position 1 or exit_survey |
| `POST /api/sessions/:id/exit-survey` | `ExitSurveySubmission` → `SessionView` | requires 4 block surveys; status → completed, completed_at, cursor phase done |
| `GET /api/admin/sessions` | → `AdminSessionRow[]` (incl. `lastActivityAt`) | admin |
| `GET /api/admin/kpis` | → `Kpis` (see `shared/api.ts`) | admin; polled every 15 s by `/admin` |
| `GET /api/admin/assignments/:pid` | → `Assignment` | admin; preview any pid (incl. pilot 901+), creates nothing (moved from `/api/assignments/:pid`) |
| `POST /api/admin/sessions/:id/abandon` | → 204 | admin |
| `DELETE /api/admin/sessions/:id` | → 204 | admin (withdrawal: deletes all rows) |
| `GET /api/admin/export` | → `ExportIndexEntry[]` = `{name, description, rows}` for all 7 files, in the order participants.csv, trials.csv, surveys.csv, events.csv, exit.csv, kpis.csv, sessions.json | admin; `Cache-Control: no-store`; `rows` = current row count (sessions for participants.csv and sessions.json, KPI rows for kpis.csv) |
| `GET /api/admin/export/:name` | → file (`participants.csv`, `kpis.csv`, `trials.csv`, `surveys.csv`, `events.csv`, `exit.csv`, `sessions.json`); 404 for any other name | admin; `Content-Disposition: attachment; filename="<YYYY-MM-DD>-xai-study-<name>"`; CSVs start with a UTF-8 BOM |
**Admin access:** if `ADMIN_TOKEN` is set, every admin route requires it (header `x-admin-token` or `?token=`). If it is unset, admin routes answer **only from loopback** (`127.0.0.1`, `::1`, `::ffff:127.0.0.1`) and return 403 otherwise. Admin is read-only data + KPIs plus Abandon/Delete (withdrawal); it cannot start sessions.

**Activity:** every participant write (consent, trial, events, cursor, surveys, exit, resume) sets `sessions.last_activity_at = now`.

## Client routes and flow
`/admin` (researcher: KPIs, sessions, exports; no start form; reached by URL only) · `/` = **LandingScreen** (public page: hero with **Take part** → `/start`, "How it works" in 3 steps, who can take part (anyone 18+ who reads English, once per person), privacy (anonymous, only a scrambled code kept, stop at any time, contact placeholder), FAQ, footer; a "You have a session in progress" banner with **Continue** when an active session id is stored; wording follows the recruitment rules in `../docs/study-protocol.md` §6) · `/start` = **WelcomeScreen** (← Back link to `/`, title, 2-line description, "About 15–20 minutes", participation-code field + one-line privacy note, **Start** (Enter submits) → `POST /api/sessions` → consent; **Continue** if an active session id is stored; "You've already taken part. Thank you!" only when the server answers 409, never from browser state) · `/consent` · `/instructions` (incl. practice post) · `/trial/:block/:pos` · `/survey/:block` · `/exit` · `/debrief`. Trial sequence (v2, one screen, two taps): GET presentation (next one prefetched) → `LabelPanel checking` for 800 ms → label + explanation shown (`markShown`, event `trial_shown`) → Agree/Disagree (event) → inline confidence chips 1–7 "How sure are you?" slide in on the same screen → tapping a chip (after a 1 s Undo window) submits the trial (+flush events) → navigate by returned cursor; no Next button. Keyboard: `A` agree, `D` disagree, `1`–`7` confidence, `F` fact sheet, `W` Why? (C only), `Esc` close panel; listed in a hint line. Top `ProgressBar`: "Post n of 24" + "Part x of 4". Block survey = one screen: 12 trust items as a `LikertMatrix` (chip rows on phones), then fairness ×2, tension, TLX slider; number keys answer the focused row; "x of 16 answered" counter. Exit survey: one screen, chips/radios for ≤ 6 options. Consent and debrief are self-guided (contact email placeholder, no "call the researcher"). The debrief renders from in-memory state (storage is already cleared) and ends with a **Next participant** button that resets in-memory state and returns to `/` (fresh landing page, no Continue banner). Instructions: 3 bullets + inline practice post, no reading lock. Layout works at 360 px and 1280 px; fact sheet is a bottom sheet on narrow screens, side panel on wide; touch targets ≥ 44 px; `prefers-reduced-motion` respected. Buttons: "Agree with label" / "Disagree with label". Fact-sheet button: "Fact sheet ▸". All participant-facing wording comes from `../docs/stimuli.md` (via posts.json / surveyItems.json) — don't invent copy for posts.

## CSV columns (exporters must output these, in this order)
- `trials.csv`: pid, sessionId, trialId, blockIndex, positionInBlock, trialIndex, condition, set, postId, topic, aiLabel, groundTruth, isAiCorrect, errorType, difficulty, agreed, detectedError, confidence, decisionTimeMs, decisionTimeRawMs, hiddenMs, hiddenCount, blurCount, timingFlag, factSheetOpened, factSheetOpenMs, explanationOpened, factorsExpanded, timeToFirstExpandMs, resumed, labelShownAt, respondedAt, conditionOrder, setRotation, status
- `surveys.csv`: pid, sessionId, blockIndex, condition, trust_01…trust_12 (raw), trust_01_s…trust_12_s (scored), trustMean, fairness1, fairness2, fairnessMean, tension, frustrationTlx, frustrationTlxTouched, nWrongDetected, submittedAt
- `events.csv`: pid, sessionId, seq, trialId, blockIndex, condition, postId, type, factorKey, tMs, perfNow, wallClock
- `exit.csv`: pid, sessionId, ageRange, gender, education, socialMediaUse, labelExposure, preferredCondition, comment, submittedAt
- `sessions.json`: array of full sessions (session + blocks + trials + surveys + exit + events)
- `participants.csv` (one row per session, every status; built straight from SQL, never `participant_hash`): pid, sessionId, isPilot (pid ≥ 900), status, conditionOrder, setRotation, startedAt, completedAt, durationMin (completed only, 1 dp), trialsSaved, surveysSaved, agreementRate, wrongDetected, falseAlarmDetected, missDetected, detectionRate, meanConfidence, medianDecisionMs, factSheetOpenRate, then for X = A, B, C, D in turn: agreement_X, detected_X, trust_X, fairness_X, tension_X, frustration_X, then ageRange, gender, education, socialMediaUse, labelExposure, preferredCondition, comment. Rates 0–1 to 3 dp; empty when the denominator is 0.
- `kpis.csv` (`computeKpis` in long form): section, key, metric, value. Sections: `meta` (generatedAt), `summary` (key `all`: started, inProgress, completed, abandoned, completionRate, targetN, targetMinimum, cycle1Completed, cycle2Completed, durationMedianMin, durationP90Min), `condition` (key A–D, one row per `byCondition` field), `errorType` (key falseAlarm / miss: n, detectionRate), `balance` (key = Williams order: completed), `daily` (key = date: completed). Completed non-pilot sessions only, as on the dashboard.
