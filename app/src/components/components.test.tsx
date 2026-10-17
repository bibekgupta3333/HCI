// @vitest-environment jsdom
import { createRef, useState } from "react";
import { act, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostCard from "./PostCard";
import LabelPanel from "./LabelPanel";
import FactSheetPanel from "./FactSheetPanel";
import LikertScale from "./LikertScale";
import SliderScale from "./SliderScale";
import PostRatingStrip, { type PostRatingStripHandle } from "./PostRatingStrip";
import ProgressBar from "./ProgressBar";
import type { FactSheet, ScaleItem } from "../../shared/types";

const factSheet: FactSheet = {
  title: "March Water Quality Report",
  body: "In March, Riverton's tap water was tested for 12 regulated substances. All 12 results were within safety limits.",
  source: "Riverton Water Department (fictional)",
};

const confidenceItem: ScaleItem = {
  id: "confidence",
  text: "How confident are you in your decision?",
  min: 1,
  max: 7,
  step: 1,
  minLabel: "Not at all confident",
  maxLabel: "Extremely confident",
  widget: "likert",
};

describe("PostCard", () => {
  const base = { text: "Good news: Riverton tap water met all 12 safety limits in March.", postedAgo: "6h", likes: 187, reposts: 52 };

  it("renders author, handle, time, text and stats", () => {
    render(<PostCard {...base} author={{ displayName: "Riverton Neighbors", handle: "@RivertonNeighbors", verified: true }} />);
    expect(screen.getByText("Riverton Neighbors")).toBeInTheDocument();
    expect(screen.getByText("@RivertonNeighbors")).toBeInTheDocument();
    expect(screen.getByText("6h")).toBeInTheDocument();
    expect(screen.getByText(base.text)).toBeInTheDocument();
    expect(screen.getByLabelText("187 likes")).toHaveTextContent("♡ 187");
    expect(screen.getByLabelText("52 reposts")).toHaveTextContent("↻ 52");
    expect(screen.getByRole("img", { name: "verified account" })).toHaveTextContent("✔");
  });

  it("shows no badge for unverified accounts", () => {
    render(<PostCard {...base} author={{ displayName: "Dana", handle: "@dana_reads", verified: false }} />);
    expect(screen.queryByLabelText("verified account")).toBeNull();
    expect(screen.queryByText("✔")).toBeNull();
  });
});

describe("LabelPanel", () => {
  it("shows the checking state with role=status", () => {
    render(<LabelPanel label="accurate" checking />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("AI is checking…");
    expect(status).not.toHaveTextContent("Likely");
    expect(status).toHaveClass("label-panel", "label-panel--checking");
  });

  it("shows the accurate label", () => {
    render(<LabelPanel label="accurate" checking={false} />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("AI label: ✓ Likely accurate");
    expect(status).toHaveClass("label-panel--accurate");
  });

  it("shows the misleading label and keeps the same element across states", () => {
    const { rerender } = render(<LabelPanel label="misleading" checking />);
    const before = screen.getByTestId("label-panel");
    rerender(<LabelPanel label="misleading" checking={false} />);
    const after = screen.getByTestId("label-panel");
    expect(after).toBe(before);
    expect(after).toHaveTextContent("AI label: ⚠ Likely misleading");
    expect(after).toHaveClass("label-panel--misleading");
  });
});

function FactSheetHarness({ onToggle }: { onToggle?: (o: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <FactSheetPanel
      factSheet={factSheet}
      open={open}
      onToggle={(o) => {
        onToggle?.(o);
        setOpen(o);
      }}
    />
  );
}

describe("FactSheetPanel", () => {
  it("toggles open and closed with the button", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<FactSheetHarness onToggle={spy} />);
    const toggle = screen.getByRole("button", { name: "Fact sheet ▸" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(factSheet.title)).toBeNull();

    await user.click(toggle);
    expect(spy).toHaveBeenLastCalledWith(true);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("heading", { name: factSheet.title })).toBeInTheDocument();
    expect(screen.getByText(factSheet.body)).toBeInTheDocument();
    expect(screen.getByText(`Source: ${factSheet.source}`)).toBeInTheDocument();
    expect(screen.getByRole("complementary")).not.toHaveTextContent(/likely|label/i);

    await user.click(toggle);
    expect(spy).toHaveBeenLastCalledWith(false);
    expect(screen.queryByText(factSheet.title)).toBeNull();
  });

  it("closes on Esc and on the × button", async () => {
    const user = userEvent.setup();
    render(<FactSheetHarness />);
    await user.click(screen.getByRole("button", { name: /fact sheet/i }));
    expect(screen.getByText(factSheet.title)).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByText(factSheet.title)).toBeNull();

    await user.click(screen.getByRole("button", { name: /fact sheet/i }));
    await user.click(screen.getByRole("button", { name: "Close fact sheet" }));
    expect(screen.queryByText(factSheet.title)).toBeNull();
  });

  it("can be disabled", () => {
    render(<FactSheetPanel factSheet={factSheet} open={false} onToggle={() => {}} disabled />);
    expect(screen.getByRole("button", { name: "Fact sheet ▸" })).toBeDisabled();
  });
});

describe("LikertScale", () => {
  function Harness({ spy }: { spy: (v: number) => void }) {
    const [v, setV] = useState<number | null>(null);
    return (
      <LikertScale
        name="tension"
        label="How tense did you feel?"
        minLabel="Not at all"
        maxLabel="Extremely tense"
        value={v}
        onChange={(n) => {
          spy(n);
          setV(n);
        }}
      />
    );
  }

  it("renders a fieldset with 7 radios and endpoint labels", () => {
    render(<Harness spy={() => {}} />);
    expect(screen.getByRole("group", { name: "How tense did you feel?" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(7);
    expect(screen.getByText("1 = Not at all")).toBeInTheDocument();
    expect(screen.getByText("7 = Extremely tense")).toBeInTheDocument();
  });

  it("selects by click and by keyboard", async () => {
    const user = userEvent.setup();
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    await user.click(screen.getByRole("radio", { name: "3" }));
    expect(spy).toHaveBeenLastCalledWith(3);
    expect(screen.getByRole("radio", { name: "3" })).toBeChecked();
    await user.keyboard("{ArrowRight}");
    expect(spy).toHaveBeenLastCalledWith(4);
    expect(screen.getByRole("radio", { name: "4" })).toBeChecked();
    await user.click(screen.getByRole("radio", { name: "7, Extremely tense" }));
    expect(spy).toHaveBeenLastCalledWith(7);
  });
});

describe("SliderScale", () => {
  function Harness({ onTouch, onChange }: { onTouch: () => void; onChange: (v: number) => void }) {
    const [v, setV] = useState<number | null>(null);
    const [t, setT] = useState(false);
    return (
      <SliderScale
        name="frustrationTlx"
        label="How irritated, stressed or annoyed did you feel during this part?"
        minLabel="Very low"
        maxLabel="Very high"
        value={v}
        touched={t}
        onChange={(n) => {
          onChange(n);
          setV(n);
        }}
        onTouch={() => {
          onTouch();
          setT(true);
        }}
      />
    );
  }

  it("starts at 50, untouched, with a hint", () => {
    render(<Harness onTouch={() => {}} onChange={() => {}} />);
    const input = screen.getByRole("slider", { name: /irritated/ });
    expect(input).toHaveValue("50");
    expect(input).toHaveAttribute("step", "5");
    expect(screen.getByText("Please move the slider to answer")).toBeInTheDocument();
  });

  it("calls onTouch once on first change and shows the value", () => {
    const onTouch = vi.fn();
    const onChange = vi.fn();
    render(<Harness onTouch={onTouch} onChange={onChange} />);
    const input = screen.getByRole("slider");
    fireEvent.change(input, { target: { value: "65" } });
    expect(onTouch).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(65);
    expect(screen.queryByText("Please move the slider to answer")).toBeNull();
    expect(screen.getByText("65")).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "70" } });
    expect(onTouch).toHaveBeenCalledTimes(1);
  });

  it("counts a keyboard move as touched even without a value change", () => {
    const onTouch = vi.fn();
    render(<Harness onTouch={onTouch} onChange={() => {}} />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(onTouch).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Please move the slider to answer")).toBeNull();
  });

  it("ignores non-movement keys", () => {
    const onTouch = vi.fn();
    render(<Harness onTouch={onTouch} onChange={() => {}} />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "Tab" });
    expect(onTouch).not.toHaveBeenCalled();
  });
});

describe("PostRatingStrip", () => {
  it("uses the item wording and requires an answer", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PostRatingStrip item={confidenceItem} onSubmit={onSubmit} />);
    expect(screen.getByRole("group", { name: confidenceItem.text })).toBeInTheDocument();
    expect(screen.getByText("1 = Not at all confident")).toBeInTheDocument();
    const next = screen.getByRole("button", { name: "Next" });
    expect(next).toBeDisabled();
    await user.click(next);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits exactly once", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onChange = vi.fn();
    render(<PostRatingStrip item={confidenceItem} onSubmit={onSubmit} onChange={onChange} />);
    await user.click(screen.getByRole("radio", { name: "5" }));
    expect(onChange).toHaveBeenLastCalledWith(5);
    const next = screen.getByRole("button", { name: "Next" });
    expect(next).toBeEnabled();
    await user.dblClick(next);
    await user.click(next);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(5);
    expect(next).toBeDisabled();
  });

  it("guards a rapid double submit before re-render", () => {
    const onSubmit = vi.fn();
    render(<PostRatingStrip item={confidenceItem} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole("radio", { name: "2" }));
    const form = screen.getByRole("button", { name: "Next" }).closest("form")!;
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(2);
  });
});

