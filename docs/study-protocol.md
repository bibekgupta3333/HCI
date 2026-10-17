# Study Protocol: Riverton Post-Label Study (v3.1, self-guided, open participation)

This document is the protocol for the CEN5728 Group 4 study on AI accuracy labels for social media posts: "When the AI label is wrong, do explanations help people catch it, and how do they make people feel?". From v3.1 the study is **self-guided**. Anyone opens the study link and starts on their own, on a lab laptop or their own device (desktop or phone). No researcher is needed to start or run a session. Each person takes part once, and the server enforces this with a hashed participation code. The research team only deploys the app, watches the admin dashboard (data and KPIs), handles emails and exports the data.

The document has two readers:
- The **ethics/IRB reviewer** needs the aims, risks, deception, consent, debrief and data handling in one place.
- The **research team** needs a deployment checklist, monitoring routine, incident handling, an assignment sheet and a pilot plan.

Where to find the rest:
- Design details (screens, counterbalancing code, logging, field names) are in `system-design.md`, `data-model.md` and `ai-design.md`.
- Participant-facing wording is in `stimuli.md`.
- The app's API contract is in `app/CONTRACT.md` and `app/CONTRACT-v2.md`.

Where this document and `_shared-decisions.md` disagree on the study design, `_shared-decisions.md` wins. On how participation works (self-start, once-only, admin role), `app/CONTRACT-v2.md` wins.

Two kinds of marker need the team before submission:
- [PLACEHOLDER: …] is a value the team must fill in. Don't guess these values.
- [TEAM DECISION: …] is a choice the team still has to agree on.

The moderated v3 protocol is in git history (commit `d72d2df`). The v2.1 protocol is archived at `archive/v2.1-agent-permission/study-protocol.md`.

---

## 1. Purpose

There's no moderator to keep sessions consistent, so the app does that job. Every participant gets the same screens, wording and timing, and differences in the data come from the four interface conditions. This protocol documents three things:
- how the team deploys and monitors the app so every session runs on the same build and the counterbalancing stays balanced;
- how the once-per-person rule works and where its limits are;
- the ethical safeguards for unmoderated participation: consent, limited deception, exposure to made-up misleading claims, stress measures, the debrief, pseudonymous data and withdrawal. These are written for the ethics/IRB submission and the course report.

## 2. Study summary

| Item | Detail |
|---|---|
| Title | Explanations and error detection in AI accuracy labels |
| Main question | When the AI label is wrong, do explanations help people catch it, and how do they make people feel? |
| Aims | **RQ1:** do explanations help people catch wrong labels, and does it differ for false alarms (a true post labeled "Likely misleading") vs misses (a false post labeled "Likely accurate")? **RQ2:** which explanation type gives the best error detection? **RQ3:** do wrong labels create tension, and does explanation type make it better or worse? Hypotheses H1–H6 are in `_shared-decisions.md`. |
| Format | **Self-guided web study.** The participant opens the study URL and goes through it alone. Nobody needs to be present. |
| Device | A lab laptop, or the participant's own device: desktop, laptop, tablet or phone (works from 360 px wide). Any current browser. |
| Task | The participant reads made-up social media posts from the fictional town of Riverton (fictional Alder County). Each post carries an AI label, "Likely accurate" or "Likely misleading". A "Fact sheet ▸" button opens a fictional official record about the post. Each post takes **two taps**: **Agree** or **Disagree** with the label, then a confidence chip from 1 to 7. |
| Apparatus | A Wizard-of-Oz web app: a React SPA plus a small Node/Express server with a SQLite file. No AI model runs; every label and explanation is scripted. **8 of the 24 labels are deliberately wrong** (4 false alarms, 4 misses). |
| Design | Within-subjects, 4 conditions: **A** No explanation (label only), **B** Static reason (one fixed sentence), **C** Interactive "Why?" (three expandable rows: Source, Claim vs record, Wording), **D** Counterfactual (one "would be … if …" sentence). There are 4 parts of 6 posts, one part per condition, plus 1 practice post. The pid sets the condition order (4×4 Williams square), the condition-to-set pairing and the within-part post order. A full cycle is 16 pids. |
| Assignment | **The server assigns the pid automatically.** It takes the lowest pid ≥ 1 that has no in-progress or completed session. Sessions with no activity for 2 hours are marked abandoned and their pid is **reused**. This keeps the 16-participant cycle balanced without anyone handing out numbers. |
| Measures | **Per post:** agreement, error detection (on wrong labels), confidence (1–7, required), decision time, fact-sheet use, "Why?" row use (C only). **Per part:** the Jian et al. (2000) trust scale (12 items), 2 fairness items, tension (1–7) and NASA-TLX frustration (0–100). **Exit:** demographics, social media use, how often they've seen platform labels, preferred interface and an open comment. |
| Sample size | **Target N = 32 completers (2 Williams cycles); minimum N = 16 (1 cycle).** Data collection closes only once a whole cycle is complete (16 or 32). |
| Duration | **About 15–20 minutes**, in one sitting. |
| Compensation | [PLACEHOLDER: compensation, for example none / course credit / amount] |

