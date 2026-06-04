---
id: forensic-artifacts
title: "Forensic Artifacts: Disk, Memory & Network"
sidebar_position: 4
sidebar_label: Forensic artifacts
description: What you collect and what each reveals — disk forensics (files, logs, deleted data), memory forensics (live state attackers hide in RAM), and network forensics (the traffic record).
---

# Forensic Artifacts: Disk, Memory & Network

> **In one line:** A forensic investigation reconstructs an attack from three complementary evidence sources — **disk** (the durable record: files, logs, even deleted data), **memory** (the *live* state attackers increasingly hide in, gone on power-off), and **network** (the record of what talked to what) — and knowing what each reveals (and misses) is how you piece together the full story.

:::tip[In plain English]
When investigating a breach, you're a detective gathering evidence — and there are three crime scenes, each telling a different part of the story. **Disk forensics** is the durable record: the files, logs, browser history, and even *deleted* data still recoverable on the hard drive — great for "what was installed and what happened over time." **Memory forensics** is the snapshot of the machine *as it was running*: the processes that were live, the network connections open, the passwords and encryption keys sitting in RAM — crucial because modern attackers deliberately stay *only in memory* to avoid leaving disk traces, and all of it vanishes the instant the power's cut. **Network forensics** is the record of conversations: which machines talked to which, when, and how much data moved — perfect for spotting an attacker's [command-and-control](/docs/offensive/post-exploitation) chatter or data being [stolen](/docs/offensive/post-exploitation). No single source tells the whole story; the skill is combining them. This lesson is what each reveals.
:::

## Disk forensics: the durable record

**Disk forensics** examines a [forensic image](/docs/incident-forensics/chain-of-custody) of storage for the persistent traces an attacker left. It's the most familiar source and answers "what happened on this machine, over time?"

