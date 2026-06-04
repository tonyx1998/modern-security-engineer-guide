---
id: zero-trust-architecture
title: Zero-Trust Architecture in Practice
sidebar_position: 4
sidebar_label: Zero-trust architecture
description: Turning the zero-trust principle into a working system — the policy decision/enforcement model, the signals every access decision uses (identity, device, context), and how mutual TLS and workload identity secure service-to-service traffic.
---

# Zero-Trust Architecture in Practice

> **In one line:** [Zero trust](/docs/network-security/zero-trust) is the principle "never trust by location"; **zero-trust architecture** is how you *build* it — a **policy engine** that evaluates every access request against signals (verified [identity](./iam-hardening), device health, context) and a **policy enforcement point** that allows or denies — applied not just to users but to *service-to-service* traffic via mutual TLS and workload identity.

:::tip[In plain English]
The [network chapter](/docs/network-security/zero-trust) gave you the *principle* of zero trust: trust nothing because of where it comes from, verify every request. This lesson is the *machinery* that makes it real. At the center is a simple loop: every time someone (or something) tries to access a resource, the request goes to a **decision point** that asks, "given everything I know — *who* is this (proven identity), is their *device* healthy, *what* are they trying to do, and does the *context* look normal? — should I allow it?" An **enforcement point** then lets the request through or blocks it. Crucially, this applies to *machines talking to machines* too: in modern systems, services constantly call each other, and zero trust says those calls must *also* be authenticated and authorized — not trusted just because they're "internal." That's done with **mutual TLS** (both sides prove their identity) and **workload identity** (each service has its own verifiable identity). This lesson is how the zero-trust principle becomes a running architecture.
:::

## The policy decision/enforcement model

