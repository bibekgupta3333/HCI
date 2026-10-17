import { describe, it, expect } from "vitest";
import { assign, assignFromBank, WILLIAMS } from "./counterbalance";
import type { SetId, Condition } from "./types";

const SETS: SetId[] = ["S1", "S2", "S3", "S4"];
const CONDS: Condition[] = ["A", "B", "C", "D"];

// Synthetic bank: p01..p24, 6 per set, 2 wrong per set.
const posts = Array.from({ length: 24 }, (_, i) => {
  const n = i + 1;
  const id = `p${String(n).padStart(2, "0")}`;
  const set = SETS[Math.floor(i / 6)];
  const isAiCorrect = !(i % 6 === 1 || i % 6 === 4);
  return { id, set, isAiCorrect };
});
const setPosts = Object.fromEntries(SETS.map((s) => [s, posts.filter((p) => p.set === s).map((p) => p.id)])) as Record<SetId, string[]>;
const wrongIds = new Set(posts.filter((p) => !p.isAiCorrect).map((p) => p.id));

// docs/system-design.md §4.3, copied verbatim: pid -> "cond/set" per block.
const TABLE: Record<number, string[]> = {
  1: ["A/S1", "B/S2", "D/S4", "C/S3"],
  2: ["B/S2", "C/S3", "A/S1", "D/S4"],
  3: ["C/S3", "D/S4", "B/S2", "A/S1"],
  4: ["D/S4", "A/S1", "C/S3", "B/S2"],
  5: ["A/S2", "B/S3", "D/S1", "C/S4"],
  6: ["B/S3", "C/S4", "A/S2", "D/S1"],
  7: ["C/S4", "D/S1", "B/S3", "A/S2"],
  8: ["D/S1", "A/S2", "C/S4", "B/S3"],
  9: ["A/S3", "B/S4", "D/S2", "C/S1"],
  10: ["B/S4", "C/S1", "A/S3", "D/S2"],
  11: ["C/S1", "D/S2", "B/S4", "A/S3"],
  12: ["D/S2", "A/S3", "C/S1", "B/S4"],
  13: ["A/S4", "B/S1", "D/S3", "C/S2"],
  14: ["B/S1", "C/S2", "A/S4", "D/S3"],
  15: ["C/S2", "D/S3", "B/S1", "A/S4"],
  16: ["D/S3", "A/S4", "C/S2", "B/S1"],
};
const ROTATION: Record<number, number> = Object.fromEntries(Array.from({ length: 16 }, (_, i) => [i + 1, Math.floor(i / 4)]));

const cycle = Array.from({ length: 16 }, (_, i) => assign(i + 1, setPosts, wrongIds));

describe("assign", () => {
  it("is deterministic", () => {
    for (const pid of [1, 2, 17, 999]) {
      expect(assign(pid, setPosts, wrongIds)).toEqual(assign(pid, setPosts, wrongIds));
    }
  });

  it("assignFromBank equals assign with derived inputs", () => {
    const shuffled = [...posts].reverse();
    expect(assignFromBank(5, { posts: shuffled })).toEqual(assign(5, setPosts, wrongIds));
  });

  it("reproduces the §4.3 table for pids 1-16", () => {
    for (const a of cycle) {
      expect(a.blocks.map((b) => `${b.condition}/${b.set}`)).toEqual(TABLE[a.pid]);
      expect(a.conditionOrder.join("")).toBe(WILLIAMS[(a.pid - 1) % 4]);
      expect(a.setRotation).toBe(ROTATION[a.pid]);
      expect(a.seed).toBe(a.pid);
      expect(a.blocks.map((b) => b.blockIndex)).toEqual([1, 2, 3, 4]);
    }
  });

  it("pid 17 repeats pid 1's condition/set plan", () => {
    const a = assign(17, setPosts, wrongIds);
    expect(a.blocks.map((b) => `${b.condition}/${b.set}`)).toEqual(TABLE[1]);
  });

  it("balances conditions, sets and condition x set over pids 1-16", () => {
    const condPos = new Map<string, number>(), setPos = new Map<string, number>(), condSet = new Map<string, number>();
    const inc = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);
    for (const a of cycle) a.blocks.forEach((b, i) => {
      inc(condPos, `${b.condition}${i}`); inc(setPos, `${b.set}${i}`); inc(condSet, `${b.condition}${b.set}`);
    });
    for (let i = 0; i < 4; i++) {
      for (const c of CONDS) expect(condPos.get(`${c}${i}`)).toBe(4);
      for (const s of SETS) expect(setPos.get(`${s}${i}`)).toBe(4);
    }
    for (const c of CONDS) for (const s of SETS) expect(condSet.get(`${c}${s}`)).toBe(4);
  });

  it("Williams carry-over: each ordered pair adjacent exactly once across the 4 orders (4x over pids 1-16)", () => {
    const pairs = new Map<string, number>();
    for (const o of WILLIAMS) for (let i = 0; i < 3; i++) pairs.set(o[i] + o[i + 1], (pairs.get(o[i] + o[i + 1]) ?? 0) + 1);
    expect(pairs.size).toBe(12);
    for (const c of CONDS) for (const d of CONDS) if (c !== d) expect(pairs.get(c + d)).toBe(1);
    const cyc = new Map<string, number>();
    for (const a of cycle) for (let i = 0; i < 3; i++) {
      const k = a.conditionOrder[i] + a.conditionOrder[i + 1];
      cyc.set(k, (cyc.get(k) ?? 0) + 1);
    }
    for (const v of cyc.values()) expect(v).toBe(4);
    expect(cyc.size).toBe(12);
  });

  it("postOrder is a permutation of the block's set", () => {
    for (let pid = 1; pid <= 200; pid++) {
      for (const b of assign(pid, setPosts, wrongIds).blocks) {
        expect([...b.postOrder].sort()).toEqual([...setPosts[b.set]].sort());
      }
    }
  });

  it("over pids 1-1000 wrong ids are never both in positions 1-2, and all 14 allowed pairs occur", () => {
    const seen = new Set<string>();
    for (let pid = 1; pid <= 1000; pid++) {
      for (const b of assign(pid, setPosts, wrongIds).blocks) {
        const pos = b.postOrder.map((id, i) => (wrongIds.has(id) ? i + 1 : 0)).filter(Boolean);
        expect(pos).toHaveLength(2);
        expect(pos).not.toEqual([1, 2]);
        seen.add(pos.join("-"));
      }
    }
    expect(seen.size).toBe(14);
  });

  it("shuffles differ across pids", () => {
    const orders = new Set(Array.from({ length: 50 }, (_, i) => assign(i + 1, setPosts, wrongIds).blocks[0].postOrder.join()));
    expect(orders.size).toBeGreaterThan(20);
  });

  it("throws on invalid pid", () => {
    for (const pid of [0, -1, 1.5, NaN, Infinity]) expect(() => assign(pid, setPosts, wrongIds)).toThrow();
  });

  it("throws when a set doesn't have exactly 6 posts and 2 wrong ids", () => {
    expect(() => assign(1, { ...setPosts, S2: setPosts.S2.slice(0, 5) }, wrongIds)).toThrow(/S2/);
    const w = new Set(wrongIds); w.delete("p02");
    expect(() => assign(1, setPosts, w)).toThrow(/S1/);
    const w3 = new Set(wrongIds); w3.add("p01");
    expect(() => assign(1, setPosts, w3)).toThrow(/S1/);
  });
});
