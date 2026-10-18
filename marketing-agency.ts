import type { Template } from './index';

const indexHtml = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{NAME}} — Digital Marketing Agency</title>
  <meta name="description" content="{{NAME}} helps ambitious brands grow with SEO, paid media and content that compounds." />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="nav">
    <div class="container nav-inner">
      <a class="logo" href="#top"><span class="logo-mark"></span>{{NAME}}</a>
      <nav class="nav-links" id="navLinks">
        <a href="#services">Services</a>
        <a href="#pricing">Pricing</a>
        <a href="#testimonials">Results</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="nav-actions">
        <button class="theme-btn" id="themeBtn" aria-label="Toggle color theme">◐</button>
        <a class="btn btn-primary btn-sm" href="#contact">Get a proposal</a>
        <button class="hamburger" id="hamburger" aria-label="Open menu">☰</button>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <p class="eyebrow">Digital marketing agency</p>
          <h1>Marketing that <span class="accent-text">compounds</span>, not campaigns that expire.</h1>
          <p class="lede">We build SEO engines, paid-media systems and content flywheels for brands that want predictable pipeline — not vanity metrics.</p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#contact">Get your growth plan</a>
            <a class="btn btn-ghost" href="#pricing">See pricing</a>
          </div>
          <dl class="stats">
            <div><dt>3.2x</dt><dd>avg. ROAS across clients</dd></div>
            <div><dt>140+</dt><dd>brands scaled</dd></div>
            <div><dt>8 yrs</dt><dd>in business</dd></div>
          </dl>
        </div>
        <div class="hero-card">
          <div class="hero-card-head"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
          <p class="hero-card-title">This quarter at {{NAME}}</p>
          <div class="metric"><span>Organic traffic</span><strong>+212%</strong></div>
          <div class="bar"><i style="width:82%"></i></div>
          <div class="metric"><span>Cost per lead</span><strong>−38%</strong></div>
          <div class="bar"><i style="width:64%"></i></div>
          <div class="metric"><span>Marketing-sourced revenue</span><strong>+$1.4M</strong></div>
          <div class="bar"><i style="width:91%"></i></div>
        </div>
      </div>
    </section>

    <section class="section" id="services">
      <div class="container">
        <p class="eyebrow">What we do</p>
        <h2>Full-funnel services, one accountable team.</h2>
        <div class="grid-3">
          <article class="card"><h3>SEO &amp; Content</h3><p>Technical audits, keyword systems and editorial engines that rank and convert.</p></article>
          <article class="card"><h3>Paid Media</h3><p>Google, Meta and TikTok campaigns managed against revenue targets, not clicks.</p></article>
          <article class="card"><h3>Social &amp; Creative</h3><p>Scroll-stopping creative produced weekly, tested relentlessly, scaled fast.</p></article>
          <article class="card"><h3>Email &amp; Lifecycle</h3><p>Flows and campaigns that turn one-time buyers into repeat revenue.</p></article>
          <article class="card"><h3>CRO &amp; Landing Pages</h3><p>Experimentation programs that lift conversion a few honest points at a time.</p></article>
          <article class="card"><h3>Analytics &amp; Attribution</h3><p>Dashboards your CFO will trust. Every dollar traced to pipeline.</p></article>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="pricing">
      <div class="container">
        <p class="eyebrow">Pricing</p>
        <h2>Simple retainers. No surprises.</h2>
        <div class="grid-3">
          <article class="card price">
            <h3>Starter</h3><p class="price-tag">$490<span>/mo</span></p>
            <ul><li>1 growth channel</li><li>Monthly reporting</li><li>Email support</li></ul>
            <a class="btn btn-ghost" href="#contact">Choose Starter</a>
          </article>
          <article class="card price featured">
            <p class="badge">Most popular</p>
            <h3>Growth</h3><p class="price-tag">$1,190<span>/mo</span></p>
            <ul><li>3 growth channels</li><li>Weekly experiments</li><li>Bi-weekly strategy calls</li><li>Creative production</li></ul>
            <a class="btn btn-primary" href="#contact">Choose Growth</a>
          </article>
          <article class="card price">
            <h3>Scale</h3><p class="price-tag">Custom</p>
            <ul><li>Full-funnel team</li><li>Dedicated strategist</li><li>Custom attribution</li></ul>
            <a class="btn btn-ghost" href="#contact">Talk to us</a>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="testimonials">
      <div class="container">
        <p class="eyebrow">Client results</p>
        <h2>Brands that stopped guessing.</h2>
        <div class="grid-3" id="quotes">
          <blockquote class="card quote">
            <p>“{{NAME}} took us from $40k to $210k/month in paid social while cutting CAC by a third.”</p>
            <footer>— Maya R., DTC founder</footer>
          </blockquote>
          <blockquote class="card quote">
            <p>“Our organic pipeline tripled in two quarters. The reporting alone is worth the retainer.”</p>
            <footer>— Daniel K., B2B SaaS CEO</footer>
          </blockquote>
          <blockquote class="card quote">
            <p>“Finally an agency that talks revenue instead of impressions. Renewed for year two.”</p>
            <footer>— Sofia L., E-commerce director</footer>
          </blockquote>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="contact">
      <div class="container contact-grid">
        <div>
          <p class="eyebrow">Contact</p>
          <h2>Tell us where you want to be in 12 months.</h2>
          <p class="muted">We reply within one business day with first impressions — free, no pitch deck ambush.</p>
          <ul class="contact-list">
            <li>hello@example.com</li>
            <li>+1 (555) 010-2030</li>
            <li>Mon–Fri, 9am–6pm PT</li>
          </ul>
        </div>
        <form class="card form" id="contactForm" novalidate>
          <label>Your name<input type="text" name="name" required placeholder="Jane Doe" /></label>
          <label>Email<input type="email" name="email" required placeholder="jane@company.com" /></label>
          <label>What are you trying to grow?<textarea name="message" rows="4" required placeholder="e.g. Our Shopify store does $80k/mo and paid is plateauing…"></textarea></label>
          <button class="btn btn-primary" type="submit">Send message</button>
          <p class="form-note" id="formNote" role="status"></p>
        </form>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <span>© <span id="year"></span> {{NAME}}. All rights reserved.</span>
      <span class="muted">Built to compound.</span>
    </div>
  </footer>

  <script src="app.js"></script>
