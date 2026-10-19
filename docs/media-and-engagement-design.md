# Media and engagement design

**Current decision — images rejected (2026-10-19):** `CURRENT_PROTOCOL` returns to `calibrated-full-v1`: new sessions are text-only and display each post’s original likes/reposts. Keep eight posts and `full-v1` (16 ratings per part, 64 total). `calibrated-media-full-v1` remains supported only for historical saved sessions, with their saved media/count profile and questionnaire; do not migrate or relabel them. Remove image captions from the UI, including historical media sessions; retain descriptive alt text for historical images. Do not generate new images or use generic topic photographs by default. Default practice is text-only with original counts; `GET /api/practice?contextMedia=1` is historical compatibility only. Schema 5 and historical assets/prompts remain preserved. Dashboard/KPI defaults return to the text-only full cohort; keep presentation cohorts separate.

**Verification boundary:** this documentation update adds no browser captures, visual testing, code-test or build results. Earlier media evidence below is historical and does not verify the current text-only/caption-free UI.

**Study title: Do People Trust AI More When It Explains Itself? A Comparative Study of Explanation**

## Per-post image suitability audit

Decision: **text-only for all 24 posts**. This content audit reads the canonical claims in [stimuli.md](stimuli.md); it is a design judgment following user rejection, not a visual test or measured realism result. None needs a photograph to understand the claim. A generic scene would add decoration or a credibility cue without supplying the decisive record. Do not replace the rejected images with new generated images, screenshots of purported records or selectively illustrated posts.

| Post | Claim being judged | Why a photograph is unnecessary or unsuitable |
|---|---|---|
| p01 | Recycling rate rose from 36% to 41% | Annual statistics require the published figures; bins cannot show a rate. |
| p02 | Library closes every Monday | Opening days require the schedule; a building photo cannot establish them. |
| p03 | Fair runs June 6–8 at Mill Park | Dates and venue require the event listing; a fair scene supplies neither. |
| p04 | Lake reached an all-time record low | A shoreline cannot establish a historical record; comparative measurements are decisive. |
| p05 | Route 9 adds Saturday buses March 1 | Service days and effective date require the timetable, not a bus photo. |
| p06 | Marathon canceled this year | Cancellation requires the official notice; a race photo may imply the opposite. |
| p07 | City planted 1,200 street trees in 2025 | A few trees cannot establish a citywide count or planting year. |
| p08 | Trash collection becomes every other week | Collection frequency requires the service schedule, not bins or a truck. |
| p09 | Farmers market opens May 3 at Depot Square | Opening date and location require the listing, not a generic market. |
| p10 | Downtown parking costs $4 an hour | The applicable fee requires the rate record; generic meters cannot verify it. |
| p11 | July 4 fireworks begin at 9:30 pm | Start time requires the program; fireworks imagery cannot show the schedule. |
| p12 | Thirty air-quality alert days last summer | Alert counts require monitoring records; a sky photo cannot establish them. |
| p13 | Online library renewals free; in person $2 | Channel-specific fees require the policy, not a library photo. |
| p14 | River swimming banned all summer | Scope and duration require the official restriction, not river scenery. |
| p15 | Tap water met all 12 safety limits in March | Laboratory results establish compliance; clear-looking water is not evidence. |
| p16 | Concert moved to August 20 | The changed date requires the event schedule, not a stage photo. |
| p17 | New crosswalk signals installed on Elm St | A generic street cannot establish location, installation date or operation; use the record. |
| p18 | Parade closes Main St Friday–Sunday | Closure location and duration require the traffic notice, not parade imagery. |
| p19 | Half-marathon raised $18,000 for food bank | Donation totals require the fundraising record; runners cannot establish the sum. |
| p20 | Tax deadline moved from May 15 to May 1 | The deadline requires the tax notice, not civic-building imagery. |
| p21 | Pool opening delayed to June 14 | Opening date and repair delay require the notice, not a pool photo. |
| p22 | Gas leaf blowers banned starting this fall | Ordinance scope and effective date require policy text, not equipment imagery. |
| p23 | Compost drop-off Saturdays 8 am–noon | Hours and accepted-material rules require the service record, not compost imagery. |
| p24 | Holiday market admission costs $25 | Admission price requires the ticket listing, not market scenery. |

