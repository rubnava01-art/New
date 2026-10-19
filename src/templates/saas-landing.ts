import type { Template } from './index';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{NAME}} — Ship better software, faster</title>
  <meta name="description" content="{{NAME}} helps product teams plan, build and release software with confidence." />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="nav">
    <div class="container nav-inner">
      <a class="logo" href="#top"><span class="logo-mark"></span>{{NAME}}</a>
      <nav class="nav-links" id="navLinks">
        <a href="#features">Features</a>
        <a href="#how">How it works</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </nav>
      <div class="nav-actions">
        <a class="btn btn-ghost btn-sm" href="#pricing">Sign in</a>
        <a class="btn btn-primary btn-sm" href="#cta">Start free</a>
        <button class="hamburger" id="hamburger" aria-label="Open menu">☰</button>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="container hero-inner">
        <p class="pill">✦ New: {{NAME}} 2.0 is live</p>
        <h1>Ship better software,<br /><span class="accent-text">twice as fast</span>.</h1>
        <p class="lede">{{NAME}} brings your roadmap, sprints and releases into one calm workspace — so your team spends Fridays shipping, not status-updating.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#cta">Start free trial</a>
          <a class="btn btn-ghost" href="#how">Watch how it works</a>
        </div>
        <p class="micro muted">Free 14-day trial · No credit card · Cancel anytime</p>
        <div class="mock">
          <div class="mock-bar"><span></span><span></span><span></span></div>
          <div class="mock-body">
            <div class="mock-side"></div>
            <div class="mock-main">
              <div class="mock-line w80"></div>
              <div class="mock-line w60"></div>
              <div class="mock-cards"><i></i><i></i><i></i></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="logos">
      <div class="container logos-inner muted">
        <span>Trusted by teams at</span>
        <strong>Northbeam</strong><strong>Hexlab</strong><strong>Corvid</strong><strong>Lumen Co</strong><strong>Patchwork</strong>
      </div>
    </section>

    <section class="section" id="features">
      <div class="container">
        <p class="eyebrow">Features</p>
        <h2>Everything you need, nothing you babysit.</h2>
        <div class="grid-3">
          <article class="card"><h3>Roadmaps that stay true</h3><p>Plan quarters visually; dependencies update themselves when dates move.</p></article>
          <article class="card"><h3>Sprints without ceremony</h3><p>Standups, retros and velocity, distilled to what actually matters.</p></article>
          <article class="card"><h3>Releases in one click</h3><p>Changelogs, flags and rollbacks from the same screen you planned on.</p></article>
          <article class="card"><h3>Docs that write themselves</h3><p>Specs generated from your tickets. Review, don't author.</p></article>
          <article class="card"><h3>Insights, not dashboards</h3><p>We surface the three numbers that predict your next slip.</p></article>
          <article class="card"><h3>Enterprise-grade security</h3><p>SSO, audit logs and regional data residency out of the box.</p></article>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="how">
      <div class="container">
        <p class="eyebrow">How it works</p>
        <h2>From idea to release in three steps.</h2>
        <div class="steps">
          <div class="step"><span class="step-n">1</span><h3>Import your work</h3><p>Connect GitHub, Jira or Linear — your backlog appears in minutes.</p></div>
          <div class="step"><span class="step-n">2</span><h3>Plan the quarter</h3><p>Drag milestones onto a timeline your whole company can read.</p></div>
          <div class="step"><span class="step-n">3</span><h3>Ship and measure</h3><p>Release with flags, watch adoption, roll back if needed.</p></div>
        </div>
      </div>
    </section>

    <section class="section" id="pricing">
      <div class="container">
        <p class="eyebrow">Pricing</p>
        <h2>Start free. Pay when it pays off.</h2>
        <div class="billing">
          <button class="billing-btn active" data-cycle="monthly">Monthly</button>
          <button class="billing-btn" data-cycle="yearly">Yearly <em>−20%</em></button>
        </div>
        <div class="grid-3">
          <article class="card price">
            <h3>Starter</h3>
            <p class="price-tag">$<span data-monthly="0" data-yearly="0">0</span><span>/mo</span></p>
            <ul><li>Up to 5 seats</li><li>Core boards &amp; docs</li><li>Community support</li></ul>
            <a class="btn btn-ghost" href="#cta">Start for free</a>
          </article>
          <article class="card price featured">
            <p class="badge">Most popular</p>
            <h3>Pro</h3>
            <p class="price-tag">$<span data-monthly="16" data-yearly="12">16</span><span>/seat/mo</span></p>
            <ul><li>Unlimited projects</li><li>Roadmaps &amp; releases</li><li>AI spec writer</li><li>Priority support</li></ul>
            <a class="btn btn-primary" href="#cta">Start 14-day trial</a>
          </article>
          <article class="card price">
            <h3>Enterprise</h3><p class="price-tag">Custom</p>
            <ul><li>SSO &amp; audit logs</li><li>Data residency</li><li>Dedicated CSM</li></ul>
            <a class="btn btn-ghost" href="#cta">Talk to sales</a>
          </article>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="faq">
      <div class="container narrow">
        <p class="eyebrow">FAQ</p>
        <h2>Questions, answered.</h2>
        <div class="faq" id="faq">
          <div class="faq-item">
            <button class="faq-q">Do I need a credit card for the trial?<span>+</span></button>
            <p class="faq-a">No. The 14-day Pro trial needs only an email. We ask for payment details only if you decide to stay.</p>
          </div>
          <div class="faq-item">
            <button class="faq-q">Can I migrate from Jira or Linear?<span>+</span></button>
            <p class="faq-a">Yes — the importer brings projects, issues and history in minutes, and keeps IDs stable so links don't break.</p>
          </div>
          <div class="faq-item">
            <button class="faq-q">Is my data safe?<span>+</span></button>
            <p class="faq-a">Encryption in transit and at rest, SSO/SAML on Enterprise, and EU/US data residency options.</p>
          </div>
          <div class="faq-item">
            <button class="faq-q">Can I cancel anytime?<span>+</span></button>
            <p class="faq-a">Anytime, in two clicks, from billing settings. Your data exports with you.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section cta" id="cta">
      <div class="container cta-inner">
        <h2>Your next release is one trial away.</h2>
        <p class="muted">Join 4,000+ teams shipping calmer with {{NAME}}.</p>
        <form class="cta-form" id="ctaForm" novalidate>
          <input type="email" name="email" placeholder="you@company.com" aria-label="Work email" required />
          <button class="btn btn-primary" type="submit">Start free</button>
        </form>
        <p class="form-note" id="formNote" role="status"></p>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <span>© <span id="year"></span> {{NAME}}</span>
      <span class="muted">Privacy · Terms · Security</span>
    </div>
  </footer>

  <script src="app.js"></script>
