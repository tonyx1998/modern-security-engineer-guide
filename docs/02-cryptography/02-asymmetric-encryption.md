---
id: asymmetric-encryption
title: Asymmetric Encryption & Signatures
sidebar_position: 3
sidebar_label: Asymmetric & signatures
description: Two keys instead of one — public-key cryptography. How RSA and elliptic curves solve key exchange, what a digital signature actually proves, and where each is used.
---

# Asymmetric Encryption & Signatures

> **In one line:** Asymmetric ("public-key") crypto uses a **pair** of mathematically linked keys — a **public** one you can hand to anyone and a **private** one you guard — which solves two problems symmetric crypto can't: agreeing on a secret with a stranger, and *proving* who sent something (a **digital signature**).

:::tip[In plain English]
Symmetric encryption had a chicken-and-egg problem: to talk securely you both need the same secret key — but how do you share that key without an eavesdropper grabbing it? Public-key crypto is the breakthrough. Picture a mailbox with a slot: *anyone* can drop a letter in (the public key, which you publish to the world), but only the person with the *key to the box* can take letters out (the private key, which never leaves you). Now a stranger can send you a secret without you ever having met. Flip the same idea around and you get **signatures**: only you can produce a mark that anyone can *verify* came from you — a tamper-proof "I really sent this." These two tricks underpin HTTPS, software updates, cryptocurrencies, and SSH.
:::

## The key pair

In asymmetric cryptography every party has **two keys** that are generated together and mathematically linked:

- A **public key** — shareable with anyone. Publish it, print it on a business card, put it in a directory.
- A **private key** — kept secret, *never* shared. If it leaks, your security collapses.

The magic property: **what one key does, only the other can undo.** This gives two distinct uses depending on which key you use first:

| Goal | Encrypt/sign with | Decrypt/verify with | Result |
|------|-------------------|---------------------|--------|
| **Send a secret TO someone** | *their* **public** key | *their* **private** key | Only they can read it (confidentiality) |
| **Prove YOU sent something** | *your* **private** key | *your* **public** key | Anyone can verify it's from you (authenticity + integrity) |

:::note[Terms, defined once]
- **Public / private key** — the shareable half and the secret half of a pair.
- **Key pair** — the two together, generated as a unit.
- **Digital signature** — data produced with a private key that anyone can verify with the matching public key; proves *authenticity* (who) and *integrity* (unaltered).
- **Key exchange / key agreement** — a protocol that lets two parties derive a shared symmetric key over a public channel (e.g., **Diffie-Hellman**).
- **Trapdoor function** — a math operation easy to do one way but infeasible to reverse without the secret. Public-key crypto rests on these.
:::

## How the math holds up (intuition, not memorization)

You don't need the equations, just the shape: asymmetric crypto relies on **problems that are easy in one direction and astronomically hard in reverse** unless you hold the private key.

- **RSA** rests on the difficulty of **factoring** the product of two enormous primes. Multiplying two 1,000-digit primes is instant; figuring out *which* two primes made a given product would take longer than the age of the universe.
- **Elliptic-Curve Cryptography (ECC)** rests on the hardness of the "elliptic-curve discrete logarithm" — a different one-way problem. Its advantage: **much smaller keys for the same strength.** A 256-bit ECC key is roughly as strong as a 3072-bit RSA key, which is why modern systems prefer ECC (less data, faster, lighter on mobile).

That "easy forward, infeasible backward" gap is the **trapdoor**: the public key lets anyone go forward; only the private key opens the trapdoor to go back.

## Use 1: solving key exchange

The original motivation. Two strangers want a shared *symmetric* key (because symmetric is fast) but everything they send is visible to an eavesdropper. **Diffie-Hellman key exchange** lets them do exactly that:

:::note[Worked example: agreeing on a secret in public]
Alice and Bob each pick a private random number. Each combines their private number with a shared public starting value and sends the *result* to the other (the results are safe to send — reversing them is the hard trapdoor problem). Each then combines *the value they received* with *their own private number*. Astonishingly, both arrive at the **same** shared secret — and an eavesdropper who saw both transmitted values *cannot* compute it.

```
        public channel (eavesdropper sees everything here)
Alice  ── her public mix ──────────────▶  Bob
Alice  ◀──────────────  Bob's public mix ── Bob
   │                                          │
   ▼ combine received + own private           ▼ combine received + own private
   └────────► SAME shared secret ◀────────────┘   (eavesdropper: stuck)
```

