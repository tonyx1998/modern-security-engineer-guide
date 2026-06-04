---
id: broken-access-control
title: Broken Access Control
sidebar_position: 6
sidebar_label: Broken access control
description: The #1 risk in the OWASP Top 10 — IDOR, missing function-level checks, and privilege escalation. Why authorization is missed so often, and how to enforce it server-side by default.
---

# Broken Access Control

> **In one line:** **Authorization** decides *what an authenticated user may do*, and it's the **most common** serious web flaw because the check is easy to forget — the app confirms you're *logged in* but never that *this* resource or action is *yours* — so the fix is to enforce access centrally, server-side, deny-by-default, on every request.

:::tip[In plain English]
You've proven who you are (that was [authentication](./broken-authentication)). Now: are you *allowed* to do this specific thing? Open *this* invoice, delete *that* account, hit *the admin* page? **Broken access control** is when the answer should be "no" but the app lets you anyway. It's the single most prevalent category in the [OWASP Top 10](./owasp-top-10) (A01) for a simple reason: authentication is a *visible* feature you build once, but authorization is an *invisible* check you must remember on *every* endpoint and *every* object — and humans forget. The classic case: you view your own order at `/orders/501`, change it to `/orders/502`, and you're reading a stranger's order. The app checked you were logged in; it never checked the order was yours. That one missing line is, across the industry, the most common way data leaks.
:::

## Why authorization is forgotten so often

Three structural reasons access control is the most-missed control:

1. **It's per-object and per-action, not once.** Authentication is a single gate. Authorization must be re-checked for *every* resource and *every* operation — thousands of checks across an app, any one of which can be omitted silently.
2. **The happy path hides it.** In normal use, the UI only ever *shows* you your own data, so missing checks aren't visible in testing. The bug only appears when someone deliberately requests what the UI never offered — the [attacker's mindset](/docs/foundations/attacker-mindset).
3. **Client-side "enforcement" isn't enforcement.** Hiding an admin button or omitting a link does nothing; the [API endpoint is the real boundary](/docs/foundations/trust-boundaries), and an attacker calls it directly.

