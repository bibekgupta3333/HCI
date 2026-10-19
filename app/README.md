# AI label HCI experiment (graduate study, Florida Polytechnic University)

**Current decision — images rejected (2026-10-19):** `CURRENT_PROTOCOL` returns to `calibrated-full-v1`: new sessions are text-only and display each post’s original likes/reposts. Keep eight posts and `full-v1` (16 ratings per part, 64 total). `calibrated-media-full-v1` remains supported only for historical saved sessions, with their saved media/count profile and questionnaire; do not migrate or relabel them. Remove image captions from the UI, including historical media sessions; retain descriptive alt text for historical images. Do not generate new images or use generic topic photographs by default. Default practice is text-only with original counts; `GET /api/practice?contextMedia=1` is historical compatibility only. Schema 5 and historical assets/prompts remain preserved. Dashboard/KPI defaults return to the text-only full cohort; keep presentation cohorts separate. See [image suitability audit and historical provenance](../docs/media-and-engagement-design.md). No new browser or visual verification is claimed for this reversal.

**Full questionnaire restored (2026-10-19):** new sessions use `calibrated-full-v1` with `questionnaireVersion=full-v1`. After EACH of four parts, collect the original 12 Jian-based trust items, two fairness items, tension and frustration: 16 ratings per part, 64 total. Keep eight posts (two per part), appropriate reliance as primary, the unchanged paper title and the interface-package limitation. Trust is now measured separately for each explanation condition. Preserve previously started `calibrated-brief-v1` sessions and their brief surveys on resume; do not mix or relabel their data. Dashboard/KPI exports default to the restored full cohort. Earlier brief-default descriptions below document the superseded revision and apply only to saved brief sessions. Schema 4 preserves all earlier responses. Pilot the restored questionnaire burden; no completion-time or power guarantee is established.

**Current measurement revision (v0.3.0):** new eight-post sessions collect three ratings after each part—custom perceived trust, tension and frustration—12 block ratings rather than 64. The custom trust item is not a validated Jian short form; fairness/full Jian scores are not collected for new sessions and export as blank/null. Existing sessions retain their full questionnaire via `protocolVersion=legacy-full-v1`; new sessions use `calibrated-brief-v1` and `questionnaireVersion=brief-v1`. Database migrations preserve earlier data. Dashboard and KPI exports default to the current protocol; raw exports include all versions with identifiers. The primary behavioral outcome is accepting correct labels and rejecting wrong ones, not greater trust alone. The unchanged A–D interfaces are compared as packages, because C also exposes factual evidence. Keep the original paper title. See [methods](../docs/methods-and-limitations.md) and [pilot/analysis plan](../docs/pilot-and-analysis-plan.md).

**Current short version (2026-10-18):** new sessions show 2 posts per part (8 total), sampled from the unchanged 24-post bank. Each part has one correct and one wrong label. Existing 24-post sessions resume their original plans. First-two-post interaction help explains each part without revealing answers. New sessions use the brief questionnaire described above; saved legacy sessions retain the full questionnaire. Use `plannedTrials` and `studyVariant` in exports to analyse versions separately; dashboard outcome summaries default to the current protocol. [Study rationale and defense](../docs/parts-and-study-defense.md). Duration requires a fresh pilot. For formal short-study collection, use a separate `DB_PATH=data/short-study.db` so the 32-slot schedule starts at pid 1; preserve the earlier database unchanged.

A Wizard-of-Oz study app for the question *"When the AI label is wrong, do explanations help people catch it, and how do they make people feel?"* New participants read eight made-up social media posts sampled from a 24-post bank in the fictional town of Riverton. Each post carries a scripted AI label ("✓ Likely accurate" or "⚠ Likely misleading"), and the participant clicks **Agree with label** or **Disagree with label**, then rates their confidence. A fact sheet that settles each post's truth can be opened on every trial. 8 of the 24 labels are wrong on purpose.

Every participant sees all four explanation conditions, one per part of two posts:

| Condition | What the participant sees under the label |
|---|---|
| A | Nothing (label only) |
| B | One fixed sentence |
| C | A "Why?" button that opens three rows: Source, Claim vs record, Wording |
| D | One counterfactual sentence ("would be labeled … if …") |

No model runs: every label and explanation comes from `shared/data/posts.json`. Condition order (Williams square), set rotation and post order are derived from the participant number (pid), so any session can be rebuilt from its pid.

