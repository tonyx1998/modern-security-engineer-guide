---
id: frameworks
title: The Major Compliance Frameworks
sidebar_position: 2
sidebar_label: The frameworks
description: A map of the frameworks that govern security programs — SOC 2, ISO 27001, PCI-DSS, HIPAA, FedRAMP, GDPR — what each is for, and the crucial distinction between compliance and actual security.
---

# The Major Compliance Frameworks

> **In one line:** Compliance **frameworks** (SOC 2, ISO 27001, PCI-DSS, HIPAA, FedRAMP, GDPR) are structured lists of security controls an organization must demonstrably follow — each aimed at a different domain (general trust, payment cards, health data, government, EU privacy) — and the single most important idea is that **compliance is a *floor*, not the goal: it proves a baseline, but "compliant" never means "secure."**

:::tip[In plain English]
At some point, security stops being purely technical and becomes *governed*: customers, regulators, and partners demand *proof* that you handle data responsibly. **Compliance frameworks** are that proof system — standardized lists of controls ("encrypt data at rest," "review access regularly," "log security events") that an organization commits to following and is then *audited* against. There are several big ones, each for a different context: **SOC 2** (general "can we trust this vendor?"), **PCI-DSS** (handling credit cards), **HIPAA** (US health data), **GDPR** (EU personal data), **ISO 27001** (a comprehensive international standard), **FedRAMP** (selling cloud to the US government). For a beginner, two things matter most. First, a *map* of what each is for, so the alphabet soup makes sense. Second — and this is the lesson security engineers must internalize — **compliance and security are not the same thing.** A company can pass every audit and still get breached, because frameworks set a *minimum bar* and can be satisfied on paper without genuine security. Compliance is necessary and useful, but it's the floor you build *on*, never the ceiling you aim for.
:::

## The frameworks, mapped by purpose

Rather than memorize details (which shift), learn *what each framework is for* — that's durable and tells you which applies to a given organization:

| Framework | Domain / who needs it | What it's fundamentally about |
|-----------|----------------------|-------------------------------|
| **SOC 2** | Service providers (esp. SaaS) proving trustworthiness to customers | Demonstrating controls across "Trust Services Criteria" — security, availability, confidentiality, etc. The common "can we trust this vendor?" report. |
| **ISO 27001** | Any organization, internationally | A comprehensive standard for an **ISMS** (Information Security Management System) — a *systematic, ongoing* approach to managing security risk, not just a control checklist. |
| **PCI-DSS** | Anyone handling **payment card** data | Specific, prescriptive controls to protect cardholder data (mandated by the card brands, not a government). |
| **HIPAA** | US **healthcare** data handlers | Protecting health information (PHI) — privacy and security rules for patient data. |
| **GDPR** | Anyone processing **EU residents'** personal data | A *privacy law* (not just security): consent, data rights, [breach notification](/docs/incident-forensics/breach-determination), and large fines. |
| **FedRAMP** | Cloud providers selling to the **US government** | A rigorous, government-specific cloud-security authorization. |

A few clarifying distinctions beginners find useful:

