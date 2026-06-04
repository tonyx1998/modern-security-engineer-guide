---
id: offensive-overview
title: 5. Penetration Testing & Red Teaming — Overview
sidebar_position: 1
sidebar_label: Offensive intro
description: Thinking and operating like an attacker, legally — methodology, reconnaissance, exploitation classes, scope and rules of engagement, and writing reports that drive fixes.
---

# Part 5: Penetration Testing & Red Teaming

> **In one line:** A penetration test is *authorized*, *scoped* attack simulation whose product is not "I got in" but a clear, prioritized report that makes the organization safer — this chapter teaches the methodology, the major exploitation classes, and the professional discipline (scope, rules of engagement, reporting) that separates a pentester from a criminal.

:::danger[Authorized engagements only — this is the line]
Everything in this chapter applies **exclusively** to systems you own or are explicitly, contractually authorized to test (a signed pentest engagement, a CTF, your own lab, a sanctioned bug-bounty scope). Unauthorized access is a crime regardless of intent. Professionalism here is defined by *scope and permission* first, technique second.
:::

:::tip[In plain English]
Offensive security is the art of finding weaknesses before a real attacker does — by methodically thinking like one, within strict legal boundaries. It follows a repeatable arc: agree on scope and rules, map the target (recon), find and safely demonstrate weaknesses (exploitation), and — most importantly — write it up so the team can fix what matters. The deliverable is the report, not the conquest. This chapter also connects to the AI-specific red-teaming covered in [AI Security](/docs/ai-security).
:::

## What this chapter covers

- **Methodology** — the engagement lifecycle from scoping to retest.
- **Reconnaissance** — passive and active mapping of the attack surface.
- **Exploitation classes** — web/app, network, and credential attacks (the defensive flip side of [AppSec](/docs/appsec)).
- **Scope & rules of engagement** — the contracts and constraints that define authorized testing.
- **Reporting** — severity, reproduction, and remediation guidance that actually gets fixes shipped.

## The lessons in this chapter

1. **[The Engagement Lifecycle →](/docs/offensive/methodology)** — the phased methodology, testing types (black/grey/white box), and pentest vs. red team vs. bug bounty.
2. **[Scope, Authorization & Rules of Engagement →](/docs/offensive/rules-of-engagement)** — the contracts and constraints that make testing legal and safe.
3. **[Reconnaissance →](/docs/offensive/reconnaissance)** — passive (OSINT) and active (scanning/enumeration) mapping of the attack surface.
4. **[Exploitation →](/docs/offensive/exploitation)** — the major exploitation classes, chaining modest bugs into critical impact, and proving impact with minimum harm.
5. **[Post-Exploitation →](/docs/offensive/post-exploitation)** — privilege escalation, lateral movement, persistence — and why this noisy phase is the detection battleground.
6. **[Reporting & Remediation →](/docs/offensive/reporting)** — severity, reproduction, business impact, prioritized fixes, and the retest that closes the loop.

Finish with the **[Chapter 5 checkpoint →](/docs/offensive/offensive-checkpoint)** to certify the lifecycle before Chapter 6.

---

→ Start here: [The Engagement Lifecycle](/docs/offensive/methodology).
