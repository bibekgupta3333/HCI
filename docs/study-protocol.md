# Study Protocol: Riverton Post-Label Study (v3.1, self-guided, open participation)

This document is the protocol for the CEN5728 Group 4 study on AI accuracy labels for social media posts: "When the AI label is wrong, do explanations help people catch it, and how do they make people feel?". The study is **self-guided**. Anyone opens the study link and starts on their own, on a lab laptop or their own device (desktop or phone). No researcher is needed to start or run a session. Participation is requested once per person; the server blocks reuse of a hashed participation code, which is not verified identity. The research team only deploys the app, watches the admin dashboard (data and KPIs), records reported issues and exports the data.

The document has two readers:
- The **study reviewer** needs the aims, risks, deception, consent, debrief and data handling in one place.
- The **research team** needs a deployment checklist, monitoring routine, incident handling, an assignment sheet and a pilot plan.

Where to find the rest:
- Design details (screens, counterbalancing code, logging, field names) are in `system-design.md`, `data-model.md` and `ai-design.md`.
- Participant-facing wording is in `stimuli.md`.
- The app's API contract is in `../app/CONTRACT.md`.

Where this document and `_shared-decisions.md` disagree on the study design, `_shared-decisions.md` wins. On how participation works (self-start, once-only, admin role), `../app/CONTRACT.md` wins.

The active design below distinguishes new eight-post sessions from saved legacy sessions. Unresolved operational limits are listed in §17.

The moderated v3 protocol is in git history (commit `d72d2df`). The v2.1 protocol is archived at `archive/v2.1-agent-permission/study-protocol.md`.

---

## 1. Purpose

There's no moderator to keep sessions consistent, so the app does that job. Within each session version, participants get common screens and timing with the assigned explanation condition. Version, post selection, ordering and interaction use also need to be considered when interpreting differences. This protocol documents three things:
- how the team deploys and monitors the app so every session runs on the same build and the counterbalancing stays balanced;
- how the once-per-person rule works and where its limits are;
- the ethical safeguards for unmoderated participation: consent, limited deception, exposure to made-up misleading claims, stress measures, the debrief, pseudonymous data and withdrawal. These support study review and the course report.

**Short-study cohort setup:** use a separate SQLite file for formal eight-post collection (for example `DB_PATH=data/short-study.db`), preserving the earlier file unchanged. If legacy pids already occupy assignment slots, 32 more short completions do not necessarily complete the intended 32-slot schedule. Pilot/testing uses another isolated file. Never delete earlier responses to restart assignment.

## 2. Study summary

| Item | Detail |
|---|---|
| Title | Explanations and error detection in AI accuracy labels |
| Main question | When the AI label is wrong, do explanations help people catch it, and how do they make people feel? |
| Aims | **RQ1:** do explanations help people catch wrong labels, and does it differ for false alarms (a true post labeled "Likely misleading") vs misses (a false post labeled "Likely accurate")? **RQ2:** which explanation type gives the best error detection? **RQ3:** do wrong labels create tension, and does explanation type make it better or worse? Hypotheses H1–H6 are in `_shared-decisions.md`. |
| Format | **Self-guided web study.** The participant opens the study URL and goes through it alone. Nobody needs to be present. |
| Device | A lab laptop, or the participant's own device: desktop, laptop, tablet or phone (works from 360 px wide). Any current browser. |
| Task | The participant reads made-up social media posts from the fictional town of Riverton (fictional Alder County). Each post carries an AI label, "Likely accurate" or "Likely misleading". A "Fact sheet ▸" button opens a fictional official record about the post. Each post takes **two taps**: **Agree** or **Disagree** with the label, then a confidence chip from 1 to 7. |
| Apparatus | A Wizard-of-Oz web app: a React SPA plus a small Node/Express server with a SQLite file. No AI model runs; every label and explanation is scripted. **4 of the 8 labels are deliberately wrong** (2 false alarms, 2 misses) for new sessions. Saved legacy sessions retain 8 wrong labels among 24 posts. |
| Design | Within-subjects, 4 conditions: **A** No explanation (label only), **B** Static reason (one fixed sentence), **C** Interactive "Why?" (three expandable rows: Source, Claim vs record, Wording), **D** Counterfactual (one "would be … if …" sentence). New sessions have 4 parts of 2 posts, one part per condition, plus 1 unanalysed practice post. Each part has 1 correct and 1 wrong label. Saved legacy sessions retain 6 posts per part. The pid sets the condition order (4×4 Williams square), the condition-to-set pairing and the within-part post order. A full condition/set rotation cycle is 16 pids; see §8 for error-type balance across 32 new-session completers. |
| Assignment | **The server assigns the pid automatically.** It takes the lowest pid ≥ 1 that has no in-progress or completed session. At session creation the server sweeps sessions inactive for 2 hours, marks them abandoned and makes their pid available for **reuse**. This keeps the 16-participant cycle balanced without anyone handing out numbers. |
| Measures | **Per post:** agreement, error detection (on wrong labels), confidence (1–7, required), decision time, fact-sheet use, "Why?" row use (C only). **Per part:** the Jian et al. (2000) trust scale (12 items), 2 fairness items, tension (1–7) and NASA-TLX frustration (0–100). **Exit:** demographics, social media use, how often they've seen platform labels, preferred interface and an open comment. |
| Sample size | **Target N = 32 new-session completers.** Sixteen covers a condition/set rotation cycle, but is not the stopping target for the requested 32-person error-type balance. Neither count is a power guarantee. |
| Duration | Must be measured in the eight-post pilot; do not reuse the legacy 15–20 minute estimate as a validated duration. |
| Attribution | HCI experiment conducted as part of graduate study at Florida Polytechnic University. |

## 3. Eligibility and exclusions

### 3.1 Eligibility

**Anyone aged 18 or over who can read English may take part. There are no other criteria.**
- Participation is restricted to adults who can consent for themselves; minors are outside this protocol.
- There's no requirement on social media use, background, field of study, device or prior knowledge.
- Screen zoom, screen readers, glasses and phones are all fine.

