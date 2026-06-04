---
id: rules-of-engagement
title: Scope, Authorization & Rules of Engagement
sidebar_position: 3
sidebar_label: Scope & rules of engagement
description: The contracts and constraints that make testing legal and safe — written authorization, defined scope, rules of engagement, and the professional ethics that separate a pentester from a criminal.
---

# Scope, Authorization & Rules of Engagement

> **In one line:** The difference between a penetration tester and a criminal is not skill — it's **written authorization and a defined scope**, so phase one of every engagement is the paperwork: who said you could test, *exactly* what, by what methods, when, and what happens when something goes wrong.

:::danger[This is the lesson that keeps you out of prison]
Unauthorized access to a computer system is a serious crime in essentially every jurisdiction (the US Computer Fraud and Abuse Act, the UK Computer Misuse Act, and equivalents worldwide) — *regardless of whether you cause harm or even intend to.* Good intentions, "I was just checking," and "they should thank me" are not defenses. The single most important professional skill in offensive security is **never touching anything you don't have explicit, written permission to touch.** This lesson is how that permission is established.
:::

:::tip[In plain English]
Imagine a locksmith hired to test a building's locks. Before touching a single door they get a signed contract saying *which* building, *which* doors, *what hours*, and a phone number to call if an alarm trips. Without that, the exact same actions — picking locks, walking in — are breaking and entering. Offensive security is identical. The skills are dangerous and, used without permission, criminal. So professionals wrap every engagement in documents that answer: *Am I allowed to do this? To what, exactly? Using what methods? When? And who do I call if I break something or stumble onto something serious?* These aren't bureaucratic annoyances — they're what make the work legal, safe, and trusted. A brilliant exploit on an out-of-scope system is a career-ending mistake; the discipline of scope is the profession.
:::

## Authorization: the "get out of jail" document

Before any technical work, you need **explicit, written authorization** from someone with the actual authority to grant it. Verbal "sure, go ahead" is worthless and unenforceable. The authorization establishes:

- **Who is authorizing** — and that they *own* or legally control the target. (Testing a system your client merely *uses* — e.g., their cloud provider or SaaS vendor — may require *that vendor's* permission too.)
- **What is authorized** — the specific scope (below).
- **The legal terms** — a contract/statement of work, often with a liability waiver and confidentiality (NDA), because you'll see sensitive data.

This signed authorization is sometimes called the **"get out of jail free" letter** — the document you can produce to prove the activity was sanctioned. Carry/keep it for the duration; without it, you have no defense.

:::note[Terms, defined once]
- **Authorization** — explicit, written permission from a party legally able to grant it, to perform specific testing.
- **Scope** — the precise set of in-bounds targets (and explicitly out-of-bounds ones).
- **Rules of Engagement (RoE)** — the operational constraints: allowed methods, timing, intensity, handling of findings, and contacts.
- **Statement of Work (SoW)** — the contract defining deliverables, timeline, and terms.
- **Scope creep** — drifting beyond authorized targets, often by following a connection into an out-of-scope system. A serious breach of trust (and possibly law).
- **Safe harbor** — a clause (common in bug bounties) promising not to pursue legal action against good-faith researchers acting within the published rules.
- **Production vs. non-production** — whether you're testing live systems (real users, real data, real risk) or a staging copy.
:::

## Scope: exactly what you may touch

**Scope** is the explicit list of what's in-bounds — and, critically, what's *out*. Vague scope is dangerous for everyone; precise scope protects the client *and* you.

A real scope specifies:
- **Targets** — exact domains, URLs, IP ranges/CIDRs, applications, or accounts. "The company" is not a scope; `app.example.com` and `10.0.5.0/24` are.
- **Exclusions** — systems explicitly off-limits (a fragile legacy box, a third-party-hosted service you can't legally test, the CEO's laptop).
- **Depth** — are you allowed to *exploit* and pivot, or only *identify* vulnerabilities? Can you exfiltrate data to prove impact, or must you stop at proof?
- **Data handling** — what you may do if you access real customer/personal data (usually: stop, note it, don't copy it).

:::caution[Worked example: the connection that leads out of scope]
You're testing `app.example.com` (in scope). You find it connects to a database at an IP that turns out to belong to a *third-party analytics provider* — not your client, and not in scope. The tempting move is to "follow the thread." **Stop.** That system isn't your client's to authorize, and testing it is unauthorized access to a *different company* — a crime, even mid-engagement. The professional move: document the finding ("the app trusts an external provider; here's the exposure"), report it, and *do not touch* the out-of-scope system. Scope boundaries don't pause because an attack path is interesting. This judgment — knowing when *not* to proceed — is the mark of a professional.
:::

## Rules of Engagement: how, when, and what-if

If scope is *what*, **Rules of Engagement (RoE)** are *how*. They keep an authorized test from becoming an outage or a panic. Typical RoE cover:

- **Allowed and forbidden methods.** Is social engineering (phishing employees) in scope? Physical access? Denial-of-service testing is almost always **forbidden** (you don't prove availability is fragile by taking production down). Destructive actions are off the table unless explicitly agreed.
- **Timing and intensity.** Test windows (e.g., off-peak hours), rate limits to avoid overloading systems, and blackout dates (no testing during the holiday sale).
- **Notification & deconfliction.** Who knows the test is happening? In a covert [red team](./methodology), almost no one — so there's a small "trusted agent" group who can confirm "yes, that alarming traffic is our authorized testers, stand down" to prevent a real incident response from spinning up.
- **Emergency contacts & stop conditions.** A 24/7 contact, and the agreed triggers to *halt immediately* — e.g., you crash a production service, or you discover an *active, ongoing breach by someone else*.
- **Evidence handling.** How findings, screenshots, and any accessed data are stored, encrypted, and destroyed afterward.

:::info[Highlight: discovering a real, prior breach mid-test]
A scenario every tester should pre-plan: during an authorized test you find evidence that a *real* attacker is already inside. This is a defined **stop condition** — you immediately *pause testing* and *escalate via the emergency contact*, because continuing risks destroying forensic evidence or interfering with a live [incident](/docs/incident-forensics). The RoE should specify this in advance so there's no improvising during a crisis. Knowing the agreed stop conditions before you start is part of being trusted with this access.
:::

## The professional ethic

Beyond the documents, offensive security runs on trust and a few non-negotiable ethics:

- **Stay in scope, always** — the discipline above, every minute of the engagement.
- **Do no (unnecessary) harm** — prove a vulnerability with the *minimum* impact. Don't delete data to show you *could*; a screenshot of a directory listing makes the point.
- **Confidentiality** — you'll see secrets, sensitive data, and embarrassing weaknesses. They stay confidential, handled and destroyed per the agreement.
- **Honesty in reporting** — report what you actually found, neither inflating severity to look impressive nor hiding a mistake you made.
- **Responsible disclosure** — for issues found *outside* a paid engagement (e.g., in someone's public product), report privately to the owner and give them time to fix before any public discussion; never weaponize or sell it.

:::info[Highlight: the whole profession rests on one habit]
Permission first, technique second. The most skilled tester in the world is a criminal the moment they act without authorization, and the most junior one is a trusted professional as long as they stay rigorously within written scope. Internalize this *before* you learn another exploit: your value — and your freedom — depends on the discipline of authorization far more than on any technical trick.
:::

## Why it matters

- **It's the literal legal line.** Identical actions are either a paid profession or a felony depending solely on authorization and scope. Nothing in the rest of this chapter is safe to do without this lesson.
- **It's what clients are actually buying.** Organizations grant testers extraordinary access. That only works on a foundation of contracts, scope, and trust — the deliverable is impossible without it.
- **It's the most common way careers end.** Technical mistakes are recoverable; an out-of-scope "I just wanted to see" is not. The discipline here protects you more than any skill.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Relying on verbal permission.** "They said it was fine" is not a defense. Get explicit, written authorization from someone with the authority to grant it.
- **Following an attack path out of scope.** An interesting pivot into an unauthorized system is still a crime. Document it and stop at the boundary.
- **Testing systems your client doesn't own.** Their SaaS vendor, cloud provider, or a shared service may require *that party's* authorization too. Confirm ownership.
- **Running DoS or destructive tests without explicit agreement.** You don't demonstrate fragility by causing an outage. These are forbidden unless specifically authorized.
- **No plan for stop conditions.** Crashing production or finding a real breach mid-test needs a pre-agreed halt-and-escalate procedure, not improvisation.
- **Mishandling accessed data.** Copying real customer data "as proof" can itself be a breach. Prove with the minimum, store securely, destroy per the agreement.
:::

## Page checkpoint

<Quiz id="rules-of-engagement-page" title="Did scope & RoE click?" sampleSize={3}>

<Question
  prompt="What is the actual difference between a penetration tester and a criminal performing the same actions?"
  options={[
    { text: "The tester is more skilled" },
    { text: "Explicit written authorization and a defined scope — identical actions are a profession or a felony based solely on permission, not technique or outcome" },
    { text: "The tester uses different tools" },
    { text: "The criminal causes more damage" }
  ]}
  correct={1}
  explanation="Skill is irrelevant to legality. Authorization and scope are the line: unauthorized access is a crime regardless of intent or harm. Permission first, technique second is the whole foundation of the profession."
  revisit={{ to: "/docs/offensive/rules-of-engagement#authorization-the-get-out-of-jail-document", label: "Authorization" }}
/>

<Question
  prompt="Mid-test on the in-scope `app.example.com`, you find it connects to a database owned by a third-party provider not in your scope. What do you do?"
  options={[
    { text: "Follow the connection and test the database — it's part of the attack path" },
    { text: "Stop at the boundary — that system isn't your client's to authorize, so testing it is unauthorized access to another company; document the exposure and report it without touching the out-of-scope system" },
    { text: "Test it but don't mention it in the report" },
    { text: "Ask the third party verbally, then proceed" }
  ]}
  correct={1}
  explanation="Scope boundaries don't pause for interesting attack paths. The third-party system isn't your client's to grant access to, so touching it is a crime even mid-engagement. Document the trust exposure as a finding and stop. Knowing when NOT to proceed is the professional mark."
  revisit={{ to: "/docs/offensive/rules-of-engagement#scope-exactly-what-you-may-touch", label: "Scope boundaries" }}
/>

<Question
  prompt="Why is denial-of-service testing almost always FORBIDDEN in rules of engagement?"
  options={[
    { text: "It's too hard to perform" },
    { text: "You don't prove availability is fragile by actually taking production down — destructive/outage-causing actions risk real harm and are off the table unless explicitly authorized" },
    { text: "It requires special hardware" },
    { text: "It's actually always required" }
  ]}
  correct={1}
  explanation="RoE constrains methods to avoid turning a test into an incident. Causing a real outage to demonstrate one is harmful and counterproductive; DoS and destructive actions are excluded unless specifically agreed. The point is to find risk, not to realize it."
  revisit={{ to: "/docs/offensive/rules-of-engagement#rules-of-engagement-how-when-and-what-if", label: "Rules of Engagement" }}
/>

<Question
  prompt="During an authorized test, you find evidence that a REAL attacker is already inside the network. What's the correct response?"
  options={[
    { text: "Keep testing and try to remove the attacker yourself" },
    { text: "Treat it as a defined stop condition: pause testing and escalate immediately via the emergency contact, since continuing risks destroying forensic evidence or interfering with live incident response" },
    { text: "Ignore it — it's out of scope" },
    { text: "Publicly disclose it" }
  ]}
  correct={1}
  explanation="Discovering an active prior breach is a pre-agreed stop condition. You halt and escalate through the emergency contact so the organization can run real incident response without you contaminating evidence. RoE should define this in advance to avoid improvising in a crisis."
  revisit={{ to: "/docs/offensive/rules-of-engagement#rules-of-engagement-how-when-and-what-if", label: "Stop conditions" }}
/>

<Question
  prompt="You discover a serious vulnerability in a company's public product OUTSIDE any paid engagement. The ethical path is:"
  options={[
    { text: "Exploit it to prove a point, then post it publicly" },
    { text: "Responsible disclosure — report it privately to the owner and give them time to fix before any public discussion; never weaponize or sell it" },
    { text: "Sell it to the highest bidder" },
    { text: "Say nothing and use it later" }
  ]}
  correct={1}
  explanation="Outside an authorized engagement, responsible disclosure applies: notify the owner privately, allow time to remediate, and don't weaponize, sell, or prematurely publicize it. Finding a bug doesn't authorize exploiting it."
  revisit={{ to: "/docs/offensive/rules-of-engagement#the-professional-ethic", label: "The professional ethic" }}
/>

</Quiz>

## What's next

→ Continue to [Reconnaissance](./reconnaissance) — with authorization and scope established, the first technical phase: methodically mapping the target's attack surface, passively then actively.

→ **Going deeper:** the bug-bounty model (with its safe-harbor terms) and the legal/compliance frame appear in [Compliance & Risk](/docs/compliance); the incident-response side of a discovered breach is [Incident Response & Forensics](/docs/incident-forensics).
