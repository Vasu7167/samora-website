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
// Angles chosen to sit in the GAPS between the five spokes, never behind them.
// The spokes are at -90, -18, 54, 126 and 198, so the gaps centre on -54, 18,
// 90, 162 and 234. Two sources per gap at ±16 degrees keeps every chip at least
// 20 degrees clear of a feature card.
//
// The old angles included Gmail at -118 against a spoke at -90, and WhatsApp at
// 188 against a spoke at 198. Those chips rendered UNDERNEATH the cards, showing
// as "G..." and "Wha..." — which is most of the unfinished feeling: it was not
// missing detail, it was detail hidden behind something else.
const OS_SOURCES = [
  // Five spokes sit 72 degrees apart at -90/-18/54/126/198, so the gaps centre
  // on -54/18/90/162/234. Three chips per gap at -20/0/+20 keeps every chip at
  // least 16 degrees clear of a card.
  { t: 'Gmail',        a: -74 }, { t: 'Calendar',   a: -54 }, { t: 'Outlook',    a: -34 },
  { t: 'SmartReach',   a:  -2 }, { t: 'Apollo',     a:  18 }, { t: 'Lusha',      a:  38 },
  { t: 'Read.ai',      a:  70 }, { t: 'Notetakers', a:  90 }, { t: 'Claude',     a: 110 },
  { t: 'Salesforce',   a: 142 }, { t: 'LinkedIn',   a: 162 }, { t: 'Zoho',       a: 182 },
  { t: 'WhatsApp',     a: 214 }, { t: 'Market intel', a: 254 },
];

