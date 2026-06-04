---
id: detection-engineering
title: Detection Engineering
sidebar_position: 4
sidebar_label: Detection engineering
description: Writing detections that fire on attacker behavior, not noise — the signal-vs-noise problem, detecting behavior over indicators, the Pyramid of Pain, and treating detections as tuned, tested code.
---

# Detection Engineering

> **In one line:** **Detection engineering** is the craft of writing the rules that turn [SIEM](./siem) telemetry into alerts — and the entire skill is the tradeoff between catching real attacks and not drowning analysts in false alarms, which is won by detecting *behavior* (hard for attackers to change) rather than brittle *indicators* (trivial to change), and by treating detections as tested, tuned, version-controlled code.

:::tip[In plain English]
A detection is a rule that says "if you see *this* in the logs, raise an alarm." Easy to write; hard to write *well*. The whole problem is a tension: make a rule too broad and it screams constantly at innocent activity (so analysts start ignoring it — the deadly [alert fatigue](./alerting-and-soc) of the next lesson); make it too narrow and a slightly-different attack slips right past. Worse, the *easy* things to detect are the things attackers change in seconds — a specific malware file's fingerprint, an IP address. The *valuable* things to detect are the attacker's underlying **behaviors** — "a user account just did credential-dumping then logged into ten servers" — because the attacker can't easily stop *behaving like an attacker* even when they swap tools. Detection engineering is the discipline of writing rules that target durable behaviors, tested and tuned so they fire on real badness and stay quiet otherwise. It's where a blue team's quality really lives.
:::

## The core tension: signal vs. noise

Every detection lives on a spectrum between two failure modes:

- **False positives** — the rule fires on benign activity. Too many and analysts suffer [alert fatigue](./alerting-and-soc): they stop trusting alerts, and the *real* one gets dismissed as "probably noise again." False positives don't just waste time — they actively *hide* true positives.
- **False negatives** — the rule misses a real attack. The attacker sails through undetected; dwell time grows.

You can't max out both; tightening one tends to loosen the other. Good detection engineering finds the *useful* point on that curve — and, crucially, measures and tunes it over time rather than writing a rule once and forgetting it.

:::note[Terms, defined once]
- **Detection (rule / analytic)** — logic that identifies suspicious activity in telemetry and raises an alert.
- **True/false positive, true/false negative** — alert fired and was real / fired but benign / didn't fire and there was nothing / didn't fire but there was an attack.
- **Indicator of Compromise (IOC)** — a specific artifact of a known attack: a file hash, a malicious IP/domain. Easy to match, easy for attackers to change.
- **TTP (Tactics, Techniques, and Procedures)** — *how* an adversary operates — their behaviors. Durable; the high-value detection target (formalized by [MITRE ATT&CK](./threat-intel-attack)).
- **Pyramid of Pain** — a model ranking indicators by how much *pain* it causes an attacker to change them — low (hashes, IPs) to high (their TTPs/behaviors).
- **Detection-as-code** — managing detections like software: version-controlled, peer-reviewed, and tested.
- **Threat hunting** — proactively searching telemetry for attackers *without* a triggering alert, often to discover gaps that become new detections.
- **Baseline** — a model of "normal" for a user/host/system, so anomalies can be flagged.
:::

## Detect behavior, not just indicators: the Pyramid of Pain

The single most important principle in detection engineering. The **Pyramid of Pain** ranks what you can detect by how badly it hurts the attacker to *evade* it:

```
                 ▲  more PAIN to the attacker (more durable detection)
   TTPs / behaviors   ── attacker must change HOW they operate (very hard)
   Tools              ── attacker must swap toolkits (hard)
   Network/host artifacts ── change file names, registry keys (annoying)
   Domain names       ── register a new domain (easy)
   IP addresses       ── change IP (trivial)
   File hashes        ── recompile, one byte changes the hash (trivial)
                 ▼  less pain (brittle detection)
```

- **Bottom (hashes, IPs):** trivial to detect *and* trivial to evade. A detection keyed to a specific malware hash breaks the instant the attacker recompiles. Necessary as a cheap layer, but low-value alone.
- **Top (TTPs / behaviors):** hard to detect, but if you nail it, the attacker can't easily escape — because changing their *behavior* means changing how they attack at all. A detection for "credential-dumping behavior followed by lateral authentication" catches the *technique* regardless of which tool, IP, or file the attacker uses.

:::note[Worked example: brittle indicator vs. durable behavior]
Two detections for the same threat — an attacker stealing credentials from memory:

- **Brittle (low pyramid):** "Alert if a process with hash `abc123…` runs." → The attacker recompiles their tool (new hash) or uses a different one, and your detection is *blind*. It also misses the [living-off-the-land](/docs/offensive/post-exploitation) version entirely.
- **Durable (high pyramid):** "Alert when *any* process accesses the credential store / reads another process's memory in a way associated with credential theft." → This catches the *behavior* — dumping credentials — no matter what tool, name, or hash performs it. The attacker would have to stop credential-dumping *as a technique* to evade it, which defeats their purpose.

Same threat, wildly different resilience. Investing detection effort *up* the pyramid is what makes a blue team durable against adaptive attackers — and it's exactly why [MITRE ATT&CK](./threat-intel-attack) (a catalog of TTPs) is the field's organizing framework.
:::

## Behavior detection needs a baseline

Detecting "abnormal" behavior requires knowing what *normal* is. A **baseline** models typical activity — which servers a workstation talks to, when a user logs in, how much data a service moves — so the SIEM can flag deviations:

- *This account normally logs in from one city, 9–5; now it's 3 a.m. from another continent.*
- *This server never initiates outbound connections; now it's beaconing to an unknown host every 60 seconds.* ([C2](/docs/offensive/post-exploitation).)
- *This user reads ~10 records a day; now they pulled 50,000.* ([exfiltration](/docs/offensive/post-exploitation).)

Anomaly-based detection is powerful precisely because it doesn't depend on knowing the attacker's specific tools — it flags *behavioral* deviation. Its challenge is false positives (legitimate-but-unusual activity), which is why baselines must be tuned and combined with context.

## Treat detections as code

Mature teams practice **detection-as-code**: detections are written, reviewed, version-controlled, and *tested* like software — not clicked together once in a console and forgotten.

- **Version control & review** — every detection is in source control, peer-reviewed, with a documented rationale (what it catches, why, expected false-positive rate).
- **Test it** — validate that the rule *fires* on the attack (often by safely emulating the technique) and *doesn't* fire on normal activity, before and after changes.
- **Tune continuously** — measure each rule's true/false-positive rate in production and refine. A noisy rule is a bug to fix, not background static to endure.
- **Document and map** — tie each detection to the [ATT&CK technique](./threat-intel-attack) it covers, so you can see your coverage and gaps as a map.

And complement rules with **threat hunting**: analysts proactively searching telemetry for attackers *without* an alert, on a hypothesis ("if an attacker were doing X, what would I see?"). Hunting finds what your current detections miss — and each discovery becomes a new, tuned detection.

