# Do People Trust AI More When It Explains Itself? A Comparative Study of Explanation

Prospective pilot and analysis plan for `calibrated-full-v1`, questionnaire `full-v1`. Read alongside [methods and limitations](methods-and-limitations.md). This document specifies intended procedures; it does not claim that a pilot, uncertainty calculation or statistical analysis has run. Freeze and date the analysis choices before examining formal outcome differences; record subsequent deviations and their reasons.

## Pilot purpose and isolation

Run a **six-to-eight-person usability pilot** with eligible adults across phone and desktop. Record team membership and prior knowledge of the planted errors; team walkthroughs and informed testers do not provide naive behavioral evidence. The pilot checks comprehension, response preservation, accessibility and burden, rather than estimating an explanation effect or validating a scale. Its size is a practical workflow check, not a power justification.

Use a dedicated `DB_PATH` for pilot sessions and temporary test codes, never the real study database. Pilot pids of 900 or above are excluded from formal analysis, but self-start allocation avoids that range: database separation is therefore essential even if pilot pids start at 1. Preserve the pilot file for audit and use a fresh, separate database for formal collection so legacy and pilot sessions do not occupy the formal 32-slot schedule. Do not erase old files, relabel legacy responses or restart the schedule by deleting real sessions.

Before the first pilot, record the app version, bank hash, protocol, questionnaire version, devices/browser versions and planned checks. Retain an issue log and document fixes before retesting. The following are predefined readiness criteria, not pilot results:

| Area | Check | Criterion before formal collection |
|---|---|---|
| Response preservation | Refresh/resume after a saved trial and block; retry interrupted saves; complete, cancel and start another person on the shared browser | Zero lost or overwritten saved responses, duplicate accepted submissions, cursor skips or reused event sequences in tested paths; reconcile UI, SQLite and exports |
| Version compatibility | Exercise separate fixtures for restored full eight-post, historical brief eight-post, legacy full eight-post and legacy full 24-post sessions | All retain saved plan lengths and questionnaire; brief full-scale fields stay empty/NULL and legacy responses remain unchanged |
| Comprehension | After debrief, ask participants to explain Agree/Disagree, confidence, optional fact sheet and the available interface controls in their own words | Every pilot completer can distinguish judging a label from liking a post, understands confidence, and can locate the fact sheet and C controls without coaching; revise and retest any recurring confusion |
| Questionnaire burden | Record per-part completion, skipped attempts, touched-slider behavior, requests for help and exit feedback | All 16 ratings per part can be answered without help; no unresolved reports of confusing wording or unusable controls; investigate repeated survey abandonment or fatigue before proceeding |
| Accessibility and layout | Complete the flow by keyboard and touch, including 360 px width, focus, fact-sheet panel and C rows | No task-blocking clipping, horizontal overflow, unreachable controls or shortcuts interfering with text/dialog input on tested platforms |
| Completion and cancellation | Successful exit save, early-exit confirmation/dismissal, planned-count debrief and second participant | Storage cleared only after success; admin/unrelated keys preserved; saved rows retained; unfinished answers not submitted by cancellation; completed code remains blocked |
| Debrief comprehension | Ask what generated labels and whether trusting every label is desirable | Every pilot completer understands the scripted simulation and that appropriate behavior includes accepting correct labels and questioning wrong labels; do not disclose planted errors before participation |

Measure actual end-to-end elapsed time and part/questionnaire times; separately record breaks, interruptions, resumed sessions and observed active-task time where available. Report the median and range with the number completing, plus incomplete-session reasons. Do not silently subtract long breaks to advertise a faster session or equate summed decision times with study duration. Review completion time and qualitative burden together before setting any recruitment estimate. No promised minute range or arbitrary speed cutoff is established here. Any change to content or measures needs a documented version decision and renewed compatibility checks.

## Formal cohort and stopping rule

Aim for 32 completed eligible non-pilot `calibrated-full-v1` sessions on a consistent presentation/bank version, subject to stated recruitment resources. Stop at that target or a recruitment deadline fixed before formal collection, never because an interim condition difference appears favorable. Record the deadline before recruitment and report a shortfall rather than claiming a completed cycle. Report starts, completions, cancellations, stale abandonments, exclusions and actual condition × error-type × position counts.

