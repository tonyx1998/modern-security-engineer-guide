---
id: ssrf
title: Server-Side Request Forgery (SSRF)
sidebar_position: 7
sidebar_label: SSRF
description: Tricking the server into making requests for the attacker — reaching internal services and cloud metadata. Why it's so impactful in the cloud, and how to defend it.
---

# Server-Side Request Forgery (SSRF)

> **In one line:** **SSRF** is when an attacker gets *your server* to make HTTP (or other) requests to a destination *they* choose — turning your trusted server into a proxy that can reach internal-only services and cloud metadata endpoints an outside attacker never could — and the defense is to never let user input freely determine where the server connects.

:::tip[In plain English]
Some features make your server fetch a URL on a user's behalf: "import an image from a link," "send this webhook," "preview this site," "fetch this RSS feed." The user gives a URL; the server goes and gets it. **SSRF** abuses that: instead of a normal URL, the attacker supplies one pointing *inward* — at your own internal network, a database admin panel that's not exposed to the internet, or (the big one in the cloud) the special address that hands out your server's cloud credentials. Your server, sitting *inside* the trusted network, happily makes the request the attacker couldn't make from outside, and returns the result. The attacker borrows your server's network position and trust. It's why a humble "fetch this URL" feature became one of the most dangerous bugs of the cloud era — and why it earned its own spot ([A10](./owasp-top-10)) in the Top 10.
:::

## The mechanism: your server as a confused proxy

The attacker's outside machine can't reach your internal services — that's the point of a private network. But **your server can.** SSRF tricks the server into being the attacker's hands inside the trust boundary.

```
   Attacker (outside) ──"fetch http://internal-admin/"──▶ YOUR SERVER ──▶ internal-admin
        ✗ can't reach internal-admin directly                 ✓ is inside the network
   Attacker ◀────────── response relayed back ──────────────────┘
```

The flaw is the same [trust-boundary](/docs/foundations/trust-boundaries) error in a new costume: **user input (a URL) controls a sensitive action (where the server connects)** without restriction. Where injection makes input become *code*, SSRF makes input become a *destination*.

:::note[Terms, defined once]
- **SSRF (Server-Side Request Forgery)** — coercing a server into making attacker-chosen requests.
- **Cloud metadata endpoint** — a special link-local address (historically `169.254.169.254`) that cloud VMs query to get their own config — *including temporary IAM credentials*. Reachable only from the instance itself, which is exactly why SSRF to it is devastating.
- **Internal/private address space** — IP ranges (e.g., `10.0.0.0/8`, `127.0.0.1`, `localhost`) that exist inside your network and aren't routable from the internet.
- **Blind SSRF** — the response isn't returned to the attacker, but the *request itself* still causes effects (hitting an internal action) or leaks via timing/out-of-band signals.
- **Allowlist** — an explicit list of permitted destinations; the core SSRF defense (the opposite of trying to *blocklist* bad ones).
:::

## Why SSRF is so dangerous in the cloud

:::caution[Worked example: SSRF to cloud credential theft]
An app has a "fetch image from URL" feature. The attacker submits, instead of an image URL:

```
http://169.254.169.254/latest/meta-data/iam/security-credentials/app-role
```

This is the **cloud metadata endpoint** — reachable only from inside the instance. The server, running inside the cloud, fetches it and returns the response: a set of **temporary IAM credentials** for the server's role. The attacker now holds the server's cloud keys and can do whatever that role permits — read S3 buckets, query databases, spin up resources. A single "fetch a URL" feature became *full cloud account compromise.*

This exact pattern caused one of the largest cloud breaches on record. Two defenses would have stopped it: (1) the app should never have fetched an internal/link-local address, and (2) the cloud's *newer metadata service version* requires a session token (a header the SSRF can't easily set), so credentials aren't handed out to a naïve GET. **Both** — block internal destinations *and* require the hardened metadata service — is the lesson.
:::

Beyond credential theft, SSRF lets attackers:
- **Port-scan and reach internal services** (admin panels, databases, message queues) that assume "only internal traffic reaches me."
- **Hit internal APIs that trust the network** — the [flat-internal-trust](/docs/foundations/trust-boundaries) mistake, now exploitable from outside via your server.
- **Bypass IP allowlists**, since the request originates from *your trusted server's* IP.
- **Exfiltrate or cause actions via blind SSRF**, even when no response comes back.

