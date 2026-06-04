---
id: vendor-risk
title: Vendor & Third-Party Risk
sidebar_position: 6
sidebar_label: Vendor & third-party risk
description: Your security is only as strong as the vendors you depend on — why third-party risk is now a leading breach vector, how to assess vendors proportionally to access, and the fourth-party problem.
---

# Vendor & Third-Party Risk

> **In one line:** Modern organizations run on *dozens of third parties* — SaaS apps, cloud providers, contractors, [dependencies](/docs/secure-sdlc/supply-chain) — and **a vendor's breach can become your breach**, so third-party risk management means assessing each vendor's security *proportionally to the access and data you give them*, because you've extended your [trust boundary](/docs/foundations/trust-boundaries) to include systems you don't control.

:::tip[In plain English]
You can secure your own systems perfectly and still be breached — *through a vendor.* Every SaaS tool you adopt, every contractor you grant access, every cloud service and [software dependency](/docs/secure-sdlc/supply-chain) you rely on is something you're *trusting with some piece of your security*. If they get breached, *your* data (sitting in their system) or *your* environment (which they can access) is exposed. This is **third-party (vendor) risk**, and it's become one of the leading ways organizations actually get breached — a huge share of incidents now trace back to a compromised vendor rather than a direct attack. The reason is structural: you've handed part of your [trust boundary](/docs/foundations/trust-boundaries) to a company whose security you *don't control and can't see directly*. So the discipline is **due diligence**: before (and while) you depend on a vendor, assess their security — and do so *proportionally* to how much access and how sensitive the data you're giving them. The payment processor handling all your card data deserves intense scrutiny; the tool that schedules meetings, much less. This lesson is managing the risk of the people you depend on.
:::

## Why your vendors are your risk

When you give a vendor access to your systems or data, you *extend your [trust boundary](/docs/foundations/trust-boundaries)* to include them — but you've lost direct control and visibility over the security on the other side. Their weaknesses become your exposure:

- **They hold your data.** A SaaS tool with your customer data is breached → your customer data is breached, and *you* bear the [notification](/docs/incident-forensics/breach-determination) and reputational consequences, even though the failure was theirs.
- **They have access to your systems.** A contractor or integrated service with credentials into your environment is a path *in* — compromise them and the attacker inherits that access (a [supply-chain](/docs/secure-sdlc/supply-chain)-style pivot).
- **You depend on their availability.** A critical vendor going down takes you down too — an [availability](/docs/foundations/cia-triad) risk you don't directly control.

This is why third-party breaches are now so common: attackers have learned that the *easiest path into a hardened target is often through a softer vendor* that the target trusts — the [path of least resistance](/docs/foundations/attacker-mindset), applied to the supply web. Several of the largest, most famous breaches began at a third party.

:::note[Terms, defined once]
- **Third-party / vendor risk** — the risk that a supplier, SaaS provider, contractor, or partner you depend on is the source of a security incident affecting you.
- **Due diligence** — assessing a vendor's security posture before and during the relationship.
- **Vendor security assessment / questionnaire** — the structured evaluation of a vendor's controls (often leveraging their [SOC 2 / ISO](/docs/compliance/frameworks) reports).
- **Fourth-party risk** — the risk from *your vendors' vendors* — the dependencies of the parties you depend on.
- **Concentration risk** — over-reliance on a single vendor whose failure would be catastrophic.
- **Right to audit / security addendum** — contractual terms letting you verify a vendor's security and obligating them to standards and breach notification.
- **Least privilege (vendor)** — granting each vendor only the minimum access and data they need ([Foundations](/docs/foundations/defense-in-depth), applied to third parties).
:::

## Assess proportionally to access

You can't assess every vendor with equal rigor — a large organization has *hundreds*. The skill is **proportionality**: scale the scrutiny to the *risk the vendor represents*, which is driven by how much access and how sensitive the data you grant them.

:::note[Worked example: two vendors, two levels of scrutiny]
- **Vendor A — a payment processor** handling *all* your customers' card data, integrated deep into your systems. If breached: catastrophic. → **Intense due diligence:** review their [SOC 2 / PCI](/docs/compliance/frameworks) reports, security questionnaire, [breach-notification](/docs/incident-forensics/breach-determination) obligations in the contract, ongoing monitoring, maybe a right-to-audit clause. High access + high sensitivity = high scrutiny.
- **Vendor B — a tool that schedules internal meetings,** with no access to customer data. If breached: minor. → **Light-touch assessment:** confirm basic hygiene, move on. Low access + low sensitivity = low scrutiny.

