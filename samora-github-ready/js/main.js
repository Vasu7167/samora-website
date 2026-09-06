/* ── SAMORA v2 ── */
'use strict';

// ══ ORBIT (hero OS diagram) ══
// Inner ring: the five Samora systems. Interactive + clickable.
const OS_SPOKES = [
  { t: 'Daily Command', ic: '☀', a: -90,
    d: 'Brief before the first coffee. Meetings pre-researched. Alerts that name the blocker.',
    href: '/daily-command' },
  { t: 'SAMpaigns', ic: '✉', a: -18,
    d: 'Scout, enrich, draft and schedule outreach anchored to the account.',
    href: '/sampaigns' },
  { t: 'Pipeline', ic: '◈', a: 54,
    d: 'Three-tier verification, coverage tables and a forecast that carries its evidence.',
    href: '/pipeline' },
  { t: 'Intelligence', ic: '◎', a: 126,
    d: 'Detective SAM investigates any account across every channel at once.',
    href: '/intelligence' },
  { t: 'SAMagic', ic: '✦', a: 198,
    d: 'Ask the verified pipeline directly. The exec and board view, unfiltered.',
    href: '/samagic' },
];

// Outer ring: the sources it absorbs.
const OS_SOURCES = [
  { t: 'Gmail', a: -118 }, { t: 'Calendar', a: -72 }, { t: 'Outlook', a: -38 },
  { t: 'SmartReach', a: 8 }, { t: 'Notetakers', a: 40 }, { t: 'Lusha', a: 82 },
  { t: 'Apollo', a: 112 }, { t: 'LinkedIn', a: 152 }, { t: 'WhatsApp', a: 188 },
  { t: 'Market intel', a: 226 },
];

function buildOrbit() {
  const box = document.getElementById('osViz');
  if (!box) return;
  const w = box.clientWidth, h = box.clientHeight;
  if (!w || !h) return;
  const cx = w / 2, cy = h / 2;
  const small = w < 560;

  // radii
  const irx = Math.min(w * 0.335, 215), iry = Math.min(h * 0.315, 165);
  const orx = Math.min(w * 0.475, 320), ory = Math.min(h * 0.455, 250);
  const coreR = 78;

  // ── outer source chips ──
  OS_SOURCES.forEach((n, i) => {
    const rad = (n.a * Math.PI) / 180;
    const x = cx + Math.cos(rad) * orx;
    const y = cy + Math.sin(rad) * ory;
    if (small && i % 2) return; // thin out on small screens
    const el = document.createElement('div');
    el.className = 'os-src';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.animationDelay = (0.9 + i * 0.05) + 's';
    el.innerHTML = '<i></i>' + n.t;
    box.appendChild(el);
  });

  // ── inner feature spokes ──
  OS_SPOKES.forEach((n, i) => {
    const rad = (n.a * Math.PI) / 180;
    const x = cx + Math.cos(rad) * irx;
    const y = cy + Math.sin(rad) * iry;

    const a = document.createElement('a');
    a.className = 'os-spoke';
    a.href = n.href;
    a.style.left = x + 'px';
    a.style.top = y + 'px';
    a.style.animationDelay = (0.35 + i * 0.1) + 's';
    a.innerHTML =
      '<div class="os-spoke-in">' +
        '<div class="os-sp-top"><span class="os-sp-ic">' + n.ic + '</span>' +
        '<span class="os-sp-t">' + n.t + '</span></div>' +
        '<div class="os-sp-d">' + n.d + '</div>' +
        '<div class="os-sp-go">EXPLORE →</div>' +
      '</div>';
    box.appendChild(a);

    // connector line into core
    const dx = cx - x, dy = cy - y;
    const len = Math.sqrt(dx * dx + dy * dy) - coreR;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    const ln = document.createElement('div');
    ln.className = 'os-line';
    ln.style.left = x + 'px';
    ln.style.top = y + 'px';
    ln.style.width = Math.max(len, 0) + 'px';
    ln.style.transform = 'rotate(' + ang + 'deg)';
    ln.style.opacity = '0';
    ln.style.transition = 'opacity .9s ' + (0.6 + i * 0.1) + 's';
    box.appendChild(ln);
    requestAnimationFrame(() => { ln.style.opacity = '1'; });

    // signal particle travelling inward along this spoke
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const p = document.createElement('div');
      p.className = 'os-flow';
      box.appendChild(p);
      const travel = () => {
        const dur = 2600 + Math.random() * 1800;
        const start = performance.now() + Math.random() * 2200;
        (function frame(now) {
          const t = (now - start) / dur;
          if (t < 0) { requestAnimationFrame(frame); return; }
          if (t >= 1) { travel(); return; }
          const e = t * t * (3 - 2 * t);
          p.style.left = (x + (cx - x) * e * 0.86) + 'px';
          p.style.top = (y + (cy - y) * e * 0.86) + 'px';
          p.style.opacity = String(Math.sin(t * Math.PI) * 0.9);
          requestAnimationFrame(frame);
        })(performance.now());
      };
      travel();
    }
  });

  const hint = document.createElement('div');
  hint.className = 'os-hint';
  hint.textContent = 'HOVER A SYSTEM TO EXPLORE';
  box.appendChild(hint);
}

// ══ TOOL STRIP ══
const TOOLS = ['Gmail','Google Calendar','Outlook','Microsoft Graph','SmartReach','Outreach','Apollo','Lusha','Lemlist','Fireflies','Read.ai','Otter','Gong','Zoom','LinkedIn','WhatsApp','Salesforce','HubSpot','Pipedrive','Zoho','Gemini'];