The app is a React 18 + TypeScript + Vite client and an Express 5 + SQLite (`better-sqlite3`) server, both in this folder. Responses are written to a single SQLite file on the host that runs the server. The correctness data (ground truth, which labels are wrong) stays on the server and is never sent to the browser. The browser keeps only the id of the active session while it runs; once the exit survey is saved, it clears all study data, so nothing is left in the browser after a participant finishes.

**Self-guided, once per person.** No researcher is needed to start a session. A participant opens the site on a lab laptop or their own desktop or phone, reads the short landing page at `/`, taps **Take part**, types a short participation code at `/start` and goes. Each participation code permits one session; codes do not verify identity. The researcher uses `/admin` only to watch KPIs and export data. Completion time will be measured in the pilot.

The build contract (ownership, module signatures, HTTP API, CSV columns) is in [CONTRACT.md](CONTRACT.md). The design docs are in [../docs](../docs/README.md).

## Requirements

- **Node.js 22 or newer** (includes npm). Check with `node --version`.
- A current browser: Chrome, Firefox, Edge or Safari, on desktop (1280 px) or phone (from 360 px wide).
- `better-sqlite3` ships prebuilt binaries for current Node versions on macOS, Windows and Linux. If `npm install` has to compile it, you also need a C++ toolchain (Xcode Command Line Tools on macOS, "Desktop development with C++" on Windows).

## Setup

From a clean checkout:

```bash
cd app
npm install
```

## Run in development

```bash
npm run dev
```

This starts two processes:

- the API server on **http://localhost:3001** (restarts on changes to `server/` and `shared/`), and
- the Vite client on **http://localhost:5173**, which proxies `/api` to the server.

Open **http://localhost:5173/** (the landing page) to take the study as a participant, and **http://localhost:5173/admin** for the dashboard.

## Run the tests

```bash
npm test                                   # all Vitest suites (client, shared, server)
npx vitest run shared/counterbalance.test.ts   # one test file
npm run typecheck                          # TypeScript only
```

## Participant quick start

1. Open the study site (the URL or QR code the team shares, or `http://localhost:3001/` on the lab laptop). The landing page explains the study: how it works, who can take part, privacy and a short FAQ.
2. Tap **Take part**. On the code screen (`/start`; **← Back** returns to the landing page), type your participation code (for example your university email or student ID) and press **Start** or Enter. The code is only used to stop people taking part twice; it is never stored as typed.
3. Read the short consent, then follow the screens: instructions with a practice post, 4 parts of 6 posts, a short questionnaire after each part, the exit survey and the debrief.
4. On each post: **Agree** (`A`) or **Disagree** (`D`), then tap how sure you are (`1`–`7`). `F` opens the fact sheet, `W` opens "Why?" where shown, `Esc` closes a panel.

To stop early, select **Exit study** on any active participant screen, then **Yes, exit study**. Saved answers remain stored, the session is marked abandoned, browser study storage is cleared, and a debrief explains the experiment. **Keep participating** returns to the current screen. After confirmed exit, the same code cannot start again.

If the tab closes, open the site again in the same browser and click **Continue** in the "session in progress" banner on the landing page, or type the same code at `/start` on any device to resume.

## Researcher: the dashboard at `/admin`

`/admin` is for data and KPIs only; it cannot start sessions. It refreshes every 15 s and shows:

- KPI cards: completed / target (N = 32, minimum 16), in progress, completion rate, median time;
- a per-condition table (A–D) with small bars for detection rate, miss vs false-alarm detection, trust and tension;
- a balance grid (completed sessions per condition order, cycle 1 = pids 1–16, cycle 2 = pids 17–32);
- the sessions table (pid, status, order, progress x/24, started, last activity) with **Mark abandoned** and **Delete (withdrawal)**;
- the export panel (each file with a one-line description, its current row count and a download link, plus **Download all CSVs**) and the admin-token field.

KPIs count completed sessions only and exclude pilot pids 900 and above.

## How once-only works, and its limits

