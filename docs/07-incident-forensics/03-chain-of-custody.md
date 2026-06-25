---
id: chain-of-custody
title: Chain of Custody & Evidence Preservation
sidebar_position: 4
sidebar_label: Chain of custody
description: Handling digital evidence so it stays trustworthy and legally admissible — order of volatility, forensic imaging, write blockers, hashing for integrity, and an unbroken chain of custody.
---

# Chain of Custody & Evidence Preservation

> **In one line:** Evidence is only useful if you can *prove it wasn't altered* — so digital forensics runs on a strict discipline: capture the most fragile evidence first (**order of volatility**), work only on verified *copies* (forensic images), prove integrity with [hashes](/docs/cryptography/hashing-and-macs), and document every hand-off in an unbroken **chain of custody** — because mishandled evidence is worthless, in court and in your own investigation.

:::tip[In plain English]
Imagine solving a crime but contaminating the scene — touching everything, losing track of who handled what. Your conclusions might be right, but no one can *trust* them, and they'd never hold up in court. Digital evidence is the same, with an extra twist: it's *trivially alterable* and some of it *evaporates on its own*. A running computer's memory vanishes the instant it's powered off; just *opening* a file changes its "last accessed" timestamp; a clumsy investigator can overwrite the very data they're trying to recover. So forensics has strict rules to keep evidence trustworthy: grab the most fragile stuff first, never work on the original (make a perfect copy and prove it's perfect with a cryptographic fingerprint), and write down every single time evidence changes hands. Even if you're not headed to court, these habits protect *you* — they're how you know your investigation's conclusions are based on real, unaltered data rather than artifacts you accidentally created.
:::

## Why evidence integrity is non-negotiable

Two facts make digital evidence fragile:

- **It's trivially alterable.** Bits change silently. A timestamp, a log, a file — modifying any of it leaves little trace. If you can't *prove* evidence is unchanged since collection, an attacker's lawyer (or your own honest doubt) can dismiss it: "how do you know *you* didn't plant or alter this?"
- **Investigation itself alters things.** Booting a suspect machine, opening files, running tools — all *change state* (timestamps, memory, logs). A careless investigator destroys evidence just by looking. So forensics is the art of observing *without disturbing*.

The whole discipline below exists to answer one challenge: **"prove this evidence is exactly what you found, untouched."**

:::note[Terms, defined once]
- **Chain of custody** — the documented, unbroken record of who collected, handled, transferred, and stored each piece of evidence, and when — proving it was never tampered with.
- **Order of volatility** — the principle of collecting the most *ephemeral* evidence first (memory before disk before backups), because the fragile stuff disappears fastest.
- **Forensic image** — a bit-for-bit exact copy of a storage device (or memory), so you investigate the *copy*, never the original.
- **Write blocker** — hardware/software that allows *reading* a device while preventing any *writes* to it, so connecting it for imaging can't alter it.
- **Hash (integrity verification)** — a [cryptographic hash](/docs/cryptography/hashing-and-macs) of the evidence, taken at collection; re-hashing later and matching proves nothing changed.
- **Admissibility** — whether evidence can be used in legal proceedings, which depends heavily on proper handling and an intact chain of custody.
- **Anti-forensics** — attacker techniques to destroy/alter evidence (wiping logs, timestomping) to evade investigation.
:::

## Order of volatility: grab the fragile stuff first

Different evidence decays at wildly different rates. The **order of volatility** says collect from most-fleeting to most-durable, because if you do it backwards, the volatile evidence is gone before you reach it:

```
MOST volatile (collect FIRST)
   ▲  CPU registers / cache         ── gone in microseconds
   │  RAM (memory): processes,        ── gone on power-off
   │  network connections, keys
   │  Network state / live captures   ── gone when the connection ends
   │  Disk (files, logs)              ── persists, but can be overwritten
   ▼  Backups / archives / printouts  ── most durable
LEAST volatile (collect LAST)
```

This is *the* reason [the last lesson](/docs/incident-forensics/ir-lifecycle) warned against reflexively powering off a compromised machine: shutting down throws away everything at the top of this list — running malware, the attacker's live connections, [encryption keys held only in memory](/docs/cryptography/key-management), and processes that never touch disk. **Capture volatile evidence (especially memory) before changing the system's state.**

## Work on copies, never the original

You never investigate the original evidence — you make a **forensic image** (a bit-for-bit copy) and work on *that*. The original is sealed and preserved untouched. This protects against the "investigation alters things" problem: any mistakes happen on a copy you can re-make from the pristine original.

