import type { Template } from './index';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{NAME}} — Portfolio</title>
  <meta name="description" content="Portfolio of {{NAME}}: selected work, services and contact." />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="nav">
    <div class="container nav-inner">
      <a class="logo" href="#top">{{NAME}}</a>
      <nav class="nav-links" id="navLinks">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
      </nav>
      <button class="hamburger" id="hamburger" aria-label="Open menu">☰</button>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="container">
        <p class="eyebrow">Portfolio</p>
        <h1>Designing brands people <span class="accent-text">remember</span>.</h1>
        <p class="lede">I'm {{NAME}} — a multidisciplinary designer crafting identities, websites and campaigns for clients across three continents.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#work">See selected work</a>
          <a class="btn btn-ghost" href="#contact">Start a project</a>
        </div>
      </div>
    </section>

    <section class="section" id="work">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">Selected work</p>
            <h2>Projects, not just pixels.</h2>
          </div>
          <div class="filters" id="filters">
            <button class="chip active" data-filter="all">All</button>
            <button class="chip" data-filter="branding">Branding</button>
            <button class="chip" data-filter="web">Web</button>
            <button class="chip" data-filter="campaign">Campaign</button>
          </div>
        </div>
        <div class="work-grid" id="workGrid">
          <button class="work-card w-branding" data-cat="branding" data-title="Nordwind Coffee — Identity" data-desc="Full identity system: logo, packaging and retail guidelines for a specialty roaster.">
            <span class="work-thumb t1"></span>
            <span class="work-meta"><strong>Nordwind Coffee</strong><em>Branding</em></span>
          </button>
          <button class="work-card w-web" data-cat="web" data-title="Atlas Fintech — Website" data-desc="Marketing site and design system for a fintech launch. 40+ components, dark-first.">
            <span class="work-thumb t2"></span>
            <span class="work-meta"><strong>Atlas Fintech</strong><em>Web</em></span>
          </button>
          <button class="work-card w-campaign" data-cat="campaign" data-title="Verde Sneakers — Launch" data-desc="360° launch campaign: OOH, social and retail pop-up. 12M impressions.">
            <span class="work-thumb t3"></span>
            <span class="work-meta"><strong>Verde Sneakers</strong><em>Campaign</em></span>
          </button>
          <button class="work-card w-branding" data-cat="branding" data-title="Casa Miró — Rebrand" data-desc="Heritage restaurant group rebrand across 6 locations and packaging.">
            <span class="work-thumb t4"></span>
            <span class="work-meta"><strong>Casa Miró</strong><em>Branding</em></span>
          </button>
          <button class="work-card w-web" data-cat="web" data-title="Pulse Health — Product" data-desc="Web app UI and marketing pages for a digital health startup.">
            <span class="work-thumb t5"></span>
            <span class="work-meta"><strong>Pulse Health</strong><em>Web</em></span>
          </button>
          <button class="work-card w-campaign" data-cat="campaign" data-title="Orbit Audio — Drop" data-desc="Product drop campaign with interactive teaser site and countdown.">
            <span class="work-thumb t6"></span>
            <span class="work-meta"><strong>Orbit Audio</strong><em>Campaign</em></span>
          </button>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="about">
      <div class="container about-grid">
        <div>
          <p class="eyebrow">About</p>
          <h2>Ten years turning vague briefs into sharp brands.</h2>
          <p class="muted">Previously senior designer at two studios, now independent. I take on four projects per quarter so every client gets senior-level attention from kickoff to launch.</p>
          <ul class="facts">
            <li><strong>60+</strong> projects shipped</li>
            <li><strong>14</strong> design awards</li>
            <li><strong>4</strong> slots per quarter</li>
          </ul>
        </div>
        <div class="card">
          <h3>Currently booking</h3>
          <p class="muted">Q1 projects: brand identities and marketing sites. Typical engagement 4–8 weeks.</p>
          <a class="btn btn-primary" href="#contact">Check availability</a>
        </div>
      </div>
    </section>

    <section class="section" id="services">
      <div class="container">
        <p class="eyebrow">Services</p>
        <h2>What I can do for you.</h2>
        <div class="grid-3">
          <article class="card"><h3>Brand identity</h3><p>Logo systems, guidelines and art direction from strategy to rollout.</p><p class="price-line">from $3,500</p></article>
          <article class="card"><h3>Web design</h3><p>Marketing sites and landing pages designed to convert, built responsive.</p><p class="price-line">from $2,800</p></article>
          <article class="card"><h3>Campaigns</h3><p>Launch concepts and creative systems across digital and print.</p><p class="price-line">from $4,000</p></article>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="contact">
      <div class="container contact-grid">
        <div>
          <p class="eyebrow">Contact</p>
          <h2>Have a project in mind?</h2>
          <p class="muted">Send a few lines about your timeline and budget. I reply personally within 48 hours.</p>
          <p class="contact-mail">hello@example.com</p>
        </div>
        <form class="card form" id="contactForm" novalidate>
          <label>Your name<input type="text" name="name" required placeholder="Jane Doe" /></label>
          <label>Email<input type="email" name="email" required placeholder="jane@company.com" /></label>
          <label>Project details<textarea name="message" rows="4" required placeholder="Timeline, budget range, what success looks like…"></textarea></label>
          <button class="btn btn-primary" type="submit">Send inquiry</button>
          <p class="form-note" id="formNote" role="status"></p>
        </form>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <span>© <span id="year"></span> {{NAME}}</span>
      <span class="muted">Designed &amp; built with care.</span>
    </div>
  </footer>

  <div class="lightbox" id="lightbox" aria-hidden="true">
    <div class="lightbox-card" role="dialog" aria-modal="true">
      <button class="lightbox-close" id="lightboxClose" aria-label="Close">✕</button>
      <h3 id="lightboxTitle"></h3>
      <p class="muted" id="lightboxDesc"></p>
    </div>
  </div>

  <script src="app.js"></script>
