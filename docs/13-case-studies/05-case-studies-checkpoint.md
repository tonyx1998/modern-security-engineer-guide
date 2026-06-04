---
id: case-studies-checkpoint
title: Chapter 13 Checkpoint
sidebar_position: 6
sidebar_label: ✅ Chapter checkpoint
description: Prove the case-study lessons stuck — a mixed quiz across the supply-chain, cloud-misconfiguration, and ransomware breaches, and the patterns that generalize.
---

# Chapter 13 Checkpoint

> **The case studies, all together.** This mixed quiz pulls from all three reconstructed breaches and the patterns they share. Passing means you can read a real incident, trace its chain, and name the controls that would have broken it.

:::tip[How this works]
The quiz samples from a larger bank each attempt. The through-line: **three very different breaches teach the same four lessons** — defense in depth, least privilege, assume breach, and the primacy of fundamentals. The cases are reconstructed from public post-incident reporting. If a question stings, follow its revisit link.
:::

## What you should be able to do now

- **Explain the [supply-chain](./supply-chain-case) breach** — build-time injection, why signing didn't save victims, and containment leverage.
- **Trace the [cloud chain](./cloud-misconfig-case)** — SSRF → metadata → over-broad role → mega-breach, and breaking any link.
- **Diagnose the [ransomware](./ransomware-case)** — one missing MFA to national impact, and the fundamentals that stop it.
- **Apply the [generalizable patterns](./generalizable-lessons)** — defense in depth, least privilege, assume breach, fundamentals first.

## The checkpoint

<Quiz id="case-studies-checkpoint" title="Chapter 13: Case Studies" sampleSize={6} passingScore={0.67}>

<Question
  prompt="In the SolarWinds compromise, where was the malicious code inserted, and why did that defeat source review and SAST?"
  options={[
    { text: "In the source code" },
    { text: "During the BUILD (compilation pipeline), so the source stayed clean — source review and static analysis find nothing because the malware existed only in the compiled artifact" },
    { text: "In a phishing email" },
    { text: "In the customer's code" }
  ]}
  correct={1}
  explanation="Build-time injection left the source clean, bypassing source review and SAST. The malware lived only in the compiled output — which is why build-pipeline integrity and provenance matter."
  revisit={{ to: "/docs/case-studies/supply-chain-case#what-happened-from-public-reporting", label: "What happened" }}
/>

<Question
  prompt="Why didn't code signing protect the SolarWinds customers?"
  options={[
    { text: "The update wasn't signed" },
    { text: "Tampering happened BEFORE signing, so the signature certified a malicious build as authentic; signing proves unaltered-since-signing, not that the pre-signing build was clean" },
    { text: "Signing is useless" },
    { text: "Customers disabled checks" }
  ]}
  correct={1}
  explanation="Signing protects against tampering in transit, not in the pipeline. Since malware was inserted before signing, the signature vouched for a compromised artifact — which is why provenance (how it was built) matters alongside the signature."
  revisit={{ to: "/docs/case-studies/supply-chain-case#why-it-bypassed-everyones-defenses", label: "Signed ≠ safe" }}
/>

<Question
  prompt="For SolarWinds victims, where was their realistic leverage given prevention failed upstream?"
  options={[
    { text: "Nothing could be done" },
    { text: "Containment and detection — egress filtering to block the C2 callback, least privilege and segmentation to limit the foothold's reach, and anomaly detection to catch unusual outbound/lateral activity" },
    { text: "Never applying patches" },
    { text: "A different signature algorithm" }
  ]}
  correct={1}
  explanation="Victims couldn't prevent a signed, trusted update, so assume-breach controls were their leverage: egress filtering, least privilege/segmentation, and detection of anomalous behavior. Prevention failed upstream; containment and detection were the defense."
  revisit={{ to: "/docs/case-studies/supply-chain-case#why-it-bypassed-everyones-defenses", label: "Containment and detection" }}
/>

<Question
  prompt="What was the attack chain in the Capital One breach?"
  options={[
    { text: "A single SQL injection" },
    { text: "SSRF → cloud metadata endpoint to steal temporary credentials → an over-permissive IAM role let those credentials read storage buckets → exfiltration of ~100M records" },
    { text: "A phished password then ransomware" },
    { text: "A vendor supply-chain compromise" }
  ]}
  correct={1}
  explanation="A chain: SSRF reached the metadata service to lift credentials, and an over-broad IAM role let them read far more than the app needed — customer-data buckets — enabling mass exfiltration. No single bug was the whole story."
  revisit={{ to: "/docs/case-studies/cloud-misconfig-case#what-happened-from-public-reporting", label: "The chain" }}
/>

<Question
  prompt="Which single link, hardened, would have most reduced the SCALE of the Capital One breach?"
  options={[
    { text: "A stronger web-app password" },
    { text: "Least privilege on the IAM role — scoped to only what the app needed, the stolen credentials would have exposed almost nothing; the over-broad role is what turned a credential leak into 100M records" },
    { text: "A bigger server" },
    { text: "More password rotation" }
  ]}
  correct={1}
  explanation="Even with stolen credentials, a least-privilege role would have exposed only a few resources. The over-permissive role created the catastrophic scale — the clearest demonstration of capping blast radius via least privilege."
  revisit={{ to: "/docs/case-studies/cloud-misconfig-case#why-the-chain-succeeded-and-where-it-could-have-broken", label: "Over-permissive role" }}
/>

