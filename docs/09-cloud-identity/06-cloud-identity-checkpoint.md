---
id: cloud-identity-checkpoint
title: Chapter 9 Checkpoint
sidebar_position: 7
sidebar_label: ✅ Chapter checkpoint
description: Prove the cloud & identity security toolkit stuck — a mixed quiz across IAM hardening, CSPM, zero-trust architecture, SSO & federation, and KMS & secrets at scale.
---

# Chapter 9 Checkpoint

> **The cloud & identity security toolkit, all together.** This mixed quiz pulls from every lesson. Passing means you can secure the modern perimeter — where identity, not the network, gates access, and most breaches are an over-broad permission or a leaked credential.

:::tip[How this works]
The quiz samples from a larger bank each attempt. The chapter's through-line: **identity is the perimeter.** Harden IAM to least privilege, catch misconfigurations at scale, verify every request, govern the human-identity lifecycle, and manage keys/secrets with control + visibility. If a question stings, follow its revisit link.
:::

## What you should be able to do now

- **Harden [IAM](./iam-hardening)** — least privilege and temporary credentials, because identity is the perimeter.
- **Run [CSPM](./cspm)** — find misconfigurations across the estate, knowing config is your job under shared responsibility.
- **Build [zero-trust architecture](./zero-trust-architecture)** — signal-based decisions and mTLS/workload identity for service-to-service.
- **Govern [SSO & federation](./sso-federation)** — centralized identity, and the deprovisioning/reviews everyone forgets.
- **Manage [keys & secrets at scale](./kms-secrets-at-scale)** — KMS, dynamic secrets, and authorized, audited access.

## The checkpoint

<Quiz id="cloud-identity-checkpoint" title="Chapter 9: Cloud & Identity Security" sampleSize={6} passingScore={0.67}>

<Question
  prompt="Why is 'identity is the perimeter' literally true in the cloud?"
  options={[
    { text: "The cloud has stronger firewalls" },
    { text: "There's no network wall — every action is an API call IAM evaluates ('is this identity authorized?'), so identity and permissions, not network location, gate all access" },
    { text: "Cloud data centers have no doors" },
    { text: "Identity is encrypted" }
  ]}
  correct={1}
  explanation="Cloud resources are API endpoints and every action is authorized by IAM based on identity. There's no inside/outside, so identity and its permissions are the control plane — the perimeter and the attacker's focus."
  revisit={{ to: "/docs/cloud-identity/iam-hardening#why-identity-is-the-cloud-perimeter", label: "Identity is the perimeter" }}
/>

<Question
  prompt="An image-reading service is given AdministratorAccess and is compromised. Versus a least-privilege role, what's the difference?"
  options={[
    { text: "No difference" },
    { text: "Least privilege (read one bucket) → a few images, contained; admin → read everything, delete data, run up the bill, create backdoor admins, disable logging — full account takeover. Permissions decide the blast radius" },
    { text: "Least privilege makes it worse" },
    { text: "Admin is safer" }
  ]}
  correct={1}
  explanation="Same vulnerability, wildly different outcome based on the identity's permissions. Over-permissioning turns a contained incident into account takeover, which is why right-sizing permissions caps blast radius in advance."
  revisit={{ to: "/docs/cloud-identity/iam-hardening#least-privilege-applied-to-iam", label: "Over-permissive roles" }}
/>

<Question
  prompt="Why are long-lived (static) access keys dangerous, and what replaces them?"
  options={[
    { text: "They're slow; use faster keys" },
    { text: "They never expire, so a leaked key may still work years later; replace with temporary credentials via role assumption that expire automatically, shrinking the exposure window" },
    { text: "They're too short; use permanent keys" },
    { text: "Nothing's wrong with them" }
  ]}
  correct={1}
  explanation="Static keys are the classic leaked secret — they persist in repos/config and never expire. Temporary credentials from assuming a role expire in minutes/hours, so a leaked one quickly becomes useless."
  revisit={{ to: "/docs/cloud-identity/iam-hardening#eliminate-long-lived-keys", label: "Eliminate long-lived keys" }}
