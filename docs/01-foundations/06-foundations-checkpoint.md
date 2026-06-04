---
id: foundations-checkpoint
title: Chapter 1 Checkpoint
sidebar_position: 7
sidebar_label: ✅ Chapter checkpoint
description: Prove the foundations stuck — a mixed quiz across the CIA triad, threat/vulnerability/risk, the attacker's mindset, trust boundaries, and defense in depth & least privilege.
---

# Chapter 1 Checkpoint

> **The foundations, all together.** This mixed quiz pulls from every lesson in the chapter. Passing means you have the security engineer's core mental model — the lens the rest of the guide assumes on every page.

:::tip[How this works]
The quiz draws a random selection from a larger bank each attempt, so retaking gives you fresh questions. Aim to pass comfortably, not just barely — these five ideas recur in *every* remaining chapter. If a question stings, follow its revisit link back to the exact section.
:::

## What you should be able to do now

Before the quiz, a quick self-check. After Chapter 1 you should be able to:

- **Name which CIA property** a given incident violates — and explain why a control for one leg often doesn't protect the others.
- **Distinguish threat, vulnerability, and risk**, and use `Risk = Likelihood × Impact` to explain why two systems with the *same* bug can have wildly different urgency.
- **Apply the attacker's mindset** to an ordinary feature — generate the misuse cases, spot the path of least resistance, and assume breach.
- **Locate the trust boundaries** in a data flow and state the rule "never trust the client," with the server-side fix.
- **Explain defense in depth and least privilege** — why independent layers and minimal access turn a single failure into a contained incident rather than a breach.

If any of those feels shaky, revisit that lesson before continuing — Chapter 2 builds directly on this footing.

## The checkpoint

<Quiz id="foundations-checkpoint" title="Chapter 1: Security Foundations" sampleSize={6} passingScore={0.67}>

<Question
  prompt="An attacker silently alters the dosage field in a hospital's prescription records. Which CIA property is primarily violated?"
  options={[
    { text: "Confidentiality" },
    { text: "Integrity" },
    { text: "Availability" },
    { text: "None — the data is still there" }
  ]}
  correct={1}
  explanation="Data was altered without authorization while remaining present and possibly secret — an integrity failure, and a dangerous one because the corrupted data still looks legitimate."
  revisit={{ to: "/docs/foundations/cia-triad#the-three-properties-defined", label: "CIA: the three properties" }}
/>

<Question
  prompt="A DDoS attack makes an online store unreachable for hours. No data is read or changed. Is this a security incident, and why?"
  options={[
    { text: "No — nothing was stolen" },
    { text: "Yes — availability is a CIA property, and blocking legitimate use is a security failure" },
    { text: "Only if customer cards were exposed" },
    { text: "Only if the attacker also logged in" }
  ]}
  correct={1}
  explanation="Availability is the third leg of the triad. Denying legitimate users access is a security failure even when nothing is read or altered — which is why DoS/DDoS are security incidents."
  revisit={{ to: "/docs/foundations/cia-triad#common-pitfalls", label: "Availability is a security property" }}
/>

<Question
  prompt="An unpatched software bug on your server is best described as a:"
  options={[
    { text: "Threat" },
    { text: "Vulnerability" },
    { text: "Risk" },
    { text: "Control" }
  ]}
  correct={1}
  explanation="A weakness in your own system is a vulnerability. The actor who might exploit it is the threat; how much you should worry is the risk."
  revisit={{ to: "/docs/foundations/threat-vuln-risk#the-three-terms-precisely", label: "Threat vs vuln vs risk" }}
/>