<Question
  prompt="How did the attackers reportedly gain initial access in the Colonial Pipeline incident?"
  options={[
    { text: "A sophisticated zero-day" },
    { text: "A single VPN account's leaked password on an account WITHOUT MFA — so the password alone granted access (the path of least resistance, not a clever exploit)" },
    { text: "A supply-chain compromise" },
    { text: "Physical server theft" }
  ]}
  correct={1}
  explanation="Per public reporting, one leaked VPN credential on an account lacking MFA. No zero-day — a leaked password and a missing second factor. The most damaging breaches often start with the most basic failures."
  revisit={{ to: "/docs/case-studies/ransomware-case#what-happened-from-public-reporting", label: "Initial access" }}
/>

<Question
  prompt="What single control would most plausibly have prevented the Colonial Pipeline incident?"
  options={[
    { text: "A faster network" },
    { text: "MFA on that one VPN account — a leaked password is useless against multi-factor authentication, so one MFA requirement very plausibly stops the whole chain" },
    { text: "Encrypting the pipeline" },
    { text: "A bigger team" }
  ]}
  correct={1}
  explanation="MFA on the entry account is the headline fix. With only the password, a required second factor would likely have blocked access entirely — a vivid argument for MFA everywhere, especially on remote access and disused accounts."
  revisit={{ to: "/docs/case-studies/ransomware-case#why-the-fundamentals-would-have-changed-everything", label: "MFA" }}
/>

<Question
  prompt="What CIA property does ransomware primarily attack, illustrated by Colonial Pipeline?"
  options={[
    { text: "Confidentiality only" },
    { text: "Availability (denying use via encryption/shutdown) — with physical, societal consequences: the threat forced an operational shutdown disrupting regional fuel supply, no data theft even required" },
    { text: "Integrity only" },
    { text: "None; it's not security" }
  ]}
  correct={1}
  explanation="Ransomware is fundamentally an availability attack (modern operators also steal data for leverage). Here availability denial reached civilizational scale — a fuel crisis from an IT incident — the strongest counter to 'security is just protecting data.'"
  revisit={{ to: "/docs/case-studies/ransomware-case#ransomware-attacks-availability--with-physical-consequences", label: "Availability stakes" }}
/>

<Question
  prompt="What's the striking commonality across all three breaches?"
  options={[
    { text: "They used the same exploit" },
    { text: "They failed for the same few reasons and the same few principles (defense in depth, least privilege, assume breach, fundamentals) would have contained all of them — evidence the Foundations are the durable core" },
    { text: "All were nation-state attacks" },
    { text: "They had nothing in common" }
  ]}
  correct={1}
  explanation="Across different eras, technologies, and attackers, all three share the same root causes and containing principles. The specifics change constantly; the survivability principles are stable — the guide's central thesis."
  revisit={{ to: "/docs/case-studies/generalizable-lessons#the-meta-lesson-principles-outlast-techniques", label: "Principles outlast techniques" }}
/>

<Question
  prompt="What does 'least privilege decides the blast radius' mean across the cases?"
  options={[
    { text: "It prevents all initial compromises" },
    { text: "You often can't prevent the foothold, but how much it reaches is set in advance by how minimal the access is — the same compromise does little or enormous damage based on what the identity/foothold could reach" },
    { text: "It only matters in the cloud" },
    { text: "Blast radius is random" }
  ]}
  correct={1}
  explanation="Least privilege is the dial between 'contained incident' and 'catastrophe.' Capital One shows it starkly — the role's scope was the breach size. It's the highest-leverage way to shrink the impact of failures you can't prevent."
  revisit={{ to: "/docs/case-studies/generalizable-lessons#pattern-2-least-privilege-decides-the-blast-radius", label: "Least privilege decides blast radius" }}
/>

<Question
  prompt="What's the 'most humbling' pattern across the cases?"
  options={[
    { text: "Only cutting-edge defenses work" },
    { text: "The fundamentals are the main event — MFA, least-privilege IAM, segmentation, egress filtering, detection, tested backups (all unglamorous) are exactly what would have contained even these sophisticated, famous breaches" },
    { text: "Nothing could have stopped them" },
    { text: "Exotic threats are the real risk" }
  ]}
  correct={1}
  explanation="Every outcome-changing control was a boring fundamental. This proves Chapter 1's second ground-truth three times: most breaches, even famous ones, are stopped by mastering basics, not chasing the latest threat."
  revisit={{ to: "/docs/case-studies/generalizable-lessons#pattern-4-the-fundamentals-are-the-main-event", label: "Fundamentals first" }}
/>

<Question
  prompt="Why does 'assume breach' apply to all three cases?"
  options={[
    { text: "The victims were careless" },
    { text: "None was prevented at the perimeter (two couldn't be — a signed update, valid credentials), so design as if attackers will get in: invest in detection, segmentation, least privilege, egress control, and tested recovery for after the perimeter fails" },
    { text: "Perimeters always work" },
    { text: "Breaches can't be survived" }
  ]}
  correct={1}
  explanation="Each perimeter was crossed, two unavoidably. Assume-breach shifts investment to post-perimeter controls — detection, containment, and recovery. The least-harmed organizations were prepared for the wall to fail."
  revisit={{ to: "/docs/case-studies/generalizable-lessons#pattern-3-assume-breach--prevention-will-fail", label: "Assume breach" }}
/>

</Quiz>

## Chapter 13 complete

Three breaches, one framework. A [supply-chain compromise](./supply-chain-case), a [cloud chain](./cloud-misconfig-case), and a [ransomware intrusion](./ransomware-case) — as different as security incidents get — all teach the [same four durable patterns](./generalizable-lessons): no single control is enough (defense in depth), least privilege decides the blast radius, assume breach because prevention fails, and the boring fundamentals are the main event. You can now look at any incident and ask the right questions.

→ Finish with the [Glossary](/docs/glossary) — every term in the guide, in plain English — your quick reference for everything you've learned.