/>

<Question
  prompt="Under the shared responsibility model, who's responsible if you set a bucket public and data leaks?"
  options={[
    { text: "The provider, always" },
    { text: "You — the provider secures the cloud itself (hardware, hypervisor), but you secure what you put IN it (configs, data, identities); a misconfiguration you made is on your side, and the provider faithfully does what you configured" },
    { text: "No one" },
    { text: "The ISP" }
  ]}
  correct={1}
  explanation="Security is shared: provider 'of the cloud,' customer 'in the cloud.' A public bucket you configured is your responsibility — most cloud breaches are on the customer's config/identity side, which CSPM watches."
  revisit={{ to: "/docs/cloud-identity/cspm#the-shared-responsibility-model-config-is-your-job", label: "Shared responsibility" }}
/>

<Question
  prompt="CSPM reports 2,000 findings. How should you handle them?"
  options={[
    { text: "Fix all 2,000 top to bottom" },
    { text: "Prioritize by real risk (likelihood × impact) — internet-facing + sensitive + exploitable findings (public PII bucket, DB port open to internet) are critical now; no-impact items are noise — exactly like detection tuning" },
    { text: "Ignore them all" },
    { text: "Treat every finding as equally critical" }
  ]}
  correct={1}
  explanation="Unprioritized findings get tuned out like noisy detections. Triage by exposure and data sensitivity: a handful of internet-facing, sensitive, exploitable misconfigs are emergencies; the rest is backlog or noise."
  revisit={{ to: "/docs/cloud-identity/cspm#how-cspm-works-and-how-to-not-drown-in-it", label: "Prioritize findings" }}
/>

<Question
  prompt="What are the two core components of a zero-trust architecture?"
  options={[
    { text: "A firewall and a VPN" },
    { text: "A Policy Decision Point (evaluates each request against policy and signals to decide allow/deny) and a Policy Enforcement Point (the gateway that enforces it) — decisions are per-request and signal-based, never by location" },
    { text: "A database and a cache" },
    { text: "A key and a certificate" }
  ]}
  correct={1}
  explanation="The PDP decides using current signals; the PEP enforces in the request path. The defining property is per-request, signal-based decisions, not trust by network location."
  revisit={{ to: "/docs/cloud-identity/zero-trust-architecture#the-policy-decisionenforcement-model", label: "PDP/PEP model" }}
/>

<Question
  prompt="Why must zero trust apply to service-to-service calls, and what enforces it?"
  options={[
    { text: "It doesn't; internal services are safe" },
    { text: "Trusting any 'inside' call is the flat-trust flaw enabling lateral movement; mutual TLS (both services authenticate each other) plus workload identity (each service has its own verifiable identity) let the callee authorize per identity, rejecting an unauthorized internal caller" },
    { text: "Services don't have identities" },
    { text: "Only to slow the network" }
  ]}
  correct={1}
  explanation="Internal calls trusted by location let one compromised service reach everything. mTLS + workload identity authenticate both ends and authorize per identity, so a compromised minor service can't call payments even from inside the cluster."
  revisit={{ to: "/docs/cloud-identity/zero-trust-architecture#zero-trust-for-machines-mtls-and-workload-identity", label: "Zero trust for machines" }}
/>

<Question
  prompt="An employee changes teams repeatedly, gaining new access but never losing the old. What's this, and why dangerous?"
  options={[
    { text: "Single sign-on; harmless" },
    { text: "Privilege creep at the human-identity level — accumulated, unjustified access makes them an oversized target whose compromise hands an attacker access across many teams" },
    { text: "Deprovisioning; it helps security" },
    { text: "Federation; it speeds logins" }
  ]}
  correct={1}
  explanation="Adding access without removing the old causes privilege creep. The over-entitled account is a high-value target. Adjust access on every role change, and run access reviews to catch the creep."
  revisit={{ to: "/docs/cloud-identity/sso-federation#the-lifecycle-everyone-forgets-deprovisioning-and-reviews", label: "Privilege creep" }}
