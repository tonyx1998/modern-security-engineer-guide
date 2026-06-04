---
id: detection-checkpoint
title: Chapter 6 Checkpoint
sidebar_position: 7
sidebar_label: ✅ Chapter checkpoint
description: Prove the detection & response toolkit stuck — a mixed quiz across logging & telemetry, SIEM, detection engineering, alerting & the SOC, and threat intelligence & MITRE ATT&CK.
---

# Chapter 6 Checkpoint

> **The blue-team toolkit, all together.** This mixed quiz pulls from every lesson. Passing means you understand how an organization *sees* an attacker — from collecting the right telemetry to writing high-signal detections, running the SOC that acts on them, and mapping it all to real adversary behavior.

:::tip[How this works]
The quiz samples from a larger bank each attempt. The chapter's through-line: **prevention fails, so you detect — and detection is won or lost on signal quality.** Collect the right logs, correlate them, write *behavior*-based detections, protect human attention from alert fatigue, and prioritize by what real adversaries do. If a question stings, follow its revisit link.
:::

## What you should be able to do now

- **Justify detection** ([assume breach, dwell time](./logging-telemetry)) and collect the right [telemetry](./logging-telemetry) across endpoint, network, cloud, and identity.
- **Explain a [SIEM](./siem)** — aggregation, normalization, and the correlation that turns scattered logs into attack stories.
- **Practice [detection engineering](./detection-engineering)** — the signal/noise tradeoff, the Pyramid of Pain (behavior over indicators), and detection-as-code.
- **Run the [SOC](./alerting-and-soc)** — triage/escalation, and beating alert fatigue with tuning, tiers, playbooks, and automation.
- **Use [threat intel and MITRE ATT&CK](./threat-intel-attack)** — coverage mapping and threat-informed defense.

## The checkpoint

<Quiz id="detection-checkpoint" title="Chapter 6: Detection & Response" sampleSize={6} passingScore={0.67}>

<Question
  prompt="Why does detection exist alongside prevention?"
  options={[
    { text: "Prevention is unnecessary" },
    { text: "Prevention always partially fails and attackers need only one gap; detection shrinks DWELL TIME — catching an intruder before a foothold becomes a catastrophe" },
    { text: "Detection replaces prevention entirely" },
    { text: "Logs are only for compliance" }
  ]}
  correct={1}
  explanation="No prevention is perfect. Detection-and-response is the second layer, reducing how badly each breach hurts by shrinking dwell time — the window where a foothold grows into a disaster."
  revisit={{ to: "/docs/detection/logging-telemetry#why-detection-exists-prevention-is-never-enough", label: "Why detection exists" }}
/>

<Question
  prompt="An attack leaves traces at identity, endpoint, network, and cloud layers. What does collecting all four give you?"
  options={[
    { text: "Nothing — one layer is enough" },
    { text: "Detection in depth — multiple chances to catch an attacker who hides in one layer but is loud in another" },
    { text: "Slower queries only" },
    { text: "Automatic prevention" }
  ]}
  correct={1}
  explanation="The same attack is recorded differently across layers. Collecting all four gives multiple, independent detection opportunities — detection in depth — which is why the noisy post-exploitation phase is the defender's opportunity."
  revisit={{ to: "/docs/detection/logging-telemetry#the-four-telemetry-sources-where-to-look", label: "Four telemetry sources" }}
/>

<Question
  prompt="Why is 'log everything' a failure mode?"
  options={[
    { text: "It's the ideal" },
    { text: "It creates crushing volume and cost, buries signal in noise, and slows queries; collect high-value, security-relevant telemetry with enough context to investigate" },
    { text: "Logs are never useful" },
    { text: "Attackers prefer fewer logs" }
  ]}
  correct={1}
  explanation="Infinite logging drowns signal, explodes cost, and cripples queries. Prioritize security-relevant events (auth, privilege changes, process creation, outbound flows) with enough context to act on."
  revisit={{ to: "/docs/detection/logging-telemetry#the-hard-part-collect-the-right-things-not-everything", label: "Collect the right things" }}
