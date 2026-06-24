---
id: kubernetes-security
title: Kubernetes Security — Admission Control & Provenance
sidebar_position: 3.7
sidebar_label: Kubernetes security
description: Securing the platform that runs cloud-native workloads — admission control as the gate (Pod Security Admission after PSP's removal, Kyverno and OPA Gatekeeper), image provenance and signing, secrets handling, and network policies.
---

# Kubernetes Security — Admission Control & Provenance

> **In one line:** [Kubernetes](/docs/network-security/segmentation) is the platform that runs most cloud-native workloads, so it's a high-value attack surface of its own — and securing it means gating what's allowed to run via **admission control** ([Pod Security Admission](#admission-control-the-gate-before-a-pod-runs) after the old PodSecurityPolicy was removed, plus **Kyverno** / **OPA Gatekeeper**), trusting only **signed images** from a known build (provenance), keeping **secrets** out of plain config, and replacing flat in-cluster trust with **network policies**.

:::tip[In plain English]
Modern systems don't just run containers — they run them on an **orchestrator**, and the dominant one is **Kubernetes**: the system that decides where each container runs, restarts them, scales them, and wires them together. That makes Kubernetes itself a juicy target: compromise the platform and you potentially own *everything running on it*. So Kubernetes has its own security discipline, and most of it comes down to one powerful idea — a **gate** that every request to run something must pass through, called **admission control**. Before Kubernetes lets a container run, an admission controller can inspect the request and say "no" — "no, you can't run as root," "no, that image isn't signed by us," "no, that's missing required limits." The old built-in gate (PodSecurityPolicy) was *removed*, so today you use its replacement, **Pod Security Admission**, for the basics, and a programmable policy engine — **Kyverno** or **OPA Gatekeeper** — for anything custom. Around that gate sit three more must-dos: only run **images you can prove came from your build** (signing), keep **secrets** properly protected instead of pasted into config, and use **network policies** so a compromised pod can't freely talk to every other pod — the [zero-trust "no flat internal trust"](./zero-trust-architecture) idea, inside the cluster.
:::

## Admission control: the gate before a pod runs

The single most important concept in Kubernetes security is **admission control**. Every time something asks Kubernetes to create or change a workload, that request passes through the **admission control** stage *before* it's accepted. An **admission controller** can inspect the request and **reject** it — or, for some, **mutate** it (fill in a safer default) — so it's the chokepoint where you enforce "what is and isn't allowed to run." It's a [policy enforcement point](./zero-trust-architecture), specialized to "what may run on this cluster."

A short history matters here, because it's a common stumbling block:

- **PodSecurityPolicy (PSP)** was the original built-in mechanism for restricting pods (no running as root, no privileged containers, etc.). It was clunky and **was *removed* in Kubernetes 1.25** — so any guidance that tells you to "just use a PSP" is out of date and won't work.
- **Pod Security Admission (PSA)** is the built-in replacement. It applies the **Pod Security Standards** — three ready-made profiles, **Privileged** (no restrictions), **Baseline** (block the obviously-dangerous), and **Restricted** (hardened best practice) — at the **namespace** level. It's simple and built in, but deliberately limited: a fixed set of profiles, pods only.
- **Kyverno** and **OPA Gatekeeper** are programmable **policy engines** that plug in as admission controllers for *anything PSA can't express*: "every image must come from our registry," "every pod must have resource limits and a team label," "no service may be exposed publicly without approval." They're [policy-as-code](/docs/secure-sdlc/secrets-iac-container-scanning) for the cluster — the same guardrail idea [CSPM](./cspm) used to *block* insecure configs, applied at the moment a workload is admitted.

:::note[Terms, defined once]
- **Kubernetes (K8s)** — the dominant container orchestrator: it schedules, restarts, scales, and networks containerized workloads across a cluster.
- **Pod** — Kubernetes' smallest deployable unit: one or more containers that run together and share a network identity.
- **Admission control** — the stage where a request to create/change a workload is inspected and can be rejected or mutated *before* it's accepted; the cluster's policy enforcement point.
- **PodSecurityPolicy (PSP)** — the original, now-**removed** (Kubernetes 1.25) built-in pod-restriction mechanism. Out of date — don't use.
- **Pod Security Admission (PSA)** — the built-in PSP replacement; applies the Pod Security Standards (Privileged / Baseline / Restricted) per namespace.
- **Kyverno / OPA Gatekeeper** — programmable policy engines used as admission controllers to enforce custom rules (policy-as-code) beyond PSA.
- **Image provenance** — proof of *where an image came from and how it was built* — that it's the artifact your pipeline produced, not a tampered or unknown one.
- **Image signing** — cryptographically signing a built image so the cluster can verify its origin and integrity before running it (an [integrity check](/docs/cryptography/hashing-and-macs) for what runs).
- **Network policy** — a Kubernetes rule controlling which pods may talk to which, replacing default flat any-to-any pod connectivity.
:::

## Image provenance: only run what you can prove you built

By default a cluster will run *any* image you point it at — including a public image with a hidden backdoor, or a tampered build. That's the [software-supply-chain risk](/docs/secure-sdlc/supply-chain) from the SDLC chapter, landing at the cluster's front door. The defense is **provenance** enforced at admission:

- **Sign images in your build pipeline.** When CI produces an image, it cryptographically **signs** it. The signature is an [integrity-and-origin check](/docs/cryptography/hashing-and-macs): it proves the image is exactly the artifact your pipeline built and hasn't been swapped.
- **Make the cluster verify the signature before running.** A [Kyverno/OPA](#admission-control-the-gate-before-a-pod-runs) admission policy *rejects any image that isn't signed by your trusted key* (and often: only from your registry, never `:latest`, no unknown public images). An attacker who slips a malicious image in front of the cluster is stopped at the gate because it isn't signed.

This is [zero trust](./zero-trust-architecture) for *artifacts*: don't run an image because it's "there," run it only because you can *prove* it came from your trusted build.

:::note[Worked example: admission control stops a bad deploy]
An attacker compromises a developer's workstation and pushes a Kubernetes manifest that runs a **privileged** container (full host access) from a **public, unsigned** image they control — aiming to break out of the container and own the node.

**No admission control:** Kubernetes does what the manifest says. The privileged, attacker-controlled container runs, breaks out to the host, and the node is compromised. The cluster faithfully ran exactly what it was told — the [shared-responsibility lesson](./cspm), inside Kubernetes.

**With admission control:** the create request hits the gate first.
- **Pod Security Admission (Restricted)** rejects it immediately — the namespace forbids privileged containers, full stop.
- Even if it weren't privileged, a **Kyverno/OPA policy** rejects it because the image is **unsigned and not from the approved registry** — it can't prove provenance.

The malicious workload **never runs.** The exact same manifest is the difference between "node compromised" and "request denied," decided entirely by whether a gate inspected it first. That's why admission control is the heart of Kubernetes security: it's where "what may run here" is actually enforced.
:::

## Secrets and network policies: don't trust the inside

Two more essentials close the most common Kubernetes gaps, and both echo principles you've already met:

**Handle secrets properly.** Kubernetes has a built-in `Secret` object, but beginners assume it's encrypted by default — it's not; a Kubernetes Secret is only **base64-encoded** (trivially reversible), and anyone who can read it in the cluster or its backing store can read the secret. Treat cluster secrets with the same discipline as [secrets at scale](./kms-secrets-at-scale): enable encryption-at-rest for the secret store (ideally [backed by a KMS](./kms-secrets-at-scale)), restrict who can read Secrets via [least-privilege RBAC](./iam-hardening), and prefer pulling secrets from an external [secrets manager](./kms-secrets-at-scale) — or, best of all, give workloads a [short-lived workload identity](./nhi-workload-identity) so there's no stored secret to protect at all.

**Use network policies — no flat internal trust.** By default, *every pod in a cluster can reach every other pod* — the [flat-trust](/docs/foundations/trust-boundaries) network that makes [lateral movement](/docs/offensive/post-exploitation) easy: compromise one pod and you can probe them all. A **network policy** restricts which pods may talk to which, so the `frontend` can reach the `api` but a compromised logging sidecar *can't* reach the `database`. This is [segmentation](/docs/network-security/segmentation) and the [zero-trust "don't trust internal calls"](./zero-trust-architecture) principle, enforced at the pod-network level — the cluster-internal companion to the [mTLS/workload-identity](./zero-trust-architecture) controls from the zero-trust lesson.

:::note[The dated specifics — verify current before relying on them]
As of this writing (mid-2026): **PodSecurityPolicy was removed in Kubernetes 1.25**, and **Pod Security Admission** (enforcing the **Pod Security Standards**: Privileged / Baseline / Restricted) is its built-in successor. The two leading programmable admission policy engines are **Kyverno** and **OPA Gatekeeper** (both CNCF projects); common image-signing tooling includes **Sigstore/cosign**. Kubernetes **Secrets are base64-encoded, not encrypted**, unless encryption-at-rest is explicitly configured. Version numbers, project names, default behaviors, and tool choices **will change** — treat them as a dated snapshot, verify current, and rely on the durable parts: admission control is the gate, run only provenance-verified (signed) images, protect secrets as real secrets, and replace flat in-cluster trust with network policies.
:::

## Why it matters

- **The platform is a high-value target.** Kubernetes runs most cloud-native workloads, so compromising the cluster can mean compromising *everything on it*. Securing the orchestrator itself — not just the apps — is its own essential discipline.
- **Admission control is preventive and central.** Gating *what is allowed to run* (no privileged pods, only signed images, required policies) stops whole classes of bad deploys before they execute — the [shift-left/guardrail](/docs/secure-sdlc/shift-left) idea at the cluster's front door.
- **It reuses every principle you've learned.** Kubernetes security is [least privilege](./iam-hardening) (RBAC), [supply-chain integrity](/docs/secure-sdlc/supply-chain) (signed images), [secrets discipline](./kms-secrets-at-scale), and [zero-trust segmentation](./zero-trust-architecture) (network policies) — the whole guide, applied to one platform.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Trying to use PodSecurityPolicy.** PSP was removed in Kubernetes 1.25. Use Pod Security Admission for the baseline and Kyverno/OPA for custom policy.
- **No admission control at all.** Without a gate, the cluster runs whatever it's told — including privileged, unsigned, attacker-controlled pods. Enforce policy at admission.
- **Running unsigned / unknown images.** Pulling public or untrusted images is the supply-chain risk at the cluster door. Sign images in CI and reject unsigned ones at admission.
- **Assuming Kubernetes Secrets are encrypted.** They're only base64-encoded by default. Enable encryption-at-rest (KMS-backed), restrict access via RBAC, or use an external secrets manager / workload identity.
- **Running with default flat pod networking.** Any-to-any pod connectivity makes lateral movement trivial. Apply network policies so a compromised pod can't reach everything.
- **Over-permissive RBAC.** Cluster-admin handed out broadly is the [over-permissioning problem](./iam-hardening) inside Kubernetes. Scope RBAC to least privilege, like any other IAM.
:::

## Page checkpoint

<Quiz id="kubernetes-security-page" title="Did Kubernetes security click?" sampleSize={3}>

<Question
  prompt="What is admission control, and why is it the heart of Kubernetes security?"
  options={[
    { text: "A login screen for cluster administrators" },
    { text: "The stage where every request to create or change a workload is inspected BEFORE it's accepted, so an admission controller can reject (or mutate) it — making it the chokepoint where 'what is and isn't allowed to run' is enforced (e.g., no privileged pods, only signed images)" },
    { text: "A tool that scales pods up and down automatically" },
    { text: "The component that stores container images" }
  ]}
  correct={1}
  explanation="Admission control is the gate every create/change request passes through before acceptance. An admission controller can deny or modify the request, so it's where cluster policy is actually enforced — the policy enforcement point specialized to 'what may run here.'"
  revisit={{ to: "/docs/cloud-identity/kubernetes-security#admission-control-the-gate-before-a-pod-runs", label: "Admission control" }}
/>

<Question
  prompt="Why can't you secure pods with PodSecurityPolicy anymore, and what replaced it?"
  options={[
    { text: "PSP still works; nothing replaced it" },
    { text: "PodSecurityPolicy was REMOVED in Kubernetes 1.25; the built-in replacement is Pod Security Admission (applying the Pod Security Standards: Privileged / Baseline / Restricted per namespace), with Kyverno or OPA Gatekeeper as programmable policy engines for custom rules" },
    { text: "PSP was renamed to 'AdminPolicy' but is otherwise identical" },
    { text: "PSP moved to the cloud provider's console" }
  ]}
  correct={1}
  explanation="PSP was clunky and removed in 1.25, so 'just use a PSP' is outdated guidance. Pod Security Admission is the built-in successor (three standard profiles, per namespace), and Kyverno/OPA Gatekeeper handle anything custom as policy-as-code admission controllers."
  revisit={{ to: "/docs/cloud-identity/kubernetes-security#admission-control-the-gate-before-a-pod-runs", label: "PSP removed, PSA replaces it" }}
/>

<Question
  prompt="Why enforce image signing/provenance at admission, and how does it stop an attack?"
  options={[
    { text: "Signing makes images smaller and faster to pull" },
    { text: "Signing proves an image is the exact artifact your pipeline built (origin + integrity); an admission policy rejects any image not signed by your trusted key, so an attacker who slips a malicious or tampered image in front of the cluster is stopped at the gate because it can't prove provenance" },
    { text: "Signing encrypts the running container's memory" },
    { text: "Signing automatically patches vulnerabilities in the image" }
  ]}
  correct={1}
  explanation="By default a cluster runs any image — including a backdoored or tampered one (the supply-chain risk at the cluster door). Signing images in CI and rejecting unsigned ones at admission means only provenance-verified artifacts run — zero trust applied to what you execute."
  revisit={{ to: "/docs/cloud-identity/kubernetes-security#image-provenance-only-run-what-you-can-prove-you-built", label: "Image provenance" }}
/>

<Question
  prompt="A Kubernetes Secret is often misunderstood. What's true about it, and what should you do?"
  options={[
    { text: "It's strongly encrypted by default; nothing more is needed" },
    { text: "By default a Kubernetes Secret is only base64-ENCODED (trivially reversible), not encrypted — so enable encryption-at-rest (ideally KMS-backed), restrict who can read Secrets via least-privilege RBAC, and prefer an external secrets manager or short-lived workload identity" },
    { text: "Secrets can't be read by anyone, ever" },
    { text: "Secrets are stored only in the developer's laptop" }
  ]}
  correct={1}
  explanation="Base64 is encoding, not encryption — anyone who can read the Secret object or its backing store can read the value. Treat cluster secrets like secrets at scale: encrypt at rest (KMS), restrict via RBAC, use an external manager, or eliminate the stored secret with workload identity."
  revisit={{ to: "/docs/cloud-identity/kubernetes-security#secrets-and-network-policies-dont-trust-the-inside", label: "Kubernetes secrets" }}
/>

<Question
  prompt="Why apply network policies in a Kubernetes cluster?"
  options={[
    { text: "To make pods start up faster" },
    { text: "By default every pod can reach every other pod — flat internal trust that makes lateral movement trivial; a network policy restricts which pods may talk to which (frontend → api, but a compromised sidecar can't reach the database), applying segmentation and zero-trust 'don't trust internal' at the pod-network level" },
    { text: "To encrypt the cluster's etcd database" },
    { text: "Because Kubernetes blocks all pod traffic until you allow it" }
  ]}
  correct={1}
  explanation="Default any-to-any pod connectivity lets one compromised pod probe and reach everything — the flat-trust lateral-movement problem inside the cluster. Network policies segment pod-to-pod traffic, the zero-trust 'no implicit internal trust' principle enforced at the network level, complementing mTLS/workload identity."
  revisit={{ to: "/docs/cloud-identity/kubernetes-security#secrets-and-network-policies-dont-trust-the-inside", label: "Network policies" }}
/>

</Quiz>

## What's next

→ Continue to [Zero-Trust Architecture](./zero-trust-architecture) — implementing "verify every request" in practice, with identity and device at the center of every access decision (and the [mTLS/workload identity](./zero-trust-architecture) that complements the network policies you just met).

→ **Going deeper:** the runtime detection that catches an attacker who *does* get a pod running is [eBPF runtime security](./cloud-runtime-security); the supply-chain integrity behind signed images is [supply chain](/docs/secure-sdlc/supply-chain); the secrets discipline is [KMS & secrets at scale](./kms-secrets-at-scale); the segmentation principle is [network segmentation](/docs/network-security/segmentation).
