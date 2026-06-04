---
id: incident-forensics-checkpoint
title: Chapter 7 Checkpoint
sidebar_position: 7
sidebar_label: ✅ Chapter checkpoint
description: Prove the incident-response and forensics toolkit stuck — a mixed quiz across the IR lifecycle, chain of custody, forensic artifacts, timeline reconstruction, and breach determination.
---

# Chapter 7 Checkpoint

> **The incident-response and forensics toolkit, all together.** This mixed quiz pulls from every lesson. Passing means you understand how an organization handles the worst day — containing calmly, investigating rigorously, preserving evidence properly, and making the high-stakes breach call honestly.

:::tip[How this works]
The quiz samples from a larger bank each attempt. The chapter's through-line: **truth and evidence, not just uptime.** A rehearsed process beats panic; evidence integrity beats clever guessing; the timeline answers every important question; and breach determination rewards preparation and honesty. If a question stings, follow its revisit link.
:::

## What you should be able to do now

- **Run the [IR lifecycle](./ir-lifecycle)** — six phases, with preparation and lessons-learned as the decisive bookends.
- **Preserve evidence** with [chain of custody](./chain-of-custody) — order of volatility, imaging, write blockers, and hashing.
- **Collect the right [forensic artifacts](./forensic-artifacts)** — disk, memory, and network, and what each reveals and misses.
- **Reconstruct a [timeline](./timeline-reconstruction)** — correlate across sources and dodge the timestamp traps.
- **Make a [breach determination](./breach-determination)** — incident vs. breach, the evidence required, the regulatory clock, and why honesty wins.

## The checkpoint

<Quiz id="incident-forensics-checkpoint" title="Chapter 7: Incident Response & Forensics" sampleSize={6} passingScore={0.67}>

<Question
  prompt="What are the six phases of the incident response lifecycle?"
  options={[
    { text: "Plan, code, build, test, deploy, monitor" },
    { text: "Prepare, Identify, Contain, Eradicate, Recover, Lessons Learned — a loop that feeds back into preparation" },
    { text: "Scope, recon, exploit, report, retest, bill" },
    { text: "Detect, ignore, restart, forget, repeat, hope" }
  ]}
  correct={1}
  explanation="The standard NIST/SANS lifecycle is Prepare → Identify → Contain → Eradicate → Recover → Lessons Learned, looping so the final phase improves preparation. The bookends (prepare, learn) are the most underrated."
  revisit={{ to: "/docs/incident-forensics/ir-lifecycle#the-six-phases", label: "The six phases" }}
/>

<Question
  prompt="You find an attacker active on a server. Why might immediately powering it off be the wrong first move?"
  options={[
    { text: "It saves too much evidence" },
    { text: "Powering off destroys volatile memory evidence (live processes, connections, in-RAM keys — where fileless attackers hide) and can tip off the attacker; isolating while preserving memory and capturing volatile data first is often better" },
    { text: "Servers can't be powered off" },
    { text: "It fully removes the attacker every time" }
  ]}
  correct={1}
  explanation="Shutdown wipes the most valuable evidence for memory-resident attacks and can prompt the attacker to escalate. Containment is a deliberate risk judgment — often isolate, capture volatile evidence, then act — planned in advance."
  revisit={{ to: "/docs/incident-forensics/ir-lifecycle#containment-the-phase-with-the-hardest-judgment-calls", label: "Containment judgment" }}
/>

<Question
  prompt="Why must you understand the full scope of a compromise before eradicating?"
  options={[
    { text: "To make the report longer" },
    { text: "If the attacker has multiple footholds/persistence and you remove only the one you found, they're still in — and now alerted; partial eradication is a top reason attackers return, so determine full scope first" },
    { text: "Scope is irrelevant to eradication" },
    { text: "Eradication must precede identification" }
  ]}
  correct={1}
  explanation="Eradication must remove every foothold, backdoor, and compromised credential at once. Missing some leaves the attacker present and aware, so they often return more aggressively. Scope before you eradicate."
  revisit={{ to: "/docs/incident-forensics/ir-lifecycle#eradicate-fully-or-you-havent-eradicated", label: "Eradicate fully" }}
