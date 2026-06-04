---
id: detection-overview
title: 6. Detection & Response — Overview
sidebar_position: 1
sidebar_label: Detection intro
description: Seeing the attacker in your environment — logging, SIEM, detection engineering, alerting that doesn't drown you, the SOC, threat intelligence, and MITRE ATT&CK.
---

# Part 6: Detection & Response

> **In one line:** Prevention always partially fails, so a security program must *see* malicious activity and act on it — this chapter is the blue-team craft of turning logs into high-signal detections, organizing them with frameworks like MITRE ATT&CK, and running the people-and-process side (the SOC) that responds.

:::tip[In plain English]
You can't stop every attack, so you build the ability to notice one in progress and shut it down fast. That means collecting the right logs, writing **detections** that fire on attacker behavior (not noise), and avoiding the alert-fatigue trap where so many alarms cry wolf that the real one is missed. **MITRE ATT&CK** gives a shared map of attacker techniques to detect against, and the **SOC** (security operations center) is the team/process that watches and responds. This is the defensive counterpart to the [offensive](/docs/offensive) chapter — you detect the very techniques you learned to perform.
:::

## What this chapter covers

- **Logging & telemetry** — what to collect and why (endpoint, network, cloud, identity).
- **SIEM** — aggregating and querying security events at scale.
- **Detection engineering** — writing detections tied to attacker behavior; tuning for signal over noise.
- **Alerting & the SOC** — triage, escalation, on-call, and avoiding alert fatigue.
- **Threat intelligence & MITRE ATT&CK** — mapping detections to known techniques and adversaries.

## The lessons in this chapter

1. **[Logging & Telemetry →](/docs/detection/logging-telemetry)** — why detection exists (assume breach, dwell time) and the telemetry to collect across endpoint, network, cloud, and identity.
2. **[SIEM →](/docs/detection/siem)** — aggregating, normalizing, and correlating all that telemetry into detectable attack stories.
3. **[Detection Engineering →](/docs/detection/detection-engineering)** — signal vs. noise, the Pyramid of Pain (behavior over indicators), and detection-as-code.
4. **[Alerting & the SOC →](/docs/detection/alerting-and-soc)** — triage, escalation, and beating alert fatigue with tiers, playbooks, and automation.
5. **[Threat Intelligence & MITRE ATT&CK →](/docs/detection/threat-intel-attack)** — the shared map of adversary behavior, coverage mapping, and threat-informed defense.

Finish with the **[Chapter 6 checkpoint →](/docs/detection/detection-checkpoint)** to certify the toolkit before Chapter 7.

---

→ Start here: [Logging & Telemetry](/docs/detection/logging-telemetry).
