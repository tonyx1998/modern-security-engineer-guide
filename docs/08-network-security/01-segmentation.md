---
id: segmentation
title: Network Segmentation
sidebar_position: 2
sidebar_label: Segmentation
description: Dividing a network so a breach in one place can't reach everything — flat vs. segmented networks, blast radius, microsegmentation, and why segmentation is the single biggest brake on lateral movement.
---

# Network Segmentation

> **In one line:** A **flat network** — where everything can reach everything — means one foothold equals total compromise, so **segmentation** divides the network into isolated zones with controlled crossings, which is the single most effective brake on the [lateral movement](/docs/offensive/post-exploitation) that turns a small breach into a catastrophe.

:::tip[In plain English]
Picture a ship. If it's one giant open hull and water gets in anywhere, the whole ship sinks. That's a **flat network**: every device can talk to every other, so an attacker who compromises *one* machine can reach them *all*. Now picture a ship with watertight compartments — a hole floods one section, but the bulkheads keep the rest dry and the ship afloat. That's **segmentation**: dividing your network into zones with locked doors between them, so a breach in one zone is *contained* there instead of spreading. You met this idea as [blast radius](/docs/foundations/defense-in-depth) and saw why it matters when you studied [lateral movement](/docs/offensive/post-exploitation) — the attacker's main move after getting in is hopping from the unimportant machine they landed on to the valuable ones. Segmentation is the wall that stops the hop. It's not glamorous, but it's one of the highest-impact defenses there is.
:::

## Flat vs. segmented: why flat is fatal

In a **flat network**, all systems share one trust zone and can communicate freely. It's simple to set up and convenient — and catastrophic under attack, because it makes the [post-exploitation journey](/docs/offensive/post-exploitation) trivial:

```
FLAT:  [phished laptop] ── can reach ──▶ [database] [backups] [admin] [everything]
        one foothold  =  total reach

SEGMENTED:  [laptop | user zone]  ──✗ blocked ──  [database | data zone]
            crossing requires passing a controlled checkpoint
```

Recall how a real breach unfolds: the attacker rarely lands on the prize. They land somewhere weak (a [phished](/docs/offensive/reconnaissance) laptop) and *move laterally* toward the valuable systems. On a flat network, that movement is unobstructed — one compromise reaches the whole estate. **Segmentation removes the open hallway.** With the network divided into zones (user devices, servers, databases, payment systems, admin) and crossings controlled, an attacker who owns the user zone still hits a *wall* trying to reach the data zone — they have to defeat *another* control at every boundary, giving defenders more chances to [detect](/docs/detection) and more time to respond.

:::note[Terms, defined once]
- **Flat network** — one undivided network where all hosts can reach each other; maximal blast radius.
- **Segmentation** — dividing a network into isolated zones (segments) with controlled communication between them.
- **Segment / zone** — an isolated portion of the network grouping systems of similar trust/function (e.g., a database tier).
- **Blast radius** — how much an attacker can reach from a single compromise (from [Foundations](/docs/foundations/defense-in-depth)). Segmentation shrinks it.
- **Microsegmentation** — fine-grained segmentation down to individual workloads/services, often enforced by identity rather than just network location.
- **East-west traffic** — traffic *between* internal systems (lateral); the traffic segmentation controls. (vs. **north-south** — in/out of the network.)
- **DMZ (demilitarized zone)** — a buffer segment for internet-facing systems, isolated from the internal network so a compromised public server can't directly reach internal resources.
:::

## Segment by trust and function

Effective segmentation groups systems by *how much they should be trusted and what they do*, then controls the crossings. Classic boundaries:

- **By tier** — web servers, application servers, and databases in separate segments. The database should accept connections *only* from the app tier, never directly from the internet or user devices.
- **By sensitivity** — payment systems, regulated data ([PCI](/docs/compliance)), and admin networks isolated more strictly, with tightly controlled access.
- **By function/team** — separating, say, the corporate office network from production, or one customer's environment from another's (multi-tenancy).
- **Internet-facing in a DMZ** — public servers sit in a buffer zone so that compromising them doesn't grant direct access to internal systems.

