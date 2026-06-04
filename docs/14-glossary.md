---
id: glossary
title: 14. Glossary
sidebar_position: 14
sidebar_label: 14. Glossary
description: Plain-English definitions for every key security term used across this guide, A–Z.
---

# Glossary

*Quick-reference, plain-English definitions for the key terms used throughout this guide. Use the search bar or Ctrl/Cmd-F to jump to a term. Each term is also defined inline in the lesson that introduces it.*

---

## A

**ABAC (Attribute-Based Access Control)** — Authorization decided by attributes/policies (role, department, resource sensitivity) rather than fixed roles. See *RBAC*.

**Abuse case** — The "evil twin" of a use case: how a feature can be *misused* rather than used as intended.

**Access review (recertification)** — Periodically re-verifying that people still need the access they have, and removing what they don't.

**Admissibility** — Whether evidence can be used in legal proceedings; depends on proper handling and an intact *chain of custody*.

**AEAD (Authenticated Encryption with Associated Data)** — Encryption that also guarantees integrity/authenticity via an auth tag (AES-GCM, ChaCha20-Poly1305). The modern default for symmetric encryption.

**AES (Advanced Encryption Standard)** — The global standard symmetric block cipher; use AES-256 in an authenticated mode.

**Agency (AI)** — An LLM's capacity to take *actions* via tools, not just produce text. See *excessive agency*.

**AI agent** — An LLM given tools and autonomy to pursue goals across multiple steps.

**AI red-teaming** — Adversarial testing of AI systems for security and safety failures (prompt injection, jailbreaks, tool abuse).

**Alert fatigue** — Desensitization from too many alerts (especially false positives), causing analysts to miss or dismiss real ones. The SOC's central enemy.

**Allowlist** — An explicit list of permitted things (inputs, destinations, types); the safe default. The opposite of *blocklist*.

**Amplification / reflection** — Bouncing small spoofed requests off third parties that send large responses to a victim, multiplying a DDoS.

**Anti-forensics** — Attacker techniques to destroy or alter evidence (wiping logs, *timestomping*) to evade investigation.

**Anycast** — Announcing one IP from many global locations so traffic (including a DDoS) spreads across many data centers.

**APT (Advanced Persistent Threat)** — A well-resourced, persistent adversary (often nation-state) tracked as a named group.

**Asymmetric encryption** — "Public-key" crypto using a linked key pair: a public key anyone can use and a private key kept secret.

**Attack surface** — The total set of points an attacker could target: inputs, endpoints, ports, dependencies, and people.

**Attack tree** — A diagram with an attacker *goal* at the root and the ways to achieve it branching below.

**Attestation / certification** — The formal output proving compliance (a SOC 2 report, an ISO 27001 certificate).

**Audit** — An independent assessment verifying you actually follow your controls, producing a report or certification.

**Audit log** — A security-relevant record of *who did what*, especially for privileged actions; used for detection and forensics.

**Authentication (authn)** — Proving *who* you are. Distinct from *authorization*.

**Authorization (authz)** — Deciding *what* an authenticated identity is allowed to do.

**Availability** — The CIA property that systems and data are usable when legitimate users need them.

## B

**Baseline** — A model of "normal" behavior for a user/host/system, so anomalies can be flagged.

**Beaconing** — The regular, periodic outbound "check-ins" malware makes to its *C2* server.

**Black box (testing)** — Testing with no inside knowledge, simulating an external attacker. See *grey/white box*.

**Blameless post-mortem** — A review focused on systemic causes and fixes, not punishing individuals, so people report honestly.

**Blast radius** — How much an attacker can reach and damage from a single compromise. Shrunk by least privilege and segmentation.

**Block cipher** — A cipher that encrypts fixed-size blocks (e.g., AES). See *stream cipher*.

**Blocklist** — Trying to enumerate and reject known-bad things; fragile because you can't list them all. Prefer *allowlist*.

**Blue team** — The defensive security function (monitoring, detection, response).

**Botnet** — A network of compromised devices an attacker controls to generate attack traffic.

**Brute force** — Trying many passwords against one account. See *password spraying*.

**Bug bounty** — An ongoing program paying independent researchers for valid vulnerabilities found within published scope.

## C

**C2 (Command and Control)** — The outbound channel an attacker uses to control compromised systems.

**CA (Certificate Authority)** — A trusted organization that verifies identities and issues (signs) certificates.