<Question
  prompt="The same remote-code-execution bug exists on (A) your public payment API and (B) an isolated internal tool with no sensitive data. Why is A's RISK higher when the VULNERABILITY is identical?"
  options={[
    { text: "It isn't — same bug, same risk" },
    { text: "A has higher likelihood (internet-exposed) and higher impact (payment data), and risk = likelihood × impact" },
    { text: "Internal tools are always higher risk" },
    { text: "Because A has a higher CVE score by definition" }
  ]}
  correct={1}
  explanation="Risk is set by exposure and stakes, not the bug alone. A is reachable by the whole internet and holds valuable data, so both factors — and thus the risk — are far higher."
  revisit={{ to: "/docs/foundations/threat-vuln-risk#worked-example-same-vulnerability-two-very-different-risks", label: "Same vuln, two risks" }}
/>

<Question
  prompt="A team documents a deliberate, owned decision to live with a small, low-impact risk rather than fix it. This is:"
  options={[
    { text: "Ignoring the risk" },
    { text: "Accepting the risk" },
    { text: "Transferring the risk" },
    { text: "Avoiding the risk" }
  ]}
  correct={1}
  explanation="A documented decision to live with a risk is acceptance — a legitimate response. Ignoring is when no one decided; transferring shifts cost (e.g., insurance); avoiding means not doing the risky thing at all."
  revisit={{ to: "/docs/foundations/threat-vuln-risk#the-four-ways-to-handle-a-risk", label: "Four ways to handle risk" }}
/>

<Question
  prompt="A logged-in user changes `/api/orders/501` to `/api/orders/502` and sees another customer's order. What attacker reflex found it, and what's the bug class?"
  options={[
    { text: "Brute force; weak password" },
    { text: "'What if I change the identifier?'; broken access control (IDOR)" },
    { text: "Phishing; social engineering" },
    { text: "Cryptanalysis; weak cipher" }
  ]}
  correct={1}
  explanation="Tampering with an object reference to reach data that isn't yours is an IDOR — broken access control. The server confirmed you were logged in but never that the order was yours."
  revisit={{ to: "/docs/foundations/attacker-mindset#a-worked-example-attacking-a-view-your-invoice-feature", label: "Attacker mindset: worked example" }}
/>

<Question
  prompt="An attacker ignores your strong cryptography and instead reuses a password leaked in an unrelated breach. Which principle is at work?"
  options={[
    { text: "Defense in depth" },
    { text: "The path of least resistance — attackers hit the weakest link, not the strongest wall" },
    { text: "Separation of duties" },
    { text: "Risk transfer" }
  ]}
  correct={1}
  explanation="Attackers are economical and go through the easy opening. Your security is set by the weakest link, which is why one reused credential can bypass otherwise strong defenses."
  revisit={{ to: "/docs/foundations/attacker-mindset#what-thinking-like-an-attacker-actually-means", label: "Path of least resistance" }}
/>

<Question
  prompt="A checkout sends the item's price from the browser and the server charges whatever it receives. An attacker sets price=$0.01. Root cause?"
  options={[
    { text: "Weak TLS" },
    { text: "A trust-boundary failure — the server trusted client-supplied data instead of re-deriving the price server-side" },
    { text: "A denial-of-service attack" },
    { text: "Privilege creep" }
  ]}
  correct={1}
  explanation="The price crossed the untrusted browser→server boundary. The server must look up the real price from its own data by product ID; the client can say anything, the server decides what's true."
  revisit={{ to: "/docs/foundations/trust-boundaries#the-golden-rule-never-trust-the-client", label: "Never trust the client" }}
/>

<Question
  prompt="Which statement about client-side JavaScript validation is correct?"
  options={[
    { text: "It is a sufficient security control by itself" },
    { text: "It is a UX convenience, not a security control; the server must re-validate because the client can be bypassed" },
    { text: "It replaces the need for server-side checks" },
    { text: "It is safer than server-side validation" }
  ]}
  correct={1}
  explanation="Attackers skip the browser and send raw requests, so client-side checks can't be trusted for security. Validation that matters happens server-side, at the trust boundary."
  revisit={{ to: "/docs/foundations/trust-boundaries#the-golden-rule-never-trust-the-client", label: "Client checks aren't security" }}
/>

