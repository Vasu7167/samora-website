/* samoraglobal.com, November 2026. Navigation, reveal, the hero map, and the
   enquiry forms (which post to /api/contact, unchanged). */
(function () {
  document.documentElement.classList.remove('no-js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- navigation ---- */
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.querySelectorAll('.nav-dd > button').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var dd = b.parentElement, open = dd.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.nav-dd.open').forEach(function (d) { d.classList.remove('open'); d.querySelector('button').setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.nav-dd.open').forEach(function (d) { d.classList.remove('open'); });
  });

  /* ---- reveal on scroll ---- */
  var rv = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) { rv.forEach(function (el) { el.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* ---- hero map: markets light up one by one ---- */
  var cv = document.getElementById('worldmap');
  if (cv && window.SAMORA_MAP) {
    if (reduce || !('IntersectionObserver' in window)) drawMap(cv, window.SAMORA_MAP, reduce);
    else { var mo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { mo.disconnect(); drawMap(cv, window.SAMORA_MAP, reduce); } }, { threshold: .25 }); mo.observe(cv); }
  }

  function drawMap(cv, M, still) {
    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, pad = 0, t0 = performance.now(), visible = true;
    var hub = M.cities.filter(function (c) { return c.hub; })[0];
    var order = M.cities.filter(function (c) { return !c.hub; });
    var GAP = 0.5, TRAVEL = 1.0, START = 0.9, END = START + order.length * GAP + TRAVEL + 1;
    var counter = document.querySelector('[data-opening]'), lastName = '';
    function size() {
      var w = cv.parentElement.clientWidth;
      W = w; H = Math.round(w / M.aspect);
      cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function P(c) { return [c.x * W, c.y * H]; }
    function bez(a, b, s) {
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = Math.hypot(b[0] - a[0], b[1] - a[1]);
      var cx = mx, cy = my - d * 0.3, u = 1 - s;
      return [u * u * a[0] + 2 * u * s * cx + s * s * b[0], u * u * a[1] + 2 * u * s * cy + s * s * b[1]];
    }
    function glow(x, y, r, a) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(232,184,75,' + a + ')'); g.addColorStop(0.35, 'rgba(232,184,75,' + a * 0.35 + ')'); g.addColorStop(1, 'rgba(232,184,75,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
    var cl = function (v) { return Math.max(0, Math.min(1, v)); };
    var eo = function (v) { v = cl(v); return 1 - Math.pow(1 - v, 3); };
    function frame(now) {
      var t = still ? 999 : (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      var small = W < 640, dotR = Math.max(1, W / 900), sig = Math.pow(W * 0.045, 2) * 2;
      var lights = order.map(function (c, i) { var l = START + i * GAP; return { p: P(c), c: c, l: l, i: eo((t - l - TRAVEL) / 0.8) }; });
      var hp = P(hub), hi = eo((t - 0.2) / 0.8);
      // dots
      for (var k = 0; k < M.dots.length; k++) {
        var d = M.dots[k], x = d[0] * W, y = d[1] * H, b = 0;
        var dx0 = x - hp[0], dy0 = y - hp[1]; b += hi * Math.exp(-(dx0 * dx0 + dy0 * dy0) / sig);
        for (var j = 0; j < lights.length; j++) { var L = lights[j]; if (L.i <= 0) continue; var dx = x - L.p[0], dy = y - L.p[1]; b += L.i * Math.exp(-(dx * dx + dy * dy) / sig); }
        b = Math.min(1, b);
        ctx.fillStyle = 'rgba(' + Math.round(130 + 112 * b) + ',' + Math.round(84 + 112 * b) + ',' + Math.round(48 + 52 * b) + ',' + (0.36 + 0.6 * b) + ')';
        ctx.beginPath(); ctx.arc(x, y, dotR * (1 + 0.45 * b), 0, 7); ctx.fill();
      }
      // arcs
      lights.forEach(function (L) {
        var s = eo((t - L.l) / TRAVEL); if (s <= 0) return;
        var N = 36, arrived = cl((t - L.l - TRAVEL) / 0.8);
        ctx.lineWidth = Math.max(1, W / 1100); ctx.lineCap = 'round';
        for (var i = 0; i < N; i++) {
          var a0 = bez(hp, L.p, i / N * s), a1 = bez(hp, L.p, (i + 1) / N * s), tail = (i + 1) / N;
          ctx.strokeStyle = 'rgba(242,197,90,' + ((1 - arrived) * Math.pow(tail, 2.2) * 0.9 + 0.12 * tail * arrived) + ')';
          ctx.beginPath(); ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.stroke();
        }
        if (s < 1) { var q = bez(hp, L.p, s); glow(q[0], q[1], W / 60, 0.9); }
      });
      // points and labels
      ctx.font = '600 ' + (small ? 9 : Math.max(10, Math.min(13, W / 95))) + 'px Archivo, system-ui, sans-serif';
      ctx.textBaseline = 'middle';
      if ('letterSpacing' in ctx) ctx.letterSpacing = small ? '1px' : '2px';
      glow(hp[0], hp[1], W / 30, 0.6 * hi);
      lights.concat([{ p: hp, c: hub, i: hi }]).forEach(function (L) {
        if (L.i <= 0) return;
        var x = L.p[0], y = L.p[1];
        glow(x, y, W / 55, 0.55 * L.i);
        ctx.fillStyle = 'rgba(255,240,205,' + L.i + ')'; ctx.beginPath(); ctx.arc(x, y, Math.max(2, W / 450), 0, 7); ctx.fill();
        if (L.c.hub || small && ['London', 'New York', 'Lagos', 'Bangkok', 'São Paulo', 'Riyadh', 'Dar es Salaam', 'Sydney'].indexOf(L.c.n) < 0) return;
        ctx.fillStyle = 'rgba(243,227,195,' + 0.92 * L.i + ')';
        var txt = L.c.n.toUpperCase(), off = Math.max(8, W / 110);
        if (L.c.s === 'l') { ctx.textAlign = 'right'; ctx.fillText(txt, x - off, y); }
        else if (L.c.s === 'b') { ctx.textAlign = 'center'; ctx.fillText(txt, x, y + off * 1.6); }
        else { ctx.textAlign = 'left'; ctx.fillText(txt, x + off, y); }
      });
      // ripples from the hub once the world is lit: expansion, continuing
      if (!still && t > 2) {
        for (var q = 0; q < 3; q++) {
          var ph = ((t - 2) / 3 + q / 3) % 1, rr = W * 0.02 + ph * W * 0.22;
          ctx.strokeStyle = 'rgba(232,184,75,' + (0.35 * (1 - ph)) + ')'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.ellipse(hp[0], hp[1], rr, rr * 0.62, 0, 0, 7); ctx.stroke();
        }
      }
      if (counter) {
        var name = '';
        if (t < END) { lights.forEach(function (L) { if (L.i > 0.05) name = L.c.n; }); }
        else {
          var k = Math.floor((t - END) / 2.4) % order.length, c = P(order[k]), ph = ((t - END) / 2.4) % 1;
          name = order[k].n;
          ctx.strokeStyle = 'rgba(232,184,75,' + (0.7 * (1 - ph)) + ')'; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(c[0], c[1], 4 + ph * W / 40, 0, 7); ctx.stroke();
        }
        if (name && name !== lastName) { counter.textContent = name; lastName = name; counter.classList.remove('flip'); void counter.offsetWidth; counter.classList.add('flip'); }
      }
      if (!still && visible) requestAnimationFrame(frame);
    }
    size();
    // expand with ease: start close on the hub, ease out to the whole world
    if (!still) {
      cv.style.transformOrigin = (hub.x * 100) + '% ' + (hub.y * 100) + '%';
      cv.style.transform = 'scale(2.4)';
      setTimeout(function () { cv.style.transition = 'transform 9s cubic-bezier(.22,.61,.36,1)'; cv.style.transform = 'scale(1)'; }, 250);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { var was = visible; visible = e.isIntersecting; if (visible && !was) requestAnimationFrame(frame); }); }).observe(cv);
    } else if (counter) { counter.textContent = 'Tokyo'; }
    var redraw = function () { size(); if (still) frame(performance.now()); };
    window.addEventListener('resize', function () { clearTimeout(cv._rt); cv._rt = setTimeout(redraw, 120); });
    if (document.fonts && document.fonts.load) document.fonts.load('600 12px Archivo').then(function () { requestAnimationFrame(frame); });
    else requestAnimationFrame(frame);
  }

  /* ---- enquiry forms: same contract as before, POST /api/contact ---- */
  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    var fieldErr = function (el, msg) {
      var wrap = el.closest('.fg') || el.parentElement, m = wrap.querySelector('.ferr');
      if (msg) {
        if (!m) { m = document.createElement('span'); m.className = 'ferr'; wrap.appendChild(m); }
        m.textContent = msg; el.classList.add('bad'); el.setAttribute('aria-invalid', 'true');
      } else { if (m) m.remove(); el.classList.remove('bad'); el.removeAttribute('aria-invalid'); }
    };
    var check = function (el) {
      var v = (el.value || '').trim();
      if (el.hasAttribute('required') && !v) { fieldErr(el, el.type === 'email' ? 'We need an email to reply to.' : 'This one is needed.'); return false; }
      if (el.type === 'email' && v && !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v)) { fieldErr(el, 'That address looks incomplete. Check for a typo.'); return false; }
      fieldErr(el, ''); return true;
    };
    var fields = function () { return Array.prototype.filter.call(form.querySelectorAll('input, textarea, select'), function (el) { return el.name !== 'website'; }); };
    fields().forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value.trim() || el.hasAttribute('required')) check(el); });
      el.addEventListener('input', function () { if (el.classList.contains('bad')) fieldErr(el, ''); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = fields().filter(function (el) { return !check(el); })[0];
      if (bad) { bad.focus(); return; }
      var b = form.querySelector('button[type="submit"]'), label = b.textContent;
      b.textContent = 'Sending'; b.disabled = true;
      var err = function (msg) {
        var m = form.querySelector('.form-err');
        if (!m) { m = document.createElement('p'); m.className = 'fnote form-err'; m.style.color = 'var(--risk)'; b.insertAdjacentElement('afterend', m); }
        m.textContent = msg || '';
      };
      err('');
      var payload = {};
      new FormData(form).forEach(function (v, k) { payload[k] = v; });
      payload.source = form.getAttribute('data-enquiry') || 'website';
      if (payload.phone) {
        var raw = String(payload.phone).trim(), digits = raw.replace(/\D/g, '');
        payload.phone = (raw.charAt(0) === '+' && digits.length >= 8 && digits.length <= 15) ? '+' + digits : raw;
      }
      fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) { return { res: res, data: data }; }); })
        .then(function (r) {
          b.disabled = false;
          if (r.res.ok && r.data.ok) {
            var live = form.closest('.form-card');
            live.innerHTML = '<div class="fdone" role="status"><span class="tag tag--v">Received</span><h3>Thank you. A person reads this.</h3>' +
              '<p>Vasu will reply from vasu@samoraglobal.com within one business day, usually with a few times for the call. If nothing arrives, check your spam folder.</p></div>';
            live.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
          } else { b.textContent = 'Try again'; err(r.data.error || 'Something went wrong. Please email vasu@samoraglobal.com.'); }
        })
        .catch(function () { b.disabled = false; b.textContent = 'Try again'; err('Could not reach the server. Please email vasu@samoraglobal.com.'); });
      void label;
    });
  });
})();


