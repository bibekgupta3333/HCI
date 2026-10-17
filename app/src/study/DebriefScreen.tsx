// Debrief (wireframes.md §12; content from study-protocol.md §11, self-guided per CONTRACT-v2 §C). Lists the real facts for all 8
// wrong-label posts, whichever ones this participant saw. The facts are copied verbatim from the
// "Debrief fact" lines in docs/stimuli.md; the client never imports posts.json.
// Browser storage is already wiped by the exit survey; the pid comes from the in-memory session.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearParticipantStorage, useStudy } from "../state/StudyContext";

export interface DebriefFact {
  postId: string;
  claim: string;      // what the post said (study-protocol.md §11.2)
  verdict: "TRUE" | "FALSE";
  fact: string;       // stimuli.md "Debrief fact", verbatim
}

export const DEBRIEF_FACTS: readonly DebriefFact[] = [
  { postId: "p03", claim: "Riverside Fair runs June 6–8 at Mill Park", verdict: "TRUE",
    fact: "The fair does run June 6–8 at Mill Park, so this post was accurate." },
  { postId: "p09", claim: "Farmers market opens May 3 at Depot Square", verdict: "TRUE",
    fact: "The market does open May 3 at Depot Square, so this post was accurate." },
  { postId: "p15", claim: "Tap water met all 12 safety limits in March", verdict: "TRUE",
    fact: "The March report confirms all 12 tap-water tests were within safety limits, so this post was accurate." },
  { postId: "p21", claim: "Pool opening delayed to June 14 for repairs", verdict: "TRUE",
    fact: "The pool does open June 14 after repairs, so this post was accurate." },
  { postId: "p04", claim: "Lake Alder hit a record low this spring", verdict: "FALSE",
    fact: "Lake Alder was at its lowest since 2019, not a record low; the record was set in 2012." },
  { postId: "p10", claim: "Downtown parking now costs $4 an hour", verdict: "FALSE",
    fact: "Downtown parking is still $2 an hour; there is no $4 rate." },
  { postId: "p16", claim: "Mill Park concert moved to August 20", verdict: "FALSE",
    fact: "The concert is still on August 13; it has not moved to August 20." },
  { postId: "p22", claim: "City banned gas leaf blowers from this fall", verdict: "FALSE",
    fact: "Gas leaf blowers are not banned; the ban is only proposed, with a council vote in November." },
];

export default function DebriefScreen() {
  const { session, dispatch } = useStudy();
  const navigate = useNavigate();
  const [showFacts, setShowFacts] = useState(false);
  const pid = session?.pid ?? null;

  useEffect(() => {
    clearParticipantStorage(); // safety net; idempotent
  }, []);

  function onNextParticipant() {
    clearParticipantStorage();
    dispatch({ type: "RESET" });
    navigate("/", { replace: true });
  }

  return (
    <main className="screen debrief-screen">
      <h1>Thank you!</h1>
      <p className="debrief-lead">That's the end of the study. Here is what it was really about.</p>
      <ul className="debrief-points">
        <li>
          <strong>None of these posts were real.</strong> Riverton, Alder County, the people, the
          accounts and the agencies were all made up by our team. Some posts made claims that were
          not true, and they are not true anywhere.
        </li>
        <li>
          <strong>The AI labels were scripted.</strong> The AI tool was not a real AI. Every label
          and every reason it gave was written in advance by our study team.
        </li>
        <li>
          <strong>8 of the 24 labels were deliberately wrong.</strong> There were two kinds of
          mistake. A <strong>false alarm</strong> is when a true post is labeled "Likely
          misleading" (4 posts). A <strong>miss</strong> is when a false post is labeled "Likely
          accurate" (4 posts). We wanted to see whether people notice each kind, and whether the
          way the AI explains itself makes a difference. That's why the screen looked a little
          different in each of the four parts.
        </li>
        <li>
          Agreeing with some of the wrong labels is very common and has been found in many
          studies, especially when a label says a post is accurate. It says nothing bad about you;
          it's exactly what we're studying.
        </li>
        <li>
          We didn't tell you this at the start because knowing that mistakes were planted would
          have changed how you read every post, and we wouldn't have been able to measure what we
          set out to measure. We're sorry for not telling you beforehand.
        </li>
      </ul>

      <button
        type="button"
        className="disclosure"
        aria-expanded={showFacts}
        aria-controls="debrief-facts"
        onClick={() => setShowFacts((v) => !v)}
      >
        Show the real facts {showFacts ? "▴" : "▾"}
      </button>
      {showFacts && (
        <section id="debrief-facts" className="debrief-facts" aria-label="The real facts">
          <ul>
            {DEBRIEF_FACTS.map((f) => (
              <li key={f.postId} data-post-id={f.postId}>
                <strong>{f.claim}</strong>
                <br />→ {f.verdict}. {f.fact}
              </li>
            ))}
          </ul>
          <p>None of these posts were real. Riverton and everything in it is fictional.</p>
        </section>
      )}

      <h2>Please keep it to yourself</h2>
      <p>
        Please <strong>don't tell anyone else that some labels were wrong</strong> until the study
        is finished, because people who know in advance would behave differently and that would
        spoil our results.
      </p>

      <h2>Your data</h2>
      <p>
        Now that you know the real purpose, you can still ask us to delete your answers, without
        any penalty. To withdraw, email [PLACEHOLDER: researcher contact email] before
        {" "}[PLACEHOLDER: withdrawal deadline], quoting your participant number
        {pid !== null ? <>: <strong className="debrief-pid">{pid}</strong></> : null}.
        {pid !== null && " You may want to note it down now."}
      </p>
      <p>Concerns about your rights: [PLACEHOLDER: IRB office contact].</p>

      <p className="debrief-close">
        <strong>You can close this page now.</strong>
      </p>
      <div className="button-row">
        <button type="button" className="btn btn--link debrief-next" onClick={onNextParticipant}>
          Next participant
        </button>
      </div>
    </main>
  );
}
