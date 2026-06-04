---
id: siem
title: SIEM — Aggregating Security Events
sidebar_position: 3
sidebar_label: SIEM
description: The system that brings all your telemetry into one searchable place — what a SIEM does, correlation across sources, and the modern SIEM/SOAR/XDR landscape (without vendor lock-in to specifics).
---

# SIEM — Aggregating Security Events

> **In one line:** Logs scattered across thousands of systems can't catch an attacker who moves *between* them — a **SIEM** (Security Information and Event Management) solves this by centralizing all your [telemetry](./logging-telemetry) into one searchable place where events from different sources can be **correlated**, turning isolated logs into detectable attack stories.

:::tip[In plain English]
You're now collecting logs from endpoints, network, cloud, and identity — but they live in thousands of separate places, in different formats, and an attacker's actions are spread *across* them: a login here, a process there, a network connection somewhere else. No human can watch thousands of log streams, and no single stream tells the whole story. A **SIEM** is the central nervous system that fixes this: it ingests *all* your logs into one platform, normalizes them into a common format, lets you search across everything at once, and — crucially — **correlates** events from different sources to spot patterns no single log reveals. Think of it as a detective's evidence board where clues from every source are pinned together so the connections become visible. It's where the raw telemetry from the last lesson becomes actual *detection*.
:::

## What a SIEM does

A **SIEM** is a platform that collects, stores, and analyzes security event data from across an environment. Its core jobs:

1. **Aggregate** — ingest logs from every source ([endpoint, network, cloud, identity](./logging-telemetry)) into one place.
2. **Normalize** — parse wildly different log formats into a common schema, so a "user" or "source IP" means the same thing whether it came from a firewall or a cloud audit log. (You can't correlate fields you can't line up.)
3. **Store & search** — keep the data queryable at scale, so an analyst can ask "show every action by this account in the last 30 days across all systems" and get an answer in seconds, not days.
4. **Correlate & alert** — run [detection rules](./detection-engineering) continuously against the incoming stream and fire alerts when patterns match.
5. **Support investigation** — give analysts the pivot-and-drill-down tools to chase a lead across sources (the [SOC](./alerting-and-soc) and [incident response](/docs/incident-forensics) workflow).