Two tools make imaging trustworthy:

- **Write blockers** — when you connect a suspect drive to image it, a write blocker ensures your machine can *read* but never *write* to it. Without one, simply mounting the drive can change it (the OS writes metadata), tainting the original.
- **Hashing for integrity** — the linchpin. You compute a [cryptographic hash](/docs/cryptography/hashing-and-macs) of the evidence *at collection*. Because hashing is [collision-resistant](/docs/cryptography/hashing-and-macs), the hash is a fingerprint: re-hash the image later and if it *matches*, you've *proven* not one bit changed; if it *differs*, the evidence is compromised.

:::note[Worked example: hashing proves the image is untampered]
1. You image a 1 TB drive to a forensic copy. At collection, you compute `SHA-256(image) = a1b2c3…`.
2. That hash is recorded in the chain-of-custody documentation. The original drive is sealed.
3. Weeks later, in analysis (or in court), someone asks "is this the real, unaltered evidence?"
4. You re-compute `SHA-256` of the image. It still equals `a1b2c3…`. **Proof:** because any change — even one bit — would produce a wildly different hash ([the avalanche effect](/docs/cryptography/hashing-and-macs)), a matching hash demonstrates the image is identical to what was collected.

This is [Chapter 2's hashing](/docs/cryptography/hashing-and-macs) doing forensic work: the same one-way fingerprint that verifies a download now proves evidence integrity. No hash, no proof — which is why hashing every piece of evidence at collection is mandatory.
:::

## Chain of custody: the unbroken paper trail

Even a perfect forensic image with a matching hash is weakened if you can't account for where it's *been*. **Chain of custody** is the documented, unbroken record of every person who handled the evidence and every transfer, with timestamps:

- *Who* collected it, *when*, and *how*.
- Every *transfer* — who handed it to whom, when, and why.
- Where it was *stored* (secured, access-controlled) between hand-offs.

A *gap* in the chain — a period where no one can account for the evidence — is an opening to argue it could have been tampered with, which can render it inadmissible. The chain answers "could someone have altered this while it was out of sight?" with a documented "no."

:::note[Why this matters even if you never go to court]
Most incidents never reach a courtroom — so why the rigor? Because the same discipline that makes evidence *admissible* makes your *investigation correct*. If you can't prove the evidence is unaltered, you can't trust your own conclusions: maybe that suspicious timestamp is the attacker's work, or maybe *you* created it by opening the file. Proper handling means your timeline and findings reflect what the attacker actually did, not artifacts of sloppy collection. And you rarely know *in advance* which incident will turn into litigation, a regulatory inquiry, or an insurance dispute — so you treat evidence properly *every* time. Good forensic hygiene is good investigation hygiene.
:::

## Why it matters

- **Mishandled evidence is worthless.** Without proven integrity and an intact chain, evidence can't support legal action *or* a trustworthy investigation — all your analysis rests on it.
- **You can't redo a contaminated collection.** Volatile evidence is gone forever if missed; an altered original can't be un-altered. Getting collection right is often a one-shot, high-stakes moment.
- **It's where crypto meets investigation.** Hashing — a [Chapter 2](/docs/cryptography/hashing-and-macs) primitive — is the technical heart of evidence integrity, a concrete payoff of understanding the foundations.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Collecting in the wrong order.** Grabbing disk images while ignoring volatile [memory](/docs/incident-forensics/forensic-artifacts) loses the most valuable, fragile evidence. Follow order of volatility — memory first.
- **Working on the original.** Investigating the live/original evidence risks altering it irreversibly. Always image first and work on the verified copy.
- **Skipping the write blocker.** Mounting a drive without one lets the OS write to it, tainting the original. Use a write blocker when imaging.
- **Not hashing at collection.** Without a hash taken at the moment of collection, you can never prove the evidence is unchanged. Hash everything immediately.
- **Breaking the chain of custody.** Undocumented hand-offs or unaccounted storage time create gaps that imply possible tampering. Document every transfer and secure storage.
- **Assuming 'it won't go to court, so it doesn't matter.'** You don't know in advance which incident becomes litigation or a regulatory matter — and the rigor also keeps your own conclusions trustworthy. Handle evidence properly every time.
:::

## Page checkpoint

<Quiz id="chain-of-custody-page" title="Did chain of custody click?" sampleSize={3}>

<Question
  prompt="What does 'order of volatility' tell you to do, and why?"
  options={[
    { text: "Collect disk backups first because they're most important" },
    { text: "Collect the most ephemeral evidence first (memory/RAM and network state before disk before backups), because volatile evidence like running processes and keys disappears on power-off and can't be recovered later" },
    { text: "Power off the machine immediately to freeze everything" },
    { text: "Collect evidence in alphabetical order" }
  ]}
  correct={1}
  explanation="Evidence decays at different rates. Memory, live connections, and in-memory keys vanish on shutdown, so you capture them first; disk and backups persist and are collected later. Doing it backwards loses the fragile, often most valuable, evidence."
  revisit={{ to: "/docs/incident-forensics/chain-of-custody#order-of-volatility-grab-the-fragile-stuff-first", label: "Order of volatility" }}
/>

<Question
  prompt="Why do forensic investigators work on a bit-for-bit IMAGE rather than the original device?"
  options={[
    { text: "Images are smaller than originals" },
    { text: "Investigation alters state (timestamps, metadata); working on a verified copy keeps the pristine original untouched, so mistakes happen on a copy you can re-make and the original remains trustworthy" },
    { text: "Originals can't be read by computers" },
    { text: "It's faster to analyze a copy" }
  ]}
  correct={1}
  explanation="Booting, mounting, or opening files changes the original. By imaging first (with a write blocker) and analyzing the copy, the original stays unaltered and any analysis errors are recoverable. The original is sealed as the source of truth."
  revisit={{ to: "/docs/incident-forensics/chain-of-custody#work-on-copies-never-the-original", label: "Work on copies" }}
/>

<Question
  prompt="How does hashing prove a forensic image hasn't been tampered with?"
  options={[
    { text: "It encrypts the image so no one can change it" },
    { text: "A cryptographic hash taken at collection is a fingerprint; re-hashing later and getting the SAME value proves not one bit changed (any change yields a wildly different hash), while a different value reveals tampering" },
    { text: "It compresses the image to detect changes" },
    { text: "Hashing has nothing to do with integrity" }
  ]}
  correct={1}
  explanation="Because cryptographic hashes are collision-resistant with an avalanche effect, a matching hash demonstrates the evidence is byte-identical to collection, and a mismatch proves alteration. This is Chapter 2's hashing applied to evidence integrity."
  revisit={{ to: "/docs/incident-forensics/chain-of-custody#work-on-copies-never-the-original", label: "Hashing for integrity" }}
/>

<Question
  prompt="What is a 'chain of custody,' and what does a gap in it imply?"
  options={[
    { text: "A list of suspects; a gap means a missing suspect" },
    { text: "The documented, unbroken record of who handled evidence and every transfer/storage with timestamps; a gap (unaccounted time) implies the evidence could have been tampered with, potentially making it inadmissible" },
    { text: "The encryption key for the evidence; a gap means lost data" },
    { text: "A backup schedule; a gap means missed backups" }
  ]}
  correct={1}
  explanation="Chain of custody documents every handler, transfer, and storage period. An unaccounted gap opens the argument that evidence could have been altered while out of sight, which can render it inadmissible. It answers 'could this have been tampered with?' with a documented no."
  revisit={{ to: "/docs/incident-forensics/chain-of-custody#chain-of-custody-the-unbroken-paper-trail", label: "Chain of custody" }}
/>

<Question
  prompt="Why follow strict evidence-handling discipline even when an incident will probably never reach court?"
  options={[
    { text: "It's just bureaucratic tradition" },
    { text: "The same rigor that makes evidence admissible makes your own investigation trustworthy — if you can't prove evidence is unaltered, you can't trust your conclusions; and you rarely know in advance which incident becomes litigation or a regulatory matter" },
    { text: "It's only required for nation-state attacks" },
    { text: "Courts are the only reason to investigate at all" }
  ]}
  correct={1}
  explanation="Proper handling ensures your timeline reflects the attacker's actions, not artifacts you created by sloppy collection. And since any incident could later become legal, regulatory, or insurance-related, you treat evidence correctly every time. Good forensic hygiene is good investigation hygiene."
  revisit={{ to: "/docs/incident-forensics/chain-of-custody#chain-of-custody-the-unbroken-paper-trail", label: "Why it matters even outside court" }}
/>

</Quiz>

## What's next

→ Continue to [Forensic Artifacts: Disk, Memory & Network](./forensic-artifacts) — *what* you actually collect and what each source reveals about an attacker's activity.

→ **Going deeper:** the hashing that proves integrity is [Chapter 2](/docs/cryptography/hashing-and-macs); the containment decisions that affect what evidence survives are the [IR lifecycle](./ir-lifecycle); admissibility and regulatory handling tie to [Compliance](/docs/compliance).