/>

<Question
  prompt="What is a SIEM's defining superpower?"
  options={[
    { text: "Encrypting logs" },
    { text: "Correlation — connecting related events across different sources and time into patterns no single log reveals, after centralizing and normalizing telemetry" },
    { text: "Blocking attacks at the firewall" },
    { text: "Replacing the need to collect logs" }
  ]}
  correct={1}
  explanation="A SIEM centralizes and normalizes telemetry, then correlates events across sources into attack stories. Signal that exists only in the relationship between logs becomes visible — invisible when logs are scattered."
  revisit={{ to: "/docs/detection/siem#correlation-the-thing-a-siem-does-that-nothing-else-can", label: "Correlation" }}
/>

<Question
  prompt="A login from a new country, then unusual admin activity, then access to never-touched servers — each unremarkable alone — together raise a high-confidence alert. This is enabled by:"
  options={[
    { text: "Encryption" },
    { text: "Correlation across centralized, normalized sources — the signal lives in the relationship between events, not in any single one" },
    { text: "A faster CPU" },
    { text: "Log deletion" }
  ]}
  correct={1}
  explanation="No single event was alarming; their relationship is a lateral-movement pattern. Correlation across centralized sources makes that story visible — which requires centralization and normalization first."
  revisit={{ to: "/docs/detection/siem#correlation-the-thing-a-siem-does-that-nothing-else-can", label: "Correlation example" }}
/>

<Question
  prompt="Per the Pyramid of Pain, why detect attacker BEHAVIORS/TTPs over indicators like hashes and IPs?"
  options={[
    { text: "Behaviors are easier to detect" },
    { text: "Hashes/IPs are trivial to change (recompile, switch IP), so those detections break instantly; behaviors are hard to change without abandoning the attack, making behavior detection durable" },
    { text: "IPs and hashes aren't in logs" },
    { text: "Behaviors never appear in telemetry" }
  ]}
  correct={1}
  explanation="Low-pyramid indicators are cheap to evade — one recompile changes a hash. High-pyramid behaviors (e.g., credential-dumping then lateral auth) catch the technique regardless of tool/IP/file, so the attacker can't escape without changing how they attack."
  revisit={{ to: "/docs/detection/detection-engineering#detect-behavior-not-just-indicators-the-pyramid-of-pain", label: "Pyramid of Pain" }}
/>

<Question
  prompt="Why can a noisy detection (many false positives) make you LESS safe?"
  options={[
    { text: "It uses disk space" },
    { text: "It causes alert fatigue — analysts learn to dismiss it as noise, so the real hit is ignored too; false positives actively hide true positives" },
    { text: "It encrypts the wrong data" },
    { text: "It can't — more alerts is safer" }
  ]}
  correct={1}
  explanation="Constant false alarms train analysts to dismiss a rule, so the one real hit dies in the noise. High-signal alerts a human can trust are the goal, not volume. A noisy detection is a bug to tune or kill."
  revisit={{ to: "/docs/detection/detection-engineering#highlight-a-noisy-detection-is-worse-than-no-detection", label: "Noisy detection is worse" }}
/>

<Question
  prompt="What does 'detection-as-code' mean?"
  options={[
    { text: "Writing rules in assembly" },
    { text: "Managing detections like software — version-controlled, peer-reviewed, tested (fires on the attack, quiet on normal), tuned by measuring false-positive rates, and mapped to ATT&CK coverage" },
    { text: "Letting the SIEM auto-write rules with no review" },
    { text: "Deleting detections after one use" }
  ]}
  correct={1}
  explanation="Detection-as-code treats rules as engineered software: in source control, reviewed with rationale, tested for true/false positives, tuned over time, and mapped to technique coverage — not configured once and forgotten."
  revisit={{ to: "/docs/detection/detection-engineering#treat-detections-as-code", label: "Detection as code" }}
/>

