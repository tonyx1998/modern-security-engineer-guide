---
id: ai-security-checkpoint
title: Chapter 11 Checkpoint
sidebar_position: 7
sidebar_label: ✅ Chapter checkpoint
description: Prove the AI security toolkit stuck — a mixed quiz across prompt injection, the OWASP LLM Top 10, excessive agency, AI red-teaming, and the cardinal rule that an LLM is not a security boundary.
---

# Chapter 11 Checkpoint

> **The AI security toolkit, all together.** This mixed quiz pulls from every lesson. Passing means you can reason about the new attack surface — recognizing that most AI risk is familiar security around a manipulable component, and that the model must never be trusted to enforce security.

:::tip[How this works]
The quiz samples from a larger bank each attempt. The chapter's through-line: **an LLM is not a security boundary.** Prompt injection can't be prevented, agency multiplies its danger, red-teaming can't prove safety — so you architect deterministic controls around a model you assume can be compromised. If a question stings, follow its revisit link.
:::

## What you should be able to do now

- **Explain [prompt injection](./prompt-injection)** — why it's injection, direct vs. indirect, and why it can't be prompted away.
- **Navigate the [OWASP LLM Top 10](./llm-top-10)** — most risks are classic security around a new component; a few are genuinely novel.
- **Contain [excessive agency](./excessive-agency)** — least privilege for tools, the lethal trifecta, and human-in-the-loop for high-impact actions.
- **Secure the [tool layer (MCP)](./mcp-security)** — treat tool servers and their descriptions as untrusted (tool poisoning, line-jumping, token pass-through, over-broad scopes).
- **Red-team [AI systems](./ai-red-teaming)** — handling non-determinism and the infinite input space, testing the whole system.
- **Apply the [cardinal rule](./cardinal-rule)** — the model proposes, deterministic code with real authorization disposes.

## The checkpoint

<Quiz id="ai-security-checkpoint" title="Chapter 11: Securing AI Systems" sampleSize={6} passingScore={0.67}>

<Question
  prompt="Why is prompt injection fundamentally the same flaw as classic injection?"
  options={[
    { text: "Both involve SQL" },
    { text: "Both arise because trusted instructions and untrusted data share one channel the interpreter can't separate — an LLM mixes its system prompt and input data as one text blob and follows natural-language instructions, so attacker text containing instructions may be obeyed" },
    { text: "Both need a password" },
    { text: "Neither is exploitable" }
  ]}
  correct={1}
  explanation="Injection's root cause is data and instructions sharing an inseparable channel. An LLM processes instructions and data as one text context and is built to follow natural-language instructions, so injected text can be executed as commands."
  revisit={{ to: "/docs/ai-security/prompt-injection#why-prompt-injection-is-injection", label: "Why it's injection" }}
/>

<Question
  prompt="Why is prompt injection HARDER to fix than SQL injection?"
  options={[
    { text: "LLMs are slower" },
    { text: "SQLi has parameterization — a structural way to separate code from data; an LLM has no reliable way to mark text as 'data, never instructions' because its understanding is fluid natural language, so there's no parameterization escape hatch" },
    { text: "It's actually easier" },
    { text: "LLMs don't process text" }
  ]}
  correct={1}
  explanation="SQLi is solved structurally by parameterizing. LLMs lack any equivalent boundary marking text as pure data, since they interpret natural language fluidly. That missing escape hatch makes injection harder — it can't be fully eliminated."
  revisit={{ to: "/docs/ai-security/prompt-injection#why-prompt-injection-is-injection", label: "No parameterization" }}
/>

<Question
  prompt="An AI that browses the web fetches a page with hidden text telling it to exfiltrate the user's data. What is this?"
  options={[
    { text: "Direct injection" },
    { text: "Indirect injection — malicious instructions planted in content the model processes, so the attacker isn't the user and never touched your system; any LLM reading untrusted external content is exposed" },
    { text: "SQL injection" },
    { text: "Not injection" }
  ]}
  correct={1}
  explanation="The payload lives in external content the model ingests, not the user's message — indirect injection. The user did nothing wrong; the attacker only planted text the AI read. Any model processing untrusted external content is exposed, especially if it can act."
  revisit={{ to: "/docs/ai-security/prompt-injection#direct-vs-indirect-injection", label: "Indirect injection" }}
/>

