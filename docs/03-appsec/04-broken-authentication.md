---
id: broken-authentication
title: Broken Authentication
sidebar_position: 5
sidebar_label: Broken authentication
description: Failures in proving WHO a user is — credential stuffing, weak sessions and JWT mistakes, MFA bypasses — and how modern login is hardened.
---

# Broken Authentication

> **In one line:** **Authentication** is proving *who* you are, and it breaks in predictable ways — passwords reused from other breaches (credential stuffing), session tokens that can be stolen or forged, and missing or bypassable second factors — so the defenses are strong credential handling, robust session management, and MFA.

:::tip[In plain English]
Authentication is the front door's question: "are you really who you claim to be?" Every app answers it — usually with a password, then a *session* so you don't re-type it on every click. Things go wrong in two broad ways. First, the *credential* is weak or already known to attackers: people reuse the same password everywhere, so one site's breach unlocks dozens of accounts. Second, the *session* — the token that says "this browser is logged in as Alice" — gets stolen, guessed, or forged, letting an attacker *become* Alice without ever knowing her password. This lesson is about both: how login and sessions actually work, the specific ways they fail, and what hardened modern authentication looks like. (This is the [identity cluster](./owasp-top-10) of the OWASP Top 10 — A07.)
:::

## Two halves: credentials and sessions

Authentication has two phases, each with its own failure modes:

1. **Login** — verifying a credential (password, passkey, OAuth token) *once*.
2. **Session** — remembering that verification across subsequent requests, because [HTTP is stateless](/docs/foundations/trust-boundaries) (each request is independent). After login the server issues a **session token** the client sends with every later request to prove "I already logged in."

Break either and the attacker is in.

