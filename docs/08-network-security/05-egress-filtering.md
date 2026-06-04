---
id: egress-filtering
title: Egress Filtering
sidebar_position: 6
sidebar_label: Egress filtering
description: Controlling OUTBOUND traffic — the neglected half of firewalling that stops data exfiltration and attacker command-and-control from leaving your network, even after a breach.
---

# Egress Filtering

> **In one line:** Most firewalling obsesses over *inbound* traffic (keeping attackers out), but **egress filtering** — controlling *outbound* traffic — is the neglected control that limits the damage *after* a breach: it can block the attacker's [command-and-control](/docs/offensive/post-exploitation) callbacks and the [exfiltration](/docs/offensive/post-exploitation) of stolen data, because almost every modern attack needs to *talk out*.

:::tip[In plain English]
Everyone locks their front door (inbound filtering — keep attackers from getting in). Far fewer think about the *back* door: what's allowed to leave? **Egress filtering** is controlling *outbound* traffic, and it's one of the most underused defenses there is. Here's why it's so powerful: a modern attacker who gets inside almost always needs to *communicate outward* — their malware "phones home" to receive commands ([command-and-control](/docs/offensive/post-exploitation)), and stealing your data means *sending it out* ([exfiltration](/docs/offensive/post-exploitation)). If you only filter inbound traffic and let anything leave freely, then once an attacker is in, they have an open road to control their implant and haul your data out the back. Egress filtering closes that road: by default, your systems can only reach the *specific* external destinations they legitimately need, so an attacker's callback to their server and their attempt to ship out a database both hit a wall — and the *attempt itself* becomes a loud [alarm](/docs/detection). It's [assume-breach](/docs/offensive/post-exploitation) made concrete: you can't always stop the break-in, but you can stop the getaway.
:::

## Why outbound control is the neglected half

Traditional network security is **inbound-obsessed**: firewalls, [WAFs](./firewalls-and-wafs), and intrusion prevention all focus on stopping bad traffic from coming *in*. Outbound traffic is usually left wide open — "it's our systems talking, surely that's fine." But consider what *needs* to go out for an attack to succeed:

- **Command-and-control (C2)** — after gaining a foothold, the attacker's malware connects *outward* to their server to receive instructions. No outbound path, no remote control.
- **Exfiltration** — stealing data means *transmitting it out* of your network to somewhere the attacker controls. No outbound path, no theft (or a much harder one).
- **Downloading more tools** — attackers often pull additional payloads from external servers after the initial compromise.

Every one of these is *outbound*. So egress filtering attacks the breach at its most vulnerable point: the attacker can sometimes get *in* through a path you didn't anticipate, but they almost always have to *reach back out* — and that's a step you *can* control.

:::note[Terms, defined once]
- **Egress filtering** — controlling/restricting outbound network traffic (what your systems are allowed to connect *to*).
- **Ingress filtering** — controlling inbound traffic (the traditional firewall focus).
- **Command-and-control (C2)** — the outbound channel an attacker uses to control compromised systems.
- **Exfiltration** — transferring stolen data out of the victim network.
- **Beaconing** — the regular, periodic outbound "check-ins" malware makes to its C2 server.
- **Default-deny egress** — outbound blocked by default, allowing only specific necessary destinations (the strong posture).
- **DNS exfiltration** — sneaking data out encoded in DNS queries, a common way to bypass naïve egress controls.
:::

## How egress filtering limits a breach

The strong posture is **default-deny egress**: your systems can make outbound connections only to the *specific* destinations they actually need, and everything else is blocked. Applied to the [post-exploitation](/docs/offensive/post-exploitation) steps:

:::note[Worked example: egress filtering breaks the breach chain]
An attacker compromises an internal application server (say, via [SSRF](/docs/appsec/ssrf) or a vulnerability). Their plan: establish C2 and exfiltrate the database. Compare two networks:

**No egress filtering (outbound wide open):**
- The implant connects out to the attacker's C2 server on the internet → ✅ control established.
- The attacker queries the database and ships gigabytes out to their server → ✅ data stolen.
- One foothold → full breach, the attacker operating freely.

**Default-deny egress (server may only reach what it needs):**
- That application server's job requires talking to the *database* and maybe one *payment API* — nothing else outbound. So:
- The implant's connection to the attacker's C2 server → ❌ **blocked** (not an allowed destination). The attacker can't control their implant.
- The attempt to exfiltrate data to an unknown external host → ❌ **blocked**.
- And critically, **both blocked attempts generate [alerts](/docs/detection)** — an internal server trying to reach an unknown internet address is a high-signal sign of compromise.