## 3. Eligibility and exclusions

### 3.1 Eligibility

**Anyone aged 18 or over who can read English may take part. There are no other criteria.**
- Participants must be adults so they can consent for themselves. Minors would need parental consent and a different approval.
- There's no requirement on social media use, background, field of study, device or prior knowledge.
- Screen zoom, screen readers, glasses and phones are all fine.

The participant confirms they're 18+ on the consent screen ("By clicking 'I agree', you confirm that you are 18 or older…"). This is self-report; nobody checks it.

**Prior knowledge of the project.** In the moderated v3 protocol, the moderator asked whether the participant had heard about the project before (for example, from the class presentation). Without a moderator, this question moves to the exit survey. It's asked after the task, so it can't prime the participant. Nobody is excluded on the answer; it's only used for a sensitivity analysis that reruns the results without people who said yes.
- [TEAM DECISION: add exit-survey item "Had you heard about this project before taking part?" (Yes / No / Not sure). This needs a change to the exit survey and the data model before the pilot.]

### 3.2 Exclusions

There are only two exclusions. Nobody is excluded for demographics, social media habits, device or performance.

1. **Group 4 members** take part in the **pilot only** (§15), because they wrote the posts and know which labels are wrong. Pilot sessions use pids **901+** or a separate pilot database, and never count toward the main study.
2. **Each person takes part once.** A second session would be contaminated by the first debrief, which reveals the wrong labels. §3.3 explains how this is enforced.

### 3.3 Once per person: the participation code

**What the participant does.** On the Welcome screen (`/start`, reached from **Take part** on the landing page), before consent, the participant types a short personal **participation code**, such as their university email or student ID. A one-line note under the field explains that the code is used only to stop people taking part twice, and that it isn't stored.

**What the server does** (`app/CONTRACT-v2.md` §A):
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

**Limitations, and why they're acceptable:**
- Someone could take part twice by typing **two different codes**, for example their email and then their student ID, on different browsers. The app can't detect this without collecting real identities, which would cost more privacy than the risk is worth.
- This is acceptable because:
  - there's no incentive to repeat: nothing rewards performance, and any compensation is per person [PLACEHOLDER];
  - the consent text asks people to take part only once;
  - the debrief asks people not to share the study's details;
  - a repeat participant would know the wrong labels and show near-ceiling detection. That pattern can be spotted in the data, and the team decides on such sessions **before** looking at condition results (§12.1);
  - in-person lab sessions (§10) give an extra check, because the team member present sees each person.
- The browser keeps **no** record that someone has taken part. Once-only rests entirely on the server's check of the hashed code, so a returning person is stopped only if they type the same code again.
- Typos are a second limit. A participant who mistypes their code on a return visit gets a new session instead of resuming. The admin dashboard shows this as an abandoned session plus a new one, which is harmless: the abandoned pid is reused.

## 4. Ethics and risk

### 4.1 Risk level

The study is **minimal risk**. Participants read short fictional posts, tap buttons and answer questionnaires. The risks are no greater than everyday social media use: mild boredom or fatigue, and possibly mild tension or frustration when a label seems wrong.

