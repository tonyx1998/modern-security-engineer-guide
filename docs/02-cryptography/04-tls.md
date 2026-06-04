---
id: tls
title: TLS 1.3 — A Secure Channel With a Stranger
sidebar_position: 5
sidebar_label: TLS 1.3
description: How HTTPS actually works — the TLS 1.3 handshake that combines key exchange, signatures, certificates, and symmetric encryption to give you a private, authenticated channel with a server you've never met.
---

# TLS 1.3 — A Secure Channel With a Stranger

> **In one line:** **TLS** is the protocol that turns a hostile, eavesdropped network into a private, tamper-proof, authenticated channel — and it works by stitching together every primitive from this chapter: a [key exchange](./asymmetric-encryption) to agree on a secret, a [signature/certificate](./pki-certificates) to prove the server's identity, and [symmetric AEAD](./symmetric-encryption) to encrypt the actual data.

:::tip[In plain English]
Every time you see the padlock and `https://`, your browser just pulled off something remarkable: it established a secure conversation with a server it has *never met*, over a network full of strangers who can see every packet — and it did so in a fraction of a second. **TLS (Transport Layer Security)** is the choreography that makes this possible. It answers three questions in one quick exchange: *Are you really my bank?* (authentication), *Can we agree on a secret key without anyone watching us steal it?* (key exchange), and *Now that we have one, encrypt everything* (symmetric encryption). This lesson walks through that choreography — the **handshake** — step by step. You don't implement TLS yourself; you just need to understand what it's doing so you can reason about what HTTPS does and doesn't protect.
:::

## What TLS gives you (and what it doesn't)

**TLS** (the successor to the older, deprecated **SSL** — people still say "SSL certificate" out of habit) sits between your application and the raw network. When HTTP runs over TLS, it's **HTTPS**. TLS provides:

- **Confidentiality** — everything after the handshake is encrypted with symmetric AEAD; eavesdroppers see ciphertext.
- **Integrity** — the AEAD auth tag means tampering is detected and rejected.
- **Authentication** — the server proves its identity with a [certificate](./pki-certificates), so you know you're talking to the real `bank.com`, not an impostor.

What TLS does **not** give you:

- **Anonymity.** A network observer can't read your traffic, but can still see *which server* you connected to (the destination IP, and historically the hostname via SNI). TLS hides the contents, not the fact of the conversation.
- **Application security.** TLS protects data *in transit*. [XSS, SQL injection, broken auth](/docs/appsec) all happen *inside* the encrypted tunnel. HTTPS is table stakes, not a security strategy.
- **Endpoint security.** If the server is compromised or you're typing into a phishing site that *also* has valid HTTPS, TLS faithfully encrypts your data to the attacker. The padlock means "encrypted to whoever this certificate names," not "this site is trustworthy."

:::note[Terms, defined once]
- **TLS / SSL** — Transport Layer Security; SSL is its obsolete predecessor (don't use SSL 2/3 or early TLS — TLS 1.2 and **1.3** are current).
- **Handshake** — the initial negotiation that authenticates the server and establishes session keys, before any application data flows.
- **Session key** — the symmetric key derived during the handshake, used for the bulk of the connection.
- **Cipher suite** — the agreed bundle of algorithms (key exchange + AEAD cipher + hash). TLS 1.3 trimmed these down to only modern, safe ones.
- **SNI (Server Name Indication)** — the hostname the client requests, so one IP can host many TLS sites. Historically visible to observers (Encrypted Client Hello now hides it where supported).
:::

## The TLS 1.3 handshake, step by step

TLS 1.3 (standardized 2018) is the version you should care about: it's faster (one round trip instead of two) and *removed* the legacy, insecure options that plagued earlier versions. Here's the choreography when you visit `https://bank.com`:

:::note[Worked example: a TLS 1.3 handshake traced]
```
   CLIENT (your browser)                         SERVER (bank.com)
        │                                              │
        │ 1. ClientHello                               │
        │    "I support TLS 1.3, these cipher suites,  │
        │     and here's my ephemeral DH public key" ──▶
        │                                              │
        │            2. ServerHello + Certificate +    │
        │               server's ephemeral DH key +    │
        │               a SIGNATURE over the handshake │
        │ ◀── "Here's my cert (proving I'm bank.com),  │
        │      my DH key, and proof I hold the         │
        │      private key matching the cert"          │
        │                                              │
        │ 3. Client verifies:                          │
        │    • Certificate chains to a trusted CA      │
        │    • Cert is for bank.com & not expired      │
        │    • Signature is valid                      │
        │                                              │
        │ 4. BOTH derive the same session key from     │
        │    the exchanged DH keys (key exchange)      │
        │                                              │
        │ 5. ══ Encrypted application data (HTTP) ══   │
        │ ◀════ all symmetric AEAD from here on ═════▶ │
```

Watch each chapter primitive do its job:
1. **Key exchange** ([asymmetric](./asymmetric-encryption)): the ephemeral Diffie-Hellman keys let both sides derive a shared **session key** that an eavesdropper can't compute. *Ephemeral* = a fresh key pair per session, giving **forward secrecy** (stealing the server's long-term key later won't decrypt today's recorded traffic).
2. **Authentication** ([certificates](./pki-certificates) + [signatures](./asymmetric-encryption)): the server's certificate, validated against a trusted **Certificate Authority**, plus a signature proving the server holds the matching private key, stop an impostor from impersonating the bank.
3. **Symmetric encryption** ([AEAD](./symmetric-encryption)): once the session key exists, all real data uses fast AES-GCM or ChaCha20-Poly1305. This is the hybrid model from the asymmetric lesson, live.
:::