That shared secret becomes the symmetric key, and from there [fast symmetric AEAD](./symmetric-encryption) encrypts the actual conversation. This is, in essence, what happens in the [TLS handshake](./tls) every time you load an HTTPS site.
:::

Modern TLS uses **ephemeral** Diffie-Hellman (a fresh key pair per session), which gives **forward secrecy**: even if your long-term private key is stolen *later*, past recorded sessions stay unreadable because their keys were thrown away. Remember that term — it's a property defenders care about a lot.

## Use 2: digital signatures (the more common use today)

Encrypting *to* someone with their public key is real, but in practice asymmetric crypto's most pervasive use is **signing**. A digital signature answers "did this really come from who it claims, and is it unaltered?"

:::note[Worked example: how a signature proves origin + integrity]
You publish a software update. To sign it:
1. You compute a **hash** of the file (a short fingerprint — see [hashing](./hashing-and-macs)).
2. You encrypt that hash with **your private key**. The result is the **signature**, attached to the file.

Anyone downloading it verifies:
1. They compute the hash of the file *themselves*.
2. They decrypt your signature using **your public key** to recover the hash *you* signed.
3. If the two hashes **match**, two things are proven at once:
   - **Authenticity** — only your private key could have produced a signature your public key verifies, so it really came from you.
   - **Integrity** — if even one byte of the file changed, the hashes wouldn't match, so it wasn't tampered with.

This is why your phone won't install an OS update that isn't signed by the vendor, why package managers verify signatures, and why a forged transaction can't masquerade as yours. Note what a signature does **not** do: it doesn't hide the file (no confidentiality) — signing is about *proving*, not *concealing*.
:::

Common signature algorithms: **RSA signatures**, **ECDSA** and **EdDSA / Ed25519** (the elliptic-curve options, now preferred for speed and small size).

