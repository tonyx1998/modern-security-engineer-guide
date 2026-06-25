---
id: timeline-reconstruction
title: Timeline Reconstruction
sidebar_position: 6
sidebar_label: Timeline reconstruction
description: Assembling scattered artifacts into one ordered story — correlating timestamps across sources, finding patient zero and dwell time, the timestamp pitfalls (time zones, clock skew, timestomping), and why the timeline drives every other decision.
---

# Timeline Reconstruction

> **In one line:** **Timeline reconstruction** is the heart of an investigation — stitching timestamped artifacts from [disk, memory, and network](/docs/incident-forensics/forensic-artifacts) into a single ordered story of *what the attacker did, in what order, and for how long* — because that story is what answers the questions everything else depends on: how they got in, what they reached, and whether it's a [reportable breach](/docs/incident-forensics/breach-determination).

:::tip[In plain English]
You've gathered evidence from three sources — now you have to turn a pile of disconnected facts into a *narrative*: "At 2:14 a.m. a phishing link was clicked, at 2:31 a credential was stolen, by 3:05 the attacker reached the customer database, and they were active until 9:12 when we caught them." That story — the **timeline** — is the single most important product of a forensic investigation, because nearly every important question is really a *when* question. *How did they get in?* = find the earliest event. *What did they reach?* = follow the sequence. *How long were they here?* (the [dwell time](/docs/detection/logging-telemetry)) = first event to last. *Did they steal regulated data?* = check what they touched and when. The artifacts are puzzle pieces; the timeline is the assembled picture. And the glue that assembles it is **timestamps** — which is also where the subtle, investigation-wrecking traps live (time zones, clock differences, and attackers who *forge* timestamps).
:::

## Why the timeline is the central artifact

A list of findings ("found malware X," "saw connection Y") isn't an investigation — it's raw material. Investigation is *establishing order and causation*: which event led to which, and what the attacker accomplished between entry and detection. The timeline is what turns evidence into answers:

- **Entry point ("patient zero").** The earliest malicious event reveals *how* the attacker got in — the phish, the [exploited vulnerability](/docs/appsec), the [leaked credential](/docs/offensive/exploitation). Fix that, or they'll return the same way.
- **Scope and impact.** Following the sequence shows every system touched and every data store accessed — which bounds [eradication](/docs/incident-forensics/ir-lifecycle) and [breach determination](/docs/incident-forensics/breach-determination).
- **[Dwell time](/docs/detection/logging-telemetry).** First malicious event to detection — the window the attacker had, and a key measure of detection effectiveness.
- **Attacker objectives.** The *shape* of the sequence (recon → escalate → move toward the database → exfiltrate) reveals what they were *after*, and whether they succeeded.

Without the ordered story, you can't confidently answer any of these — which is why timeline reconstruction is where the investigation's value is realized.

:::note[Terms, defined once]
- **Timeline** — the ordered sequence of events reconstructed from evidence, with timestamps.
- **Patient zero / initial access** — the first compromised system or the entry event; where the attack began.
- **Super timeline** — a combined timeline merging timestamps from *many* sources (filesystem, logs, memory, network) into one master sequence.
- **Timestamp normalization** — converting all timestamps to a single time zone/format (usually UTC) so events from different sources can be ordered correctly.
- **Clock skew** — different systems' clocks disagreeing, which misorders events unless corrected.
- **Timestomping** — an [anti-forensic](/docs/incident-forensics/chain-of-custody) technique where an attacker *forges* file timestamps to hide or mislead.
- **Correlation** — matching related events across sources by time (and other keys) to establish sequence and causation.
- **Pivot point** — a moment in the timeline where the attacker changed systems or escalated, useful for following the chain.
:::

## Building the timeline: correlate across sources

You assemble the timeline by gathering every timestamped event from all [three sources](/docs/incident-forensics/forensic-artifacts) and ordering them into one sequence (a **super timeline**):

