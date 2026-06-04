---
id: deserialization-xxe
title: Unsafe Deserialization & XXE
sidebar_position: 8
sidebar_label: Deserialization & XXE
description: When parsing attacker data becomes running attacker code — insecure deserialization and XML External Entities (XXE). Why they're so severe, and the safe-parsing defenses.
---

# Unsafe Deserialization & XXE

> **In one line:** **Deserialization** (rebuilding an object from bytes) and **XML parsing** can be tricked into doing far more than reading data — running code, reading server files, or triggering SSRF — when an app *trusts* attacker-supplied serialized data or XML, so the defense is to never deserialize untrusted input into rich objects and to disable dangerous parser features by default.

:::tip[In plain English]
Programs constantly turn data into bytes to store or send (**serialization**) and back into usable objects on the other side (**deserialization**) — and they parse formats like XML and JSON the same way. Normally this is mundane plumbing. The danger is that some serialization formats and parsers are *too powerful*: rebuilding an object can run the object's setup code, and parsing an XML file can instruct the parser to go read `/etc/passwd` or fetch an internal URL. If an attacker controls the bytes you deserialize or the XML you parse, they can smuggle in instructions that the *act of parsing* carries out — often achieving **remote code execution**, the most severe outcome in security. The fix is the now-familiar theme: don't let untrusted data drive a powerful interpreter; use the boring, locked-down parsing path.
:::

## Insecure deserialization

**Serialization** converts an in-memory object to a transportable form (a byte stream, a string); **deserialization** reconstructs it. The risk: in many languages, deserialization doesn't just copy data — it can **instantiate arbitrary classes and run code** as part of rebuilding the object. Feed such a deserializer attacker-controlled bytes and you may be handing it a program to execute.

```
Attacker-controlled bytes  ──deserialize──▶  reconstructs objects
                                              ...and may RUN code during reconstruction
```

:::note[Worked example: a malicious serialized object → code execution]
An app stores a user's session as a serialized object in a cookie and deserializes it on each request using a *native* object deserializer (Java's `ObjectInputStream`, Python's `pickle`, PHP's `unserialize`, Ruby's `Marshal`). An attacker crafts a byte stream that, *when deserialized*, constructs a chain of existing classes (a "**gadget chain**") whose constructors/handlers ultimately execute a system command.

The attacker base64-encodes this payload into the cookie. On the next request, the server deserializes it — and runs the attacker's command **with the server's privileges**. No memory corruption, no exotic exploit: the app *asked* the deserializer to rebuild whatever object the bytes described, and the bytes described a weapon. This class has produced critical RCE in major platforms.

**The fix:** never deserialize untrusted data with a code-capable native deserializer. Use a **data-only format** (JSON/Protocol Buffers) with a parser that produces plain data structures, not arbitrary objects. If you must use a rich format, restrict allowed types to a strict allowlist and sign the data so tampering is detected.
:::

:::caution[The rule]
**Don't deserialize untrusted input into live objects.** Treat any serialized blob from a client (cookies, hidden fields, API bodies, message queues) as hostile. Prefer JSON/protobuf parsed into plain data; never `pickle`/`Marshal`/native-`unserialize`/`ObjectInputStream` on attacker-controlled bytes. Where unavoidable, **integrity-protect** the data (a [MAC](/docs/cryptography/hashing-and-macs)) so only your server could have produced it, and **allowlist** deserializable types.
:::

## XXE — XML External Entity injection

XML parsers support a legacy feature called **entities** — placeholders that expand to other content — including **external entities** that tell the parser to fetch content from a URL or file path. If an XML parser processes attacker XML with external entities *enabled*, the attacker dictates what the parser fetches.

:::note[Worked example: XXE reading server files and triggering SSRF]
An endpoint accepts XML (an upload, a SOAP/API request) and parses it with default settings. The attacker sends:

```xml
<?xml version="1.0"?>
<!DOCTYPE data [
  <!ENTITY x SYSTEM "file:///etc/passwd">
]>
<data>&x;</data>
```

