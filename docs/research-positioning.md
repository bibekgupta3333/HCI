# Research positioning

**Full questionnaire restored (2026-10-19):** new sessions use `calibrated-full-v1` with `questionnaireVersion=full-v1`. After EACH of four parts, collect the original 12 Jian-based trust items, two fairness items, tension and frustration: 16 ratings per part, 64 total. Keep eight posts (two per part), appropriate reliance as primary, the unchanged paper title and the interface-package limitation. Trust is now measured separately for each explanation condition. Preserve previously started `calibrated-brief-v1` sessions and their brief surveys on resume; do not mix or relabel their data. Dashboard/KPI exports default to the restored full cohort. Earlier brief-default descriptions below document the superseded revision and apply only to saved brief sessions. Schema 4 preserves all earlier responses. Pilot the restored questionnaire burden; no completion-time or power guarantee is established.

**Study title: Do People Trust AI More When It Explains Itself? A Comparative Study of Explanation**

HCI experiment conducted as part of graduate study at Florida Polytechnic University.

The title is retained exactly. The operational question is whether explanation interface packages support **appropriate/calibrated reliance** on scripted accuracy labels for fictional social media posts. Increasing subjective trust is not itself a success criterion. This is an exploratory course study; no outcome, verified novelty claim or power guarantee is established.

## 1. Scope and decision history

`proposal.txt` and `literature.txt` preserve the submitted loan-approval proposal and review. The intermediate agent-permission design remains in [the archive](archive/v2.1-agent-permission/research-positioning.md). The current domain is fictional Riverton/Alder County posts with scripted labels and optional fact sheets. The app uses Wizard-of-Oz simulation: no AI model, live feed or external fact-check service runs. Methods and debrief must disclose that simulation; public landing and recruitment copy must not reveal planted errors.

New sessions use `protocolVersion=calibrated-brief-v1`: four parts, two distinct posts per part, eight analysed trials drawn from the retained 24-post bank, plus one unanalysed practice post. Each part has one correct and one wrong label; each person sees two false alarms and two misses. Existing eight-post and 24-post sessions keep their saved plans and full questionnaires under `legacy-full-v1`. Missing legacy protocol metadata defaults to that version. Protocol and trial-count variants are separate cohort dimensions.

## 2. Research questions and outcomes

| Role | Question | Operational measure |
|---|---|---|
| Primary | How does appropriate reliance differ across A–D interface packages? | `(correct & agree + wrong & disagree) / all trials` |
| Component | Do packages change acceptance of correct labels or rejection of wrong ones? | Correct acceptance / correct trials; wrong rejection / wrong trials |
| Error patterns | How do overreliance, underreliance and false-alarm/miss rejection differ? | Wrong acceptance / wrong trials; correct rejection / correct trials; error-type counts and rejection rates |
| Secondary | How do subjective trust and affect differ, and how do they relate to behavior? | Custom `briefTrust` 1–7, tension 1–7, frustration 0–100 after each part |
| Supporting | How are verification use, explanation use, confidence, timing and preference associated with reliance? | Trial/event records and exit responses; inspection is self-selected |

Every rate with a zero denominator is null. Correct and wrong refer to the **label**, not the underlying post alone. Rejecting every label detects every planted error but also rejects every correct label; appropriate reliance retains both components. The measure describes behavior, not proof of understanding or a validated latent calibration construct.

Directional expectations about C helping rejection or persuasive reasons increasing wrong-label acceptance remain predictions. A block-level trust or affect association cannot establish that an explanation caused belief, reassurance or distress. The [shared decisions](_shared-decisions.md) and [pilot and analysis plan](pilot-and-analysis-plan.md) govern the final question/hypothesis hierarchy and analysis choices.

## 3. Measurement tradeoff

The new `brief-v1` questionnaire has three required ratings per part: one custom subjective trust item, tension and frustration. Four parts require **12 block ratings**, replacing the legacy protocol's **64**. This count excludes trial decisions, confidence, practice and exit answers. Frustration remains 0–100 in steps of 5 and requires an explicit touch/interaction before saving.