The participant confirms they're 18+ on the consent screen ("By clicking 'I agree', you confirm that you are 18 or older…"). This is self-report; nobody checks it.

**Prior knowledge of the project.** In the moderated v3 protocol, the moderator asked whether the participant had heard about the project before (for example, from the class presentation). In a self-guided study, an exit item could record this without prompting participants before the task. Nobody is excluded on the answer; it's only used for a sensitivity analysis that reruns the results without people who said yes.
The prior-knowledge item is a proposed addition, not an implemented measure; its collection must be verified before reporting a sensitivity analysis.

### 3.2 Exclusions

There are only two exclusions. Nobody is excluded for demographics, social media habits, device or performance.

1. **Group 4 members** take part in the **pilot only** (§15), because they wrote the posts and know which labels are wrong. Pilot sessions use pids **901+** or a separate pilot database, and never count toward the main study.
2. **Each person takes part once.** A second session would be contaminated by the first debrief, which reveals the wrong labels. §3.3 explains how this is enforced.

### 3.3 Once per person: the participation code

**What the participant does.** On the Welcome screen (`/start`, reached from **Take part** on the landing page), before consent, the participant types a short personal **participation code**, such as their university email or student ID. A one-line note under the field explains that the code is used only to stop people taking part twice, and that it isn't stored.

**What the server does** (`../app/CONTRACT.md`):
- It normalises the code (trims spaces, lowercases) and checks the length (3–120 characters).
- It computes `participant_hash = HMAC-SHA256(PARTICIPANT_SALT, code)` and keeps **only that hash**.
- The **raw code is never stored or logged**, on the server or in the browser.
- The salt is a secret set by the team (`PARTICIPANT_SALT`). If it isn't set, the server generates a random one and stores it in its database. Without the salt, nobody can work out a hash from an email address.

**What happens on a repeat attempt:**

| Situation | What the participant sees |
|---|---|
| New code | A new session starts, and the server assigns the next pid. |
| Same code, session still in progress (within 2 h of their last activity) | The session **resumes** where they left off, on the same or a different device (§12). |
| Same code, session completed or abandoned | "You've already taken part. Thank you!" No new session is created. |
| Same device or browser after finishing | Nothing is remembered: once the exit survey is saved on the server, the app clears all of its study data from the browser, so the landing page shows no Continue banner and the Welcome screen a fresh **Start**. If the person types their code again, the server refuses it as above. |

**Identity limitations:**
- Someone could take part twice by typing **two different codes**, for example their email and then their student ID, on different browsers. The app can't detect this without collecting real identities, which would cost more privacy than the risk is worth.
- Mitigations, which do not establish identity:
  - task performance carries no score-based reward; compensation arrangements have not been established here;
  - the consent text asks people to take part only once;
  - the debrief asks people not to share the study's details;
  - a repeat participant would know the wrong labels and show near-ceiling detection. That pattern can be spotted in the data, and the team decides on such sessions **before** looking at condition results (§12.1);
  - in-person lab sessions (§10) give an extra check, because the team member present sees each person.
- The browser keeps **no** record that someone has taken part. Once-only rests entirely on the server's check of the hashed code, so a returning person is stopped only if they type the same code again.
- Typos are a second limit. A participant who mistypes their code on a return visit gets a new session instead of resuming. The admin dashboard shows this as an abandoned session plus a new one, which is harmless: the abandoned pid is reused.

## 4. Ethics and risk

### 4.1 Risk level

The anticipated burdens include boredom, fatigue, tension and frustration; this is a risk description, not a formal determination. Participants read short fictional posts, tap buttons and answer questionnaires. The risks are no greater than everyday social media use: mild boredom or fatigue, and possibly mild tension or frustration when a label seems wrong.

HCI experiment conducted as part of graduate study at Florida Polytechnic University. This protocol does not establish institutional authorization or a formal risk determination. The scripted labels, withheld information and affect questions require an appropriate review process before research recruitment.

### 4.2 Deception

- **What is withheld.** Participants are told they're evaluating "an AI tool that labels social media posts". They're not told that the labels are scripted, or that 4 of the 8 labels are deliberately wrong in new sessions.
- **Why it's needed.** The study measures whether people notice wrong labels, and how explanations change that. If participants knew errors were planted, or which kinds, they'd hunt for them, and agreement and detection would no longer reflect how people normally treat platform labels. A scripted labeller is also the only way to give every participant identical labels and identically worded explanations across conditions.
- **Risk of withholding information.** The deception concerns the source and accuracy of labels. Fictional content and a corrective debrief reduce risk, but do not establish absence of harm. Procedure, data use and participation rights must be described accurately.
- **Disclosure.** The debrief screen appears automatically straight after the exit survey (§13). It explains the deception and shows the real facts. Participants may still withdraw their data once they know the true purpose (§4.6).
- **Limitation of the unmoderated format.** Closing the page early can prevent access to the corrective debrief. No remote follow-up or early-exit debrief route is established by this protocol; this remains a substantive limitation (§17).

### 4.3 Exposure to made-up misleading claims

Each new session includes 2 false posts labeled "Likely accurate" (misses) and 2 true posts labeled "Likely misleading" (false alarms). The truth distribution of the 4 correctly labeled posts depends on selection; do not infer that half the eight posts are false. Legacy sessions retain their original 24-post assignment. A participant could leave believing a false claim. Mitigations:
- **Everything is fictional.** The town (Riverton), county (Alder County), people, accounts and agencies are invented. No false claim is about a real place, person or organization, and there are no real brands.
- **No health-risk claims.** No post makes a claim that could cause harm if believed (for example about medicines, treatments or safety actions), and no post touches health care. Posts about local services (such as a parking rate or tap-water results) concern the fictional town only, and the debrief corrects them.
- **The debrief corrects every wrong label.** The debrief screen states plainly that **none of these posts were real**. Its "Show the real facts" section gives the real fact for each of the 4 wrong labels shown in a new session, or 8 in a legacy session (§13.2).

### 4.4 Stress measures and distress without a moderator

