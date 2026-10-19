# Stimuli: Participant-Facing Text (v3)

**Current decision — images rejected (2026-10-19):** `CURRENT_PROTOCOL` returns to `calibrated-full-v1`: new sessions are text-only and display each post’s original likes/reposts. Keep eight posts and `full-v1` (16 ratings per part, 64 total). `calibrated-media-full-v1` remains supported only for historical saved sessions, with their saved media/count profile and questionnaire; do not migrate or relabel them. Remove image captions from the UI, including historical media sessions; retain descriptive alt text for historical images. Do not generate new images or use generic topic photographs by default. Default practice is text-only with original counts; `GET /api/practice?contextMedia=1` is historical compatibility only. Schema 5 and historical assets/prompts remain preserved. Dashboard/KPI defaults return to the text-only full cohort; keep presentation cohorts separate.

**Verification boundary:** this documentation update adds no browser captures, visual testing, code-test or build results. Earlier media evidence below is historical and does not verify the current text-only/caption-free UI.

This document holds the final wording of everything a participant reads during the trials of the v3 study (AI accuracy labels on made-up social media posts): the authoring rules, the instructions screen, the practice post, and, for each of the 24 posts, the post itself, its fact sheet, the condition B sentence, the condition C rows, the condition D sentence and the debrief fact. `app/shared/data/posts.json` is filled from it. `_shared-decisions.md` is binding on the post bank table and the condition rules, and `data-model.md` is the authority on field names. This file is the authority on wording: if another doc quotes a string differently, this file wins. The v2.1 version (agent permission prompts) is archived at `archive/v2.1-agent-permission/stimuli.md`.

## 1. Authoring rules

| Element | Rule |
|---|---|
| Label line (`aiLabel`) | Exactly "✓ Likely accurate" or "⚠ Likely misleading". It appears after the fixed ~800 ms "AI is checking…" delay. No confidence score is ever shown. |
| B sentence (`staticExplanation`) | One sentence, **8–14 words**. Opens with "Checked:" on a "Likely accurate" label and "Flagged:" on a "Likely misleading" label. It argues for the AI's label with the **same confident tone whether the label is right or wrong**, with no hedges ("may", "might", "possibly"). |
| B on a wrong label | Cites a **plausible but non-decisive factor** (who posted it, how it is worded, a detail that does match) and never the key fact that decides the post. |
| C rows (`factors[]`) | Exactly 3 rows in this order: **Source**, **Claim vs record**, **Wording**. `displayValue` is always the **true** value. ✓ means the factor points toward accurate, ✗ toward misleading: Source ✓ = verified account; Claim vs record ✓ = the post's claim matches the fact sheet's key fact (so ✓ **iff** truth is TRUE, even on wrong labels); Wording ✓ = neutral wording. |
| C `detail` | One sentence per row that **argues for the AI's label**, right or wrong. Only `displayValue` and ✓/✗ are guaranteed truthful; the detail is not. |
| D sentence (`counterfactualExplanation`) | One sentence, **10–16 words**, in the form "This would be labeled [the other label] if …". It supports the AI's label. On a wrong label, the "if" clause names a plausible but non-decisive factor, not the key fact. |
| Fact sheet | A title, a 1–3 sentence body that contains the key fact, and a source ending in "(fictional)". Identical in every condition; never mentions the label. |
| Post | Author display name, @handle, verified yes/no, posted-ago, 1–2 sentences of text (at most 240 characters), likes and reposts. The claim and key fact match the `_shared-decisions.md` table exactly. |
| Content | Everything is fictional: people, accounts, agencies, Riverton and Alder County. No real brands, and no health claim that could cause harm if believed. Every wrong label has a one-line debrief fact. |
| Spelling | American throughout: "labeled", "neighborhood", "canceled". |

Word counts treat any whitespace-separated token as one word ("Checked:", "all-caps", "$18,000" and "8–noon" each count once).

### Cue balance (verified badge and wording vs truth)