This study changes the approved proposal (a new domain, a fourth condition, added tension and frustration measures) and is now unmoderated. Before any main-study session runs, it needs:
- Professor Hamam's approval;
- ethics approval, including approval for **unmoderated online participation**.

[PLACEHOLDER: IRB/ethics approval number and date]

### 4.2 Deception

- **What is withheld.** Participants are told they're evaluating "an AI tool that labels social media posts". They're not told that the labels are scripted, or that 8 of the 24 labels are deliberately wrong.
- **Why it's needed.** The study measures whether people notice wrong labels, and how explanations change that. If participants knew errors were planted, or which kinds, they'd hunt for them, and agreement and detection would no longer reflect how people normally treat platform labels. A scripted labeller is also the only way to give every participant identical labels and identically worded explanations across conditions.
- **Why it's acceptable.** The deception is mild. It concerns only the source and accuracy of the labels, causes no harm, and has no consequences outside the session. Participants are never misled about the procedure, duration, data use or their rights.
- **Disclosure.** The debrief screen appears automatically straight after the exit survey (§13). It explains the deception and shows the real facts. Participants may still withdraw their data once they know the true purpose (§4.6).
- **Limitation of the unmoderated format.** A participant who closes the page before the end never reaches the debrief. The consent text says that "some parts of the study will be explained at the end", and gives the contact email. Anyone who writes in gets the debrief text by email (§13.3). [TEAM DECISION: whether the IRB requires a debrief link (a public page with the §13 text) in the consent text, so people who stop early can still read it.]

### 4.3 Exposure to made-up misleading claims

Half the posts (12 of 24) make false claims, and 4 of those are labeled "Likely accurate". A participant could leave believing a false claim. Mitigations:
- **Everything is fictional.** The town (Riverton), county (Alder County), people, accounts and agencies are invented. No false claim is about a real place, person or organization, and there are no real brands.
- **No health-risk claims.** No post makes a claim that could cause harm if believed (for example about medicines, treatments or safety actions), and no post touches health care. Posts about local services (such as a parking rate or tap-water results) concern the fictional town only, and the debrief corrects them.
- **The debrief corrects every wrong label.** The debrief screen states plainly that **none of these posts were real**. Its "Show the real facts" section gives the real fact for each of the 8 wrong labels (§13.2).

### 4.4 Stress measures and distress without a moderator

Each part asks how tense the participant felt, and includes the NASA-TLX frustration item. These are standard workload items about the task, not about personal life, and are unlikely to cause distress. The debrief stresses that missing some wrong labels is common and says nothing bad about the participant.

Nobody is present to watch for distress, so the safeguards are built into the text and the app:
- **Stopping is always possible.** The consent text says the participant can stop at any time by **closing the page**, without giving a reason and without penalty. Nothing else is needed.
- **Contact and support.** The consent and debrief screens give the researcher contact email [PLACEHOLDER: researcher contact email]. The debrief also gives [PLACEHOLDER: campus support service contact].
- **Abandoned sessions are handled automatically.** A session with no activity for 2 hours is marked `abandoned`. Its pid goes to the next new participant. The partial data is kept unless the participant asks for it to be deleted (§4.6).
- **Emails about distress.** If a participant emails about feeling upset, a team member replies within [PLACEHOLDER: response time, for example 2 working days]. The reply includes the debrief text (§13), the support contact and an offer to delete their data. Log it in the deviations log without personal details.
- **In-person lab sessions** (§10): the team member present follows the stop rule there.

### 4.5 Data minimisation and pseudonymity

- **The app records no names**, emails, student IDs, social media handles or exact birth dates. Age is collected as a range.
- **The participation code is never stored.** The server keeps only its salted HMAC hash, which lets it recognise the same code again.
  - The hash is **pseudonymous data**, not anonymous data. Anyone with the salt and a candidate email address could test whether that address took part. So the team treats the hash and the salt as confidential:
    - the salt is set only in the server's environment and is never committed to git or shared;
    - the hash is **not included in any export** [TEAM DECISION: confirm with the server owner that exports omit `participant_hash`];
    - the SQLite file is access-restricted (§14).
  - **When it's deleted:** all hashes are erased (set to NULL) and the salt destroyed **as soon as data collection closes** (§14.4). From then on, the dataset is linked only by pid and can't be traced back to a code. [PLACEHOLDER: date data collection closes]