</body>
</html>
`;

const stylesCss = `:root {
  --bg: #0c0d12;
  --surface: #14151c;
  --text: #f5f6f8;
  --muted: #9aa0ae;
  --line: #23252e;
  --accent: #4f7cff;
  --accent-soft: #7ea2ff;
  --radius: 14px;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0; background: var(--bg); color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  line-height: 1.6;
}
.container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
.narrow { max-width: 760px; }
h1, h2, h3 { line-height: 1.2; margin: 0 0 12px; letter-spacing: -0.02em; }
h1 { font-size: clamp(2.4rem, 5.5vw, 4rem); font-weight: 800; }
h2 { font-size: clamp(1.6rem, 3.2vw, 2.3rem); font-weight: 750; }
p { margin: 0 0 12px; }
.muted { color: var(--muted); }
.micro { font-size: 0.85rem; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.72rem; color: var(--accent-soft); font-weight: 700; margin-bottom: 8px; }
.accent-text { color: var(--accent-soft); }
.lede { font-size: 1.15rem; color: var(--muted); max-width: 38rem; }

.nav { position: sticky; top: 0; z-index: 50; background: rgba(12,13,18,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); }
.nav-inner { display: flex; align-items: center; gap: 24px; height: 66px; }
.logo { display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--text); text-decoration: none; font-size: 1.1rem; }
.logo-mark { width: 24px; height: 24px; border-radius: 8px; background: linear-gradient(135deg, var(--accent), var(--accent-soft)); }
.nav-links { display: flex; gap: 22px; margin-left: 24px; }
.nav-links a { color: var(--muted); text-decoration: none; font-weight: 500; }
.nav-links a:hover { color: var(--text); }
.nav-actions { display: flex; gap: 10px; margin-left: auto; align-items: center; }
.hamburger { display: none; background: none; border: 1px solid var(--line); color: var(--text); border-radius: 10px; width: 38px; height: 38px; cursor: pointer; }

