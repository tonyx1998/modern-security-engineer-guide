---
id: ai-security-overview
title: 11. Securing AI Systems — Overview
sidebar_position: 1
sidebar_label: AI security intro
description: The new attack surface — prompt injection, the OWASP LLM Top 10, AI red-teaming, and why an LLM is never a security boundary, seen through the security-engineer lens.
---

# Part 11: Securing AI Systems

> **In one line:** LLM-powered systems add attack surface that classic app-sec doesn't fully cover — prompt injection, tool/agency abuse, data exfiltration through model context — and the governing rule is blunt: **an LLM is not a security boundary**; this chapter applies the security-engineer lens to AI.

:::tip[In plain English]
AI features create genuinely new ways to be attacked. The headline one is **prompt injection**: untrusted text (a web page, a document, a user message) smuggles instructions the model then follows, potentially exfiltrating data or misusing tools. The cardinal rule is that you can never *trust the model to enforce security* — it can always be talked out of its instructions, so real controls (auth, allowlists, deterministic code) must sit around it. This chapter is the security specialist's take, mapping the **OWASP LLM Top 10** and AI red-teaming onto the offensive/defensive skills from earlier chapters.
:::

## What this chapter covers

- **Prompt injection & jailbreaks** — direct and indirect, and why they can't be fully "prompted away."
- **The OWASP LLM Top 10** — the standard catalog of LLM-app risks.
- **Excessive agency & tool abuse** — the danger of giving models real-world actions.
- **MCP & the tool layer** — the standard wiring that connects agents to tools, and why it's untrusted too.
- **AI red-teaming** — adversarially testing AI systems (the AI-specific arm of [offensive security](/docs/offensive)).
- **The cardinal rule** — the LLM proposes; deterministic code with real authz gates.

## The lessons in this chapter

1. **[Prompt Injection & Jailbreaks →](/docs/ai-security/prompt-injection)** — the signature AI vulnerability, why it's injection, and why it can't be prompted away.
2. **[The OWASP LLM Top 10 →](/docs/ai-security/llm-top-10)** — the catalog of LLM-app risks; mostly familiar security around a new component.
3. **[Excessive Agency & Tool Abuse →](/docs/ai-security/excessive-agency)** — when a manipulable model can take real-world actions, and how least privilege contains it.
4. **[Securing the Tool Layer: MCP →](/docs/ai-security/mcp-security)** — the standard that wires agents to tools, and its threats (tool poisoning, line-jumping, token pass-through, over-broad scopes).
5. **[AI Red-Teaming →](/docs/ai-security/ai-red-teaming)** — adversarially testing AI, with non-determinism and an infinite input space.
6. **[The Cardinal Rule →](/docs/ai-security/cardinal-rule)** — an LLM is not a security boundary: the model proposes, deterministic code disposes.

Finish with the **[Chapter 11 checkpoint →](/docs/ai-security/ai-security-checkpoint)** to certify the toolkit before Chapter 12.

---

→ Start here: [Prompt Injection & Jailbreaks](/docs/ai-security/prompt-injection).