Applying Vendor-A scrutiny to every Vendor B is wasteful and grinds the business to a halt; applying Vendor-B scrutiny to Vendor A is negligent. **The right amount of due diligence is a function of the risk** — exactly the [risk = likelihood × impact](/docs/foundations/threat-vuln-risk) prioritization from Foundations, applied to vendors. Tier your vendors by the access and data they touch, and spend your assessment effort where the risk is.
:::

Beyond the initial assessment, strong vendor risk management also:
- **Applies [least privilege](/docs/foundations/defense-in-depth) to vendors** — give each only the minimum access and data they actually need, so a vendor compromise reaches as little as possible (the single most effective technical control here).
- **Puts obligations in the contract** — security requirements, breach-notification timelines, and a right to audit, so the vendor is *bound* to standards and to telling you when they're breached.
- **Monitors continuously** — a vendor secure at onboarding can degrade; security ratings, re-assessments, and watching for their breaches keep it current (the risk is ongoing, not one-time).

## The fourth-party problem

A sobering extension: your vendors have *their own* vendors. A SaaS provider you trust depends on a cloud provider, which depends on other services — a *chain* of dependencies, mostly invisible to you. This is **fourth-party risk** (and beyond), and it means your true [attack surface](/docs/foundations/attacker-mindset) extends through a web of relationships you can't fully see or assess.

You can't audit your vendors' vendors directly, so the practical responses are: **concentration awareness** (notice when many of your vendors all depend on the same upstream provider, creating a single point of failure), **contractual flow-down** (require vendors to hold *their* vendors to standards), and — most importantly — **assume-breach applied to vendors**: design so that *any* third party's compromise is *survivable* (least privilege, segmentation, monitoring of vendor access), rather than trying to verify an unverifiable chain. You can't make the supply web perfectly secure; you *can* limit what any single link's failure does to you.

:::info[Highlight: you can outsource the work, not the risk]
The defining principle of vendor risk: **you can delegate a function to a vendor, but you can't delegate away the *risk* or the *accountability*.** When your customers' data leaks through your payment processor, *your* customers blame *you*, and (depending on the data) *you* may carry [notification and legal obligations](/docs/incident-forensics/breach-determination). "It was the vendor's fault" is not a defense your customers or regulators accept for data *you* chose to entrust to them. So the responsibility to assess, limit access, and plan for a vendor's failure stays with *you*. This is the [shared-responsibility](/docs/cloud-identity/cspm) idea generalized: outsourcing the operation never outsources the ownership of the risk.
:::

## Why it matters

- **It's a leading breach vector.** A large and growing share of breaches originate at a third party, because attackers target the soft vendor to reach the hard target. Ignoring vendor risk leaves a wide-open, popular path in.
- **Your attack surface includes systems you don't control.** Modern dependence on SaaS, cloud, and contractors means much of your real exposure lives outside your walls. Security that stops at your perimeter misses most of it.
- **It generalizes the guide's principles.** Trust boundaries, least privilege, risk prioritization, assume breach, shared responsibility — vendor risk is all of them applied to the web of parties you depend on.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Securing your own systems but ignoring vendors.** Your trust boundary now includes them; a vendor breach is your breach. Assess and limit every dependency.
- **Assessing all vendors equally.** Hundreds of vendors can't get equal scrutiny. Tier by access and data sensitivity, and spend effort proportionally to risk.
- **Over-granting vendor access.** A vendor with more access than it needs maximizes the blast radius of its compromise. Apply least privilege to vendors.
- **One-time assessment.** A vendor secure at onboarding can degrade. Monitor continuously and re-assess; the risk is ongoing.
- **Ignoring fourth-party and concentration risk.** Your vendors' vendors, and many vendors sharing one upstream, are hidden single points of failure. Watch for concentration; require flow-down; assume-breach.
- **Thinking you outsourced the risk.** You delegate the function, not the accountability. When data leaks through a vendor, the obligation and blame stay with you.
:::

## Page checkpoint

<Quiz id="vendor-risk-page" title="Did vendor risk click?" sampleSize={3}>

