---
id: social-engineering
title: Social Engineering & Phishing
sidebar_position: 7
sidebar_label: Social engineering & phishing
description: Why humans are the easiest attack surface — the mechanics of phishing, spear-phishing, whaling, BEC, vishing/smishing, pretexting, and MFA-fatigue — and the technical, human, and process defenses that stop them.
---

# Social Engineering & Phishing

> **In one line:** Most real breaches don't start by defeating your firewall or cracking your encryption — they start by *convincing a person* to click a link, type a password, or wire money, because the human is almost always the cheapest way in; this lesson teaches how those attacks work and the three layers of defense (technical, human, and process) that stop them.

:::tip[In plain English]
You can build a perfect vault door and an attacker will still get in — by knocking on the door dressed as the delivery guy and asking someone to hold it open. **Social engineering** is hacking *people* instead of *machines*: instead of finding a flaw in your code, the attacker finds a flaw in a human's judgment. They send an email that looks like it's from your boss, a text that looks like it's from your bank, or a phone call that sounds like IT support — and they use ordinary human reflexes (wanting to be helpful, fear of getting in trouble, urgency, trust in authority) to get the one thing they need: a click, a password, an approved login, or a wire transfer. This is the [path of least resistance](./attacker-mindset) made literal. It needs no zero-day and no genius exploit — just a believable story and one person having a bad moment. That's exactly why it's the **number-one way attackers get their initial foothold**, and why every security program has to defend the human, not just the network.
:::

## Why humans are the easiest attack surface

