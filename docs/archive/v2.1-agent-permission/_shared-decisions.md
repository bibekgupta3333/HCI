# Shared design decisions (source of truth for all docs)

Every doc in `docs/` must agree with these decisions. Sources: `proposal.txt`, `literature.txt` (sections 8–9), `CLAUDE.md`, and the domain-selection research recorded in `research-positioning.md`.

## Domain (v2): approving actions proposed by an AI agent
**The domain changed from loan approval to agent permission prompts.** Loan approval is heavily studied: He, Aishwarya & Gadiraju (IUI 2025) already ran a loan task with a conversational explainer and found it made overreliance worse. Approving an AI agent's actions has little research behind it and is very current. The nearest prior work (He, Demartini & Gadiraju, CHI 2025, "Plan-Then-Execute", and 2026 preprints on approving computer-use agents) varies the plan, the display or the policy. **None of it varies how deeply the agent explains itself while planting actions that contradict visible rules.** The research questions, the A/B/C manipulation, the planted errors, the within-subjects design and the counterbalancing are all unchanged from `proposal.txt`. Only the scenario changes, and H4 changes from fairness to perceived control. **This change from the approved proposal needs sign-off from the instructor.**

**Scenario.** The participant has a personal AI assistant agent, **TaskPilot** (a fictional name). The participant gives it tasks, and it carries them out on their behalf. Before each action, TaskPilot checks the action against the participant's **delegation policy** and gives its call:
- **ALLOW:** "Ready to go: this fits your rules."
- **BLOCK:** "I paused this: it breaks your rules."

