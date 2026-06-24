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

### 5. NHI/SPIFFE + eBPF/CNAPP/K8s — NOW DONE (3 NEW LESSONS, Ch.9)
**Gap (was):** Chapter 9 (Cloud & Identity) had no lesson on **non-human identities & secrets
sprawl + SPIFFE/SPIRE workload identity**, nor on **eBPF runtime security + CNAPP + Kubernetes
security** (Falco/Tetragon, PSA/Kyverno admission control). These were real mid-2026 gaps.
**Status:** **DONE** (follow-up pass). Built as **three** lessons (the runtime-detection vs.
Kubernetes split read best as two distinct lessons):
- `09-cloud-identity/015-nhi-workload-identity.md` — "Non-Human Identities & Workload Identity."
  Machines vastly outnumber humans; static long-lived secrets are the dominant breach vector;
  **secrets sprawl**; the fix = short-lived workload identity — **SPIFFE/SPIRE** (attestation →
  SVIDs), **cloud workload identity federation** (OIDC, no static keys), secret-manager +
  rotation fallback. Slots after IAM hardening (extends "identity is the perimeter" from human
  to machine identity). Ratios/project-status/product names in a dated box.
- `09-cloud-identity/025-runtime-security.md` — "Cloud-Native Runtime Security — eBPF & CNAPP."
  Why **behavioral, in-kernel (eBPF)** detection beats signatures against **living-off-the-land**
  (Volt Typhoon as a dated illustration); **Falco** (detect) vs. **Tetragon** (detect + enforce
  in-kernel); **CNAPP** as the CSPM+CWPP+CIEM+KSPM consolidation. Slots after CSPM (the
  prevent/detect pairing). Tool/Gartner/threat-actor specifics in a dated box.
- `09-cloud-identity/027-kubernetes-security.md` — "Kubernetes Security — Admission Control &
  Provenance." **Admission control** as the gate; **PSP removed in 1.25 → Pod Security
  Admission**; **Kyverno / OPA Gatekeeper** policy-as-code; **image provenance/signing**;
  Kubernetes Secrets are base64 (not encrypted); **network policies** = no flat in-cluster trust.
  Version/tool specifics in a dated box.

Each lesson has the full skeleton (plain-English on-ramp → terms-once → ≥1 traced worked example
→ why it matters → pitfalls → ≥3-question checkpoint Quiz with teaching explanations → both-way
cross-links → one `<h1>`). All wired into `sidebars.ts`, the Ch.9 index (covers list + numbered
lesson list), and the lesson chain (IAM→NHI→CSPM→runtime→k8s→zero-trust); prev/next, cross-links,
and three new bank questions per lesson added to the Ch.9 checkpoint (sampleSize 6→8). New terms
added to the glossary (NHI, secrets sprawl, SPIFFE/SPIRE, SVID, attestation, workload identity
federation, eBPF, syscall, signature-based/behavioral, Falco, Tetragon, runtime security, CWPP,
CIEM, KSPM, admission control, PSA, PSP, Kyverno, OPA Gatekeeper, Kubernetes, pod, network policy,
image provenance/signing). `npm run build` passes clean (exit 0, no broken-link/anchor warnings).

---

## Deferred — NOW COMPLETED

1. ~~**Ch.9 — Non-human identities (NHI) & secrets sprawl + SPIFFE/SPIRE workload identity.**~~
   **DONE** → `09-cloud-identity/015-nhi-workload-identity.md` (see item 5 above).
2. ~~**Ch.9 — eBPF runtime security + CNAPP + Kubernetes security.**~~ **DONE**, split into two:
   `09-cloud-identity/025-runtime-security.md` (eBPF/Falco/Tetragon/CNAPP) and
   `09-cloud-identity/027-kubernetes-security.md` (admission control / PSA / Kyverno/OPA /
   image signing / network policies) (see item 5 above).

No outstanding deferred items remain from this currency pass.

---

## Build & conformance

- `npm run build` passes (exit 0) before and after this pass — including the Ch.9 follow-up.
- `sidebars.ts` updated for the new lessons (MCP, Post-Quantum, and the three Ch.9 lessons:
  non-human identity, runtime security, Kubernetes security).
- All new lessons follow `GUIDE-STANDARD.md`: plain-English on-ramp → terms-defined-once →
  worked example → why it matters → common pitfalls → ≥3-question quiz with teaching
  explanations → both-direction cross-links → exactly one `<h1>`.
