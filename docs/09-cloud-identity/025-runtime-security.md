---
id: cloud-runtime-security
title: Cloud-Native Runtime Security — eBPF & CNAPP
sidebar_position: 3.5
sidebar_label: Runtime security (eBPF/CNAPP)
description: Why behavioral, in-kernel runtime detection beats signatures against living-off-the-land attacks — eBPF runtime security (Falco, Cilium Tetragon) for detection and in-kernel enforcement, and CNAPP as the consolidation of cloud-security tools into one platform.
---

# Cloud-Native Runtime Security — eBPF & CNAPP

> **In one line:** [CSPM](./cspm) finds *misconfigurations before* an attack; this lesson is the other half — catching the attack *while it runs*, using **eBPF** to observe (and even block) suspicious behavior *inside the Linux kernel*, because modern intruders **"live off the land"** with normal admin tools that signatures don't flag — and **CNAPP** is the platform consolidating CSPM, this runtime protection, and identity into one place.

:::tip[In plain English]
[CSPM](./cspm) is *preventive*: it scans your cloud for insecure settings before anything bad happens. But assume something bad *does* happen — an attacker gets a foothold in a running container. How do you catch them *in the act*? The old answer was **signatures**: a database of "known-bad" file hashes and patterns, like an antivirus. The problem is that today's serious attackers don't bring obvious malware files. They **"live off the land"** — they use the *legitimate* tools already on the system (the shell, `curl`, built-in admin commands) to do their dirty work, so there's no known-bad file to match. Signatures see normal tools and shrug. The fix is to watch *behavior* instead: not "is this a known-bad file?" but "is a web server suddenly spawning a shell and reading `/etc/shadow`? That's *abnormal*, flag it." To watch behavior cheaply and unavoidably, modern tools use **eBPF** — a way to run tiny safe programs *inside the Linux kernel* that see every process, file open, and network connection as it happens. Two tools lead here: **Falco** (detect and alert) and **Cilium Tetragon** (detect *and* enforce — it can kill the bad process in-kernel before it finishes). Finally, **CNAPP** is the umbrella platform that bundles this runtime protection together with [CSPM](./cspm) and identity, because buying each piece separately stopped making sense.
:::

## Why signatures fail: living off the land

A **signature-based** detector matches activity against a list of *known-bad* indicators — a malware file's hash, a specific exploit string. It's fast and precise *when the threat is a known file*. Its fatal weakness: it only catches what's already on the list, and serious intruders make sure they're not.

The dominant evasion is **living off the land (LOTL)**: instead of dropping a recognizable malware binary, the attacker abuses the *legitimate* software already present — the shell, scripting interpreters, package managers, built-in OS administration tools, [cloud CLIs](./iam-hardening). Nothing they run is "known-bad," because every tool they use is a normal, trusted part of the system. A signature scanner sees `bash`, `curl`, and a standard admin command and finds nothing to flag — even as those exact tools are being chained into an intrusion. (State-grade intrusions documented in recent years leaned heavily on this technique precisely to slip past file-based detection.)

The answer is to detect on **behavior**, not identity-of-the-file: it doesn't matter that `bash` is legitimate; what matters is that *a web-server process just spawned a shell, which read a credentials file, then opened an outbound connection to an unknown host* — a **sequence** that's deeply abnormal for a web server, regardless of which "trusted" tools performed it. This is the [baseline-and-anomaly idea from detection engineering](/docs/detection/detection-engineering), brought down to the level of individual system calls.

:::note[Terms, defined once]
- **Runtime security** — detecting (and stopping) malicious activity in *running* workloads, as opposed to scanning configs or code beforehand.
- **Signature-based detection** — matching activity against a list of known-bad indicators (file hashes, exploit strings); blind to anything not already on the list.
- **Behavioral / anomaly detection** — flagging activity that deviates from normal behavior (a web server spawning a shell), regardless of whether a known-bad file is involved.
- **Living off the land (LOTL)** — attacking using the legitimate tools already on a system (shell, admin utilities, CLIs) so there's no malware file to match, defeating signatures.
- **eBPF (extended Berkeley Packet Filter)** — a Linux feature that safely runs small, sandboxed programs inside the kernel, observing syscalls, file, and network events with low overhead and no kernel modules.
- **Syscall (system call)** — a process's request to the kernel to do something (open a file, start a process, send on the network); the ground truth of what software is actually doing.
- **Falco** — an open-source (CNCF) eBPF runtime-security tool that *detects and alerts* on suspicious behavior via rules.
- **Tetragon** — Cilium's eBPF runtime-security tool that detects *and can enforce* in-kernel (e.g., kill a process or drop a connection before the syscall completes).
- **CNAPP (Cloud-Native Application Protection Platform)** — a consolidated platform bundling cloud-security tools (CSPM, workload/runtime protection, identity entitlements, Kubernetes posture) into one.
:::

