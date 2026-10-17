// Welcome (route "/"): self-start with a participation code, continue an active session,
// or a thank-you message once this browser has finished the study (CONTRACT-v2 §A, §C).
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { ApiClientError } from "../api/client";
import {
  AlreadyParticipatedError, getStoredSessionId, hasParticipated, routeForCursor, setStoredSessionId, useStudy,
} from "../state/StudyContext";

const CODE_MIN = 3;
const CODE_MAX = 120;
const ALREADY_MSG = "You've already taken part in this study — thank you!";
const INVALID_MSG = `Please enter a code between ${CODE_MIN} and ${CODE_MAX} characters.`;

export default function WelcomeScreen(): JSX.Element {
  const { session, startSession, resume } = useStudy();
  const [participated] = useState(hasParticipated);
  const [activeId, setActiveId] = useState<string | null>(getStoredSessionId);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (session && session.status === "in_progress") return <Navigate to={routeForCursor(session.cursor)} replace />;

  if (participated) {
    return (
      <main className="screen screen-welcome">
        <h1>Post Review Study</h1>
        <p className="welcome__thanks" role="status">{ALREADY_MSG}</p>
      </main>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    const trimmed = code.trim();
    if (trimmed.length < CODE_MIN || trimmed.length > CODE_MAX) {
      setError(INVALID_MSG);
      return;
    }
    setSending(true);
    setError(null);
    try {
      await startSession(trimmed);
      // startSession navigates to the session's current screen.
    } catch (err) {
      if (err instanceof AlreadyParticipatedError) setError(ALREADY_MSG);
      else if (err instanceof ApiClientError && err.status === 400) setError(INVALID_MSG);
      else setError("Something went wrong starting the study. Please check your connection and try again.");
      setSending(false);
    }
  }

  async function onContinue() {
    setSending(true);
    setError(null);
    const ok = await resume();
    if (!ok) {
      setActiveId(getStoredSessionId());
      setError("We couldn't find your previous session. Please enter your code to continue.");
    }
    setSending(false);
  }

  function onStartOver() {
    setStoredSessionId(null);
    setActiveId(null);
    setError(null);
  }

  return (
    <main className="screen screen-welcome">
      <h1>Post Review Study</h1>
      <p className="welcome__intro">
        You'll judge 24 short made-up social media posts, each shown with an AI accuracy label.
        <br />
        It takes about 15–20 minutes.
      </p>

      {activeId ? (
        <div className="welcome__continue">
          <button type="button" className="btn btn--primary" onClick={onContinue} disabled={sending} autoFocus>
            {sending ? "Loading…" : "Continue where you left off"}
          </button>
          <p>
            <button type="button" className="btn btn--link welcome__start-over" onClick={onStartOver} disabled={sending}>
              Start over with a different code
            </button>
          </p>
        </div>
      ) : (
        <form className="welcome__form" onSubmit={onSubmit} noValidate>
          <div className="field" aria-invalid={error === INVALID_MSG ? true : undefined}>
            <label htmlFor="participation-code">Your participation code</label>
            <input
              id="participation-code"
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={CODE_MAX}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-describedby="participation-code-hint"
              autoFocus
            />
            <p id="participation-code-hint" className="welcome__hint">
              Use your university email or student ID. It's only used to make sure each person takes part once — we
              store a scrambled version, never the code itself.
            </p>
          </div>
          <button type="submit" className="btn btn--primary" disabled={sending}>
            {sending ? "Starting…" : "Start"}
          </button>
        </form>
      )}

      {error && (
        <p className="error welcome__error" role="alert">
          {error}
        </p>
      )}
    </main>
  );
}
