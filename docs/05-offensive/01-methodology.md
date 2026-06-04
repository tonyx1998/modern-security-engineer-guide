---
id: methodology
title: The Engagement Lifecycle
sidebar_position: 2
sidebar_label: Methodology
description: What a penetration test actually is — the phased methodology from scoping to retest, the kinds of testing (black/grey/white box), and how a pentest differs from a red-team engagement and a bug bounty.
---

# The Engagement Lifecycle

> **In one line:** A penetration test is a *repeatable, phased process* — scope → recon → exploit → post-exploit → report → retest — and understanding that lifecycle (and how a pentest differs from a red team or a bug bounty) is what turns "poking at things" into a professional engagement whose product is a report that makes the organization safer.

:::danger[Authorized engagements only]
Every technique in this chapter applies **exclusively** to systems you own or are explicitly, contractually authorized to test. Unauthorized access is a crime regardless of intent or outcome. The methodology below *begins* with authorization for exactly this reason — there is no "phase zero" that skips permission.
:::

:::tip[In plain English]
A penetration test ("pentest") is a *fire drill for getting hacked*: a security professional, with written permission, plays the attacker against a system to find the weaknesses before a real criminal does — then hands over a map of what they found and how to fix it. The crucial mindset shift for a beginner: **the goal is not to "win" by breaking in.** The goal is to produce a clear, prioritized report the organization can act on. A pentester who roots every box but writes a useless report has failed; one who finds three well-explained, fixable issues has succeeded. And like any professional craft, it follows a *method* — a repeatable sequence of phases — rather than improvisation. This lesson is that method, plus the vocabulary to tell a pentest apart from its cousins (red teaming, bug bounties), because people constantly conflate them.
:::

## The phased methodology

Real engagements follow a structured lifecycle (codified in standards like the **PTES** — Penetration Testing Execution Standard). The names vary, but the arc is universal:

```
1. Pre-engagement   → scope, authorization, rules of engagement  (legal & planning)
2. Reconnaissance   → map the attack surface (passive then active)
3. Scanning/enum    → find services, versions, and candidate weaknesses
4. Exploitation     → safely demonstrate that a weakness is real
5. Post-exploitation→ escalate, pivot, assess real impact ("so what?")
6. Reporting        → write up findings, severity, repro, remediation
7. Retest           → verify the fixes actually worked
```

Two things to notice about the shape:

- **It front-loads planning and back-loads value.** The first phase (permission and scope) is *legal*, not technical; the last phases (reporting, retest) are where the engagement actually helps anyone. The "hacking" in the middle is necessary but not the point.
- **It's iterative, not strictly linear.** Post-exploitation often feeds *back* into recon (a foothold reveals a new internal network to map), looping until the scope is covered or time runs out.

:::note[Terms, defined once]
- **Penetration test (pentest)** — an authorized, scoped assessment that finds and demonstrates vulnerabilities in a defined target, ending in a report.
- **Rules of Engagement (RoE)** — the agreed constraints: what's in scope, what's off-limits, timing, methods allowed, and emergency contacts. (Its own [lesson](./rules-of-engagement).)
- **Scope** — the exact systems, applications, and IP ranges you are authorized to test — and, just as importantly, what you are *not*.
- **Vulnerability scan vs. penetration test** — a *scan* is an automated tool listing potential issues; a *pentest* adds a human who validates, chains, and demonstrates real impact. A scan is one input to a pentest, not a substitute.
- **CVSS** — Common Vulnerability Scoring System, the standard 0–10 severity score (used in reporting).
- **Proof of concept (PoC)** — a safe demonstration that a vulnerability is genuinely exploitable, without causing damage.
:::

## Types of testing: how much do you tell the tester?

Engagements are categorized by how much knowledge and access the tester starts with — a tradeoff between realism and thoroughness:

| Type | Tester knows… | Simulates | Tradeoff |
|------|---------------|-----------|----------|
| **Black box** | Almost nothing (just a target name/URL) | An external attacker with no inside info | Realistic, but time wasted on recon; may miss deep issues |
| **Grey box** | Partial info (some docs, a low-priv account) | A user or a partially-informed attacker | The common, efficient middle ground |
| **White box** | Full access (source code, architecture, creds) | An insider or maximal-assurance review | Most thorough coverage; least "realistic" surprise |

