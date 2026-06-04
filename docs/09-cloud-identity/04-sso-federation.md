---
id: sso-federation
title: SSO & Identity Federation Governance
sidebar_position: 5
sidebar_label: SSO & federation
description: Managing human identity at scale — single sign-on and federation, why centralizing identity is a security win, and the lifecycle that everyone forgets — deprovisioning and access reviews.
---

# SSO & Identity Federation Governance

> **In one line:** **SSO (Single Sign-On)** and **federation** centralize human identity so people authenticate once to a trusted identity provider and access many systems — a real security win (one place to enforce [MFA](/docs/appsec/broken-authentication), one place to *cut off* access) — but the part everyone neglects is the *lifecycle*: **deprovisioning** when someone leaves and periodic **access reviews**, because orphaned accounts and accumulated permissions are how insiders and attackers slip through.

:::tip[In plain English]
In a real organization, a person needs access to *dozens* of systems — email, cloud, code, HR tools, a hundred SaaS apps. If each has its own separate login, you get a mess: password reuse, no consistent [MFA](/docs/appsec/broken-authentication), and — the dangerous part — no reliable way to *remove* someone's access everywhere when they leave. **SSO** fixes this by having everyone authenticate through *one* trusted **identity provider (IdP)**; log in once, and that identity grants access to all the connected apps. **Federation** is the same idea stretched across organizational boundaries (e.g., logging into a partner's system with your company identity). The security upside is huge: one place to enforce strong authentication, and one place to *instantly revoke* all access. But SSO is only half the story. The half everyone forgets is the *identity lifecycle* — especially **offboarding**: when someone leaves or changes roles, is their access actually removed *everywhere*? Orphaned accounts and "I still have access to my old team's systems" are among the most common, most boring, and most dangerous gaps in real organizations. This lesson is identity at human scale — and the unglamorous governance that makes it secure.
:::

## SSO and federation: centralizing identity

**SSO** lets a user authenticate once, to a central **identity provider (IdP)**, and then access many applications without logging in again to each. **Identity federation** extends trust between identity systems — including across organizations — so an identity from one domain is accepted by another (via standards like **SAML** and **OIDC/OAuth**).

The security case for centralizing identity is strong:

- **One place to enforce strong authentication.** Require [MFA](/docs/appsec/broken-authentication) (ideally phishing-resistant passkeys) *once*, at the IdP, and it protects *every* connected app — instead of hoping each app implements MFA well.
- **One place to revoke.** Disable the central identity and access to *all* connected systems is cut at once — the single most important offboarding capability.
- **Fewer credentials, less reuse.** One strong identity beats dozens of separate passwords that get reused and phished.
- **Central visibility.** Authentication across the whole estate flows through one place you can [log and monitor](/docs/detection/logging-telemetry).

:::note[Terms, defined once]
- **SSO (Single Sign-On)** — authenticate once to a central provider, access many apps.
- **Identity Provider (IdP)** — the trusted system that authenticates users and asserts their identity to apps.
- **Federation** — extending identity trust across systems/organizations, so one domain's identity is accepted by another.
- **SAML / OIDC / OAuth** — the standard protocols for SSO and federation.
- **Provisioning** — creating accounts and granting access when someone joins or changes roles.
- **Deprovisioning (offboarding)** — removing accounts and access when someone leaves or no longer needs it. The most-forgotten step.
- **Orphaned account** — an account still active after its owner has left or no longer needs it; a prime attack target.
- **Access review (recertification)** — periodically re-verifying that people still need the access they have, and removing what they don't.
- **Joiner-Mover-Leaver (JML)** — the identity lifecycle: onboarding, role changes, offboarding.
:::

## The lifecycle everyone forgets: deprovisioning and reviews

SSO is exciting; *governance* is boring — which is exactly why it's neglected, and why it's where real risk accumulates. Identity has a **lifecycle** (Joiner-Mover-Leaver), and the security failures cluster at *Mover* and *Leaver*:

:::caution[Worked example: the access that should have been removed]
An employee joins the sales team (provisioned access to CRM, email, sales tools). Two years later they transfer to engineering — and get *new* access (code repos, cloud). But here's the common failure: **their old sales access is never removed.** Now they have *both*. Repeat across several role changes and they accumulate broad, unjustified access — **[privilege creep](/docs/foundations/defense-in-depth)** at the human-identity level. They're now an oversized target: compromise their account and an attacker inherits years of accumulated access spanning multiple teams.

Then they *leave the company* — and in too many real organizations, some of their accounts stay active. An **orphaned account** with no owner is a gift to an attacker (or to the disgruntled former employee): valid credentials, no one watching, often missed by offboarding. Departed-employee access and orphaned accounts are *repeatedly* cited in real insider-threat and breach reports.

The fixes are unglamorous but decisive:
- **Deprovision promptly and completely** on departure — ideally automated, so disabling the central identity cuts *all* federated access at once (the SSO payoff). Manual offboarding checklists miss things.
- **Adjust access on role change** — remove the old when granting the new, so privilege doesn't accumulate.
- **Run periodic [access reviews](#the-lifecycle-everyone-forgets-deprovisioning-and-reviews)** — managers recertify that their reports still need each access; anything unjustified is revoked. This catches the creep that slips through day-to-day.
:::

This is [least privilege](/docs/foundations/defense-in-depth) over *time*: not just granting minimally, but *continuously removing* what's no longer needed. Access that's never reviewed only ever grows.

## Why centralized identity is also a single point of (high-value) failure

One honest caveat: centralizing identity concentrates risk. If the IdP is the key to everything, then **compromising the IdP compromises everything** — which is why the identity provider itself must be defended with the highest rigor: strong [MFA](/docs/appsec/broken-authentication) (phishing-resistant), tight [admin access](./iam-hardening), heavy [monitoring](/docs/detection), and [careful protection of the trust relationships](#sso-and-federation-centralizing-identity) (a forged SAML assertion or a compromised IdP admin is catastrophic). This isn't an argument against SSO — decentralized identity is *worse* (no consistent MFA, no clean revocation). It's a reminder that the IdP is now your crown-jewel system and must be treated as such. The benefit (one place to control) and the risk (one place to lose) are two sides of the same centralization.

## Why it matters

- **It's how identity scales securely.** Dozens of separate logins per person is unmanageable and insecure; SSO/federation is the only sane way to enforce strong auth and clean revocation across an estate.
- **Offboarding gaps are a top real-world risk.** Orphaned accounts and unremoved access appear constantly in insider-threat and breach reports — boring, common, and dangerous. Governance is where this is fixed.
- **It completes least privilege.** Granting minimally is half; *removing* access as roles change and people leave is the other half. Without lifecycle governance, least privilege erodes into privilege creep.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Doing SSO but neglecting deprovisioning.** The biggest payoff of centralized identity is instant revocation — wasted if offboarding is slow or incomplete. Automate prompt, complete deprovisioning.
- **Adding access on role change without removing the old.** This is human-scale privilege creep. Adjust access on every move, not just additively.
- **No periodic access reviews.** Permissions only accumulate without recertification. Run regular reviews where owners confirm or revoke access.
- **Orphaned accounts.** Accounts that outlive their owner's need are valid credentials nobody watches. Find and disable them.
- **Under-protecting the IdP.** Centralized identity makes the IdP a crown-jewel target; weak MFA or loose admin access there compromises everything. Defend it with the highest rigor.
- **Relying on manual offboarding checklists.** Humans miss systems. Automate deprovisioning through the central identity so one action cuts all federated access.
:::

## Page checkpoint

<Quiz id="sso-federation-page" title="Did SSO & federation click?" sampleSize={3}>

<Question
  prompt="What is the security case for centralizing identity with SSO?"
  options={[
    { text: "It makes logins slower so attackers give up" },
    { text: "One place to enforce strong authentication (MFA) across all connected apps, one place to instantly revoke all access, fewer reused credentials, and central visibility into authentication" },
    { text: "It removes the need for any authentication" },
    { text: "It stores all passwords in plaintext for convenience" }
  ]}
  correct={1}
  explanation="SSO centralizes identity at a trusted IdP: enforce MFA once and protect every app, revoke once and cut all access, reduce credential reuse, and monitor authentication centrally. These are significant security wins over dozens of separate logins."
  revisit={{ to: "/docs/cloud-identity/sso-federation#sso-and-federation-centralizing-identity", label: "Centralizing identity" }}
/>

<Question
  prompt="An employee changes teams several times; each time they GAIN new access but their OLD access is never removed. What's this called, and why is it dangerous?"
  options={[
    { text: "Single sign-on; it's harmless" },
    { text: "Privilege creep at the human-identity level — they accumulate broad, unjustified access, becoming an oversized target whose compromise hands an attacker years of access across many teams" },
    { text: "Deprovisioning; it improves security" },
    { text: "Federation; it speeds up logins" }
  ]}
  correct={1}
  explanation="Adding access without removing the old causes privilege creep — accumulated, unjustified permissions. The over-entitled account becomes a high-value target: one compromise inherits access spanning multiple roles. Adjust access on every role change."
  revisit={{ to: "/docs/cloud-identity/sso-federation#the-lifecycle-everyone-forgets-deprovisioning-and-reviews", label: "Privilege creep" }}
/>

<Question
  prompt="Why is deprovisioning (offboarding) the most important — and most forgotten — part of identity governance?"
  options={[
    { text: "It isn't important" },
    { text: "When someone leaves, their access must be removed everywhere; orphaned accounts (valid credentials nobody watches) are repeatedly cited in insider-threat and breach reports, and centralized SSO's biggest payoff (instant revocation) is wasted if offboarding is slow or incomplete" },
    { text: "Because new employees need accounts" },
    { text: "Because it makes onboarding faster" }
  ]}
  correct={1}
  explanation="Departed-employee access and orphaned accounts are common, dangerous gaps. The point of centralized identity is that disabling it cuts all access at once — but only if offboarding is prompt and complete, ideally automated rather than via missable manual checklists."
  revisit={{ to: "/docs/cloud-identity/sso-federation#the-lifecycle-everyone-forgets-deprovisioning-and-reviews", label: "Deprovisioning" }}
/>

<Question
  prompt="What is an access review (recertification), and what does it catch?"
  options={[
    { text: "A performance review of employees" },
    { text: "Periodically re-verifying that people still need the access they have (owners confirm or revoke), catching the privilege creep that accumulates through day-to-day grants and role changes" },
    { text: "A scan of the network for malware" },
    { text: "A review of the cloud bill" }
  ]}
  correct={1}
  explanation="Access reviews have managers/owners recertify that each person still needs their access, revoking what's unjustified. They catch accumulated, stale permissions that slip through — implementing least privilege over time, since access only grows without review."
  revisit={{ to: "/docs/cloud-identity/sso-federation#the-lifecycle-everyone-forgets-deprovisioning-and-reviews", label: "Access reviews" }}
/>

<Question
  prompt="What is the honest tradeoff of centralizing identity at an IdP?"
  options={[
    { text: "There is no downside" },
    { text: "It concentrates risk — compromising the IdP compromises everything — so the IdP becomes a crown-jewel system needing the highest protection (phishing-resistant MFA, tight admin, heavy monitoring); but decentralized identity is worse (no consistent MFA, no clean revocation)" },
    { text: "It makes every app less secure" },
    { text: "It eliminates the need to monitor anything" }
  ]}
  correct={1}
  explanation="Centralization means one place to control AND one place to lose. The IdP must be defended rigorously since its compromise is catastrophic. This isn't an argument against SSO — decentralized identity is worse — but a reminder the IdP is now a crown jewel."
  revisit={{ to: "/docs/cloud-identity/sso-federation#why-centralized-identity-is-also-a-single-point-of-high-value-failure", label: "The centralization tradeoff" }}
/>

</Quiz>

## What's next

→ Continue to [KMS & Secrets at Scale](./kms-secrets-at-scale) — managing the cryptographic keys and secrets that protect everything, across a whole cloud environment, with rotation and auditable access.

→ **Going deeper:** the MFA enforced at the IdP is [authentication](/docs/appsec/broken-authentication); least privilege over time is [Foundations](/docs/foundations/defense-in-depth); monitoring the IdP is [detection](/docs/detection/logging-telemetry).