<Question
  prompt="A microservice trusts any caller on the internal network. An attacker compromises one internal host. What's the weakness?"
  options={[
    { text: "None — internal traffic is inherently safe" },
    { text: "Treating 'internal' as 'trusted' lets one foothold pivot everywhere; service-to-service calls cross a boundary and should be authenticated/authorized (zero trust)" },
    { text: "The encryption is too strong" },
    { text: "The service has too little privilege" }
  ]}
  correct={1}
  explanation="'Internal' ≠ 'trusted.' A flat, trusting interior means a single compromise spreads laterally. Zero-trust designs verify every call regardless of network location."
  revisit={{ to: "/docs/foundations/trust-boundaries#common-pitfalls", label: "Trusting internal traffic" }}
/>

<Question
  prompt="Defense in depth and least privilege both assume one thing. What is it?"
  options={[
    { text: "That encryption is unbreakable" },
    { text: "That failure is inevitable — so you layer defenses (depth) and minimize access (least privilege) to survive it" },
    { text: "That attackers are unsophisticated" },
    { text: "That the perimeter firewall is enough" }
  ]}
  correct={1}
  explanation="Both principles start from 'something will fail.' Depth makes full success less likely; least privilege makes any single failure less damaging. Together they make 'assume breach' actionable."
  revisit={{ to: "/docs/foundations/defense-in-depth#how-the-two-principles-combine", label: "How the two principles combine" }}
/>

<Question
  prompt="Three security 'layers' all depend on the same admin password. Why isn't this true defense in depth?"
  options={[
    { text: "It is — three is enough layers" },
    { text: "The layers share a single point of failure, so they collapse together — effectively one layer, not three" },
    { text: "Passwords can never be a control" },
    { text: "Because the layers are too independent" }
  ]}
  correct={1}
  explanation="Depth requires INDEPENDENT layers that fail for different reasons. Controls hanging off one shared secret all fall at once, defeating the purpose."
  revisit={{ to: "/docs/foundations/defense-in-depth#defense-in-depth-layers-not-a-wall", label: "Independent layers" }}
/>

<Question
  prompt="An image-resizing service is given full read/write access to the customer database 'to make it work.' Which principle is violated, and what's the consequence?"
  options={[
    { text: "Defense in depth; the consequence is slower performance" },
    { text: "Least privilege; if the service is compromised, the blast radius now includes the entire customer database instead of just images" },
    { text: "Separation of duties; the consequence is nothing" },
    { text: "No principle is violated; more access is fine" }
  ]}
  correct={1}
  explanation="An over-privileged service account violates least privilege. The service should have only what it needs (read the image bucket). Granting more means a single compromise reaches far more — a needlessly huge blast radius."
  revisit={{ to: "/docs/foundations/defense-in-depth#least-privilege-the-minimum-by-default", label: "Least privilege" }}
/>

<Question
  prompt="Map the two core principles onto Risk = Likelihood × Impact."
  options={[
    { text: "Defense in depth lowers likelihood; least privilege lowers impact" },
    { text: "Both lower impact only" },
    { text: "Both lower likelihood only" },
    { text: "Neither relates to risk" }
  ]}
  correct={0}
  explanation="More independent layers make full success less probable (likelihood ↓); minimal access makes any one compromise less damaging (impact ↓). Applying both drives risk down on both axes."
  revisit={{ to: "/docs/foundations/defense-in-depth#how-the-two-principles-combine", label: "Mapping to the risk formula" }}
/>

</Quiz>

## Chapter 1 complete

With the foundations in place, every later chapter has something to attach to. You now have the vocabulary (CIA, threat/vuln/risk) and the principles (attacker's mindset, trust boundaries, depth, least privilege) that the rest of the guide treats as assumed knowledge.

→ On to [Chapter 2: Cryptography](/docs/cryptography) — the first concrete toolkit, where these ideas become real primitives: encryption for confidentiality, hashing and signatures for integrity, and the cardinal rule *never roll your own crypto*.