- **Disk** — file creation/modification times, log entries, registry changes ([persistence](/docs/offensive/post-exploitation)).
- **Memory** — what was running and connected at capture time (a single moment, but a rich one).
- **Network** — connection times, [C2 beaconing](/docs/offensive/post-exploitation) intervals, [exfiltration](/docs/offensive/post-exploitation) bursts.
- **Centralized logs** — the [SIEM's](/docs/detection/siem) correlated record, often the most reliable because it's [off-host and tamper-resistant](/docs/detection/logging-telemetry).

The power is the same as [SIEM correlation](/docs/detection/siem), applied to a single incident: an event in one source explains an event in another. A disk artifact (malware created at 02:14) plus a network event (outbound connection at 02:15) plus a log entry (privileged login at 02:31) become a *causal chain*, not three isolated facts.

:::note[Worked example: a timeline tells the story three isolated facts can't]
Three findings, each meaningless alone:
- **Disk:** a file `update.exe` was created at `02:14:07`.
- **Network:** an outbound connection to `185.x.x.x` began at `02:15:30`.
- **Identity log:** the service account `svc-backup` logged into the database server at `03:05:12`.

Ordered into a timeline, a *story* emerges:
```
02:14:07  update.exe written to the workstation        → initial tooling dropped
02:15:30  workstation connects out to 185.x.x.x        → C2 established
02:18    (memory) credential-dumping process running   → credentials harvested
02:31    svc-backup authenticates from the workstation → stolen credential reused
03:05:12 svc-backup logs into the DATABASE server      → reached the objective
03:40    large outbound transfer from DB server        → exfiltration
```
Now you can answer the questions: **entry** was the workstation at 02:14; **dwell time** ran from 02:14 to detection; **impact** includes the database (so [breach determination](/docs/incident-forensics/breach-determination) is in play); and the **objective** was clearly the database's data. The same facts, *unordered*, told you nothing. The timeline is the investigation.
:::

## The timestamp traps that wreck timelines

Timestamps are the glue — and they're treacherous. Three classic traps misorder events and produce *wrong* conclusions:

1. **Time zones.** Different systems log in different time zones (local vs. UTC). If you don't **normalize everything to one zone (UTC by convention)**, an event that happened *first* can appear *later*, scrambling the sequence. *Always convert to a single zone before ordering.*
2. **Clock skew.** Machines' clocks drift and disagree. If server A's clock is 4 minutes ahead of server B's, correlating their logs by raw timestamp misorders events across them. *Account for known skew*; this is also why synchronized time (NTP) across an environment is a quiet but important security control.
3. **Timestomping (forged timestamps).** Attackers deliberately *alter* file timestamps ([anti-forensics](/docs/incident-forensics/chain-of-custody)) to hide their tracks or frame an earlier-looking origin. *Never trust a single timestamp source.* Cross-check filesystem times against logs, memory, and network evidence — forged timestamps usually *conflict* with the harder-to-forge records (network captures, off-host logs), and that conflict itself is a clue.

:::note[Why corroboration beats any single source]
The defense against all three traps is the same: **corroborate across independent sources.** A file's on-disk timestamp can be wrong (time zone), drifted (skew), or forged (timestomping) — but if the *centralized log*, the *network capture*, and the *memory snapshot* agree on the sequence, you have a reliable timeline. Attackers can tamper with the host they control; they have a much harder time forging the *off-host* records consistently. A timeline built on one source is fragile; one built on agreeing independent sources is defensible. This is exactly why you collected [all three artifact types](/docs/incident-forensics/forensic-artifacts) and kept [tamper-resistant off-host logs](/docs/detection/logging-telemetry).
:::

## Why it matters

- **It produces the answers everything depends on.** Entry point, scope, dwell time, and impact — the inputs to [eradication](/docs/incident-forensics/ir-lifecycle), [breach notification](/docs/incident-forensics/breach-determination), and [lessons learned](/docs/incident-forensics/ir-lifecycle) — all come from the timeline. Get it wrong and every downstream decision is wrong.
- **It's where evidence becomes understanding.** Artifacts are facts; the timeline is comprehension. The investigative skill is in the ordering and correlation, not just the collection.
- **It exposes the timestamp pitfalls that fool the careless.** Knowing about time zones, skew, and timestomping is what separates a defensible reconstruction from a confidently-wrong one.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Not normalizing time zones.** Mixing local and UTC timestamps scrambles the order and produces a false story. Convert everything to one zone (UTC) before ordering.
- **Ignoring clock skew.** Correlating across systems with drifted clocks misorders cross-system events. Account for skew; synchronized time (NTP) prevents it.
- **Trusting a single timestamp source.** Attackers timestomp on-disk timestamps. Cross-check against logs, network, and memory; conflicts reveal the forgery.
- **Collecting facts without ordering them.** A list of findings isn't an investigation. The value is the ordered, causal sequence — build the timeline.
- **Anchoring on the first thing you find.** The artifact you noticed first is rarely patient zero. Work the timeline backward to the *earliest* malicious event to find true initial access.
- **Building on one source.** A timeline from one source is fragile to tampering. Corroborate across independent, especially off-host, sources for a defensible account.
:::

## Page checkpoint

<Quiz id="timeline-reconstruction-page" title="Did timeline reconstruction click?" sampleSize={3}>

<Question
  prompt="Why is the timeline considered the central product of a forensic investigation?"
  options={[
    { text: "It makes the report look longer" },
    { text: "Nearly every key question is a 'when' question — how they got in (earliest event), what they reached (the sequence), dwell time (first to last event), and whether regulated data was touched — so the ordered story is what turns evidence into answers" },
    { text: "Because timestamps are easy to read" },
    { text: "It replaces the need to collect evidence" }
  ]}
  correct={1}
  explanation="A list of findings is raw material; the investigation is establishing order and causation. Entry point, scope, dwell time, and impact all come from the timeline, which is why it drives eradication, breach determination, and lessons learned."
  revisit={{ to: "/docs/incident-forensics/timeline-reconstruction#why-the-timeline-is-the-central-artifact", label: "Why the timeline is central" }}
/>

<Question
  prompt="Three findings — a file created at 02:14, an outbound connection at 02:15, a service-account DB login at 03:05 — are meaningless alone. What does ordering them into a timeline provide?"
  options={[
    { text: "Nothing new; they're still separate facts" },
    { text: "A causal story: tooling dropped → C2 established → credential reused → database reached → exfiltration; now you can answer entry point, dwell time, scope, and the attacker's objective" },
    { text: "Only the file's size" },
    { text: "The attacker's home address" }
  ]}
  correct={1}
  explanation="Ordered, the same facts reveal a chain of cause and effect — initial access, C2, lateral movement, objective, exfiltration — answering the questions every downstream decision needs. Unordered, they told you nothing. The timeline is the investigation."
  revisit={{ to: "/docs/incident-forensics/timeline-reconstruction#building-the-timeline-correlate-across-sources", label: "Worked example" }}
/>

<Question
  prompt="Why must all timestamps be normalized to a single time zone (usually UTC) before building a timeline?"
  options={[
    { text: "UTC is legally required for logs" },
    { text: "Systems log in different time zones; without normalization, an event that happened first can appear later, scrambling the sequence and producing a false story" },
    { text: "It compresses the timeline" },
    { text: "Time zones don't affect ordering" }
  ]}
  correct={1}
  explanation="Mixing local and UTC times misorders events — a real cause can look like it came after its effect. Converting everything to one zone (UTC by convention) before ordering is essential to a correct sequence."
  revisit={{ to: "/docs/incident-forensics/timeline-reconstruction#the-timestamp-traps-that-wreck-timelines", label: "Time zone trap" }}
/>

<Question
  prompt="What is 'timestomping,' and how do you defend against being fooled by it?"
  options={[
    { text: "A clock synchronization protocol; you enable it" },
    { text: "An anti-forensic technique where an attacker FORGES file timestamps to hide or mislead; defend by never trusting a single source — cross-check disk timestamps against off-host logs, network captures, and memory, where conflicts expose the forgery" },
    { text: "A type of malware that deletes files" },
    { text: "A way to speed up the timeline" }
  ]}
  correct={1}
  explanation="Timestomping alters on-disk timestamps to mislead investigators. Since attackers control the host but struggle to consistently forge off-host records, corroborating across independent sources (logs, network, memory) reveals the inconsistency — and the forgery itself becomes a clue."
  revisit={{ to: "/docs/incident-forensics/timeline-reconstruction#the-timestamp-traps-that-wreck-timelines", label: "Timestomping" }}
/>

<Question
  prompt="What's the best defense against ALL the timestamp traps (time zones, clock skew, timestomping)?"
  options={[
    { text: "Use only the disk's timestamps" },
    { text: "Corroborate across independent sources — if the centralized off-host log, the network capture, and the memory snapshot agree on the sequence, the timeline is reliable, because attackers can tamper with the host they control but not easily forge off-host records consistently" },
    { text: "Trust whichever source is newest" },
    { text: "Ignore timestamps entirely" }
  ]}
  correct={1}
  explanation="All three traps are defeated by cross-source corroboration. A timeline from one source is fragile to tampering; one built on agreeing independent sources — especially tamper-resistant off-host logs — is defensible. This is why you collect all three artifact types."
  revisit={{ to: "/docs/incident-forensics/timeline-reconstruction#the-timestamp-traps-that-wreck-timelines", label: "Corroboration beats one source" }}
/>

</Quiz>

## What's next

→ Continue to [Breach Determination & Notification](./breach-determination) — using the timeline and scope to make the high-stakes call of whether a confirmed breach must be reported, and the regulatory clock that starts ticking.

→ **Going deeper:** the artifacts you're ordering are the [previous lesson](./forensic-artifacts); the tamper-resistant logs that anchor a reliable timeline are [Chapter 6 telemetry](/docs/detection/logging-telemetry); dwell time as a metric is [detection](/docs/detection/logging-telemetry).