:::note[Terms, defined once]
- **SIEM** — Security Information and Event Management: the central platform for aggregating and analyzing security telemetry.
- **Ingestion / log pipeline** — getting logs from their sources into the SIEM (often via agents or forwarders), usually parsed and enriched on the way in.
- **Normalization** — converting diverse log formats into a consistent schema so fields can be compared/correlated.
- **Correlation** — connecting related events across different sources/times into a single picture (the SIEM's superpower).
- **Enrichment** — adding context to events (e.g., geolocating an IP, tagging a user's role, flagging a known-bad indicator) so detections are smarter.
- **SOAR (Security Orchestration, Automation & Response)** — tooling that automates response actions and playbooks (e.g., auto-isolate a host on a confirmed alert).
- **XDR (Extended Detection & Response)** — a more integrated, vendor-unified evolution that bundles telemetry collection, correlation, and response across endpoint/network/cloud.
- **Use case / detection rule** — a specific scenario the SIEM watches for (next lesson).
:::

## Correlation: the thing a SIEM does that nothing else can

A single log is a single fact. The power of a SIEM is connecting facts *across sources and time* into a story a lone log can't tell.

:::note[Worked example: correlation turns four boring logs into one alert]
Individually, each of these events is unremarkable and would never alert on its own:

- **Identity:** user `alice` logs in successfully. *(Happens constantly.)*
- **Identity:** the login is from a country Alice has never logged in from. *(Could be travel.)*
- **Endpoint:** minutes later, Alice's machine spawns an unusual administrative process. *(Admins do admin things.)*
- **Network:** shortly after, that machine starts authenticating to servers it has never contacted before. *(Maybe a new project.)*

A SIEM **correlates** them: *a login from a new location, followed quickly by privilege activity, followed by access to never-before-touched servers, all on one account in a short window.* That *pattern* is a high-confidence [lateral-movement](/docs/offensive/post-exploitation) alert — even though no single event was alarming. This is why centralization matters: the signal exists only in the *relationship between* logs from *different sources*. Scattered on separate hosts, the story is invisible; pinned together on the SIEM's evidence board, it's obvious.
:::

Correlation is also what tames volume: instead of an analyst reading millions of raw events, the SIEM surfaces the handful of *correlated patterns* worth a human's attention.

## Why centralization is non-negotiable

Beyond correlation, centralizing telemetry into a SIEM gives you things scattered logs can't:

- **One place to search.** During an incident, "what did this account/host/IP do everywhere?" must be one query, not a frantic login to fifty systems.
- **Tamper-resistance.** Logs shipped to the SIEM are out of the attacker's reach — they can wipe a host's local logs, but the copy already left the building. (The [log-integrity](./logging-telemetry) point, realized.)
- **Cross-source detection.** Attacks that span layers (the example above) are *only* detectable when the layers' logs sit together.
- **Retention and forensics.** A central store with deliberate [retention](./logging-telemetry) is what lets you investigate a breach discovered months later.

## The modern landscape (kept durable)

The category is evolving, and you'll hear several terms. The *concepts* are stable even as products churn:

- **SIEM** — the core aggregate-correlate-alert platform.
- **SOAR** — adds **automation**: playbooks that take action on alerts (enrich, ticket, or even auto-contain — e.g., disable an account or isolate a host) so the [SOC](./alerting-and-soc) isn't doing everything by hand. Automation is essential because alert volume outpaces human capacity.
- **XDR** — a more **integrated**, single-vendor approach that bundles collection + correlation + response across endpoint/network/cloud, trading flexibility for tighter integration and less setup.

You don't need to pick a side. The throughline is: *centralize telemetry, correlate it into high-signal detections, and automate response where you safely can.* Whether that's a classic SIEM + SOAR or an XDR suite is an architecture choice; the security *function* is the same.

:::info[Highlight: the SIEM is where logs become detection]
The [last lesson](./logging-telemetry) collected the raw material; the SIEM is where it becomes *useful*. Without centralization and correlation, you have a warehouse of disconnected facts no one can act on. With it, you have an evidence board that surfaces attack stories and a search engine for investigating them. Everything else in this chapter — [detection engineering](./detection-engineering), the [SOC's](./alerting-and-soc) work, [threat hunting](./threat-intel-attack) — runs *on top of* the SIEM. It's the platform the blue team lives in.
:::

## Why it matters

- **It makes cross-layer attacks detectable.** Modern intrusions span identity, endpoint, network, and cloud; only a SIEM's correlation sees the whole. Single-source monitoring misses the most important attacks.
- **It's the analyst's workspace.** Triage, investigation, hunting, and incident response all happen in (or from) the SIEM. Its quality shapes how fast and how well a team can respond.
- **It operationalizes the prior lesson.** Logging is potential; the SIEM converts that potential into searchable, correlated, alertable reality — the bridge from "we have logs" to "we can detect."

## Common pitfalls

:::caution[Where people commonly trip up]
- **Treating a SIEM as a log dump.** Just shipping logs in, with no normalization, correlation rules, or tuning, gives you an expensive search box that detects nothing. The value is in the detections and correlation built on top.
- **Skipping normalization.** If fields aren't lined up across sources, you can't correlate them — and correlation is the whole point. Parse and standardize on ingest.
- **Ingesting noise to feel safe.** Pumping in low-value, high-volume logs raises cost and slows queries without improving detection. Prioritize security-relevant, [high-value telemetry](./logging-telemetry).
- **No automation as volume grows.** Doing everything by hand doesn't scale; without SOAR-style automation for enrichment and routine response, analysts drown. Automate the repetitive parts.
- **Forgetting the SIEM is itself a target.** It holds the keys to your whole security picture. Protect access to it tightly — an attacker who blinds or reads your SIEM is dangerous.
:::

## Page checkpoint

<Quiz id="siem-page" title="Did SIEM click?" sampleSize={3}>

<Question
  prompt="What is the core problem a SIEM solves?"
  options={[
    { text: "It encrypts all your logs" },
    { text: "Logs are scattered across thousands of systems in different formats, and an attacker's actions span many of them; a SIEM centralizes and normalizes telemetry so events can be searched and CORRELATED into detectable attack stories" },
    { text: "It replaces the need to collect logs" },
    { text: "It blocks attacks at the firewall" }
  ]}
  correct={1}
  explanation="A SIEM ingests, normalizes, stores, and correlates telemetry from all sources into one searchable platform. Its key power is correlation — connecting events across sources and time into patterns no single log reveals."
  revisit={{ to: "/docs/detection/siem#what-a-siem-does", label: "What a SIEM does" }}
/>

<Question
  prompt="A login from a new country, then unusual admin activity, then access to never-before-touched servers — each unremarkable alone — together fire a high-confidence alert. What SIEM capability enables this?"
  options={[
    { text: "Encryption" },
    { text: "Correlation — connecting related events across different sources and time into a single pattern, surfacing signal that exists only in the RELATIONSHIP between logs, not in any one of them" },
    { text: "Compression" },
    { text: "Log deletion" }
  ]}
  correct={1}
  explanation="No single event was alarming, but their relationship — same account, short window, new-location login → privilege activity → access to new servers — is a lateral-movement pattern. Correlation across centralized sources is what makes that story visible."
  revisit={{ to: "/docs/detection/siem#correlation-the-thing-a-siem-does-that-nothing-else-can", label: "Correlation" }}
/>

<Question
  prompt="Why is normalization a prerequisite for correlation?"
  options={[
    { text: "It compresses logs to save space" },
    { text: "Different sources log in different formats; normalization maps them to a common schema so the same field (user, source IP) lines up across sources — you can't correlate fields you can't compare" },
    { text: "It encrypts the fields" },
    { text: "It deletes duplicate logs" }
  ]}
  correct={1}
  explanation="A firewall and a cloud audit log describe 'user' and 'IP' differently. Normalization standardizes them into one schema so events can be matched and correlated. Without it, the data sits side by side but can't be connected."
  revisit={{ to: "/docs/detection/siem#what-a-siem-does", label: "Normalization" }}
/>

<Question
  prompt="What does SOAR add on top of a SIEM, and why is it increasingly necessary?"
  options={[
    { text: "It adds more log storage" },
    { text: "Automation — playbooks that act on alerts (enrich, ticket, or auto-contain like isolating a host), because alert volume outpaces human capacity, so the routine response work must be automated" },
    { text: "It encrypts the SIEM" },
    { text: "It replaces the analysts entirely with no oversight" }
  ]}
  correct={1}
  explanation="SOAR automates orchestration and response — enrichment, ticketing, and even containment actions on confirmed alerts. As alert volume grows beyond what humans can handle manually, automating the repetitive parts is essential to keep up."
  revisit={{ to: "/docs/detection/siem#the-modern-landscape-kept-durable", label: "SOAR" }}
/>

<Question
  prompt="A team ships all their logs into a SIEM but builds no correlation rules or tuning. What's the result?"
  options={[
    { text: "Perfect detection automatically" },
    { text: "An expensive search box that detects nothing — the value of a SIEM is in the detections and correlation built on top, not in merely storing logs" },
    { text: "The attacks stop on their own" },
    { text: "The logs encrypt themselves" }
  ]}
  correct={1}
  explanation="A SIEM is only as useful as the detection logic on it. Just dumping logs in — no normalization, correlation, or tuned rules — yields a costly warehouse that alerts on nothing. The detections and correlation are where the security value lives."
  revisit={{ to: "/docs/detection/siem#common-pitfalls", label: "Not a log dump" }}
/>

</Quiz>

## What's next

→ Continue to [Detection Engineering](./detection-engineering) — writing the rules that run on the SIEM: how to build detections tied to attacker *behavior* and tune them for signal over noise.

→ **Going deeper:** what to feed the SIEM is [logging & telemetry](./logging-telemetry); what humans do with its alerts is the [SOC](./alerting-and-soc); using it after a breach is [Incident Response & Forensics](/docs/incident-forensics).
