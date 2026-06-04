---
id: threat-intel-attack
title: Threat Intelligence & MITRE ATT&CK
sidebar_position: 6
sidebar_label: Threat intel & ATT&CK
description: The shared map of adversary behavior — what threat intelligence is (and its levels), how MITRE ATT&CK catalogs tactics and techniques, and how defenders use it to measure coverage and prioritize detections.
---

# Threat Intelligence & MITRE ATT&CK

> **In one line:** **Threat intelligence** is knowledge about adversaries — who attacks, and *how* — and **MITRE ATT&CK** is the field's shared catalog of attacker *tactics and techniques*, which together let a defender stop guessing and instead detect against *real, known* adversary behavior, measure their coverage as a map, and prioritize the detections that matter for their actual threats.

:::tip[In plain English]
So far you've built the machinery to detect attackers — but *which* attacks should you detect first? You can't detect everything, so you need to know what real adversaries actually *do*. **Threat intelligence** is that knowledge: information about attacker groups, their motivations, and their methods, gathered from incidents, research, and shared feeds. And **MITRE ATT&CK** is the breakthrough that organized it — a giant, free, community-maintained matrix that catalogs the *techniques* attackers use, grouped by their *goals*. Instead of every defender independently guessing what to watch for, ATT&CK gives the whole industry a *shared language and map* of adversary behavior. Its superpower for a blue team: you can lay your [detections](./detection-engineering) over the matrix and literally *see* which attacker techniques you'd catch and which you'd miss — turning "are we secure?" (unanswerable) into "here's our coverage and here are the gaps" (actionable). This lesson ties the whole chapter together.
:::

## Threat intelligence: knowing your adversary

**Threat intelligence (CTI)** is processed knowledge about threats — turning raw data about attacks into something that informs defense. It's conventionally split into levels by *who uses it and for what*:

- **Strategic** — high-level, for leadership: *which* adversaries target our industry, their motivations (crime, espionage, hacktivism), and broad trends. Drives risk decisions and budget.
- **Operational** — about specific campaigns and adversary behavior: what a given group is doing right now, their [TTPs](./detection-engineering). Drives what to hunt and detect.
- **Tactical** — concrete, machine-consumable [indicators](./detection-engineering) (IOCs: malicious IPs, hashes, domains) fed into the [SIEM](./siem) for matching.

A recurring beginner mistake is equating threat intel with *just* the tactical IOC feeds. Those are the lowest-value layer (recall the [Pyramid of Pain](./detection-engineering) — IOCs are trivially changed). The durable value is *operational* intel about adversary *behavior* — which is exactly what ATT&CK structures.

:::note[Terms, defined once]
- **Threat intelligence (CTI)** — evidence-based knowledge about adversaries and their methods, used to inform defense.
- **APT (Advanced Persistent Threat)** — a well-resourced, persistent adversary (often nation-state), tracked as a named group.
- **MITRE ATT&CK** — a free, globally-used knowledge base of adversary **tactics** (goals) and **techniques** (methods), based on real-world observation.
- **Tactic** — *why* an attacker does something — the goal of a step (e.g., Initial Access, Persistence, Lateral Movement, Exfiltration). The matrix columns.
- **Technique / sub-technique** — *how* they achieve a tactic (e.g., "Phishing" for Initial Access). The matrix cells.
- **Coverage mapping (heat map)** — overlaying your detections onto the ATT&CK matrix to visualize what you can and can't detect.
- **Threat-informed defense** — prioritizing defenses based on the techniques *your* actual adversaries use, rather than trying to cover everything equally.
:::

## MITRE ATT&CK: the shared map of attacker behavior

**ATT&CK** (Adversarial Tactics, Techniques, and Common Knowledge) is a matrix. The **columns are tactics** — the attacker's goals, in roughly the order of an intrusion — and within each column are the **techniques** that achieve that goal:

```
TACTICS (goals) →   Initial    Execution  Persistence  Priv.    Lateral    Exfiltration
                    Access                             Escalation Movement
TECHNIQUES      │  Phishing    Command    Scheduled    Exploit  Remote     Exfil over
(methods)       │  Exploit     scripting  task         misconfig services  C2 channel
                │  Valid       ...        New account  ...      Pass reused ...
                │  accounts                            ...      creds
```