The break-in still happened, but the attacker is *stranded*: no C2, no exfiltration path, and they've tripped alarms trying. Egress filtering converted a breach into a contained, detected incident — by controlling the one thing the attack couldn't avoid: reaching back out.
:::

This is why egress filtering is such high-leverage [defense-in-depth](/docs/foundations/defense-in-depth): it doesn't prevent the initial compromise, but it severs the attacker's lifeline *and* lights up detection — exactly when you need both.

## What good egress control looks like

- **Default-deny outbound**, allowing only required destinations per system. A database server has *no business* connecting to arbitrary internet hosts; a build server needs only its package registries; most internal systems need very little outbound at all.
- **Allowlist destinations**, not blocklist — the same [structural lesson](/docs/appsec/injection) as everywhere: you can list the few legitimate destinations, but never enumerate all bad ones.
- **Control DNS, too.** Attackers tunnel data out via DNS queries to bypass naïve filtering. Route DNS through controlled resolvers, monitor for anomalous query patterns, and don't let arbitrary outbound DNS flow freely.
- **Proxy and inspect where feasible** — funnel outbound web traffic through a proxy that enforces the allowlist and logs destinations, giving both control and visibility.
- **Monitor outbound as detection.** Even where you can't block, *watching* outbound traffic catches [beaconing](/docs/incident-forensics/forensic-artifacts) (regular check-ins to one host) and exfiltration (large/unusual transfers) — the [network telemetry](/docs/detection/logging-telemetry) from the detection chapter, used proactively.

