---
id: tabletop-bcdr
title: Tabletop Exercises & Business Continuity (BC/DR)
sidebar_position: 3
sidebar_label: Tabletops & BC/DR
description: The human and recovery side of incident response — runbooks and playbooks as a practiced discipline, how to run a tabletop exercise, and business continuity / disaster recovery (BIA, RTO/RPO, 3-2-1 immutable backups, and DR patterns) and how it plugs into the IR lifecycle's recovery phase.
---

# Tabletop Exercises & Business Continuity (BC/DR)

> **In one line:** The [IR lifecycle](/docs/incident-forensics/ir-lifecycle) only works if its *preparation* and *recovery* phases are real — so this lesson covers the two disciplines that make them real: **practiced playbooks rehearsed through tabletop exercises** (so the team acts from a checklist, not adrenaline) and **business continuity / disaster recovery (BC/DR)** — the plan, backups, and recovery targets (**RTO** and **RPO**) that let you actually *restore* the business after ransomware, an outage, or a disaster.

:::tip[In plain English]
The [previous lesson](/docs/incident-forensics/ir-lifecycle) said the bookend phases — **prepare** and **recover** — decide whether a breach is a managed event or a catastrophe. But "prepare" and "recover" are easy words to nod at and hard to actually *have*. What does prepared really look like? It looks like two things. First, a **playbook** you've actually *rehearsed*: a step-by-step script for "ransomware just hit" that the team has walked through before, in a calm room, so on the real day nobody is inventing the response from scratch. The rehearsal is called a **tabletop exercise** — like a fire drill for a cyber incident. Second, the ability to actually *come back*: tested **backups**, a **disaster-recovery plan**, and clear answers to "how fast must we be running again?" (**RTO**) and "how much recent data can we afford to lose?" (**RPO**). Improvising recovery is how a one-day outage becomes a three-week existential crisis. This lesson is the *preparedness and recovery* complement to the IR lifecycle: the human drills that make "prepare" real, and the BC/DR machinery that makes "recover" real.
:::

:::note[Terms, defined once]
- **Runbook** — a precise, step-by-step procedure for one *routine* operational task (e.g. "fail the database over to the replica"). Detailed enough to follow under stress without thinking.
- **Playbook** — a higher-level, scenario-based response guide for a *type of incident* (e.g. "suspected ransomware"): the decisions, roles, communications, and the runbooks to invoke. A playbook orchestrates runbooks.
- **Tabletop exercise** — a discussion-based rehearsal where the team talks through a simulated incident scenario step by step to test the plan *before* a real one — no systems are actually touched.
- **Inject** — a new piece of information or a twist the facilitator introduces mid-tabletop ("the backups are also encrypted") to push the team past the easy part.
- **BC/DR** — **Business Continuity / Disaster Recovery**: the plan and capabilities to keep the business running (BC) and to restore IT systems and data (DR) after a disruptive event.
- **BIA (Business Impact Analysis)** — the up-front study that ranks which business processes and systems matter most and how fast each must be restored. BC/DR's foundation.
- **RTO (Recovery Time Objective)** — the maximum *time* a system can be down before unacceptable harm: the target for *how fast* you must be running again.
- **RPO (Recovery Point Objective)** — the maximum amount of *recent data* you can afford to lose, measured in time: the target for *how far back* your last good copy may be.
- **3-2-1 backup** — a backup rule of thumb: keep **3** copies of data, on **2** different media/storage types, with **1** copy off-site (and, today, ideally offline or immutable).
- **Immutable / offline backup** — a backup copy that *cannot be altered or deleted* for a set period (immutable) or is physically disconnected (offline) — so ransomware that compromises your live environment can't destroy it.
:::

## Runbooks and playbooks: a practiced script beats improvising

When a real incident hits, three things are scarce: time, calm, and clear thinking. The whole point of writing things down *in advance* is to spend none of those on questions you could have answered in a quiet room weeks earlier.