The verified badge and sensational wording are deliberately **not** reliable cues to truth, so the only reliable check is the fact sheet (or C's Claim vs record row).

| | Verified | Not verified | Neutral wording | Sensational wording |
|---|---|---|---|---|
| TRUE posts (12) | 6 (p01, p07, p13, p15, p19, p21) | 6 (p03, p05, p09, p11, p17, p23) | 6 (p01, p03, p11, p13, p15, p23) | 6 (p05, p07, p09, p17, p19, p21) |
| FALSE posts (12) | 6 (p04, p06, p10, p12, p16, p18) | 6 (p02, p08, p14, p20, p22, p24) | 8 (p02, p04, p06, p10, p16, p18, p20, p22) | 4 (p08, p12, p14, p24) |

Sensational posts are true more often than not (6 of 10), so "sounds sensational" does not predict "false". Among wrong labels, the misses are mostly verified and all neutral (p04, p10, p16 verified; p22 not), and the false alarms mix both cues (p03 not verified/neutral, p09 not verified/sensational, p15 verified/neutral, p21 verified/sensational).

### 1.1 Current original counts

New `calibrated-full-v1` sessions display the original per-post counts in §4, without images.

### Historical media context (saved sessions only)

For historical saved `calibrated-media-full-v1` sessions (media revision of app `0.4.0`, questionnaire `full-v1`), all 24 bank posts have one neutral generated illustration, drawn from three shared topic assets: `env` → `/post-images/environment.png`, `svc` → `/post-images/public-services.png`, `evt` → `/post-images/local-events.png`. The earlier design used the caption “Illustrative scene”; visible captions are now removed, including for historical sessions. Retain neutral descriptive alt text; the same post’s image is identical across A–D. The images do not establish claim truth or replace fact sheets/C’s true comparison. Final metadata and asset hashes are recorded in [media and engagement design](media-and-engagement-design.md); all three PNGs have confirmed 1536 × 1024 dimensions and manifest-matched SHA-256 hashes; these metadata checks do not verify rendering.

**All per-post likes/reposts listed in §4 are the original counts**, retained unchanged in the bank and displayed by current text-only `calibrated-full-v1` and other text-only protocols. Only historical saved media sessions display the separate `context` count profile below, identical for every one of the six posts within each set, regardless of truth, AI label, error type or condition:

| Set | Posts | Context likes | Context reposts |
|---|---|---:|---:|
| S1 | p01–p06 | 128 | 16 |
| S2 | p07–p12 | 172 | 24 |
| S3 | p13–p18 | 96 | 12 |
| S4 | p19–p24 | 148 | 20 |

These are fixed scripted context counts, not measured engagement. No comments, social endorsements or real posting controls are added. Practice keeps its original 74 likes/9 reposts and receives no context image. Saved `calibrated-full-v1`, `calibrated-brief-v1` and `legacy-full-v1` sessions retain original text/count presentations and their questionnaires. Eight analysed posts and the full 16-rating-per-part/64-rating questionnaire remain unchanged for new text-only sessions. Historical media practice can still be requested explicitly for compatibility; it is not the default. See the [per-post image suitability audit](media-and-engagement-design.md#per-post-image-suitability-audit): no bank post requires a photograph. Claims, truth, canonical explanations, scales and scoring are unchanged; media presence is constant, but image/topic and set-count effects remain limitations rather than demonstrated realism benefits.

## 2. Instructions screen

The quoted 24-post/six-per-part instructions below are historical legacy copy. Current eight-post protocols describe eight posts in four parts of two, plus practice; preserve the task/label definitions without revealing planted errors. Media context follows §1.1 and does not change post, fact-sheet or explanation wording.

**Heading:** How this study works

**Body:**

> You will read 24 short social media posts from Riverton, a small town in Alder County. The town, the people and the accounts are all made up for this study.
>
> An AI tool has read each post and given it an **AI label**:
> - **✓ Likely accurate**: the AI judges that the post's claim is correct.
> - **⚠ Likely misleading**: the AI judges that the post's claim is not correct.
>
> In some parts of the study, the label comes with an explanation from the AI.
>
> Every post also has a **fact sheet**: the official town or county record on the topic. Open it at any time with the **Fact sheet ▸** button. It is the same in every part of the study.
>
> For each post, decide whether you agree with the AI label:
> - Click **Agree with label** if you think the label is right for this post.
> - Click **Disagree with label** if you think the label is wrong for this post.
>
> After each post you'll rate how confident you are. The study has 4 parts of 6 posts each, with a short questionnaire after each part. There is one practice post first; it is not scored.

**Button:** Start practice

## 3. Practice post (not counted)

Shown once before part 1, in the condition of part 1 (so the B, C or D text below is used only if part 1 is that condition). It is a correct "Likely accurate" label on a TRUE post and is not logged as a trial or included in `posts.json`'s 24-post bank.

- **id:** `practice-01` · **set:** none · **topic:** svc · **truth:** TRUE · **AI label:** ✓ Likely accurate · **errorType:** null · **difficulty:** —
- **Post:** Riverton Parks · @RivertonParks · verified: yes · 2h · 74 likes · 9 reposts
  > The Birch Road dog park reopens Saturday, April 4, with new fencing and a separate small-dog area.
- **Fact sheet:** **Birch Road Dog Park Reopening.** The Birch Road dog park reopens Saturday, April 4, after fencing repairs. A separate small-dog area has been added. *Source: Riverton Parks & Recreation (fictional)*
- **B:** "Checked: the reopening date matches the parks department notice." (9 words)
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @RivertonParks · verified | ✓ | The post comes from the parks department's verified account. |
| Claim vs record | Post: reopens April 4 · Record: reopens April 4 | ✓ | The April 4 date matches the parks notice. |
| Wording | Neutral | ✓ | The post states the details plainly. |

- **D:** "This would be labeled misleading if the parks notice gave a different reopening date." (14 words)

## 4. The 24 posts

The post card and the fact sheet are shown in every condition (A, B, C, D). A shows only the label; B adds the B sentence; C adds the "Why?" button and the three rows; D adds the D sentence. The quoted post text is the `text` field verbatim.

### p01

- **set:** S1 · **topic:** env · **truth:** TRUE · **AI label:** ✓ Likely accurate · **errorType:** null · **difficulty:** —
- **Post:** Riverton Recycles · @RivertonRecycles · verified: yes · 3h · 212 likes · 38 reposts
  > Our 2025 numbers are in: Riverton's recycling rate rose to 41%, up from 36% the year before. Thanks for sorting, everyone.
- **Fact sheet:** **2025 Waste Diversion Summary.** Riverton's residential recycling rate for 2025 was 41%, up from 36% in 2024. *Source: Riverton Public Works (fictional)*
- **B:** "Checked: this matches the city's published 2025 recycling figures."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @RivertonRecycles · verified | ✓ | The post comes from the city's verified recycling account. |
| Claim vs record | Post: 41% in 2025 · Record: 41% in 2025 | ✓ | The 41% figure matches the 2025 waste summary exactly. |
| Wording | Neutral | ✓ | The post states the figure plainly, without hype. |

- **D:** "This would be labeled misleading if the rate differed from the city's 2025 summary."

### p02

- **set:** S1 · **topic:** svc · **truth:** FALSE · **AI label:** ⚠ Likely misleading · **errorType:** null · **difficulty:** —
- **Post:** Dana Whitfield · @dana_reads · verified: no · 5h · 87 likes · 41 reposts
  > Heads up: starting in May, the Riverton library will be closed every Monday. Plan your returns for other days.
- **Fact sheet:** **Riverton Public Library Hours from May 1.** Starting May 1, the library is closed on Sundays only. It stays open Monday through Saturday, 9 am to 7 pm. *Source: Riverton Public Library (fictional)*
- **B:** "Flagged: the library's posted schedule shows it open on Mondays."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @dana_reads · not verified | ✗ | This is a personal account, not the library's own page. |
| Claim vs record | Post: closed every Monday · Record: closed Sundays only; open Mondays | ✗ | The library schedule lists Sunday as the only closed day. |
| Wording | Neutral | ✓ | A calm tone doesn't change what the schedule says. |

- **D:** "This would be labeled accurate if the library's schedule listed Monday closures."

### p03

- **set:** S1 · **topic:** evt · **truth:** TRUE · **AI label:** ⚠ Likely misleading · **errorType:** false_alarm · **difficulty:** clear
- **Post:** Marcy Teller · @marcy_in_riverton · verified: no · 1d · 143 likes · 29 reposts
  > Riverside Fair is June 6–8 at Mill Park this year! Rides, food trucks and the pie contest. See you there.
- **Fact sheet:** **Riverside Fair Schedule.** The Riverside Fair runs June 6–8 at Mill Park, opening at 10 am each day. *Source: Riverton Parks & Recreation (fictional)*
- **B:** "Flagged: event dates shared by personal accounts are often outdated."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @marcy_in_riverton · not verified | ✗ | Event details from personal accounts are often out of date. |
| Claim vs record | Post: June 6–8, Mill Park · Record: June 6–8, Mill Park | ✓ | Matching dates alone don't show the post is current. |
| Wording | Neutral | ✓ | Cheerful event posts often repeat details from past years. |

- **D:** "This would be labeled accurate if an official events page had posted it."
- **Debrief fact:** The fair does run June 6–8 at Mill Park, so this post was accurate.

### p04

- **set:** S1 · **topic:** env · **truth:** FALSE · **AI label:** ✓ Likely accurate · **errorType:** miss · **difficulty:** subtle
- **Post:** Alder Lake Watch · @AlderLakeWatch · verified: yes · 6h · 356 likes · 120 reposts
  > Lake Alder hit a record low this spring. The shoreline at North Dock is farther out than we have ever measured.
- **Fact sheet:** **Lake Alder Water Levels: Spring Report.** This spring's level was the lowest since 2019. The record low, set in 2012, was 1.4 feet lower. *Source: Alder County Water Authority (fictional)*
- **B:** "Checked: water level reports from this account are usually reliable."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @AlderLakeWatch · verified | ✓ | This verified account has tracked lake levels for years. |
| Claim vs record | Post: record low · Record: lowest since 2019; record low was 2012 | ✗ | This spring's level is still one of the lowest on record. |
| Wording | Neutral | ✓ | The post reports the level calmly, without exaggeration. |

- **D:** "This would be labeled misleading if the account weren't a verified local source."
- **Debrief fact:** Lake Alder was at its lowest since 2019, not a record low; the record was set in 2012.

### p05

- **set:** S1 · **topic:** svc · **truth:** TRUE · **AI label:** ✓ Likely accurate · **errorType:** null · **difficulty:** —
- **Post:** Leo Park · @leo_rides_route9 · verified: no · 2h · 64 likes · 22 reposts
  > FINALLY!!! Route 9 is getting Saturday buses starting March 1. No more paying for rides to work on weekends!!
- **Fact sheet:** **Route 9 Service Change.** Beginning March 1, Route 9 adds Saturday service, every 30 minutes from 7 am to 9 pm. *Source: Riverton Transit Authority (fictional)*
- **B:** "Checked: the start date matches the transit authority's service notice."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @leo_rides_route9 · not verified | ✗ | Though personal, this account repeats the official notice's details. |
| Claim vs record | Post: Saturday service from March 1 · Record: Saturday service starts March 1 | ✓ | The March 1 start matches the transit notice. |
| Wording | Sensational (all caps, "!!!") | ✗ | The excitement here reflects good news, not exaggeration. |

- **D:** "This would be labeled misleading if Saturday service began on a different date."

### p06

- **set:** S1 · **topic:** evt · **truth:** FALSE · **AI label:** ⚠ Likely misleading · **errorType:** null · **difficulty:** —
- **Post:** Riverton Runners Club · @RivertonRunners · verified: yes · 8h · 198 likes · 87 reposts
  > Sad news: the Riverton marathon is canceled this year. We'll share refund details for registered runners soon.
- **Fact sheet:** **Riverton Marathon.** The Riverton Marathon is scheduled for October 12, starting at Depot Square at 7 am. Registration is still open. *Source: Riverton Parks & Recreation (fictional)*
- **B:** "Flagged: the city's event calendar still lists the marathon as scheduled."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @RivertonRunners · verified | ✓ | Even verified clubs can repeat rumors before checking with the city. |
| Claim vs record | Post: canceled this year · Record: scheduled for October 12 | ✗ | The city record shows the race is still on for October 12. |
| Wording | Neutral | ✓ | A calm tone doesn't make a cancellation claim correct. |

- **D:** "This would be labeled accurate if the city had removed the marathon from its calendar."

### p07

- **set:** S2 · **topic:** env · **truth:** TRUE · **AI label:** ✓ Likely accurate · **errorType:** null · **difficulty:** —
- **Post:** Green Riverton · @GreenRiverton · verified: yes · 4h · 402 likes · 96 reposts
  > HUGE milestone: Riverton planted 1,200 street trees in 2025! Every neighborhood got new shade.
- **Fact sheet:** **Urban Forestry Report 2025.** The city planted 1,200 street trees in 2025, across all nine neighborhoods. *Source: Riverton Parks & Recreation (fictional)*
- **B:** "Checked: the tree count matches the city's 2025 forestry report."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @GreenRiverton · verified | ✓ | The post comes from a verified local environmental group. |
| Claim vs record | Post: 1,200 trees in 2025 · Record: 1,200 trees in 2025 | ✓ | The 1,200-tree count matches the 2025 forestry report. |
| Wording | Sensational (all caps "HUGE") | ✗ | The caps show enthusiasm, but the figure itself is exact. |

- **D:** "This would be labeled misleading if the forestry report showed a different tree count."

### p08

- **set:** S2 · **topic:** svc · **truth:** FALSE · **AI label:** ⚠ Likely misleading · **errorType:** null · **difficulty:** —
- **Post:** Ray Okafor · @rayo_elmst · verified: no · 3h · 271 likes · 153 reposts
  > WARNING: trash pickup is going to EVERY OTHER WEEK in April. The council did this quietly!!
- **Fact sheet:** **Residential Collection Schedule.** Trash pickup stays weekly on your usual day. No schedule changes are planned for April. *Source: Riverton Public Works (fictional)*
- **B:** "Flagged: the city's collection schedule shows trash pickup staying weekly."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @rayo_elmst · not verified | ✗ | This personal account is not a city source for schedules. |
| Claim vs record | Post: every other week from April · Record: stays weekly | ✗ | The city schedule shows trash pickup staying weekly. |
| Wording | Sensational (all caps, "WARNING", "!!") | ✗ | Words like WARNING and all caps are typical of rumors. |

- **D:** "This would be labeled accurate if the city's schedule showed pickup every other week."

### p09

- **set:** S2 · **topic:** evt · **truth:** TRUE · **AI label:** ⚠ Likely misleading · **errorType:** false_alarm · **difficulty:** subtle
- **Post:** Jess Arbor · @jess_arbor · verified: no · 1d · 176 likes · 44 reposts
  > IT'S BACK!!! The farmers market opens May 3 at Depot Square. Get there early, the honey stand sells out by 9!
- **Fact sheet:** **Riverton Farmers Market Season.** The farmers market opens May 3 at Depot Square and runs every weekend through October, 8 am to 1 pm. *Source: Riverton Parks & Recreation (fictional)*
- **B:** "Flagged: all-caps hype like this often signals an unreliable event post."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @jess_arbor · not verified | ✗ | Personal accounts often share event details secondhand. |
| Claim vs record | Post: opens May 3, Depot Square · Record: opens May 3, Depot Square | ✓ | The date matches, but hype-heavy posts are rarely reliable sources. |
| Wording | Sensational (all caps, "!!!") | ✗ | All caps and triple exclamation marks are classic signs of hype. |

- **D:** "This would be labeled accurate if it were written in a calmer, factual tone."
- **Debrief fact:** The market does open May 3 at Depot Square, so this post was accurate.

### p10

- **set:** S2 · **topic:** svc · **truth:** FALSE · **AI label:** ✓ Likely accurate · **errorType:** miss · **difficulty:** clear
- **Post:** Riverton Community News · @RivertonCommNews · verified: yes · 7h · 233 likes · 140 reposts
  > Downtown Riverton parking now costs $4 an hour, starting this month. Meters still take cards and coins.
- **Fact sheet:** **Downtown Parking Rates.** Downtown meter parking remains $2 per hour this season. Meters accept cards and coins. *Source: Riverton Parking Services (fictional)*
- **B:** "Checked: this local news account has a strong record on city updates."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @RivertonCommNews · verified | ✓ | This verified news account regularly reports city updates. |
| Claim vs record | Post: $4 per hour · Record: $2 per hour | ✗ | News outlets often report fee changes before city pages update. |
| Wording | Neutral | ✓ | The post gives the fee in a plain, factual way. |

- **D:** "This would be labeled misleading if it came from an anonymous personal account."
- **Debrief fact:** Downtown parking is still $2 an hour; there is no $4 rate.

### p11

- **set:** S2 · **topic:** evt · **truth:** TRUE · **AI label:** ✓ Likely accurate · **errorType:** null · **difficulty:** —
- **Post:** Pat Delgado · @patdelgado_rvt · verified: no · 5h · 95 likes · 31 reposts
  > Fireworks start at 9:30 pm on July 4 at the riverfront. Bring a blanket; the best view is near the footbridge.
- **Fact sheet:** **Fourth of July Celebration.** Fireworks begin at 9:30 pm on July 4, launched from the riverfront. *Source: Riverton Parks & Recreation (fictional)*
- **B:** "Checked: the time and place match the city's July 4 schedule."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @patdelgado_rvt · not verified | ✗ | Though personal, this account gives the exact official time and place. |
| Claim vs record | Post: 9:30 pm July 4, riverfront · Record: 9:30 pm July 4, riverfront | ✓ | The 9:30 pm riverfront start matches the city schedule. |
| Wording | Neutral | ✓ | The post states the details plainly. |

- **D:** "This would be labeled misleading if the city listed a different time or place."

### p12

- **set:** S2 · **topic:** env · **truth:** FALSE · **AI label:** ⚠ Likely misleading · **errorType:** null · **difficulty:** —
- **Post:** Riverton Morning Show · @RivertonMorning · verified: yes · 9h · 318 likes · 177 reposts
  > Shocking: Riverton had air-quality alerts on 30 days last summer. That's a full month of bad air!
- **Fact sheet:** **Summer Air Quality Summary.** Alder County issued air-quality alerts on 4 days last summer, all in late August. *Source: Alder County Environmental Office (fictional)*
- **B:** "Flagged: the county's air-quality summary lists far fewer alert days."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @RivertonMorning · verified | ✓ | Verified media accounts can still misreport statistics. |
| Claim vs record | Post: 30 alert days · Record: 4 alert days | ✗ | The county summary lists 4 alert days, not 30. |
| Wording | Sensational ("Shocking", "!") | ✗ | Words like 'Shocking' signal an exaggerated claim. |

- **D:** "This would be labeled accurate if the county summary showed 30 alert days."

### p13

- **set:** S3 · **topic:** svc · **truth:** TRUE · **AI label:** ✓ Likely accurate · **errorType:** null · **difficulty:** —
- **Post:** Riverton Public Library · @RivertonLibrary · verified: yes · 2d · 151 likes · 27 reposts
  > Reminder: library card renewals are now free when you renew online. In-person renewals are still $2.
- **Fact sheet:** **Library Card Fees.** Online card renewal is free as of this year. In-person renewal costs $2. *Source: Riverton Public Library (fictional)*
- **B:** "Checked: the library's fee page confirms online renewal is free."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @RivertonLibrary · verified | ✓ | The post comes from the library's own verified account. |
| Claim vs record | Post: online renewal free · Record: online renewal free | ✓ | The fee page confirms online renewal is free. |
| Wording | Neutral | ✓ | The reminder is worded plainly and factually. |

- **D:** "This would be labeled misleading if the fee page listed a charge for online renewal."

### p14

- **set:** S3 · **topic:** env · **truth:** FALSE · **AI label:** ⚠ Likely misleading · **errorType:** null · **difficulty:** —
- **Post:** Tom Brandt · @tbrandt_outdoors · verified: no · 4h · 129 likes · 73 reposts
  > Alder River is CLOSED to swimming all summer. Total ban. Don't even bother packing a towel.
- **Fact sheet:** **Alder River Swimming Status.** The river's swimming areas are open this summer. Short advisories were posted on 2 days after heavy rain. *Source: Alder County Environmental Office (fictional)*
- **B:** "Flagged: the county lists the river as open with two advisory days."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @tbrandt_outdoors · not verified | ✗ | This personal account is not a county source for river status. |
| Claim vs record | Post: closed all summer · Record: open; 2 advisory days | ✗ | The county lists the river as open, with two advisory days. |
| Wording | Sensational (all caps, "Total ban") | ✗ | All caps and 'Total ban' overstate a short advisory. |

- **D:** "This would be labeled accurate if the county had closed the river for the summer."

### p15

- **set:** S3 · **topic:** env · **truth:** TRUE · **AI label:** ⚠ Likely misleading · **errorType:** false_alarm · **difficulty:** subtle
- **Post:** Riverton Neighbors · @RivertonNeighbors · verified: yes · 6h · 187 likes · 52 reposts
  > Good news: Riverton tap water met all 12 safety limits in March.
- **Fact sheet:** **March Water Quality Report.** In March, Riverton's tap water was tested for 12 regulated substances. All 12 results were within safety limits. *Source: Riverton Water Department (fictional)*
- **B:** "Flagged: claims about water safety are often exaggerated."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @RivertonNeighbors · verified | ✓ | Community pages can be verified without being experts on water testing. |
| Claim vs record | Post: all 12 limits met in March · Record: all 12 tests within limits | ✓ | The post states the result without citing the March report. |
| Wording | Neutral | ✓ | Reassuring safety posts often leave out caveats from the full report. |

- **D:** "This would be labeled accurate if it cited the March test report."
- **Debrief fact:** The March report confirms all 12 tap-water tests were within safety limits, so this post was accurate.

### p16

- **set:** S3 · **topic:** evt · **truth:** FALSE · **AI label:** ✓ Likely accurate · **errorType:** miss · **difficulty:** clear
- **Post:** Riverton Weekend Guide · @RVTweekendguide · verified: yes · 3h · 164 likes · 61 reposts
  > Schedule change: the Mill Park summer concert has moved to August 20. Same time, 7 pm, same stage.
- **Fact sheet:** **Mill Park Summer Concert.** The summer concert remains on August 13 at 7 pm on the Mill Park stage. No date change has been announced. *Source: Riverton Parks & Recreation (fictional)*
- **B:** "Checked: this post gives the same time and stage as the city listing."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @RVTweekendguide · verified | ✓ | This verified guide account posts the town's event schedules weekly. |
| Claim vs record | Post: August 20 · Record: August 13 | ✗ | The time and stage match the city listing for the concert. |
| Wording | Neutral | ✓ | The post reads like a routine, factual schedule update. |

- **D:** "This would be labeled misleading if it gave a different stage or start time."
- **Debrief fact:** The concert is still on August 13; it has not moved to August 20.

### p17

- **set:** S3 · **topic:** svc · **truth:** TRUE · **AI label:** ✓ Likely accurate · **errorType:** null · **difficulty:** —
- **Post:** Carla Ruiz · @carla_on_elm · verified: no · 1d · 88 likes · 15 reposts
  > Elm St FINALLY has new crosswalk signals!!! Took long enough. Walked my kids across today and they work great.
- **Fact sheet:** **Elm Street Safety Project.** New crosswalk signals were installed on Elm St at 3rd Ave and at 5th Ave this month. *Source: Riverton Public Works (fictional)*
- **B:** "Checked: the city's project page confirms the Elm Street signals are installed."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @carla_on_elm · not verified | ✗ | Though personal, this account reports a firsthand, checkable change. |
| Claim vs record | Post: signals installed on Elm St · Record: signals installed on Elm St | ✓ | The city project page confirms the Elm St signals are installed. |
| Wording | Sensational (all caps, "!!!") | ✗ | The excitement is about a real change, not an exaggeration. |

- **D:** "This would be labeled misleading if the project page showed the signals still pending."

### p18

- **set:** S3 · **topic:** evt · **truth:** FALSE · **AI label:** ⚠ Likely misleading · **errorType:** null · **difficulty:** —
- **Post:** Downtown Riverton Association · @DowntownRiverton · verified: yes · 10h · 142 likes · 58 reposts
  > Note for shoppers: the Founders Day parade closes Main St for three days, Friday to Sunday. Please use the Oak St lot.
- **Fact sheet:** **Founders Day Parade Road Closures.** Main St will be closed for 1 day only, from 8 am to 4 pm on parade day. *Source: Riverton Public Works (fictional)*
- **B:** "Flagged: the city's road-closure notice lists Main Street closed one day."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @DowntownRiverton · verified | ✓ | Verified groups can still misread a city closure notice. |
| Claim vs record | Post: Main St closed 3 days · Record: Main St closed 1 day | ✗ | The closure notice lists Main St closed for one day only. |
| Wording | Neutral | ✓ | A helpful tone doesn't make the three-day claim correct. |

- **D:** "This would be labeled accurate if the closure notice showed three days on Main Street."

### p19

- **set:** S4 · **topic:** evt · **truth:** TRUE · **AI label:** ✓ Likely accurate · **errorType:** null · **difficulty:** —
- **Post:** Alder County Food Bank · @AlderFoodBank · verified: yes · 5h · 512 likes · 134 reposts
  > WOW. You all raised $18,000 for the food bank at the half-marathon!!! Thank you, Riverton!
- **Fact sheet:** **Riverton Half-Marathon Results.** The half-marathon raised $18,000 for the Alder County Food Bank. *Source: Riverton Parks & Recreation (fictional)*
- **B:** "Checked: the amount matches the race organizer's published fundraising total."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @AlderFoodBank · verified | ✓ | The post comes from the food bank's verified account. |
| Claim vs record | Post: $18,000 raised · Record: $18,000 raised | ✓ | The $18,000 total matches the published race results. |
| Wording | Sensational (all caps "WOW", "!!!") | ✗ | The excitement is a thank-you; the amount itself is exact. |

- **D:** "This would be labeled misleading if the published total were different from $18,000."

### p20

- **set:** S4 · **topic:** svc · **truth:** FALSE · **AI label:** ⚠ Likely misleading · **errorType:** null · **difficulty:** —
- **Post:** Gail Monroe · @gailmonroe · verified: no · 2h · 203 likes · 119 reposts
  > PSA: property tax bills are due two weeks earlier this year, May 1 instead of May 15. Don't get hit with a late fee.
- **Fact sheet:** **Alder County Property Tax Calendar.** The first property tax payment is due May 15, the same date as last year. *Source: Alder County Treasurer (fictional)*
- **B:** "Flagged: the county treasurer still lists the usual May 15 due date."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @gailmonroe · not verified | ✗ | This personal account is not a county tax source. |
| Claim vs record | Post: due May 1 · Record: due May 15 (unchanged) | ✗ | The treasurer's calendar shows the usual May 15 due date. |
| Wording | Neutral | ✓ | A 'PSA' framing makes a wrong date sound official. |

- **D:** "This would be labeled accurate if the treasurer's calendar showed a May 1 due date."

### p21

- **set:** S4 · **topic:** svc · **truth:** TRUE · **AI label:** ⚠ Likely misleading · **errorType:** false_alarm · **difficulty:** clear
- **Post:** Riverton Swim Team · @RivertonSwim · verified: yes · 7h · 97 likes · 33 reposts
  > UGH. The pool opening is delayed to June 14 for repairs. Two more weeks without laps!!
- **Fact sheet:** **Riverton Community Pool Opening.** The pool will open June 14, after repairs to the main pump are finished. *Source: Riverton Parks & Recreation (fictional)*
- **B:** "Flagged: frustrated, emotional posts about closures often overstate delays."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @RivertonSwim · verified | ✓ | A verified swim team is still a fan account, not the city. |
| Claim vs record | Post: opens June 14 after repairs · Record: opens June 14 after repairs | ✓ | The date matches, but the post never links the city's pool notice. |
| Wording | Sensational (all caps "UGH", "!!") | ✗ | Frustrated wording like 'UGH' often signals an overstated delay. |

- **D:** "This would be labeled accurate if it had linked to the city's pool notice."
- **Debrief fact:** The pool does open June 14 after repairs, so this post was accurate.

### p22

- **set:** S4 · **topic:** env · **truth:** FALSE · **AI label:** ✓ Likely accurate · **errorType:** miss · **difficulty:** subtle
- **Post:** Owen Hale · @owen_hale_rvt · verified: no · 9h · 146 likes · 90 reposts
  > The city has banned gas leaf blowers starting this fall. Electric ones only from now on, under the new ordinance.
- **Fact sheet:** **Proposed Ordinance 26-14: Gas Leaf Blowers.** A ban on gas leaf blowers has been proposed. The City Council will vote on it in November, and no ban is in effect. *Source: Riverton City Clerk (fictional)*
- **B:** "Checked: the post accurately names the ordinance being discussed by the council."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @owen_hale_rvt · not verified | ✗ | Though personal, this account names the ordinance under discussion correctly. |
| Claim vs record | Post: banned from this fall · Record: proposed; vote in November | ✗ | The ordinance is on the council's agenda, as the post describes. |
| Wording | Neutral | ✓ | The post describes the rule in calm, factual terms. |

- **D:** "This would be labeled misleading if it named the wrong ordinance or council."
- **Debrief fact:** Gas leaf blowers are not banned; the ban is only proposed, with a council vote in November.

### p23

- **set:** S4 · **topic:** env · **truth:** TRUE · **AI label:** ✓ Likely accurate · **errorType:** null · **difficulty:** —
- **Post:** Hal Jensen · @haljensen_gardens · verified: no · 1d · 58 likes · 12 reposts
  > Compost drop-off at the Public Works yard is open Saturdays 8 to noon. Bring your yard waste in paper bags.
- **Fact sheet:** **Compost Drop-Off Hours.** The compost drop-off at the Public Works yard is open Saturdays from 8 am to 12 pm. *Source: Riverton Public Works (fictional)*
- **B:** "Checked: the hours match the city's posted compost drop-off schedule."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @haljensen_gardens · not verified | ✗ | Though personal, this account gives the exact official hours. |
| Claim vs record | Post: Saturdays 8–noon · Record: Saturdays 8 am–12 pm | ✓ | Saturday 8 am to noon matches the posted schedule. |
| Wording | Neutral | ✓ | The hours are stated plainly and specifically. |

- **D:** "This would be labeled misleading if the posted hours were different from Saturday 8–noon."

### p24

- **set:** S4 · **topic:** evt · **truth:** FALSE · **AI label:** ⚠ Likely misleading · **errorType:** null · **difficulty:** —
- **Post:** Brenda Lowe · @brenda_lowe_rvt · verified: no · 4h · 289 likes · 164 reposts
  > Holiday market tickets are $25 this year?! That's outrageous for a town market. Buy early before they sell out.
- **Fact sheet:** **Riverton Holiday Market.** Entry to the holiday market is free. No tickets are required. *Source: Riverton Parks & Recreation (fictional)*
- **B:** "Flagged: the city's market page says entry is free with no tickets."
- **C:**

| Row | displayValue | Result | detail |
|---|---|---|---|
| Source | @brenda_lowe_rvt · not verified | ✗ | This personal account is not the market's organizer. |
| Claim vs record | Post: $25 tickets · Record: free entry; no tickets | ✗ | The market page says entry is free, with no tickets. |
| Wording | Sensational ("?!", "outrageous") | ✗ | Outrage wording like 'outrageous' signals an exaggerated claim. |

- **D:** "This would be labeled accurate if the market page listed a $25 ticket price."

## 5. Self-check

| id | truth | AI label | correct | errorType | B words | D words | Claim vs record | ✓ iff TRUE | text chars |
|---|---|---|---|---|---|---|---|---|---|
| p01 | TRUE | accurate | yes | null | 9 | 14 | ✓ | yes | 122 |
| p02 | FALSE | misleading | yes | null | 10 | 12 | ✗ | yes | 110 |
| p03 | TRUE | misleading | no | false_alarm | 10 | 13 | ✓ | yes | 105 |
| p04 | FALSE | accurate | no | miss | 10 | 13 | ✗ | yes | 111 |
| p05 | TRUE | accurate | yes | null | 10 | 13 | ✓ | yes | 109 |
| p06 | FALSE | misleading | yes | null | 11 | 15 | ✗ | yes | 110 |
| p07 | TRUE | accurate | yes | null | 10 | 14 | ✓ | yes | 94 |
| p08 | FALSE | misleading | yes | null | 10 | 14 | ✗ | yes | 91 |
| p09 | TRUE | misleading | no | false_alarm | 11 | 14 | ✓ | yes | 109 |
| p10 | FALSE | accurate | no | miss | 12 | 13 | ✗ | yes | 117 |
| p11 | TRUE | accurate | yes | null | 11 | 14 | ✓ | yes | 110 |
| p12 | FALSE | misleading | yes | null | 10 | 13 | ✗ | yes | 97 |
| p13 | TRUE | accurate | yes | null | 10 | 15 | ✓ | yes | 100 |
| p14 | FALSE | misleading | yes | null | 12 | 15 | ✗ | yes | 91 |
| p15 | TRUE | misleading | no | false_alarm | 8 | 12 | ✓ | yes | 64 |
| p16 | FALSE | accurate | no | miss | 13 | 14 | ✗ | yes | 98 |
| p17 | TRUE | accurate | yes | null | 12 | 14 | ✓ | yes | 110 |
| p18 | FALSE | misleading | yes | null | 11 | 15 | ✗ | yes | 118 |
| p19 | TRUE | accurate | yes | null | 10 | 13 | ✓ | yes | 90 |
| p20 | FALSE | misleading | yes | null | 12 | 15 | ✗ | yes | 116 |
| p21 | TRUE | misleading | no | false_alarm | 9 | 14 | ✓ | yes | 86 |
| p22 | FALSE | accurate | no | miss | 12 | 13 | ✗ | yes | 113 |
| p23 | TRUE | accurate | yes | null | 10 | 14 | ✓ | yes | 107 |
| p24 | FALSE | misleading | yes | null | 12 | 14 | ✗ | yes | 111 |

B: 8–13 words; D: 12–15 words; longest post text 122 characters. Every B sentence is 8–14 words and every D sentence 10–16 words. Claim vs record is ✓ on exactly the 12 TRUE posts and ✗ on the 12 FALSE posts, and this holds on the 8 wrong labels too (✓ on the 4 false alarms, ✗ on the 4 misses). Totals: 12 "accurate" and 12 "misleading" labels; 12 TRUE and 12 FALSE; false alarms p03, p09, p15, p21 and misses p04, p10, p16, p22, each set with one `clear` and one `subtle` wrong label. Every wrong label has a debrief fact. The practice post's B (9 words) and D (14 words) are also in range.

Points for the team:
- The C-shows-true-values principle is deliberate: preserve the true comparison, including contradictions on wrong-label posts.
- p10 was changed from a flu-shot fee to a parking fee, so that no post could discourage someone from health care.

## Related docs

- [architecture.md](architecture.md)
- [system-design.md](system-design.md)
- [sequence-diagrams.md](sequence-diagrams.md)
- [data-model.md](data-model.md)
- [ai-design.md](ai-design.md)
- [research-positioning.md](research-positioning.md)
- [implementation-plan.md](implementation-plan.md)
- [study-protocol.md](study-protocol.md)
- [wireframes.md](wireframes.md)