Every zero-trust architecture is built around the same conceptual components (formalized in NIST's zero-trust model):

```
   Request ──▶ [ Policy Enforcement Point ] ──asks──▶ [ Policy Decision Point ]
               (gateway/proxy that allows                (evaluates the request
                or blocks the access)                     against policy + signals)
                                                                │ uses signals:
                                                    identity · device · context · behavior
```

- **Policy Decision Point (PDP) / policy engine** — evaluates each request against policy using all available *signals* and renders an allow/deny decision. The "brain."
- **Policy Enforcement Point (PEP)** — sits in the request path (a gateway, proxy, or [identity-aware proxy](/docs/network-security/vpn-and-secure-access)) and *enforces* the decision. The "gate."

The key property: **the decision is made per-request, dynamically, using current signals** — not granted once and cached, and never based on network location. This is what operationalizes "always verify."

:::note[Terms, defined once]
- **Policy Decision Point (PDP)** — the engine that evaluates access requests and decides allow/deny.
- **Policy Enforcement Point (PEP)** — the gateway/proxy that enforces the decision in the request path.
- **Signals** — the inputs to a decision: identity, device posture, location, time, behavior, sensitivity of the resource.
- **Device posture** — a device's security health (patched, managed, not jailbroken/compromised), checked at access time.
- **Continuous / adaptive verification** — re-evaluating trust during a session as signals change, not just at login.
- **Mutual TLS (mTLS)** — TLS where *both* parties present certificates, so each authenticates the other (vs. normal TLS where only the server proves identity).
- **Workload identity** — a verifiable identity assigned to a service/workload (not a human), used to authenticate service-to-service calls.
- **Service mesh** — infrastructure that manages service-to-service communication, often providing mTLS and identity automatically.
:::

## Decisions use signals, not location

The heart of zero-trust architecture is that access decisions weigh *multiple current signals* rather than the single, abusable signal of network position:

- **Identity** — *who* is this, proven by authentication (ideally [MFA](/docs/appsec/broken-authentication))? The primary signal, since [identity is the perimeter](./iam-hardening).
- **Device posture** — is the device healthy: patched, managed, not compromised? A valid identity on a malware-ridden laptop is still risky access.
- **Context** — location, time, and the sensitivity of what's being accessed. A login from a new country at 3 a.m. to a sensitive system warrants more scrutiny.
- **Behavior** — does this match the user's normal pattern, or is it anomalous (the [baseline](/docs/detection/detection-engineering) idea, applied to access)?

The decision can be **adaptive**: low-risk requests (known user, healthy device, normal context, low-sensitivity resource) pass smoothly; higher-risk signals trigger step-up authentication or denial. And verification is ideally **continuous** — re-checked through a session, so trust isn't granted once and assumed forever. This is the same [defense-in-depth](/docs/foundations/defense-in-depth) layering, expressed as multiple independent signals per decision.

## Zero trust for machines: mTLS and workload identity

The part beginners miss: zero trust isn't only about *users*. Modern systems are swarms of services constantly calling each other ([microservices](/docs/network-security/segmentation)), and the old model trusted any call coming from "inside" the network — exactly the [flat-trust](/docs/foundations/trust-boundaries) flaw that enables [lateral movement](/docs/offensive/post-exploitation). Zero-trust architecture extends "verify everything" to *service-to-service* traffic:

- **Workload identity** — each service gets its own *verifiable identity* (not a shared network location or a long-lived key). Service A's call to Service B carries A's identity, which B can verify.
- **Mutual TLS (mTLS)** — both services present certificates and authenticate *each other*, so B knows the caller really is A (and A knows it's really talking to B), and the traffic is encrypted. Normal [TLS](/docs/cryptography/tls) authenticates only the server; mTLS authenticates both ends — essential when you trust *neither* by default.
- **Per-call authorization** — B checks whether A's identity is *allowed* to make this specific call, not just that the call came from inside.

:::note[Worked example: why "internal" service calls must be verified]
An attacker compromises one minor microservice in your cluster. Their goal: reach the payments service.

**Flat internal trust (old model):** the payments service accepts any call from inside the network. The compromised service calls it freely; the attacker pivots straight to payments. One service compromise → access to everything internal. (The [lateral-movement](/docs/offensive/post-exploitation) nightmare.)

**Zero-trust (mTLS + workload identity):** every service authenticates with its own identity via mTLS, and the payments service authorizes calls *per identity*. The compromised minor service's identity is *not* authorized to call payments — so the call is *rejected*, even though it originates inside the cluster. The attacker is stuck on the one service they compromised.

The difference is treating *internal* service calls with the same suspicion as external ones — which is exactly zero trust, now enforced cryptographically between machines. A **service mesh** often provides this mTLS + identity automatically, making "verify every internal call" practical at scale.
:::

## Why it matters

- **It's how the principle becomes a system.** Zero trust as a slogan is useless; the PDP/PEP model, signal-based decisions, and mTLS are the concrete architecture that *implements* it. This is the build, not the buzzword.
- **It closes the internal-trust hole.** Verifying service-to-service calls (not just user logins) is what actually stops [lateral movement](/docs/offensive/post-exploitation) inside modern, microservice-heavy systems — the place flat trust does the most damage.
- **It unifies identity, device, and context into defense in depth.** Each access decision layers multiple independent signals, so no single stolen factor (a password, a location) is enough — the [foundations principles](/docs/foundations/defense-in-depth), made operational per request.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Applying zero trust to users but trusting internal service calls.** A flat, trusting service layer lets one compromised service reach everything. Use mTLS + workload identity and authorize per call.
- **Deciding on identity alone, ignoring device posture.** A valid credential on a compromised device is compromised access. Include device health in the decision.
- **Granting trust once and caching it.** Static, session-long trust ignores changing signals. Verify continuously/adaptively as risk changes.
- **Relying on network location as a signal.** That's the very thing zero trust rejects. Decisions must be based on identity, device, and context — not "it came from inside."
- **Normal TLS instead of mutual TLS between services.** Server-only authentication lets an attacker's internal service impersonate a caller. mTLS authenticates both ends.
- **No verifiable workload identity.** Shared keys or network-based service trust reintroduce the flat-trust hole. Give each workload its own verifiable identity.
:::

## Page checkpoint

<Quiz id="zero-trust-architecture-page" title="Did zero-trust architecture click?" sampleSize={3}>

<Question
  prompt="What are the two core components of a zero-trust architecture, and how do they relate?"
  options={[
    { text: "A firewall and a VPN" },
    { text: "A Policy Decision Point (the engine that evaluates each request against policy and signals to decide allow/deny) and a Policy Enforcement Point (the gateway in the request path that enforces the decision) — decisions are made per-request, dynamically, not by location" },
    { text: "A database and a cache" },
    { text: "An encryption key and a certificate" }
  ]}
  correct={1}
  explanation="The PDP (brain) evaluates each request using current signals and renders allow/deny; the PEP (gate) enforces it in the request path. The defining property is per-request, signal-based decisions — never trust cached or based on network location."
  revisit={{ to: "/docs/cloud-identity/zero-trust-architecture#the-policy-decisionenforcement-model", label: "PDP/PEP model" }}
/>

<Question
  prompt="What signals does a zero-trust access decision use instead of network location?"
  options={[
    { text: "Only the user's password" },
    { text: "Identity (proven, ideally MFA), device posture (is the device healthy?), context (location, time, resource sensitivity), and behavior (is this normal for the user?) — layered as multiple independent signals per decision" },
    { text: "Only the source IP address" },
    { text: "The time of day alone" }
  ]}
  correct={1}
  explanation="Decisions weigh identity, device health, context, and behavior together, rather than the single abusable signal of network position. This layers multiple independent factors (defense in depth per request) and can adapt — higher risk triggers step-up auth or denial."
  revisit={{ to: "/docs/cloud-identity/zero-trust-architecture#decisions-use-signals-not-location", label: "Signals not location" }}
/>

<Question
  prompt="Why must zero trust apply to service-to-service (machine-to-machine) calls, not just users?"
  options={[
    { text: "It doesn't; internal services are always safe" },
    { text: "Modern systems are swarms of services calling each other; trusting any call from 'inside' is the flat-trust flaw that enables lateral movement — so internal calls must be authenticated (mTLS) and authorized per identity too" },
    { text: "Because services don't have identities" },
    { text: "Only to slow down the network" }
  ]}
  correct={1}
  explanation="Internal service calls trusted by location let one compromised service reach everything (lateral movement). Zero trust extends 'verify everything' to machine-to-machine traffic via mutual TLS and workload identity, treating internal calls with the same suspicion as external ones."
  revisit={{ to: "/docs/cloud-identity/zero-trust-architecture#zero-trust-for-machines-mtls-and-workload-identity", label: "Zero trust for machines" }}
/>

<Question
  prompt="How does mutual TLS (mTLS) differ from normal TLS, and why does zero trust need it between services?"
  options={[
    { text: "mTLS is just faster TLS" },
    { text: "Normal TLS authenticates only the server; mTLS has BOTH parties present certificates so each authenticates the other — needed when you trust neither end by default, so a service knows the caller really is who it claims" },
    { text: "mTLS uses no certificates at all" },
    { text: "mTLS only encrypts, never authenticates" }
  ]}
  correct={1}
  explanation="In normal TLS only the server proves its identity. mTLS authenticates both ends, so the callee verifies the caller's identity (and vice versa). Since zero trust trusts neither side by location, mutual authentication between services is essential."
  revisit={{ to: "/docs/cloud-identity/zero-trust-architecture#zero-trust-for-machines-mtls-and-workload-identity", label: "mTLS" }}
/>

<Question
  prompt="An attacker compromises a minor microservice and tries to call the payments service. How does zero-trust architecture (mTLS + workload identity) stop them?"
  options={[
    { text: "It can't; internal calls are always allowed" },
    { text: "Each service authenticates with its own identity via mTLS, and payments authorizes calls per identity; the compromised minor service's identity isn't authorized to call payments, so the call is rejected even though it comes from inside the cluster" },
    { text: "By encrypting the payment data" },
    { text: "By blocking all internal traffic" }
  ]}
  correct={1}
  explanation="Per-identity authorization means payments rejects the unauthorized caller regardless of network origin. The attacker is stuck on the one service they compromised — internal calls are treated with the same suspicion as external, enforced cryptographically (often via a service mesh)."
  revisit={{ to: "/docs/cloud-identity/zero-trust-architecture#zero-trust-for-machines-mtls-and-workload-identity", label: "Verifying internal calls" }}
/>

</Quiz>

## What's next

→ Continue to [SSO & Identity Federation Governance](./sso-federation) — managing *human* identity at scale: how people get the right access, and (the part everyone forgets) *lose* it when they leave.

→ **Going deeper:** the principle this implements is [zero-trust networking](/docs/network-security/zero-trust); identity as the perimeter is [IAM hardening](./iam-hardening); mTLS builds on [TLS](/docs/cryptography/tls); the lateral movement it stops is [post-exploitation](/docs/offensive/post-exploitation).