## eBPF: watching from inside the kernel

To detect on behavior, you need to see *everything a workload actually does* — every process it starts, file it opens, connection it makes — reliably and cheaply. That ground truth lives in **system calls**, and the place to observe them without being evaded is the **Linux kernel** itself.

**eBPF** is the modern way to get there. It lets you load small, *verified-safe* programs into the running kernel that fire on kernel events (a process executing, a file opening, a packet flowing) and report what happened — **without writing a risky kernel module and without the overhead of shuttling every event up to userspace** for inspection. Because the observation happens *in the kernel, below the application*, a process can't simply hide its syscalls from it the way it might evade a userspace agent.

That vantage point is exactly what behavioral detection needs:

- It sees the **full chain** — this process spawned that one, which read this file, which then connected out — with the container and pod metadata attached, so an event isn't just "a shell ran" but "a shell ran *inside the payments pod*."
- It's **low-overhead enough to run in production**, so you're not forced to sample or to inspect only a copy of traffic.
- It's **hard to evade**, because it watches the syscall layer every process must use, not a log the attacker could tamper with.

## Falco vs. Tetragon: detect, and enforce

Two open-source eBPF tools dominate cloud-native runtime security, and the useful distinction between them is **detect** versus **enforce**:

- **Falco** (a graduated [CNCF](/docs/secure-sdlc/supply-chain) project) is the runtime *detection* engine. You write (or adopt) rules describing abnormal behavior — "a shell was spawned in a container," "a sensitive file was read by an unexpected process," "an outbound connection to a non-allowlisted host" — and Falco **alerts** when the kernel events match. It's the [detection-engineering](/docs/detection/detection-engineering) discipline applied to syscalls: codify what's abnormal, fire on it, [feed the alert to your SOC](/docs/detection/alerting-and-soc).
- **Tetragon** (from the Cilium project) goes a step further: because its logic runs *inside* eBPF in the kernel, it can not only detect but **enforce in-kernel** — kill the offending process or drop the connection *before the syscall completes*. Detection tells you the web server spawned a shell; enforcement *stops the shell from running at all*.

:::note[Worked example: catching a living-off-the-land intrusion]
An attacker exploits a vulnerability in a web service running in a container. They don't upload any malware — they **live off the land**: they use the container's own shell and built-in tools to read a mounted credentials file and then `curl` it out to a server they control.

**Signature antivirus:** sees `bash` and `curl` — both legitimate, both on no known-bad list. **Nothing fires.** The credentials walk out the door.

**eBPF behavioral detection (Falco):** the kernel reports the syscall chain — *the web-server process exec'd a shell* (abnormal for a web server) → *the shell read `/etc/shadow`-class secrets* → *an outbound connection opened to an unknown host*. Each step matches a "this shouldn't happen in this workload" rule. Falco **alerts** in real time; the SOC sees the intrusion as it unfolds, with the pod and process context attached.

**eBPF enforcement (Tetragon):** the *same* behavioral rule, but instead of only alerting, the in-kernel program **kills the spawned shell before it can read the file** — the intrusion is stopped at the first abnormal action, not merely recorded.

The decisive point: the attacker used only trusted tools, so the file-identity question ("is this known-bad?") was useless. The *behavioral* question ("is this sequence normal *for this workload*?") caught it — and eBPF is what made watching that sequence in production cheap and evasion-resistant.
:::

## CNAPP: the consolidation

For a decade, teams bought cloud-security capabilities as separate products with separate four-letter names: [CSPM](./cspm) for misconfigurations, **CWPP** (Cloud Workload Protection Platform) for the runtime protection this lesson covers, **CIEM** (Cloud Infrastructure Entitlement Management) for over-broad [identities and permissions](./iam-hardening), **KSPM** (Kubernetes Security Posture Management) for [cluster configuration](./kubernetes-security). The result was a pile of disconnected tools that each saw one slice and couldn't correlate across slices.