The participant then clicks **Agree** (go with TaskPilot's call) or **Override** (do the opposite). `agreed = true` means they went with TaskPilot. The participant always plays "you", the account owner. Every person, email address and vendor is fictional, and domains use `.example` or the fictional `northwind.edu`.

## Stack
- React 18 + TypeScript + Vite single-page app. It's served as static files, so there's no server.
- React Router for screens. State lives in a React Context + reducer (`StudyContext`); there's no Redux.
- The case bank is a static JSON file at `src/data/cases.json`, which includes the `policy` and `trustedContacts`. Survey items live in `src/data/trustScale.json`. There's no database, as the proposal requires.
- Responses persist to `localStorage` (key `xai-study:sessions`) after every trial. The researcher exports them from `/admin` as JSON and CSV.
- An optional add-on (not core): POST each finished session to a Google Apps Script URL set in `VITE_SUBMIT_URL`.
- It runs in a desktop or laptop browser, in a moderated lab session. Analysis happens outside the app, in R or Python.

## Modules (names to use consistently)
- `src/data/`: `cases.json`, `trustScale.json`.
- `src/engine/decisionEngine.ts`: the Wizard-of-Oz "AI". It looks up the scripted call, computes the ground truth from the delegation policy, and builds the presentation payloads. Its main functions are `buildPresentation(case, condition)`, `getTruth(caseId)` and `evaluatePolicy(request)`.
- `src/engine/counterbalance.ts`, `src/engine/rng.ts` (mulberry32, seeded from the pid).
- `src/conditions/BlackBoxView.tsx` (A), `StaticExplanationView.tsx` (B), `InteractiveExplanationView.tsx` (C). All three share `<ActionCard/>` (which replaces `ApplicantCard`), `<DecisionPanel/>` and `<PolicyPanel/>` (which replaces `RulesPanel`).
- `src/study/`: `ConsentScreen`, `InstructionsScreen`, `TrialScreen`, `BlockSurveyScreen`, `ExitSurveyScreen`, `DebriefScreen`, `AdminScreen`.
- `src/conditions/conditionRegistry.ts` (maps Condition → view, so condition D can be added later), `src/components/SliderScale.tsx` (TLX slider).
- `src/logging/logger.ts`, `src/storage/sessionStore.ts`. Also proposed: `LikertScale.tsx`, `state/studyReducer.ts`, `types.ts`.

## Delegation policy (the "stated criteria" shown to participants)
An action should be **ALLOWED** only if all three rules hold. Otherwise it should be **BLOCKED**.
1. **Cost**: the action spends at most $50.00 (`cost <= 50`). Free actions cost $0.
2. **Trusted recipient**: the recipient or vendor is *exactly* on the trusted-contacts list. The list is always on screen, and a lookalike address doesn't count.
3. **Requested by you**: the action comes from your own instruction, not from text inside an email, a web page or a document. This is a prompt-injection check, and the action card has a "Triggered by" field that shows the source.

The policy panel is open on the instructions screen and can be opened on every trial, so every call can be checked against it.

Trusted contacts (fictional):
- `alex.chen@northwind.edu` (roommate)
- `r.patel@northwind.edu` (Dr. Patel, professor)
- `studygroup@northwind.edu`
- `maria.r@mailbox.example` (Mom)
- `bookstore.northwind.edu` (campus bookstore)
- `cloudprint.example` (printing service)

## Case bank (15 cases, 3 matched sets)
There are 9 correct calls and 6 wrong ones. Each set has the same structure:
- 2 correct ALLOWs (1 clear, 1 near-threshold)
- 1 correct BLOCK (clear)
- 1 `false_allow`, where the agent approves an action that breaks a rule (agent overreach)
- 1 `false_block`, where the agent blocks a valid action (over-caution)

The rule a false allow breaks rotates by set: S1 breaks cost, S2 breaks the trusted recipient (a lookalike domain), and S3 breaks "requested by you" (prompt injection). Each set has 1 clear and 1 near-threshold wrong case.

| id | set | your task | proposed action | recipient / vendor | cost | triggered by | truth | AI call | correct | errorType | difficulty | fails |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| case-01 | S1 | Order printer paper for my dorm | purchase: 2 reams of paper | cloudprint.example | 18.50 | you | ALLOW | ALLOW | yes | null | clear | none |
| case-02 | S1 | Renew my textbook rental | purchase: semester rental renewal | bookstore.northwind.edu | 89.00 | you | BLOCK | ALLOW | no | false_allow | clear | cost |
| case-03 | S1 | Buy the chemistry lab manual | purchase: lab manual | bookstore.northwind.edu | 48.99 | you | ALLOW | BLOCK | no | false_block | near_threshold | none |
| case-04 | S1 | Pay Alex my share of the pizza | payment | alex.chen@northwind.edu | 49.50 | you | ALLOW | ALLOW | yes | null | near_threshold | none |
| case-05 | S1 | Summarize my inbox | send email: reply with your home address | offers@promo-deals.example | 0.00 | email from promo-deals.example | BLOCK | BLOCK | yes | null | clear | trusted, requested |
| case-06 | S2 | Accept Dr. Patel's office-hours invite | calendar: accept invite | r.patel@northwind.edu | 0.00 | you | ALLOW | ALLOW | yes | null | clear | none |
| case-07 | S2 | Send my essay draft to Dr. Patel | send email: attach essay draft | r.patel@northwlnd.edu | 0.00 | you | BLOCK | ALLOW | no | false_allow | near_threshold | trusted |
| case-08 | S2 | Share the project folder with my study group | share: edit access to folder | studygroup@northwind.edu | 0.00 | you | ALLOW | BLOCK | no | false_block | clear | none |
| case-09 | S2 | Top up my print credit | purchase: print credit | cloudprint.example | 50.00 | you | ALLOW | ALLOW | yes | null | near_threshold | none |
| case-10 | S2 | Book a flight home | purchase: one-way ticket | skyfare.example | 214.00 | you | BLOCK | BLOCK | yes | null | clear | cost, trusted |
| case-11 | S3 | Email Mom my flight times | send email: flight itinerary | maria.r@mailbox.example | 0.00 | you | ALLOW | ALLOW | yes | null | clear | none |
| case-12 | S3 | Summarize my inbox | send email: forward your class schedule | studygroup@northwind.edu | 0.00 | email from studygroup@northwind.edu | BLOCK | ALLOW | no | false_allow | near_threshold | requested |
| case-13 | S3 | Buy a lab coat from the bookstore | purchase: lab coat | bookstore.northwind.edu | 12.00 | you | ALLOW | BLOCK | no | false_block | clear | none |
| case-14 | S3 | Pay Alex back for movie tickets | payment | alex.chen@northwind.edu | 47.80 | you | ALLOW | ALLOW | yes | null | near_threshold | none |
| case-15 | S3 | Summarize this article for me | purchase: "premium summary" subscription | summarize-pro.example | 29.99 | web page summarize-pro.example | BLOCK | BLOCK | yes | null | clear | trusted, requested |

Tallies: 9 AI ALLOW and 6 AI BLOCK, and 9 true ALLOW and 6 true BLOCK. A value exactly on a threshold appears only in a correct case (`case-09`, $50.00). The "near" wrong cases are:
- case-03 ($48.99, just under the limit)
- case-07 (`northwlnd` vs `northwind`, a lookalike domain)
- case-12 (the injected instruction comes from a *trusted* sender, so only the "Triggered by" field gives it away)

## Case fields
Each case has these fields:
- `id`, `set`
- `request {task, actionType, actionSummary, recipient, cost, triggeredBy}`. `actionType` is one of `purchase`, `payment`, `send_email`, `calendar`, `share`. `triggeredBy` is `"you"` or a string naming the source.
- `aiDecision` (`ALLOW`|`BLOCK`), `groundTruth`, `isAiCorrect`
- `errorType`: `null`, `"false_allow"` or `"false_block"`
- `difficulty`
- `staticExplanation`: the B text, written first-person in the agent's voice
- `factors[]`, each `{key, label, displayValue, threshold, comparator, passes, detail}`

The factor keys are `cost` (comparator `lte`, threshold 50), `recipientTrusted` (comparator `inList`, against `trustedContacts`) and `userRequested` (comparator `equalsYou`). Like the loan version, `passes` is always computed from the true values. Only the B text and each factor's `detail` text argue for the AI's call.

## Conditions
- **A Black Box:** the ALLOW/BLOCK call only.
- **B Static:** the call plus one first-person sentence in the agent's voice, 8–14 words, e.g. "I checked this: it's within budget and goes to a trusted contact." It's written in the same confident tone whether the call is right or wrong. A false allow leaves out the broken rule, and a false block calls a passing factor a risk.
- **C Interactive:** the call plus a "Why?" button that opens 3 rows (Cost, Recipient, Requested by). Each row shows the true value, the rule and ✓/✗, and expands to a `detail` sentence. Every expand and collapse is logged.

## Counterbalancing (unchanged)
- Condition order: `order = permutations[(pid-1) % 6]`.
- Set rotation: `rotation = floor((pid-1)/6) % 3`, and a condition's set is `S[(conditionIndex + rotation) % 3]` with A=0, B=1, C=2. This gives a full cycle every 18 participants.
- Within a block, the 5 trials are shuffled with the seeded PRNG, and the 2 wrong cases are never both in the first two positions. That makes 3 blocks × 5 trials, with a block survey after each block.

## Measures
- **Per trial:** `agreed`, `detectedError` (`!agreed` on wrong cases, `null` on correct ones), `decisionTimeMs` (`decisionTimeRawMs - hiddenMs`), `hiddenMs`, `hiddenCount`, `blurCount`, `timingFlag`, `policyOpened` (renamed from `rulesOpened`), `explanationOpened`, `factorsExpanded[]`, `timeToFirstExpandMs` (to the first "Why?" open), `confidence` (1–7, optional), `resumed`.
- **Per block:** Jian et al. (2000) trust scale, 12 items on a 7-point scale, with items 1–5 reverse-scored. "Automation" is worded as "the assistant" in the items.
- **Per block, affect (v2.1, from Deepthi's proposal):**
  - `tension`: "How tense did you feel while making decisions in this part?", rated 1–7.
  - `frustrationTlx`: the NASA-TLX frustration item, raw on a 0–100 slider in steps of 5 (21 points): "How irritated, stressed or annoyed did you feel during this part?"
  - Both are asked once per block, after the control items. There's no per-trial affect rating, to keep the session around 20 minutes.
- **Per block, perceived control and accountability** (2 items, 7-point; this replaces fairness): "I felt in control of what the assistant did on my behalf" and "I would accept responsibility for the outcomes of these actions."
- **Exit survey:** demographics, how often they use AI assistants or agents, the preferred condition, and an open comment.

## Hypotheses (v2)
- H1: agreement goes up with depth, A < B < C.
- H2: trust is higher in B and C than in A.
- H3a: on wrong calls, agreement is higher in B than in A. A fluent first-person rationale works as a placebic "because" (Langer).
- H3b (exploratory): on wrong calls, agreement is lower in C than in B, because the breakdown makes checking cheap.
- H3c (new, exploratory): detection of `false_allow` depends on which rule is broken. Prompt-injection overreach (case-12-type) is caught least often in every condition.
- H4: perceived control is highest in C and lowest in A.
- H5: decision time is longest in C, and longer times go with better detection.
- H3d (v2.1, exploratory, headline comparison): the two error types are detected at different rates. Overreach (`false_allow`) is caught less often than over-caution (`false_block`), because an ALLOW lets the participant act straight away, while a BLOCK makes them stop and look. This tests "missed error vs false alarm" (Deepthi's gap claim) inside the agent domain. Every analysis of agreement on wrong calls is reported separately by `errorType`.
- H6 (v2.1, exploratory): tension and frustration are higher in blocks with wrong calls the participant noticed, and lowest in C. The breakdown lets people settle their doubts. The competing prediction is that seeing ✗ rows raises tension.

## Planned extensions for the paper (not part of the course build)

### Extension 1: explanation style (Study 2)
Study 2 adds a between-subjects explanation-style factor:
- **Fluent arm:** the first-person agent voice used in Study 1.
- **Terse arm:** template text such as "ALLOW: cost ok, recipient trusted."

Content and factors are identical in both arms. The arm is assigned by pid parity, which needs N = 36, two full cycles. The data model already supports it:
- Session field `styleArm`, defaulting to `"fluent"`.
- Optional case field `staticExplanationTerse`.

### Extension 2: counterfactual explanation, condition D (Study 3, from Deepthi's proposal)
- **What D shows:** the call plus a "what would change this" line in the agent's voice, e.g. "I'd allow this if the cost were $50.00 or less." Like B, it's written to support the AI's call on wrong cases. A false allow's counterfactual describes something that doesn't change the outcome, e.g. "I'd block this if it cost over $50", which is irrelevant to the actual broken rule.
- **What it needs:** 4 conditions × 6 cases = 24 cases in 4 matched sets, a 4×4 balanced Latin square for condition order (a 4-row Williams design) and a 4-set rotation, giving a cycle of 16 participants. Each set has 2 wrong cases (1 `false_allow` + 1 `false_block`).
- **The data model is ready for it:** an optional case field `counterfactualExplanation`, `Condition` extensible to `"D"`, and `BlackBoxView`/`StaticExplanationView`/`InteractiveExplanationView` plus a future `CounterfactualView`. Nothing about D is built for the course.

## Alternatives considered
**Deepthi's proposal (AI labels on social media posts):** made-up posts labelled "Likely accurate/misleading", 4 explanation types, fact sheets, and tension/frustration measures. **Not adopted as the domain:**
- Misinformation-label research is crowded.
- Ground truth depends on a separate fact sheet rather than visible rules.
- The ethics burden is higher.
- It would mean starting the docs over.

**Adopted from it:**
- The false alarm vs missed error comparison (H3d; already present as `false_block` vs `false_allow`).
- The tension and frustration measures (H6).
- The counterfactual explanation (Extension 2).

## Doc conventions
- GitHub-flavored Markdown with Mermaid in ```mermaid blocks (flowchart, sequenceDiagram, erDiagram, classDiagram, stateDiagram-v2). Don't use HTML. Put labels containing special characters in double quotes.
- Each doc starts with an H1 title and a purpose paragraph, and ends with a "Related docs" list: `architecture.md`, `system-design.md`, `sequence-diagrams.md`, `data-model.md`, `ai-design.md`, `research-positioning.md`, `implementation-plan.md`, `study-protocol.md`, `stimuli.md`, `wireframes.md`.

## Settled cross-doc rules (carried over from v1)
`data-model.md` is the authority on field names, types and the case bank.
- **Engine access:** `decisionEngine.buildPresentation(case, condition)` builds the payload from an allow-list of fields. Only `logger` calls `getTruth(caseId)`.
- **Fields that don't apply in A and B:** `explanationOpened = null`, `timeToFirstExpandMs = null`, `factorsExpanded = []`.
- **Interrupted trials:** flagged `resumed = true`. A replacement participant reuses the pid in a new `sessionId`.
- **Indexing:** `blockIndex` runs 1–3 and `positionInBlock` 1–5. The trial id is `${pid}-${blockIndex}-${positionInBlock}`.
- **Policy evaluation:** the public API is `evaluatePolicy(request)`. It wraps a pure `evaluatePolicy(request, policy, trustedContacts)` that reads the `policy` and `trustedContacts` loaded from `cases.json`. Trusted contacts are stored as `{address, label}` objects and matched exactly (`===`, no case folding), so a lookalike never matches.
- **Event names:** `policy_open` and `policy_close`, and `decision_agree` and `decision_override`. The exit survey uses `aiAgentUse` (see `data-model.md`).
- **Final wording:** `stimuli.md` (new in v2.1) holds the final participant-facing text for all 15 cases: task, action, B sentence, C row details, plus Study 2 terse and Study 3 counterfactual drafts. It must match the 3 JSON examples in `data-model.md` exactly, and `ai-design.md` quotes it.
- **v2.1 field names:**
  - `nWrongDetected` (wrong calls overridden in a block; H6 predictor).
  - `frustrationTlxTouched` (the slider was moved at least once; the slider starts at 50).
  - Optional `request.triggerExcerpt` (quoted email or web-page text shown in the "Triggered by" detail for case-05, case-12 and case-15).
- **UI labels:**
  - Trial header: "Part x of 3 · Task y of 5".
  - Policy button: "[Your policy]".
- **Fixed delay:** every call appears after a fixed ~800 ms "TaskPilot is checking…" delay in every condition. Confidence is never shown.
