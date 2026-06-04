---
id: cryptography-checkpoint
title: Chapter 2 Checkpoint
sidebar_position: 8
sidebar_label: ✅ Chapter checkpoint
description: Prove the cryptography stuck — a mixed quiz across symmetric and asymmetric encryption, hashing and MACs, TLS 1.3, PKI/certificates, and key management.
---

# Chapter 2 Checkpoint

> **The cryptographic toolkit, all together.** This mixed quiz pulls from every lesson in the chapter. Passing means you can pick the right primitive for a job, explain what each guarantees, and avoid the usage traps that cause almost all real-world crypto failures.

:::tip[How this works]
The quiz draws a random selection from a larger bank each attempt, so retaking gives fresh questions. The recurring theme across every lesson: **the algorithms are rarely the weak point — the usage is.** ECB mode, nonce reuse, fast password hashes, ignored cert errors, and hardcoded keys are where systems actually break. If a question stings, follow its revisit link.
:::

## What you should be able to do now

- **Pick symmetric vs asymmetric** for a task — and explain the hybrid model (asymmetric to set up, symmetric to do the work).
- **Default to AEAD** and state why authenticated encryption beats plain encryption, plus the absolute nonce rule.
- **Choose the right one-way function**: a fast hash (SHA-2/3, BLAKE) for integrity, a slow salted KDF (Argon2/bcrypt) for passwords — and never encryption for passwords.
- **Explain what a signature, a MAC, and a certificate each prove**, and which key is used for which.
- **Trace a TLS 1.3 handshake** and say exactly what the certificate, the key exchange, and the symmetric phase each contribute.
- **Manage keys**: CSPRNG generation, KMS/HSM storage over hardcoding, rotation, and least-privilege scoping to contain a leak.

If any feels shaky, revisit that lesson — Chapter 3 assumes this footing.

## The checkpoint

<Quiz id="cryptography-checkpoint" title="Chapter 2: Cryptography" sampleSize={6} passingScore={0.67}>

<Question
  prompt="What's the difference between symmetric and asymmetric encryption?"
  options={[
    { text: "Symmetric uses one shared key for both directions; asymmetric uses a public/private key pair where one key undoes the other" },
    { text: "Symmetric is one-way; asymmetric is reversible" },
    { text: "Symmetric uses certificates; asymmetric uses passwords" },
    { text: "There is no difference" }
  ]}
  correct={0}
  explanation="Symmetric = one shared secret key (fast, used for bulk data). Asymmetric = a key pair where what one key does only the other undoes (used for key exchange and signatures). Real systems combine them: asymmetric to set up, symmetric for throughput."
  revisit={{ to: "/docs/cryptography/symmetric-encryption#the-core-idea", label: "Symmetric vs asymmetric" }}
/>

<Question
  prompt="Why is AEAD (AES-GCM, ChaCha20-Poly1305) the modern default over plain encryption?"
  options={[
    { text: "It uses a smaller key" },
    { text: "It provides confidentiality AND integrity in one step — an auth tag detects tampering, so altered ciphertext fails loudly" },
    { text: "It needs no nonce" },
    { text: "It's reversible without a key" }
  ]}
  correct={1}
  explanation="AEAD adds an authentication tag, covering two CIA legs at once. Plain encryption hides data but lets an attacker flip bits to manipulate the result. AEAD rejects tampered ciphertext outright."
  revisit={{ to: "/docs/cryptography/symmetric-encryption#the-part-everyone-gets-wrong-modes-and-aead", label: "AEAD" }}
/>

<Question
  prompt="You encrypt an image with AES-ECB and the picture is still visible in the output. The flaw is:"
  options={[
    { text: "AES is broken" },
    { text: "ECB mode — identical plaintext blocks become identical ciphertext blocks, leaking patterns; the cipher is fine, the mode isn't" },
    { text: "The key was too long" },
    { text: "The nonce was random" }
  ]}
  correct={1}
  explanation="The mode matters more than the cipher. ECB encrypts each block independently, so structure survives. Use an authenticated mode (AEAD) with a unique nonce instead."
  revisit={{ to: "/docs/cryptography/symmetric-encryption#the-part-everyone-gets-wrong-modes-and-aead", label: "ECB" }}
/>

