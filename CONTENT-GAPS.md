# Content Gaps — Mid-2026 Currency Pass

Status of the *Modern Security Engineer Guide* against the mid-2026 security landscape,
and the additive changes made in this pass. This is a **currency update**, not a rewrite:
the guide's frame is strong; these changes add the standards and threat models that became
load-bearing in 2024–2026, while keeping vendor metrics, surge stats, and exact regulatory
dates **out of the durable spine** (durable concept in the lesson body; dated specifics
footnoted as "verify current").

## Durable-vs-dated principle (how these edits were scoped)

- **Durable spine:** the trust model, the threat class, the design principle. Taught deeply,
  no expiry.
- **Dated, footnoted:** FIPS numbers, regulation effective dates, CVE identifiers, codepoint
  names, browser-default status. Always in a clearly dated box with a "verify current" note.
- **Skipped (out of scope):** vendor SOC product metrics, "surge %" statistics, the
  "autonomous SOC" vision-as-fact, and specific MCP/AI CVE numbers as durable content (CVEs
  appear only as dated illustrations).

---

## Gaps identified and how they were closed

### 1. MCP (Model Context Protocol) security — MISSING → NEW LESSON (Ch.11)
**Gap:** MCP became the de-facto standard for wiring agents to tools across the industry in
2025 (donated to a Linux Foundation directed fund, Dec 2025), yet the AI-security chapter had
no lesson on the tool-integration layer's trust model. The chapter taught "treat the model as
untrusted" but not "treat the *tool layer* as untrusted."
**Change:** New lesson `11-ai-security/035-mcp-security.md` ("Securing the Tool Layer: MCP").
Teaches the host/client/server trust model and the named threat classes — **tool poisoning**,
**line-jumping**, **confused-deputy / token pass-through**, **over-broad scopes** — framed with
the guide's existing principle. CVE appears once as a dated illustration only. Slots after
Excessive Agency, before AI Red-Teaming.

### 2. Post-Quantum Crypto & crypto-agility — MISSING → NEW LESSON (Ch.2)
**Gap:** The crypto chapter's only PQC mention was a pitfall line calling it "not a 2026
emergency." FIPS 203/204/205 were finalized Aug 2024 and hybrid PQC TLS is now a browser
default — the migration is underway, and "crypto-agility" is now a first-class design
requirement the guide didn't teach.
**Change:** New lesson `02-cryptography/065-post-quantum.md` ("Post-Quantum Crypto &
Crypto-Agility"). Teaches **harvest-now-decrypt-later** (the durable motivation), the new
standards (ML-KEM/ML-DSA/SLH-DSA, dated box), **hybrid TLS**, and **crypto-agility** as the
durable takeaway. Slots after Key Management, before the checkpoint. Also **updated the
asymmetric-encryption pitfall line** from "not a 2026 emergency" to "migration is underway now,"
cross-linking the new lesson.

### 3. Low-effort fold-ins (high value)
- **(a) Lethal trifecta** — folded into `11-ai-security/03-excessive-agency.md` as the durable
  agent threat-model lens (private data + untrusted content + external comms = exfil). Term
  attributed, kept as the *shape* of the risk, not a citation.
- **(b) XZ Utils backdoor** — added as a NAMED maintainer-trust case in
  `04-secure-sdlc/06-supply-chain.md` (the attack source review *can't* catch) and referenced
  in `13-case-studies/01-supply-chain-case.md` as a second archetype alongside SolarWinds.
- **(c) CI SHA-pinning** — added to `04-secure-sdlc/06-supply-chain.md` practical hygiene:
  "pin GitHub Actions to a full commit SHA; treat the CI runner as a credential-theft surface,"
  with the tj-actions compromise as a dated illustration.
- **(d) OWASP LLM Top-10 2025 IDs** — added a dated box to `11-ai-security/02-llm-top-10.md`
  pinning the 2025 edition IDs, especially **LLM07 System Prompt Leakage** and **LLM08 Vector &
  Embedding (RAG) Weaknesses**, while keeping the existing "editions shift" caveat.

### 4. The 2023–2026 regulatory wave — THIN → NEW SECTION (Ch.10)
**Gap:** The frameworks lesson covered the durable "compliance ≠ security" thesis well but
predated the shift from voluntary frameworks to **mandatory disclosure + vendor liability**
(SEC 8-K, NIS2/DORA, EU AI Act, EU CRA's SBOM mandate, CISA Secure-by-Design).
**Change:** Added a "The regulatory wave" section + a dated specifics box to
`10-compliance/01-frameworks.md`, plus one quiz question. Durable thesis kept as the spine;
all dates/regulation names in the dated box.

### 5. (Bigger, capacity-permitting) NHI/SPIFFE + eBPF/CNAPP/K8s — DEFERRED
**Gap:** Chapter 9 (Cloud & Identity) has no lesson on **non-human identities & secrets sprawl
+ SPIFFE/SPIRE workload identity**, nor on **eBPF runtime security + CNAPP + Kubernetes
security** (Falco/Tetragon, PSA/Kyverno admission control). These are real mid-2026 gaps.
**Status:** **DEFERRED** as high-value follow-ups — each is a full multi-lesson build and the
durable items (1–4) were prioritized and finished cleanly. See "Deferred" below.

---

## Deferred (high-value follow-ups, not built this pass)

1. **Ch.9 — Non-human identities (NHI) & secrets sprawl + SPIFFE/SPIRE workload identity.**
   The "every workload needs a verifiable identity, and machine identities now vastly outnumber
   human ones" lesson. Pairs with Key Management and IAM hardening.
2. **Ch.9 — eBPF runtime security + CNAPP + Kubernetes security.** Runtime detection
   (Falco/Tetragon), the CNAPP consolidation story, and admission control (Pod Security
   Admission / Kyverno/OPA). Pairs with Detection and Cloud Identity.

Both are larger than the items completed here and should be scoped as their own pass.

---

## Build & conformance

- `npm run build` passes (exit 0) before and after this pass.
- `sidebars.ts` updated for the two new lessons (MCP, Post-Quantum).
- All new lessons follow `GUIDE-STANDARD.md`: plain-English on-ramp → terms-defined-once →
  worked example → why it matters → common pitfalls → ≥3-question quiz with teaching
  explanations → both-direction cross-links → exactly one `<h1>`.
