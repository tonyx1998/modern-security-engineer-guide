---
id: symmetric-encryption
title: Symmetric Encryption
sidebar_position: 2
sidebar_label: Symmetric encryption
description: One shared key to lock and unlock — AES and ChaCha20, why modes and nonces matter, and the modern default you should always reach for (authenticated encryption / AEAD).
---

# Symmetric Encryption

> **In one line:** Symmetric encryption uses **one shared secret key** to both scramble (encrypt) and unscramble (decrypt) data — it's fast and protects confidentiality, but only if you use an **authenticated** mode (AEAD) and never reuse a nonce.

:::tip[In plain English]
Imagine a lockbox with a single key. You lock your message inside and slide the box to a friend; they use an identical copy of the key to open it. Anyone who intercepts the box on the way sees only a sealed box, not the message. That's symmetric encryption: *the same key locks and unlocks.* It's wonderfully fast — fast enough to encrypt entire video streams — but it has one hard problem baked in: *how do both of you get the same key without an eavesdropper stealing it?* (That problem is solved by the next lesson, [asymmetric encryption](./asymmetric-encryption).) For now, assume you both already share a key, and focus on using it *correctly* — because the way most people get this wrong isn't the algorithm, it's the details around it.
:::

## The core idea

**Symmetric encryption** (also "secret-key" encryption) transforms readable **plaintext** into unreadable **ciphertext** using a secret **key**, and reverses it with the *same* key.

```
plaintext  +  key  ── encrypt ──▶  ciphertext
ciphertext +  key  ── decrypt ──▶  plaintext
```

Without the key, ciphertext from a strong algorithm is indistinguishable from random noise. The security rests entirely on **the key being secret** — never on the algorithm being secret. (This is **Kerckhoffs's principle**: a system should stay secure even if everything about it *except the key* is public. It's why we trust open, peer-reviewed algorithms over secret ones — see "[never roll your own](#why-it-matters)".)

:::note[Terms, defined once]
- **Plaintext / ciphertext** — the readable input and the scrambled output.
- **Key** — the shared secret, a random string of bits. Modern keys are typically **256 bits** (or 128). Bigger = exponentially harder to brute-force.
- **Cipher** — the algorithm that does the scrambling (e.g., AES).
- **Block cipher** — a cipher that encrypts fixed-size chunks ("blocks," e.g. 16 bytes) at a time. AES is a block cipher.
- **Stream cipher** — a cipher that encrypts data one bit/byte at a time as a continuous stream. ChaCha20 is a stream cipher.
- **Nonce / IV** — a **N**umber used **once** (Initialization Vector). A unique value fed in alongside the key so that encrypting the *same* plaintext twice produces *different* ciphertext. Critical, and a top source of catastrophic bugs.
:::

## The two ciphers you'll actually meet

You will essentially never need to choose anything exotic. In 2026 the two workhorses are:

- **AES (Advanced Encryption Standard)** — the global standard block cipher since 2001. Hardware-accelerated on virtually every modern CPU (the `AES-NI` instructions), so it's blazing fast. Use **AES-256** (256-bit key).
- **ChaCha20** — a stream cipher that's fast *in software* even on devices without AES hardware (older phones, embedded chips). Common on mobile and in modern protocols.

Both are considered secure. The right answer to "which cipher?" is almost always "whichever your vetted library defaults to in an authenticated mode" — which brings us to the part that actually matters.

## The part everyone gets wrong: modes and AEAD

A block cipher like AES only knows how to encrypt *one 16-byte block*. To encrypt a real message (longer than one block) you need a **mode of operation** — the scheme for chaining blocks together. **The mode matters more than the cipher.** Here's the canonical disaster:

:::caution[Worked example: why "ECB mode" leaks your data]
**ECB (Electronic Codebook)** is the naïve mode: chop the message into blocks and encrypt each block independently with the key.

The fatal flaw: *identical plaintext blocks produce identical ciphertext blocks.* So the *structure* of your data survives encryption. The famous demonstration is the "ECB penguin" — encrypt a bitmap of the Linux mascot with AES-ECB and you can still see the penguin in the ciphertext, because every white region encrypts to the same value.

```
Plaintext blocks:   [AAAA][BBBB][AAAA][CCCC][AAAA]
ECB ciphertext:     [ X  ][ Y  ][ X  ][ Z  ][ X  ]   ← repeats leak the pattern!
```

The cipher (AES) is perfect. The *mode* (ECB) destroys confidentiality by preserving patterns. **Never use ECB.**
:::

