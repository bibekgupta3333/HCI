# Shared design decisions (source of truth for all docs) — v3

Every doc in `docs/` must agree with these decisions. Sources:
- `proposal.txt` and `literature.txt` (sections 8–9)
- Deepthi's v3 proposal (the team discussion, 2026-10-17)
- `CLAUDE.md`

The previous design (v2.1, approving an AI agent's actions) is archived in `archive/v2.1-agent-permission/`.

## Active short-study override — 2026-10-18

NEW sessions use four parts of **two distinct posts each (8 total)**. The 24-post bank below is retained for sampling and legacy sessions, not shown in full to new participants. Each part selects one correct and one wrong label. Each person sees two false alarms and two misses; each condition’s wrong type flips in the next 16-person cycle, giving a 32-person condition-by-error balance. Shuffle the two positions; the legacy rule barring both wrong posts from positions 1–2 does not apply to the short design.

Existing saved six-post plans remain intact. Derive progress, eligibility and counts from the saved plans; do not pool short and legacy outcomes. Exports append `plannedTrials` and `studyVariant`. Keep the full block questionnaires, acknowledge 64 ratings remain, and describe duration/power cautiously.

Add compact first-two-post guidance explaining each part’s existing interaction, without answers or compulsory verification. See [parts-and-study-defense.md](parts-and-study-defense.md). Participant attribution is an HCI experiment conducted as part of graduate study at Florida Polytechnic University. Remove visible approval/contact/professor placeholders without inventing substitutes.

## Domain (v3): AI accuracy labels on social media posts
**Main question:** "When the AI label is wrong, do explanations help people catch it, and how do they make people feel?"

**Scenario:**
- Participants read made-up social media posts from a fictional town, Riverton (in fictional Alder County).
- Each post carries an **AI label**, either **"Likely accurate"** (✓) or **"Likely misleading"** (⚠).
- Every post has a **fact sheet** (a fictional official record) that proves the post true or false.
- The participant clicks **Agree with label** or **Disagree with label**. `agreed = true` means they went with the AI label.
- Some labels are deliberately wrong. The AI is Wizard-of-Oz: no ML model or LLM runs, and every label is scripted.

**Two error types, compared head to head** (this is the headline):
- **False alarm** (`errorType: "false_alarm"`): a TRUE post labeled "Likely misleading".
- **Miss** (`errorType: "miss"`): a FALSE post labeled "Likely accurate".

**Change from the approved proposal:**
- The domain changes (loan approval → content labels).
- A fourth condition is added (counterfactual).
- Tension and frustration measures are added.

The research questions retain agreement, trust, error detection and fairness. The app does not claim institutional approval or endorsement.

## Stack (implemented)
- React 18 + TypeScript + Vite client; Express 5 backend with better-sqlite3.
- One server-side SQLite file, API persistence, admin CSV/JSON exports.
- `app/shared/data/posts.json` is server-only; `surveyItems.json` supplies the scales.
- Browser stores active-session id only and clears study storage after final save.
- Self-start on desktop/phone, no admin permission. Analysis occurs outside the app.

## Modules (names to use consistently)
- `src/engine/labelEngine.ts`: the Wizard-of-Oz labeller. Its functions are `buildPresentation(post, condition)` (an allow-listed payload with no correctness fields), `getTruth(postId)` (called only by `logger`) and `validatePost(post)` (checks the ground truth against the fact sheet's key fact).
- `src/engine/counterbalance.ts` (generalised to k = 4 conditions) and `src/engine/rng.ts` (mulberry32, seeded by pid).
- `src/conditions/`: `NoExplanationView` (A), `StaticExplanationView` (B), `InteractiveExplanationView` (C), `CounterfactualView` (D), and `conditionRegistry.ts`.
- Shared components: `PostCard` (the post), `LabelPanel` (the AI label), `FactSheetPanel` (an on-demand side panel), `LikertScale`, `SliderScale`.
- `src/study/`: `ConsentScreen`, `InstructionsScreen` (with 1 practice post), `TrialScreen`, `PostRatingStrip`, `BlockSurveyScreen`, `ExitSurveyScreen`, `DebriefScreen`, `AdminScreen`.
- `src/logging/logger.ts`, `src/storage/sessionStore.ts`.

## Conditions (4, within subjects)
| | Name | What the participant sees under the label |
|---|---|---|
| A | No explanation | the label only |
| B | Static reason | one fixed sentence, 8–14 words, e.g. "Flagged: claims about water safety are often exaggerated." |
| C | Interactive "Why?" | a "Why?" button opening 3 rows: **Source** (account, verified badge), **Claim vs record** (the post's key value vs the fact-sheet value, ✓/✗), **Wording** (neutral or sensational). Each row expands to one `detail` sentence. |
| D | Counterfactual | one "would be … if …" sentence, 10–16 words, e.g. "This would be labeled accurate if it cited the March test report." |

**Explanation rules:**
- The B, C-detail and D text always **argue for the AI's label**, with the same confident tone whether the label is right or wrong.
- On wrong labels, B and D cite a plausible but non-decisive factor.
- **C's "Claim vs record" row shows the TRUE comparison**, so the error can be checked. This is the C-shows-true-values principle carried over from v2, and the team has to confirm it.
- No AI confidence score is ever shown.
- The label appears after a fixed ~800 ms "AI is checking…" delay in every condition.

## Fact sheet
- Every post has one fact sheet. It's a fictional record: a title, a 1–3 sentence body containing the **key fact**, and a source such as "Riverton Public Works (fictional)".
- It opens from a "Fact sheet ▸" button in every condition. It's identical across conditions and never mentions the label.
- Opening, closing and time open are logged (`factSheetOpened`, `factSheetOpenMs`).
- The ground truth is fixed by comparing the post's claim with the fact sheet's key fact.

## Post bank (24 posts, 4 matched sets of 6)
Each set has:
- 2 correct "Likely accurate" labels
- 2 correct "Likely misleading" labels
- 1 false alarm
- 1 miss

That gives 16 correct and 8 wrong labels overall. Each set has one `clear` and one `subtle` wrong label. Error type and difficulty are fully crossed: false alarms are p03 and p21 (clear) and p09 and p15 (subtle), and misses are p10 and p16 (clear) and p04 and p22 (subtle). That way H1a isn't confounded with difficulty. Topics: environment (env), public services (svc), local events (evt).

| id | set | topic | post claim (short) | fact sheet key fact (short) | truth | AI label | correct | errorType | difficulty |
|---|---|---|---|---|---|---|---|---|---|
| p01 | S1 | env | Recycling rate rose to 41% in 2025 | 2025 recycling rate: 41% | TRUE | accurate | yes | null | — |
| p02 | S1 | svc | Library will close every Monday from May | Library closes Sundays only, open Mondays | FALSE | misleading | yes | null | — |
| p03 | S1 | evt | Riverside Fair runs June 6–8 at Mill Park | Fair: June 6–8, Mill Park | TRUE | misleading | no | false_alarm | clear |
| p04 | S1 | env | Lake Alder hit a record low this spring | Lowest since 2019, record low was 2012 | FALSE | accurate | no | miss | subtle |
| p05 | S1 | svc | Bus Route 9 adds Saturday service from March 1 | Route 9 Saturday service starts March 1 | TRUE | accurate | yes | null | — |
| p06 | S1 | evt | Riverton marathon is cancelled this year | Marathon scheduled Oct 12 | FALSE | misleading | yes | null | — |
| p07 | S2 | env | City planted 1,200 street trees in 2025 | 1,200 trees planted in 2025 | TRUE | accurate | yes | null | — |
| p08 | S2 | svc | Trash pickup moves to every other week in April | Pickup stays weekly | FALSE | misleading | yes | null | — |
| p09 | S2 | evt | Farmers market opens May 3 at Depot Square | Market opens May 3, Depot Square | TRUE | misleading | no | false_alarm | subtle |
| p10 | S2 | svc | Downtown parking now costs $4 an hour | Parking remains $2 per hour | FALSE | accurate | no | miss | clear |
| p11 | S2 | evt | Fireworks start 9:30 pm July 4 at the riverfront | July 4 fireworks 9:30 pm, riverfront | TRUE | accurate | yes | null | — |
| p12 | S2 | env | Air-quality alerts on 30 days last summer | Alerts issued on 4 days | FALSE | misleading | yes | null | — |
| p13 | S3 | svc | Library card renewals are now free online | Online renewal is free | TRUE | accurate | yes | null | — |
| p14 | S3 | env | Alder River closed to swimming all summer | Open, 2 advisory days only | FALSE | misleading | yes | null | — |
| p15 | S3 | env | Tap water met all 12 safety limits in March | March: all 12 tests within limits | TRUE | misleading | no | false_alarm | subtle |
| p16 | S3 | evt | Mill Park concert moved to August 20 | Concert remains August 13 | FALSE | accurate | no | miss | clear |
| p17 | S3 | svc | New crosswalk signals installed on Elm St | Elm St signals installed | TRUE | accurate | yes | null | — |
| p18 | S3 | evt | Parade closes Main St for three days | Main St closed 1 day | FALSE | misleading | yes | null | — |
| p19 | S4 | evt | Half-marathon raised $18,000 for the food bank | $18,000 raised | TRUE | accurate | yes | null | — |
| p20 | S4 | svc | Property tax bills due two weeks earlier this year | Due date unchanged, May 15 | FALSE | misleading | yes | null | — |
| p21 | S4 | svc | Pool opening delayed to June 14 for repairs | Pool opens June 14 after repairs | TRUE | misleading | no | false_alarm | clear |
| p22 | S4 | env | City banned gas leaf blowers from this fall | Ban proposed, vote in November | FALSE | accurate | no | miss | subtle |
| p23 | S4 | env | Compost drop-off opens Saturdays 8–noon | Saturdays 8 am–12 pm | TRUE | accurate | yes | null | — |
| p24 | S4 | evt | Holiday market tickets cost $25 this year | Entry is free | FALSE | misleading | yes | null | — |

**Tallies:**
- Labels: 12 "accurate" and 12 "misleading".
- Truth: 12 TRUE and 12 FALSE.
- Wrong labels: 4 false alarms (p03, p09, p15, p21) and 4 misses (p04, p10, p16, p22).

**Content rules:** everything is fictional (people, accounts, places, agencies). There are no health or health-care claims (p10 was changed from a flu-shot fee to a parking fee for this reason), and no real brands. The debrief shows the facts for every wrong label.

## Post fields
- `id`, `set`, `topic`
- `author {handle, displayName, verified}`, `text`, `postedAgo`, `likes`, `reposts`
- `keyFact {claimValue, recordValue}`
- `factSheet {title, body, source}`
- `groundTruth` (`"TRUE"`|`"FALSE"`), `aiLabel` (`"accurate"`|`"misleading"`), `isAiCorrect`
- `errorType` (`null`|`"false_alarm"`|`"miss"`), `difficulty` (`null`|`"clear"`|`"subtle"`)
- `staticExplanation` (B), `factors[]` (C: `{key: "source"|"claimVsRecord"|"wording", label, displayValue, passes, detail}`), `counterfactualExplanation` (D)

`stimuli.md` holds all the final participant-facing wording and is the authority on it. `data-model.md` is the authority on field names and types.

## Counterbalancing (4 conditions)
- **Condition order:** a 4×4 Williams (balanced Latin square) design. The orders are ABDC, BCAD, CDBA and DACB, and `order = williams[(pid-1) % 4]`.
- **Set rotation:** `rotation = floor((pid-1)/4) % 4`, and a condition's set is `S[(conditionIndex + rotation) % 4]` with A=0, B=1, C=2, D=3.
- **Cycle:** a full balance takes **16 participants**. The target is **N = 32** (2 cycles). The minimum is 16 (one cycle). Deepthi's "20 or more" rounds up to 32, because 20 doesn't complete a cycle.
- **Within a block:** the 6 posts are shuffled with the seeded PRNG, and the 2 wrong labels are never both in positions 1–2.
- **Session:** 4 blocks × 6 posts = 24 trials, plus 1 practice post. It takes about 30–35 minutes.

## Measures
**Per trial:**
- `agreed`, and `detectedError` (`!agreed` on wrong labels, `null` on correct ones)
- `confidence` (1–7, asked after every post)
- `decisionTimeMs` (`decisionTimeRawMs - hiddenMs`), `hiddenMs`, `hiddenCount`, `timingFlag`
- Clicks: `factSheetOpened`, `factSheetOpenMs`, `explanationOpened` and `factorsExpanded[]` (C only), `timeToFirstExpandMs`
- `resumed`

**Per block (condition):**
- Jian et al. (2000) trust scale: 12 items, 7-point, items 1–5 reverse-scored, with "the system" worded as "the AI labels".
- **Fairness:** 2 items, 7-point: "The AI labels were fair to the people who posted" and "The AI labels treated posts consistently".
- `tension` (1–7): "How tense did you feel while judging the posts in this part?"
- `frustrationTlx`: the NASA-TLX frustration item, 0–100 in steps of 5. The slider starts at 50 and has to be moved (`frustrationTlxTouched`).
- `nWrongDetected`

**Exit survey:** demographics, social media use, how often they've seen platform labels, the preferred condition, and a comment.

**Optional, off by default (Deepthi's "drop if too big"):**
- A **consequence banner** ("Posts you agree are accurate stay visible to other users"), stored as session flag `consequenceBanner`.
- An **anxiety scale**.

Both are listed as optional and not built unless the team adds them.

## Research questions and hypotheses (v3)
- **RQ1:** do explanations help people catch wrong labels, and does it differ for false alarms vs misses?
  - H1: detection of wrong labels differs by condition.
  - H1a (headline): misses are caught less often than false alarms, because "Likely accurate" invites no scrutiny.
  - H1b: the gap between the two error types is smallest in C.
- **RQ2:** which explanation type gives the best error detection?
  - H2: detection is highest in C (the verifiable claim-vs-record row) and lowest in B (a persuasive static reason). D is exploratory: it could go either way.
- **RQ3:** do wrong labels create tension, and does explanation type make it better or worse?
  - H3: tension and frustration rise with the number of wrong labels noticed in a block.
  - H3a: B and D lower tension even on wrong labels, which is the "less stressful but more believable" risk.
  - H3b (exploratory): C raises tension when the ✗ row is visible.
- **H4 (trust/agreement):** overall agreement and Jian trust are higher in B, C and D than in A, whether or not the label is correct.
- **H5 (fairness):** fairness is rated highest in C and D and lowest in A.
- **H6 (time/clicks):** decisions take longest in C and D, and opening the fact sheet or expanding rows predicts detection.

## Doc conventions
- GitHub Markdown, with Mermaid in ```mermaid blocks (no semicolons, quote labels with special characters, no HTML).
- Each doc has an H1, a purpose paragraph and a "Related docs" list:
  - `architecture.md`, `system-design.md`, `sequence-diagrams.md`, `data-model.md`, `ai-design.md`
  - `research-positioning.md`, `implementation-plan.md`, `study-protocol.md`, `stimuli.md`, `wireframes.md`

## Settled cross-doc rules (carried over)
- **Payload:** `buildPresentation` uses an allow-list, and only `logger` calls `getTruth`.
- **Per-post confidence (1–7) is required** before Next.
- **Fields that don't apply** (outside C): `explanationOpened = null`, `timeToFirstExpandMs = null`, `factorsExpanded = []`.
- **Interrupted trials:** `resumed = true`. A replacement participant reuses the pid with a new `sessionId`.
- **Indexing:** `blockIndex` 1–4, `positionInBlock` 1–6, trial id `${pid}-${blockIndex}-${positionInBlock}`.
- **UI labels:**
  - Header: "Part x of 4 · Post y of 6".
  - Buttons: "Agree with label" and "Disagree with label".
  - Fact-sheet button: "Fact sheet ▸".
- **Planned commands** (no code yet): `npm run dev`, `npm test` (Vitest), `npm run build`.
