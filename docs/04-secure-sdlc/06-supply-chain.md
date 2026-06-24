---
id: supply-chain
title: Supply-Chain Security
sidebar_position: 7
sidebar_label: Supply-chain security
description: Trusting everything that goes into your software — dependencies, build systems, and artifacts. Why supply-chain attacks are so effective, and the modern defenses (SBOM, signing/provenance, SLSA).
---

# Supply-Chain Security

> **In one line:** Your software is built from thousands of things you didn't write — open-source packages, their dependencies, build tools, base images, CI systems — and an attacker who compromises *any* of them can reach *everyone* who ships that software, so supply-chain security is about **knowing and verifying every input**: inventory it (SBOM), prove where it came from (provenance/signing), and harden how it's built (SLSA).

:::tip[In plain English]
When you build software, you don't write most of it. You `npm install` or `pip install` and pull in hundreds of open-source packages — which pull in *their* dependencies, hundreds more — plus a base container image, build tools, and a CI/CD system that assembles it all. Every one of those is something you're *trusting*. A **supply-chain attack** targets that trust: instead of attacking you directly, the attacker poisons something *upstream* — a popular library, a build server — and waits for it to flow downstream into thousands of victims automatically. It's devastatingly efficient: compromise one widely-used package and you've compromised everyone who depends on it. Recent years made this the defining security problem of the era (SolarWinds, Log4Shell, malicious `npm`/`PyPI` packages). The defenses all come down to one idea you already know from [trust boundaries](/docs/foundations/trust-boundaries): *stop blindly trusting your inputs — inventory them, verify them, and harden how they're combined.*
:::

## Why supply-chain attacks are so effective

A direct attack compromises one target. A supply-chain attack compromises **one upstream component and inherits all its downstream victims** — a force multiplier no direct attack can match. Three properties make them brutal:

- **Transitive trust.** You audit your direct dependencies (maybe). But each pulls in others; a typical app has *thousands* of transitive dependencies, almost none of which you've ever looked at. You implicitly trust them all with [your application's privileges](/docs/foundations/trust-boundaries).
- **Implicit, automatic distribution.** When a poisoned package publishes a new version, the malware flows into every project that auto-updates — no action needed by the victim. The attack *spreads itself*.
- **Trusted delivery.** The malicious code arrives through your normal, trusted build process, so it sails past defenses that watch for *external* attackers. It's already inside.

:::note[Terms, defined once]
- **Software supply chain** — everything that goes into building and delivering your software: source, dependencies (direct and transitive), build tools, CI/CD, base images, and the registries you pull from.
- **Transitive dependency** — a dependency of a dependency. Most of your code's dependencies are transitive and unreviewed.
- **SBOM (Software Bill of Materials)** — a complete, machine-readable inventory of every component in your software (like an ingredients label). Standardized formats: SPDX, CycloneDX.
- **Provenance** — verifiable metadata about *where an artifact came from and how it was built* (which source, which build system, which steps).
- **Artifact signing** — cryptographically [signing](/docs/cryptography/asymmetric-encryption) a build output so consumers can verify it's authentic and unmodified.
- **SLSA** ("salsa," Supply-chain Levels for Software Artifacts) — a framework of graded levels for build-pipeline integrity.
- **Dependency confusion / typosquatting** — tricking your build into pulling a malicious package by name (an internal name claimed publicly, or `reqeusts` instead of `requests`).
:::

## The shapes of supply-chain attacks