/* ---- v2: funnel, orbit particles, gap bars ---- */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  function el(t, a) { var n = document.createElementNS(NS, t); for (var k in a) n.setAttribute(k, a[k]); return n; }

  /* gap bars fill when seen */
  document.querySelectorAll('.leak').forEach(function (L) {
    if (reduce || !('IntersectionObserver' in window)) { L.classList.add('in'); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { L.classList.add('in'); io.disconnect(); } }); }, { threshold: .3 });
    io.observe(L);
  });

  /* funnel: contacts fall through five bands; rejected ones fade where they are filtered.
     The band numbers are an illustrative SAMpaign, labelled as such on the page. */
  document.querySelectorAll('.fnl').forEach(function (box) {
    var stage = box.querySelector('.fnl-stage'), svg = box.querySelector('svg'), money = box.querySelector('[data-money]');
    var VW = 340, VH = 330, CX = 170, TOP = 6, NECK = 300, HW_TOP = 160, HW_NECK = 52;
    var hw = function (y) { return HW_TOP + (HW_NECK - HW_TOP) * ((y - TOP) / (NECK - TOP)); };
    var ST = [['Finds the right people', 2000], ['Keeps the ones worth it', 640], ['Writes to each, in their language', 100], ['Gets replies', 6], ['Books meetings', 5]];
    var BAND = (NECK - TOP) / ST.length;
    ST.forEach(function (st, i) {
      var y0 = TOP + i * BAND, y1 = y0 + BAND, a = hw(y0), b = hw(y1), my = y0 + BAND / 2;
      svg.appendChild(el('path', { d: 'M' + (CX - a) + ' ' + y0 + ' L' + (CX + a) + ' ' + y0 + ' L' + (CX + b) + ' ' + y1 + ' L' + (CX - b) + ' ' + y1 + ' Z',
        fill: 'rgba(232,184,75,' + (0.04 + i * 0.045) + ')', stroke: 'rgba(232,184,75,' + (0.22 + i * 0.1) + ')', 'stroke-width': 1 }));
      var k = el('text', { x: CX, y: my - 6, fill: '#C9C9CF', 'text-anchor': 'middle', 'font-family': 'Archivo, sans-serif', 'font-size': 10.5, 'font-weight': 500 });
      k.textContent = st[0]; svg.appendChild(k);
      var n = el('text', { x: CX, y: my + 14, fill: '#FFFFFF', 'text-anchor': 'middle', 'font-family': 'Archivo, sans-serif', 'font-size': 19, 'font-weight': 600, 'data-n': st[1], 'class': 'fnl-num' });
      n.textContent = '0'; svg.appendChild(n);
    });
    var nums = Array.prototype.slice.call(svg.querySelectorAll('.fnl-num'));
    var fmt = function (v) { return v.toLocaleString('en-US'); };
    if (reduce) { nums.forEach(function (n) { n.textContent = fmt(+n.getAttribute('data-n')); }); money.textContent = '$1.0M'; return; }
    var running = false, startAt = 0, last = 0, acc = 0, CYCLE = 14000, TARGET = 1000000;
    function spawn() {
      var keep = Math.random() < 0.18, exit = keep ? 5 : 1 + Math.floor(Math.random() * 4);
      var d = document.createElement('div'); d.className = 'fnl-dot' + (keep ? '' : ' fnl-dot--out'); stage.appendChild(d);
      var x0 = CX + (Math.random() * 2 - 1) * (HW_TOP - 16), yEnd = keep ? NECK + 20 : TOP + exit * BAND, dur = 2400 + Math.random() * 1400, t0 = performance.now();
      (function step(now) {
        if (!d.isConnected) return;
        var t = Math.min((now - t0) / dur, 1), y = TOP + (yEnd - TOP) * t;
        var x = CX + (x0 - CX) * (hw(Math.max(TOP, Math.min(y, NECK))) / HW_TOP);
        d.style.left = (x / VW * 100) + '%'; d.style.top = (y / VH * 100) + '%';
        d.style.opacity = String(t > .9 ? (1 - t) * 10 * (keep ? 1 : .6) : (keep ? 1 : .5));
        if (t >= 1) { d.remove(); return; }
        requestAnimationFrame(step);
      })(t0);
    }
    function tick(now) {
      var dt = Math.min((now - last) / 1000, .1); last = now;
      var p = Math.min((now - startAt) / CYCLE, 1), e = 1 - Math.pow(1 - p, 2);
      nums.forEach(function (n) { n.textContent = fmt(Math.round(+n.getAttribute('data-n') * e)); });
      money.textContent = p >= 1 ? '$1.0M' : '$' + (Math.round(TARGET * e / 1000) / 1000).toFixed(2) + 'M';
      if (p < 1) { acc += dt * 24; while (acc >= 1) { spawn(); acc -= 1; } }
      else if (now - startAt > CYCLE + 4000) { startAt = now; }
      if (running) requestAnimationFrame(tick);
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !running) { running = true; startAt = last = performance.now(); requestAnimationFrame(tick); }
        else if (!e.isIntersecting) { running = false; }
      });
    }, { threshold: .2 });
    io.observe(box);
  });

  /* orbit: signals travel from each integration into SamoraOS */
  document.querySelectorAll('.orbit svg').forEach(function (svg) {
    if (reduce) return;
    var lines = Array.prototype.slice.call(svg.querySelectorAll('line.feed'));
    var layer = svg.querySelector('#pulses'), live = false;
    function pulse() {
      if (!live || !lines.length) return;
      var L = lines[Math.floor(Math.random() * lines.length)];
      var x1 = +L.getAttribute('x1'), y1 = +L.getAttribute('y1'), x2 = +L.getAttribute('x2'), y2 = +L.getAttribute('y2');
      var c = el('circle', { r: 3.2, fill: '#E8B84B' }); layer.appendChild(c);
      var t0 = performance.now(), dur = 1300 + Math.random() * 700;
      (function step(now) {
        var t = Math.min((now - t0) / dur, 1), e = t * t * (3 - 2 * t);
        c.setAttribute('cx', x1 + (x2 - x1) * e); c.setAttribute('cy', y1 + (y2 - y1) * e);
        c.setAttribute('opacity', t < .1 ? t * 10 : (t > .85 ? (1 - t) / .15 : 1));
        if (t < 1) requestAnimationFrame(step); else c.remove();
      })(t0);
      setTimeout(pulse, 160 + Math.random() * 220);
    }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { var was = live; live = e.isIntersecting; if (live && !was) pulse(); }); }, { threshold: .15 });
    io.observe(svg);
  });
})();

