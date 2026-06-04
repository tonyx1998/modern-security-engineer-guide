---
id: appsec-overview
title: 3. Web & Application Security — Overview
sidebar_position: 1
sidebar_label: AppSec intro
description: Breaking and defending applications — the OWASP Top 10 in depth, injection classes, authentication and authorization attacks, SSRF, and unsafe deserialization.
---

# Part 3: Web & Application Security

> **In one line:** Most real-world compromise enters through the application layer, so this chapter goes deep on how apps are attacked — injection, broken auth/authz, SSRF, deserialization — and exactly how to defend each, building on the trust-boundary thinking from [Foundations](/docs/foundations).

:::tip[In plain English]
An application takes untrusted input and does trusted things with it — that gap is where attackers live. This chapter is the offensive *and* defensive tour of the application layer: how an attacker turns a form field into a database dump (injection), an ID in a URL into someone else's data (broken authorization), or a server-side fetch into a pivot into your cloud (SSRF) — and the concrete defenses that close each. It deepens the *Modern Web Dev* guide's web-security page into a security-engineer-grade treatment.
:::

## What this chapter covers

- **The OWASP Top 10 (2025)** as the organizing map.
- **Injection** — SQL, command, template, LDAP; parameterization and why it works.
- **Broken authentication** — session/JWT attacks, credential stuffing, MFA bypasses.
- **Broken authorization** — IDOR, privilege escalation, missing function-level checks.
- **SSRF, XXE, and unsafe deserialization** — the server-side classes that turn into pivots.
- **Defensive patterns** — input validation, output encoding, secure-by-default frameworks.

:::danger[Authorized testing only]
The attacks here are taught so you can find and fix them on systems you own or are authorized to test. Probing third-party systems without written permission is illegal.
:::

## The lessons in this chapter

1. **[The OWASP Top 10 →](/docs/appsec/owasp-top-10)** — the industry's shared map of the most critical web risks, and how this chapter follows it.
2. **[Injection →](/docs/appsec/injection)** — SQL/command/template injection, traced end to end, and the structural fix (parameterization).
3. **[Cross-Site Scripting (XSS) →](/docs/appsec/xss)** — injection aimed at the victim's browser; the three types and the layered defense.
4. **[Broken Authentication →](/docs/appsec/broken-authentication)** — credential stuffing, weak sessions, the JWT traps, and MFA/passkeys.
5. **[Broken Access Control →](/docs/appsec/broken-access-control)** — the #1 category: IDOR, function-level checks, privilege escalation, deny-by-default.
6. **[SSRF →](/docs/appsec/ssrf)** — coercing your server into attacker-chosen requests, and cloud-credential theft.
7. **[Unsafe Deserialization & XXE →](/docs/appsec/deserialization-xxe)** — when parsing attacker data becomes running attacker code.
8. **[Secure-by-Default Defensive Patterns →](/docs/appsec/defensive-patterns)** — the cross-cutting habits that prevent whole categories at once.

Finish with the **[Chapter 3 checkpoint →](/docs/appsec/appsec-checkpoint)** to certify the toolkit before Chapter 4.

---

→ Start here: [The OWASP Top 10](/docs/appsec/owasp-top-10).