describe("PostRatingStrip (chips mode)", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const renderChips = (extra: Partial<React.ComponentProps<typeof PostRatingStrip>> = {}) => {
    const onSubmit = vi.fn();
    const onChange = vi.fn();
    const onPendingChange = vi.fn();
    const ref = createRef<PostRatingStripHandle>();
    render(
      <PostRatingStrip
        ref={ref}
        mode="chips"
        autoSubmit
        item={confidenceItem}
        label="How sure are you?"
        minLabel="Not at all sure"
        maxLabel="Completely sure"
        onSubmit={onSubmit}
        onChange={onChange}
        onPendingChange={onPendingChange}
        {...extra}
      />,
    );
    return { onSubmit, onChange, onPendingChange, ref };
  };

  it("renders a labelled radiogroup of 7 chips with anchors", () => {
    renderChips();
    expect(screen.getByRole("radiogroup", { name: "How sure are you?" })).toBeInTheDocument();
    const chips = screen.getAllByRole("radio");
    expect(chips).toHaveLength(7);
    expect(chips[0]).toHaveAccessibleName("1, Not at all sure");
    expect(chips[6]).toHaveAccessibleName("7, Completely sure");
    expect(chips.every((c) => c.getAttribute("aria-checked") === "false")).toBe(true);
    expect(screen.getByText("1 Not at all sure")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });

  it("auto-submits once after the undo window", () => {
    vi.useFakeTimers();
    const { onSubmit, onChange, onPendingChange } = renderChips();
    fireEvent.click(screen.getByRole("radio", { name: /^5/ }));
    expect(onChange).toHaveBeenCalledWith(5);
    expect(onPendingChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByText(/Saving/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /^3/ })); // locked while pending
    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(onSubmit).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(5);
    expect(onPendingChange).toHaveBeenLastCalledWith(false);
  });

  it("Undo cancels and allows a new choice; the handle picks a value", () => {
    vi.useFakeTimers();
    const { onSubmit, ref } = renderChips();
    fireEvent.click(screen.getByRole("radio", { name: /^2/ }));
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("radio", { name: /^2/ })).toHaveAttribute("aria-checked", "false");
    act(() => ref.current!.choose(6));
    expect(screen.getByRole("radio", { name: /^6/ })).toHaveAttribute("aria-checked", "true");
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(6);
  });

  it("without autoSubmit uses a Next button", () => {
    const { onSubmit } = renderChips({ autoSubmit: false });
    const next = screen.getByRole("button", { name: "Next" });
    expect(next).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: /^4/ }));
    fireEvent.click(next);
    fireEvent.click(next);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(4);
  });
});

describe("ProgressBar", () => {
  it("shows the label and an accessible progressbar", () => {
    render(<ProgressBar current={9} total={24} label="Post 9 of 24" />);
    const bar = screen.getByRole("progressbar", { name: "Post 9 of 24" });
    expect(bar).toHaveAttribute("aria-valuenow", "9");
    expect(bar).toHaveAttribute("aria-valuemax", "24");
    expect(screen.getByText("Post 9 of 24")).toBeInTheDocument();
    expect((bar.firstChild as HTMLElement).style.width).toBe("37.5%");
  });

  it("clamps out-of-range values", () => {
    render(<ProgressBar current={30} total={24} label="x" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "24");
  });
});
