/*
 * BlockSurveyScreen: route /survey/:block (CONTRACT-v2 §C, docs/wireframes.md §10).
 * One compact screen. Fixed order: 12 Jian trust items (LikertMatrix), 2 fairness items (second
 * LikertMatrix, own anchors), tension (one compact chip row), NASA-TLX frustration slider.
 * All 16 are required; the slider counts only once touched (moved or arrow key). Continue is enabled
 * only when all 16 are answered. The heading never names the condition.
 *
 * CSS classes (styled in src/styles/global.css; no inline colors here):
 *   .survey               page wrapper (<main>); also .survey--compact
 *   .survey__title        h1 heading
 *   .survey__section      one group of items (trust / fairness / feelings)
 *   .survey__section-title  small h2 above a group
 *   .survey__item         wrapper around tension / slider
 *   .survey__item-hint    "Move the slider to answer, even if you leave it at 50." under the slider
 *   .survey__error        network / server error message (role=alert)
 *   .survey__footer       sticky footer (counter + Continue)
 *   .survey__counter      "x of 16 answered" (aria-live polite); .survey__counter--complete when done
 *   .survey__submit       the Continue button
 *   (matrix: .matrix* in LikertMatrix; tension: .likert .likert--compact; slider: .slider*)
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useStudy, routeForCursor } from "../state/StudyContext";
import { useLogger } from "../logging/logger";
import LikertScale from "../components/LikertScale";
import LikertMatrix from "../components/LikertMatrix";
import SliderScale from "../components/SliderScale";
import surveyItemsRaw from "../../shared/data/surveyItems.json";
import type { Likert7, SurveyItems } from "../../shared/types";
import type { BlockSurveySubmission } from "../../shared/api";

const surveyItems = surveyItemsRaw as unknown as SurveyItems;

const empty = (items: { id: string }[]) =>
  Object.fromEntries(items.map((it) => [it.id, null])) as Record<string, number | null>;

export default function BlockSurveyScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const { session, dispatch } = useStudy();
  const logger = useLogger();

  const blockIndex = Number(params.block) as 1 | 2 | 3 | 4;
  const validBlock = [1, 2, 3, 4].includes(blockIndex);
  const condition = session?.blocks[blockIndex - 1]?.condition ?? null;

  const trustItems = useMemo(
    () => [...surveyItems.trustItems].sort((a, b) => a.order - b.order),
    [],
  );
  const fairnessItems = useMemo(
    () => [...surveyItems.fairnessItems].sort((a, b) => a.order - b.order),
    [],
  );
  const tension = surveyItems.tension;
  const tlx = surveyItems.frustrationTlx;
  const tlxStart = tlx.start ?? 50;

  const [trust, setTrust] = useState<Record<string, number | null>>(() => empty(trustItems));
  const [fairness, setFairness] = useState<Record<string, number | null>>(() => empty(fairnessItems));
  const [tensionValue, setTensionValue] = useState<number | null>(null);
  const [tlxValue, setTlxValue] = useState<number>(tlxStart);
  const [tlxTouched, setTlxTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset when the block changes (a new survey is shown empty).
  useEffect(() => {
    setTrust(empty(trustItems));
    setFairness(empty(fairnessItems));
    setTensionValue(null);
    setTlxValue(tlxStart);
    setTlxTouched(false);
    setError(null);
  }, [blockIndex, trustItems, fairnessItems, tlxStart]);

  const nTrust = trustItems.length;
  const nFair = fairnessItems.length;
  const total = nTrust + nFair + 2;
  const tensionNumber = nTrust + nFair + 1;
  const tlxNumber = nTrust + nFair + 2;
  const answered =
    trustItems.filter((it) => trust[it.id] != null).length +
    fairnessItems.filter((it) => fairness[it.id] != null).length +
    (tensionValue != null ? 1 : 0) +
    (tlxTouched ? 1 : 0);
  const complete = answered === total;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setError(null);
    if (!complete) return;
    if (!session || !validBlock) {
      setError("No active session. Please go back to the start page.");
      return;
    }
    if (!Number.isInteger(tlxValue) || tlxValue < 0 || tlxValue > 100 || tlxValue % 5 !== 0) {
      setError("The slider value is invalid. Please move it again.");
      return;
    }

    const payload: BlockSurveySubmission = {
      blockIndex,
      trustRaw: trustItems.map((it) => trust[it.id]) as Likert7[],
      fairness1: fairness[fairnessItems[0].id] as Likert7,
      fairness2: fairness[fairnessItems[1].id] as Likert7,
      tension: tensionValue as Likert7,
      frustrationTlx: tlxValue,
      frustrationTlxTouched: true,
      anxiety: null,
    };

    setSending(true);
    try {
      const res = await api.submitBlockSurvey(session.sessionId, payload);
      logger?.log({
        trialId: null,
        blockIndex,
        condition,
        postId: null,
        type: "block_survey_submit",
        factorKey: null,
        tMs: null,
      });
      try {
        await logger?.flush();
      } catch {
        // events are retried by the logger; never block the participant on them
      }
      dispatch({ type: "CURSOR_CHANGED", cursor: res.cursor });
      navigate(routeForCursor(res.cursor));
    } catch {
      setError("Your answers could not be saved. Please check your connection and try again.");
      setSending(false);
    }
  }

  if (!validBlock) {
    return (
      <main className="survey">
        <p className="survey__error" role="alert">This part does not exist.</p>
      </main>
    );
  }

  return (
    <main className="survey survey--compact">
      <h1 className="survey__title">
        Part {blockIndex} of 4 done — a few quick questions about the AI labels in that part
      </h1>
      <form onSubmit={handleSubmit} noValidate>
        <section className="survey__section" aria-labelledby="survey-trust-title">
          <h2 className="survey__section-title" id="survey-trust-title">How much do you agree?</h2>
          <LikertMatrix
            label="Trust in the AI labels"
            items={trustItems}
            min={surveyItems.trustScale.min}
            max={surveyItems.trustScale.max}
            minLabel={surveyItems.trustScale.minLabel}
            maxLabel={surveyItems.trustScale.maxLabel}
            values={trust}
            onChange={(id, v) => setTrust((prev) => ({ ...prev, [id]: v }))}
          />
        </section>

        <section className="survey__section" aria-labelledby="survey-fair-title">
          <h2 className="survey__section-title" id="survey-fair-title">Fairness</h2>
          <LikertMatrix
            label="Fairness of the AI labels"
            items={fairnessItems}
            startNumber={nTrust + 1}
            min={surveyItems.fairnessScale.min}
            max={surveyItems.fairnessScale.max}
            minLabel={surveyItems.fairnessScale.minLabel}
            maxLabel={surveyItems.fairnessScale.maxLabel}
            values={fairness}
            onChange={(id, v) => setFairness((prev) => ({ ...prev, [id]: v }))}
          />
        </section>

        <section className="survey__section" aria-labelledby="survey-feel-title">
          <h2 className="survey__section-title" id="survey-feel-title">How you felt</h2>
          <div id="survey-item-tension" className="survey__item">
            <LikertScale
              compact
              name="tension"
              label={`${tensionNumber}. ${tension.text}`}
              min={tension.min}
              max={tension.max}
              minLabel={tension.minLabel}
              maxLabel={tension.maxLabel}
              value={tensionValue}
              onChange={(v: number) => setTensionValue(v)}
            />
          </div>
          <div id="survey-item-frustrationTlx" className="survey__item">
            <SliderScale
              name="frustrationTlx"
              label={`${tlxNumber}. ${tlx.text}`}
              min={tlx.min}
              max={tlx.max}
              step={tlx.step}
              start={tlxStart}
              minLabel={tlx.minLabel}
              maxLabel={tlx.maxLabel}
              value={tlxValue}
              touched={tlxTouched}
              onChange={(v: number) => setTlxValue(v)}
              onTouch={() => setTlxTouched(true)}
            />
            {!tlxTouched && answered === total - 1 && (
              <p className="survey__item-hint">Move the slider to answer, even if you leave it at 50.</p>
            )}
          </div>
        </section>

        {error && <p className="survey__error" role="alert">{error}</p>}

        <div className="survey__footer">
          <span
            className={`survey__counter${complete ? " survey__counter--complete" : ""}`}
            aria-live="polite"
          >
            {answered} of {total} answered
          </span>
          <button type="submit" className="survey__submit" disabled={!complete || sending}>
            {sending ? "Saving…" : "Continue"}
          </button>
        </div>
      </form>
    </main>
  );
}