Each part asks how tense the participant felt, and includes the NASA-TLX frustration item. These are standard workload items about the task, not about personal life, and are unlikely to cause distress. The debrief explains the scripted labels and makes clear that the task is not a test of ability.

Nobody is present to watch for distress, so the safeguards are built into the text and the app:
- **Stopping is always possible.** The consent text says the participant can stop at any time by **closing the page**, without giving a reason and without penalty. Nothing else is needed.
- **No monitored assistance channel.** The interface provides no verified remote support or data-deletion request channel. It must not promise a reply or follow-up service.
- **Abandoned sessions are handled automatically.** A session inactive for 2 hours can be marked `abandoned` when a subsequent session start triggers the stale sweep. Its pid becomes available for reassignment. The partial data is kept unless the participant asks for it to be deleted (§4.6).
- **Observed distress.** In-person staff stop the task, offer the corrective debrief and record the incident without identifying details.
- **In-person lab sessions** (§10): the team member present follows the stop rule there.

### 4.5 Data minimisation and pseudonymity

- **The app records no names**, emails, student IDs, social media handles or exact birth dates. Age is collected as a range.
- **The participation code is never stored.** The server keeps only its salted HMAC hash, which lets it recognise the same code again.
  - The hash is **pseudonymous data**, not anonymous data. Anyone with the salt and a candidate email address could test whether that address took part. So the team treats the hash and the salt as confidential:
    - the salt is held in the server environment or generated once in database metadata, and is never committed to git;
    - analysis exports omit the participation hash and salt; database backups retain them until explicitly removed;
    - the SQLite file is access-restricted (§14).
  - **Deletion planning:** collection closure and linkage removal require a documented procedure covering the live database, backups and salt (§14.4). No deletion date has been established.
- **Network data.** The server doesn't store IP addresses. The reverse proxy or hosting platform may keep access logs. The actual host logging and retention settings still require verification.
- **Free text.** The exit comment is the only free-text field. Its label asks participants not to include identifying details. The team checks comments before data is shared, and redacts any personal details in the clean copy.

### 4.6 Stopping participation and data deletion

- Participation is voluntary. A participant may decline consent or stop at any time by closing the page, without penalty or giving a reason.
- Closing the page does **not** erase saved answers. Partial responses remain on the server.
- The admin can delete a verified session using its UUID and pid, with corresponding removal from exports and backups (§14.5). Pids alone can be reused and are insufficient identifiers.
- The public interface currently provides no verified remote deletion-request route or self-service deletion control. Do not promise deletion by email, a withdrawal deadline or an automated withdrawal service. This operational gap must be resolved before promising post-participation withdrawal.

## 5. Consent text (draft)

Shown on the consent screen as a short text, with the full text under "Read full consent details". Final wording is in `stimuli.md` and must match the app.

> **Consent to take part in a research study**
>
> **Study:** How people use AI labels on social media posts
> HCI experiment conducted as part of graduate study at Florida Polytechnic University.
>
> We're studying how people use an AI tool that labels social media posts. You'll read 8 short posts about a made-up town. Each post has a label from the AI tool, and you decide whether you agree with it. You'll also answer short questions, including how tense or frustrated you felt. You do it on your own, with two posts and a questionnaire in each of four parts.
>
> All posts, people and places are fictional, and some posts contain claims that aren't true. You may feel bored, tense or frustrated. Some parts of the study will be explained fully at the end.
>
> We don't record your name. The code you typed is only used to stop people taking part twice: we keep a scrambled version of it, never the code itself. The code check is not proof of identity. Your answers are stored under a number and reported only as group results. Please take part only once, and don't type personal details in the comment box.
>
> Taking part is voluntary. You can decline or stop at any time by closing this page, without penalty. Answers already saved remain stored if you stop.
>
> By clicking "I agree", you confirm that you are 18 or older and agree to take part.

The app stores the consent timestamp without a signature or name. The eight-post consent copy is a specification to synchronize with the active app; legacy resumed sessions must retain an accurate description of their saved assignment.

## 6. Recruitment message (draft)

> **Take part in a study on AI labels for social media**
>
> HCI experiment conducted as part of graduate study at Florida Polytechnic University. We are studying how people use AI labels on social media posts.
>
> - **What:** read 8 short made-up posts, each with an AI label, decide whether you agree with each label, and answer a few quick questions.
> - **Format:** four parts of two posts, with questions after each part, on your phone or computer.
> - **Who:** anyone aged 18 or over who reads English. No experience with social media or AI is needed.
>
> Open the study link or scan its QR code, then choose **Take part**.
>
> Taking part is voluntary, and we don't collect your name. Please take part only once.
>

