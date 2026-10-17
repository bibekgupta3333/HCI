// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

const mocks = vi.hoisted(() => ({
  submitBlockSurvey: vi.fn(),
  log: vi.fn(),
  flush: vi.fn(),
  navigate: vi.fn(),
  dispatch: vi.fn(),
}));

vi.mock("react-router-dom", async (orig) => {
  const actual = await orig<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mocks.navigate };
});
vi.mock("../api/client", () => ({ api: { submitBlockSurvey: mocks.submitBlockSurvey } }));
vi.mock("../state/StudyContext", () => ({
  useStudy: () => ({
    dispatch: mocks.dispatch,
    session: {
      sessionId: "sess-1",
      pid: 3,
      blocks: [
        { blockIndex: 1, condition: "B", set: "S3", postOrder: [] },
        { blockIndex: 2, condition: "C", set: "S4", postOrder: [] },
        { blockIndex: 3, condition: "A", set: "S2", postOrder: [] },
        { blockIndex: 4, condition: "D", set: "S1", postOrder: [] },
      ],
    },
  }),
  routeForCursor: (c: { blockIndex: number; positionInBlock: number; phase: string }) =>
    c.phase === "trial" ? `/trial/${c.blockIndex}/${c.positionInBlock}` : `/${c.phase}`,
}));
vi.mock("../logging/logger", () => ({ useLogger: () => ({ log: mocks.log, flush: mocks.flush, nextSeq: () => 1 }) }));
vi.mock("../../shared/data/surveyItems.json", () => {
  const scale = { min: 1, max: 7, minLabel: "Not at all", maxLabel: "Extremely" };
  return {
    default: {
      schemaVersion: 1,
      trustScale: scale,
      trustItems: Array.from({ length: 12 }, (_, i) => ({
        id: `jian-${String(i + 1).padStart(2, "0")}`,
        order: i + 1,
        text: `Trust item ${i + 1}`,
        reverse: i < 5,
        subscale: i < 5 ? "distrust" : "trust",
      })),
      fairnessScale: { min: 1, max: 7, minLabel: "Strongly disagree", maxLabel: "Strongly agree" },
      fairnessItems: [
        { id: "fair-01", order: 1, text: "Fair item 1" },
        { id: "fair-02", order: 2, text: "Fair item 2" },
      ],
      tension: { id: "tension", text: "How tense?", min: 1, max: 7, step: 1, minLabel: "Not at all tense", maxLabel: "Extremely tense", widget: "likert" },
      frustrationTlx: { id: "frustrationTlx", text: "How irritated?", min: 0, max: 100, step: 5, minLabel: "Very low", maxLabel: "Very high", widget: "slider", start: 50 },
      confidence: { id: "confidence", text: "How confident?", min: 1, max: 7, step: 1, minLabel: "a", maxLabel: "b", widget: "likert" },
    },
  };
});

import BlockSurveyScreen from "./BlockSurveyScreen";

function renderAt(block: number) {
  return render(
    <MemoryRouter initialEntries={[`/survey/${block}`]}>
      <Routes>
        <Route path="/survey/:block" element={<BlockSurveyScreen />} />
      </Routes>
    </MemoryRouter>,
  );
}

const row = (name: string) => screen.getByRole("radiogroup", { name: new RegExp(name) });
const chip = (name: string, v: number) =>
  within(row(name)).getByRole("radio", { name: new RegExp(`^${v}(,|$)`) });

function answerAllLikert() {
  for (let i = 1; i <= 12; i++) fireEvent.click(chip(`Trust item ${i}$`, ((i - 1) % 7) + 1));
  fireEvent.click(chip("Fair item 1", 4));
  fireEvent.click(chip("Fair item 2", 6));
  fireEvent.click(within(screen.getByRole("group", { name: /How tense/ })).getByRole("radio", { name: "2" }));
}

const continueBtn = () => screen.getByRole("button", { name: /Continue|Saving/ });
const slider = () => screen.getByRole("slider", { name: /irritated/ });

