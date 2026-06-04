---
id: vpn-and-secure-access
title: VPNs & Secure Access
sidebar_position: 5
sidebar_label: VPNs & secure access
description: How remote users and sites connect securely — what a VPN does, the dangerous over-trust of the traditional VPN model, and why identity-aware access (ZTNA) is replacing "connect to the network, then trust everything."
---

# VPNs & Secure Access

> **In one line:** A **VPN (Virtual Private Network)** creates an encrypted tunnel so remote users/sites can reach private resources over the untrusted internet — but the *traditional* VPN model has a dangerous flaw: once you're "on the VPN," you're often treated as *inside the trusted network* with broad access, so modern **identity-aware access (ZTNA)** replaces "connect then trust" with "verify every request to every resource."

:::tip[In plain English]
People and offices need to reach private company systems from outside — from home, a coffee shop, a branch office. A **VPN** solves the *encryption* part elegantly: it builds a private, encrypted tunnel across the public internet, so your traffic to the company is protected from eavesdroppers, as if your laptop were plugged in at headquarters. The problem is what that *implies*: in the classic model, once you've connected to the VPN, the network treats you as **"inside,"** and inside often means *trusted with broad access to everything*. That's the [flat-network](./segmentation) over-trust again — and it's exactly what attackers exploit. Steal one VPN credential (or compromise one remote laptop) and you're not just in; you're *inside the castle walls* with the run of the place. The modern answer flips the model: instead of "connect to the network, then you're trusted," it's "you're never trusted by location — every access to every resource is verified individually." That's **Zero Trust Network Access (ZTNA)**, and it's where secure remote access is heading. This lesson is that shift.
:::

## What a VPN actually does

A **VPN** establishes an **encrypted tunnel** between a client (or a whole site) and a network, so traffic crossing the untrusted internet is confidential and integrity-protected — using the same [TLS/encryption](/docs/cryptography/tls) primitives from Chapter 2. Two common uses:

- **Remote-access VPN** — an individual user's device tunnels into the corporate network to reach internal resources.
- **Site-to-site VPN** — two networks (e.g., HQ and a branch office, or on-prem and cloud) are connected over an encrypted tunnel as if they were one network.

The *encryption* job, a VPN does well — it genuinely protects data in transit. The problem isn't the tunnel; it's the **access model** wrapped around it.

:::note[Terms, defined once]
- **VPN (Virtual Private Network)** — an encrypted tunnel connecting a client or site to a private network over the public internet.
- **Remote-access vs. site-to-site VPN** — one user device connecting in, vs. two whole networks linked.
- **The "castle-and-moat" model** — the traditional security model: a hard perimeter, with everything inside trusted. VPNs extend the "inside."
- **Implicit trust** — granting broad access based on *where* a connection comes from (e.g., "on the VPN") rather than verifying *who* and *whether allowed* for each resource.
- **ZTNA (Zero Trust Network Access)** — an access model that verifies identity and authorization for *every* request to *every* resource, granting access to specific applications rather than the whole network.
- **Identity-aware proxy** — a gateway that brokers access to individual applications based on verified identity and device posture, a common ZTNA mechanism.
:::

## The flaw: connect once, trusted everywhere

The traditional VPN embodies the **castle-and-moat** model: a hard perimeter (the moat), and everything inside (the castle) implicitly trusted. The VPN is the drawbridge — and once you cross it, you're *inside*, with the broad access "inside" grants.

This is the same [implicit-trust mistake](./segmentation) you've seen repeatedly, and it's devastating for the same reason:

:::caution[Worked example: one stolen VPN credential, broad access]
An attacker [phishes](/docs/offensive/reconnaissance) an employee's VPN credentials (or compromises their remote laptop). They connect to the VPN — and now their traffic is *coming from inside the trusted network*. In the classic model:

- They're treated as a trusted internal user, with network access to broad swaths of internal systems.
- The very [segmentation and monitoring](./segmentation) that might catch an external attacker is often weaker *inside*, because "they're on the VPN, they're one of us."
- From this trusted position, [lateral movement](/docs/offensive/post-exploitation) is easy — exactly the foothold-to-breach journey from the offensive chapter, handed a head start.

One credential converted "outside attacker" into "trusted insider." This is why VPN-credential theft and exploited VPN appliances are recurring headline breach vectors. The encryption did its job perfectly; the *access model* — trust by connection, not by verified identity per resource — was the hole. **Being on the network should not mean being trusted.**
:::

