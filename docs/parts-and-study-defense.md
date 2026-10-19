# Study parts and design defense

HCI experiment conducted as part of graduate study at Florida Polytechnic University.

This document explains the design, what each part contributes, and which conclusions the measurements can support. It is an internal design rationale and oral-defense guide, not participant recruitment copy: it describes the deliberately wrong labels that participants learn about in the debrief. The design compares four interfaces for judging scripted accuracy labels on fictional social media posts. No model or external fact-checking service runs.

## 1. Chosen scope: four short parts, eight judged posts

New sessions use **four parts with two posts each**, followed by a survey after each part. Each part contains one correct label and one wrong label. Across the eight posts, each participant encounters four correct labels, two false alarms and two misses. The separate practice post is outside these eight trials.

The full 24-post bank remains available for assignment. Eight posts per participant does not mean deleting 16 stimuli or always taking the first two posts from each six-post set. Selection must preserve the one-correct/one-wrong rule and the assigned error type. Existing saved assignments should retain their original plans; resumed sessions must not be silently shortened or treated as equivalent to new sessions.

| Feature | Earlier full-session design | Chosen design for new sessions |
|---|---|---|
| Judged posts | 24: six per part | Eight: two per part |
| Correct/wrong per part | Four correct, one false alarm, one miss | One correct, one assigned wrong label |
| Wrong labels per participant | Eight: four of each error type | Four: two of each error type |
| Wrong-label proportion | One third | One half |
| Error types within one condition for one person | Both | One only |
| Block surveys | Four | Four |
| Interpretation | More observations per person and condition | Short exploratory comparison with sparse observations |

Shortening the trials reduces repeated judgments, but does not establish a measured completion time or prove that participants feel calmer. Pilot observations are needed to assess pace, comprehension and burden.

## 2. A part is a position; a condition is an interface

Each participant sees A, B, C and D once, in different parts. The condition orders are `ABDC`, `BCAD`, `CDBA` and `DACB`. For example, someone assigned `CDBA` sees interactive explanations in Part 1 and label-only presentation in Part 4. **Part 1 does not mean condition A.** Both posts within a part use the same condition.

Changing interfaces across parts gives participants a different way to inspect labels while preserving the same core task: read the post, optionally inspect supporting material, agree or disagree with the label, and report confidence. A short orientation at the beginning of each part is a new presentation feature intended to make the current interface understandable. It should identify the available controls without telling participants which decision to make or revealing planted errors.

Orientation help is distinct from the experimental explanation. A fair implementation gives every condition an equally visible introduction, keeps it brief, and avoids coaching only C to verify the record. If orientation changes during data collection, record the presentation version; any resulting improvement cannot automatically be attributed to the original explanation interface alone.

## 3. Why include each condition?

| Condition | What changes and what the participant can do | Why it matters |
|---|---|---|
| **A: no explanation** | See the label without an accompanying reason. The common fact sheet remains available. | Establishes the reference for judging a label with optional verification but no supplied rationale. A is not a no-information or no-interaction condition. |
| **B: static reason** | Read one short, fixed reason beneath the label; no explanation controls are needed. | Tests a familiar, low-effort rationale. It allows the study to ask whether a plausible reason encourages acceptance even when the label is wrong. |
| **C: interactive explanation** | Open **Why?** to see Source, Claim vs record and Wording rows, then expand each row independently. | Offers selective inspection and exposes factual comparison inside the explanation. It can reveal whether people use that opportunity, alongside their eventual judgment and confidence. |
| **D: counterfactual explanation** | Read a sentence explaining what change would produce the opposite label. | Tests an alternative way of expressing a label's apparent decision boundary. It invites consideration of a changed scenario rather than simply giving a reason for the present label. |

A and B can feel simpler than C because their explanation area needs fewer actions. D changes the reasoning prompt but does not currently provide an editable scenario or simulator. New orientation help should not advertise controls that do not exist. Introducing condition-specific games, sliders or extra mandatory decisions would create additional manipulations and require a revised rationale.

The four conditions are **categorical interface alternatives**, not four ordered levels of explanation depth. D is not inherently deeper than C, and a counterfactual sentence is not necessarily more informative than a static reason. The study should compare named conditions rather than fit a single “more depth is better” story.

### C's factual-information advantage

C changes more than interaction depth. Its Claim vs record row shows the true comparison, including cases where that comparison contradicts the scripted label. B and D may instead offer persuasive but non-decisive reasons supporting the wrong label. All conditions have the same optional fact sheet for a given post, but C makes the decisive comparison available through an additional route.

If C improves error detection, the defensible conclusion concerns **this interactive interface with factual comparison**. The result would not isolate clicking, user control, explanation length or factual access as the cause. Isolating interactivity would require another comparison with equivalent factual content presented statically. That is a possible follow-up design, not an existing fifth condition.

## 4. Variables and what the measurements mean

The main manipulated independent variable is **explanation condition: A, B, C or D**. Everyone experiences all four conditions. Label correctness and wrong-label type are scripted stimulus factors. A false alarm is a true post labeled misleading; a miss is a false post labeled accurate. Clear/subtle difficulty, topic and post identity describe stimuli; they are not additional participant tasks or randomized treatment arms.