The fix is a mode that makes identical plaintext encrypt differently each time — achieved by mixing in a unique **nonce/IV** per message. And the *modern* fix doesn't stop at confidentiality; it adds **integrity** too:

**AEAD — Authenticated Encryption with Associated Data — is the modern default.** An AEAD mode gives you two guarantees in one operation:

1. **Confidentiality** — the data is encrypted (an eavesdropper can't read it).
2. **Integrity + authenticity** — a built-in **authentication tag** proves the ciphertext wasn't tampered with. If even one bit is flipped in transit, decryption *fails loudly* instead of returning garbage.

The two AEAD constructions you'll see everywhere:

- **AES-GCM** (AES in Galois/Counter Mode) — the most common AEAD; hardware-accelerated.
- **ChaCha20-Poly1305** — AEAD pairing ChaCha20 with the Poly1305 authenticator; the software-fast choice.

:::info[Highlight: if you remember one thing about symmetric crypto]
**Reach for AEAD (AES-GCM or ChaCha20-Poly1305), never plain encryption.** Encryption *without* authentication (older modes like CBC alone) protects secrecy but leaves the door open to tampering attacks where an attacker flips bits to alter the decrypted result. AEAD closes that door by default. When a library offers a high-level "encrypt" that's AEAD under the hood (e.g., libsodium's `secretbox`), use it and don't assemble primitives yourself.
:::

## The nonce rule (the other way people blow up)

AEAD is only safe if you **never reuse a nonce with the same key.** A nonce must be unique for every message encrypted under a given key.

:::caution[Worked example: nonce reuse in AES-GCM is catastrophic]
With AES-GCM, reusing a nonce for two different messages under the same key lets an attacker:
- recover the **authentication key**, after which they can *forge* valid ciphertexts (total integrity loss), and
- XOR the two ciphertexts to leak relationships between the two plaintexts (confidentiality loss).

This isn't theoretical — it's how real systems have been broken. The rule is absolute: **one nonce, one message, ever, per key.**