:::info[Highlight: you can't always stop the break-in, but you can stop the getaway]
Inbound defense tries to prevent compromise; egress filtering accepts that compromise sometimes happens and attacks the attacker's *next* required step. Because nearly every modern attack must reach back out — for control, for data, for more tools — outbound control is one of the few places where a *single* defense disrupts *most* attack chains at once. And it's doubly valuable: it both *blocks* the attacker's lifeline and *reveals* them (the blocked outbound attempt is a high-confidence alert). It's the network embodiment of [assume breach](/docs/offensive/post-exploitation) and [least privilege](/docs/foundations/defense-in-depth) — limit what a compromised system can *do*, including where it can talk.
:::

## Why it matters

- **It limits damage when prevention fails.** The initial compromise is often unavoidable; egress filtering ensures it doesn't become control + theft. It directly caps the *impact* half of [risk](/docs/foundations/threat-vuln-risk).
- **It disrupts most attack chains at one chokepoint.** C2, exfiltration, and tool-downloading are all outbound. Controlling outbound hits all of them — rare leverage for a single control.
- **It's a force-multiplier for detection.** Blocked or anomalous outbound traffic is among the highest-signal indicators of compromise, turning egress control into a detection sensor as well as a barrier.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Filtering inbound only.** Leaving outbound wide open gives an attacker who gets in a free path for C2 and exfiltration. Control egress too.
- **Allowing all outbound 'because it's our systems.'** Compromised systems are *also* "your systems" talking out. Default-deny egress; allow only what each system needs.
- **Blocklisting bad destinations.** You can't list every attacker server. Allowlist the few legitimate destinations instead.
- **Ignoring DNS.** Attackers exfiltrate via DNS to slip past crude egress rules. Control and monitor DNS, don't leave it open.
- **Not monitoring outbound even where you can't block.** Beaconing and large transfers are top compromise indicators. Watch outbound traffic as detection.
- **Letting servers reach the whole internet.** A database or internal app server rarely needs broad outbound access. Tightly scope it — broad outbound is an attacker's exfiltration highway.
:::

## Page checkpoint

<Quiz id="egress-filtering-page" title="Did egress filtering click?" sampleSize={3}>

<Question
  prompt="What is egress filtering, and why is it so powerful against modern attacks?"
  options={[
    { text: "Filtering inbound traffic to keep attackers out" },
    { text: "Controlling OUTBOUND traffic — because almost every modern attack must reach back out (C2 callbacks, data exfiltration, downloading tools), restricting outbound severs the attacker's lifeline after a breach" },
    { text: "Encrypting traffic leaving the network" },
    { text: "Blocking all network traffic entirely" }
  ]}
  correct={1}
  explanation="Egress filtering controls what your systems may connect TO. Since attackers must establish command-and-control and exfiltrate data outward, restricting outbound traffic disrupts the breach at a step the attacker can't avoid — reaching back out."
  revisit={{ to: "/docs/network-security/egress-filtering#why-outbound-control-is-the-neglected-half", label: "The neglected half" }}
/>

<Question
  prompt="An attacker compromises an internal app server on a network with default-deny egress (the server may only reach its database and one payment API). What happens to their C2 and exfiltration attempts?"
  options={[
    { text: "Both succeed, since they're already inside" },
    { text: "Both are BLOCKED (the attacker's C2 server and unknown exfiltration host aren't allowed destinations), AND both blocked attempts generate high-signal alerts — the breach is stranded and detected" },
    { text: "Only the C2 succeeds" },
    { text: "Egress filtering has no effect after a breach" }
  ]}
  correct={1}
  explanation="With outbound limited to legitimate destinations, the implant can't reach the attacker's C2 server and data can't be shipped to an unknown host — both blocked. The attempts also trip alarms (an internal server reaching an unknown internet address is highly suspicious), so the breach is contained and revealed."
  revisit={{ to: "/docs/network-security/egress-filtering#how-egress-filtering-limits-a-breach", label: "Breaking the breach chain" }}
/>

<Question
  prompt="Which is the correct egress posture?"
  options={[
    { text: "Allow all outbound; block specific known-bad destinations" },
    { text: "Default-deny outbound, allowlisting only the specific destinations each system legitimately needs — the same structural lesson as injection defense (you can list the few good ones, never all the bad ones)" },
    { text: "Block all outbound including legitimate traffic" },
    { text: "Only filter outbound DNS, nothing else" }
  ]}
  correct={1}
  explanation="Default-deny with a destination allowlist is the strong posture: a database server has no business reaching arbitrary internet hosts. Allowlisting the few legitimate destinations beats trying to blocklist every attacker server — you can't enumerate all bad ones."
  revisit={{ to: "/docs/network-security/egress-filtering#what-good-egress-control-looks-like", label: "Default-deny egress" }}
/>

<Question
  prompt="Why must egress control also address DNS?"
  options={[
    { text: "DNS isn't relevant to egress" },
    { text: "Attackers can tunnel stolen data out encoded in DNS queries (DNS exfiltration) to bypass naïve egress filtering, so DNS should be routed through controlled resolvers and monitored for anomalous patterns" },
    { text: "DNS is always encrypted and safe" },
    { text: "Because DNS blocks all attacks automatically" }
  ]}
  correct={1}
  explanation="DNS exfiltration sneaks data out inside DNS queries, slipping past egress rules that only consider web traffic. Controlling DNS (forcing it through monitored resolvers, watching for anomalous query patterns) closes that bypass."
  revisit={{ to: "/docs/network-security/egress-filtering#what-good-egress-control-looks-like", label: "Control DNS too" }}
/>

<Question
  prompt="Beyond blocking, how does egress control help detection?"
  options={[
    { text: "It doesn't help detection at all" },
    { text: "A blocked or anomalous outbound connection (an internal server reaching an unknown host, regular beaconing, or a large unusual transfer) is among the highest-signal indicators of compromise — egress control doubles as a detection sensor" },
    { text: "It encrypts the logs" },
    { text: "It deletes suspicious traffic silently" }
  ]}
  correct={1}
  explanation="Egress control both blocks the attacker's lifeline and reveals them: blocked outbound attempts and anomalous outbound patterns (beaconing, large transfers) are high-confidence compromise indicators. So it's a barrier and a sensor at once — assume-breach made concrete."
  revisit={{ to: "/docs/network-security/egress-filtering#how-egress-filtering-limits-a-breach", label: "Egress as detection" }}
/>

</Quiz>

## What's next

→ Continue to [Zero-Trust Networking](./zero-trust) — the principle that unifies this whole chapter: trust nothing by location, verify every connection, and treat the network itself as hostile.

→ **Going deeper:** the C2 and exfiltration egress blocks are [post-exploitation](/docs/offensive/post-exploitation); watching outbound traffic is [network telemetry](/docs/detection/logging-telemetry); the assume-breach mindset is [Foundations](/docs/offensive/post-exploitation).
