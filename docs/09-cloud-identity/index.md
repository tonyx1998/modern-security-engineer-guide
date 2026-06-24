---
id: cloud-identity-overview
title: 9. Cloud & Identity Security — Overview
sidebar_position: 1
sidebar_label: Cloud & identity intro
description: Securing the modern perimeter — IAM hardening, cloud security posture management, zero-trust architecture, SSO and identity federation, and KMS/secrets at scale.
---

# Part 9: Cloud & Identity Security

> **In one line:** In the cloud, **identity is the perimeter** — most breaches are an over-broad permission or a stolen credential, not a network intrusion — so this chapter is about hardening IAM, catching misconfigurations at scale (CSPM), governing identity (SSO/federation), and managing keys and secrets properly.

:::tip[In plain English]
There's no data-center wall in the cloud; what gates access is *identity and permissions*. The classic cloud breach is a public storage bucket or an IAM role that can do far more than it should. This chapter covers tightening permissions to least privilege, giving the *machines* that vastly outnumber human users a short-lived **workload identity** instead of static keys, using **CSPM** tools to continuously find misconfigurations across hundreds of resources, catching attacks *as they run* with **eBPF runtime security** and consolidating the cloud-security stack with **CNAPP**, securing the **Kubernetes** platform that runs cloud-native workloads, implementing **zero-trust architecture** (verify identity and device on every request), governing **SSO/federation** so the right people get the right access and lose it on exit, and managing **keys and secrets** at scale. It deepens the cloud-IAM basics from the companion guides into a security specialty.
:::

## What this chapter covers

- **IAM hardening** — least privilege, role assumption, eliminating long-lived keys.
- **Non-human identity & workload identity** — machine identities outnumber humans; short-lived, attested identity (SPIFFE/SPIRE, federation) over static secrets.
- **Cloud security posture management (CSPM)** — detecting misconfigurations across the estate.
- **Cloud-native runtime security** — eBPF behavioral detection (Falco/Tetragon) against living-off-the-land, and CNAPP consolidation.
- **Kubernetes security** — admission control, image provenance/signing, secrets, and network policies for the orchestrator itself.
- **Zero-trust architecture** — identity- and device-aware access on every request.
- **SSO & identity federation governance** — provisioning, deprovisioning, and access reviews.
- **KMS & secrets at scale** — envelope encryption, rotation, and auditable secret access.

## The lessons in this chapter

1. **[IAM Hardening →](/docs/cloud-identity/iam-hardening)** — identity is the perimeter; least privilege and temporary credentials over standing keys.
2. **[Non-Human Identities & Workload Identity →](/docs/cloud-identity/nhi-workload-identity)** — machines outnumber humans; short-lived, attested workload identity (SPIFFE/SPIRE, federation) over static, sprawling secrets.
3. **[Cloud Security Posture Management →](/docs/cloud-identity/cspm)** — finding misconfigurations across the estate; shared responsibility and prioritization.
4. **[Cloud-Native Runtime Security →](/docs/cloud-identity/cloud-runtime-security)** — eBPF behavioral detection (Falco/Tetragon) against living-off-the-land, and CNAPP as the consolidation of the cloud-security stack.
5. **[Kubernetes Security →](/docs/cloud-identity/kubernetes-security)** — admission control (PSA, Kyverno/OPA), image provenance/signing, secrets, and network policies.
6. **[Zero-Trust Architecture →](/docs/cloud-identity/zero-trust-architecture)** — the PDP/PEP model, signal-based decisions, and mTLS/workload identity for services.
7. **[SSO & Identity Federation →](/docs/cloud-identity/sso-federation)** — centralized identity, and the deprovisioning and access reviews everyone forgets.
8. **[KMS & Secrets at Scale →](/docs/cloud-identity/kms-secrets-at-scale)** — envelope encryption, dynamic secrets, and authorized, audited access.

Finish with the **[Chapter 9 checkpoint →](/docs/cloud-identity/cloud-identity-checkpoint)** to certify the toolkit before Chapter 10.

---

→ Start here: [IAM Hardening](/docs/cloud-identity/iam-hardening).