The whole thing is the answer to "how do you securely talk to a stranger?": *use asymmetric crypto to authenticate and agree on a key, then symmetric crypto to do the work.*

## Why authentication is the part that's easy to forget

Encryption without authentication is a trap. Imagine you did a perfect key exchange — but with an **attacker in the middle** who relayed messages between you and the bank. You'd have a perfectly encrypted channel… to the attacker, who decrypts, reads, re-encrypts, and forwards. This is a **man-in-the-middle (MITM)** attack, and the *certificate* is what defeats it: the attacker can't present a valid certificate for `bank.com` signed by a trusted CA, so your browser refuses the connection (or screams a warning). **Encryption keeps the conversation private; authentication makes sure you're having it with the right party.** Both are required — which is exactly why the next lesson, on [PKI and certificates](./pki-certificates), exists.

## Why it matters

- **It's the security boundary of the entire web.** Practically all internet traffic — web, APIs, email transport, mobile apps — rides on TLS. Understanding the handshake demystifies "the padlock" and lets you reason about real attacks (MITM, certificate errors, downgrade attempts).
- **It's the chapter's capstone.** TLS is where [symmetric encryption, asymmetric key exchange, signatures, and hashing](./symmetric-encryption) stop being separate ideas and become one working system. If TLS makes sense, the chapter clicked.
- **Its failure modes are interview and incident staples.** "Why is HTTPS not enough?", "What does forward secrecy protect?", "How does a cert stop a MITM?" — these come up constantly, in design reviews and in real incidents.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Thinking HTTPS = secure app.** TLS protects data in transit only. Injection, XSS, broken auth, and logic flaws all live *inside* the tunnel. The padlock is necessary, not sufficient.
- **Reading the padlock as "trustworthy."** It means "encrypted to whoever owns this certificate." A phishing site can have a perfectly valid certificate for *its own* lookalike domain. Always check *who* the certificate is for (the domain), not just that a padlock exists.
- **Ignoring certificate warnings.** A browser cert error often means a real MITM or misconfiguration. "Click through to proceed" can hand your session to an attacker. Treat cert errors as security events.
- **Running old TLS/SSL.** SSL 3, TLS 1.0/1.1 have known attacks (POODLE, BEAST). Use TLS 1.2+ and prefer **1.3**, which removed the insecure options entirely.
- **Forgetting forward secrecy.** Without ephemeral key exchange, an attacker who records your traffic today and steals the server key *years later* can decrypt it all retroactively. TLS 1.3 mandates forward-secret key exchange — a reason to be on it.
- **Assuming TLS hides the destination.** Observers still learn which server you contacted. For content privacy TLS is great; for *who you're talking to*, it leaks (absent newer protections like Encrypted Client Hello).
:::

## Page checkpoint

<Quiz id="tls-page" title="Did the TLS handshake click?" sampleSize={3}>