<Question
  prompt="Why does a vendor's breach become YOUR breach?"
  options={[
    { text: "It doesn't; vendors are separate" },
    { text: "Granting a vendor access or data extends your trust boundary to include them, but you lose direct control and visibility; if they hold your data or can access your systems, their compromise exposes you — and you bear the consequences" },
    { text: "Only if you use the same password" },
    { text: "Only if the vendor is in the same country" }
  ]}
  correct={1}
  explanation="Depending on a vendor extends your trust boundary to a system you don't control. They hold your data (breached → your data breached) or have access to your environment (compromise → attacker inherits the access). Attackers target soft vendors to reach hard targets — the path of least resistance."
  revisit={{ to: "/docs/compliance/vendor-risk#why-your-vendors-are-your-risk", label: "Vendors are your risk" }}
/>

<Question
  prompt="How much due diligence should a vendor get?"
  options={[
    { text: "The same intensive review for every vendor" },
    { text: "Proportional to the risk they represent — driven by how much access and how sensitive the data you give them; a payment processor handling all card data gets intense scrutiny, a meeting-scheduler with no customer data gets light-touch" },
    { text: "None; trust all vendors" },
    { text: "Only vendors in your industry" }
  ]}
  correct={1}
  explanation="You can't assess hundreds of vendors equally. Scale scrutiny to the access and data sensitivity each vendor touches — risk = likelihood × impact applied to vendors. Tier them and spend assessment effort where the risk concentrates."
  revisit={{ to: "/docs/compliance/vendor-risk#assess-proportionally-to-access", label: "Assess proportionally" }}
/>

<Question
  prompt="What is the single most effective TECHNICAL control for limiting vendor risk?"
  options={[
    { text: "Encrypting the vendor's emails" },
    { text: "Applying least privilege to vendors — granting each only the minimum access and data it needs, so a vendor's compromise reaches as little as possible" },
    { text: "Giving vendors admin access for convenience" },
    { text: "Trusting vendors fully once onboarded" }
  ]}
  correct={1}
  explanation="Least privilege applied to third parties caps the blast radius of any vendor compromise. A vendor with only the minimal access it needs, if breached, exposes far less than one over-granted access. It's Foundations' least privilege, extended to the supply web."
  revisit={{ to: "/docs/compliance/vendor-risk#assess-proportionally-to-access", label: "Least privilege for vendors" }}
/>

<Question
  prompt="What is 'fourth-party risk,' and what's the practical response?"
  options={[
    { text: "Risk from your fourth employee" },
    { text: "Risk from your vendors' vendors (the chain of dependencies behind the parties you depend on); since you can't audit it directly, respond with concentration awareness, contractual flow-down, and assume-breach — design so any third party's compromise is survivable" },
    { text: "A type of encryption" },
    { text: "Risk that only affects four companies" }
  ]}
  correct={1}
  explanation="Your vendors depend on their own vendors, extending your attack surface through an unverifiable web. You can't audit it, so notice concentration (many vendors sharing one upstream), require vendors to hold their vendors to standards, and assume-breach: limit and segment vendor access so any link's failure is survivable."
  revisit={{ to: "/docs/compliance/vendor-risk#the-fourth-party-problem", label: "Fourth-party risk" }}
/>

<Question
  prompt="What is the defining principle 'you can outsource the work, not the risk'?"
  options={[
    { text: "Vendors are always to blame" },
    { text: "You can delegate a function to a vendor, but not the risk or accountability — when data leaks through your vendor, your customers blame you and you may carry the notification/legal obligations; 'it was the vendor's fault' isn't a defense for data you chose to entrust" },
    { text: "Outsourcing removes all your responsibility" },
    { text: "Vendors carry all legal liability" }
  ]}
  correct={1}
  explanation="Delegating an operation doesn't delegate the ownership of its risk. A breach through your payment processor is still your customers' data and often your legal duty to notify. The responsibility to assess, limit access, and plan for failure stays with you — shared responsibility generalized."
  revisit={{ to: "/docs/compliance/vendor-risk#the-fourth-party-problem", label: "Outsource work, not risk" }}
/>

</Quiz>

## What's next

→ Take the [Chapter 10 checkpoint](./compliance-checkpoint) to lock in compliance and risk, then continue to [Chapter 11: Securing AI Systems](/docs/ai-security) — the new attack surface, where many of these same principles meet entirely new failure modes.

→ **Going deeper:** the software-dependency version of vendor risk is [supply-chain security](/docs/secure-sdlc/supply-chain); vendor risks belong in the [risk register](/docs/compliance/risk-register); the breach obligations are [Chapter 7](/docs/incident-forensics/breach-determination).
