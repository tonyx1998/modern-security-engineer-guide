---
id: secure-design-review
title: Secure Design & Code Review
sidebar_position: 4
sidebar_label: Secure design & review
description: Turning threats into secure architecture — design principles like fail-safe defaults and complete mediation — and how to review code for vulnerabilities, not just style.
---

# Secure Design & Code Review

> **In one line:** Between "what could go wrong" ([threat modeling](./threat-modeling)) and "automated scanning" sits the *human* layer — choosing **secure designs** (fail-safe defaults, complete mediation, minimal trust) and doing **security-focused code review** that hunts for vulnerability classes, not just formatting — because the bugs that matter most are exactly the ones tools and style checks miss.

:::tip[In plain English]
[Threat modeling](./threat-modeling) gave you a list of "here's what an attacker could do." This lesson is the two human responses to that list. First, **secure design**: arranging the architecture so whole categories of attack are structurally prevented — like deciding a feature should *fail closed* (deny access when something breaks) rather than *fail open* (allow it). Second, **secure code review**: when a teammate's code comes up for review, looking at it through a security lens — "is this query parameterized? is this endpoint checking authorization? where does this untrusted input go?" — not just "is the indentation right?" Automated scanners (next lesson) catch the mechanical, known-pattern bugs. Design judgment and human review catch the *contextual* ones: the missing authorization check, the subtle logic flaw, the trust placed in the wrong component. Those are the expensive ones, and they need a human who's thinking like an attacker.
:::

## Secure design principles (the durable ones)

A handful of design principles — many from a classic 1975 paper by Saltzer and Schroeder — have survived every technology shift because they're about *structure*, not tools. You met several in [Foundations](/docs/foundations/defense-in-depth); here they are as design guidance:

- **Fail-safe defaults / fail closed.** When something errors or is undefined, *deny*. An auth check that throws an exception should result in "access denied," never "access granted." Default to no access and grant explicitly. (The opposite — *fail open* — is a recurring breach cause.)
- **Complete mediation.** Check *every* access to a protected resource, every time — don't check once and cache the decision where it can be bypassed. (This is why [authorization is enforced per-request](/docs/appsec/broken-access-control).)
- **Least privilege.** Each component gets the minimum rights it needs. ([Foundations](/docs/foundations/defense-in-depth).)
- **Economy of mechanism (keep it simple).** Complexity is the enemy of security — simpler designs have fewer places to hide bugs and are easier to review. Prefer the boring, well-understood approach.
- **Separation of privilege / duties.** Require more than one condition or party for sensitive actions (e.g., two approvals to deploy to prod), so a single compromise isn't enough.
- **Least common mechanism.** Minimize shared state and shared components between users/tenants; shared things become cross-tenant attack paths.
- **Defense in depth.** Layer independent controls so one failure isn't fatal. ([Foundations](/docs/foundations/defense-in-depth).)
- **Open design (no security by obscurity).** Security must not depend on the design being secret — assume the attacker knows how it works (Kerckhoffs again). Hidden URLs and secret algorithms are not controls.

:::note[Worked example: fail open vs. fail closed]
A service checks permissions by calling an authorization service. One day that service times out. Two designs:

```
FAIL OPEN  (wrong):  if authz check errors → allow the action  ← outage becomes a breach
FAIL CLOSED (right): if authz check errors → deny the action   ← outage stays an outage
```

Under load or attack, the authz service is *exactly* what an attacker may try to knock over — and a fail-open design rewards them with unrestricted access. Fail-safe defaults say: when in doubt, deny. The cost is some legitimate requests fail during the outage; the benefit is a [DoS](/docs/foundations/cia-triad) can't be escalated into an authorization bypass. Choose the failure mode *deliberately at design time* — it's almost always invisible until the day it matters.
:::

## Security-focused code review

Most teams review code, but for *style and correctness*. **Security review** adds an attacker's lens. You don't need to review every line for security — you need to know *where to look*. The high-yield targets:

