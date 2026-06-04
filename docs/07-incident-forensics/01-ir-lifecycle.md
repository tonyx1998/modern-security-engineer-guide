---
id: ir-lifecycle
title: The Incident Response Lifecycle
sidebar_position: 2
sidebar_label: The IR lifecycle
description: The calm, rehearsed process for the worst day — the six phases of incident response (prepare, identify, contain, eradicate, recover, learn) and why preparation and learning matter as much as the firefight.
---

# The Incident Response Lifecycle

> **In one line:** **Incident response (IR)** is a disciplined, rehearsed six-phase process — *prepare, identify, contain, eradicate, recover, learn* — for handling a security breach calmly and correctly, and its two most underrated phases are the first and last: *preparation* (rehearsing before the crisis) and *lessons learned* (so the same thing can't happen twice).

:::tip[In plain English]
A detection fired, or worse — a customer emails "why is my data for sale online?" Now what? Panic and improvisation make breaches *worse*: people tip off the attacker, destroy evidence, take the wrong systems down, and miss data the attacker actually stole. **Incident response** is the opposite of panic: a pre-planned, practiced procedure for the worst day, so that when adrenaline is high, people follow a calm checklist instead of guessing. The structure is a lifecycle of six phases. The middle ones (contain, eradicate, recover) are the firefight everyone pictures. But the *bookends* are what separate organizations that handle a breach well from those that get destroyed by one: **preparation** (you can't invent your IR plan during the fire) and **lessons learned** (a breach you don't learn from, you get to repeat). This lesson is that lifecycle — the calm in the storm.
:::

## The six phases

The industry-standard lifecycle (from NIST and the SANS **PICERL** model) is a loop, not a line — it ends by feeding back into preparation:

```
   ┌────────────────────────────────────────────────────────┐
   │                                                        ▼
1. PREPARE → 2. IDENTIFY → 3. CONTAIN → 4. ERADICATE → 5. RECOVER → 6. LEARN
   (before)    (is this     (stop the    (remove the    (restore     (improve,
               real?)        spread)      attacker)      safely)      feed back)
```

1. **Prepare** — *before* anything happens: an IR plan, a trained team with defined roles, tools, contacts, and the [logging/telemetry](/docs/detection/logging-telemetry) you'll need. Rehearsed via tabletop exercises.
2. **Identify (Detect & Analyze)** — confirm an incident is real (vs. a false positive), determine its scope and severity, and declare it. This is where [detection](/docs/detection) hands off.
3. **Contain** — stop the bleeding: limit the attacker's spread and the damage, *without* tipping them off prematurely or destroying evidence. Often short-term (isolate) then long-term (rebuild trust).
4. **Eradicate** — remove the attacker's presence entirely: malware, backdoors, [persistence](/docs/offensive/post-exploitation), and compromised credentials. *All* of it, or they're still in.
5. **Recover** — restore systems to normal operation safely, validate they're clean, and monitor closely for the attacker's return.
6. **Lessons Learned (Post-Incident)** — a blameless review: what happened, what worked, what didn't, and what changes prevent a repeat. Feeds back into *Prepare*.

:::note[Terms, defined once]
- **Incident** — a confirmed (or strongly suspected) violation of security policy — a real breach or attack, escalated from an [alert](/docs/detection/alerting-and-soc).
- **IR plan** — the documented playbook: who does what, how to communicate, when to escalate, and the decision criteria.
- **Containment** — actions that limit an incident's spread/damage without yet fully removing the attacker.
- **Eradication** — fully removing the attacker's access, tools, and persistence from the environment.
- **Tabletop exercise** — a rehearsal where the team walks through a simulated incident scenario to test the plan before a real one.
- **Blameless post-mortem** — a review focused on systemic causes and fixes, not punishing individuals — so people report honestly.
- **Incident commander** — the person coordinating the response (decisions, communication), distinct from the technical responders.
:::

## Why "prepare" is the phase that decides the outcome

You cannot write your incident-response plan *during* the incident — by then it's chaos. Preparation is what makes the other five phases possible:

- **A plan and defined roles** mean people act instead of arguing about who's in charge. An **incident commander** coordinates; responders investigate; someone owns communications. Confusion is the enemy of a fast response.
- **Tools and access ready in advance** — forensic tools, a way to isolate systems, out-of-band communication (because the attacker may be reading your email/Slack).
- **The right [logs already being collected](/docs/detection/logging-telemetry)** — you can't investigate telemetry you didn't capture. Preparation is when that's decided.
- **Rehearsal via tabletop exercises** — walking through "ransomware just hit, what do we do?" *before* it happens surfaces the gaps (no one knows who can authorize taking production offline; the backups were never tested) while they're cheap to fix.

Organizations that prepare handle breaches as managed events; those that don't experience them as catastrophes. The difference is almost entirely made *before* the incident.

## Containment: the phase with the hardest judgment calls

Containment is where the trickiest decisions live, because the obvious move is often wrong:

:::note[Worked example: why "pull the plug" can be the wrong first move]
You discover an attacker active on a server. Instinct says: *shut it down now!* But consider the tradeoffs:

- **Pulling power destroys volatile evidence.** [Memory](/docs/incident-forensics/forensic-artifacts) — running processes, network connections, encryption keys, what the attacker was doing *right now* — vanishes on shutdown. You may lose the very evidence that reveals scope.
- **Acting visibly tips off the attacker.** If they notice they're caught, they may [destroy evidence, deploy ransomware immediately, or burrow deeper](/docs/offensive/post-exploitation) via persistence you haven't found yet.
- **But waiting lets damage continue.** Every minute they're active is more data stolen or systems compromised.

There's no universal answer — it's a *risk judgment* balancing evidence preservation, stopping damage, and stealth, ideally decided by criteria set during **preparation**. A common approach: *isolate* (cut network access so they can't act or spread, while keeping the system running to preserve memory) rather than power-off, and capture volatile evidence *before* changing state. The point: containment is deliberate strategy, not a reflex — which is exactly why you plan it in advance.
:::

This is also why IR and [forensics](/docs/incident-forensics/forensic-artifacts) are intertwined: how you contain affects what evidence survives.

## Eradicate fully, or you haven't eradicated

The classic failure: declaring victory too early. If an attacker has *multiple* footholds and [persistence mechanisms](/docs/offensive/post-exploitation) and you remove only the one you found, **they're still in** — and now they know you're onto them. Eradication requires understanding the *full* scope first (which is why [identify](#the-six-phases) and forensics come first): every compromised account, every backdoor, every persistence mechanism. Partial eradication is one of the most common reasons attackers return days later, often more aggressively. *Scope before you eradicate.*

## Lessons learned: the phase everyone skips (and shouldn't)

When the fire's out, the temptation is to move on and never speak of it again. That guarantees a repeat. The final phase is a **blameless post-mortem**:

- **Reconstruct what happened** and how the attacker got in, moved, and was caught (using the [timeline](/docs/incident-forensics/timeline-reconstruction)).
- **Identify the root cause and the gaps** — the missing patch, the over-broad permission, the detection that didn't fire, the [alert lost in noise](/docs/detection/alerting-and-soc).
- **Turn findings into concrete changes** — new detections, hardening, process fixes — that *feed back into Prepare*, closing the loop.
- **Blameless** — focused on systems, not scapegoats, so people share what really happened. Punishing individuals just teaches everyone to hide incidents next time.

This is the same [shift-left](/docs/secure-sdlc/shift-left) and continuous-improvement mindset from the secure SDLC, applied to incidents: each one should leave you measurably harder to breach the same way.

## Why it matters

- **Process beats panic.** A rehearsed lifecycle turns the worst day into a managed event. The organizations destroyed by breaches are usually the ones improvising.
- **The bookends are the leverage.** Preparation determines whether the firefight is winnable; lessons learned determine whether you fight the same fire again. Both are easy to neglect and decisive.
- **It connects the whole defensive arc.** [Detection](/docs/detection) hands off to *identify*; [forensics](/docs/incident-forensics/forensic-artifacts) powers the investigation; [breach determination](/docs/incident-forensics/breach-determination) follows recovery; lessons feed [secure design](/docs/secure-sdlc). IR is where it all converges.

## Common pitfalls

:::caution[Where people commonly trip up]
- **No plan until the incident.** You can't author IR during chaos. Build and rehearse the plan, roles, and tools in advance — preparation is the decisive phase.
- **Reflexively powering off a compromised system.** It destroys volatile [memory evidence](/docs/incident-forensics/forensic-artifacts) and can tip off the attacker. Decide containment deliberately (often isolate, capture volatile data first).
- **Eradicating before understanding scope.** Removing one foothold while missing others leaves the attacker in — and alerted. Determine full scope first, then eradicate everything at once.
- **Skipping lessons learned.** A breach you don't analyze, you repeat. Run a blameless post-mortem and feed fixes back into preparation.
- **Blame-driven reviews.** Punishing individuals makes people hide incidents and lie in post-mortems. Stay blameless to get the truth.
- **Communicating in-band.** Coordinating over email/Slack the attacker may be reading lets them watch your response. Use out-of-band channels during an incident.
:::

## Page checkpoint

<Quiz id="ir-lifecycle-page" title="Did the IR lifecycle click?" sampleSize={3}>

<Question
  prompt="What are the six phases of the incident response lifecycle?"
  options={[
    { text: "Plan, code, build, test, deploy, monitor" },
    { text: "Prepare, Identify, Contain, Eradicate, Recover, Learn (lessons learned) — a loop that feeds back into preparation" },
    { text: "Detect, ignore, hope, restart, forget, repeat" },
    { text: "Scope, recon, exploit, report, retest, bill" }
  ]}
  correct={1}
  explanation="The standard lifecycle (NIST / SANS PICERL) is Prepare → Identify → Contain → Eradicate → Recover → Lessons Learned, and it loops — the final phase feeds improvements back into preparation."
  revisit={{ to: "/docs/incident-forensics/ir-lifecycle#the-six-phases", label: "The six phases" }}
/>

<Question
  prompt="Why is 'prepare' considered the phase that most determines the outcome of an incident?"
  options={[
    { text: "Because it's the most fun phase" },
    { text: "You can't write an IR plan, assign roles, ready tools, or collect the needed logs DURING the chaos — preparation (plan, roles, tools, telemetry, rehearsals) is what makes the other five phases possible" },
    { text: "Because it's legally required and nothing more" },
    { text: "It doesn't matter; only containment matters" }
  ]}
  correct={1}
  explanation="The plan, defined roles (incident commander, responders, comms), ready tools, pre-collected telemetry, and tabletop rehearsals all must exist before the incident. Organizations that prepare manage breaches; those that improvise are overwhelmed."
  revisit={{ to: "/docs/incident-forensics/ir-lifecycle#why-prepare-is-the-phase-that-decides-the-outcome", label: "Why prepare decides the outcome" }}
/>

<Question
  prompt="You find an attacker active on a server. Why might immediately powering it off be the WRONG first move?"
  options={[
    { text: "It saves too much evidence" },
    { text: "Powering off destroys volatile memory evidence (running processes, connections, keys) and can tip off the attacker to escalate; isolating the system (cutting network) while preserving memory and capturing volatile data first is often better" },
    { text: "Servers can't be powered off" },
    { text: "It always fully removes the attacker" }
  ]}
  correct={1}
  explanation="Shutdown wipes volatile memory — often the evidence that reveals scope — and a visible reaction can prompt the attacker to deploy ransomware or burrow deeper. Containment is a deliberate risk judgment (often: isolate, capture volatile evidence, then act), planned in advance."
  revisit={{ to: "/docs/incident-forensics/ir-lifecycle#containment-the-phase-with-the-hardest-judgment-calls", label: "Containment judgment" }}
/>

<Question
  prompt="Why must you understand the FULL scope of a compromise before eradicating?"
  options={[
    { text: "To make the report longer" },
    { text: "If the attacker has multiple footholds and persistence mechanisms and you remove only the one you found, they're still in — and now alerted; partial eradication is a top reason attackers return, so determine full scope first" },
    { text: "Scope doesn't matter for eradication" },
    { text: "Because eradication must happen before identification" }
  ]}
  correct={1}
  explanation="Eradication must remove every foothold, backdoor, and compromised credential at once. Pulling one thread while missing others leaves the attacker present and aware they're being hunted, so they often return more aggressively. Scope before you eradicate."
  revisit={{ to: "/docs/incident-forensics/ir-lifecycle#eradicate-fully-or-you-havent-eradicated", label: "Eradicate fully" }}
/>

<Question
  prompt="Why should the post-incident review be 'blameless'?"
  options={[
    { text: "To avoid doing any real analysis" },
    { text: "Focusing on systemic causes and fixes (not punishing individuals) gets people to report honestly what happened; blame teaches everyone to hide incidents and lie in future reviews" },
    { text: "Because no one is ever at fault" },
    { text: "To skip the review entirely" }
  ]}
  correct={1}
  explanation="A blameless post-mortem targets root causes and process fixes, so responders share the full truth. Punishing individuals drives incidents underground and corrupts future reviews. The findings feed back into preparation, closing the improvement loop."
  revisit={{ to: "/docs/incident-forensics/ir-lifecycle#lessons-learned-the-phase-everyone-skips-and-shouldnt", label: "Lessons learned" }}
/>

</Quiz>

## What's next

→ Continue to [Chain of Custody & Evidence Preservation](./chain-of-custody) — the discipline that keeps the evidence you gather during IR trustworthy and legally admissible.

→ **Going deeper:** the detection that triggers *identify* is [Chapter 6](/docs/detection); the forensic investigation that powers *identify* and *eradicate* is the [next lessons](./forensic-artifacts); the lessons-learned loop ties back to [Secure SDLC](/docs/secure-sdlc).