</body>
</html>
`;

const stylesCss = `:root {
  --bg: #0f1013;
  --surface: #16171c;
  --text: #f5f6f8;
  --muted: #a7abb6;
  --line: #26282f;
  --accent: #7c5cff;
  --accent-soft: #9a82ff;
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
h1, h2, h3 { line-height: 1.2; margin: 0 0 12px; letter-spacing: -0.01em; }
h1 { font-size: clamp(2.2rem, 5vw, 3.6rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.1rem); }
p { margin: 0 0 12px; }
.muted { color: var(--muted); }
.eyebrow { text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.75rem; color: var(--accent-soft); font-weight: 700; margin-bottom: 8px; }
.accent-text { color: var(--accent-soft); }
.lede { font-size: 1.1rem; color: var(--muted); max-width: 36rem; }

.nav { position: sticky; top: 0; z-index: 50; background: rgba(15,16,19,0.88); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.nav-inner { display: flex; align-items: center; height: 64px; }
.logo { font-weight: 800; font-size: 1.15rem; color: var(--text); text-decoration: none; letter-spacing: -0.01em; }
.nav-links { display: flex; gap: 22px; margin-left: auto; }
.nav-links a { color: var(--muted); text-decoration: none; font-weight: 500; }
.nav-links a:hover { color: var(--text); }
.hamburger { display: none; margin-left: auto; background: none; border: 1px solid var(--line); color: var(--text); border-radius: 10px; width: 38px; height: 38px; cursor: pointer; }

.btn { display: inline-block; padding: 12px 22px; border-radius: 12px; font-weight: 700; text-decoration: none; cursor: pointer; border: 1px solid transparent; transition: transform 0.12s, background 0.12s; }
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: var(--accent); color: #fff; box-shadow: 0 6px 20px rgba(124,92,255,0.35); }
.btn-primary:hover { background: var(--accent-soft); }
.btn-ghost { border-color: var(--line); color: var(--text); background: var(--surface); }

.hero { padding: 84px 0 64px; }
.hero-cta { display: flex; gap: 12px; margin-top: 26px; flex-wrap: wrap; }

.section { padding: 64px 0; }
.section-alt { background: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.section-head { display: flex; justify-content: space-between; align-items: end; gap: 20px; flex-wrap: wrap; }
.filters { display: flex; gap: 8px; }
.chip { background: var(--surface); border: 1px solid var(--line); color: var(--muted); border-radius: 99px; padding: 8px 16px; cursor: pointer; font-weight: 600; }
.chip.active, .chip:hover { background: var(--accent); border-color: var(--accent); color: #fff; }

.work-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 28px; }
.work-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
  overflow: hidden; cursor: pointer; padding: 0; text-align: left; color: var(--text);
  transition: transform 0.15s, border-color 0.15s; font: inherit;
}
.work-card:hover { transform: translateY(-3px); border-color: var(--accent); }
.work-card.hidden { display: none; }
.work-thumb { display: block; height: 170px; }
.t1 { background: linear-gradient(135deg, #3b2d6e, #7c5cff); }
.t2 { background: linear-gradient(135deg, #0f3b4c, #2dd4bf); }
.t3 { background: linear-gradient(135deg, #5c1a2e, #f472b6); }
.t4 { background: linear-gradient(135deg, #4c3a0f, #fbbf24); }
.t5 { background: linear-gradient(135deg, #123a2a, #4ade80); }
.t6 { background: linear-gradient(135deg, #2b1a4c, #a78bfa); }
.work-meta { display: block; padding: 14px 16px; }
.work-meta strong { display: block; }
.work-meta em { color: var(--muted); font-style: normal; font-size: 0.85rem; }

.about-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: start; }
.facts { list-style: none; padding: 0; margin: 24px 0 0; display: flex; gap: 28px; }
.facts strong { display: block; font-size: 1.5rem; color: var(--accent-soft); }
.facts li { color: var(--muted); font-size: 0.9rem; }

.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 24px; }
.section-alt .card { background: var(--bg); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 28px; }
.price-line { color: var(--accent-soft); font-weight: 700; margin: 12px 0 0; }

.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
.contact-mail { font-size: 1.25rem; font-weight: 700; color: var(--accent-soft); margin-top: 16px; }
.form label { display: block; font-weight: 600; margin-bottom: 14px; font-size: 0.92rem; }
.form input, .form textarea { width: 100%; margin-top: 6px; padding: 12px; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: var(--text); font: inherit; }
.form input:focus, .form textarea:focus { outline: 2px solid var(--accent); border-color: var(--accent); }
.form-note { margin-top: 12px; font-size: 0.92rem; min-height: 1.4em; }
.form-note.ok { color: #4ade80; }
.form-note.err { color: #f87171; }

.footer { border-top: 1px solid var(--line); padding: 24px 0; }
.footer-inner { display: flex; justify-content: space-between; color: var(--muted); font-size: 0.9rem; }

.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: none; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
.lightbox.open { display: flex; }
.lightbox-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 28px; max-width: 520px; width: 100%; position: relative; }
.lightbox-close { position: absolute; top: 12px; right: 12px; background: var(--bg); border: 1px solid var(--line); color: var(--text); border-radius: 8px; width: 32px; height: 32px; cursor: pointer; }

@media (max-width: 860px) {
  .work-grid, .grid-3, .about-grid, .contact-grid { grid-template-columns: 1fr; }
  .nav-links { display: none; position: absolute; top: 64px; left: 0; right: 0; background: var(--surface); flex-direction: column; padding: 16px 20px; border-bottom: 1px solid var(--line); gap: 12px; }
  .nav-links.open { display: flex; }
  .hamburger { display: block; }
  .nav-inner { position: relative; }
  .facts { flex-wrap: wrap; gap: 18px; }
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

  // Work filters
  var filters = document.getElementById("filters");
  var cards = Array.prototype.slice.call(document.querySelectorAll(".work-card"));
  if (filters) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      Array.prototype.forEach.call(filters.querySelectorAll(".chip"), function (c) {
        c.classList.remove("active");
      });
      btn.classList.add("active");
      var f = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-cat") === f;
        card.classList.toggle("hidden", !show);
      });
    });
  }

  // Lightbox with project details
  var lightbox = document.getElementById("lightbox");
  var lbTitle = document.getElementById("lightboxTitle");
  var lbDesc = document.getElementById("lightboxDesc");
  var lbClose = document.getElementById("lightboxClose");
  function openLb(title, desc) {
    if (!lightbox) return;
    lbTitle.textContent = title;
    lbDesc.textContent = desc;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeLb() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      openLb(card.getAttribute("data-title") || "", card.getAttribute("data-desc") || "");
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lightbox) lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLb();
  });

  // Contact form (local demo confirmation)
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
        note.textContent = "Please complete your name, a valid email and project details.";
        note.className = "form-note err";
        return;
      }
      note.textContent = "Thanks, " + name + "! Your inquiry was recorded locally (demo) — expect a reply within 48 hours.";
      note.className = "form-note ok";
      form.reset();
    });
  }
})();
`;

export const portfolio: Template = {
  id: 'portfolio',
  name: 'Portfolio',
  blurb: 'Designer portfolio with filterable work grid, lightbox and contact.',
  keywords: ['portfolio', 'photographer', 'designer', 'artist', 'freelancer', 'creative', 'gallery'],
  files: [
    { path: 'index.html', content: indexHtml },
    { path: 'styles.css', content: stylesCss },
    { path: 'app.js', content: appJs },
  ],
};
