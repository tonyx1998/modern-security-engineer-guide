---
id: reconnaissance
title: Reconnaissance
sidebar_position: 4
sidebar_label: Reconnaissance
description: Mapping the target's attack surface before touching it — passive recon (OSINT) vs. active recon (scanning and enumeration), and why the map you build determines everything that follows.
---

# Reconnaissance

> **In one line:** **Reconnaissance** is the attacker's mapping phase — discovering everything that makes up the target's [attack surface](/docs/foundations/attacker-mindset) — and it splits into **passive** recon (gathering public information without touching the target) and **active** recon (probing the target directly), because the completeness of your map decides whether you find the *one* exposed thing that matters.

:::danger[Authorized scope only]
Active reconnaissance — scanning, enumeration, probing — *touches the target* and is only legal within an [authorized, scoped engagement](./rules-of-engagement). Passive recon uses public sources, but even there, stay within scope and the law. Recon is where over-eager testers first drift out of bounds; let your scope define your map.
:::

:::tip[In plain English]
Before a heist, the crew studies the building for weeks: entrances, guard schedules, camera placement, who works there. **Reconnaissance** is that study phase for a system — and it's where most real attacks *actually* succeed or fail, long before any "hacking." The goal is to build the most complete possible picture of the target: every domain, server, open port, running service, employee email, exposed document, and forgotten test environment. Why does it matter so much? Because an organization only has to forget *one* thing — an old subdomain, a leaked password, a debug endpoint — and a thorough recon finds it. Attackers are patient mappers; the flashy exploit is usually the *short* part. Recon comes in two flavors: **passive** (learn about the target from public information without ever touching it — invisible) and **active** (poke the target directly to see what it reveals — noisier but precise). You generally do passive first.
:::

## Passive recon: learn without touching

**Passive reconnaissance** gathers information from *public, third-party sources* — never sending traffic to the target's own systems, so it's essentially undetectable. This is **OSINT (Open-Source Intelligence)**: assembling a picture from what's already out there.

Typical passive sources and what they reveal:

- **DNS & domain records** — subdomains, mail servers, IP ranges, hosting providers. Public **certificate transparency logs** (every TLS cert issued is logged publicly) are a goldmine for discovering subdomains an org didn't mean to expose.
- **Search engines & the web** — exposed documents, error pages, login portals, and `robots.txt` hints. ("Google dorking" = using advanced search operators to find exposed files/pages.)
- **Public code & data** — company repositories, and the [leaked secrets](/docs/secure-sdlc/secrets-iac-container-scanning) that hide in them; paste sites; misconfigured cloud storage.
- **Breach data & credential dumps** — emails and passwords from *other* sites' breaches, fueling [credential stuffing](/docs/appsec/broken-authentication).
- **Employee & org footprint** — staff names, roles, and emails (from professional networks), useful for guessing username formats and for [social engineering](#a-note-on-the-human-attack-surface).
- **Infrastructure aggregators** — services that continuously scan the whole internet and let you *look up* a target's exposed hosts/services *without you scanning them yourself* (passive, because someone else did the scanning).

:::note[Terms, defined once]
- **OSINT (Open-Source Intelligence)** — intelligence assembled from publicly available sources.
- **Attack surface** — the total set of points an attacker could target (from [Foundations](/docs/foundations/attacker-mindset)). Recon's job is to enumerate it fully.
- **Subdomain enumeration** — finding all of an organization's subdomains (e.g., `dev.`, `vpn.`, `old.`), since forgotten ones are common weak points.
- **Port scanning** — probing which network ports are open on a host, revealing what services it runs.
- **Service/version enumeration** — identifying the specific software and version behind an open port (so you can check it for known [CVEs](/docs/secure-sdlc/sast-dast-sca)).
- **Fingerprinting** — identifying technologies in use (web server, framework, CMS) from their tell-tale responses.
- **Footprint** — the total discoverable presence of an organization online.
:::

## Active recon: probe the target directly

**Active reconnaissance** sends traffic *to the target* to learn what passive sources can't — what's actually running, right now. It's more precise but *detectable* (it shows up in the target's logs), so it only happens inside authorized scope. The progression narrows from "what exists" to "what's exploitable":