## How to defend SSRF

SSRF resists naïve fixes because the attacker has many tricks to disguise an internal destination (redirects to internal IPs, DNS that resolves to `169.254.169.254`, alternate IP encodings, `[::]`/`0.0.0.0`). So defense is layered:

1. **Allowlist destinations, don't blocklist.** If the feature should fetch from a known set of hosts/domains, permit *only* those. Blocklisting internal ranges is bypassable; an allowlist of "these three image CDNs" is robust.
2. **Block internal and link-local targets explicitly** — `127.0.0.0/8`, `10/8`, `172.16/12`, `192.168/16`, `169.254/16`, `::1`, etc. — and re-check **after DNS resolution and after each redirect** (resolve the hostname, validate the *resolved IP*, then connect to that IP). Validating only the user-supplied string misses DNS-rebinding and redirect tricks.
3. **Disable unneeded URL schemes and redirect-following.** Restrict to `https` (and the hosts you allow); don't auto-follow redirects into internal space; reject `file://`, `gopher://`, etc.
4. **Harden the cloud metadata service.** Require the token-based metadata version (IMDSv2-style) so a simple GET can't lift credentials; apply [least privilege](/docs/foundations/defense-in-depth) to the instance role so even stolen creds reach little.
5. **Network-segment egress.** Don't let the fetching service reach the metadata endpoint or sensitive internal hosts at all; a service that only needs the public internet shouldn't be able to call `169.254.169.254` or your database admin port.
6. **Send the response through a filter, or don't return it.** Returning raw fetched content enables data exfiltration; where possible, fetch server-side without echoing arbitrary responses back to the user.

:::info[Highlight: SSRF is "least privilege for the network"]
Notice every solid SSRF defense is a [Foundations](/docs/foundations) principle applied to *where the server can connect*: allowlist (deny by default), block internal targets (trust boundaries), least-privilege instance roles and segmented egress (least privilege + defense in depth). SSRF is so impactful precisely where those network-level controls are missing — a flat internal network with a god-mode instance role turns one fetch into total compromise.
:::

## Why it matters

- **It's a cloud-era apex bug.** SSRF + an over-privileged instance role + a soft metadata endpoint = account takeover, and it has produced headline breaches. Its rise is why it earned a dedicated Top-10 slot.
- **It defeats the network perimeter.** SSRF specifically weaponizes the gap between "outside can't reach internal" and "our server can," which is exactly the assumption flat networks rely on.
- **It connects appsec to cloud security.** The bug is in the app, but the impact and the best defenses live in [cloud and network architecture](/docs/cloud-identity) — making it a perfect bridge between this chapter and the infrastructure chapters.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Blocklisting instead of allowlisting.** Attackers bypass blocklists with redirects, DNS tricks, and odd IP encodings. Allowlist the few legitimate destinations.
- **Validating the URL string but not the resolved IP.** A hostname can resolve to an internal IP (DNS rebinding); a redirect can jump inward. Re-validate the *actual IP* after DNS and after each redirect, and connect to that IP.
- **Leaving the metadata service unhardened.** A plain GET to `169.254.169.254` handing out credentials is the worst case. Require token-based metadata (IMDSv2-style) and least-privilege roles.
- **Over-privileged instance roles.** Even if SSRF reaches metadata, scoped credentials limit the damage. Don't give servers broad cloud permissions.
- **Unrestricted egress.** If the fetching service can reach anything internally, SSRF can too. Segment the network so it can only reach what it must.
- **Returning fetched content verbatim.** That hands the internal response straight to the attacker. Avoid echoing arbitrary fetched data.
:::

## Page checkpoint

<Quiz id="ssrf-page" title="Did SSRF click?" sampleSize={3}>