Notice this *is* the [offensive chapter's lifecycle](/docs/offensive/methodology) and the [post-exploitation journey](/docs/offensive/post-exploitation), formalized: initial access → execution → persistence → privilege escalation → lateral movement → exfiltration. ATT&CK is, in effect, the attacker's playbook written down so defenders can prepare for each move.

Why it changed the field:
- **Shared language.** "We detected T1566 (Phishing) leading to T1078 (Valid Accounts)" means the same thing to every defender, vendor, and report worldwide. No more everyone inventing their own terms.
- **Based on reality.** Techniques come from *observed* real-world attacks, not theory — so detecting them targets what adversaries actually do.
- **Maps offense to defense.** Each technique links to how to *detect* and *mitigate* it, turning "attacker behavior" directly into "what to log and what rule to write."

## Coverage mapping: turning "are we secure?" into a map

The killer application for a blue team. You overlay your [detections](./detection-engineering) onto the ATT&CK matrix to produce a **coverage heat map** — green where you'd detect a technique, red where you're blind.

:::note[Worked example: from anxiety to an action plan]
A security lead is asked "can we detect a ransomware crew?" Without ATT&CK, this is unanswerable hand-waving. With it:

1. **Pick the adversary's techniques.** Threat intel says this ransomware group uses phishing (Initial Access), credential dumping (Credential Access), reused credentials for lateral movement, and disabling backups before encryption.
2. **Map your detections onto those techniques.** You find: phishing — covered; credential dumping — covered ([behavioral detection](./detection-engineering)); lateral movement via reused creds — *gap*; backup tampering — *gap*.
3. **Prioritize the gaps.** Now the work is concrete and ranked: build detections for lateral movement and backup tampering, because *those* are how this specific adversary would slip past you.

The vague dread of "are we secure?" became a *specific, prioritized backlog* tied to a real adversary. That conversion — from anxiety to an action plan grounded in real attacker behavior — is what ATT&CK gives a defender, and it's why it's the organizing framework of modern detection.
:::

This is **threat-informed defense**: rather than spreading effort evenly (or by gut feel), you prioritize the techniques *your* likely adversaries actually use. It connects every chapter — intel says *who and how*, ATT&CK structures it, [detection engineering](./detection-engineering) builds the coverage, the [SOC](./alerting-and-soc) acts on it, and [red teams](/docs/offensive) test it by emulating specific techniques to validate your map is real.

## How it ties the chapter together

ATT&CK is the connective tissue of detection:

- It tells you **what telemetry to collect** ([logging](./logging-telemetry)) — each technique has data sources that reveal it.
- It structures **what detections to write** ([detection engineering](./detection-engineering)) — one per high-priority technique, at the [behavior level](./detection-engineering).
- It lets the **SOC and leadership see coverage and gaps** as a map instead of a feeling.
- It gives **red and blue a shared scorecard** — red emulates techniques, blue checks whether each was detected, and the heat map updates.

:::info[Highlight: stop guessing, start mapping]
The deepest value of ATT&CK is epistemological: it replaces *guessing* about security with *measuring* it against real adversary behavior. "Are we secure?" has no answer. "Which of the techniques our adversaries use can we detect, and where are the gaps?" has a concrete, improvable answer — a map you can color in over time. Defenders who adopt this stop chasing the scary headline of the week and start systematically closing the gaps that matter for *their* threats. That shift — from anxiety-driven to threat-informed — is the mark of a mature detection program.
:::

## Why it matters

- **It makes detection prioritization rational.** You can't detect everything; ATT&CK + threat intel tell you *which* techniques to cover first, based on real adversaries — the antidote to chasing every headline.
- **It's the industry's shared language.** ATT&CK technique IDs appear in vendor products, threat reports, job descriptions, and incident write-ups. Fluency in it is table stakes for a modern defender.
- **It unifies the whole security program.** Offense (techniques to emulate), detection (coverage to build), the SOC (alerts to act on), and leadership (risk to communicate) all speak ATT&CK — turning disconnected efforts into one measurable, threat-informed system.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Equating threat intel with IOC feeds.** Tactical indicators (IPs, hashes) are the lowest-value, most-perishable layer. The durable value is *operational* intel about adversary behavior (TTPs), which ATT&CK structures.
- **Treating ATT&CK as a checklist to 100%.** You can't and shouldn't detect every technique equally. Use threat intel to prioritize the techniques *your* adversaries actually use (threat-informed defense).
- **Mapping coverage once and stopping.** A heat map is a living tool — adversaries evolve, your environment changes, and detections decay. Re-map and re-test (via red teaming) continually.
- **Confusing 'have a detection' with 'it works.'** A green cell you never validated may be a false sense of security. Test detections (emulate the technique) before trusting the map.
- **Ignoring the gaps you don't like.** The valuable cells are often the hard ones (lateral movement, living-off-the-land). Prioritizing only easy techniques leaves the gaps adversaries actually use.
:::

## Page checkpoint

<Quiz id="threat-intel-attack-page" title="Did threat intel & ATT&CK click?" sampleSize={3}>

<Question
  prompt="What is MITRE ATT&CK?"
  options={[
    { text: "A firewall product" },
    { text: "A free, globally-used knowledge base that catalogs adversary TACTICS (goals) and TECHNIQUES (methods) based on real-world observation — giving defenders a shared language and map of attacker behavior" },
    { text: "An encryption standard" },
    { text: "A type of SIEM" }
  ]}
  correct={1}
  explanation="ATT&CK is a matrix of tactics (columns = attacker goals) and techniques (methods to achieve them), derived from observed real attacks. It standardizes how the industry describes adversary behavior and maps offense directly to detection and mitigation."
  revisit={{ to: "/docs/detection/threat-intel-attack#mitre-attck-the-shared-map-of-attacker-behavior", label: "What ATT&CK is" }}
/>

<Question
  prompt="How does ATT&CK turn the unanswerable question 'are we secure?' into something actionable?"
  options={[
    { text: "By scanning all your code" },
    { text: "By letting you overlay your detections onto the matrix to produce a coverage map — showing which adversary techniques you'd catch and which you'd miss — turning vague dread into a specific, prioritized backlog of gaps" },
    { text: "By blocking all attacks automatically" },
    { text: "By encrypting your data" }
  ]}
  correct={1}
  explanation="Coverage mapping overlays your detections on the matrix (green = detected, red = blind). 'Are we secure?' becomes 'which techniques our adversaries use can we detect, and where are the gaps?' — a concrete, improvable map you can prioritize and color in over time."
  revisit={{ to: "/docs/detection/threat-intel-attack#coverage-mapping-turning-are-we-secure-into-a-map", label: "Coverage mapping" }}
/>

<Question
  prompt="Why is equating threat intelligence with IOC feeds (IPs, hashes) a mistake?"
  options={[
    { text: "IOCs are illegal to use" },
    { text: "Tactical IOCs are the lowest-value, most perishable layer (trivially changed by attackers, per the Pyramid of Pain); the durable value is operational intel about adversary BEHAVIOR (TTPs), which ATT&CK structures" },
    { text: "IOCs can't be put in a SIEM" },
    { text: "There's nothing below the strategic level" }
  ]}
  correct={1}
  explanation="IOC feeds are tactical and perishable — attackers change IPs and hashes instantly. The high-value intel is operational knowledge of how adversaries behave (their TTPs), which maps to durable, behavior-based detection. Don't mistake the feed for the whole discipline."
  revisit={{ to: "/docs/detection/threat-intel-attack#threat-intelligence-knowing-your-adversary", label: "Levels of threat intel" }}
/>

<Question
  prompt="What is 'threat-informed defense'?"
  options={[
    { text: "Detecting every possible technique equally" },
    { text: "Prioritizing defenses based on the techniques YOUR actual adversaries use (from threat intel + ATT&CK), rather than spreading effort evenly or chasing the scariest headline" },
    { text: "Outsourcing all security decisions to a vendor" },
    { text: "Only defending against nation-states" }
  ]}
  correct={1}
  explanation="Threat-informed defense focuses limited resources on the techniques your likely adversaries actually employ, using intel and ATT&CK to prioritize. It replaces even-spreading or headline-chasing with rational, adversary-grounded prioritization."
  revisit={{ to: "/docs/detection/threat-intel-attack#coverage-mapping-turning-are-we-secure-into-a-map", label: "Threat-informed defense" }}
/>

<Question
  prompt="How does ATT&CK relate to the offensive chapter you studied earlier?"
  options={[
    { text: "It's unrelated to offense" },
    { text: "ATT&CK's tactics are essentially the offensive lifecycle and post-exploitation journey formalized (initial access → execution → persistence → privilege escalation → lateral movement → exfiltration) — the attacker's playbook written down so defenders can prepare for and detect each move" },
    { text: "It only covers physical security" },
    { text: "It replaces the need to understand attacks" }
  ]}
  correct={1}
  explanation="ATT&CK's columns mirror the attacker lifecycle and post-exploitation steps you learned offensively. It catalogs each technique with how to detect and mitigate it, turning knowledge of attacker behavior directly into defensive coverage — and giving red and blue a shared scorecard."
  revisit={{ to: "/docs/detection/threat-intel-attack#mitre-attck-the-shared-map-of-attacker-behavior", label: "Offense mapped to defense" }}
/>

</Quiz>

## What's next

→ Take the [Chapter 6 checkpoint](./detection-checkpoint) to lock in the blue-team toolkit, then continue to [Chapter 7: Incident Response & Forensics](/docs/incident-forensics) — what happens *after* the SOC escalates a confirmed incident: containing, investigating, and recovering from a breach.

→ **Going deeper:** the techniques ATT&CK catalogs are performed in [Penetration Testing](/docs/offensive); the detections it structures are built in [detection engineering](./detection-engineering); red-team emulation of ATT&CK techniques validates your coverage map.