function buildOrbit() {
  const box = document.getElementById('osViz');
  if (!box) return;
  // THIS IS WHY THE DIAGRAM VANISHED ON PHONES.
  // The mobile CSS sets the container to height:auto so the cards can flow as a
  // grid. At the moment this runs the container is still EMPTY, so its height
  // is 0, and the old guard `if (!w || !h) return` bailed out and built nothing.
  // The layout rule and the build guard were each reasonable and together they
  // silently removed the whole section.
  //
  // Height is only needed to place things on an ellipse, and on mobile the CSS
  // overrides those positions anyway, so a fallback is harmless. Width is the
  // one measurement worth refusing on: without it there is nothing to lay out.
  let w = box.clientWidth, h = box.clientHeight || 400;
  if (!w) return;

  // ── Narrow screens get the SAME diagram, scaled ───────────────────────────
  // Previous attempts rebuilt this as a list or a grid of tiles, which lost the
  // thing the picture exists to say: everything flows into one nucleus. The
  // problem was never the composition, it was trying to fit a 720px arrangement
  // into 390px of real estate.
  //
  // So lay it out at its natural size and scale it down uniformly. Nothing can
  // overlap, because the geometry is identical to the desktop one that already
  // works. The container's height is set to the scaled height so it takes only
  // the room it actually occupies.
  // Keyed on the VIEWPORT, not on the container. box.clientWidth is measured
  // before the hero grid has settled, so on desktop it can briefly report a
  // narrow value: that put the desktop into the scaled branch, which pinned the
  // column to 720px, crushed the headline into one word per line and shrank the
  // diagram. window.innerWidth is stable from the first frame and is the same
  // thing the CSS breakpoints test.
  // 520, not 720. A uniform scale shrinks the TYPE as well as the geometry: at a
  // 720 stage on a 390px phone the scale is 0.54, so a 0.94rem card label lands
  // at 8px on screen. Unreadable, and exactly the "labels are too small" report.
  // A 520 stage scales to 0.75, and the os-viz--scaled class below puts the
  // type back up by the inverse so it renders at its intended size.
  const STAGE_W = 520, STAGE_H = 470;
  const scaled = window.innerWidth < 700;
  if (scaled) {
    const s = w / STAGE_W;
    box.style.width = STAGE_W + 'px';
    box.style.height = STAGE_H + 'px';
    box.style.transformOrigin = 'top left';
    box.style.transform = 'scale(' + s + ')';
    box.style.marginBottom = (STAGE_H * s - STAGE_H) + 'px';   // reclaim the gap
    box.classList.add('os-viz--scaled');
    w = STAGE_W; h = STAGE_H;
  } else {
    // Clear individually. A chained assignment sets them all to the SAME value,
    // which works here but reads as if it might not, and one wrong link in the
    // chain would silently leave a stale inline width behind.
    box.style.width = '';
    box.style.height = '';
    box.style.transform = '';
    box.style.transformOrigin = '';
    box.style.marginBottom = '';
    box.classList.remove('os-viz--scaled');
  }

  // ── Remove what a previous build left behind ──────────────────────────────
  // This function APPENDS, and the resize handler only cleaned up '.os-node'
  // and '.os-line' — two classes the current build does not even create. So
  // every rebuild added another full set of spokes.
  //
  // It was invisible until today: while the spokes were absolutely positioned,
  // the duplicates stacked exactly on top of each other. The moment mobile laid
  // them out as a static grid, every copy took its own row and the page filled
  // with repeating cards.
  //
  // And on iOS the resize event fires constantly, because collapsing the URL
  // bar while scrolling changes the viewport height. So simply scrolling the
  // page kept adding copies. Clearing here rather than in the caller means it
  // cannot be forgotten again.
  box.querySelectorAll('.os-src,.os-spoke,.os-line,.os-flow,.os-hint,.os-node').forEach(n => n.remove());
  const cx = w / 2, cy = h / 2;
  // Chips get smaller rather than fewer when the ellipse is short of room.
  box.classList.toggle('os-viz--tight', w < 640);

  // radii
  // Radii nudged up so the whole arrangement reads larger. The horizontal
  // multipliers move least, because the orbit column is the narrow dimension
  // and pushing chips further out is what risks them clipping the gutter.
  // Most of the gain comes from the taller stage feeding the vertical radii.
  const irx = Math.min(w * 0.355, 245), iry = Math.min(h * 0.325, 195);
  const orx = Math.min(w * 0.492, 350), ory = Math.min(h * 0.468, 288);
  const coreR = 90;

  // ── outer source chips ──
  OS_SOURCES.forEach((n, i) => {
    const rad = (n.a * Math.PI) / 180;
    const x = cx + Math.cos(rad) * orx;
    const y = cy + Math.sin(rad) * ory;
    // The old rule here was `if (small && i % 2) return`, which DROPPED every
    // other chip once the container fell below 560px. On a 1000px window the
    // orbit column is about 450px, so half the sources silently disappeared:
    // Calendar, SmartReach, Lusha, Notetakers, Salesforce, Zoho and Market
    // intel were all gone, which is exactly the set reported missing.
    //
    // Naming the tools a buyer already pays for is the whole point of the ring,
    // so none are dropped. When space is tight they shrink instead, via the
    // os-viz--tight class set below.
    const el = document.createElement('div');
    el.className = 'os-src';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.animationDelay = (0.9 + i * 0.05) + 's';
    el.innerHTML = '<i></i>' + n.t;
    box.appendChild(el);

    // A signal travelling from this source into the nucleus. Previously only
    // the five product cards emitted these, which read as the product talking
    // to itself. The picture is about everything OUTSIDE flowing in, so the
    // sources are where the movement belongs.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const dot = document.createElement('div');
      dot.className = 'os-flow os-flow--src';
      box.appendChild(dot);
      const run = () => {
        const dur = 3200 + Math.random() * 2600;
        const start = performance.now() + Math.random() * 4200;
        (function step(now) {
          if (!dot.isConnected) return;
          const t = (now - start) / dur;
          if (t < 0) { requestAnimationFrame(step); return; }
          if (t >= 1) { run(); return; }
          const e = t * t * (3 - 2 * t);
          dot.style.left = (x + (cx - x) * e * 0.9) + 'px';
          dot.style.top  = (y + (cy - y) * e * 0.9) + 'px';
          dot.style.opacity = String(Math.sin(t * Math.PI) * 0.75);
          requestAnimationFrame(step);
        })(performance.now());
      };
      run();
    }
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
          // Each rebuild used to leave its particle loops running against
          // removed nodes, so the loops accumulated for the life of the page.
          if (!p.isConnected) return;
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
  // A touch device has no hover, so telling a phone user to hover is an
  // instruction they cannot follow. On touch the cards are expanded already,
  // so the honest instruction is "tap".
  hint.textContent = window.matchMedia('(hover:none)').matches
    ? 'TAP A SYSTEM TO EXPLORE'
    : 'HOVER A SYSTEM TO EXPLORE';
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

  // ── Inline validation ────────────────────────────────────────────────────
  // The form carries novalidate, so the browser says nothing. Previously the
  // ONLY feedback was a single line under the button after a round trip to the
  // server — so a typo in an email meant submitting, waiting, and then hunting
  // for which field was wrong. Fields are checked on blur, and the error is
  // shown against the field it belongs to.
  //
  // Only fields marked `required` are checked, so the audit form keeps its
  // existing behaviour until it opts in the same way.
  const fieldErr = (el, msg) => {
    const wrap = el.closest('.fg') || el.parentElement;
    let m = wrap.querySelector('.ferr');
    if (msg) {
      if (!m) { m = document.createElement('span'); m.className = 'ferr'; wrap.appendChild(m); }
      m.textContent = msg;
      el.classList.add('bad');
      el.setAttribute('aria-invalid', 'true');
    } else {
      m?.remove();
      el.classList.remove('bad');
      el.removeAttribute('aria-invalid');
    }
  };
  const checkField = (el) => {
    const v = (el.value || '').trim();
    if (el.hasAttribute('required') && !v) {
      fieldErr(el, el.type === 'email' ? 'We need an email to reply to.' : 'This one is needed.');
      return false;
    }
    if (el.type === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v)) {
      fieldErr(el, 'That address looks incomplete. Check for a typo.');
      return false;
    }
    fieldErr(el, '');
    return true;
  };
  form?.querySelectorAll('input, textarea').forEach(el => {
    if (el.name === 'website') return;                 // honeypot, never touched
    el.addEventListener('blur', () => { if (el.value.trim() || el.hasAttribute('required')) checkField(el); });
    // Clearing the error as soon as they start fixing it, rather than making
    // them blur again to find out whether it is resolved.
    el.addEventListener('input', () => { if (el.classList.contains('bad')) fieldErr(el, ''); });
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();

    // Stop before the network call, and put the cursor in the first problem
    // field so the fix takes one keystroke rather than a hunt.
    const fields = [...form.querySelectorAll('input, textarea')].filter(el => el.name !== 'website');
    const firstBad = fields.filter(el => !checkField(el))[0];
    if (firstBad) { firstBad.focus(); firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

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

    // ── Phone, normalised to E.164 only when we can be SURE ────────────────
    // E.164 (+ country code + subscriber, digits only, max 15) is what every
    // dialer and CRM expects, so it is worth storing that way. But it is only
    // derivable when the visitor actually supplied a country code.
    //
    // We deliberately do NOT infer one from the page, the locale or the IP. A
    // number stored under a guessed dial code looks callable and is not, which
    // is worse than storing exactly what the person typed. Same rule as the
    // rest of this product: never present a guess as a verified fact.
    if (payload.phone) {
      const raw = String(payload.phone).trim();
      const digits = raw.replace(/\D/g, '');
      payload.phone = (raw.charAt(0) === '+' && digits.length >= 8 && digits.length <= 15)
        ? '+' + digits
        : raw;
    }

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
        // ── Replace the form, do not just flash a toast ────────────────────
        // A toast is easy to miss, and a form still sitting there full of your
        // details reads as "did that actually send?" — which is the moment
        // people submit a second time. Swapping in a confirmation answers the
        // question without being asked, and says what happens next.
        const live = document.getElementById('formLive');
        if (live) {
          live.innerHTML =
            '<div class="fdone">' +
              '<div class="fdone-ic"><svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg></div>' +
              '<h4>Message received.</h4>' +
              '<p>Vasu will reply from vasu@samoraglobal.com within one business day. If it has not arrived by then, check your spam folder before assuming we ignored you.</p>' +
            '</div>';
          live.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
let rt, lastOrbitW = window.innerWidth;
window.addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => {
    const box = document.getElementById('osViz');
    if (!box) return;
    // Width is the only thing the layout depends on. On iOS the URL bar
    // collapsing while you scroll fires resize with a new HEIGHT many times a
    // second; rebuilding on those is pure waste and was how the duplicate
    // cards multiplied so fast.
    if (window.innerWidth === lastOrbitW) return;
    lastOrbitW = window.innerWidth;
    buildOrbit();   // clears its own previous output
  }, 250);
});

// ══ DIAGNOSTIC OVERLAY ══════════════════════════════════════════════════════
// Only runs with ?debug=1 in the URL. Nobody else ever sees it.
//
// Four rounds of changes to the mobile hero have each been judged from a
// screenshot, which cannot show whether an animation is running, whether a
// media query matched, or what the browser actually computed. This prints the
// answers onto the page so one screenshot settles it.
(function diag() {
  if (!/[?&]debug=1/.test(location.search)) return;
  const val = (sel, prop) => {
    const el = document.querySelector(sel);
    if (!el) return sel + ' MISSING';
    return prop + '=' + getComputedStyle(el)[prop];
  };
  const box = document.createElement('div');
  box.style.cssText =
    'position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#000;color:#0f0;' +
    'font:11px/1.5 ui-monospace,monospace;padding:10px 12px;white-space:pre-wrap;' +
    'max-height:52vh;overflow:auto;border-top:2px solid #0f0';
  const track = document.querySelector('.strip-track');
  const lines = [
    'viewport      ' + window.innerWidth + ' x ' + window.innerHeight,
    'dpr           ' + window.devicePixelRatio,
    'reduced-motion ' + matchMedia('(prefers-reduced-motion: reduce)').matches,
    'mq <=700px    ' + matchMedia('(max-width:700px)').matches,
    'hover:none    ' + matchMedia('(hover:none)').matches,
    '--- marquee ---',
    val('.strip-track', 'animationName'),
    val('.strip-track', 'animationDuration'),
    val('.strip-track', 'animationPlayState'),
    val('.strip-track', 'width'),
    'children      ' + (track ? track.children.length : 'n/a'),
    '--- nebula ---',
    val('.hero-glow', 'width'),
    val('.hero-glow', 'animationName'),
    val('.hero-glow', 'animationDuration'),
    val('.hero-glow', 'backgroundImage').slice(0, 90),
    val('.hero-glow', 'opacity'),
    val('.hero-glow', 'display'),
    '--- build ---',
    'spokes        ' + document.querySelectorAll('.os-spoke').length + ' (expect 5)',
    'css/js ver    ' + (document.querySelector('link[href*="style.css"]') || {}).getAttribute('href')
  ];
  // Sampled twice, a second apart. If the transform changes between the two,
  // the animation IS running and the problem is that it is too subtle to see.
  const t0 = track ? getComputedStyle(track).transform : 'n/a';
  setTimeout(() => {
    const t1 = track ? getComputedStyle(track).transform : 'n/a';
    lines.push('--- is it moving? ---', 't+0s  ' + t0, 't+1s  ' + t1,
               'MOVING: ' + (t0 !== t1));
    box.textContent = lines.join('\n');
  }, 1000);
  box.textContent = 'sampling...';
  document.body.appendChild(box);
})();

// ══ MOTION FALLBACK: DRIVE IT IF CSS WILL NOT ══════════════════════════════
// The previous version of this was gated on a max-width media query and read
// the track width once, at parse time. Two ways for that to silently do
// nothing: the strip is populated by buildStrip() AFTER this runs, so the width
// was 0 and the marquee branch never engaged; and any mismatch in how the
// breakpoint is evaluated skips it entirely.
//
// This version does not guess. It WATCHES the marquee for a second, and if the
// CSS animation has not moved it, takes over with requestAnimationFrame — the
// one animation mechanism already proven to run on the phone, since the orbit's
// signal particles have used it throughout. Width is re-read every frame until
// it is non-zero, so it cannot start too early.
//
// Because it is detection rather than a breakpoint, it also covers desktop if
// the same thing ever happens there.
(function motionFallback() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const track = document.getElementById('stripTrack');
  const glow1 = document.querySelector('.hero-glow:not(.hero-glow--2)');
  const glow2 = document.querySelector('.hero-glow--2');
  if (!track && !glow1) return;

  const sample = () => (track ? getComputedStyle(track).transform : '');
  const before = sample();

  setTimeout(() => {
    // If the transform changed on its own, CSS is animating it. Leave it alone.
    if (track && sample() !== before) return;

    if (track) track.style.animation = 'none';
    if (glow1) glow1.style.animation = 'none';
    if (glow2) glow2.style.animation = 'none';

    const SPEED = 45;                     // px per second
    let half = 0, x = 0, last = performance.now();
    const vw = () => window.innerWidth / 100;

    (function frame(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (track) {
        // Re-read until the strip has been populated and laid out.
        if (!half) half = track.scrollWidth / 2;
        if (half > 0) {
          x = (x + SPEED * dt) % half;
          track.style.transform = 'translate3d(' + (-x) + 'px,0,0)';
        }
      }

      const t = now / 1000;
      if (glow1) {
        const p = Math.sin(t / 7);
        glow1.style.transform =
          'translate3d(' + (p * -5 * vw()) + 'px,' + (Math.cos(t / 9) * 3.5 * vw()) + 'px,0) ' +
          'scale(' + (1 + p * 0.09) + ')';
      }
      if (glow2) {
        const q = Math.sin(t / 11 + 1.2);
        glow2.style.transform =
          'translate3d(' + (q * 4.5 * vw()) + 'px,' + (Math.cos(t / 8) * -3 * vw()) + 'px,0) ' +
          'scale(' + (1 - q * 0.07) + ')';
      }
      requestAnimationFrame(frame);
    })(performance.now());
  }, 1100);
})();

// ══ HERO FUNNEL (SAMpaigns) ════════════════════════════════════════════════
// Contacts fall in at the wide top; most hit the wall and fade, a few carry a
// real signal and make it through the neck into the tray. The counter and the
// clock run together so the claim in the headline is demonstrated rather than
// asserted: 100 leads, under 100 seconds.
//
// Driven by requestAnimationFrame, not CSS keyframes. Same reasoning as the
// marquee: rAF is the animation path proven to run on this project's iOS
// Safari, and it also lets the counter stay in step with the particles.
(function funnel() {
  const box = document.getElementById('fnl');
  if (!box) return;
  const out = document.getElementById('fnlCount');
  const clock = document.getElementById('fnlTimer');

  // Geometry in the SVG's own coordinate space, converted to percentages so it
  // tracks the box at any size rather than needing a pixel measurement.
  const VW = 320, VH = 430;
  const MOUTH_Y = 34, NECK_Y = 236, TRAY_Y = 322;
  const LEFT = 18, RIGHT = 302, NECK_L = 138, NECK_R = 182;

  const TARGET = 100;                 // leads
  const SPAN   = 94;                  // seconds, so "under 100" is honest
  let done = 0, started = performance.now(), finished = false;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // No motion: state the end result rather than an empty funnel.
    out.textContent = TARGET;
    clock.textContent = SPAN.toFixed(1) + 's';
    return;
  }

  const pct = (x, y) => ({ l: (x / VW) * 100, t: (y / VH) * 100 });

  function spawn() {
    // Roughly one in four carries a signal. The rest are drawn deliberately:
    // a funnel that passes everything is not a filter, and this product's
    // whole argument is the filtering.
    const keep = Math.random() < 0.26;
    const d = document.createElement('div');
    d.className = 'fnl-dot' + (keep ? '' : ' fnl-dot--drop');
    box.appendChild(d);

    const x0 = LEFT + 12 + Math.random() * (RIGHT - LEFT - 24);
    const dur = 1500 + Math.random() * 1100;
    const t0 = performance.now();
    // A rejected contact stops partway down the wall, where the funnel would
    // actually exclude it.
    const stopAt = keep ? 1 : 0.34 + Math.random() * 0.24;

    (function step(now) {
      if (!d.isConnected) return;
      const t = Math.min((now - t0) / dur, 1);
      if (t >= stopAt && !keep) { d.remove(); return; }

      let x, y, o = 1;
      if (t < 0.30) {                                   // falling in
        y = -10 + (MOUTH_Y + 6 + 10) * (t / 0.30);
        x = x0;
        o = Math.min(t / 0.08, 1);
      } else if (t < 0.72) {                            // converging down the wall
        const k = (t - 0.30) / 0.42;
        y = MOUTH_Y + 6 + (NECK_Y - MOUTH_Y - 6) * k;
        const half = (RIGHT - LEFT) / 2, neckHalf = (NECK_R - NECK_L) / 2;
        const centre = VW / 2;
        x = centre + ((x0 - centre) / half) * (half + (neckHalf - half) * k);
      } else {                                          // through the neck
        const k = (t - 0.72) / 0.28;
        y = NECK_Y + (TRAY_Y - NECK_Y) * k;
        x = VW / 2 + (x0 - VW / 2) * 0.06 * (1 - k);
        o = 1 - k * 0.15;
      }

      const p = pct(x, y);
      d.style.left = p.l + '%';
      d.style.top = p.t + '%';
      d.style.opacity = String(o);

      if (t >= 1) {
        d.remove();
        if (keep && done < TARGET) { done++; out.textContent = done; }
        return;
      }
      requestAnimationFrame(step);
    })(t0);
  }

  // Emission rate paced so the tray fills in roughly SPAN seconds.
  let last = performance.now(), acc = 0;
  const perSec = (TARGET / 0.26) / SPAN;
  (function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (!finished) {
      const elapsed = (now - started) / 1000;
      clock.textContent = Math.min(elapsed, SPAN).toFixed(1) + 's';
      if (done >= TARGET) {
        finished = true;
        clock.textContent = SPAN.toFixed(1) + 's';
        // Hold the finished state for a beat, then run it again so a visitor
        // arriving mid-cycle still sees the whole story.
        setTimeout(() => {
          done = 0; out.textContent = '0';
          started = performance.now(); finished = false;
        }, 3200);
      } else {
        acc += dt * perSec;
        while (acc >= 1) { spawn(); acc -= 1; }
      }
    }
    requestAnimationFrame(tick);
  })(last);
})();
