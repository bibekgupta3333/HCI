# Course report handoff

For the friend assembling the CEN5728 Advanced HCI, Group 4 report. Use this document for report text and evidence planning; use [README.md](README.md) for detailed operations and [course instructions](../implementation.txt) for submission requirements.

**Evidence status: pending capture.** This handoff supplies text and a capture plan. It does not supply new screenshots, member photographs, a video, a source ZIP or research results. No running-app verification is claimed here.

## Ready-to-paste overview

**Paper title: Do People Trust AI More When It Explains Itself? A Comparative Study of Explanation**

**Members:** Afzal Hossain Sohag, Bibek Gupta, Deepthi Reddy Chelladi, Md Shamimul Islam, Mohamed Sylla, Siwani Sah.

This project is a self-guided HCI experiment conducted as part of graduate study at Florida Polytechnic University. It examines whether explanation interfaces help people accept correct AI accuracy labels and reject incorrect ones, and how the experience relates to trust, fairness, tension and frustration. Participants judge fictional social-media posts from Riverton and Alder County. Labels and explanations are scripted using a Wizard-of-Oz design; no live AI model, external fact-checker or social-media feed runs.

Each new session presents eight distinct text-only posts, sampled from a 24-post bank, across four parts of two posts. Every part uses one explanation condition and contains one correct and one deliberately wrong label. Participants agree or disagree with each label and select confidence from 1–7; optional fact sheets provide checking evidence. Original likes and repost counts remain visible. After each part, participants answer 12 Jian-based trust items, two fairness items, one tension item and one frustration item: **16 ratings per part, 64 total**, in addition to trial confidence and the final survey.

The primary behavioral outcome is appropriate reliance: accepting correct labels and rejecting wrong ones. The eight-post design is exploratory. The target of 32 participants supports assignment balance and feasibility; it is not established statistical power. Completion time and questionnaire burden require pilot evidence. Differences between conditions concern interface packages: C provides factual comparison as well as interaction, so a C advantage could not establish an effect of interactivity alone. These are design statements, not findings.

## Technologies and intended devices

| Layer | Actual implementation |
|---|---|
| Platform and language | Node.js 22+, TypeScript, HTML and CSS |
| Browser client | React 18, React Router 6, Vite |
| Server | Express 5, executed through tsx |
| Persistence | Server-side SQLite through better-sqlite3 |
| Study logic | Scripted JSON stimuli, Williams orders, seeded randomization |
| Verification tools | Vitest, Testing Library, jsdom, Supertest |
| Monitoring and analysis output | Admin dashboard, CSV and JSON exports |

The application targets desktop/laptop browsers and responsive phone/tablet browsers; no native app is required. Desktop/laptop is recommended for the full questionnaire and demonstration. Layout targets include 360 px phones and 1280 px desktops. These targets do not establish that every device/browser has been tested. Node and SQLite run on the host computer/server, not on the participant's phone.

## Clean setup from the source ZIP

1. Extract the ZIP, preserving the repository layout, and open a terminal in `app/`.
2. Install Node.js 22 or newer; Node 22 LTS is recommended. Check `node --version` and `npm --version`.
3. Run `npm ci --include=dev` with the included [lockfile](package-lock.json). Registry access is required; native better-sqlite3 compilation may require Python and the platform C++ toolchain.
4. Choose a separate demonstration database before startup. On macOS/Linux, run `DB_PATH=data/submission-demo.db npm run dev`. In Windows `cmd`, run `set DB_PATH=data/submission-demo.db`, then `npm run dev`. Do not reset the real study database.
5. Development starts Express on port 3001 and Vite on port 5173. Open **http://localhost:5173/** for participants and **http://localhost:5173/admin** for admin. Use Vite's printed URL if it selects another port. The development participant UI is served by Vite.
6. Stop development with Ctrl+C. Run `npm run build`, then `npm start` for production. Keep the demo `DB_PATH` set; on macOS/Linux use `DB_PATH=data/submission-demo.db npm start`. Production serves both UI and API at **http://localhost:3001/**; admin is **http://localhost:3001/admin**.
7. Windows: `npm start` uses POSIX environment syntax. Use Git Bash/WSL, or after building in `cmd`, set the demo `DB_PATH` as above and run `set NODE_ENV=production&& npx tsx server/index.ts`.
8. The schema is created automatically. Keep the terminal running. Record actual verification output from `npm test`, `npm run typecheck` and `npm run build` if included as report evidence; this handoff does not claim those checks were run.

For deployment, configuration and backups, follow [README.md](README.md). A phone's `localhost` refers to the phone; remote participation needs a reachable URL. Configure an admin token for shared/proxy deployment. Do not expose credentials or real responses in evidence.

## Participant walkthrough

