# Shared design decisions (source of truth for all docs)

Every doc in `docs/` must agree with these decisions. Sources: `proposal.txt`, `literature.txt` (sections 8–9), `CLAUDE.md`.

## Stack
- React 18 + TypeScript + Vite single-page app. It's served as static files, so there's no server.
- React Router for screens. State lives in a React Context + reducer (`StudyContext`); there's no Redux.
- The case bank is a static JSON file at `src/data/cases.json`, plus `src/data/trustScale.json` for the survey items. There's no database, as the proposal requires.
- Responses persist to `localStorage` (key `xai-study:sessions`) after every trial, so a page refresh doesn't lose data. The researcher exports them from an `/admin` screen as JSON and CSV downloads.
- An optional add-on (not core): POST each finished session to a Google Apps Script web-app URL set in `VITE_SUBMIT_URL`.
- It runs in a desktop or laptop browser (Chrome, Firefox, Edge), in a moderated lab session.
- Analysis happens outside the app (R or Python, working from the CSV).

## Modules (names to use consistently)
- `src/data/`: `cases.json`, `trustScale.json`.
- `src/engine/decisionEngine.ts`: the Wizard-of-Oz "AI". It looks up the scripted decision, works out the ground truth from the lending rules, and builds the explanation payloads.
- `src/engine/counterbalance.ts`: assigns a participant number to a condition order, case sets, and trial order.
- `src/engine/rng.ts`: a seeded PRNG (mulberry32), seeded from the participant number, so assignments can be reproduced.
- `src/conditions/BlackBoxView.tsx` (A), `StaticExplanationView.tsx` (B), `InteractiveExplanationView.tsx` (C). All three share `<ApplicantCard/>` and `<DecisionPanel/>`.
- `src/study/`: the screens: `ConsentScreen`, `InstructionsScreen`, `TrialScreen`, `BlockSurveyScreen`, `ExitSurveyScreen`, `DoneScreen`, `AdminScreen`.
- `src/logging/logger.ts`: event and trial logging plus timing (`performance.now()`).
- `src/storage/sessionStore.ts`: reads and writes localStorage, and exports JSON/CSV.

## Lending rules (the "stated criteria" shown to participants)
An applicant is APPROVED only if all three are true:
1. Annual income ≥ $45,000
2. Credit history length ≥ 3 years
3. Debt-to-income (DTI) ratio ≤ 40%

Otherwise they're REJECTED. The rules appear on the instructions screen and are available on every trial, so a participant can check any decision.

## Case bank
- 15 cases (`case-01` … `case-15`). 9 are correct AI decisions and 6 are deliberately wrong.
- A wrong decision contradicts the applicant's own numbers: approving someone who fails a rule, or rejecting someone who passes all three.
- The cases are split into 3 matched sets (S1, S2, S3) of 5 cases each: 3 correct and 2 wrong, with a mix of approvals and rejections and similar difficulty.
- Case fields: `id`, `set`, `applicant {name, age, occupation, annualIncome, creditHistoryYears, debtToIncome, loanAmount, loanPurpose}`, `aiDecision` (APPROVED|REJECTED), `groundTruth` (computed by the rules, and also stored so it can be checked), `isAiCorrect`, `errorType` (null | "false_approval" | "false_rejection"), `staticExplanation` (string), `factors[] {key, label, applicantValue, threshold, comparator, passes, weight, detail}`.
- For wrong cases, the scripted explanation is written to sound plausible. It supports the AI's (wrong) decision, the same way a real system would justify its output. This is what tests automation bias.

## Conditions
- A Black Box: shows the decision only.
- B Static: the decision plus `staticExplanation`.
- C Interactive: the decision plus a "Why?" button that opens an expandable panel with one row per factor (value vs. threshold, pass/fail). Every expand and collapse is logged.