function buildStrip() {
  const track = document.getElementById('stripTrack');
  if (!track) return;
  const html = TOOLS.map(t => '<span class="strip-item">' + t + '</span>').join('');
  track.innerHTML = html + html; // duplicate for seamless loop
}

// ══ COUNT UP ══
function animNum(el, target, sfx, dur) {
  let s = null;
  (function step(ts) {
    if (!s) s = ts;
    const p = Math.min((ts - s) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * target) + (sfx || '');
    if (p < 1) requestAnimationFrame(step);
  })(performance.now());
}

// ══ TABS ══
function initTabs() {
  document.querySelectorAll('[data-tabgroup]').forEach(group => {
    const name = group.dataset.tabgroup;
    group.querySelectorAll('.tab-b').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.tab-b').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        document.querySelectorAll('.tp[data-group="' + name + '"]').forEach(p => p.classList.remove('on'));
        const panel = document.querySelector('.tp[data-group="' + name + '"][data-panel="' + btn.dataset.panel + '"]');
        if (panel) panel.classList.add('on');
      });
    });
  });
}

// ══ BOOT ══
document.addEventListener('DOMContentLoaded', () => {

  // nav scroll state
  const nav = document.getElementById('nav');
  if (nav && !nav.classList.contains('nav--solid')) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // burger
  const burger = document.getElementById('burger');
  const mnav = document.getElementById('mnav');
  let open = false;
  burger?.addEventListener('click', () => {
    open = !open;
    mnav?.classList.toggle('open', open);
    const s = burger.querySelectorAll('span');
    if (open) {
      s[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      s[1].style.opacity = '0';
      s[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      s.forEach(x => { x.style.transform = ''; x.style.opacity = ''; });
    }
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // smooth anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    });
  });

  // reveals
  const ro = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const parent = entry.target.closest('.pgrid,.statband,.roles,.flow,.grid2');
      const delay = parent ? [...parent.querySelectorAll('.reveal')].indexOf(entry.target) * 70 : 0;
      setTimeout(() => entry.target.classList.add('visible'), Math.max(delay, 0));
      ro.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    const hero = el.closest('.hero, .phead');
    if (hero) {
      const i = [...hero.querySelectorAll('.reveal')].indexOf(el);
      setTimeout(() => el.classList.add('visible'), 150 + i * 110);
    } else {
      ro.observe(el);
    }
  });

  // stat counters
  const band = document.querySelector('.statband');
  if (band) {
    let done = false;
    const so = new IntersectionObserver(e => {
      if (e[0].isIntersecting && !done) {
        done = true;
        document.querySelectorAll('.sn[data-target]').forEach(el => {
          animNum(el, parseFloat(el.dataset.target), el.dataset.sfx || '', 1500);
        });
        so.disconnect();
      }
    }, { threshold: 0.4 });
    so.observe(band);
  }

  buildOrbit();
  buildStrip();
  initTabs();

  // leak-funnel bars animate on scroll
  const leak = document.querySelector('.leak-viz');
  if (leak) {
    const lo = new IntersectionObserver(e => {
      if (e[0].isIntersecting) {
        leak.querySelectorAll('.leak-fill').forEach((f, i) => {
          setTimeout(() => f.classList.add('go'), i * 220);
        });
        lo.disconnect();
      }
    }, { threshold: 0.35 });
    lo.observe(leak);
  }

  // contact form
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const b = form.querySelector('button[type="submit"]');
    const label = b.textContent;
    b.textContent = 'Sending…';
    b.disabled = true;
    // Show the real reason rather than a bare "Try again". Someone told their
    // email was rejected can fix it; someone shown "Try again" leaves.
    const err = (msg) => {
      let m = form.querySelector('.form-err');
      if (!m) {
        m = document.createElement('p');
        m.className = 'fnote form-err';
        m.style.color = '#c4453a';
        b.insertAdjacentElement('afterend', m);
      }
      m.textContent = msg || '';
    };
    err('');

    // Posts to our own /api/contact, which STORES the enquiry before it tries
    // to email anyone. This used to post to
    // https://formspree.io/f/YOUR_FORM_ID, the placeholder from Formspree's
    // docs, which was never filled in, so every enquiry ever submitted 404'd
    // and was lost.
    const payload = Object.fromEntries(new FormData(form).entries());
    // Which form this was, so enquiries can be told apart later.
    payload.source = (location.pathname.split('/').pop() || 'index').replace('.html', '') || 'index';

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(async res => {
      const data = await res.json().catch(() => ({}));
      b.disabled = false;
      if (res.ok && data.ok) {
        form.reset();
        b.textContent = label;
        toast?.classList.add('show');
        setTimeout(() => toast?.classList.remove('show'), 4500);
      } else {
        b.textContent = 'Try again';
        err(data.error || 'Something went wrong. Please email vasu@samoraglobal.com.');
      }
    }).catch(() => {
      b.disabled = false;
      b.textContent = 'Try again';
      err('Could not reach the server. Please email vasu@samoraglobal.com.');
    });
  });
});

// rebuild orbit on resize
let rt;
window.addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => {
    const box = document.getElementById('osViz');
    if (!box) return;
    box.querySelectorAll('.os-node,.os-line').forEach(n => n.remove());
    buildOrbit();
  }, 250);
});
