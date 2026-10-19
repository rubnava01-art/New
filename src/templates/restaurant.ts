import type { Template } from './index';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{NAME}} — Restaurant</title>
  <meta name="description" content="{{NAME}}: seasonal menu, hours and table reservations." />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="nav">
    <div class="container nav-inner">
      <a class="logo" href="#top">{{NAME}}</a>
      <nav class="nav-links" id="navLinks">
        <a href="#menu">Menu</a>
        <a href="#about">About</a>
        <a href="#visit">Visit</a>
        <a href="#reserve">Reserve</a>
      </nav>
      <a class="btn btn-primary btn-sm nav-cta" href="#reserve">Book a table</a>
      <button class="hamburger" id="hamburger" aria-label="Open menu">☰</button>
    </div>
  </header>

  <main id="top">
    <section class="hero">
      <div class="container hero-inner">
        <p class="eyebrow">Est. 2016 — seasonal kitchen</p>
        <h1>Fire, seasonality,<br />and a very good <span class="accent-text">glass of wine</span>.</h1>
        <p class="lede">{{NAME}} is a neighborhood restaurant cooking with the market: a short menu that changes with the seasons, natural wines and a dining room that feels like home.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#reserve">Reserve a table</a>
          <a class="btn btn-ghost" href="#menu">See the menu</a>
        </div>
      </div>
    </section>

    <section class="section" id="menu">
      <div class="container">
        <p class="eyebrow">The menu</p>
        <h2>Short, seasonal, honest.</h2>
        <div class="tabs" id="menuTabs" role="tablist">
          <button class="tab active" data-tab="starters" role="tab">Starters</button>
          <button class="tab" data-tab="mains" role="tab">Mains</button>
          <button class="tab" data-tab="desserts" role="tab">Desserts</button>
          <button class="tab" data-tab="drinks" role="tab">Drinks</button>
        </div>
        <div class="menu-panels">
          <div class="menu-panel active" data-panel="starters">
            <div class="dish"><div><h3>Charred sourdough &amp; whipped ricotta</h3><p>Hot honey, thyme, sea salt.</p></div><span>$9</span></div>
            <div class="dish"><div><h3>Burrata &amp; stone fruit</h3><p>Basil oil, aged balsamic, grilled bread.</p></div><span>$14</span></div>
            <div class="dish"><div><h3>Crispy calamari</h3><p>Lemon aioli, pickled fresno.</p></div><span>$13</span></div>
          </div>
          <div class="menu-panel" data-panel="mains">
            <div class="dish"><div><h3>Wood-fired half chicken</h3><p>Harissa butter, charred lemon, herbs.</p></div><span>$24</span></div>
            <div class="dish"><div><h3>Wild mushroom risotto</h3><p>Parmesan, truffle oil, chives.</p></div><span>$22</span></div>
            <div class="dish"><div><h3>Dry-aged ribeye</h3><p>Bone marrow butter, watercress.</p></div><span>$42</span></div>
            <div class="dish"><div><h3>Catch of the day</h3><p>Ask your server — market price.</p></div><span>$MP</span></div>
          </div>
          <div class="menu-panel" data-panel="desserts">
            <div class="dish"><div><h3>Olive oil cake</h3><p>Citrus, mascarpone.</p></div><span>$10</span></div>
            <div class="dish"><div><h3>Dark chocolate budino</h3><p>Sea salt, olive oil, cream.</p></div><span>$11</span></div>
          </div>
          <div class="menu-panel" data-panel="drinks">
            <div class="dish"><div><h3>Natural wine list</h3><p>40+ low-intervention bottles, rotating by the glass.</p></div><span>$12+</span></div>
            <div class="dish"><div><h3>House cocktails</h3><p>Smoked old fashioned, fig spritz, garden gimlet.</p></div><span>$14</span></div>
            <div class="dish"><div><h3>Local draft beers</h3><p>Three rotating taps from neighborhood breweries.</p></div><span>$7</span></div>
          </div>
        </div>
        <p class="muted small">Menus change with the market — dishes marked seasonally may vary.</p>
      </div>
    </section>

    <section class="section section-alt" id="about">
      <div class="container about-grid">
        <div>
          <p class="eyebrow">Our story</p>
          <h2>A neighborhood place, built slowly.</h2>
          <p class="muted">We opened {{NAME}} in 2016 with a wood oven, six tables and a stubborn belief: cook what the market gives you, treat people like regulars, and the rest follows. Eight years later the oven is bigger but the belief hasn't changed.</p>
        </div>
        <div class="card">
          <h3>Good to know</h3>
          <ul class="tick-list">
            <li>Vegetarian &amp; vegan options always</li>
            <li>Kids welcome until 8pm</li>
            <li>Private dining for up to 14</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section" id="visit">
      <div class="container">
        <p class="eyebrow">Visit us</p>
        <h2>Find your table.</h2>
        <div class="grid-3">
          <article class="card"><h3>Hours</h3><p>Tue–Thu · 5:30pm–10pm<br />Fri–Sat · 5:30pm–11pm<br />Sun · 4pm–9pm<br />Mon · closed</p></article>
          <article class="card"><h3>Find us</h3><p>214 Market Street<br />Ontario, CA 91762<br />(555) 010-7788</p></article>
          <article class="card"><h3>Private events</h3><p>The back room seats 14. Write to events@example.com for buyouts and celebrations.</p></article>
        </div>
      </div>
    </section>

    <section class="section section-alt" id="reserve">
      <div class="container reserve-grid">
        <div>
          <p class="eyebrow">Reservations</p>
          <h2>Book your evening.</h2>
          <p class="muted">Tables are held for 15 minutes past reservation time. Parties of 7+ please call us directly.</p>
        </div>
        <form class="card form" id="reserveForm" novalidate>
          <div class="form-row">
            <label>Name<input type="text" name="name" required placeholder="Jane Doe" /></label>
            <label>Phone<input type="tel" name="phone" required placeholder="(555) 123-4567" /></label>
          </div>
          <div class="form-row">
            <label>Date<input type="date" name="date" required /></label>
            <label>Time
              <select name="time" required>
                <option value="">Select…</option>
                <option>5:30 PM</option><option>6:00 PM</option><option>6:30 PM</option>
                <option>7:00 PM</option><option>7:30 PM</option><option>8:00 PM</option>
                <option>8:30 PM</option><option>9:00 PM</option>
              </select>
            </label>
            <label>Guests
              <select name="guests" required>
                <option value="">Select…</option>
                <option>1</option><option>2</option><option>3</option>
                <option>4</option><option>5</option><option>6</option>
              </select>
            </label>
          </div>
          <button class="btn btn-primary" type="submit">Request reservation</button>
          <p class="form-note" id="formNote" role="status"></p>
        </form>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <span>© <span id="year"></span> {{NAME}}</span>
      <span class="muted">Tue–Sun · 214 Market St</span>
    </div>
  </footer>

  <script src="app.js"></script>
