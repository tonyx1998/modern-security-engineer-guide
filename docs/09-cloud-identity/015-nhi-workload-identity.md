---
id: nhi-workload-identity
title: Non-Human Identities & Workload Identity
sidebar_position: 2.5
sidebar_label: Non-human identity & SPIFFE
description: Machine identities now vastly outnumber humans, and static long-lived credentials are the dominant breach vector — the fix is short-lived workload identity (SPIFFE/SPIRE SVIDs, cloud workload identity federation, secret managers with rotation).
---

# Non-Human Identities & Workload Identity

> **In one line:** [The last lesson](./iam-hardening) said *identity is the perimeter* — but it only covered **human** identity, and the bigger problem is that **non-human identities** (services, scripts, CI jobs, agents) now vastly outnumber people, each needs a credential, and the dominant breach vector is a **static long-lived secret** one of them is holding — so the durable fix is giving every workload a **short-lived, verifiable identity** instead: [SPIFFE/SPIRE](#spiffe-and-spire-a-verifiable-identity-for-every-workload), [cloud workload identity federation](#cloud-workload-identity-federation-no-static-keys), and secret managers with rotation.

:::tip[In plain English]
When you think "identity," you picture a *person* logging in. But most of the things that need to authenticate in a modern system aren't people — they're *machines*: a microservice calling another service, a CI/CD pipeline deploying code, a script reading a database, an AI agent calling a tool. Each of these is a **non-human identity (NHI)**, and there are *far* more of them than there are employees. Every one needs some way to prove who it is, and the easy, common way is a **static secret** — an API key or password baked into config that never changes. That is exactly the [long-lived leaked credential](./iam-hardening) problem from the last lesson, except now multiplied across thousands of machine identities that nobody is watching. Those static secrets end up [committed to Git repos](/docs/secure-sdlc/secrets-iac-container-scanning), pasted into pipelines, and copied between environments — a mess called **secrets sprawl**. This lesson is the durable fix: stop handing out permanent passwords to machines and instead give every workload a *short-lived, automatically-rotated, verifiable identity* — the [temporary-credential idea](./iam-hardening) you saw for humans, made systematic for machines. Two big mechanisms do this: **SPIFFE/SPIRE** (a vendor-neutral standard) and **cloud workload identity federation** (so a workload outside the cloud, like a CI job, gets in *without any stored key at all*).
:::

## Machines outnumber people — and they hold the worst secrets

In the [last lesson](./iam-hardening), every example of a leaked credential was, in fact, a *machine's* credential: the over-permissive role on an image service, the access key in a repo. That's not a coincidence. The number of **non-human identities** in a modern environment dwarfs the number of human users, because every service, function, container, scheduled job, and pipeline is its own identity that has to authenticate to *something*.

The trouble is *how* those machine identities authenticate. The path of least resistance is a **static, long-lived secret** — an API key, a service-account key file, a database password — created once and used forever. And static machine secrets are uniquely bad for three reasons:

- **They rarely expire.** Unlike a human password nudged to rotate, a service's API key tends to live untouched for *years* — so a key leaked long ago may still work (the [exact long-lived-key problem](./iam-hardening), now at machine scale).
- **They sprawl.** The same secret gets copied into config files, [committed to Git](/docs/secure-sdlc/secrets-iac-container-scanning), pasted into CI variables, and duplicated across dev/staging/prod. This is **secrets sprawl** — and once a secret is in five places, you can't confidently rotate or revoke it.
- **Nobody owns them.** A departing employee gets [offboarded](./sso-federation); a service account created for a one-off script three years ago just… stays, with its key, forgotten — an [orphaned identity](./sso-federation) for machines.

:::note[Terms, defined once]
- **Non-human identity (NHI) / machine identity / workload identity** — an identity belonging to software (a service, container, function, CI job, script, or AI agent), not a person, used to authenticate to other systems.
- **Workload** — any running unit of software that needs an identity: a service, a container, a serverless function, a batch job.
- **Secrets sprawl** — the same static secret copied across many places (repos, config, CI, environments), making it impossible to track, rotate, or revoke confidently.
- **SPIFFE (Secure Production Identity Framework for Everyone)** — an open, vendor-neutral standard for giving every workload a verifiable identity. Defines the *what*.
- **SPIRE (the SPIFFE Runtime Environment)** — the open-source software that implements SPIFFE: it attests and issues identities. The *how*.
- **SVID (SPIFFE Verifiable Identity Document)** — the short-lived credential a workload presents to prove its SPIFFE identity (an X.509 certificate or a signed JWT).
- **Attestation** — proving *what* a workload is (which node, which container, which Kubernetes service account) before it's granted an identity — the machine equivalent of verifying a human's ID before issuing a badge.
- **Workload identity federation** — letting a workload outside a cloud (e.g., a CI runner) authenticate to that cloud using a short-lived **OIDC** token it already has, instead of a stored static key.
- **OIDC (OpenID Connect)** — an identity layer where a trusted issuer signs a short-lived token asserting "this is who/what I am," which a relying party verifies — here, used so no static key need ever be stored.
:::

## SPIFFE and SPIRE: a verifiable identity for every workload

[Zero-trust architecture](./zero-trust-architecture) already told you services should authenticate each other with **[workload identity](./zero-trust-architecture) and [mTLS](./zero-trust-architecture)** rather than trusting "internal" callers. **SPIFFE** is the open, vendor-neutral *standard* for that workload identity, and **SPIRE** is the software that hands it out. The whole point is to replace static service secrets with short-lived, automatically-rotated, cryptographically-verifiable identities.

How it works, end to end:

1. **A SPIFFE ID names the workload.** Every workload gets a stable identity in URI form, e.g. `spiffe://example.com/payments-service`. That's the *name* a caller can authorize, exactly like the per-identity authorization in [zero-trust architecture](./zero-trust-architecture).
2. **The workload is *attested*, not handed a password.** When a service starts, it asks the local SPIRE agent for its identity over a socket. The agent inspects *what the workload actually is* — its node, its container, its Kubernetes service account — and checks that against registration rules. The workload proves its identity by *being what it claims to be*, so **there is no secret to leak in the first place.**
3. **It receives a short-lived SVID.** On successful attestation, the workload gets an **SVID** — typically an **X.509 certificate** (with the SPIFFE ID embedded in the certificate's SAN field, so it plugs straight into [mTLS](./zero-trust-architecture)) or a signed **JWT** (for HTTP APIs that carry identity in a header). The SVID is **short-lived and auto-rotated** — often valid for around an hour, renewed before it expires, with no human in the loop.

:::note[Worked example: the static service key vs. the SVID]
A `payments` service needs to call an `orders` service.

**Static-secret way (the sprawl trap):** you generate an API key, put it in `payments`'s config, *also* paste it into the CI variables that deploy `payments`, and commit a `.env.example` that someone later fills in for real and commits by accident. The key never expires. It's now in three or four places. Six months later [a secret scanner](/docs/secure-sdlc/secrets-iac-container-scanning) finds it in the repo history — but you can't safely rotate it, because you're no longer sure everywhere it lives. Meanwhile any attacker who pulled the repo has a working credential to `orders`.

**SPIFFE/SPIRE way:** `payments` has no stored secret at all. On startup it asks the SPIRE agent for its SVID; the agent attests that this really is the `payments` container on an approved node and issues an X.509-SVID for `spiffe://example.com/payments-service`, good for one hour. `payments` calls `orders` over [mTLS](./zero-trust-architecture); `orders` reads the SPIFFE ID from the certificate and authorizes *that identity*. An hour later the SVID is rotated automatically. There is **nothing to commit, nothing to sprawl, and nothing that stays valid if stolen.**

Same need — service-to-service auth — but the static version *creates* a long-lived, sprawling secret while the SVID version creates *no* durable secret at all. That's the whole move: turn machine identity from "a password we hope nobody copies" into "a short-lived, attested, auto-rotated document."
:::

## Cloud workload identity federation: no static keys

SPIFFE/SPIRE shines *inside* an environment you run. But a huge share of real leaked-key incidents come from workloads at the *edge* — most infamously a **CI/CD pipeline** that needs to deploy into your cloud. The lazy fix is to mint a long-lived cloud access key and paste it into the pipeline's secret store. That key is a permanent, high-value target sitting in a system (the CI provider) you don't fully control.

**Workload identity federation** removes the stored key entirely. The pipeline already has a short-lived, signed **[OIDC](#machines-outnumber-people--and-they-hold-the-worst-secrets)** token from its own provider that asserts *what it is* ("the deploy job on `main` of repo X"). Instead of storing a cloud key, you set up a **trust relationship**: the cloud is told to *trust tokens from that issuer matching those claims* and, in exchange for a valid token, hand back **short-lived** cloud credentials.

```
   CI job starts ──▶ provider issues a signed OIDC token  (expires in minutes)
                     "I am the deploy job on main of repo X"
                          │
                          ▼
   Cloud verifies the token against a pre-established trust rule
   (issuer + claims must match) ──▶ returns SHORT-LIVED cloud credentials
                          │
                          ▼
   Job deploys.  Nothing persistent was ever stored.
```

The payoff is the same durable principle, taken to its limit: **the workload never possesses a stored secret.** The OIDC token is generated fresh per run and expires in minutes; the cloud credentials it's exchanged for also expire fast. There is *nothing to leak in a build log, nothing to copy between environments, and nothing for an attacker to harvest from a compromised runner* — because no standing credential exists. This is the [minimize-standing-exposure principle](./iam-hardening) applied to the messiest machine identity of all, the external pipeline.

Where short-lived identity genuinely isn't possible yet, the fallback is the same as for [secrets at scale](./kms-secrets-at-scale): keep the secret in a **secret manager** (never in code/config), gate it with [IAM](./iam-hardening), **rotate it automatically**, and [audit every access](./kms-secrets-at-scale). Short-lived workload identity is the goal; a managed, rotated, audited secret is the floor.

:::note[The dated specifics — verify current before relying on them]
As of this writing (mid-2026): industry surveys (e.g., **GitGuardian's State of Secrets Sprawl**) put **non-human identities at roughly 45-to-1 over human identities** on average — and far higher (well over 100-to-1) in cloud-native estates — with **tens of millions of new hardcoded secrets** found in public repositories each year. **SPIFFE and SPIRE** are graduated **CNCF** projects; SVIDs are commonly issued with ~1-hour lifetimes. The major clouds each ship a workload-identity-federation feature (AWS IAM Roles Anywhere / OIDC, GCP Workload Identity Federation, Azure Workload Identity / federated credentials), and **GitHub Actions OIDC tokens expire in ~5 minutes**. These ratios, project statuses, and product names **will change** — treat them as a dated snapshot, verify current, and lean on the durable parts: machines outnumber humans, static long-lived secrets are the dominant breach vector, and short-lived attested workload identity is the fix.
:::

## Why it matters

- **It's where the leaked-credential breaches actually originate.** The [last lesson's](./iam-hardening) "long-lived leaked key" is, in practice, almost always a *machine's* key — in a repo, a pipeline, or a config. Treating machine identity as a first-class problem targets the real breach vector, not a theoretical one.
- **It completes "identity is the perimeter."** The chapter's thesis only holds if it covers *all* identities. Humans are the minority; if machine identities are a sprawl of permanent passwords, the perimeter is wide open regardless of how well you govern people.
- **It's the same principle you already know, made systematic.** Short-lived, attested, auto-rotated workload identity is just [least privilege + minimize standing exposure](./iam-hardening) applied to non-humans — and it dovetails with the [mTLS/workload identity of zero trust](./zero-trust-architecture) and the [rotation/auditing of secrets at scale](./kms-secrets-at-scale).

## Common pitfalls

:::caution[Where people commonly trip up]
- **Treating identity as a human-only problem.** Machine identities vastly outnumber people and hold the worst-managed secrets. Govern non-human identity as deliberately as human identity.
- **Static, never-expiring service keys.** A machine API key baked into config is the classic long-lived leaked secret, at scale. Prefer short-lived workload identity (SPIFFE/SPIRE, federation); never hardcode keys.
- **Storing a long-lived cloud key in CI.** A permanent cloud key in a pipeline secret store is a high-value target in a system you don't fully control. Use workload identity federation so the runner holds *no* standing key.
- **Letting secrets sprawl.** The same secret copied across repos, config, and environments can't be confidently rotated or revoked. Keep secrets in one managed store; don't duplicate.
- **Orphaned service accounts.** A machine identity created for a one-off task and never retired is an unowned, forgotten credential. Inventory and expire non-human identities like you offboard people.
- **Skipping attestation.** Issuing identity to "whatever asks" defeats the point. The workload must *prove what it is* (node, container, service account) before getting an identity.
:::

## Page checkpoint

<Quiz id="nhi-workload-identity-page" title="Did non-human identity click?" sampleSize={3}>

<Question
  prompt="Why are non-human (machine) identities a bigger credential-leak problem than human ones?"
  options={[
    { text: "Machines choose weaker passwords" },
    { text: "Machine identities vastly outnumber people, and they tend to authenticate with STATIC long-lived secrets (API keys, service-account keys) that rarely expire, get copied across repos/config/CI (secrets sprawl), and are owned by no one — so they're the dominant leaked-credential vector at scale" },
    { text: "Machines can't use IAM at all" },
    { text: "Human identities are never leaked" }
  ]}
  correct={1}
  explanation="There are far more services, jobs, and scripts than employees, and each needs to authenticate — usually via a static key that lives untouched for years, sprawls across many places, and has no owner. That's exactly the long-lived-leaked-key problem from IAM hardening, multiplied across machines."
  revisit={{ to: "/docs/cloud-identity/nhi-workload-identity#machines-outnumber-people--and-they-hold-the-worst-secrets", label: "Machines outnumber people" }}
/>

<Question
  prompt="What is the core idea of SPIFFE/SPIRE, and why does it remove the leaked-secret problem?"
  options={[
    { text: "It encrypts the static API key so it can't be read" },
    { text: "It gives each workload a verifiable identity (a SPIFFE ID) and issues a SHORT-LIVED, auto-rotated SVID after ATTESTING what the workload actually is (node/container/service account) — so the workload proves identity by being what it claims, and there's no static secret to leak in the first place" },
    { text: "It stores all service passwords in one shared file" },
    { text: "It makes service keys last longer so they're rotated less" }
  ]}
  correct={1}
  explanation="SPIFFE is the standard, SPIRE the implementation. A workload is attested (proven to be the real container on an approved node) and handed a short-lived SVID (X.509 cert or JWT) that auto-rotates. Because identity comes from attestation, not a stored password, there's nothing durable to commit, sprawl, or steal."
  revisit={{ to: "/docs/cloud-identity/nhi-workload-identity#spiffe-and-spire-a-verifiable-identity-for-every-workload", label: "SPIFFE/SPIRE" }}
/>

<Question
  prompt="How does cloud workload identity federation let a CI/CD pipeline deploy to the cloud without a stored key?"
  options={[
    { text: "It emails a new key to the pipeline each run" },
    { text: "The pipeline presents a short-lived, signed OIDC token from its own provider asserting what it is; the cloud is pre-configured to trust that issuer + claims and exchanges a valid token for SHORT-LIVED cloud credentials — so the runner stores no standing secret, and there's nothing to harvest from a compromised runner" },
    { text: "It disables authentication for CI jobs" },
    { text: "It copies the cloud admin key into the CI secret store" }
  ]}
  correct={1}
  explanation="Federation replaces a stored long-lived cloud key with a trust relationship: the CI provider issues a fresh, fast-expiring OIDC token per run; the cloud verifies it against pre-set claims and returns short-lived credentials. No persistent secret ever exists in the pipeline — nothing to leak in logs or copy between environments."
  revisit={{ to: "/docs/cloud-identity/nhi-workload-identity#cloud-workload-identity-federation-no-static-keys", label: "Workload identity federation" }}
/>

<Question
  prompt="Where short-lived workload identity isn't yet possible, what's the correct fallback for a machine secret?"
  options={[
    { text: "Hardcode it in the application so it's easy to find" },
    { text: "Keep it in a secret manager (never in code/config), gate access with IAM, rotate it automatically, and audit every access — short-lived identity is the goal, but a managed, rotated, audited secret is the floor" },
    { text: "Share one key across all services to simplify rotation" },
    { text: "Commit it to a private repo so only your team sees it" }
  ]}
  correct={1}
  explanation="The fallback mirrors secrets-at-scale: store the secret in a managed store (never hardcoded), authorize it with IAM, rotate it automatically to bound exposure, and log every use. It's not as good as no standing secret, but it's the minimum acceptable bar when short-lived identity isn't available."
  revisit={{ to: "/docs/cloud-identity/nhi-workload-identity#cloud-workload-identity-federation-no-static-keys", label: "The secret-manager floor" }}
/>

<Question
  prompt="What is 'secrets sprawl,' and why does it make a leak so much worse?"
  options={[
    { text: "Using too many different encryption algorithms" },
    { text: "The same static secret copied across many places — repos, config files, CI variables, multiple environments — so once it leaks you can't confidently rotate or revoke it, because you no longer know everywhere it lives" },
    { text: "Storing secrets in a single managed vault" },
    { text: "Rotating secrets too frequently" }
  ]}
  correct={1}
  explanation="Sprawl is duplication: when a secret exists in five places, rotating it risks breaking the copies you forgot, so teams avoid rotating at all — leaving a leaked secret valid indefinitely. Keeping each secret in one managed store (or eliminating it via workload identity) is what makes rotation and revocation actually feasible."
  revisit={{ to: "/docs/cloud-identity/nhi-workload-identity#machines-outnumber-people--and-they-hold-the-worst-secrets", label: "Secrets sprawl" }}
/>

</Quiz>

## What's next

→ Continue to [Cloud Security Posture Management (CSPM)](./cspm) — finding the over-permissive roles, public buckets, and misconfigurations (including over-broad machine identities) across an estate of thousands of resources before an attacker does.

→ **Going deeper:** the human-identity version is [IAM hardening](./iam-hardening); the mTLS/workload-identity this feeds is [zero-trust architecture](./zero-trust-architecture); the rotation/auditing fallback is [KMS & secrets at scale](./kms-secrets-at-scale); the leaked-key scanning that catches sprawl is [secrets scanning](/docs/secure-sdlc/secrets-iac-container-scanning).
