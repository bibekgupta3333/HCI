import { describe, it, expect, beforeEach } from "vitest";
import type Database from "better-sqlite3";
import { toCsv } from "./csv";
import {
  trialsCsv, surveysCsv, eventsCsv, exitCsv, sessionsJson,
  TRIAL_COLUMNS, SURVEY_COLUMNS, EVENT_COLUMNS, EXIT_COLUMNS,
} from "./exporters";
import { openDb } from "../db/db";
import { createSession, insertTrial, insertEvents, insertBlockSurvey, insertExitSurvey } from "../db/repo";
import type { Assignment, EventSubmission } from "../../shared/api";
import type { Trial, BlockSurvey, ExitSurvey, Likert7 } from "../../shared/types";

// ---------- toCsv ----------
describe("toCsv", () => {
  it("emits only the header (with CRLF) for empty rows", () => {
    expect(toCsv([], ["a", "b", "c"])).toBe("a,b,c\r\n");
  });

  it("uses CRLF line endings and column order, ignoring extra keys", () => {
    const out = toCsv([{ b: 2, a: 1, extra: "x" }, { a: 3, b: 4 }], ["a", "b"]);
    expect(out).toBe("a,b\r\n1,2\r\n3,4\r\n");
  });

  it("writes booleans as TRUE/FALSE", () => {
    expect(toCsv([{ x: true, y: false }], ["x", "y"])).toBe("x,y\r\nTRUE,FALSE\r\n");
  });

  it("writes null, undefined and missing as empty", () => {
    expect(toCsv([{ a: null, b: undefined }], ["a", "b", "c"])).toBe("a,b,c\r\n,,\r\n");
  });

  it("writes numbers as-is, including 0 and decimals", () => {
    expect(toCsv([{ a: 0, b: 9312.4, c: -1 }], ["a", "b", "c"])).toBe("a,b,c\r\n0,9312.4,-1\r\n");
  });

  it("pipe-joins arrays, empty array -> empty", () => {
    const out = toCsv([{ f: ["claimVsRecord", "source"], g: [] }], ["f", "g"]);
    expect(out).toBe("f,g\r\nclaimVsRecord|source,\r\n");
  });

  it("quotes fields containing commas", () => {
    expect(toCsv([{ c: "a,b" }], ["c"])).toBe('c\r\n"a,b"\r\n');
  });

  it("quotes and doubles embedded quotes", () => {
    expect(toCsv([{ c: 'say "hi"' }], ["c"])).toBe('c\r\n"say ""hi"""\r\n');
  });

  it("quotes fields containing LF or CR", () => {
    expect(toCsv([{ c: "line1\nline2", d: "x\ry" }], ["c", "d"])).toBe('c,d\r\n"line1\nline2","x\ry"\r\n');
  });

  it("does not quote plain strings or strings with spaces", () => {
    expect(toCsv([{ c: "hello world" }], ["c"])).toBe("c\r\nhello world\r\n");
  });

  it("quotes header cells that need it", () => {
    expect(toCsv([], ["a,b"])).toBe('"a,b"\r\n');
  });

  it("empty string stays empty", () => {
    expect(toCsv([{ c: "" }], ["c"])).toBe("c\r\n\r\n");
  });
});

