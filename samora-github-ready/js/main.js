/* ── SAMORA v2 ── */
'use strict';

// ══ ORBIT NODES (hero OS diagram) ══
const OS_NODES = [
  { t: 'Gmail',        a: -78  },
  { t: 'Calendar',     a: -30  },
  { t: 'Outlook',      a: 18   },
  { t: 'SAMpaigns',    a: 66   },
  { t: 'Notetakers',   a: 114  },
  { t: 'Enrichment',   a: 162  },
  { t: 'LinkedIn',     a: 210  },
  { t: 'Market intel', a: 258  },
];

function buildOrbit() {
  const box = document.getElementById('osViz');
  if (!box) return;
  const w = box.clientWidth, h = box.clientHeight;
  const cx = w / 2, cy = h / 2;
  const rx = Math.min(w * 0.42, 230), ry = Math.min(h * 0.40, 165);

  OS_NODES.forEach((n, i) => {
    const rad = (n.a * Math.PI) / 180;
    const x = cx + Math.cos(rad) * rx;
    const y = cy + Math.sin(rad) * ry;

    const el = document.createElement('div');
    el.className = 'os-node';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.transform = 'translate(-50%,-50%)';
    el.style.animationDelay = (0.5 + i * 0.09) + 's';
    el.innerHTML = '<b></b>' + n.t;
    box.appendChild(el);

    // connector line to core
    const dx = cx - x, dy = cy - y;
    const len = Math.sqrt(dx * dx + dy * dy) - 66;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    const ln = document.createElement('div');
    ln.className = 'os-line';
    ln.style.left = x + 'px';
    ln.style.top = y + 'px';
    ln.style.width = Math.max(len, 0) + 'px';
    ln.style.transform = 'rotate(' + ang + 'deg)';
    ln.style.opacity = '0';
    ln.style.transition = 'opacity .8s ' + (0.7 + i * 0.09) + 's';
    box.appendChild(ln);
    requestAnimationFrame(() => { ln.style.opacity = '1'; });
  });
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
    // docs, which was never filled in. Every enquiry ever submitted 404'd and
    // was lost.
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