**Castle-and-moat** — The legacy model of a hard perimeter with a trusted interior; what *zero trust* replaces.

**Certificate (X.509)** — A signed document binding a public key to an identity (a domain), with validity dates and issuer.

**Chain of custody** — The documented, unbroken record of who handled evidence and every transfer, proving it wasn't tampered with.

**Chain of trust** — The path from a website's certificate up through intermediates to a trusted root.

**Chaining** — Combining several modest weaknesses into an impact far greater than the sum of parts. How real breaches happen.

**ChaCha20** — A fast software stream cipher; used in ChaCha20-Poly1305 AEAD.

**CIA triad** — Confidentiality, Integrity, Availability: the three properties security controls protect.

**Cipher** — The algorithm that performs encryption (e.g., AES).

**Ciphertext** — Encrypted, unreadable data. See *plaintext*.

**CISO (Chief Information Security Officer)** — The executive accountable for an organization's security.

**CISSP** — A broad, knowledge-based security certification valued for senior/GRC roles.

**Clock skew** — Different systems' clocks disagreeing, which misorders events in a timeline unless corrected.

**Cloud metadata endpoint** — A link-local address (`169.254.169.254`) a cloud VM queries for its config, *including temporary IAM credentials*; a prime SSRF target.

**CNAPP (Cloud-Native Application Protection Platform)** — A suite bundling CSPM with workload, identity, and other cloud-security capabilities.

**Collision** — Two different inputs producing the same hash; finding them breaks a hash (killed MD5 and SHA-1).

**Compliance framework** — A defined set of security/privacy controls an organization follows and is audited against.

**Confidentiality** — The CIA property that information is available only to those authorized to see it.

**Confused deputy** — A trusted component tricked into misusing its authority on an attacker's behalf (e.g., SSRF, or an injected LLM).

**Containment** — Actions that limit an incident's spread/damage without yet fully removing the attacker.

**Continuous verification** — Re-evaluating trust during a session as signals change, not just at login.

**Control** — Any safeguard that protects a security property (a password, firewall rule, encryption setting, backup).

**Controls mapping** — Translating framework requirements into specific implemented controls and their evidence.

**Correlation** — Connecting related events across sources and time into one picture; a SIEM's defining power.

**CSP (Content-Security-Policy)** — An HTTP header restricting what scripts a page may run; a defense-in-depth layer against XSS.

**CSPM (Cloud Security Posture Management)** — Tooling that continuously detects misconfigurations across cloud resources.

**CSPRNG** — Cryptographically Secure Pseudo-Random Number Generator; the safe randomness source for keys.

**CSR (Certificate Signing Request)** — What you send a CA: your public key plus the identity to certify (private key never leaves you).

**CTF (Capture the Flag)** — Gamified security competitions; strong portfolio signal, especially offensive.

**Credential stuffing** — Replaying username/password pairs leaked from *other* sites, exploiting password reuse. The top cause of account takeover.

**CVE (Common Vulnerabilities and Exposures)** — A public, uniquely-numbered record of a specific known vulnerability.

**CVSS (Common Vulnerability Scoring System)** — A standardized 0–10 severity score; an input to risk, not the whole answer.

## D

**DAST (Dynamic Application Security Testing)** — Security testing that attacks a *running* application from the outside. See *SAST*.

**Data breach** — An incident where sensitive/regulated data was actually accessed, acquired, or disclosed; the legally reportable subset.

**Data-flow diagram (DFD)** — A drawing of how data moves through a system, used to make trust boundaries visible for threat modeling.

**Default deny** — Start from "no access" and grant explicitly; the safe baseline (least privilege for connections/permissions).

**Defense in depth** — Layering independent controls so one failure doesn't cause compromise.

**Deny by default** — See *default deny*.

**Deprovisioning (offboarding)** — Removing accounts and access when someone leaves or no longer needs it. The most-forgotten identity step.

**Detection** — A rule or analytic that identifies suspicious/malicious activity in telemetry.

**Detection-as-code** — Managing detections like software: version-controlled, peer-reviewed, and tested.

**Detection engineer** — A defensive role that builds and tunes detections.

**Device posture** — A device's security health (patched, managed, uncompromised), checked at access time.

**DevSecOps** — Integrating security into the automated development/CI-CD pipeline rather than bolting it on at the end.

**Diffie-Hellman** — A key-exchange protocol letting two parties derive a shared secret over a public channel.