:::info[Highlight: a noisy detection is worse than no detection]
This is the counterintuitive core of the discipline. A rule that fires 100 times a day with 99 false positives doesn't make you safer — it makes you *less* safe, because it trains analysts to reflexively dismiss that alert, and the one real hit dies in the noise. The goal is never "more alerts"; it's *high-signal* alerts a human can trust. Every detection you ship is a promise that when it fires, it's worth someone's attention. Breaking that promise repeatedly is how the [next lesson's](./alerting-and-soc) alert fatigue — and the breaches it causes — happen.
:::

## Why it matters

- **It's where detection quality is decided.** Logs and a SIEM are potential; detections are what actually *catch* things. Good ones make a small team effective; bad ones make a big team blind through fatigue.
- **It's the durable counter to adaptive attackers.** Behavior/TTP detection (high pyramid) holds up when attackers change tools, IPs, and files — which they do constantly. This is how you stay ahead instead of always one indicator behind.
- **It directly connects offense to defense.** Every detection targets a [post-exploitation](/docs/offensive/post-exploitation) behavior. Knowing how attackers operate is *precisely* what lets you write detections that catch them — the offensive chapter, repurposed.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Detecting only indicators (hashes, IPs).** They're trivial for attackers to change, so these detections break instantly. Use them as a cheap layer, but invest up the Pyramid of Pain toward behaviors/TTPs.
- **Writing noisy rules and tolerating them.** High false positives cause alert fatigue, which hides true positives. A noisy detection is a bug to tune or kill, not static to endure.
- **No baseline for anomaly detection.** "Flag abnormal" is meaningless without a model of normal. Build and tune baselines so deviations are real signals.
- **Write-once detections.** Threats and environments change; an untested, untuned rule rots. Treat detections as code — versioned, reviewed, tested, and measured.
- **Coverage blind spots.** Without mapping detections to a framework (ATT&CK), you can't see which techniques you'd miss. Map coverage and hunt for the gaps.
- **Relying only on rules, never hunting.** Rules catch known patterns; threat hunting finds the unknowns that become tomorrow's detections. Do both.
:::

## Page checkpoint

<Quiz id="detection-engineering-page" title="Did detection engineering click?" sampleSize={3}>

<Question
  prompt="Why can a noisy detection (many false positives) make an organization LESS safe?"
  options={[
    { text: "It uses too much disk space" },
    { text: "It causes alert fatigue — analysts learn to dismiss it as noise, so the one real hit gets ignored too; false positives actively hide true positives" },
    { text: "It encrypts the wrong data" },
    { text: "It can't — more alerts is always safer" }
  ]}
  correct={1}
  explanation="A rule firing constantly on benign activity trains analysts to reflexively dismiss it, so the real detection dies in the noise. The goal is high-signal alerts a human can trust — not alert volume. A noisy detection is a bug to fix."
  revisit={{ to: "/docs/detection/detection-engineering#highlight-a-noisy-detection-is-worse-than-no-detection", label: "Noisy detection is worse" }}
/>

<Question
  prompt="According to the Pyramid of Pain, why detect attacker BEHAVIORS/TTPs rather than indicators like file hashes and IPs?"
  options={[
    { text: "Behaviors are easier to detect than hashes" },
    { text: "Hashes and IPs are trivial for attackers to change (recompile, switch IP), so those detections break instantly; behaviors/TTPs are hard to change without abandoning the attack itself, making behavior detection far more durable" },
    { text: "IPs and hashes don't appear in logs" },
    { text: "Behaviors never appear in telemetry" }
  ]}
  correct={1}
  explanation="Low-pyramid indicators are cheap to detect but trivial to evade — one recompile changes a hash. High-pyramid behaviors (e.g., credential-dumping then lateral auth) catch the technique regardless of tool/IP/file, so the attacker can't escape without changing how they attack at all."
  revisit={{ to: "/docs/detection/detection-engineering#detect-behavior-not-just-indicators-the-pyramid-of-pain", label: "Pyramid of Pain" }}
/>

<Question
  prompt="Anomaly-based (behavioral) detection flags deviations from normal. What does it require to work, and what's its main challenge?"
  options={[
    { text: "It requires nothing; abnormal is obvious" },
    { text: "It requires a BASELINE of normal (per user/host/system) to measure deviation against; its main challenge is false positives from legitimate-but-unusual activity, so baselines must be tuned and combined with context" },
    { text: "It requires the attacker's file hash" },
    { text: "It only works on encrypted traffic" }
  ]}
  correct={1}
  explanation="To flag 'abnormal' you need a model of 'normal' — login times, typical destinations, usual data volumes. The power is independence from specific tools; the challenge is that unusual-but-legitimate activity causes false positives, demanding tuning and context."
  revisit={{ to: "/docs/detection/detection-engineering#behavior-detection-needs-a-baseline", label: "Baselines" }}
/>

<Question
  prompt="What does 'detection-as-code' mean?"
  options={[
    { text: "Writing detections in assembly language" },
    { text: "Managing detections like software — version-controlled, peer-reviewed, tested (they fire on the attack and stay quiet on normal activity), tuned continuously by measuring false-positive rates, and mapped to ATT&CK coverage" },
    { text: "Letting the SIEM write all rules automatically with no review" },
    { text: "Deleting detections after one use" }
  ]}
  correct={1}
  explanation="Detection-as-code treats rules as engineered software: in source control, reviewed with documented rationale, tested for true/false positives, tuned over time, and mapped to technique coverage — not clicked together once and forgotten."
  revisit={{ to: "/docs/detection/detection-engineering#treat-detections-as-code", label: "Detection as code" }}
/>

<Question
  prompt="What is threat hunting, and how does it relate to detection rules?"
  options={[
    { text: "Waiting for alerts to fire" },
    { text: "Proactively searching telemetry for attackers WITHOUT a triggering alert, on a hypothesis about what an intruder would look like; it finds what current rules miss, and each discovery becomes a new tuned detection" },
    { text: "Buying threat-intelligence feeds only" },
    { text: "Blocking all traffic by default" }
  ]}
  correct={1}
  explanation="Hunting is hypothesis-driven proactive searching — 'if an attacker were doing X, what would I see?' — independent of existing alerts. It surfaces gaps your rules don't cover, and those findings are converted into new detections. Rules catch known patterns; hunting finds the unknowns."
  revisit={{ to: "/docs/detection/detection-engineering#treat-detections-as-code", label: "Threat hunting" }}
/>

</Quiz>

## What's next

→ Continue to [Alerting & the SOC](./alerting-and-soc) — the people and process behind the detections: how a security operations center triages alerts, escalates incidents, and fights the alert fatigue this lesson warned about.

→ **Going deeper:** the framework that catalogs the TTPs you detect is [MITRE ATT&CK](./threat-intel-attack); the attacker behaviors you're writing rules for are [post-exploitation](/docs/offensive/post-exploitation).