More knowledge = more coverage per hour but less realism; less knowledge = more realistic but slower and more likely to miss things behind the front door. **Grey box** is the usual sweet spot — enough context to be efficient, enough realism to be meaningful.

## Pentest vs. red team vs. bug bounty (people conflate these)

These are *different activities* with different goals, and using the words precisely marks you as someone who knows the field:

- **Penetration test** — **breadth and coverage.** Find *as many* real vulnerabilities as possible in a defined scope within a time box. The blue team usually *knows* it's happening. Success = a thorough, prioritized findings report.
- **Red team** — **depth and realism against detection.** Emulate a *specific adversary* pursuing a concrete objective ("can we reach the crown-jewel database?") *stealthily*, often without the defenders knowing, to test not just vulnerabilities but the organization's **detection and response** ([the blue team](/docs/detection)). Success = "did we achieve the objective, and did they catch us?"
- **Purple team** — red and blue working *together*, in the open, so every attack immediately improves a detection. (Red + blue = purple.)
- **Bug bounty** — an *open-ended, ongoing* program where independent researchers test in-scope targets for *pay-per-valid-bug*, on the organization's published terms. Continuous and crowd-sourced rather than a time-boxed engagement.

:::info[Highlight: the deliverable is the report, not the breach]
This is the single most important professional point in the chapter. An engagement's value to the client is **the written findings** — what's wrong, how serious, how to reproduce it, and how to fix it. "I got domain admin" is a finding, not a deliverable; it's worthless to the organization until it's an explainable, prioritized, fixable report item. Beginners optimize for the thrill of access; professionals optimize for the *clarity and actionability of the report*. Keep meticulous notes from phase one, because everything funnels into [reporting](./reporting).
:::

## Why a methodology at all?

Improvisation doesn't scale and isn't trustworthy. A repeatable lifecycle gives you:

- **Coverage** — phases ensure you don't fixate on the first shiny bug and miss whole categories or systems.
- **Repeatability & defensibility** — a documented method means results are consistent across testers and engagements, and you can prove what you did (and didn't) touch — vital if something breaks.
- **Safety** — structured phases with defined [rules of engagement](./rules-of-engagement) keep a test from becoming an outage or a legal incident.
- **Communication** — clients and teammates understand where you are and what's next.

It's the same reason [threat modeling](/docs/secure-sdlc/threat-modeling) uses a framework instead of free-form brainstorming: structure beats vibes for completeness.

## Why it matters

- **It's the professional frame for everything offensive.** The exploitation skills in later lessons are only useful *inside* this lifecycle; outside it, they're just crimes. The method is what makes the skill a profession.
- **The vocabulary is table stakes.** Confusing a pentest with a red team, or a scan with a test, signals inexperience. Precision here is part of credibility.
- **It reframes success correctly.** Internalizing "the report is the product" early prevents the classic beginner trap of chasing access for its own sake and producing nothing the client can use.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Skipping or rushing pre-engagement.** Starting technical work before scope and authorization are nailed down is how testers cause outages, exceed scope, or commit crimes. Permission is phase one, always.
- **Treating a scan as a pentest.** An automated tool's output is a *starting list*, not an assessment. The human validation, chaining, and impact analysis are the value.
- **Optimizing for access instead of the report.** Rooting everything but writing a vague report fails the client. Take notes continuously; the deliverable is the write-up.
- **Confusing the activity types.** A pentest (breadth) is not a red team (stealthy, objective-driven, tests detection) is not a bug bounty (ongoing, crowd-sourced). Use the terms correctly.
- **Going fully linear.** Post-exploitation routinely reopens recon. Loop back as new surface appears, rather than marching once through the phases.
:::

## Page checkpoint

<Quiz id="methodology-page" title="Did the engagement lifecycle click?" sampleSize={3}>

<Question
  prompt="What is the actual deliverable — the thing of value — from a penetration test?"
  options={[
    { text: "Proof that the tester gained the highest level of access" },
    { text: "A clear, prioritized report: what's wrong, how serious, how to reproduce it, and how to fix it — the breach is only valuable once it's an actionable report item" },
    { text: "A list of every tool the tester ran" },
    { text: "Nothing; the test is just for fun" }
  ]}
  correct={1}
  explanation="The report is the product. 'I got domain admin' is a finding, not a deliverable — it helps no one until it's explained, prioritized, reproducible, and paired with remediation. Professionals optimize for report clarity, not the thrill of access."
  revisit={{ to: "/docs/offensive/methodology#pentest-vs-red-team-vs-bug-bounty-people-conflate-these", label: "The deliverable is the report" }}
/>

<Question
  prompt="How does a RED TEAM engagement differ from a standard penetration test?"
  options={[
    { text: "They're the same thing" },
    { text: "A pentest maximizes breadth (find as many vulns as possible in scope, usually with the blue team aware); a red team pursues a specific objective stealthily to test the organization's detection and response, often without defenders knowing" },
    { text: "Red teams only test physical locks" },
    { text: "Red teams are automated; pentests are manual" }
  ]}
  correct={1}
  explanation="Pentest = breadth and coverage. Red team = depth, realism, and stealth against a concrete objective, specifically testing whether the defenders detect and respond. The blue team usually knows about a pentest but not a covert red-team op."
  revisit={{ to: "/docs/offensive/methodology#pentest-vs-red-team-vs-bug-bounty-people-conflate-these", label: "Pentest vs red team" }}
/>

<Question
  prompt="In a 'grey box' test, what does the tester start with, and why is it often the sweet spot?"
  options={[
    { text: "Nothing at all; it's the most realistic" },
    { text: "Partial information (e.g., some docs or a low-privilege account) — enough context to be efficient and reach deeper issues, while retaining meaningful realism" },
    { text: "Full source code and admin credentials" },
    { text: "Only the company's name" }
  ]}
  correct={1}
  explanation="Grey box gives partial knowledge — balancing black box (realistic but slow, may miss deep issues) and white box (thorough but least surprising). The partial context lets the tester spend time on real findings rather than pure recon."
  revisit={{ to: "/docs/offensive/methodology#types-of-testing-how-much-do-you-tell-the-tester", label: "Types of testing" }}
/>

<Question
  prompt="Which phase comes FIRST in the engagement lifecycle, and is it technical?"
  options={[
    { text: "Exploitation; yes, it's purely technical" },
    { text: "Pre-engagement (scope, authorization, rules of engagement) — it's legal and planning work, not technical, and there's no phase that skips permission" },
    { text: "Reporting; it's written first" },
    { text: "Reconnaissance; it requires no authorization" }
  ]}
  correct={1}
  explanation="The lifecycle front-loads planning: pre-engagement nails down scope, authorization, and rules of engagement before any technical work. Skipping it is how testers cause outages or commit crimes. Permission is always phase one."
  revisit={{ to: "/docs/offensive/methodology#the-phased-methodology", label: "The phased methodology" }}
/>

<Question
  prompt="Why follow a structured methodology instead of improvising?"
  options={[
    { text: "It's slower, which clients prefer" },
    { text: "Structure gives coverage (you don't fixate on the first bug), repeatability/defensibility (consistent, provable results), safety, and clear communication — the same reason threat modeling uses a framework" },
    { text: "Methodologies are legally required to break in" },
    { text: "It guarantees you find every vulnerability" }
  ]}
  correct={1}
  explanation="A repeatable lifecycle ensures broad coverage, consistent and defensible results, safety via defined rules, and clear communication. Like threat modeling, structure beats free-form vibes for completeness — and lets you prove what you did and didn't touch."
  revisit={{ to: "/docs/offensive/methodology#why-a-methodology-at-all", label: "Why a methodology" }}
/>

</Quiz>

## What's next

→ Continue to [Scope, Authorization & Rules of Engagement](./rules-of-engagement) — phase one in depth: the contracts and constraints that are the literal difference between a professional engagement and a federal crime.

→ **Going deeper:** red teaming specifically tests the defenders covered in [Detection & Response](/docs/detection); the AI-specific version of this discipline is in [Securing AI Systems](/docs/ai-security).
