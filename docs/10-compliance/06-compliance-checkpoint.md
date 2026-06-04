---
id: compliance-checkpoint
title: Chapter 10 Checkpoint
sidebar_position: 7
sidebar_label: ✅ Chapter checkpoint
description: Prove the compliance & risk toolkit stuck — a mixed quiz across the major frameworks, controls mapping, audit preparation, the risk register, and vendor & third-party risk.
---

# Chapter 10 Checkpoint

> **The compliance & risk toolkit, all together.** This mixed quiz pulls from every lesson. Passing means you can operationalize governance — treating compliance as a byproduct of genuine security, mapping controls to evidence, surviving audits, running a living risk register, and managing the vendors your security depends on.

:::tip[How this works]
The quiz samples from a larger bank each attempt. The chapter's through-line: **compliance is the floor, not the goal** — build real security and it follows, map controls to demonstrable evidence, make audit-readiness continuous, manage risk explicitly and accountably, and extend all of it to your vendors. If a question stings, follow its revisit link.
:::

## What you should be able to do now

- **Place the [frameworks](./frameworks)** by purpose, and hold the compliance-≠-security line.
- **Map controls** ([lesson](./controls-mapping)) — requirement → concrete control → evidence, and crosswalk one control to many frameworks.
- **Prepare for [audits](./audit-preparation)** — Type I vs. II, and continuous readiness over cramming.
- **Run a [risk register](./risk-register)** — score, own, treat, and keep it alive.
- **Manage [vendor risk](./vendor-risk)** — proportional assessment, least privilege, and you-can't-outsource-the-risk.

## The checkpoint

<Quiz id="compliance-checkpoint" title="Chapter 10: Compliance & Risk" sampleSize={6} passingScore={0.67}>

<Question
  prompt="What is the single most important point about compliance frameworks?"
  options={[
    { text: "Passing an audit guarantees security" },
    { text: "Compliance is a floor, not the goal — frameworks set a minimum baseline, satisfiable on paper and at a point in time; 'compliant' never means 'secure,' so build real security and let compliance follow" },
    { text: "Frameworks are worthless" },
    { text: "All frameworks are identical" }
  ]}
  correct={1}
  explanation="Frameworks define a baseline that attackers ignore, can be met on paper, and only as of audit day. Compliance is the floor you clear, not the ceiling — pursue genuine security and compliance falls out as a byproduct."
  revisit={{ to: "/docs/compliance/frameworks#compliance-is-not-security", label: "Compliance is not security" }}
/>

<Question
  prompt="Which framework applies to processing EU residents' personal data, and what kind is it?"
  options={[
    { text: "PCI-DSS; a card standard" },
    { text: "GDPR; fundamentally a privacy LAW (consent, data rights, breach notification, large fines), overlapping with but not identical to security" },
    { text: "FedRAMP; US government cloud" },
    { text: "SOC 2; a vendor-trust report" }
  ]}
  correct={1}
  explanation="GDPR governs EU residents' personal data as a privacy law about individuals' rights, with breach-notification duties and significant fines — distinct from, though overlapping with, security."
  revisit={{ to: "/docs/compliance/frameworks#the-frameworks-mapped-by-purpose", label: "Frameworks by purpose" }}
/>

<Question
  prompt="What is the three-part translation at the core of controls mapping?"
  options={[
    { text: "Plan, build, ship" },
    { text: "Requirement (abstract framework statement) → Control (specific implemented safeguard for your environment) → Evidence (proof it exists and operates effectively)" },
    { text: "Detect, respond, recover" },
    { text: "Encrypt, log, back up" }
  ]}
  correct={1}
  explanation="Compliance work translates each abstract requirement into a concrete control plus the evidence proving it works. Staying vague or lacking evidence means you aren't actually compliant."
  revisit={{ to: "/docs/compliance/controls-mapping#requirement--control--evidence", label: "Requirement → control → evidence" }}
/>

<Question
  prompt="You implement MFA via SSO once. What's the controls-mapping leverage?"
  options={[
    { text: "It satisfies only one framework" },
    { text: "The same control satisfies many frameworks at once (SOC 2, ISO 27001, PCI, HIPAA, GDPR) — implement and evidence it once, then crosswalk that single artifact to each framework's requirement" },
    { text: "Each framework needs separate MFA" },
    { text: "MFA isn't a compliance control" }
  ]}
  correct={1}
  explanation="Frameworks overlap heavily. A control crosswalk maps one implemented control to every framework that requires it, so facing SOC 2 + ISO + PCI means building common controls once, not triplicate projects."
  revisit={{ to: "/docs/compliance/controls-mapping#the-leverage-map-one-control-to-many-frameworks", label: "One control, many frameworks" }}
/>

<Question
  prompt="What's the difference between a Type I and Type II audit?"
  options={[
    { text: "Type I is harder" },
    { text: "Type I assesses control DESIGN at a point in time; Type II assesses OPERATING EFFECTIVENESS over a whole period (e.g., 12 months), requiring evidence the control worked consistently — which can't be crammed" },
    { text: "They're identical" },
    { text: "Type II only checks documentation" }
  ]}
  correct={1}
  explanation="Type I is a snapshot of design; Type II proves controls operated effectively across a period. The latter needs months of evidence and can't be faked — a skipped quarter is a permanent gap."
  revisit={{ to: "/docs/compliance/audit-preparation#point-in-time-vs-period-why-you-cant-cram", label: "Type I vs II" }}
/>