</body>
</html>
`;

const stylesCss = `:root {
  --bg: #12100e;
  --surface: #1a1714;
  --text: #f7f3ec;
  --muted: #b8ac9c;
  --line: #2c2721;
  --accent: #e07840;
  --accent-soft: #f0a06a;
  --radius: 14px;
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0; background: var(--bg); color: var(--text);
  font-family: Georgia, "Times New Roman", ui-serif, serif;
  line-height: 1.65;
}
.container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
h1, h2, h3 { line-height: 1.25; margin: 0 0 10px; font-weight: 700; }
h1 { font-size: clamp(2.2rem, 5vw, 3.6rem); letter-spacing: -0.01em; }
h2 { font-size: clamp(1.5rem, 3vw, 2.1rem); }
p { margin: 0 0 12px; }
.muted { color: var(--muted); }
.small { font-size: 0.85rem; margin-top: 16px; }
.eyebrow { text-transform: uppercase; letter-spacing: 0.16em; font-size: 0.72rem; color: var(--accent-soft); font-weight: 700; margin-bottom: 8px; font-family: ui-sans-serif, system-ui, sans-serif; }
.accent-text { color: var(--accent-soft); font-style: italic; }
.lede { font-size: 1.12rem; color: var(--muted); max-width: 36rem; }

.nav { position: sticky; top: 0; z-index: 50; background: rgba(18,16,14,0.92); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.nav-inner { display: flex; align-items: center; gap: 20px; height: 66px; }
.logo { font-size: 1.3rem; font-weight: 700; color: var(--text); text-decoration: none; letter-spacing: 0.02em; }
.nav-links { display: flex; gap: 22px; margin-left: auto; }
.nav-links a { color: var(--muted); text-decoration: none; font-family: ui-sans-serif, system-ui, sans-serif; font-weight: 500; }
.nav-links a:hover { color: var(--text); }
.nav-cta { margin-left: 4px; }
.hamburger { display: none; margin-left: auto; background: none; border: 1px solid var(--line); color: var(--text); border-radius: 10px; width: 38px; height: 38px; cursor: pointer; }

.btn { display: inline-block; padding: 13px 24px; border-radius: 999px; font-weight: 700; text-decoration: none; cursor: pointer; border: 1px solid transparent; font-family: ui-sans-serif, system-ui, sans-serif; transition: transform 0.12s, background 0.12s; }
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: var(--accent); color: #1d1208; }
.btn-primary:hover { background: var(--accent-soft); }
.btn-ghost { border-color: var(--line); color: var(--text); background: transparent; }
.btn-sm { padding: 9px 16px; font-size: 0.9rem; }

.hero { padding: 90px 0 70px; background: radial-gradient(60% 90% at 50% 0%, rgba(224,120,64,0.14), transparent 70%); }
.hero-inner { text-align: center; max-width: 760px; margin: 0 auto; }
.hero-cta { display: flex; gap: 12px; justify-content: center; margin-top: 28px; flex-wrap: wrap; }

.section { padding: 64px 0; }
.section-alt { background: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }

.tabs { display: flex; gap: 8px; margin: 24px 0; flex-wrap: wrap; }
.tab { background: transparent; border: 1px solid var(--line); color: var(--muted); border-radius: 999px; padding: 9px 20px; cursor: pointer; font-weight: 600; font-family: ui-sans-serif, system-ui, sans-serif; }
.tab.active, .tab:hover { background: var(--accent); border-color: var(--accent); color: #1d1208; }
.menu-panel { display: none; }
.menu-panel.active { display: block; animation: fade 0.25s ease; }
@keyframes fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; } }
.dish { display: flex; justify-content: space-between; gap: 20px; padding: 16px 0; border-bottom: 1px dashed var(--line); }
.dish h3 { font-size: 1.05rem; margin-bottom: 4px; }
.dish p { color: var(--muted); font-size: 0.92rem; margin: 0; }
.dish span { color: var(--accent-soft); font-weight: 700; white-space: nowrap; font-family: ui-sans-serif, system-ui, sans-serif; }