.btn { display: inline-block; padding: 13px 24px; border-radius: 12px; font-weight: 700; text-decoration: none; cursor: pointer; border: 1px solid transparent; transition: transform 0.12s, background 0.12s, box-shadow 0.12s; }
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: var(--accent); color: #fff; box-shadow: 0 8px 24px rgba(79,124,255,0.35); }
.btn-primary:hover { background: var(--accent-soft); }
.btn-ghost { border-color: var(--line); color: var(--text); background: var(--surface); }
.btn-sm { padding: 9px 16px; font-size: 0.9rem; }

.hero { padding: 88px 0 40px; text-align: center; background: radial-gradient(55% 60% at 50% 0%, rgba(79,124,255,0.16), transparent 70%); }
.pill { display: inline-block; border: 1px solid var(--line); background: var(--surface); border-radius: 999px; padding: 6px 16px; font-size: 0.85rem; color: var(--muted); margin-bottom: 20px; }
.hero-cta { display: flex; gap: 12px; justify-content: center; margin: 28px 0 12px; flex-wrap: wrap; }

.mock { max-width: 860px; margin: 44px auto 0; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.45); text-align: left; }
.mock-bar { display: flex; gap: 6px; padding: 12px 16px; border-bottom: 1px solid var(--line); }
.mock-bar span { width: 10px; height: 10px; border-radius: 50%; background: var(--line); }
.mock-body { display: grid; grid-template-columns: 180px 1fr; min-height: 260px; }
.mock-side { border-right: 1px solid var(--line); background: rgba(255,255,255,0.015); }
.mock-main { padding: 22px; }
.mock-line { height: 14px; border-radius: 7px; background: var(--line); margin-bottom: 12px; }
.w80 { width: 80%; } .w60 { width: 60%; }
.mock-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 18px; }
.mock-cards i { display: block; height: 74px; border-radius: 10px; background: linear-gradient(135deg, rgba(79,124,255,0.25), rgba(126,162,255,0.08)); border: 1px solid var(--line); }

.logos { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 20px 0; }
.logos-inner { display: flex; align-items: center; gap: 28px; justify-content: center; flex-wrap: wrap; font-size: 0.9rem; }
.logos-inner strong { color: var(--muted); font-weight: 700; letter-spacing: 0.04em; }

.section { padding: 72px 0; }
.section-alt { background: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 30px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 26px; transition: border-color 0.15s, transform 0.15s; }
.section-alt .card { background: var(--bg); }
.card:hover { border-color: var(--accent); transform: translateY(-2px); }
.card p { color: var(--muted); }