- **Network data.** The server doesn't store IP addresses. The reverse proxy or hosting platform may keep access logs. [PLACEHOLDER: the proxy/host's log retention, and whether it can be turned off or shortened]
- **Free text.** The exit comment is the only free-text field. Its label asks participants not to include identifying details. The team checks comments before data is shared, and redacts any personal details in the clean copy.

### 4.6 Withdrawal

- Participation is voluntary. A participant can stop at any time by closing the page.
- After taking part, a participant may ask for their data to be deleted by emailing [PLACEHOLDER: researcher contact email] and **quoting their participant number (pid)**, which is shown on the debrief screen. This works until [PLACEHOLDER: withdrawal deadline, for example end of semester].
- Someone who stopped early never saw their pid. They can quote the participation code they used instead. The team member hashes it with the same salt, through the server, to find the session. This works only while data collection is open; after that the hashes are deleted (§4.5).
- On a valid request, a team member deletes the session with **Delete (withdrawal)** on `/admin`, removes it from every exported file (§14.5), and logs the deletion (date, pid, by whom) without the reason.

## 5. Consent text (draft)

Shown on the consent screen as a short text, with the full text under "Read full consent details". Final wording is in `stimuli.md` and must match the app.

> **Consent to take part in a research study**
>
> **Study:** How people use AI labels on social media posts
> **Researchers:** CEN5728 Group 4, [PLACEHOLDER: institution]. Supervisor: [PLACEHOLDER: instructor name].
> **Approval:** [PLACEHOLDER: IRB/ethics approval number]
>
> We're studying how people use an AI tool that labels social media posts. You'll read 24 short posts about a made-up town. Each post has a label from the AI tool, and you decide whether you agree with it. You'll also answer short questions, including how tense or frustrated you felt. It takes about 15–20 minutes, and you do it on your own.
>
> All posts, people and places are fictional, and some posts contain claims that aren't true. The risks are no greater than normal social media use. Some parts of the study will be explained fully at the end.
>
> We don't record your name. The code you typed is only used to stop people taking part twice: we keep a scrambled version of it, never the code itself, and delete it when the study closes. Your answers are stored under a number and reported only as group results. Please take part only once, and don't type personal details in the comment box.
>
> Taking part is voluntary. You can stop at any time by closing this page. You can also ask us to delete your answers later, without any penalty.
>
> Questions or concerns: [PLACEHOLDER: researcher contact email]. Your rights: [PLACEHOLDER: IRB office contact].
>
> By clicking "I agree", you confirm that you are 18 or older and agree to take part.

The app stores only the consent timestamp: no signature, no name. [PLACEHOLDER: whether the IRB accepts click-through consent for unmoderated participation]

## 6. Recruitment message (draft)

> **Take part in a 15–20 minute study on AI labels for social media**
>
> Hi! We're a student team in CEN5728 (Advanced HCI) at [PLACEHOLDER: institution], running a short study on how people use an AI tool that labels social media posts.
>
> - **What:** read 24 short made-up posts, each with an AI label, decide whether you agree with each label, and answer a few quick questions.
> - **Time:** about 15–20 minutes, whenever suits you, on your phone or computer.
> - **Who:** anyone aged 18 or over who reads English. No experience with social media or AI is needed.
> - **Compensation:** [PLACEHOLDER: compensation or "none"].
>
> **Start here:** [PLACEHOLDER: study URL] (or scan the QR code)
>
> Taking part is voluntary, and we don't collect your name. Please take part only once. Questions: [PLACEHOLDER: contact email].
>
> Approved by [PLACEHOLDER: IRB/ethics approval number].

