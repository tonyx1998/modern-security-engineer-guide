---
id: ddos-mitigation
title: DDoS Mitigation
sidebar_position: 4
sidebar_label: DDoS mitigation
description: Defending availability against traffic floods — what DDoS is, volumetric vs. application-layer attacks, and why you can't defend it with a bigger server (you need absorption, filtering, and scale).
---

# DDoS Mitigation

> **In one line:** A **DDoS (Distributed Denial of Service)** attack floods a target with traffic from many sources to exhaust its capacity and knock it offline — attacking the [availability](/docs/foundations/cia-triad) leg of the triad — and because you can't simply "out-resource" a distributed flood, defense relies on *absorption at scale, filtering bad traffic, and architecture that degrades gracefully* rather than a bigger server.

:::tip[In plain English]
Most attacks try to *get in*; a DDoS just tries to *knock you down*. The idea is brutally simple: overwhelm a system with so much traffic — or so many expensive requests — that it can't serve real users. The "distributed" part is what makes it hard: the flood comes from *thousands or millions* of sources at once (often a **botnet** of hijacked devices), so you can't just block one attacker's IP. It steals nothing and changes nothing, yet it's a real [security incident](/docs/foundations/cia-triad) because it destroys *availability* — legitimate users can't use your service, which can mean lost revenue, broken operations, and sometimes a smokescreen for another attack. The naïve instinct — "I'll just get a bigger server" — fails, because the attacker can always summon more traffic than any single machine can handle. Real defense is about *absorbing* enormous traffic across massive distributed infrastructure, *filtering* the attack from the legitimate, and *designing* systems that bend instead of break. This lesson is how availability is defended under fire.
:::

## What DDoS is, and the two flavors

