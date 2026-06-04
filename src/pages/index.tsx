import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import '../css/landing.css';

const CHAPTERS = [
  {n: '01', t: 'Security Foundations', d: 'CIA, threats, attacker mindset', to: '/docs/foundations'},
  {n: '02', t: 'Cryptography', d: 'Symmetric, asymmetric, TLS, PKI', to: '/docs/cryptography'},
  {n: '03', t: 'Web & App Security', d: 'OWASP Top 10, injection, authz', to: '/docs/appsec'},
  {n: '04', t: 'Secure SDLC', d: 'Threat modeling, SAST/DAST, supply chain', to: '/docs/secure-sdlc'},
  {n: '05', t: 'Pentesting & Red Team', d: 'Recon, exploitation, reporting', to: '/docs/offensive'},
  {n: '06', t: 'Detection & Response', d: 'SIEM, detection engineering, ATT&CK', to: '/docs/detection'},
  {n: '07', t: 'Incident & Forensics', d: 'IR lifecycle, forensics, breach', to: '/docs/incident-forensics'},
  {n: '08', t: 'Network Security', d: 'Segmentation, WAF, DDoS, zero-trust', to: '/docs/network-security'},
  {n: '09', t: 'Cloud & Identity', d: 'IAM hardening, CSPM, federation', to: '/docs/cloud-identity'},
  {n: '10', t: 'Compliance & Risk', d: 'SOC2/ISO/PCI/HIPAA, audits', to: '/docs/compliance'},
  {n: '11', t: 'AI Security', d: 'The new attack surface', to: '/docs/ai-security'},
  {n: '12', t: 'Career', d: 'Roles, certs, portfolio', to: '/docs/career'},
  {n: '13', t: 'Case Studies', d: 'Real breaches, reconstructed', to: '/docs/case-studies'},
  {n: '14', t: 'Glossary', d: 'Every term, defined', to: '/docs/glossary'},
];

const FIRST_LESSON = '/docs/foundations';

export default function Home(): ReactNode {
  return (
    <Layout
      title="How security is actually done"
      description="A field guide to offensive and defensive security engineering — from first principles to job-ready, for absolute beginners and beyond.">
      <div className="maeg">
        <header className="hero">
          <div className="wrap">
            <span className="kicker">2026 Edition · Offensive + defensive · For absolute beginners and beyond</span>
            <h1 className="display">How security is<br /><em>actually done.</em></h1>
            <p className="sub">
              A field guide to security engineering — cryptography, app-sec, secure SDLC,
              offensive testing, detection &amp; response, cloud and identity, and governance —
              taught from first principles to job-ready. All offensive material is for authorized
              testing, CTFs, and defense.
            </p>
            <div className="hero-cta">
              <Link to={FIRST_LESSON} className="btn btn-primary">
                Start the first chapter <span className="arr">&rarr;</span>
              </Link>
              <a href="#chapters" className="btn btn-ghost">Browse all 14 chapters</a>
            </div>
          </div>
        </header>

        <section className="band path-wrap" id="chapters">
          <div className="wrap">
            <div className="sec-head">
              <span className="kicker">The full path</span>
              <h2 className="display">Fourteen chapters, one discipline.</h2>
              <p>Read in order as a beginner and finish job-ready, or jump to what you need.</p>
            </div>
            <div className="chapters">
              {CHAPTERS.map((ch) => (
                <Link key={ch.n} to={ch.to} className="chap">
                  <span className="cn">{ch.n}</span>
                  <span>
                    <span className="ct">{ch.t}</span>
                    <span className="cd">{ch.d}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="closing">
          <div className="wrap">
            <span className="kicker">Ready?</span>
            <h2 className="display">Start with the attacker's mindset.</h2>
            <p>Security is a way of thinking before it's a toolkit. The first chapter builds it.</p>
            <div className="hero-cta">
              <Link to={FIRST_LESSON} className="btn btn-primary">
                Start the first chapter <span className="arr">&rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
