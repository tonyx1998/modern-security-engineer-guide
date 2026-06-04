---
id: appsec-checkpoint
title: Chapter 3 Checkpoint
sidebar_position: 10
sidebar_label: ✅ Chapter checkpoint
description: Prove the application-security toolkit stuck — a mixed quiz across the OWASP Top 10, injection, XSS, broken authentication and access control, SSRF, deserialization/XXE, and secure-by-default defenses.
---

# Chapter 3 Checkpoint

> **The application-security toolkit, all together.** This mixed quiz pulls from every lesson in the chapter. Passing means you can recognize the major web-app vulnerability classes in real code, exploit them in your head (for authorized testing), and ship the durable fix.

:::tip[How this works]
The quiz draws a random selection from a larger bank each attempt. The chapter's through-line: nearly every bug here is a **trust-boundary failure** — untrusted input treated as code, identity, a destination, or an object — and the durable fixes are *structural* (parameterize, encode by context, deny by default, disable dangerous parser features) rather than filters. If a question stings, follow its revisit link.
:::

## What you should be able to do now

- **Use the [OWASP Top 10](./owasp-top-10)** as a prioritization map and place a given bug in its category.
- **Spot and fix injection** ([SQLi/command](./injection)) with parameterization, and explain why filtering fails.
- **Spot and fix [XSS](./xss)** with context-aware output encoding, safe frameworks, and CSP.
- **Diagnose [authentication](./broken-authentication) failures** (credential stuffing, weak sessions, JWT traps) and prescribe MFA + proper session handling.
- **Diagnose [access-control](./broken-access-control) failures** (IDOR, function-level, privilege escalation) and enforce authorization server-side, deny-by-default.
- **Recognize [SSRF](./ssrf) and [deserialization/XXE](./deserialization-xxe)** and apply the structural defenses.
- **Apply [secure-by-default patterns](./defensive-patterns)** that prevent whole categories at once.

## The checkpoint

<Quiz id="appsec-checkpoint" title="Chapter 3: Web & Application Security" sampleSize={7} passingScore={0.67}>

<Question
  prompt="What is the OWASP Top 10?"
  options={[
    { text: "A complete list of every web vulnerability" },
    { text: "A data-driven, periodically updated ranking of the ten most critical CATEGORIES of web app risk — a prioritization map, not an exhaustive checklist or compliance standard" },
    { text: "A scanning tool" },
    { text: "A government regulation" }
  ]}
  correct={1}
  explanation="It's the industry's prioritized list of the most critical risk categories, refreshed every few years. Each entry is a broad category; it's guidance for prioritization, not a complete checklist or a certification."
  revisit={{ to: "/docs/appsec/owasp-top-10#what-owasp-and-the-top-10-are", label: "OWASP Top 10" }}
/>

<Question
  prompt="Which category is #1 (most prevalent) in the current Top 10?"
  options={[
    { text: "Cryptographic Failures" },
    { text: "Broken Access Control — users acting outside their intended permissions (IDOR, missing function-level checks)" },
    { text: "Server-Side Request Forgery" },
    { text: "Security Logging Failures" }
  ]}
  correct={1}
  explanation="Broken Access Control (A01) tops the list — the per-object, per-action authorization check is easy to omit and the happy path hides the omission."
  revisit={{ to: "/docs/appsec/broken-access-control#why-authorization-is-forgotten-so-often", label: "Why access control is #1" }}
/>

<Question
  prompt="A login query is built by string concatenation. The input `' OR '1'='1' --` logs the attacker in. The correct fix is:"
  options={[
    { text: "Strip quotes and the word OR from input" },
    { text: "Use parameterized queries so the structure is fixed before data arrives and input is always a value, never SQL" },
    { text: "Encrypt the database" },
    { text: "Use a longer password" }
  ]}
  correct={1}
  explanation="Parameterization separates code from data structurally, making injection impossible rather than 'filtered.' Blocklisting characters is fragile and breaks valid input like O'Brien."
  revisit={{ to: "/docs/appsec/injection#the-fix-that-actually-works-parameterization", label: "Parameterization" }}
/>

<Question
  prompt="A 'ping' tool runs `os.system('ping -c 1 ' + userInput)`. Input `8.8.8.8; rm -rf /` is the danger. This is:"
  options={[
    { text: "SQL injection" },
    { text: "Command injection — fix by invoking the program with arguments as a list (no shell), keeping input as data" },
    { text: "XSS" },
    { text: "SSRF" }
  ]}
  correct={1}
  explanation="Concatenating input into a shell command is command injection. The fix mirrors SQLi: avoid the shell, pass arguments directly so input can't become a command."
  revisit={{ to: "/docs/appsec/injection#injection-is-a-family-not-just-sql", label: "Command injection" }}