| Outcome | Measurement | Interpretive boundary |
|---|---|---|
| Error detection | Disagreement with a wrong label | A behavioral indicator, not proof of correct reasoning. `detectedError` is null on correct-label trials. |
| Agreement | Agree/disagree on every trial | More agreement is not necessarily better: distinguish correct and wrong labels. Disagreement with a correct label helps identify indiscriminate skepticism. |
| Confidence | Required 1–7 response after each decision | Confidence is subjective certainty, not accuracy. |
| Decision time | Time after the label appears, adjusted for hidden time | Longer time could reflect inspection, confusion or difficulty; faster is not automatically better. |
| Verification and explanation use | Fact-sheet opening/time; C's Why and row interactions | Use is self-selected. People who inspect more may differ before opening anything. |
| Trust | Twelve Jian-based items after each part; first five reverse scored | A block-level judgment about the labels, not a separate trust measurement for each post. |
| Fairness | Two 1–7 items after each part | Perceived fairness and consistency, not a demonstration of objective fairness. |
| Tension and frustration | Tension 1–7 and frustration 0–100 after each part | Self-reported affect; the frustration item is not a full weighted NASA-TLX score. |
| Preference | Exit choice and optional comment | Preference may differ from error detection and is influenced by order and recent experience. |

Each part still requires **16 survey ratings**: twelve trust, two fairness, one tension and one frustration. Four surveys therefore require **64 ratings**, in addition to eight confidence ratings, practice, decisions and exit answers. The trial reduction leaves substantial questionnaire burden. Survey responses now summarize only two posts, so one memorable error may strongly influence the entire part rating.

## 5. Matched posts and assignment

The bank has four sets, S1–S4, each containing two correct accurate labels, two correct misleading labels, one false alarm and one miss. Each set's wrong labels include one clear and one subtle case. Across the bank, each error type has two clear and two subtle examples. These are structural matching rules; they do not establish equal reading difficulty, salience or emotional impact.

Participants receive different posts in different conditions to avoid asking the same person to judge an already-seen claim repeatedly. Across participants, condition-to-set rotation lets sets appear under different interfaces. The fact sheet and underlying truth for a given post stay constant across conditions; only the assigned explanation changes. Matching means balancing stimulus structure and rotating exposure, not repeating identical text in every part for each person.

The chosen short-session assignment preserves the condition order and set rotation and adds an error-type schedule:

- Let `c` be the condition index A=0, B=1, C=2, D=3.
- Let `cycle = floor((pid - 1) / 16)`.
- The parity of `c + cycle` selects the wrong-label type. One parity represents false alarm and the other miss; the mapping must remain fixed in implementation.
- Each participant therefore gets two false alarms and two misses. In the next group of 16 assignment slots, each condition receives the opposite error type.

Over a complete 32-slot cycle, each condition has equal planned exposure to both error types, and the order/set combinations repeat with the opposite type. A 16-slot cycle alone no longer balances error type within every condition. Dropout, incomplete recruitment and reused abandoned slots can make completed data less balanced than the planned assignments. Report actual completed cell counts.

This deterministic schedule also ties the error type within a given condition to the 16-slot assignment group. If groups are recruited at different times or from different populations, cohort differences can resemble a condition-by-error-type effect. Equal final counts do not eliminate that limitation. Keep recruitment and presentation versions consistent and describe the schedule openly; the design does not independently randomize error type within each condition and cohort.

One correct post must also be selected from each assigned set, and the two selected posts need a reproducible order. The error-type schedule alone does not guarantee balanced correct-label classes, topics, individual correct posts or first/second positions. Check those distributions in assignment previews and exports rather than claiming that the parity rule solves every matching problem. Difficulty also needs checking: global bank balance does not guarantee balanced difficulty in an incomplete sample.

### Starting a separate short-study cohort

If legacy sessions already occupy participant-number slots, 32 additional short sessions do not necessarily cover the intended 32-slot error-type schedule. Start formal short-study collection with a separate SQLite file (for example `DB_PATH=data/short-study.db`), retaining the old file unchanged. This separates cohorts and starts the assignment schedule at pid 1. Do not erase or relabel earlier responses. Test/pilot sessions should also use their own database.

## 6. Comparisons the short design supports

The central comparison is error detection across the four explanation conditions, alongside trust, fairness, confidence, affect and inspection behavior. A–B compares label-only presentation with a static reason; A–D compares label-only presentation with a counterfactual reason. B–D compares two short but differently framed explanations. Comparisons involving C evaluate its combined interaction and information package.

Across participants, compare false-alarm and miss detection within conditions once both assignment cycles are represented. **An individual has only one wrong-label trial in a condition.** There is no per-person false-alarm-versus-miss comparison within that condition. The person's condition-level detection value is consequently just 0 or 1. A condition-by-error-type comparison depends on different participants and items contributing those cells.

Each person contributes repeated observations, and posts recur across people. Eight trials from one person are not eight independent participants. Analysis should respect participant and item dependence and the mixed structure of error-type exposure. With sparse cells, prioritize counts, uncertainty and descriptive patterns; complicated models may not be estimable or reliable. The planned target of 32 is an assignment-balancing target, not a demonstrated power guarantee.