<Question
  prompt="Why can't you reliably fix prompt injection with a better system prompt?"
  options={[
    { text: "System prompts are too short" },
    { text: "You're using text instructions to defend against text instructions, judged by a persuadable model, while the attacker also writes text — an unwinnable arms race with no parameterization fallback; better prompts raise the bar but are not a boundary" },
    { text: "It does fully fix it" },
    { text: "Models ignore system prompts" }
  ]}
  correct={1}
  explanation="Defending text-instructions with text-instructions, refereed by a persuadable model, is an arms race the attacker can always escalate. Prompts help but aren't a security boundary — the robust fix is architectural controls around the model."
  revisit={{ to: "/docs/ai-security/prompt-injection#why-you-cant-prompt-away-injection", label: "Can't prompt it away" }}
/>

<Question
  prompt="What's the reassuring insight about the OWASP LLM Top 10?"
  options={[
    { text: "AI security is wholly alien" },
    { text: "Most risks are familiar security (injection, insecure output handling/XSS, data leakage, supply chain, access control) around a new component, plus a few genuinely AI-specific ones — so existing security knowledge largely transfers" },
    { text: "There are no AI risks" },
    { text: "It only covers image models" }
  ]}
  correct={1}
  explanation="Much of AI security is classic security with an LLM in the mix. Treat the LLM as an untrusted node: inputs are injection surfaces, outputs need sanitization, access needs authorization. Learn the genuinely novel risks (prompt injection, excessive agency, training-data leakage) deeply."
  revisit={{ to: "/docs/ai-security/llm-top-10#the-catalog-grouped-by-whats-familiar-vs-new", label: "Familiar vs new" }}
/>

<Question
  prompt="A model's output containing `<script>` is rendered into a page. What is it and the fix?"
  options={[
    { text: "A new AI-only bug with no fix" },
    { text: "Insecure output handling — it's XSS from your own model; treat model output as untrusted input and encode/parameterize/validate it for its context, exactly like Chapter 3" },
    { text: "Prompt injection; rewrite the prompt" },
    { text: "Nothing; model output is safe" }
  ]}
  correct={1}
  explanation="Model output into a page is XSS — an old bug from a new source. A prompt-injected model can emit anything, so treat its output as untrusted crossing a trust boundary: encode, parameterize, validate. Trusting output 'because it's ours' is the mistake."
  revisit={{ to: "/docs/ai-security/llm-top-10#the-biggest-you-already-know-this-risk-insecure-output-handling", label: "Insecure output handling" }}
/>

<Question
  prompt="Why does giving an LLM tools (agency) multiply the danger of prompt injection?"
  options={[
    { text: "Tools slow the model" },
    { text: "The model can be injected (unfixable) AND can take actions via tools, so injected instructions become real-world actions — bounded only by what the model is permitted to do (the blast radius is the agency you granted)" },
    { text: "Tools encrypt output" },
    { text: "It doesn't" }
  ]}
  correct={1}
  explanation="Injection can't be prevented and tools let the model act, so injected instructions become actions with the model's permissions. The attacker just needs text in front of the model; harm is bounded by the agency granted — a confused deputy."
  revisit={{ to: "/docs/ai-security/excessive-agency#why-agency-multiplies-the-danger", label: "Why agency multiplies danger" }}
/>

<Question
  prompt="What are the three levers for constraining an AI agent's agency?"
  options={[
    { text: "Speed, cost, accuracy" },
    { text: "Capability (only the tools the task needs), permission (each tool minimally scoped/allowlisted), and autonomy (human-in-the-loop approval for high-impact actions)" },
    { text: "Temperature, top-p, max tokens" },
    { text: "Model size, data, context length" }
  ]}
  correct={1}
  explanation="Constrain capability (an action it can't take can't be abused), permission (minimal allowlisted tool scope), and autonomy (human approval for high-impact/irreversible actions) — least privilege applied to agency."
  revisit={{ to: "/docs/ai-security/excessive-agency#least-privilege-for-ai-agents", label: "The three levers" }}
/>

<Question
  prompt="A third-party MCP server hides an instruction inside a tool's description telling the model to read and exfiltrate secrets. What is this, and why doesn't 'approve each tool call' fully protect you?"
  options={[
    { text: "A network bug; patch the server" },
    { text: "Tool poisoning — injection via tool metadata the model reads; and a server's descriptions enter the model's context the moment it connects (line-jumping), so a malicious description can act BEFORE any tool call exists to approve — treat the tool layer as untrusted and gate actions in deterministic code" },
    { text: "Harmless; tool descriptions are trusted" },
    { text: "Prompt injection that a bigger model prevents" }
  ]}
  correct={1}
  explanation="Hidden instructions in a tool description are tool poisoning (indirect injection via metadata). Because listing a server's tools loads its description text at connect time, line-jumping lets it influence the model before the first approvable call. The fix is the chapter's: the tool layer is untrusted; constrain scope and gate real actions deterministically."
  revisit={{ to: "/docs/ai-security/mcp-security#the-threat-model-the-tool-layer-is-untrusted", label: "MCP threats" }}