The crossings between segments are where you enforce [least privilege](/docs/foundations/defense-in-depth) at the network level: *only the specific connections that are actually needed* are allowed, everything else denied by default. A database tier that only ever needs to talk to the app tier should be *unreachable* from anywhere else — so even an attacker who owns a user laptop simply has no network path to it.

:::note[Worked example: segmentation turns a breach into an incident]
An attacker [phishes](/docs/offensive/reconnaissance) an employee and owns their laptop in the **user zone**. Their goal: the customer database in the **data zone**.

**Flat network:** the laptop can reach the database directly. The attacker [reuses harvested credentials](/docs/offensive/post-exploitation), connects, and exfiltrates. One phish → full breach.

**Segmented network:**
- The user zone *cannot* open a connection to the data zone — there's no network path; the crossing is blocked by default.
- To reach the database, the attacker must first compromise something in an *intermediate* zone that's actually allowed to talk to it (e.g., an app server) — a second, harder step.
- Each crossing is a checkpoint that can [log and alert](/docs/detection) on unexpected traffic (a user-zone device probing the data zone is a loud anomaly).

The phish still happened, but it's now a *contained incident* on one laptop instead of a company-ending breach — because the network itself refused to carry the attack to the crown jewels. This is [blast-radius reduction](/docs/foundations/defense-in-depth) made physical.
:::

## Microsegmentation and the modern direction

Traditional segmentation creates a handful of big zones. **Microsegmentation** goes much finer — isolating individual workloads or services so that, even *within* a tier, each service can only talk to the specific others it needs. In a microsegmented world, a compromised service in the app tier can't freely reach its *neighbors*; it can only make the exact connections its job requires.

The modern twist is that microsegmentation is increasingly enforced by *identity*, not just network location — "this service may talk to that service" rather than "this IP range may reach that IP range." That's the bridge to [zero-trust networking](./zero-trust): the logical endpoint of segmentation is *every connection independently verified*, so there's no implicitly-trusted zone left at all. Segmentation shrinks the blast radius; microsegmentation and zero trust shrink it toward *zero*.

## Why it matters

- **It's the top brake on lateral movement.** The attacker's defining post-foothold move is spreading sideways; segmentation is the wall that stops it. No single control does more to keep a breach small.
- **It directly implements assume-breach.** You can't prevent every foothold, but you can ensure a foothold *can't reach much* — which is exactly what segmentation delivers, turning [assume breach](/docs/offensive/post-exploitation) from a slogan into architecture.
- **It multiplies detection.** Every segment boundary is a chokepoint to monitor. Traffic that crosses a boundary it never should is a high-signal [detection](/docs/detection) — segmentation makes the attacker's movement *visible* as well as *harder*.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Running a flat network for convenience.** It's easy until the day one compromise becomes total compromise. The convenience is borrowed against a catastrophic worst case.
- **Segmenting the perimeter but leaving the interior flat.** A hard outer shell with a soft, flat inside means once anyone's in, they're everywhere. Segment *internally* — east-west — not just at the edge.
- **Over-permissive crossings.** Segments with rules that allow far more than needed ("any internal host can reach the DB") defeat the purpose. Allow only the specific, necessary connections; deny by default.
- **Forgetting to monitor the boundaries.** Segmentation's chokepoints are prime detection spots; not logging cross-segment traffic wastes the visibility it creates.
- **Leaving internet-facing systems on the internal network.** A public server that can directly reach internal resources is a bridge for attackers. Put it in a DMZ.
- **Treating segmentation as one-and-done.** Networks drift; new connections get added "temporarily" and never removed, re-flattening the network over time. Review and prune crossings.
:::

## Page checkpoint

<Quiz id="segmentation-page" title="Did segmentation click?" sampleSize={3}>

