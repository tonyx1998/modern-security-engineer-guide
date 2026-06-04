---
id: secure-sdlc-overview
title: 4. Secure SDLC & DevSecOps — Overview
sidebar_position: 1
sidebar_label: Secure SDLC intro
description: Building security into how software is made — threat modeling methodology, secure design and review, SAST/DAST/SCA, secrets/IaC/container scanning, and supply-chain security.
---

# Part 4: Secure SDLC & DevSecOps

> **In one line:** The cheapest place to fix a vulnerability is before it ships, so this chapter moves security *left* into the development lifecycle — structured threat modeling, secure design and review, automated scanning in CI, and locking down the software supply chain.

:::tip[In plain English]
Finding bugs in production is expensive and stressful; preventing them by design is cheap and calm. "DevSecOps" / "secure SDLC" is the discipline of baking security into each stage — *think* about how a design could be attacked (threat modeling) before you build it, *scan* code and dependencies automatically as you ship (SAST/DAST/SCA), and *trust* what goes into your build (supply chain). This chapter turns security from a final gate into a continuous, automated habit.
:::

## What this chapter covers

- **Threat modeling methodology** — STRIDE, data-flow diagrams, attack trees, and a lightweight per-feature ritual.
- **Secure design & review** — security-first architecture choices and how to review code for vulnerabilities, not just style.
- **SAST / DAST / SCA** — static analysis, dynamic scanning, and software composition analysis, configured to fail the build on real issues.
- **Secrets, IaC, and container scanning** — catching leaked credentials, misconfigured infrastructure, and vulnerable images before deploy.
- **Supply-chain security** — SBOMs, SLSA, signing/provenance (sigstore), and dependency risk.

## The lessons in this chapter

1. **[Shift Left →](/docs/secure-sdlc/shift-left)** — the cost curve, what DevSecOps means, and how security maps onto each lifecycle stage.
2. **[Threat Modeling →](/docs/secure-sdlc/threat-modeling)** — the four questions, data-flow diagrams, STRIDE, attack trees, and a lightweight per-feature ritual.
3. **[Secure Design & Code Review →](/docs/secure-sdlc/secure-design-review)** — fail-safe defaults and other durable principles, plus reviewing for vulnerabilities and *missing* controls.
4. **[SAST / DAST / SCA →](/docs/secure-sdlc/sast-dast-sca)** — static, dynamic, and composition scanning, wired into CI for signal not noise.
5. **[Secrets, IaC & Container Scanning →](/docs/secure-sdlc/secrets-iac-container-scanning)** — catching leaked credentials, misconfigured infrastructure, and vulnerable images before deploy.
6. **[Supply-Chain Security →](/docs/secure-sdlc/supply-chain)** — SBOMs, signing/provenance, SLSA, and dependency hygiene.

Finish with the **[Chapter 4 checkpoint →](/docs/secure-sdlc/secure-sdlc-checkpoint)** to certify the toolkit before Chapter 5.

---

→ Start here: [Shift Left](/docs/secure-sdlc/shift-left).