| Attack | How it works | Real-world echo |
|--------|--------------|-----------------|
| **Compromised popular package** | Attacker gains publish rights (stolen maintainer creds, social engineering) and ships malware in an update | Several `npm`/`PyPI` package takeovers |
| **Malicious maintainer (long-game trust)** | An attacker spends months earning maintainer trust, becomes a co-maintainer, then commits an obfuscated, build-time backdoor — the *source review can't catch it* because the payload hides in build artifacts/test data | XZ Utils backdoor |
| **Typosquatting** | Publish `expresss`/`reqeusts` hoping for a typo'd install | Ongoing on every package registry |
| **Dependency confusion** | Publish a public package with the same name as a company's *internal* one; the build grabs the higher-versioned public (malicious) one | Widely demonstrated against major companies |
| **Build-system compromise** | Attacker breaches the CI/CD or build server and injects malware into the artifact *during the build* — the source looks clean | SolarWinds |
| **Known-vulnerable dependency** | Not an injected attack, but a public CVE in a dependency exploited at scale | Log4Shell |

Notice the build-system case (SolarWinds-style) is especially insidious: the *source code is clean*, so source review and SAST see nothing — the malware is inserted *during compilation*. Defending it requires securing the *build process itself*, which is exactly what SLSA addresses.

:::note[Named case: the XZ Utils backdoor (a maintainer-trust attack source review can't catch)]
The most chilling demonstration of the **malicious-maintainer** shape was the **XZ Utils backdoor** (tracked as CVE-2024-3094, disclosed in 2024). XZ Utils is a tiny, ubiquitous compression library that almost every Linux system pulls in. Over roughly *two years*, an attacker operating under a persona ("Jia Tan") patiently built a reputation, became a co-maintainer of the project, and then slipped in a backdoor — one that, on affected distributions, hooked into `sshd` and could have given remote access to a staggering fraction of the internet's servers.

Why it's the canonical example for this lesson:
- **Source review wouldn't catch it.** The malicious payload wasn't readable malicious source — it was an obfuscated blob hidden in *test data* and stitched into the artifact by the *build scripts*. Someone reading the committed code would see nothing wrong.
- **The trust was the vector.** The attacker didn't break in; they were *granted* commit rights through patient social engineering. The defense isn't a scanner — it's recognizing that *who you trust to write your dependencies* is itself attack surface.
- **It was caught by luck, not by a control.** A single engineer investigated a ~half-second SSH login slowdown and unraveled it before it shipped widely. The sobering lesson: prevention here is hard, so **reducing dependency count, preferring well-staffed projects, and assume-breach detection** all matter — you cannot review your way to safety against a trusted insider.

Treat the *story* as a durable illustration of maintainer-trust risk; the CVE number and dates are [dated specifics](/docs/foundations/threat-vuln-risk).
:::

## The modern defenses

Supply-chain security is young and evolving, but three pillars have emerged — each answering a different question:

**1. Know what you ship — SBOM.** You can't secure what you can't see. An **SBOM** is a complete inventory of every component (direct and transitive) in your software. Its payoff is *response speed*: when the next Log4Shell drops, the question "are we affected, and where?" goes from a frantic week of grep to a database query against your SBOMs. Generate one automatically per build and store it.

**2. Verify where it came from — signing & provenance.** Don't trust an artifact because it has the right *name* — trust it because it's *cryptographically verified*. **Artifact signing** lets consumers confirm a package/image is authentic and unmodified (using the [signatures](/docs/cryptography/asymmetric-encryption) from Chapter 2). **Provenance** attaches verifiable metadata about how and from what source it was built. **Sigstore** (cosign) has made signing and verifying artifacts practical and keyless, and is becoming the default for container images and packages.

**3. Harden how it's built — SLSA.** **SLSA** is a graded framework (levels) for build integrity: a higher SLSA level means stronger guarantees that the build was tamper-resistant, produced from the claimed source, and generated signed provenance. It directly targets the SolarWinds-style build-injection attack by making the *pipeline* itself verifiable — scripted builds, isolated build environments, and provenance you can check.

:::note[Worked example: how the pillars would have blunted a build-injection attack]
An attacker compromises your CI and injects malware during the build (source stays clean). With the modern pillars in place:

- **SLSA-hardened build** — an isolated, scripted build environment with provenance generation makes silent injection far harder, and any tampering shows up as a provenance mismatch.
- **Signing + provenance** — the published artifact is signed and carries provenance ("built from commit `abc` by pipeline `X`"). Consumers *verify* it before deploy; a swapped/tampered artifact fails verification.
- **SBOM** — when investigators later identify the malicious component, every downstream org queries their SBOMs to instantly answer "did we ship this?" — collapsing the response from weeks to minutes.

None is a silver bullet, but together they move you from *blind trust* in your build to *verified trust* — the supply-chain version of [never trust, always verify](/docs/foundations/trust-boundaries).
:::

## Practical hygiene (what to actually do)

Beyond the frameworks, the day-to-day basics prevent most incidents:

- **Pin and lock dependencies** (lockfiles, pinned versions/hashes) so builds are reproducible and a surprise malicious update can't silently flow in.
- **Use [SCA](./sast-dast-sca)** to catch known-vulnerable dependencies continuously, including transitive ones.
- **Vet new dependencies** before adopting — popularity, maintenance, maintainer count; fewer dependencies is fewer risks.
- **Defend dependency confusion** — explicitly scope/namespace internal packages and configure registries so internal names can't be hijacked by public ones.
- **Protect maintainer & CI credentials** with MFA and [least privilege](/docs/foundations/defense-in-depth) — most package takeovers start with a stolen publish token.
- **Pin CI actions to a full commit SHA, not a mutable tag.** A reference like `uses: some/action@v4` points at a *tag the upstream controls* — if that tag is repointed to malicious code, it flows straight into your build. Pinning to a full commit hash (`uses: some/action@<40-char-sha>`) freezes exactly what runs. **Treat the CI runner as a credential-theft surface:** it holds your deploy keys and tokens, so a compromised action can dump them out of your build logs. (A 2025 compromise of the popular `tj-actions/changed-files` action — CVE-2025-30066 — did exactly this across tens of thousands of repos by repointing version tags; a dated illustration of why SHA-pinning matters.)
- **Generate SBOMs and sign artifacts** in your pipeline, and *verify* signatures/provenance before you deploy or pull.

:::info[Highlight: it's "trust your inputs" at industrial scale]
Every defense here is the [trust-boundary](/docs/foundations/trust-boundaries) principle applied to your build inputs: an SBOM is *knowing* what crosses the boundary, signing/provenance is *verifying* it, SLSA is *hardening the boundary itself*, and pinning is *not letting it change silently*. The shift the industry is making is from "I installed it, so I trust it" to "I verified it, so I trust it" — the same move from implicit to explicit trust you've seen in every chapter.
:::

## Why it matters

- **It's the defining attack class of the era.** SolarWinds, Log4Shell, and a steady stream of malicious packages proved that the cheapest way to reach many victims is upstream. Defenders had to respond, and these frameworks are that response.
- **Your real attack surface is enormous and mostly unwritten by you.** Thousands of transitive dependencies and a whole build pipeline are all attackable. Securing only your own code ignores the majority of the surface.
- **It's increasingly required, not optional.** SBOMs and provenance are moving into regulation and procurement requirements (governments now ask vendors for them) — covered further in [Compliance](/docs/compliance).

## Common pitfalls

:::caution[Where people commonly trip up]
- **Auditing only direct dependencies.** The risk is mostly in the thousands of *transitive* ones. Use SCA across the full tree and generate SBOMs.
- **Trusting by name, not verification.** A package with the right name can be typosquatted, confused, or hijacked. Verify signatures/provenance; pin with hashes.
- **Leaving builds unpinned.** Floating versions let a malicious update flow in automatically. Use lockfiles and pinned, hashed dependencies.
- **Ignoring the build system.** Source review and SAST miss build-time injection (SolarWinds-style). Harden the pipeline (SLSA), isolate builds, and verify provenance.
- **Weak maintainer/CI credential hygiene.** Most takeovers begin with a stolen publish token or CI secret. Enforce MFA and least privilege on these.
- **No SBOM when the next Log4Shell hits.** Without an inventory, "are we affected?" becomes a frantic manual hunt. Generate and store SBOMs now, before you need them.
- **Trusting a maintainer because the code looks clean.** A long-game malicious maintainer (XZ Utils) can hide a build-time backdoor source review won't see. Prefer well-staffed dependencies, minimize their number, and lean on detection — you can't review your way past a trusted insider.
- **Referencing CI actions by mutable tag.** `action@v4` lets upstream repoint the tag to malicious code that steals your CI secrets. Pin to a full commit SHA and treat the runner as a credential-theft surface.
:::

## Page checkpoint

<Quiz id="supply-chain-page" title="Did supply-chain security click?" sampleSize={3}>

<Question
  prompt="Why are supply-chain attacks so efficient compared to direct attacks?"
  options={[
    { text: "They require physical access to the target" },
    { text: "Compromising ONE upstream component (a popular package or a build system) automatically reaches ALL its downstream users via trusted, automatic distribution — a force multiplier a direct attack can't match" },
    { text: "They only work on small projects" },
    { text: "They need the victim to click a phishing link" }
  ]}
  correct={1}
  explanation="A direct attack hits one target; a supply-chain attack poisons something upstream and inherits all its downstream victims, spreading through normal trusted build/update processes. Transitive trust, automatic distribution, and trusted delivery make it brutally effective."
  revisit={{ to: "/docs/secure-sdlc/supply-chain#why-supply-chain-attacks-are-so-effective", label: "Why so effective" }}
/>

<Question
  prompt="What is an SBOM, and what's its main practical payoff?"
  options={[
    { text: "A firewall rule set; it blocks attackers" },
    { text: "A Software Bill of Materials — a complete inventory of every component (incl. transitive) in your software; its payoff is response speed: 'are we affected by this new CVE, and where?' becomes a query instead of a frantic manual hunt" },
    { text: "An encryption algorithm for artifacts" },
    { text: "A type of container base image" }
  ]}
  correct={1}
  explanation="An SBOM is an ingredients label for your software. When the next Log4Shell drops, you query your SBOMs to instantly know if and where you're affected — collapsing incident response from weeks to minutes. You can't secure what you can't see."
  revisit={{ to: "/docs/secure-sdlc/supply-chain#the-modern-defenses", label: "SBOM" }}
/>

<Question
  prompt="A SolarWinds-style attack injects malware DURING the build; the source code stays clean. Why do source review and SAST miss it, and what defends against it?"
  options={[
    { text: "They don't miss it; SAST catches everything" },
    { text: "The malicious code isn't in the source — it's inserted at build time — so code-based checks see nothing; defending it requires hardening the build pipeline itself (SLSA) and verifying signed provenance of artifacts" },
    { text: "Only antivirus can detect it" },
    { text: "Pinning dependencies fully prevents it" }
  ]}
  correct={1}
  explanation="When injection happens during compilation, the source is clean, so source review and SAST find nothing. The defense moves to the build process: SLSA-hardened, isolated, scripted builds with signed provenance that consumers verify, so tampering shows up as a mismatch."
  revisit={{ to: "/docs/secure-sdlc/supply-chain#the-shapes-of-supply-chain-attacks", label: "Build-system compromise" }}
/>

<Question
  prompt="What do artifact signing and provenance let a consumer do?"
  options={[
    { text: "Make the artifact download faster" },
    { text: "Cryptographically verify that an artifact is authentic, unmodified, and built from the claimed source/pipeline — so trust comes from verification, not just the artifact having the right name" },
    { text: "Encrypt the artifact so no one can read it" },
    { text: "Automatically fix vulnerabilities in it" }
  ]}
  correct={1}
  explanation="Signing proves authenticity and integrity (Chapter 2 signatures); provenance attests how and from what it was built. Consumers verify before deploying, so a tampered or swapped artifact fails verification. Sigstore/cosign made this practical and keyless."
  revisit={{ to: "/docs/secure-sdlc/supply-chain#the-modern-defenses", label: "Signing & provenance" }}
/>

<Question
  prompt="The XZ Utils backdoor was inserted by someone who spent ~2 years becoming a trusted co-maintainer, then hid an obfuscated build-time payload. Why is this hard to defend, and what's the durable lesson?"
  options={[
    { text: "It was a simple known CVE; just patch it" },
    { text: "Source review can't catch it (the payload hid in test data / build scripts, not readable source) and the trust itself was the vector — so the defense isn't a scanner but recognizing that WHO you trust to write dependencies is attack surface: minimize dependencies, prefer well-staffed projects, and rely on assume-breach detection" },
    { text: "Pinning versions fully prevents a malicious maintainer" },
    { text: "It only affected Windows build servers" }
  ]}
  correct={1}
  explanation="A trusted insider granted commit rights, hiding the payload in build artifacts/test data, defeats source review and SAST. You can't review your way past a trusted maintainer, so the leverage is reducing dependency count, favoring well-maintained projects, and detection — recognizing maintainer trust as attack surface."
  revisit={{ to: "/docs/secure-sdlc/supply-chain#the-shapes-of-supply-chain-attacks", label: "Malicious maintainer" }}
/>

<Question
  prompt="Why pin a CI action to a full commit SHA (`uses: some/action@<sha>`) instead of a tag (`@v4`)?"
  options={[
    { text: "SHAs make the build faster" },
    { text: "A tag is controlled by the upstream and can be repointed to malicious code that flows into your build and dumps your CI secrets from the logs; a full commit SHA freezes exactly what runs — and you should treat the CI runner as a credential-theft surface since it holds deploy keys and tokens" },
    { text: "Tags are encrypted but SHAs are not" },
    { text: "There's no security difference; it's just style" }
  ]}
  correct={1}
  explanation="A mutable tag lets the upstream (or an attacker who compromises it) silently change what your pipeline executes — exactly the tj-actions/changed-files compromise, which leaked secrets across many repos. Pinning to a full commit hash freezes the code, and treating the runner as a credential-theft surface limits the damage if something does slip in."
  revisit={{ to: "/docs/secure-sdlc/supply-chain#practical-hygiene-what-to-actually-do", label: "CI SHA-pinning" }}
/>

<Question
  prompt="Which practice best defends against 'dependency confusion'?"
  options={[
    { text: "Using longer variable names" },
    { text: "Explicitly scoping/namespacing internal packages and configuring registries so an internal package name can't be hijacked by a higher-versioned public package of the same name" },
    { text: "Running the app as root" },
    { text: "Disabling all dependencies" }
  ]}
  correct={1}
  explanation="Dependency confusion tricks the build into pulling a malicious PUBLIC package that shares the name of your INTERNAL one. Namespacing/scoping internal packages and pinning registry sources prevents the public impostor from being selected. Pinning and MFA on publish creds also help broadly."
  revisit={{ to: "/docs/secure-sdlc/supply-chain#practical-hygiene-what-to-actually-do", label: "Practical hygiene" }}
/>

</Quiz>

## What's next

→ Take the [Chapter 4 checkpoint](./secure-sdlc-checkpoint) to lock in the whole secure-SDLC toolkit, then continue to [Chapter 5: Penetration Testing & Red Teaming](/docs/offensive) — where we switch fully to the offensive side and put all this defending to the test.

→ **Going deeper:** the cryptographic signing underneath provenance is [Chapter 2](/docs/cryptography/asymmetric-encryption); SBOM/provenance as compliance requirements appear in [Compliance & Risk](/docs/compliance); the SolarWinds and Log4Shell stories are reconstructed in [Case Studies](/docs/case-studies).
