# Modern Security Engineer Guide

A comprehensive, first-principles 2026 guide to how security is actually done — offensive *and* defensive. **14 chapters in 7 parts**, written so a complete beginner can read it front to back and finish job-ready, while still being a useful reference for working engineers. It teaches the attacker's mindset and the defender's craft from the ground up, and ends where you can *do the job*. *Last reviewed: June 2026.*

> **Live site:** https://tonyx1998.github.io/modern-security-engineer-guide/ *(deploy with `npm run deploy` / GitHub Pages)*

> ⚠️ **Ethics & authorization.** Offensive techniques in this guide are for **authorized, defensive purposes only** — pentesting under a signed engagement, CTFs, your own lab, or sanctioned bug-bounty scope. Using them against systems you don't own or aren't permitted to test is illegal. Every offensive chapter restates this in context.

---

## What's in the guide

Seven parts, read top to bottom. You go from "what is the CIA triad?" to threat-modeling a design, exploiting and defending the OWASP Top 10, running a SOC, reconstructing a breach, securing the cloud, operationalizing compliance, and securing AI systems — then turning it all into a career.

| # | Chapter | One-line summary |
|---|---------|-----------------|
| - | [Introduction](docs/00-intro.md) | Start here. The two ground-truth facts, and how to read the guide. |
| **A** | **Foundations** | |
| 1 | [Security Foundations](docs/01-foundations/) | CIA triad, threat vs. vulnerability vs. risk, the attacker's mindset, trust boundaries, defense-in-depth & least privilege. |
| 2 | [Cryptography](docs/02-cryptography/) | Symmetric & asymmetric encryption, hashing & MACs, TLS 1.3, PKI & certificates, key management. |
| **B** | **Building secure software** | |
| 3 | [Web & Application Security](docs/03-appsec/) | The OWASP Top 10: injection, XSS, broken auth, broken access control, SSRF, deserialization/XXE, secure-by-default defenses. |
| 4 | [Secure SDLC & DevSecOps](docs/04-secure-sdlc/) | Shift-left, threat modeling, secure design & review, SAST/DAST/SCA, secrets/IaC/container scanning, supply-chain security. |
| **C** | **Offensive** | |
| 5 | [Penetration Testing & Red Teaming](docs/05-offensive/) | The engagement lifecycle, scope & rules of engagement, recon, exploitation & chaining, post-exploitation, reporting. |
| **D** | **Defensive** | |
| 6 | [Detection & Response](docs/06-detection/) | Logging & telemetry, SIEM, detection engineering, the SOC & alert fatigue, threat intel & MITRE ATT&CK. |
| 7 | [Incident Response & Forensics](docs/07-incident-forensics/) | The IR lifecycle, chain of custody, disk/memory/network forensics, timeline reconstruction, breach determination. |
| **E** | **Infrastructure & cloud** | |
| 8 | [Network Security](docs/08-network-security/) | Segmentation, firewalls & WAFs, DDoS mitigation, VPNs → ZTNA, egress filtering, zero-trust networking. |
| 9 | [Cloud & Identity Security](docs/09-cloud-identity/) | IAM hardening, CSPM, zero-trust architecture, SSO & federation, KMS & secrets at scale. |
| **F** | **Governance** | |
| 10 | [Compliance & Risk](docs/10-compliance/) | SOC 2 / ISO 27001 / PCI / HIPAA / GDPR, controls mapping, audits, the risk register, vendor risk. |
| 11 | [Securing AI Systems](docs/11-ai-security/) | Prompt injection, the OWASP LLM Top 10, excessive agency, AI red-teaming, and why an LLM is *not* a security boundary. |
| **G** | **Career & reference** | |
| 12 | [Security Career](docs/12-career/) | The roles (AppSec, red/blue team, cloud, GRC), certifications, building a portfolio, the multi-year path. |
| 13 | [Case Studies](docs/13-case-studies/) | SolarWinds, Capital One, and Colonial Pipeline reconstructed from public reporting — and the patterns that generalize. |
| 14 | [Glossary](docs/14-glossary.md) | Every term used in the guide, in plain English, A–Z. |

