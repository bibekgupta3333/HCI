// Consent screen (wireframes.md §1; CONTRACT-v2 §C). Self-guided: a short plain-language summary,
// the full consent text (study-protocol.md §4, adapted for self-guided sessions) behind a
// "Read full consent details" disclosure, an 18+ checkbox and Continue. [PLACEHOLDER] markers stay
// visible until the team fills them in. "I do not agree" shows a thank-you and records nothing.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useStudy } from "../state/StudyContext";
import { useLogger } from "../logging/logger";

export default function ConsentScreen() {
  const { session, advance } = useStudy();
  const logger = useLogger();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (declined) {
    return (
      <main className="screen consent-screen consent-declined">
        <h1>Thank you</h1>
        <p>You have chosen not to take part. None of your answers have been recorded.</p>
        <p>You can simply close this page.</p>
      </main>
    );
  }

  async function onContinue() {
    if (!session || !checked || busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.consent(session.sessionId);
      logger?.log({
        trialId: null, blockIndex: null, condition: null, postId: null,
        type: "consent_given", factorKey: null, tMs: null,
      });
      await advance({ blockIndex: 1, positionInBlock: 1, phase: "instructions" });
      navigate("/instructions");
    } catch {
      setError("Something went wrong saving your answer. Please check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <main className="screen consent-screen">
      <h1>Before you start</h1>
      <p className="consent-lead">How people use AI labels on social media posts</p>
      <ul className="consent-summary">
        <li>
          <strong>What you'll do:</strong> read 24 short posts about a made-up town, decide whether
          you agree with an AI tool's label on each one, and answer a few short questionnaires.
        </li>
        <li>
          <strong>Time:</strong> about 15–20 minutes.
        </li>
        <li>
          <strong>Voluntary:</strong> taking part is your choice, and you can stop at any time by
          closing the page.
        </li>
        <li>
          <strong>Anonymous:</strong> we don't record your name. Only a scrambled version of your
          participation code is kept, so the same person can't take part twice.
        </li>
        <li>
          <strong>Questions?</strong> Email [PLACEHOLDER: researcher contact email].
        </li>
      </ul>

      <details className="consent-details">
        <summary>Read full consent details</summary>
        <div className="consent-full">
          <h2>Consent to take part in a research study</h2>
          <p>
            <strong>Study:</strong> How people use AI labels on social media posts
            <br />
            <strong>Study team:</strong> CEN5728 Group 4, [PLACEHOLDER: institution]. Supervisor:
            {" "}[PLACEHOLDER: instructor name].
            <br />
            <strong>Approval:</strong> [PLACEHOLDER: IRB/ethics approval number]
          </p>
          <p>
            We are studying how people use an AI tool that labels social media posts. You will read
            24 short posts about a made-up town. Each post has a label from the AI tool, and you
            decide whether you agree with it. You will also answer short questionnaires, including
            how tense or frustrated you felt. The study takes about 15–20 minutes, and you do it on
            your own, at your own pace.
          </p>
          <p>
            All posts, people and places are fictional, and some posts contain claims that are not
            true. The risks are no greater than normal social media use. Some parts of the study
            will be explained to you fully at the end.
          </p>
          <p>
            We do not record your name. The participation code you typed is never stored; we keep
            only a scrambled version of it, so the same person can't take part twice. Your answers
            are stored under a number only and will be reported as group results. Please do not
            type personal details in the comment box.
          </p>
          <p>
            Taking part is voluntary. You can stop at any time without giving a reason, simply by
            closing the page, and you can ask us to delete your answers, now or later, without any
            penalty.
          </p>
          <p>
            Questions: [PLACEHOLDER: researcher contact email]. Concerns about your rights:
            {" "}[PLACEHOLDER: IRB office contact].
          </p>
          <p>
            By ticking the box below and clicking Continue, you confirm that you are 18 or older and
            agree to take part.
          </p>
        </div>
      </details>

      <label className="consent-check">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />{" "}
        I am 18 or older and I agree to take part
      </label>

      {error && <p role="alert" className="error">{error}</p>}

      <div className="button-row">
        <button
          type="button"
          className="primary"
          disabled={!checked || !session || busy}
          onClick={onContinue}
        >
          Continue
        </button>
        <button type="button" className="secondary" onClick={() => setDeclined(true)} disabled={busy}>
          I do not agree
        </button>
      </div>
    </main>
  );
}