</body>
</html>
`;

const stylesCss = `:root {
  --bg: #101114;
  --surface: #17181d;
  --surface-2: #1d1f26;
  --text: #f5f6f8;
  --muted: #a7abb6;
  --line: #2a2d36;
  --accent: #7c5cff;
  --accent-soft: #9a82ff;
  --radius: 14px;
}
[data-theme="light"] {
  --bg: #f7f7f9;
  --surface: #ffffff;
  --surface-2: #f0f1f5;
  --text: #141519;
  --muted: #5b606c;
  --line: #e2e4ea;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  line-height: 1.6;
  transition: background 0.25s, color 0.25s;
}
.container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
h1, h2, h3 { line-height: 1.2; margin: 0 0 12px; letter-spacing: -0.01em; }
h1 { font-size: clamp(2rem, 4.5vw, 3.2rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.1rem); }
p { margin: 0 0 12px; }
.muted { color: var(--muted); }
.eyebrow {
  text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.75rem;
  color: var(--accent-soft); font-weight: 700; margin-bottom: 8px;
}
.accent-text { color: var(--accent-soft); }
.lede { font-size: 1.1rem; color: var(--muted); max-width: 34rem; }

/* Nav */
.nav {
  position: sticky; top: 0; z-index: 50;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.nav-inner { display: flex; align-items: center; gap: 24px; height: 64px; }
.logo { display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--text); text-decoration: none; }
.logo-mark { width: 22px; height: 22px; border-radius: 7px; background: linear-gradient(135deg, var(--accent), var(--accent-soft)); display: inline-block; }
.nav-links { display: flex; gap: 20px; margin-left: auto; }
.nav-links a { color: var(--muted); text-decoration: none; font-weight: 500; }
.nav-links a:hover { color: var(--text); }
.nav-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }
.nav-links + .nav-actions { margin-left: 0; }
.theme-btn {
  background: var(--surface-2); color: var(--text); border: 1px solid var(--line);
  border-radius: 10px; width: 36px; height: 36px; cursor: pointer; font-size: 1rem;
}
.hamburger { display: none; background: none; border: 1px solid var(--line); color: var(--text); border-radius: 10px; width: 38px; height: 38px; cursor: pointer; }

/* Buttons */
.btn {
  display: inline-block; padding: 12px 22px; border-radius: 12px;
  font-weight: 700; text-decoration: none; cursor: pointer; border: 1px solid transparent;
  transition: transform 0.12s, box-shadow 0.12s, background 0.12s;
}
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: var(--accent); color: #fff; box-shadow: 0 6px 20px rgba(124, 92, 255, 0.35); }
.btn-primary:hover { background: var(--accent-soft); }
.btn-ghost { border-color: var(--line); color: var(--text); background: var(--surface); }
.btn-sm { padding: 8px 14px; font-size: 0.9rem; }

/* Hero */
.hero { padding: 72px 0 56px; }
.hero-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: center; }
.hero-cta { display: flex; gap: 12px; margin: 24px 0; flex-wrap: wrap; }
.stats { display: flex; gap: 32px; margin: 28px 0 0; padding: 0; }
.stats div dt { font-size: 1.6rem; font-weight: 800; color: var(--accent-soft); }
.stats div dd { margin: 0; color: var(--muted); font-size: 0.9rem; }
.hero-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 20px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
}
.hero-card-head { display: flex; gap: 6px; margin-bottom: 12px; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: var(--line); }
.hero-card-title { font-weight: 700; margin-bottom: 14px; }
.metric { display: flex; justify-content: space-between; font-size: 0.92rem; margin: 10px 0 4px; }
.metric strong { color: var(--accent-soft); }
.bar { height: 8px; background: var(--surface-2); border-radius: 99px; overflow: hidden; margin-bottom: 8px; }
.bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-soft)); border-radius: 99px; }