- **Trust boundaries.** Wherever untrusted input enters (request handlers, file uploads, message consumers, third-party webhooks), trace where it goes. Is it validated, parameterized, encoded for its [sink](/docs/appsec/xss)?
- **Authentication & authorization.** Does this endpoint check *who* and *whether they're allowed* — for *this specific object*? Missing/weak [authz](/docs/appsec/broken-access-control) is the #1 bug; it's invisible unless you look for the *absence* of a check.
- **The dangerous sinks.** Search for the risky calls: raw SQL/string-built queries, `innerHTML`/`dangerouslySetInnerHTML`, shell/`exec`, deserializers, file-path construction, redirect targets. Each is a potential [injection](/docs/appsec/injection)/[XSS](/docs/appsec/xss)/[SSRF](/docs/appsec/ssrf).
- **Secrets.** Any hardcoded key, token, password, or connection string in the diff. (Automatable — next lessons — but reviewers should flag it too.)
- **Crypto usage.** Home-rolled crypto, fast hashes for passwords, disabled cert verification, `Math.random()` for tokens — all [Chapter 2](/docs/cryptography) red flags.
- **Error handling & logging.** Does it [fail closed](#secure-design-principles-the-durable-ones)? Does it leak sensitive data in errors or logs? Is a security-relevant action logged?
- **Business logic.** The flaws no tool finds: can a step be skipped, a price/quantity manipulated, a workflow replayed, a race condition exploited? This needs a human who understands intent.

:::info[Highlight: review for what's MISSING, not just what's wrong]
The hardest security bugs aren't bad lines you can point at — they're *absent* lines: the authorization check that was never added, the validation that's missing, the rate limit nobody applied. Style review looks at the code that's there; security review must also ask "what *should* be here and isn't?" Train yourself to notice the missing `if (owner != currentUser)`, not just the buggy ones present. A useful habit: for each new endpoint, explicitly confirm authn, authz, input handling, and output encoding are *present* — absence is the bug.
:::

## How design and review fit the pipeline

These two human activities bracket the automated middle of the [secure SDLC](./shift-left):

```
Threat model (design) ─▶ SECURE DESIGN choices ─▶ code ─▶ SECURE CODE REVIEW ─▶ automated scans ─▶ ship
        (humans, design-time)        (humans, pre-merge)         (tools, CI)
```

Design and review are where *judgment* lives. Automated [SAST/DAST/SCA](./sast-dast-sca) (next) handle scale and known patterns; humans handle context, intent, and the missing-control problem. A mature program uses **both, deliberately** — tools to cover breadth cheaply, humans focused on the high-yield targets and the logic flaws tools can't see.

:::note[Make review effective, not theater]
- **Give reviewers a security checklist** for the high-yield targets above, so it's systematic, not vibes.
- **Smaller diffs review better.** A 2,000-line PR gets rubber-stamped; security lives in the details. Encourage small, focused changes.
- **Use [security champions](./shift-left)** to bring deeper context to their team's reviews without a security engineer in every PR.
- **Automate the mechanical checks** (secrets, known-bad patterns) so human attention goes to logic and design, not to things a linter should catch.
:::

## Why it matters

- **It catches the costly, contextual bugs.** Missing authorization, logic flaws, fail-open designs, and trust misplacements are the breaches that scanners miss — and they're found by design judgment and human review.
- **Design choices are the cheapest fixes that stick.** A fail-closed default or a simpler architecture prevents classes of bugs permanently, for the cost of a decision — the [shift-left](./shift-left) payoff at the design stage.
- **It's where senior security judgment shows.** Anyone can run a scanner; recognizing a missing check or an exploitable workflow in a code review is the skill that defines a security engineer.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Failing open.** Designing so that errors/timeouts *allow* the action turns outages into breaches. Default to deny; choose the failure mode on purpose.
- **Reviewing only for style.** Linters and formatters handle style. If review doesn't add a security lens (boundaries, authz, sinks, secrets, logic), the costly bugs sail through.
- **Looking only at present lines.** The worst bugs are *missing* controls. Ask "what should be here?" — confirm authn/authz/validation/encoding are present on every new endpoint.
- **Security by obscurity in the design.** Hidden endpoints, secret algorithms, unguessable IDs as the *only* protection — assume the attacker knows the design. Obscurity can layer on top of real controls, never replace them.
- **Complexity creep.** Over-clever designs hide bugs and resist review. Prefer simple, boring, well-understood mechanisms.
- **Giant pull requests.** Huge diffs defeat meaningful review. Keep changes small so security details get actual scrutiny.
:::

## Page checkpoint

<Quiz id="secure-design-review-page" title="Did secure design & review click?" sampleSize={3}>

<Question
  prompt="An authorization service times out. Which design is correct, and why?"
  options={[
    { text: "Fail open (allow the action) — so users aren't inconvenienced" },
    { text: "Fail closed (deny the action) — fail-safe defaults mean errors result in denial; otherwise an attacker who knocks over the authz service gets unrestricted access, turning an outage into a breach" },
    { text: "Cache the last decision forever" },
    { text: "It doesn't matter which" }
  ]}
  correct={1}
  explanation="Fail-safe defaults: when a check errors or is undefined, deny. Failing open rewards an attacker for causing the very outage they might engineer, escalating DoS into an authorization bypass. Choose the failure mode deliberately at design time."
  revisit={{ to: "/docs/secure-sdlc/secure-design-review#secure-design-principles-the-durable-ones", label: "Fail-safe defaults" }}
/>

<Question
  prompt="What distinguishes SECURITY-focused code review from ordinary code review?"
  options={[
    { text: "It only checks indentation and naming" },
    { text: "It adds an attacker's lens — tracing untrusted input across trust boundaries, checking authn/authz, flagging dangerous sinks and secrets, and reasoning about logic flaws — looking at high-yield targets, not just style" },
    { text: "It runs only after deployment" },
    { text: "It's done entirely by automated tools" }
  ]}
  correct={1}
  explanation="Style review checks formatting/correctness; security review asks where untrusted input goes, whether authorization is enforced per-object, which dangerous sinks appear, and whether the business logic can be abused. You target the high-yield spots rather than every line."
  revisit={{ to: "/docs/secure-sdlc/secure-design-review#security-focused-code-review", label: "Security-focused review" }}
/>

<Question
  prompt="Why is it said that security review must look for what's MISSING, not just what's wrong?"
  options={[
    { text: "Because missing code compiles faster" },
    { text: "The hardest bugs are absent controls — the authorization check never added, the validation never written — which no present line reveals; you must ask 'what should be here and isn't?'" },
    { text: "Because style issues are the real risk" },
    { text: "Because tools already find all missing controls" }
  ]}
  correct={1}
  explanation="Broken access control and similar top bugs are usually a check that simply isn't there. Reviewing only present lines misses them. Confirm authn, authz, input handling, and output encoding are present on every new endpoint — absence is the vulnerability."
  revisit={{ to: "/docs/secure-sdlc/secure-design-review#security-focused-code-review", label: "Review for what's missing" }}
/>

<Question
  prompt="How do secure design/review and automated scanning divide the work?"
  options={[
    { text: "Tools handle everything; humans are unnecessary" },
    { text: "Tools cover breadth and known patterns cheaply; humans (design judgment + review) handle context, intent, logic flaws, and missing controls — a mature program uses both deliberately" },
    { text: "Humans handle everything; tools are unnecessary" },
    { text: "They both only run in production" }
  ]}
  correct={1}
  explanation="Automated SAST/DAST/SCA scale to every change and catch mechanical, known-pattern bugs. Humans catch the contextual, logic, and missing-control issues tools can't reason about. Neither alone is sufficient; the secure SDLC combines them."
  revisit={{ to: "/docs/secure-sdlc/secure-design-review#how-design-and-review-fit-the-pipeline", label: "Design, review, and the pipeline" }}
/>

<Question
  prompt="Which is a secure DESIGN principle (not just a coding tip)?"
  options={[
    { text: "Use four-space indentation" },
    { text: "Economy of mechanism — keep the design simple, because complexity hides bugs and resists review (along with fail-safe defaults, complete mediation, least privilege, and no security-by-obscurity)" },
    { text: "Write longer functions" },
    { text: "Hide endpoints so attackers can't find them" }
  ]}
  correct={1}
  explanation="Economy of mechanism (simplicity) is a durable Saltzer-Schroeder design principle: simpler systems have fewer hiding places for bugs and are easier to review. Hiding endpoints is security by obscurity — not a real control."
  revisit={{ to: "/docs/secure-sdlc/secure-design-review#secure-design-principles-the-durable-ones", label: "Secure design principles" }}
/>

</Quiz>

## What's next

→ Continue to [Automated Scanning: SAST, DAST & SCA](./sast-dast-sca) — the tools that handle scale and known patterns in CI, freeing human judgment for the design and logic work this lesson covered.

→ **Going deeper:** the bug classes reviewers hunt for are [Chapter 3](/docs/appsec); the design principles trace back to [Foundations: defense in depth & least privilege](/docs/foundations/defense-in-depth).