**Digital signature** — Data produced with a private key that anyone can verify with the public key; proves authenticity and integrity.

**Disk forensics** — Analysis of stored data (files, logs, metadata, deleted remnants) from a storage image.

**DMZ (demilitarized zone)** — A buffer network segment for internet-facing systems, isolated from internal resources.

**DoS / DDoS** — Denial of Service / Distributed DoS: making a system unavailable, from one or many sources.

**DOM-based XSS** — XSS where client-side JavaScript writes attacker input into a dangerous DOM sink, with no server involvement.

**Due diligence** — Assessing a vendor's security posture before and during a relationship.

**Dwell time** — How long an attacker is present before detection. Shorter = less damage.

**Dynamic secret** — A short-lived credential generated on demand and auto-expiring, so a leak's window is tiny. See *static secret*.

## E

**East-west traffic** — Traffic *between* internal systems (lateral); what segmentation controls. See *north-south*.

**ECB (Electronic Codebook)** — A broken cipher mode where identical plaintext blocks encrypt identically, leaking patterns. Never use it.

**ECC (Elliptic-Curve Cryptography)** — Public-key crypto with much smaller keys than RSA for equivalent strength.

**EDR (Endpoint Detection & Response)** — Software on endpoints that records detailed activity and detects/responds to threats.

**Egress filtering** — Controlling *outbound* network traffic to limit data exfiltration and C2. See *ingress filtering*.