/>

<Question
  prompt="What does 'order of volatility' direct you to do, and why?"
  options={[
    { text: "Collect disk backups first" },
    { text: "Collect the most ephemeral evidence first (memory/RAM and network state before disk before backups), because volatile data like running processes and in-memory keys disappears on power-off and can't be recovered later" },
    { text: "Power off immediately to freeze everything" },
    { text: "Collect in alphabetical order" }
  ]}
  correct={1}
  explanation="Evidence decays at different rates. Memory and live connections vanish on shutdown, so capture them first; disk and backups persist. Doing it backwards loses the fragile, often most valuable, evidence."
  revisit={{ to: "/docs/incident-forensics/chain-of-custody#order-of-volatility-grab-the-fragile-stuff-first", label: "Order of volatility" }}
/>

<Question
  prompt="How does hashing prove a forensic image hasn't been tampered with?"
  options={[
    { text: "It encrypts the image" },
    { text: "A cryptographic hash taken at collection is a fingerprint; re-hashing later and matching proves not one bit changed (any change yields a wildly different hash), while a mismatch reveals tampering" },
    { text: "It compresses the image" },
    { text: "Hashing is unrelated to integrity" }
  ]}
  correct={1}
  explanation="Cryptographic hashes are collision-resistant with an avalanche effect, so a matching hash demonstrates byte-identical evidence and a mismatch proves alteration — Chapter 2's hashing applied to evidence integrity."
  revisit={{ to: "/docs/incident-forensics/chain-of-custody#work-on-copies-never-the-original", label: "Hashing for integrity" }}
/>

<Question
  prompt="A disk image of a compromised server shows almost nothing, yet it was beaconing out. What happened, and what should have been collected?"
  options={[
    { text: "The server wasn't compromised" },
    { text: "The attacker ran fileless (in memory, living off the land), leaving little on disk; a memory dump captured before shutdown would reveal the injected process, live C2 connection, and harvested credentials in RAM" },
    { text: "The disk image was corrupt" },
    { text: "Network forensics is useless here" }
  ]}
  correct={1}
  explanation="Fileless attacks live in memory to evade disk investigation. Disk-only shows a ghost; memory (captured before power-off) reveals the running malicious process, its C2 channel, and credentials. Disk and memory are complementary."
  revisit={{ to: "/docs/incident-forensics/forensic-artifacts#memory-forensics-the-live-state-attackers-hide-in", label: "Why disk-only misses it" }}
/>

<Question
  prompt="Why collect disk, memory, AND network evidence rather than rely on one source?"
  options={[
    { text: "To extend the investigation" },
    { text: "Each has a different blind spot — disk misses fileless activity, memory is gone on power-off and is one snapshot, network may not see inside encryption — so all three fill each other's gaps and cross-check the story" },
    { text: "Only one is ever available" },
    { text: "They show identical data" }
  ]}
  correct={1}
  explanation="The sources are complementary and corroborate each other: an attacker who evades disk is loud in memory; one who cleans the host can't erase the network conversation. Correlating all three builds a defensible account."
  revisit={{ to: "/docs/incident-forensics/forensic-artifacts#combining-the-three-the-full-picture", label: "Combining the three" }}
/>

<Question
  prompt="Why is the timeline considered the central product of a forensic investigation?"
  options={[
    { text: "It makes the report longer" },
    { text: "Nearly every key question is a 'when' question — entry point (earliest event), scope (the sequence), dwell time (first to last), and whether regulated data was touched — so the ordered story turns evidence into answers" },
    { text: "Timestamps are easy to read" },
    { text: "It replaces collecting evidence" }
  ]}
  correct={1}
  explanation="A list of findings is raw material; the investigation establishes order and causation. Entry, scope, dwell time, and impact all come from the timeline, driving eradication, breach determination, and lessons learned."
  revisit={{ to: "/docs/incident-forensics/timeline-reconstruction#why-the-timeline-is-the-central-artifact", label: "Why the timeline is central" }}