- A **runbook** answers one routine question precisely: "*How* do we fail the primary database over to the standby?" Step 1, step 2, step 3 — copy-pasteable commands, the exact dashboard to watch, what "healthy" looks like. It assumes a stressed human and removes guesswork.
- A **playbook** answers a bigger question: "We think this is ransomware — *what now?*" It names the [incident commander](/docs/incident-forensics/ir-lifecycle), the first three [containment](/docs/incident-forensics/ir-lifecycle) actions, who to call (legal, comms, the cyber-insurer), which runbooks to run, and the criteria for declaring it over. A playbook is a *decision and coordination* guide; it points to runbooks for the mechanical steps.

Why bother, instead of trusting smart people to figure it out live? Because **stress narrows judgment**. Under adrenaline, people tunnel, forget steps, skip notifying legal until it's too late, and take destructive shortcuts (the reflexive power-off from the [last lesson](/docs/incident-forensics/ir-lifecycle#containment-the-phase-with-the-hardest-judgment-calls)). A rehearsed playbook converts a chaotic judgment call into *following a checklist you already vetted when you were calm*. Aviation, medicine, and firefighting all run on checklists for exactly this reason: the worst moment is the worst time to be inventing procedure.

But a playbook nobody has *practiced* is only marginally better than no playbook — people don't trust it, can't find it, or discover mid-crisis that step 4 assumes a tool that was decommissioned last year. Which is what the tabletop exercise is for.

## The tabletop exercise: a fire drill for a cyber incident

A **tabletop exercise** is a discussion-based rehearsal. The team sits in a room (or a call), a facilitator presents a realistic scenario, and the team talks through *exactly* what they'd do, step by step — invoking the actual playbook, naming the actual people, opening the actual runbooks. **Nothing real is touched** (that's the "tabletop" — it's on paper, not in production), which makes it cheap and safe to fail.

### Who's in the room

A good tabletop is deliberately *cross-functional*, because real incidents are:

- A **facilitator** who runs the scenario and introduces injects (often a security lead or an outside consultant).
- The **technical responders** — SOC/IR, infrastructure, the on-call engineers who'd actually do the containment and recovery.
- An **incident commander** — the person who'd coordinate the real response.
- **Decision-makers** — someone who can authorize "take production offline" or "pay the ransom" (these decisions can't wait for a VP to wake up).
- **Legal, communications/PR, and sometimes HR** — because [breach notification](/docs/incident-forensics/breach-determination), customer messaging, and regulatory clocks are part of the response, not an afterthought.
- A **scribe** — someone capturing every "we don't actually know who does that" moment, because *those gaps are the entire point*.

### Injects: pushing past the easy part

The first 80% of any scenario is the part people handle fine. The value is in the **injects** — twists the facilitator drops in to stress the plan:

- "It's 2 a.m. on a holiday weekend — who's actually reachable?"
- "Your email and Slack are compromised, so you can't coordinate in-band."
- "The backups you were about to restore from are *also* encrypted."
- "A journalist just tweeted about the breach — comms, you have 20 minutes."

Injects surface the assumptions a clean run-through hides.

### What "good" looks like

A successful tabletop is **not** one where the team aces it — that usually means the scenario was too easy. A good tabletop *finds problems*: the runbook that's out of date, the decision nobody is empowered to make, the out-of-band contact list nobody maintains, the backup nobody has ever test-restored. **Finding ten gaps in a conference room is a triumph; finding them during a real ransomware attack is a disaster.**

### Turning findings into fixes (the preparedness loop)

A tabletop that produces a warm feeling and no action items was theater. The real output is a tracked list of fixes, each owned and dated:

```
The preparedness loop
─────────────────────
  Write/refine the playbook ──▶ Rehearse it (tabletop)
            ▲                          │
            │                          ▼
   Feed fixes back  ◀── Capture gaps → assign owners → fix
```

This is the same continuous-improvement loop as the IR lifecycle's [lessons-learned](/docs/incident-forensics/ir-lifecycle#lessons-learned-the-phase-everyone-skips-and-shouldnt) phase — except you run it *before* a real incident forces you to. Every tabletop should leave the plan measurably better than it found it.

:::note[Worked example: a 60-minute ransomware tabletop, traced]
A facilitator runs a mid-size company through a ransomware scenario. Watch how each step exposes a gap.

**Minute 0 — the prompt.** *"It's Saturday 3 a.m. An on-call engineer sees alerts that files across three file servers are being renamed with a `.locked` extension. What do you do first?"*
→ The team reaches for the **ransomware playbook**. **Gap #1:** two responders can't find it — it lives on the very file share now being encrypted. *Fix: store playbooks in a separate, out-of-band location.*

**Minute 10 — containment.** The team decides to isolate the affected servers from the network (network containment) rather than power them off, preserving [memory evidence](/docs/incident-forensics/forensic-artifacts). Good — that's the [last lesson's](/docs/incident-forensics/ir-lifecycle#containment-the-phase-with-the-hardest-judgment-calls) judgment applied. **Gap #2:** nobody is sure who has the authority to disconnect production at 3 a.m. *Fix: pre-authorize the on-call IC to isolate systems.*

**Minute 20 — inject: "Coordinating over email and Slack — but assume the attacker is in your email."**
→ The team realizes they have no **out-of-band comms** plan. **Gap #3.** *Fix: stand up a pre-agreed Signal group + phone tree.*

**Minute 30 — recovery.** *"You've contained it. Restore the file servers from backup."* The team points to nightly backups. The facilitator's **inject:** *"Those backups are on a share the ransomware also reached, and they're encrypted too."*
→ **Gap #4 — the big one.** Backups were reachable with the same credentials the attacker compromised. *Fix: immutable + offline backup copy (covered below).*

**Minute 45 — RTO/RPO reality.** *"Leadership asks: when are we back, and how much data did we lose?"* Nobody has a number. **Gap #5:** no defined **RTO/RPO** for these systems, so no one can answer or prioritize. *Fix: run a BIA, set targets (next section).*

**Minute 55 — wrap.** The scribe reads back **five concrete, owned, dated fixes.** The team didn't "win" — and that's exactly why the exercise was worth it. Each gap found here is one that *won't* surprise them at 3 a.m. for real.
:::

## Business continuity & disaster recovery (BC/DR): making "recover" real

Containing and eradicating an attacker is only half the worst day. The other half is **getting the business running again** — and that's a discipline of its own. **Business Continuity (BC)** is keeping the business operating through a disruption; **Disaster Recovery (DR)** is the IT-focused subset: restoring systems and data. They cover ransomware, but also fires, floods, cloud-region outages, and fat-fingered deletions.

### Start with a Business Impact Analysis (BIA)

You can't protect everything equally — you don't have the budget, and not everything matters equally. A **Business Impact Analysis (BIA)** is the up-front study that asks, for each business process and the systems behind it: *if this is down, how bad is it, and how fast?* It produces a ranked list — the payroll system and the customer-facing checkout are "restore in minutes"; the internal wiki is "restore next week, nobody will die." The BIA is what lets you spend your recovery budget where it actually matters, and it's where the two key numbers come from.

### RTO and RPO, defined plainly

These two acronyms are the heart of recovery planning. They're easy to mix up, so anchor them on a timeline of an outage:

```
   last good backup            OUTAGE / DISASTER            back online
        │                            │                          │
        ▼                            ▼                          ▼
  ──────●────────────────────────────✕──────────────────────────●────────▶ time
        │◀────────── RPO ───────────▶│◀────────── RTO ─────────▶│
        (data you lose: work since   (downtime you tolerate:
         the last backup)             disaster → restored)
```

- **RPO (Recovery Point Objective)** looks *backward* from the disaster: *how much recent data can we afford to lose?* It's set by **how often you back up**. Hourly backups ⇒ RPO of up to 1 hour (you could lose up to an hour of work). RPO answers "*how much data?*"
- **RTO (Recovery Time Objective)** looks *forward* from the disaster: *how long can we be down?* It's set by **how fast you can restore**. RTO answers "*how long down?*"

Tighter targets cost more. An RPO near zero needs continuous replication; an RTO of minutes needs systems already running and waiting. So the BIA's job is to set targets that match each system's *actual* business importance — not gold-plate everything.

:::note[Worked example: computing the impact of a 6-hour outage]
An e-commerce site does **\$120,000/hour** in revenue at peak. Its checkout database is backed up **every 4 hours**. One afternoon the primary storage fails hard at **2:00 p.m.** The last successful backup ran at **12:00 p.m.** Restoring from that backup to a new server takes **6 hours**.

Trace the two numbers from the actual timeline:

- **RPO (data lost).** The last good copy is from 12:00 p.m.; the failure hit at 2:00 p.m. Everything between is gone: **2 hours of orders** — customers who checked out between noon and 2 p.m. may have no record of their order. With 4-hour backups, the *worst-case* RPO is 4 hours; this time it landed at 2.
- **RTO (downtime).** Failure at 2:00 p.m., restore completes at 8:00 p.m. ⇒ **6 hours of downtime.** At \$120k/hour that's roughly **\$720,000 in lost revenue**, before counting reputation and support load.

Now the BC/DR decision becomes concrete. Is a 4-hour RPO acceptable when it means *silently losing real customer orders*? Is a 6-hour RTO acceptable at \$120k/hour? Almost certainly not for checkout. So you'd invest to *tighten* both: more frequent (or continuous) backups to shrink the RPO toward minutes, and a **warm standby** ready to take over to shrink the RTO from 6 hours to minutes. The BIA + these numbers are exactly what justify that spend to leadership — *not* a vague "we should be more resilient."
:::

### Backup strategy: 3-2-1, and why immutability now matters

A DR plan is only as good as its backups, and ransomware has rewritten the rules. The durable baseline is the **3-2-1 rule**: **3** copies of your data, on **2** different types of media/storage, with **1** copy off-site. It defends against the classic failure modes — a disk dies (you have copies), a storage system corrupts data (different media), the building burns (off-site).

But 3-2-1 was designed for *accidents*, not *adversaries*. Modern ransomware crews deliberately **hunt for and encrypt or delete your backups first**, because backups are the one thing that defeats their leverage. If your backups sit on a network share reachable with the same [credentials](/docs/appsec/broken-authentication) the attacker just stole, they're not a safety net — they're another target. (This is precisely **Gap #4** from the tabletop above.)

So today the rule grows a clause — often written **3-2-1-1-0**: add **1 immutable or offline copy** and verify **0 errors** by testing restores. The critical additions:

- **Immutable backups** — written once and *un-deletable, un-encryptable* for a retention window (e.g. cloud object-lock / WORM storage). Even an attacker with admin can't destroy them.
- **Offline / air-gapped backups** — physically or logically disconnected (offline media, a separate account with separate credentials), so a compromise of the production environment can't reach them.

The principle: **a backup the attacker can reach with the credentials they already have is not a backup.**

### DR patterns: how fast you recover is what you're buying

How you architect recovery is a direct trade of **money vs. RTO/RPO**. The main patterns, cheapest/slowest to costliest/fastest:

| Pattern | How it works | RTO | RPO | Cost |
|---|---|---|---|---|
| **Backup & restore** | Restore data to rebuilt infrastructure after the event | Hours–days | Up to your backup interval | $ |
| **Pilot light** | Core data replicated; minimal services idling, scale up on disaster | Tens of min–hours | Low | $$ |
| **Warm standby** | A scaled-down copy of the system always running, ready to scale up | Minutes | Low | $$$ |
| **Hot standby / multi-site active-active** | A full duplicate running live (or traffic served from both) | Near-zero | Near-zero | $$$$ |

The tradeoff is the whole point: **backup-restore** is cheap but you're down for hours and lose data back to the last backup; a **hot standby** flips over in seconds with almost no loss but you're paying to run the system twice. You don't pick one for everything — you use the **BIA** to assign cheap backup-restore to the wiki and an expensive warm/hot standby to checkout. You're literally buying down RTO and RPO with dollars; spend where the BIA says the business hurts most.

## How BC/DR plugs into the IR lifecycle

BC/DR isn't a separate world from incident response — it's the muscle behind the lifecycle's bookends:

- It **is the [recover phase](/docs/incident-forensics/ir-lifecycle#the-six-phases).** When the [IR lifecycle](/docs/incident-forensics/ir-lifecycle) reaches "restore systems to normal operation safely," your DR plan, your tested backups, and your RTO/RPO targets are *what you actually execute*. No DR plan ⇒ the recover phase is improvised — the exact failure mode the lifecycle warns about.
- It **strengthens the [prepare phase](/docs/incident-forensics/ir-lifecycle#why-prepare-is-the-phase-that-decides-the-outcome).** Tabletop exercises are how "preparation" stops being a noun and becomes a rehearsed capability. The lifecycle *names* tabletops; this lesson is how you run them.
- It **changes the ransomware math.** As the [ransomware case study](/docs/case-studies/ransomware-case) shows, ransomware's entire leverage is *availability denial*. Tested, immutable backups mean you can **restore instead of pay** — collapsing both the damage and the incentive to negotiate. Recovery readiness is leverage.

The IR lifecycle is the *what-happens-when-attacked*; tabletops and BC/DR are *what makes the prepare and recover phases real* instead of aspirational.

## Why it matters

- **Prepared and "rehearsed" are different things.** A binder full of playbooks nobody has practiced fails on the real day. Tabletops are what turn paper into a capability — and what surface the gaps while they're cheap.
- **Recovery is a discipline, not a button.** RTO/RPO, a BIA, and tested backups are how "we'll just restore" becomes a number you can defend to leadership and execute under fire — instead of discovering at 3 a.m. that the backups don't restore.
- **Backups are the ransomware counter — if the attacker can't kill them.** Immutable/offline copies are the single change that most reliably lets you say "no" to a ransom. It's the recovery leg of the [boring fundamentals](/docs/case-studies/ransomware-case) that prevent catastrophe.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Untested backups.** A backup you've never restored is a *hope*, not a backup — restores fail constantly (corrupt media, missing encryption keys, incomplete coverage). Test-restore on a schedule; an untested backup has an unknown RTO, which is to say no RTO.
- **A plan nobody rehearses.** A pristine, unread playbook fails the moment a step is stale or a tool was decommissioned. If you never run a tabletop, the real incident *is* your first run-through — at the worst possible time.
- **Backups reachable with the same credentials the attacker has.** If the [identity](/docs/cloud-identity/iam-hardening) or network path that compromised production can also reach the backups, ransomware will encrypt them too. Use immutable/offline copies on separate credentials — this is the most common fatal BC/DR gap.
- **Confusing RTO and RPO.** RPO is *data lost* (set by backup frequency, looks backward); RTO is *time down* (set by restore speed, looks forward). Mixing them up leads to investing in the wrong thing (faster restores when the pain was lost data, or vice versa).
- **Gold-plating everything (or nothing).** Hot standby for the internal wiki wastes money; backup-restore for checkout loses the business. Without a BIA you can't tier — so you either overspend everywhere or under-protect what matters.
- **A "successful" tabletop that finds no problems.** That's a sign the scenario was too soft or nobody pushed with injects. The goal is to *find* gaps, capture them as owned, dated fixes, and feed them back — not to feel reassured.
:::

## Page checkpoint

<Quiz id="tabletop-bcdr-page" title="Did tabletops & BC/DR click?" sampleSize={3}>

<Question
  prompt="What is a tabletop exercise, and what does a GOOD one produce?"
  options={[
    { text: "A live red-team attack against production; success means no systems went down" },
    { text: "A discussion-based rehearsal where the team talks through a simulated incident step by step (nothing real is touched) — and a good one FINDS gaps (stale runbooks, undefined authority, untested backups) that become owned, dated fixes" },
    { text: "A signed document proving the IR plan is complete" },
    { text: "An automated backup verification job" }
  ]}
  correct={1}
  explanation="A tabletop is a fire drill for a cyber incident — on paper, no production touched. Its value is surfacing problems cheaply: a tabletop where the team 'aces it' usually means the scenario was too easy. The real output is a tracked list of fixes fed back into the playbook."
  revisit={{ to: "/docs/incident-forensics/tabletop-bcdr#the-tabletop-exercise-a-fire-drill-for-a-cyber-incident", label: "The tabletop exercise" }}
/>

<Question
  prompt="A system's last backup was at 12:00, it failed at 14:00, and the restore finished at 20:00. What are the RPO (data lost) and RTO (downtime)?"
  options={[
    { text: "RPO = 6 hours; RTO = 2 hours" },
    { text: "RPO = 2 hours (12:00→14:00, the data created since the last backup is lost); RTO = 6 hours (14:00→20:00, the time down until restored)" },
    { text: "RPO = 8 hours; RTO = 8 hours" },
    { text: "RPO and RTO are the same thing here, 4 hours" }
  ]}
  correct={1}
  explanation="RPO looks backward from the failure to the last good copy — 12:00 to 14:00 is 2 hours of lost data, driven by backup frequency. RTO looks forward — 14:00 to 20:00 is 6 hours of downtime, driven by restore speed. They measure different harms and are tuned with different investments."
  revisit={{ to: "/docs/incident-forensics/tabletop-bcdr#rto-and-rpo-defined-plainly", label: "RTO and RPO" }}
/>

<Question
  prompt="Why is an 'immutable or offline' backup copy now considered essential, beyond the classic 3-2-1 rule?"
  options={[
    { text: "It makes backups smaller and cheaper to store" },
    { text: "3-2-1 defends against accidents, but modern ransomware deliberately hunts for and encrypts/deletes backups first; an immutable (un-deletable for a window) or offline (disconnected) copy on separate credentials can't be destroyed by an attacker who already owns production" },
    { text: "Immutable backups restore faster, lowering RTO automatically" },
    { text: "It is a legal requirement in all jurisdictions" }
  ]}
  correct={1}
  explanation="Backups are the one thing that defeats ransomware's leverage, so attackers target them. A backup reachable with the credentials the attacker already stole is just another target. Immutable/offline copies survive a full production compromise — letting you restore instead of pay."
  revisit={{ to: "/docs/incident-forensics/tabletop-bcdr#backup-strategy-3-2-1-and-why-immutability-now-matters", label: "Immutable backups" }}
/>

<Question
  prompt="How does BC/DR relate to the incident-response lifecycle?"
  options={[
    { text: "It replaces the IR lifecycle entirely" },
    { text: "It's the muscle behind the lifecycle's bookends: tabletops make the PREPARE phase a rehearsed capability, and the DR plan + tested backups + RTO/RPO targets are what you actually EXECUTE during the RECOVER phase" },
    { text: "It only applies to natural disasters, never to cyber incidents" },
    { text: "It is unrelated to incident response and handled by a separate team with no overlap" }
  ]}
  correct={1}
  explanation="BC/DR isn't a separate world — it's what makes the IR lifecycle's prepare and recover phases real instead of aspirational. Without a tested DR plan, the recover phase is improvised; without tabletops, 'preparation' is just a binder no one has practiced."
  revisit={{ to: "/docs/incident-forensics/tabletop-bcdr#how-bcdr-plugs-into-the-ir-lifecycle", label: "BC/DR and the IR lifecycle" }}
/>

<Question
  prompt="Why use a Business Impact Analysis (BIA) to choose DR patterns rather than applying the strongest pattern everywhere?"
  options={[
    { text: "Because the strongest pattern (hot standby) is always illegal" },
    { text: "DR patterns trade money for RTO/RPO — hot standby is near-zero downtime but costs the most (running the system twice), while backup-restore is cheap but slow; the BIA ranks systems by business impact so you spend on tight recovery only where the business actually hurts" },
    { text: "Because RTO and RPO don't vary between systems" },
    { text: "Because backups make DR patterns unnecessary" }
  ]}
  correct={1}
  explanation="You're literally buying down RTO and RPO with dollars. Hot standby for the internal wiki wastes money; backup-restore for checkout loses the business. The BIA tiers systems so each gets a pattern matching its real importance — neither gold-plating everything nor under-protecting what matters."
  revisit={{ to: "/docs/incident-forensics/tabletop-bcdr#dr-patterns-how-fast-you-recover-is-what-youre-buying", label: "DR patterns" }}
/>

</Quiz>

## What's next

→ Continue to [Chain of Custody & Evidence Preservation](./chain-of-custody) — once an incident is real, the discipline that keeps the evidence you gather trustworthy and legally admissible.

→ **Going deeper:** this lesson is the *preparedness + recovery* complement to [The IR Lifecycle](/docs/incident-forensics/ir-lifecycle) — tabletops make its *prepare* phase real and BC/DR makes its *recover* phase real. See the [ransomware case study](/docs/case-studies/ransomware-case) for why tested, immutable backups change the entire outcome, and [Compliance](/docs/compliance) for the regulatory side of recovery and continuity.
