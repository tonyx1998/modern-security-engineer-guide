---
id: mock-interviews
title: Rehearsing security interviews out loud (SoloMock)
sidebar_position: 4.5
sidebar_label: Mock interviews (SoloMock)
description: A verbal way to drill the 2026 security-engineer loop — spot-the-vuln code review, STRIDE threat modeling, and incident response — mapped to specific mock problems you can do solo.
---

# Rehearsing security interviews out loud (SoloMock)

> **In one line:** The [career path](./career-path) page shows where the road goes; this page is about rehearsing the *interview* — the secure-code-review, threat-modeling, and incident-response rounds — out loud and solo, with each round mapped to a specific mock problem so your reps are deliberate.

:::tip[In plain English]
Security interviews aren't a quiz on CVE numbers. They hand you a snippet and ask "what's wrong here, and how would you fix the *class* of bug?"; they ask you to **threat-model** a feature on a whiteboard; and they ask you to talk through a real incident or finding. All three reward saying your reasoning out loud — naming the vulnerability class, reasoning about trust boundaries, framing risk in business terms. You close that gap with reps, and you don't need a human on the other end for every one.
:::

:::note[Terms, defined once]
- **Secure code review** — reading code to find vulnerabilities (injection, broken access control, SSRF) and proposing a root-cause fix, not a band-aid.
- **STRIDE** — a threat-modeling method: **S**poofing, **T**ampering, **R**epudiation, **I**nformation disclosure, **D**enial of service, **E**levation of privilege. A structured way to *generate* a threat list instead of guessing.
- **IDOR (Insecure Direct Object Reference)** — a broken-access-control bug where you can read/modify someone else's object by changing an id. OWASP's #1 risk class.
:::

## The tool: SoloMock

[**SoloMock**](https://solomock.com) is a free verbal mock-interview app (a companion project to this guide). You talk to an AI interviewer over voice while you read code or sketch a design in a real editor. Its **Security** track evaluates through an attacker-and-defender lens: it pushes you to name the *vulnerability class* (not just patch one symptom), reject band-aid fixes when a structural fix exists, reason about trust boundaries, and frame risk for a non-security audience. Pick the **Security** track to filter to the problems below.

## The 2026 security loop, and what to rehearse for each round

| Round | What it actually tests (2026) | Rehearse with |
|-------|-------------------------------|---------------|
| **Secure code review (spot the vuln)** | Read a snippet, name the class, fix the *root cause* — injection, broken access control | [Login lookup is SQL-injectable](https://solomock.com/?problem=debug-sql-injection) · [Any user can read any invoice (IDOR)](https://solomock.com/?problem=debug-broken-access-control) |
| **Threat modeling** | Walk a feature, apply STRIDE, give a concrete mitigation per real threat, risk-rank | [Threat-model a password reset flow](https://solomock.com/?problem=design-threat-model-password-reset) |
| **Secure system design** | Architect a system with security as a first-class constraint; trust boundaries, defense in depth | [Threat-model a password reset flow](https://solomock.com/?problem=design-threat-model-password-reset) (same round, design lens) |
| **Incident response (behavioral)** | A real finding/incident: detection, containment, remediation, risk communication | [Walk me through a security issue you found](https://solomock.com/?problem=behavioral-security-incident) |

:::info[Highlight: the interview is testing class-thinking, not payload trivia]
When a code-review round shows you a SQL-injectable query, the weak answer escapes the two example payloads (`' OR '1'='1` and `' OR role='admin' --`). The strong answer names the **class** (injection), switches to a **parameterized query** so input can *never* be parsed as SQL — closing the whole class, not the samples — and adds defense in depth (a least-privilege DB user so a future miss can't drop tables). Same with [the IDOR problem](https://solomock.com/?problem=debug-broken-access-control): "make ids unguessable" is security-by-obscurity; the real fix is *enforced object-level authorization*. Rehearse saying that distinction out loud.
:::

## How to actually practice

1. **One round, out loud, root-cause first.** On a code-review problem, resist the urge to patch — say the vulnerability class, then the structural fix, then *why the band-aid is bypassable*.
2. **Do the threat-model round with a method, not a memory.** Don't list mitigations from memory — *walk the flow*, draw trust boundaries, apply STRIDE per step, then risk-rank. The interviewer is grading your method as much as your list.
3. **Practice framing risk for a PM.** After you find a bug, say its impact in business terms — likelihood, blast radius, what an attacker gains. Security engineers who can translate risk stand out.
4. **Tell a real incident story.** Use the behavioral round to rehearse detection → containment → remediation → prevention, in that order, with a real timeline. A CTF or home-lab finding counts.

:::caution[Where people commonly trip up & a word on ethics]
- **Patching the symptom.** Escaping quotes instead of parameterizing, or making ids unguessable instead of enforcing authorization, is the classic junior tell. Fix the class.
- **Threat modeling as a checklist recital.** A flat, unprioritized list of OWASP items is weak. Show the structured per-step walk that *generates* the list, then risk-rank it.
- **Risk in pure jargon.** "It's a stored XSS" means nothing to the PM who owns the fix priority. Say what an attacker can *do* and how likely it is.
- **Ethics & authorization.** Everything you practice here is defensive — secure coding, threat modeling, incident response. In a real interview (and a real job), offensive technique is for authorized scope only; a candidate who scopes what they're allowed to test is the signal interviewers want, and casual unauthorized "hacking" is a red flag. This mirrors the [guide's standing rule](/docs/).
:::

## Page checkpoint

<Quiz id="career-mock-interviews-page" title="Did the security mock prep stick?" sampleSize={2}>

<Question
  prompt="In a code-review round with a SQL-injectable query, what's the difference between a weak and a strong answer?"
  options={[
    { text: "Weak escapes the two example payloads; strong uses a parameterized query so input can never be parsed as SQL — closing the whole class" },
    { text: "Weak uses Postgres; strong uses MySQL" },
    { text: "Weak fixes it in 5 minutes; strong takes longer" },
    { text: "There is no difference as long as the examples stop working" }
  ]}
  correct={0}
  explanation="Escaping the sample payloads is a band-aid that's bypassable (encodings, other metacharacters) and breaks valid input like O'Brien. The root-cause fix is parameterization: the driver sends query and data on separate channels, so untrusted input can't be interpreted as SQL — that closes the entire injection class, plus a least-privilege DB user for defense in depth."
  revisit={{ to: "/docs/career/mock-interviews#the-2026-security-loop-and-what-to-rehearse-for-each-round", label: "Secure code review" }}
/>

<Question
  prompt="What does STRIDE give you in a threat-modeling round?"
  options={[
    { text: "A list of certifications to mention" },
    { text: "A structured method to GENERATE threats per step (Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation) instead of guessing from memory" },
    { text: "An automated scanner that finds bugs for you" },
    { text: "A compliance framework for audits" }
  ]}
  correct={1}
  explanation="STRIDE is a structured way to walk a feature and systematically surface threat categories per step, then risk-rank them. Interviewers grade the method that produces the list — a flat, unprioritized recital of OWASP items is the weak version."
  revisit={{ to: "/docs/career/mock-interviews#the-2026-security-loop-and-what-to-rehearse-for-each-round", label: "Threat modeling" }}
/>

</Quiz>

## What's next

→ Continue to the [Career Checkpoint](./career-checkpoint), or run a round now at [SoloMock](https://solomock.com) (Security track). For the general coding loop that often appears in security-engineer interviews too, the [SWE Interview Guide](https://swe-interview-guide.vercel.app) shares the same problem set.