/>

<Question
  prompt="An attacker stores `<script>…</script>` as their display name; every viewer's browser runs it. Type and primary fix?"
  options={[
    { text: "Reflected XSS; use HTTPS" },
    { text: "Stored XSS; primary fix is context-aware output encoding (auto-escaping framework), backed by CSP and HttpOnly cookies" },
    { text: "DOM XSS; validate input only" },
    { text: "Not XSS" }
  ]}
  correct={1}
  explanation="Server-stored payload served to all viewers = stored XSS. The authoritative fix is encoding on output for the context; frameworks auto-escape by default. CSP and HttpOnly add defense in depth."
  revisit={{ to: "/docs/appsec/xss#the-layered-defense", label: "XSS defense" }}
/>

<Question
  prompt="React's `dangerouslySetInnerHTML` on user content is risky because:"
  options={[
    { text: "It's slow" },
    { text: "It bypasses React's auto-escaping and re-opens XSS; sanitize user HTML with DOMPurify if you must render it" },
    { text: "It disables HTTPS" },
    { text: "It's perfectly safe" }
  ]}
  correct={1}
  explanation="Frameworks are safe by default; raw-HTML escape hatches opt out of escaping. User data through them is likely XSS. Sanitize with a vetted library before rendering untrusted HTML."
  revisit={{ to: "/docs/appsec/xss#the-layered-defense", label: "Framework escape hatches" }}
/>

<Question
  prompt="Most account takeovers come from credential stuffing. The best defense is:"
  options={[
    { text: "Stronger password hashing" },
    { text: "MFA (ideally phishing-resistant), plus breached-password checks and rate limiting — since the leaked credential is already valid, hashing is irrelevant" },
    { text: "Shorter session timeouts only" },
    { text: "Renaming the login page" }
  ]}
  correct={1}
  explanation="Credential stuffing replays valid leaked credentials, so password storage doesn't help. MFA makes a stolen password insufficient; rejecting breached passwords and rate-limiting bots round it out."
  revisit={{ to: "/docs/appsec/broken-authentication#how-credentials-get-broken", label: "Credential stuffing" }}
/>

<Question
  prompt="A JWT verifier accepts `&quot;alg&quot;:&quot;none&quot;`. Why is that catastrophic?"
  options={[
    { text: "It makes tokens longer" },
    { text: "`none` means unsigned — an attacker rewrites claims (role=admin), strips the signature, and it's accepted; pin the expected algorithm and reject none" },
    { text: "It only slows verification" },
    { text: "It's a normal, safe setting" }
  ]}
  correct={1}
  explanation="`alg:none` declares the token unsigned, so forged claims pass. Servers must enforce the expected signing algorithm and a strong key, and reject none."
  revisit={{ to: "/docs/appsec/broken-authentication#the-jwt-trap", label: "JWT trap" }}
/>

<Question
  prompt="A user views `/api/invoices/1001` then iterates to read others' invoices. Bug and fix?"
  options={[
    { text: "SQL injection; parameterize" },
    { text: "IDOR / broken object-level authorization; check ownership server-side (or scope the query to current_user) — random IDs alone don't fix it" },
    { text: "XSS; encode output" },
    { text: "CSRF; add a token" }
  ]}
  correct={1}
  explanation="The app authenticated but never verified ownership — IDOR. Enforce per-object authorization server-side; unguessable IDs only raise effort, the check is the control."
  revisit={{ to: "/docs/appsec/broken-access-control#the-three-faces-of-broken-access-control", label: "IDOR" }}
/>

<Question
  prompt="A profile-update endpoint writes the whole request body to the user record; an attacker adds `&quot;isAdmin&quot;:true`. This is:"
  options={[
    { text: "Session fixation" },
    { text: "Mass-assignment privilege escalation — allowlist writable fields and never bind role/isAdmin from client input" },
    { text: "Reflected XSS" },
    { text: "SSRF" }
  ]}
  correct={1}
  explanation="Binding arbitrary client fields lets the user set authority data — vertical privilege escalation. Allowlist exactly which fields are writable and derive privilege server-side."
  revisit={{ to: "/docs/appsec/broken-access-control#the-three-faces-of-broken-access-control", label: "Privilege escalation" }}
/>