- The participant's code is normalised (`trim().toLowerCase()`, 3–120 characters) and only `HMAC-SHA256(PARTICIPANT_SALT, code)` is stored in `sessions.participant_hash`. The raw code is never stored or logged.
- `POST /api/sessions` returns **201** for a new code, **200** (resume) if that code has a session in progress, and **409 already_participated** if that code has a completed or abandoned session.
- There is no browser "participated" flag; the server check is the only guard. Once the exit survey is saved and the last events are flushed, the app removes every `xai-study:` key from `localStorage` and `sessionStorage` (except the researcher's `xai-study:adminToken`) and shows the debrief.
- **Shared lab devices:** no private window or manual clearing is needed. When a participant finishes, tap **Next participant** on the debrief (or reload) to get a fresh landing page for the next person.
- The server assigns the pid: the lowest number ≥ 1 with no in-progress or completed session. Sessions with no activity for `STALE_MINUTES` are marked abandoned first, and abandoned pids are reused, so the 16-participant counterbalancing cycle stays balanced.
- **Limits:** someone who types a different code can take part again; codes are not checked against a roster. Someone who finishes and returns on the same device sees a fresh landing page and is stopped only if they type the same code again. Changing `PARTICIPANT_SALT` mid-study breaks the duplicate check for earlier codes, so set it once and keep it.

## Run for data collection

```bash
npm run build
npm start
```

`npm run build` type-checks and writes the client to `dist/`. `npm start` runs one process that serves both the API and `dist/` on **http://localhost:3001**. Participants open `/` (landing page, then `/start`); the researcher opens `/admin`.

Use the same build for every session in a data-collection run, so the stimuli never change between participants.

`npm start` sets `NODE_ENV=production` with POSIX shell syntax. On Windows, run it from Git Bash or WSL, or use `set NODE_ENV=production&& npx tsx server/index.ts` in `cmd`.

### Deployment notes (participants on their own devices)

- Run the server on a host participants can reach and set `HOST=0.0.0.0` (the default `127.0.0.1` only accepts the same machine).
- Put an HTTPS reverse proxy (for example Caddy or nginx) in front of port 3001, so codes and responses travel encrypted, and share the `https://` URL.
- Admin routes answer from loopback without a token. Behind a proxy or from any other machine, every admin request looks non-loopback, so **set `ADMIN_TOKEN`** and enter it in the token box on `/admin`; without it the dashboard returns 403.
- Set `PARTICIPANT_SALT` to a long random value and keep it for the whole study.

## Environment variables

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `3001` | Port of the Express server |
| `HOST` | `127.0.0.1` | Interface the server binds to. The default keeps study data off the lab network; use `0.0.0.0` only if another machine must connect |
| `DB_PATH` | `data/study.db` (that is, `app/data/study.db`) | SQLite file. Relative paths are resolved from `app/`. The folder is created if missing. `:memory:` gives a throwaway database |
| `ADMIN_TOKEN` | not set | When set, every `/api/admin/*` route requires this token (header `x-admin-token` or `?token=`). Enter it once in the "Admin token" box on `/admin`. When unset, admin routes work only from loopback (403 otherwise) |
| `PARTICIPANT_SALT` | not set | Secret for hashing participation codes. If unset, 32 random bytes are generated once and kept in the database (`meta.participant_salt`) |
| `STALE_MINUTES` | `120` | An in-progress session idle longer than this is marked abandoned when the next participant starts, and its pid is reused |

Example:

```bash
HOST=0.0.0.0 ADMIN_TOKEN=lab-secret PARTICIPANT_SALT="$(openssl rand -hex 32)" npm start
```

## Where the data lives

All study data is in one SQLite file, `app/data/study.db` by default (git-ignored). The server opens it in WAL mode, so while it runs you will also see `study.db-wal` and `study.db-shm` next to it. Tables: `sessions`, `blocks`, `trials`, `events`, `block_surveys`, `exit_surveys` and `meta`; the schema is in [server/db/schema.sql](server/db/schema.sql). Each trial and survey is saved in its own transaction the moment it is submitted, so a crash or a closed tab loses at most the trial in progress, and the participant resumes where they left off.

### Back up the database

Either:

1. **Stop the server** (Ctrl+C; it closes the database cleanly), then copy `data/study.db` somewhere safe, for example `cp data/study.db ~/backups/study-$(date +%Y%m%d-%H%M).db`. Don't copy the file while the server is running: recent writes may still be in `study.db-wal`.
2. **Or use the export buttons** on `/admin` while the server runs (below). `sessions.json` holds everything needed to rebuild every session.

Back up after every session day. Do not delete `study.db` until the exports are saved in at least two places.

### Export CSV and JSON

On `/admin`, in the **Export** section, click a file to download it, or **Download all CSVs** to get the six CSVs in one go (tick "Include raw JSON" to add `sessions.json`). Each row shows a one-line description and the current row count, from `GET /api/admin/export`. **Start with `participants.csv`**: it has one analysis-ready row per participant; the other files are the detail behind it.

| File | Contents |
|---|---|
| `participants.csv` | One row per session (every status; `isPilot` marks pids ≥ 900): totals, detection by error type, per-condition agreement, detection, trust, fairness, tension and frustration (`_A`…`_D`), and the exit answers. Never the participant hash |
| `kpis.csv` | The dashboard KPIs in long form (`section, key, metric, value`); completed non-pilot sessions only |
| `trials.csv` | One row per trial (24 per completed session), with the truth fields, decision, confidence and timing |
| `surveys.csv` | One row per block survey: 12 trust items (raw and scored), fairness, tension, NASA-TLX frustration |
| `events.csv` | Every interaction event (fact sheet, "Why?", row expands, decisions, visibility changes) |
| `exit.csv` | One row per completed exit survey |
| `sessions.json` | Full nested sessions: session, blocks, trials, surveys, exit survey, events |

The column order is fixed in [CONTRACT.md](CONTRACT.md#csv-columns-exporters-must-output-these-in-this-order). The same files can be fetched directly from `http://localhost:3001/api/admin/export/<file>`, and `http://localhost:3001/api/admin/export` lists all seven with descriptions and row counts (add `?token=...` when `ADMIN_TOKEN` is set). Downloads are named `<YYYY-MM-DD>-xai-study-<file>`.

## Running a data-collection day (researcher steps)

1. Start the server (`npm start`, with `ADMIN_TOKEN` and `PARTICIPANT_SALT` set if participants use their own devices) and share the study URL.
2. Open `/admin` and check that the KPI cards load. Pilot runs should use a separate `DB_PATH`.
3. Participants self-start; you don't need to be present. Watch **in progress**, **completed / target** and the balance grid.
4. Check `timingFlag` and the hidden/blur counts in `trials.csv` afterwards: an unmoderated session has no one watching, so these are the attention signals.
5. Export the files (**Download all CSVs** plus `sessions.json`) and back them up at the end of each day. Analyse from `participants.csv` first.

If a session stalls, it is marked abandoned automatically after `STALE_MINUTES`, or you can click **Mark abandoned**. If someone withdraws (by email to the contact address), use **Delete (withdrawal)**, which removes every row for that session. Note that an abandoned code cannot start again (409).

## Project structure

```text
app/
├── CONTRACT.md            build contract: ownership, signatures, HTTP API, CSV columns (v2 folded in)
├── CONTRACT-v2.md         v2 addendum (kept for history)
├── index.html             Vite entry page
├── package.json           scripts: dev, test, typecheck, build, start
├── vite.config.ts         Vite (port 5173, /api proxy) and Vitest config
├── data/                  SQLite database files (git-ignored)
├── shared/                code used by the server (and, for non-secret parts, the client)
│   ├── types.ts, api.ts   domain types and the client/server API types
│   ├── data/              posts.json (24 posts + practice, with ground truth), surveyItems.json
│   ├── labelEngine.ts     Wizard-of-Oz labeller: validatePost, buildPresentation (allow-listed payload)
│   ├── counterbalance.ts  Williams 4×4 order, set rotation, seeded post order
│   └── rng.ts             mulberry32 PRNG
├── server/
│   ├── index.ts           entry: reads PORT, HOST, DB_PATH, ADMIN_TOKEN, PARTICIPANT_SALT, STALE_MINUTES; serves dist/
│   ├── app.ts             Express app factory (admin access: token or loopback)
│   ├── kpi.ts             KPI computation for /api/admin/kpis
│   ├── routes/            participant, session and admin routes
│   ├── db/                schema.sql, openDb, repository functions
│   └── export/            CSV writer, the seven exporters and the export index
└── src/                   React client
    ├── main.tsx, App.tsx  mount and routes (/admin, / = landing, /start = participation code, /consent, /instructions, /trial/:block/:pos, /survey/:block, /exit, /debrief)
    ├── api/client.ts      fetch wrapper for the HTTP API
    ├── state/             StudyContext + reducer (active session id in localStorage only; cleared after the exit survey)
    ├── logging/           event logger and trial timer (performance.now())
    ├── components/        PostCard, LabelPanel, FactSheetPanel, LikertScale, SliderScale, PostRatingStrip (confidence chips), ProgressBar, LikertMatrix
    ├── conditions/        views A–D and conditionRegistry
    ├── study/             landing, welcome (code entry), consent, instructions + practice, trial, block survey, exit survey, debrief
    ├── admin/             AdminScreen, KpiCharts (inline SVG bars), ExportPanel
    └── styles/global.css  the only stylesheet
```

## More

- [CONTRACT.md](CONTRACT.md): the binding build contract.
- [../docs/README.md](../docs/README.md): design docs (architecture, data model, wireframes, stimuli, study protocol).