**Enrichment** — Adding context to events (geolocating an IP, tagging a user's role) so detections are smarter.

**Envelope encryption** — Encrypt data with a data key, then encrypt that data key with a KMS master key that never leaves the KMS.

**Eradication** — Fully removing an attacker's access, tools, and persistence from the environment.

**Escaping** — Marking special characters so they're treated literally; a fragile defense for injection (prefer parameterization).

**Evidence (artifact)** — Proof a control exists and operates (configs, logs, records); the hardest, most-neglected part of compliance.

**Excessive agency** — Granting an LLM more capability, autonomy, or permission than the task requires; the root AI-agent risk.

**Exfiltration** — Transferring stolen data out of a victim network.

**Exploit** — The technique, tool, or code that turns a vulnerability into real harm.

## F

**Fail closed (fail-safe defaults)** — When something errors or is undefined, *deny*. The opposite (*fail open*) turns outages into breaches.

**False positive / false negative** — An alert that fired but was benign / a real attack that didn't fire. Tuning trades them off.

**Federation** — Extending identity trust across systems or organizations, so one domain's identity is accepted by another.

**FedRAMP** — A rigorous US-government authorization for cloud providers.

**Fileless malware** — Malicious code that runs only in memory, leaving little or nothing on disk.

**Firewall** — A control that allows/denies network connections based on IP, port, protocol, and direction.

**Flat network** — One undivided network where all hosts can reach each other; maximal blast radius.

**Forensic image** — A bit-for-bit exact copy of storage (or memory) so you investigate the copy, never the original.

**Forward secrecy** — A property where stealing a long-term key later can't decrypt past recorded sessions (from ephemeral key exchange).

**Fourth-party risk** — Risk from your *vendors' vendors* — the dependencies of the parties you depend on.

**Function-level access control** — Checking that a user may invoke a given operation (e.g., only admins call `DELETE /users`).

## G

**Gadget chain** — A sequence of existing classes an attacker triggers during insecure deserialization to achieve code execution.

**GDPR** — An EU privacy law governing personal data, with data rights, a 72-hour breach-notification rule, and large fines.

**GRC (Governance, Risk & Compliance)** — The program/process side of security: frameworks, audits, risk, vendor management.

**Grey box (testing)** — Testing with partial knowledge (some docs, a low-priv account); the common, efficient middle ground.

**Guardrails vs. gates** — Guardrails guide toward safe choices continuously; gates block a release if a check fails.

## H

**Handshake** — The initial TLS negotiation that authenticates the server and establishes session keys before data flows.

**Hash (digest, fingerprint)** — A one-way, fixed-size fingerprint of data; deterministic, irreversible, collision-resistant.

**HIPAA** — A US law protecting health information (PHI), with privacy and security rules.

**HMAC** — The standard *MAC* construction (e.g., HMAC-SHA256).

**Home lab** — A self-owned, deliberately-vulnerable environment for practicing security skills safely and legally.

**HSM (Hardware Security Module)** — A tamper-resistant device that stores keys and performs crypto internally; keys never leave it.

**HttpOnly** — A cookie flag making a cookie unreadable to JavaScript, so XSS can't steal it directly.

**Human-in-the-loop** — Requiring human approval before a high-impact (especially AI) action executes.

## I

**IAM (Identity and Access Management)** — The system governing which identities can perform which actions on which resources.

**IaC (Infrastructure-as-Code)** — Defining infrastructure in version-controlled files (Terraform, etc.); reviewable, repeatable, scannable.

**IC (Individual Contributor) track** — The deep-technical career path (senior → staff → principal) without managing people.

**IdP (Identity Provider)** — The trusted system that authenticates users and asserts their identity to apps.

**IDOR (Insecure Direct Object Reference)** — An access-control flaw where changing an identifier exposes another user's data.

**IDS / IPS** — Intrusion Detection/Prevention System: monitors traffic for malicious patterns and (IPS) blocks them.

**Incident** — A confirmed or strongly suspected violation of security policy; a real breach or attack.

**Incident commander** — The person coordinating an incident response (decisions, communication).

**Incident response (IR)** — The disciplined process to prepare for, contain, investigate, and recover from a security incident.

**Indirect injection** — Prompt injection where malicious instructions arrive in content the model processes (a web page, document, email).

**Ingress filtering** — Controlling inbound traffic; the traditional firewall focus. See *egress filtering*.

**Injection** — A flaw where untrusted input is interpreted as a command (SQL, OS, template, etc.).

**Input validation** — Checking incoming data matches what's expected (type, length, format, range) and rejecting it if not.

**Insecure output handling** — Trusting/forwarding LLM output without treating it as untrusted; a common, overlooked LLM-app bug.

**Integrity** — The CIA property that data is accurate and unaltered except by authorized parties.

**IOC (Indicator of Compromise)** — A specific artifact of a known attack (a hash, an IP); easy to match, easy for attackers to change.

**ISMS (Information Security Management System)** — An ongoing, systematic program for managing security risk (the heart of ISO 27001).

**ISO 27001** — A comprehensive international standard for running an ISMS.

## J

**Jailbreak** — A prompt injection aimed at bypassing a model's safety/guardrail instructions.

**JIT (Just-in-Time) access** — Granting a privilege only for the moment it's needed, then automatically revoking it.

**JML (Joiner-Mover-Leaver)** — The identity lifecycle: onboarding, role changes, offboarding.

**JWT (JSON Web Token)** — A self-contained, signed token carrying identity claims; powerful and easy to misuse (e.g., `alg:none`).

## K

**KDF (Key Derivation Function)** — A deliberately slow, salted function (bcrypt, scrypt, Argon2) for hashing passwords / deriving keys.

**Kerckhoffs's principle** — A system should stay secure even if everything except the key is public (no security by obscurity).

**Key** — The shared secret (symmetric) or key pair (asymmetric) on which cryptographic security rests.

**Key exchange** — A protocol letting two parties derive a shared key over a public channel (e.g., Diffie-Hellman).

**KMS (Key Management Service)** — A managed service that generates, stores, and uses keys while keeping master keys inside the service.

## L

**Lateral movement** — Pivoting from one compromised system to more valuable ones deeper in the network.

**Least privilege** — Granting only the minimum permissions/access needed, nothing more.

**Living off the land (LOTL)** — Using a system's own legitimate built-in tools instead of obvious malware, to evade detection.

**Long-lived (static) credential** — An access key that doesn't expire; convenient, dangerous, the classic leaked secret.

## M

**MAC (Message Authentication Code)** — A keyed tag proving a message's integrity and authenticity (e.g., HMAC).

**Memory forensics** — Analysis of a capture of a system's RAM, revealing live runtime state (processes, connections, keys).

**MFA (Multi-Factor Authentication)** — Requiring two+ independent factors (know / have / are); the top control against credential attacks.

**Microsegmentation** — Fine-grained segmentation down to individual workloads/services, often enforced by identity.

**MITRE ATT&CK** — A public knowledge base of real-world attacker tactics and techniques, used to organize detections and assess coverage.

**Misconfiguration** — An insecure setting (public access, open ports, no encryption, excess permissions); a leading cloud breach cause.

**MTTD / MTTR** — Mean Time To Detect / Respond: core SOC performance metrics (lower = less dwell time).

**mTLS (Mutual TLS)** — TLS where *both* parties present certificates, so each authenticates the other; key to zero-trust service-to-service.

## N

**NetFlow / flow data** — Summaries of network connections (who, when, how much) without full packet contents; lighter than PCAP.

**Nonce / IV** — A Number used once: a unique value fed in with a key so identical plaintext encrypts differently. Never reuse with the same key.

**Non-determinism (AI)** — The same input can produce different outputs, so attacks succeed probabilistically, not reliably.

**Normalization** — Converting diverse log formats into a consistent schema so events can be correlated.

**North-south traffic** — Traffic in and out of a network. See *east-west*.

## O

**OIDC / OAuth** — Standard protocols for authentication and authorization, used in SSO/federation.

**Order of volatility** — Collecting the most ephemeral evidence first (memory before disk before backups).

**ORM (Object-Relational Mapper)** — A library that builds DB queries and parameterizes by default; safe unless you drop to raw SQL.

**Orphaned account** — An account still active after its owner has left or no longer needs it; a prime attack target.

**OSCP** — A respected hands-on offensive certification with a grueling practical exam.

**OSINT (Open-Source Intelligence)** — Intelligence assembled from publicly available sources; the basis of passive recon.

**OWASP** — The Open Worldwide Application Security Project; a nonprofit producing free security resources.

**OWASP Top 10** — The industry's prioritized list of the most critical web application risk categories.

**OWASP LLM Top 10** — The standard catalog of the most critical LLM-application security risks.

## P

**Parameterized query (prepared statement)** — Sending query structure and data separately so user input is always a value, never SQL. The real injection fix.

**Password spraying** — Trying one common password against many accounts (to dodge lockouts). See *brute force*.

**Patient zero** — The first compromised system or entry event in an incident.

**PCAP** — A captured file of raw network packets ("packet capture").

**PCI-DSS** — A prescriptive standard (mandated by card brands) for protecting payment-card data.

**PDP / PEP** — Policy Decision Point (evaluates each access request) and Policy Enforcement Point (enforces the decision); the zero-trust architecture core.

**Penetration test (pentest)** — An authorized, scoped assessment that finds and demonstrates vulnerabilities, ending in a report.

**Persistence** — A durable way back into a compromised system that survives reboots, password changes, or the original hole being patched.

**PHI / PII** — Protected Health Information / Personally Identifiable Information; regulated data categories.

**PKI (Public Key Infrastructure)** — The system of CAs and certificates that binds public keys to identities (the trust behind HTTPS).

**Plaintext** — Readable, unencrypted data. See *ciphertext*.

**Playbook (runbook)** — A documented, repeatable procedure for handling a given alert/incident type.

**Post-exploitation** — What an attacker does after the first foothold: escalate, move laterally, persist, exfiltrate.

**Privilege escalation** — Gaining higher rights than granted: *vertical* (user → admin) or *horizontal* (one user → another).

**Privilege creep** — Accumulating access over time (especially across role changes) without losing the old.

**Proof of concept (PoC)** — A safe demonstration that a vulnerability is genuinely exploitable, without causing damage.

**Prompt injection** — An attack where untrusted text smuggles instructions an LLM then follows; the central reason an LLM is not a security boundary.

**Provenance** — Verifiable metadata about where an artifact came from and how it was built.

**Provisioning** — Creating accounts and granting access when someone joins or changes roles.

**Purple team** — Red and blue teams working together so every attack immediately improves a detection.

**Pyramid of Pain** — A model ranking indicators by how much pain it costs an attacker to change them (hashes/IPs easy → TTPs hard).

## R

**RAG (Retrieval-Augmented Generation)** — Feeding a model retrieved documents at query time; creates an indirect-injection and access-control surface.

**Rate limiting** — Capping how many requests a client can make in a window; a key DoS/abuse defense.

**RBAC (Role-Based Access Control)** — Authorization by assigned roles. See *ABAC*.

**Reconnaissance** — The attacker's mapping phase: discovering an organization's attack surface (passive then active).

**Red team** — Authorized adversary simulation pursuing an objective stealthily to test detection and response.

**Residual risk** — The risk that remains after a treatment/control is applied.

**Responsible disclosure** — Reporting a vulnerability privately to the owner and allowing time to fix before public discussion.

**Revocation** — Invalidating a certificate before it expires (CRL, OCSP), typically after key compromise.

**Risk** — Likelihood × impact of a threat exploiting a vulnerability; the basis for prioritization.

**Risk register** — The living document tracking identified risks, their scores, owners, treatments, and status.

**Risk treatment** — The chosen response to a risk: mitigate, accept, transfer, or avoid.

**Rotation** — Replacing a key/secret on a schedule or after suspected compromise.

**RSA** — A widely-used public-key algorithm based on the difficulty of factoring large numbers.

**Rules of Engagement (RoE)** — The agreed constraints of a test: scope, allowed methods, timing, handling, and emergency contacts.

## S

**Salt** — A unique random value added per password before hashing, so identical passwords hash differently.

**Same-origin policy** — The browser rule that code from one origin can't freely read another's data; XSS runs within the trusted origin to bypass it.

**Sanitization** — Neutralizing data so it can't be misinterpreted as a command by whatever consumes it next.

**SAST (Static Application Security Testing)** — Analyzing source code for vulnerabilities without running it. See *DAST*.

**SBOM (Software Bill of Materials)** — A complete inventory of every component in software, used for supply-chain risk and incident response.

**SCA (Software Composition Analysis)** — Scanning dependencies for known vulnerabilities (CVEs) and license issues.

**Scope** — The exact systems/data authorized for testing (offensive), or covered by a compliance effort.

**Scrubbing** — Routing traffic through a service that filters out DDoS attack traffic and forwards only the legitimate portion.

**Secret** — Any credential: key, API token, password, connection string.

**Secret scanning** — Tooling that detects credentials accidentally committed to source control.

**Secure by default** — Arranging tools and conventions so the easy path is the secure path; preventing whole bug classes.

**Security boundary** — A control an attacker cannot cross by persuasion (parameterization, authorization, deterministic gates). An LLM is *not* one.

**Security champion** — A developer on a product team who carries extra security context and bridges to the security team.

**Security group** — The cloud equivalent of firewall rules attached to resources/subnets.

**Security incident** — Any event that compromises security; the broad category. See *data breach*.

**Segmentation** — Dividing a network into isolated zones with controlled crossings, to limit lateral movement and blast radius.

**Separation of duties** — Splitting a sensitive action so no single person/credential can complete it alone.

**Service mesh** — Infrastructure managing service-to-service communication, often providing mTLS and workload identity automatically.

**Session fixation** — An attack where the attacker sets a victim's session ID before login and reuses it after.

**Session token** — The value (cookie or JWT) representing a logged-in session on later requests; as good as the password once issued.

**Shared responsibility model** — The split where the cloud provider secures the cloud itself and the customer secures what they put in it.

**Shift left** — Moving security earlier in the development lifecycle, where fixes are cheaper.

**SIEM (Security Information and Event Management)** — A platform that aggregates, normalizes, and correlates security telemetry for detection and investigation.

**Signal-to-noise** — A detection's ratio of real findings to false alarms; the measure of its value.

**Signing (artifact)** — Cryptographically signing a build output so consumers can verify it's authentic and unmodified.

**SLSA** — "Supply-chain Levels for Software Artifacts": a graded framework for build-pipeline integrity.

**SNI (Server Name Indication)** — The hostname a TLS client requests; historically visible to network observers.

**SOAR (Security Orchestration, Automation & Response)** — Tooling that automates response actions and playbooks on alerts.

**SOC (Security Operations Center)** — The team and process that monitors, triages, and responds to security alerts.

**SOC 2** — A widely-used report demonstrating a service provider's controls against Trust Services Criteria.

**Social engineering** — Manipulating humans into revealing information or access (phishing, pretexting); often the easiest path in.

**SQL injection (SQLi)** — Injection into a database query; the classic and still one of the most damaging.

**SSL** — The obsolete predecessor to TLS; people still say "SSL certificate" out of habit.

**SSO (Single Sign-On)** — Authenticating once to a central identity provider to access many apps.

**SSRF (Server-Side Request Forgery)** — Tricking a server into making attacker-chosen requests, often reaching internal/cloud systems.

**Standing access** — Permissions that exist all the time whether used or not; what least privilege tries to minimize.

**Stateful firewall** — A firewall that tracks connection state (knows a response belongs to an allowed request).

**Static secret** — A long-lived secret that persists until manually changed. See *dynamic secret*.

**STRIDE** — A threat-modeling checklist: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.

**Stored XSS** — XSS where the payload is saved server-side and served to everyone who views the content; the most dangerous type.

**Stream cipher** — A cipher that encrypts data continuously, bit/byte at a time (e.g., ChaCha20). See *block cipher*.

**Supply chain (software)** — Everything that goes into building and delivering software: source, dependencies, build tools, CI/CD, registries.

**Symmetric encryption** — Encryption using one shared secret key for both encryption and decryption. Fast; used for bulk data.

**System prompt** — The developer's instructions to an LLM, which a prompt injection tries to override or leak.

## T

**Tabletop exercise** — A rehearsal where a team walks through a simulated incident to test the plan before a real one.

**Tactic (ATT&CK)** — *Why* an attacker does something — the goal of a step (Initial Access, Persistence, Lateral Movement, etc.).

**Technique (ATT&CK)** — *How* an attacker achieves a tactic (e.g., Phishing for Initial Access).

**Telemetry** — The stream of data systems emit about what they're doing (logs, events, metrics); the raw material of detection.

**Temporary credential** — A short-lived credential from assuming a role, expiring automatically, so a leak is far less damaging.

**Threat** — A potential cause of harm (an adversary or event); distinct from a *vulnerability* and *risk*.

**Threat actor (adversary)** — The specific person or group behind a threat.

**Threat hunting** — Proactively searching telemetry for attackers without a triggering alert, on a hypothesis.

**Threat intelligence (CTI)** — Evidence-based knowledge about adversaries and their methods, used to inform defense.

**Threat-informed defense** — Prioritizing defenses based on the techniques *your* actual adversaries use.

**Threat modeling** — Systematically imagining how a design could be attacked before building it (the four questions + STRIDE).

**Timeline reconstruction** — Stitching timestamped artifacts into one ordered story of what an attacker did, when.

**Timestomping** — An anti-forensic technique where an attacker forges file timestamps to mislead investigators.

**TLS (Transport Layer Security)** — The protocol that secures network traffic; HTTPS is HTTP over TLS.

**Tool calling (function calling)** — Connecting a model to external actions (APIs, code, database access) it can invoke.

**Transitive dependency** — A dependency of a dependency; most of an app's dependencies are transitive and unreviewed.

**Trapdoor function** — A math operation easy one way but infeasible to reverse without a secret; the basis of public-key crypto.

**Triage** — Rapidly assessing an alert's validity and priority to decide what gets attention.

**Trust boundary** — A point where the level of trust changes, typically where untrusted data enters something trusted; where bugs become breaches.

**TTP (Tactics, Techniques, and Procedures)** — *How* an adversary operates; durable, high-value detection targets.

**Type I vs. Type II (audit)** — Type I assesses control *design* at a point in time; Type II assesses *operating effectiveness* over a period.

**Typosquatting** — Publishing a malicious package with a near-miss name (`reqeusts`) hoping for a typo'd install.

## V

**Vendor (third-party) risk** — The risk that a supplier, SaaS, or partner you depend on is the source of an incident affecting you.

**VPN (Virtual Private Network)** — An encrypted tunnel connecting a client or site to a private network over the internet.

**Volumetric attack** — A DDoS that overwhelms bandwidth/network capacity with raw traffic volume.

**Vulnerability** — A weakness in a system that a threat could exploit.

## W

**WAF (Web Application Firewall)** — A filter that inspects HTTP request *contents* to block web attacks; a layer, not a fix.

**White box (testing)** — Testing with full knowledge (source, architecture, credentials); most thorough, least realistic.

**Workload identity** — A verifiable identity assigned to a service/workload (not a human), used to authenticate service-to-service calls.

**Write blocker** — Hardware/software allowing a device to be read but not written, so imaging can't alter the original.

## X

**XDR (Extended Detection & Response)** — A more integrated, vendor-unified evolution bundling telemetry collection, correlation, and response.

**XSS (Cross-Site Scripting)** — Injection where the abused interpreter is the victim's browser and the payload is JavaScript.

**XXE (XML External Entity)** — An attack abusing XML external-entity processing to read server files, trigger SSRF, or cause DoS.

## Z

**Zero trust** — A model that trusts no connection by network location and verifies identity/context on every request.

**ZTNA (Zero Trust Network Access)** — Access verified per request, per resource, granting access to specific applications rather than the whole network.

---

*This glossary is a backstop; each term is also defined inline in the lesson that introduces it. If a term you need isn't here, the [search bar](/) finds where it's taught.*
