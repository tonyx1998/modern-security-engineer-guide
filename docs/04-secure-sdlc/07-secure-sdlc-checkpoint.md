---
id: secure-sdlc-checkpoint
title: Chapter 4 Checkpoint
sidebar_position: 8
sidebar_label: ✅ Chapter checkpoint
description: Prove the secure-SDLC toolkit stuck — a mixed quiz across shift-left, threat modeling, secure design & review, SAST/DAST/SCA, secrets/IaC/container scanning, and supply-chain security.
---

# Chapter 4 Checkpoint

> **The secure-SDLC toolkit, all together.** This mixed quiz pulls from every lesson. Passing means you can describe how security is built into each stage of making software — from a whiteboard threat model to a hardened, verified build pipeline.

:::tip[How this works]
The quiz samples from a larger bank each attempt. The chapter's through-line: **the cheapest fix is the earliest one**, so security shifts *left* into design, code, build, and supply — as a continuous, mostly-automated habit, with humans focused on the judgment work (threat modeling, review) that tools can't do. If a question stings, follow its revisit link.
:::

## What you should be able to do now

- **Explain shift-left and DevSecOps** — the cost curve, and security as continuous/automated/shared.
- **Run a [threat model](./threat-modeling)** — the four questions, a DFD with trust boundaries, STRIDE, and a lightweight per-feature ritual.
- **Make [secure design](./secure-design-review) choices** (fail closed, complete mediation, simplicity) and review code for vulnerabilities and *missing* controls.
- **Place [SAST, DAST, and SCA](./sast-dast-sca)** by what they examine, and wire them into CI for signal, not noise.
- **Scan the [artifact, not just the code](./secrets-iac-container-scanning)** — secrets, IaC misconfig, and container images.
- **Secure the [supply chain](./supply-chain)** — SBOM, signing/provenance, SLSA, and dependency hygiene.

## The checkpoint

<Quiz id="secure-sdlc-checkpoint" title="Chapter 4: Secure SDLC & DevSecOps" sampleSize={6} passingScore={0.67}>

<Question
  prompt="What is the core argument behind 'shift left'?"
  options={[
    { text: "Security engineers work better in the morning" },
    { text: "Fixing a vulnerability gets exponentially more expensive the later it's found, so catching issues earlier (design, code, CI) is dramatically cheaper than in production or after a breach" },
    { text: "Code should be left-aligned" },
    { text: "Earlier code is shorter" }
  ]}
  correct={1}
  explanation="The defect-cost curve: the same flaw costs far more the later it's caught. Shift-left moves detection earlier where fixes are cheap, instead of in production where they become a crisis."
  revisit={{ to: "/docs/secure-sdlc/shift-left#the-cost-curve-why-later-is-exponentially-worse", label: "The cost curve" }}
/>

<Question
  prompt="What does DevSecOps change about how security is done?"
  options={[
    { text: "It removes the need for testing" },
    { text: "Security becomes continuous, automated, and shared — checks run on every change and developers own security — instead of a manual review by a siloed team at the end" },
    { text: "It moves all security to after launch" },
    { text: "It replaces developers with auditors" }
  ]}
  correct={1}
  explanation="DevSecOps inserts security into the automated pipeline: continuous (every commit), automated (scanners for known classes), and shared (developers own it with tooling/champions) — not a late, manual gate."
  revisit={{ to: "/docs/secure-sdlc/shift-left#what-devsecops-actually-changes", label: "What DevSecOps changes" }}
/>

<Question
  prompt="What are the four questions at the heart of threat modeling?"
  options={[
    { text: "Who, what, when, where" },
    { text: "What are we building? What can go wrong? What are we going to do about it? Did we do a good job?" },
    { text: "Cost, schedule, scope, quality" },
    { text: "Encrypt, patch, log, back up" }
  ]}
  correct={1}
  explanation="Every method answers these four: model the system (DFD), enumerate threats (STRIDE), decide mitigations, and review. The frameworks are just tools to answer them."
  revisit={{ to: "/docs/secure-sdlc/threat-modeling#the-four-questions", label: "The four questions" }}
/>