<Question
  prompt="Why is a 'flat network' so dangerous?"
  options={[
    { text: "It's slower than a segmented network" },
    { text: "Everything can reach everything, so a single foothold equals total reach — the attacker's lateral movement to the valuable systems is unobstructed, turning one compromise into full breach" },
    { text: "Flat networks can't use encryption" },
    { text: "It's harder to set up" }
  ]}
  correct={1}
  explanation="In a flat network all hosts share one trust zone and can communicate freely, so an attacker who compromises one machine can reach them all. That makes the post-exploitation lateral-movement journey trivial — one phish becomes a company-wide breach."
  revisit={{ to: "/docs/network-security/segmentation#flat-vs-segmented-why-flat-is-fatal", label: "Flat vs segmented" }}
/>

<Question
  prompt="What does network segmentation primarily defend against?"
  options={[
    { text: "Weak passwords" },
    { text: "Lateral movement — by dividing the network into isolated zones with controlled crossings, a breach in one zone is contained there instead of spreading to the crown jewels (shrinking blast radius)" },
    { text: "Encryption flaws" },
    { text: "Phishing emails arriving" }
  ]}
  correct={1}
  explanation="Segmentation is the wall that stops the attacker's defining post-foothold move — hopping sideways toward valuable systems. It contains a breach to one zone, shrinking blast radius, and is the single biggest brake on lateral movement."
  revisit={{ to: "/docs/network-security/segmentation#flat-vs-segmented-why-flat-is-fatal", label: "What segmentation defends" }}
/>

<Question
  prompt="A database tier should accept connections from which systems, ideally?"
  options={[
    { text: "Any internal host, for convenience" },
    { text: "Only the specific tier that needs it (e.g., the app tier) — everything else denied by default, so an attacker on a user laptop has no network path to the database at all" },
    { text: "The public internet directly" },
    { text: "Every device on the corporate network" }
  ]}
  correct={1}
  explanation="Least privilege at the network level: the database is reachable only by the app tier that legitimately needs it, and unreachable from user devices or the internet. Then even a compromised laptop simply has no path to the crown jewels."
  revisit={{ to: "/docs/network-security/segmentation#segment-by-trust-and-function", label: "Segment by trust and function" }}
/>

<Question
  prompt="How does segmentation also help DETECTION, not just prevention?"
  options={[
    { text: "It encrypts all alerts" },
    { text: "Every segment boundary is a chokepoint to monitor; traffic crossing a boundary it never should (e.g., a user-zone device probing the data zone) is a high-signal anomaly, making the attacker's movement visible as well as harder" },
    { text: "It deletes logs automatically" },
    { text: "It has no effect on detection" }
  ]}
  correct={1}
  explanation="Boundaries are natural monitoring chokepoints. Unexpected cross-segment traffic stands out as a loud, high-signal detection. So segmentation both impedes lateral movement and makes it observable — prevention and detection together."
  revisit={{ to: "/docs/network-security/segmentation#why-it-matters", label: "Segmentation multiplies detection" }}
/>

<Question
  prompt="What is microsegmentation, and how does it relate to zero trust?"
  options={[
    { text: "Splitting the network into two halves" },
    { text: "Fine-grained isolation down to individual workloads/services (often enforced by identity, not just IP), so even within a tier a service reaches only what it needs — the logical path toward zero trust, where every connection is independently verified" },
    { text: "Encrypting microservices" },
    { text: "A type of firewall brand" }
  ]}
  correct={1}
  explanation="Microsegmentation isolates individual services so a compromise can't freely reach neighbors, increasingly enforced by identity ('this service may talk to that service'). Its logical endpoint is zero trust — every connection verified, no implicitly-trusted zone left."
  revisit={{ to: "/docs/network-security/segmentation#microsegmentation-and-the-modern-direction", label: "Microsegmentation" }}
/>

</Quiz>

## What's next

→ Continue to [Firewalls & WAFs](./firewalls-and-wafs) — the devices that *enforce* the crossings between segments and filter traffic at the network and application edges.

→ **Going deeper:** the lateral movement segmentation stops is [post-exploitation](/docs/offensive/post-exploitation); the blast-radius principle is [Foundations](/docs/foundations/defense-in-depth); the identity-enforced endpoint is [zero-trust networking](./zero-trust).