- **Standard vs. regulation.** Some are *laws* with legal penalties (GDPR, HIPAA); others are *standards* you adopt for trust/business reasons (SOC 2, ISO 27001) or *contractual* requirements (PCI-DSS, mandated by card networks). The consequence of "non-compliance" differs accordingly — fines vs. lost deals.
- **Checklist vs. management system.** PCI-DSS is prescriptive ("do these specific things"); ISO 27001 is about *running a process* to manage risk continuously. SOC 2 is somewhere between — it audits *your* controls against criteria.
- **Security vs. privacy.** GDPR is fundamentally a *privacy* law (about individuals' rights over their data), which overlaps with but isn't identical to security. The others are more security-centric.

:::note[Terms, defined once]
- **Compliance framework** — a defined set of security/privacy controls an organization follows and is audited against.
- **Control** — a specific required safeguard (technical or procedural), e.g., "encrypt data at rest," "review access quarterly."
- **Audit** — an independent assessment that you actually follow the controls, producing a report or certification.
- **Attestation / certification** — the formal output proving compliance (a SOC 2 report, an ISO 27001 certificate).
- **ISMS (Information Security Management System)** — an ongoing, systematic program for managing security risk (the heart of ISO 27001).
- **Scope** — which systems/data a given compliance effort covers (e.g., only the systems touching cardholder data, for PCI).
- **PHI / PII / cardholder data** — categories of regulated data (health / personal / payment) that trigger specific frameworks.
:::

## Compliance is not security

The most important conceptual point in the chapter, and a mistake organizations make constantly. **Passing an audit does not mean you're secure.**

:::caution[Worked example: compliant and breached]
A company passes its annual audit — every control box checked, certificate framed on the wall. Months later, it suffers a major breach. How?

- **Frameworks set a *minimum bar*.** They specify a *baseline* of controls. Real attackers don't stop at the baseline; they find the gaps *between* and *beyond* the checkboxes — the business-logic flaw, the [chained](/docs/offensive/exploitation) weakness, the thing no control happened to cover.
- **Controls can be satisfied "on paper."** "We review access quarterly" can be a genuine, effective process — or a rubber-stamp meeting that approves everything. "Encryption enabled" can coexist with a [hardcoded key](/docs/cryptography/key-management) that makes it meaningless. An auditor checking *existence* of a control may not catch *ineffective* implementation.
- **Compliance is a *point in time*; security is *continuous*.** An audit is a snapshot; the environment changes daily. Compliant on audit day, [misconfigured](/docs/cloud-identity/cspm) the next.
- **The framework may not cover your real risks.** A framework built for general trust may say little about *your* specific, highest-risk attack surface.

This is *not* an argument that compliance is worthless — it genuinely raises the floor, forces baseline hygiene, and builds trust. It's a warning against the dangerous inversion: treating the *audit* as the goal, doing the *minimum* to pass, and mistaking the certificate for actual safety. The mature stance is **build genuine security, and compliance falls out as a byproduct** — not the reverse.
:::

:::info[Highlight: floor, not ceiling]
Hold this framing for the whole chapter: compliance is the *floor* you must clear, not the *ceiling* you aim for. A team that pursues real security — [least privilege](/docs/foundations/defense-in-depth), [secure SDLC](/docs/secure-sdlc), [detection](/docs/detection), [tested IR](/docs/incident-forensics) — will find that *most* compliance requirements are already satisfied, because the frameworks codify good practice. A team that pursues *only* the certificate optimizes for looking secure on audit day, which attackers happily ignore. Aim above the floor; the floor takes care of itself.
:::

## Why frameworks still matter (a lot)

Given all that, why care about compliance at all? Because it does real work:

- **It's a business gate.** Many customers *won't buy* without a SOC 2 report; you *can't* process cards without PCI-DSS or sell to government without FedRAMP. Compliance is often a prerequisite to doing business at all.
- **It forces baseline hygiene.** Frameworks make organizations actually *do* the boring fundamentals (access reviews, logging, encryption, IR plans) that prevent the majority of breaches. The floor is a *useful* floor.
- **It creates accountability and structure.** A framework gives a security program a backbone — defined controls, evidence, and external review — that's hard to maintain on willpower alone.
- **It encodes legal obligations.** GDPR and HIPAA aren't optional; non-compliance means real fines and legal exposure. Knowing them is knowing your duties.

So the goal isn't to dismiss compliance — it's to *operationalize* it well (the rest of this chapter) while never confusing it with the real objective: an organization that's genuinely hard to breach.

## The regulatory wave: from voluntary to mandatory

For most of security's history, the frameworks above were largely *voluntary or contractual* — you adopted SOC 2 to win deals, PCI-DSS because card networks required it. The durable shift to understand is that, recently, **governments moved security from "good practice you choose" toward "legal obligation you must meet"** — adding two things the older frameworks mostly lacked: **mandatory breach *disclosure*** (you must *tell* regulators/investors when you're breached, on a clock) and **vendor *liability*** (the maker of insecure software, not just the victim, bears responsibility).

The durable takeaway — independent of any specific law:

- **Disclosure became mandatory and time-bound.** "Quietly handle the breach internally" is increasingly illegal; regulators now require *timely* notification, which changes [incident response](/docs/incident-forensics) — your IR plan now has a *legal clock* and a regulator audience, not just a technical one.
- **Liability is shifting upstream to vendors.** Regulation increasingly says the *producer* of software must build it securely and handle vulnerabilities (including shipping an [SBOM](/docs/secure-sdlc/supply-chain)), rather than leaving all risk with the customer who deployed it. "Secure by design" became a stated expectation.
- **The map fragmented by jurisdiction.** Where you operate, and where your *users* live, now determines which mandatory regimes apply — so compliance is increasingly a *geographic* question, not just an industry one.

This doesn't change the chapter's thesis — **compliance is still a floor, not security** — but it raises the *legal stakes* of clearing that floor, and it pulls security engineering directly into [incident-response timelines](/docs/incident-forensics/breach-determination) and [supply-chain](/docs/secure-sdlc/supply-chain) obligations.

