# Study Protocol: Study 1 Sessions (TaskPilot agent approvals)

This document is the protocol for running Study 1 of the CEN5728 Group 4 project, "Do people trust AI more when it explains itself?". It serves two readers. The first is the ethics/IRB reviewer, who needs the aims, risks, deception, consent, debrief and data handling in one place. The second is the moderator, who needs a checklist, a script with exact lines, a timeline and instructions for what to do when something goes wrong. Design details (screens, counterbalancing, logging) live in `system-design.md`, `data-model.md` and `ai-design.md`. Where this document and `_shared-decisions.md` disagree, `_shared-decisions.md` wins. Anything in square brackets, such as [PLACEHOLDER: IRB number], must be filled in by the team before submission. Do not guess these values.

---

## 1. Purpose

This protocol makes every Study 1 session run the same way, whoever moderates it, so that differences in the data come from the three interface conditions and not from the moderator. It also documents the ethical safeguards (consent, limited deception, debrief, anonymous data, withdrawal) for the ethics/IRB submission and the course report.

## 2. Study summary

| Item | Detail |
|---|---|
| Title | Explanation depth and trust in an AI assistant agent |
| Research question | Do people agree with and trust an AI agent more when it explains its calls, and does a deeper explanation help them catch its mistakes? |
| Aims | (1) Compare agreement, trust, perceived control and decision time across three explanation depths. (2) Measure how often participants catch an agent's wrong calls in each condition, split by error type (`false_allow` vs `false_block`) and by which rule was broken. Hypotheses H1–H6 are listed in `_shared-decisions.md`. |
| Task | The participant supervises **TaskPilot**, a fictional personal AI assistant agent. For each of 15 proposed actions (purchases, payments, emails, calendar invites, file shares) TaskPilot checks the action against the participant's delegation policy and says ALLOW or BLOCK. The participant clicks **Agree** or **Override**. |
| Apparatus | A Wizard-of-Oz web app (React SPA) on a lab laptop. No AI model runs: every call is scripted. 6 of the 15 calls are deliberately wrong. |
| Design | Within-subjects, 3 conditions: **A** Black Box (call only), **B** Static Explanation (call + one sentence), **C** Interactive Explanation (call + "Why?" per-rule breakdown). 3 blocks of 5 trials, one block per condition. Condition order, set-to-condition pairing and within-block trial order are counterbalanced from the pid (full cycle every 18 pids). |
| Measures | Per trial: agreement, time-to-decision, policy panel use, breakdown use (C), optional confidence. Per block: Jian et al. (2000) trust scale (12 items), 2 perceived control/accountability items, tension (1–7), NASA-TLX frustration (0–100). Exit: age range, gender (optional), education, AI assistant use, preferred interface, open comment. |
| Sample size | **N ≥ 18 completers, in multiples of 18** (18, 36, …), so every counterbalancing cell is filled equally. |
| Eligibility | Adults aged 18 or over; able to read and respond in English; no prior knowledge of the study hypotheses (for example, not someone who has read this team's proposal or attended its presentation). Normal or corrected-to-normal vision sufficient to read a laptop screen. |
| Exclusions | Members of Group 4 take part **only in the pilot** (pids 901–906) and never in the main sample. People who have already completed a session cannot take part again. |
| Duration | About 20–25 minutes per participant, in one moderated session. |
| Setting | In person, one participant at a time, in a quiet room with a moderator present. |
| Compensation | [PLACEHOLDER: compensation, for example none / course credit / amount] |

## 3. Ethics and risk

### 3.1 Risk level

The study is **minimal risk**. Participants read short fictional scenarios on a laptop, click buttons and answer questionnaires. No real money, accounts, messages or files are involved. The risks are no greater than everyday computer use: mild boredom or fatigue, and possibly mild frustration or tension when the agent seems to make mistakes.

### 3.2 Deception

- **What is withheld.** Participants are told they are evaluating "an AI assistant interface". They are not told that TaskPilot is scripted, or that 6 of its 15 calls are deliberately wrong.
- **Why it is needed.** The study measures whether people notice an agent's errors and how explanations change that. If participants knew errors were planted, or knew which kinds (over budget, lookalike addresses, prompt injection), they would hunt for them, and the agreement and detection measures would no longer reflect normal supervision. A scripted agent is also the only way to give every participant identical calls and identically worded explanations across conditions.
- **Why it is acceptable.** The deception is mild, concerns only the source and accuracy of the calls, causes no harm, and has no consequences outside the session. Participants are never misled about the procedure, duration, data use or their rights.
- **Disclosure.** Every participant is fully debriefed straight after the session (§10), both on screen and verbally, and may withdraw their data once they know the true purpose.

### 3.3 Affect measures

Each block asks how tense, irritated, stressed or annoyed the participant felt. These are standard workload items (NASA-TLX frustration, plus a tension rating) about the task, not about personal life. They are unlikely to cause distress. A participant may skip the session at any point (§9.4). The debrief stresses that agreeing with a wrong call is common and says nothing bad about the participant.

### 3.4 Fictional data only

Every person, email address, vendor and amount in the scenarios is invented. Domains use `.example` or the fictional `northwind.edu` (and its planted lookalike `northwlnd.edu`). The participant always plays "you", the account owner, and never enters their own contacts, accounts or payment details.

### 3.5 Anonymity

- Each participant is identified only by an anonymous numeric **pid** that the moderator enters. No names, emails, student IDs, IP addresses or exact birth dates are entered into the app. Age is collected as a range.
- If the team keeps a sign-up list (names, times), it is kept separately from the data, offline or on paper, and the pid is **never** written next to a name. The pid sheet (§6.2) holds pids, dates and status only.
- The exit comment is the only free-text field. The moderator reminds the participant not to include identifying details, and the team checks comments before the data is shared.

### 3.6 Data storage

Responses are saved in the lab laptop's browser storage (`localStorage`) after every trial and survey. After each session the moderator exports the data from `/admin` and moves the files to the team's private course drive (§11). The optional online backup (Google Apps Script) sends only the anonymous session record and is used only if the IRB approves it [PLACEHOLDER: whether online backup is approved].

### 3.7 Withdrawal

Participation is voluntary. A participant may stop at any time, without giving a reason and without penalty. They may also ask, during or after the session, for their data to be deleted. On request, the moderator deletes that session from `/admin` and from any exported files (§9.4, §11.4). After the anonymous data has been pooled and analysed, a session can still be identified and deleted by its pid until [PLACEHOLDER: withdrawal deadline, for example end of semester], provided the participant gives their pid (written on the debrief card).

## 4. Consent form (draft)

> **Consent to take part in a research study**
>
> **Study:** How people supervise an AI assistant that acts on their behalf
> **Researchers:** CEN5728 Group 4, [PLACEHOLDER: institution]. Supervisor: [PLACEHOLDER: instructor name].
> **Approval:** [PLACEHOLDER: IRB/ethics approval number]
>
> We are studying how people work with an AI assistant interface. You will see 15 actions that an AI assistant proposes to carry out for you, such as buying an item or sending an email. For each one you decide whether to go along with the assistant. You will also answer short questionnaires about your experience. The session takes about 20–25 minutes.
>
> All scenarios are fictional. No real money, accounts or messages are involved. The risks are no greater than normal computer use. Some parts of the study will be explained to you fully at the end.
>
> We do not record your name. Your answers are stored under a number only and will be reported as group results. Please do not type personal details in the comment box.
>
> Taking part is voluntary. You can stop at any time without giving a reason, and you can ask us to delete your answers, now or later, without any penalty.
>
> Questions: [PLACEHOLDER: researcher contact email]. Concerns about your rights: [PLACEHOLDER: IRB office contact].
>
> By clicking "I agree", you confirm that you are 18 or older and agree to take part.

The in-app `ConsentScreen` shows this text. The moderator also has a printed copy to give the participant to keep. The app stores only the consent timestamp (`consentAt`), no signature or name. If the IRB requires a signed form, use a paper form that is filed separately from the data [PLACEHOLDER: signed or click-through consent].

## 5. Recruitment message (draft)

> **Subject: Take part in a 25-minute study on AI assistants**
>
> Hi! We are a student team in CEN5728 (Advanced HCI) at [PLACEHOLDER: institution]. We are running a short study on how people work with an AI assistant interface.
>
> - **What:** review 15 actions an AI assistant proposes (like buying an item or sending an email) and answer a few short questionnaires.
> - **Time:** about 20–25 minutes, in person, at [PLACEHOLDER: location].
> - **Who:** anyone aged 18 or over who reads English.
> - **Compensation:** [PLACEHOLDER: compensation or "none"].
>
> Taking part is voluntary and anonymous. To book a time, reply to [PLACEHOLDER: contact email] or use [PLACEHOLDER: sign-up link].
>
> Approved by [PLACEHOLDER: IRB/ethics approval number].

Do not mention in recruitment that the AI makes mistakes, that it is scripted, or terms such as "prompt injection", "phishing", "lookalike" or "errors". Do not recruit people who know the study hypotheses, such as classmates who saw the proposal presentation.

## 6. Lab setup checklist

### 6.1 Before each session (about 10 minutes)

- [ ] Lab laptop charged or plugged in; external mouse connected.
- [ ] Latest build running from a clean checkout (`npm run build` + `npm run preview`, or the agreed hosted copy). Check that the version shown on `/admin` matches the version in the deviations log; the same build must be used for every session.
- [ ] Browser: [PLACEHOLDER: agreed browser, for example Chrome], up to date, in a normal (not private/incognito) window so `localStorage` persists. Zoom at 100%. No extensions that alter pages (ad blockers, translators, password managers' popups).
- [ ] Operating-system and browser notifications off (Do Not Disturb / Focus on). Email, chat and calendar apps closed.
- [ ] Previous session exported and checked (§11.1). No other session shown as `in_progress` on `/admin`.
- [ ] Open `/admin`, enter the next **pid** from the pid sheet, and check the assignment preview (order, sets, case IDs) against the pid sheet. Resolve any duplicate-pid warning before continuing (§9).
- [ ] Start the session, check the consent screen is showing, then switch the browser to full-screen (F11, or Ctrl+Cmd+F on macOS). Leave the laptop on the consent screen.
- [ ] Printed copy of the consent form, debrief card with the pid written on it, and a pen.
- [ ] Phone silent; "Study in progress" sign on the door.
- [ ] Deviations log open (paper or a separate device, not the study laptop).

### 6.2 pid sheet and counterbalancing cycle

pids are given out **in order**, starting at 1 and with no gaps. One cycle is 18 pids. Pilot pids (901–906) are on a separate sheet. A withdrawn or broken session's slot is re-run by the next new participant with the **same pid** (new session); see §9.

| pid | Order | Block 1 | Block 2 | Block 3 | Date | Moderator | Status (completed / withdrawn / re-run) |
|---|---|---|---|---|---|---|---|
| 1 | A-B-C | A / S1 | B / S2 | C / S3 | | | |
| 2 | A-C-B | A / S1 | C / S3 | B / S2 | | | |
| 3 | B-A-C | B / S2 | A / S1 | C / S3 | | | |
| 4 | B-C-A | B / S2 | C / S3 | A / S1 | | | |
| 5 | C-A-B | C / S3 | A / S1 | B / S2 | | | |
| 6 | C-B-A | C / S3 | B / S2 | A / S1 | | | |
| 7 | A-B-C | A / S2 | B / S3 | C / S1 | | | |
| 8 | A-C-B | A / S2 | C / S1 | B / S3 | | | |
| 9 | B-A-C | B / S3 | A / S2 | C / S1 | | | |
| 10 | B-C-A | B / S3 | C / S1 | A / S2 | | | |
| 11 | C-A-B | C / S1 | A / S2 | B / S3 | | | |
| 12 | C-B-A | C / S1 | B / S3 | A / S2 | | | |
| 13 | A-B-C | A / S3 | B / S1 | C / S2 | | | |
| 14 | A-C-B | A / S3 | C / S2 | B / S1 | | | |
| 15 | B-A-C | B / S1 | A / S3 | C / S2 | | | |
| 16 | B-C-A | B / S1 | C / S2 | A / S3 | | | |
| 17 | C-A-B | C / S2 | A / S3 | B / S1 | | | |
| 18 | C-B-A | C / S2 | B / S1 | A / S3 | | | |

pid 19 repeats pid 1's order and sets (pid 19 = 1, 20 = 2, …, 36 = 18); only the within-block trial order differs. The source of this table is `system-design.md` §4.3. Never write a participant's name on this sheet.

## 7. Moderator script

Lines in quotation marks are said **exactly as written**. Read them, don't paraphrase. Text in italics is an action, not something to say.

### 7.1 Ground rules for the moderator

- Stay neutral. Don't react (nod, frown, sigh, comment) to any choice the participant makes.
- Sit to the side and slightly behind the participant, out of their direct line of sight, and don't watch the screen closely during trials.
- **Never** hint at what to look for. Don't mention mistakes, errors, tricks, prompt injection, phishing, scams, lookalike or misspelled addresses, typos, or "check carefully". Don't point at the screen during trials.
- Don't say whether TaskPilot is right or wrong, how many actions are left beyond what the screen shows, or how other people did.
- Don't describe TaskPilot as "real", "smart", "accurate" or "scripted". If asked, use the neutral answers in §7.4.
- Don't explain the conditions or use the words "black box", "condition", "explanation depth" or the letters A/B/C.

### 7.2 Step-by-step

| Step | Moderator says / does |
|---|---|
| 1. Welcome | "Hi, thanks for coming. I'm [first name]. Please have a seat. Before we start, please put your phone on silent and out of sight." |
| 2. Overview | "Today you'll use an AI assistant interface on this laptop. It takes about 20 to 25 minutes. I'll stay in the room, but I won't be able to help with the decisions themselves, because we're interested in how you decide on your own." |
| 3. Consent | *Hand over the printed consent form.* "Here is the consent form. The same text is on the screen. Please read it, and click 'I agree' if you're happy to take part. You can keep the paper copy. Do you have any questions before you start?" *Answer questions about procedure, time, data and rights only (§7.4).* |
| 4. If declined | "No problem at all, thank you for your time." *The app goes to the debrief screen and records no trial data. Note "declined" on the pid sheet; the pid is used again for the next participant.* |
| 5. Instructions | "The screen will now explain the task and show you your rules. Please read it at your own pace. There's one practice example. Click Start when you're ready." |
| 6. Trials | "From here on, the screen will guide you. Please work as you normally would. There's no time limit, but please don't switch to other windows. If something on the screen stops working, let me know." *Move to your seat. Don't watch.* |
| 7. Between blocks | *Say nothing unless asked. The block questionnaires appear automatically.* If the participant looks up: "Please carry on whenever you're ready." |
| 8. Exit survey | *When the exit survey appears:* "Nearly done. One reminder: please don't put any names or personal details in the comment box." |
| 9. Debrief | *When the debrief screen appears, sit back down beside the participant and read the debrief script (§10).* |
| 10. Close | *Hand over the debrief card (with pid and contact details).* "Thanks again for your help." *Then follow §11.1 before the next participant.* |

### 7.3 Things not to say (and what to say instead)

| Don't say | Say instead |
|---|---|
| "Watch out, it sometimes makes mistakes." | (Nothing. The instructions screen already says "TaskPilot may make mistakes", the same for everyone.) |
| "Check the email addresses carefully." / "Look at who triggered it." | "Please decide as you normally would." |
| "Good." / "Interesting." / "Are you sure?" | (Nothing.) |
| "This part has the Why button, try it." | "Use the screen however you like." |
| "You're doing well / most people get that one." | "Thanks, please carry on." |

### 7.4 Neutral answers to common questions

| Question | Answer |
|---|---|
| "Is this a real AI?" | "I can tell you more about how it works at the end." |
| "Is it right?" / "What should I pick?" | "There are no right or wrong answers for you; we're interested in what you would decide." |
| "What does Agree / Override mean?" | "Agree goes with TaskPilot's call. Override does the opposite. The line under each button tells you what will happen." |
| "What does 'Triggered by' / 'Requested by you' mean?" | "It's explained on the instructions and in 'Your policy'. Please use your own judgement." (Do not give examples.) |
| "Can I go back?" | "No, each choice is final. Just carry on from here." |
| "How long is left?" | "The progress line at the top shows where you are." |
| "What is this study about?" | "How people work with an AI assistant interface. I'll tell you more at the end." |
| "Do I have to answer this question?" | "The questionnaire items are needed for the study, but you can stop the whole session at any time." |

## 8. Session timeline

| Phase | Approx. time | Cumulative | Notes |
|---|---|---|---|
| Welcome, overview, consent | 2–3 min | 3 min | Printed copy handed over |
| Instructions, policy, practice action | 3 min | 6 min | Start button unlocks after 5 s |
| Part 1: 5 actions + block questionnaire | 4–5 min | 11 min | 14 items + tension + frustration |
| Part 2: 5 actions + block questionnaire | 4–5 min | 16 min | |
| Part 3: 5 actions + block questionnaire | 4–5 min | 21 min | |
| Exit survey | 1–2 min | 23 min | Remind: no personal details |
| Debrief (screen + verbal) and questions | 2–3 min | 25 min | Debrief card handed over |
| Export and reset (moderator only) | 3–5 min | — | Between participants, §11.1 |

Book 40-minute slots so there is time for the export, late arrivals and incidents. Record actual start and end times on the pid sheet; a session over 35 minutes goes in the deviations log.

## 9. Handling incidents

Every incident goes in the deviations log (§13), with the pid, time and what was done.

### 9.1 Page refresh or accidental navigation

The app saves after every trial and survey and resumes at the first unanswered screen. If the page reloads:
1. Stay calm and say: "That's fine, it saves as you go."
2. Reopen the app URL in the same browser if needed. It should resume automatically. Return to full-screen.
3. The interrupted trial is shown again and flagged `resumed = true`. Do not re-create the session.
4. Log it. If the participant left full-screen or switched windows, note it; the app logs tab switches itself.

### 9.2 Crash, frozen screen or "data not saved" banner

1. Say: "Sorry, a technical problem. Please give me a moment." Don't let the participant try to fix it.
2. Try one reload. If the session resumes, continue as in §9.1.
3. If it cannot resume, or the storage banner appears, open `/admin` and **export immediately** (keep the in-progress session). Do not clear data.
4. If the session cannot be continued, thank the participant, give the full debrief (§10), and mark the session `abandoned`. The **same pid** is re-run with the next new participant (new session), so the counterbalancing cycle stays balanced. The participant who experienced the crash does not take part again.
5. Note the browser, the screen it failed on, and any error text in the log, and tell the technical owner (logging/storage) before the next session.

### 9.3 Participant confusion

- About the **procedure or controls** (how to click, how to continue, what a button does): answer with the neutral lines in §7.4 only.
- About **how to decide** (what a rule means, whether a call is right): "Please use your own judgement; the rules are in 'Your policy'." Never interpret a specific case.
- If a participant seems unable to follow the task at all (for example, clicks without reading for a whole block), don't intervene during the session. Log it; the team decides on exclusion **before** looking at that participant's condition results, using the timing flags in the data.
- If English proficiency turns out to be insufficient, finish politely, debrief, and log the session as excluded.

### 9.4 Withdrawal

If the participant wants to stop, at any point:
1. Say: "Of course, thank you for your time. You don't need to give a reason."
2. Give the debrief (§10), in shortened form if they prefer to leave.
3. Ask: "Would you like us to delete the answers you've given so far, or may we keep them?"
   - **Delete:** delete the session from `/admin` in front of the participant (after checking it's the right pid), and delete it from any exported file (§11.4).
   - **Keep:** mark it `abandoned`. It is not counted as a completer.
4. Re-run the same pid with the next new participant. Log the withdrawal (without the reason unless volunteered).

### 9.5 Other incidents

- **Participant is distressed:** stop the session, follow §9.4, and offer [PLACEHOLDER: campus support service contact].
- **Interruption (someone enters, fire alarm):** pause if possible, log the time and duration. The app's visibility-adjusted timing and `timingFlag` cover most interruptions.
- **Participant mentions knowing the hypotheses or a previous participant's details:** let them finish, debrief, and log the session as excluded; re-run the pid.

## 10. Debrief script

The `DebriefScreen` shows the same points. The moderator reads this aloud, then answers questions.

> "Thank you, that's the end of the tasks. I'd now like to tell you more about the study.
>
> First, TaskPilot was not a real AI. Every call it made, and every reason it gave, was written in advance by our research team. Nothing you did today was sent anywhere or carried out for real, and all the people, addresses and shops were made up.
>
> Second, **6 of the 15 calls were deliberately wrong**. Sometimes TaskPilot allowed an action that broke your rules, and sometimes it blocked an action that was fine. We wanted to see whether people notice, and whether the way the assistant explains itself makes a difference. We showed you three different interface styles to compare them.
>
> Two of the wrong calls used tricks that real AI agents face. One is a **lookalike address**: an address that looks almost the same as a trusted one but differs by a single character, like 'northwlnd' with an L instead of 'northwind' with an i. The other is **prompt injection**: text hidden inside an email or a web page that tries to give the assistant instructions you never gave it. That's what the 'Triggered by' field was for. When it said 'email from …' or 'web page …' rather than 'you', the request didn't come from you. The debrief screen shows those examples again.
>
> Agreeing with some of the wrong calls is very common and has been found in many studies. It says nothing bad about you; it's exactly what we're studying.
>
> We didn't tell you this at the start because knowing that mistakes were planted would have changed how you looked at every action, and we wouldn't have been able to measure what we set out to measure. I'm sorry for not telling you beforehand.
>
> Now that you know the real purpose, you can still ask us to delete your answers, now or later, by contacting us with the number on this card. Would you like us to keep your answers?
>
> Finally, please **don't tell anyone else about the wrong calls or the tricks** until the study is finished, because people who know in advance would behave differently and that would spoil our results. Do you have any questions?"

*Record the answer to "keep your answers?" on the pid sheet. If "no", follow §9.4 step 3 (delete).* The **debrief card** contains: the study title, a two-line summary of the deception, the participant's pid, the withdrawal deadline [PLACEHOLDER], and the researcher and IRB contacts [PLACEHOLDER].

## 11. Data handling

### 11.1 After each session (before the next participant)

1. Exit full-screen and open `/admin`. Check that the session shows `completed` with 15 trials, 3 block surveys and 1 exit survey.
2. Export **JSON** and **all CSVs** (`trials`, `surveys`, `events`, `exit`), ticking "include in-progress and abandoned" so nothing is missed.
3. Open `trials.csv` briefly to check it has 15 rows for this pid. Don't look at the results in detail.
4. Read the exit comment; if it contains identifying details, note this for redaction (§11.3).
5. Copy the files to the team's private course drive (§11.2). Confirm the upload has finished.
6. Update the pid sheet (status, times, moderator) and the deviations log.
7. Leave the data in the browser (don't clear it) until the end-of-day check (§11.3).

### 11.2 File naming and storage

- The app names exports `xai-study_<file>_<YYYYMMDD-HHmm>.<ext>` (for example `xai-study_trials_20261103-1530.csv`). Keep these names; don't rename files with participant information.
- Put each session's export in a folder named `study1/raw/<YYYYMMDD>_pid<NNN>/` (for example `study1/raw/20261103_pid007/`). Pilot exports go in `study1/pilot/` and are never mixed with main data.
- Storage: [PLACEHOLDER: team private course drive location], access limited to Group 4 members and the instructor.
- Never store exports on personal laptops, USB sticks, email or public repositories. The data files are not committed to the project's git repository.

### 11.3 Backup and end-of-day check

- At the end of each session day, export the **full** JSON from `/admin` (all sessions) into `study1/raw/daily/` as a second copy.
- Check that the number of completed sessions on `/admin` matches the pid sheet.
- Redact any identifying details found in exit comments in a working copy (`study1/clean/`); keep the raw export unchanged but access-restricted.
- Only after the daily export is confirmed on the drive may the moderator use "clear all data" on `/admin` (the app requires an export first). Never clear in the middle of a session day.
- If the IRB approves the optional Apps Script POST, it is a third copy; it does not replace manual export.

### 11.4 Deletion on request

To delete a participant's data: delete the session on `/admin` (if still there), delete their folder in `study1/raw/`, remove their rows (by pid and `sessionId`) from the daily JSON and any merged or clean files, and log the deletion (date, pid, by whom) without the reason.

### 11.5 Retention and deletion schedule

| Item | Kept until | Then |
|---|---|---|
| Browser `localStorage` on the lab laptop | End-of-day export confirmed | Cleared from `/admin` |
| Raw exports (`study1/raw/`) | [PLACEHOLDER: retention period required by the IRB, for example end of the course or N years] | Deleted by [PLACEHOLDER: responsible member] |
| Cleaned, anonymous analysis files | [PLACEHOLDER: retention period] | Deleted, or kept for publication if consent and IRB allow |
| Pilot data (`study1/pilot/`) | Main study start | Deleted |
| Paper consent forms / sign-up sheet (if used) | [PLACEHOLDER: retention period] | Shredded |

## 12. Pilot protocol

### 12.1 Who and how

- **Participants:** the six Group 4 members, pids **901–906**. These cover all six condition orders with set rotation 0. Members who wrote case content (case bank, Condition B text) are marked in the pilot log, and their agreement rates aren't used to judge case difficulty.
- Each member completes the full session as a participant, with another member moderating from this script, **before** looking at any pilot results.
- Run the same build, browser and laptop as the main study. Pilot exports go to `study1/pilot/` and are excluded from analysis.
- After the debrief, the moderator asks the pilot questions below and writes the answers in the pilot log.

### 12.2 What to check

| Check | How | Target / action if missed |
|---|---|---|
| Session length | Start/end time on the pid sheet | 20–25 min; ≤ 30 min. If longer, trim instruction text, not trials or measures. |
| Agree/Override confusion on BLOCK calls | On one BLOCK call, the moderator asks the participant to say aloud what will happen before clicking; post-pilot question: "On a BLOCK, what did Agree do?" | No click against stated intent. If confusion appears, revise the button hints. |
| Wrong-case agreement | Agreement on the 6 wrong cases, by error type and broken rule | Overall **20–80%**. Under 20% (ceiling: errors too easy) or over 80% (floor: too hard) means the case wording needs revision. |
| "Triggered by" understood without priming | "In your own words, what did 'Triggered by' mean?" | Rule understood. If not, clarify the rule wording, not the practice example (see `system-design.md` §8). |
| Lookalike spottable | "If you look now, can you see any difference between these two addresses?" (show case-07 after the debrief) | Spotted when looked for. If not, check font rendering. |
| Wording clarity | "Was any action, rule or sentence unclear?" | Fix unclear wording in `stimuli.md` and `cases.json`. |
| C panel use | `explanationOpened` in the export | Opened at least once by most pilots; if never, check visibility of the "Why?" button. |
| Script and timing | Moderator notes where the script felt unnatural | Adjust lines before the main study. |
| Export | Load the CSVs in R or pandas | Loads with no manual cleanup. |

Any change made after the pilot is listed in the deviations log with its reason, and the app version is bumped. The main study then runs on one fixed build.

## 13. Deviations log template

Keep one log for the whole study (pilot and main). Record anything that differs from this protocol, however small.

| # | Date | Time | pid | sessionId (first 8 chars) | Moderator | App version | What happened | Action taken | Effect on data (none / flagged / excluded / re-run) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | |
| 2 | | | | | | | | | |
| 3 | | | | | | | | | |

Examples of entries: page reloaded mid-trial; participant asked about a rule and was given the neutral answer; session over 35 minutes; participant withdrew and asked for deletion; build changed after the pilot; interruption by someone entering the room.

---

## Related docs

- [`architecture.md`](architecture.md): system context, modules and ADRs
- [`system-design.md`](system-design.md): requirements, flows, screens, counterbalancing, risks and the pilot plan
- [`sequence-diagrams.md`](sequence-diagrams.md): trial, survey, resume and export interactions
- [`data-model.md`](data-model.md): case bank, session record, survey items and export formats
- [`ai-design.md`](ai-design.md): the Wizard-of-Oz agent, planted errors, ethics and debrief content
- [`research-positioning.md`](research-positioning.md): why the domain changed to agent permission prompts
- [`implementation-plan.md`](implementation-plan.md): build plan and milestones
- [`stimuli.md`](stimuli.md): final participant-facing wording for all 15 cases
- [`wireframes.md`](wireframes.md): screen layouts