What the disk reveals:
- **Files and malware** — what was installed, downloaded, or created, and when.
- **Logs** — local [system, application, and security logs](/docs/detection/logging-telemetry) (if the attacker didn't wipe them — [anti-forensics](/docs/incident-forensics/chain-of-custody)).
- **Filesystem metadata** — timestamps (created/modified/accessed) that help build a [timeline](/docs/incident-forensics/timeline-reconstruction), plus registry/config artifacts showing [persistence](/docs/offensive/post-exploitation).
- **Deleted data** — "deleting" a file usually just removes its directory entry; the data often remains until overwritten, so investigators can frequently *recover* deleted files, browser history, or attacker tools.
- **Browser and user artifacts** — history, downloads, recent documents — the user/attacker's activity trail.

Its strength is *persistence and history*; its weakness is that it misses anything that never touched disk — which is exactly the gap memory forensics fills.

:::note[Terms, defined once]
- **Disk forensics** — analysis of stored data (files, logs, metadata, deleted remnants) from a storage image.
- **Memory forensics** — analysis of a capture of a system's RAM, revealing live runtime state.
- **Network forensics** — analysis of network traffic/flow records to reconstruct communications.
- **Memory dump** — a captured copy of a system's RAM at a moment in time.
- **Slack space / unallocated space** — disk areas where deleted-but-not-overwritten data lingers and can be recovered.
- **Fileless malware** — malicious code that runs only in [memory](#memory-forensics-the-live-state-attackers-hide-in), leaving little or nothing on disk to find.
- **PCAP** — a captured file of raw network packets ("packet capture").
- **NetFlow / flow data** — summaries of network connections (who talked to whom, when, how much) without full packet contents — lighter than PCAP, still very revealing.
:::

## Memory forensics: the live state attackers hide in

**Memory (RAM) forensics** analyzes a capture of what was in a system's memory *while running*. It has become essential because of a shift in attacker behavior: to evade [disk-based detection](/docs/detection/detection-engineering), modern attackers increasingly run **fileless** — living [only in memory](/docs/offensive/post-exploitation), touching disk as little as possible. If you only image the disk, you may find *nothing* while the attacker is right there in RAM.

What memory uniquely reveals:
- **Running processes** — including hidden/injected ones and **fileless malware** that has no disk footprint.
- **Active network connections** — who the machine was talking to *right now* ([C2](/docs/offensive/post-exploitation) channels).
- **Decrypted data and keys** — [encryption keys](/docs/cryptography/key-management), passwords, and decrypted content that exist *only* in memory (on disk they're encrypted or absent).
- **Injected code and the attacker's live activity** — what was actually executing.

The catch — and the link to the prior lessons — is **volatility**: memory is at the *top* of the [order of volatility](/docs/incident-forensics/chain-of-custody) and is *destroyed the instant the machine powers off*. This is the single biggest reason [the IR lesson](/docs/incident-forensics/ir-lifecycle) warned against reflexively pulling the plug: do that and you've deleted the one place a fileless attacker lives. **Capture memory first, before changing the system's state.**

:::note[Worked example: why disk-only investigation misses the attacker]
An analyst images a compromised server's disk and finds… almost nothing suspicious. Clean, right? But the server was *acting* compromised — beaconing out, [moving laterally](/docs/offensive/post-exploitation). The catch: the attacker used **fileless** techniques — their tooling ran entirely in memory, [living off the land](/docs/offensive/post-exploitation) with the system's own utilities, never writing malware to disk.

Had the responder *also* captured a **memory dump** *before* shutdown, they'd have found: the injected malicious process, its live C2 connection to the attacker's server, and the credentials it had harvested into RAM. Power the box off to "preserve it," and all of that is gone forever — the disk image shows a ghost.

The lesson: **disk and memory are complementary, and memory is both the most valuable for modern attacks and the most fragile.** A modern responder captures memory as a first move, precisely because so much now hides there.
:::

## Network forensics: the record of conversations

**Network forensics** reconstructs an attack from network evidence — the record of what communicated with what. Even when an attacker carefully cleans a host, *the network often remembers the conversation*.

What the network reveals:
- **Command-and-control ([C2](/docs/offensive/post-exploitation))** — regular "beaconing" to an external server (a compromised host phoning home).
- **[Lateral movement](/docs/offensive/post-exploitation)** — a host suddenly connecting to systems it never normally touches.
- **[Exfiltration](/docs/offensive/post-exploitation)** — large or unusual outbound data transfers (data leaving).
- **Scope** — which hosts an attacker touched, helping bound the incident.

Two forms, a tradeoff: full **PCAP** (every packet — rich but huge, and often encrypted contents) vs. **flow data / NetFlow** (just who-talked-to-whom-when-how-much — lighter, retained longer, and *still* enough to reveal beaconing and exfiltration patterns even without packet contents). This is the [network telemetry from Chapter 6](/docs/detection/logging-telemetry), now used investigatively after the fact.

## Combining the three: the full picture

No single source is complete — and they *check each other*. The investigator correlates across all three:

- Network shows a host beaconing to a suspicious IP → memory reveals the *process* making that connection → disk reveals *how it got there* (the initial dropper, the persistence) and *when* (timestamps).
- Disk shows a malicious file created at 02:14 → network confirms outbound activity starting 02:15 → memory (if captured) shows it still running.

This cross-source correlation is the same idea as the [SIEM's correlation](/docs/detection/siem), applied forensically: each source fills the others' blind spots, and agreement across sources builds a confident, defensible account that feeds the [timeline](/docs/incident-forensics/timeline-reconstruction).

:::note[Each source's blind spot]
- **Disk** misses what never touched it (fileless/memory-only activity) and what the attacker [wiped](/docs/incident-forensics/chain-of-custody).
- **Memory** is gone on power-off and is only a *snapshot* of one moment.
- **Network** may not see *inside* encrypted traffic (though metadata — who/when/how much — still tells a lot), and only covers what was captured.

Because each has a different blind spot, collecting all three is how you avoid being fooled by any one. The attacker who hides from disk is loud in memory; the one who cleans the host can't erase the network's memory of the conversation.
:::

## Why it matters

- **It determines whether you find the truth.** Investigating only disk (the traditional default) misses the **fileless**, memory-resident attacks that dominate modern intrusions. Knowing all three sources — and their order of [volatility](/docs/incident-forensics/chain-of-custody) — is the difference between "found nothing" and "found everything."
- **It bounds the incident.** [Eradication and breach determination](/docs/incident-forensics/ir-lifecycle) depend on knowing the *full* scope — which systems, which data, how long. The artifacts are how you establish it.
- **It closes the loop with detection.** The same [telemetry sources](/docs/detection/logging-telemetry) you collect for detection (endpoint/disk, network) are your forensic evidence after the fact — another reason logging decisions made in advance are decisive.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Investigating disk only.** Modern attackers run fileless, in memory. Disk-only investigation can show a "clean" machine that's actively compromised. Capture memory too.
- **Powering off before capturing memory.** Shutdown destroys the most valuable evidence for memory-resident attacks. Memory first, then disk.
- **Assuming 'deleted' means gone.** Deleted files often persist in unallocated space and are recoverable — for you *and* against you (attackers' deleted tools can be recovered).
- **Trusting a single source.** Each has a blind spot; an attacker who evades one is often loud in another. Correlate disk, memory, and network.
- **Forgetting attackers wipe logs.** On-host logs may be tampered ([anti-forensics](/docs/incident-forensics/chain-of-custody)); cross-check against the centralized, [off-host logs](/docs/detection/logging-telemetry) and network evidence the attacker couldn't reach.
- **Ignoring network metadata because traffic is encrypted.** Even without packet contents, flow data (who/when/how much) reveals C2 and exfiltration patterns.
:::

## Page checkpoint

<Quiz id="forensic-artifacts-page" title="Did forensic artifacts click?" sampleSize={3}>

<Question
  prompt="What does MEMORY (RAM) forensics uniquely reveal that disk forensics often cannot?"
  options={[
    { text: "Nothing; disk shows everything memory does" },
    { text: "Live runtime state — running/injected processes, fileless malware with no disk footprint, active C2 connections, and decrypted data and keys held only in RAM" },
    { text: "Only the computer's serial number" },
    { text: "The physical location of the attacker" }
  ]}
  correct={1}
  explanation="Memory captures the machine as it was running: hidden/injected processes, fileless malware, live network connections, and decrypted secrets/keys that never persist to disk. Modern attackers hide here precisely to evade disk-based investigation."
  revisit={{ to: "/docs/incident-forensics/forensic-artifacts#memory-forensics-the-live-state-attackers-hide-in", label: "Memory forensics" }}
/>

<Question
  prompt="An analyst images a compromised server's disk and finds almost nothing, yet it was clearly beaconing out. What likely happened, and what should have been done?"
  options={[
    { text: "The server wasn't really compromised" },
    { text: "The attacker ran fileless (in memory, living off the land), leaving little on disk; the responder should have captured a MEMORY DUMP before shutdown to find the injected process, live C2 connection, and harvested credentials in RAM" },
    { text: "The disk image was the wrong size" },
    { text: "Network forensics is never useful here" }
  ]}
  correct={1}
  explanation="Fileless attacks live in memory and avoid disk, so disk-only investigation shows a ghost. Capturing memory before power-off would reveal the running malicious process, its C2 channel, and credentials in RAM. Disk and memory are complementary; memory is the most valuable and most fragile."
  revisit={{ to: "/docs/incident-forensics/forensic-artifacts#memory-forensics-the-live-state-attackers-hide-in", label: "Why disk-only misses the attacker" }}
/>

<Question
  prompt="Why is network forensics valuable even when an attacker carefully cleans the compromised host?"
  options={[
    { text: "It isn't; a cleaned host means no evidence" },
    { text: "The network often remembers the conversation — C2 beaconing, lateral movement, and exfiltration patterns appear in traffic/flow records the attacker couldn't reach to erase, and flow metadata reveals patterns even when contents are encrypted" },
    { text: "Because networks store the attacker's password" },
    { text: "Because all traffic is always unencrypted" }
  ]}
  correct={1}
  explanation="An attacker can wipe a host but can't erase the network's record of its communications (especially centralized flow data). Beaconing, lateral connections, and large outbound transfers show up in PCAP/NetFlow — and flow metadata reveals patterns even without packet contents."
  revisit={{ to: "/docs/incident-forensics/forensic-artifacts#network-forensics-the-record-of-conversations", label: "Network forensics" }}
/>

<Question
  prompt="Why collect ALL THREE sources (disk, memory, network) rather than rely on one?"
  options={[
    { text: "To make the investigation take longer" },
    { text: "Each has a different blind spot — disk misses fileless activity, memory is gone on power-off and is one snapshot, network may not see inside encryption — so collecting all three lets each fill the others' gaps and cross-check the story" },
    { text: "Because only one of them is ever available" },
    { text: "They all show exactly the same data" }
  ]}
  correct={1}
  explanation="The sources are complementary and check each other: an attacker who evades disk is loud in memory; one who cleans the host can't erase the network conversation. Correlating all three (like SIEM correlation, applied forensically) builds a confident, defensible account."
  revisit={{ to: "/docs/incident-forensics/forensic-artifacts#combining-the-three-the-full-picture", label: "Combining the three" }}
/>

<Question
  prompt="In disk forensics, why can investigators often recover 'deleted' files?"
  options={[
    { text: "Deleting a file makes a hidden backup" },
    { text: "Deletion usually just removes the directory entry while the data remains in unallocated space until overwritten, so it's frequently recoverable — which cuts both ways (attackers' deleted tools can be recovered too)" },
    { text: "Files are never actually deleted by the OS" },
    { text: "The cloud keeps copies of everything" }
  ]}
  correct={1}
  explanation="'Deleting' typically removes the pointer to the data, not the data itself, which lingers in slack/unallocated space until overwritten. Investigators can often recover deleted files, history, and attacker tools — valuable evidence the attacker thought they erased."
  revisit={{ to: "/docs/incident-forensics/forensic-artifacts#disk-forensics-the-durable-record", label: "Deleted data" }}
/>

</Quiz>

## What's next

→ Continue to [Timeline Reconstruction](./timeline-reconstruction) — assembling these artifacts from all three sources into a single, ordered story of exactly what the attacker did, when.

→ **Going deeper:** the volatility ordering that governs collection is [chain of custody](./chain-of-custody); the same sources feed [detection](/docs/detection/logging-telemetry); the attacker behaviors you're reconstructing are [post-exploitation](/docs/offensive/post-exploitation).
