---
id: cspm
title: Cloud Security Posture Management
sidebar_position: 3
sidebar_label: CSPM
description: Continuously finding misconfigurations across a sprawling cloud estate — what CSPM does, why the shared responsibility model makes config your job, and prioritizing the findings that actually matter.
---

# Cloud Security Posture Management

> **In one line:** A cloud estate has thousands of resources and settings that drift constantly, and a *single* misconfiguration (a public bucket, an open security group) can be a breach — so **CSPM (Cloud Security Posture Management)** continuously scans your cloud against best-practice and policy to catch those misconfigurations *before attackers do*, automating what no human could track by hand.

:::tip[In plain English]
The cloud makes it trivially easy to create resources — and just as easy to create them *insecurely*. One checkbox makes a storage bucket public; one rule opens a database to the whole internet; one default leaves data unencrypted. Now multiply that across thousands of resources, dozens of accounts, and constant changes by many teams, and you have a problem no human can watch: *somewhere in all of that, something is misconfigured right now, and you don't know where.* **CSPM** is the answer — a tool that continuously inventories your entire cloud and checks every resource against security best practices and your policies, flagging "this bucket is public," "this role is over-permissive," "this database isn't encrypted." It's the [IaC scanning](/docs/secure-sdlc/secrets-iac-container-scanning) idea extended from your code to your *live, running* cloud — catching not just what you deployed insecurely, but what *drifted* into an insecure state afterward. Given that cloud misconfiguration is one of the top breach causes, CSPM is among the highest-value tools a cloud security program runs.
:::

## Why misconfiguration is the cloud's defining risk

The cloud's power — instant, self-service resource creation via APIs — is also its danger: it lets anyone create *insecure* infrastructure just as fast as secure infrastructure, at massive scale. The result is that **misconfiguration**, not exotic exploitation, is one of the most common roots of cloud breaches:

- **Public storage buckets** exposing customer data — behind a long list of real breaches.
- **Over-permissive security groups / firewall rules** opening databases or admin ports to the internet.
- **Unencrypted storage and databases**, **disabled logging**, **public snapshots**, and **[over-permissive IAM](./iam-hardening)**.

The problem isn't that these are hard to fix — each is usually a one-setting change. The problem is *finding* them across a sprawling, constantly-changing estate. A resource secure today can be made public tomorrow by a hurried deploy; a human can't audit thousands of resources continuously. That gap is exactly what CSPM fills.

:::note[Terms, defined once]
- **CSPM (Cloud Security Posture Management)** — tooling that continuously assesses cloud configurations against security best practices and policies, flagging misconfigurations.
- **Misconfiguration** — an insecure setting (public access, open ports, no encryption, excess permissions) — the leading cloud breach cause.
- **Configuration drift** — resources changing away from their secure baseline over time as teams make changes.
- **Shared responsibility model** — the division of security duties between the cloud provider (security *of* the cloud) and the customer (security *in* the cloud — your configs, data, identities).
- **Posture** — the overall security state of your cloud environment at a point in time.
- **CNAPP** — Cloud-Native Application Protection Platform: a broader suite bundling CSPM with workload, identity, and other cloud-security capabilities (the converging modern category).
- **Guardrail** — a preventive policy that *blocks* insecure configurations from being created in the first place (vs. detecting them after).
:::

## The shared responsibility model: config is your job

A foundational cloud concept that explains *why CSPM is the customer's responsibility*. Cloud security is **shared** between provider and customer, split along a clear line:

- **The provider secures the cloud *itself*** — the physical data centers, the hardware, the hypervisor, the managed-service infrastructure. ("Security *of* the cloud.")
- **You secure what you put *in* the cloud** — your configurations, your data, your [identities and permissions](./iam-hardening), your access controls. ("Security *in* the cloud.")

The crucial implication: **the provider will not save you from a misconfiguration *you* made.** If you set a bucket to public, that's squarely on your side of the line — the provider faithfully does exactly what you configured, including exposing your data. Most cloud breaches happen on the *customer's* side of this line — configuration and identity mistakes — which is precisely the side CSPM monitors. Understanding the model tells you *where your responsibility (and your risk) lives*: in the configurations CSPM watches.

## How CSPM works (and how to not drown in it)