<Question
  prompt="To send a secret that only Bob can read, you encrypt with:"
  options={[
    { text: "Your own private key" },
    { text: "Bob's public key — only his matching private key can decrypt it" },
    { text: "A shared password printed publicly" },
    { text: "Bob's private key" }
  ]}
  correct={1}
  explanation="Encrypt for secrecy with the RECIPIENT'S PUBLIC key. Only Bob's private key opens it. (Signing for proof is the reverse: your own private key.)"
  revisit={{ to: "/docs/cryptography/asymmetric-encryption#the-key-pair", label: "Which key, which goal" }}
/>

<Question
  prompt="A digital signature (sign with private key, verify with public key) proves:"
  options={[
    { text: "Confidentiality — the data is hidden" },
    { text: "Authenticity and integrity — it came from the key-holder and wasn't altered — but NOT confidentiality" },
    { text: "That the file is compressed" },
    { text: "Nothing verifiable" }
  ]}
  correct={1}
  explanation="Signing proves origin (only the private key produces signatures the public key verifies) and integrity (any change breaks the hash match). It does not hide the content."
  revisit={{ to: "/docs/cryptography/asymmetric-encryption#use-2-digital-signatures-the-more-common-use-today", label: "Signatures" }}
/>

<Question
  prompt="Why is plain SHA-256 wrong for storing passwords, and what's right?"
  options={[
    { text: "SHA-256 is reversible; use AES" },
    { text: "SHA-256 is too fast (brute-forceable at billions/sec) and unsalted; use a slow, salted KDF like Argon2id or bcrypt" },
    { text: "SHA-256 is too slow; use MD5" },
    { text: "Nothing is wrong with it" }
  ]}
  correct={1}
  explanation="Password hashing must be deliberately slow and salted. SHA-256's speed helps attackers; a salted KDF (Argon2id/bcrypt/scrypt) makes mass cracking infeasible and stops identical passwords from sharing a hash."
  revisit={{ to: "/docs/cryptography/hashing-and-macs#the-password-trap-why-fast-hashes-are-wrong-for-passwords", label: "Password hashing" }}
/>

<Question
  prompt="What does a MAC (HMAC) add over a bare hash?"
  options={[
    { text: "It encrypts the message" },
    { text: "A secret key, so a valid MAC proves the message came from a key-holder and wasn't altered (authenticity + integrity)" },
    { text: "It makes the hash reversible" },
    { text: "It compresses the message" }
  ]}
  correct={1}
  explanation="A bare hash can be recomputed by anyone after tampering. Keying the hash (HMAC) means only key-holders can produce a valid MAC — proving authenticity and integrity. It doesn't provide confidentiality."
  revisit={{ to: "/docs/cryptography/hashing-and-macs#macs-hashing-that-also-proves-who", label: "MACs" }}
/>

<Question
  prompt="In a TLS 1.3 handshake, the server's certificate exists to:"
  options={[
    { text: "Encrypt the bulk data" },
    { text: "Authenticate the server's identity (chained to a trusted CA), defeating a man-in-the-middle who could otherwise relay an encrypted channel to themselves" },
    { text: "Compress the handshake" },
    { text: "Generate the session key alone" }
  ]}
  correct={1}
  explanation="Encryption alone could be set up with an attacker in the middle. The certificate proves you're talking to the real server, validated up to a trusted root. Encryption gives privacy; the certificate gives authentication."
  revisit={{ to: "/docs/cryptography/tls#why-authentication-is-the-part-thats-easy-to-forget", label: "TLS authentication" }}
/>

<Question
  prompt="After the TLS handshake, the bulk HTTP data is encrypted with:"
  options={[
    { text: "Asymmetric RSA, for maximum security" },
    { text: "Symmetric AEAD using the session key, because it's far faster for bulk data (the hybrid model)" },
    { text: "A one-way hash" },
    { text: "Nothing — it's plaintext after the handshake" }
  ]}
  correct={1}
  explanation="The handshake uses asymmetric crypto to authenticate and agree on a shared session key; then fast symmetric AEAD encrypts everything. Asymmetric for setup, symmetric for throughput."
  revisit={{ to: "/docs/cryptography/tls#the-tls-13-handshake-step-by-step", label: "The handshake" }}
/>

