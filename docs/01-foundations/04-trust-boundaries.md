---
id: trust-boundaries
title: Trust Boundaries
sidebar_position: 5
sidebar_label: Trust boundaries
description: The invisible lines where data crosses from less-trusted to more-trusted — and why those crossings are where bugs turn into breaches.
---

# Trust Boundaries

> **In one line:** A **trust boundary** is any line where data or control passes from somewhere you trust less to somewhere you trust more — and *every* serious vulnerability lives at one of these crossings, because that's the exact spot where you must stop trusting and start verifying.

:::tip[In plain English]
Think of a nightclub. Outside is the street — anyone can be there, you trust no one. Inside is the club. The *door with the bouncer* is the trust boundary: the one place where "untrusted outside" becomes "allowed inside." Everything about security at the club happens at that door — checking IDs, refusing troublemakers, patting people down. If the bouncer waves people through without checking, the whole inside is compromised no matter how nice the club is. Software is the same: data arrives from untrusted places (a user's browser, the internet, an uploaded file) and crosses into trusted places (your server, your database). The crossing point is where you check, validate, and authorize — and where attacks succeed when you don't.
:::

## What a trust boundary is

A **trust boundary** is a point in a system where the *level of trust changes* — typically where data flows from a less-trusted zone into a more-trusted one. On either side, things are relatively uniform; the danger is concentrated at the line between them.

Common trust boundaries you cross constantly:

- **Browser → server.** The single most important one. Anything the browser sends — form fields, URL parameters, headers, cookies — is fully attacker-controllable. The user can edit it, replay it, or skip the browser entirely and send raw requests. *The server must never trust the client.*
- **Internet → your network.** The firewall/edge is a trust boundary between the hostile public internet and your internal systems.
- **Your app → the database.** When you build a query from user input, data crosses from "input I shouldn't trust" into "a command my database will obey." Mishandle this crossing and you get [SQL injection](/docs/appsec).
- **One service → another service.** Even "internal" calls cross a boundary. A service that blindly trusts any caller on the internal network hands an attacker the keys the moment they get a foothold.
- **A file/upload → your processing code.** A user-supplied file is untrusted data, even though it "looks like" a harmless image or document.
- **Third-party code → your app.** Every dependency you import runs with *your* trust. A compromised package is an untrusted actor that's already inside the boundary (the subject of [supply-chain security](/docs/secure-sdlc)).

:::note[Terms, defined once]
- **Trust zone** — a region where components trust each other to a similar degree (e.g., "the public internet," "our internal network," "the database tier"). Boundaries are the lines *between* zones.
- **Data flow** — the path data takes through a system. Security people draw **data-flow diagrams (DFDs)** specifically to make the boundaries visible (you'll do this in [threat modeling](/docs/secure-sdlc)).
- **Input validation** — checking that incoming data matches what you expect (type, length, format, range) and rejecting it if not. The primary thing you do *at* a boundary.
- **Sanitization / encoding** — neutralizing data so it can't be misinterpreted as a command by whatever consumes it next (e.g., escaping characters before putting input into HTML or a SQL query).
:::

## The golden rule: never trust the client

The browser→server boundary deserves special attention because beginners get it wrong constantly. Here's the rule and a worked example.

**Rule:** *Anything that happens on the client (in the user's browser or app) can be tampered with. Validation, authorization, and pricing must be re-checked on the server.*

:::note[Worked example: the $0.01 laptop]
A shopping site sends this when you add an item to your cart:

```
POST /cart/add
{ "productId": "laptop-x1", "price": 1299.00, "quantity": 1 }
```

Notice the **price comes from the browser.** An attacker opens the browser's dev tools (or any HTTP tool), intercepts the request, and changes it:

```
POST /cart/add
{ "productId": "laptop-x1", "price": 0.01, "quantity": 1 }
```

If the server *trusts* the price field from the client, it just sold a laptop for one cent. The vulnerability is a **trust-boundary failure**: data that crossed from the untrusted client was treated as authoritative.

**The fix is at the boundary:** the server must ignore the client's price entirely and look up the real price from its *own* database by `productId`. The client can *say* anything; the server decides what's true.

The same pattern repeats everywhere:
- *Client-side form validation* (the "email looks valid" check in JavaScript) is a **convenience for the user, not a security control** — an attacker just skips it. The server must re-validate.
- *Hiding a button* for non-admins does nothing if the admin API endpoint isn't itself checking the caller's role. (That's [authorization](/docs/appsec), enforced server-side.)
- *A `quantity` of `-5`* might credit the attacker money if the server doesn't bound-check what crossed the boundary.
:::

## Where to put your defenses

Once you can *see* the boundaries, defending becomes systematic. At each crossing into a more-trusted zone, you do some combination of:

1. **Authenticate** — establish *who* is sending this. (Is there a valid session/token?)
2. **Authorize** — establish *whether they're allowed* to do this specific thing. (Does this user own this invoice?)
3. **Validate** — confirm the data is well-formed and within expected bounds, and reject it if not. (Is `quantity` a positive integer under some max?)
4. **Sanitize/encode** — neutralize the data for wherever it's headed next, so it can't be reinterpreted as a command. (Parameterize the SQL; encode the HTML.)

Do these *at the boundary*, as data arrives, not deep inside your code where it's easy to forget. A useful mental model: **validate at the edge, distrust by default, and re-establish trust explicitly at each crossing.**

:::info[Highlight: defense in depth means MULTIPLE boundaries]
You don't pick *one* boundary to defend. The browser→server boundary, the service→service boundary, and the app→database boundary are *all* enforced, so that a failure at one doesn't hand over everything. That layering is the topic of the next lesson, [defense in depth](./defense-in-depth).
:::

## Why it matters

- **It localizes where bugs become breaches.** A weakness *inside* a trust zone is often harmless; the same weakness *at a boundary* — where untrusted input arrives — is exploitable. Knowing the boundaries tells you exactly where to focus review and testing.
- **It's the foundation of threat modeling.** The professional practice of [threat modeling](/docs/secure-sdlc) is, mechanically, "draw the data-flow diagram, mark every trust boundary, and ask what could go wrong at each one." If you can find boundaries, you can threat-model.
- **It explains entire vulnerability classes at once.** Injection, broken access control, SSRF, deserialization bugs, the $0.01 laptop — they're all *the same mistake*: trusting data that crossed a boundary. Learn the boundary lens and these stop being a list to memorize and become one idea.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Trusting client-side checks.** JavaScript validation, hidden fields, disabled buttons, and "the app wouldn't send that" are not security. Anything on the client is attacker-controllable; re-check on the server, always.
- **Trusting "internal" traffic.** Treating the internal network as a safe zone means a single foothold compromises everything. Modern designs ([zero trust](/docs/cloud-identity)) treat *every* call as crossing a boundary, internal or not.
- **Validating in one place but not the real one.** Validating in the UI but not the API, or in one endpoint but not another that reaches the same data, leaves the boundary open where it counts. The check must be where the trust actually changes — the server-side entry point.
- **Forgetting that stored data can be hostile.** Data read back from your own database may have been written by an attacker earlier (a stored XSS payload, say). "It came from our DB" is not the same as "it's trusted." Re-encode on the way out, too.
- **Treating dependencies as trusted just because you installed them.** Third-party code runs inside your boundary with your privileges. A poisoned package is an attacker already past the door — which is why supply-chain controls exist.
:::

## Page checkpoint

<Quiz id="trust-boundaries-page" title="Did trust boundaries click?" sampleSize={3}>

<Question
  prompt="A checkout request includes the item's price as a field sent from the browser, and the server charges whatever that field says. An attacker changes the price to $0.01. What is the root cause?"
  options={[
    { text: "Weak encryption on the connection" },
    { text: "A trust-boundary failure: data from the untrusted client was treated as authoritative instead of being re-derived on the server" },
    { text: "A denial-of-service attack" },
    { text: "A weak password policy" }
  ]}
  correct={1}
  explanation="The price crossed the browser→server boundary, where the client controls everything. The server must look up the real price by product ID from its own data, not trust the value the client sent. This is the canonical 'never trust the client' failure."
  revisit={{ to: "/docs/foundations/trust-boundaries#the-golden-rule-never-trust-the-client", label: "Never trust the client" }}
/>

<Question
  prompt="Which statement about client-side (JavaScript) form validation is correct?"
  options={[
    { text: "It is a sufficient security control on its own" },
    { text: "It improves user experience but is not a security control — the server must re-validate, because the client can be bypassed" },
    { text: "It is more secure than server-side validation because it runs first" },
    { text: "It makes server-side validation unnecessary" }
  ]}
  correct={1}
  explanation="Client-side validation gives users fast feedback, but an attacker simply skips the browser and sends raw requests. Security validation must happen server-side, at the trust boundary where untrusted input actually enters your system."
  revisit={{ to: "/docs/foundations/trust-boundaries#the-golden-rule-never-trust-the-client", label: "Client-side checks aren't security" }}
/>

<Question
  prompt="Why do injection, broken access control, SSRF, and the '$0.01 laptop' all count as 'the same mistake' through the trust-boundary lens?"
  options={[
    { text: "They all involve weak passwords" },
    { text: "They all trust data that crossed a boundary from a less-trusted zone instead of verifying it at the crossing" },
    { text: "They are all denial-of-service attacks" },
    { text: "They all require physical access to the server" }
  ]}
  correct={1}
  explanation="Each one is a failure to stop trusting and start verifying at a boundary: untrusted input is treated as a trusted command, a trusted identity, or a trusted value. Seeing the common cause turns a list of bug classes into one idea."
  revisit={{ to: "/docs/foundations/trust-boundaries#why-it-matters", label: "One idea, many bugs" }}
/>

<Question
  prompt="A microservice accepts any request from inside the company network without checking who's calling. An attacker gains a foothold on one internal machine. What's the weakness?"
  options={[
    { text: "There's no weakness — internal traffic is safe by definition" },
    { text: "Treating the internal network as a trusted zone means a single foothold can reach everything; service-to-service calls cross a boundary too and should be authenticated/authorized" },
    { text: "The encryption is too strong" },
    { text: "The service should be moved to the public internet" }
  ]}
  correct={1}
  explanation="'Internal' is not the same as 'trusted.' Every service-to-service call crosses a boundary; blindly trusting internal callers lets one compromised host pivot freely. Zero-trust designs treat every call as untrusted until verified."
  revisit={{ to: "/docs/foundations/trust-boundaries#common-pitfalls", label: "Trusting internal traffic" }}
/>

<Question
  prompt="At a trust boundary where untrusted input enters a more-trusted zone, which set of actions belongs there?"
  options={[
    { text: "Authenticate, authorize, validate, and sanitize/encode the incoming data" },
    { text: "Compress and cache the data for performance" },
    { text: "Encrypt the database at rest only" },
    { text: "Nothing — trust the data because it reached your server" }
  ]}
  correct={0}
  explanation="At each crossing you re-establish trust explicitly: confirm who's calling (authenticate), whether they may do this (authorize), that the data is well-formed (validate), and that it can't be reinterpreted as a command downstream (sanitize/encode)."
  revisit={{ to: "/docs/foundations/trust-boundaries#where-to-put-your-defenses", label: "Where to put your defenses" }}
/>

</Quiz>

## What's next

→ Continue to [Defense in Depth & Least Privilege](./defense-in-depth) — the two principles that decide *how many* boundaries you build and *how much* trust to grant past each one.

→ **Going deeper:** turning boundaries into a repeatable design practice is [threat modeling](/docs/secure-sdlc); the specific boundary bugs are catalogued in [Web & Application Security](/docs/appsec); the "trust nothing, internal or not" stance is [zero-trust architecture](/docs/cloud-identity).
