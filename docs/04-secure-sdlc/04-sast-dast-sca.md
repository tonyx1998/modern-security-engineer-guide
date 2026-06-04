---
id: sast-dast-sca
title: "Automated Scanning: SAST, DAST & SCA"
sidebar_position: 5
sidebar_label: SAST / DAST / SCA
description: The three core automated security scanners — static analysis of your source, dynamic testing of your running app, and composition analysis of your dependencies — and how to wire them into CI without drowning in noise.
---

# Automated Scanning: SAST, DAST & SCA

> **In one line:** Three complementary scanner types automate security at scale — **SAST** reads your *source code* for vulnerable patterns, **DAST** attacks your *running app* from the outside, and **SCA** checks your *dependencies* for known vulnerabilities — and the art is wiring them into CI so they catch real issues without burying developers in false positives.

:::tip[In plain English]
You can't manually review every line of every change for security forever — so you teach machines to do the repetitive parts. There are three main kinds of automated security scanner, and the easiest way to remember them is *what each one looks at*. **SAST** reads your code like a very paranoid spell-checker, flagging dangerous patterns ("this query is built by string concatenation"). **DAST** ignores your code entirely and instead *pokes the running application* like an attacker would, throwing malicious inputs at it and watching what breaks. **SCA** looks at none of your code — it inventories the *third-party libraries* you pulled in and checks them against databases of known vulnerabilities. Each sees something the others can't, which is why mature teams run all three. The hard part isn't installing them; it's tuning them so the alerts mean something, because a scanner that cries wolf gets ignored — and an ignored scanner protects nothing.
:::

## The three scanners, by what they examine

| | **SAST** | **DAST** | **SCA** |
|---|----------|----------|---------|
| **Full name** | Static Application Security Testing | Dynamic Application Security Testing | Software Composition Analysis |
| **Looks at** | Your source code (at rest) | Your running app (from outside) | Your dependencies / third-party code |
| **Needs the app running?** | No | Yes | No |
| **Finds** | Injection, XSS, hardcoded secrets, unsafe APIs *in your code* | Real exploitable behavior: injection, auth flaws, misconfig *as seen by an attacker* | Known-vulnerable library versions (CVEs) |
| **Knows the code?** | Yes ("white box") | No ("black box") | Inventory only |
| **When in CI** | On every commit/PR (fast) | Pre-deploy / against staging (slower) | On every commit + continuously |
| **Classic weakness** | False positives; can't see runtime/logic | Can't pinpoint the code line; needs a deployed app | Only finds *known* vulns; can't judge if you actually use the vulnerable path |

:::note[Terms, defined once]
- **SAST** — analyzes source code without running it, matching patterns and tracing how untrusted data flows from a *source* (input) to a *sink* (dangerous call).
- **DAST** — tests the deployed, running application by sending crafted requests and observing responses — no source access needed.
- **SCA** — identifies open-source/third-party components and flags those with known vulnerabilities (CVEs) or risky licenses.
- **CVE (Common Vulnerabilities and Exposures)** — a public, uniquely-numbered record of a specific known vulnerability (e.g., `CVE-2021-44228`, Log4Shell). SCA matches your dependencies against the CVE databases.
- **False positive / false negative** — a finding that isn't really exploitable / a real bug the scanner missed. Tuning trades these off.
- **IAST** — Interactive AST: instruments the running app to combine SAST's code-awareness with DAST's runtime view (a hybrid you'll hear about).
- **Source → sink** — the data-flow SAST traces: from where untrusted data enters (source) to where it does something dangerous (sink).
:::

## How each one works (and what it misses)

**SAST — read the code.** It parses your source and looks for dangerous patterns and **tainted data flows**: untrusted input (`source`) reaching a dangerous operation (`sink`) without sanitization — exactly the [injection](/docs/appsec/injection)/[XSS](/docs/appsec/xss) shape from Chapter 3. Because it sees the code, it can point to the exact line. Its weaknesses: it doesn't run the app, so it can't see runtime configuration or business-logic flaws, and it's prone to **false positives** (flagging a "vulnerable" pattern that's actually safe in context). Run it early — it's fast and fits every PR.

**DAST — attack the running app.** It treats the app as a black box and fires real attack payloads at its endpoints, watching for tell-tale responses (an error revealing SQLi, a reflected script proving XSS, a missing auth check). Because it exercises the *actual running system*, its findings are real exploitable behavior — fewer false positives about exploitability. Its weaknesses: it needs a deployed app (so it runs later, against staging), it can't tell you *which line* to fix, and it only tests the paths it can reach.