CSPM continuously **inventories** every resource across your cloud accounts and **evaluates** each against a library of checks (best-practice benchmarks like CIS, plus your own policies), producing findings: "S3 bucket X is publicly readable," "security group Y allows 0.0.0.0/0 on port 3306," "role Z has unused admin permissions."

But — exactly like the [SIEM and detection lessons](/docs/detection/detection-engineering) — the trap is *volume*. A real cloud estate generates *thousands* of findings, and an undifferentiated wall of them is as useless as no findings: teams tune out, and the one critical hides in the noise. So the skill is *prioritization*:

:::note[Worked example: which of 2,000 findings actually matters]
CSPM reports 2,000 findings across your environment. Triaged naïvely, they're overwhelming. Triaged by *real risk* ([likelihood × impact](/docs/foundations/threat-vuln-risk)):

- **"S3 bucket holding customer PII is publicly readable"** → internet-exposed + sensitive data = **critical, fix now.**
- **"Security group allows the internet to reach a production database port"** → directly exploitable exposure = **critical.**
- **"A dev sandbox resource lacks a low-priority tag"** → no security impact = **noise, ignore/auto-suppress.**
- **"Internal-only resource missing an encryption setting, not reachable externally, no sensitive data"** → low risk = **backlog.**

The 2,000 collapse to a handful of *exposure + sensitivity* combinations that are genuine emergencies. The pattern is identical to [detection tuning](/docs/detection/detection-engineering): a tool that fires constantly is only useful if its output is *prioritized by risk* so humans act on what matters. CSPM's value isn't the finding count — it's surfacing the *internet-facing, sensitive, exploitable* misconfigurations fast.
:::

The mature posture goes a step further to **prevention**: rather than only *detecting* misconfigurations after they exist, use **guardrails** ([policy-as-code](/docs/secure-sdlc/secrets-iac-container-scanning), service control policies, preventive controls) that *block* insecure configurations from being created at all — [shifting left](/docs/secure-sdlc/shift-left) from "find the public bucket" to "make public buckets impossible to create." CSPM detects; guardrails prevent; you want both.

## Why it matters

