# Contract addendum v2: self-start, once-only, admin = data + KPIs, fast UI

Read `CONTRACT.md` first; this file **overrides** it where they differ. Product decisions (from the PI, 2026-10-17):
1. **No researcher is needed to start.** Anyone opens the site and starts the study themselves (lab laptop or their own device, desktop or phone).
2. **Each person takes part once.** Enforced on the server with a hashed participation code, plus a browser flag.
3. **Admin is only for data collection and KPIs.** It doesn't start sessions any more.
4. **Interactive, easy, fast.** Fewer clicks and screens. Target session length is 15–20 minutes. The 24-post bank, 4 conditions, counterbalancing and all measures stay unchanged, so the design is still valid; only the interaction gets faster.

## A. Participant self-start and once-only (server)
- **New public endpoint:** `POST /api/sessions` takes `{ participantCode: string; consequenceBanner?: boolean }` and returns one of:
  - `201 SessionView` for a new session;
  - `200 SessionView` if this code already has an `in_progress` session, which resumes it (increment `resume_count`);
  - `409 { error: "already_participated" }` if this code already has a `completed` or `abandoned` session.
  - Invalid code → 400.
  - The old `{pid}` body is **removed**: the server assigns the pid.
- **participantCode:**
  - The participant types a short personal code, such as a university email or student ID. The UI explains it's only used to stop people taking part twice.
  - Normalise it with `trim().toLowerCase()`. 3–120 characters.
  - Store **only** `participant_hash = HMAC-SHA256(salt, normalisedCode)` as hex.
  - The salt comes from env `PARTICIPANT_SALT`. If that's unset, generate 32 random bytes once and keep them in `meta.participant_salt`.
  - Never log or store the raw code.
- **pid allocation** (one `BEGIN IMMEDIATE` transaction):
  1. First mark stale sessions abandoned: any `in_progress` session whose `last_activity_at` is older than `STALE_MINUTES` (env, default 120).
  2. Then `pid` = the lowest integer ≥ 1 that has no session in status `in_progress` or `completed`.
  3. Abandoned pids are reused, which keeps the 16-participant cycle balanced.
  4. Pilot pids 901+ are never auto-assigned. `GET /api/admin/assignments/:pid` previews any pid.
- **Schema change:** `sessions.participant_hash TEXT` (UNIQUE when not null) and `sessions.last_activity_at TEXT`.
  - `db.ts` must migrate existing DBs: if a column is missing, `ALTER TABLE sessions ADD COLUMN`, then `CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_participant_hash ON sessions(participant_hash) WHERE participant_hash IS NOT NULL`.
  - Update `schema.sql` too.
- **Every participant write** (consent, trial, events, cursor, surveys, exit, resume) sets `last_activity_at = now`.
- **Endpoint moves:**
  - `GET /api/assignments/:pid` moves to `GET /api/admin/assignments/:pid` (admin only).
  - `POST /api/admin/sessions/:id/abandon` and `DELETE` stay admin-only. Withdrawal by email still goes to the researcher.
- **Browser:**
  - After `exit_survey` succeeds, set `localStorage["xai-study:participated"] = "1"`.
  - The Welcome screen shows "You've already taken part. Thank you!" when that flag is set. The server check is the real guard; the flag is a convenience.

## B. Admin = data + KPIs (server + UI)
- **Access:** if `ADMIN_TOKEN` is set, require it (header `x-admin-token` or `?token=`). If it's unset, allow admin routes **only from loopback** (`req.socket.remoteAddress` is `127.0.0.1`, `::1` or `::ffff:127.0.0.1`), otherwise 403.
- **New `GET /api/admin/kpis`** returns the `Kpis` type in `shared/api.ts`, computed in `server/kpi.ts` (pure SQL plus TypeScript, unit-tested):
  - session counts by status;
  - completion rate;
  - median and p90 duration in minutes for completed sessions;
  - progress toward N = 32 (minimum 16) and the cycle (completed pids 1–16, 17–32);
  - per condition A–D:
    - trials, agreement rate;
    - wrong-label detection rate, false-alarm detection, miss detection;
    - fact-sheet open rate, mean confidence, median decision time;
    - mean trust, fairness, tension, frustration;
  - per error type: n and detection rate;
  - completed sessions by condition order (balance check);
  - completed per day.
  - Only completed sessions count toward the condition and error KPIs (live, `in_progress` excluded). Pilot pids ≥ 900 are excluded from all KPIs.
- **Admin UI** (`/admin`):
  - KPI cards: completed / target, in progress, completion rate, median time.
  - A per-condition table with small inline SVG bars for detection, miss vs false-alarm, trust and tension. No chart library.
  - A balance grid.
  - A sessions table (pid, status, order, progress x/24, started, last activity) with Abandon and Delete (withdrawal).
  - Export buttons.
  - The token field.
  - Auto-refresh every 15 s.
  - **No "start session" form.**

## C. Fast, interactive participant UI
- **Welcome screen (`/`):**
  - Study title, a 2-line description, "About 15–20 minutes", and a participation-code field with a one-line privacy note.
  - **Start** (Enter submits) → POST /api/sessions → consent.
  - If an active session id is stored: offer **Continue**.
  - If the participated flag is set: show the thank-you message instead.