Rules for recruitment:
- The link and the QR code point to the **landing page** (the study URL's root, `/`), not to `/start`. The landing page repeats this message's facts (what, time, who, once per person, privacy, contact) and has the **Take part** button, so people who arrive from a poster or a forwarded link get the same information.
- Generate the QR code from the final study URL, and test it on a phone before printing: it should open the landing page, and **Take part** should open the code screen.
- Don't mention that the labels can be wrong, that they're scripted, or words such as "errors", "mistakes", "false alarms", "misses", "fake news" or "fact-checking".
- Recruitment is open to everyone. Spread it beyond the class where possible: other departments, campus noticeboards, friends and family over 18. A mixed sample makes the results more general than a sample of HCI students.
- Don't post the link anywhere minors are the main audience.
- **The landing page text is recruitment text**, so every rule above applies to it, and it must agree with this message: anyone aged 18 or over who reads English, once per person, about 15–20 minutes, anonymous with only a scrambled code kept, stop at any time, the contact address. It and its FAQ must not hint that labels can be wrong or scripted. Replace its contact and institution placeholders when ethics approves them, and re-check the page whenever this message changes.

## 7. Deployment checklist

Do this once before the pilot. Repeat the starred items (★) if the build changes. Everyone uses the **same build** from the pilot onward, except for the documented post-pilot fixes (§15.3).

### 7.1 Choose where it runs

- **Option 1: hosted for own-device participation (the normal case).** Run the server on a machine participants can reach, with `HOST=0.0.0.0`, **behind HTTPS** (a reverse proxy such as Caddy or nginx with a certificate, or the host's TLS). Never expose the plain HTTP port to the internet.
- **Option 2: lab laptop only.** Run it on a lab laptop on `localhost` (the default `HOST=127.0.0.1`). Participants use that laptop in person (§10). Admin works from the same laptop without a token, because admin routes are allowed from loopback when `ADMIN_TOKEN` is unset.

[TEAM DECISION: which machine and URL hosts the study. PLACEHOLDER: study URL]

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

## 8. Assignment sheet (pid → condition order and sets)

The server assigns pids itself (§2), so the team doesn't hand them out. This sheet is for **checking** what the server did (in the admin preview and balance grid) and for analysis. One cycle is 16 pids, and pid 17 repeats pid 1's order and sets (17 = 1, 18 = 2, …, 32 = 16). Only the seeded within-part post order differs.

The sheet is computed from the shared formulas in `_shared-decisions.md`:
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

**Why reuse keeps balance.** A pid becomes free again only when its session is abandoned or deleted, and the next new participant takes the lowest free pid. Gaps fill before the cycle moves on, so when 16 sessions are completed, pids 1–16 are all completed. The admin balance grid should then show each of the 4 orders 4 times.

## 9. Admin role: monitoring, KPIs and exports only

The admin panel (`/admin`, protected by `ADMIN_TOKEN`) **doesn't start sessions**. Participants start their own. A team member checks it at least **once a day** while data collection is open (it auto-refreshes every 15 s).

| What to watch | Where | What it should look like | Action if not |
|---|---|---|---|
| Completed vs target | KPI cards and progress toward N = 32 (min 16) | Rising; cycle 1 (pids 1–16) fills before cycle 2 | Push recruitment. Close only at 16 or 32 completers. |
| Completion rate | KPI card | Most started sessions complete (aim > 70%) | Many abandons at the same screen point to a usability bug: check the sessions table's progress (x/24) and fix it via the deviations log. |
| Median and p90 session time | KPI card | Median 15–20 min, p90 ≤ 30 min | Much longer: check instruction length and phone layout. Much shorter (< 8 min): possible click-through; see §12.1. |
| Balance grid | Completed sessions by condition order | Each order within 1 of the others; exactly 4 each at 16 and 8 each at 32 | Check for stale in-progress sessions holding pids. Never edit assignments by hand. |
| Detection rates (sanity check only) | Per-condition and per-error-type table | Overall detection on wrong labels roughly 20–80% | Near 0% or 100% everywhere suggests a bug (for example the wrong label shown) or leaked study details. Don't use these numbers to change the study mid-way. |
| Stale sessions | Sessions table: `in_progress` with old "last activity" | The server marks them abandoned after 2 h, at the next session start | Leave them. Use **Abandon** only if a participant emails to say they've stopped. |
| Withdrawals | Email | — | **Delete (withdrawal)** on the session, then §14.5. |

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

> "Thanks for coming. Everything is explained on the screen, and it takes about 15 to 20 minutes. Please type your university email or student ID where it asks. It's only used to stop people taking part twice. I'll be over there, but I can't help with the decisions, because we're interested in how you decide on your own. If you want to stop at any point, just say so or close the page."

**Rules while they work:**
- Sit out of their line of sight and don't watch the screen.
- Never hint that labels can be wrong, and never say whether a label or post is right.
- If asked about the AI, a post or a label, say only: "Please use your own judgement. The end of the study explains more."
- Answer questions about the controls only ("tap Agree or Disagree, then how sure you are").

**Stop rule.** If the participant seems distressed, or asks to stop, say: "Would you like to take a break, or stop here? Either is completely fine." If they stop, show them the debrief text (§13, printed copy), give the contact and support details, and offer deletion (§4.6). Log it.

**At the end:** "Thanks for your help. The last screen has the contact email if you have questions later."

## 11. Participant flow

| # | Screen | What the participant does | Approx. time | Cumulative |
|---|---|---|---|---|
| 1 | Landing page, then Welcome (`/start`) | Reads the landing page (how it works, who can take part, privacy, FAQ); **Take part**; types the participation code; **Start** (or **Continue** in the landing banner if resuming) | 0.5 min | 0.5 min |
| 2 | Consent | Reads the short text (full details on demand), ticks the box, Continue | 1 min | 1.5 min |
| 3 | Instructions + practice | One screen with 3 bullet points and 1 practice post (not logged as a trial) | 1.5 min | 3 min |
| 4 | Part 1: 6 posts | Per post: ~800 ms "AI is checking…", then **Agree/Disagree**, then a confidence chip **1–7**. That's two taps; there's a 1 s Undo. Fact sheet and "Why?" (C) are optional. | 2–2.5 min | 5.5 min |
| 5 | Survey after Part 1 | One screen: 12 trust items (matrix), 2 fairness, tension, frustration slider ("x of 16 answered") | 1–1.5 min | 7 min |
| 6–11 | Parts 2–4 + surveys | Same as 4–5, in the pid's condition order | 3.5 min each | 17.5 min |
| 12 | Exit survey | One screen, chips and radios; reminder not to type personal details | 1 min | 18.5 min |
| 13 | Debrief | Reads the debrief; "Show the real facts"; sees their pid and the contact email | 1–1.5 min | 20 min |

The header always shows "Post n of 24" and "Part x of 4". There's no time limit. A session over 40 minutes, excluding breaks, gets a timing flag in the analysis (see `data-model.md`), not an exclusion.

## 12. Incident handling (self-guided)

There's nobody on hand to fix problems, so the app and the contact email do this job. Log every incident the team learns about in the deviations log (§16).

| Incident | What happens / what to do |
|---|---|
| **Page refresh or accidental navigation** | The app saves after every post and survey, and resumes at the first unanswered screen. The interrupted post is shown again and flagged `resumed = true`. Hidden time is logged (`hiddenMs`, `timingFlag`). Nothing to do. |
| **Closed tab or browser** | Within **2 hours** of the last activity, the participant reopens the URL. On the same browser they tap **Continue**; on any browser they type the **same code** and tap **Start**. The session resumes where it stopped. |
| **Device change** (for example from a phone to a laptop) | Same as above: open the URL on the new device and type the same code within 2 hours. The resume count is logged. |
| **Returns after more than 2 hours** | The session has been marked abandoned and its pid reused, so the code now gets "You've already taken part". If they email, explain that the partial answers are kept unless they ask for deletion. [TEAM DECISION: whether to let them restart by deleting the abandoned session on `/admin`, which frees the code. This is only acceptable if they never reached the debrief, which is always true for an abandoned session.] |
| **"You've already taken part"** | Shown only when the server refuses the typed code (409), never from browser state. Expected for anyone who completed the study, and in the cases above. The message is final; nobody gets a second session after a completed one. If someone emails to say they've never taken part, they may be typing a code someone else already used (for example a shared lab account): ask them to use their own university email or student ID. |
| **Finishes, then returns on the same device** | The browser holds nothing from their session, so they see a fresh **Start**. If they type the same code, the server stops them with "You've already taken part". If they type a different code, they get through; this is the limit in §3.3. |
| **Mistyped code on return** | A new session starts. The old one becomes abandoned after 2 h and its pid is reused. No action. |
| **Technical failure** (blank screen, error message, "not saved" warning) | The screen points to the contact email. Ask the participant for the device, browser, the screen it failed on and any error text, and pass it to the technical owner. Don't ask for their code by email unless it's needed to find the session. If a bug affects a screen everyone sees, pause recruitment, fix it, and log the build change (§16). |
| **Distress** | §4.4. |
| **Withdrawal request** | §4.6 and §14.5 (data deletion). |

### 12.1 Sessions to review before analysis

These are decided **before** looking at condition results, using only the session data (not condition outcomes). Log each decision.
- **Click-through:** for example, a median decision time under 1 s across a whole part, or the same confidence on all 24 posts.
- **Probable repeat participant:** near-ceiling detection, together with comments revealing knowledge of the design.
- **Self-reported prior knowledge** (if the exit item in §3.1 is added): kept in the main analysis and dropped in the sensitivity analysis.

## 13. Debrief

### 13.1 Debrief text (as shown on screen)

The debrief screen appears automatically after the exit survey. It must match the app (`src/study/DebriefScreen.tsx`) and `stimuli.md` word for word. Change all three together. It has **no** "call the researcher" line; it's self-guided.

> **Thank you!**
>
> That's the end of the tasks. Here is more about the study.
>
> - **None of these posts were real.** Riverton, Alder County, the people, the accounts and the agencies were all made up by our team. Some posts made claims that were not true, and they are not true anywhere.
> - The AI tool was not a real AI. Every label and every reason it gave was written in advance by our research team.
> - **8 of the 24 labels were deliberately wrong.** There were two kinds of mistake. A **false alarm** is when a true post is labeled "Likely misleading" (4 posts). A **miss** is when a false post is labeled "Likely accurate" (4 posts). We wanted to see whether people notice each kind, and whether the way the AI explains itself makes a difference. That's why the screen looked a little different in each of the four parts.
> - Agreeing with some of the wrong labels is very common and has been found in many studies, especially when a label says a post is accurate. It says nothing bad about you; it's exactly what we're studying.
> - We didn't tell you this at the start because knowing that mistakes were planted would have changed how you read every post. We're sorry for not telling you beforehand.
>
> **[Show the real facts ▾]** (the table in §13.2)
>
> **Your data.** Now that you know the real purpose, you can still ask us to delete your answers, now or later, by contacting the research team ([PLACEHOLDER: researcher contact email]) before [PLACEHOLDER: withdrawal deadline] and quoting your participant number: **[pid]**.
>
> If taking part left you feeling upset, you can contact [PLACEHOLDER: campus support service contact].
>
> Please **don't tell anyone else that some labels were wrong** until the study is finished, because people who know in advance would behave differently and that would spoil our results.
>
> You can now close this page.
>
> **[Next participant]** (returns to the landing page; for shared lab devices)

The support-contact line and the closing line are new in v3.1. [TEAM DECISION: confirm with the flow-screens owner that both are in `DebriefScreen.tsx`.]

### 13.2 The real facts (the "Show the real facts" section)

Final wording is in `stimuli.md`; this table gives the content.

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

### 13.3 Debrief by email

If someone who stopped early, or anyone else, writes to the contact email about the study, reply with the §13.1 text and the §13.2 table, plus the withdrawal offer.

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

- **Daily** while collection is open: run the `.backup` command (§7.2) and an export of all sessions from `/admin` (**Download all CSVs**, which gives all six CSVs, plus `sessions.json`). Copy both to [PLACEHOLDER: team private course drive location]. Access is limited to Group 4 members and the instructor.
- Folder layout: `study/backups/<YYYYMMDD>/` (database copies), `study/raw/<YYYYMMDD>/` (exports), `study/clean/` (redacted working copies), `study/pilot/` (pilot only, never mixed with main data).
- Never store data on personal laptops, USB sticks, email or public repositories.
- Check, once a day, that the completed count on `/admin` matches the newest export.

### 14.3 Redaction

Exit comments are read when data collection closes. Identifying details are redacted in `study/clean/`. The raw export stays unchanged but access-restricted.

### 14.4 Closing data collection

Do these in order:
1. Stop recruitment, at 16 or 32 completers.
2. Mark any remaining in-progress sessions abandoned.
3. Take a final `.backup` and a full export.
4. **Delete the participation-code hashes:** stop the server, then run
   `sqlite3 app/data/study.db "UPDATE sessions SET participant_hash = NULL;"`
   Delete the same column from every database backup, or delete the old backups and keep only the final one. Then destroy `PARTICIPANT_SALT` (remove it from the environment and password store, and remove `meta.participant_salt` if the server generated one).
5. Take the server offline, or point the URL at a "study closed" page.
6. Log the date and who did it.

From then on, withdrawal works by pid only.

### 14.5 Deletion on request

1. Use **Delete (withdrawal)** on `/admin` (if the server is still running).
2. Remove the session's rows (by pid and `sessionId`) from every export, clean file and database backup.
3. Log the deletion (date, pid, by whom) without the reason.

### 14.6 Retention schedule

| Item | Kept until | Then |
|---|---|---|
| `participant_hash` values and `PARTICIPANT_SALT` | Data collection closes [PLACEHOLDER: date] | Erased (§14.4) |
| `app/data/study.db` on the study machine | Final backup confirmed | Deleted from the study machine |
| Database backups and raw exports | [PLACEHOLDER: retention period required by the IRB] | Deleted by [PLACEHOLDER: responsible member] |
| Cleaned, pseudonymous analysis files (pid only) | [PLACEHOLDER: retention period] | Deleted, or kept for publication if consent and the IRB allow |
| Pilot data (`study/pilot/`, pilot database) | Main study start | Deleted |
| Reverse-proxy/host access logs | [PLACEHOLDER: host log retention] | Deleted or rotated |

## 15. Pilot protocol

### 15.1 Who and how

- **Participants:** the six Group 4 members, each completing the full study as a participant **before** looking at any pilot results.
- **Pilot sessions must never use main-study pids.** POST `/api/sessions` never assigns pids 901+, so pick one of:
  - **(a) a separate pilot database:** run the same build with `DB_PATH=data/pilot.db`. Pilots get pids 1–6 in that file only. Delete the file before the main study.
  - **(b) pids 901–906 in the main database**, created by the team through an admin pilot procedure. These are excluded from KPIs automatically.
  - [TEAM DECISION: (a) needs no code change and is recommended. (b) needs a server owner to add an admin "create pilot session" route.] Either way, check each pilot pid's assignment with the admin preview (`/api/admin/assignments/:pid`).
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
| Session length | Admin median/p90; pilot notes | **≤ 20 min** median. If longer, trim instruction text, not posts or measures. |
| Phone and desktop | Pilots on both | Every screen usable at 360 px; fact sheet opens as a bottom sheet on phones; no horizontal scroll; tap targets easy to hit. |
| Detection rate on wrong labels | `detectedError` on the 8 wrong labels, overall and split by false alarm vs miss and clear vs subtle | Overall **20–80%**. Under 20%: the errors are too hard to spot; over 80%: too obvious. Revise post or fact-sheet wording in `stimuli.md`. |
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

Keep one log for the whole study (pilot and main). Record anything that differs from this protocol, however small, and any email from a participant about a problem (without personal details).

| # | Date | Time | pid | sessionId (first 8 chars) | Logged by | Build (commit) | What happened | Action taken | Effect on data (none / flagged / excluded / deleted) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | |
| 2 | | | | | | | | | |
| 3 | | | | | | | | | |

Example entries:
- build changed after the pilot;
- server restarted or down for a period;
- participant emailed about a blank screen on a phone;
- participant asked to restart after the 2-hour window;
- withdrawal and deletion by pid;
- session flagged as click-through before analysis;
- in-person participant stopped under the stop rule;
- participation hashes erased at close.

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
