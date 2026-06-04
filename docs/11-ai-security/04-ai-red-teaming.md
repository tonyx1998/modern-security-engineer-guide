---
id: ai-red-teaming
title: AI Red-Teaming
sidebar_position: 5
sidebar_label: AI red-teaming
description: Adversarially testing AI systems — what's the same as classic red-teaming, what's new (non-deterministic, infinite input space), and how to test the whole AI system rather than just the model.
---

# AI Red-Teaming

> **In one line:** **AI red-teaming** is [adversarial testing](/docs/offensive) pointed at AI systems — probing for [prompt injection](./prompt-injection), [jailbreaks](./prompt-injection), and [tool abuse](./excessive-agency) — and what makes it genuinely different from classic [pentesting](/docs/offensive) is that the target is **non-deterministic** (the same attack may work only sometimes) with an **effectively infinite input space** (natural language), so you test the *whole system and its guardrails*, not just whether one prompt happens to break the model.

:::tip[In plain English]
You already know [red-teaming](/docs/offensive/methodology): adversarially attack a system, within [authorization](/docs/offensive/rules-of-engagement), to find weaknesses before real attackers do. **AI red-teaming** is the same discipline aimed at AI features — try to [prompt-inject](./prompt-injection) it, [jailbreak](./prompt-injection) its safety rules, trick it into [misusing its tools](./excessive-agency), or leak its data. Most of the methodology and *all* of the [ethics and authorization](/docs/offensive/rules-of-engagement) carry straight over. But two things make AI genuinely weird to test. First, it's **non-deterministic**: run the exact same attack twice and it might work once and fail once, because the model's output varies. A classic exploit either works or it doesn't; an AI attack works *probabilistically*. Second, the **input space is infinite**: with SQL injection there are finite syntaxes; with natural language, there are *unlimited* ways to phrase a jailbreak, so you can never prove the model is "safe" — only that you didn't find a break this time. These two facts reshape how you test and what conclusions you can draw. This lesson is AI red-teaming, building on the offensive chapter.
:::

## What carries over from classic red-teaming

Reassuringly, most of [Chapter 5](/docs/offensive) applies directly:

- **Authorization and scope first.** AI red-teaming is still attacking a system; it needs the same [explicit authorization, scope, and rules of engagement](/docs/offensive/rules-of-engagement). Testing someone's AI product without permission is the same crime as any unauthorized testing.
- **The adversarial mindset.** It's still [thinking in misuse cases](/docs/foundations/attacker-mindset) — "how do I make this do what it shouldn't?" — now applied to a model.
- **The deliverable is the report.** Same as before: the value is a clear, prioritized writeup of what broke and how to fix it, [not the thrill of the jailbreak](/docs/offensive/reporting).
- **Test the system, not just one component.** Just as a pentest examines the whole app, AI red-teaming examines the whole AI *system* — the model *plus* its [tools](./excessive-agency), data access, [output handling](/docs/ai-security/llm-top-10), and the [deterministic controls around it](./cardinal-rule) — not the model in isolation.

So your offensive foundations transfer. The new part is *how the target behaves* under test.

:::note[Terms, defined once]
- **AI red-teaming** — adversarial testing of AI systems for security and safety failures.
- **Non-determinism** — the same input can produce different outputs, so attacks succeed probabilistically, not reliably.
- **Jailbreak** — bypassing the model's safety guardrails (from [prompt injection](./prompt-injection)).
- **Adversarial input** — a crafted prompt/content designed to make the model misbehave.
- **Guardrails** — safety/security filters around the model (input/output classifiers, policies) — themselves a test target.
- **Coverage problem** — the impossibility of testing an infinite input space exhaustively, so "no break found" ≠ "secure."
- **Automated red-teaming** — using tools (and other models) to generate and test many adversarial inputs at scale.
:::

## What's genuinely different: two hard properties

**1. Non-determinism — attacks work *probabilistically*.** The same prompt can succeed or fail across runs because model outputs vary. This breaks the classic "found a bug / didn't find a bug" binary:

:::note[Worked example: a jailbreak that works 30% of the time]
You try a jailbreak prompt. It fails. Is the system safe against it? **You don't know** — try it ten more times and it might succeed three. An AI attack that works *30% of the time* is still a *severe vulnerability* (an attacker just retries), but a single test run could report it as "blocked." So AI red-teaming must:
- **Test repeatedly** — run each attack many times to estimate its *success rate*, not just a yes/no.
- **Report probabilistically** — "this jailbreak succeeds ~30% of attempts" is the finding, and a 30% bypass is *not* "mostly safe" — it's reliably exploitable by retrying.
- **Treat 'usually refuses' as failing** — a guardrail that holds 95% of the time still fails 1-in-20, which an attacker happily exploits at scale.

