---
id: hashing-and-macs
title: Hashing & MACs
sidebar_position: 4
sidebar_label: Hashing & MACs
description: One-way fingerprints — what cryptographic hashes guarantee, why passwords use deliberately SLOW hashes (bcrypt/argon2) plus salt, and how MACs prove a message wasn't tampered with.
---

# Hashing & MACs

> **In one line:** A cryptographic **hash** is a one-way fingerprint of data — same input always gives the same short output, but you can't run it backward — and the two things beginners most often get wrong are *using a fast hash for passwords* (you need a deliberately slow one, salted) and *confusing a hash with a MAC* (which also proves *who* sent it).

:::tip[In plain English]
A hash is like a blender that turns any amount of data into a fixed-size smoothie. The same fruit always makes the same smoothie, so you can check "is this the same fruit?" by comparing smoothies — but you can never un-blend the smoothie back into fruit. That one-way property is the whole point. It's how a website can check your password *without storing the password*, how you can verify a 4 GB download wasn't corrupted by comparing a tiny fingerprint, and how a signature proves a file is unaltered. The catch: hashing is *not* encryption (there's no key, and you can't reverse it), and the way you hash a *password* is deliberately different — and slower — than the way you hash a file.
:::

## What a cryptographic hash is

A **hash function** takes input of *any* size and produces a fixed-size output (the **hash**, or **digest**), e.g. 256 bits for SHA-256. A *cryptographic* hash has three properties that ordinary hashes (like the ones in a hash table) don't guarantee:

1. **Deterministic** — the same input always yields the same digest.
2. **One-way (preimage resistant)** — given a digest, you can't feasibly find an input that produces it. No "decryption."
3. **Collision resistant** — you can't feasibly find two *different* inputs with the *same* digest. (And a tiny change in input — one bit — produces a completely different, unpredictable digest: the "avalanche effect.")

```
"hello"          ── SHA-256 ──▶  2cf24dba5fb0a30e26e83b2ac5b9e29e...
"hellp"          ── SHA-256 ──▶  9c1185a5c5e9fc54612808977ee8f548...   ← one letter, totally different
"hello" (again)  ── SHA-256 ──▶  2cf24dba5fb0a30e26e83b2ac5b9e29e...   ← identical, always
```

