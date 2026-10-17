// Condition A: no explanation. Keeps the fixed-height explanation box but renders nothing visible inside.
// CSS classes: explanation, explanation--none
import type { ExplanationProps } from "./conditionRegistry";

export function NoExplanationView(_props: ExplanationProps) {
  return <section className="explanation explanation--none" aria-label="Explanation" />;
}

export default NoExplanationView;