## Counterbalancing
- Condition order uses all 6 permutations of A/B/C: `order = permutations[(pid-1) % 6]`.
- Set-to-condition mapping is a 3×3 Latin square rotation: `rotation = floor((pid-1)/6) % 3`. Together with the 6 orders, that makes a full cycle every 18 participants.
- Within a block, the trial order of the 5 cases is shuffled with the seeded PRNG. One constraint: the 2 wrong cases are never both in the first two positions, and their positions vary from participant to participant.
- Each participant does 3 blocks × 5 trials = 15 trials, with a block survey after each block.

## Measures
- Per trial: `agreed` (bool), `decisionTimeMs` (from the moment the decision is shown to the agree/disagree click), `explanationOpened` and `factorsExpanded[]` (C only), `timeToFirstExpandMs`, `confidence` (1–7, optional follow-up).
- Per block (condition): Jian et al. (2000) Trust in Automation, which has 12 items on a 7-point scale (items 1–5 are distrust items, reverse-scored), and a perceived fairness rating (2 items, 7-point).
- Exit survey: demographics, AI familiarity, the preferred condition, and an open comment.
- Derived (at analysis time): agreement rate overall (H1), mean trust (H2), agreement on incorrect cases, i.e. the automation-bias rate (H3a/H3b), fairness (H4), and decision time compared with detection (H5).

## Hypotheses (from literature.txt §9)
- H1: agreement goes up with depth, A < B < C.
- H2: trust is higher in B and C than in A.
- H3a: on wrong cases, agreement is higher in B than in A.
- H3b (exploratory): on wrong cases, agreement is lower in C than in B.
- H4: fairness is highest in C and lowest in A.
- H5: decision time is longest in C, and longer times go with better detection.

## Doc conventions
- GitHub-flavored Markdown with Mermaid diagrams in ```mermaid blocks. Use mermaid syntax that GitHub renders: flowchart, sequenceDiagram, erDiagram, classDiagram, stateDiagram-v2.
- Don't use HTML. Keep labels short. Put labels that contain special characters (parentheses, ≥, %) in double quotes.
- Each doc starts with an H1 title and a one-paragraph purpose, and ends with a "Related docs" list linking the sibling files:
  `architecture.md`, `system-design.md`, `sequence-diagrams.md`, `data-model.md`, `ai-design.md`.

## Settled after the docs were drafted
Where the drafts disagreed, these rules now apply. `data-model.md` is the authority on field names, types and the case bank.
- **Engine names:** the engine function is `decisionEngine.buildPresentation(case, condition)`. Correctness fields come from `decisionEngine.getTruth(caseId)`, which only `logger` calls, never a view.
- **`timeToFirstExpandMs`:** measured from when the decision is shown to the first "Why?" open, not to the first factor-row expand.
- **Fields that don't apply in A and B:** `explanationOpened = null`, `timeToFirstExpandMs = null`, `factorsExpanded = []`. In C, `explanationOpened` is `false` if Why is never opened.
- **`detectedError`:** `!agreed` on wrong cases, `null` on correct cases.
- **Interrupted trials:** flagged `resumed` (not `restarted`/`attempt`). A replacement participant reuses the pid in a new `sessionId`.
- **Timing fields** (from `system-design.md` §5): `decisionTimeMs = decisionTimeRawMs - hiddenMs`, plus `hiddenMs`, `hiddenCount`, `blurCount`, `timingFlag` and `rulesOpened`.
- **Wrong-case difficulty:** each set has 1 clear and 1 near-threshold wrong case, and a `difficulty` field is a covariate. Values exactly on a threshold appear only in correct cases (`case-09`, `case-14`).
- **Set mapping:** a condition's set is `S[(conditionIndex + rotation) % 3]` with A=0, B=1, C=2.
- **DTI format:** stored as a whole percent (`52`, not `0.52`). Factor keys are `annualIncome`, `creditHistoryYears` and `debtToIncome`.
- **Proposed modules** beyond the list above: `RulesPanel.tsx`, `LikertScale.tsx`, `state/studyReducer.ts`, `types.ts` (see `architecture.md`).