<Question
  prompt="A valid, CA-issued DV certificate on a site proves:"
  options={[
    { text: "The site's operator is honest and is the company you expect" },
    { text: "Only that whoever runs the site controls that domain name — not their intentions" },
    { text: "The connection is unencrypted" },
    { text: "The CA personally vouches for the content" }
  ]}
  correct={1}
  explanation="A Domain Validated cert asserts domain control, nothing more. Scammers routinely get valid certs for their own lookalike domains. The padlock authenticates the domain, never the honesty — always check which domain you're on."
  revisit={{ to: "/docs/cryptography/pki-certificates#how-you-get-a-certificate-and-why-its-now-free", label: "What a cert proves" }}
/>

<Question
  prompt="How does a browser decide to trust bank.com's certificate?"
  options={[
    { text: "It trusts whatever certificate is presented" },
    { text: "It verifies the signature chain up to a ROOT CA already in its trusted store, and checks the domain name and validity dates" },
    { text: "It emails the site owner" },
    { text: "It checks that the cert is self-signed" }
  ]}
  correct={1}
  explanation="Trust is transitive: leaf → intermediate → trusted root. If the chain validates to a pre-trusted root, the name matches, and dates are current, the browser trusts the key. Forging this requires a CA's private key."
  revisit={{ to: "/docs/cryptography/pki-certificates#the-chain-of-trust-traced", label: "Chain of trust" }}
/>

<Question
  prompt="A team uses AES-256 but hardcodes the key in a committed config file. Their data is:"
  options={[
    { text: "Safe, because AES-256 is strong" },
    { text: "Effectively unprotected — the key is in version history forever and leaks with every clone; key handling, not the algorithm, is the weak point" },
    { text: "Safe if the repository is private" },
    { text: "Encrypted twice" }
  ]}
  correct={1}
  explanation="Crypto is only as strong as its key management. A hardcoded key is effectively public — it persists in Git history and leaks broadly. Store keys in a secrets manager/KMS, never in code."
  revisit={{ to: "/docs/cryptography/key-management#where-keys-should-live", label: "Where keys should live" }}
/>

<Question
  prompt="What is the main benefit of envelope encryption with a KMS?"
  options={[
    { text: "It avoids using keys entirely" },
    { text: "The master key never leaves the KMS; you store only encrypted data keys, so a stolen database is useless without KMS access — plus centralized rotation and audit logs" },
    { text: "It lets you safely hardcode the master key" },
    { text: "It makes AES reversible" }
  ]}
  correct={1}
  explanation="Envelope encryption keeps the master key inside the KMS/HSM and stores only encrypted data keys with the ciphertext. The raw master key never touches your servers; unwraps are logged and access-controlled."
  revisit={{ to: "/docs/cryptography/key-management#where-keys-should-live", label: "Envelope encryption" }}
/>

<Question
  prompt="Why scope keys narrowly (separate per environment/service) and rotate them regularly?"
  options={[
    { text: "It's cheaper and faster" },
    { text: "Narrow scope limits blast radius if one key leaks; rotation bounds a leak's useful life and ensures you CAN change keys quickly during an incident" },
    { text: "Shared, never-rotated keys are mathematically stronger" },
    { text: "It removes the need for a CSPRNG" }
  ]}
  correct={1}
  explanation="Least privilege applied to keys: one key per job contains a compromise; regular rotation limits exposure time and builds the rotate-fast capability you need when a key is actually leaked."
  revisit={{ to: "/docs/cryptography/key-management#containing-a-compromise", label: "Containing a compromise" }}
/>

</Quiz>

## Chapter 2 complete

You now hold the cryptographic toolkit the rest of the guide leans on: confidentiality from [symmetric AEAD](./symmetric-encryption), trust and setup from [asymmetric keys, signatures](./asymmetric-encryption) and [PKI](./pki-certificates), integrity from [hashing and MACs](./hashing-and-macs), the [TLS](./tls) protocol that fuses them, and the [key management](./key-management) that keeps it all standing. Above all: **use vetted libraries, default to AEAD, hash passwords slowly, and never roll your own.**

→ On to [Chapter 3: Web & Application Security](/docs/appsec) — where this crypto meets the most-attacked surface on the internet, and where the [trust boundaries](/docs/foundations/trust-boundaries) from Chapter 1 become concrete bug classes.
