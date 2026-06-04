---
id: secrets-iac-container-scanning
title: "Secrets, IaC & Container Scanning"
sidebar_position: 6
sidebar_label: Secrets / IaC / containers
description: Scanning the things around your code — leaked credentials, misconfigured infrastructure-as-code, and vulnerable container images — which cause some of the most common real-world breaches.
---

# Secrets, IaC & Container Scanning

> **In one line:** Some of the most common breaches don't come from application code at all — they come from a **leaked secret** in a repo, a **misconfigured** piece of infrastructure-as-code, or a **vulnerable container image** — so the secure pipeline scans all three automatically, before they reach production.

:::tip[In plain English]
The last lesson scanned your *application code*. But modern software ships with a lot of *other* stuff that can sink you just as fast. **Secrets**: passwords, API keys, and tokens that developers accidentally commit into the codebase — where they live in Git history forever and are harvested by bots within minutes. **Infrastructure-as-Code (IaC)**: the files (Terraform, CloudFormation, Kubernetes YAML) that define your servers, networks, and cloud resources — a single line like "make this storage bucket public" is a breach waiting to happen. **Container images**: the pre-packaged bundles (Docker images) your app runs in, which include an entire mini operating system full of libraries that may have known vulnerabilities. Each of these is scanned by its own kind of tool, and each catches a category of mistake that has caused real, headline breaches. The theme is the same as everywhere in this chapter: catch it left, automatically, before it ships.
:::

## Secret scanning: the most common own-goal

A **secret** is any credential — API key, password, private key, database connection string, cloud access token. The recurring disaster ([key management](/docs/cryptography/key-management) warned about it) is committing one into source control.

:::caution[Why a committed secret is an emergency]
- **It's public the instant it's pushed**, even to a "private" repo — leaks happen via forks, clones, screenshots, CI logs, and accidental public-ation.
- **It persists in Git history forever.** Deleting the line in a new commit does *not* remove it — the secret is still in the history and remains valid until *rotated*. (The only real fix is rotate the secret, then optionally scrub history.)
- **Bots scan public repos for secrets continuously.** Push an AWS key to a public GitHub repo and it can be found and abused — sometimes spinning up crypto-mining or draining accounts — in *minutes*.

A live cloud key in a repo is one of the fastest paths from "small mistake" to "large bill / breach" in all of security.
:::