:::note[Terms, defined once]
- **Authentication (authn)** — proving *who* you are. (Distinct from **authorization** — what you're *allowed* to do — the next lesson.)
- **Credential** — the secret/proof you log in with: password, passkey, one-time code.
- **Session token** — the value (often a cookie or JWT) that represents a logged-in session on later requests.
- **Credential stuffing** — automated login attempts using username/password pairs leaked from *other* sites, exploiting password reuse.
- **Brute force** — trying many passwords against one account; **password spraying** — trying one common password against many accounts (to dodge lockouts).
- **MFA (Multi-Factor Authentication)** — requiring two+ independent factors: something you *know* (password), *have* (phone/passkey), or *are* (biometric).
- **JWT (JSON Web Token)** — a self-contained, signed token carrying claims (who you are), verifiable without a server-side lookup. Powerful and easy to misuse.
- **Session fixation** — an attack where the attacker sets a victim's session ID *before* login and reuses it after.
:::

## How credentials get broken

- **Credential stuffing (the big one).** Billions of username/password pairs from past breaches are public. Attackers replay them at scale; because people reuse passwords, a meaningful percentage *work*. This — not clever cracking — is how most account takeovers happen.
- **Weak password storage.** If your DB is breached and passwords were stored with a fast or unsalted hash, they're cracked en masse — turning your breach into *every other site's* breach via reuse. (Use a slow salted KDF — see [hashing](/docs/cryptography/hashing-and-macs).)
- **Brute force / spraying.** Unlimited login attempts let attackers guess weak passwords. Rate limiting and lockouts are the counter.
- **Weak reset flows.** A "forgot password" feature with guessable tokens, no expiry, or leaky responses is often the *weakest* door — attackers target it instead of the login.

:::note[Worked example: a credential-stuffing takeover]
A breach at SiteX leaks `alice@example.com : Summer2023!`. Alice reused it on your app. An attacker:
1. Loads millions of leaked pairs into a tool.
2. Fires them at your login from rotating IPs, slowly enough to dodge naive rate limits.
3. A fraction succeed — including Alice's — and those accounts are now the attacker's.

Notice no password was "cracked" and your hashing was irrelevant — the credential was *already valid*. The defenses that actually stop this: **MFA** (a stolen password isn't enough), **breached-password checks** (reject known-leaked passwords at signup), bot/rate-limit defenses, and anomaly detection (impossible-travel logins). This is why MFA is the single highest-leverage authentication control.
:::

## How sessions get broken

Once logged in, the **session token** is as good as the password — anyone holding it *is* the user. Attacks:

- **Session hijacking (theft).** Steal the token via [XSS](./xss) (if it's readable by JS), network sniffing (if not HTTPS), or malware. Defenses: `HttpOnly` (JS can't read it), `Secure` (HTTPS only), `SameSite` (limits cross-site sending), short lifetimes, and rotation on privilege change.
- **Predictable tokens.** If session IDs are sequential or low-entropy, attackers guess valid ones. Tokens must be long and from a [CSPRNG](/docs/cryptography/key-management).
- **Session fixation.** The app reuses a pre-login session ID after login, so an attacker who planted one rides in. Defense: **issue a brand-new session ID at login**.
- **No expiry / no logout.** Sessions that live forever or survive "log out" give stolen tokens unlimited value. Expire them; invalidate server-side on logout.

### The JWT trap

**JWTs** are popular for stateless auth: a signed token the server can verify without a database lookup. They're powerful but have sharp edges that cause real breaches:

:::caution[Worked example: the JWT `alg:none` and weak-secret traps]
A JWT has a header saying which algorithm signed it. Two classic failures:

1. **The `alg: none` bypass.** Some libraries historically honored a token whose header said `"alg":"none"` — meaning *unsigned*. An attacker rewrites the token's claims to `"role":"admin"`, sets `alg` to `none`, strips the signature, and a naïve verifier *accepts it*. Always reject `none` and pin the expected algorithm server-side.
2. **Weak HMAC secret.** If a JWT is signed with `HS256` using a guessable secret, an attacker brute-forces the secret offline and then forges *any* token they like. Use a strong, random secret (or asymmetric `RS256`/`ES256`).

A deeper structural issue: **a JWT can't be easily revoked** before it expires, because verification is stateless (no lookup). If a token is stolen, it's valid until expiry. Mitigations: short lifetimes + refresh tokens, or a server-side revocation list (which gives up some of JWT's statelessness). Don't put JWTs in `localStorage` where [XSS](./xss) can read them; prefer `HttpOnly` cookies.
:::

## What hardened authentication looks like

- **Require MFA**, especially for admins and sensitive actions — the highest-leverage control, defeating credential stuffing and phishing of passwords alone. **Phishing-resistant** factors (passkeys/WebAuthn, hardware keys) beat SMS codes (which are SIM-swappable).
- **Move toward passkeys.** Passkeys (WebAuthn) replace passwords with device-bound public-key crypto — nothing reusable to steal or phish.
- **Store passwords with a slow salted KDF** (Argon2id/bcrypt) and **reject known-breached passwords** at signup.
- **Rate-limit and bot-protect** login and reset flows; alert on anomalies (impossible travel, spikes).
- **Manage sessions properly:** high-entropy tokens, `HttpOnly`/`Secure`/`SameSite` cookies, new session ID at login, sensible expiry, real server-side logout.
- **Harden reset flows** as carefully as login — single-use, short-lived, unguessable tokens; don't reveal whether an account exists.

:::info[Highlight: authentication ≠ authorization]
Lock this distinction in now, because mixing them up causes bugs: **authentication** proves *who you are* (this lesson); **authorization** decides *what you may do* (next lesson). A system can authenticate you perfectly and still fail to check whether you're allowed to view a given record — a separate, even more common bug. Logging in correctly is necessary but not sufficient.
:::

## Why it matters

- **It's the most-attacked door.** Credential stuffing alone accounts for a huge share of account-takeover traffic; auth failures are A07 in the [Top 10](./owasp-top-10).
- **One weak link cascades.** Reused passwords and stealable sessions mean a failure here often *is* the breach — no further exploitation needed.
- **MFA and passkeys are where the field is moving.** Knowing why password-only auth is obsolete, and what replaces it, is core security-engineer judgment.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Relying on passwords alone.** Without MFA, credential stuffing wins eventually. Add MFA; prefer phishing-resistant factors.
- **Storing passwords with fast/unsalted hashes.** Turns your breach into everyone's. Use Argon2id/bcrypt and reject breached passwords.
- **Treating session tokens casually.** Missing `HttpOnly`/`Secure`/`SameSite`, predictable IDs, no rotation at login, or eternal sessions all hand attackers the keys.
- **JWT misuse.** Accepting `alg:none`, weak secrets, no expiry, no revocation plan, or storing them where XSS can read them. Pin the algorithm, use strong keys, keep lifetimes short.
- **Ignoring the reset flow.** It's often the weakest path to an account. Harden it as much as login.
- **Confusing authn with authz.** Verifying identity is not verifying permission — check both.
:::

## Page checkpoint

<Quiz id="broken-authentication-page" title="Did broken auth click?" sampleSize={3}>

<Question
  prompt="Most real-world account takeovers happen via credential stuffing. What is it, and what stops it best?"
  options={[
    { text: "Cracking your password hashes; stopped by encryption" },
    { text: "Replaying username/password pairs leaked from OTHER sites (exploiting reuse); best stopped by MFA, breached-password checks, and rate limiting — your hashing is irrelevant since the credential is already valid" },
    { text: "Guessing session IDs; stopped by longer URLs" },
    { text: "A type of SQL injection" }
  ]}
  correct={1}
  explanation="Credential stuffing replays already-valid leaked credentials, banking on password reuse. No cracking is needed, so password storage doesn't help. MFA (a stolen password isn't enough), rejecting breached passwords, and bot/rate defenses are what stop it."
  revisit={{ to: "/docs/appsec/broken-authentication#how-credentials-get-broken", label: "Credential stuffing" }}
/>

<Question
  prompt="Why is a session token 'as good as the password' once issued?"
  options={[
    { text: "It contains the plaintext password" },
    { text: "It proves the session is already authenticated, so anyone holding it IS the user on subsequent requests — which is why it must be protected (HttpOnly/Secure/SameSite, high entropy, expiry)" },
    { text: "It can be used to reset the password" },
    { text: "It isn't — tokens are harmless" }
  ]}
  correct={1}
  explanation="HTTP is stateless, so the session token is how the server recognizes a logged-in user on every later request. Stealing or forging it lets an attacker act as the user without the password — hence strict cookie flags, high-entropy values, rotation at login, and expiry."
  revisit={{ to: "/docs/appsec/broken-authentication#how-sessions-get-broken", label: "How sessions break" }}
/>

<Question
  prompt="A JWT verifier accepts a token whose header says `&quot;alg&quot;:&quot;none&quot;`. Why is that catastrophic?"
  options={[
    { text: "It makes tokens too long" },
    { text: "`none` means UNSIGNED — an attacker can rewrite the claims (e.g., role=admin), strip the signature, and the verifier accepts the forged token; always reject `none` and pin the expected algorithm" },
    { text: "It only slows down verification" },
    { text: "Nothing — it's a normal setting" }
  ]}
  correct={1}
  explanation="`alg:none` tells the verifier the token is unsigned, so any forged claims are accepted. Servers must reject `none` and enforce the expected signing algorithm and a strong secret/key. JWTs are powerful but must be validated strictly."
  revisit={{ to: "/docs/appsec/broken-authentication#the-jwt-trap", label: "The JWT trap" }}
/>

<Question
  prompt="What is the single highest-leverage control against password-based attacks (stuffing, phishing of passwords, brute force)?"
  options={[
    { text: "A longer maximum password length" },
    { text: "Multi-factor authentication (MFA), ideally phishing-resistant (passkeys/WebAuthn or hardware keys) — a stolen or guessed password alone is no longer enough" },
    { text: "Changing the login URL" },
    { text: "Disabling cookies" }
  ]}
  correct={1}
  explanation="MFA breaks the value of a stolen/guessed password by requiring a second independent factor. Phishing-resistant factors (passkeys, hardware keys) beat SMS codes, which are SIM-swappable. It's the top control for this whole category."
  revisit={{ to: "/docs/appsec/broken-authentication#what-hardened-authentication-looks-like", label: "Hardened authentication" }}
/>

<Question
  prompt="How do authentication and authorization differ?"
  options={[
    { text: "They're the same thing" },
    { text: "Authentication proves WHO you are; authorization decides WHAT you're allowed to do — a system can authenticate you correctly yet still fail to check your permission for a specific action" },
    { text: "Authentication is for admins; authorization is for users" },
    { text: "Authorization happens first, then authentication" }
  ]}
  correct={1}
  explanation="Authn = identity; authz = permission. Verifying login is necessary but not sufficient — you still must check whether that identity may perform each action. Conflating them causes very common access-control bugs (next lesson)."
  revisit={{ to: "/docs/appsec/broken-authentication#what-hardened-authentication-looks-like", label: "Authn vs authz" }}
/>

</Quiz>

## What's next

→ Continue to [Broken Access Control](./broken-access-control) — the *other* half of identity and the #1 category in the Top 10: once you know *who* a user is, how do you correctly enforce *what they're allowed to do* — and why this check is missed so often.

→ **Going deeper:** the cryptographic side of credentials is [password hashing](/docs/cryptography/hashing-and-macs); enterprise identity (SSO, federation, passkeys at scale) is [Cloud & Identity Security](/docs/cloud-identity).