/>

<Question
  prompt="Why is deprovisioning (offboarding) the most important and most forgotten part of identity governance?"
  options={[
    { text: "It isn't important" },
    { text: "Departed-employee access and orphaned accounts (valid credentials nobody watches) are repeatedly cited in breach reports, and centralized SSO's biggest payoff — instant revocation — is wasted if offboarding is slow or incomplete" },
    { text: "Because new hires need accounts" },
    { text: "Because it speeds onboarding" }
  ]}
  correct={1}
  explanation="Orphaned accounts are common, dangerous gaps. The point of centralized identity is that disabling it cuts all access at once — but only if offboarding is prompt and complete, ideally automated rather than via missable checklists."
  revisit={{ to: "/docs/cloud-identity/sso-federation#the-lifecycle-everyone-forgets-deprovisioning-and-reviews", label: "Deprovisioning" }}
/>

<Question
  prompt="What is the defining security property of a cloud KMS?"
  options={[
    { text: "It stores keys in your app's memory for speed" },
    { text: "Master keys never leave the KMS — services request crypto operations rather than fetching the key, so the raw key never touches your servers (enabling envelope encryption at scale)" },
    { text: "It emails the key when needed" },
    { text: "It deletes keys after one use" }
  ]}
  correct={1}
  explanation="A KMS keeps master keys inside the service; you request encrypt/decrypt operations. This enables envelope encryption across the estate with master keys protected and every operation authorized and logged."
  revisit={{ to: "/docs/cloud-identity/kms-secrets-at-scale#kms-and-envelope-encryption-at-scale", label: "KMS at scale" }}
/>

<Question
  prompt="How does a dynamic (short-lived) secret improve on a static one?"
  options={[
    { text: "It's longer" },
    { text: "Generated on demand and auto-expiring (e.g., in an hour), so a leaked credential is useless almost immediately — shrinking the exposure window from 'indefinitely' to 'one hour'" },
    { text: "It never expires" },
    { text: "It's stored in plaintext config" }
  ]}
  correct={1}
  explanation="A static secret persists until manually rotated. A dynamic secret is created on demand and auto-revoked, so a leak's useful life is tiny — applying 'minimize standing exposure' to all secrets, like temporary IAM credentials."
  revisit={{ to: "/docs/cloud-identity/kms-secrets-at-scale#from-static-to-dynamic-secrets", label: "Static to dynamic" }}
/>

<Question
  prompt="Why is auditing every key/secret access so valuable?"
  options={[
    { text: "It loads secrets faster" },
    { text: "After a suspected exposure, logs of who used a secret, what they accessed, and when turn 'assume the worst, rotate everything' into a scoped investigation — confirming normal use or pinpointing the anomaly and what it touched" },
    { text: "It double-encrypts the secret" },
    { text: "It has no value" }
  ]}
  correct={1}
  explanation="Without auditing you can't tell if a key was misused or scope the impact, so you assume the worst. Logged access lets you confirm normal use or identify the compromise precisely — turning a guessing game into a scoped investigation."
  revisit={{ to: "/docs/cloud-identity/kms-secrets-at-scale#from-static-to-dynamic-secrets", label: "Auditability" }}
/>

</Quiz>

## Chapter 9 complete

You now understand the modern perimeter: in the cloud, [identity gates everything](./iam-hardening), so harden IAM to least privilege and kill long-lived keys; catch [misconfigurations at scale](./cspm) knowing config is your responsibility; [verify every request](./zero-trust-architecture) including service-to-service; [govern human identity](./sso-federation) through its whole lifecycle; and manage [keys and secrets](./kms-secrets-at-scale) with control and visibility. The single idea: identity is the perimeter, so secure it relentlessly.

→ On to [Chapter 10: Compliance & Risk, Operationalized](/docs/compliance) — turning all the controls you've learned into the auditable, governed program that regulators and customers require.