/>

<Question
  prompt="A jailbreak succeeds ~30% of the time. How should AI red-teaming treat it?"
  options={[
    { text: "As 'mostly safe'" },
    { text: "As a severe vulnerability — attackers retry; AI attacks work probabilistically, so test repeatedly, report success RATES, and treat 'usually refuses' (even 95%) as failing since a 1-in-20 bypass is exploitable at scale" },
    { text: "As not a bug" },
    { text: "As a performance metric" }
  ]}
  correct={1}
  explanation="Non-determinism breaks the works/doesn't binary. A 30% (or 5%) bypass is reliably exploitable by retrying. Estimate success rates over many runs and treat any meaningful bypass as severe — not 'mostly safe.'"
  revisit={{ to: "/docs/ai-security/ai-red-teaming#whats-genuinely-different-two-hard-properties", label: "Non-determinism" }}
/>

<Question
  prompt="Why can AI red-teaming never prove a model 'safe' against injection?"
  options={[
    { text: "Red-teamers lack skill" },
    { text: "Natural language is an infinite input space — unlike SQLi's finite grammar, attacks can be phrased limitlessly, so 'no break found' only means YOU didn't find one; a novel phrasing may still break it" },
    { text: "Models have no vulnerabilities" },
    { text: "Testing is illegal" }
  ]}
  correct={1}
  explanation="You can't exhaustively test an infinite space, so absence of a found jailbreak proves only that this testing missed it. Combined with injection being unpreventable, red-teaming reduces and finds risk but can't certify a model injection-proof."
  revisit={{ to: "/docs/ai-security/ai-red-teaming#whats-genuinely-different-two-hard-properties", label: "Coverage problem" }}
/>

<Question
  prompt="Why is an LLM 'not a security boundary'?"
  options={[
    { text: "It's too slow" },
    { text: "A boundary can't be crossed by persuasion, but an LLM is built to be influenced by text and injection is unpreventable — so any model-enforced rule can be overridden, and its allow/deny is a steerable output, not a security decision" },
    { text: "It has no instructions" },
    { text: "It refuses everything" }
  ]}
  correct={1}
  explanation="Unlike a parameterized query or authz check, an LLM is designed to be persuaded by text and can't fully resist injection. Model-enforced rules are overridable wishes, so you must assume the model can be compromised and enforce security elsewhere."
  revisit={{ to: "/docs/ai-security/cardinal-rule#why-the-model-can-never-be-the-boundary", label: "Why not a boundary" }}
/>

<Question
  prompt="What's the safe architecture for AI features?"
  options={[
    { text: "Let the model enforce all rules via its system prompt" },
    { text: "The model proposes (decides what's useful), but deterministic code with real authorization, allowlists, validation, and human approval — independent of the model and immune to prompt injection — disposes (decides whether to execute); treat the LLM like an untrusted browser" },
    { text: "Give the model full permissions and trust it" },
    { text: "Avoid deterministic code entirely" }
  ]}
  correct={1}
  explanation="Security lives in deterministic code around the model, not inside it. The model handles intelligence; an un-injectable control layer enforces authorization. Treat the LLM as just another untrusted client: validate and authorize its requests server-side, and handle its output as untrusted."
  revisit={{ to: "/docs/ai-security/cardinal-rule#the-architecture-model-proposes-code-disposes", label: "Model proposes, code disposes" }}
/>

</Quiz>

## Chapter 11 complete

You can now reason about AI security with the right frame: [prompt injection](./prompt-injection) is unpreventable injection, most of the [LLM Top 10](./llm-top-10) is familiar security around a manipulable component, [excessive agency](./excessive-agency) is what makes it catastrophic, the [tool layer (MCP)](./mcp-security) is untrusted too, [red-teaming](./ai-red-teaming) finds breaks but can't certify safety, and the [cardinal rule](./cardinal-rule) ties it together — **an LLM is intelligence, not authorization; build security in deterministic code around it.** Your ten chapters of security knowledge transfer directly; the model is just a new, untrusted node.

→ On to [Chapter 12: Security Career](/docs/career) — turning everything you've learned into a profession: the roles, certifications, portfolio, and multi-year path of a security engineer.