- **Consent:** short plain text, plus a "Read full consent details" disclosure that contains the full text, a checkbox and Continue. No "call the researcher" wording anywhere (self-guided); point to the contact email placeholder instead.
- **Instructions:** one short screen with 3 bullet points and the practice post inline. Remove the 5 s reading lock.
- **Trial (one screen per post, two taps):**
  - Agree / Disagree. After the choice, a confidence row "How sure are you?" with chips 1–7 appears **on the same screen**. Tapping a chip saves and goes to the next post. There's no separate Next button, but a 1 s "Undo" link appears before submit.
  - Keyboard: `A` agree, `D` disagree, `1`–`7` confidence, `F` fact sheet, `W` "Why?" (C only), `Esc` close panel. Shortcuts are listed in a small hint line.
  - A top progress bar shows "Post n of 24" overall plus "Part x of 4".
  - Prefetch the next presentation.
  - The 800 ms "AI is checking…" stays (design).
- **Block survey:**
  - One compact screen. The 12 trust items are a matrix (rows = items, columns 1–7 as tappable chips; on phones each item becomes a chip row).
  - Then fairness ×2, tension and the TLX slider.
  - Keyboard: number keys answer the focused row and move to the next.
  - A "x of 16 answered" counter. Continue is enabled when complete.
- **Exit survey:** chips/radios instead of selects where there are ≤ 6 options. A single screen.
- **Debrief:** self-guided. No "call the researcher". Show the contact placeholder and pid, plus a "Show the real facts" disclosure.
- **Responsive:**
  - Works at 360 px wide (phones) and 1280 px.
  - On narrow screens the fact sheet is a bottom sheet; on wide screens it's a side panel.
  - Touch targets ≥ 44 px.
  - `prefers-reduced-motion` respected.
  - Small, purposeful transitions: label reveal, confidence row slide-in, progress bar.

## D. New/changed shared types (`shared/api.ts` — owned by server-flow agent; others code against this)
```ts
export interface CreateSessionRequest { participantCode: string; consequenceBanner?: boolean }
export interface Kpis {
  generatedAt: string;
  sessions: { started: number; inProgress: number; completed: number; abandoned: number; completionRate: number | null };
  target: { n: number; minimum: number; completed: number; cycle1Completed: number; cycle2Completed: number };
  durationMin: { median: number | null; p90: number | null };
  byCondition: Array<{ condition: Condition; trials: number; agreementRate: number | null; wrongTrials: number;
    detectionRate: number | null; falseAlarmDetection: number | null; missDetection: number | null;
    factSheetOpenRate: number | null; meanConfidence: number | null; medianDecisionMs: number | null;
    trustMean: number | null; fairnessMean: number | null; tensionMean: number | null; frustrationMean: number | null }>;
  byErrorType: Array<{ errorType: "false_alarm" | "miss"; n: number; detectionRate: number | null }>;
  balance: Array<{ conditionOrder: string; completed: number }>;
  dailyCompleted: Array<{ date: string; n: number }>;
}
// AdminSessionRow gains: lastActivityAt: string | null
```
Client `api` changes (owned by client-core agent): `createSession(req: CreateSessionRequest)`; `admin.getKpis(): Promise<Kpis>`; `admin.getAssignmentPreview(pid)` (moved from top-level `getAssignmentPreview`). `useStudy().startSession(participantCode: string, opts?)` returns `Promise<"started" | "resumed">` and throws `AlreadyParticipatedError` on 409.

## E. Ownership for this round
| # | Agent | Files |
|---|---|---|
| 1 | server-flow | `server/db/schema.sql`, `server/db/db.ts`, `server/db/repo.ts`, `server/routes/sessions.ts`, `server/routes/participant.ts`, `server/app.ts`, `server/index.ts`, `shared/api.ts`, their tests |
| 2 | kpi-api | `server/kpi.ts`, `server/kpi.test.ts`, `server/routes/admin.ts`, `server/routes/admin.test.ts` |
| 3 | admin-ui | `src/admin/AdminScreen.tsx`, `src/admin/KpiCharts.tsx`, `src/admin/AdminScreen.test.tsx` |
| 4 | client-core + welcome | `src/App.tsx`, `src/state/*`, `src/api/client.ts`, `src/study/WelcomeScreen.tsx`, tests |
| 5 | trial-fast | `src/study/TrialScreen.tsx`, `src/components/PostRatingStrip.tsx`, `src/components/ProgressBar.tsx`, `src/study/TrialScreen.test.tsx`, `src/components/components.test.tsx` (only the PostRatingStrip/ProgressBar cases) |
| 6 | survey-fast | `src/study/BlockSurveyScreen.tsx`, `src/components/LikertScale.tsx`, `src/components/LikertMatrix.tsx`, `src/components/SliderScale.tsx`, `src/study/BlockSurveyScreen.test.tsx` |
| 7 | flow-screens | `src/study/ConsentScreen.tsx`, `InstructionsScreen.tsx`, `ExitSurveyScreen.tsx`, `DebriefScreen.tsx`, `src/study/flowScreens.test.tsx` |
| 8 | style | `src/styles/global.css`, `src/components/FactSheetPanel.tsx` (bottom sheet on narrow screens) |
| 9 | protocol | `../docs/study-protocol.md` (rewrite for self-guided, once-only, open participation) |
| 10 | docs | `CONTRACT.md` (fold this addendum in at the end), `README.md`, `../docs/architecture.md`, `../docs/system-design.md`, `../docs/sequence-diagrams.md`, `../docs/data-model.md`, `../docs/wireframes.md`, `../CLAUDE.md` |
