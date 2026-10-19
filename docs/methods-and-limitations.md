# Do People Trust AI More When It Explains Itself? A Comparative Study of Explanation

Methods and limitations for protocol `calibrated-full-v1`. This is a prospective study description, not a report of collected findings. The title is retained exactly; the primary behavioral objective is appropriate reliance rather than maximizing trust. The companion [pilot and analysis plan](pilot-and-analysis-plan.md) defines readiness criteria and analysis decisions.

## Aim and framing

The study asks whether four explanation interface packages help people accept correct accuracy labels and question wrong labels on fictional social media posts, and how these experiences relate to perceived trust, tension and frustration. Increased trust alone is not evidence of benefit: accepting a wrong label is overreliance, while rejecting a correct label is underreliance. The general framing follows Lee and See's discussion of trust and appropriate reliance ([2004, DOI](https://doi.org/10.1518/hfes.46.1.50.30392)); that reference does not validate this study's brief trust item or its scoring.

Primary comparisons concern appropriate reliance across A–D, supported by separate correct-label acceptance and wrong-label rejection rates. Secondary questions concern condition-specific full trust scores, fairness and affect ratings, confidence, verification behavior and decision timing. These are questions and planned comparisons, not evidence that explanations improve decisions or that one interface is best.

## Setting, participants and procedure

This is an HCI experiment conducted as part of graduate study at Florida Polytechnic University. Participation is voluntary and self-guided; eligibility is age 18 or older and ability to read English. Social media or AI expertise is not required. Course affiliation does not establish institutional approval or endorsement.

A new participant enters a participation code, gives consent, reads instructions and tries one unanalysed practice post. The participant then judges eight distinct posts in four parts of two posts, completes the original full questionnaire after each part, and answers exit questions before seeing the debrief. Confidence from 1–7 remains required after each of the eight decisions. A fact sheet is optional for every post in every condition. No measured completion duration is established; the pilot will measure the complete flow, including consent, practice, questionnaires and debrief.

Labels and explanations are scripted in advance using a Wizard-of-Oz simulation. No AI model, LLM, live social media feed or external fact-checking service generates the study outputs. Riverton/Alder County, accounts, agencies and posts are fictional. Fact sheets establish truth within that setting. Some labels are deliberately wrong, and some explanations can persuasively support those wrong labels. Recruitment and landing copy do not disclose the planted errors. The debrief discloses the simulation, explains false alarms and misses, and provides factual corrections for assigned wrong-label posts. Early exit has its own debrief and describes planned exposure without claiming that every assigned post was viewed.

## Design and assignment

Every participant experiences all four interface packages, with different posts in each:

| Condition | Package |
|---|---|
| A | Accuracy label without an explanation; common optional fact sheet available |
| B | Accuracy label plus one static scripted reason |
| C | Accuracy label plus Why? opening Source, Claim vs record and Wording rows, each independently expandable |
| D | Accuracy label plus one scripted counterfactual sentence |

The post card, decisions, confidence control, common checking state and fact-sheet access are shared. C's true Claim vs record comparison is preserved, even when it contradicts the scripted label. This gives C an additional route to decisive factual evidence. Consequently, comparisons involving C evaluate its combined content and interaction package; they cannot isolate the effect of interactivity, user control or clicking. A follow-up could hold factual content constant and compare static versus expandable presentation. That follow-up is not an implemented fifth condition.

The canonical bank contains 24 posts in four sets of six, plus practice. Each new part samples one correct and one wrong label from its assigned set, then shuffles their positions reproducibly. The eight-post plan therefore contains four correct labels, two false alarms (true post labeled misleading) and two misses (false post labeled accurate), with no repeated post within a participant. A wrong-label rejection records disagreement, not proof of the person's reasoning.

Williams orders `ABDC`, `BCAD`, `CDBA`, `DACB` distribute interface position and immediate transitions over complete cycles. Set rotation crosses condition with post set. The wrong-label type depends on condition index and 16-slot-cycle parity, switching in the next cycle; the joint condition-by-error-type schedule requires 32 assignment slots. Each participant has only one wrong trial per condition, so both error types cannot be compared within that individual's condition. Seeded sampling does not guarantee equal realized exposure to every post, topic or difficulty. Report actual completed counts rather than inferring balance from the target.

