---
id: logging-telemetry
title: Logging & Telemetry
sidebar_position: 2
sidebar_label: Logging & telemetry
description: You can't detect what you don't record — why detection exists at all, and the telemetry (endpoint, network, cloud, identity) that makes seeing an attacker possible.
---

# Logging & Telemetry

> **In one line:** Prevention always partially fails, so security depends on *seeing* malicious activity — and you can only see what you **record**, which makes logging the foundation of all detection: collect the right telemetry from endpoints, network, cloud, and identity, because a log you didn't capture is an attack you'll never detect.

:::tip[In plain English]
Every previous chapter tried to *stop* attacks. This chapter accepts a hard truth: **some attacks will get through.** No prevention is perfect, attackers only need one gap, and [zero-days](/docs/foundations/threat-vuln-risk) exist. So a mature security program adds a second question to "how do we keep them out?" — namely, **"when they get in, how fast do we notice and kick them out?"** That's *detection and response*, the blue team's craft. And it all rests on one humble thing: **logs.** A security camera you never installed records nothing; a log you never collected can't reveal the break-in. Detection is, at bottom, the art of recording the right signals and then noticing the bad ones in the flood. This lesson is the recording part — what telemetry to gather and why — because everything else in the chapter (SIEM, detections, the SOC) operates on the data you collect here. Skip the right logs and the rest is blind.
:::

## Why detection exists: prevention is never enough

The [assume-breach](/docs/foundations/attacker-mindset) mindset, made operational. Three facts force detection into existence:

- **Prevention partially fails.** Patches lag, misconfigurations happen, new vulnerabilities appear, and humans get phished. Over a long enough timeline, *something* gets through.
- **The attacker's advantage is asymmetric.** Defenders must be right everywhere; an attacker needs one success. Pure prevention is a losing bet on perfection.
- **The damage is in the *dwell time*.** The gap between an attacker getting in and being caught — **dwell time** — is where breaches grow from a foothold into a catastrophe (recall the [noisy inward journey](/docs/offensive/post-exploitation)). Detection's whole purpose is to *shrink dwell time*: catch the intruder during their loud lateral movement, before they reach the crown jewels.

So detection is not an admission of failure — it's the necessary second layer. Prevention reduces *how often* you're breached; detection-and-response reduces *how badly* each breach hurts.

:::note[Terms, defined once]
- **Telemetry** — the stream of data systems emit about what they're doing (logs, events, metrics). The raw material of detection.
- **Log** — a timestamped record of an event (a login, a process start, a network connection, an API call).
- **Dwell time** — how long an attacker is present before detection. Shorter = less damage. A key program metric.
- **Detection** — a rule or analytic that identifies suspicious/malicious activity in telemetry.
- **EDR (Endpoint Detection & Response)** — software on endpoints (laptops, servers) that records detailed activity (processes, files, network) and detects/responds to threats.
- **Audit log** — a security-relevant record of *who did what* (especially privileged actions), for detection and forensics.
- **Detection in depth** — collecting telemetry from multiple layers so an attacker who evades one is caught by another (defense in depth for visibility).
:::

## The four telemetry sources (where to look)

An attacker's [post-exploitation journey](/docs/offensive/post-exploitation) crosses several layers, and each layer can record it. Mature detection collects from all four, because attackers who hide in one are often loud in another:

| Source | What it records | Catches (examples) |
|--------|-----------------|--------------------|
| **Endpoint** (EDR) | Process executions, file changes, command lines, local network connections on each host | Malware, [privilege escalation](/docs/offensive/post-exploitation), [living-off-the-land](/docs/offensive/post-exploitation) tool abuse, persistence (new services/tasks) |
| **Network** | Connections, DNS queries, traffic volumes/flows between hosts | [Lateral movement](/docs/offensive/post-exploitation), [C2](/docs/offensive/post-exploitation) beaconing, [exfiltration](/docs/offensive/post-exploitation) (unusual outbound data), [SSRF](/docs/appsec/ssrf) to internal/metadata |
| **Cloud** | API calls / control-plane activity (e.g., who created/changed/deleted resources), via cloud audit logs | Misconfig changes, credential abuse, suspicious resource creation, [metadata-credential](/docs/appsec/ssrf) use from odd locations |
| **Identity** | Authentications, MFA events, privilege grants, role changes | [Credential stuffing](/docs/appsec/broken-authentication), impossible-travel logins, suspicious privilege escalation, new admin accounts |

