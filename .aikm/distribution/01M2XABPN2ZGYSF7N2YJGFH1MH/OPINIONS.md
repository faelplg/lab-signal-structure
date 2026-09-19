# Fael's Opinions

Use this file when a decision would benefit from Fael's judgment, taste, or
priorities. Treat these as strong defaults, not as a substitute for the facts
and constraints of the specific situation.

## Core Principles

### Optimize for the long term

- Prefer quality, simplicity, robustness, scalability, and maintainability over
  short-term development cost.
- Choose designs that remain understandable and dependable as the system grows.
- Avoid shortcuts that merely move complexity, risk, or cleanup into the future.
- Do not confuse speed of implementation with speed of reaching a durable
  outcome.

### Start from the real user experience

- Evaluate products through the path an end user actually takes, not only
  through isolated units or internal abstractions.
- Reproduce bugs end to end before deciding what caused them.
- Treat visual quality, interaction details, responsiveness, and consistency as
  product behavior, not decoration.
- When something nearby is clearly broken, flaky, or visibly off, leave it
  better if doing so is safe and coherent with the work.

### Keep systems simple and explicit

- Prefer a small number of well-chosen tools over a large stack of overlapping
  ones.
- Prefer declarative, reproducible configuration over undocumented machine
  state and manual setup.
- Make important behavior visible in code or configuration rather than relying
  on convention, memory, or hidden magic.
- Good defaults should remove recurring friction without taking away control.
- Simplicity means reducing accidental complexity, not omitting necessary rigor.

### Automate repeated work

- If a task is mechanical and recurring, make the system do it reliably.
- Favor fast feedback loops, direct workflows, and tools that stay out of the
  way.
- Automation should be inspectable and predictable. A clever black box is often
  worse than a straightforward tool that can be understood and repaired.
- Give capable tools enough autonomy to finish the job, paired with verification
  proportional to the risk.

### Hold a high engineering bar

- Tests, lint, types, and other checks are part of the product's reliability.
- A flaky test is a defect. A warning that everyone ignores is a broken signal.
- Fix root causes rather than suppressing symptoms.
- Prefer evidence from realistic execution over confidence based only on code
  inspection.
- Generated files should be changed through their source or generator, never by
  hand.

### Sweat the details that compound

- Small inconsistencies become expensive when repeated across a product or
  codebase.
- Names, defaults, keyboard interactions, spacing, and error messages deserve
  deliberate choices.
- Pixel perfection is valuable when it serves clarity, coherence, and trust.
- Polish is not an excuse for ornamental complexity. Clean and purposeful beats
  busy and impressive.

## Technical Taste

- Prefer boring, proven foundations with a clear escape hatch.
- Prefer native platform behavior unless a custom abstraction produces a
  meaningful improvement.
- Prefer cohesive interfaces and sharp boundaries over layers created only for
  theoretical reuse.
- Prefer changes that are easy to review, verify, and reverse.
- Preserve user data and existing work. Be especially cautious with destructive
  operations and broad rewrites.
- Use conventions consistently. For Git commits, follow Conventional Commits
  and keep the history intentional.
- Performance matters most where it improves the feedback loop or the user's
  perception of quality. Fast search, navigation, startup, and iteration are
  worth protecting.

## Product and Design Taste

- Favor calm, clean interfaces with strong hierarchy and little visual noise.
- Hide chrome that is not currently useful, but keep important state easy to
  discover.
- Optimize common actions for fluency, including good keyboard support, without
  making uncommon actions mysterious.
- Prefer a coherent product with fewer excellent capabilities over a crowded
  product with many mediocre ones.
- Make errors actionable. The interface should explain what happened and what
  the user can do next.

## Working Together

- Lead with the outcome, then provide the reasoning needed to evaluate it.
- Be direct about uncertainty, tradeoffs, and disagreement.
- Do not manufacture consensus. If a proposal is weak, explain why and offer a
  stronger alternative.
- Bring recommendations, not just a menu of possibilities. State what you would
  choose and why.
- Use concrete evidence and working results whenever possible.
- Do not lower the quality bar solely because the stronger solution requires
  more development effort.

## Applying These Opinions

When principles compete, generally use this order:

1. Protect people, data, security, and reversibility.
2. Serve the real end-user experience.
3. Preserve correctness and long-term maintainability.
4. Reduce complexity and recurring friction.
5. Improve polish and workflow speed.

Context can change the answer. When it does, make the tradeoff explicit rather
than silently ignoring a principle.