**SCA — check your ingredients.** Modern apps are mostly other people's code — frameworks, libraries, transitive dependencies. SCA builds an inventory and matches it against **CVE** databases, flagging known-vulnerable versions so you can upgrade. This is the defense for OWASP's [Vulnerable & Outdated Components](/docs/appsec/owasp-top-10) (A06). Its weakness: it finds *known* vulns only (a brand-new one isn't in the database yet), and it often can't tell whether you actually *call* the vulnerable code path — leading to noise you must prioritize.

:::note[Worked example: three scanners on one SQL-injection-prone app]
Your app builds a query by concatenation and depends on an old database driver with a known CVE.

- **SAST** flags the source line: "untrusted `req.query.id` flows into a raw SQL string — possible injection at `db.js:42`." → You see *exactly where* to parameterize.
- **DAST** sends `1' OR '1'='1` to the live endpoint, gets back extra rows / a database error, and reports "SQL injection confirmed at `GET /api/items`." → You know it's *actually exploitable*, end to end.
- **SCA** reports "your `db-driver@2.1.0` has `CVE-2023-xxxx` (fixed in 2.1.4)." → You learn a *dependency* is vulnerable regardless of your own code.

Three tools, three different truths about the *same* app: the buggy *line* (SAST), the *exploitable behavior* (DAST), and the vulnerable *ingredient* (SCA). None alone gives the full picture — which is the whole argument for running all three.
:::

## Wiring it into CI without drowning in noise

Owning scanners isn't the goal; *acting on their output* is. The failure mode is a wall of low-confidence alerts that developers learn to ignore — at which point the scanners are theater. Make them effective:

- **Fast checks on every PR, slow checks before deploy.** SAST and SCA are fast enough to gate pull requests; DAST runs against staging pre-deploy. Match cadence to speed so you don't slow developers down.
- **Block only on high-confidence, high-severity findings.** Everything else is a *warning*, not a *gate*. ([Guardrails vs. gates](./shift-left).) A scanner that blocks builds on noise gets disabled.
- **Tune out false positives and triage.** Suppress known-safe patterns with documented justification; route real findings into the normal ticket flow with an owner.
- **Fail the build on new secrets and critical CVEs.** These are the high-signal cases worth a hard stop. (Secret scanning is its [own next lesson](./secrets-iac-container-scanning).)
- **Track the trend, not just the moment.** The goal is *findings going down over time* and *time-to-fix shrinking* — security as a managed metric, not a one-off scan.

:::info[Highlight: signal is the whole game]
A scanner's value is its **signal-to-noise ratio**, not its finding count. 1,000 findings nobody triages is worse than 10 that get fixed, because the 1,000 train developers to ignore the tool — and the one real critical hides in the noise. Prefer fewer, higher-confidence, well-prioritized findings wired into the normal workflow. This is the [DevSecOps friction lesson](./shift-left) made concrete: tooling that's noisy gets bypassed, and bypassed tooling protects nothing.
:::

## Why it matters

- **It's how security scales to every change.** Humans can't review everything; SAST/SCA on every PR and DAST before every deploy catch known classes automatically, continuously — the engine of [shift-left](./shift-left).
- **The three are genuinely complementary.** Each sees a layer the others can't (your code, your running behavior, your dependencies). Skipping one leaves a blind spot — and the [supply-chain](./supply-chain) lessons of recent years made SCA non-optional.
- **Tuning is the real skill.** Anyone can turn a scanner on. Making it produce *actionable* signal that developers trust and fix is what separates a working program from shelfware.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Running one and assuming you're covered.** SAST misses runtime/logic and dependency bugs; DAST misses the code line and unreached paths; SCA misses unknown and your-own-code bugs. You need all three for coverage.
- **Drowning developers in false positives.** Untuned scanners produce noise that gets ignored, hiding the real findings. Tune aggressively, suppress with justification, and block only on high confidence.
- **Treating findings as a one-time list.** Security debt accrues; the metric is *trend down* and *fast time-to-fix*, tracked over time, not a single scan you archive.
- **Gating on everything.** Blocking builds on low-severity noise gets the whole pipeline disabled. Gate on the few high-signal cases (new secrets, critical CVEs, confirmed exploitable DAST), warn on the rest.
- **Ignoring SCA exploitability.** Not every CVE in a dependency is reachable in your usage — but don't use that as an excuse to ignore all of them. Prioritize by reachability and severity; patch the criticals fast.
- **Forgetting SCA covers transitive deps.** The vulnerable library is often one your dependency depends on. SCA must (and good ones do) inventory the full tree.
:::

## Page checkpoint

<Quiz id="sast-dast-sca-page" title="Did SAST/DAST/SCA click?" sampleSize={3}>

<Question
  prompt="What does each scanner type primarily examine?"
  options={[
    { text: "SAST runs the app; DAST reads code; SCA tests passwords" },
    { text: "SAST reads your source code; DAST attacks your running app from outside; SCA inventories your dependencies and matches them against known-vulnerability (CVE) databases" },
    { text: "All three read source code in the same way" },
    { text: "SAST and DAST both require source access; SCA tests the network" }
  ]}
  correct={1}
  explanation="Remember them by what they look at: SAST = your code (static), DAST = your running app (dynamic, black-box), SCA = your third-party components vs. CVEs. Each sees a different layer, which is why they're complementary."
  revisit={{ to: "/docs/secure-sdlc/sast-dast-sca#the-three-scanners-by-what-they-examine", label: "The three scanners" }}
/>

<Question
  prompt="An app is vulnerable to SQL injection. Which tool can confirm it's ACTUALLY exploitable end-to-end on the live system, and which can point to the exact buggy line?"
  options={[
    { text: "SCA confirms exploitability; DAST points to the line" },
    { text: "DAST confirms exploitability (it attacks the running app and observes the result); SAST points to the exact source line (it reads the code)" },
    { text: "SAST does both" },
    { text: "Neither can do either" }
  ]}
  correct={1}
  explanation="DAST exercises the running app with real payloads, so a hit means real exploitable behavior — but it can't name the code line. SAST reads the source and traces source→sink, so it pinpoints the line — but can't confirm runtime exploitability. Hence you want both."
  revisit={{ to: "/docs/secure-sdlc/sast-dast-sca#how-each-one-works-and-what-it-misses", label: "How each works" }}
/>

<Question
  prompt="Which scanner addresses OWASP's 'Vulnerable & Outdated Components,' and what's its main limitation?"
  options={[
    { text: "SAST; it can't read your code" },
    { text: "SCA; it finds dependencies with KNOWN vulnerabilities (CVEs) but can't catch brand-new/unknown ones and often can't tell if you actually use the vulnerable code path" },
    { text: "DAST; it only works offline" },
    { text: "None of them handle dependencies" }
  ]}
  correct={1}
  explanation="SCA inventories third-party components (including transitive ones) and matches them to CVE databases — the defense for A06. Its limits: it only knows published vulnerabilities, and reachability (do you call the vulnerable path?) needs prioritization."
  revisit={{ to: "/docs/secure-sdlc/sast-dast-sca#how-each-one-works-and-what-it-misses", label: "SCA" }}
/>

<Question
  prompt="A team's SAST produces 1,000 findings per build; developers now ignore all of them. What's the core lesson?"
  options={[
    { text: "They should add more scanners" },
    { text: "Signal-to-noise is the whole game — 1,000 untriaged findings are worse than 10 that get fixed, because noise trains people to ignore the tool and hides the real critical; tune, prioritize, and gate only on high confidence" },
    { text: "Scanners are useless" },
    { text: "They should block every build on all 1,000" }
  ]}
  correct={1}
  explanation="A scanner's value is actionable signal, not finding count. Noise gets the tool ignored or disabled, so the real issues are lost. Tune out false positives, route findings into normal tickets, and hard-gate only the few high-signal cases."
  revisit={{ to: "/docs/secure-sdlc/sast-dast-sca#wiring-it-into-ci-without-drowning-in-noise", label: "Signal is the game" }}
/>

<Question
  prompt="How should the scanners typically be wired into CI/CD?"
  options={[
    { text: "Run everything on every commit and block on every finding" },
    { text: "Fast checks (SAST, SCA) gate pull requests; slower DAST runs pre-deploy against staging; block only on high-confidence high-severity issues (and new secrets / critical CVEs), warn on the rest, and track the trend over time" },
    { text: "Run them only once a year, manually" },
    { text: "Run DAST on every keystroke in the editor" }
  ]}
  correct={1}
  explanation="Match cadence to speed (fast SAST/SCA per PR, slower DAST pre-deploy), gate only on high-signal cases to avoid friction, warn on the rest, and manage findings as a downward trend with shrinking time-to-fix."
  revisit={{ to: "/docs/secure-sdlc/sast-dast-sca#wiring-it-into-ci-without-drowning-in-noise", label: "Wiring into CI" }}
/>

</Quiz>

## What's next

→ Continue to [Secrets, IaC & Container Scanning](./secrets-iac-container-scanning) — the scanners aimed not at application code but at the *credentials, infrastructure definitions, and images* that surround it, where some of the most common real breaches originate.

→ **Going deeper:** the bug classes SAST/DAST detect are [Chapter 3](/docs/appsec); the human judgment that complements them is [secure design & review](./secure-design-review); the dependency risk SCA surfaces deepens into [supply-chain security](./supply-chain).
