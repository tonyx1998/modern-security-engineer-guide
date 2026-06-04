---
id: cia-triad
title: The CIA Triad
sidebar_position: 2
sidebar_label: The CIA triad
description: Confidentiality, integrity, and availability — the three properties every security control exists to protect, and the lens you use to reason about any system.
---

# The CIA Triad

> **In one line:** Almost everything in security is protecting one of three things — keeping secrets secret (**confidentiality**), keeping data correct (**integrity**), and keeping systems usable (**availability**) — and naming which one a control protects is the first move a security engineer makes.

:::tip[In plain English]
Imagine a bank. You want three different guarantees. First, *nobody but you should see your balance* — that's **confidentiality**. Second, *nobody should be able to quietly change your balance from $5,000 to $5* — that's **integrity**. Third, *the ATM should actually work when you need cash* — that's **availability**. Every security measure ever invented is, at heart, defending one of these three promises. The CIA triad is just the habit of asking, for any system: which of the three am I protecting here, and which is most likely to break?
:::

## The three properties, defined

The **CIA triad** (nothing to do with the intelligence agency — it's an acronym) is the foundational model for what security protects. Three properties:

- **Confidentiality** — information is available *only* to those authorized to see it. Breaking it means an unauthorized party *reads* something they shouldn't (a leaked password database, a snooped private message).
- **Integrity** — information is accurate and has not been changed except by authorized parties in authorized ways. Breaking it means data is *altered* without permission (a tampered bank balance, a swapped software download, a forged record).
- **Availability** — information and systems are usable when legitimate users need them. Breaking it means a service is *down or unreachable* (a server knocked offline, a database deleted, a network flooded).

:::note[Terms, defined once]
- **Authorized** — explicitly permitted, by policy, to perform an action. The opposite is *unauthorized*. Security is largely about enforcing the line between the two.
- **Control** — any safeguard that protects one of the CIA properties: a password, a firewall rule, an encryption setting, a backup. When you hear "control," read "a thing we put in place to defend C, I, or A."
- **Plaintext / ciphertext** — readable data vs. its scrambled, unreadable form. Encryption turns the first into the second to protect confidentiality.
:::

## A worked example: one system, three failures

Take a hospital's patient-records system. Walk through how each property fails and what defends it.

| Property | What a failure looks like here | A control that defends it |
|----------|--------------------------------|---------------------------|
| **Confidentiality** | A curious employee opens a celebrity's medical file they have no reason to see | Access control + encryption + audit logging |
| **Integrity** | A bad actor changes a patient's recorded blood type, risking a fatal transfusion | Checksums, digital signatures, write-access control, change logs |
| **Availability** | Ransomware encrypts the records server; doctors can't see charts during surgery | Backups, redundancy, DDoS protection, patching |

Notice the same system has *three independent ways to fail*. A control that's great for one property may do nothing for another: encrypting the database protects confidentiality, but encrypted data can still be *deleted* (an availability failure) or *overwritten* (an integrity failure). This is exactly why the triad is a checklist — it stops you from securing one property and assuming you're "done."

:::note[Trace it: which property broke?]
Read each incident and name the property:

1. *An attacker copies your customer email list and posts it online.* → **Confidentiality** (they read/exfiltrated data they shouldn't).
2. *An attacker changes the "amount" field on a pending wire transfer from $100 to $100,000.* → **Integrity** (data altered).
3. *An attacker floods your checkout API with junk traffic so real customers can't buy.* → **Availability** (legitimate use blocked).
4. *An attacker steals a backup tape AND it was unencrypted.* → **Confidentiality** (the *availability* control — the backup — created a *confidentiality* failure).

Number 4 is the lesson: controls interact. A backup improves availability but, done wrong, can *harm* confidentiality.
:::

## Why these three (and not more)?

Other properties get added in practice — **authenticity** (the data really came from who it claims) and **non-repudiation** (the sender can't later deny sending it) are the two you'll meet most. Some models expand the triad into the "Parkerian hexad" with possession, authenticity, and utility. You don't need to memorize those yet. The triad is the durable core because almost every real-world security goal *reduces* to one of the three:

- "Only logged-in users can see this page" → confidentiality.
- "Uploaded files can't be tampered with in transit" → integrity.
- "The site survives a traffic spike" → availability.

When you learn [cryptography](/docs/cryptography) next, you'll see the tools line up with the triad almost one-to-one: encryption → confidentiality, hashing/signatures → integrity and authenticity.

## Why it matters

The triad is the security engineer's *first question*, and it shapes everything downstream:

- **It prioritizes.** A public marketing site has low confidentiality needs but high availability needs (it must stay up). A password vault is the reverse. Knowing which property dominates tells you where to spend your effort.
- **It catches blind spots.** Teams obsess over confidentiality (encryption, secrets) and forget availability until ransomware hits. Running the triad as a checklist surfaces the property you've under-defended.
- **It's the shared language.** When you write a threat model, a risk register, or an incident report, you'll classify impact by CIA. It's the vocabulary the whole field uses.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Treating security as "only confidentiality."** Beginners equate security with "encrypt it / keep it secret." But the most damaging breaches are often integrity (a forged transaction) or availability (ransomware) failures. Encryption alone defends *one* leg of three.
- **Assuming the legs are independent.** They trade off. The classic example: making data highly available (lots of copies, broad access) tends to *weaken* confidentiality, and locking it down tightly for confidentiality can *hurt* availability. Good design balances them on purpose, not by accident.
- **Confusing integrity with confidentiality.** Encrypted data can still be silently corrupted or replaced; secret data can be perfectly intact but leaked. They are different guarantees needing different controls — which is why [authenticated encryption](/docs/cryptography) exists to provide *both* at once.
- **Forgetting availability is a security property.** A denial-of-service attack steals nothing and changes nothing, yet it's squarely a security incident. If "the system is unusable by legitimate users," security has failed.
:::

## Page checkpoint

<Quiz id="cia-triad-page" title="Did the CIA triad stick?" sampleSize={3}>

<Question
  prompt="An attacker modifies the recorded results of an election database without being detected. Which CIA property has primarily been violated?"
  options={[
    { text: "Confidentiality" },
    { text: "Integrity" },
    { text: "Availability" },
    { text: "None — no data was stolen" }
  ]}
  correct={1}
  explanation="Nothing was necessarily read or stolen, and the system stayed up — but data was altered without authorization. That's an integrity failure, often the most damaging kind because the data still looks legitimate."
  revisit={{ to: "/docs/foundations/cia-triad#the-three-properties-defined", label: "The three properties" }}
/>

<Question
  prompt="A ransomware attack encrypts a company's servers so employees can't access any files. Which property is most directly attacked?"
  options={[
    { text: "Confidentiality" },
    { text: "Integrity" },
    { text: "Availability" },
    { text: "Authenticity" }
  ]}
  correct={2}
  explanation="The data isn't necessarily read by the attacker, and (until a ransom note) not necessarily altered meaningfully — but it's been made unusable to legitimate users. That's an availability failure. (Modern ransomware often ALSO steals data first, adding a confidentiality failure — controls and attacks frequently hit more than one leg.)"
  revisit={{ to: "/docs/foundations/cia-triad#the-three-properties-defined", label: "The three properties" }}
/>

<Question
  prompt="Why is the CIA triad useful as a 'checklist' rather than a single goal?"
  options={[
    { text: "Because all three always fail together, so checking one checks all" },
    { text: "Because a control protecting one property often does nothing for the other two, so you must check each separately" },
    { text: "Because confidentiality is the only one that matters in practice" },
    { text: "Because it tells you exactly which encryption algorithm to use" }
  ]}
  correct={1}
  explanation="Encrypting a database protects confidentiality but doesn't stop it being deleted (availability) or overwritten (integrity). The triad forces you to consider each leg so you don't secure one and assume you're done."
  revisit={{ to: "/docs/foundations/cia-triad#a-worked-example-one-system-three-failures", label: "One system, three failures" }}
/>

<Question
  prompt="Your team encrypts a backup tape but stores it in a way anyone can pick up and carry off. Then it's stolen. Which property failed, and what's the lesson?"
  options={[
    { text: "Availability — the backup is gone" },
    { text: "Confidentiality — the tape was unencrypted in older versions of this scenario; here it WAS encrypted, so nothing failed" },
    { text: "Confidentiality if the tape were unencrypted — the lesson is that an availability control (a backup) can create a confidentiality risk if not also protected" },
    { text: "Integrity — the data on the tape changed" }
  ]}
  correct={2}
  explanation="Backups exist for availability, but a portable copy of all your data is a confidentiality liability if it isn't itself encrypted and access-controlled. Controls interact: improving one property can weaken another if you're not deliberate."
  revisit={{ to: "/docs/foundations/cia-triad#a-worked-example-one-system-three-failures", label: "Controls interact" }}
/>

<Question
  prompt="A denial-of-service attack floods a site with traffic. It reads no data and changes no data. Is it a security incident?"
  options={[
    { text: "No — nothing was stolen or altered, so it's just an outage" },
    { text: "Yes — availability is a security property, and legitimate users being unable to use the system is a security failure" },
    { text: "Only if the attacker also logs in" },
    { text: "Only if customer data is exposed" }
  ]}
  correct={1}
  explanation="Availability is the third leg of the triad. Making a system unusable by legitimate users is a security failure even when no data is touched — which is exactly why DoS/DDoS are treated as security incidents."
  revisit={{ to: "/docs/foundations/cia-triad#common-pitfalls", label: "Availability is a security property" }}
/>

</Quiz>

## What's next

→ Continue to [Threat vs Vulnerability vs Risk](./threat-vuln-risk), where we turn "what we protect" into "what we're protecting *against*" — and learn the formula that decides what to fix first.

→ **Going deeper:** the controls that defend each property are built in [Cryptography](/docs/cryptography) (confidentiality + integrity) and watched for in [Detection & Response](/docs/detection) (all three).