**Secret scanning** tools (gitleaks, trufflehog, GitHub's built-in scanning, and platform "push protection") detect credential-shaped strings and known key formats. Wire them in at three points for defense in depth:

1. **Pre-commit hook** — block the secret on the developer's machine *before* it's ever committed. (Cheapest fix.)
2. **CI scan on every push/PR** — fail the build if a secret appears, catching what slipped past local hooks.
3. **History + continuous scanning** — sweep existing history and monitor for new leaks.

And the durable fix is to make secrets *unnecessary in code*: use a [secrets manager / KMS](/docs/cryptography/key-management), inject secrets as runtime configuration, and **if one leaks, rotate it immediately** — scanning tells you *that* it leaked; rotation is what actually closes the door.

## IaC scanning: misconfiguration as code

**Infrastructure-as-Code (IaC)** defines your infrastructure in version-controlled files (Terraform, CloudFormation, Kubernetes manifests, Helm charts) instead of clicking around a console. This is great for security — infrastructure becomes reviewable, repeatable, and scannable — *but* it also means a misconfiguration is now copy-pasted and deployed at scale.

**IaC scanning** tools (Checkov, tfsec, Terrascan, KICS) parse these files *before* deploy and flag insecure settings against best-practice policies. The classic catches map straight to [Security Misconfiguration](/docs/appsec/owasp-top-10) (A05):

:::note[Worked example: catching the open bucket before it exists]
A Terraform file includes:

```hcl
resource "aws_s3_bucket_acl" "data" {
  acl = "public-read"          # ← anyone on the internet can read this bucket
}
```

Public storage buckets are behind a long list of real breaches. An IaC scanner flags this *in the pull request*, before the bucket is ever created:

> ❌ CKV_AWS_xx: S3 bucket allows public read access.

Other high-value IaC catches: security groups open to `0.0.0.0/0` on sensitive ports, unencrypted storage/databases, missing logging, [over-privileged IAM roles](/docs/foundations/defense-in-depth), and public-facing admin endpoints. Each is the *infrastructure* equivalent of a code vulnerability — and because it's caught in the PR, it's a one-line fix instead of an incident. This is [shift-left](./shift-left) applied to the cloud, and it's increasingly where the highest-impact misconfigurations are stopped.
:::

The payoff: infrastructure mistakes get the *same* PR-review-and-scan treatment as code, so the [open bucket](/docs/appsec/ssrf) never reaches production.

## Container scanning: securing the box your app ships in

A **container image** (the Docker image your app runs in) bundles your code *plus* a base operating system and many system libraries. That base image can carry dozens of known-vulnerable packages you didn't write and may not know are there.

**Container/image scanning** tools (Trivy, Grype, Clair, and registry-integrated scanners) inventory everything in an image — OS packages and language dependencies — and match it against [CVE](/docs/secure-sdlc/sast-dast-sca) databases, much like [SCA](./sast-dast-sca) but for the whole image. They also flag image-level issues: running as **root**, embedded secrets, and using `latest`/unpinned base tags.

Beyond scanning, the durable defenses are about *minimizing what's in the box*:

- **Use minimal base images** (distroless, Alpine, or slim variants). Fewer packages = smaller [attack surface](/docs/foundations/attacker-mindset) = fewer CVEs to patch.
- **Don't run as root** inside the container — apply [least privilege](/docs/foundations/defense-in-depth) so a container escape or app compromise gains less.
- **Pin and rebuild.** Pin base-image versions for reproducibility, but rebuild regularly to pull in security patches — a pinned image left for a year accumulates known vulns.
- **Scan at build *and* in the registry**, since new CVEs are disclosed against images that were "clean" when built.

:::info[Highlight: these three are where "secure code" still loses]
You can write flawless application code and *still* get breached by a committed AWS key, a public S3 bucket, or a vulnerable base image. The attack surface isn't just your source — it's your **secrets, your infrastructure config, and your runtime image**. That's why the secure pipeline scans all of them. In practice, leaked secrets and cloud misconfiguration cause a large share of real-world breaches — often *more* than clever application exploits — making these "boring" scanners some of the highest-ROI controls you can deploy.
:::

## Why it matters

- **This is where many real breaches actually start.** Leaked credentials and cloud misconfiguration consistently rank among the top breach causes — frequently ahead of application-code exploits. Scanning them is disproportionately high-value.
- **It extends shift-left to the whole artifact.** Code, config, dependencies, and images all ship together; securing only the first leaves three open doors. These scanners close them in CI, cheaply.
- **The fixes are mostly prevention + good defaults.** Secrets managers, minimal images, non-root, and IaC policy-as-code prevent the mistakes structurally — the recurring [secure-by-default](/docs/appsec/defensive-patterns) theme.

## Common pitfalls

:::caution[Where people commonly trip up]
- **Thinking deleting a committed secret fixes it.** It stays in Git history and stays valid. You must **rotate** the secret; scrubbing history is secondary.
- **Trusting "private repo" to protect secrets.** Private repos leak via forks, clones, CI logs, and visibility changes. Don't commit secrets anywhere; use a secrets manager.
- **Skipping IaC scanning because "we review Terraform."** Humans miss a `public-read` line in a big diff; automated policy checks don't. Scan IaC like you scan code.
- **Using fat base images and running as root.** Big images carry more CVEs; root maximizes blast radius on compromise. Use minimal images and a non-root user.
- **Pinning an image and never rebuilding.** A pinned base accumulates newly-disclosed CVEs over time. Rebuild regularly and re-scan in the registry, not just at build.
- **Treating these as lower priority than app bugs.** Given how often secrets/misconfig cause breaches, that's backwards — these scanners are among the highest-ROI controls.
:::

## Page checkpoint

<Quiz id="secrets-iac-container-page" title="Did secrets/IaC/container scanning click?" sampleSize={3}>

<Question
  prompt="A developer accidentally commits a live AWS key, then deletes the line in the next commit. Is the secret safe now?"
  options={[
    { text: "Yes — deleting the line removed it" },
    { text: "No — it remains in Git history and stays valid until ROTATED; bots scan repos within minutes, so the key must be rotated immediately (scrubbing history is secondary)" },
    { text: "Yes, as long as the repo is private" },
    { text: "Only if the commit is force-pushed" }
  ]}
  correct={1}
  explanation="A deleted line persists in history and the credential stays live. The fix that actually closes the door is rotating the secret. Private repos aren't safe either (forks, clones, CI logs). Scanning detects the leak; rotation remediates it."
  revisit={{ to: "/docs/secure-sdlc/secrets-iac-container-scanning#secret-scanning-the-most-common-own-goal", label: "Why a committed secret is an emergency" }}
/>

<Question
  prompt="What does IaC scanning do, and which OWASP category does it most directly address?"
  options={[
    { text: "It scans application source for SQL injection; A03 Injection" },
    { text: "It parses infrastructure-as-code (Terraform, K8s YAML) before deploy and flags insecure settings (public buckets, open security groups, unencrypted storage) — addressing A05 Security Misconfiguration" },
    { text: "It tests the running app like an attacker; A01" },
    { text: "It scans container OS packages; A06" }
  ]}
  correct={1}
  explanation="IaC scanning checks infrastructure definitions against best-practice policy before resources exist, catching misconfigurations like public-read buckets in the PR. That's shift-left for the cloud and squarely the Security Misconfiguration (A05) defense."
  revisit={{ to: "/docs/secure-sdlc/secrets-iac-container-scanning#iac-scanning-misconfiguration-as-code", label: "IaC scanning" }}
/>

<Question
  prompt="Why scan container images, given you already run SAST/SCA on your code?"
  options={[
    { text: "Container scanning replaces SAST" },
    { text: "An image bundles a base OS and many system libraries you didn't write, which can carry known-vulnerable packages; image scanning inventories the whole image against CVEs and flags issues like running as root" },
    { text: "Images never contain vulnerabilities" },
    { text: "It only checks indentation in Dockerfiles" }
  ]}
  correct={1}
  explanation="Your app ships inside an image full of OS packages and libraries beyond your source. Container scanning catches CVEs in that base (like SCA for the whole image) plus image issues like root or embedded secrets. Minimal images and non-root reduce the surface."
  revisit={{ to: "/docs/secure-sdlc/secrets-iac-container-scanning#container-scanning-securing-the-box-your-app-ships-in", label: "Container scanning" }}
/>

<Question
  prompt="Why are leaked-secret and misconfiguration scanners considered some of the highest-ROI security controls?"
  options={[
    { text: "Because they're the most expensive to run" },
    { text: "Because leaked credentials and cloud misconfiguration cause a large share of real-world breaches — often more than clever app exploits — so cheaply catching them in CI prevents disproportionate harm" },
    { text: "Because they replace the need for threat modeling" },
    { text: "Because they only matter for static sites" }
  ]}
  correct={1}
  explanation="You can write perfect code and still be breached by a committed key or a public bucket. Since these mistakes drive a large fraction of actual breaches, automated low-cost scanning of secrets, IaC, and images delivers outsized risk reduction."
  revisit={{ to: "/docs/secure-sdlc/secrets-iac-container-scanning#why-it-matters", label: "Where breaches start" }}
/>

<Question
  prompt="A team pins their container base image to a specific version and never rebuilds for a year. What's the problem?"
  options={[
    { text: "Pinning is always wrong" },
    { text: "A pinned base accumulates newly-disclosed CVEs over time; pin for reproducibility but rebuild regularly to pull patches, and re-scan in the registry (not only at build)" },
    { text: "Nothing — pinning makes it permanently secure" },
    { text: "It makes the image too small" }
  ]}
  correct={1}
  explanation="Pinning gives reproducibility but freezes the package set, so vulnerabilities disclosed after build go unpatched. Rebuild on a schedule to absorb security updates and re-scan images in the registry, since new CVEs land against previously-clean images."
  revisit={{ to: "/docs/secure-sdlc/secrets-iac-container-scanning#container-scanning-securing-the-box-your-app-ships-in", label: "Pin and rebuild" }}
/>

</Quiz>

## What's next

→ Continue to [Supply-Chain Security](./supply-chain) — zooming out to the biggest version of "trust your inputs": how do you know the dependencies, build tools, and artifacts that make up your software haven't been tampered with?

→ **Going deeper:** the credential discipline here is [key management](/docs/cryptography/key-management); the cloud misconfigurations IaC scanning catches are detailed in [Cloud & Identity Security](/docs/cloud-identity).
