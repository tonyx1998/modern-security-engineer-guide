---
id: case-studies-overview
title: 13. Case Studies — Overview
sidebar_position: 1
sidebar_label: Case studies intro
description: Real breaches reconstructed — supply-chain compromise, cloud misconfiguration, and ransomware — and the durable lessons each one teaches a security engineer.
---

# Part 13: Case Studies

> **In one line:** Theory sticks when you see it fail in the real world, so this chapter reconstructs landmark breaches — how the attacker got in, what made it possible, and what defense would have stopped it — turning headlines into transferable lessons.

:::tip[In plain English]
Every chapter in this guide is vividly illustrated by a real incident where it was missing. This chapter walks through reconstructed breaches — a **supply-chain** compromise (a trusted update turned malicious), a **cloud misconfiguration** (a public bucket or over-broad role leaking data), and a **ransomware** intrusion (initial access to full encryption) — tracing the chain of decisions and the specific control that would have broken it. The point isn't the gossip; it's the pattern, so you recognize the setup before it's your incident.
:::

## What this chapter covers

- **A supply-chain compromise** — trust in a dependency/update weaponized (ties to [Secure SDLC](/docs/secure-sdlc)).
- **A cloud misconfiguration breach** — identity/storage missteps at scale (ties to [Cloud & Identity](/docs/cloud-identity)).
- **A ransomware intrusion** — initial access → lateral movement → impact, and where [detection](/docs/detection) and [IR](/docs/incident-forensics) change the outcome.
- **The generalizable lessons** — what each says about defense-in-depth and least privilege.

:::note[On sourcing]
These case studies are reconstructed **only from public post-incident reporting** (company disclosures, security-vendor analyses, government findings, and court documents). They focus on the *durable lessons* each breach teaches a security engineer, not on contested operational specifics.
:::

## The lessons in this chapter

1. **[A Supply-Chain Compromise →](/docs/case-studies/supply-chain-case)** — SolarWinds: malicious code in a signed, trusted update, and why signing didn't save victims.
2. **[A Cloud Misconfiguration Breach →](/docs/case-studies/cloud-misconfig-case)** — Capital One: SSRF + metadata + an over-broad IAM role chained into 100M records.
3. **[A Ransomware Intrusion →](/docs/case-studies/ransomware-case)** — Colonial Pipeline: one missing MFA to a national fuel crisis, and the fundamentals that stop it.
4. **[The Patterns That Generalize →](/docs/case-studies/generalizable-lessons)** — the four durable lessons all three breaches share.

Finish with the **[Chapter 13 checkpoint →](/docs/case-studies/case-studies-checkpoint)**, then the [Glossary](/docs/glossary).

---

→ Start here: [A Supply-Chain Compromise](/docs/case-studies/supply-chain-case).
