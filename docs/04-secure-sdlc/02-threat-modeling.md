---
id: threat-modeling
title: Threat Modeling
sidebar_position: 3
sidebar_label: Threat modeling
description: Systematically imagining how a design could be attacked before you build it — the four questions, data-flow diagrams, STRIDE, attack trees, and a lightweight per-feature ritual.
---

# Threat Modeling

> **In one line:** **Threat modeling** is the structured, design-time version of the [attacker's mindset](/docs/foundations/attacker-mindset) — you draw how a system works, mark where trust changes, and methodically ask "what could go wrong here?" — so you find and fix design flaws on a whiteboard, before they're expensive code in production.

:::tip[In plain English]
Before builders pour a foundation, an architect asks "where could this fail?" — wind, earthquake, flood — and designs against each. **Threat modeling** is that same exercise for software: a deliberate, team-level "let's think like attackers about this design *before* we build it." It's the most powerful [shift-left](./shift-left) activity because it catches the most expensive bugs — *design* flaws, the ones no scanner can find because there's no code yet and nothing is technically "wrong," just architecturally exploitable. The good news: it's not mystical. It boils down to four questions and a couple of light frameworks that turn "imagine all the attacks" (paralysing) into a systematic walk through your own diagram. You already have the core skill from [Foundations](/docs/foundations/trust-boundaries); this lesson makes it a repeatable ritual.
:::

## The four questions

At its heart, every threat-modeling method — however fancy — is answering four questions (popularized by security researcher Adam Shostack). Memorize these; everything else is tooling to help answer them:

1. **What are we building?** — Draw the system: components, data stores, the flows between them, and the [trust boundaries](/docs/foundations/trust-boundaries) they cross.
2. **What can go wrong?** — Enumerate threats against each part (this is where [STRIDE](#stride-a-checklist-for-what-can-go-wrong) helps).
3. **What are we going to do about it?** — Decide a [response](/docs/foundations/threat-vuln-risk) for each real threat: mitigate, accept, transfer, or avoid.
4. **Did we do a good job?** — Review: did we cover the diagram, were the mitigations implemented, has the design changed since?

That's it. A threat model is just a structured pass through those four questions for a specific design.

:::note[Terms, defined once]
- **Threat model** — the artifact: the diagram plus the list of identified threats and decided mitigations.
- **Data-flow diagram (DFD)** — a simple drawing of how data moves: external entities, processes, data stores, data flows, and trust boundaries. The canvas you threat-model on.
- **STRIDE** — a mnemonic checklist of six threat categories (below), used to answer "what can go wrong?" systematically.
- **Attack tree** — a tree with an attacker *goal* at the root and the ways to achieve it branching below; good for reasoning about a specific high-value target.
- **Trust boundary** — (from Foundations) a line where trust level changes; on a DFD, the most threat-rich places, so you draw them explicitly.
- **Abuse case** — the evil twin of a use case: how a feature can be *misused* rather than used.
:::

## Draw it first: the data-flow diagram

You can't reason about attacks on a system you can't see, so threat modeling starts by **drawing the data-flow diagram**. Keep it simple — boxes, arrows, and dashed lines for trust boundaries:

```
   ┌────────────┐        ┌─────────────────────────────┐
   │  Browser   │        │   ‖  (trust boundary)        │
   │ (external) │──HTTPS─┼─▶ [ Web API ] ──▶ [ Database ]
   └────────────┘        │        │                     │
                         │        └──▶ [ Cloud Storage ] │
                         └─────────────────────────────┘
   ‖ = trust boundary (untrusted → trusted)
```

The single most valuable move is **marking every trust boundary** (the dashed lines where untrusted data enters something trusted). Threats cluster at boundaries — recall that [most bugs become breaches at the crossing](/docs/foundations/trust-boundaries). Once the boundaries are drawn, you walk each flow that crosses one and ask what could go wrong.

## STRIDE: a checklist for "what can go wrong?"

Staring at a diagram and "thinking of attacks" is unreliable — you'll miss categories. **STRIDE** is a mnemonic that makes the enumeration systematic. For each element/flow, ask whether each of the six applies. Conveniently, each STRIDE threat is the *violation* of a security property you already know:

| Letter | Threat | It violates… | Example | Typical defense |
|--------|--------|--------------|---------|-----------------|
| **S** | **Spoofing** | Authenticity | Pretending to be another user/service | [Authentication](/docs/appsec/broken-authentication), MFA |
| **T** | **Tampering** | Integrity | Altering data in transit or at rest | [Signatures/MACs](/docs/cryptography/hashing-and-macs), access control |
| **R** | **Repudiation** | Non-repudiation | Denying an action you took | Audit [logging](/docs/detection), signed records |
| **I** | **Information disclosure** | Confidentiality | Leaking data to the unauthorized | [Encryption](/docs/cryptography), [access control](/docs/appsec/broken-access-control) |
| **D** | **Denial of service** | Availability | Making the system unusable | Rate limiting, redundancy, quotas |
| **E** | **Elevation of privilege** | Authorization | Gaining rights you shouldn't have | [Least privilege](/docs/foundations/defense-in-depth), authz checks |

Notice STRIDE is just the [CIA triad](/docs/foundations/cia-triad) plus authenticity and non-repudiation, turned into attacker verbs. If you know the [foundations](/docs/foundations), you already know STRIDE — it's a prompt to check each property at each point.

:::note[Worked example: threat-modeling a file-upload feature]
**Q1 — What are we building?** Users upload profile pictures: `Browser → Upload API → virus-scan → Cloud Storage`, and other users view them via a CDN. One trust boundary at Browser→API; the file is untrusted data.

**Q2 — What can go wrong? (walk STRIDE at the boundary)**
- **S** — Can someone upload *as another user*? (Is the upload tied to the authenticated session, server-side?)
- **T** — Can the file be tampered between scan and storage? Can a user overwrite *another's* image? (Object-level [authz](/docs/appsec/broken-access-control).)
- **R** — If a malicious file is later found, can we trace who uploaded it? (Log uploader + hash.)
- **I** — Could path tricks read other files, or could private images be served to anyone with the URL? (Access control on retrieval, not just obscure URLs.)
- **D** — Can someone upload a 50 GB file or a [zip bomb](/docs/appsec/deserialization-xxe) to exhaust resources? (Size limits, quotas, timeouts.)
- **E** — Could an uploaded file *execute* (a polyglot/SVG-with-script, or a file served as HTML enabling [XSS](/docs/appsec/xss))? (Validate type by content, serve from a separate origin with `Content-Disposition`, strip metadata.)

**Q3 — What do we do?** For each real threat, mitigate (size limits, content-type validation, separate serving origin, object-level authz, upload logging), accept (a low-risk one with a noted decision), or avoid (drop a risky sub-feature).

**Q4 — Did we do a good job?** Confirm each mitigation is actually built, re-model when the design changes (e.g., adding public sharing reopens the **I** threats).

That single STRIDE walk surfaced a half-dozen concrete bugs — XSS, IDOR, DoS, missing logging — *before any code was written.* That's the whole value: catching [Chapter 3's bug classes](/docs/appsec) at design time, for free.
:::

## Attack trees: zooming in on a high-value goal

STRIDE is breadth-first (cover everything). **Attack trees** are depth-first for a *specific* prized goal. Put the attacker's objective at the root and branch into the ways to reach it:

```
GOAL: Read another user's private messages
├── Steal their session         ── via XSS  ── via stolen cookie  ── via network sniff
├── Break authorization         ── IDOR on /messages/{id}  ── admin-function abuse
└── Compromise the database      ── SQL injection  ── leaked DB credentials  ── backup theft
```

Each leaf is a concrete thing to test and defend. Attack trees are great for the crown-jewel scenarios ("how could someone drain a wallet / read all PII / become admin?") where you want exhaustive coverage of one outcome.

## Make it a lightweight ritual, not a heavyweight document

The classic failure of threat modeling is treating it as a giant, one-time, document-heavy ceremony that nobody updates. Modern practice keeps it **small, frequent, and collaborative**:

- **Per-feature, not per-year.** Threat-model each meaningful new feature/design as it's proposed — a 30–60 minute whiteboard session with the people building it.
- **Whoever builds it, models it** (with security support / a [security champion](./shift-left)), so the knowledge lands where the code is written.
- **Output is action items, not a binder** — a short list of threats and the decided mitigations, tracked like any other work.
- **Re-model when the design changes** — new trust boundary, new data type, new integration = new threats.

:::info[Highlight: threat modeling is the cheapest security you'll ever do]
It's a conversation and a drawing. No tools to buy, no code to run. Yet it catches the most expensive category of flaw — *design* flaws that scanners structurally cannot find (there's no buggy code, just an exploitable architecture). An hour at the whiteboard routinely prevents incidents that would cost weeks. This is [shift-left](./shift-left) at its most extreme and highest-leverage.
:::

## Why it matters

- **It catches what nothing else can.** [Insecure Design](/docs/appsec/owasp-top-10) (A04) is its own OWASP category precisely because some flaws are in the architecture, not the code. Threat modeling is the primary defense against them.
- **It's the design-stage anchor of the secure SDLC.** Everything else in this chapter scans *code*; threat modeling secures the *idea* before code exists — the furthest-left, cheapest point.
- **It scales your foundations.** It's the [attacker's mindset](/docs/foundations/attacker-mindset) + [trust boundaries](/docs/foundations/trust-boundaries) + the [risk/response framework](/docs/foundations/threat-vuln-risk), assembled into a repeatable team practice.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Skipping the diagram.** Without a DFD you can't be systematic — you'll brainstorm a few attacks and miss whole boundaries. Draw it first; mark every trust boundary.
- **Treating it as a one-time, heavyweight document.** A binder written once and never updated is dead. Do small, per-feature sessions and re-model on design changes.
- **Free-form brainstorming instead of a checklist.** "Think of attacks" misses categories. Walk STRIDE at each element so coverage is methodical.
- **Modeling without deciding.** A list of threats with no chosen response (mitigate/accept/transfer/avoid) and no tracked action items accomplishes nothing. Threats must become work.
- **Doing it too late.** Threat-modeling after the code is written forfeits most of the savings. The point is to do it at *design* time.
- **Only the security team does it.** That doesn't scale and the knowledge lands in the wrong place. The builders model, with security support.
:::

## Page checkpoint

<Quiz id="threat-modeling-page" title="Did threat modeling click?" sampleSize={3}>

<Question
  prompt="What are the four questions at the heart of any threat-modeling method?"
  options={[
    { text: "Who, what, when, where" },
    { text: "What are we building? What can go wrong? What are we going to do about it? Did we do a good job?" },
    { text: "Is it encrypted? Is it patched? Is it logged? Is it backed up?" },
    { text: "Cost, schedule, scope, quality" }
  ]}
  correct={1}
  explanation="Every method, however elaborate, answers these four: model the system, enumerate threats, decide mitigations, and review. The frameworks (DFDs, STRIDE, attack trees) are just tools to answer them well."
  revisit={{ to: "/docs/secure-sdlc/threat-modeling#the-four-questions", label: "The four questions" }}
/>

<Question
  prompt="Why does threat modeling start by drawing a data-flow diagram and marking trust boundaries?"
  options={[
    { text: "Diagrams look professional in documents" },
    { text: "You can't be systematic about attacks on a system you can't see; threats cluster at trust boundaries, so making them visible lets you methodically walk each crossing" },
    { text: "It's required by law" },
    { text: "To estimate how long coding will take" }
  ]}
  correct={1}
  explanation="The DFD is the canvas. Marking trust boundaries — where untrusted data enters something trusted — focuses attention where bugs become breaches, and turns 'imagine all attacks' into a methodical walk of each flow that crosses a boundary."
  revisit={{ to: "/docs/secure-sdlc/threat-modeling#draw-it-first-the-data-flow-diagram", label: "Draw it first" }}
/>

<Question
  prompt="What does STRIDE provide, and how does it relate to the CIA triad?"
  options={[
    { text: "An encryption algorithm; it replaces CIA" },
    { text: "A six-category checklist (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) for systematically enumerating threats — essentially CIA plus authenticity and non-repudiation, expressed as attacker actions" },
    { text: "A list of approved vendors" },
    { text: "A way to rank developers" }
  ]}
  correct={1}
  explanation="STRIDE makes 'what can go wrong?' systematic by prompting each threat type per element. Each maps to violating a security property you know — CIA plus authenticity and non-repudiation — so it's your foundations turned into attacker verbs."
  revisit={{ to: "/docs/secure-sdlc/threat-modeling#stride-a-checklist-for-what-can-go-wrong", label: "STRIDE" }}
/>

<Question
  prompt="Why is threat modeling described as the cheapest, highest-leverage security activity — and what does it catch that scanners cannot?"
  options={[
    { text: "It requires expensive tools but finds typos" },
    { text: "It's just a conversation and a drawing, yet it catches DESIGN flaws — exploitable architecture with no buggy code for a scanner to flag — at design time before expensive code exists" },
    { text: "It only finds dependency vulnerabilities" },
    { text: "It runs automatically in CI" }
  ]}
  correct={1}
  explanation="Threat modeling needs no tooling and happens before code, yet it finds insecure-design flaws (an OWASP category of their own) that scanners structurally can't — there's no buggy code, just a flawed architecture. An hour of it prevents weeks of incident response."
  revisit={{ to: "/docs/secure-sdlc/threat-modeling#make-it-a-lightweight-ritual-not-a-heavyweight-document", label: "Cheapest security" }}
/>

<Question
  prompt="What's the modern, effective way to run threat modeling?"
  options={[
    { text: "One giant document per year, written by the security team and filed away" },
    { text: "Small, frequent, collaborative per-feature sessions run by the people building it (with security support), producing tracked action items and re-done when the design changes" },
    { text: "Only after the feature ships to production" },
    { text: "Automated entirely by a scanner" }
  ]}
  correct={1}
  explanation="Heavyweight one-time documents die. Effective practice is lightweight: short per-feature whiteboard sessions owned by the builders, outputting tracked mitigations, and re-modeled whenever the design changes (new boundary, data type, or integration)."
  revisit={{ to: "/docs/secure-sdlc/threat-modeling#make-it-a-lightweight-ritual-not-a-heavyweight-document", label: "A lightweight ritual" }}
/>

</Quiz>

## What's next

→ Continue to [Secure Design & Code Review](./secure-design-review) — turning the threats you found into secure architectural choices, and reviewing code for vulnerabilities (not just style) before it merges.

→ **Going deeper:** the design flaws threat modeling targets are OWASP's [Insecure Design](/docs/appsec/owasp-top-10) category; the foundations it assembles are the [attacker's mindset](/docs/foundations/attacker-mindset) and [trust boundaries](/docs/foundations/trust-boundaries).