The `<!ENTITY x SYSTEM "file:///etc/passwd">` defines an external entity pointing at a local file; `&x;` expands it. A parser with external entities enabled reads `/etc/passwd` and includes its contents in the parsed result — which the app may echo back. Swap the path for `http://169.254.169.254/...` and XXE becomes [SSRF](./ssrf) into cloud metadata; point it at an internal service for port-scanning; reference a huge/recursive entity for a denial-of-service ("billion laughs").

**The fix is one setting:** **disable external entities and DTD processing** in the XML parser. Most modern libraries can be configured to refuse external entities (and many now default to safe), which neutralizes XXE entirely — a perfect example of "secure the parser, don't sanitize the input."
:::

## The common thread: don't let parsing do too much

Deserialization bugs and XXE are the same shape as [injection](./injection): **untrusted data reaches an over-powerful interpreter** (an object deserializer, an XML parser) that does more than read data. They're grouped in the Top 10 under **Software & Data Integrity Failures** (A08) — the failure is *trusting data you didn't verify*. The defenses rhyme with the rest of the chapter:

- **Use the least-powerful parser for the job.** A data-only JSON parse can't run code or fetch files; a native object deserializer or a full XML parser can. Pick the one that *can't* hurt you.
- **Disable dangerous features by default** (external entities, DTDs, polymorphic type handling).
- **Verify integrity before trusting** — sign/MAC serialized data so attacker-supplied blobs are rejected before they're ever parsed into objects.
- **Treat all serialized input as crossing a [trust boundary](/docs/foundations/trust-boundaries).**

:::info[Highlight: why these rank as "critical" severity]
Both classes frequently yield **remote code execution (RCE)** or arbitrary file read on the server — the top of the impact scale, because the attacker runs *as your application*. That's why, even though they're less common than access-control bugs, a single instance is often a "drop everything and patch" finding. Severity (how bad if exploited) and prevalence (how often it appears) are different axes — recall [risk = likelihood × impact](/docs/foundations/threat-vuln-risk); these are the high-*impact* end.
:::

## Why it matters

- **Maximum impact.** RCE means total server compromise; file-read and SSRF-via-XXE expose secrets and pivot into infrastructure. These bugs end engagements quickly.
- **They hide in "boring" plumbing.** Cookies, file uploads, API bodies, and inter-service messages all deserialize or parse — easy to overlook, severe when wrong.
- **The fix is configuration, not cleverness.** Choosing a safe format and turning off dangerous parser features prevents entire classes outright — the highest-leverage kind of security work.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Deserializing untrusted data with native, code-capable deserializers** (`pickle`, `Marshal`, PHP `unserialize`, Java `ObjectInputStream`). Use data-only formats (JSON/protobuf); never feed attacker bytes to an object deserializer.
- **Parsing XML with default/legacy settings.** Disable external entities and DTD processing to kill XXE; don't assume your library is safe by default (older ones aren't).
- **Trusting signed-looking blobs without actually verifying.** A serialized session in a cookie must be integrity-checked (MAC) *before* deserialization, and the verification must use constant-time comparison.
- **Forgetting the non-obvious entry points.** Message-queue payloads, cache values, and inter-service messages are deserialized too — and may be attacker-influenced (second-order).
- **Treating these as low priority because they're 'rare.'** Rare but RCE-grade: a single instance is often critical. Prioritize by impact, not just frequency.
:::

## Page checkpoint

<Quiz id="deserialization-xxe-page" title="Did deserialization & XXE click?" sampleSize={3}>

<Question
  prompt="Why can insecure deserialization lead to remote code execution?"
  options={[
    { text: "Because JSON is always unsafe" },
    { text: "In many languages, reconstructing an object can instantiate classes and run code during deserialization; attacker-controlled bytes can describe a 'gadget chain' that executes a command with the server's privileges" },
    { text: "Because deserialization always decrypts data" },
    { text: "It can't — deserialization only copies data" }
  ]}
  correct={1}
  explanation="Native object deserializers don't merely copy data — they can build arbitrary objects and run code as part of reconstruction. Crafted bytes can trigger a chain of existing classes that ends in command execution. Use data-only formats and never deserialize untrusted bytes into live objects."
  revisit={{ to: "/docs/appsec/deserialization-xxe#insecure-deserialization", label: "Insecure deserialization" }}