.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 30px; }
.step { border: 1px solid var(--line); border-radius: var(--radius); padding: 26px; background: var(--bg); }
.step-n { display: inline-flex; width: 34px; height: 34px; border-radius: 50%; background: var(--accent); color: #fff; font-weight: 800; align-items: center; justify-content: center; margin-bottom: 14px; }
.step p { color: var(--muted); }

.billing { display: inline-flex; border: 1px solid var(--line); border-radius: 999px; padding: 4px; margin-top: 18px; background: var(--surface); }
.billing-btn { border: none; background: transparent; color: var(--muted); font-weight: 700; padding: 8px 20px; border-radius: 999px; cursor: pointer; font: inherit; }
.billing-btn.active { background: var(--accent); color: #fff; }
.billing-btn em { font-style: normal; font-size: 0.75rem; opacity: 0.85; }
.price { display: flex; flex-direction: column; }
.price-tag { font-size: 2.2rem; font-weight: 800; color: var(--text); }
.price-tag span:last-child { font-size: 1rem; color: var(--muted); font-weight: 500; }
.price ul { list-style: none; padding: 0; margin: 0 0 22px; color: var(--muted); }
.price ul li { padding: 7px 0; border-bottom: 1px dashed var(--line); }
.price ul li:last-child { border: none; }
.price .btn { margin-top: auto; text-align: center; }
.featured { border-color: var(--accent); box-shadow: 0 12px 36px rgba(79,124,255,0.28); position: relative; }
.badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--accent); color: #fff; font-size: 0.72rem; font-weight: 700; padding: 4px 14px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.08em; }

.faq-item { border: 1px solid var(--line); border-radius: 12px; margin-bottom: 12px; background: var(--surface); overflow: hidden; }
.faq-q { width: 100%; background: none; border: none; color: var(--text); font: inherit; font-weight: 650; text-align: left; padding: 18px 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.faq-q span { color: var(--accent-soft); font-size: 1.3rem; line-height: 1; }
.faq-a { display: none; padding: 0 20px 18px; color: var(--muted); margin: 0; }
.faq-item.open .faq-a { display: block; }
.faq-item.open .faq-q span { transform: rotate(45deg); }

.cta { text-align: center; }
.cta-inner { max-width: 640px; margin: 0 auto; }
.cta-form { display: flex; gap: 10px; margin-top: 24px; }
.cta-form input { flex: 1; padding: 13px 16px; border-radius: 12px; border: 1px solid var(--line); background: var(--surface); color: var(--text); font: inherit; }
.cta-form input:focus { outline: 2px solid var(--accent); border-color: var(--accent); }
.form-note { margin-top: 12px; font-size: 0.92rem; min-height: 1.4em; }
.form-note.ok { color: #4ade80; }
.form-note.err { color: #f87171; }

.footer { border-top: 1px solid var(--line); padding: 24px 0; }
.footer-inner { display: flex; justify-content: space-between; color: var(--muted); font-size: 0.9rem; }

@media (max-width: 860px) {
  .grid-3, .steps { grid-template-columns: 1fr; }
  .mock-body { grid-template-columns: 1fr; }
  .mock-side { display: none; }
  .nav-links { display: none; position: absolute; top: 66px; left: 0; right: 0; background: var(--surface); flex-direction: column; padding: 16px 20px; border-bottom: 1px solid var(--line); gap: 12px; margin: 0; }
  .nav-links.open { display: flex; }
  .hamburger { display: block; }
  .nav-inner { position: relative; }
  .nav-actions .btn-ghost { display: none; }
  .cta-form { flex-direction: column; }
}
`;

const appJs = `(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  var burger = document.getElementById("hamburger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () { links.classList.toggle("open"); });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  // Pricing billing toggle: swap monthly/yearly numbers from data attributes
  var billingBtns = Array.prototype.slice.call(document.querySelectorAll(".billing-btn"));
  var priceNums = Array.prototype.slice.call(document.querySelectorAll("[data-monthly]"));
  billingBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      billingBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var cycle = btn.getAttribute("data-cycle");
      priceNums.forEach(function (el) {
        el.textContent = cycle === "yearly" ? el.getAttribute("data-yearly") : el.getAttribute("data-monthly");
      });
    });
  });

  // FAQ accordion (single open)
  var faq = document.getElementById("faq");
  if (faq) {
    faq.addEventListener("click", function (e) {
      var q = e.target.closest(".faq-q");
      if (!q) return;
      var item = q.parentElement;
      var wasOpen = item.classList.contains("open");
      Array.prototype.forEach.call(faq.querySelectorAll(".faq-item"), function (i) {
        i.classList.remove("open");
      });
      if (!wasOpen) item.classList.add("open");
    });
  }

  // CTA email capture (local demo confirmation)
  var form = document.getElementById("ctaForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.email.value.trim();
      var ok = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
      if (!ok) {
        note.textContent = "Please enter a valid work email to start your trial.";
        note.className = "form-note err";
        return;
      }
      note.textContent = "You're on the list (demo) — check " + email + " for your trial link.";
      note.className = "form-note ok";
      form.reset();
    });
  }
})();
`;

export const saasLanding: Template = {
  id: 'saas-landing',
  name: 'SaaS Landing',
  blurb: 'SaaS landing page with pricing toggle, FAQ accordion and CTA.',
  keywords: ['saas', 'software', 'app', 'startup', 'platform', 'landing', 'tech', 'product', 'aplicacion', 'aplicación', 'plataforma', 'tecnologia', 'tecnología', 'producto'],
  files: [
    { path: 'index.html', content: indexHtml },
    { path: 'styles.css', content: stylesCss },
    { path: 'app.js', content: appJs },
  ],
};