1. **Host discovery** — which IPs in scope are alive.
2. **Port scanning** — which ports are open on each host (a port is a door; an open one means a service is listening). Tools like **Nmap** are the classic here.
3. **Service & version enumeration** — what software and *version* sits behind each open port. This is the pivotal step: a version number lets you look up known vulnerabilities ([CVEs](/docs/secure-sdlc/sast-dast-sca)) for that exact software.
4. **Application enumeration** — for web targets, discovering directories, endpoints, parameters, and technologies (the [trust boundaries](/docs/foundations/trust-boundaries) and inputs you'll test in [exploitation](./exploitation)).

:::note[Worked example: from a domain to a candidate weakness]
Authorized to test `example.com`, you build the map:

1. **Passive:** Certificate transparency logs reveal `app.example.com`, `vpn.example.com`, and — interestingly — `legacy-portal.example.com` (a name suggesting an old, possibly unmaintained system). An infrastructure aggregator shows `legacy-portal` exposes a web service.
2. **Active (in scope):** A port scan of `legacy-portal.example.com` shows port 443 open. Version enumeration fingerprints it as a content-management system running a *years-old* version.
3. **Cross-reference:** That version has a publicly known [CVE](/docs/secure-sdlc/sast-dast-sca) for authentication bypass.

You haven't exploited anything yet — but recon has turned "a company" into "a specific, likely-vulnerable forgotten system and a candidate weakness to validate." Notice the winning thread was the *forgotten* asset: thorough enumeration found the one thing the org wasn't watching. That's the entire value of recon — **you only have to find the one door they forgot to lock.**
:::

## Why "the one forgotten thing" wins

Recon's power comes from an asymmetry you met in [Foundations](/docs/foundations/attacker-mindset): defenders must secure *everything*; an attacker needs *one* gap. Organizations accumulate forgotten subdomains, abandoned test servers, shadow IT, expired-but-live services, and leaked credentials. A defender who isn't doing their *own* recon doesn't even know these exist. Thorough enumeration systematically surfaces them — which is why mature defenders run **continuous attack-surface discovery** on themselves, recon-ing their own footprint before an attacker does.

## A note on the human attack surface

Recon isn't only technical. The **people** in an organization are part of the attack surface, and **social engineering** — manipulating humans into revealing information or access (phishing, pretexting, baiting) — is, in real breaches, often the *easiest* path in (the [path of least resistance](/docs/foundations/attacker-mindset)). Passive recon feeds it: employee names and email formats enable convincing phishing. Whether social engineering is permitted is an explicit [Rules-of-Engagement](./rules-of-engagement) decision — never assume it's in scope. The defense is largely awareness training, plus the technical controls (MFA, etc.) that limit what a phished credential can do.

## Why it matters

- **It's where engagements are won.** Coverage in recon determines everything downstream — you can't exploit what you never found. The flashy exploit is usually the short, final step on top of patient mapping.
- **It mirrors what defenders must do.** Attack-surface management is recon turned inward. Understanding offensive recon is exactly how a defender learns to find their own forgotten exposures first.
- **Passive-first is a real skill.** Knowing how much you can learn *without touching* the target — and staying invisible while you do — is core tradecraft, and the safest place to start.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Rushing to exploitation with a thin map.** Skipping thorough enumeration means missing the forgotten asset that was the real way in. Breadth of recon beats speed to exploit.
- **Doing active recon outside scope.** Scanning touches the target and is detectable and illegal outside authorization. Let scope bound your map; passive-first keeps you safe and quiet.
- **Ignoring subdomains and forgotten assets.** The main site is usually the hardened one. The weak points are `dev.`, `old.`, `staging.`, and shadow IT — enumerate exhaustively.
- **Overlooking version enumeration.** "Port 443 is open" is far less useful than "it's running X version Y," which maps directly to known CVEs. Always fingerprint versions.
- **Forgetting the human surface.** Technical recon misses social-engineering paths that are often the easiest — but only test them if RoE explicitly allows.
- **Being needlessly noisy.** Aggressive scanning can disrupt services and trip defenses; respect intensity/timing limits in the RoE.
:::

## Page checkpoint

<Quiz id="reconnaissance-page" title="Did reconnaissance click?" sampleSize={3}>

<Question
  prompt="What distinguishes PASSIVE from ACTIVE reconnaissance?"
  options={[
    { text: "Passive is illegal; active is legal" },
    { text: "Passive gathers public information from third-party sources without touching the target (undetectable); active sends traffic to the target directly (precise but detectable, and only legal in scope)" },
    { text: "Passive uses tools; active is done by hand" },
    { text: "They are the same thing" }
  ]}
  correct={1}
  explanation="Passive recon (OSINT) learns from public sources without ever contacting the target, so it's essentially invisible. Active recon probes the target directly — more precise about what's actually running, but it shows up in logs and requires authorization."
  revisit={{ to: "/docs/offensive/reconnaissance#passive-recon-learn-without-touching", label: "Passive vs active" }}
/>

<Question
  prompt="Why is reconnaissance often where attacks are actually won, even though it isn't the 'exciting' part?"
  options={[
    { text: "Because exploitation is impossible" },
    { text: "Defenders must secure everything while an attacker needs only one gap; thorough recon surfaces the forgotten subdomain, abandoned server, or leaked credential the org isn't watching — the flashy exploit is just the short final step" },
    { text: "Because recon causes the most damage" },
    { text: "Because it requires no skill" }
  ]}
  correct={1}
  explanation="The asymmetry from Foundations: defenders protect the whole surface; attackers need one forgotten thing. Patient enumeration finds it, and exploitation is the short step on top. That's why mature defenders run continuous attack-surface discovery on themselves."
  revisit={{ to: "/docs/offensive/reconnaissance#why-the-one-forgotten-thing-wins", label: "The one forgotten thing" }}
/>

<Question
  prompt="During active recon you identify the exact software AND version behind an open port. Why is the version so valuable?"
  options={[
    { text: "It tells you the server's location" },
    { text: "A specific version lets you look up its known vulnerabilities (CVEs), turning 'a service is here' into 'this exact version has a known exploitable flaw to validate'" },
    { text: "Versions reveal user passwords" },
    { text: "It has no real value" }
  ]}
  correct={1}
  explanation="Version enumeration is pivotal: 'port 443 open' is vague, but 'CMS version Y' maps directly to published CVEs for that software. It converts discovery into a concrete candidate weakness to test in the exploitation phase."
  revisit={{ to: "/docs/offensive/reconnaissance#active-recon-probe-the-target-directly", label: "Service/version enumeration" }}
/>

<Question
  prompt="Why are certificate transparency logs useful in passive recon?"
  options={[
    { text: "They contain user passwords" },
    { text: "Every issued TLS certificate is logged publicly, so they reveal subdomains (including forgotten or unintended ones) without sending any traffic to the target" },
    { text: "They let you decrypt HTTPS traffic" },
    { text: "They show the server's CPU usage" }
  ]}
  correct={1}
  explanation="Public certificate transparency logs record every TLS cert issued, exposing subdomains an organization may not realize are discoverable — a passive goldmine for finding forgotten assets, all without touching the target."
  revisit={{ to: "/docs/offensive/reconnaissance#passive-recon-learn-without-touching", label: "Passive sources" }}
/>

<Question
  prompt="Is social engineering (e.g., phishing employees) automatically part of a penetration test's scope?"
  options={[
    { text: "Yes, it's always included" },
    { text: "No — the human attack surface is real and often the easiest path in, but whether social engineering is permitted is an explicit Rules-of-Engagement decision; never assume it's in scope" },
    { text: "It's never allowed under any circumstances" },
    { text: "Only if the target agrees verbally during the test" }
  ]}
  correct={1}
  explanation="People are part of the attack surface and social engineering is frequently the path of least resistance, but it must be explicitly authorized in the RoE. Assuming it's in scope, or improvising it, is a serious boundary violation."
  revisit={{ to: "/docs/offensive/reconnaissance#a-note-on-the-human-attack-surface", label: "The human attack surface" }}
/>

</Quiz>

## What's next

→ Continue to [Exploitation](./exploitation) — turning the candidate weaknesses recon surfaced into safely-demonstrated proof, using the bug classes from [AppSec](/docs/appsec) and beyond.

→ **Going deeper:** recon turned inward is **attack-surface management**, a defensive practice in [Detection & Response](/docs/detection); the leaked-credential angle ties back to [secret scanning](/docs/secure-sdlc/secrets-iac-container-scanning).