:::info[Highlight: which key, which goal?]
The single most common confusion. Lock it in:
- **Encrypt for secrecy →** use the **recipient's public** key (only their private key opens it).
- **Sign for proof →** use **your own private** key (anyone's copy of your public key verifies it).
Mixing these up ("I'll encrypt with my private key to keep it secret") is a classic beginner error — encrypting with your *private* key hides nothing, because your public key is, by design, public.
:::

## Why asymmetric is the setup, not the workhorse

Asymmetric crypto is **slow** — orders of magnitude slower than symmetric — and limited in how much data it can directly encrypt. So real systems use a **hybrid** approach:

1. Use **asymmetric** crypto once, to *exchange or wrap* a fresh **symmetric** key (and to authenticate identities via signatures/certificates).
2. Use **fast symmetric AEAD** for all the bulk data.

That's HTTPS in a sentence, and it's why the last lesson said symmetric does the heavy lifting. Asymmetric solves *trust and setup*; symmetric solves *throughput*.

## Why it matters

- **It's the trust layer of the internet.** Key exchange + signatures are what let you establish a secure, authenticated channel with a server you've never met — the basis of [TLS, PKI, and certificates](./tls) in the next lessons.
- **It maps to CIA + authenticity.** Public-key *encryption* → confidentiality; *signatures* → integrity **and** authenticity (and **non-repudiation** — the signer can't credibly deny it). These are exactly the [foundations](/docs/foundations/cia-triad) properties, now with concrete tools.
- **It's everywhere you'll touch.** SSH keys, signed commits, JWT signing, code-signing, crypto wallets, end-to-end-encrypted messaging — all asymmetric crypto.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Mixing up which key does what.** Secrecy uses the *recipient's public* key; proof of origin uses *your private* key. Encrypting with your private key conceals nothing.
- **Leaking the private key.** The entire system's security is the private key staying private. A private key in a Git repo, a backup, or a screenshot is game over. (Storage is [key management](./key-management).)
- **Thinking a signature encrypts.** Signing proves origin and integrity; it does *not* hide the content. If you need both secrecy and proof, you sign *and* encrypt.
- **Using RSA for bulk data.** Asymmetric is slow and size-limited; use it to set up a symmetric key, then let symmetric AEAD carry the payload (the hybrid pattern).
- **Forgetting forward secrecy.** Long-lived keys mean a future key theft can decrypt *past* recorded traffic. Ephemeral key exchange (modern TLS) prevents this — prefer it.
- **Ignoring the looming quantum question.** Large quantum computers would break RSA and ECC's trapdoors. It's not a 2026 emergency, but "post-quantum cryptography" is why this is a clearly dated topic — the migration is underway and standards now exist.
:::

## Page checkpoint

<Quiz id="asymmetric-encryption-page" title="Public-key crypto — straight?" sampleSize={3}>

<Question
  prompt="You want to send a secret message that ONLY Bob can read. Which key do you encrypt with?"
  options={[
    { text: "Your private key" },
    { text: "Your public key" },
    { text: "Bob's public key" },
    { text: "Bob's private key (which you don't have)" }
  ]}
  correct={2}
  explanation="Encrypt with the RECIPIENT'S PUBLIC key — only Bob's matching private key can decrypt it. Using your own keys wouldn't restrict reading to Bob; and you never have someone else's private key."
  revisit={{ to: "/docs/cryptography/asymmetric-encryption#the-key-pair", label: "The key pair" }}
/>

<Question
  prompt="You sign a software release with your PRIVATE key. What does a successful verification with your PUBLIC key prove?"
  options={[
    { text: "That the file is encrypted and unreadable" },
    { text: "Authenticity (it came from you) and integrity (it wasn't altered) — but NOT confidentiality" },
    { text: "Only that the file is small" },
    { text: "That the recipient is trustworthy" }
  ]}
  correct={1}
  explanation="A signature proves origin (only your private key produces signatures your public key verifies) and integrity (any change breaks the hash match). It does not hide the file — signing proves, it doesn't conceal."
  revisit={{ to: "/docs/cryptography/asymmetric-encryption#use-2-digital-signatures-the-more-common-use-today", label: "Digital signatures" }}
/>

<Question
  prompt="Why do real systems use asymmetric crypto only to set things up, then switch to symmetric?"
  options={[
    { text: "Asymmetric is less secure" },
    { text: "Asymmetric is far slower and size-limited; it's ideal for exchanging a key and authenticating, while fast symmetric AEAD carries the bulk data (the hybrid model)" },
    { text: "Symmetric can't encrypt anything useful" },
    { text: "There's no reason; they could use asymmetric for everything" }
  ]}
  correct={1}
  explanation="Public-key operations are orders of magnitude slower. So you use them once to exchange/wrap a symmetric key and verify identity, then let fast symmetric encryption handle throughput. That hybrid is essentially how HTTPS works."
  revisit={{ to: "/docs/cryptography/asymmetric-encryption#why-asymmetric-is-the-setup-not-the-workhorse", label: "Setup, not workhorse" }}
/>

<Question
  prompt="Diffie-Hellman key exchange lets two strangers agree on a shared secret over a channel an eavesdropper is watching. How is that possible?"
  options={[
    { text: "They send the secret encrypted with a password they both already knew" },
    { text: "Each combines a private value with exchanged public values; both derive the same secret, but reversing the public values to find it is an infeasible trapdoor problem for the eavesdropper" },
    { text: "The eavesdropper simply chooses not to look" },
    { text: "It isn't possible; DH requires a pre-shared key" }
  ]}
  correct={1}
  explanation="Each party mixes their secret with public values and exchanges the results. The math lets both reach the same shared secret, while an eavesdropper who saw the public exchanges can't compute it. That shared secret becomes the symmetric key."
  revisit={{ to: "/docs/cryptography/asymmetric-encryption#use-1-solving-key-exchange", label: "Solving key exchange" }}
/>

<Question
  prompt="What advantage does Elliptic-Curve Cryptography (ECC) have over RSA?"
  options={[
    { text: "It needs no keys at all" },
    { text: "Much smaller keys for equivalent strength (e.g., 256-bit ECC ≈ 3072-bit RSA), so it's faster and lighter — good for mobile" },
    { text: "It is reversible without the private key" },
    { text: "It is symmetric, not asymmetric" }
  ]}
  correct={1}
  explanation="ECC achieves the same security with far smaller keys, meaning less data and faster operations. That's why modern systems increasingly prefer ECC/EdDSA (Ed25519) over RSA, especially on constrained devices."
  revisit={{ to: "/docs/cryptography/asymmetric-encryption#how-the-math-holds-up-intuition-not-memorization", label: "RSA vs ECC" }}
/>

</Quiz>

## What's next

→ Continue to [Hashing & MACs](./hashing-and-macs) — the *one-way* side of cryptography that powers signatures (the fingerprint you sign), password storage, and integrity checks.

→ **Going deeper:** how public keys get *trusted* (so you know a public key really belongs to your bank) is [PKI & certificates](./pki-certificates); the protocol that ties exchange + signatures + symmetric together is [TLS 1.3](./tls).
