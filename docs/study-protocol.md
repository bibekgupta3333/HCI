# Study Protocol: Riverton Post-Label Sessions (v3)

This document is the protocol for running the CEN5728 Group 4 study on AI accuracy labels for social media posts: "When the AI label is wrong, do explanations help people catch it, and how do they make people feel?". It has two readers. The ethics/IRB reviewer needs the aims, risks, deception, consent, debrief and data handling in one place. The moderator needs a checklist, a script with exact lines, a timeline, an assignment sheet and instructions for what to do when something goes wrong. Design details (screens, counterbalancing code, logging, field names) live in `system-design.md`, `data-model.md` and `ai-design.md`, and participant-facing wording lives in `stimuli.md`. Where this document and `_shared-decisions.md` disagree, `_shared-decisions.md` wins. Anything in square brackets, such as [PLACEHOLDER: IRB number], must be filled in by the team before submission. Do not guess these values. Items marked [TEAM DECISION] still need the team to agree on them.

The previous protocol (v2.1, approving an AI agent's actions) is archived at `archive/v2.1-agent-permission/study-protocol.md`.

---

## 1. Purpose

This protocol makes every session run the same way, whoever moderates it, so that differences in the data come from the four interface conditions and not from the moderator. It also documents the ethical safeguards (consent, limited deception, exposure to made-up misleading claims, stress measures, debrief, anonymous data, withdrawal) for the ethics/IRB submission and the course report.

## 2. Study summary

| Item | Detail |
|---|---|
| Title | Explanations and error detection in AI accuracy labels |
| Main question | When the AI label is wrong, do explanations help people catch it, and how do they make people feel? |
| Aims | **RQ1:** do explanations help people catch wrong labels, and does this differ for false alarms (a true post labeled "Likely misleading") vs misses (a false post labeled "Likely accurate")? **RQ2:** which explanation type gives the best error detection? **RQ3:** do wrong labels create tension, and does the explanation type make it better or worse? Hypotheses H1–H6 are listed in `_shared-decisions.md`. |
| Task | The participant reads made-up social media posts from the fictional town of Riverton (fictional Alder County). Each post carries an AI label, "Likely accurate" or "Likely misleading". A "Fact sheet ▸" button opens a fictional official record about the post. The participant clicks **Agree with label** or **Disagree with label**, then rates their confidence (1–7). |
| Apparatus | A Wizard-of-Oz web app (React SPA) on a lab laptop. No AI model runs: every label and explanation is scripted. **8 of the 24 labels are deliberately wrong** (4 false alarms, 4 misses). |
| Design | Within-subjects, 4 conditions: **A** No explanation (label only), **B** Static reason (one fixed sentence), **C** Interactive "Why?" (three expandable rows: Source, Claim vs record, Wording), **D** Counterfactual (one "would be … if …" sentence). 4 blocks of 6 posts, one block per condition, plus 1 practice post. Condition order (4×4 Williams square), condition-to-set pairing and within-block post order are counterbalanced from the pid. A full cycle is 16 pids. |
| Measures | Per trial: agreement, error detection (on wrong labels), confidence (1–7, required), decision time, fact-sheet use, "Why?" row use (C). Per block: Jian et al. (2000) trust scale (12 items), 2 fairness items, tension (1–7), NASA-TLX frustration (0–100). Exit: demographics, social media use, how often they have seen platform labels, preferred interface, open comment. |
| Sample size | **Target N = 32 completers (2 Williams cycles); minimum N = 16 (1 cycle).** Recruit in whole cycles of 16 so every counterbalancing cell is filled equally. |
| Eligibility | Adults aged 18 or over; able to read and respond in English; normal or corrected-to-normal vision sufficient to read a laptop screen; no prior knowledge of the study hypotheses (for example, not someone who has read this team's proposal or attended its presentation). **Optional criterion [TEAM DECISION]:** uses social media regularly (for example, at least a few times a week). |
| Exclusions | Members of Group 4 take part **only in the pilot** (pids 901–906) and never in the main sample. People who have already completed a session cannot take part again. |
| Duration | About 30–35 minutes per participant, in one moderated session. |
| Setting | In person, one participant at a time, in a quiet room with a moderator present. |
| Compensation | [PLACEHOLDER: compensation, for example none / course credit / amount] |

## 3. Ethics and risk

### 3.1 Risk level

The study is **minimal risk**. Participants read short fictional posts on a laptop, click buttons and answer questionnaires. The risks are no greater than everyday social media use: mild boredom or fatigue, and possibly mild tension or frustration when a label seems wrong. This study changes the approved proposal (new domain, a fourth condition, added tension and frustration measures), so it needs Professor Hamam's approval and ethics approval before any main-study session runs.

### 3.2 Deception

- **What is withheld.** Participants are told they are evaluating "an AI tool that labels social media posts". They are not told that the labels are scripted, or that 8 of the 24 labels are deliberately wrong.
- **Why it is needed.** The study measures whether people notice wrong labels and how explanations change that. If participants knew that errors were planted, or which kinds, they would hunt for them, and agreement and detection would no longer reflect how people normally treat platform labels. A scripted labeller is also the only way to give every participant identical labels and identically worded explanations across conditions.
- **Why it is acceptable.** The deception is mild, concerns only the source and accuracy of the labels, causes no harm, and has no consequences outside the session. Participants are never misled about the procedure, duration, data use or their rights.
- **Disclosure.** Every participant is fully debriefed straight after the session (§11), on screen and verbally, and may withdraw their data once they know the true purpose.

### 3.3 Exposure to made-up misleading claims

Half the posts (12 of 24) make false claims, and 4 of those are labeled "Likely accurate". A participant could leave believing a false claim. Mitigations:

- **Everything is fictional.** The town (Riverton), county (Alder County), people, accounts and agencies are invented, so no false claim is about a real place, person or organization. There are no real brands.
- **No health-risk claims.** No post makes a claim that could cause harm if believed (for example about medicines, treatments or safety actions), and no post touches health care. Posts about local services (such as a parking rate or tap-water test results) concern the fictional town only, and the debrief corrects them.
- **The debrief corrects every wrong label.** The `DebriefScreen` and the moderator show the real fact for each of the 8 wrong labels (§11.2), and state plainly that **none of these posts were real**.

### 3.4 Stress measures

Each block asks how tense the participant felt and includes the NASA-TLX frustration item. These are standard workload items about the task, not about personal life, and are unlikely to cause distress. The debrief stresses that missing some wrong labels is common and says nothing bad about the participant.

**Stop rule.** If a participant appears distressed (for example visibly upset, says they are anxious or upset, or asks to stop), the moderator pauses and says: "Would you like to take a break, or stop here? Either is completely fine." If they want to stop, or still seem distressed after a short break, the session ends and the withdrawal steps in §10.5 are followed, with a full debrief and an offer of [PLACEHOLDER: campus support service contact]. The moderator never continues a session to complete the data.

### 3.5 Anonymity

- Each participant is identified only by an anonymous numeric **pid** that the moderator enters. No names, emails, student IDs, social media handles, IP addresses or exact birth dates are entered into the app. Age is collected as a range.
- If the team keeps a sign-up list (names, times), it is kept separately from the data, offline or on paper, and the pid is **never** written next to a name. The assignment sheet (§6.2) holds pids, dates and status only.
- The exit comment is the only free-text field. The moderator reminds the participant not to include identifying details, and the team checks comments before the data is shared.

### 3.6 Data storage

Responses are saved in the lab laptop's browser storage (`localStorage`, key `xai-study:sessions`) after every trial and survey. After each session the moderator exports the data from `/admin` and moves the files to the team's private course drive (§12). Nothing is sent over the network unless the IRB approves an online backup [PLACEHOLDER: whether online backup is approved].

### 3.7 Withdrawal

Participation is voluntary. A participant may stop at any time, without giving a reason and without penalty. They may also ask, during or after the session, for their data to be deleted. On request, the moderator deletes that session from `/admin` and from any exported files (§10.5, §12.4). After the anonymous data has been pooled, a session can still be identified and deleted by its pid until [PLACEHOLDER: withdrawal deadline, for example end of semester], provided the participant gives their pid (written on the debrief card).

## 4. Consent form (draft)

> **Consent to take part in a research study**
>
> **Study:** How people use AI labels on social media posts
> **Researchers:** CEN5728 Group 4, [PLACEHOLDER: institution]. Supervisor: [PLACEHOLDER: instructor name].
> **Approval:** [PLACEHOLDER: IRB/ethics approval number]
>
> We are studying how people use an AI tool that labels social media posts. You will read 24 short posts about a made-up town. Each post has a label from the AI tool, and you decide whether you agree with it. You will also answer short questionnaires, including how tense or frustrated you felt. The session takes about 30–35 minutes.
>
> All posts, people and places are fictional, and some posts contain claims that are not true. The risks are no greater than normal social media use. Some parts of the study will be explained to you fully at the end.
>
> We do not record your name. Your answers are stored under a number only and will be reported as group results. Please do not type personal details in the comment box.
>
> Taking part is voluntary. You can stop at any time without giving a reason, and you can ask us to delete your answers, now or later, without any penalty.
>
> Questions: [PLACEHOLDER: researcher contact email]. Concerns about your rights: [PLACEHOLDER: IRB office contact].
>
> By clicking "I agree", you confirm that you are 18 or older and agree to take part.

The in-app `ConsentScreen` shows this text. The moderator also has a printed copy for the participant to keep. The app stores only the consent timestamp, with no signature or name. If the IRB requires a signed form, use a paper form filed separately from the data [PLACEHOLDER: signed or click-through consent].

## 5. Recruitment message (draft)

> **Subject: Take part in a 35-minute study on AI labels for social media**
>
> Hi! We are a student team in CEN5728 (Advanced HCI) at [PLACEHOLDER: institution]. We are running a short study on how people use an AI tool that labels social media posts.
>
> - **What:** read 24 short made-up posts, each with an AI label, decide whether you agree with each label, and answer a few short questionnaires.
> - **Time:** about 30–35 minutes, in person, at [PLACEHOLDER: location].
> - **Who:** anyone aged 18 or over who reads English. [TEAM DECISION: add "and uses social media regularly"]
> - **Compensation:** [PLACEHOLDER: compensation or "none"].
>
> Taking part is voluntary and anonymous. To book a time, reply to [PLACEHOLDER: contact email] or use [PLACEHOLDER: sign-up link].
>
> Approved by [PLACEHOLDER: IRB/ethics approval number].

Do not mention in recruitment that the labels can be wrong, that they are scripted, or words such as "errors", "mistakes", "false alarms", "misses" or "fact-checking". Do not recruit people who know the study hypotheses, such as classmates who saw the proposal presentation.

## 6. Lab setup and assignment sheet

### 6.1 Before each session (about 10 minutes)

- [ ] Lab laptop charged or plugged in; external mouse connected.
- [ ] Latest build running from a clean checkout (`npm run build` then `npm run preview`, or the agreed hosted copy). Check that the version shown on `/admin` matches the version in the deviations log; the same build is used for every main-study session.
- [ ] Browser: [PLACEHOLDER: agreed browser, for example Chrome], up to date, in a normal (not private/incognito) window so `localStorage` persists. Zoom at 100%. No page-altering extensions (ad blockers, translators, password-manager popups).
- [ ] Operating-system and browser notifications off (Do Not Disturb / Focus on). Email, chat, calendar and social media apps closed.
- [ ] Previous session exported and checked (§12.1). No other session shown as `in_progress` on `/admin`.
- [ ] Open `/admin`, enter the next **pid** from the assignment sheet, and check the preview (condition order, set per block) against §6.2. Resolve any duplicate-pid warning before continuing (§10).
- [ ] Start the session, check that the consent screen is showing, then switch the browser to full-screen (F11, or Ctrl+Cmd+F on macOS). Leave the laptop on the consent screen.
- [ ] Printed consent form, debrief card with the pid written on it, and a pen.
- [ ] Phone silent; "Study in progress" sign on the door.
- [ ] Deviations log open (paper or a separate device, not the study laptop).

### 6.2 Assignment sheet (pid → condition order and sets)

pids are given out **in order**, starting at 1 and with no gaps. One cycle is 16 pids. A withdrawn or broken session's slot is re-run by the next new participant with the **same pid** (new `sessionId`); see §10.

The sheet is computed from the shared formulas in `_shared-decisions.md`:

- `order = williams[(pid - 1) % 4]`, with `williams = [ABDC, BCAD, CDBA, DACB]`
- `rotation = floor((pid - 1) / 4) % 4`
- the set for a condition is `S[(conditionIndex + rotation) % 4]`, with A = 0, B = 1, C = 2, D = 3 and S = [S1, S2, S3, S4]

| pid | Order | Rotation | Block 1 | Block 2 | Block 3 | Block 4 | Date | Moderator | Status (completed / withdrawn / re-run) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | A-B-D-C | 0 | A / S1 | B / S2 | D / S4 | C / S3 | | | |
| 2 | B-C-A-D | 0 | B / S2 | C / S3 | A / S1 | D / S4 | | | |
| 3 | C-D-B-A | 0 | C / S3 | D / S4 | B / S2 | A / S1 | | | |
| 4 | D-A-C-B | 0 | D / S4 | A / S1 | C / S3 | B / S2 | | | |
| 5 | A-B-D-C | 1 | A / S2 | B / S3 | D / S1 | C / S4 | | | |
| 6 | B-C-A-D | 1 | B / S3 | C / S4 | A / S2 | D / S1 | | | |
| 7 | C-D-B-A | 1 | C / S4 | D / S1 | B / S3 | A / S2 | | | |
| 8 | D-A-C-B | 1 | D / S1 | A / S2 | C / S4 | B / S3 | | | |
| 9 | A-B-D-C | 2 | A / S3 | B / S4 | D / S2 | C / S1 | | | |
| 10 | B-C-A-D | 2 | B / S4 | C / S1 | A / S3 | D / S2 | | | |
| 11 | C-D-B-A | 2 | C / S1 | D / S2 | B / S4 | A / S3 | | | |
| 12 | D-A-C-B | 2 | D / S2 | A / S3 | C / S1 | B / S4 | | | |
| 13 | A-B-D-C | 3 | A / S4 | B / S1 | D / S3 | C / S2 | | | |
| 14 | B-C-A-D | 3 | B / S1 | C / S2 | A / S4 | D / S3 | | | |
| 15 | C-D-B-A | 3 | C / S2 | D / S3 | B / S1 | A / S4 | | | |
| 16 | D-A-C-B | 3 | D / S3 | A / S4 | C / S2 | B / S1 | | | |

Across the 16 rows each condition appears in each block position 4 times, and each condition is paired with each set 4 times. pid 17 repeats pid 1's order and sets (17 = 1, 18 = 2, …, 32 = 16); only the seeded within-block post order differs. The table was checked with this script:

```python
W = ["ABDC", "BCAD", "CDBA", "DACB"]
for pid in range(1, 17):
    order, rot = W[(pid - 1) % 4], ((pid - 1) // 4) % 4
    print(pid, " | ".join(f"{c} / S{('ABCD'.index(c) + rot) % 4 + 1}" for c in order))
```

Never write a participant's name on this sheet. Pilot pids (901–906) are on a separate sheet (§13.1).

## 7. Moderator ground rules

- Stay neutral. Don't react (nod, frown, sigh, comment) to any choice the participant makes.
- Sit to the side and slightly behind the participant, out of their direct line of sight, and don't watch the screen closely during trials.
- **Never** hint that labels can be wrong. Don't mention mistakes, errors, false alarms, misses, tricks, fake news, fact-checking, or "check carefully". Don't point at the screen during trials.
- Don't say whether a label or post is right or wrong, or how other people did.
- Don't describe the AI as "real", "smart", "accurate" or "scripted". If asked, use the neutral answers in §8.4.
- Don't explain the conditions or use the words "condition", "explanation type", "counterfactual" or the letters A/B/C/D.
- Describe the fact sheet only with the neutral line in §8.2 step 5. Never encourage or discourage opening it.

## 8. Moderator script

Lines in quotation marks are said **exactly as written**. Read them, don't paraphrase. Text in italics is an action, not something to say.

### 8.1 Before the participant arrives

*Complete §6.1. Have the consent form, debrief card and deviations log ready.*

### 8.2 Step by step

| Step | Moderator says / does |
|---|---|
| 1. Welcome | "Hi, thanks for coming. I'm [first name]. Please have a seat. Before we start, please put your phone on silent and out of sight." |
| 2. Overview | "Today you'll use an AI tool that labels social media posts. It takes about 30 to 35 minutes. I'll stay in the room, but I won't be able to help with the decisions themselves, because we're interested in how you decide on your own." |
| 3. Consent | *Hand over the printed consent form.* "Here is the consent form. The same text is on the screen. Please read it, and click 'I agree' if you're happy to take part. You can keep the paper copy. Do you have any questions before you start?" *Answer questions about procedure, time, data and rights only (§8.4).* |
| 4. If declined | "No problem at all, thank you for your time." *The app records no trial data. Note "declined" on the assignment sheet; the pid is used again for the next participant.* |
| 5. Instructions | "The screen will now explain the task. Please read it at your own pace. There's one practice post first, which doesn't count. Each post has a 'Fact sheet' button that opens a record about the topic; you can open it or not, as you like. Click Start when you're ready." |
| 6. Trials | "From here on, the screen will guide you. Please work as you normally would. There's no time limit, but please don't switch to other windows. If something on the screen stops working, let me know." *Move to your seat. Don't watch.* |
| 7. Between parts | *Say nothing unless asked. The questionnaires after each part appear automatically.* If the participant looks up: "Please carry on whenever you're ready." |
| 8. Exit survey | *When the exit survey appears:* "Nearly done. One reminder: please don't put any names or personal details in the comment box." |
| 9. Debrief | *When the debrief screen appears, sit back down beside the participant and read the debrief script (§11).* |
| 10. Close | *Hand over the debrief card (with pid and contact details).* "Thanks again for your help." *Then follow §12.1 before the next participant.* |

### 8.3 Things not to say (and what to say instead)

| Don't say | Say instead |
|---|---|
| "Watch out, the AI is sometimes wrong." | (Nothing. The instructions screen shows the same wording to everyone; see `stimuli.md`.) |
| "Check the fact sheet." / "Compare the numbers." | "Please decide as you normally would." |
| "Good." / "Interesting." / "Are you sure?" | (Nothing.) |
| "This part has the Why button, try it." | "Use the screen however you like." |
| "You're doing well / most people get that one." | "Thanks, please carry on." |

### 8.4 Neutral answers to common questions

| Question | Answer |
|---|---|
| "Is this a real AI?" | "I can tell you more about how it works at the end." |
| "Is this post true?" / "Is the label right?" / "What should I pick?" | "There are no right or wrong answers for you; we're interested in what you would decide." |
| "What do Agree and Disagree mean?" | "Agree with label means you go along with the AI's label. Disagree with label means you don't." |
| "What is the fact sheet?" / "Do I have to open it?" | "It's a record about the topic of the post. You can open it or not, as you like." |
| "Is Riverton a real place?" | "I can tell you more about the posts at the end." |
| "Can I go back?" | "No, each choice is final. Just carry on from here." |
| "How long is left?" | "The line at the top shows which part and post you're on." |
| "What is this study about?" | "How people use an AI tool that labels posts. I'll tell you more at the end." |
| "Do I have to answer this question?" | "The questionnaire items are needed for the study, but you can stop the whole session at any time." |

## 9. Session timeline

| Phase | Approx. time | Cumulative | Notes |
|---|---|---|---|
| Welcome, overview, consent | 3 min | 3 min | Printed copy handed over |
| Instructions and practice post | 3 min | 6 min | Practice post is not logged as a trial |
| Part 1: 6 posts + block questionnaire | 5–6 min | 12 min | Each post: ~800 ms "AI is checking…", decision, confidence. Questionnaire: 12 trust + 2 fairness + tension + frustration |
| Part 2: 6 posts + block questionnaire | 5–6 min | 18 min | |
| Part 3: 6 posts + block questionnaire | 5–6 min | 24 min | |
| Part 4: 6 posts + block questionnaire | 5–6 min | 30 min | |
| Exit survey | 2 min | 32 min | Remind: no personal details |
| Debrief (screen + verbal) and questions | 3 min | 35 min | Debrief card handed over |
| Export and reset (moderator only) | 3–5 min | — | Between participants, §12.1 |

Book 50-minute slots so there is time for the export, late arrivals and incidents. Record actual start and end times on the assignment sheet; a session over 40 minutes goes in the deviations log.

## 10. Handling incidents

Every incident goes in the deviations log (§14), with the pid, time and what was done.

### 10.1 Page refresh or accidental navigation

The app saves after every trial and survey and resumes at the first unanswered screen.
1. Say: "That's fine, it saves as you go."
2. Reopen the app URL in the same browser if needed. It should resume automatically. Return to full-screen.
3. The interrupted trial is shown again and flagged `resumed = true`. Do not re-create the session.
4. Log it. If the participant left full-screen or switched windows, note it; the app logs hidden time itself (`hiddenMs`, `timingFlag`).

### 10.2 Crash, frozen screen or "data not saved" banner

1. Say: "Sorry, a technical problem. Please give me a moment." Don't let the participant try to fix it.
2. Try one reload. If the session resumes, continue as in §10.1.
3. If it cannot resume, or the storage banner appears, open `/admin` and **export immediately** (keep the in-progress session). Do not clear data.
4. If the session cannot continue, thank the participant, give the full debrief (§11), and mark the session `abandoned`. The **same pid** is re-run with the next new participant (new `sessionId`), so the cycle stays balanced. The participant who had the crash does not take part again.
5. Log the browser, the screen it failed on and any error text, and tell the technical owner (logging/storage) before the next session.

### 10.3 Participant confusion

- About the **procedure or controls** (how to click, how to continue, what a button does): answer with the neutral lines in §8.4 only.
- About **how to decide** (whether a post is true, whether a label is right, what a fact sheet means for a post): "Please use your own judgement." Never interpret a specific post.
- If a participant seems unable to follow the task at all (for example, clicks without reading for a whole part), don't intervene. Log it; the team decides on exclusion **before** looking at that participant's condition results, using the timing flags in the data.
- If English proficiency turns out to be insufficient, finish politely, debrief, and log the session as excluded.

### 10.4 Distress

Follow the stop rule in §3.4. If the session stops, follow §10.5, give the full debrief including the real facts (§11.2), and offer [PLACEHOLDER: campus support service contact]. Log it without personal details.

### 10.5 Withdrawal

If the participant wants to stop, at any point:
1. Say: "Of course, thank you for your time. You don't need to give a reason."
2. Give the debrief (§11). Even in shortened form, always show the real facts table and say that none of the posts were real.
3. Ask: "Would you like us to delete the answers you've given so far, or may we keep them?"
   - **Delete:** delete the session from `/admin` in front of the participant (after checking it's the right pid), and delete it from any exported file (§12.4).
   - **Keep:** mark it `abandoned`. It is not counted as a completer.
4. Re-run the same pid with the next new participant. Log the withdrawal (without the reason unless volunteered).

### 10.6 Other incidents

- **Interruption (someone enters, fire alarm):** pause if possible, log the time and duration. The app's visibility-adjusted timing covers most interruptions.
- **Participant mentions knowing the hypotheses or a previous participant's details:** let them finish, debrief, and log the session as excluded; re-run the pid.

## 11. Debrief

### 11.1 Debrief script

The `DebriefScreen` shows the same points. The moderator reads this aloud, then answers questions.

> "Thank you, that's the end of the tasks. I'd now like to tell you more about the study.
>
> First, **none of these posts were real.** Riverton, Alder County, the people, the accounts and the agencies were all made up by our team. Some posts made claims that were not true, and they are not true anywhere.
>
> Second, the AI tool was not a real AI. Every label and every reason it gave was written in advance by our research team.
>
> Third, **8 of the 24 labels were deliberately wrong.** There were two kinds of mistake. A **false alarm** is when a true post is labeled 'Likely misleading'. A **miss** is when a false post is labeled 'Likely accurate'. We wanted to see whether people notice each kind, and whether the way the AI explains itself makes a difference. That's why the screen looked a little different in each of the four parts.
>
> The screen now shows the real facts for every post that had a wrong label. Let's look at them together. *[Go through the table on screen, §11.2.]*
>
> Agreeing with some of the wrong labels is very common and has been found in many studies, especially when a label says a post is accurate. It says nothing bad about you; it's exactly what we're studying.
>
> We didn't tell you this at the start because knowing that mistakes were planted would have changed how you read every post, and we wouldn't have been able to measure what we set out to measure. I'm sorry for not telling you beforehand.
>
> Now that you know the real purpose, you can still ask us to delete your answers, now or later, by contacting us with the number on this card. Would you like us to keep your answers?
>
> Finally, please **don't tell anyone else that some labels were wrong** until the study is finished, because people who know in advance would behave differently and that would spoil our results. Do you have any questions?"

*Record the answer to "keep your answers?" on the assignment sheet. If "no", follow §10.5 step 3 (delete).*

### 11.2 The real facts (shown on the debrief screen)

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

The screen ends with: "None of these posts were real. Riverton and everything in it is fictional."

### 11.3 Debrief card

The card contains: the study title, a two-line summary of the deception ("The AI labels were scripted, and 8 of 24 were deliberately wrong. All posts and places were fictional."), the participant's pid, the withdrawal deadline [PLACEHOLDER], and the researcher and IRB contacts [PLACEHOLDER].

## 12. Data handling

### 12.1 After each session (before the next participant)

1. Exit full-screen and open `/admin`. Check that the session shows `completed` with 24 trials, 4 block surveys and 1 exit survey.
2. Export **JSON** and **all CSV files** offered by `/admin`, including in-progress and abandoned sessions so nothing is missed.
3. Open the trials CSV briefly to check it has 24 rows for this pid. Don't look at the results in detail.
4. Read the exit comment; if it contains identifying details, note this for redaction (§12.3).
5. Copy the files to the team's private course drive (§12.2). Confirm the upload has finished.
6. Update the assignment sheet (status, times, moderator) and the deviations log.
7. Leave the data in the browser (don't clear it) until the end-of-day check (§12.3).

### 12.2 File naming and storage

- The app names exports `xai-study_<file>_<YYYYMMDD-HHmm>.<ext>` (for example `xai-study_trials_20261103-1530.csv`). Keep these names; don't rename files with participant information.
- Put each session's export in a folder named `study/raw/<YYYYMMDD>_pid<NNN>/` (for example `study/raw/20261103_pid007/`). Pilot exports go in `study/pilot/` and are never mixed with main data.
- Storage: [PLACEHOLDER: team private course drive location], access limited to Group 4 members and the instructor.
- Never store exports on personal laptops, USB sticks, email or public repositories. Data files are not committed to the project's git repository.

### 12.3 Backup and end-of-day check

- At the end of each session day, export the **full** JSON from `/admin` (all sessions) into `study/raw/daily/` as a second copy.
- Check that the number of completed sessions on `/admin` matches the assignment sheet.
- Redact identifying details found in exit comments in a working copy (`study/clean/`); keep the raw export unchanged but access-restricted.
- Only after the daily export is confirmed on the drive may the moderator use "clear all data" on `/admin`. Never clear in the middle of a session day.

### 12.4 Deletion on request

Delete the session on `/admin` (if still there), delete the participant's folder in `study/raw/`, remove their rows (by pid and `sessionId`) from the daily JSON and any merged or clean files, and log the deletion (date, pid, by whom) without the reason.

### 12.5 Retention and deletion schedule

| Item | Kept until | Then |
|---|---|---|
| Browser `localStorage` on the lab laptop | End-of-day export confirmed | Cleared from `/admin` |
| Raw exports (`study/raw/`) | [PLACEHOLDER: retention period required by the IRB] | Deleted by [PLACEHOLDER: responsible member] |
| Cleaned, anonymous analysis files | [PLACEHOLDER: retention period] | Deleted, or kept for publication if consent and IRB allow |
| Pilot data (`study/pilot/`) | Main study start | Deleted |
| Paper consent forms / sign-up sheet (if used) | [PLACEHOLDER: retention period] | Shredded |

## 13. Pilot protocol

### 13.1 Who and how

- **Participants:** the six Group 4 members, pids **901–906**. The same formulas give them these assignments, which cover all four condition orders:

| pid | Order | Rotation | Block 1 | Block 2 | Block 3 | Block 4 |
|---|---|---|---|---|---|---|
| 901 | A-B-D-C | 1 | A / S2 | B / S3 | D / S1 | C / S4 |
| 902 | B-C-A-D | 1 | B / S3 | C / S4 | A / S2 | D / S1 |
| 903 | C-D-B-A | 1 | C / S4 | D / S1 | B / S3 | A / S2 |
| 904 | D-A-C-B | 1 | D / S1 | A / S2 | C / S4 | B / S3 |
| 905 | A-B-D-C | 2 | A / S3 | B / S4 | D / S2 | C / S1 |
| 906 | B-C-A-D | 2 | B / S4 | C / S1 | A / S3 | D / S2 |

- Members who wrote post content (post bank, B/C/D text) are marked in the pilot log, and their detection rates aren't used to judge post difficulty.
- Each member completes the full session as a participant, with another member moderating from this script, **before** looking at any pilot results.
- Use the same build, browser and laptop as the main study. Pilot exports go to `study/pilot/` and are excluded from analysis.
- After the debrief, the moderator asks the pilot questions below and writes the answers in the pilot log.

### 13.2 What to check

| Check | How | Target / action if missed |
|---|---|---|
| Session length | Start/end time on the pilot sheet | **≤ 35 min.** If longer, trim instruction text, not trials or measures. |
| Detection rate on wrong labels | `detectedError` on the 8 wrong labels, overall and split by false alarm vs miss and clear vs subtle | Overall **20–80%**. Under 20% means the errors are too hard to spot; over 80% means they are too obvious. Revise post or fact-sheet wording in `stimuli.md`. |
| Fact-sheet use | `factSheetOpened` and `factSheetOpenMs` in the export; ask "Did you use the fact sheet? Why or why not?" | Opened at least sometimes by most pilots. If never, check that the "Fact sheet ▸" button is visible; don't add prompting text. |
| Agree/Disagree clarity | On one "Likely misleading" post, the moderator asks the participant to say aloud what they mean to do before clicking. Post-pilot question: "On a 'Likely misleading' label, what did Agree with label mean?" | No click against stated intent. If confusion appears, revise the button hints or instructions. |
| "Why?" panel use (C) | `explanationOpened` and `factorsExpanded` in the export | Opened at least once by most pilots; if never, check the visibility of the "Why?" button. |
| Wording clarity | "Was any post, label, reason or fact sheet unclear?" | Fix unclear wording in `stimuli.md` and `posts.json`. |
| Stress items | "Were the tension and frustration questions clear and comfortable to answer?" | Clear; no pilot uncomfortable. |
| Script and timing | Moderator notes where the script felt unnatural | Adjust lines before the main study. |
| Export | Load the CSVs in R or pandas | Loads with no manual cleanup. |

Any change made after the pilot goes in the deviations log with its reason, and the app version is bumped. The main study then runs on one fixed build.

## 14. Deviations log template

Keep one log for the whole study (pilot and main). Record anything that differs from this protocol, however small.

| # | Date | Time | pid | sessionId (first 8 chars) | Moderator | App version | What happened | Action taken | Effect on data (none / flagged / excluded / re-run) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | |
| 2 | | | | | | | | | |
| 3 | | | | | | | | | |

Examples of entries: page reloaded mid-trial; participant asked whether a post was true and was given the neutral answer; session over 40 minutes; participant became distressed and the stop rule was applied; participant withdrew and asked for deletion; build changed after the pilot; interruption by someone entering the room.

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