## The shift to identity-aware access (ZTNA)

The modern model, **Zero Trust Network Access (ZTNA)**, fixes the flaw by removing the implicit trust. Its principles:

- **No trust by location.** Being "on the network" (or on the VPN) grants *nothing* by itself. Every access is verified regardless of where it originates — internal, VPN, or internet are all equally untrusted.
- **Verify per request, per resource.** Each attempt to reach an application is independently checked: *who* are you (authenticated [identity](/docs/cloud-identity), ideally with [MFA](/docs/appsec/broken-authentication)), *is your device healthy* (patched, managed), and *are you authorized* for *this specific* resource?
- **Access to applications, not the network.** Instead of dropping you onto the whole network, ZTNA grants access to *individual applications* you're authorized for — usually via an [identity-aware proxy](#what-a-vpn-actually-does). A compromised account reaches only the specific apps it was allowed, not the entire estate. This is [least privilege](/docs/foundations/defense-in-depth) and [microsegmentation](./segmentation) applied to access.

The result: stealing a credential no longer yields "the run of the castle." The attacker must pass per-resource verification (identity + device + authorization) for *each* thing they try to reach, and they're confined to whatever that one identity could access — turning the broad VPN blast radius into a contained one.

:::info[Highlight: VPN ≠ secure access; encryption ≠ authorization]
The deep lesson is the separation of two things the old model fused. A VPN provides **encryption** (a secure tunnel) — necessary and good. But it historically *also* implied **authorization** (you're inside, so you're trusted) — and *that* coupling is the flaw. ZTNA keeps the encryption but **decouples it from trust**: you still get a protected connection, but it grants you *nothing* until each specific access is independently authorized. "I have a secure connection to the network" must never mean "I'm allowed to do things." This is the network-access expression of the [trust-boundary](/docs/foundations/trust-boundaries) and [least-privilege](/docs/foundations/defense-in-depth) principles, and it's the same [zero-trust](./zero-trust) idea the next lesson generalizes.
:::

## Why it matters

- **VPN over-trust is a top breach vector.** Stolen VPN credentials and exploited VPN appliances appear again and again in real breaches precisely because the classic model hands broad internal access for one connection. Understanding *why* is essential.
- **It operationalizes assume-breach for remote access.** ZTNA assumes the connection (and the device, and the credential) might be compromised, so it verifies everything anyway — the [assume-breach](/docs/offensive/post-exploitation) mindset applied to access.
- **It's where the industry is moving.** "VPN to a trusted network" is being replaced by identity-aware, per-application access. Knowing the difference — and why — is current, practical security judgment.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Equating 'on the VPN' with 'trusted.'** A connection's location is not an identity. One stolen credential turns an outsider into a trusted insider. Verify identity and authorization per resource, not by network position.
- **Relying on the VPN for authorization.** The VPN provides encryption, not trust. Don't let "they connected" stand in for "they're allowed."
- **Weak segmentation/monitoring inside the VPN boundary.** Treating VPN users as inside-and-safe disables the very controls that would catch a compromised account. Keep internal segmentation and monitoring strong.
- **No MFA on VPN/remote access.** Single-factor remote access is a credential-theft jackpot. Require [MFA](/docs/appsec/broken-authentication) (ideally phishing-resistant).
- **Forgetting device posture.** A healthy identity on a compromised laptop is still a compromised access. Modern access checks the device, not just the user.
- **Granting network access instead of app access.** Dropping users onto the whole network maximizes blast radius. Grant access to specific applications (ZTNA), not the network.
:::

## Page checkpoint

<Quiz id="vpn-and-secure-access-page" title="Did VPNs & secure access click?" sampleSize={3}>

<Question
  prompt="What does a VPN do well, and what is the flaw in the TRADITIONAL VPN model?"
  options={[
    { text: "It does everything; there's no flaw" },
    { text: "It provides encryption (a secure tunnel over the internet) well; the flaw is the access model — once 'on the VPN' you're treated as inside the trusted network with broad access, so one stolen credential becomes a trusted insider" },
    { text: "It provides authorization well but weak encryption" },
    { text: "Its flaw is that it's too slow" }
  ]}
  correct={1}
  explanation="The encryption (tunnel) is genuinely good. The flaw is implicit trust by location: connecting to the VPN grants broad internal access, so a phished credential or compromised laptop turns an outsider into a trusted insider with the run of the network."
  revisit={{ to: "/docs/network-security/vpn-and-secure-access#the-flaw-connect-once-trusted-everywhere", label: "The flaw" }}
