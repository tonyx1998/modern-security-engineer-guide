---
id: breach-determination
title: Breach Determination & Notification
sidebar_position: 6
sidebar_label: Breach determination
description: The high-stakes call of whether an incident is a reportable breach — security incident vs. breach, what the evidence must show, the regulatory notification clock, and why honesty and preparation beat cover-ups.
---

# Breach Determination & Notification

> **In one line:** Not every security incident is a legally-reportable **breach** — the determination hinges on whether the evidence shows that *regulated/sensitive data was actually accessed or stolen* — and once it is a breach, a **regulatory clock** starts (often as tight as 72 hours), making this the phase where forensic findings collide with law, and where preparation and honesty matter more than technical skill.

:::tip[In plain English]
You've contained, investigated, and built the [timeline](/docs/incident-forensics/timeline-reconstruction). Now comes a different *kind* of hard question — not technical, but legal and ethical: **do we have to tell people?** There's a critical distinction the law cares about. A *security incident* is anything bad that happened. A *breach* is the specific, regulated subset where *sensitive personal data was actually exposed or stolen* — and that triggers legal obligations to notify regulators and often the affected individuals, frequently on a brutally short deadline (the EU's GDPR gives you **72 hours**). This is where your forensic work becomes high-stakes: the timeline and scope you reconstructed are *exactly* the evidence that decides whether (and what) you must report. Getting it wrong is dangerous in both directions — over-report and you cause needless alarm and cost; under-report (or cover up) and you face escalating legal penalties and destroyed trust. This lesson is that judgment call and the clock around it.
:::

## Incident vs. breach: a distinction with legal teeth

These words are used loosely in conversation but mean very different things to a regulator:

- **Security incident** — *any* event that compromises security: a malware infection, a [phishing](/docs/offensive/reconnaissance) attempt that's caught, a [DoS](/docs/foundations/cia-triad), an attacker who got in but reached nothing sensitive. Most incidents are *not* breaches.
- **(Data) breach** — the subset where **protected/sensitive data was actually accessed, acquired, or disclosed** to an unauthorized party. This is what typically triggers legal notification duties.

The line between them is *what the attacker actually reached*. An attacker who got a foothold on a web server but never accessed the customer database caused an *incident*; one who exfiltrated that database caused a *breach*. The whole point of the [forensic investigation](/docs/incident-forensics/forensic-artifacts) and [timeline](/docs/incident-forensics/timeline-reconstruction) is, in part, to answer this question with evidence.

:::note[Terms, defined once]
- **Security incident** — any compromise of security; the broad category.
- **Data breach** — an incident where sensitive/regulated data was actually accessed, acquired, or disclosed without authorization; the reportable subset.
- **PII / sensitive data** — Personally Identifiable Information (names, SSNs, financials) and other regulated categories (health data, payment cards) whose exposure triggers obligations.
- **Notification obligation** — the legal duty to inform regulators and/or affected individuals within a set timeframe after a breach.
- **GDPR 72-hour rule** — the EU requirement to notify the supervisory authority of a personal-data breach within 72 hours of becoming aware of it.
- **Materiality** — whether an incident is significant enough to require disclosure (a concept in several regulatory regimes).
- **Confidence level** — whether the evidence *confirms* data was taken vs. merely *can't rule it out*, which shapes the determination.
:::

## What the evidence has to show

The determination is an *evidence* question, and it's where your investigation's rigor pays off. You're trying to establish, defensibly:

- **Was sensitive data in the attacker's reach?** Did the timeline show access to systems/stores holding **PII** or regulated data?
- **Was it actually accessed or exfiltrated — or just *reachable*?** There's a meaningful difference between "the attacker was on a server that *had* the database" and "the attacker *queried and exfiltrated* the database." [Network exfiltration evidence](/docs/incident-forensics/forensic-artifacts) and access logs are what distinguish them.
- **What data, and whose?** Scope (which records, which individuals, which jurisdictions) determines *who* must be notified and under *which* laws.

:::note[Why "we can't prove they didn't" often forces disclosure]
Here's the uncomfortable reality that makes [logging](/docs/detection/logging-telemetry) so consequential. Regulators frequently expect notification when you *cannot rule out* that data was accessed — not only when you can *prove* it was. So if an attacker reached a database server but you have *no logs* showing what they did there, you often can't demonstrate that data *wasn't* taken — and must treat it as a breach. Conversely, an organization with thorough [access logging](/docs/detection/logging-telemetry) might *prove* the attacker never actually queried the sensitive table, and avoid a needless notification. This is a direct, expensive payoff of good logging from [Chapter 6](/docs/detection/logging-telemetry): the difference between "we can show exactly what they touched" and "we have to assume the worst" can be millions in notification costs and reputational damage. *Your logging decisions, made calmly in advance, determine your options during the worst week.*
:::

## The regulatory clock

Once an incident is determined to be a breach, **the clock is already running** — and it's short. Notification timeframes are tight and vary by jurisdiction and data type, but the direction is universally toward *fast* disclosure:

- **GDPR** (EU personal data): notify the supervisory authority within **72 hours** of becoming aware, and affected individuals "without undue delay" if there's high risk to them.
- **US**: a patchwork — state breach-notification laws (all 50 states), sector rules (health data, financial), and newer SEC rules requiring public companies to disclose *material* cybersecurity incidents promptly.
- **Sector/contract obligations** — payment-card rules, and contractual duties to business customers, often add their own timelines.

The crucial implication: **72 hours is not enough time to *start* figuring out your process.** You must know in advance who decides, who notifies whom, and what your obligations are — which is why breach determination is part of [IR *preparation*](/docs/incident-forensics/ir-lifecycle), not something you improvise mid-crisis. (The legal frameworks themselves are [Chapter 10: Compliance](/docs/compliance).)

## Honesty beats the cover-up — always

The strongest temptation in this phase is to *minimize* — to under-report, quietly fix it, and hope no one finds out. It is also the most catastrophic mistake, repeatedly proven by real cases:

:::note[Why cover-ups multiply the damage]
Organizations that concealed breaches — hid them from regulators, paid attackers to stay quiet, or delayed disclosure — have consistently fared *far worse* than those that disclosed promptly. The cover-up, when discovered (and it usually is), converts a defensible "we were attacked and responded responsibly" into "we were attacked *and then deceived everyone*." That triggers:
- **Escalated legal penalties** — regulators punish concealment far more harshly than the breach itself.
- **Destroyed trust** — customers forgive being breached; they don't forgive being lied to.
- **Personal liability** — executives have faced personal legal consequences specifically for *covering up*, not for the breach.

The professional, and self-interested, path is the same: **honest, timely disclosure per your obligations.** Breaches happen to everyone; how you *handle* them is what defines you. This mirrors the [blameless, truth-seeking culture](/docs/incident-forensics/ir-lifecycle) of good incident response — secrecy corrupts both.
:::

## Why it matters

- **It's where security meets the law and the public.** The determination decides legal exposure, notification costs, and reputational impact — often the *largest* costs of a breach, dwarfing the technical cleanup.
- **It makes logging's value concrete and financial.** The ability to *prove* what was and wasn't accessed — a direct product of [telemetry](/docs/detection/logging-telemetry) decisions — can be the difference between a contained event and a mass-notification crisis.
- **It demands preparation and integrity, not just skill.** A 72-hour clock and the pull toward cover-ups mean this phase rewards organizations that planned and chose honesty — a fitting capstone to the incident-response discipline.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Conflating incident and breach.** Not every incident is a reportable breach — the line is whether sensitive data was actually accessed/exfiltrated. Determine it on evidence, not assumption.
- **No logs to prove what was accessed.** Without access/exfiltration evidence, you often can't rule out data theft and must assume the worst (and notify). Good logging is what gives you a defensible, narrower determination.
- **Improvising the process during the 72-hour clock.** The deadline is far too short to invent your notification process mid-crisis. Decide roles, obligations, and decision-makers during IR preparation.
- **Under-reporting or covering up.** Concealment escalates penalties, destroys trust, and creates personal liability — consistently worse than the breach itself. Disclose honestly and on time.
- **Ignoring jurisdictional scope.** Different data, individuals, and jurisdictions trigger different laws and timelines. Establish *whose* data and *which* regimes apply.
- **Treating it as purely technical.** Breach determination is a legal/business call informed by forensics — loop in legal and leadership early, not after the technical work.
:::

## Page checkpoint

<Quiz id="breach-determination-page" title="Did breach determination click?" sampleSize={3}>

<Question
  prompt="What distinguishes a 'security incident' from a reportable 'data breach'?"
  options={[
    { text: "Nothing; the terms are interchangeable" },
    { text: "An incident is any security compromise; a breach is the subset where sensitive/regulated data was actually accessed, acquired, or disclosed to an unauthorized party — which triggers legal notification duties" },
    { text: "A breach is smaller than an incident" },
    { text: "An incident involves malware; a breach involves phishing" }
  ]}
  correct={1}
  explanation="Most incidents are not breaches. The legal line is whether sensitive data was actually reached/taken. An attacker who got a foothold but reached nothing sensitive caused an incident; one who exfiltrated the customer database caused a breach with notification obligations."
  revisit={{ to: "/docs/incident-forensics/breach-determination#incident-vs-breach-a-distinction-with-legal-teeth", label: "Incident vs breach" }}
/>

<Question
  prompt="An attacker reached a database server, but you have NO logs of what they did there. How does this typically affect breach determination?"
  options={[
    { text: "No logs means no breach to report" },
    { text: "Regulators often expect notification when you CANNOT rule out data access; without logs proving the data wasn't taken, you usually must treat it as a breach — whereas thorough access logging might prove the sensitive data was never queried" },
    { text: "It's irrelevant; only encryption matters" },
    { text: "You can safely assume nothing was accessed" }
  ]}
  correct={1}
  explanation="The standard is often 'can you rule it out?' not 'can you prove it happened?' Missing logs mean you can't demonstrate data wasn't taken, forcing a worst-case (breach) determination. Good logging can prove a narrower scope — a direct, expensive payoff of Chapter 6 telemetry."
  revisit={{ to: "/docs/incident-forensics/breach-determination#what-the-evidence-has-to-show", label: "Can't prove they didn't" }}
/>

<Question
  prompt="Under GDPR, how quickly must a personal-data breach be reported to the supervisory authority, and what does that imply?"
  options={[
    { text: "Within 30 days; plenty of time to plan" },
    { text: "Within 72 hours of becoming aware — far too short to invent your process mid-crisis, so breach determination and notification must be planned during IR preparation" },
    { text: "There is no deadline" },
    { text: "Only after a full year-long investigation" }
  ]}
  correct={1}
  explanation="GDPR's 72-hour clock (and tight US/sector rules) means you can't figure out your notification process during the incident. Who decides, who notifies whom, and your obligations must be settled in advance — breach determination is part of IR preparation."
  revisit={{ to: "/docs/incident-forensics/breach-determination#the-regulatory-clock", label: "The regulatory clock" }}
/>

<Question
  prompt="Why is covering up or under-reporting a breach considered a catastrophic mistake?"
  options={[
    { text: "It isn't; quietly fixing breaches is best practice" },
    { text: "Concealment, when discovered, escalates legal penalties, destroys trust (customers forgive being breached, not being lied to), and has led to personal liability for executives — consistently worse than the breach itself" },
    { text: "It only matters for very large companies" },
    { text: "Cover-ups are always legal" }
  ]}
  correct={1}
  explanation="Real cases show concealment fares far worse than prompt disclosure: regulators punish deception harder than the breach, trust collapses, and executives have faced personal consequences specifically for covering up. Honest, timely disclosure is both the ethical and self-interested path."
  revisit={{ to: "/docs/incident-forensics/breach-determination#honesty-beats-the-cover-up--always", label: "Honesty beats the cover-up" }}
/>

<Question
  prompt="Why does breach determination make the value of good logging 'concrete and financial'?"
  options={[
    { text: "Logs are sold for profit" },
    { text: "The ability to PROVE what was and wasn't accessed — a direct product of telemetry decisions — can mean the difference between a narrow, defensible determination and a mass-notification crisis, with millions in cost and reputation at stake" },
    { text: "Logging is free, so it has no financial impact" },
    { text: "Logs automatically prevent all breaches" }
  ]}
  correct={1}
  explanation="Whether you can show exactly what an attacker touched — versus having to assume the worst — hinges on logging decided in advance. That difference drives notification scope, cost, and reputational damage, making Chapter 6's telemetry choices a high-stakes financial control."
  revisit={{ to: "/docs/incident-forensics/breach-determination#what-the-evidence-has-to-show", label: "Logging's concrete value" }}
/>

</Quiz>

## What's next

→ Take the [Chapter 7 checkpoint](./incident-forensics-checkpoint) to lock in the incident-response and forensics toolkit, then continue to [Chapter 8: Network Security](/docs/network-security) — back to building defenses, starting with the network layer that so many of these attacks traverse.

→ **Going deeper:** the laws and frameworks behind notification are [Chapter 10: Compliance](/docs/compliance); the logging that determines your evidence is [Chapter 6](/docs/detection/logging-telemetry); the preparation that makes a 72-hour response possible is the [IR lifecycle](./ir-lifecycle).