In the [attacker's mindset](./attacker-mindset) lesson, the principle was *attackers take the path of least resistance — they don't break the strong front door if a side window is open.* For most organizations, **the human is the open window.** Here's why people are easier to attack than systems:

- **Code does exactly what it's told; people improvise.** You can write a server-side check that *always* rejects a `$0.01` price (that's a [trust boundary](./trust-boundaries) you control). You cannot write a check that guarantees every employee, every day, refuses a convincing-looking request from "the CEO."
- **The attacker only needs to win once.** A defender has to get every employee right every time. An attacker emailing 1,000 staff needs *one* tired person at 5pm on a Friday to click.
- **Human reflexes are exploitable and universal.** Authority (do what the boss says), urgency (act now or there's a penalty), scarcity (the offer expires), social proof (everyone else already did it), reciprocity, and fear are levers that work on almost everyone — they're features of being human, not bugs you can patch.
- **It scales and it's cheap.** Sending a million phishing emails costs almost nothing. Even a 0.1% success rate is 1,000 footholds.

:::note[Terms, defined once]
- **Social engineering** — manipulating a *person* (rather than exploiting a technical flaw) into revealing information, granting access, or taking an action that helps the attacker. The umbrella term for everything in this lesson.
- **Phishing** — a *broad, untargeted* social-engineering attack, usually by email, that impersonates a trusted party to trick recipients into clicking a malicious link, opening a malicious attachment, or entering credentials on a fake page. "Phishing" because the attacker casts a wide net and sees who bites.
- **Pretext** — the believable cover story the attacker invents ("I'm from IT and your account is locked"). *Pretexting* is building and using that story to earn trust before the ask.
- **Payload** — the harmful thing the attacker wants delivered: a credential-harvesting page, a malware download, or simply a reply with sensitive data.
- **Initial access** — the attacker's *first foothold* inside your environment. Social engineering is the most common source of it — the door, not the whole burglary.
- **Lure / hook** — the bait (a fake invoice, a "your package is held" notice, a shared-document alert) and the emotional trigger (urgency, fear, curiosity) that makes the target act before thinking.
:::

## The phishing family: from spray to spear

Phishing isn't one attack; it's a spectrum that ranges from "send to everyone" to "researched and aimed at one person." The more targeted, the more dangerous — and the harder to spot.

- **Phishing (bulk/spray)** — the same generic message to thousands ("Your mailbox is full, click to verify"). Low effort, low per-target success, but it scales.
- **Spear-phishing** — a *targeted* message crafted for a specific person or small group, using real details (your name, your manager, a project you're on) to be far more believable. This is the workhorse of real intrusions.
- **Whaling** — spear-phishing aimed at a *"big fish"*: an executive, finance lead, or admin — someone whose access or authority makes a single success enormously valuable.
- **Clone phishing** — taking a *real* email the victim already received and re-sending a near-identical copy with the link or attachment swapped for a malicious one.

:::note[Beyond email: same trick, other channels]
- **Vishing (voice phishing)** — social engineering by *phone call*. "This is IT/your bank's fraud department" — pressuring you to read back a code, install software, or confirm a transfer. Increasingly powered by **AI voice cloning** of a real colleague or family member.
- **Smishing (SMS phishing)** — phishing by *text message* ("Your package couldn't be delivered, confirm your address: [link]"). Texts feel personal and urgent, and a phone's small screen hides the real URL.
- **Quishing (QR-code phishing)** — a malicious link encoded as a **QR code** (in an email, a flyer, a fake parking sign) so it dodges link scanners and lands the victim on a phishing page they typed into their phone, off the corporate network.
:::

### Business Email Compromise (BEC): the expensive one

**Business Email Compromise (BEC)** is social engineering aimed squarely at *money* (or sensitive data). The attacker impersonates a trusted insider — usually an executive or a known vendor — and asks an employee with payment authority to **wire funds, change bank details on an invoice, or buy gift cards.** What makes BEC so damaging and so dangerous:

- **Often no malware and no link.** A BEC email can be plain text — "Hey, are you at your desk? I need you to handle a confidential vendor payment." There's nothing for a virus scanner to catch; the payload is *the request itself*.
- **It abuses authority and urgency.** "The CEO needs this done before the board call, keep it quiet." That combination short-circuits the verification a person would normally do.
- **It targets process gaps, not software bugs.** The fix is a *process* (out-of-band verification of payment changes), which is exactly why it slips past purely technical defenses.

BEC is consistently among the costliest categories of cybercrime by total dollar loss — far exceeding flashier attacks — precisely because it bypasses the technology and goes straight at human and process trust.

### MFA fatigue / push-bombing

[Multi-factor authentication (MFA)](/docs/appsec/broken-authentication) — requiring a second factor beyond the password — is one of the strongest defenses against stolen passwords. So attackers social-engineer *around* it. In an **MFA-fatigue (push-bombing)** attack, the attacker *already has* the victim's password (from a leak or earlier phish) and triggers the "Approve sign-in?" push notification over and over — at 2am, dozens of times — until the exhausted, confused victim taps **Approve** just to make it stop. Sometimes paired with a *vishing* call: "Hi, this is IT, we're testing the new system, please approve the prompt." This is social engineering bolted onto a technical control, and it's how several major breaches began.

## A traced worked example: a spear-phish → BEC kill chain

Let's walk one realistic attack end to end, step by step, the way you'd reconstruct it after the fact. The target is **Dana, an accounts-payable clerk** at a mid-size company.

**Step 1 — Reconnaissance (no contact yet).** The attacker reads the company's public LinkedIn and website. They learn the CFO is **Sam Rivera**, that the company uses a vendor called **Northwind Logistics**, and that **Dana handles vendor payments**. None of this is secret; it's all public. *This is the [attacker's mindset](./attacker-mindset) applied to people: harvest trust signals before the ask.*

**Step 2 — Pretext + lookalike sender.** The attacker registers the domain `northwlnd-logistics.com` (an *l* swapped for the *i* — easy to miss) and sends Dana an email that *looks* like it's from Northwind's billing team, referencing a real-sounding invoice number. The pretext: "We've updated our banking details; please use the new account for this month's payment." The email is polished, branded, and unhurried — clone-quality.

**Step 3 — The hook (authority + urgency).** A follow-up arrives, this time spoofing the *display name* "Sam Rivera (CFO)" — the visible name says Sam, but the actual address is `sam.rivera@gmail-secure-mail.com`. The message: *"Dana, I've approved the Northwind banking update — please process it today, we can't miss the deadline. I'm heading into back-to-back meetings, just handle it. Thanks."* Authority ("the CFO approved it") plus urgency ("today," "I'm unavailable to confirm") is the classic BEC pressure cocktail.

**Step 4 — The action.** Dana, wanting to be responsive and not wanting to bother a busy executive, updates Northwind's bank details in the payment system and schedules the wire. **No malware ran. No link was clicked. No password was stolen.** The "exploit" was entirely a manipulated human decision.

**Step 5 — Impact.** The next vendor payment — say \$84,000 — lands in the attacker's account. By the time the real Northwind asks where their money is, the funds have been moved through several accounts and are gone. The company has suffered a real financial loss with *zero* technical compromise of its systems.

:::note[Where every defense layer would have broken the chain]
Now replay the same chain and watch each control stop it:
- **Step 2 (lookalike domain):** [DMARC/SPF/DKIM](#technical-defenses-make-impersonation-hard) and email filtering flag or quarantine the spoofed/lookalike sender — the message may never reach Dana's inbox, or arrives banner-tagged "External / unverified sender."
- **Step 3 (display-name spoof):** a trained eye ([awareness training](#human-defenses-build-a-skeptical-verifying-culture)) checks the *actual* address, not the display name, and sees `gmail-secure-mail.com` is not the CFO.
- **Step 4 (the wire):** an [out-of-band verification process](#process-defenses-make-the-safe-path-the-default) — "any change to vendor banking details or any urgent wire is confirmed by calling a *known* number, never replying to the email" — catches it cold. Dana phones the CFO's real number; Sam says "I never sent that." Attack over.

**No single layer has to be perfect.** This is [defense in depth](./defense-in-depth) for the human attack surface: technology thins the flood, training catches what gets through, and process is the backstop that makes the costly action impossible to do alone.
:::

## The three layers of defense

Defending humans isn't one trick; it's the same [defense-in-depth](./defense-in-depth) idea — independent layers — applied to people and process.

### Technical defenses: make impersonation hard

These reduce how many malicious messages even reach a person, and make stolen passwords less useful.

- **Email authentication — SPF, DKIM, DMARC.** Three standards that together let receiving mail servers verify a message really came from the domain it claims:
  - **SPF (Sender Policy Framework)** — the domain owner publishes *which servers are allowed to send mail* for the domain; receivers reject mail from anywhere else.
  - **DKIM (DomainKeys Identified Mail)** — the sending server *cryptographically signs* each message; the receiver checks the signature against the domain's public key, proving the mail wasn't forged or altered.
  - **DMARC (Domain-based Message Authentication, Reporting & Conformance)** — the *policy* that ties SPF and DKIM together: it tells receivers what to do when a message fails (none / quarantine / **reject**) and sends the domain owner reports. A strict DMARC policy (`p=reject`) is what stops attackers from spoofing *your exact domain* in emails to your own staff and customers.
- **Email/link filtering and sandboxing.** Secure email gateways scan for known-bad links and attachments, detonate suspicious attachments in a sandbox, rewrite links so they're re-checked at click time, and tag external mail with a banner.
- **Phishing-resistant MFA — FIDO2 / passkeys.** Ordinary MFA (SMS codes, app push) can be *phished* (the fake site relays your code) or *fatigued* (push-bombing). **FIDO2/WebAuthn** authenticators — security keys and [passkeys](/docs/appsec/broken-authentication) — are **phishing-resistant by design**: the credential is cryptographically *bound to the real site's domain*, so even if a victim is fooled into visiting a perfect look-alike page, the authenticator simply won't produce a valid response for the wrong domain. There's no code to read out and nothing to relay. This is the single strongest technical lever against credential phishing.

### Human defenses: build a skeptical, verifying culture

Technology thins the flood but never catches everything, so the human has to be a sensor too — not a scapegoat.

- **Security-awareness training** that teaches the *reflexes*, not a list of rules: hover before you click, check the real sender address (not the display name), be suspicious of urgency + secrecy + an unusual request, and **verify out of band** when money or credentials are involved.
- **Phishing simulations** — the security team sends *benign* fake phishes to its own staff, then coaches (never punishes) those who click. The goal is a measurable click-rate that drops over time and people who *report* suspicious mail. A **blame-free culture** is essential: if clicking gets you yelled at, people hide their mistakes instead of reporting them — and a *reported* phish is an early-warning signal for the whole org.
- **An easy "report phish" button** so reporting is one click. Fast reports let defenders pull the same email from everyone else's inbox before more people fall for it.

### Process defenses: make the safe path the default

Some attacks (like BEC) carry no malware and pass every technical filter, so the only reliable stop is a *process* that doesn't depend on one person's judgment in the moment.

- **Out-of-band verification for money and credential changes.** Any wire transfer, any change to a vendor's bank details, any "urgent" payment request is verified through a *separate, known* channel — call the requester back on a number you already have, not one in the email. The email could be fake; the phone number you trusted yesterday is real.
- **Separation of duties / dual approval** for high-value payments, so no single person (and therefore no single fooled person) can move large sums alone.
- **Out-of-band confirmation for unexpected MFA prompts** — and **number matching** (the user must type a number shown on the login screen into their phone), which defeats blind push-bombing because the attacker doesn't know the number to tell the victim.
- **Least-privilege and assume-breach** ([defense in depth](./defense-in-depth)): when a phish *does* succeed, [segmentation](/docs/network-security/segmentation) and minimal access keep that one foothold from becoming a company-wide breach.

## Why it matters

- **It's the most common way real breaches start.** Year after year, phishing and stolen/abused credentials are the leading *initial-access* vectors in breach reports. The [ransomware case study](/docs/case-studies/ransomware-case) and this guide's [intro](/docs/) both hinge on exactly this — a person and a credential, not a clever exploit.
- **It defeats your strongest technical controls by going around them.** Perfect encryption and a hardened perimeter are irrelevant if an employee hands over a valid login or wires the money. You have to defend the human layer explicitly.
- **It's where AI is changing the threat fastest.** Generative AI writes flawless, personalized lures at scale and clones voices for vishing — raising the baseline believability of every attack. The defenses (phishing-resistant MFA, out-of-band verification, a verifying culture) hold up precisely because they don't rely on spotting a typo.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Treating awareness training as the whole answer.** Training reduces click-rates but never to zero — a determined spear-phish will fool *someone*. Training is one layer; it must sit on top of technical filtering and a verification *process*, not replace them.
- **Blaming and punishing the clicker.** Punishment drives mistakes underground. The clicker is the *victim* of a professional manipulation; the goal is fast reporting and systemic fixes, not shame.
- **Assuming MFA makes you phishing-proof.** Ordinary MFA (SMS, app push) is still phishable (real-time relay) and fatigue-able (push-bombing). Only *phishing-resistant* factors (FIDO2/passkeys) close that gap — and even then, BEC needs no login at all.
- **Verifying a suspicious request using the contact info *in* the request.** If the email might be fake, the phone number or "confirm here" link in that same email is fake too. Out-of-band means a channel you *already* trusted, independent of the message.
- **Thinking "we're too small/boring to be targeted."** Bulk phishing and BEC are indiscriminate and automated; attackers target *whoever pays*, not just famous companies. A small finance team with weak payment-verification process is a prime BEC target.
- **Confusing the display name with the real sender.** "Sam Rivera (CFO)" in the From field is just text the attacker typed. The control is checking the actual address — and, at the org level, DMARC so they can't spoof your real domain at all.
:::

## Page checkpoint

<Quiz id="social-engineering-page" title="Did social engineering & phishing stick?" sampleSize={3}>

<Question
  prompt="An accounts-payable clerk receives a plain-text email — no link, no attachment — that appears to be from the CFO, urgently approving a change to a vendor's bank details and asking that it be processed today and kept confidential. What is this, and why do virus scanners and email link-filters often miss it?"
  options={[
    { text: "SQL injection — scanners miss it because the query is encrypted" },
    { text: "Business Email Compromise (BEC) — there's no malware or link to detect; the payload is the manipulated request itself, abusing authority + urgency, so the real defense is an out-of-band verification process" },
    { text: "A DDoS attack — filters miss it because it comes from many sources" },
    { text: "Credential stuffing — scanners miss it because the password is already valid" }
  ]}
  correct={1}
  explanation="BEC targets money/data by impersonating a trusted insider and asking a human to act. Because the email can be plain text with no technical payload, signature- and link-based tools have nothing to catch — the manipulation IS the attack. The reliable stop is process: verify any payment/banking change through a separately known channel, never by replying."
  revisit={{ to: "/docs/foundations/social-engineering#business-email-compromise-bec-the-expensive-one", label: "Business Email Compromise" }}
/>

<Question
  prompt="Your organization uses app-push MFA. An attacker who already has an employee's password sends the 'Approve sign-in?' prompt dozens of times late at night until the tired employee taps Approve. What is this attack called, and which control most directly defeats it?"
  options={[
    { text: "Phishing — defeated by stronger passwords" },
    { text: "MFA fatigue / push-bombing — defeated by phishing-resistant factors (FIDO2/passkeys) and number-matching, which require something the attacker can't supply" },
    { text: "Pretexting — defeated by encryption" },
    { text: "Whaling — defeated by a firewall" }
  ]}
  correct={1}
  explanation="Push-bombing spams approval prompts to wear the victim down. Number-matching forces the user to type a number shown on the login screen — which the attacker doesn't know — and FIDO2/passkeys remove the 'just approve' tap entirely by binding the credential to the real domain. Both close the gap that blind push approval leaves open."
  revisit={{ to: "/docs/foundations/social-engineering#mfa-fatigue--push-bombing", label: "MFA fatigue / push-bombing" }}
/>

<Question
  prompt="What problem do SPF, DKIM, and DMARC together solve, and what does a strict DMARC policy (p=reject) specifically prevent?"
  options={[
    { text: "They encrypt email bodies so attackers can't read intercepted mail" },
    { text: "They let receiving servers verify a message really came from the domain it claims; a strict DMARC policy stops attackers from spoofing your exact domain to your own staff and customers" },
    { text: "They scan attachments for malware in a sandbox" },
    { text: "They require multi-factor authentication for the mail server" }
  ]}
  correct={1}
  explanation="SPF lists which servers may send for a domain, DKIM cryptographically signs messages, and DMARC sets the policy (none/quarantine/reject) and reporting that ties them together. p=reject tells receivers to drop mail that fails — which is what blocks an attacker from forging your real domain. (Note: it does NOT stop lookalike domains or display-name spoofing, which is why human + process layers still matter.)"
  revisit={{ to: "/docs/foundations/social-engineering#technical-defenses-make-impersonation-hard", label: "SPF, DKIM, DMARC" }}
/>

<Question
  prompt="Why are FIDO2 security keys and passkeys described as 'phishing-resistant' when ordinary SMS or app-push MFA are not?"
  options={[
    { text: "They use a longer password that's harder to guess" },
    { text: "The credential is cryptographically bound to the real site's domain, so even a victim fooled into visiting a perfect look-alike page can't produce a valid response for the wrong domain — there's no code to read out or relay" },
    { text: "They send the second factor over an encrypted SMS channel" },
    { text: "They block the email before it reaches the user" }
  ]}
  correct={1}
  explanation="SMS codes and push approvals can be relayed by a fake site in real time or fatigued via push-bombing. FIDO2/WebAuthn ties the credential to the legitimate domain, so a phishing domain simply gets no valid authentication — the human can't be tricked into handing over something reusable because there's nothing to hand over."
  revisit={{ to: "/docs/foundations/social-engineering#technical-defenses-make-impersonation-hard", label: "Phishing-resistant MFA" }}
/>

<Question
  prompt="A finance employee gets a suspicious 'urgent wire' request seemingly from a vendor. They want to verify it. What is the correct out-of-band verification, and why?"
  options={[
    { text: "Reply to the email and ask 'is this really you?' — if they confirm, proceed" },
    { text: "Call the phone number listed at the bottom of the suspicious email to confirm" },
    { text: "Call the vendor back on a number you already had on file (not one from the email) — because if the message is fake, any contact info inside it is fake too; verification must use an independent, already-trusted channel" },
    { text: "Forward the email to a colleague and let them decide" }
  ]}
  correct={2}
  explanation="Out-of-band means a channel independent of the possibly-fake message. Replying to the email or calling a number printed in it just talks to the attacker. Using a number you already trusted (from your records, the vendor's known site) confirms with the real party and breaks the BEC chain."
  revisit={{ to: "/docs/foundations/social-engineering#process-defenses-make-the-safe-path-the-default", label: "Out-of-band verification" }}
/>

<Question
  prompt="Why is a BLAME-FREE culture (coaching, not punishing, employees who fall for a phishing simulation) considered a security control, not just a nicety?"
  options={[
    { text: "It isn't — punishing clickers is the fastest way to reduce click-rates" },
    { text: "Because punishment makes people hide mistakes; a fast, fearless report of a real phish is an early-warning signal that lets defenders pull the same email from everyone else's inbox before more people fall for it" },
    { text: "Because it satisfies a legal requirement to be nice to employees" },
    { text: "Because it eliminates the need for technical email filtering" }
  ]}
  correct={1}
  explanation="The clicker is the victim of professional manipulation. If reporting gets you blamed, people stay quiet — and silence costs the org the early warning. A reported phish lets responders yank it org-wide and contain the campaign; that reporting only happens reliably when it's safe to admit a mistake."
  revisit={{ to: "/docs/foundations/social-engineering#human-defenses-build-a-skeptical-verifying-culture", label: "A verifying culture" }}
/>

</Quiz>

## What's next

→ Continue to [Defense in Depth & Least Privilege](./defense-in-depth) — the principle this lesson kept reaching for: when a phish *does* succeed, layered defenses and minimal access keep one fooled human from becoming a company-wide breach.

→ **Going deeper:** social engineering is the human face of the [attacker's mindset](./attacker-mindset) and the [path of least resistance](./attacker-mindset#what-thinking-like-an-attacker-actually-means); the credential side (MFA, passkeys, credential stuffing) is [Broken Authentication](/docs/appsec/broken-authentication); and you'll see all of it converge in the [ransomware case study](/docs/case-studies/ransomware-case), where a single phished/leaked credential with no MFA shut down a fuel pipeline.