/>

<Question
  prompt="An attacker phishes an employee's VPN credentials and connects. Why is this so dangerous in the classic 'castle-and-moat' model?"
  options={[
    { text: "It isn't dangerous; VPNs are fully secure" },
    { text: "Their traffic now comes from 'inside the trusted network,' granting broad access with often-weaker internal monitoring, making lateral movement easy — one credential converts an outside attacker into a trusted insider" },
    { text: "The VPN encryption fails" },
    { text: "It only exposes the employee's own files" }
  ]}
  correct={1}
  explanation="In castle-and-moat, crossing the drawbridge (VPN) puts you 'inside,' where trust is broad and internal controls are often weaker. From there, lateral movement is easy — the foothold-to-breach journey with a head start. That's why VPN credential theft is a recurring breach vector."
  revisit={{ to: "/docs/network-security/vpn-and-secure-access#the-flaw-connect-once-trusted-everywhere", label: "One stolen credential" }}
/>

<Question
  prompt="What is the core principle of Zero Trust Network Access (ZTNA)?"
  options={[
    { text: "Trust everyone on the corporate network" },
    { text: "No trust by location — every access to every resource is independently verified (who you are, device health, authorization for THAT resource), and you're granted access to specific applications, not the whole network" },
    { text: "Use a longer VPN password" },
    { text: "Encrypt the network twice" }
  ]}
  correct={1}
  explanation="ZTNA removes implicit location-based trust: being on the VPN/network grants nothing. Each request is verified per resource (identity + device + authorization), and access is to individual authorized apps — least privilege and microsegmentation applied to access."
  revisit={{ to: "/docs/network-security/vpn-and-secure-access#the-shift-to-identity-aware-access-ztna", label: "ZTNA principles" }}
/>

<Question
  prompt="Under ZTNA, why does stealing one credential NOT give 'the run of the castle' like a traditional VPN would?"
  options={[
    { text: "Credentials can't be stolen under ZTNA" },
    { text: "The attacker must pass per-resource verification (identity + device + authorization) for each thing they try, and is confined to only the specific applications that one identity is authorized for — turning a broad blast radius into a contained one" },
    { text: "ZTNA blocks all remote access entirely" },
    { text: "ZTNA encrypts the credential so it's useless" }
  ]}
  correct={1}
  explanation="Without location-based trust, a stolen credential grants only what that identity is explicitly authorized to reach, and each access is re-verified (including device posture). The attacker can't roam the network — blast radius is contained to specific authorized apps."
  revisit={{ to: "/docs/network-security/vpn-and-secure-access#the-shift-to-identity-aware-access-ztna", label: "Contained blast radius" }}
/>

<Question
  prompt="What's the deep lesson in 'encryption ≠ authorization'?"
  options={[
    { text: "Encryption is unnecessary" },
    { text: "A VPN provides a secure (encrypted) connection, but having a secure connection must NOT imply being trusted/authorized; ZTNA keeps the encryption while decoupling it from trust, so each access is independently authorized" },
    { text: "Authorization makes encryption redundant" },
    { text: "You should never use a secure tunnel" }
  ]}
  correct={1}
  explanation="The old model fused encryption (the tunnel) with authorization (you're inside, so trusted). ZTNA keeps the protected connection but decouples it from trust: 'I have a secure connection' grants nothing until each specific access is verified — trust boundaries and least privilege, applied to access."
  revisit={{ to: "/docs/network-security/vpn-and-secure-access#the-shift-to-identity-aware-access-ztna", label: "Encryption ≠ authorization" }}
/>

</Quiz>

## What's next

→ Continue to [Egress Filtering](./egress-filtering) — the often-neglected control on *outbound* traffic that stops stolen data and attacker callbacks from leaving your network.

→ **Going deeper:** the encryption a VPN relies on is [TLS](/docs/cryptography/tls); the per-resource verification of ZTNA deepens into [identity and zero trust](/docs/cloud-identity); the general principle is the [next lesson](./zero-trust).