A **Denial of Service (DoS)** makes a system unavailable to legitimate users. **Distributed** DoS does it from *many sources at once*, which is both more powerful and much harder to block (you can't filter by "the attacker's IP" when there are a million of them). Attacks come in two broad shapes, defended differently:

- **Volumetric attacks** — sheer flood: overwhelm the *bandwidth* or network capacity with massive raw traffic (e.g., reflected/amplified floods that bounce huge responses off third parties toward you). The goal is to saturate the pipe so nothing gets through. *Defended by absorption and scrubbing at scale.*
- **Application-layer attacks** — fewer requests, but *expensive* ones: hit costly endpoints (a search, a complex query, a login) just enough to exhaust the *application's* resources (CPU, database, connections) while looking almost like normal traffic. Lower volume, harder to distinguish from real users. *Defended by rate limiting, behavioral analysis, and efficient app design.*

:::note[Terms, defined once]
- **DoS / DDoS** — Denial of Service / Distributed DoS: making a system unavailable, from one or many sources.
- **Botnet** — a network of compromised devices an attacker controls and directs to generate attack traffic.
- **Volumetric attack** — overwhelming bandwidth/network capacity with raw traffic volume.
- **Application-layer (L7) attack** — exhausting application resources with expensive requests, at lower volume.
- **Amplification / reflection** — bouncing small spoofed requests off third-party servers that send large responses to the victim, multiplying the attack's size.
- **Scrubbing** — routing traffic through a service that filters out attack traffic and forwards only the legitimate portion.
- **Anycast** — announcing one IP from many global locations so traffic (including an attack) is spread across many data centers instead of hitting one.
- **Rate limiting** — capping how many requests a client can make in a time window, a key L7 defense.
:::

## Why "a bigger server" doesn't work

The instinct to fix a flood with more capacity fails for a simple economic reason: **the attacker can scale their traffic far more cheaply than you can scale your defenses on a single chokepoint.** A botnet of a million devices can generate traffic that no single server — or even a single data center — can absorb. Buy a server twice as big and the attacker sends twice as much; you lose that race. The asymmetry favors the attacker.

So effective DDoS defense changes the *shape* of the problem rather than trying to win the capacity race head-on:

- **Absorb at massive distributed scale.** Specialized DDoS-mitigation providers and CDNs operate networks with *enormous* aggregate capacity spread across many locations (via **anycast**). An attack that would flatten your server is *diluted* across their global infrastructure — they have more capacity than the botnet. This is why DDoS protection is overwhelmingly a *bought* service, not something you self-host.
- **Scrub the traffic.** Route incoming traffic through a **scrubbing** layer that distinguishes attack from legitimate and forwards only the good — so the flood is filtered *before* it reaches you.
- **Filter and rate-limit at the edge.** Drop obviously-bad traffic (spoofed, malformed, known-bad) and cap abusive request rates close to the source.

:::note[Worked example: volumetric flood vs. a scrubbing network]
A botnet aims 1 Tbps of junk traffic at your single server sitting on a 10 Gbps link.

**Without mitigation:** the 10 Gbps link saturates instantly; legitimate traffic can't get through; you're offline. No server upgrade helps — even a huge server is behind that same finite link, and the attacker just sends more.

**With a scrubbing/CDN provider in front:** your real origin is hidden behind the provider's [anycast](#what-ddos-is-and-the-two-flavors) network with terabits of distributed capacity. The 1 Tbps flood is *spread across dozens of global scrubbing centers*, each handling a fraction; the provider's filters drop the attack traffic and forward only legitimate requests to your origin. Your server sees normal load. The attack didn't get smaller — your *capacity to absorb and filter it* got vastly bigger and distributed. That capacity-and-filtering-at-scale is something almost no individual organization can build, which is why this defense is a service you buy.
:::

## Designing to degrade gracefully

Mitigation services handle the big floods, but resilient *architecture* is the complement — systems that bend instead of break under load:

- **[Rate limiting](#what-ddos-is-and-the-two-flavors)** on expensive and abusable endpoints (login, search, APIs) blunts application-layer attacks and abuse generally.
- **Caching and CDNs** serve much traffic without touching your origin, so a surge hits cheap edge cache, not your database.
- **Autoscaling** adds capacity under load (helpful against moderate surges, though not a substitute for mitigation against large floods — and watch the cost, since attackers can run up your bill).
- **Graceful degradation** — shedding expensive features under extreme load while keeping core function alive beats total collapse.

The goal is a system where a surge causes *reduced service*, not *no service* — and where the expensive, abusable paths are protected so a small but clever [application-layer attack](#what-ddos-is-and-the-two-flavors) can't tip everything over.

:::info[Highlight: availability is a security property, and DDoS proves it]
It's easy to think of security as only "keep secrets safe." DDoS is the reminder that **availability is the third leg of the [CIA triad](/docs/foundations/cia-triad)** and a legitimate target. An attacker who can't steal your data can still hurt you badly by making you *unreachable* — costing revenue, breaking operations, and sometimes acting as a *distraction* while a real intrusion happens elsewhere (so a DDoS should also raise vigilance, not just be waited out). Defending availability is as much a part of security engineering as defending confidentiality — and it's defended by scale and architecture, not secrets.
:::

## Why it matters

- **It's a direct attack on availability.** No data is touched, yet the business stops. Treating availability as out-of-scope for security leaves a wide-open, frequently-used attack vector.
- **The defense model is genuinely different.** You can't code or patch your way out of a flood; the answer is bought scale plus resilient architecture. Knowing *why* a bigger server fails is core infrastructure-security judgment.
- **It can mask worse.** DDoS is sometimes a smokescreen for a quieter intrusion. Recognizing that prevents tunnel vision during an attack.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Trying to out-scale a flood with a bigger server.** The attacker scales traffic more cheaply than you scale a single chokepoint. Use distributed absorption/scrubbing (a provider), not just more capacity.
- **Ignoring application-layer attacks.** Low-volume, expensive-request attacks slip past volumetric defenses by mimicking real users. Rate-limit and protect costly endpoints; analyze behavior.
- **No rate limiting on abusable endpoints.** Login, search, and heavy APIs are cheap to attack and easy to forget. Cap them.
- **Treating availability as not-security.** DDoS is a real security incident; leaving it out of your threat model leaves a common attack unaddressed.
- **Waiting out a DDoS without raising alert.** It may be cover for a stealthier intrusion. Increase monitoring during an attack, don't just absorb it.
- **Autoscaling into a huge bill.** Scaling to meet attack traffic can convert an availability attack into a financial one ("denial of wallet"). Pair autoscaling with limits and mitigation.
:::

## Page checkpoint

<Quiz id="ddos-mitigation-page" title="Did DDoS mitigation click?" sampleSize={3}>

<Question
  prompt="Why is a DDoS attack a security incident even though it steals and changes nothing?"
  options={[
    { text: "It isn't a security issue, just an outage" },
    { text: "It attacks availability — the third leg of the CIA triad — making the service unusable by legitimate users, which is a security failure (and can mask a stealthier intrusion)" },
    { text: "Only because it might leak data" },
    { text: "Only if the attacker logs in" }
  ]}
  correct={1}
  explanation="Availability is a CIA property. Making a system unreachable to legitimate users is a security failure regardless of data being touched — costing revenue and operations, and sometimes serving as a distraction for another attack."
  revisit={{ to: "/docs/network-security/ddos-mitigation#designing-to-degrade-gracefully", label: "Availability is security" }}
/>

<Question
  prompt="Why doesn't 'just buy a bigger server' defend against a volumetric DDoS?"
  options={[
    { text: "Bigger servers are too expensive" },
    { text: "The attacker can scale traffic far more cheaply than you can scale a single chokepoint — a million-device botnet outproduces any one server or data center, so you lose the capacity race; defense needs distributed absorption and filtering at scale" },
    { text: "Servers can't handle any traffic" },
    { text: "It actually does work perfectly" }
  ]}
  correct={1}
  explanation="The asymmetry favors the attacker: double your server and they double their flood, and your single link/data center is still finite. Effective defense changes the shape — distributed absorption (anycast), scrubbing, and edge filtering — typically a bought service with global capacity."
  revisit={{ to: "/docs/network-security/ddos-mitigation#why-a-bigger-server-doesnt-work", label: "Why a bigger server fails" }}
/>

<Question
  prompt="How do volumetric and application-layer (L7) DDoS attacks differ?"
  options={[
    { text: "They're identical" },
    { text: "Volumetric floods raw traffic to saturate bandwidth (defended by absorption/scrubbing at scale); application-layer sends fewer but expensive requests to exhaust app resources while mimicking real users (defended by rate limiting, behavioral analysis, efficient design)" },
    { text: "Volumetric attacks steal data; L7 attacks encrypt it" },
    { text: "L7 attacks use more bandwidth than volumetric" }
  ]}
  correct={1}
  explanation="Volumetric = huge raw traffic to saturate the pipe. Application-layer = low-volume, costly requests that exhaust CPU/database/connections while looking almost legitimate, making them harder to filter. Each needs a different defense."
  revisit={{ to: "/docs/network-security/ddos-mitigation#what-ddos-is-and-the-two-flavors", label: "Two flavors" }}
/>

<Question
  prompt="A 1 Tbps flood hits your single server on a 10 Gbps link. How does a scrubbing/CDN provider in front help?"
  options={[
    { text: "It makes your server faster" },
    { text: "Your origin hides behind the provider's anycast network with terabits of distributed capacity; the flood is spread across many global scrubbing centers, filtered, and only legitimate traffic reaches your origin — your absorb-and-filter capacity got vastly bigger" },
    { text: "It blocks the single attacking IP" },
    { text: "It encrypts the attack traffic" }
  ]}
  correct={1}
  explanation="The attack doesn't shrink; your capacity to absorb and filter it grows and distributes. The provider's global anycast network dilutes the flood across dozens of centers, scrubs the bad traffic, and forwards only good requests — capacity at scale almost no single org can self-build."
  revisit={{ to: "/docs/network-security/ddos-mitigation#why-a-bigger-server-doesnt-work", label: "Scrubbing at scale" }}
/>

<Question
  prompt="Which architectural practice helps a system 'degrade gracefully' under load rather than collapse?"
  options={[
    { text: "Removing all caching" },
    { text: "Rate limiting expensive endpoints, caching/CDN to absorb traffic before the origin, and shedding costly features under extreme load while keeping core function alive — so a surge causes reduced service, not no service" },
    { text: "Running everything as root" },
    { text: "Disabling monitoring during attacks" }
  ]}
  correct={1}
  explanation="Resilient design complements mitigation services: rate-limit abusable endpoints, cache to keep surges off the origin, and gracefully shed expensive features under load. The aim is reduced service under pressure instead of total collapse, especially protecting costly app-layer paths."
  revisit={{ to: "/docs/network-security/ddos-mitigation#designing-to-degrade-gracefully", label: "Degrade gracefully" }}
/>

</Quiz>

## What's next

→ Continue to [VPNs & Secure Access](./vpn-and-secure-access) — how remote users and sites connect securely, and why the old VPN model is giving way to identity-aware access.

→ **Going deeper:** availability as a CIA property is [Foundations](/docs/foundations/cia-triad); rate limiting and edge caching are production patterns; the providers that absorb DDoS are part of [Cloud & Identity Security](/docs/cloud-identity).