- **It addresses the top cloud breach cause.** Misconfiguration leads cloud incident reports. A tool that continuously finds public buckets, open ports, and over-permissive roles directly targets where the breaches are.
- **It's the only feasible way to watch scale.** No human can audit thousands of constantly-changing resources. Continuous automated assessment is the only approach that keeps up with drift.
- **It clarifies your responsibility.** The [shared responsibility model](#the-shared-responsibility-model-config-is-your-job) puts configuration squarely on you; CSPM is how you actually meet that responsibility across the estate.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Assuming the provider secures your configs.** The shared responsibility model puts configuration and identity on *you*. The provider won't stop you from making a bucket public.
- **Drowning in unprioritized findings.** Thousands of raw findings get tuned out. Prioritize by real risk (internet exposure + data sensitivity + exploitability); auto-suppress the noise.
- **Treating CSPM as a one-time scan.** Cloud drifts constantly; a secure resource can go public tomorrow. CSPM must run *continuously*, not as a periodic audit.
- **Detecting but never preventing.** Only finding misconfigurations after they exist is reactive. Add guardrails/policy-as-code to block insecure configs from being created (shift left).
- **Ignoring identity findings.** Over-permissive IAM is a misconfiguration too, and a high-impact one. CSPM should cover identity, not just storage/network settings.
- **No ownership or remediation path.** Findings nobody owns don't get fixed. Route prioritized findings to accountable teams like any other work.
:::

## Page checkpoint

<Quiz id="cspm-page" title="Did CSPM click?" sampleSize={3}>

<Question
  prompt="What does CSPM do, and why is it necessary?"
  options={[
    { text: "It writes your application code" },
    { text: "It continuously inventories your cloud and checks every resource against security best practices/policies, flagging misconfigurations (public buckets, open ports, over-permissive roles) that no human could track across thousands of constantly-changing resources" },
    { text: "It blocks all inbound network traffic" },
    { text: "It encrypts the cloud provider's data centers" }
  ]}
  correct={1}
  explanation="CSPM automates continuous assessment of cloud configurations against best practices, catching misconfigurations across a sprawling, drifting estate. It's IaC scanning extended to your live cloud — finding both what you deployed insecurely and what drifted into insecurity."
  revisit={{ to: "/docs/cloud-identity/cspm#how-cspm-works-and-how-to-not-drown-in-it", label: "How CSPM works" }}
/>

<Question
  prompt="Under the shared responsibility model, who is responsible if you set a storage bucket to public and data leaks?"
  options={[
    { text: "The cloud provider, always" },
    { text: "You — the provider secures the cloud itself (hardware, hypervisor), but you secure what you put IN it (configurations, data, identities); the provider faithfully does what you configured, including exposing data" },
    { text: "No one is responsible" },
    { text: "The internet service provider" }
  ]}
  correct={1}
  explanation="Security is shared: provider secures 'of the cloud,' customer secures 'in the cloud.' A misconfiguration you made (public bucket) is on your side of the line — the provider won't save you from it. Most cloud breaches happen on the customer side, which is what CSPM watches."
  revisit={{ to: "/docs/cloud-identity/cspm#the-shared-responsibility-model-config-is-your-job", label: "Shared responsibility" }}
/>

<Question
  prompt="Why is misconfiguration (not exotic exploitation) one of the top cloud breach causes?"
  options={[
    { text: "Misconfigurations are extremely hard to fix" },
    { text: "Self-service cloud APIs make creating INSECURE infrastructure as fast and easy as secure infrastructure, at massive scale; each fix is one setting, but FINDING them across a huge, constantly-changing estate is the hard part" },
    { text: "Clouds have no security features" },
    { text: "Attackers can't exploit anything else" }
  ]}
  correct={1}
  explanation="The cloud's instant self-service creation lets anyone deploy insecurely at scale. The settings are easy to fix individually; the challenge is detecting them across thousands of drifting resources — exactly the gap CSPM fills."
  revisit={{ to: "/docs/cloud-identity/cspm#why-misconfiguration-is-the-clouds-defining-risk", label: "Why misconfiguration" }}
/>

<Question
  prompt="CSPM reports 2,000 findings. How should you handle them?"
  options={[
    { text: "Fix all 2,000 in order, top to bottom" },
    { text: "Prioritize by real risk (likelihood × impact) — internet-facing + sensitive-data + exploitable findings (public PII bucket, DB port open to the internet) are critical now; no-impact items are noise to suppress — exactly like detection tuning" },
    { text: "Ignore all of them" },
    { text: "Treat every finding as equally critical" }
  ]}
  correct={1}
  explanation="Unprioritized findings get tuned out, just like noisy detections. Triage by exposure and data sensitivity: a handful of internet-facing, sensitive, exploitable misconfigurations are the emergencies; low-impact items are backlog or noise. CSPM's value is surfacing those fast."
  revisit={{ to: "/docs/cloud-identity/cspm#how-cspm-works-and-how-to-not-drown-in-it", label: "Prioritize findings" }}
/>

<Question
  prompt="What's the difference between CSPM detection and 'guardrails,' and why want both?"
  options={[
    { text: "They're the same thing" },
    { text: "CSPM detects misconfigurations after they exist (reactive); guardrails (policy-as-code, preventive controls) block insecure configs from being created at all (shift-left prevention) — detection catches drift, prevention stops mistakes before they happen" },
    { text: "Guardrails only encrypt data" },
    { text: "CSPM prevents and guardrails detect" }
  ]}
  correct={1}
  explanation="CSPM finds insecure configurations that already exist; guardrails prevent them from being created in the first place (e.g., 'public buckets cannot be created'). Prevention shifts left and stops the mistake; detection catches what drifts through. Mature programs use both."
  revisit={{ to: "/docs/cloud-identity/cspm#how-cspm-works-and-how-to-not-drown-in-it", label: "Detection vs guardrails" }}
/>

</Quiz>

## What's next

→ Continue to [Zero-Trust Architecture](./zero-trust-architecture) — implementing "verify every request" in practice, with identity and device at the center of every access decision.

→ **Going deeper:** the over-permissive IAM CSPM flags is [the last lesson](./iam-hardening); the IaC-scanning sibling that prevents misconfigs pre-deploy is [Secure SDLC](/docs/secure-sdlc/secrets-iac-container-scanning); prioritization mirrors [detection engineering](/docs/detection/detection-engineering).
