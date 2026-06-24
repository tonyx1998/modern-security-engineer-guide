---
id: key-management
title: Key Management
sidebar_position: 7
sidebar_label: Key management
description: The discipline that makes or breaks every other crypto decision — where keys come from, where they live (KMS/HSM), how they rotate, and how a leaked key is contained.
---

# Key Management

> **In one line:** Strong algorithms protect nothing if the **key** is guessable, hardcoded, never rotated, or stolen — so **key management** (generating keys with real randomness, storing them in a [KMS/HSM](#where-keys-should-live) instead of your code, rotating them, and minimizing each key's reach) is where cryptography succeeds or fails in practice.

:::tip[In plain English]
Every lesson so far assumed "you have a key." This lesson is about that assumption — and it's where real systems break. The cryptography is almost never the weak point; *the handling of the keys* is. A perfect AES-256 cipher is worthless if the key is the word `password`, sitting in a config file committed to GitHub, shared across every environment, and never changed in five years. Think of keys like the physical keys to a building: it doesn't matter how strong the lock is if you tape the key to the door, hand copies to everyone, and never re-key it after someone quits. Key management is the boring, unglamorous discipline that decides whether all the elegant math actually protects anything. Get it wrong and you've built a vault with the combination written on the front.
:::

## The key lifecycle

A cryptographic key isn't a static thing you create once. It has a **lifecycle**, and each stage has a way to go wrong:

```
 Generate ──▶ Store ──▶ Use ──▶ Rotate ──▶ Revoke/Destroy
    │           │         │         │            │
 real        KMS/HSM,   least    replace      wipe old keys;
 randomness  not code   privilege regularly   contain compromise
```

1. **Generate** — create the key using a **cryptographically secure random number generator (CSPRNG)**. Keys must be unguessable; a key derived from weak randomness (a timestamp, a counter, `rand()`) can be predicted and the whole scheme falls.
2. **Store** — keep the key somewhere it can't be casually read. *Not* in source code, *not* in a plaintext config file, *not* in the same database it protects. (See [where keys should live](#where-keys-should-live).)
3. **Use** — apply [least privilege](/docs/foundations/defense-in-depth): only the services that truly need a key can access it, and each key does one job (separate keys for separate purposes, environments, and tenants).
4. **Rotate** — periodically replace keys with new ones, so that even an undetected leak has a limited useful life, and so a known-good key is always recent.
5. **Revoke / destroy** — when a key is compromised or retired, invalidate it and securely erase old copies so it can't be used again.

:::note[Terms, defined once]
- **CSPRNG** — Cryptographically Secure Pseudo-Random Number Generator: a randomness source safe for keys (e.g., the OS's `/dev/urandom`, `crypto.randomBytes`). Ordinary `random()` is *not* one.
- **KMS (Key Management Service)** — a managed service (AWS KMS, GCP KMS, Azure Key Vault, HashiCorp Vault) that generates, stores, and uses keys on your behalf, so the raw key never sits in your app.
- **HSM (Hardware Security Module)** — a tamper-resistant hardware device that stores keys and performs crypto *inside itself*; the private key never leaves the hardware. The gold standard for high-value keys.
- **Envelope encryption** — encrypt your data with a **data key**, then encrypt that data key with a **master key** held in the KMS. You store the encrypted data key beside the data; only the KMS can unwrap it.
- **Rotation** — replacing a key with a fresh one on a schedule or after suspicion of compromise.
- **Secret** — the broader category: keys, API tokens, passwords, connection strings. Same handling rules apply.
:::

## Where keys should live

The single most common catastrophic mistake is a **hardcoded key** — a secret sitting in source code or a committed config file. Once it's in version control, it's effectively public (and stays in Git history even after you "delete" it). The fix is a hierarchy, from worst to best:

| Approach | Safety | Notes |
|----------|--------|-------|
| Hardcoded in source / committed config | ❌ Never | In Git history forever; leaks on every clone |
| Plaintext env var / `.env` on disk | ⚠️ Weak | Better than code, but readable by anything on the host |
| Secrets manager (Vault, cloud Secrets Manager) | ✅ Good | Centralized, access-controlled, audited, rotatable |
| **KMS** (key used, never exposed) | ✅✅ Better | App asks KMS to encrypt/decrypt; raw key never leaves |
| **HSM** (key never leaves hardware) | ✅✅✅ Best | Tamper-resistant; for root/master keys and high value |

:::note[Worked example: envelope encryption in practice]
You need to encrypt millions of customer records. You don't hand the master key to your app — instead:

1. The app asks the **KMS** to generate a **data key**. KMS returns it *twice*: once in plaintext (to use right now) and once **encrypted under the master key** (which never leaves KMS).
2. The app encrypts the records with the plaintext data key, then **throws the plaintext data key away**, storing only the *encrypted* data key next to the ciphertext.
3. To decrypt later, the app sends the encrypted data key back to KMS, which unwraps it (because only KMS holds the master key) and returns the plaintext data key for that one operation.

The payoff: the **master key never touches your servers**, you can rotate it centrally, every unwrap is logged and access-controlled, and a stolen database (with only *encrypted* data keys) is useless without KMS access. This is how cloud encryption-at-rest works under the hood.
:::

## Rotation: limiting the damage of a leak

You should assume any key *might* eventually leak. **Rotation** — replacing keys regularly — is the [defense-in-depth](/docs/foundations/defense-in-depth) answer:

- A key rotated every 90 days means a leaked-but-undetected key has at most a bounded useful life.
- Rotation forces you to *build the ability to change keys* — which is exactly what you need, fast, on the day a key is actually compromised. Teams that never rotate discover during an incident that they *can't* without downtime.
- Good systems support **overlapping keys**: the new key starts being used while the old one can still *decrypt* existing data, so rotation doesn't require re-encrypting everything at once or causing an outage.

The hardest case is the **root/master key** at the top of the hierarchy — which is why it lives in an HSM, is rotated rarely and carefully, and is often protected by **split knowledge** (no single person holds the whole key) and **separation of duties**.

## Containing a compromise

When a key *is* compromised, key management determines how bad it gets — this is [blast radius](/docs/foundations/defense-in-depth) again:

- **One key, one job.** Separate keys per environment (dev/staging/prod), per service, and per data class mean a leaked dev key doesn't expose production. A single shared key everywhere means one leak exposes everything.
- **Rapid revocation + rotation.** The ability to invalidate the old key and roll out a new one quickly is what turns a key leak from a catastrophe into an incident.
- **Audit logging.** A KMS logs every use of a key. After a suspected leak, those logs tell you what the attacker could have touched — and unusual key usage can *detect* the leak in the first place ([detection](/docs/detection)).

## Why it matters

- **It's the real-world failure point.** Survey after survey of breaches finds leaked credentials and mismanaged keys among the top root causes — far more than broken algorithms. The math holds; the key handling doesn't.
- **It's where every prior lesson cashes out.** [Symmetric keys](./symmetric-encryption), [private keys](./asymmetric-encryption), [certificate keys](./pki-certificates) — all of them are only as safe as their management. This lesson is why the chapter's mantra is "use vetted tools," because KMS/HSM *are* those tools for key handling.
- **It applies far beyond crypto.** "Don't hardcode secrets, store them centrally, rotate them, scope them" is identical guidance for API tokens, database passwords, and cloud credentials — the daily reality of [secure SDLC](/docs/secure-sdlc) and [cloud security](/docs/cloud-identity).

## Common pitfalls

:::caution[Where people commonly trip up]
- **Hardcoding keys/secrets in source or config.** The number-one mistake. It's in Git history forever and leaks with every clone, screenshot, and log. Use a secrets manager or KMS. (Scan your repos for committed secrets — it's a standard [DevSecOps](/docs/secure-sdlc) check.)
- **Weak key generation.** Deriving keys from non-cryptographic randomness (`Math.random()`, timestamps, predictable seeds) makes them guessable. Always use a CSPRNG.
- **Never rotating.** A key that's never changed has unlimited exposure and, worse, the *capability* to rotate is never built — so you can't react when it's compromised.
- **One key everywhere.** Sharing a single key across environments, services, and customers maximizes blast radius: one leak exposes all of it. Scope keys narrowly.
- **Storing the key next to what it protects.** Encrypting a database with a key stored *in that same database* (or on the same server with the same access) means whoever steals the data steals the key. Separate them (envelope encryption, KMS).
- **Logging secrets.** Keys and tokens accidentally written to application logs, error reports, or URLs leak quietly and persist in log archives. Scrub secrets from logs.
- **Forgetting to destroy old keys.** A "retired" key that still exists in a backup or old config is still a live risk. Securely erase it.
:::

## Page checkpoint

<Quiz id="key-management-page" title="Key management — locked in?" sampleSize={3}>

<Question
  prompt="A team uses AES-256 (unbreakable in practice) but commits the encryption key into their Git repository. How secure is their data?"
  options={[
    { text: "Very secure — AES-256 is strong" },
    { text: "Effectively unprotected — the key is now in version history forever and leaks with every clone; the algorithm's strength is irrelevant once the key is exposed" },
    { text: "Secure as long as the repo is private" },
    { text: "Secure because the key is encrypted by Git" }
  ]}
  correct={1}
  explanation="Cryptography is only as strong as its key handling. A hardcoded key in Git is effectively public — it persists in history even after deletion and leaks with every clone or screenshot. Strong AES with an exposed key protects nothing."
  revisit={{ to: "/docs/cryptography/key-management#where-keys-should-live", label: "Where keys should live" }}
/>

<Question
  prompt="What is the main benefit of envelope encryption with a KMS?"
  options={[
    { text: "It makes encryption faster" },
    { text: "The master key never leaves the KMS — you store only encrypted data keys, so a stolen database is useless without KMS access, and rotation/auditing are centralized" },
    { text: "It eliminates the need for any keys" },
    { text: "It lets you hardcode the master key safely" }
  ]}
  correct={1}
  explanation="Envelope encryption keeps the master key inside the KMS/HSM and stores only the encrypted data key beside the ciphertext. The raw master key never touches your servers; every unwrap is logged and access-controlled, and a stolen DB alone can't decrypt anything."
  revisit={{ to: "/docs/cryptography/key-management#where-keys-should-live", label: "Envelope encryption" }}
/>

<Question
  prompt="Why rotate keys regularly even if none is known to be compromised?"
  options={[
    { text: "It makes the algorithm stronger" },
    { text: "It bounds the useful life of any undetected leak AND ensures you've actually built the capability to change keys quickly when an incident hits" },
    { text: "It's required to encrypt at all" },
    { text: "There's no reason; rotation only matters after a known leak" }
  ]}
  correct={1}
  explanation="Rotation assumes leaks happen eventually. Regular rotation limits how long a stolen-but-undetected key is useful, and — crucially — teams that rotate routinely CAN rotate fast during a real incident, while those that never do discover they can't without downtime."
  revisit={{ to: "/docs/cryptography/key-management#rotation-limiting-the-damage-of-a-leak", label: "Rotation" }}
/>

<Question
  prompt="Why use separate keys per environment (dev/staging/prod) and per service, instead of one shared key?"
  options={[
    { text: "It's cheaper" },
    { text: "To limit blast radius — a leaked dev key shouldn't expose production; one shared key means a single leak compromises everything" },
    { text: "Shared keys are mathematically weaker" },
    { text: "It speeds up rotation" }
  ]}
  correct={1}
  explanation="One key, one job. Scoping keys narrowly applies least privilege to cryptography: a compromise of one key reaches only what that key protected. A single key shared everywhere maximizes blast radius — one leak exposes all of it."
  revisit={{ to: "/docs/cryptography/key-management#containing-a-compromise", label: "Containing a compromise" }}
/>

<Question
  prompt="Where should you generate cryptographic keys from?"
  options={[
    { text: "A timestamp or a counter, for uniqueness" },
    { text: "A cryptographically secure random number generator (CSPRNG), so the key is unguessable" },
    { text: "The user's password directly" },
    { text: "Math.random() or a similar general-purpose function" }
  ]}
  correct={1}
  explanation="Keys must be unpredictable. General-purpose randomness (Math.random, timestamps, counters) is guessable and breaks the whole scheme. Use a CSPRNG (e.g., the OS's secure random source) — or better, let your KMS generate keys for you."
  revisit={{ to: "/docs/cryptography/key-management#the-key-lifecycle", label: "Key generation" }}
/>

</Quiz>

## What's next

You've now seen the full cryptographic toolkit — symmetric and asymmetric encryption, hashing and MACs, TLS, PKI, and the key management that holds it all together.

→ Continue to [Post-Quantum Crypto & Crypto-Agility](./post-quantum) — why a future quantum computer threatens today's [asymmetric crypto](./asymmetric-encryption), why the migration is already underway, and the durable design lesson that ties the chapter together. Then take the [Chapter 2 checkpoint](./cryptography-checkpoint) to lock it all in.
