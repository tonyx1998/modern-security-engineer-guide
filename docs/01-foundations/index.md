---
id: foundations-overview
title: 1. Security Foundations — Overview
sidebar_position: 1
sidebar_label: Foundations intro
description: The bedrock of security engineering — the CIA triad, threat vs vulnerability vs risk, the attacker's mindset, trust boundaries, defense-in-depth, and least privilege.
---

# Part 1: Security Foundations

> **In one line:** Before any tool or exploit, security is a way of *thinking* — reasoning about how a system can be misused, what's worth protecting, and where trust is placed — and this chapter installs that mindset and the vocabulary every later chapter assumes.

:::tip[In plain English]
Most engineers learn to make systems *work*. Security engineers also learn to ask "how could this be made to do something it shouldn't?" — and to reason clearly about which risks actually matter. This chapter is the conceptual base: what we're protecting (and from whom), the difference between a threat, a vulnerability, and a risk, why "defense in depth" and "least privilege" recur everywhere, and where the invisible **trust boundaries** in a system live. Get these right and the rest of the guide is applying them.
:::

## What this chapter covers

- **The CIA triad** — confidentiality, integrity, availability, and how every control maps to one of them.
- **Threat vs vulnerability vs risk** — the words people muddle, and why risk = likelihood × impact drives prioritization.
- **The attacker's mindset** — thinking in misuse cases, abuse of trust, and the path of least resistance.
- **Trust boundaries** — where data crosses from less-trusted to more-trusted, and why those crossings are where bugs become breaches.
- **Defense in depth & least privilege** — the two principles that show up in every later chapter.

## How it connects

These foundations are assumed by every chapter that follows — [cryptography](/docs/cryptography) protects confidentiality/integrity; [app security](/docs/appsec) defends trust boundaries; [detection](/docs/detection) watches for the attacker's mindset in action. If you've read the *Modern Web Dev* guide's web-security and auth pages, this chapter gives them their organizing frame.

## The lessons in this chapter

1. **[The CIA triad →](/docs/foundations/cia-triad)** — the three properties (confidentiality, integrity, availability) every control protects, and the lens for reasoning about any system.
2. **[Threat vs vulnerability vs risk →](/docs/foundations/threat-vuln-risk)** — the words people muddle, and `Risk = Likelihood × Impact`, the formula that decides what to fix first.
3. **[The attacker's mindset →](/docs/foundations/attacker-mindset)** — the habit of thinking in misuse cases, abusing trust, and the path of least resistance.
4. **[Trust boundaries →](/docs/foundations/trust-boundaries)** — where data crosses from less-trusted to more-trusted, and why that's where bugs become breaches ("never trust the client").
5. **[Defense in depth & least privilege →](/docs/foundations/defense-in-depth)** — layer your defenses so no single failure is fatal, and grant the minimum access so a compromise stays contained.

Finish with the **[Chapter 1 checkpoint →](/docs/foundations/foundations-checkpoint)** to certify the foundations before Chapter 2.

---

→ Start here: [The CIA triad](/docs/foundations/cia-triad).