<Question
  prompt="During a TLS 1.3 handshake, what is the certificate's job?"
  options={[
    { text: "To encrypt the application data" },
    { text: "To authenticate the server's identity — proving you're really talking to bank.com and not an impostor — which is what stops a man-in-the-middle attack" },
    { text: "To speed up the connection" },
    { text: "To compress the traffic" }
  ]}
  correct={1}
  explanation="The certificate (validated against a trusted CA) plus a signature proves the server's identity. Without it, you could do a flawless key exchange with an attacker in the middle. Encryption gives privacy; the certificate gives authentication — both are required."
  revisit={{ to: "/docs/cryptography/tls#why-authentication-is-the-part-thats-easy-to-forget", label: "Why authentication matters" }}
/>

<Question
  prompt="After the TLS handshake completes, which type of cryptography encrypts the actual HTTP data, and why?"
  options={[
    { text: "Asymmetric (RSA/ECC), because it's most secure" },
    { text: "Symmetric AEAD (AES-GCM / ChaCha20-Poly1305), because it's far faster for bulk data — the handshake set up the shared session key" },
    { text: "Hashing, because it's one-way" },
    { text: "No encryption is used after the handshake" }
  ]}
  correct={1}
  explanation="This is the hybrid model: asymmetric crypto authenticates and establishes a shared session key during the handshake; then fast symmetric AEAD encrypts all the bulk traffic. Using asymmetric for everything would be far too slow."
  revisit={{ to: "/docs/cryptography/tls#the-tls-13-handshake-step-by-step", label: "The handshake" }}
/>

<Question
  prompt="A site loads over HTTPS with a valid padlock, yet it's a phishing page on a lookalike domain. What's the lesson?"
  options={[
    { text: "The padlock was faked" },
    { text: "The padlock only means 'encrypted to whoever owns this certificate' — a scam site can have a valid cert for its OWN domain; HTTPS doesn't vouch for trustworthiness" },
    { text: "HTTPS is useless" },
    { text: "The browser made a mistake" }
  ]}
  correct={1}
  explanation="HTTPS guarantees the channel is encrypted and the cert matches the domain shown — not that the domain is honest. Anyone can get a valid certificate for a domain they control, including scammers. Check WHO the cert is for, not just that a padlock exists."
  revisit={{ to: "/docs/cryptography/tls#what-tls-gives-you-and-what-it-doesnt", label: "What TLS doesn't give you" }}
/>

<Question
  prompt="What does 'forward secrecy' (from ephemeral key exchange) protect against?"
  options={[
    { text: "Weak passwords" },
    { text: "An attacker who records your encrypted traffic today and later steals the server's long-term private key being able to decrypt that PAST traffic" },
    { text: "SQL injection" },
    { text: "Denial-of-service attacks" }
  ]}
  correct={1}
  explanation="Ephemeral (per-session) keys are discarded after use, so a future compromise of the server's long-term key can't retroactively decrypt previously recorded sessions. TLS 1.3 mandates forward-secret key exchange for exactly this reason."
  revisit={{ to: "/docs/cryptography/tls#the-tls-13-handshake-step-by-step", label: "Forward secrecy" }}
/>

<Question
  prompt="Which statement about HTTPS is correct?"
  options={[
    { text: "HTTPS makes your application secure against all attacks" },
    { text: "HTTPS protects data in transit, but XSS, SQL injection, and broken auth still happen inside the encrypted tunnel — it's necessary, not sufficient" },
    { text: "HTTPS hides which website you're visiting from your ISP" },
    { text: "HTTPS replaces the need for input validation" }
  ]}
  correct={1}
  explanation="TLS secures the wire. Application-layer vulnerabilities operate inside the tunnel and are untouched by encryption. And observers can still see the destination server. HTTPS is table stakes — pair it with real application security."
  revisit={{ to: "/docs/cryptography/tls#what-tls-gives-you-and-what-it-doesnt", label: "TLS is not app security" }}
/>

</Quiz>

## What's next

→ Continue to [PKI & Certificates](./pki-certificates) — the trust system that makes the handshake's authentication step actually work: how your browser *knows* a certificate for `bank.com` is legitimate.

→ **Going deeper:** the attacks TLS defends against (MITM, downgrade) are explored offensively in [Network Security](/docs/network-security); the broader "trust nothing on the network" stance is [zero trust](/docs/cloud-identity).