describe("BlockSurveyScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.submitBlockSurvey.mockResolvedValue({ nWrongDetected: 1, cursor: { blockIndex: 3, positionInBlock: 1, phase: "trial" } });
    mocks.flush.mockResolvedValue(undefined);
  });

  it("shows the part heading without naming the condition", () => {
    renderAt(2);
    const h = screen.getByRole("heading", { level: 1 });
    expect(h).toHaveTextContent("Part 2 of 4 done — a few quick questions about the AI labels in that part");
    expect(h.textContent).not.toMatch(/condition|\bC\b/);
  });

  it("renders trust and fairness matrices with their own anchors and 7 chips per row", () => {
    renderAt(1);
    const trust = screen.getByRole("group", { name: "Trust in the AI labels" });
    const fair = screen.getByRole("group", { name: "Fairness of the AI labels" });
    expect(within(trust).getAllByRole("radiogroup")).toHaveLength(12);
    expect(within(fair).getAllByRole("radiogroup")).toHaveLength(2);
    expect(within(row("Trust item 1$")).getAllByRole("radio")).toHaveLength(7);
    expect(within(trust).getByText("1 = Not at all")).toBeInTheDocument();
    expect(within(fair).getByText("7 = Strongly agree")).toBeInTheDocument();
    expect(within(row("Fair item 2")).getByRole("radio", { name: "1, Strongly disagree" })).toBeInTheDocument();
  });

  it("answers the focused row with number keys and moves focus to the next unanswered row", async () => {
    const user = userEvent.setup();
    renderAt(1);
    // pre-answer row 2 so the advance must skip it
    fireEvent.click(chip("Trust item 2$", 5));
    chip("Trust item 1$", 1).focus();
    await user.keyboard("3");
    expect(chip("Trust item 1$", 3)).toHaveAttribute("aria-checked", "true");
    expect(row("Trust item 3$")).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard("7");
    expect(chip("Trust item 3$", 7)).toHaveAttribute("aria-checked", "true");
    expect(row("Trust item 4$")).toContainElement(document.activeElement as HTMLElement);
    await user.keyboard("8"); // out of range: ignored
    expect(within(row("Trust item 4$")).getAllByRole("radio").every((r) => r.getAttribute("aria-checked") === "false")).toBe(true);
    expect(screen.getByText("3 of 16 answered")).toBeInTheDocument();
  });

  it("arrow keys move focus within a row; roving tabindex keeps one tab stop", async () => {
    const user = userEvent.setup();
    renderAt(1);
    const chips = within(row("Trust item 1$")).getAllByRole("radio");
    expect(chips.filter((c) => c.tabIndex === 0)).toHaveLength(1);
    chips[0].focus();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    expect(document.activeElement).toBe(chips[2]);
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(chips[1]);
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(chips[6]);
    await user.keyboard(" ");
    expect(chips[6]).toHaveAttribute("aria-checked", "true");
    expect(chips[6].tabIndex).toBe(0);
    expect(chips[0].tabIndex).toBe(-1);
  });

  it("counts answers and enables Continue only when all 16 are answered", () => {
    renderAt(2);
    expect(screen.getByText("0 of 16 answered")).toBeInTheDocument();
    expect(continueBtn()).toBeDisabled();
    answerAllLikert();
    expect(screen.getByText("15 of 16 answered")).toBeInTheDocument();
    expect(continueBtn()).toBeDisabled();
    fireEvent.click(continueBtn());
    expect(mocks.submitBlockSurvey).not.toHaveBeenCalled();
    fireEvent.change(slider(), { target: { value: "55" } });
    expect(screen.getByText("16 of 16 answered")).toBeInTheDocument();
    expect(continueBtn()).toBeEnabled();
  });

  it("the slider counts only once touched, also by an arrow key", () => {
    renderAt(1);
    answerAllLikert();
    expect(slider()).toHaveValue("50");
    expect(continueBtn()).toBeDisabled();
    fireEvent.keyDown(slider(), { key: "ArrowLeft" });
    expect(continueBtn()).toBeEnabled();
  });

  it("submits the payload in item order, logs, flushes, dispatches and navigates", async () => {
    renderAt(2);
    answerAllLikert();
    fireEvent.change(slider(), { target: { value: "35" } });
    fireEvent.click(continueBtn());

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith("/trial/3/1"));
    expect(mocks.submitBlockSurvey).toHaveBeenCalledTimes(1);
    const [id, payload] = mocks.submitBlockSurvey.mock.calls[0];
    expect(id).toBe("sess-1");
    expect(payload).toEqual({
      blockIndex: 2,
      trustRaw: [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5],
      fairness1: 4,
      fairness2: 6,
      tension: 2,
      frustrationTlx: 35,
      frustrationTlxTouched: true,
      anxiety: null,
    });
    expect(mocks.log).toHaveBeenCalledWith(expect.objectContaining({ type: "block_survey_submit", blockIndex: 2, condition: "C" }));
    expect(mocks.flush).toHaveBeenCalled();
    expect(mocks.log.mock.invocationCallOrder[0]).toBeLessThan(mocks.flush.mock.invocationCallOrder[0]);
    expect(mocks.dispatch).toHaveBeenCalledWith({ type: "CURSOR_CHANGED", cursor: { blockIndex: 3, positionInBlock: 1, phase: "trial" } });
    expect(mocks.dispatch.mock.invocationCallOrder[0]).toBeLessThan(mocks.navigate.mock.invocationCallOrder[0]);
  });

  it("disables the button while sending", async () => {
    let resolve!: (v: unknown) => void;
    mocks.submitBlockSurvey.mockReturnValue(new Promise((r) => { resolve = r; }));
    renderAt(1);
    answerAllLikert();
    fireEvent.change(slider(), { target: { value: "45" } });
    fireEvent.change(slider(), { target: { value: "50" } });
    fireEvent.click(continueBtn());
    await waitFor(() => expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled());
    fireEvent.click(continueBtn());
    expect(mocks.submitBlockSurvey).toHaveBeenCalledTimes(1);
    resolve({ nWrongDetected: 0, cursor: { blockIndex: 1, positionInBlock: 6, phase: "exit_survey" } });
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith("/exit_survey"));
    expect(mocks.submitBlockSurvey.mock.calls[0][1].frustrationTlx).toBe(50);
  });
});