<Question
  prompt="An 'import from URL' feature is given `http://169.254.169.254/...` and returns cloud credentials. Attack and key defenses?"
  options={[
    { text: "XSS; encode output" },
    { text: "SSRF; allowlist destinations, block internal/link-local IPs (validating the resolved IP), harden the metadata service (IMDSv2), and use least-privilege roles + egress segmentation" },
    { text: "SQL injection; parameterize" },
    { text: "Brute force; add MFA" }
  ]}
  correct={1}
  explanation="The server is coerced into fetching the metadata endpoint — SSRF — leaking IAM credentials. Defenses: allowlist destinations, block internal targets by resolved IP, require token-based metadata, and limit role privileges and egress."
  revisit={{ to: "/docs/appsec/ssrf#how-to-defend-ssrf", label: "SSRF defenses" }}
/>

<Question
  prompt="Why can insecure deserialization lead to remote code execution?"
  options={[
    { text: "It always decrypts data" },
    { text: "Native object deserializers can instantiate classes and run code while rebuilding objects; crafted bytes form a gadget chain that executes a command — use data-only formats and never deserialize untrusted bytes into live objects" },
    { text: "It only affects JSON" },
    { text: "It can't cause RCE" }
  ]}
  correct={1}
  explanation="Code-capable deserializers (pickle, Marshal, ObjectInputStream, PHP unserialize) run code during reconstruction. Attacker bytes can chain existing classes into command execution. Prefer JSON/protobuf parsed into plain data; integrity-check any rich serialized input."
  revisit={{ to: "/docs/appsec/deserialization-xxe#insecure-deserialization", label: "Deserialization" }}
/>

<Question
  prompt="XML with `<!ENTITY x SYSTEM &quot;file:///etc/passwd&quot;>` returns the file's contents. Attack and fix?"
  options={[
    { text: "XSS; encode output" },
    { text: "XXE; disable external entities and DTD processing in the XML parser" },
    { text: "SQL injection; parameterize" },
    { text: "CSRF; add tokens" }
  ]}
  correct={1}
  explanation="An XML parser with external entities enabled fetches the referenced file or URL — XXE (also a path to SSRF and DoS). The fix is configuration: disable external entities and DTDs."
  revisit={{ to: "/docs/appsec/deserialization-xxe#xxe--xml-external-entity-injection", label: "XXE" }}
/>

<Question
  prompt="Which best captures 'secure by default'?"
  options={[
    { text: "Add a penetration test before launch" },
    { text: "Arrange frameworks, scaffolds, and config so the easy path is the safe path — auto-escaping output, query builders that can't concatenate, endpoints that require auth, locked-down defaults — so security doesn't rely on remembering" },
    { text: "Encrypt all traffic twice" },
    { text: "Write more documentation" }
  ]}
  correct={1}
  explanation="Secure-by-default makes the correct thing the easy thing, preventing whole categories without per-line vigilance. When you can make forgetting a control impossible rather than training people to remember, do that."
  revisit={{ to: "/docs/appsec/defensive-patterns#pattern-3-choose-secure-by-default-frameworks-and-respect-their-guardrails", label: "Secure by default" }}
/>

<Question
  prompt="A teammate claims 'we validate all input, so injection and XSS are handled.' Best correction?"
  options={[
    { text: "Correct — validation handles both" },
    { text: "Validation is a useful layer, but injection is fixed by parameterization and XSS by context-aware OUTPUT encoding; defend the output boundary where data meets each interpreter, not just the input" },
    { text: "Move validation to the client" },
    { text: "Validation makes things worse" }
  ]}
  correct={1}
  explanation="Input validation reduces bad data but isn't sufficient — the same value is safe or dangerous by output context. Parameterize for SQL, encode for HTML/JS/URL. Defend both ends; the authoritative fix is usually at output."
  revisit={{ to: "/docs/appsec/defensive-patterns#pattern-2-encode-output-for-its-context", label: "Encode at output" }}
/>

</Quiz>

## Chapter 3 complete

You can now reason about the application layer the way a security engineer does: every untrusted input is a question — *will this be treated as code, identity, a destination, or an object it shouldn't be?* — and the answers are structural defenses, not filters. The [OWASP Top 10](./owasp-top-10) is your map; [parameterization](./injection), [output encoding](./xss), [MFA + sane sessions](./broken-authentication), [deny-by-default authorization](./broken-access-control), [SSRF egress controls](./ssrf), [safe parsing](./deserialization-xxe), and [secure-by-default patterns](./defensive-patterns) are your toolkit.

→ On to [Chapter 4: Secure SDLC & DevSecOps](/docs/secure-sdlc), where these per-feature defenses become a repeatable *process* — threat modeling before code, and automated scanning that catches these classes before they ever reach production.