<Question
  prompt="What is SSRF, fundamentally?"
  options={[
    { text: "An attack that crashes the server with traffic" },
    { text: "Tricking the server into making attacker-chosen requests, so it reaches internal/cloud destinations the attacker couldn't reach directly — borrowing the server's network position and trust" },
    { text: "Injecting SQL into a query" },
    { text: "Stealing a session cookie via JavaScript" }
  ]}
  correct={1}
  explanation="SSRF abuses a 'server fetches a URL' feature so the server becomes the attacker's proxy inside the trust boundary, reaching internal services and cloud metadata that are unreachable from outside. Input (a URL) controls a sensitive action (where the server connects)."
  revisit={{ to: "/docs/appsec/ssrf#the-mechanism-your-server-as-a-confused-proxy", label: "The mechanism" }}
/>

<Question
  prompt="Why is SSRF to the cloud metadata endpoint (e.g., 169.254.169.254) so catastrophic?"
  options={[
    { text: "It crashes the metadata service" },
    { text: "That endpoint returns the instance's temporary IAM credentials; reaching it via SSRF can hand the attacker the server's cloud keys — potentially full account compromise" },
    { text: "It only reveals the server's hostname" },
    { text: "It's harmless — that address isn't routable" }
  ]}
  correct={1}
  explanation="The metadata endpoint is reachable only from the instance and hands out its role credentials. SSRF reaches it via the server, leaking cloud keys — exactly how a famous large-scale cloud breach happened. Defenses: block internal targets AND require token-based metadata (IMDSv2)."
  revisit={{ to: "/docs/appsec/ssrf#why-ssrf-is-so-dangerous-in-the-cloud", label: "SSRF in the cloud" }}
/>

<Question
  prompt="Why is BLOCKLISTING internal addresses an unreliable SSRF defense compared to allowlisting destinations?"
  options={[
    { text: "Blocklists are slower" },
    { text: "Attackers bypass blocklists with redirects to internal IPs, DNS that resolves inward, and alternate IP encodings; an allowlist of the few legitimate destinations is far more robust" },
    { text: "Allowlists don't work either" },
    { text: "Blocklisting requires HTTPS" }
  ]}
  correct={1}
  explanation="There are too many ways to disguise an internal destination for a blocklist to catch them all. Permitting only known-good destinations (deny by default) sidesteps the arms race. Also re-validate the RESOLVED IP after DNS and each redirect."
  revisit={{ to: "/docs/appsec/ssrf#how-to-defend-ssrf", label: "Allowlist, don't blocklist" }}
/>

<Question
  prompt="A defender validates the user-supplied URL string and rejects ones containing internal IPs, but SSRF still works. What likely got past the check?"
  options={[
    { text: "The attacker used HTTPS" },
    { text: "A hostname that resolves to an internal IP (DNS rebinding) or a redirect that jumps inward — validation must check the RESOLVED IP after DNS and after each redirect, then connect to that IP" },
    { text: "The server was too fast" },
    { text: "Nothing — string validation is sufficient" }
  ]}
  correct={1}
  explanation="Validating only the literal string misses hostnames that resolve to internal IPs and redirects into internal space. Resolve the host, validate the actual IP against your rules, follow redirects carefully (re-validating each), and connect to the validated IP."
  revisit={{ to: "/docs/appsec/ssrf#how-to-defend-ssrf", label: "Validate the resolved IP" }}
/>

<Question
  prompt="Which set of defenses best reflects 'SSRF is least privilege for the network'?"
  options={[
    { text: "Bigger servers and more bandwidth" },
    { text: "Allowlist destinations, block internal/link-local targets, segment egress so the service can't reach metadata/internal hosts, and use a least-privilege instance role + hardened metadata service" },
    { text: "Encrypt the fetched content" },
    { text: "Use UUIDs for resource IDs" }
  ]}
  correct={1}
  explanation="Every strong SSRF defense is a Foundations principle applied to where the server may connect: deny-by-default allowlisting, trust-boundary enforcement (block internal), and least privilege + segmentation so even a successful SSRF reaches little. Layer them."
  revisit={{ to: "/docs/appsec/ssrf#how-to-defend-ssrf", label: "Least privilege for the network" }}
/>

</Quiz>

## What's next

→ Continue to [Unsafe Deserialization & XXE](./deserialization-xxe) — the last of the server-side injection-family classes, where trusting a serialized blob or an XML document turns into remote code execution.

→ **Going deeper:** the cloud-side defenses (metadata hardening, least-privilege roles, egress segmentation) are detailed in [Cloud & Identity Security](/docs/cloud-identity) and [Network Security](/docs/network-security).