<Question
  prompt="A SOC drowns in 5,000 alerts/day (mostly false positives) and auto-dismisses a noisy rule that the real intrusion later trips. What's the lesson?"
  options={[
    { text: "Buy a faster SIEM" },
    { text: "Alert fatigue is a security-control failure — false positives desensitize analysts so the real alert is lost; fix it mostly upstream by tuning detections, not by hiring more people to dismiss more noise" },
    { text: "Encrypt the alerts" },
    { text: "The attacker was undetectable" }
  ]}
  correct={1}
  explanation="'The alert fired but was lost in the noise' is a common breach post-mortem. Excess false positives hide true positives; alert volume/quality is a security control, fixed primarily by tuning detections upstream."
  revisit={{ to: "/docs/detection/alerting-and-soc#alert-fatigue-the-enemy-that-causes-breaches", label: "Alert fatigue" }}
/>

<Question
  prompt="Why is measuring a SOC by 'alerts closed' a bad metric?"
  options={[
    { text: "Closing alerts is impossible" },
    { text: "It rewards rubber-stamping noise as resolved — the behavior that hides breaches; better metrics are MTTD/MTTR, true-positive handling, and dwell time" },
    { text: "Alerts should never be closed" },
    { text: "It's the perfect metric" }
  ]}
  correct={1}
  explanation="Counting closures incentivizes speed-dismissing alerts, including real ones. The SOC's real product is fast, trustworthy decisions — measure detect/respond times and dwell time instead."
  revisit={{ to: "/docs/detection/alerting-and-soc#highlight-the-socs-real-product-is-fast-trustworthy-decisions", label: "The SOC's real product" }}
/>

<Question
  prompt="What is MITRE ATT&CK, and what's its killer use for a blue team?"
  options={[
    { text: "A firewall; it blocks attacks" },
    { text: "A free knowledge base of adversary tactics (goals) and techniques (methods) from real observation; its killer use is coverage mapping — overlaying your detections to see which techniques you'd catch vs. miss, turning 'are we secure?' into a prioritized gap list" },
    { text: "An encryption standard; it protects data" },
    { text: "A SIEM vendor" }
  ]}
  correct={1}
  explanation="ATT&CK catalogs tactics and techniques from real attacks, giving a shared language and map. Overlaying your detections produces a coverage heat map, converting the unanswerable 'are we secure?' into a concrete, prioritized backlog of gaps."
  revisit={{ to: "/docs/detection/threat-intel-attack#coverage-mapping-turning-are-we-secure-into-a-map", label: "Coverage mapping" }}
/>

<Question
  prompt="What is 'threat-informed defense'?"
  options={[
    { text: "Detecting every technique equally" },
    { text: "Prioritizing defenses based on the techniques YOUR actual adversaries use (from threat intel + ATT&CK), rather than spreading effort evenly or chasing headlines" },
    { text: "Outsourcing all decisions to a vendor" },
    { text: "Only defending against nation-states" }
  ]}
  correct={1}
  explanation="Threat-informed defense focuses limited resources on the techniques your likely adversaries actually use, using intel and ATT&CK to prioritize — replacing even-spreading or headline-chasing with adversary-grounded prioritization."
  revisit={{ to: "/docs/detection/threat-intel-attack#coverage-mapping-turning-are-we-secure-into-a-map", label: "Threat-informed defense" }}
/>

</Quiz>

## Chapter 6 complete

You now understand the blue team's craft: accept that prevention fails, collect the right [telemetry](./logging-telemetry), centralize and correlate it in a [SIEM](./siem), write [behavior-based detections](./detection-engineering) tuned for signal, run a [SOC](./alerting-and-soc) that protects human attention from alert fatigue, and prioritize everything against real adversary behavior with [threat intel and MITRE ATT&CK](./threat-intel-attack). Detection turns the attacker's unavoidable noise into your advantage.

→ On to [Chapter 7: Incident Response & Forensics](/docs/incident-forensics) — what happens when a detection becomes a confirmed breach: the disciplined process of containing, investigating, eradicating, and recovering, and the forensics that reconstructs what happened.