Thirty-two assignment slots complete the intended joint schedule if those slots complete; 32 additional people in a database containing old sessions do not necessarily do so. A slot can be reused after abandonment, so identify observations by session UUID, not pid alone. N=32 is a feasible exploratory balancing target, not a demonstrated power calculation. Resource constraints and a priori power are distinct justifications ([Lakens, 2022](https://doi.org/10.1525/collabra.33267)). Do not infer sensitivity, novelty or significance from this target.

## Primary estimand and denominators

Use server-derived label correctness and saved Agree/Disagree decisions, not client-supplied truth or confidence. Let CA be correct labels accepted, CR correct labels rejected, WA wrong labels accepted, and WR wrong labels rejected. For each named condition and overall, report:

| Outcome | Numerator / denominator |
|---|---|
| **Appropriate reliance (primary)** | `(CA + WR) / (CA + CR + WA + WR)` |
| Correct acceptance | `CA / (CA + CR)` |
| Wrong rejection | `WR / (WA + WR)` |
| Overreliance | `WA / (WA + WR)` |
| Underreliance | `CR / (CA + CR)` |

Return NULL for a zero denominator, not zero. Publish numerator and denominator beside every rate and distinguish trial counts from participant counts. Correct acceptance and wrong rejection guard against calling indiscriminate skepticism an improvement. A participant accepting all labels or rejecting all labels gets 4/8 overall appropriate judgments in the new balanced plan. `detectedError` remains disagreement on wrong labels and NULL on correct labels; it is not the primary all-trial measure.

The primary cohort comprises completed, eligible, non-pilot new-protocol sessions with their eight saved judgments. Exclude practice, pilot/team-informed runs, cancelled/abandoned and incomplete sessions from the primary estimate. Document prior-knowledge classification before outcome review. Flag malformed assignments, protocol/questionnaire mismatch or missing saved rows as integrity issues and report their counts and treatment explicitly; never fill missing decisions or change stored answers. Analyze legacy eight-post/full-questionnaire and legacy 24-post/full-questionnaire cohorts separately, without relabeling them as new protocol.

## Descriptive comparisons and uncertainty

Start with A–D counts and rates, paired participant-level condition differences in appropriate reliance, and separate correct-acceptance/wrong-rejection summaries. Report all six pairwise condition contrasts if contrasts are presented; do not selectively emphasize whichever comparison looks strongest. Identify false alarms versus misses descriptively with contributing participant/item counts. One person contributes only one wrong-label type per condition, so condition-by-error-type comparisons are not fully paired within that person.

Use descriptive estimates with uncertainty rather than a significant/non-significant ranking. A possible approach for 95% intervals is a participant-cluster bootstrap: resample completed participant sessions with replacement, keep each sampled person's trials together, and recompute rates and paired contrasts. Before running it, freeze the seed, resample count (proposed 10,000), interval method (proposed percentile), treatment of denominator-zero replicates and cohort filters in a reproducible script. Report undefined replicates rather than silently treating them as zero. **This bootstrap is proposed, not implemented or verified by this document.** If it is not run, say that uncertainty remains uncomputed rather than supplying invented bounds.

Participant clustering preserves within-person dependence but does not address the shared-item sampling dependence. Treat such intervals as conditional on this finite post bank, report item exposures and per-item outcome counts, and avoid generalizing precision to unseen posts. A later crossed participant/item model or resampling scheme would need an explicit specification and feasibility check; neither is claimed implemented. Sparse cells and only eight trials per person may make complex models unstable. Do not present naive trial-level binomial intervals as if all rows were independent participants. No confirmatory p-value threshold, powered hypothesis test or multiplicity-adjusted discovery is claimed in this exploratory plan.

## Secondary measures and predefined sensitivity checks

Summarize the full twelve-item trust score, two-item fairness score, tension 1–7 and frustration 0–100 by condition, with response counts and distributions. Reverse-score trust items 1–5 as `8-raw` and average all twelve scored items. Retain raw answers. Do not combine these constructs into one composite. Four blocks require **64 ratings**; eight confidence ratings remain additional. Pilot fatigue, repeated items and response quality before formal collection. The scale wording is adapted to AI labels; retain/report that adaptation rather than claiming this implementation has already been validated.

Historical brief trust remains a custom single item, with empty trust arrays and NULL full-scale/fairness fields. Keep it separate from full scores; no imputation. Analyze legacy full sessions separately from the restored full cohort, including when both contain eight posts. Keep protocol, questionnaire, planned-trial count and bank/build version in tables. Single-item frustration is not a full weighted NASA-TLX score. Preference, fact-sheet opening/time, C Why/row use, confidence and adjusted decision times are descriptive supporting measures; self-selected clicks do not establish causal mechanisms.

Define these sensitivity summaries before formal outcome review:

1. Primary behavioral rates include otherwise valid completed-cohort judgments with timing/resume flags. Repeat after excluding flagged or resumed trials, show removed counts and changed denominators, and report how this loses the complete eight-trial structure. Do not apply a post hoc fast-response cutoff.
2. Show saved judgments from incomplete/cancelled sessions separately by condition and correctness as an attrition sensitivity, with their observed denominators; never impute unfinished responses or silently add them to the primary cohort.
3. Describe outcomes by assignment position/order and first versus second 16-slot cycle, plus actual item/topic/difficulty exposure. Mark sparse or empty cells. These checks describe possible carryover, recruitment drift and imbalance rather than removing those limitations.
4. Keep legacy eight-post and legacy 24-post results in separate tables, if reported at all. Any comparison across protocols is descriptive and confounded by measurement, burden, recruitment and, for 24 posts, wrong-label prevalence.

Log all exclusions and deviations without raw participation codes or hashes. Preserve original exports and source databases; protect demographics/free text and restrict session identifiers. The final report should state exactly which analyses and uncertainty methods actually ran, tested devices, missing data, realized balance and limitations. Until collection and analysis occur, there are no findings to report.