The target of 32 completed non-pilot new-protocol sessions is a feasible exploratory and assignment-balancing target, not an a priori power result. Resource constraints and statistical power are distinct sample-size justifications ([Lakens, 2022](https://doi.org/10.1525/collabra.33267)). Neither this target nor the six-to-eight-person pilot establishes sensitivity to a specified effect size, a novel contribution or a publishable result.

## Measures and version boundaries

| Measure | New protocol | Interpretation |
|---|---|---|
| Appropriate reliance | Correct label accepted or wrong label rejected, across all valid saved judgments | Primary behavioral endpoint; include both correct and wrong labels |
| Confidence | Required 1–7 after each decision, eight ratings | Subjective certainty, distinct from correctness |
| Full perceived trust | Twelve Jian-based items after each part, 1–7 | Condition-specific trust; adapted wording requires transparent reporting |
| Fairness | Two items after each part, 1–7 | Secondary perceived fairness |
| Tension | 1–7 after each part | Self-reported tension |
| Frustration | 0–100 in steps of 5 after each part; interaction required | Single frustration rating, not a full weighted NASA-TLX score |
| Process measures | Adjusted timing, visibility/resume flags, fact-sheet use/time; Why/row use in C | Descriptive behavior; voluntary opening is not randomized |
| Exit responses | Demographics, exposure, preference and optional comment | Context and stated preference, not proof of efficacy |

`calibrated-full-v1` uses the original `full-v1` questionnaire after each part: 12 Jian-based trust items, two fairness items, tension and frustration, for **64 ratings** across four parts. This is separate from eight required confidence ratings. Preserve the original wording in `surveyItems.json`. Reverse-score trust items 1–5 as `8 - raw`, retain items 6–12, and average the 12 scored items on the server. Average the two fairness items separately. Never combine trust, fairness, tension and frustration into one composite. The frustration slider starts at 50 and must be touched.

The twelve-item questionnaire is based on Jian; adapting its wording to AI labels does not itself establish psychometric validity in this context. Report the adaptation and assess reliability if sample size permits. A condition-specific full questionnaire supports comparisons across explanation packages; administering it only once at the end would instead measure overall trust.

Previously started `calibrated-brief-v1` sessions retain the three-item `brief-v1` questionnaire on resume. Their custom trust item is unvalidated and not interchangeable with the full scale; trust arrays remain empty and full-scale/fairness scores NULL. `legacy-full-v1` sessions retain their original full questionnaires and saved eight/24-post plans. Missing historical protocol metadata defaults to legacy. Migration must preserve scores, identity, assignment and cursor; never upgrade a participant mid-study. Identify protocol, questionnaire and planned-trial count in analysis, and keep cohorts separate. New dashboard/KPI summaries default to `calibrated-full-v1`.

## Persistence and participant control

SQLite on the server persists saved responses. Participation codes are normalized and stored as keyed hashes, not verified identities; a different code can bypass the duplicate check. A session identifier permits access to the session and should be protected. Responses and linkage are pseudonymous, not guaranteed absolutely anonymous.

Completion clears participant browser storage after a successful final save while retaining saved server responses and the in-memory debrief. The admin token and unrelated browser data are preserved. Next participant resets the in-memory session and returns to the landing page. Confirmed cancellation preserves already saved rows, abandons the session, clears participant storage after success and does not submit unfinished answers. An abandoned code cannot resume; stale-session sweeping occurs when another session is created, so indefinite resume is not promised. Pilots and formal collection use separate databases without deleting or rewriting earlier data.

## Interpretation and limitations

Accepting every label and rejecting every label both produce 50% appropriate reliance in the balanced eight-post plan. A useful pattern requires correct acceptance and wrong rejection together. Higher trust, lower frustration, faster responses or more clicks cannot independently establish better judgment. Agreement is behavioral and need not reflect genuine reliance on the label; the design has no independent pre-label judgment to establish how advice changed a belief.

There are repeated trials within participants and recurring items across participants. Treating all rows as independent people would overstate precision. Sparse per-condition observations limit error-type comparisons and model complexity. Deterministic assignment, dropout and reused abandoned slots can disrupt completed balance; error-type parity across successive cycles can also align with recruitment time or population changes. Williams ordering distributes some order effects but cannot eliminate learning, fatigue, carryover or strategies learned in C.

The 50% wrong-label proportion in short sessions differs from the one-third proportion in legacy 24-post sessions. The questionnaire change also changes burden and measurement. These cohorts must not be pooled as interchangeable observations. Fictional low-stakes content, the finite bank and a small convenience sample limit generalization to real feeds, consequential decisions or deployed AI systems. Optional verification and explanation use are self-selected; their associations with decisions or feelings are not causal click effects. No findings, validated burden estimate, verified novelty or power guarantee are asserted here.