:::note[Worked example: one attack, four chances to see it]
Trace the [credential-reuse breach](/docs/offensive/post-exploitation) from the offensive chapter through the telemetry:

1. **Phished login** → **Identity** logs show a successful login from a new country/device at an odd hour ("impossible travel").
2. **Local privilege escalation** → **Endpoint** (EDR) logs an unusual privileged process and credential-dumping behavior.
3. **Lateral movement** via reused credentials → **Network** logs a workstation suddenly authenticating to servers it never normally touches; **Identity** logs that service account authenticating in strange places.
4. **Data theft** → **Network** logs a large, unusual outbound transfer; **Cloud** logs mass reads from a storage bucket.

The same attack left a trail at *four* layers. A defender collecting all four has four chances to catch it; one collecting none is blind no matter how good their analysts are. This is **detection in depth** — and it's exactly why the [post-exploitation](/docs/offensive/post-exploitation) phase being "noisy" is the defender's opportunity: the noise lands in these logs.
:::

## The hard part: collect the right things, not everything

Logging has a deceptive trap. "Log everything" sounds safe but is a failure mode: infinite volume, crushing cost, and so much noise that real signals drown (and queries crawl). The skill is collecting **security-relevant, high-value telemetry** at a manageable volume:

- **Prioritize security-relevant events.** Authentications, privilege changes, process creation, admin actions, and outbound network flows carry far more detection value per byte than, say, every debug line.
- **Ensure logs are *useful*** — they need enough context (who, what, when, where, source IP, user, command) to actually investigate. A log saying "error" with no detail is noise.
- **Centralize them** (the next lesson, [SIEM](./siem)) — scattered logs on individual hosts can't be correlated, and an attacker can delete local logs to cover tracks.
- **Protect log integrity.** Attackers delete or tamper with logs to hide ([anti-forensics](/docs/incident-forensics)). Ship logs off-host to a central, append-only store the attacker can't reach, and monitor for logging *stopping* (a gap can itself be a signal).
- **Mind retention.** Breaches are often discovered *months* later (long dwell time); if you only keep 7 days of logs, the evidence is gone. Balance retention against cost deliberately.

:::info[Highlight: a log you didn't collect is an attack you can't detect — or investigate]
This is the foundational constraint of the entire chapter and the next. Detection engineering, SIEM queries, threat hunting, and [forensics](/docs/incident-forensics) can *only* operate on data you captured and kept. The single most common reason an organization can't answer "what did the attacker do?" after a breach is *missing logs*. So logging decisions made calmly, in advance, determine whether you're blind or sighted during an incident. Get this layer right and everything downstream becomes possible; get it wrong and no amount of clever analysis can compensate.
:::

## Why it matters

- **It's the substrate of all detection and response.** SIEM, detections, the SOC, threat hunting, and forensics are *all* operations on telemetry. No telemetry, no blue team.
- **It directly shrinks dwell time.** The faster you can *see* an attacker's noisy steps, the faster you respond — and dwell time is the variable that decides whether a breach is contained or catastrophic.
- **It's where the offensive chapter pays off defensively.** Every [post-exploitation](/docs/offensive/post-exploitation) technique you learned generates signals in one of these four sources. Knowing the attacker's journey tells you exactly what to log and where to look.

## Common pitfalls

:::caution[Where people commonly trip up]
- **"Log everything."** Infinite volume buries signal, balloons cost, and slows queries. Collect high-value, security-relevant telemetry with enough context to investigate.
- **Logging only one layer.** Endpoint-only (or network-only) leaves blind spots; attackers loud in one layer hide in another. Collect across endpoint, network, cloud, and identity.
- **Logs with no context.** "Error" or a bare event with no who/what/when/where can't be investigated. Ensure logs carry actionable detail.
- **Leaving logs on the host.** Local logs can be deleted by the attacker and can't be correlated. Centralize to an append-only store off-host.
- **Too-short retention.** With months-long dwell times, short retention destroys the evidence before discovery. Set retention against realistic detection timelines.
- **Not monitoring for missing logs.** Silence can mean an attacker stopped logging. Treat unexpected logging gaps as a signal, not an absence of one.
:::

## Page checkpoint

<Quiz id="logging-telemetry-page" title="Did logging & telemetry click?" sampleSize={3}>

