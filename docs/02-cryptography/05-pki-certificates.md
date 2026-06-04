---
id: pki-certificates
title: PKI & Certificates
sidebar_position: 6
sidebar_label: PKI & certificates
description: How you trust a public key you've never seen — Certificate Authorities, chains of trust, what's inside a certificate, revocation, and certificate pinning.
---

# PKI & Certificates

> **In one line:** A public key is useless if you can't be sure *whose* it is — **PKI (Public Key Infrastructure)** solves that with **certificates**: digitally signed documents, issued by trusted **Certificate Authorities**, that bind a public key to an identity, forming a **chain of trust** your browser can verify back to a root it already trusts.

:::tip[In plain English]
The [TLS lesson](./tls) left one magic step unexplained: when `bank.com` sends you its public key, *how do you know it's really the bank's key and not an attacker's?* Anyone can generate a key pair and claim to be the bank. The answer is the same way society handles identity in the physical world — **trusted third parties vouch for you.** A passport is trusted not because *you* made it but because a *government* (whom others already trust) issued and stamped it. A **certificate** is a digital passport for a public key: a trusted authority checks that you really control `bank.com`, then signs a document saying "this public key belongs to bank.com." Your browser trusts a small set of these authorities out of the box, so it can verify the chain and trust the key — without you and the bank ever having met.
:::

## The problem PKI solves

Recall the [man-in-the-middle](./tls) threat: an attacker who sits between you and the bank can hand you *their* public key while claiming to be the bank. If you trust it, you've established a secure channel with the attacker. Public-key crypto alone can't stop this — the math proves a key *works*, not *whose it is*.

**PKI binds keys to identities.** It's the system of authorities, certificates, and verification rules that lets you answer "does this public key genuinely belong to the entity it claims?" — at internet scale, with strangers.

:::note[Terms, defined once]
- **PKI (Public Key Infrastructure)** — the whole system: CAs, certificates, the rules and formats for issuing, validating, and revoking them.
- **Certificate (X.509)** — a signed document binding a **public key** to an **identity** (a domain name), plus metadata (validity dates, issuer, allowed uses). X.509 is the standard format.
- **Certificate Authority (CA)** — a trusted organization that verifies identities and *issues* (signs) certificates. Examples: Let's Encrypt, DigiCert.
- **Root CA / root certificate** — a top-level CA whose certificate is **pre-installed and trusted** by your OS/browser (the "trust store" / "root store"). The anchor of all trust.
- **Intermediate CA** — a CA signed by a root, which in turn signs end-user certificates. Roots stay offline for safety; intermediates do the daily signing.
- **Chain of trust** — the path from a website's certificate up through intermediates to a trusted root.
- **CSR (Certificate Signing Request)** — what you send a CA: your public key plus the identity you want certified. Your private key never leaves you.
:::

## What's inside a certificate

A certificate is mostly plain, readable data plus one crucial signature. The important fields:

| Field | What it says | Why it matters |
|-------|--------------|----------------|
| **Subject** | Who this certifies (e.g., `bank.com`) | Must match the site you're visiting |
| **Public key** | The subject's public key | The key you'll actually use |
| **Issuer** | Which CA signed it | The next link up the chain |
| **Validity period** | Not-before / not-after dates | Expired certs are rejected |
| **Signature** | The issuer's signature over all the above | Proof the CA vouched for this binding |

The signature is the linchpin: the CA computed a [hash](./hashing-and-macs) of the certificate's contents and [signed it with the CA's private key](./asymmetric-encryption). Anyone can verify that signature with the CA's *public* key — which they already have, because the CA's certificate is in the trust store.

## The chain of trust, traced