/* ---- v5: the nebula. Scales to fit, and signals travel from each tool into SamoraOS ---- */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-neb]').forEach(function (neb) {
    var stage = neb.querySelector('.neb-stage'), cv = neb.querySelector('.neb-cv'), ctx = cv.getContext('2d');
    function fit() {
      var s = Math.min(1, neb.clientWidth / 1100);
      stage.style.transform = 'scale(' + s + ')';
      neb.style.height = (660 * s) + 'px';
    }
    fit(); window.addEventListener('resize', fit);
    var pills = Array.prototype.map.call(neb.querySelectorAll('.neb-pill'), function (p) { return [parseFloat(p.style.left), parseFloat(p.style.top)]; });
    var dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = 1100 * dpr; cv.height = 660 * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var parts = [], live = false, last = 0;
    function lines() {
      ctx.strokeStyle = 'rgba(200,150,30,.10)'; ctx.lineWidth = 1;
      pills.forEach(function (p) { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(550, 330); ctx.stroke(); });
    }
    function frame(now) {
      ctx.clearRect(0, 0, 1100, 660); lines();
      if (now - last > 140) { last = now; var p = pills[Math.floor(Math.random() * pills.length)]; parts.push({ x: p[0], y: p[1], t0: now, d: 1600 + Math.random() * 900 }); }
      parts = parts.filter(function (q) {
        var t = (now - q.t0) / q.d; if (t >= 1) return false;
        var e = t * t * (3 - 2 * t), x = q.x + (550 - q.x) * e, y = q.y + (330 - q.y) * e;
        var g = ctx.createRadialGradient(x, y, 0, x, y, 9); g.addColorStop(0, 'rgba(232,184,75,' + (0.8 * (1 - t)) + ')'); g.addColorStop(1, 'rgba(232,184,75,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(255,236,190,' + (1 - t * 0.6) + ')'; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 7); ctx.fill();
        return true;
      });
      if (live) requestAnimationFrame(frame);
    }
    if (reduce) { lines(); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { var was = live; live = e.isIntersecting; if (live && !was) requestAnimationFrame(frame); }); }, { threshold: .1 }).observe(neb);
  });
})();