:::note[Dated box: the specific regimes driving this (verify current)]
The *pattern* above is durable; these specific laws and dates are a **dated snapshot** — confirm current status, scope, and deadlines before relying on them.

- **SEC cybersecurity disclosure (US):** public companies must disclose a *material* cyber incident on Form 8-K (Item 1.05) within **4 business days of determining materiality** (in force since late 2023). The clock starts at the *materiality determination*, not the incident.
- **NIS2 (EU):** broadly expanded security + incident-reporting obligations across "essential" and "important" entities (transposition deadline 2024).
- **DORA (EU):** ICT risk-management and incident-reporting rules for the financial sector (applies from early 2025).
- **EU AI Act:** risk-based regulation of AI systems, applying in phases (prohibited practices first, high-risk obligations later).
- **EU Cyber Resilience Act (CRA):** security requirements for products with digital elements — notably a **mandatory machine-readable SBOM** and coordinated vulnerability handling (phased obligations through ~2027). This is the clearest example of liability moving to the *producer*.
- **CISA Secure by Design (US):** a *voluntary* pledge pushing vendors to ship products secure-by-default and own customer security outcomes — the persuasion side of the same shift.

(Strictly, broad civil *liability* for defective software is being extended by the EU's revised Product Liability Directive, alongside the CRA's product-security duties.)
:::

## Why it matters

- **It's a map of the governance landscape.** Knowing which framework applies where — cards → PCI, EU privacy → GDPR, SaaS trust → SOC 2 — orients you in any security-program conversation.
- **The compliance-≠-security distinction is career-defining judgment.** Engineers who chase checkboxes build fragile programs; those who build real security and let compliance follow build resilient ones. This framing shapes everything downstream.
- **It connects security to the business.** Compliance is where security meets sales, legal, and leadership. Understanding it is how security engineering earns budget and influence.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Mistaking compliant for secure.** Passing an audit is a minimum bar, satisfiable on paper, at a point in time. Attackers ignore your certificate. Build real security; let compliance follow.
- **Optimizing for the audit.** Doing the minimum to pass produces "looks secure on audit day," which is brittle. Pursue genuine security and compliance becomes a byproduct.
- **Memorizing framework trivia instead of purpose.** Specifics shift; what's durable is *what each framework is for* and which applies to your data/business.
- **Ignoring scope.** Compliance covers a defined scope (e.g., only cardholder-data systems for PCI). Misjudging scope means either gaps or wasted effort.
- **Dismissing compliance as pure paperwork.** It's a business gate and forces real baseline hygiene. Underrating it loses deals and skips fundamentals.
- **Confusing privacy with security.** GDPR is a privacy law (data rights), overlapping but not identical to security controls. Treat privacy obligations distinctly.
- **Missing the shift to mandatory disclosure and vendor liability.** Newer regimes (SEC 8-K, NIS2/DORA, EU CRA) make *timely breach disclosure* a legal duty and push *security obligations onto software producers* (incl. SBOMs). Your IR plan now has a legal clock; "handle it quietly" is increasingly illegal.
:::

## Page checkpoint

<Quiz id="frameworks-page" title="Did the frameworks map click?" sampleSize={3}>

<Question
  prompt="What is the single most important conceptual point about compliance frameworks?"
  options={[
    { text: "Passing an audit guarantees you're secure" },
    { text: "Compliance is a floor, not the goal — frameworks set a minimum baseline that can be satisfied on paper and only at a point in time; 'compliant' never means 'secure,' so build real security and let compliance follow" },
    { text: "Frameworks are worthless paperwork" },
    { text: "All frameworks are identical" }
  ]}
  correct={1}
  explanation="Frameworks define a baseline of controls, satisfiable on paper and only as of audit day. Real attackers find gaps beyond the checkboxes. Compliance is the floor you clear, not the ceiling you aim for — pursue genuine security and compliance falls out."
  revisit={{ to: "/docs/compliance/frameworks#compliance-is-not-security", label: "Compliance is not security" }}
/>

<Question
  prompt="A company passes every audit, then suffers a major breach months later. Which explanation is consistent with 'compliance ≠ security'?"
  options={[
    { text: "Audits are illegal" },
    { text: "Frameworks set a minimum bar that attackers ignore; controls can be satisfied 'on paper' (a rubber-stamp access review, encryption with a hardcoded key); and an audit is a point-in-time snapshot while security must be continuous" },
    { text: "The company never had any controls" },
    { text: "Compliance caused the breach" }
  ]}
  correct={1}
  explanation="Attackers exploit gaps beyond the baseline; controls can exist on paper but be ineffective; and a point-in-time audit can't guarantee an environment that changes daily. All explain how 'compliant' and 'breached' coexist — the audit is a floor, not proof of safety."
  revisit={{ to: "/docs/compliance/frameworks#compliance-is-not-security", label: "Compliant and breached" }}