The custom trust item is **not validated and is not a Jian short form**. Brief records store `trustResponses=[]`; `trustMean`, `fairness1`, `fairness2` and `fairnessMean` are NULL. Fairness is not collected in new sessions. Never reconstruct full trust or fairness scores from the brief response. Legacy full sessions retain 12 Jian items, two fairness items, tension and frustration with their original scoring. Report legacy full trust and custom brief trust separately, even when both cohorts have eight trials.

The reduction is a burden decision, not psychometric validation. Each rating summarizes just two posts, and the protocol change limits comparability to earlier sessions. Duration and comprehension need pilot evidence.

## 4. What the interface comparison can establish

| Package | Supplied explanation | Interpretation |
|---|---|---|
| A | Label only; common optional fact sheet | Baseline with verification access |
| B | One static scripted reason | Static rationale package |
| C | Why? with Source, Claim vs record and Wording rows | Interactive package with additional access to true factual comparison |
| D | One scripted counterfactual sentence | Counterfactual framing package |

These are categorical **interface packages**, not ordered explanation depths. C's Claim vs record row shows the true comparison even when it contradicts the label; Why? and the independent row controls remain unchanged. B, C's rationale text and D may support a deliberately wrong label. The common fact sheet stays available in every condition.

C therefore differs in evidence access as well as interaction, format and amount of information. Any difference involving C applies to that combined package and cannot be attributed solely to interactivity. A static presentation with equivalent factual content is a **proposed follow-up**, not an implemented control or fifth arm.

## 5. What the short design can support

There is only **one wrong trial per person per condition**, so within-person error detection for that condition is binary. Both error types cannot be compared within that person's condition. The condition-index plus 16-slot-cycle parity schedule flips error type in the next cycle; a complete 32-slot schedule balances condition × error type. N=32 is a balance and feasibility target, not a power analysis. Report completed cell counts and incomplete balance explicitly.

Each person contributes repeated trials and posts recur across people. Eight trials are not eight independent participants. Error type is also tied to assignment cycle within a condition; recruitment differences between cycles can resemble error-type effects. Bank-level difficulty balance does not prove equivalence of individual items or balance in an incomplete sample.

Learning, fatigue, carryover from C, neutral guidance, item selection, fictional stakes and convenience recruitment limit interpretation. Williams orders distribute positions and immediate transitions over complete cycles; they do not eliminate these threats. Old eight-post/full, new eight-post/brief and legacy 24-post/full cohorts must remain distinguishable and analysed separately.

## 6. Candidate contribution and evidence still needed

A possible contribution is a reproducible exploratory comparison of reliance and affect across four precisely documented interface packages, using checkable correct labels and both error types. The post bank, canonical explanations, versioned questionnaire, scripted-label method and server-side scoring support methodological transparency. They do not establish novelty, superiority or readiness for a full paper.

Earlier named-paper summaries in this working document were not a verified literature review. Before making a gap claim, verify primary sources and record search dates, queries and coverage of label correctness, false alarms/misses, explanation content, evidence access, behavioral reliance and affect. Treat candidate references in historical material as leads until checked. No claim that prior work has omitted this combination is justified here.

The planned **6–8-person pilot uses a separate database** and reviews burden, comprehension, accessibility, saves/resume and export integrity. Team members with stimulus knowledge are technical testers; their performance cannot establish difficulty. Pilot significance and a favorable detection band are not selection criteria. See the [pilot and analysis plan](pilot-and-analysis-plan.md) for procedures rather than deriving thresholds from a tiny sample.

Institutional approval status is unknown. Attribution to Florida Polytechnic University does not establish authorization or endorsement. Voluntary participation, adult eligibility, truthful data handling and corrective debrief remain required; no invented contacts or approval identifiers should appear.

## Related documents

- [Methods and limitations](methods-and-limitations.md): report methods and interpretation limits.
- [Pilot and analysis plan](pilot-and-analysis-plan.md): pilot, cohort rules and analysis decisions.
- [Study protocol](study-protocol.md): self-guided participation and data handling.
- [Study parts and defense](parts-and-study-defense.md): design rationale and defense questions.
- [System design](system-design.md) and [wireframes](wireframes.md): behavior and screen specifications.
- [Stimuli](stimuli.md): canonical post, explanation and fact-sheet wording.
- [Shared decisions](_shared-decisions.md) and [current app contract](../app/CONTRACT.md): study decisions and API/persistence requirements.