/* ---- v7: tour, language showcase, agent feed ---- */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-tour]').forEach(function (tour) {
    var tabs = Array.prototype.slice.call(tour.querySelectorAll('.tt')), panes = tour.querySelectorAll('.tpane'), cur = 0, timer = null, seen = false;
    function show(n, user) {
      cur = (n + tabs.length) % tabs.length;
      tabs.forEach(function (t, i) { t.setAttribute('aria-selected', i === cur ? 'true' : 'false'); var p = t.querySelector('.tp'); p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; });
      panes.forEach(function (p, i) { p.classList.toggle('on', i === cur); });
      if (user) stop();
    }
    function start() { if (reduce || timer) return; tour.classList.add('auto'); timer = setInterval(function () { if (!tour.classList.contains('paused')) show(cur + 1); }, 8000); }
    function stop() { clearInterval(timer); timer = null; tour.classList.remove('auto'); }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { show(i, true); }); });
    tour.addEventListener('mouseenter', function () { tour.classList.add('paused'); });
    tour.addEventListener('mouseleave', function () { tour.classList.remove('paused'); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !seen) { seen = true; start(); } }); }, { threshold: .3 }).observe(tour);
  });
  document.querySelectorAll('[data-langshow]').forEach(function (ls) {
    var items = ls.querySelectorAll('.ls-item'), dots = ls.querySelectorAll('.ls-dots i'), i = 0;
    function on(n) { items.forEach(function (x, k) { x.classList.toggle('on', k === n); }); dots.forEach(function (x, k) { x.classList.toggle('on', k === n); }); }
    on(0); if (reduce) return;
    setInterval(function () { i = (i + 1) % items.length; on(i); }, 2600);
  });
  document.querySelectorAll('[data-feed]').forEach(function (f) {
    var ul = f.querySelector('ul'); if (reduce) return;
    setInterval(function () { var last = ul.lastElementChild; ul.removeChild(last); last.classList.remove('new'); void last.offsetWidth; last.classList.add('new'); ul.insertBefore(last, ul.firstElementChild); }, 2600);
  });
})();