Determinism was a luxury classic exploitation had; AI red-teaming trades it for statistics.
:::

**2. Infinite input space — you can never prove safety.** Natural language is unbounded; there are limitless ways to phrase an attack. Unlike [SQL injection's](/docs/appsec/injection) finite grammar, you *cannot* enumerate all jailbreaks. The hard consequence:

:::caution[The coverage problem: "no break found" ≠ "secure"]
With finite, well-understood vulnerability classes, thorough testing can give real confidence. With an LLM, **the absence of a found jailbreak proves only that *you* didn't find one** — a more creative attacker, a novel phrasing, or a future technique may still break it. You can never test the infinite space exhaustively. This is humbling and important: AI red-teaming *reduces* risk and finds *specific* breaks to fix, but it can *never certify* a model as injection-proof — because [injection can't be fully prevented](./prompt-injection) in the first place. The takeaway reinforces the whole chapter: **don't rely on red-teaming (or the model) to make the model a security boundary.** Find and fix what you can, automate broad coverage, but architect so that a break that *slips through* is contained by the [controls around the model](./cardinal-rule) — because you must assume some break always exists.
:::

To cope with the infinite space, AI red-teaming leans heavily on **automation** — using tools and even other models to *generate* enormous numbers of adversarial inputs and test them at scale, far beyond what manual testing covers. It's broad probabilistic sampling of an infinite space, not exhaustive proof.

## Test the whole system, including the guardrails

A critical scoping point: red-teaming the *model* alone is insufficient. The real questions are about the *system*:

- Can [indirect injection](./prompt-injection) via the data it ingests make it misbehave?
- If injected, what can it actually *do* — are the [tools and permissions](./excessive-agency) contained, or can a break reach money/data/systems?
- Does its [output get handled safely](/docs/ai-security/llm-top-10), or can a steered output cause [XSS](/docs/appsec/xss)/injection downstream?
- Do the **guardrails** (input/output filters, the [deterministic authorization layer](./cardinal-rule)) actually hold when the model is manipulated?