/>

<Question
  prompt="What is the safe approach to handling serialized data from clients (cookies, API bodies)?"
  options={[
    { text: "Use a native object deserializer but on a faster server" },
    { text: "Use a data-only format (JSON/protobuf) parsed into plain data structures; if a rich format is unavoidable, allowlist types and integrity-protect (MAC) the data so tampering is rejected before parsing" },
    { text: "Base64-encode it to make it safe" },
    { text: "Trust it because it came from your own cookie" }
  ]}
  correct={1}
  explanation="Treat all client-supplied serialized blobs as hostile. Prefer data-only formats that can't run code; where a rich format is required, restrict allowed types and verify a MAC before deserializing. Cookies are attacker-controllable despite originating from your app."
  revisit={{ to: "/docs/appsec/deserialization-xxe#insecure-deserialization", label: "The rule" }}
/>

<Question
  prompt="An attacker sends XML defining `<!ENTITY x SYSTEM &quot;file:///etc/passwd&quot;>` and references `&x;`. The server returns the file's contents. What's this attack and the fix?"
  options={[
    { text: "SQL injection; parameterize" },
    { text: "XXE (XML External Entity); fix by disabling external entities and DTD processing in the XML parser" },
    { text: "XSS; encode output" },
    { text: "Credential stuffing; require MFA" }
  ]}
  correct={1}
  explanation="An XML parser with external entities enabled fetches the referenced file (or URL) and includes it — XXE. It can read local files, trigger SSRF (e.g., to cloud metadata), or cause DoS. The fix is configuration: disable external entities and DTDs."
  revisit={{ to: "/docs/appsec/deserialization-xxe#xxe--xml-external-entity-injection", label: "XXE" }}
/>

<Question
  prompt="What common thread links insecure deserialization, XXE, and injection?"
  options={[
    { text: "They all require physical access" },
    { text: "Untrusted data reaches an over-powerful interpreter (object deserializer, XML parser, SQL engine) that does more than read data; the fix is to use the least-powerful parser and disable dangerous features" },
    { text: "They all need a stolen password" },
    { text: "They are all denial-of-service attacks" }
  ]}
  correct={1}
  explanation="Each is a trust-boundary failure where attacker data drives an interpreter capable of more than reading. The defenses rhyme: pick the least-powerful parser for the job, turn off dangerous features by default, and verify integrity before trusting input."
  revisit={{ to: "/docs/appsec/deserialization-xxe#the-common-thread-dont-let-parsing-do-too-much", label: "The common thread" }}
/>

<Question
  prompt="These bugs are less common than broken access control. Why are they still treated as critical?"
  options={[
    { text: "They aren't; rarity means low priority" },
    { text: "They frequently yield remote code execution or arbitrary file read — top-of-scale IMPACT — so a single instance is often a drop-everything fix; risk weighs impact as well as prevalence" },
    { text: "Because they only affect XML files" },
    { text: "Because they're easy to exploit but harmless" }
  ]}
  correct={1}
  explanation="Severity and prevalence are different axes. Deserialization/XXE are less frequent but RCE-grade — the attacker runs as your app. Since risk = likelihood × impact, their extreme impact makes any single occurrence high-priority."
  revisit={{ to: "/docs/appsec/deserialization-xxe#the-common-thread-dont-let-parsing-do-too-much", label: "Why critical severity" }}
/>

</Quiz>

## What's next

→ Continue to [Secure-by-Default Defensive Patterns](./defensive-patterns) — zooming out from individual bug classes to the cross-cutting habits and framework choices that prevent whole categories at once.

→ **Going deeper:** verifying integrity of code and data across the pipeline is [Software & Data Integrity in the Secure SDLC](/docs/secure-sdlc); the RCE impact and post-exploitation are explored in [Penetration Testing](/docs/offensive).
