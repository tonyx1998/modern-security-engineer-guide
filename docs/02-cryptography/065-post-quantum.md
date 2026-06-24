---
id: post-quantum
title: Post-Quantum Crypto & Crypto-Agility
sidebar_position: 7.5
sidebar_label: Post-quantum & agility
description: Why a future quantum computer threatens today's encryption, why the migration is already underway (harvest-now-decrypt-later), the new NIST standards and hybrid TLS — and the durable design lesson, crypto-agility.
---

# Post-Quantum Crypto & Crypto-Agility

> **In one line:** A large enough quantum computer would break the [trapdoor problems](./asymmetric-encryption) (factoring, discrete logs) that RSA and elliptic-curve crypto rely on — and because an attacker can **record encrypted traffic today and decrypt it later** once such a machine exists, the migration to **post-quantum cryptography** is already happening *now*, which makes the real durable lesson **crypto-agility**: build systems so you can swap cryptographic algorithms without re-architecting.

:::tip[In plain English]
Everything you learned about [asymmetric crypto](./asymmetric-encryption) rests on a bet: certain math problems (factoring huge numbers, elliptic-curve discrete logs) are *easy forward, infeasible backward*. A **quantum computer** — a fundamentally different kind of machine — could solve exactly those problems efficiently, which would break RSA and ECC. The honest status, in plain terms: nobody has built a quantum computer big enough to do this yet, and maybe won't for years. So why care now? Because of one chilling idea: **harvest now, decrypt later.** An attacker doesn't need a quantum computer *today* — they can simply *record* your encrypted traffic today, store it, and decrypt it years from now when the machine arrives. Anything you need to stay secret for a long time (medical records, state secrets, your master keys) is *already* at risk in transit. That's why the world isn't waiting: new "quantum-resistant" standards are finalized, browsers and clouds have already turned them on, and the migration is underway. But the deepest lesson for *you* as an engineer isn't the specific new algorithm names (those will change again) — it's that this whole scramble is happening because most systems *hardcoded* their crypto and can't swap it easily. The durable skill is building so you *can*.
:::

## Why quantum breaks today's asymmetric crypto