/>

<Question
  prompt="Which framework applies to an organization that processes EU residents' personal data, and what kind of framework is it?"
  options={[
    { text: "PCI-DSS; a payment-card standard" },
    { text: "GDPR; fundamentally a privacy LAW (consent, data rights, breach notification, large fines) — overlapping with but not identical to security" },
    { text: "FedRAMP; a US government cloud authorization" },
    { text: "SOC 2; a vendor-trust report" }
  ]}
  correct={1}
  explanation="GDPR governs processing of EU residents' personal data. It's a privacy law about individuals' rights over their data (with breach-notification duties and significant fines), which overlaps with security but is distinct from it."
  revisit={{ to: "/docs/compliance/frameworks#the-frameworks-mapped-by-purpose", label: "Frameworks by purpose" }}
/>

<Question
  prompt="Given 'compliance ≠ security,' why do frameworks still matter a lot?"
  options={[
    { text: "They don't; you should ignore them" },
    { text: "They're often a business gate (no SOC 2, no deal; no PCI, no card processing), they force baseline hygiene (access reviews, logging, encryption, IR plans), they create accountability/structure, and some encode legal obligations (GDPR, HIPAA)" },
    { text: "Only because auditors need jobs" },
    { text: "Because certificates look nice on a wall" }
  ]}
  correct={1}
  explanation="Compliance is frequently a prerequisite to doing business, forces the boring fundamentals that prevent most breaches, gives a program structure and accountability, and codifies legal duties. The goal is to operationalize it well while never confusing it with real security."
  revisit={{ to: "/docs/compliance/frameworks#why-frameworks-still-matter-a-lot", label: "Why frameworks matter" }}
/>

<Question
  prompt="What is the durable 'regulatory wave' shift in security regulation, and how does it affect a security engineer?"
  options={[
    { text: "Regulation was abolished in favor of voluntary frameworks" },
    { text: "Security moved from largely voluntary/contractual frameworks toward mandatory, time-bound breach DISCLOSURE (e.g., SEC 8-K's 4-business-day clock) and vendor LIABILITY (producers must build securely and ship SBOMs, e.g., the EU CRA) — so your incident-response plan now has a legal clock and a regulator audience, and software-producer obligations grew" },
    { text: "It only affects companies with no security program" },
    { text: "It means compliance now equals security" }
  ]}
  correct={1}
  explanation="The durable pattern: governments added mandatory, timely breach disclosure and pushed security obligations/liability onto software producers (including SBOM mandates), fragmented by jurisdiction. It doesn't change 'compliance is a floor, not security' — but it raises the legal stakes and pulls security engineering into IR timelines and supply-chain duties. The specific laws/dates are dated facts to verify."
  revisit={{ to: "/docs/compliance/frameworks#the-regulatory-wave-from-voluntary-to-mandatory", label: "The regulatory wave" }}
/>

<Question
  prompt="What's the mature relationship between building security and achieving compliance?"
  options={[
    { text: "Do the minimum to pass the audit, then stop" },
    { text: "Build genuine security (least privilege, secure SDLC, detection, tested IR) and compliance falls out as a byproduct, because frameworks codify good practice — rather than chasing the certificate and mistaking it for safety" },
    { text: "Compliance and security are unrelated" },
    { text: "Achieve compliance first, then never improve" }
  ]}
  correct={1}
  explanation="A team pursuing real security finds most compliance requirements already met, since frameworks encode good practice. A team chasing only the certificate optimizes for audit-day appearances attackers ignore. Aim above the floor; the floor takes care of itself."
  revisit={{ to: "/docs/compliance/frameworks#compliance-is-not-security", label: "Floor, not ceiling" }}
/>

</Quiz>

## What's next

→ Continue to [Controls Mapping](./controls-mapping) — the engineering heart of compliance: turning a framework's abstract requirements into concrete technical controls and the evidence that proves they work.

→ **Going deeper:** the breach-notification duties in GDPR/HIPAA are [Chapter 7](/docs/incident-forensics/breach-determination); the controls frameworks require are this entire guide; the risk thinking behind them is [Foundations](/docs/foundations/threat-vuln-risk).