<Question
  prompt="What does STRIDE provide?"
  options={[
    { text: "An encryption standard" },
    { text: "A six-category checklist (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) for systematically enumerating threats — essentially CIA plus authenticity and non-repudiation as attacker actions" },
    { text: "A list of approved tools" },
    { text: "A code formatter" }
  ]}
  correct={1}
  explanation="STRIDE makes 'what can go wrong?' systematic, prompting each threat type per element. Each maps to violating a security property you know — your foundations turned into attacker verbs."
  revisit={{ to: "/docs/secure-sdlc/threat-modeling#stride-a-checklist-for-what-can-go-wrong", label: "STRIDE" }}
/>

<Question
  prompt="An authorization service times out. The secure design choice is to:"
  options={[
    { text: "Fail open (allow the action)" },
    { text: "Fail closed (deny) — fail-safe defaults mean errors result in denial, so an attacker who knocks over the authz service can't gain access; an outage stays an outage, not a breach" },
    { text: "Cache the last answer forever" },
    { text: "Either is fine" }
  ]}
  correct={1}
  explanation="Fail-safe defaults: when a check errors, deny. Failing open lets an attacker turn a DoS into an authorization bypass. Choose the failure mode deliberately at design time."
  revisit={{ to: "/docs/secure-sdlc/secure-design-review#secure-design-principles-the-durable-ones", label: "Fail-safe defaults" }}
/>

<Question
  prompt="Why must security code review look for what's MISSING, not just what's wrong?"
  options={[
    { text: "Missing code compiles faster" },
    { text: "The hardest bugs are absent controls — an authorization check never added, validation never written — which no present line reveals; you must ask 'what should be here and isn't?'" },
    { text: "Style issues are the real risk" },
    { text: "Tools already find every missing control" }
  ]}
  correct={1}
  explanation="Top bugs like broken access control are usually a check that simply isn't there. Reviewing only present lines misses them — confirm authn, authz, validation, and encoding are present on every new endpoint."
  revisit={{ to: "/docs/secure-sdlc/secure-design-review#security-focused-code-review", label: "Review for what's missing" }}
/>

<Question
  prompt="Which scanner reads your SOURCE code, which ATTACKS your running app, and which checks your DEPENDENCIES?"
  options={[
    { text: "DAST reads source; SCA attacks the app; SAST checks deps" },
    { text: "SAST reads source; DAST attacks the running app from outside; SCA checks dependencies against known-vulnerability (CVE) databases" },
    { text: "They all do the same thing" },
    { text: "SCA reads source; SAST attacks the app; DAST checks deps" }
  ]}
  correct={1}
  explanation="By what they look at: SAST = your code (static), DAST = your running app (dynamic/black-box), SCA = your third-party components vs. CVEs. Complementary; run all three."
  revisit={{ to: "/docs/secure-sdlc/sast-dast-sca#the-three-scanners-by-what-they-examine", label: "The three scanners" }}
/>

<Question
  prompt="A SAST tool produces 1,000 findings per build and developers ignore them all. The lesson is:"
  options={[
    { text: "Add more scanners" },
    { text: "Signal-to-noise is the whole game — noise trains people to ignore the tool and hides the real critical; tune false positives, prioritize, route to normal tickets, and hard-gate only high-confidence findings" },
    { text: "Block every build on all findings" },
    { text: "Scanners are useless" }
  ]}
  correct={1}
  explanation="A scanner's value is actionable signal, not finding count. Untuned noise gets the tool disabled and buries real issues. Tune, prioritize, and gate only the few high-signal cases."
  revisit={{ to: "/docs/secure-sdlc/sast-dast-sca#wiring-it-into-ci-without-drowning-in-noise", label: "Signal is the game" }}
/>

<Question
  prompt="A developer commits a live AWS key, then deletes the line in the next commit. Is it safe?"
  options={[
    { text: "Yes — the line is gone" },
    { text: "No — it stays in Git history and remains valid until ROTATED; bots find committed keys within minutes, so rotate immediately (scrubbing history is secondary)" },
    { text: "Yes, if the repo is private" },
    { text: "Only after a force-push" }
  ]}
  correct={1}
  explanation="A deleted line persists in history and the credential stays live. Rotation is the real fix; private repos aren't safe (forks, clones, CI logs). Scanning detects; rotation remediates."
  revisit={{ to: "/docs/secure-sdlc/secrets-iac-container-scanning#secret-scanning-the-most-common-own-goal", label: "Committed secrets" }}
