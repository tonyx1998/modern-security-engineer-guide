---
id: reporting
title: Reporting & Remediation
sidebar_position: 7
sidebar_label: Reporting
description: "The actual deliverable — turning findings into a report that drives fixes: severity scoring, clear reproduction, business-impact framing, prioritized remediation, and the retest that closes the loop."
---

# Reporting & Remediation

> **In one line:** The report *is* the product of an engagement — so the skill is communication, not just hacking: each finding needs honest **severity**, a clear **reproduction**, a plain-language **business impact**, and actionable **remediation**, prioritized so the team fixes what matters first — and the engagement only truly closes with a **retest** confirming the fixes worked.

:::tip[In plain English]
You found the bugs; now you have to make someone *care enough to fix them* — and most of that audience is not a hacker. A great report translates "I chained an IDOR with a default credential" into "an attacker could read every customer's records; here's exactly how, here's how bad it is, and here's the specific change that closes it." The best technical finding in the world is worthless if the report is confusing, unprioritized, or so alarmist that the team tunes it out. This is why senior testers say the *writing* is half the job: an engagement's entire value to the organization flows through this document. A clear report with five well-explained, prioritized, fixable issues beats a chaotic dump of fifty. And it isn't done when you hand it over — it's done when the fixes are verified in a **retest**.
:::

## The report has two audiences

A good report serves two very different readers, usually in two sections:

- **Executive summary (for leadership).** Plain language, no jargon: what was tested, the overall risk posture, the most important findings, and what they mean for the *business* (data at risk, regulatory exposure, money). A busy executive should grasp "how worried should I be, and about what?" in a page.
- **Technical findings (for the engineers who'll fix it).** Per-finding detail: severity, exact reproduction steps, evidence, affected systems, and concrete remediation. Enough for a developer to *reproduce and fix* without a meeting.

Writing for both is the core skill: the same finding, framed for impact (executives) *and* for action (engineers).

:::note[Terms, defined once]
- **Finding** — a single reported issue: the vulnerability, where it is, its severity, how to reproduce it, and how to fix it.
- **Severity** — how serious a finding is, usually a rating (Critical/High/Medium/Low) often backed by a [CVSS](/docs/secure-sdlc/sast-dast-sca) score.
- **CVSS** — Common Vulnerability Scoring System: a standardized 0–10 score for a vulnerability's intrinsic severity. A useful input, not the whole story (it doesn't know *your* business context).
- **Risk rating** — severity adjusted for *this organization's* real context (exploitability, exposure, business impact) — what actually drives prioritization, echoing [risk = likelihood × impact](/docs/foundations/threat-vuln-risk).
- **Reproduction steps (repro)** — the exact, ordered steps to trigger the finding, so the fixer can see it themselves.
- **Remediation** — the recommended fix, ideally specific and actionable.
- **Retest** — re-verifying, after fixes, that the findings are actually resolved.
- **False positive** — a reported issue that isn't actually exploitable; including these erodes trust, so validate before reporting.
:::

## Anatomy of a good finding

Each finding should let a reader understand, reproduce, judge, and fix the issue. The reliable structure:

1. **Title** — concrete and specific ("IDOR in `/api/invoices/{id}` exposes other customers' invoices"), not vague ("Access control issue").
2. **Severity / risk rating** — Critical/High/Medium/Low, ideally with the reasoning (and a CVSS score) so it's defensible.
3. **Description** — what the vulnerability is, in terms the fixer understands. Link the *class* (e.g., [broken access control](/docs/appsec/broken-access-control)) so they can learn the pattern, not just patch one instance.
4. **Business impact** — the "so what?" in plain language: *what an attacker could actually do* and why it matters (e.g., "read all 40,000 customers' billing data → privacy breach + regulatory exposure"). This is what moves prioritization.
5. **Reproduction steps + evidence** — the exact steps and a screenshot/PoC, so it's verifiable and undeniable. (Sanitized — don't paste real customer data.)
6. **Remediation** — the specific fix ("enforce object ownership server-side: scope the query to the authenticated user"), plus the durable/structural version where relevant.
7. **References** — links to the relevant standard/class ([OWASP](/docs/appsec/owasp-top-10), CWE) for deeper context.

:::note[Worked example: vague finding vs. useful finding]
**Weak (useless to the team):**
> *Finding: The application has an access control vulnerability. Severity: High. Fix: Improve access control.*

Nobody can reproduce, judge, or fix that. Now the same issue, done right:

