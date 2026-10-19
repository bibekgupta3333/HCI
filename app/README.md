# Do People Trust AI More When It Explains Itself? A Comparative Study of Explanation

CEN5728 Advanced HCI — Group 4, graduate study at Florida Polytechnic University.

**Members:** Afzal Hossain Sohag, Bibek Gupta, Deepthi Reddy Chelladi, Md Shamimul Islam, Mohamed Sylla and Siwani Sah.

**For the friend preparing the report:** use [REPORT-HANDOFF.md](REPORT-HANDOFF.md). It contains report-ready project information, setup and interaction instructions, source-code capture responsibilities and the required application/member evidence checklist.

## Submission requirements

The [course instructions](../implementation.txt) require three separate deliverables:

| Deliverable | Required contents |
|---|---|
| Source code: one ZIP | Application source, package lockfile, required assets and documentation; no dependencies, secrets or participant databases |
| Video running the application | Startup, participant interaction, A–D explanation interfaces, questionnaires, completion and admin CSV download |
| Report | Project description, technologies, intended devices, setup steps, interaction steps, annotated source screenshots, running-app screenshots and genuine photographs of group members interacting |

This README documents the implementation. The [report handoff](REPORT-HANDOFF.md) organizes the written report and evidence to collect. Documentation does not itself supply a finished ZIP, recorded video or photographs. Capture current screens before submission; old images under `../docs/artifacts/media-v1/` show a superseded interface.

## Project overview and current design

The application studies whether explanation interfaces help people accept correct AI labels and reject incorrect ones, alongside trust, fairness, tension and frustration. Participants judge fictional social-media claims from Riverton and Alder County. Labels and explanations are scripted **Wizard-of-Oz** stimuli; no live AI model, external fact-checker or social feed runs.

New sessions use `calibrated-full-v1`: **8 text-only posts, 4 parts of 2 posts**, sampled from a 24-post bank. Each part has one correct and one wrong label. Participants agree/disagree and select confidence from 1–7. Optional fact sheets provide checking evidence. After every part, the full questionnaire collects 12 Jian-based trust items, 2 fairness items, tension and frustration: **16 ratings per part, 64 total**, in addition to trial confidence and final questions.

| Condition | Interface beneath the AI label |
|---|---|
| A | Label only |
| B | One static reason |
| C | Why? opens Source, Claim vs record and Wording details |
| D | A counterfactual sentence describing what would change the label |

Part order varies: Part 1 is not necessarily A. These are interface packages: C supplies factual comparison as well as interaction, so a difference cannot be attributed solely to interactivity. The short study is exploratory; 32 is a balancing/feasibility target, not established statistical power or a guarantee of publication.

Generic post images are disabled for new sessions. Saved older sessions retain their protocol, questionnaire and post plan, including historical media support without captions. Keep cohorts separate in analysis. See [methods](../docs/methods-and-limitations.md), [protocol](../docs/study-protocol.md) and [image audit](../docs/media-and-engagement-design.md).

## Technologies and devices

| Layer | Technologies and purpose |
|---|---|
| Platform/language | Node.js 22+, TypeScript, HTML and CSS |
| Frontend | React 18, React Router 6 and Vite: screens, navigation and builds |
| Backend | Express 5 and tsx: HTTP API, validation and session transitions |
| Persistence | SQLite via better-sqlite3: sessions, trials, surveys and events |
| Study logic | Scripted JSON bank, Williams orders and seeded randomization |
| Verification | Vitest, Testing Library, jsdom and Supertest |
| Analysis | Admin dashboard and CSV/JSON exports |

Participants use a web browser on a desktop/laptop or responsive phone/tablet; no native app is required. Desktop/laptop is recommended for the full questionnaire and demonstration. Layout targets include 360 px phones and 1280 px desktops; this is not a claim that every browser/device has been tested. The Node/SQLite server runs on a computer or deployment host, not in the participant's phone.

## Step-by-step: run from source