Associations between opening the fact sheet and detection cannot establish that the click caused detection. Likewise, a block-level association between noticing an error and tension cannot establish that error recognition caused distress. With only one wrong label per block, the number detected is 0 or 1, leaving a particularly limited basis for that association. Lower tension alongside higher acceptance of wrong labels would be an observed pattern, not proof that reassurance caused mistaken belief.

## 7. Limitations and reasons for the tradeoff

The eight-post design favors a manageable exploratory session over repeated measurement within each condition. It reduces opportunities for fatigue from repeated judgments, but fewer observations make condition estimates sensitive to individual items and accidental decisions. Shorter exposure may also leave participants less familiar with an interface when they rate it.

The wrong-label proportion changes from one third to one half. Participants may become more skeptical if they infer frequent errors, so the reduced design changes the judgment environment as well as its length. Do not pool old 24-trial and new eight-trial sessions as though only completion time changed. Identify assignment/presentation versions and report or analyze them separately unless a justified analysis explicitly handles the difference.

Within-person comparisons reduce some stable differences between participants, but introduce learning, fatigue, comparison and carryover. Williams orders distribute condition positions and immediate transitions across complete cycles; they do not erase these effects. A participant who learns to inspect records in C may use that strategy in a later condition. Orientation can aid understanding while also influencing attention and expectations.

The fictional setting controls available facts and avoids relying on knowledge of real disputes, but differs from real social media with personal stakes, familiar accounts and uncertain evidence. Scripted labels permit controlled errors but cannot establish how a deployed AI model would behave. A course sample and small stimulus bank limit generalization. The current rationale offers neither a verified novelty claim nor a promised significant result.

## 8. Defense questions and answers

**Why four parts instead of one mixed stream?** Each part provides a consistent interface experience and a survey referring to that interface. The cost is switching and carryover between parts, which order balancing addresses only partly.

**Why include label-only presentation if everyone can open a fact sheet?** It distinguishes a supplied explanation from independent verification. Removing fact sheets only from A would confound explanation availability with access to truth.

**Why use explanations that can support a wrong label?** The question is whether explanations help people catch mistakes or make mistakes believable. Making every explanation reveal the correct answer would remove that tension. All labels are scripted; the debrief explains this and supplies corrections.

**Is C simply better because it contains the answer?** It provides a more direct factual comparison. That is a substantive feature and a confound for a pure interactivity claim. We evaluate the whole interface and explicitly limit causal interpretation to that package.

**Is D the deepest explanation?** No. It presents a hypothetical change rather than a longer factual justification. Conditions are alternative formats, not a validated depth scale.

**Why only two posts per part?** The chosen scope reduces repeated judgments and makes each interface encounter brief. It sacrifices repeated error observations and the ability to compare both error types within one person's experience of one condition. The resulting study is exploratory.

**Does eight posts mean the study is now low burden?** That remains to be tested. The four surveys still require 64 ratings, and each participant also makes decisions, gives confidence ratings and completes the exit questions.

**Can we still compare false alarms with misses?** Yes, across participants and the planned 32-slot balance, while accounting for condition, participant and item structure. We cannot claim a paired comparison of both error types within each person's condition.

**Why not always use the first two shuffled posts?** That can omit wrong labels or change the error-type mix. The short plan deliberately selects one correct and one assigned wrong label before ordering the pair.

**Does disagreement prove someone understood the error?** No. It is the recorded detection proxy. Confidence, verification behavior and responses to correct labels help interpretation, but do not reveal reasoning directly.

**Does 32 participants make the findings conclusive?** No. It completes the proposed joint assignment cycle if the relevant slots complete. Statistical precision depends on effect sizes, variability, missingness and the final analysis; no power calculation is established here.

**What can we claim before collecting data?** We have a controlled design for comparing four scripted explanation interfaces and a documented reduction in trial count. Whether any interface improves detection, changes trust or affects feelings remains an empirical question. The orientation is a presentation feature, not evidence of research novelty.

## Related documents and implementation checks

- [AGENTS.md](../AGENTS.md): project constraints and interpretation boundaries.
- [Current app contract](../app/CONTRACT.md): API, persistence and implemented interaction details.
- [Shared design decisions](_shared-decisions.md): condition definitions and v3 hypotheses; older count and infrastructure passages require reconciliation with the chosen short-session design.
- [Stimuli](stimuli.md): canonical post, explanation and fact-sheet wording for the retained bank.
- [Data model](data-model.md): field meanings, scoring and export interpretation.
- [Study protocol](study-protocol.md): participation procedure and debrief.
- [Counterbalancing implementation](../app/shared/counterbalance.ts): verify selection, cycle parity, order and stored assignment compatibility.
- [Presentation builder](../app/shared/labelEngine.ts): verify condition-specific fields and the participant truth boundary.

The eight-post scope above records the chosen design. Backend enforcement, orientation rendering, migrated-session handling and export correctness require implementation verification; this document alone does not certify those behaviors.
