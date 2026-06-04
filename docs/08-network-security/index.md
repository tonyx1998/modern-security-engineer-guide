---
id: network-security-overview
title: 8. Network Security — Overview
sidebar_position: 1
sidebar_label: Network security intro
description: Controlling how systems talk — segmentation, firewalls and WAFs, DDoS mitigation, VPNs, egress filtering, and the shift to zero-trust networking.
---

# Part 8: Network Security

> **In one line:** Attackers move *through* networks — so controlling who can reach what, containing blast radius with segmentation, filtering traffic in and out, and replacing "trusted internal network" with **zero trust** are core defensive levers this chapter makes concrete.

:::tip[In plain English]
The old model trusted anything "inside" the network; modern security assumes the inside is already partly compromised and verifies every connection. This chapter covers how traffic is controlled and contained: **segmentation** so a breach in one place can't reach everything, **firewalls/WAFs** to filter what's allowed, **egress filtering** to stop stolen data (or a planted implant) from phoning home, **DDoS** defenses for availability, and **zero-trust networking** — the principle that no connection is trusted by location alone. It's the network-layer complement to the cloud and identity controls in the next chapter.
:::

## What this chapter covers

- **Segmentation** — limiting lateral movement and blast radius.
- **Firewalls & WAFs** — filtering at the network and application edges.
- **DDoS mitigation** — protecting availability under attack.
- **VPNs & secure access** — and why they're giving way to identity-aware access.
- **Egress filtering** — controlling outbound traffic to stop exfiltration and C2.
- **Zero-trust networking** — verify every connection; trust nothing by location.

## The lessons in this chapter

1. **[Network Segmentation →](/docs/network-security/segmentation)** — dividing the network so a breach can't reach everything; the top brake on lateral movement.
2. **[Firewalls & WAFs →](/docs/network-security/firewalls-and-wafs)** — filtering by connection vs. by content, and why a WAF is a layer, not a fix.
3. **[DDoS Mitigation →](/docs/network-security/ddos-mitigation)** — defending availability with absorption, scrubbing, and graceful degradation.
4. **[VPNs & Secure Access →](/docs/network-security/vpn-and-secure-access)** — the over-trust of the classic VPN and the shift to identity-aware access (ZTNA).
5. **[Egress Filtering →](/docs/network-security/egress-filtering)** — controlling outbound traffic to strand C2 and exfiltration after a breach.
6. **[Zero-Trust Networking →](/docs/network-security/zero-trust)** — the unifying principle: never trust by location, verify every connection.

Finish with the **[Chapter 8 checkpoint →](/docs/network-security/network-security-checkpoint)** to certify the toolkit before Chapter 9.

---

→ Start here: [Network Segmentation](/docs/network-security/segmentation).