:::note[Terms, defined once]
- **Hash / digest / fingerprint** — the fixed-size output. Three words for the same thing.
- **Collision** — two different inputs producing the same digest. A *cryptographically broken* hash is one where collisions can be found (this killed MD5 and SHA-1).
- **Salt** — a unique random value added to each password before hashing, so identical passwords hash differently. Stored alongside the hash (it's not secret).
- **Pepper** — a *secret* value (kept separately from the database) added to all passwords; an optional extra layer.
- **MAC (Message Authentication Code)** — a hash that also takes a *secret key*, proving both integrity *and* authenticity. HMAC is the standard construction.
- **KDF (Key Derivation Function)** — a deliberately slow, salted function for turning passwords into hashes (or keys): bcrypt, scrypt, Argon2.
:::

## The hashes you should use (and avoid)

- **Use for general hashing:** the **SHA-2 family** (SHA-256, SHA-512) and **SHA-3**, or **BLAKE2/BLAKE3** (fast and modern). These are for file integrity, signatures, deduplication, etc.
- **Never use for security:** **MD5** and **SHA-1**. Both are *broken* — attackers can manufacture collisions, so they can't be trusted for integrity or signatures. (You may still see MD5 used as a non-security checksum against *accidental* corruption; never against a *deliberate* attacker.)

## The password trap: why fast hashes are wrong for passwords

Here's the single most important practical point in this lesson. **You never store passwords. You store hashes of passwords**, so that a stolen database doesn't immediately hand over everyone's password. But *how* you hash matters enormously.

:::caution[Worked example: why SHA-256 is the WRONG way to hash a password]
Say you store passwords as plain `SHA-256(password)`. Two problems:

**Problem 1 — it's too fast.** SHA-256 is designed to be *fast* — a modern GPU computes *billions* per second. An attacker who steals your hash database just hashes every common password and every dictionary word at billions/sec and matches them against your stored hashes. Speed is a *feature* for file integrity but a *disaster* for passwords.

**Problem 2 — identical passwords look identical.** Without a salt, two users with password `123456` have the *same* hash. An attacker cracks it once and owns both — and can precompute giant lookup tables ("rainbow tables") of common-password→hash pairs in advance.

**The fix — a slow, salted password hash (a KDF):**
- **Salt:** add a unique random value per user before hashing, so identical passwords produce different hashes and precomputed tables are useless.
- **Slow on purpose:** use a function deliberately engineered to be *expensive* — **bcrypt**, **scrypt**, or (preferred today) **Argon2**. They take a tunable amount of CPU/memory per hash (say, 100 ms). Imperceptible for your one login; ruinous for an attacker trying billions.

```
WRONG:  store  SHA-256(password)              ← fast, unsalted → cracked in hours
RIGHT:  store  Argon2(password, unique_salt)  ← slow, salted   → cracking is infeasible
```

Modern KDFs handle the salt for you and bake it into the stored output. **Use Argon2id (or bcrypt if that's what your platform offers); never a bare SHA/MD5 for passwords.**
:::

:::info[Highlight: encryption vs hashing for passwords]
Passwords are **hashed, not encrypted.** Encryption is reversible — if you *encrypt* passwords, anyone with the key (an attacker who breaches your server) gets every plaintext password back. Hashing is one-way: even you can't recover the password, which is the point. At login you hash the submitted password and compare digests. If a site can *email you your original password*, they're storing it reversibly — a serious red flag.
:::

## MACs: hashing that also proves *who*

A plain hash proves a message wasn't *accidentally* changed — but an attacker who alters the message can just recompute the hash, so a bare hash alone doesn't stop *deliberate* tampering over a channel. A **MAC (Message Authentication Code)** fixes this by mixing in a **shared secret key**.

```
plain hash:   H(message)            → anyone can recompute it after tampering
MAC:          HMAC(key, message)    → only someone with the secret key can produce/verify it
```

Because only holders of the secret key can compute a valid MAC, a correct MAC proves two things:
- **Integrity** — the message wasn't altered.
- **Authenticity** — it came from someone holding the shared key.

The standard construction is **HMAC** (Hash-based MAC, e.g. `HMAC-SHA256`). MACs are what authenticate API requests (signed webhooks, request signing), session tokens, and — recall the last symmetric lesson — the "authentication tag" inside [AEAD modes](./symmetric-encryption) is doing exactly this MAC job.

:::caution[Use constant-time comparison]
When checking a MAC or any secret, compare with a **constant-time** equality function, not a normal `==`. A normal comparison bails out at the first mismatching byte, and the tiny timing difference can leak the secret one byte at a time (a *timing attack*). Vetted libraries provide `constant_time_compare` / `hmac.compare_digest` for this — another reason not to roll your own.
:::

## How hashing ties the chapter together

- A **digital signature** ([last lesson](./asymmetric-encryption)) is "hash the document, then sign the *hash* with a private key" — the hash gives integrity, the signing gives authenticity. Hashing is the first half of every signature.
- **File integrity / downloads:** publish a SHA-256 of a file so downloaders can verify they got the real, unaltered bytes.
- **AEAD's auth tag** is a MAC over the ciphertext.
- **Password storage** uses slow salted KDFs.

One primitive, four jobs — which is why hashing sits in the middle of the cryptography chapter.

## Why it matters

- **It's how integrity is enforced everywhere.** Signatures, certificates, package managers, blockchains, Git commits (which are content-addressed by hash) — all lean on collision-resistant hashing.
- **Password handling is a rite of passage.** Getting it wrong (fast hash, no salt, or reversible encryption) is one of the most common and damaging real-world mistakes — it turns one database breach into millions of cracked accounts, often reused across other sites.
- **MACs guard the trust boundary.** The [boundary lens](/docs/foundations/trust-boundaries) said "verify data crossing in." A MAC is the cryptographic way to verify a message arriving from elsewhere is authentic and intact.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Hashing passwords with a fast hash (SHA-256, MD5).** Fast is the enemy here. Use a slow, salted KDF (Argon2id, bcrypt, scrypt).
- **No salt (or a shared/static salt).** Unsalted hashes let attackers use precomputed rainbow tables and crack identical passwords once. Salt must be unique per password (modern KDFs do this for you).
- **Encrypting passwords instead of hashing.** Reversible = recoverable by whoever steals the key. Hash, don't encrypt. A site that can email your password back is doing it wrong.
- **Using MD5/SHA-1 for anything security-relevant.** Both are collision-broken. Use SHA-256/SHA-3/BLAKE for integrity and signatures.
- **Confusing a hash with a MAC.** A bare hash doesn't stop a deliberate attacker (they recompute it). If you need to prove a message came from a key-holder, use HMAC, not a plain hash.
- **Comparing secrets with normal equality.** Use constant-time comparison to avoid timing attacks.
:::

## Page checkpoint

<Quiz id="hashing-and-macs-page" title="Hashing & MACs — locked in?" sampleSize={3}>

<Question
  prompt="What is the defining property of a cryptographic hash that makes it suitable for storing password verifiers?"
  options={[
    { text: "It's reversible with the right key" },
    { text: "It's one-way — you can't feasibly recover the input from the digest" },
    { text: "It encrypts the password" },
    { text: "It compresses the password to save space" }
  ]}
  correct={1}
  explanation="Hashing is one-way: from the digest you can't get the password back. That's exactly why it's used for password storage — even you can't recover it, so a breach doesn't directly expose passwords (provided you used a SLOW, salted hash)."
  revisit={{ to: "/docs/cryptography/hashing-and-macs#what-a-cryptographic-hash-is", label: "What a hash is" }}
/>

<Question
  prompt="Why is plain SHA-256 the WRONG choice for hashing passwords?"
  options={[
    { text: "It's too slow to be practical" },
    { text: "It's too fast (attackers hash billions/sec) and, unsalted, identical passwords share a hash — use a slow, salted KDF like Argon2/bcrypt" },
    { text: "It's reversible" },
    { text: "It produces a digest that's too short" }
  ]}
  correct={1}
  explanation="SHA-256's speed is great for file integrity but disastrous for passwords — it lets attackers brute-force stolen hashes at billions/sec. Password hashing needs a deliberately slow, salted KDF (Argon2id preferred, or bcrypt/scrypt)."
  revisit={{ to: "/docs/cryptography/hashing-and-macs#the-password-trap-why-fast-hashes-are-wrong-for-passwords", label: "The password trap" }}
/>

<Question
  prompt="What does a salt accomplish in password hashing?"
  options={[
    { text: "It keeps the hash secret" },
    { text: "A unique random value per password makes identical passwords hash differently and defeats precomputed (rainbow-table) attacks" },
    { text: "It speeds up hashing" },
    { text: "It encrypts the password before hashing" }
  ]}
  correct={1}
  explanation="A salt is a unique per-password random value (stored, not secret). It ensures two users with the same password get different hashes and makes precomputed lookup tables useless. Modern KDFs generate and embed the salt automatically."
  revisit={{ to: "/docs/cryptography/hashing-and-macs#the-password-trap-why-fast-hashes-are-wrong-for-passwords", label: "Why salt" }}
/>

<Question
  prompt="What does a MAC (e.g., HMAC-SHA256) provide that a bare hash does not?"
  options={[
    { text: "Confidentiality — it encrypts the message" },
    { text: "Authenticity — because it mixes in a secret key, a valid MAC proves the message came from a key-holder and wasn't altered" },
    { text: "Faster hashing" },
    { text: "Reversibility of the message" }
  ]}
  correct={1}
  explanation="A bare hash can be recomputed by anyone who tampers with the message. A MAC keys the hash with a shared secret, so only key-holders can produce a valid one — proving integrity AND authenticity. (It doesn't encrypt/hide the message.)"
  revisit={{ to: "/docs/cryptography/hashing-and-macs#macs-hashing-that-also-proves-who", label: "MACs" }}
/>

<Question
  prompt="A website offers a 'forgot password' feature that EMAILS you your original password. What does this reveal?"
  options={[
    { text: "Good security — they kept your password safe" },
    { text: "They're storing passwords reversibly (encrypted or plaintext) instead of hashing them — a serious red flag" },
    { text: "Nothing unusual" },
    { text: "They use Argon2 correctly" }
  ]}
  correct={1}
  explanation="If they can show you your original password, they didn't hash it one-way — they stored it recoverably. A breach (or insider) then exposes every plaintext password. Proper systems hash and can only RESET, never recover, your password."
  revisit={{ to: "/docs/cryptography/hashing-and-macs#the-password-trap-why-fast-hashes-are-wrong-for-passwords", label: "Hash, don't encrypt passwords" }}
/>

</Quiz>

## What's next

→ Continue to [TLS 1.3](./tls) — where symmetric encryption, key exchange, signatures, and hashing all come together into the handshake that secures every HTTPS connection.

→ **Going deeper:** hashing is the first step of every [digital signature](./asymmetric-encryption); the slow-KDF idea reappears in [authentication](/docs/appsec), and constant-time comparison is part of secure coding in [Secure SDLC](/docs/secure-sdlc).