// ---------- exporters (seeded through repo) ----------
function parseCsv(text: string): string[][] {
  // minimal RFC 4180 parser for assertions
  const rows: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\r" && text[i + 1] === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; i++; }
    else cell += ch;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function records(csv: string): Record<string, string>[] {
  const [header, ...body] = parseCsv(csv);
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

const assignment: Assignment = {
  pid: 7,
  conditionOrder: ["C", "D", "B", "A"],
  setRotation: 1,
  seed: 7,
  blocks: [
    { blockIndex: 1, condition: "C", set: "S2", postOrder: ["p07", "p08", "p09", "p10", "p11", "p12"] },
    { blockIndex: 2, condition: "D", set: "S3", postOrder: ["p13", "p14", "p15", "p16", "p17", "p18"] },
    { blockIndex: 3, condition: "B", set: "S4", postOrder: ["p19", "p20", "p21", "p22", "p23", "p24"] },
    { blockIndex: 4, condition: "A", set: "S1", postOrder: ["p01", "p02", "p03", "p04", "p05", "p06"] },
  ],
};

function trial(over: Partial<Trial> = {}): Trial {
  return {
    trialId: "7-1-1", blockIndex: 1, positionInBlock: 1, trialIndex: 1, postId: "p07",
    condition: "C", set: "S2", topic: "env", aiLabel: "accurate", groundTruth: "FALSE",
    isAiCorrect: false, errorType: "miss", difficulty: "subtle", agreed: false, detectedError: true,
    confidence: 6, labelShownAt: "2026-11-03T14:12:05.120Z", respondedAt: "2026-11-03T14:12:14.433Z",
    decisionTimeMs: 9312.4, decisionTimeRawMs: 9312.4, hiddenMs: 0, hiddenCount: 0, blurCount: 0,
    timingFlag: false, factSheetOpened: true, factSheetOpenMs: 1200, explanationOpened: true,
    factorsExpanded: ["claimVsRecord", "source"], timeToFirstExpandMs: 2100, resumed: false,
    ...over,
  };
}

const scored = (raw: number[]) => raw.map((r, i) => (i < 5 ? 8 - r : r));

function survey(blockIndex: 1 | 2 | 3 | 4, condition: "A" | "B" | "C" | "D"): BlockSurvey {
  const raw = [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5];
  const sc = scored(raw);
  return {
    blockIndex, condition,
    trustResponses: raw.map((r, i) => ({ itemId: `jian-${String(i + 1).padStart(2, "0")}`, raw: r as Likert7, scored: sc[i] as Likert7 })),
    trustMean: sc.reduce((a, b) => a + b, 0) / 12,
    fairness1: 5, fairness2: 6, fairnessMean: 5.5, tension: 3, frustrationTlx: 35, frustrationTlxTouched: true,
    nWrongDetected: 1, anxiety: null, submittedAt: "2026-11-03T14:20:00.000Z",
  };
}

const exit: ExitSurvey = {
  ageRange: "18-24", gender: null, education: "bachelors", socialMediaUse: "daily", labelExposure: "sometimes",
  preferredCondition: "C", comment: 'Liked the "Why?" button, mostly\nthanks', submittedAt: "2026-11-03T14:40:00.000Z",
};

function event(seq: number, over: Partial<EventSubmission> = {}): EventSubmission {
  return {
    seq, trialId: "7-1-1", blockIndex: 1, condition: "C", postId: "p07", type: "factor_expand",
    factorKey: "claimVsRecord", tMs: 2100.5, perfNow: 50000.25, wallClock: "2026-11-03T14:12:07.220Z", ...over,
  };
}

describe("exporters", () => {
  let db: Database.Database;
  let sessionId: string;

  beforeEach(() => {
    db = openDb(":memory:");
    const s = createSession(db, assignment, { consequenceBanner: false, anxiety: false, postBankHash: "abc", appVersion: "0.1.0" });
    sessionId = s.sessionId;
  });

  it("empty DB -> header-only CSVs and [] JSON", () => {
    const fresh = openDb(":memory:");
    expect(trialsCsv(fresh)).toBe(TRIAL_COLUMNS.join(",") + "\r\n");
    expect(surveysCsv(fresh)).toBe(SURVEY_COLUMNS.join(",") + "\r\n");
    expect(eventsCsv(fresh)).toBe(EVENT_COLUMNS.join(",") + "\r\n");
    expect(exitCsv(fresh)).toBe(EXIT_COLUMNS.join(",") + "\r\n");
    expect(JSON.parse(sessionsJson(fresh))).toEqual([]);
  });

  it("column lists match CONTRACT.md exactly", () => {
    expect(TRIAL_COLUMNS).toHaveLength(35);
    expect(TRIAL_COLUMNS.slice(0, 3)).toEqual(["pid", "sessionId", "trialId"]);
    expect(TRIAL_COLUMNS.slice(-3)).toEqual(["conditionOrder", "setRotation", "status"]);
    expect(SURVEY_COLUMNS).toHaveLength(4 + 24 + 9);
    expect(SURVEY_COLUMNS[4]).toBe("trust_01");
    expect(SURVEY_COLUMNS[27]).toBe("trust_12_s");
    expect(EVENT_COLUMNS).toHaveLength(12);
    expect(EXIT_COLUMNS).toHaveLength(10);
  });

  it("trials.csv: one row per trial with session fields and CSV encodings", () => {
    insertTrial(db, sessionId, trial());
    insertTrial(db, sessionId, trial({
      trialId: "7-1-2", positionInBlock: 2, trialIndex: 2, postId: "p08", groundTruth: "TRUE", aiLabel: "accurate",
      isAiCorrect: true, errorType: null, difficulty: null, agreed: true, detectedError: null,
      explanationOpened: null, factorsExpanded: [], timeToFirstExpandMs: null,
    }));
    const csv = trialsCsv(db);
    expect(csv.split("\r\n")[0]).toBe(TRIAL_COLUMNS.join(","));
    const [a, b] = records(csv);
    expect(a).toMatchObject({
      pid: "7", sessionId, trialId: "7-1-1", blockIndex: "1", positionInBlock: "1", trialIndex: "1",
      condition: "C", set: "S2", postId: "p07", topic: "env", aiLabel: "accurate", groundTruth: "FALSE",
      isAiCorrect: "FALSE", errorType: "miss", difficulty: "subtle", agreed: "FALSE", detectedError: "TRUE",
      confidence: "6", decisionTimeMs: "9312.4", timingFlag: "FALSE", factSheetOpened: "TRUE",
      factSheetOpenMs: "1200", explanationOpened: "TRUE", factorsExpanded: "claimVsRecord|source",
      timeToFirstExpandMs: "2100", resumed: "FALSE", labelShownAt: "2026-11-03T14:12:05.120Z",
      conditionOrder: "CDBA", setRotation: "1", status: "in_progress",
    });
    expect(b).toMatchObject({
      trialId: "7-1-2", isAiCorrect: "TRUE", errorType: "", difficulty: "", agreed: "TRUE", detectedError: "",
      explanationOpened: "", factorsExpanded: "", timeToFirstExpandMs: "",
    });
  });

  it("surveys.csv: raw and scored trust columns, means, booleans", () => {
    insertTrial(db, sessionId, trial());
    insertBlockSurvey(db, sessionId, survey(1, "C"));
    const [r] = records(surveysCsv(db));
    expect(r.pid).toBe("7");
    expect(r.sessionId).toBe(sessionId);
    expect(r.blockIndex).toBe("1");
    expect(r.condition).toBe("C");
    expect(r.trust_01).toBe("1");
    expect(r.trust_01_s).toBe("7");
    expect(r.trust_05_s).toBe("3");
    expect(r.trust_06).toBe("6");
    expect(r.trust_06_s).toBe("6");
    expect(r.trust_12).toBe("5");
    expect(Number(r.trustMean)).toBeCloseTo(survey(1, "C").trustMean);
    expect(r).toMatchObject({
      fairness1: "5", fairness2: "6", fairnessMean: "5.5", tension: "3", frustrationTlx: "35",
      frustrationTlxTouched: "TRUE", nWrongDetected: "1", submittedAt: "2026-11-03T14:20:00.000Z",
    });
  });

  it("events.csv: ordered by seq, nulls empty, numbers as-is", () => {
    insertEvents(db, sessionId, [
      event(2),
      event(1, { type: "session_start", trialId: null, blockIndex: null, condition: null, postId: null, factorKey: null, tMs: null }),
    ]);
    const rows = records(eventsCsv(db));
    expect(rows.map((r) => r.seq)).toEqual(["1", "2"]);
    expect(rows[0]).toMatchObject({ pid: "7", sessionId, type: "session_start", trialId: "", factorKey: "", tMs: "" });
    expect(rows[1]).toMatchObject({
      trialId: "7-1-1", blockIndex: "1", condition: "C", postId: "p07", type: "factor_expand",
      factorKey: "claimVsRecord", tMs: "2100.5", perfNow: "50000.25", wallClock: "2026-11-03T14:12:07.220Z",
    });
  });

  it("exit.csv: quoted comment round-trips, null gender empty", () => {
    insertExitSurvey(db, sessionId, exit);
    const csv = exitCsv(db);
    expect(csv).toContain('"Liked the ""Why?"" button, mostly\nthanks"');
    const [r] = records(csv);
    expect(r).toMatchObject({
      pid: "7", sessionId, ageRange: "18-24", gender: "", education: "bachelors", socialMediaUse: "daily",
      labelExposure: "sometimes", preferredCondition: "C", comment: exit.comment, submittedAt: exit.submittedAt,
    });
  });

  it("sessions.json: array of full sessions", () => {
    insertTrial(db, sessionId, trial());
    insertEvents(db, sessionId, [event(1)]);
    insertExitSurvey(db, sessionId, exit);
    const parsed = JSON.parse(sessionsJson(db));
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(1);
    const text = JSON.stringify(parsed[0]);
    expect(text).toContain(sessionId);
    expect(text).toContain("7-1-1");
    expect(text).toContain("factor_expand");
  });
});