The most valuable findings are usually *not* "I jailbroke the model" (expected — [you can't prevent it](./prompt-injection)) but "I jailbroke the model **and** the break let me reach a real action / leak real data because the surrounding controls were weak." That's the difference between a contained AI system and a dangerous one — and it's only visible when you red-team the whole system.

## Why it matters

- **It's how you find AI weaknesses before attackers do.** The [offensive discipline](/docs/offensive) applied to the new surface — essential as AI features ship into production.
- **Its limits teach the chapter's lesson.** Non-determinism and the infinite input space mean you can never *certify* a model safe — which is exactly why you architect controls around it rather than trusting it. AI red-teaming's *humility* is its most important output.
- **It validates the controls, not just the model.** The highest-value testing checks whether a break is *contained* by the surrounding [least-privilege and authorization](./excessive-agency) — confirming the architecture, not the unwinnable goal of an unbreakable model.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Testing without authorization.** AI systems are still systems; red-teaming them needs the same explicit authorization and scope as any testing.
- **Treating a single failed attempt as 'safe.'** Non-determinism means an attack that failed once may succeed on retry. Test repeatedly and report success *rates*; a 30% bypass is a severe bug.
- **Believing 'no break found' means secure.** The input space is infinite; you can't prove safety, only find specific breaks. Don't certify a model as injection-proof.
- **Red-teaming the model in isolation.** The system — tools, data access, output handling, guardrails — is the real target. The key finding is whether a break reaches real impact.
- **Relying only on manual testing.** The infinite space demands automation (tools and models generating adversarial inputs at scale) for meaningful coverage.
- **Using red-teaming as the security strategy.** It reduces and finds risk; it can't make the model a boundary. Architect containment around the model regardless.
:::

## Page checkpoint

<Quiz id="ai-red-teaming-page" title="Did AI red-teaming click?" sampleSize={3}>

<Question
  prompt="What carries over directly from classic red-teaming to AI red-teaming?"
  options={[
    { text: "Nothing; AI testing is entirely different" },
    { text: "Authorization/scope/rules of engagement, the adversarial misuse-case mindset, the report-is-the-deliverable principle, and testing the whole system rather than one component" },
    { text: "Only the choice of programming language" },
    { text: "The requirement to physically access servers" }
  ]}
  correct={1}
  explanation="Most of Chapter 5 transfers: it's still authorized adversarial testing, still the attacker's mindset, still about a prioritized report, and still about the whole system (model + tools + data + output handling + controls), not just the model in isolation."
  revisit={{ to: "/docs/ai-security/ai-red-teaming#what-carries-over-from-classic-red-teaming", label: "What carries over" }}
/>

<Question
  prompt="A jailbreak succeeds about 30% of the time. How should AI red-teaming treat this?"
  options={[
    { text: "As 'mostly safe' since it fails most of the time" },
    { text: "As a severe vulnerability — an attacker just retries; AI attacks work probabilistically, so you must test repeatedly, report success RATES, and treat 'usually refuses' (e.g., 95%) as failing, since a 1-in-20 bypass is exploitable at scale" },
    { text: "As not a bug at all" },
    { text: "As a model performance metric" }
  ]}
  correct={1}
  explanation="Non-determinism breaks the works/doesn't-work binary. A 30% (or even 5%) bypass is reliably exploitable by retrying. Red-teaming must estimate success rates over many runs and treat any meaningful bypass rate as a real, severe finding — not 'mostly safe.'"
  revisit={{ to: "/docs/ai-security/ai-red-teaming#whats-genuinely-different-two-hard-properties", label: "Non-determinism" }}
/>

<Question
  prompt="Why can AI red-teaming never prove a model is 'safe' against injection?"
  options={[
    { text: "Because red-teamers aren't skilled enough" },
    { text: "Natural language is an infinite input space — unlike SQLi's finite grammar, there are limitless ways to phrase an attack, so 'no break found' only means YOU didn't find one; a novel phrasing or future technique may still break it" },
    { text: "Because models have no vulnerabilities" },
    { text: "Because testing is illegal" }
  ]}
  correct={1}
  explanation="You can't exhaustively test an infinite space. Absence of a found jailbreak proves only that this testing missed it. Combined with injection being fundamentally unpreventable, this means red-teaming reduces and finds risk but can never certify a model injection-proof."
  revisit={{ to: "/docs/ai-security/ai-red-teaming#whats-genuinely-different-two-hard-properties", label: "The coverage problem" }}
/>

<Question
  prompt="What's the most VALUABLE kind of AI red-team finding?"
  options={[
    { text: "'I jailbroke the model' (expected and unavoidable)" },
    { text: "'I jailbroke the model AND the break reached a real action or leaked real data because the surrounding controls were weak' — testing whether a break is contained by the system's least-privilege and authorization, not just whether the model can be broken" },
    { text: "'The model is 100% unbreakable'" },
    { text: "'The model is slow'" }
  ]}
  correct={1}
  explanation="Breaking the model is expected (you can't prevent injection). The high-value finding is whether that break is CONTAINED — does it reach money/data/systems because the tools, permissions, and authorization around the model were weak? That tests the architecture, which is what actually matters."
  revisit={{ to: "/docs/ai-security/ai-red-teaming#test-the-whole-system-including-the-guardrails", label: "Test the whole system" }}
/>

<Question
  prompt="How does AI red-teaming cope with the infinite input space?"
  options={[
    { text: "By testing one carefully chosen prompt" },
    { text: "By leaning heavily on automation — tools and even other models generating enormous numbers of adversarial inputs to test at scale — which is broad probabilistic sampling, not exhaustive proof" },
    { text: "By proving the model safe mathematically" },
    { text: "By only testing in production" }
  ]}
  correct={1}
  explanation="Manual testing can't cover an infinite space, so AI red-teaming automates: tools and models generate and test many adversarial inputs at scale. This achieves broad coverage by probabilistic sampling — finding more breaks — but still can't prove safety."
  revisit={{ to: "/docs/ai-security/ai-red-teaming#whats-genuinely-different-two-hard-properties", label: "Automation for coverage" }}
/>

</Quiz>

## What's next

→ Continue to [The Cardinal Rule: An LLM Is Not a Security Boundary](./cardinal-rule) — the principle every lesson in this chapter has pointed toward, and the design discipline that ties it all together.

→ **Going deeper:** the offensive discipline this extends is [Chapter 5](/docs/offensive); the attacks you test for are [prompt injection](./prompt-injection) and [excessive agency](./excessive-agency); the architecture you validate is the [cardinal rule](./cardinal-rule).