/>

<Question
  prompt="What is 'timestomping,' and how do you avoid being fooled by it?"
  options={[
    { text: "A clock-sync protocol you enable" },
    { text: "An anti-forensic technique where attackers FORGE file timestamps to mislead; defend by corroborating across independent sources (off-host logs, network captures, memory), where conflicts expose the forgery" },
    { text: "Malware that deletes files" },
    { text: "A way to speed up timelines" }
  ]}
  correct={1}
  explanation="Timestomping alters on-disk timestamps. Since attackers control the host but can't easily forge off-host records consistently, cross-checking against logs, network, and memory reveals inconsistencies — and the forgery itself becomes a clue."
  revisit={{ to: "/docs/incident-forensics/timeline-reconstruction#the-timestamp-traps-that-wreck-timelines", label: "Timestomping" }}
/>

<Question
  prompt="What distinguishes a reportable 'data breach' from a general 'security incident'?"
  options={[
    { text: "Nothing; they're the same" },
    { text: "An incident is any security compromise; a breach is the subset where sensitive/regulated data was actually accessed, acquired, or disclosed — which triggers legal notification duties" },
    { text: "A breach is smaller" },
    { text: "Breaches involve only phishing" }
  ]}
  correct={1}
  explanation="Most incidents aren't breaches. The legal line is whether sensitive data was actually reached/taken. A foothold that reached nothing sensitive is an incident; exfiltrating the customer database is a breach with notification obligations."
  revisit={{ to: "/docs/incident-forensics/breach-determination#incident-vs-breach-a-distinction-with-legal-teeth", label: "Incident vs breach" }}
/>

<Question
  prompt="An attacker reached a database server but you have no logs of what they did there. How does this affect breach determination?"
  options={[
    { text: "No logs means no breach" },
    { text: "Regulators often expect notification when you CANNOT rule out access; without logs proving data wasn't taken, you usually must treat it as a breach — while thorough access logging might prove the data was never queried" },
    { text: "Only encryption matters" },
    { text: "You can assume nothing was accessed" }
  ]}
  correct={1}
  explanation="The standard is often 'can you rule it out?' Missing logs mean you can't show data wasn't taken, forcing a worst-case determination. Good logging can prove a narrower scope — a direct, expensive payoff of telemetry decisions."
  revisit={{ to: "/docs/incident-forensics/breach-determination#what-the-evidence-has-to-show", label: "Can't prove they didn't" }}
/>

<Question
  prompt="Why is covering up or under-reporting a breach catastrophic?"
  options={[
    { text: "It's actually best practice" },
    { text: "Concealment, when discovered, escalates legal penalties, destroys trust (customers forgive breaches, not lies), and has led to personal liability for executives — consistently worse than the breach itself" },
    { text: "It only matters for large companies" },
    { text: "Cover-ups are always legal" }
  ]}
  correct={1}
  explanation="Real cases show concealment fares far worse than prompt disclosure: regulators punish deception harder, trust collapses, and executives have faced personal consequences for covering up. Honest, timely disclosure is the ethical and self-interested path."
  revisit={{ to: "/docs/incident-forensics/breach-determination#honesty-beats-the-cover-up--always", label: "Honesty beats the cover-up" }}
/>

</Quiz>

## Chapter 7 complete

You now understand the worst day as a *disciplined process*: a rehearsed [lifecycle](./ir-lifecycle) that stays calm, [evidence handling](./chain-of-custody) that stays trustworthy, [artifacts](./forensic-artifacts) from three sources, a [timeline](./timeline-reconstruction) that reconstructs the truth, and a [breach determination](./breach-determination) made on evidence and honesty against a ticking clock. The goal here isn't uptime — it's *truth and evidence*.

→ On to [Chapter 8: Network Security](/docs/network-security) — back to building defenses, starting with the network layer that so many of these attacks traverse, and the segmentation that limits how far an intruder can go.