1. Extract the source ZIP and open a terminal in its `app/` directory.
2. Install Node.js; Node 22 LTS is recommended. Check `node --version` and `npm --version`.
3. Run `npm ci --include=dev` using the included lockfile. Registry access is needed. If better-sqlite3 requires compilation, install Python and the platform C++ toolchain.
4. Run `npm run dev` and keep the terminal open. This starts Express on port 3001 and Vite on port 5173.
5. Open **http://localhost:5173/** for participants and **http://localhost:5173/admin** for admin. Vite proxies `/api` to port 3001. If Vite selects another port, use the URL it prints.
6. Follow the interaction steps below. The server creates the SQLite schema automatically; no database service or manual SQL import is needed.
7. Stop development with Ctrl+C. For a single production server, run `npm run build`, then `npm start`; open **http://localhost:3001/** and `/admin`.

```bash
cd app
npm ci --include=dev
npm run dev
```

Production on macOS/Linux:

```bash
npm run build
npm start
```

`npm start` uses POSIX environment syntax. On Windows, use Git Bash/WSL, or after building run this in `cmd`:

```bat
set NODE_ENV=production&& npx tsx server/index.ts
```

Use a separate database for rehearsals. On macOS/Linux: `DB_PATH=data/submission-demo.db npm start`. On Windows `cmd`, set `DB_PATH=data/submission-demo.db` before the production command. Never delete the study database to restart a demo.

Verification commands, from `app/`:

```bash
npm test
npm run typecheck
npm run build
```

HTTP tests need permission to open local loopback ports. No lint script is defined.

## How to interact: participant

1. Open the landing page, read the study summary and select **Take part**.
2. Enter a non-identifying participation code and select **Start**. No admin/researcher permission is required. One completed or abandoned session is allowed per code; codes do not verify identity.
3. Read consent, confirm adult eligibility and proceed to instructions and one unscored practice post.
4. For each study post, optionally open **Fact sheet**. In C, use **Why?** and its expandable rows if desired.
5. Choose **Agree with label** or **Disagree with label**, then confidence 1–7. A brief Undo opportunity appears before saving; the flow advances automatically.
6. After each two-post part, answer all 16 questionnaire ratings. Move the frustration slider deliberately; its initial position is not an answer.
7. Complete all four parts, the final survey and debrief. The preference question names the actual explanation style for each assigned part.
8. Select **Next participant** to return to a fresh landing page. Successful completion clears participant study browser-storage keys while preserving the admin token and unrelated storage.

Keyboard: A agree, D disagree, 1–7 confidence, F fact sheet, W Why when available, Escape closes panels. Use **Exit study** on an active participant screen to confirm early cancellation. Saved responses remain, the session becomes abandoned and an early debrief appears. Cancellation does not submit unfinished answers.

To resume an unfinished session, use **Continue** on the same browser or enter the same code on another device. The saved server cursor is authoritative. Stale sessions can be abandoned during a subsequent session-creation request after the inactivity threshold; indefinite resume is not guaranteed.

## How to interact: admin and exports

Open `/admin` on the same frontend origin. Admin monitors data, KPIs and exports; it does not start participants. Enter the configured admin token if required. The page refreshes about every 15 seconds.

1. Inspect status/progress and the selected protocol cohort. Outcome summaries default to current full-questionnaire sessions and use completed non-pilot sessions; status counts also describe unfinished/abandoned sessions.
2. Inspect appropriate reliance, wrong-label rejection, correct-label acceptance, trust and affect. Higher agreement alone is not success.
3. In **Export**, download an individual file or **Download all CSVs**. Optionally include raw JSON. Open a downloaded demonstration CSV to verify it is usable.
4. Use abandon/delete controls only for intentional session management: abandon preserves saved data; withdrawal deletion removes the session and linked rows.

| Export | Contents |
|---|---|
| `participants.csv` | One row per session, all statuses, summaries and exit answers |
| `trials.csv` | Saved trial decisions, truth/scoring, confidence, timing and interactions |
| `surveys.csv` | Versioned questionnaire answers and scores; historical brief rows leave uncollected full fields blank |
| `events.csv` | Interaction events and timestamps |
| `exit.csv` | Final survey answers |
| `kpis.csv` | Dashboard metrics; outcome and status denominators differ |
| `sessions.json` | Nested analysis data, excluding participation-code hash and salt |