**CNAPP (Cloud-Native Application Protection Platform)** is the consolidation of those into a single platform. Its real value isn't bundling for its own sake — it's **correlation across the slices**: a CNAPP can connect *"this workload has a critical vulnerability"* (CWPP) **+** *"it's reachable from the internet"* (CSPM) **+** *"it runs with an over-permissive role"* (CIEM) **+** *"and right now it's behaving abnormally"* (runtime) into **one** prioritized "this is the path an attacker will actually take" — instead of four separate dashboards no human can join by hand. That correlated, attacker's-eye prioritization is the same [risk-based triage](/docs/foundations/threat-vuln-risk) [CSPM](./cspm) taught for findings, now spanning posture, workload, identity, and runtime together.

:::note[The dated specifics — verify current before relying on them]
As of this writing (mid-2026): **Falco** and **eBPF** itself are graduated **CNCF** projects; **Tetragon** is the Cilium project's eBPF runtime-security and enforcement component (Cilium is also CNCF-graduated). The **CNAPP** category was named by **Gartner** (around 2021) and now describes the convergence of **CSPM + CWPP + CIEM + KSPM** into one platform, with industry coverage reporting most enterprises consolidating cloud security toward a handful of vendors. The state-sponsored intrusions most cited for **living-off-the-land** tradecraft (e.g., the **Volt Typhoon** campaigns against critical infrastructure) are illustrations, not durable facts. Tool names, project statuses, vendor counts, and threat-actor labels **will change** — treat them as a snapshot, verify current, and rely on the durable parts: signatures miss living-off-the-land, behavioral in-kernel detection catches it, and CNAPP consolidates the cloud-security stack.
:::

## Why it matters

- **It catches what prevention misses.** [CSPM](./cspm) and [hardening](./iam-hardening) reduce the attack surface, but determined attackers still get in. Runtime detection is the layer that sees the intrusion *as it happens* — [defense in depth](/docs/foundations/defense-in-depth), with a layer that assumes prevention failed.
- **It's the only thing that catches living-off-the-land.** Modern intruders deliberately use trusted tools to defeat signatures. Behavioral, syscall-level detection is *the* answer to an attack with no malware file to match — and it's increasingly how real breaches are found.
- **eBPF made it practical.** Watching every syscall in production used to be too costly or too evadable. In-kernel eBPF made low-overhead, hard-to-evade runtime visibility realistic — which is why this approach became the cloud-native standard.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Relying on signatures alone in the cloud.** Living-off-the-land attacks use legitimate tools and match no known-bad list. Add behavioral, syscall-level detection.
- **Treating prevention (CSPM) as sufficient.** Posture management reduces the attack surface but won't catch an intruder already inside. Pair it with runtime detection — assume prevention can fail.
- **Detection with no response path.** A Falco alert nobody triages is noise. Route runtime alerts into [the SOC and IR workflow](/docs/detection/alerting-and-soc); where appropriate, use in-kernel enforcement (Tetragon) to block, not just alert.
- **Unbounded enforcement.** Killing processes in-kernel can take down legitimate workloads if rules are too broad. Tune behavioral rules to the workload's real baseline before enforcing, exactly like [detection tuning](/docs/detection/detection-engineering).
- **Buying disconnected point tools.** Separate CSPM, CWPP, CIEM, and KSPM dashboards can't correlate an attack path. A CNAPP's value is joining posture + workload + identity + runtime into one prioritized view.
- **Forgetting the kernel vantage point matters.** A userspace-only agent can be evaded or starved of context. eBPF observes at the syscall layer every process must use — that's why it's hard to evade.
:::

## Page checkpoint

<Quiz id="cloud-runtime-security-page" title="Did runtime security click?" sampleSize={3}>

<Question
  prompt="Why do signature-based detectors fail against 'living off the land' attacks?"
  options={[
    { text: "Signatures are too slow to keep up" },
    { text: "Living-off-the-land attackers use the LEGITIMATE tools already on the system (shell, curl, admin utilities) rather than dropping malware, so there's no known-bad file or string to match — signatures see only trusted tools and don't fire, even as those tools are chained into an intrusion" },
    { text: "Signatures only work on Windows" },
    { text: "Signatures require an internet connection" }
  ]}
  correct={1}
  explanation="Signatures match known-bad indicators. Living-off-the-land deliberately avoids malware by abusing trusted, built-in tools, so nothing matches the known-bad list. The fix is behavioral detection: flag the abnormal SEQUENCE (a web server spawning a shell that reads secrets and connects out), regardless of which legitimate tools performed it."
  revisit={{ to: "/docs/cloud-identity/cloud-runtime-security#why-signatures-fail-living-off-the-land", label: "Living off the land" }}
/>