Original post wording, per-post counts, truth, explanations and fact sheets stay unchanged. Default practice also stays text-only with its original 74 likes/9 reposts. C retains its true Claim vs record comparison; images and popularity are never truth evidence. Historical saved media sessions retain their media/count profile, but no visible captions. Keep descriptive alt text for their images and note the caption-removal deviation when reporting their data.

## Historical media proposal and provenance — superseded

The sections below retain the rejected media proposal, asset metadata and earlier verification record. They are **not current instructions to enable images, generate assets or recruit a new media cohort**. References to caption display, media pilots and asset freezes describe the earlier proposal only. The current decision above takes precedence; no captions are displayed even when historical media sessions resume.

The earlier `calibrated-media-full-v1` proposal, app version `0.4.0`, added modest fictional feed context. This is a design specification, not a claim of improved naturalism, user-study findings or completed browser verification. The eight-trial plan, original post/fact-sheet/explanation wording, A–D packages, timing, assignment, truth and scoring remain unchanged. `full-v1` still collects 16 ratings after each part, 64 total.

## Historical images and caption

All 24 bank posts have an illustrative generated image in this protocol; three shared neutral topic images are reused. Presence is constant rather than a correct/wrong-label cue. The same post always uses the same image and caption across A–D. Images are not evidence verifying a claim: claim text, fictional fact sheets and C’s unchanged true Claim vs record comparison establish the available factual evidence. The rejected design specified the caption **“Illustrative scene”**. That caption is now removed from the UI, including historical sessions. Alt text describes only the depicted scene, without asserting the claim or its truth.

| Topic | Shared public asset path | Dimensions | SHA-256 |
|---|---|---|---|
| Environment (`env`) | `/post-images/environment.png` | 1536 × 1024 | `9ddcd968dfb406a4108a5a4236cf4ee34de7672f4acb026e906adb403e5a6704` |
| Public services (`svc`) | `/post-images/public-services.png` | 1536 × 1024 | `5291dea9a2b0dc5258e5c6d841569ea97f0bae26f412325aee1d3a20a498c99e` |
| Local events (`evt`) | `/post-images/local-events.png` | 1536 × 1024 | `939c4ae1027ff3a9103ee4813e94d3b5bd8964573519d9fff67dafe9e09dc72f` |

These are public URL paths, not verified file links. The coordinating agent’s [asset manifest](../app/public/post-images/manifest.json) identifies generation as “OpenAI built-in image generation”, version `context-media-v1`. PNG header dimensions, file lengths and SHA-256 values were checked against that manifest; these byte/metadata checks are not visual inspection. The coordinating agent reports visually inspecting the generated assets and confirming that the scenes match the neutral requests; this is asset inspection, not a browser-app visual pass. Generation prompts are retained in [media-generation-prompts.json](media-generation-prompts.json), the manifest companion. Preserve the neutral descriptive alt text with the bank and freeze it before collection. Practice remains outside the analysed bank; its default legacy presentation is unchanged, with media available through the explicit opt-in described below.

## Historical fixed engagement context

| Set | Bank posts | Displayed likes | Displayed reposts |
|---|---|---:|---:|
| S1 | p01–p06 | 128 | 16 |
| S2 | p07–p12 | 172 | 24 |
| S3 | p13–p18 | 96 | 12 |
| S4 | p19–p24 | 148 | 20 |

Every one of the six posts within a set has the same context counts, including correct labels, false alarms and misses. Counts are scripted, fixed display context, not observed engagement. They do not update or introduce comments, social endorsements, voting, sharing or other real posting controls. Original `likes`/`reposts` values remain in the bank for older protocols; do not overwrite them with the context profile.

## Historical media version boundary

`Post.context` holds `{image, likes, reposts}`; image metadata contains `{src, alt, width, height}`. The presentation builder’s `{contextMedia?: boolean}` option defaults to false. The session route opts in only for `calibrated-media-full-v1`, exposing the optional presentation image and context counts. Omitting the option preserves original text/count presentation. For historical media compatibility, `GET /api/practice?contextMedia=1` supplies a safe image and matched context counts; the default practice endpoint retains the original legacy text/count presentation. Practice remains unanalysed. The practice opt-in does not upgrade older session presentations.

Schema 5 introduces the media protocol while preserving earlier session versions and responses. Participation remains self-start without an admin gate. Do not mix presentation revisions within a saved session.