1. Open `/`, read the introduction and select **Take part**.
2. At `/start`, enter a non-identifying participation code and select **Start**. Participants need no admin permission. Codes limit sessions but do not verify identity.
3. Read consent, confirm adult eligibility, then complete instructions and one unscored practice post.
4. On each assigned post, optionally open **Fact sheet**. Use **Why?** and expandable rows when condition C is shown.
5. Choose **Agree with label** or **Disagree with label**, then confidence 1–7. A brief Undo opportunity precedes saving and automatic advancement; there is no separate per-post Next step.
6. After each two-post part, answer all 16 ratings. Trust, fairness and tension use 1–7; frustration uses 0–100 in steps of 5. The slider requires deliberate interaction: its initial 50 is not an answer, but intentionally selecting 50 is valid.
7. Complete four parts, the final survey and debrief. Select **Next participant** to return to a fresh landing page. Successful completion clears participant study storage while retaining the admin token and unrelated storage.
8. For unfinished sessions, use **Continue** in the same browser or enter the same code on another device. **Exit study** allows confirmed cancellation, preserves saved responses and shows an early debrief. Completed/abandoned codes cannot start again; indefinite resume is not guaranteed.

Shortcuts: A agree, D disagree, 1–7 confidence, F fact sheet, W Why where available, Escape close panel. Use demonstration codes and answers for recordings; label them as demonstrations.

## Conditions and assigned order

| Condition | Explanation beneath the label | Suggested running-app capture |
|---|---|---|
| A — No explanation | Label only | Post, label and shared decision controls |
| B — Static | One scripted reason | Full static reason and label |
| C — Interactive | Why? opens Source, Claim vs record and Wording; rows expand independently | Why open with readable expanded details |
| D — Counterfactual | One scripted “would be labeled … if …” sentence | Full counterfactual sentence and label |

Every participant sees all four conditions, but **Part 1 is not necessarily A**. The server assigns a pid; condition order is `WILLIAMS[(pid - 1) % 4]`, with orders `ABDC`, `BCAD`, `CDBA`, `DACB`. For example, pid 1 receives A → B → D → C; this example is not evidence of an actual session. Set rotation and seeded shuffling vary posts. Each new session has two false alarms and two misses overall; condition-by-error balance spans 32 assignment slots. Caption captures using the actual saved condition, part and post, rather than assuming alphabetical part order.

Current sessions use `calibrated-full-v1` and `full-v1`. Saved older sessions retain their own plan, questionnaire and presentation; do not relabel them or pool cohorts. Historical media screenshots under `../docs/artifacts/media-v1/` are superseded and are not evidence of the current text-only UI. See [study decisions](../docs/_shared-decisions.md) and [image audit](../docs/media-and-engagement-design.md).

## Admin walkthrough

1. Open `/admin` on the same frontend origin; enter the configured token if required. Admin monitors sessions and does not start participants.
2. Inspect status/progress, assignment order and selected cohort. Outcome summaries default to current full-questionnaire sessions and completed non-pilot data; status counts can also include unfinished/abandoned sessions.
3. Inspect appropriate reliance, correct acceptance, wrong rejection, trust and affect. Demonstration numbers must not be presented as study findings.
4. Download a file or **Download all CSVs**, optionally including raw JSON. Open a demonstration CSV and confirm usable headers/rows. Exports are `participants.csv`, `trials.csv`, `surveys.csv`, `events.csv`, `exit.csv`, `kpis.csv` and `sessions.json`.
5. Use abandon/delete only for intentional session management: abandon preserves saved rows; deletion removes the session and linked rows. Keep real data separate. See [API/export contract](CONTRACT.md) for field meanings and cohort rules.

## Source screenshots: proposed capture roles

**All captures below are pending. These are proposed evidence-capture assignments, not statements of authorship or past contributions.** Each member should confirm their role. Capture readable source with filename and relevant function visible; explain its responsibility and pair it with the corresponding app behavior. Paths link to source, not to screenshots that already exist.

