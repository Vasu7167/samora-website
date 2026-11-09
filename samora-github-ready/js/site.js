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
        ctx.fillStyle = 'rgba(' + Math.round(130 + 112 * b) + ',' + Math.round(84 + 112 * b) + ',' + Math.round(48 + 52 * b) + ',' + (0.34 + 0.6 * b) + ')';
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
