---
id: owasp-top-10
title: The OWASP Top 10 — The Map
sidebar_position: 2
sidebar_label: The OWASP Top 10
description: The industry's shared list of the most critical web application risks — what it is, what each category means, and how it organizes the rest of this chapter.
---

# The OWASP Top 10 — The Map

> **In one line:** The **OWASP Top 10** is the security industry's shared, regularly-updated list of the ten most critical categories of web application risk — and it's the map this chapter follows, because if you can recognize and defend these ten, you've covered the overwhelming majority of how real applications get breached.

:::tip[In plain English]
Imagine a checklist that the whole security profession agrees on: "here are the ten ways web apps most commonly get hacked — make sure none of them apply to yours." That's the OWASP Top 10. **OWASP** (the Open Worldwide Application Security Project) is a nonprofit that, every few years, studies enormous amounts of real-world vulnerability data and publishes the ten *categories* of risk that matter most. It's not an exhaustive list of every bug, and it's not a standard you "comply" with — it's a prioritized starting map. Almost every breach you read about maps to one of these ten. This lesson gives you the whole map at a glance; the rest of the chapter zooms into the ones a security engineer must master cold.
:::

## What OWASP and the Top 10 are

- **OWASP** — the Open Worldwide Application Security Project: a vendor-neutral nonprofit that produces free security resources (the Top 10, testing guides, cheat sheets, and tools like ZAP).
- **The OWASP Top 10** — a periodically refreshed (roughly every 3–4 years) ranking of the most critical web application security **risk categories**, built from real vulnerability data contributed across the industry plus a practitioner survey.

Two things it is *not*, which beginners get wrong:

- It's **not a checklist of individual bugs** — each entry is a broad *category* (e.g., "Injection" covers SQL, command, and several other injection types). Defending the category means defending all its members.
- It's **not a security standard or certification.** "We follow the OWASP Top 10" is a floor, not a guarantee. It's a prioritization aid, not a compliance regime (that's [Chapter 10](/docs/compliance)).

:::note[Terms, defined once]
- **Vulnerability class / category** — a *family* of related weaknesses sharing a root cause and defense (e.g., all injection flaws share "untrusted data interpreted as code").
- **CWE (Common Weakness Enumeration)** — a detailed catalog of specific weakness types. Each OWASP category maps to a set of CWEs; OWASP groups them into ten human-friendly buckets.
- **Risk vs. prevalence vs. severity** — OWASP ranks categories by a blend of how *common* they are, how *easy to exploit*, and how *damaging* — i.e., by [risk](/docs/foundations/threat-vuln-risk), not by any single factor.
:::

## The ten categories (the current map)

The list below reflects the most recent OWASP Top 10. The **exact ranking and titles shift between editions** — that's expected; treat the *categories* as durable and the *ordering* as a dated detail (see the note at the end).

| # | Category | The one-line essence |
|---|----------|----------------------|
| **A01** | **Broken Access Control** | Users can act outside their intended permissions — reach others' data, hit admin functions. The most prevalent category. → [lesson](./broken-access-control) |
| **A02** | **Cryptographic Failures** | Sensitive data not protected properly — missing encryption, weak algorithms, leaked keys. → [Chapter 2](/docs/cryptography) |
| **A03** | **Injection** | Untrusted input is interpreted as a command — SQL, OS commands, and (in this list) **XSS**. → [injection](./injection) · [XSS](./xss) |
| **A04** | **Insecure Design** | The flaw is in the design itself, not a coding bug — a missing control that should have been threat-modeled in. → [Chapter 4](/docs/secure-sdlc) |
| **A05** | **Security Misconfiguration** | Insecure defaults, verbose errors, open cloud storage, unnecessary features left on. |
| **A06** | **Vulnerable & Outdated Components** | Using dependencies with known vulnerabilities — the supply-chain surface. → [Chapter 4](/docs/secure-sdlc) |
| **A07** | **Identification & Authentication Failures** | Weak login, broken sessions, credential stuffing, missing MFA. → [broken auth](./broken-authentication) |
| **A08** | **Software & Data Integrity Failures** | Trusting code/data without verifying it — unsigned updates, **insecure deserialization**, CI/CD tampering. → [deserialization](./deserialization-xxe) |
| **A09** | **Security Logging & Monitoring Failures** | You can't detect or respond to what you don't log. → [Chapter 6](/docs/detection) |
| **A10** | **Server-Side Request Forgery (SSRF)** | The server is tricked into making requests on the attacker's behalf — a pivot into internal systems and cloud metadata. → [SSRF](./ssrf) |

## How the categories cluster (and where this chapter goes deep)

Ten items is a lot to hold at once. They cluster into a few root ideas you already met in [Foundations](/docs/foundations/trust-boundaries):

- **"Untrusted input becomes a command"** → Injection (A03), including XSS, plus SSRF (A10) and deserialization (A08). *The trust-boundary failures.* **This chapter's core.**
- **"The wrong person can do the wrong thing"** → Broken Access Control (A01) and Authentication Failures (A07). *The identity failures.* **Also this chapter's core.**
- **"We protected data badly"** → Cryptographic Failures (A02). *Covered in [Chapter 2](/docs/cryptography).*
- **"We built or configured it wrong / shipped known-bad parts"** → Insecure Design (A04), Misconfiguration (A05), Vulnerable Components (A06). *Process and supply chain — [Chapter 4](/docs/secure-sdlc).*
- **"We can't see what's happening"** → Logging & Monitoring Failures (A09). *Covered in [Chapter 6](/docs/detection).*

This chapter focuses hard on the two **bolded** clusters — injection-family and identity failures — because they're the application-layer bugs a security engineer finds, exploits (in authorized testing), and fixes most. The other clusters are *also* in the Top 10, but their deep treatment lives in the chapters noted.

:::info[Highlight: why a shared list matters]
Before the Top 10, every team argued about what "secure enough" meant. A shared, data-driven list gives the whole industry a common language and a sane default priority order: *fix access control and injection before you obsess over exotic attacks.* When you write a finding, file a ticket, or scope a pentest, referencing the OWASP category instantly tells everyone what you mean and how serious it is.
:::

## Why it matters

- **It's the prioritization most teams actually use.** Limited time? Defend the Top 10 first — by construction, that's where the risk concentrates. It turns "secure the app" (paralysing) into ten concrete, ranked questions.
- **It's the shared vocabulary of the field.** Pentest reports, bug bounty triage, security tickets, and interviews all speak in OWASP categories. "It's an A01 / broken access control issue" is understood instantly.
- **It's the spine of this chapter.** Each remaining lesson takes one (or a cluster) of these categories, shows the attack in a traced example, and gives the durable defense.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Treating it as a complete checklist.** The Top 10 is the *most critical* categories, not *all* risks. Passing a Top-10 review doesn't mean "secure" — business-logic flaws and chapter-specific risks live outside it.
- **Memorizing the ranking instead of the root causes.** The numbers and order change each edition. What's durable is *why* each category exists and *how you defend it* — memorize the defenses, not "A03."
- **Reading it as a compliance standard.** It's guidance, not a regulation. You don't "certify" against the Top 10; you use it to prioritize. Real compliance frameworks are [Chapter 10](/docs/compliance).
- **Stopping at awareness.** Knowing the names is step one. The job is recognizing each in real code and shipping the fix — which is what the rest of this chapter trains.
:::

## Page checkpoint

<Quiz id="owasp-top-10-page" title="Did the OWASP map stick?" sampleSize={3}>

<Question
  prompt="What is the OWASP Top 10, most precisely?"
  options={[
    { text: "A complete checklist of every web vulnerability" },
    { text: "A regularly-updated, data-driven ranking of the ten most critical CATEGORIES of web application risk — a prioritization map, not an exhaustive list or a compliance standard" },
    { text: "A government security regulation you must certify against" },
    { text: "A single tool that scans your app for bugs" }
  ]}
  correct={1}
  explanation="It's a prioritized list of the ten most critical risk categories, refreshed every few years from real-world data. Each entry is a broad category, not one bug — and it's guidance for prioritization, not a complete checklist or a compliance regime."
  revisit={{ to: "/docs/appsec/owasp-top-10#what-owasp-and-the-top-10-are", label: "What it is" }}
/>

<Question
  prompt="In the current Top 10, which category is the most prevalent — letting users act outside their intended permissions?"
  options={[
    { text: "Cryptographic Failures" },
    { text: "Broken Access Control (A01)" },
    { text: "Security Logging Failures" },
    { text: "Server-Side Request Forgery" }
  ]}
  correct={1}
  explanation="Broken Access Control (A01) tops the recent list — users reaching data or functions they shouldn't (e.g., IDOR, missing function-level checks). It's both extremely common and high-impact."
  revisit={{ to: "/docs/appsec/owasp-top-10#the-ten-categories-the-current-map", label: "The ten categories" }}
/>

<Question
  prompt="Why does this chapter focus hardest on the injection-family and identity-failure clusters rather than equally on all ten?"
  options={[
    { text: "The other categories aren't real risks" },
    { text: "Those two clusters are the application-layer bugs a security engineer most directly finds and fixes; other clusters (crypto, supply chain, logging) get deep treatment in their own chapters" },
    { text: "Because they're the easiest to ignore" },
    { text: "Because OWASP says to skip the rest" }
  ]}
  correct={1}
  explanation="Injection (incl. XSS, SSRF, deserialization) and identity failures (broken access control, auth) are the core application-layer attack surface. The other Top-10 clusters are equally real but covered deeply in the crypto, secure-SDLC, and detection chapters."
  revisit={{ to: "/docs/appsec/owasp-top-10#how-the-categories-cluster-and-where-this-chapter-goes-deep", label: "How the categories cluster" }}
/>

<Question
  prompt="A teammate says 'we passed an OWASP Top 10 review, so the app is secure.' What's the correct nuance?"
  options={[
    { text: "They're right — Top 10 coverage means fully secure" },
    { text: "The Top 10 is the most critical categories, not all risks; it's a strong floor, but business-logic flaws and other risks can remain — it's prioritization, not a completeness guarantee" },
    { text: "The Top 10 is irrelevant to real security" },
    { text: "They should have used the Top 100 instead" }
  ]}
  correct={1}
  explanation="Covering the Top 10 addresses where most risk concentrates — a great floor — but it isn't exhaustive. Logic flaws and category-specific issues outside the list can still bite. 'Secure' requires more than Top-10 awareness."
  revisit={{ to: "/docs/appsec/owasp-top-10#common-pitfalls", label: "Not a complete checklist" }}
/>

</Quiz>

:::note[Dated detail]
The specific numbering, titles, and ordering above track the latest OWASP Top 10 edition and **will shift** in future editions (categories get merged, renamed, or re-ranked as data changes). Treat the *categories and their defenses* as evergreen and re-check the current edition for the exact list — this is one of the guide's deliberately version-pinned spots.
:::

## What's next

→ Continue to [Injection](./injection) — the category that most vividly demonstrates the trust-boundary idea: how a single unescaped input turns your database into the attacker's.

→ **Going deeper:** the crypto category is [Chapter 2](/docs/cryptography); design, misconfiguration, and components are [Chapter 4](/docs/secure-sdlc); logging is [Chapter 6](/docs/detection).