New completed sessions contain eight trials; older plans can contain 24. Raw exports include unfinished/abandoned sessions and multiple protocols. Filter appropriately before analysis. The frustration measure is one NASA-TLX item, not the full weighted instrument. See [CONTRACT.md](CONTRACT.md) for API/export details.

## Configuration, data and deployment

| Variable | Default / purpose |
|---|---|
| `PORT` | 3001, Express port |
| `HOST` | 127.0.0.1, local binding; use 0.0.0.0 only for deliberate network access |
| `DB_PATH` | `data/study.db`, relative to `app/` |
| `ADMIN_TOKEN` | Optional for local loopback use; configure for every shared/proxy deployment |
| `PARTICIPANT_SALT` | Stable HMAC secret; generated once in database metadata if unset |
| `STALE_MINUTES` | 120; stale sweeping occurs during session creation |

The app does not automatically load `.env` files. Set variables in the shell/host environment. Vite's proxy targets port 3001; changing backend `PORT` also requires updating the proxy. Remote participants need a reachable HTTPS URL; `localhost` on a phone refers to that phone. A local proxy can appear as loopback, so configure `ADMIN_TOKEN` rather than relying on network origin alone. Keep the participation salt stable across restarts.

SQLite uses WAL and foreign keys. Successfully committed answers persist; unfinished input and unflushed events may need re-entry. For a recovery backup, stop the server before copying the database, or use a SQLite-aware backup. Copying only the main file while WAL writes are active is unsafe. Analysis exports omit identity linkage/salt and are not a restorable database backup. Preserve real study data separately from demos.

## Source-code ZIP

Create one ZIP containing `app/`, `docs/`, root `AGENTS.md` and the course reference text files, preserving their layout so documentation links work. Include `package.json`, `package-lock.json`, TypeScript/Vite configuration, `src/`, `server/`, `shared/`, schema SQL and required public assets.

Exclude `node_modules/`, `dist/`, `.git/`, runtime `app/data/`, database/WAL files, environment files, tokens/keys, response exports, logs and backups. Review screenshots/documents for real responses or credentials too. Use a fresh staging folder, ZIP it, then extract into another clean folder and follow the setup guide. Do not label the source submission complete until that extracted copy runs.

## Report, video and screenshot evidence

Use [REPORT-HANDOFF.md](REPORT-HANDOFF.md) for the complete report structure and the six-member capture table. It identifies code sections and their responsibilities; assignments are suggested evidence-capture roles, not statements of code authorship.

- Report: overview, technologies, devices, source-run guide and interaction instructions.
- Source screenshots: readable code, visible filename and a caption explaining responsibility and corresponding behavior.
- Application screenshots: current onboarding, A–D, fact sheet/confidence, full questionnaire, exit/debrief, admin and export views; include a responsive capture.
- Member evidence: genuine photographs of each of the six members interacting with the running application, named and captioned. Do not substitute stock/generated people or browser screenshots for these photographs.
- Video: show startup and a participant-to-admin walkthrough using a separate demo database. Identify cuts; do not present edited runtime as participant completion time.

## Final checklist

- [ ] One source ZIP passes clean-extraction setup.
- [ ] A playable video shows the application running.
- [ ] Report contains every section required in [implementation.txt](../implementation.txt).
- [ ] Annotated source screenshots and current running-app screenshots are attached.
- [ ] Genuine interaction photographs identify all six members.
- [ ] Demo data is labeled and real participant records/credentials are excluded.

## Source map and references

| Location | Responsibility |
|---|---|
| `src/App.tsx`, `src/study/` | Routing and participant screens |
| `src/conditions/`, `src/components/` | Explanation interfaces and reusable controls |
| `src/state/`, `src/logging/` | Resume, storage cleanup and event timing |
| `shared/counterbalance.ts`, `shared/rng.ts` | Reproducible assignment and shuffling |
| `shared/labelEngine.ts`, `shared/data/` | Controlled stimuli, truth boundary and questionnaires |
| `server/routes/`, `server/db/` | API validation, persistence and migrations |
| `server/kpi.ts`, `server/export/` | Dashboard aggregates and exports |

- [Report handoff for your friend](REPORT-HANDOFF.md)
- [API and implementation contract](CONTRACT.md)
- [Design documentation](../docs/README.md)