Previously started `calibrated-full-v1`, `calibrated-brief-v1` and `legacy-full-v1` sessions retain original count/text presentations, saved plans and their own questionnaires. Never select media or questionnaires from plan length, upgrade on resume or relabel earlier responses. Full media and text-only full cohorts share questionnaire wording, but their presentations differ and must be reported separately. Saved brief trust remains a separate measure.

## Historical rationale and remaining confounds

Illustrations and engagement counts can supply a recognizable feed frame without adding tasks. Sharing assets limits the number of distinct visuals, and constant image presence removes variation in whether a bank post has an image. Matching counts within each set prevents a within-set count difference from identifying label correctness. These controls do not establish equal perceived realism, salience, credibility or reading burden.

An image is tied to topic, not independently randomized. Topic, item difficulty, scene content and repeated-image familiarity can influence attention or interpretation; a generic scene may appear more congruent with some claims than others. Numeric engagement may still suggest popularity, and profiles differ between sets. Set rotation distributes planned exposure over complete cycles but cannot remove these effects in an incomplete sample. Fixed presence also does not isolate the effect of adding images from the changed counts: cross-protocol comparisons concern the combined presentation revision.

C continues to offer an additional route to decisive factual comparison. Any C advantage evaluates its evidence/interaction package, not pure interactivity. Illustrations must not replace that comparison or correct deliberately wrong labels. Neither visual polish nor successful technical tests establish psychometric validity, naturalistic behavior, novelty or statistical power.

## Historical pilot, freeze and evidence record

The superseded proposal called for a separate pilot database and a fresh formal media-cohort database, preserving earlier files and responses. Its proposed pilot covered the complete eight-post/64-rating flow, including comprehension of the illustrative caption, image loading, text legibility, alt text, unchanged decision locations, C overflow, fact sheets and desktop/responsive layouts. Review whether scenes inadvertently imply truth. Retain the common timing specification; assess loading/layout failures without silently changing trial timing.

The environment/public-services/local-events PNGs are approximately **3.63 / 2.98 / 2.94 MB** respectively (decimal MB). They are not established as optimized assets. Pilot cold-cache and repeat-load latency, failure behavior and layout stability on desktop and responsive devices; do not infer adequate load performance from local file inspection or change the common timing to conceal delays.

The earlier media freeze plan called for retaining the generation-prompts companion and freezing asset bytes, caption, alt text, intrinsic dimensions, topic mappings and context counts alongside app version, protocol, questionnaire and bank hash. This is historical planning; visible captions are now removed and new media collection is not the current decision. Record final SHA-256 values in the manifest above and retain the corresponding assets with the study materials. Any later replacement requires a documented version/deviation decision; do not silently serve changed images at frozen paths.

**Historical media verification record (2026-10-19, before rejection):** all three PNG hashes, byte lengths and 1536 × 1024 dimensions match the manifest, and the generated scenes were visually inspected. The final Chromium/Playwright run on an isolated SQLite database captured 32 screenshots across A–D at 1280, 1024, 768 and 360 px widths, with no page errors or horizontal overflow. Images loaded at their intrinsic width of 1536 px. Expanded C content could be scrolled to its final detail without moving the decision controls. At 1280 × 800 the new shared two-column layout placed the decision row at about y=655 px in all four tested conditions; the explanation frame stayed 264 px and image frame 160 px. Smaller widths retain the stacked layout and may require page scrolling. These are local Chromium checks, not cross-browser, slow-network or human-pilot results.

The earlier media verification recorded **438 passing tests** and a passing production build. These results were not rerun or independently verified in this documentation update. It covers schema 2/3/4 migration retention, new and saved protocols, full-survey persistence, truth-boundary allow-lists, media failure fallback, preload cleanup and the 32-slot exposure audit. Audit exposures per condition are environment 22, services 20 and events 22: balanced between conditions, not equal across topics. See [visual verification report](visual-quality-review.md), [screenshots](artifacts/media-v1/A-1280.png) and [layout measurements](artifacts/media-v1/metrics.json). Earlier blocked capture attempts are historical; they have been superseded for this media presentation by the successful run.

## Historical media references

- [Stimuli](stimuli.md): canonical text, original counts and media context profile.
- [Study protocol](study-protocol.md): cohort versions and collection procedure.
- [Methods and limitations](methods-and-limitations.md): reporting and interpretation.
- [Pilot and analysis plan](pilot-and-analysis-plan.md): pilot procedure and analysis framework; media cohorts require explicit presentation-version separation.