| Proposed member | Source to capture | Responsibility and example caption | Paired application evidence |
|---|---|---|---|
| Afzal Hossain Sohag | [App.tsx](src/App.tsx) | Routing and screen guards. “Application routes connect onboarding, study parts, surveys and completion.” | Landing → consent → instructions |
| Bibek Gupta | [counterbalance.ts](shared/counterbalance.ts) | `assignShortFromBank` and Williams assignment. “Seeded assignment selects two posts per part and varies condition order.” | Actual demo order/progress; identify saved order |
| Deepthi Reddy Chelladi | [TrialScreen.tsx](src/study/TrialScreen.tsx) | Trial interaction, confidence and saving. “Participants judge a label, select confidence and advance after the Undo window.” | Label, decision and confidence states |
| Md Shamimul Islam | [conditionRegistry.ts](src/conditions/conditionRegistry.ts) and [InteractiveExplanationView.tsx](src/conditions/InteractiveExplanationView.tsx) | Condition selection and C view entry point. “The assigned condition selects the explanation interface; C exposes expandable details.” | A–D comparison, including C expanded |
| Mohamed Sylla | [BlockSurveyScreen.tsx](src/study/BlockSurveyScreen.tsx) and [surveyItems.json](shared/data/surveyItems.json) | Questionnaire presentation, canonical items and required responses. “The full survey collects 16 ratings after each part, including an intentionally selected frustration value.” | Full trust/fairness/affect survey; multiple frames if needed |
| Siwani Sah | [repo.ts](server/db/repo.ts) and [ExportPanel.tsx](src/admin/ExportPanel.tsx) | Server persistence and export-download interface, respectively. “Saved study responses support admin monitoring and analysis exports.” | Admin session view, export panel and opened demo CSV |

Use these as caption examples only after checking the captured code and behavior. Do not claim a wrapper implements all underlying controls or that an export button itself calculates statistics. Additional references: [database schema](server/db/schema.sql), [KPI calculations](server/kpi.ts), [stimuli](../docs/stimuli.md), [methods/limitations](../docs/methods-and-limitations.md).

## Running-app evidence checklist — all pending capture

- [ ] Startup terminal and browser URL; record date, build/commit, Node version, browser and viewport, and identify the separate demo database without showing secrets.
- [ ] Landing, code entry, consent and practice, using a newly created current-protocol session.
- [ ] A, B, C and D, with actual condition/part/post identified; include C collapsed and expanded.
- [ ] Optional fact sheet plus Agree/Disagree, confidence and Undo states.
- [ ] Full questionnaire showing all 12 trust items, two fairness items, tension and frustration; use successive readable captures if it exceeds one screen.
- [ ] Final survey, debrief and Next participant; demonstrate unfinished-session resume separately if included.
- [ ] Admin status/cohort and export panel, then a downloaded demo CSV opened successfully. Label visible numbers as demonstration data.
- [ ] At least one current responsive phone-width capture (360 px target) alongside desktop evidence. State whether it is browser emulation or a physical device.

Keep a capture log with filename, person capturing, date, screen/source path, condition and caption. Choose filenames when capturing; no screenshot directory or evidence artifact is asserted to exist here. Do not generate mock screenshots or substitute historical media screens for current captures.

## Genuine group-member interaction photographs — all pending

The course asks for images of group members using the application. Obtain genuine photographs with each member's agreement, showing the named person interacting with the running app and a recognizable screen. Browser screenshots alone do not establish member interaction. Do not use generated people, stock photographs or invented participation claims.

| Member who must be identifiable | Suggested interaction for their photograph | Status |
|---|---|---|
| Afzal Hossain Sohag | Navigating onboarding or practice | Pending capture |
| Bibek Gupta | Judging a post and selecting confidence | Pending capture |
| Deepthi Reddy Chelladi | Opening a fact sheet | Pending capture |
| Md Shamimul Islam | Expanding Why? details | Pending capture |
| Mohamed Sylla | Completing a full block questionnaire | Pending capture |
| Siwani Sah | Inspecting admin exports on demo data | Pending capture |

Example caption template: “[Full name] interacting with [visible screen/action] during a demonstration, [actual date/device].” These suggestions do not document completed activity or code authorship. Team demonstrations are evidence of operation, not independent participant research results.

## Friend's assembly workflow and submission check

1. Paste the overview/title/member list, technology/device table and numbered setup/interaction guides into the report. Consult [README.md](README.md) for operational detail and [protocol](../docs/study-protocol.md) for study procedure. Older proposal material concerns loan approval; do not describe it as the implemented domain.
2. Ask each member to supply their proposed source captures and genuine interaction photograph. Collect current app captures and a demonstration video using a separate database. Keep missing items explicitly pending until received and reviewed.
3. Insert readable figures with captions explaining code responsibility or visible behavior. Check names, assigned conditions, eight-post counts and 64 ratings. Report actual observations only; do not invent results, approval, measured duration, files or completed checks.
4. Review the [course requirements](../implementation.txt), then complete the following submission checks with the team.

- [ ] **Source ZIP:** one archive preserving `app/`, `docs/` and root references; include source, lockfile, configuration, schema and required assets. Exclude dependencies, builds, Git metadata, databases/WAL, exports, secrets, logs and backups. Follow the README source checklist and verify a clean extraction runs.
- [ ] **Video:** playable recording of startup, participant interactions, A–D, full questionnaire, completion and admin export. Identify edits; edited runtime is not measured participant completion time.
- [ ] **Report:** required written sections, annotated source screenshots, current running-app screenshots and genuine interaction photographs identifying all six members. Resolve every pending evidence item before calling the package complete.