**Strong:**
> **Title:** IDOR on `GET /api/invoices/{id}` exposes other customers' invoices
> **Severity:** High (CVSS 7.5) — unauthenticated-to-other-tenant data exposure, trivially exploitable.
> **Business impact:** Any logged-in user can read *every* customer's invoices (names, addresses, amounts) by incrementing the ID — ~40,000 records exposed. Privacy breach with likely regulatory ([GDPR](/docs/compliance)) consequences.
> **Reproduction:** 1) Log in as test user A. 2) Request your invoice `GET /api/invoices/1001` → 200. 3) Request `GET /api/invoices/1002` (user B's) → 200, returns B's invoice. *(Screenshot attached, data redacted.)*
> **Remediation:** Enforce object-level authorization server-side — scope the query to the authenticated user (`WHERE id = ? AND owner_id = ?`) and return 403 for non-owned objects. Audit all `/{id}` endpoints for the same pattern.
> **References:** OWASP A01 Broken Access Control; CWE-639.

The second version moves the issue from "vague worry" to "tracked, fixable ticket." That transformation is the entire deliverable.
:::

## Severity and prioritization: help them fix the right things first

A list of findings with no priority overwhelms. Your job is to make the *order of work* obvious by rating each finding's **risk in context** — not just its textbook severity.

- **CVSS is an input, not the answer.** A "Critical" CVSS bug on a system with no sensitive data, unreachable by attackers, may be a lower *risk* than a "Medium" on your internet-facing crown jewels. Adjust for [exploitability and business impact](/docs/foundations/threat-vuln-risk) — the *risk = likelihood × impact* framing from Foundations.
- **Lead with the chains.** A [chained](./exploitation) path to critical impact should be reported as one high-priority story, not scattered across three "lows" the team might each dismiss.
- **Be honest, both ways.** Don't inflate severity to look impressive (it destroys trust and wastes the team's time); don't downplay a real critical. Calibrated honesty is your credibility.

:::info[Highlight: the report's job is to change behavior]
Every choice in a report is in service of one goal: *the right fixes get made, in the right order, soon.* That means impact framed in business terms (so leadership funds it), reproduction clear enough that engineers can act without you, severity calibrated so priorities are obvious, and tone measured so people trust rather than tune out. A finding that doesn't lead to a fix — because it was unclear, unprioritized, or cried wolf — failed, no matter how clever the exploit behind it. Communication *is* the security work here.
:::

## Close the loop: remediation support and retest

The engagement isn't over at delivery:

- **Remediation support.** Be available to clarify findings and discuss fixes. The goal is *fixed*, not just *reported*; a tester who helps the team understand the root cause prevents the next instance, too.
- **Retest.** After the team fixes the findings, **re-verify** them. A finding isn't closed because someone *says* it's fixed — it's closed when you confirm the fix actually works (and didn't introduce a new gap). The retest is what makes the report's risk reduction *real*, and it's a standard, expected phase.

This closes the lifecycle from [lesson one](./methodology): scope → recon → exploit → post-exploit → **report → retest**. The loop, not the breach, is the point.

## Why it matters

- **It's the deliverable — full stop.** Everything earlier in the engagement exists to feed this. The organization's entire return on the work is the quality of the report and the fixes it drives.
- **It's where most testers are weakest.** Plenty of people can find a bug; far fewer can communicate it so it gets fixed. Strong reporting is a genuine differentiator and a senior skill.
- **It connects offense back to defense.** A good finding teaches the *class* and the structural fix, making the team durably better — closing the loop with [AppSec](/docs/appsec) and the [secure SDLC](/docs/secure-sdlc).

## Common pitfalls

:::caution[Where people commonly trip up]
- **Optimizing for the hack, not the write-up.** The report is the product; budget real time for it and take notes throughout the engagement, not at the end.
- **Vague findings.** "Access control issue / improve access control" can't be reproduced or fixed. Give specific title, repro, impact, and remediation.
- **Reporting raw severity, not contextual risk.** A high CVSS on an unreachable system may matter less than a medium on the crown jewels. Prioritize by real risk.
- **Crying wolf or sandbagging.** Inflating severity erodes trust and wastes effort; downplaying hides real danger. Calibrated honesty is your credibility.
- **No business-impact translation.** Engineers may act on a technical finding, but leadership funds fixes based on *business* impact. Frame the "so what?" in their terms.
- **Treating delivery as the end.** Without remediation support and a retest, "fixed" is unverified. Close the loop — re-test before calling a finding resolved.
- **Pasting real sensitive data as evidence.** Redact PoCs; proving impact doesn't require exposing real customer data in the report.
:::

## Page checkpoint