/>

<Question
  prompt="A Terraform file sets an S3 bucket to `public-read`. Which control catches this before deploy, and which OWASP category is it?"
  options={[
    { text: "DAST; A03 Injection" },
    { text: "IaC scanning; A05 Security Misconfiguration — it parses infrastructure definitions in the PR and flags insecure settings before the resource exists" },
    { text: "SAST; A01 Broken Access Control" },
    { text: "Nothing can catch it pre-deploy" }
  ]}
  correct={1}
  explanation="IaC scanning checks infrastructure-as-code against policy before resources are created, flagging public buckets and open security groups in the pull request — shift-left for the cloud, addressing Security Misconfiguration (A05)."
  revisit={{ to: "/docs/secure-sdlc/secrets-iac-container-scanning#iac-scanning-misconfiguration-as-code", label: "IaC scanning" }}
/>

<Question
  prompt="Why are supply-chain attacks so efficient?"
  options={[
    { text: "They require physical access" },
    { text: "Compromising one upstream component (a popular package or build system) automatically reaches all its downstream users through trusted, automatic distribution — a force multiplier" },
    { text: "They only affect small projects" },
    { text: "They need a phishing click from each victim" }
  ]}
  correct={1}
  explanation="A direct attack hits one target; poisoning something upstream inherits all downstream victims and spreads through normal trusted build/update flows. Transitive trust + automatic distribution + trusted delivery make them devastating."
  revisit={{ to: "/docs/secure-sdlc/supply-chain#why-supply-chain-attacks-are-so-effective", label: "Why so effective" }}
/>

<Question
  prompt="A SolarWinds-style attack injects malware during the BUILD; the source is clean. Why do SAST and source review miss it, and what defends against it?"
  options={[
    { text: "They don't miss it" },
    { text: "The malicious code isn't in the source (it's inserted at build time), so code checks see nothing; defense requires hardening the build pipeline (SLSA) and verifying signed provenance of artifacts" },
    { text: "Only antivirus detects it" },
    { text: "Pinning dependencies fully prevents it" }
  ]}
  correct={1}
  explanation="Build-time injection leaves the source clean, so source review and SAST find nothing. The defense moves to the pipeline: SLSA-hardened, isolated builds with signed provenance that consumers verify, so tampering shows up as a mismatch."
  revisit={{ to: "/docs/secure-sdlc/supply-chain#the-shapes-of-supply-chain-attacks", label: "Build-system compromise" }}
/>

<Question
  prompt="What is an SBOM and its main payoff?"
  options={[
    { text: "A firewall config that blocks attackers" },
    { text: "A Software Bill of Materials — a full inventory of every component (incl. transitive); its payoff is response speed: 'are we affected by this new CVE, and where?' becomes a query, not a manual hunt" },
    { text: "An encryption scheme for builds" },
    { text: "A base container image" }
  ]}
  correct={1}
  explanation="An SBOM is your software's ingredients label. When the next Log4Shell drops, you query your SBOMs to instantly know if/where you're affected, collapsing response from weeks to minutes."
  revisit={{ to: "/docs/secure-sdlc/supply-chain#the-modern-defenses", label: "SBOM" }}
/>

</Quiz>

## Chapter 4 complete

You now see security not as a final gate but as a property of *how software is made*: threat-model the design, choose secure architectures, review for the missing control, scan code/dependencies/secrets/infra/images automatically in CI, and verify everything that enters your build. That's a secure SDLC — the engine that turns [Chapter 3's](/docs/appsec) one-time bug knowledge into permanent, scalable prevention.

→ On to [Chapter 5: Penetration Testing & Red Teaming](/docs/offensive) — we cross fully to the offensive side and put all this defending to the test, learning the methodology attackers (and the security engineers who emulate them) actually follow.