<Question
  prompt="What does eBPF provide that makes it well-suited to runtime security?"
  options={[
    { text: "It encrypts all network traffic by default" },
    { text: "It runs small, verified-safe programs INSIDE the Linux kernel that observe syscalls, file, and network events with low overhead and no kernel module — giving the full process/file/network chain (with container context) from a vantage point processes can't easily hide their syscalls from" },
    { text: "It scans container images for known CVEs before deployment" },
    { text: "It stores logs in a database for compliance" }
  ]}
  correct={1}
  explanation="Behavioral detection needs the ground truth of what software actually does — its syscalls — observed cheaply and unevadably. eBPF runs safe in-kernel programs that see the full chain (this process spawned that, read this file, connected out) with pod/container metadata, in production, below the application where it's hard to evade."
  revisit={{ to: "/docs/cloud-identity/cloud-runtime-security#ebpf-watching-from-inside-the-kernel", label: "eBPF in the kernel" }}
/>

<Question
  prompt="What's the key difference between Falco and Cilium Tetragon?"
  options={[
    { text: "Falco is for Windows and Tetragon is for Linux" },
    { text: "Falco DETECTS and alerts on abnormal behavior via rules; Tetragon runs its logic inside eBPF in the kernel, so it can detect AND ENFORCE — killing the offending process or dropping the connection before the syscall completes, stopping the action rather than only recording it" },
    { text: "Falco is closed-source and Tetragon is free" },
    { text: "They are identical and interchangeable" }
  ]}
  correct={1}
  explanation="Both are eBPF runtime-security tools, but Falco is a detection/alerting engine (codify abnormal behavior, fire an alert), while Tetragon's in-kernel logic lets it enforce — terminating the bad process or connection in-kernel before it finishes. Detection tells you it happened; enforcement prevents it from completing."
  revisit={{ to: "/docs/cloud-identity/cloud-runtime-security#falco-vs-tetragon-detect-and-enforce", label: "Falco vs Tetragon" }}
/>

<Question
  prompt="What is CNAPP, and where does its real value come from?"
  options={[
    { text: "A faster antivirus signature database" },
    { text: "A Cloud-Native Application Protection Platform that consolidates CSPM, CWPP, CIEM, and KSPM into one platform — its value is CORRELATION across those slices (vulnerable + internet-reachable + over-permissive + behaving abnormally) into one prioritized attack path, instead of four disconnected dashboards no human can join" },
    { text: "A tool that only scans Kubernetes YAML files" },
    { text: "A replacement for IAM" }
  ]}
  correct={1}
  explanation="CNAPP bundles the formerly-separate cloud-security tools (posture, workload protection, identity entitlements, Kubernetes posture). The point isn't bundling for its own sake — it's correlating signals across slices into an attacker's-eye prioritization, the same risk-based triage CSPM taught, now spanning posture, workload, identity, and runtime together."
  revisit={{ to: "/docs/cloud-identity/cloud-runtime-security#cnapp-the-consolidation", label: "CNAPP consolidation" }}
/>

<Question
  prompt="Why is runtime detection necessary even if you have strong CSPM and hardened IAM?"
  options={[
    { text: "It isn't; prevention makes detection unnecessary" },
    { text: "Prevention (CSPM, hardening) reduces the attack surface but can't guarantee no one gets in; runtime detection is the defense-in-depth layer that assumes prevention failed and catches the intrusion AS it happens — especially living-off-the-land attacks that leave no malware to scan for" },
    { text: "Because CSPM cannot scan storage buckets" },
    { text: "Because IAM only protects human users" }
  ]}
  correct={1}
  explanation="Hardening and posture management shrink the attack surface, but determined attackers still get footholds. Runtime detection is the layer that catches the intrusion in progress — the defense-in-depth assumption that prevention can fail — and it's the only layer that sees a living-off-the-land attack with no malware file to match."
  revisit={{ to: "/docs/cloud-identity/cloud-runtime-security#why-it-matters", label: "Why runtime detection" }}
/>

</Quiz>

## What's next

→ Continue to [Kubernetes Security](./kubernetes-security) — the controls that keep the *platform* itself safe: admission control (Pod Security Admission, Kyverno/OPA), image provenance and signing, secrets handling, and network policies.

→ **Going deeper:** the preventive sibling is [CSPM](./cspm); the behavioral-baseline discipline is [detection engineering](/docs/detection/detection-engineering); alerts route into [the SOC](/docs/detection/alerting-and-soc); the layered "assume prevention failed" logic is [defense in depth](/docs/foundations/defense-in-depth).
