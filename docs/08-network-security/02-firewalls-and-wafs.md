---
id: firewalls-and-wafs
title: Firewalls & WAFs
sidebar_position: 3
sidebar_label: Firewalls & WAFs
description: Filtering traffic at two different layers — network firewalls (who can connect to what) and Web Application Firewalls (what's inside web requests) — what each can and can't do, and why a WAF is a layer, not a fix.
---

# Firewalls & WAFs

> **In one line:** A **firewall** filters traffic by *connection* — which sources, destinations, and ports are allowed — enforcing the [segment crossings](./segmentation) you defined; a **WAF (Web Application Firewall)** works one layer up, inspecting the *contents* of web requests to block attacks like [SQL injection](/docs/appsec/injection) and [XSS](/docs/appsec/xss) — and the key insight is that they operate at different layers and a WAF is a *layer of defense, never a substitute for secure code*.

:::tip[In plain English]
Two things both called "firewalls," doing very different jobs. A **network firewall** is a bouncer who checks *where you're coming from and where you're going* — it allows or blocks connections based on IP addresses and ports, but doesn't look at what's *inside* the conversation. That's how you enforce "the user network can't connect to the database" from the last lesson. A **Web Application Firewall (WAF)** is a different bouncer who actually *reads the messages* — it inspects the content of web requests and blocks ones that look like attacks (a `' OR '1'='1` in a form field, a `<script>` tag, a path-traversal attempt). The network firewall asks "*should this connection be allowed at all?*"; the WAF asks "*does this allowed web request contain an attack?*". You need both, because they catch different things — but the WAF deserves a warning label: it's a *filter in front of* your app, helpful as a layer, but it does **not** fix the vulnerability behind it. Treating a WAF as a substitute for [secure code](/docs/appsec/defensive-patterns) is a classic, dangerous mistake.
:::

## Network firewalls: filtering by connection

A **firewall** controls which network connections are permitted, based on attributes of the connection — *not* its contents. The classic decision inputs:

- **Source and destination IP** — who's connecting and to what.
- **Port and protocol** — which service (port 443 = HTTPS, 22 = SSH, etc.).
- **Direction** — inbound vs. outbound (the latter matters for [egress filtering](./egress-filtering)).

Firewalls operate on a **default-deny** principle done right: allow only the specific connections needed, block everything else. They're how the [segment boundaries](./segmentation) from the last lesson are actually *enforced* — "the database tier accepts connections only from the app tier on port 5432" is a firewall rule.

:::note[Terms, defined once]
- **Firewall** — a control that allows/denies network connections based on rules (IP, port, protocol, direction).
- **Stateful firewall** — one that tracks connection state (knows a response belongs to a request it allowed), the modern default.
- **Next-Generation Firewall (NGFW)** — a firewall that adds deeper inspection (application awareness, intrusion prevention) beyond just ports/IPs.
- **WAF (Web Application Firewall)** — a filter that inspects HTTP/S request *contents* to block web-application attacks.
- **Security group / network ACL** — the cloud equivalent of firewall rules, attached to resources/subnets (you'll see these in [Cloud Security](/docs/cloud-identity)).
- **Default deny** — the safe baseline: block everything, then explicitly allow only what's needed ([least privilege](/docs/foundations/defense-in-depth) for the network).
- **IDS / IPS** — Intrusion Detection/Prevention System: monitors traffic for malicious patterns and (IPS) blocks them.
:::

## WAFs: filtering by content

A **WAF** sits in front of a web application and inspects the *content* of incoming HTTP/S requests, blocking those that match attack patterns. Because it understands the web layer, it can catch things a network firewall (which only sees "a connection to port 443") is blind to:

- [Injection](/docs/appsec/injection) attempts (SQL, command) in parameters.
- [XSS](/docs/appsec/xss) payloads (`<script>`, event handlers) in inputs.
- Path traversal (`../../`), [SSRF](/docs/appsec/ssrf)-ish patterns, and known-exploit signatures.
- Abnormal request rates or patterns (some WAFs add rate limiting / bot defense).

A WAF is genuinely useful: it's a fast layer that blocks a lot of automated, low-effort attacks and buys time when a new vulnerability is disclosed (a **virtual patch** — a WAF rule blocking exploit attempts while you fix the actual code). But its value comes with a critical caveat.

:::caution[Worked example: why a WAF is a layer, not a fix]
Your app has a [SQL injection](/docs/appsec/injection) vulnerability — a query built by string concatenation. You add a WAF that blocks requests containing obvious SQL-injection patterns. Problem solved?

**No — the vulnerability is still there.** The WAF is a *filter in front of* the flaw, and filters can be bypassed:
- Attackers use encodings, obfuscation, and novel payloads the WAF's patterns don't match (the same losing [blocklist arms race](/docs/appsec/injection) as input filtering — you can't enumerate all attacks).
- A request that reaches the app through *any* path the WAF doesn't cover (a different endpoint, an internal API, a missed parameter) hits the live bug.
- WAF rules have false positives, so teams loosen them under pressure — reopening the hole.

The *real* fix is [parameterizing the query](/docs/appsec/injection) — making the vulnerability structurally impossible. The WAF is a valuable *additional layer* ([defense in depth](/docs/foundations/defense-in-depth)) that reduces noise and buys time, but treating it as the fix means shipping the bug and hoping the filter holds. **Secure the code; use the WAF as a layer on top, never instead.**
:::

## Two layers, two questions

The clean mental model: firewalls and WAFs answer different questions at different layers, and you want both:

| | **Network firewall** | **WAF** |
|---|----------------------|---------|
| **Layer** | Network/transport (IPs, ports) | Application (HTTP content) |
| **Question** | "Should this connection be allowed?" | "Does this allowed web request contain an attack?" |
| **Sees** | Source/dest, port, protocol | Request contents (parameters, headers, body) |
| **Blind to** | What's *inside* the traffic | Connections to non-web services |
| **Enforces** | [Segmentation](./segmentation), least-privilege connectivity | Web-attack filtering, virtual patching |

A network firewall won't catch a SQL injection (it just sees an allowed HTTPS connection); a WAF won't stop an attacker connecting to your exposed database port (that's not a web request). They're complementary [defense-in-depth](/docs/foundations/defense-in-depth) layers — and neither replaces the [secure design and code](/docs/secure-sdlc) underneath.

:::info[Highlight: filters in front, fixes behind]
Both firewalls and WAFs are *perimeter filters* — they reduce what reaches your systems, which is real and valuable. But the durable security is *behind* them: [segmentation and least privilege](./segmentation) so a connection that gets through can't reach much, and [secure code](/docs/appsec/defensive-patterns) so a request that gets through can't exploit anything. Filters lower the volume and buy time; they don't fix the underlying weakness. The mature posture is "defense in depth": strong filters *and* a hardened core, with the core being the thing you actually rely on.
:::

## Why it matters

- **Firewalls enforce your network design.** Segmentation is just a diagram until firewall rules implement it. They're how "who can reach what" becomes real.
- **WAFs blunt the constant background attack.** The internet is a perpetual storm of automated exploit attempts; a WAF filters much of that noise and provides virtual patching when a new CVE drops — valuable breathing room.
- **The "layer not a fix" lesson generalizes.** Mistaking a perimeter filter for a real fix is a recurring, dangerous error across security. Internalizing it here — WAF over insecure code — inoculates you against it everywhere.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Treating a WAF as a substitute for secure code.** It's a bypassable filter in front of the bug. Fix the vulnerability ([parameterize](/docs/appsec/injection), [encode](/docs/appsec/xss)); use the WAF as an extra layer.
- **Over-permissive firewall rules.** "Allow all internal" or broad port ranges defeat segmentation. Default-deny and allow only what's needed.
- **Firewall at the edge only.** Edge filtering with a flat interior leaves lateral movement open. Enforce internal segment boundaries too.
- **Relying on WAF blocklists alone.** Pattern-matching attacks is the losing arms race; attackers obfuscate around it. The WAF reduces noise, not the need for structural fixes.
- **Loosening WAF rules to kill false positives, permanently.** Disabling protections to stop noise can reopen real holes. Tune carefully; fix the app so you don't depend on the WAF.
- **Confusing the two tools' jobs.** A network firewall won't catch SQLi; a WAF won't stop a raw connection to an exposed database. Use both for their respective layers.
:::

## Page checkpoint

<Quiz id="firewalls-and-wafs-page" title="Did firewalls & WAFs click?" sampleSize={3}>

<Question
  prompt="What is the key difference between a network firewall and a WAF?"
  options={[
    { text: "They're the same thing with different names" },
    { text: "A network firewall filters by CONNECTION (IPs, ports — 'should this connection be allowed?'); a WAF inspects the CONTENT of web requests ('does this allowed request contain an attack?') — different layers, both needed" },
    { text: "A firewall is software; a WAF is hardware" },
    { text: "A WAF only works on encrypted traffic" }
  ]}
  correct={1}
  explanation="A network firewall decides whether a connection is permitted based on IP/port/protocol; a WAF reads HTTP request contents to block web attacks like SQLi and XSS. They operate at different layers and catch different things, so you use both."
  revisit={{ to: "/docs/network-security/firewalls-and-wafs#two-layers-two-questions", label: "Two layers, two questions" }}
/>

<Question
  prompt="Your app has a SQL injection bug. You add a WAF that blocks injection-looking requests. Is the vulnerability fixed?"
  options={[
    { text: "Yes, the WAF fully fixes it" },
    { text: "No — the WAF is a bypassable filter in front of the still-present bug (attackers obfuscate, find uncovered paths, or the rule gets loosened); the real fix is parameterizing the query. Use the WAF as a layer, not a substitute" },
    { text: "Yes, as long as the WAF is expensive" },
    { text: "The bug disappears once traffic is filtered" }
  ]}
  correct={1}
  explanation="A WAF filters in front of the flaw but can't make it go away — encodings, uncovered endpoints, and loosened rules all reach the live bug. Parameterization makes the vuln structurally impossible. WAF is valuable defense in depth, never the fix."
  revisit={{ to: "/docs/network-security/firewalls-and-wafs#wafs-filtering-by-content", label: "A WAF is a layer, not a fix" }}
/>

<Question
  prompt="A network firewall is how you ENFORCE what network design from the last lesson?"
  options={[
    { text: "Encryption" },
    { text: "Segmentation — firewall rules implement the controlled crossings (e.g., 'database tier accepts connections only from the app tier on its port'), turning a segmentation diagram into reality" },
    { text: "Password policies" },
    { text: "Backups" }
  ]}
  correct={1}
  explanation="Segmentation is just a plan until firewall rules implement the allowed crossings. Default-deny firewall rules that permit only necessary connections (app tier → database, nothing else) are how segment boundaries are actually enforced."
  revisit={{ to: "/docs/network-security/firewalls-and-wafs#network-firewalls-filtering-by-connection", label: "Firewalls enforce segmentation" }}
/>

<Question
  prompt="What is a WAF 'virtual patch'?"
  options={[
    { text: "An update to the WAF's own firmware" },
    { text: "A WAF rule that blocks exploit attempts against a newly-disclosed vulnerability, buying time to fix the actual code — useful breathing room, but not a replacement for patching the real flaw" },
    { text: "A permanent fix that replaces code changes" },
    { text: "A way to encrypt the application" }
  ]}
  correct={1}
  explanation="When a new CVE drops, a WAF rule can block known exploit attempts immediately, giving you time to remediate the real vulnerability. It's valuable temporary protection — a layer — not a substitute for actually fixing the code."
  revisit={{ to: "/docs/network-security/firewalls-and-wafs#wafs-filtering-by-content", label: "Virtual patching" }}
/>

<Question
  prompt="What general security lesson does 'a WAF is a layer, not a fix' teach?"
  options={[
    { text: "Perimeter filters are useless" },
    { text: "Filters in front (WAF, firewall) reduce what reaches you and buy time, but the durable security is behind them — secure code and least-privilege design; mistaking a perimeter filter for a real fix is a recurring dangerous error" },
    { text: "You should only use one layer of defense" },
    { text: "Encryption replaces all filtering" }
  ]}
  correct={1}
  explanation="Both firewalls and WAFs are valuable perimeter filters, but they're bypassable and don't remove the underlying weakness. Rely on the hardened core (segmentation, least privilege, secure code) with filters as layers on top — defense in depth, not perimeter-as-fix."
  revisit={{ to: "/docs/network-security/firewalls-and-wafs#why-it-matters", label: "Filters in front, fixes behind" }}
/>

</Quiz>

## What's next

→ Continue to [DDoS Mitigation](./ddos-mitigation) — defending the third leg of the [CIA triad](/docs/foundations/cia-triad), availability, against attackers who try to drown your systems in traffic.

→ **Going deeper:** the segments firewalls enforce are the [last lesson](./segmentation); the web attacks WAFs filter are [Chapter 3](/docs/appsec); cloud firewall equivalents (security groups) are [Cloud & Identity Security](/docs/cloud-identity).