Recall the [two pillars of public-key crypto](./asymmetric-encryption): **RSA** rests on the hardness of factoring, **ECC** on the hardness of elliptic-curve discrete logarithms. A quantum computer running a known algorithm (Shor's algorithm) can solve *both* efficiently — collapsing the "infeasible backward" half of the trapdoor that the whole scheme depends on.

The damage is **asymmetric** (which is good news to hold onto):

| Crypto type | Quantum impact | Practical response |
|-------------|----------------|--------------------|
| **Asymmetric** (RSA, ECC — key exchange & signatures) | **Broken** — Shor's algorithm defeats the trapdoor | Replace with post-quantum algorithms |
| **Symmetric** ([AES](./symmetric-encryption)) | **Weakened, not broken** — effective strength roughly halves | Use a larger key (e.g., AES-256), and you're fine |
| **Hashing** ([SHA-2/3](./hashing-and-macs)) | **Weakened, not broken** — similar halving | Use longer digests; largely fine |

So the quantum threat is concentrated in *asymmetric* crypto — the [key exchange and signatures](./asymmetric-encryption) that set up trust on the internet. Symmetric encryption and hashing just need bigger sizes. That focus is why "post-quantum" work centers on replacing RSA/ECC.

:::note[Terms, defined once]
- **Post-quantum cryptography (PQC)** — algorithms designed to resist attack by quantum *and* classical computers, built on different math problems than factoring/discrete-log. Runs on today's ordinary computers.
- **Harvest now, decrypt later (HNDL)** — recording encrypted data today to decrypt it once a quantum computer exists; the reason long-lived secrets are *already* at risk.
- **Cryptographically relevant quantum computer (CRQC)** — a quantum machine large and stable enough to actually break RSA/ECC. None is known to exist yet; PQC is about being ready before one does.
- **Hybrid scheme** — combining a classical algorithm *and* a post-quantum one so the result is safe if *either* holds — hedging while PQC is young.
- **Crypto-agility** — designing systems so cryptographic algorithms can be swapped quickly without re-architecting. The durable takeaway of this lesson.
:::

## The migration is already underway

Three things turned PQC from "future problem" into "current work":

**1. The standards are finalized.** After a multi-year public competition, national standards bodies finalized the first post-quantum algorithms — one for key exchange and two for signatures — so engineers now have vetted, standardized primitives to adopt (not research prototypes). *Use the standard ones; [never roll your own](/docs/cryptography).*

**2. Hybrid is being deployed first.** Rather than bet everything on a young algorithm, the internet is rolling out **hybrid** key exchange in [TLS](./tls): combine the classical X25519 elliptic-curve exchange with a post-quantum one, so the session key is safe if *either* survives. Major browsers, CDNs, and cloud providers have **already enabled hybrid post-quantum key exchange by default** for a large share of HTTPS connections — the change is mostly invisible and already live.

**3. Deadlines are being set.** Standards bodies have published transition timelines that **deprecate today's RSA/ECC sizes around the end of this decade and disallow them a few years after** — i.e., there's now a clock, not just a warning.

:::note[Worked example: why "no quantum computer yet" doesn't make you safe]
You run a messaging service. Today, every conversation is protected by an [ephemeral elliptic-curve key exchange](./asymmetric-encryption) — excellent against *classical* attackers, and it even gives [forward secrecy](./asymmetric-encryption).

A patient adversary doesn't try to break it now. They sit on the wire and **record the encrypted traffic** — terabytes of it — and archive it. Years later, a cryptographically relevant quantum computer (CRQC) becomes available. They run Shor's algorithm against the recorded key exchanges, recover the session keys, and **decrypt every conversation they saved** — retroactively.

The defense had to be in place *before* the recording, not before the quantum computer. That's the entire logic of **harvest now, decrypt later**: for anything with a long confidentiality lifetime, the deadline already passed. Deploying hybrid PQC key exchange *now* is what makes those recordings useless later.
:::

## The real lesson: crypto-agility

Step back from the specific algorithm names (which *will* change again — that's the nature of a [dated topic](/docs/foundations/threat-vuln-risk)) to the durable engineering insight.

The PQC migration is painful for one reason: **most systems hardcoded their cryptography.** The algorithm, key sizes, and certificate types are baked into code, protocols, and hardware that assumed they'd never change. So swapping them means re-architecting — across thousands of systems, at once, on a deadline.

**Crypto-agility** is the fix and the takeaway: design so that the *choice* of cryptographic algorithm is a **configuration, not an assumption.**

- **Negotiate, don't hardcode.** [TLS already does this](./tls) — it negotiates which algorithms to use — which is *exactly why* hybrid PQC could be rolled out by flipping a setting. Build your own systems the same way.
- **Abstract the primitive.** Call "encrypt"/"sign" through an interface, with the concrete algorithm behind it, so replacing it is a swap, not a rewrite.
- **Inventory your crypto.** You can't migrate what you can't find. Knowing *where* every algorithm, key, and certificate lives (a crypto [inventory/SBOM](/docs/secure-sdlc/supply-chain), conceptually) is the prerequisite to changing any of it.
- **Assume another transition will come.** PQC won't be the last forced migration. A team built for agility rides the next one as a config change; a team that hardcoded does another fire drill.

:::info[Highlight: this is "isolate volatile facts," in code]
You learned to keep [version-pinned, dated facts](/docs/foundations/threat-vuln-risk) out of evergreen material. Crypto-agility is the *same discipline applied to your architecture*: keep the *durable* part (you need confidentiality, integrity, authenticity) in the design, and keep the *volatile* part (which exact algorithm provides it) in a swappable layer. The specific post-quantum algorithm names are dated; "don't bake your crypto choice into bedrock" is forever.
:::

:::note[The dated specifics — verify current before relying on them]
As of this writing (mid-2026): the finalized standards are **ML-KEM (FIPS 203)** for key encapsulation/exchange, and **ML-DSA (FIPS 204)** and **SLH-DSA (FIPS 205)** for signatures — formerly known as Kyber, Dilithium, and SPHINCS+, finalized August 2024. The widely-deployed hybrid TLS key exchange is **X25519MLKEM768** (X25519 combined with ML-KEM-768), enabled by default in major browsers, CDNs, and clouds. Transition guidance (**NIST IR 8547**, in draft) proposes **deprecating RSA-2048/ECC P-256-class crypto around 2030 and disallowing it by 2035.** These names, codepoints, and dates **will change** — treat them as a snapshot, confirm the current standards/timeline, and lean on the durable parts: harvest-now-decrypt-later, hybrid deployment, and crypto-agility.
:::

## Why it matters

- **Long-lived secrets are at risk today.** Harvest-now-decrypt-later means the clock for anything with a multi-year confidentiality requirement *already started*. This isn't a problem you can fully defer to "when quantum computers exist."
- **It's already in production.** Hybrid PQC key exchange is on by default for much of HTTPS traffic right now. Understanding it is understanding the [TLS](./tls) your systems already speak — not a hypothetical.
- **Crypto-agility is a design skill you'll reuse.** Whether or not you ever hand-pick a post-quantum algorithm, building so crypto can be swapped is a durable architecture principle that pays off on *every* future cryptographic transition.

## Common pitfalls

:::caution[Where people commonly trip up]
- **"No quantum computer exists, so I'm safe."** Harvest-now-decrypt-later defeats this: recorded traffic can be decrypted later. For long-lived secrets, the deadline is now, not when a CRQC ships.
- **Rolling your own post-quantum scheme.** The "[don't invent crypto](/docs/cryptography)" rule holds doubly here — PQC is young and subtle. Use the finalized, standardized algorithms.
- **Going pure-PQC too eagerly.** The young algorithms are less battle-tested than RSA/ECC. Hybrid (classical + post-quantum) is safe if *either* holds — the prudent default during the transition.
- **Panicking about symmetric crypto and hashing.** Quantum only *weakens* these (effective strength roughly halves); larger sizes (AES-256, longer digests) handle it. The break is in *asymmetric* crypto.
- **Hardcoding algorithms.** The migration hurts because crypto choices were baked in. Build crypto-agile: negotiate algorithms, abstract the primitive, inventory where crypto lives.
- **Treating the algorithm names as durable.** ML-KEM/ML-DSA/SLH-DSA and the timeline are a dated snapshot. Internalize the concepts; verify the specifics each time.
:::

## Page checkpoint

<Quiz id="post-quantum-page" title="Did post-quantum crypto click?" sampleSize={3}>

<Question
  prompt="Which of today's cryptography does a large quantum computer actually BREAK, and which is only weakened?"
  options={[
    { text: "It breaks everything equally" },
    { text: "It breaks ASYMMETRIC crypto (RSA, ECC) by defeating the factoring/discrete-log trapdoor with Shor's algorithm; symmetric encryption (AES) and hashing are only WEAKENED — their effective strength roughly halves — so larger sizes (AES-256, longer digests) handle it" },
    { text: "It breaks only symmetric encryption" },
    { text: "It breaks only hashing" }
  ]}
  correct={1}
  explanation="The quantum threat is concentrated in asymmetric crypto — the key exchange and signatures that set up internet trust — because Shor's algorithm solves factoring and discrete logs efficiently. Symmetric crypto and hashing just need bigger sizes; they're weakened, not broken. That's why PQC work targets RSA/ECC replacements."
  revisit={{ to: "/docs/cryptography/post-quantum#why-quantum-breaks-todays-asymmetric-crypto", label: "What quantum breaks" }}
/>

<Question
  prompt="Why is post-quantum migration urgent NOW, even though no quantum computer can break RSA/ECC yet?"
  options={[
    { text: "Quantum computers already broke RSA last year" },
    { text: "'Harvest now, decrypt later' — an attacker can record encrypted traffic today and decrypt it years later once a quantum computer exists, so anything with a long confidentiality lifetime is already at risk; the defense must be in place before the recording, not before the machine" },
    { text: "It isn't urgent; it can wait until quantum computers arrive" },
    { text: "Because symmetric encryption is already broken" }
  ]}
  correct={1}
  explanation="Harvest-now-decrypt-later means the deadline for long-lived secrets already passed: recorded traffic can be decrypted retroactively when a CRQC arrives. Deploying post-quantum (or hybrid) key exchange now is what makes today's recordings useless later."
  revisit={{ to: "/docs/cryptography/post-quantum#the-migration-is-already-underway", label: "Harvest now, decrypt later" }}
/>

<Question
  prompt="Why is the internet rolling out HYBRID post-quantum key exchange (e.g., classical X25519 combined with a PQC algorithm) rather than pure PQC?"
  options={[
    { text: "Because hybrid is faster than either alone" },
    { text: "Because the post-quantum algorithms are young and less battle-tested; combining classical + post-quantum makes the session key safe if EITHER one holds, hedging risk during the transition" },
    { text: "Because pure PQC is illegal" },
    { text: "Because classical crypto is already quantum-safe" }
  ]}
  correct={1}
  explanation="Hybrid hedges: the result is secure as long as at least one of the two algorithms is unbroken. Since PQC is newer and less proven than RSA/ECC, combining them protects against both a future quantum break AND an undiscovered flaw in the young PQC algorithm — the prudent default during migration."
  revisit={{ to: "/docs/cryptography/post-quantum#the-migration-is-already-underway", label: "Hybrid deployment" }}
/>

<Question
  prompt="What is 'crypto-agility,' and why is it the durable lesson of the PQC migration?"
  options={[
    { text: "Using the fastest possible cipher" },
    { text: "Designing systems so the choice of cryptographic algorithm is configuration, not a hardcoded assumption — so algorithms can be swapped without re-architecting; it's the durable lesson because the migration is painful precisely BECAUSE most systems hardcoded their crypto, and PQC won't be the last transition" },
    { text: "Rotating keys every 90 days" },
    { text: "Inventing your own quantum-resistant algorithm" }
  ]}
  correct={1}
  explanation="Crypto-agility means negotiating algorithms (as TLS does), abstracting the primitive behind an interface, and inventorying where crypto lives — so a swap is a config change, not a rewrite. The PQC migration hurts because crypto was baked in; agility is what makes the next transition painless."
  revisit={{ to: "/docs/cryptography/post-quantum#the-real-lesson-crypto-agility", label: "Crypto-agility" }}
/>

<Question
  prompt="How should you treat the specific post-quantum algorithm names and transition dates?"
  options={[
    { text: "Memorize them as permanent facts" },
    { text: "As a dated snapshot — the standardized algorithms and the timeline are current today but WILL change, so internalize the durable concepts (harvest-now-decrypt-later, hybrid deployment, crypto-agility) and verify the exact names/dates each time" },
    { text: "Ignore them; they don't matter at all" },
    { text: "Assume they're fixed forever once finalized" }
  ]}
  correct={1}
  explanation="Algorithm names, codepoints, and deprecation dates are version-pinned, dated facts — keep them in a clearly dated box and verify them when you need specifics. The durable parts are the motivation (HNDL), the strategy (hybrid), and the design principle (crypto-agility)."
  revisit={{ to: "/docs/cryptography/post-quantum#the-real-lesson-crypto-agility", label: "Durable vs dated" }}
/>

</Quiz>

## What's next

→ Take the [Chapter 2 checkpoint](./cryptography-checkpoint) to lock in the whole cryptographic toolkit, then continue to [Chapter 3: Web & Application Security](/docs/appsec).

→ **Going deeper:** the trapdoors quantum threatens are [asymmetric crypto](./asymmetric-encryption); the protocol already negotiating hybrid PQC is [TLS 1.3](./tls); why algorithm names belong in dated boxes is [Foundations](/docs/foundations/threat-vuln-risk); the crypto-inventory idea echoes [SBOMs](/docs/secure-sdlc/supply-chain).