How to satisfy it safely:
- **Random nonces** from a cryptographically secure random generator (fine when nonces are large, e.g. ChaCha20-Poly1305's 192-bit XChaCha variant, where random collisions are astronomically unlikely).
- **Counter-based nonces** that increment per message (and never reset) — common when you control state.
- Best of all: **let a high-level library manage nonces for you** so you can't get it wrong.
:::

## Why it matters

- **It's the bulk workhorse.** Symmetric crypto encrypts the actual *data* almost everywhere: your disk (full-disk encryption), your database at rest, your HTTPS traffic after the handshake, your backups. Asymmetric crypto, next lesson, is used mostly to *set up* a shared symmetric key — then symmetric does the heavy lifting because it's far faster.
- **It maps cleanly to the [CIA triad](/docs/foundations/cia-triad).** Plain encryption → confidentiality. *Authenticated* encryption (AEAD) → confidentiality **and** integrity in one step. That's why AEAD is the default: it covers two legs at once.
- **The failure modes are about usage, not math.** AES has never been broken. The breaches come from ECB mode, reused nonces, missing authentication, and hardcoded keys — all *usage* errors, which is exactly why "don't roll your own" matters.

:::caution[Never roll your own crypto]
You should **use vetted, high-level libraries** (libsodium/NaCl, your platform's audited crypto module, a well-reviewed language library) and standard constructions — never invent your own cipher, mode, or protocol, and never hand-assemble primitives when a high-level "encrypt this" API exists. Every catastrophic crypto bug in this lesson (ECB, nonce reuse, missing auth tag) is avoided automatically by good libraries and introduced reliably by DIY code.
:::

## Common pitfalls

:::caution[Where people commonly trip up]
- **Using ECB mode** (or any unauthenticated mode) because it's the "simplest" example in a tutorial. ECB leaks patterns; unauthenticated modes allow tampering. Use AEAD.
- **Reusing a nonce/IV** with the same key — catastrophic for AES-GCM. Generate a fresh unique nonce per message, or let a library do it.
- **Encrypting without authenticating.** "It's encrypted" is not "it's tamper-proof." Without an auth tag, an attacker can flip bits to manipulate the plaintext. AEAD gives you both.
- **Confusing encryption with hashing.** Encryption is *reversible* (you can get the plaintext back with the key). Hashing is *one-way*. Passwords are hashed, not encrypted — covered in [hashing & MACs](./hashing-and-macs).
- **Hardcoding the key** in source code or config. A key in your Git history is a public key. Key storage is its own discipline — see [key management](./key-management).
- **Believing a bigger key fixes a broken mode.** AES-256-ECB is no safer than AES-128-ECB; the mode is the problem, not the key size.
:::

## Page checkpoint

<Quiz id="symmetric-encryption-page" title="Did symmetric encryption stick?" sampleSize={3}>

<Question
  prompt="What defines SYMMETRIC encryption?"
  options={[
    { text: "It uses a public key to encrypt and a private key to decrypt" },
    { text: "The same secret key both encrypts and decrypts" },
    { text: "It is one-way and cannot be reversed" },
    { text: "It never requires a key" }
  ]}
  correct={1}
  explanation="Symmetric = one shared key for both directions. (Different keys for encrypt vs decrypt is ASYMMETRIC, the next lesson. One-way with no reversal is hashing.)"
  revisit={{ to: "/docs/cryptography/symmetric-encryption#the-core-idea", label: "The core idea" }}
/>

<Question
  prompt="You encrypt an image with AES in ECB mode and the original picture is still faintly visible in the ciphertext. Why?"
  options={[
    { text: "AES-256 is broken" },
    { text: "ECB encrypts identical plaintext blocks to identical ciphertext blocks, so repeating patterns survive — the mode, not the cipher, is the flaw" },
    { text: "The key was too short" },
    { text: "The image wasn't compressed first" }
  ]}
  correct={1}
  explanation="AES is fine; ECB is the problem. Because each block is encrypted independently, identical input blocks yield identical output blocks, preserving structure. Use an authenticated mode (AEAD) that mixes in a unique nonce."
  revisit={{ to: "/docs/cryptography/symmetric-encryption#the-part-everyone-gets-wrong-modes-and-aead", label: "Modes and AEAD" }}
/>

<Question
  prompt="What does AEAD (e.g., AES-GCM, ChaCha20-Poly1305) give you that plain encryption does not?"
  options={[
    { text: "A larger key" },
    { text: "Built-in integrity/authenticity via an auth tag, so tampering is detected — confidentiality AND integrity in one operation" },
    { text: "Faster decryption only" },
    { text: "The ability to skip the key" }
  ]}
  correct={1}
  explanation="AEAD adds an authentication tag: if the ciphertext is altered, decryption fails loudly instead of returning manipulated plaintext. It covers two CIA legs — confidentiality and integrity — at once, which is why it's the modern default."
  revisit={{ to: "/docs/cryptography/symmetric-encryption#the-part-everyone-gets-wrong-modes-and-aead", label: "AEAD is the default" }}
/>

<Question
  prompt="Why must you never reuse a nonce with the same key in AES-GCM?"
  options={[
    { text: "It only makes encryption slightly slower" },
    { text: "It can let an attacker recover the authentication key (forge messages) and leak relationships between plaintexts — catastrophic for both integrity and confidentiality" },
    { text: "Nonces don't matter; only the key does" },
    { text: "It changes the key size" }
  ]}
  correct={1}
  explanation="Nonce reuse under one key breaks AES-GCM badly: forgery becomes possible and plaintext relationships leak. The rule is absolute — one nonce, one message, per key — and the safest path is letting a library manage nonces."
  revisit={{ to: "/docs/cryptography/symmetric-encryption#the-nonce-rule-the-other-way-people-blow-up", label: "The nonce rule" }}
/>

<Question
  prompt="Most catastrophic real-world symmetric-crypto failures come from:"
  options={[
    { text: "AES itself being mathematically broken" },
    { text: "Usage errors — ECB mode, nonce reuse, missing authentication, hardcoded keys — which is why you use vetted libraries and never roll your own" },
    { text: "Keys being too long" },
    { text: "Using hardware acceleration" }
  ]}
  correct={1}
  explanation="The algorithms hold up; the mistakes are around them. High-level vetted libraries prevent ECB, manage nonces, default to AEAD, and keep you from hand-assembling primitives — exactly the errors that cause breaches."
  revisit={{ to: "/docs/cryptography/symmetric-encryption#why-it-matters", label: "Never roll your own" }}
/>

</Quiz>

## What's next

→ Continue to [Asymmetric Encryption & Signatures](./asymmetric-encryption) — which solves the problem we waved away here: *how do two strangers agree on a shared symmetric key over a channel an eavesdropper is watching?*

→ **Going deeper:** symmetric AEAD is what actually encrypts your traffic after the [TLS 1.3 handshake](./tls); where keys come from and live is [key management](./key-management).