Each teaching chapter is a set of single-topic lessons following a fixed skeleton: a plain-English on-ramp, terms defined on first use, at least one fully worked example, "why it matters," common pitfalls, an in-page **checkpoint quiz**, and cross-links to related lessons. Roughly 184k words across 98 docs, with 80+ quizzes.

---

## Who this is for

- **Absolute beginners** — "I can build software but security is a black box." Start at Chapter 1 and read straight through.
- **Software engineers** — Chapters 3, 4, and 11 give you the secure-coding, secure-SDLC, and AI-security skills to ship safely.
- **Aspiring offensive/defensive specialists** — Chapter 5 (offense), Chapters 6–7 (defense), and Chapter 8–9 (infra/cloud) go to job-ready depth.
- **Working security engineers** — a sharp 2026 refresh and a single cross-linked reference, with the governance and AI chapters covering the newest surface.

It pairs naturally with the companion *Modern Web Dev* and *Modern AI Engineer* guides — those teach you to build; this one teaches you to break and defend what's built.

---

## Running the site locally

Built with [Docusaurus](https://docusaurus.io). You need Node.js 20+.

```bash
# Install dependencies (one-time)
npm install

# Start the dev server at http://localhost:3000
npm run start

# Build a production bundle (output in build/)
npm run build

# Serve the production build locally
npm run serve
```

The dev server hot-reloads as you edit any file in `docs/`, `src/`, or the config.

> **Note:** the production build uses Docusaurus Faster (rspack). If a build ever panics with a `DependencyId` error, it's a stale cache — run `npm run clear` and rebuild.

---

## Repository layout

```
modern-security-engineer-guide/
├── docs/                              # The guide, split into focused per-topic lessons
│   ├── 00-intro.md
│   ├── 01-foundations/               # CIA, risk, attacker mindset, trust boundaries, least privilege
│   ├── 02-cryptography/              # symmetric/asymmetric, hashing, TLS, PKI, key management
│   ├── 03-appsec/                    # OWASP Top 10, injection, XSS, authz, SSRF, deserialization
│   ├── 04-secure-sdlc/              # shift-left, threat modeling, SAST/DAST/SCA, supply chain
│   ├── 05-offensive/                # pentest lifecycle, recon, exploitation, post-ex, reporting
│   ├── 06-detection/                # logging, SIEM, detection engineering, SOC, ATT&CK
│   ├── 07-incident-forensics/       # IR lifecycle, chain of custody, forensics, breach determination
│   ├── 08-network-security/         # segmentation, firewalls/WAF, DDoS, VPN/ZTNA, egress, zero trust
│   ├── 09-cloud-identity/           # IAM, CSPM, zero-trust architecture, SSO, KMS/secrets
│   ├── 10-compliance/               # frameworks, controls mapping, audits, risk register, vendor risk
│   ├── 11-ai-security/              # prompt injection, LLM Top 10, excessive agency, the cardinal rule
│   ├── 12-career/                   # roles, certifications, portfolio, the multi-year path
│   ├── 13-case-studies/             # SolarWinds, Capital One, Colonial Pipeline + generalizable lessons
│   └── 14-glossary.md               # every term, A–Z
├── src/
│   ├── pages/index.tsx               # Landing page
│   ├── components/                   # Quiz, CodeChallenge, FeedbackWidget
│   ├── theme/                        # MDX component registry + swizzled Mermaid
│   └── css/                          # Global theme + landing styles
├── static/img/                       # Logos, favicon, social cards
├── docusaurus.config.ts              # Site configuration
├── sidebars.ts                       # Sidebar / chapter order (source of truth)
├── GUIDE-STANDARD.md                 # The shared pedagogical standard every lesson follows
├── package.json
└── README.md                         # This file
```

> **Note:** chapter order and numbers live in `sidebars.ts` and the page text — not in directory names. URLs are slug-based, so the on-disk numeric prefixes don't affect them.

---

## License

Content licensed CC BY 4.0. Site code licensed MIT.