/* Sections & cards */
.section { padding: 64px 0; }
.section-alt { background: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 28px; }
.card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 24px; transition: border-color 0.15s, transform 0.15s;
}
.section-alt .card { background: var(--bg); }
.card:hover { border-color: var(--accent); transform: translateY(-2px); }
.card h3 { margin-bottom: 8px; }
.card p { color: var(--muted); }

/* Pricing */
.price { display: flex; flex-direction: column; }
.price-tag { font-size: 2rem; font-weight: 800; color: var(--text); }
.price-tag span { font-size: 1rem; color: var(--muted); font-weight: 500; }
.price ul { list-style: none; padding: 0; margin: 0 0 20px; color: var(--muted); }
.price ul li { padding: 6px 0; border-bottom: 1px dashed var(--line); }
.price ul li:last-child { border-bottom: none; }
.price .btn { margin-top: auto; text-align: center; }
.featured { border-color: var(--accent); box-shadow: 0 10px 30px rgba(124, 92, 255, 0.25); position: relative; }
.badge {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  background: var(--accent); color: #fff; font-size: 0.72rem; font-weight: 700;
  padding: 3px 12px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.08em;
}

/* Quotes */
.quote p { font-style: italic; color: var(--text); }
.quote footer { color: var(--muted); font-size: 0.9rem; margin-top: 12px; }

/* Contact */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
.contact-list { list-style: none; padding: 0; margin-top: 20px; color: var(--muted); }
.contact-list li { padding: 6px 0; }
.form label { display: block; font-weight: 600; margin-bottom: 14px; font-size: 0.92rem; }
.form input, .form textarea {
  width: 100%; margin-top: 6px; padding: 12px; border-radius: 10px;
  border: 1px solid var(--line); background: var(--bg); color: var(--text); font: inherit;
}
.form input:focus, .form textarea:focus { outline: 2px solid var(--accent); border-color: var(--accent); }
.form-note { margin-top: 12px; font-size: 0.92rem; min-height: 1.4em; }
.form-note.ok { color: #4ade80; }
.form-note.err { color: #f87171; }

/* Footer */
.footer { border-top: 1px solid var(--line); padding: 24px 0; }
.footer-inner { display: flex; justify-content: space-between; color: var(--muted); font-size: 0.9rem; }

@media (max-width: 860px) {
  .hero-grid, .contact-grid { grid-template-columns: 1fr; }
  .grid-3 { grid-template-columns: 1fr; }
  .nav-links {
    display: none; position: absolute; top: 64px; left: 0; right: 0;
    background: var(--surface); flex-direction: column; padding: 16px 20px;
    border-bottom: 1px solid var(--line); gap: 12px;
  }
  .nav-links.open { display: flex; }
  .hamburger { display: block; }
  .nav-inner { position: relative; }
  .stats { flex-wrap: wrap; gap: 20px; }
}
`;

const appJs = `(function () {
  "use strict";

  // Safe storage: sandboxed iframes may block localStorage — never crash.
  var store = {
    get: function (k) {
      try { return window.localStorage.getItem(k); } catch (e) { return null; }
    },
    set: function (k, v) {
      try { window.localStorage.setItem(k, v); } catch (e) { /* ignore */ }
    }
  };

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  var burger = document.getElementById("hamburger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  // Theme toggle (dark-first; light is the alternative)
  var themeBtn = document.getElementById("themeBtn");
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    store.set("agency-theme", t);
  }
  var saved = store.get("agency-theme");
  if (saved === "light" || saved === "dark") applyTheme(saved);
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "light" ? "dark" : "light");
    });
  }

  // Contact form: validate + honest local confirmation (no backend in demo)
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var msg = form.message.value.trim();
      var emailOk = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
      if (!name || !emailOk || !msg) {
        note.textContent = "Please complete your name, a valid email and a message.";
        note.className = "form-note err";
        return;
      }
      note.textContent = "Thanks, " + name + "! Your message was recorded locally (demo) — we reply within one business day.";
      note.className = "form-note ok";
      form.reset();
    });
  }
})();
`;

export const marketingAgency: Template = {
  id: 'marketing-agency',
  name: 'Marketing Agency',
  blurb: 'Agency site with services, pricing, testimonials and contact form.',
  keywords: ['agency', 'marketing', 'business', 'startup', 'company', 'brand', 'digital'],
  files: [
    { path: 'index.html', content: indexHtml },
    { path: 'styles.css', content: stylesCss },
    { path: 'app.js', content: appJs },
  ],
};
