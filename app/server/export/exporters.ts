// Export builders for /api/admin/export/:name. Column lists are binding (app/CONTRACT.md "CSV columns").
// Rows come from server/db/repo.ts (camelCase). Session-level fields (pid, conditionOrder, setRotation,
// status) are filled from the sessions table when a repo row does not carry them, and a few likely
// naming variants are accepted, so the exports do not depend on exactly how repo joins.
// Row order is repo's (pid, session start, block/position or seq).
import type Database from "better-sqlite3";
import { toCsv } from "./csv";
import { allEventRows, allExitRows, allSessionsFull, allSurveyRows, allTrialRows } from "../db/repo";

type Row = Record<string, unknown>;

export const TRIAL_COLUMNS = [
  "pid", "sessionId", "trialId", "blockIndex", "positionInBlock", "trialIndex", "condition", "set", "postId",
  "topic", "aiLabel", "groundTruth", "isAiCorrect", "errorType", "difficulty", "agreed", "detectedError",
  "confidence", "decisionTimeMs", "decisionTimeRawMs", "hiddenMs", "hiddenCount", "blurCount", "timingFlag",
  "factSheetOpened", "factSheetOpenMs", "explanationOpened", "factorsExpanded", "timeToFirstExpandMs",
  "resumed", "labelShownAt", "respondedAt", "conditionOrder", "setRotation", "status",
];

const pad2 = (n: number) => String(n).padStart(2, "0");
const TRUST_RAW = Array.from({ length: 12 }, (_, i) => `trust_${pad2(i + 1)}`);
const TRUST_SCORED = TRUST_RAW.map((c) => `${c}_s`);

export const SURVEY_COLUMNS = [
  "pid", "sessionId", "blockIndex", "condition", ...TRUST_RAW, ...TRUST_SCORED, "trustMean",
  "fairness1", "fairness2", "fairnessMean", "tension", "frustrationTlx", "frustrationTlxTouched",
  "nWrongDetected", "submittedAt",
];

export const EVENT_COLUMNS = [
  "pid", "sessionId", "seq", "trialId", "blockIndex", "condition", "postId", "type", "factorKey", "tMs",
  "perfNow", "wallClock",
];

export const EXIT_COLUMNS = [
  "pid", "sessionId", "ageRange", "gender", "education", "socialMediaUse", "labelExposure",
  "preferredCondition", "comment", "submittedAt",
];

const TRIAL_BOOLEANS = ["isAiCorrect", "agreed", "detectedError", "timingFlag", "factSheetOpened", "explanationOpened", "resumed"];

interface SessionMeta { pid: number; conditionOrder: string; setRotation: number; status: string }

function sessionMeta(db: Database.Database): Map<string, SessionMeta> {
  const rows = db
    .prepare("SELECT session_id, pid, condition_order, set_rotation, status FROM sessions")
    .all() as { session_id: string; pid: number; condition_order: string; set_rotation: number; status: string }[];
  return new Map(rows.map((r) => [r.session_id, {
    pid: r.pid, conditionOrder: r.condition_order, setRotation: r.set_rotation, status: r.status,
  }]));
}

/** First defined (non-undefined) value among the given keys. */
function pick(row: Row, ...keys: string[]): unknown {
  for (const k of keys) if (row[k] !== undefined) return row[k];
  return undefined;
}

/** 0/1 (SQLite) -> boolean; null stays null. */
function toBool(v: unknown): unknown {
  if (v === 0 || v === "0") return false;
  if (v === 1 || v === "1") return true;
  return v;
}

/** JSON-string arrays (e.g. trust_raw) -> arrays. */
function toArray(v: unknown): unknown[] | undefined {
  if (Array.isArray(v)) return v;
  if (typeof v === "string" && v.trim().startsWith("[")) {
    try { const p = JSON.parse(v); return Array.isArray(p) ? p : undefined; } catch { return undefined; }
  }
  return undefined;
}

function orderString(v: unknown): unknown {
  return Array.isArray(v) ? v.join("") : v;
}

function withSession(row: Row, meta: Map<string, SessionMeta>): Row {
  const sessionId = pick(row, "sessionId", "session_id") as string | undefined;
  const m = sessionId ? meta.get(sessionId) : undefined;
  return {
    ...row,
    sessionId,
    pid: pick(row, "pid") ?? m?.pid,
    conditionOrder: orderString(pick(row, "conditionOrder") ?? m?.conditionOrder),
    setRotation: pick(row, "setRotation") ?? m?.setRotation,
    status: pick(row, "status", "sessionStatus") ?? m?.status,
  };
}

export function trialRows(db: Database.Database): Row[] {
  const meta = sessionMeta(db);
  return allTrialRows(db).map((r) => {
    const row = withSession(r, meta);
    row.set = pick(r, "set", "setId");
    for (const k of TRIAL_BOOLEANS) row[k] = toBool(row[k]);
    const fe = row.factorsExpanded;
    row.factorsExpanded = toArray(fe) ?? (fe ?? "");
    return row;
  });
}

export function surveyRows(db: Database.Database): Row[] {
  const meta = sessionMeta(db);
  return allSurveyRows(db).map((r) => {
    const row = withSession(r, meta);
    const responses = toArray(r.trustResponses) as { raw?: unknown; scored?: unknown }[] | undefined;
    const raw = toArray(r.trustRaw) ?? responses?.map((x) => x?.raw);
    const scored = toArray(r.trustScored) ?? responses?.map((x) => x?.scored);
    TRUST_RAW.forEach((c, i) => { if (row[c] === undefined) row[c] = raw?.[i]; });
    TRUST_SCORED.forEach((c, i) => { if (row[c] === undefined) row[c] = scored?.[i]; });
    row.fairness1 = pick(r, "fairness1", "fairness_1");
    row.fairness2 = pick(r, "fairness2", "fairness_2");
    row.frustrationTlxTouched = toBool(row.frustrationTlxTouched);
    return row;
  });
}

export function eventRows(db: Database.Database): Row[] {
  const meta = sessionMeta(db);
  return allEventRows(db).map((r) => withSession(r, meta));
}

export function exitRows(db: Database.Database): Row[] {
  const meta = sessionMeta(db);
  return allExitRows(db).map((r) => withSession(r, meta));
}

export function trialsCsv(db: Database.Database): string { return toCsv(trialRows(db), TRIAL_COLUMNS); }
export function surveysCsv(db: Database.Database): string { return toCsv(surveyRows(db), SURVEY_COLUMNS); }
export function eventsCsv(db: Database.Database): string { return toCsv(eventRows(db), EVENT_COLUMNS); }
export function exitCsv(db: Database.Database): string { return toCsv(exitRows(db), EXIT_COLUMNS); }

/** Array of full sessions (session + blocks + trials + surveys + exit + events), pretty-printed. */
export function sessionsJson(db: Database.Database): string {
  return JSON.stringify(allSessionsFull(db), null, 2);
}