/* ---- v8: the LinkedIn conversation plays out step by step ---- */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-lif]').forEach(function (f) {
    var steps = f.querySelectorAll('.lis li'), parts = f.querySelectorAll('.lic-body>[data-at]'), n = steps.length, cur = -1, timer = null;
    function go(k) {
      cur = k;
      steps.forEach(function (s, i) { s.classList.toggle('on', i === k); s.classList.toggle('done', i < k); });
      parts.forEach(function (p) { p.classList.toggle('in', +p.getAttribute('data-at') <= k); });
    }
    go(0);
    if (reduce) { go(n - 1); return; }
    var manual = false;
    steps.forEach(function (s, i) { s.style.cursor = 'pointer'; s.addEventListener('click', function () { manual = true; clearTimeout(timer); go(i); }); });
    function tick() {
      if (manual) return;
      if (cur < n - 1) { go(cur + 1); timer = setTimeout(tick, 2600); }
      else { timer = setTimeout(function () { go(0); timer = setTimeout(tick, 2600); }, 7000); }
    }
    function run() { go(0); timer = setTimeout(tick, 2600); }
    var seen = false;
    new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && !seen) { seen = true; run(); } }); }, { threshold: .35 }).observe(f);
  });
})();

/* ---- v10: bento language cycle ---- */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('[data-cycle]').forEach(function (b) {
    var s = b.querySelectorAll('span'), i = 0;
    setInterval(function () { s[i].classList.remove('on'); i = (i + 1) % s.length; s[i].classList.add('on'); }, 2200);
  });
})();

