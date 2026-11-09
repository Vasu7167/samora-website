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
  if (cv && window.SAMORA_MAP) drawMap(cv, window.SAMORA_MAP, reduce);

  function drawMap(cv, M, still) {
    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, pad = 0, t0 = performance.now(), visible = true;
    var hub = M.cities.filter(function (c) { return c.hub; })[0];
    var order = M.cities.filter(function (c) { return !c.hub; });
    var GAP = 0.85, TRAVEL = 1.1, START = 0.9;
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
        ctx.fillStyle = 'rgba(' + Math.round(78 + 164 * b) + ',' + Math.round(78 + 118 * b) + ',' + Math.round(88 + 12 * b) + ',' + (0.5 + 0.48 * b) + ')';
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
        if (L.c.hub || small && ['London', 'New York', 'Lagos', 'Bangkok', 'São Paulo', 'Riyadh', 'Dar es Salaam'].indexOf(L.c.n) < 0) return;
        ctx.fillStyle = 'rgba(243,227,195,' + 0.92 * L.i + ')';
        var txt = L.c.n.toUpperCase(), off = Math.max(8, W / 110);
        if (L.c.s === 'l') { ctx.textAlign = 'right'; ctx.fillText(txt, x - off, y); }
        else if (L.c.s === 'b') { ctx.textAlign = 'center'; ctx.fillText(txt, x, y + off * 1.6); }
        else { ctx.textAlign = 'left'; ctx.fillText(txt, x + off, y); }
      });
      if (!still && visible && t < START + order.length * GAP + TRAVEL + 1.2) requestAnimationFrame(frame);
    }
    size();
    var redraw = function () { size(); if (still || (performance.now() - t0) / 1000 > START + order.length * GAP + TRAVEL + 1) frame(performance.now()); };
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
      var x0 = CX + (Math.random() * 2 - 1) * (HW_TOP - 16), yEnd = keep ? NECK + 24 : TOP + exit * BAND, dur = 2400 + Math.random() * 1400, t0 = performance.now();
      (function step(now) {
        if (!d.isConnected) return;
        var t = Math.min((now - t0) / dur, 1), y = -10 + (yEnd + 10) * t;
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
