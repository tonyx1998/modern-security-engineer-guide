---
id: cryptography-overview
title: 2. Cryptography — Overview
sidebar_position: 1
sidebar_label: Cryptography intro
description: The math you actually use — symmetric and asymmetric encryption, hashing, MACs, key derivation, TLS 1.3, PKI and certificates, and key management done right.
---

# Part 2: Cryptography

> **In one line:** Cryptography is how we get confidentiality, integrity, and authenticity over channels and storage we don't trust — and the security engineer's job is rarely to *invent* it (never roll your own) but to *use the right primitive correctly*, which means understanding what each one guarantees and what it doesn't.

:::tip[In plain English]
Crypto feels like deep math, but the working knowledge a security engineer needs is mostly *which tool for which job, and the traps*. When do you use symmetric vs asymmetric encryption? Why is a password "hashed" but never "encrypted"? What does a digital signature actually prove? How does HTTPS set up a secure channel with a stranger? And the cardinal rule: **don't invent your own crypto** — use vetted libraries and standard constructions, because the failures are subtle and catastrophic. This chapter builds that practical fluency from the ground up.
:::

## What this chapter covers

- **Symmetric encryption** — AES/ChaCha20, modes, nonces, and authenticated encryption (AEAD).
- **Asymmetric encryption & signatures** — RSA/ECC, public/private keys, what a signature proves.
- **Hashing & MACs** — one-way functions (SHA-2/3, BLAKE), why password hashing uses slow KDFs (bcrypt/argon2), and message authentication.
- **TLS 1.3** — the handshake that gives you a secure channel with a stranger, and certificate validation.
- **PKI & certificates** — chains of trust, CAs, pinning.
- **Key management** — generation, rotation, storage (KMS/HSM), and the lifecycle that makes or breaks the rest.
- **Post-quantum crypto & crypto-agility** — why the quantum threat is already a today-problem (harvest-now-decrypt-later), the new standards and hybrid TLS, and building so crypto can be swapped.

:::caution[The one rule that prevents most crypto disasters]
**Don't roll your own crypto, and don't roll your own protocol.** Use standard libraries and constructions (e.g. libsodium, the platform's vetted primitives). Nearly every catastrophic crypto bug comes from a custom scheme, a reused nonce, ECB mode, or a missing authentication tag — not from AES being broken.
:::

## The lessons in this chapter

1. **[Symmetric encryption →](/docs/cryptography/symmetric-encryption)** — one shared key (AES/ChaCha20), why modes and nonces matter, and the AEAD default.
2. **[Asymmetric encryption & signatures →](/docs/cryptography/asymmetric-encryption)** — public/private key pairs (RSA/ECC), key exchange, and what a signature proves.
3. **[Hashing & MACs →](/docs/cryptography/hashing-and-macs)** — one-way fingerprints, slow salted password hashing (Argon2/bcrypt), and keyed authentication.
4. **[TLS 1.3 →](/docs/cryptography/tls)** — the handshake that gives you a private, authenticated channel with a stranger.
5. **[PKI & certificates →](/docs/cryptography/pki-certificates)** — chains of trust, Certificate Authorities, revocation, and pinning.
6. **[Key management →](/docs/cryptography/key-management)** — generation, storage (KMS/HSM), rotation, and containing a leak — where crypto actually succeeds or fails.
7. **[Post-quantum crypto & crypto-agility →](/docs/cryptography/post-quantum)** — the quantum threat as a today-problem (harvest-now-decrypt-later), the finalized standards and hybrid TLS, and crypto-agility as the durable design lesson.

Finish with the **[Chapter 2 checkpoint →](/docs/cryptography/cryptography-checkpoint)** to certify the toolkit before Chapter 3.

---

→ Start here: [Symmetric encryption](/docs/cryptography/symmetric-encryption).