Rules for recruitment:
- The link and the QR code point to the **landing page** (the study URL's root, `/`), not to `/start`. The landing page repeats this message's facts (task, who, once per person and privacy) and has the **Take part** button, so people who arrive from a poster or a forwarded link get the same information.
- Generate the QR code from the final study URL, and test it on a phone before printing: it should open the landing page, and **Take part** should open the code screen.
- Don't mention that the labels can be wrong, that they're scripted, or words such as "errors", "mistakes", "false alarms", "misses", "fake news" or "fact-checking".
- Recruitment is open to everyone. Spread it beyond the class where possible: other departments, campus noticeboards, friends and family over 18. A mixed sample makes the results more general than a sample of HCI students.
- Don't post the link anywhere minors are the main audience.
- **The landing page text is recruitment text.** State the eight-post task, adult English-reading eligibility, once-per-person request, pseudonymous storage and freedom to stop. Use the university attribution above. Do not reveal scripted errors or promise an unmeasured completion time.

## 7. Deployment checklist

Do this once before the pilot. Repeat the starred items (★) if the build changes. Everyone uses the **same build** from the pilot onward, except for the documented post-pilot fixes (§15.3).

### 7.1 Choose where it runs

- **Option 1: hosted for own-device participation (the normal case).** Run the server on a machine participants can reach, with `HOST=0.0.0.0`, **behind HTTPS** (a reverse proxy such as Caddy or nginx with a certificate, or the host's TLS). Never expose the plain HTTP port to the internet.
- **Option 2: lab laptop only.** Run it on a lab laptop on `localhost` (the default `HOST=127.0.0.1`). Participants use that laptop in person (§10). Admin works from the same laptop without a token, because admin routes are allowed from loopback when `ADMIN_TOKEN` is unset.

Record and verify the actual deployment host and study URL in the deployment log before distribution.

### 7.2 Steps

- [ ] ★ Clean checkout of the agreed commit. Record the commit hash in the deviations log (§16).
- [ ] ★ In `app/`: `npm ci`, then `npm test` (all tests must pass).
- [ ] Set the environment variables (in a `.env`/service file that is **not** committed to git):
  - `ADMIN_TOKEN`: a long random string. **Required** for Option 1. Share it only with Group 4 through a private channel.
  - `PARTICIPANT_SALT`: a long random string (for example `openssl rand -hex 32`). **Set it once and never change it during data collection.** Changing it would let people take part again and break resume.
  - `HOST` (Option 1: `0.0.0.0`), `PORT` (default 3001), and optionally `STALE_MINUTES` (default 120; leave it) and `DB_PATH` (default `data/study.db`).
- [ ] ★ Build and start: `npm run build && npm start`. Keep it running under a process manager or a terminal that won't be closed. Disable the machine's sleep mode.
- [ ] Open the study URL on **a desktop browser and a phone**. Check that the landing page loads over HTTPS, that **Take part** opens the code screen (`/start`), and that **← Back** returns.
- [ ] Open `/admin?token=…`. Check that the KPI cards load and the sessions table is empty. From another device, check that `/admin` without the token is refused.
- [ ] In the admin panel, preview the assignments for pids 1–4 and 16. Check them against the sheet in §8.
- [ ] Run the pilot (§15), then clear the pilot data before the main study (§15.3).
- [ ] **Daily backup** of the database while data collection is open:
  `sqlite3 app/data/study.db ".backup 'backups/study-$(date +%Y%m%d).db'"`
  Copy the result to the team's private drive (§14.2). Use `.backup`, not a plain file copy, so the copy is consistent while the server runs.

### 7.3 New-session selection and part guidance

New sessions contain **8 analysed posts: 2 in each of 4 parts**. Each part contains exactly **1 correctly labeled post and 1 wrongly labeled post**. Across a participant's four parts there are **2 false alarms and 2 misses**. Across **32 new-session completers**, each condition must contain **16 false alarms and 16 misses** (and 32 correctly labeled posts). Verify these constraints from saved assignments, including after abandoned pid reuse; Williams condition order alone does not establish error-type balance. Do not reveal this structure before the debrief.

Keep the 24-post bank as the source pool and preserve canonical wording. Saved legacy six-post parts retain their original posts, order, cursor, survey requirements and debrief. Record the session version in analysis, and **do not pool 8-post and 24-post sessions**: trial counts, error prevalence, exposure and workload differ.

The following compact guidance is a design specification to verify against the app, not a claim of implementation. Show a brief condition-specific cue on the first post of each part and a shorter reminder on its second post. Keep it inline and readable without a modal tour, forced panel opening or correctness feedback. The second post still leads to the full block survey. A new part means a different explanation interface in the assigned Williams order, not a fixed A→B→C→D sequence.

| Assigned interface | First-post cue | Second-post reminder | Rationale for study defense |
|---|---|---|---|
| A — Label only | “Read the post and its label. You can open the fact sheet before deciding.” | “Agree or disagree, then rate how sure you are.” | Baseline judgement with optional verification and no explanation. |
| B — Static reason | “A short reason appears below the label. The fact sheet is available too.” | “Read the reason if useful, then decide.” | Tests a visible scripted rationale with no extra control. |
| C — Interactive | “Use Why? to explore Source, Claim vs record and Wording, if useful.” | “Each row opens separately. You choose what to explore.” | Tests optional exploration; preserves the true Claim vs record comparison and existing interaction logging. |
| D — Counterfactual | “The sentence below the label describes what would change the label.” | “Consider the if-statement, then decide.” | Tests a scripted alternative scenario; no new mandatory action. |

All conditions keep the same Agree/Disagree → confidence 1–7 sequence, optional fact sheet, checking delay and Undo behavior. Do not add required tasks merely to make parts feel different. New wording must not reveal errors, imply a reason is truthful or force verification. Differences in onboarding text can influence behavior and should be recorded as a limitation.

Keep all **12 trust items per part** plus 2 fairness, tension and frustration: **16 ratings × 4 parts = 64 required block-survey ratings**, in addition to 8 decisions, 8 confidence ratings, practice and exit questions. Eight posts do not establish a short or effortless study. Pilot total time, survey fatigue, guidance clarity and accidental submissions before giving a duration estimate.

## 8. Assignment sheet (pid → condition order and sets)

The server assigns pids itself (§2), so the team doesn't hand them out. This sheet is for **checking** what the server did (in the admin preview and balance grid) and for analysis. One cycle is 16 pids, and pid 17 repeats pid 1's order and sets (17 = 1, 18 = 2, …, 32 = 16). Only the seeded within-part post order differs.

For new sessions, these sets are selection pools, not instructions to present all six posts. The selection constraints in §7.3 apply within them. Legacy sessions retain all six assigned posts. The sheet is computed from the shared formulas in `_shared-decisions.md`:
- `order = williams[(pid - 1) % 4]`, with `williams = [ABDC, BCAD, CDBA, DACB]`
- `rotation = floor((pid - 1) / 4) % 4`
- the set for a condition is `S[(conditionIndex + rotation) % 4]`, with A = 0, B = 1, C = 2, D = 3 and S = [S1, S2, S3, S4]

| pid | Order | Rotation | Part 1 | Part 2 | Part 3 | Part 4 |
|---|---|---|---|---|---|---|
| 1 | A-B-D-C | 0 | A / S1 | B / S2 | D / S4 | C / S3 |
| 2 | B-C-A-D | 0 | B / S2 | C / S3 | A / S1 | D / S4 |
| 3 | C-D-B-A | 0 | C / S3 | D / S4 | B / S2 | A / S1 |
| 4 | D-A-C-B | 0 | D / S4 | A / S1 | C / S3 | B / S2 |
| 5 | A-B-D-C | 1 | A / S2 | B / S3 | D / S1 | C / S4 |
| 6 | B-C-A-D | 1 | B / S3 | C / S4 | A / S2 | D / S1 |
| 7 | C-D-B-A | 1 | C / S4 | D / S1 | B / S3 | A / S2 |
| 8 | D-A-C-B | 1 | D / S1 | A / S2 | C / S4 | B / S3 |
| 9 | A-B-D-C | 2 | A / S3 | B / S4 | D / S2 | C / S1 |
| 10 | B-C-A-D | 2 | B / S4 | C / S1 | A / S3 | D / S2 |
| 11 | C-D-B-A | 2 | C / S1 | D / S2 | B / S4 | A / S3 |
| 12 | D-A-C-B | 2 | D / S2 | A / S3 | C / S1 | B / S4 |
| 13 | A-B-D-C | 3 | A / S4 | B / S1 | D / S3 | C / S2 |
| 14 | B-C-A-D | 3 | B / S1 | C / S2 | A / S4 | D / S3 |
| 15 | C-D-B-A | 3 | C / S2 | D / S3 | B / S1 | A / S4 |
| 16 | D-A-C-B | 3 | D / S3 | A / S4 | C / S2 | B / S1 |

Across the 16 rows, each condition appears in each part position 4 times and is paired with each set 4 times. The table was checked with this script:

```python
W = ["ABDC", "BCAD", "CDBA", "DACB"]
for pid in range(1, 17):
    order, rot = W[(pid - 1) % 4], ((pid - 1) // 4) % 4
    print(pid, " | ".join(f"{c} / S{('ABCD'.index(c) + rot) % 4 + 1}" for c in order))
```

**Why reuse keeps balance.** A pid becomes free again only when its session is abandoned or deleted, and the next new participant takes the lowest free pid. Gaps fill before the cycle moves on, but 16 completions do not by themselves prove pids 1–16 are complete if lower slots are still in progress. Verify the completed assignment distribution. The admin balance grid should then show each of the 4 orders 4 times.

## 9. Admin role: monitoring, KPIs and exports only

The admin panel (`/admin`, protected by `ADMIN_TOKEN`) **doesn't start sessions**. Participants start their own. A team member checks it at least **once a day** while data collection is open (it auto-refreshes every 15 s).

| What to watch | Where | What it should look like | Action if not |
|---|---|---|---|
| Completed vs target | KPI cards and progress toward N = 32 (min 16) | Rising; check completed assignments rather than assuming every lower pid has finished | Push recruitment. Target 32 new-session completers and verify actual assignment balance. |
| Completion rate | KPI card | Most started sessions complete (aim > 70%) | Many abandons at the same screen point to a usability bug: check the sessions table's progress (x/8 for new sessions; x/24 for legacy) and fix it via the deviations log. |
| Median and p90 session time | KPI card | Eight-post median and p90 established by pilot | Much longer: check instruction length and phone layout. Much shorter (< 8 min): possible click-through; see §12.1. |
| Balance grid | Completed sessions by condition order | Each order within 1 of the others; exactly 4 each at 16 and 8 each at 32 | Check for stale in-progress sessions holding pids. Never edit assignments by hand. |
| Detection rates (sanity check only) | Per-condition and per-error-type table | Overall detection on wrong labels roughly 20–80% | Near 0% or 100% everywhere suggests a bug (for example the wrong label shown) or leaked study details. Don't use these numbers to change the study mid-way. |
| Stale sessions | Sessions table: `in_progress` with old "last activity" | The server marks them abandoned after 2 h, at the next session start | Leave them. Use **Abandon** only for a confirmed stop or documented session-management reason. |
| Verified deletion requests | In-person session identification | No remote request channel established | **Delete (withdrawal)** on the session, then §14.5. |

Rules:
- **Don't look at per-condition results** beyond this sanity check until data collection closes. Decisions about excluding sessions are made blind to condition (§12.1).
- **Exports:** use **Download all CSVs** plus `sessions.json` on the export panel. Each file shows its row count; check `participants.csv`'s count against the sessions table. Store the files as in §14.2.
- Pilot pids (≥ 900) are excluded from every KPI automatically.

## 10. Optional in-person lab sessions

The same app and URL can be used in a lab, for example for people who prefer it, or to recruit in person. The team member's only job is to show the URL and stay out of the way. No moderator script controls the session. Everything the participant needs is on screen.

**Setup.**
- Lab laptop (or the participant's own device) on the study URL, notifications off, browser in a normal window. A private window or a fresh browser profile isn't needed.
- The app cleans up after itself: as soon as the exit survey is saved on the server, it removes all study data from the browser. When a participant finishes, tap **Next participant** on the debrief screen (or reload the study URL) to return to the landing page for the next person. Nobody needs to clear site data by hand.
- Before each new person, check that the landing page shows no "session in progress" banner. If it shows one with **Continue**, the previous person left before finishing: don't tap it. The next person taps **Take part**, types their own code and taps **Start** as usual; the unfinished session becomes abandoned after 2 hours.

**Script** (say it as written, then stay silent):

> "Thanks for coming. Everything is explained on the screen, with two posts and a questionnaire in each of four parts. Please type your university email or student ID where it asks. It's only used to stop people taking part twice. I'll be over there, but I can't help with the decisions, because we're interested in how you decide on your own. If you want to stop at any point, just say so or close the page."

**Rules while they work:**
- Sit out of their line of sight and don't watch the screen.
- Never hint that labels can be wrong, and never say whether a label or post is right.
- If asked about the AI, a post or a label, say only: "Please use your own judgement. The end of the study explains more."
- Answer questions about the controls only ("tap Agree or Disagree, then how sure you are").

**Stop rule.** If the participant seems distressed, or asks to stop, say: "Would you like to take a break, or stop here? Either is completely fine." If they stop, show them the debrief text (§13, printed copy), explain that closing the page retains saved answers, and handle any verified deletion request under §4.6. Log it.

**At the end:** "Thanks for your help. Please read the final screen, which explains the study and corrects the fictional claims."

## 11. Participant flow

Duration remains to be measured in the eight-post pilot. The sequence is:

| # | Screen | What the participant does |
|---|---|---|
| 1 | Landing page, then Welcome (`/start`) | Reads the landing page (how it works, who can take part, privacy, FAQ); **Take part**; types the participation code; **Start** (or **Continue** in the landing banner if resuming) |
| 2 | Consent | Reads the short text (full details on demand), ticks the box, Continue |
| 3 | Instructions + practice | One screen with 3 bullet points and 1 practice post (not logged as a trial) |
| 4 | Part 1: 2 posts | Per post: ~800 ms "AI is checking…", then **Agree/Disagree**, then a confidence chip **1–7**. That's two taps; there's a 1 s Undo. Fact sheet and "Why?" (C) are optional. |
| 5 | Survey after Part 1 | One screen: 12 trust items (matrix), 2 fairness, tension, frustration slider ("x of 16 answered") |
| 6–11 | Parts 2–4 + surveys | Same as 4–5, in the pid's condition order |
| 12 | Exit survey | One screen, chips and radios; reminder not to type personal details |
| 13 | Debrief | Reads the debrief; "Show the real facts"; sees the corrective facts and participant number |

New sessions show "Post n of 8" and "Part x of 4"; legacy sessions show their original denominator of 24. There is no time limit. Timing flags follow the implemented per-trial rules; do not invent a session-level exclusion threshold.

## 12. Incident handling (self-guided)

Self-guided sessions rely on the app's error and retry states; remote human assistance is not established. Log every incident the team learns about in the deviations log (§16).

| Incident | What happens / what to do |
|---|---|
| **Page refresh or accidental navigation** | The app saves after every post and survey, and resumes at the first unanswered screen. The interrupted post is shown again and flagged `resumed = true`. Hidden time is logged (`hiddenMs`, `timingFlag`). Nothing to do. |
| **Closed tab or browser** | Within **2 hours** of the last activity, the participant reopens the URL. On the same browser they tap **Continue**; on any browser they type the **same code** and tap **Start**. The session resumes where it stopped. |
| **Device change** (for example from a phone to a laptop) | Same as above: open the URL on the new device and type the same code within 2 hours. The resume count is logged. |
| **Returns after more than 2 hours** | A subsequent session start may sweep the stale session to abandoned and release its pid. The abandoned code remains blocked; partial answers remain stored. Do not promise a restart or indefinite resume. |
| **"You've already taken part"** | Shown only when the server refuses the typed code (409), never from browser state. Expected for anyone who completed the study, and in the cases above. The message is final; nobody gets a second session after a completed one. A shared or mistyped code can also cause a conflict; codes are not verified identities. |
| **Finishes, then returns on the same device** | The browser holds nothing from their session, so they see a fresh **Start**. If they type the same code, the server stops them with "You've already taken part". If they type a different code, they get through; this is the limit in §3.3. |
| **Mistyped code on return** | A new session starts. A later session start can mark the old session abandoned after 2 h of inactivity and make its pid available for reuse. Record any observed issue without changing saved responses. |
| **Technical failure** (blank screen, error message, "not saved" warning) | Keep failed saves retryable. For observed incidents, record device, browser, screen and non-sensitive error text. Pause recruitment for a common failure, fix it and log the build change. No email response service is promised. |
| **Distress** | §4.4. |
| **Withdrawal request** | §4.6 and §14.5 (data deletion). |

### 12.1 Sessions to review before analysis

These are decided **before** looking at condition results, using only the session data (not condition outcomes). Log each decision.
- **Click-through:** for example, a median decision time under 1 s across a whole part, or the same confidence on all 8 posts (24 in legacy sessions).
- **Probable repeat participant:** near-ceiling detection, together with comments revealing knowledge of the design.
- **Self-reported prior knowledge** (if the exit item in §3.1 is added): kept in the main analysis and dropped in the sensitivity analysis.

## 13. Debrief

### 13.1 Debrief text (as shown on screen)

The debrief screen appears automatically after the exit survey. Synchronize the participant-facing copy with the app and `stimuli.md`. This document alone does not establish that those files have been updated. It has **no** "call the researcher" line; it's self-guided.

> **Thank you!**
>
> That's the end of the tasks. Here is more about the study.
>
> - **None of these posts were real.** Riverton, Alder County, the people, the accounts and the agencies were all made up by our team. Some posts contradicted the fictional records supplied in this experiment.
> - The AI tool was not a real AI. Every label and every reason it gave was written in advance by our research team.
> - **4 of the 8 labels were deliberately wrong.** There were two kinds of mistake. A **false alarm** is when a true post is labeled "Likely misleading" (2 posts). A **miss** is when a false post is labeled "Likely accurate" (2 posts). We wanted to see whether people notice each kind, and whether the way the AI explains itself makes a difference. That's why the screen looked a little different in each of the four parts.
> - This task is not a test of your ability. Agreement with a scripted label is a study response, not a judgement about you.
> - We didn't tell you this at the start because knowing that mistakes were planted would have changed how you read every post. We're sorry for not telling you beforehand.
>
> **[Show the real facts ▾]** (the table in §13.2)
>
> **Your data.** Participation was voluntary. Closing this page does not delete answers already saved.
>
> Please **don't tell anyone else that some labels were wrong** until the study is finished, because people who know in advance would behave differently and that would spoil our results.
>
> You can now close this page.
>
> **[Next participant]** (returns to the landing page; for shared lab devices)

For saved legacy sessions, use the original 8-of-24 disclosure and corresponding facts. New sessions disclose 4-of-8 and the corrections for the posts actually assigned.

### 13.2 The real facts (the "Show the real facts" section)

Final post wording is in `stimuli.md`; this table is the full wrong-label bank. A new-session debrief selects the four assigned errors; a legacy debrief selects its eight. Do not imply all eight errors were shown in an eight-post session.

| Post | What the post said | AI label | Error | What the (fictional) record actually says |
|---|---|---|---|---|
| p03 | Riverside Fair runs June 6–8 at Mill Park | Likely misleading | False alarm | True: the fair runs June 6–8 at Mill Park. |
| p09 | Farmers market opens May 3 at Depot Square | Likely misleading | False alarm | True: the market opens May 3 at Depot Square. |
| p15 | Tap water met all 12 safety limits in March | Likely misleading | False alarm | True: all 12 March tests were within limits. |
| p21 | Pool opening delayed to June 14 for repairs | Likely misleading | False alarm | True: the pool opens June 14 after repairs. |
| p04 | Lake Alder hit a record low this spring | Likely accurate | Miss | False: it was the lowest since 2019; the record low was in 2012. |
| p10 | Downtown parking now costs $4 an hour | Likely accurate | Miss | False: downtown parking is still $2 an hour. |
| p16 | Mill Park concert moved to August 20 | Likely accurate | Miss | False: the concert is still on August 13. |
| p22 | City banned gas leaf blowers from this fall | Likely accurate | Miss | False: the ban is only proposed, with a vote in November. |

The section ends with: "None of these posts were real. Riverton and everything in it is fictional."

### 13.3 Participant exit and early-stop debrief

Every active participant screen includes **Exit study**. The confirmation offers **Keep participating** (or Escape) and **Yes, exit study**. On confirmation, the public session-cancel endpoint marks the session abandoned and retains already-saved responses; it does not submit unfinished questionnaire answers. After server confirmation, the client clears participant browser study storage and shows an early-exit debrief with the scripted-label explanation and planned-session corrections. The same participation code remains blocked. Admin permission is not required.

If cancellation fails, the message offers retry and the browser session remains available. Participants can always close the page. Closing the tab without using the button can still bypass the debrief; there is no established follow-up channel. In-person staff can provide §13.1 and the assigned corrections from §13.2.

## 14. Data handling

### 14.1 Where the data lives

- **Server:** a single SQLite file, `app/data/study.db` (or `DB_PATH`), on the study machine. It holds sessions (including `participant_hash`), trials, events and surveys. The file and its `-wal`/`-shm` siblings are never committed to git.
- **Browser:** only the active session id, and only while a session is in progress. Once the exit survey is saved, the app removes every `xai-study:` key from `localStorage` and `sessionStorage` (except the researcher's `xai-study:adminToken`), so nothing about the participant stays in the browser after they finish.
- **Exports:** JSON and CSV files from `/admin`. The analysis works from these:
  - **`participants.csv` is the starting point**: one row per session with the per-participant totals, the per-condition scores (`agreement_A` … `frustration_D`) and the exit answers. Keep `status = completed` and `isPilot = FALSE` before any test. It never contains the participation-code hash.
  - `trials.csv` (one row per trial) for the trial-level mixed models (H1–H2, H6), `surveys.csv` for item-level trust and fairness, `events.csv` for interaction sequences, `exit.csv` for the exit survey on its own.
  - `kpis.csv` holds the dashboard numbers (completed, non-pilot only) for the monitoring section of the report. It is not the analysis.
  - `sessions.json` is the complete archive: every CSV can be rebuilt from it.

### 14.2 Backups, exports and storage

- **Daily** while collection is open: run the `.backup` command (§7.2) and an export of all sessions from `/admin` (**Download all CSVs**, which gives all six CSVs, plus `sessions.json`). Store both in access-restricted team storage. Record its actual location and access permissions in the deployment log before collection.
- Folder layout: `study/backups/<YYYYMMDD>/` (database copies), `study/raw/<YYYYMMDD>/` (exports), `study/clean/` (redacted working copies), `study/pilot/` (pilot only, never mixed with main data).
- Never store data on personal laptops, USB sticks, email or public repositories.
- Check, once a day, that the completed count on `/admin` matches the newest export.

### 14.3 Redaction

Exit comments are read when data collection closes. Identifying details are redacted in `study/clean/`. The raw export stays unchanged but access-restricted.

### 14.4 Closing data collection

Do these in order:
1. Stop recruitment at 32 new-session completers after checking error-type and condition balance; report any shortfall separately.
2. Mark any remaining in-progress sessions abandoned.
3. Take a final `.backup` and a full export.
4. **Plan linkage removal only after closure and verified backups.** This is an operator procedure, not automatic behavior; record who will execute and verify it. To remove participation-code hashes, stop the server, then run
   `sqlite3 app/data/study.db "UPDATE sessions SET participant_hash = NULL;"`
   Delete the same column from every database backup, or delete the old backups and keep only the final one. Then destroy `PARTICIPANT_SALT` (remove it from the environment and password store, and remove `meta.participant_salt` if the server generated one).
5. Take the server offline, or point the URL at a "study closed" page.
6. Log the date and who did it.

After linkage removal, identify any deletion by session UUID and pid; a pid alone can refer to more than one session. No public remote request mechanism is established.

### 14.5 Deletion on request

1. Use **Delete (withdrawal)** on `/admin` (if the server is still running).
2. Remove the session's rows (by pid and `sessionId`) from every export, clean file and database backup.
3. Log the deletion (date, pid, by whom) without the reason.

### 14.6 Retention limits

No calendar retention period or designated deletion owner has been established for database backups, raw exports, cleaned files or host logs. These are operational decisions to document before collection, not values to invent in consent copy. Restrict access, keep pilot data separate and record any linkage erasure and deletion across all copies. Do not promise a deletion date until it can be honored.

## 15. Pilot protocol

### 15.1 Who and how

- **Participants:** the six Group 4 members, each completing the full study as a participant **before** looking at any pilot results.
- **Pilot sessions must never use main-study pids.** POST `/api/sessions` never assigns pids 901+, so pick one of:
  - **(a) a separate pilot database:** run the same build with `DB_PATH=data/pilot.db`. Pilots get pids 1–6 in that file only. Delete the file before the main study.
  - **(b) pids 901–906 in the main database**, created by the team through an admin pilot procedure. These are excluded from KPIs automatically.
  - Use (a) unless an explicit pilot-creation route is implemented and verified; do not assume (b) exists. Either way, check each pilot pid's assignment with the admin preview (`/api/admin/assignments/:pid`).
- The intended pilot assignments (the same formulas) cover all four condition orders:

| pid | Order | Rotation | Part 1 | Part 2 | Part 3 | Part 4 |
|---|---|---|---|---|---|---|
| 901 | A-B-D-C | 1 | A / S2 | B / S3 | D / S1 | C / S4 |
| 902 | B-C-A-D | 1 | B / S3 | C / S4 | A / S2 | D / S1 |
| 903 | C-D-B-A | 1 | C / S4 | D / S1 | B / S3 | A / S2 |
| 904 | D-A-C-B | 1 | D / S1 | A / S2 | C / S4 | B / S3 |
| 905 | A-B-D-C | 2 | A / S3 | B / S4 | D / S2 | C / S1 |
| 906 | B-C-A-D | 2 | B / S4 | C / S1 | A / S3 | D / S2 |

  With option (a), pilot pids 1–6 get the rows for pids 1–6 in §8 instead. That also covers all four orders.
- **At least 2 pilots on a phone and at least 2 on a desktop/laptop.** Each pilot uses their own code.
- Members who wrote post content (the post bank and the B/C/D text) are marked in the pilot log, and their detection rates aren't used to judge post difficulty.
- Each pilot also tries the incidents at least once across the team: refresh mid-part, close the tab and resume with the same code on another device, and a second attempt after completing with the same code on the same device (the Welcome screen shows a fresh **Start**; typing the code again gives "already taken part").

### 15.2 What to check

| Check | How | Target / action if missed |
|---|---|---|
| Session length | Admin median/p90; pilot notes | Measure eight-post duration and the burden of 64 block ratings; no validated target time yet. Preserve the agreed posts and measures. |
| Phone and desktop | Pilots on both | Every screen usable at 360 px; fact sheet opens as a bottom sheet on phones; no horizontal scroll; tap targets easy to hit. |
| Detection rate on wrong labels | `detectedError` on the 4 wrong labels per new session (8 in legacy), overall and split by false alarm vs miss and clear vs subtle | Overall **20–80%**. Under 20%: the errors are too hard to spot; over 80%: too obvious. Revise post or fact-sheet wording in `stimuli.md`. |
| Fact-sheet use | `factSheetOpened`, `factSheetOpenMs`; ask "Did you use the fact sheet? Why or why not?" | Opened at least sometimes by most pilots. If never, check the button's visibility; don't add prompting text. |
| Agree/Disagree clarity | Ask: "On a 'Likely misleading' label, what did Agree mean?" | Everyone answers correctly. If not, revise the instructions or button text. |
| "Why?" panel use (C) | `explanationOpened`, `factorsExpanded` | Opened at least once by most pilots; if never, check the button's visibility. |
| Two-tap flow and Undo | Pilot notes | No accidental submissions. Undo noticed. |
| Once-only and resume | The incident tries in §15.1 | Resume works across devices; a repeat attempt with the same code is blocked by the server; after the debrief, no `xai-study:` key except `xai-study:adminToken` is left in DevTools > Application, and **Next participant** opens a fresh landing page with no Continue banner. |
| Wording clarity | "Was any post, label, reason or fact sheet unclear?" | Fix unclear wording in `stimuli.md` and `posts.json`. |
| Stress items | "Were the tension and frustration questions clear and comfortable to answer?" | Clear; no pilot uncomfortable. |
| Admin and export | KPIs load; exports open in R or pandas | Loads with no manual cleanup; the pilot is excluded from KPIs (option b) or lives in its own database (option a). |

### 15.3 After the pilot

Any change made after the pilot goes in the deviations log with its reason, and the commit hash is recorded. Before the first main-study participant:
- Clear the pilot data (delete `data/pilot.db`, or delete the pilot sessions).
- Check that the main database has no sessions.

The main study then runs on one fixed build.

## 16. Deviations log template

Keep one log for the whole study (pilot and main). Record anything that differs from this protocol, however small, and any reported participant problem (without personal details).

| # | Date | Time | pid | sessionId (first 8 chars) | Logged by | Build (commit) | What happened | Action taken | Effect on data (none / flagged / excluded / deleted) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | |
| 2 | | | | | | | | | |
| 3 | | | | | | | | | |

Example entries:
- build changed after the pilot;
- server restarted or down for a period;
- blank screen observed on a phone;
- participant asked to restart after the 2-hour window;
- withdrawal and deletion by pid;
- session flagged as click-through before analysis;
- in-person participant stopped under the stop rule;
- participation hashes erased at close.

## 17. Remaining substantive protocol limits

- The app and docs do not establish institutional authorization for withheld information or affect measures.
- The Exit study button provides a remote early-stop debrief. Closing the tab instead can still bypass it; a verified post-participation deletion-request route remains unresolved. Stopping remains voluntary; it does not erase saved data.
- Retention periods, deletion ownership, deployment logging, compensation terms and actual storage permissions require documented decisions.
- Prior-knowledge collection is proposed and needs implementation verification.
- New-session selection, per-condition error-type balance across 32 completers and legacy resume preservation require implementation and export verification. Never pool the two session versions.
- The 64 required block ratings remain a substantial burden; duration and usability need pilot evidence. The target sample and counterbalancing are not a power analysis or evidence of novel findings.

---

## Related docs

- [`architecture.md`](architecture.md): system context, modules and ADRs
- [`system-design.md`](system-design.md): requirements, flows, screens, counterbalancing and risks
- [`sequence-diagrams.md`](sequence-diagrams.md): trial, fact-sheet, survey, resume and export interactions
- [`data-model.md`](data-model.md): post bank, session record, survey items and export formats
- [`ai-design.md`](ai-design.md): the Wizard-of-Oz labeller, planted errors, explanation rules and debrief content
- [`research-positioning.md`](research-positioning.md): why the domain changed to AI accuracy labels
- [`implementation-plan.md`](implementation-plan.md): build plan and milestones
- [`study-protocol.md`](study-protocol.md): this document
- [`stimuli.md`](stimuli.md): final participant-facing wording for all 24 posts, the practice post and the debrief
- [`wireframes.md`](wireframes.md): screen layouts