:::note[Terms, defined once]
- **Authorization (authz) / access control** — enforcing what an authenticated identity is permitted to do.
- **IDOR (Insecure Direct Object Reference)** — accessing another user's object by changing its identifier (the `/orders/502` case); a subtype of broken object-level authorization.
- **Function-level (or endpoint) access control** — checking that a user may invoke a given *operation* (e.g., only admins can call `DELETE /users`).
- **Privilege escalation** — gaining higher rights than granted: **vertical** (user → admin) or **horizontal** (one user → another user's data/actions).
- **RBAC / ABAC** — Role-Based / Attribute-Based Access Control: models for expressing who can do what (by role, or by attributes/policies).
- **Deny by default** — start from "no access" and grant explicitly; the safe default (an application of [least privilege](/docs/foundations/defense-in-depth)).
:::

## The three faces of broken access control

**1. Object-level (IDOR) — "can I see *your* data?"**

:::note[Worked example: IDOR end to end]
The endpoint `GET /api/invoices/{id}` returns an invoice. The code:

```
invoice = db.invoices.find(id)      // fetch by the id from the URL
return invoice                       // ...and just return it
```

It authenticated the user (valid session) but never checked **ownership**. The attacker, logged into their own account, simply iterates: `/api/invoices/1001`, `1002`, `1003`… and harvests every customer's invoice. The fix is one clause — scope the query to the caller:

```
invoice = db.invoices.find(id)
if invoice.owner_id != current_user.id:   // the missing check
    return 403 Forbidden
return invoice
```

Better still, make the query itself ownership-scoped (`WHERE id = ? AND owner_id = ?`) so an un-owned object is *never even fetched*. Using unguessable IDs (UUIDs) raises the bar but is **not** a fix — it's [security by obscurity](#common-pitfalls); the authorization check is what actually protects the data.
:::

**2. Function-level — "can I call *that* operation?"**

An app hides the "Delete user" button for non-admins but the endpoint `DELETE /api/users/{id}` doesn't verify the caller's role. A regular user calls it directly and deletes accounts. The UI is not a security boundary; **every privileged endpoint must check the role server-side.**

**3. Privilege escalation — "can I *become* more?"**

The user tampers with something that determines their rights: a `role=user` field in a request body, cookie, or JWT they can edit; a mass-assignment that lets them set `isAdmin=true` on their own profile update; a workflow step they skip. Vertical escalation (→ admin) or horizontal (→ another user) both stem from trusting client-supplied authority data.

:::caution[Worked example: mass-assignment privilege escalation]
A profile-update endpoint blindly maps the JSON body onto the user record:

```
user.update(request.body)   // whatever fields are in the body get written
```

The form normally sends `{name, email}`. The attacker adds a field: `{"name":"x","isAdmin":true}`. The endpoint writes `isAdmin=true` to *their own* account. They're now an admin. The flaw is trusting client input to set *authority* fields. Fix: **allowlist** which fields a user may set (never bind `role`/`isAdmin` from input), and derive privilege server-side.
:::

## How to enforce access control properly

- **Deny by default.** Every endpoint requires an explicit authorization decision; the absence of a check should mean *no access*, not *open*. (Frameworks that "secure by default — every route needs an `@authorize`" prevent the "forgot one" failure.)
- **Centralize the logic.** Don't scatter ad-hoc `if user.role == ...` checks across hundreds of handlers. Use middleware/policies/a single authorization layer so the rule is defined once and consistently applied — and auditable.
- **Enforce server-side, at the API.** The server is the only real [trust boundary](/docs/foundations/trust-boundaries). Client-side hiding is UX, not security.
- **Check object ownership on every object access**, ideally by scoping queries to the current user so un-owned objects can't be returned at all.
- **Never trust client-supplied authority.** Roles, permissions, prices, user IDs, and `isAdmin` flags come from the *server's* record of the session — never from a request field. Allowlist writable fields.
- **Test for it deliberately.** Because the happy path hides these bugs, you must actively try the attacker moves: change IDs, call admin endpoints as a normal user, replay another user's requests. This is core [pentest](/docs/offensive) methodology.

:::info[Highlight: the one-sentence rule]
**Authenticate once; authorize every time.** Every request that touches a protected resource or action must independently answer "is *this* identity allowed to do *this* to *this* object?" — server-side, deny-by-default. Most access-control breaches are simply that question going unasked.
:::

## Why it matters

- **It's #1.** Broken Access Control is the top category in the current [OWASP Top 10](./owasp-top-10) — the most prevalent *and* among the most damaging, because it directly exposes data and privileged actions.
- **The bugs are simple but invisible.** A single missing ownership check leaks an entire customer base. No exotic exploit required — just an iterated ID — which is why automated and manual access-control testing is essential.
- **It's pure [Foundations](/docs/foundations) applied.** Trust boundaries, least privilege, the attacker's mindset, deny-by-default — access control is where all four cash out in code.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Checking authentication but not authorization.** "They're logged in" ≠ "they may do this." Add the per-object, per-action check.
- **Enforcing only in the UI.** Hidden buttons and omitted links stop nothing; attackers call the API directly. Enforce server-side.
- **Relying on unguessable IDs (UUIDs) instead of checks.** Obscurity raises effort, not security — leaked/enumerated IDs still work. The authorization check is the control.
- **Trusting client-supplied roles/IDs/flags.** Mass assignment and editable `role`/`isAdmin` fields are escalation waiting to happen. Allowlist writable fields; derive authority server-side.
- **Scattering inconsistent checks.** Hand-rolled `if` checks in every handler guarantee one gets missed. Centralize authorization in middleware/policies and deny by default.
- **Not testing the unhappy path.** If you only test as the intended user, you'll never see the bug. Deliberately try other users' IDs and privileged endpoints.
:::

## Page checkpoint

<Quiz id="broken-access-control-page" title="Did access control click?" sampleSize={3}>

<Question
  prompt="Why is Broken Access Control the MOST prevalent category in the OWASP Top 10?"
  options={[
    { text: "Because encryption is hard" },
    { text: "Authentication is one gate, but authorization must be re-checked on every object and every action — any single omitted check is a silent hole, and the happy path hides it" },
    { text: "Because most apps don't use HTTPS" },
    { text: "Because passwords are weak" }
  ]}
  correct={1}
  explanation="Authz is per-object and per-action — thousands of checks, any of which can be silently forgotten — and normal use never reveals a missing one, since the UI only shows you your own data. That structural fragility makes it the #1 category."
  revisit={{ to: "/docs/appsec/broken-access-control#why-authorization-is-forgotten-so-often", label: "Why it's forgotten" }}
/>

<Question
  prompt="A user views `/api/invoices/1001` (their own), then requests `1002`, `1003`… and reads other customers' invoices. What's the bug and the proper fix?"
  options={[
    { text: "SQL injection; parameterize the query" },
    { text: "IDOR / broken object-level authorization; check ownership server-side (or scope the query to the current user) so un-owned objects are never returned" },
    { text: "XSS; encode the output" },
    { text: "Use longer invoice IDs to fix it" }
  ]}
  correct={1}
  explanation="The app authenticated the user but never verified the invoice belonged to them — IDOR. Fix by checking owner_id (or querying WHERE owner_id = current_user). Bigger/random IDs only raise effort; the authorization check is the actual control."
  revisit={{ to: "/docs/appsec/broken-access-control#the-three-faces-of-broken-access-control", label: "IDOR" }}
/>

<Question
  prompt="An app hides the 'Delete user' button from non-admins, but a regular user calls `DELETE /api/users/42` directly and it works. What's the lesson?"
  options={[
    { text: "The button should be a different color" },
    { text: "The UI is not a security boundary — function-level authorization must be enforced server-side on every privileged endpoint, regardless of what the UI shows" },
    { text: "Deletes should be disabled entirely" },
    { text: "The user found a zero-day" }
  ]}
  correct={1}
  explanation="Hiding controls in the UI is UX, not security; the API is the real boundary and attackers call it directly. Every privileged operation must verify the caller's role/permission server-side."
  revisit={{ to: "/docs/appsec/broken-access-control#the-three-faces-of-broken-access-control", label: "Function-level access control" }}
/>

<Question
  prompt="A profile-update endpoint writes the whole request body to the user record. An attacker adds `&quot;isAdmin&quot;: true` and becomes an admin. What's the flaw and fix?"
  options={[
    { text: "Weak password; require MFA" },
    { text: "Mass-assignment privilege escalation — trusting client input to set authority fields; fix by allowlisting writable fields and never binding role/isAdmin from input" },
    { text: "Session fixation; rotate the session" },
    { text: "It's not exploitable" }
  ]}
  correct={1}
  explanation="Binding arbitrary client fields lets the user set authority data like isAdmin — vertical privilege escalation. Allowlist exactly which fields a user may set, and derive privilege from the server's record, never from the request."
  revisit={{ to: "/docs/appsec/broken-access-control#the-three-faces-of-broken-access-control", label: "Privilege escalation" }}
/>

<Question
  prompt="Which principle best summarizes correct access-control enforcement?"
  options={[
    { text: "Authorize once at login, then trust the session for everything" },
    { text: "Authenticate once; authorize every time — every protected request independently checks, server-side and deny-by-default, whether THIS identity may do THIS to THIS object" },
    { text: "Authorize only admin actions; user actions are safe" },
    { text: "Enforce access control in the front-end framework" }
  ]}
  correct={1}
  explanation="Identity is established once, but permission must be verified on every request to a protected resource/action — centrally, server-side, deny-by-default. Most access-control breaches are simply that per-request question never being asked."
  revisit={{ to: "/docs/appsec/broken-access-control#how-to-enforce-access-control-properly", label: "Enforcing properly" }}
/>

</Quiz>

## What's next

→ Continue to [Server-Side Request Forgery (SSRF)](./ssrf) — back to the injection family, but with a twist: the attacker makes *your server* perform requests on their behalf, pivoting into internal systems and cloud metadata.

→ **Going deeper:** access-control models at scale (RBAC/ABAC, policy engines, zero trust) are in [Cloud & Identity Security](/docs/cloud-identity); finding these bugs is core to [Penetration Testing](/docs/offensive).