<Quiz id="reporting-page" title="Did reporting click?" sampleSize={3}>

<Question
  prompt="Why is the report considered the actual product of a penetration test?"
  options={[
    { text: "Because clients like paperwork" },
    { text: "The organization's entire value from the engagement flows through it — findings only drive fixes if they're clearly communicated, prioritized, and actionable; the cleverest exploit is worthless if the report doesn't lead to a fix" },
    { text: "Because the report is legally required to be long" },
    { text: "It isn't; gaining access is the product" }
  ]}
  correct={1}
  explanation="Everything earlier feeds the report. Its job is to change behavior — get the right fixes made in the right order. A finding that doesn't lead to a fix (because it was unclear, unprioritized, or alarmist) failed, regardless of the exploit behind it."
  revisit={{ to: "/docs/offensive/reporting#highlight-the-reports-job-is-to-change-behavior", label: "The report's job" }}
/>

<Question
  prompt="A report should serve which audiences, and how?"
  options={[
    { text: "Only the hacker who wrote it" },
    { text: "Two: leadership (an executive summary in business terms — overall risk and what it means for the business) and engineers (technical findings with severity, exact reproduction, evidence, and remediation they can act on)" },
    { text: "Only the legal department" },
    { text: "Only automated tools" }
  ]}
  correct={1}
  explanation="Leadership needs plain-language business risk to prioritize and fund; engineers need reproducible, specific detail to fix. Framing the same finding for both impact and action is the core reporting skill."
  revisit={{ to: "/docs/offensive/reporting#the-report-has-two-audiences", label: "Two audiences" }}
/>

<Question
  prompt="What's wrong with the finding: 'The application has an access control vulnerability. Severity: High. Fix: Improve access control.'?"
  options={[
    { text: "Nothing — it's clear and actionable" },
    { text: "It's unreproducible and unactionable — no specific location, no steps, no business impact, no concrete fix; the team can't verify, judge, or remediate it" },
    { text: "It's too technical for engineers" },
    { text: "It includes too much customer data" }
  ]}
  correct={1}
  explanation="A useful finding needs a specific title, exact reproduction steps and evidence, plain-language business impact, and a concrete remediation. The vague version gives none, so it can't become a fixable ticket — which is the whole point."
  revisit={{ to: "/docs/offensive/reporting#anatomy-of-a-good-finding", label: "Anatomy of a finding" }}
/>

<Question
  prompt="Why shouldn't you prioritize findings purely by their CVSS score?"
  options={[
    { text: "CVSS scores are randomly assigned" },
    { text: "CVSS measures intrinsic severity but doesn't know YOUR context; a high-CVSS bug on an unreachable, data-free system can be lower RISK than a medium on internet-facing crown jewels — prioritize by risk = likelihood × impact" },
    { text: "CVSS is illegal to use" },
    { text: "You should always ignore severity entirely" }
  ]}
  correct={1}
  explanation="CVSS is a useful input, not the answer. Contextual risk — exploitability and business impact for this organization — is what should drive the order of fixes, echoing the Foundations risk formula. Adjust severity to real exposure."
  revisit={{ to: "/docs/offensive/reporting#severity-and-prioritization-help-them-fix-the-right-things-first", label: "Severity and prioritization" }}
/>

<Question
  prompt="When is a penetration-testing engagement truly complete?"
  options={[
    { text: "The moment the tester gains access" },
    { text: "After a retest confirms the reported findings were actually fixed — a finding isn't closed because someone says it's fixed, but when re-verification proves the fix works" },
    { text: "When the report is emailed, regardless of fixes" },
    { text: "When the contract is signed" }
  ]}
  correct={1}
  explanation="The lifecycle closes with retest: re-verifying that fixes actually resolved the findings (without introducing new gaps). Reported-but-unverified isn't closed. The loop — report then retest — is what makes the risk reduction real."
  revisit={{ to: "/docs/offensive/reporting#close-the-loop-remediation-support-and-retest", label: "Close the loop" }}
/>

</Quiz>

## What's next

→ Take the [Chapter 5 checkpoint](./offensive-checkpoint) to lock in the offensive lifecycle, then continue to [Chapter 6: Detection & Response](/docs/detection) — crossing to the blue team, where you learn to *catch* the very activity this chapter generates.

→ **Going deeper:** the fixes you recommend live in [AppSec](/docs/appsec) and the [secure SDLC](/docs/secure-sdlc); severity/risk framing traces to [Foundations: threat, vulnerability & risk](/docs/foundations/threat-vuln-risk); regulatory impact ties to [Compliance](/docs/compliance).
