# Sequence Diagrams

This document shows how the study app's modules work together at runtime for the flows that matter most to data quality: assigning a participant, running a trial in each of the three conditions, handling the deliberately wrong TaskPilot calls (`false_allow` and `false_block`), collecting the block surveys, recovering from a refresh or crash, and exporting the data. Each diagram uses the module names from `_shared-decisions.md` (`StudyContext`, `decisionEngine`, `counterbalance`, `rng`, `logger`, `sessionStore`, and the screens in `src/study/`). In v2 the scripted AI is **TaskPilot**, a personal agent that checks each proposed action against the participant's delegation policy and calls ALLOW or BLOCK; the participant clicks Agree or Override. The flows themselves are domain-independent. The doc follows the same pattern throughout: a short explanation, the Mermaid diagram, then notes on edge cases. The app has no server. Every arrow happens inside the participant's browser, apart from the optional POST in diagram 8.

## Index

1. [Session start and assignment](#1-session-start-and-assignment)
2. [Trial in Condition A (Black Box)](#2-trial-in-condition-a-black-box)
3. [Trial in Condition B (Static Explanation)](#3-trial-in-condition-b-static-explanation)
4. [Trial in Condition C (Interactive Explanation)](#4-trial-in-condition-c-interactive-explanation)
5. [Wrong-AI-case handling](#5-wrong-ai-case-handling)
6. [Block survey and advancing to the next block](#6-block-survey-and-advancing-to-the-next-block)
7. [Refresh and crash recovery](#7-refresh-and-crash-recovery)
8. [Admin export and optional submission](#8-admin-export-and-optional-submission)

---

## 1. Session start and assignment

The researcher, not the participant, types the participant number (pid) before consent. `counterbalance.assign(pid)` works out the whole session plan in one deterministic step. The condition order comes from `permutations[(pid-1) % 6]`, the set-to-condition mapping from the Latin square rotation `floor((pid-1)/6) % 3`, the within-block trial order from a mulberry32 PRNG seeded with the pid, and `styleArm`, the Study 2 explanation-style flag, which defaults to `"fluent"` in this course build. `StudyContext` keeps the plan in memory, and `sessionStore` writes it to `localStorage` straight away, so the assignment survives a refresh even before the first trial.

```mermaid
sequenceDiagram
    actor Researcher
    participant Consent as ConsentScreen
    participant SC as StudyContext
    participant CB as counterbalance
    participant RNG as rng
    participant SS as sessionStore
    participant LS as localStorage

    Researcher->>Consent: enter participant number
    Consent->>Consent: validate positive integer
    Consent->>SS: findSession(pid)
    SS->>LS: getItem xai-study:sessions
    LS-->>SS: sessions JSON or null
    alt pid already has a completed session
        SS-->>Consent: existing completed session
        Consent-->>Researcher: warn pid already used, require confirm or new pid
    else pid has an incomplete session
        SS-->>Consent: incomplete session
        Consent-->>Researcher: offer resume, see diagram 7
    else no session for pid
        SS-->>Consent: none
        Consent->>CB: assign(pid)
        CB->>CB: order = permutations[(pid-1) mod 6]
        CB->>CB: rotation = floor((pid-1)/6) mod 3
        CB->>CB: map sets S1 S2 S3 to conditions by rotation
        CB->>RNG: mulberry32(seedFrom(pid))
        RNG-->>CB: seeded generator
        loop each of 3 blocks
            CB->>RNG: next() for shuffle
            RNG-->>CB: random floats
            CB->>CB: shuffle 5 case ids of the block set
            CB->>CB: reject and reshuffle if both wrong cases sit in positions 1 and 2
        end
        CB->>CB: styleArm = fluent by default, Study 2 assigns by pid parity
        CB-->>Consent: plan with conditionOrder, setByCondition, trialOrder per block, seed, styleArm
        Consent->>SC: dispatch START_SESSION with pid and plan
        SC->>SC: init state, block 0, trial 0, startedAt
        SC->>SS: saveSession(session)
        SS->>LS: setItem xai-study:sessions
        Consent-->>Researcher: hand device to participant
    end
```

**Edge cases**
- **Determinism.** Calling `assign(pid)` again for the same pid must give the identical plan. That lets the analysis rebuild the assignment from the pid alone, and lets diagram 7 check that a stored plan hasn't been tampered with. The seed and the full plan are saved anyway, so nothing depends on recomputing them.
- **Wrong-case constraint.** The constraint is applied by rejection sampling: reshuffle until the two wrong cases aren't both in positions 1 and 2. All the draws come from the same seeded generator, so the retries are deterministic too. The positions still vary across participants because the seed varies.
- **styleArm.** Study 1 always stores `styleArm = "fluent"`. The field is in the plan now so that Study 2 (fluent vs terse arm by pid parity) needs no schema change, and every B text lookup goes through it.
- **Invalid input.** Zero, negative, non-numeric or empty pids are refused on the screen and never reach `counterbalance`.
- **Reused pid.** A completed session for the same pid is never overwritten silently. The researcher has to confirm, and the old session is kept, with the new one stored next to it under a distinct `sessionId`.
- **Storage failure.** If `setItem` throws (quota exceeded or private mode), the researcher gets a blocking error before consent. The study must not run if its data can't be saved.

---

## 2. Trial in Condition A (Black Box)

Every trial follows the same skeleton, and diagrams 3 and 4 only change the middle of it. `TrialScreen` asks `StudyContext` for the current case id, `decisionEngine` builds a view payload for the block's condition, and `BlackBoxView` renders `<ActionCard/>` and `<DecisionPanel/>` with only TaskPilot's ALLOW or BLOCK call. The call appears after the fixed ~800 ms "TaskPilot is checking…" delay, and the decision timer starts once the call is actually painted. The Agree or Override click stops it, `logger` builds the trial record, and `sessionStore` saves the session before the next trial loads.

```mermaid
sequenceDiagram
    actor P as Participant
    participant Trial as TrialScreen
    participant SC as StudyContext
    participant DE as decisionEngine
    participant View as BlackBoxView
    participant Log as logger
    participant SS as sessionStore
    participant LS as localStorage

    Trial->>SC: read current block and trial index
    SC-->>Trial: caseId and condition A
    Trial->>DE: buildPresentation(caseId, A)
    DE->>DE: look up case in cases.json
    DE-->>Trial: payload with request and aiDecision only
    Trial->>View: render payload
    View-->>P: ActionCard, PolicyPanel link, ALLOW or BLOCK call after fixed delay
    View->>Log: markShown(trialId) after first paint
    Log->>Log: shownAt = performance.now()
    opt participant opens the delegation policy
        P->>View: open PolicyPanel
        View->>Log: event policy_open with timestamp, policyOpened = true
    end
    P->>View: click Agree or Override
    View->>Log: markDecided(trialId, agreed)
    Log->>Log: decisionTimeMs = decisionTimeRawMs - hiddenMs
    opt confidence follow-up enabled
        View-->>P: confidence 1 to 7
        P->>View: select rating or skip
    end
    View->>Trial: onComplete(agreed, confidence)
    Trial->>Log: recordTrial(caseId, condition, agreed, confidence)
    Log->>DE: getTruth(caseId)
    DE-->>Log: isAiCorrect, groundTruth, errorType
    Log-->>Trial: trial record with derived fields
    Trial->>SC: dispatch TRIAL_COMPLETED with record
    SC->>SS: saveSession(session)
    SS->>LS: setItem xai-study:sessions
    alt more trials in block
        SC-->>Trial: advance to next trial
    else block finished
        SC-->>Trial: navigate to BlockSurveyScreen
    end
```

**Edge cases**
- **When the timer starts.** `shownAt` is taken in an effect after the first paint (for example via `requestAnimationFrame`), not when the component mounts, so slow rendering doesn't inflate `decisionTimeMs`.
- **Double clicks.** Agree and Override are disabled after the first click, so the first decision is the only one recorded. A second click is ignored and isn't logged as a decision.
- **Confidence is excluded.** The confidence prompt appears after the decision click, so its time never counts toward `decisionTimeMs`. If it's skipped, `confidence` is `null`.
- **Losing focus.** If the tab is hidden mid-trial, `logger` records `visibilitychange` and blur events with timestamps and sums them into `hiddenMs`, `hiddenCount` and `blurCount`. `decisionTimeMs = decisionTimeRawMs - hiddenMs`, and `timingFlag` marks trials the analysis should treat with care.
- **Same delay everywhere.** The ~800 ms "TaskPilot is checking…" delay is identical in every condition and for correct and wrong calls. Confidence is never shown.
- **A failed save.** The trial does not advance, and a blocking message asks the researcher to step in. A trial that isn't persisted is treated as not done.

---

## 3. Trial in Condition B (Static Explanation)

Condition B uses the skeleton from diagram 2. The only change is that `decisionEngine` adds the case's `staticExplanation` string to the payload, and `StaticExplanationView` shows it next to the decision. The explanation is visible from the moment the decision appears, so the participant doesn't need to do anything to see it, and no extra interaction events are logged apart from the shared `policy_open` event.

```mermaid
sequenceDiagram
    actor P as Participant
    participant Trial as TrialScreen
    participant SC as StudyContext
    participant DE as decisionEngine
    participant View as StaticExplanationView
    participant Log as logger
    participant SS as sessionStore

    Trial->>SC: read current block and trial index
    SC-->>Trial: caseId and condition B
    Trial->>DE: buildPresentation(caseId, B)
    DE-->>Trial: request, aiDecision, staticExplanation
    Trial->>View: render payload
    View-->>P: ActionCard, ALLOW or BLOCK call, first-person reason
    View->>Log: markShown(trialId) after first paint
    Note over View,Log: decision and reason appear together, so one shownAt covers both
    P->>View: read reason, click Agree or Override
    View->>Log: markDecided(trialId, agreed)
    Log->>Log: decisionTimeMs = raw time minus hiddenMs
    View->>Trial: onComplete(agreed, confidence)
    Trial->>Log: recordTrial(caseId, B, agreed, confidence)
    Log-->>Trial: record with explanationOpened null, timeToFirstExpandMs null, factorsExpanded empty
    Trial->>SC: dispatch TRIAL_COMPLETED
    SC->>SS: saveSession(session)
```

**Edge cases**
- **Fields that don't apply.** `explanationOpened` and `timeToFirstExpandMs` are stored as `null` in A and B rather than `false`, and `factorsExpanded` is `[]`. That way the analysis can't mistake "not applicable" for "did not open" (see `data-model.md` §2.6).
- **Same layout.** The reason text is rendered in the same position and type style for correct and wrong cases (see diagram 5). Its length is decided by the case bank author, not by the view.
- **Reading time.** B's `decisionTimeMs` includes the time spent reading the reason. That's intended, because H5 compares the full time-to-decision across conditions.

---

## 4. Trial in Condition C (Interactive Explanation)

In Condition C the decision first appears alone with a "Why?" button. Clicking it opens a panel with three rows: Cost, Recipient and Requested by. Each row shows the true value, the rule and a ✓ or ✗, and expands to a `detail` sentence. `logger` records every Why click, expand and collapse with a `performance.now()` timestamp, which lets the analysis tell whether participants actually checked the breakdown. `timeToFirstExpandMs` is measured from `shownAt` to the first "Why?" open, and `factorsExpanded[]` lists the distinct factor keys in the order they were first expanded.

```mermaid
sequenceDiagram
    actor P as Participant
    participant Trial as TrialScreen
    participant DE as decisionEngine
    participant View as InteractiveExplanationView
    participant Log as logger
    participant SC as StudyContext
    participant SS as sessionStore

    Trial->>DE: buildPresentation(caseId, C)
    DE-->>Trial: request, aiDecision, factors cost recipientTrusted userRequested with label value threshold comparator passes detail
    Trial->>View: render payload
    View-->>P: ActionCard, ALLOW or BLOCK call, Why button
    View->>Log: markShown(trialId) after first paint
    opt participant explores the explanation
        P->>View: click Why
        View->>Log: event why_open at t
        Log->>Log: explanationOpened = true
        opt first Why open in this trial
            Log->>Log: timeToFirstExpandMs = t - shownAt
        end
        View-->>P: rows Cost, Recipient, Requested by, each with value, rule, pass or fail, collapsed
        loop any number of times
            alt expand a factor row
                P->>View: expand factor k
                View->>Log: event factor_expand k at t
                Log->>Log: add k to factorsExpanded if new
                View-->>P: detail sentence for factor k
            else collapse a factor row
                P->>View: collapse factor k
                View->>Log: event factor_collapse k at t
            else close the panel
                P->>View: click Why again
                View->>Log: event why_close at t
            end
        end
    end
    P->>View: click Agree or Override
    View->>Log: markDecided(trialId, agreed)
    Log->>Log: decisionTimeMs = raw time minus hiddenMs
    View->>Trial: onComplete(agreed, confidence)
    Trial->>Log: recordTrial(caseId, C, agreed, confidence)
    Log-->>Trial: record with explanationOpened, factorsExpanded, timeToFirstExpandMs, events
    Trial->>SC: dispatch TRIAL_COMPLETED
    SC->>SS: saveSession(session)
```

**Edge cases**
- **No exploration.** If the participant decides without clicking Why, the record has `explanationOpened = false`, `factorsExpanded = []` and `timeToFirstExpandMs = null`. That is valid data and is central to H3b and H5.
- **Opened but not expanded.** If Why is opened but no row is expanded, `explanationOpened = true`, `timeToFirstExpandMs` is set from the Why open, and `factorsExpanded = []`. Per-row `factor_expand` timestamps stay in the event list for finer analysis.
- **Repeat expands.** Expanding the same factor again adds another `factor_expand` event but doesn't change `factorsExpanded` or `timeToFirstExpandMs`.
- **Decision without closing.** Agree and Override stay enabled while the panel is open. The panel's open state when the decision is made is implied by the event list, so no extra field is needed.
- **Rows start collapsed.** All factor rows start collapsed on every trial. Earlier trials never carry over expanded state, so each expand is a deliberate act.

---

## 5. Wrong-AI-case handling

From the participant's side a wrong case can't be told apart from a correct one. The layout, timing, wording style and controls are the same, and the explanation (B or C) argues for TaskPilot's wrong call. A `false_allow` lets through an action that breaks a rule (overreach), and a `false_block` pauses a valid one (over-caution). To guarantee this, `decisionEngine.buildPresentation` builds the view payload from an explicit allow-list of fields, so `groundTruth`, `isAiCorrect` and `errorType` never reach any view component or React props. Correctness only joins the record inside `logger`, after the participant has decided. There `detectedError` is derived and stored with the trial: `!agreed` on wrong cases, `null` on correct ones.

```mermaid
sequenceDiagram
    actor P as Participant
    participant Trial as TrialScreen
    participant DE as decisionEngine
    participant View as Condition View A B or C
    participant Log as logger
    participant SS as sessionStore

    Trial->>DE: buildPresentation(caseId, condition)
    DE->>DE: load full case incl groundTruth, isAiCorrect, errorType
    DE->>DE: copy allow-listed fields only
    Note over DE: groundTruth, isAiCorrect, errorType are dropped here
    DE-->>Trial: payload identical in shape for correct and wrong cases
    Trial->>View: render payload
    View-->>P: same layout, plausible explanation for the AI decision
    Note over P,View: only the request fields vs the delegation policy reveal the error
    P->>View: Agree or Override
    View->>Trial: onComplete(agreed, confidence)
    Trial->>Log: recordTrial(caseId, condition, agreed, confidence)
    Log->>DE: getTruth(caseId)
    DE-->>Log: isAiCorrect, groundTruth, errorType false_allow or false_block or null
    alt isAiCorrect is false and agreed is false
        Log->>Log: detectedError = true, override caught the false_allow or false_block
    else isAiCorrect is false and agreed is true
        Log->>Log: detectedError = false, counts toward automation-bias rate
    else isAiCorrect is true
        Log->>Log: detectedError = null, not applicable on correct cases
    end
    Log-->>Trial: record with isAiCorrect, errorType, detectedError
    Trial->>SS: saveSession via StudyContext
```

**Edge cases**
- **No leaks through rendering.** Payload types (`ViewPayloadA`, `ViewPayloadB`, `ViewPayloadC`) have no correctness fields at all. A unit test asserts that `JSON.stringify(payload)` never contains `isAiCorrect` or `groundTruth`. DOM attributes, CSS classes and test ids must not encode correctness either.
- **Factor rows in C.** For a wrong case, each factor row's `passes` flag is computed from the true request values (cost against $50.00, recipient against `trustedContacts`, "Triggered by" against "you"), so a careful participant can spot the contradiction. The `detail` text still sounds plausible and supports TaskPilot's call. This is how the case bank tests whether the breakdown makes verification easier (H3b).
- **Same timing.** The fixed ~800 ms "TaskPilot is checking…" delay is the same for correct and wrong cases, and no animation differs between them.
- **Data checks.** `decisionEngine` checks at load time that the stored `groundTruth` matches `evaluatePolicy(request)` against the policy and trusted contacts in `cases.json`, that `errorType` is `false_allow` exactly when `aiDecision` is ALLOW and the truth is BLOCK (and `false_block` for the reverse), and that `isAiCorrect == (aiDecision == groundTruth)`. A mismatch is a build-time and dev-time error, never something the participant sees.
- **Correct cases.** On correct cases `detectedError` is `null`. Analysis of H3a, H3b and H3c filters to `isAiCorrect == false` before using agreement or detection.

---

## 6. Block survey and advancing to the next block

After the fifth trial of a block, `StudyContext` sends the participant to `BlockSurveyScreen` for the condition they just used. The screen loads the 12 Jian et al. (2000) items from `trustScale.json` and shows them with the two perceived-control and accountability items on a 7-point scale. The items say "the assistant" where the original scale says "automation". Every item must be answered before Continue is enabled. Raw answers are stored exactly as given. Reverse-scoring of items 1–5 (8 minus the response) happens only at export or analysis time, so the stored data stays what the participant actually clicked. Submitting persists the survey and either starts the next block or, after block 3, moves to `ExitSurveyScreen`.

```mermaid
sequenceDiagram
    actor P as Participant
    participant SC as StudyContext
    participant Survey as BlockSurveyScreen
    participant Log as logger
    participant SS as sessionStore
    participant Trial as TrialScreen
    participant Exit as ExitSurveyScreen

    SC->>Survey: navigate with blockIndex and condition
    Survey->>Survey: load trustScale.json, 12 Jian items plus 2 perceived-control items
    Survey->>Log: markShown(surveyId)
    Survey-->>P: 14 items on 7-point scales
    loop until all items answered
        P->>Survey: select rating for item i
        Survey->>Survey: store raw value 1 to 7
        Survey->>Survey: Continue enabled only when 14 of 14 answered
    end
    alt participant clicks Continue with missing items
        Survey-->>P: highlight unanswered items, stay on screen
    else all answered
        P->>Survey: click Continue
        Survey->>Log: recordSurvey(blockIndex, condition, raw answers)
        Log->>Log: durationMs = now - shownAt
        Log-->>Survey: survey record, raw values only
        Survey->>SC: dispatch BLOCK_SURVEY_COMPLETED
        SC->>SS: saveSession(session)
        alt blockIndex less than 2
            SC->>SC: blockIndex + 1, trialIndex = 0
            SC->>Trial: navigate to first trial of next block
            Note over Trial: optional short break and condition intro before trial 1
        else last block done
            SC->>Exit: navigate to ExitSurveyScreen
        end
    end
    Note over SS: reverse scoring of Jian items 1 to 5 as 8 minus x happens at export or analysis only
```

**Edge cases**
- **Which condition was rated.** Each survey record stores `condition` and `blockIndex` explicitly, so the analysis never has to infer from the order which condition a trust score belongs to.
- **Item order.** The Jian items are always presented in their published order. Shuffling items isn't part of the design, and keeping the order fixed keeps the reverse-scoring indices stable.
- **No defaults.** No item has a pre-selected value. That avoids midpoint bias and keeps the "every item answered" check meaningful.
- **Double submit.** Continue is disabled after the first click. A second dispatch for the same block is ignored by the reducer if that block's survey already exists.
- **Back navigation.** The browser Back button doesn't return to the block's trials. The router guard in `StudyContext` redirects to the current step, so answers can't be changed after the trust rating.
- **Exit survey.** The exit survey (demographics, how often they use AI assistants or agents, preferred condition, open comment) uses the same validation and save pattern. Only the open comment is optional. Submitting it sets `completedAt` and moves to `DebriefScreen`, which explains that TaskPilot was scripted and that some calls were wrong on purpose.

---

## 7. Refresh and crash recovery

Because `sessionStore` saves after every trial and every survey, a reload loses at most the trial or survey that was on screen. On startup the app reads `localStorage`, looks for a session with no `completedAt`, and offers the researcher a resume. Resuming puts the participant on the next unfinished step. If that step is a trial, the half-seen attempt is thrown away, the case is shown again with a fresh timer, and the new record is flagged `resumed = true` so the analysis can treat its timing with care.

```mermaid
sequenceDiagram
    actor Researcher
    participant App as App bootstrap
    participant SS as sessionStore
    participant LS as localStorage
    participant SC as StudyContext
    participant Consent as ConsentScreen
    participant Trial as TrialScreen
    participant Log as logger

    Note over App: page reload, tab crash, or browser restart
    App->>SS: loadAll()
    SS->>LS: getItem xai-study:sessions
    LS-->>SS: raw JSON
    alt JSON parse fails
        SS->>LS: setItem xai-study:sessions-corrupt-timestamp with raw text
        SS-->>App: empty list, error flag
        App-->>Researcher: warn storage unreadable, raw copy kept for admin
    else parsed
        SS-->>App: sessions
        App->>App: find most recent session without completedAt
        alt incomplete session found
            App-->>Researcher: prompt resume participant pid at step
            alt researcher chooses resume
                App->>SC: dispatch RESUME_SESSION with stored session
                SC->>SC: recompute next step from stored records
                alt next step is a trial
                    SC->>Trial: navigate to block b, trial t
                    Trial->>Log: start trial with resumed flag
                    Log->>Log: new shownAt after paint, timer restarts from zero
                    Note over Trial,Log: the interrupted attempt and its partial events are discarded
                else next step is a block survey
                    SC->>SC: navigate to BlockSurveyScreen, answers start empty
                else next step is exit survey
                    SC->>SC: navigate to ExitSurveyScreen
                end
            else researcher chooses abandon
                App->>SS: markAbandoned(sessionId)
                SS->>LS: setItem xai-study:sessions
                App->>Consent: start fresh
            end
        else none incomplete
            App->>Consent: normal start
        end
    end
```

**Edge cases**
- **Working out the next step.** The next step is computed from what's stored (the number of trial records per block and whether each block's survey exists), not from a separately saved "current screen" pointer. The stored data is the single source of truth.
- **Abandoned sessions are kept.** They're marked `status = "abandoned"`, still exported, and excluded by default in the analysis. They're never deleted automatically.
- **Plan check.** On resume, `counterbalance.assign(pid)` is recomputed and compared with the stored plan. A mismatch, for example after a code change between sessions, shows a warning, and the stored plan wins.
- **What `resumed` means.** `resumed = true` is set only on the trial that was interrupted. Later trials have `resumed = false`. The record also keeps a `resumeCount` on the session for transparency.
- **Two tabs.** Only one tab should run the study. A `storage` event listener detects writes from another tab and shows a warning, because both tabs would otherwise overwrite the same key.
- **Unsaved trial.** A crash between the click and the `setItem` loses that trial's decision. The case is shown again on resume, and the participant decides it a second time with `resumed = true`.

---

## 8. Admin export and optional submission

The researcher opens `/admin`, which the participant flow never links to. `AdminScreen` asks `sessionStore` for every session, shows a summary with completion status, and offers three downloads: the raw JSON of everything, a trial-level CSV with one row per trial, and a wide survey CSV with one row per participant and block (raw Jian items, reverse-scored items 1–5, and perceived control), with exit-survey answers joined by pid. If `VITE_SUBMIT_URL` is set, sessions can also be POSTed to the Google Apps Script web app. A failed POST never affects the local data, so the downloads are always the fallback.

```mermaid
sequenceDiagram
    actor Researcher
    participant Admin as AdminScreen
    participant SS as sessionStore
    participant LS as localStorage
    participant Browser as Browser download
    participant GAS as Apps Script at VITE_SUBMIT_URL

    Researcher->>Admin: open /admin
    Admin->>SS: loadAll()
    SS->>LS: getItem xai-study:sessions
    LS-->>SS: sessions JSON
    SS-->>Admin: sessions with status and submitted flag
    Admin-->>Researcher: table of sessions, counts, unsynced badge
    Researcher->>Admin: click Export
    Admin->>SS: exportJSON()
    SS-->>Admin: full sessions blob incl events and plans
    Admin->>SS: exportTrialsCSV()
    SS->>SS: one row per trial, pid, styleArm, block, condition, caseId, errorType, isAiCorrect, agreed, detectedError, decisionTimeMs, policyOpened, resumed
    SS-->>Admin: trials.csv text
    Admin->>SS: exportSurveysCSV()
    SS->>SS: one row per pid and block, jian raw 1 to 12, jian 1 to 5 reversed as 8 minus x, perceived control, exit fields
    SS-->>Admin: surveys.csv text
    Admin->>Browser: trigger downloads via Blob and object URL
    Browser-->>Researcher: sessions.json, trials.csv, surveys.csv
    opt VITE_SUBMIT_URL is set
        Researcher->>Admin: click Submit unsynced
        loop each completed session with submitted false
            Admin->>GAS: POST session JSON as text/plain
            alt response ok
                GAS-->>Admin: 200 ok
                Admin->>SS: markSubmitted(sessionId, timestamp)
                SS->>LS: setItem xai-study:sessions
            else network error, timeout, or non-200
                GAS-->>Admin: failure
                Admin->>SS: recordSubmitError(sessionId, message)
                Admin-->>Researcher: show failed, keep local copy, use downloads
            end
        end
    end
```

**Edge cases**
- **No CORS preflight.** The POST uses `Content-Type: text/plain` so the browser doesn't send a preflight request, which Apps Script web apps don't handle. The script parses the body as JSON. A timeout (about 10 s via `AbortController`) counts as a failure.
- **Local data is never deleted.** A successful submission only sets `submitted` and `submittedAt`. Clearing local data is a separate admin action that requires typing a confirmation, and it's offered only after a download.
- **CSV safety.** Values are quoted and inner quotes are doubled. Free-text fields such as the open comment are escaped, and newlines inside them are preserved within quotes. Cells that start with `=`, `+`, `-` or `@` get a leading apostrophe so spreadsheets don't run them as formulas.
- **Where scoring happens.** Reverse-scored columns are computed during export from the raw values. They're never written back to storage, so re-exporting is idempotent.
- **Which sessions are exported.** Incomplete and abandoned sessions are included in the JSON and CSV, with a `status` column, so the researcher decides on exclusions during analysis.
- **Optional add-on.** If `VITE_SUBMIT_URL` isn't set, the Submit control doesn't appear at all. The core study path never depends on the network.

---

## Related docs

- [architecture.md](architecture.md): module boundaries and the overall structure of the app
- [system-design.md](system-design.md): routing, state management, storage and deployment
- [sequence-diagrams.md](sequence-diagrams.md): this document
- [data-model.md](data-model.md): case bank, session, trial, survey and export schemas
- [ai-design.md](ai-design.md): Wizard-of-Oz TaskPilot engine, explanation design and the wrong-case strategy
- [research-positioning.md](research-positioning.md): why the domain moved to agent permission prompts and how the study relates to prior work
- [_shared-decisions.md](_shared-decisions.md): the binding source of truth for every doc