:::note[Worked example: verifying bank.com's certificate]
Your browser receives `bank.com`'s certificate during the handshake. It walks the chain:

```
   Root CA  (e.g. "ISRG Root X1")   ← pre-trusted, in your browser's root store
      │  signs
      ▼
   Intermediate CA  (e.g. "Let's Encrypt R3")
      │  signs
      ▼
   bank.com's certificate   ← presented by the server
```

Verification, bottom-up:
1. **Is bank.com's cert signed by its issuer (the intermediate)?** Check the intermediate's signature using the intermediate's public key. ✓
2. **Is the intermediate signed by its issuer (the root)?** Check using the root's public key. ✓
3. **Is that root in my trusted root store?** Yes — it shipped with the browser. ✓ **Anchor reached.**
4. **Does the leaf cert's Subject match `bank.com`, and is it within its validity dates?** ✓

If every link checks out and the chain ends at a trusted root, the browser trusts that `bank.com`'s public key is genuine, and the handshake proceeds. If *any* link fails — broken signature, expired cert, name mismatch, or a root it doesn't recognize — you get a certificate error. **An attacker can't forge this**: they'd need a CA's private key to mint a chain that ends at a trusted root, which they don't have.
:::

This is **transitive trust**: you trust the root → the root vouches for the intermediate → the intermediate vouches for the site. You only had to *pre-trust* a few dozen roots; everything else is verified on the fly.

## How you get a certificate (and why it's now free)

To get a cert for a domain you control, you prove control to a CA (e.g., by placing a file the CA specifies on your server, or adding a DNS record), and the CA issues a **Domain Validated (DV)** certificate. **Let's Encrypt** automated this and made it free; the **ACME** protocol lets your server request and *renew* certs automatically. This is why, as the foundations [intro](/docs/foundations) noted, there's no excuse for plain HTTP anymore.

:::info[Highlight: validation levels — what a cert does and doesn't assert]
- **DV (Domain Validated)** — proves only "whoever got this controls the domain." Free, instant, the vast majority of certs. It does *not* assert the org is who they say or that they're honest.
- **OV / EV (Organization / Extended Validation)** — the CA additionally vetted the legal organization. More expensive; the browser UI no longer gives EV special treatment, so its practical value has faded.

The key takeaway connects back to TLS: a valid DV cert on `bank-secure-login.com` proves someone controls that domain — *not* that they're your bank. The padlock authenticates the *domain*, never the *intentions*.
:::

## When trust must be withdrawn: revocation

Sometimes a certificate must be invalidated *before* it expires — typically because the private key was stolen. **Revocation** is how a CA says "don't trust this cert anymore":

- **CRL (Certificate Revocation List)** — a published list of revoked cert serial numbers. Simple but bulky.
- **OCSP (Online Certificate Status Protocol)** — a live "is this cert still valid?" query. **OCSP stapling** has the server attach a recent signed "still good" proof to the handshake, avoiding a privacy-leaking separate lookup.

Revocation checking is famously imperfect (clients sometimes "fail open" if the check is unreachable). The modern trend is **short-lived certificates** — valid for only days or weeks — so a compromised cert expires on its own quickly, reducing reliance on revocation.

## Certificate pinning: trusting fewer authorities

By default your app trusts *any* of the ~dozens of CAs in the root store — so a compromised or coerced CA anywhere could mint a cert for your domain. **Certificate pinning** narrows this: an app hardcodes (pins) the specific certificate or public key it expects from its server, and rejects anything else *even if* it chains to a trusted root. High-security mobile apps (banking) use it. The tradeoff: if you rotate keys without updating the pin, you lock yourself out — so it's powerful but operationally sharp-edged.

## Why it matters

- **It makes the whole web's authentication work.** Without PKI, TLS encryption would be encryption-to-anybody. PKI is what makes "I'm really talking to my bank" true, billions of times a day.
- **It's a top source of real incidents.** Expired certificates cause global outages; mis-issued certs enable MITM; compromised CAs have caused major breaches. "The cert expired" is one of the most common production pages there is.
- **It generalizes.** The same chain-of-trust idea secures code signing, SSH host keys, mutual-TLS between services ([zero trust](/docs/cloud-identity)), and document signing. Learn it once; recognize it everywhere.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Reading a valid cert as "trustworthy site."** A DV cert proves domain control, not honesty. Scam sites get valid certs for their own domains routinely.
- **Letting certificates expire.** Validity dates are enforced hard — an expired cert breaks every client. Automate renewal (ACME) and monitor expiry; don't rely on a human remembering.
- **Clicking through certificate warnings.** A name mismatch or untrusted issuer can be a live MITM. Treat cert errors as potential attacks, not nuisances.
- **Trusting a self-signed cert in production.** Self-signed certs chain to no trusted root, so clients can't verify identity — fine for local testing, a MITM-enabler in production.
- **Pinning without an update plan.** Pinning to a specific key and then rotating it (or forgetting to ship a backup pin) bricks your own app. Pin with care and always include a backup.
- **Assuming revocation always works.** Clients often fail open. Prefer short-lived certs and treat key compromise as urgent regardless of revocation.
:::

## Page checkpoint

<Quiz id="pki-certificates-page" title="PKI & certificates — locked in?" sampleSize={3}>

<Question
  prompt="What problem does PKI (certificates + CAs) primarily solve?"
  options={[
    { text: "Making encryption faster" },
    { text: "Binding a public key to a verified identity, so you can trust that a key really belongs to the entity it claims — defeating impersonation/MITM" },
    { text: "Storing passwords securely" },
    { text: "Compressing certificates" }
  ]}
  correct={1}
  explanation="Public-key math proves a key works, not whose it is. PKI uses trusted CAs to sign certificates that bind a key to an identity (a domain), so you can verify you've got the real party's key — which is what stops a man-in-the-middle."
  revisit={{ to: "/docs/cryptography/pki-certificates#the-problem-pki-solves", label: "The problem PKI solves" }}
/>

<Question
  prompt="Your browser receives bank.com's certificate. How does it decide to trust it?"
  options={[
    { text: "It trusts any certificate that loads" },
    { text: "It verifies the signature chain up through intermediates to a ROOT CA already in its trusted root store, and checks the name and validity dates" },
    { text: "It asks the user to confirm the key by hand" },
    { text: "It contacts bank.com to ask if the cert is real" }
  ]}
  correct={1}
  explanation="Trust is transitive: the leaf cert is signed by an intermediate, the intermediate by a root, and the root is pre-trusted in the browser. If the chain validates, the name matches, and dates are current, the browser trusts the key. An attacker can't forge this without a CA's private key."
  revisit={{ to: "/docs/cryptography/pki-certificates#the-chain-of-trust-traced", label: "The chain of trust" }}
/>

<Question
  prompt="A scam site `secure-bank-login.com` presents a valid, CA-issued DV certificate. What does that certificate actually prove?"
  options={[
    { text: "That the site is operated by your real bank" },
    { text: "Only that whoever runs the site controls that domain name — not that they're honest or are your bank" },
    { text: "That the connection is unencrypted" },
    { text: "That the CA endorses the site's content" }
  ]}
  correct={1}
  explanation="A Domain Validated cert asserts domain control, nothing more. Anyone can obtain one for a domain they own, including scammers. The padlock authenticates the domain, never the intentions — always check WHICH domain you're actually on."
  revisit={{ to: "/docs/cryptography/pki-certificates#how-you-get-a-certificate-and-why-its-now-free", label: "Validation levels" }}
/>

<Question
  prompt="Why is a self-signed certificate inappropriate for a production website?"
  options={[
    { text: "It's too expensive" },
    { text: "It chains to no trusted root, so clients can't verify the identity — it provides encryption but no trustworthy authentication, enabling MITM" },
    { text: "It can't encrypt data" },
    { text: "It expires faster than CA certs" }
  ]}
  correct={1}
  explanation="A self-signed cert vouches only for itself; there's no trusted authority backing it, so clients can't distinguish the real server from an impostor. It's fine for local testing but in production it defeats the authentication PKI exists to provide."
  revisit={{ to: "/docs/cryptography/pki-certificates#common-pitfalls", label: "Self-signed in production" }}
/>

<Question
  prompt="A certificate's private key is stolen before the cert expires. What mechanism is designed to invalidate it early, and what's the modern trend that reduces reliance on it?"
  options={[
    { text: "Pinning; the trend is longer-lived certs" },
    { text: "Revocation (CRL/OCSP); the trend is SHORT-LIVED certificates that expire on their own within days/weeks" },
    { text: "Encryption; the trend is bigger keys" },
    { text: "Nothing can be done until expiry" }
  ]}
  correct={1}
  explanation="Revocation (CRLs and OCSP) marks a cert untrusted before expiry, but checking is imperfect (clients may fail open). The trend is short-lived certificates, so a compromised cert lapses quickly on its own — limiting the damage window."
  revisit={{ to: "/docs/cryptography/pki-certificates#when-trust-must-be-withdrawn-revocation", label: "Revocation" }}
/>

</Quiz>

## What's next

→ Continue to [Key Management](./key-management) — the unglamorous discipline that determines whether all this cryptography actually holds: where keys come from, where they live, how they rotate, and how they're destroyed.

→ **Going deeper:** PKI applied to service-to-service auth is **mutual TLS** in [Cloud & Identity Security](/docs/cloud-identity); certificate mis-issuance and CA compromise appear as [case studies](/docs/case-studies).