<Question
  prompt="Why does detection exist as a discipline alongside prevention?"
  options={[
    { text: "Because prevention is unnecessary" },
    { text: "Prevention always partially fails (patches lag, humans get phished, zero-days exist) and attackers need only one gap; detection shrinks DWELL TIME — catching an intruder before a foothold becomes a catastrophe" },
    { text: "Because logs are legally required and nothing more" },
    { text: "Because detection replaces the need for any prevention" }
  ]}
  correct={1}
  explanation="No prevention is perfect, so something eventually gets through. Detection-and-response is the second layer: it reduces how BADLY each breach hurts by shrinking dwell time — the window where a breach grows from foothold to disaster."
  revisit={{ to: "/docs/detection/logging-telemetry#why-detection-exists-prevention-is-never-enough", label: "Why detection exists" }}
/>

<Question
  prompt="The credential-reuse attack leaves traces at four telemetry layers. What does this illustrate?"
  options={[
    { text: "That logging is pointless because attacks are invisible" },
    { text: "Detection in depth — the same attack is recorded at endpoint, network, cloud, and identity layers, so collecting all four gives multiple chances to catch an attacker who hides in one but is loud in another" },
    { text: "That only endpoint logs matter" },
    { text: "That attackers can't be detected once inside" }
  ]}
  correct={1}
  explanation="Impossible-travel login (identity), credential dumping (endpoint), odd authentications (network/identity), and mass data reads (network/cloud) are the same attack seen four ways. Collecting across all layers gives multiple detection opportunities — detection in depth."
  revisit={{ to: "/docs/detection/logging-telemetry#the-four-telemetry-sources-where-to-look", label: "Four telemetry sources" }}
/>

<Question
  prompt="Why is 'log everything' a failure mode rather than the safe choice?"
  options={[
    { text: "It's the ideal approach with no downsides" },
    { text: "It creates crushing volume and cost, buries real signals in noise, and slows queries; the skill is collecting high-value, security-relevant telemetry with enough context to investigate" },
    { text: "Because logs are never useful" },
    { text: "Because attackers prefer verbose logs" }
  ]}
  correct={1}
  explanation="Infinite logging drowns signal, explodes cost, and cripples query performance. Effective logging prioritizes security-relevant events (auth, privilege changes, process creation, outbound flows) with enough context to actually investigate."
  revisit={{ to: "/docs/detection/logging-telemetry#the-hard-part-collect-the-right-things-not-everything", label: "Collect the right things" }}
/>

<Question
  prompt="Why should logs be shipped off the host to a central, append-only store?"
  options={[
    { text: "To save disk space only" },
    { text: "Attackers delete or tamper with local logs to hide; centralizing protects log integrity, enables correlation across systems, and means a logging gap can itself become a signal" },
    { text: "Because local logs are illegal" },
    { text: "It makes no difference where logs live" }
  ]}
  correct={1}
  explanation="Logs left on a compromised host can be wiped by the attacker (anti-forensics) and can't be correlated with other systems. A central append-only store preserves integrity, enables cross-source detection, and lets you alert when logging unexpectedly stops."
  revisit={{ to: "/docs/detection/logging-telemetry#the-hard-part-collect-the-right-things-not-everything", label: "Protect log integrity" }}
/>

<Question
  prompt="What's the single most common reason an organization can't answer 'what did the attacker do?' after a breach?"
  options={[
    { text: "The attacker was too skilled" },
    { text: "Missing logs — detection, hunting, and forensics can only operate on telemetry that was captured AND retained; a log you didn't collect (or already deleted) is an attack you can't reconstruct" },
    { text: "Too much encryption" },
    { text: "The SIEM was too fast" }
  ]}
  correct={1}
  explanation="Everything downstream operates on collected, retained telemetry. With months-long dwell times, missing or expired logs leave investigators blind. Logging and retention decisions made in advance determine whether you can see and reconstruct an incident at all."
  revisit={{ to: "/docs/detection/logging-telemetry#highlight-a-log-you-didnt-collect-is-an-attack-you-cant-detect--or-investigate", label: "A log you didn't collect" }}
/>

</Quiz>

## What's next

→ Continue to [SIEM](./siem) — the system that aggregates all this telemetry into one place where it can be correlated, searched, and turned into detections at scale.

→ **Going deeper:** the attacker behaviors these logs capture are [post-exploitation](/docs/offensive/post-exploitation); using this telemetry after a breach is [Incident Response & Forensics](/docs/incident-forensics).
