// KPI computation for GET /api/admin/kpis (CONTRACT-v2 §B). Pure SQL + TypeScript over the study DB.
// Rules: pilot pids >= 900 are excluded everywhere; condition / error-type KPIs use completed sessions only;
// rates are 0–1 numbers, or null when the denominator is 0.
import type Database from "better-sqlite3";
import type { Condition } from "../shared/types";
import { WILLIAMS } from "../shared/counterbalance";

import type { Kpis } from "../shared/api";

export type { Kpis };

export const TARGET_N = 32;
export const TARGET_MINIMUM = 16;
export const PILOT_PID_MIN = 900;

const CONDITIONS: readonly Condition[] = ["A", "B", "C", "D"];
const ERROR_TYPES = ["false_alarm", "miss"] as const;

/** Median of a list (mean of the two middle values for even n); null for an empty list. */
export function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Percentile by linear interpolation between closest ranks (p in 0–100); null for an empty list. */
export function percentile(values: readonly number[], p: number): number | null {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const rank = (p / 100) * (s.length - 1);
  const lo = Math.floor(rank);
  const hi = Math.ceil(rank);
  return s[lo] + (s[hi] - s[lo]) * (rank - lo);
}

export function mean(values: readonly number[]): number | null {
  return values.length === 0 ? null : values.reduce((a, b) => a + b, 0) / values.length;
}

/** num / den, or null when den is 0. */
export function rate(num: number, den: number): number | null {
  return den === 0 ? null : num / den;
}

interface TrialRow {
  condition: Condition;
  is_ai_correct: number;
  error_type: string | null;
  agreed: number;
  detected_error: number | null;
  confidence: number;
  decision_time_ms: number;
  fact_sheet_opened: number;
}
interface SurveyRow {
  condition: Condition;
  trust_mean: number;
  fairness_mean: number;
  tension: number;
  frustration_tlx: number;
}

const COMPLETED_SESSIONS = `SELECT session_id FROM sessions WHERE status = 'completed' AND pid < ${PILOT_PID_MIN}`;

export function computeKpis(db: Database.Database, now: Date = new Date()): Kpis {
  // ---- sessions
  const counts = db
    .prepare(`SELECT status, COUNT(*) AS n FROM sessions WHERE pid < ? GROUP BY status`)
    .all(PILOT_PID_MIN) as { status: string; n: number }[];
  const byStatus = (s: string) => counts.find((c) => c.status === s)?.n ?? 0;
  const inProgress = byStatus("in_progress");
  const completed = byStatus("completed");
  const abandoned = byStatus("abandoned");
  const started = inProgress + completed + abandoned;

  // ---- target / cycles (distinct pids, so a re-run pid is not double counted)
  const cyc = db
    .prepare(
      `SELECT COUNT(DISTINCT CASE WHEN pid BETWEEN 1 AND 16 THEN pid END) AS c1,
              COUNT(DISTINCT CASE WHEN pid BETWEEN 17 AND 32 THEN pid END) AS c2
         FROM sessions WHERE status = 'completed' AND pid < ?`,
    )
    .get(PILOT_PID_MIN) as { c1: number; c2: number };

  // ---- durations (completed only)
  const times = db
    .prepare(`SELECT started_at, completed_at FROM sessions WHERE status = 'completed' AND pid < ? AND completed_at IS NOT NULL`)
    .all(PILOT_PID_MIN) as { started_at: string; completed_at: string }[];
  const durations = times
    .map((t) => (Date.parse(t.completed_at) - Date.parse(t.started_at)) / 60000)
    .filter((d) => Number.isFinite(d) && d >= 0);

  // ---- per condition (completed sessions only)
  const trials = db
    .prepare(
      `SELECT condition, is_ai_correct, error_type, agreed, detected_error, confidence, decision_time_ms, fact_sheet_opened
         FROM trials WHERE session_id IN (${COMPLETED_SESSIONS})`,
    )
    .all() as TrialRow[];
  const surveys = db
    .prepare(
      `SELECT condition, trust_mean, fairness_mean, tension, frustration_tlx
         FROM block_surveys WHERE session_id IN (${COMPLETED_SESSIONS})`,
    )
    .all() as SurveyRow[];

  const detection = (rows: TrialRow[]) => {
    const wrong = rows.filter((t) => t.is_ai_correct === 0);
    return { n: wrong.length, rate: rate(wrong.filter((t) => t.detected_error === 1).length, wrong.length) };
  };

  const byCondition = CONDITIONS.map((condition) => {
    const ts = trials.filter((t) => t.condition === condition);
    const ss = surveys.filter((s) => s.condition === condition);
    const wrong = detection(ts);
    return {
      condition,
      trials: ts.length,
      agreementRate: rate(ts.filter((t) => t.agreed === 1).length, ts.length),
      wrongTrials: wrong.n,
      detectionRate: wrong.rate,
      falseAlarmDetection: detection(ts.filter((t) => t.error_type === "false_alarm")).rate,
      missDetection: detection(ts.filter((t) => t.error_type === "miss")).rate,
      factSheetOpenRate: rate(ts.filter((t) => t.fact_sheet_opened === 1).length, ts.length),
      meanConfidence: mean(ts.map((t) => t.confidence)),
      medianDecisionMs: median(ts.map((t) => t.decision_time_ms)),
      trustMean: mean(ss.map((s) => s.trust_mean)),
      fairnessMean: mean(ss.map((s) => s.fairness_mean)),
      tensionMean: mean(ss.map((s) => s.tension)),
      frustrationMean: mean(ss.map((s) => s.frustration_tlx)),
    };
  });

  const byErrorType = ERROR_TYPES.map((errorType) => {
    const d = detection(trials.filter((t) => t.error_type === errorType));
    return { errorType, n: d.n, detectionRate: d.rate };
  });

  // ---- balance: always the four Williams orders, plus any unexpected order present in the data
  const orderRows = db
    .prepare(`SELECT condition_order AS o, COUNT(*) AS n FROM sessions WHERE status = 'completed' AND pid < ? GROUP BY condition_order`)
    .all(PILOT_PID_MIN) as { o: string; n: number }[];
  const orders: string[] = [...WILLIAMS];
  for (const r of orderRows) if (!orders.includes(r.o)) orders.push(r.o);
  const balance = orders.map((conditionOrder) => ({
    conditionOrder,
    completed: orderRows.find((r) => r.o === conditionOrder)?.n ?? 0,
  }));

  // ---- completed per day (UTC date of completed_at)
  const dailyCompleted = (
    db
      .prepare(
        `SELECT substr(completed_at, 1, 10) AS date, COUNT(*) AS n FROM sessions
          WHERE status = 'completed' AND pid < ? AND completed_at IS NOT NULL
          GROUP BY date ORDER BY date`,
      )
      .all(PILOT_PID_MIN) as { date: string; n: number }[]
  ).map((r) => ({ date: r.date, n: r.n }));

  return {
    generatedAt: now.toISOString(),
    sessions: {
      started,
      inProgress,
      completed,
      abandoned,
      // Of the sessions that have ended (completed or abandoned), the share that completed.
      completionRate: rate(completed, completed + abandoned),
    },
    target: {
      n: TARGET_N,
      minimum: TARGET_MINIMUM,
      completed,
      cycle1Completed: cyc.c1,
      cycle2Completed: cyc.c2,
    },
    durationMin: { median: median(durations), p90: percentile(durations, 90) },
    byCondition,
    byErrorType,
    balance,
    dailyCompleted,
  };
}