/* ---- v11: site settings. Fill these two in and redeploy. ----
   clarity:  the project ID from clarity.microsoft.com (Settings, Setup), e.g. 'abcd1234ef'
   whatsapp: the number people should message, digits only with country code, e.g. '919812345678' */
var SAMORA_SITE = { clarity: 'zbg325xyli', whatsapp: '917710899399' };

/* sticky dock: Meet SAM and Book a demo, once the hero buttons have scrolled away */
(function () {
  var path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  var legal = /^\/(privacy|terms|brand)/.test(path);
  if (!legal && path !== '/demo') {
    var d = document.createElement('div');
    d.className = 'dock';
    d.innerHTML = '<a class="d-sam" href="' + (path === '/' || path === '/index' ? '#sam' : '/#sam') + '">Meet SAM</a><a class="d-demo" href="/demo">Book a demo</a>';
    document.body.appendChild(d);
    var past = false, end = false;
    function set() { var on = past && !end; d.classList.toggle('on', on); document.body.classList.toggle('dock-on', on); }
    var anchor = document.querySelector('.hero2 .btns, .hero-sub, main > section');
    var last = document.querySelector('.foot') || document.querySelector('section.cta');
    if ('IntersectionObserver' in window && anchor) {
      new IntersectionObserver(function (es) { past = !es[0].isIntersecting && es[0].boundingClientRect.top < 0; set(); }).observe(anchor);
      if (last) new IntersectionObserver(function (es) { end = es[0].isIntersecting; set(); }, { threshold: .05 }).observe(last);
    } else {
      window.addEventListener('scroll', function () { past = window.scrollY > 480; set(); }, { passive: true });
    }
  }

  /* chat on WhatsApp */
  var n = (SAMORA_SITE.whatsapp || '').replace(/\D/g, '');
  if (n && !legal) {
    var a = document.createElement('a');
    a.className = 'wa'; a.target = '_blank'; a.rel = 'noopener';
    a.href = 'https://wa.me/' + n + '?text=' + encodeURIComponent('Hi Samora, I was on your website and would like to know more about SamoraOS.');
    a.setAttribute('aria-label', 'Chat with Samora on WhatsApp');
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-3.52 4.4c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.89 2.4 1.01 2.56c.13.17 1.76 2.67 4.25 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48Z"/></svg><span>Chat on WhatsApp</span>';
    document.body.appendChild(a);
  }

  /* Microsoft Clarity: heatmaps and session replays. Visitors on European time zones are asked first. */
  var id = SAMORA_SITE.clarity;
  if (id && !/^(localhost|127\.)/.test(location.hostname)) {
    (function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, 'clarity', 'script', id);
    var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    var eu = /^(Europe|Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe))/.test(tz);
    var saved = null; try { saved = localStorage.getItem('samora-consent'); } catch (e) {}
    function signal(ok) { window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: ok ? 'granted' : 'denied' }); }
    if (!eu) signal(true);
    else if (saved) signal(saved === 'yes');
    else {
      signal(false);
      var c = document.createElement('div');
      c.className = 'consent'; c.setAttribute('role', 'dialog'); c.setAttribute('aria-label', 'Cookies');
      c.innerHTML = 'We use analytics cookies to see how this site is used and make it better. No advertising.<div><button class="y" type="button">Allow</button><button type="button">No thanks</button></div>';
      document.body.appendChild(c);
      c.addEventListener('click', function (e) {
        if (e.target.tagName !== 'BUTTON') return;
        var ok = e.target.className === 'y';
        try { localStorage.setItem('samora-consent', ok ? 'yes' : 'no'); } catch (x) {}
        signal(ok); c.remove();
      });
    }
  }
})();

/* ---- v13: Samora Growth Compass ---- */
(function () {
  document.querySelectorAll('[data-compass]').forEach(function (g) {
    var cells = g.querySelectorAll('[data-q]'), panels = g.querySelectorAll('[data-p]');
    var order = ['dom', 'exp', 'xs', 'lau'], i = 0, timer = null;
    function set(k) {
      cells.forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-q') === k); c.setAttribute('aria-pressed', c.getAttribute('data-q') === k ? 'true' : 'false'); });
      panels.forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-p') === k); });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    cells.forEach(function (c) {
      c.addEventListener('click', function () { stop(); set(c.getAttribute('data-q')); });
      c.addEventListener('mouseenter', function () { stop(); set(c.getAttribute('data-q')); });
    });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting && !timer && i >= 0) {
        timer = setInterval(function () { i = (i + 1) % order.length; set(order[i]); }, 3600);
      } else if (!es[0].isIntersecting) stop();
    }, { threshold: .4 }).observe(g);
  });
})();