<Question
  prompt="Why can't you cram for a period (Type II) audit?"
  options={[
    { text: "Auditors work too fast" },
    { text: "It requires evidence the control operated consistently across the period; you can't retroactively manufacture a year of dated records, so a skipped control is a permanent gap — readiness must be continuous" },
    { text: "You can cram easily" },
    { text: "Because audits are random" }
  ]}
  correct={1}
  explanation="Period audits demand proof of consistent operation. A missed quarterly review can't be backfilled with a real past-dated record. Audit readiness is a property of how you operate (continuous evidence), not a pre-audit project."
  revisit={{ to: "/docs/compliance/audit-preparation#point-in-time-vs-period-why-you-cant-cram", label: "Why you can't cram" }}
/>

<Question
  prompt="What does a risk register fundamentally do?"
  options={[
    { text: "Eliminate all risk" },
    { text: "Make risk visible, owned, and tracked — recording each risk, its likelihood×impact score, a named owner, a treatment (mitigate/accept/transfer/avoid), and status — turning Foundations risk thinking into an accountable, ongoing process" },
    { text: "Replace security controls" },
    { text: "Store passwords" }
  ]}
  correct={1}
  explanation="A register operationalizes risk management: each risk is described, scored, owned by a named person, assigned a treatment, and tracked. It converts abstract risk thinking into a maintained, accountable artifact and a compliance proof."
  revisit={{ to: "/docs/compliance/risk-register#whats-in-a-risk-register", label: "What's in a register" }}
/>

<Question
  prompt="What is the deadliest kind of risk?"
  options={[
    { text: "A mitigated risk" },
    { text: "An UN-MANAGED risk — one nobody decided about or owned; most catastrophic breaches involve a known issue that drifted unwatched ('everyone knew, no one acted'), which the register exists to prevent by forcing a documented, owned decision" },
    { text: "A formally accepted risk" },
    { text: "A transferred risk" }
  ]}
  correct={1}
  explanation="The worst risks are undecided and unowned. The register ensures every significant risk is consciously decided and assigned, so nothing dangerous drifts. Acceptance (documented, owned) is fine; ignoring (silent neglect) is the killer."
  revisit={{ to: "/docs/compliance/risk-register#why-writing-it-down-changes-everything", label: "The un-managed risk" }}
/>

<Question
  prompt="Why does a vendor's breach become your breach?"
  options={[
    { text: "It doesn't" },
    { text: "Granting a vendor access or data extends your trust boundary to a system you don't control or see; if they hold your data or can access your environment, their compromise exposes you — and you bear the consequences" },
    { text: "Only with a shared password" },
    { text: "Only if same country" }
  ]}
  correct={1}
  explanation="Depending on a vendor extends your trust boundary to systems beyond your control. Their breach exposes your data or environment, and you carry the fallout. Attackers target soft vendors to reach hard targets."
  revisit={{ to: "/docs/compliance/vendor-risk#why-your-vendors-are-your-risk", label: "Vendors are your risk" }}
/>

<Question
  prompt="How much due diligence should a vendor get?"
  options={[
    { text: "Equal intensive review for all" },
    { text: "Proportional to risk — driven by how much access and how sensitive the data you give them; a payment processor handling all card data gets intense scrutiny, a meeting scheduler with no customer data gets light-touch" },
    { text: "None" },
    { text: "Only same-industry vendors" }
  ]}
  correct={1}
  explanation="You can't assess hundreds of vendors equally. Scale scrutiny to access and data sensitivity — risk = likelihood × impact applied to vendors. Tier them and spend effort where risk concentrates."
  revisit={{ to: "/docs/compliance/vendor-risk#assess-proportionally-to-access", label: "Assess proportionally" }}
/>

<Question
  prompt="What does 'you can outsource the work, not the risk' mean?"
  options={[
    { text: "Vendors are always to blame" },
    { text: "You can delegate a function to a vendor but not the risk or accountability — when data leaks through your vendor, your customers blame you and you may carry the legal/notification obligations; 'the vendor's fault' isn't a defense for data you entrusted" },
    { text: "Outsourcing removes responsibility" },
    { text: "Vendors carry all liability" }
  ]}
  correct={1}
  explanation="Delegating an operation doesn't delegate ownership of its risk. A breach through your processor is still your customers' data and often your duty to notify. Assessing, limiting access, and planning for vendor failure stays with you — shared responsibility generalized."
  revisit={{ to: "/docs/compliance/vendor-risk#the-fourth-party-problem", label: "Outsource work, not risk" }}
/>

<Question
  prompt="Given 'compliance ≠ security,' why do frameworks still matter a lot?"
  options={[
    { text: "They don't" },
    { text: "They're often a business gate (no SOC 2, no deal), force baseline hygiene (access reviews, logging, encryption, IR plans), create accountability/structure, and encode legal obligations (GDPR, HIPAA)" },
    { text: "Only for auditors' jobs" },
    { text: "Because certificates look nice" }
  ]}
  correct={1}
  explanation="Compliance is frequently a prerequisite to doing business, forces the fundamentals that prevent most breaches, gives a program structure, and codifies legal duties. Operationalize it well while never confusing it with real security."
  revisit={{ to: "/docs/compliance/frameworks#why-frameworks-still-matter-a-lot", label: "Why frameworks matter" }}
/>

</Quiz>

## Chapter 10 complete

You can now operationalize governance: treat [compliance as a floor](./frameworks) that follows from real security, [map controls to demonstrable evidence](./controls-mapping), make [audit-readiness continuous](./audit-preparation) instead of a scramble, run a [living risk register](./risk-register) so no risk drifts unowned, and manage [vendor risk](./vendor-risk) because you can't outsource accountability. Compliance becomes a byproduct of doing security well — not a separate paperwork fire drill.

→ On to [Chapter 11: Securing AI Systems](/docs/ai-security) — the new attack surface, where the principles you've built across ten chapters meet entirely new failure modes like prompt injection and the OWASP LLM Top 10.