.about-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: start; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 24px; }
.section-alt .card { background: var(--bg); }
.tick-list { list-style: none; padding: 0; margin: 12px 0 0; color: var(--muted); }
.tick-list li { padding: 8px 0 8px 28px; position: relative; }
.tick-list li::before { content: "✓"; position: absolute; left: 0; color: var(--accent-soft); font-weight: 700; }

.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 28px; }
.card h3 { margin-bottom: 8px; }
.card p { color: var(--muted); }

.reserve-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 40px; align-items: start; }
.form label { display: block; font-weight: 600; margin-bottom: 14px; font-size: 0.92rem; font-family: ui-sans-serif, system-ui, sans-serif; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-row:last-of-type { grid-template-columns: 1fr 1fr 1fr; }
.form input, .form select { width: 100%; margin-top: 6px; padding: 12px; border-radius: 10px; border: 1px solid var(--line); background: var(--bg); color: var(--text); font: inherit; color-scheme: dark; }
.form input:focus, .form select:focus { outline: 2px solid var(--accent); border-color: var(--accent); }
.form-note { margin-top: 12px; font-size: 0.92rem; min-height: 1.4em; font-family: ui-sans-serif, system-ui, sans-serif; }
.form-note.ok { color: #4ade80; }
.form-note.err { color: #f87171; }

.footer { border-top: 1px solid var(--line); padding: 24px 0; }
.footer-inner { display: flex; justify-content: space-between; color: var(--muted); font-size: 0.9rem; font-family: ui-sans-serif, system-ui, sans-serif; }

@media (max-width: 860px) {
  .about-grid, .grid-3, .reserve-grid { grid-template-columns: 1fr; }
  .form-row, .form-row:last-of-type { grid-template-columns: 1fr; }
  .nav-links { display: none; position: absolute; top: 66px; left: 0; right: 0; background: var(--surface); flex-direction: column; padding: 16px 20px; border-bottom: 1px solid var(--line); gap: 12px; }
  .nav-links.open { display: flex; }
  .hamburger { display: block; }
  .nav-cta { display: none; }
  .nav-inner { position: relative; }
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

  // Menu tabs
  var tabs = document.getElementById("menuTabs");
  if (tabs) {
    var tabBtns = Array.prototype.slice.call(tabs.querySelectorAll(".tab"));
    var panels = Array.prototype.slice.call(document.querySelectorAll(".menu-panel"));
    tabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab");
      if (!btn) return;
      tabBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var name = btn.getAttribute("data-tab");
      panels.forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-panel") === name);
      });
    });
  }

  // Reservation form: validate date is not in the past, confirm locally
  var form = document.getElementById("reserveForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    var dateInput = form.date;
    var today = new Date();
    var iso = today.toISOString().slice(0, 10);
    if (dateInput) dateInput.min = iso;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var date = form.date.value;
      var time = form.time.value;
      var guests = form.guests.value;
      if (!name || !phone || !date || !time || !guests) {
        note.textContent = "Please complete every field so we can hold your table.";
        note.className = "form-note err";
        return;
      }
      if (date < iso) {
        note.textContent = "That date is in the past — pick an upcoming evening.";
        note.className = "form-note err";
        return;
      }
      note.textContent = "Thanks, " + name + "! Reservation recorded locally (demo): " + guests + " guests on " + date + " at " + time + ". We hold tables for 15 minutes.";
      note.className = "form-note ok";
      form.reset();
      if (dateInput) dateInput.min = iso;
    });
  }
})();
`;

export const restaurant: Template = {
  id: 'restaurant',
  name: 'Restaurant',
  blurb: 'Restaurant site with tabbed menu, hours and reservation form.',
  keywords: ['restaurant', 'food', 'menu', 'cafe', 'tacos', 'pizza', 'dining', 'eat', 'bakery', 'bar'],
  files: [
    { path: 'index.html', content: indexHtml },
    { path: 'styles.css', content: stylesCss },
    { path: 'app.js', content: appJs },
  ],
};
