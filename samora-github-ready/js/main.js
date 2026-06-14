/* ── SAMORA main.js ── */
'use strict';

// ── AGENT SAM RESPONSE LIBRARY ────────────────────────────────────
const SAM = {
  close: {
    keys: ['close','closing','likely','month','convert'],
    reply: () => `<p>Scanning <strong>124 active deals</strong> across all signal sources. Your <span class="win-c">Top 3 to close this month:</span></p>
<div class="insight-rows">
<div class="ir"><div class="irc irc--g"></div><div><strong>NovaMart Ltd</strong><span class="sbadge sb--g">Score 94</span><br/>Champion (VP Ops) opened proposal 4× this week. Budget approved internally — confirmed via LinkedIn post. Call sentiment: VERY POSITIVE. Apollo: competitor contract expires Q2.<br/><em>→ Send final T&Cs by Monday. Close window: 7 days.</em></div></div>
<div class="ir"><div class="irc irc--g"></div><div><strong>Acme Corp</strong><span class="sbadge sb--g">Score 91</span><br/>Discovery call: 3 buying phrases detected in transcript. Email thread active — last reply 6 hrs ago. ZoomInfo confirms: CFO approved new vendor spend this quarter.<br/><em>→ Send competitive one-pager today. Schedule exec call this week.</em></div></div>
<div class="ir"><div class="irc irc--y"></div><div><strong>GreenPack India</strong><span class="sbadge sb--y">Score 85</span><br/>Buying committee expanded — new CFO just joined the email thread. LinkedIn: budget cycle opening this month. Proposal viewed 2× with no objection reply.<br/><em>→ Map CFO contact urgently. Send ROI case study immediately.</em></div></div>
</div>
<p>Combined value in these 3 deals: <strong>₹1.85Cr</strong>. All signals captured automatically — no rep logged a single thing.</p>`
  },
  dying: {
    keys: ['dying','silent','risk','dead','lost','concern','warning','falling','at risk'],
    reply: () => `<p>Analysed <strong>22 cold threads, 9 at-risk deals, 14 unanswered proposals</strong>. Top <span class="risk-c">3 deals dying silently:</span></p>
<div class="insight-rows">
<div class="ir"><div class="irc irc--r"></div><div><strong>TechCo Solutions</strong><span class="sbadge sb--r">Score 21</span><br/>Last email opened 14 days ago. 3 follow-ups sent — zero replies. Call transcript Day 11: <em>'budget freeze'</em> mentioned twice. External: company announced hiring pause last week.<br/><strong>⚠ Earliest warning missed:</strong> Budget freeze on Day 11 call should have paused outreach immediately.</div></div>
<div class="ir"><div class="irc irc--r"></div><div><strong>PeakRetail Co</strong><span class="sbadge sb--r">Score 33</span><br/>Proposal viewed once, 18 days ago — no reply. Champion's LinkedIn went quiet. ZoomInfo: CFO change 3 weeks ago — new CFO unknown to us.<br/><strong>⚠ Earliest warning missed:</strong> CFO change is a deal-killer signal. Should have been flagged 3 weeks ago via external data.</div></div>
<div class="ir"><div class="irc irc--r"></div><div><strong>IndoFMCG Group</strong><span class="sbadge sb--r">Score 44</span><br/>Positive early sentiment, then cold after competitor mention on call 3. Rep marked '70% close' in old CRM. No follow-up on competitor objection ever actioned.<br/><strong>⚠ Earliest warning missed:</strong> Competitor mention on call 3 should have triggered a differentiation response within 24hrs.</div></div>
</div>
<p style="font-size:.82rem;color:#E57373;margin-top:.5rem">None of these signals required a rep to log anything. All were captured automatically. The old CRM never saw them.</p>`
  },
  feedback: {
    keys: ['feedback','product','feature','roadmap','customer','insight','week','signal'],
    reply: () => `<p>Extracted and tagged product feedback from <strong>34 calls and 12 meetings</strong> this week via Read.ai and call transcripts. Top 3 signals:</p>
<div class="insight-rows">
<div class="ir"><div class="irc irc--r"></div><div><strong>WhatsApp Integration Gap</strong> — Mentioned in 8 discovery calls this week across FMCG and CPG. Prospects comparing to a competitor with native WhatsApp CRM sync. Frequency: HIGH. Recommended priority: ship in next sprint.</div></div>
<div class="ir"><div class="irc irc--y"></div><div><strong>Real-time Inventory Signal</strong> — 5 RTM leaders asked about live field force inventory visibility during demos. Not in current product. Competitor mentioned twice. Priority: MEDIUM-HIGH.</div></div>
<div class="ir"><div class="irc irc--g"></div><div><strong>Loyalty Tier Customisation</strong> — 3 enterprise accounts praised existing tier logic but asked for custom reward structures per distributor. Low lift, high retention value. Priority: MEDIUM.</div></div>
</div>
<p>All 3 items tagged and routed to the product team's feedback dashboard. MoMs from 6 discovery calls auto-distributed to relevant stakeholders.</p>`
  },
  reengage: {
    keys: ['cold','re-engage','reengag','nurture','ghost','warm','inactive','silent','respond'],
    reply: () => `<p>Identified <strong>22 cold accounts</strong> across email, LinkedIn and WhatsApp requiring re-engagement. Highest priority with channel-specific next actions:</p>
<div class="insight-rows">
<div class="ir"><div class="irc irc--y"></div><div><strong>BlueStar Foods</strong> — Email cold 8 days after proposal (opened 3× but no reply). LinkedIn last message 12 days ago, no response. WhatsApp: not yet used. Recommended: WhatsApp voice note from rep → 24h gap → email follow-up referencing the voice note. New channel, new response rate.</div></div>
<div class="ir"><div class="irc irc--y"></div><div><strong>Sunrise Beverages</strong> — Cold across all channels 12 days. LinkedIn signal: VP Sales shared an article on distribution efficiency yesterday — buying intent indicator. Recommended: LinkedIn comment on article → DM referencing it → email with ROI calculator. Warm the channel before the commercial ask.</div></div>
<div class="ir"><div class="irc irc--r"></div><div><strong>TechCo Solutions</strong> — Cold 14 days across all channels. Budget freeze confirmed in email thread and call transcript. Recommended: pause all active outreach sequences now. LinkedIn soft touch in 30 days — like a post, no pitch. Email nurture with an industry article in 45 days. No commercial message until budget cycle reopens.</div></div>
</div>
<p>Channel-specific re-engagement drafts — email, LinkedIn and WhatsApp — prepared for all 22 cold accounts, ready to activate on your approval.</p>`
  },
  africa: {
    keys: ['africa','west africa','east africa','ghana','nigeria','kenya','uganda','mena','ksa','uae','international','region','geography','expansion'],
    reply: () => `<p>Analysing <strong>West Africa pipeline</strong> across 11 active accounts. Readiness score: <span class="sbadge sb--y">72 / 100</span></p>
<div class="insight-rows">
<div class="ir"><div class="irc irc--r"></div><div><strong>Blocker 1: Champion depth is shallow.</strong> 8 of 11 accounts have only 1 identified stakeholder. Need 2–3 internal champions to survive budget cycles and leadership changes. Action: LinkedIn Navigator — map RTM leaders and CFO-1 at each account.</div></div>
<div class="ir"><div class="irc irc--r"></div><div><strong>Blocker 2: Proposal velocity is slow.</strong> Avg time from discovery to proposal: 31 days (vs 18 days for India). Root cause from call transcripts: local compliance questions not answered at demo stage. Action: Build a West Africa-specific FAQ and compliance one-pager.</div></div>
<div class="ir"><div class="irc irc--g"></div><div><strong>Opportunity: Nigeria FMCG cluster is heating up.</strong> 3 prospects showed high LinkedIn intent signals in the past 7 days. ZoomInfo: budget cycles opening in Q2. Recommend prioritising Nigeria outreach this fortnight.</div></div>
</div>
<p><strong>MENA pipeline</strong> readiness: <span class="sbadge sb--r">58 / 100</span> — primary blocker is ICP validation. KSA and UAE accounts still in early discovery. Recommend 2 more discovery calls before any proposals.</p>`
  },
  forecast: {
    keys: ['forecast','joint','score','scoring','predict','pipeline','probability','accurate'],
    reply: () => `<p>Running <strong>joint scoring forecast</strong> across 124 active deals — combining internal signals with Apollo, ZoomInfo and LinkedIn external data:</p>
<div class="insight-rows">
<div class="ir"><div class="irc irc--g"></div><div><strong>High Confidence Closes (Score 80+):</strong> NovaMart 94, Acme Corp 91, GreenPack 85. Combined value: <strong>₹1.85Cr</strong>. All three have both internal engagement signals AND positive external buying intent.</div></div>
<div class="ir"><div class="irc irc--y"></div><div><strong>Mid-Stage Pipeline (Score 55–79):</strong> 44 accounts. Average score 68. BlueStar Foods (74), Zephyr (69), Sunrise (66) are top movers. Collectively worth <strong>₹1.6Cr</strong> at current conversion rate.</div></div>
<div class="ir"><div class="irc irc--r"></div><div><strong>At-Risk / Re-qualify (Score below 40):</strong> 9 accounts. Recommend pausing commercial pressure on all 9. Re-engage in 30–45 days with nurture content only.</div></div>
</div>
<p>Forecast accuracy improved <strong>34 percentage points</strong> since deploying honest signal capture. Previous forecast: rep-entered CRM data. Current forecast: captured reality, refreshed continuously.</p>`
  },
  samoratrack: {
    keys: ['samoratrack','track','blocker','blocking','priorities','priority','daily','issues','wins','reps','rep logged','logging'],
    reply: () => `<p>Reading <strong>SamoraTrack data</strong> across 8 reps — priorities set, blockers logged, wins recorded — cross-referenced against actual omnichannel activity. Here is what the signal marriage is showing:</p>
<div class="insight-rows">
<div class="ir"><div class="irc irc--r"></div><div><strong>Systemic Blocker: Data Residency Clause</strong> — flagged by <strong>3 reps independently</strong> in SamoraTrack AND appearing in email objections and call transcripts this week. This is not a one-off. It is a product or legal gap. Routing to product team as P1 now.</div></div>
<div class="ir"><div class="irc irc--r"></div><div><strong>Task vs Reality Gap — Rep B:</strong> Logged "Follow up Ferrero — Laxmiprasad" as a priority. SAM checked email, LinkedIn, WhatsApp. Last email to ferrero.com: 26 days ago. No LinkedIn message. No WhatsApp thread. This task was never actioned. Flagging to manager now.</div></div>
<div class="ir"><div class="irc irc--y"></div><div><strong>Systemic Blocker: Local Payment Terms</strong> — 2 reps flagged Nigeria and Ghana prospects asking for payment structures not currently supported. Also appearing as a block in WhatsApp threads. Needs a commercial policy decision before the next West Africa proposal round.</div></div>
</div>
<p><strong>Win patterns from SamoraTrack verified across channels:</strong></p>
<div class="insight-rows">
<div class="ir"><div class="irc irc--g"></div><div>GreenPack close: rep logged a 3-touch sequence in SamoraTrack — LinkedIn connection, email proposal, WhatsApp confirmation — all verified in actual channel activity within 5 days. Same pattern in 2 of last 3 closes. This is now the standard FMCG playbook.</div></div>
<div class="ir"><div class="irc irc--g"></div><div>NovaMart: rep prioritised LinkedIn engagement before the call. Verified: connection accepted, message replied, email thread active. Deal score moved 71 to 94 in 48 hours across all channels.</div></div>
</div>
<p style="font-size:.82rem;color:var(--gl);margin-top:.5rem">The gap between what a rep logs and what they actually did is where pipeline goes to die. SamoraTrack + omnichannel signals close that gap permanently.</p>`
  },
  taskcheck: {
    keys: ['task vs reality','cross check','reality check','actually sent','actually did','verify','verification','logged vs','channel gap','gap between'],
    reply: () => `<p>Running <strong>task vs reality verification</strong> — comparing SamoraTrack daily logs against actual email, LinkedIn, WhatsApp and call activity for all 8 reps:</p>
<div class="insight-rows">
<div class="ir"><div class="irc irc--g"></div><div><strong>Rep A — Fully Verified ✓</strong> Logged "Follow up NovaMart." SAM found: email sent 6h ago (replied ✓), LinkedIn message 2 days ago (accepted + replied ✓), WhatsApp confirmation this morning ✓. 3 channels active. Deal score: 91.</div></div>
<div class="ir"><div class="irc irc--r"></div><div><strong>Rep B — Gap Detected ⚠</strong> Logged "Follow up Ferrero — Laxmiprasad" as top priority. SAM checked all channels: last email to ferrero.com was 26 days ago, no LinkedIn message found, no WhatsApp thread. Task was logged but no outreach was sent. Manager flagged.</div></div>
<div class="ir"><div class="irc irc--r"></div><div><strong>Rep C — Partial Gap ⚠</strong> Logged "Send proposal to Marico." Email found ✓ but no proposal attachment detected in thread. LinkedIn follow-up not sent. WhatsApp not used for this account. Recommend confirming proposal was attached and sending a LinkedIn confirmation message.</div></div>
<div class="ir"><div class="irc irc--g"></div><div><strong>Rep D — Verified ✓</strong> Logged "West Africa FAQ to 3 leads." SAM found 3 separate email threads to West Africa domains with FAQ attachment verified ✓. 1 reply received from Ghana contact. LinkedIn connection requests sent to all 3 ✓.</div></div>
</div>
<p><strong>Overall:</strong> 6 of 8 reps show verified omnichannel activity matching their logged tasks. 2 reps have gaps. The old CRM would show all 8 as green. Samora shows you where reality diverges from intent — before the forecast review, not at it.</p>`
  },
  default: {
    reply: (q) => `<p>Analysing across <strong>847 signals</strong> — SamoraTrack intent logs, email threads, LinkedIn activity, WhatsApp conversations, call transcripts and external data — for: <em>"${q}"</em></p>
<div class="insight-rows">
<div class="ir"><div class="irc irc--g"></div><div><strong>Top 3 Opportunities right now:</strong> NovaMart (94 — 3 channels active, WhatsApp confirmation received), Acme Corp (91 — email replied, LinkedIn engaged), GreenPack India (85 — omnichannel 3-touch sequence completed). Combined pipeline value: ₹1.85Cr.</div></div>
<div class="ir"><div class="irc irc--r"></div><div><strong>Top 3 Concerns right now:</strong> TechCo (21 — budget freeze in email + call transcript), PeakRetail (33 — CFO change detected, all channels cold 18 days), IndoFMCG (44 — competitor objection on call, no follow-up sent across any channel).</div></div>
<div class="ir"><div class="irc irc--y"></div><div><strong>This week:</strong> 6 of 8 reps verified against actual channel activity. 2 task gaps flagged to managers. 22 cold accounts across email + LinkedIn + WhatsApp. 3 systemic blockers routed to product. Stage velocity: 18 days avg (was 31).</div></div>
</div>
<p>For deeper insight ask about a specific deal, rep, region or channel. I'm reading every touchpoint — intent and actual activity — in real time.</p>`
  }
};

function getReply(query) {
  const q = query.toLowerCase();
  for (const intent of Object.values(SAM)) {
    if (intent.keys && intent.keys.some(k => q.includes(k))) return intent.reply(query);
  }
  return SAM.default.reply(query);
}

// ── LIVE FEED ─────────────────────────────────────────────────────
const FEED = [
  { icon:'📞', type:'CALL',     color:'#A0752A', text:'NovaMart Ltd — Discovery call completed. Sentiment: VERY POSITIVE. Budget confirmed ₹18L.' },
  { icon:'💬', type:'WHATSAPP', color:'#25D366', text:'NovaMart VP Ops — WhatsApp: "Budget cleared internally." Buying signal HIGH.' },
  { icon:'✉️', type:'EMAIL',    color:'#C9973E', text:'BlueStar Foods — Proposal opened 3× in 2 hrs. No reply yet. Follow-up queued.' },
  { icon:'🔗', type:'LINKEDIN', color:'#5BA4CF', text:'GreenPack CFO accepted connection request. Viewed company page 4× this week.' },
  { icon:'⚠️', type:'ALERT',    color:'#E57373', text:'TechCo Solutions — All channels cold 14 days. Budget freeze confirmed. Paused.' },
  { icon:'🎤', type:'MEETING',  color:'#78716C', text:'Zephyr Group — MoM generated. 3 action items assigned. Product feedback logged.' },
  { icon:'📋', type:'TRACK',    color:'#A78BFA', text:'Rep B — Task gap: "Follow up Ferrero" logged but last email was 26 days ago. Flagged.' },
  { icon:'✅', type:'WIN',      color:'#4ADE80', text:'GreenPack India — Closed ₹8.5L. Winning sequence: LinkedIn → email → WhatsApp.' },
  { icon:'💬', type:'WHATSAPP', color:'#25D366', text:'Sunrise Beverages — WhatsApp reply after 12 days cold. Re-engagement working.' },
  { icon:'🔗', type:'LINKEDIN', color:'#5BA4CF', text:'Acme Corp procurement — LinkedIn DM replied. Moving to email sequence.' },
  { icon:'⚡', type:'PATTERN',  color:'#C9973E', text:'SamoraTrack: data residency clause flagged by 3 reps across email + calls + track. P1 signal.' },
  { icon:'📡', type:'SIGNAL',   color:'#A0752A', text:'West Africa — 3 Nigeria FMCG accounts showing intent signals across LinkedIn + email.' },
  { icon:'📋', type:'TRACK',    color:'#A78BFA', text:'Rep A — 3 priorities verified: email sent ✓, LinkedIn messaged ✓, WhatsApp replied ✓.' },
  { icon:'✅', type:'WIN',      color:'#4ADE80', text:'Acme Corp — Proposal accepted ₹12L. First touch to close: 22 days, 3 channels.' },
];
let feedIdx = 0, feedCount = 0;

function addFeedItem(ev) {
  const el = document.getElementById('feed');
  if (!el) return;
  const mins = Math.floor(Math.random() * 45) + 1;
  const item = document.createElement('div');
  item.className = 'feed-item';
  item.innerHTML = `<div class="fi-bar" style="background:${ev.color}"></div><div class="fi-icon">${ev.icon}</div><div class="fi-meta"><div class="fi-top"><span class="fi-type" style="color:${ev.color}">[${ev.type}]</span><span class="fi-time">${mins}m ago</span></div><div class="fi-text">${ev.text}</div></div>`;
  el.insertBefore(item, el.firstChild);
  feedCount++;
  const fc = document.getElementById('fc');
  if (fc) fc.textContent = feedCount + ' signal' + (feedCount !== 1 ? 's' : '');
  while (el.children.length > 12) el.removeChild(el.lastChild);
}

function startFeed() {
  for (let i = 0; i < 4; i++) setTimeout(() => addFeedItem(FEED[i]), i * 700);
  feedIdx = 4;
  setInterval(() => { addFeedItem(FEED[feedIdx++ % FEED.length]); }, 4500);
}

// ── KPI ANIMATION ─────────────────────────────────────────────────
function animNum(el, target, pre, sfx, dec, dur) {
  let s = null;
  (function step(ts) {
    if (!s) s = ts;
    const p = Math.min((ts - s) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    const v = dec ? (e * target).toFixed(dec) : Math.round(e * target);
    el.textContent = (pre || '') + v + (sfx || '');
    if (p < 1) requestAnimationFrame(step);
  })(performance.now());
}

// ── CHAT ──────────────────────────────────────────────────────────
function appendMsg(html, who) {
  const c = document.getElementById('samMsgs');
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'msg msg--' + who;
  d.innerHTML = `<div class="msg-av">${who === 'sam' ? 'SAM' : 'YOU'}</div><div class="msg-bub">${html}</div>`;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function showTyping() {
  const c = document.getElementById('samMsgs');
  if (!c) return;
  const d = document.createElement('div');
  d.className = 'msg msg--sam'; d.id = 'typing';
  d.innerHTML = '<div class="msg-av">SAM</div><div class="msg-bub"><div class="typing-row"><div class="td"></div><div class="td"></div><div class="td"></div></div></div>';
  c.appendChild(d); c.scrollTop = c.scrollHeight;
}

function hideTyping() { document.getElementById('typing')?.remove(); }

function sendQuery(q) {
  if (!q?.trim()) return;
  const inp = document.getElementById('samIn');
  const btn = document.getElementById('samSend');
  if (inp) inp.value = '';
  if (btn) btn.disabled = true;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
  appendMsg('<p>' + q + '</p>', 'user');
  showTyping();
  setTimeout(() => {
    hideTyping();
    appendMsg(getReply(q), 'sam');
    if (btn) btn.disabled = false;
    if (inp) inp.focus();
  }, 900 + Math.random() * 700);
}

// ── DASHBOARD ─────────────────────────────────────────────────────
let dbDone = false;
function activateDb() {
  if (dbDone) return; dbDone = true;
  document.querySelectorAll('.fi-b').forEach(b => b.classList.add('loaded'));
  document.querySelectorAll('.dsb-f').forEach(b => b.classList.add('loaded'));
  const kpis = [
    { id:'k0', t:124, p:'',  s:'',    d:0 },
    { id:'k1', t:4.2, p:'₹',s:'Cr',  d:1 },
    { id:'k2', t:87,  p:'', s:'%',   d:0 },
    { id:'k3', t:9,   p:'', s:'',    d:0 },
    { id:'k4', t:22,  p:'', s:'',    d:0 },
  ];
  kpis.forEach(k => { const el = document.getElementById(k.id); if (el) animNum(el, k.t, k.p, k.s, k.d, 1400); });
  setTimeout(startFeed, 600);
}

// ── SAMORATRACK PHONE MOCKUP TABS ────────────────────────────────
function switchStab(btn) {
  const tab = btn.dataset.stab;
  document.querySelectorAll('.st-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.st-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById('stpanel-' + tab);
  if (panel) panel.classList.add('active');
}

// ── BOOT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Nav scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

  // Hamburger
  const burger = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  let mOpen = false;
  burger?.addEventListener('click', () => {
    mOpen = !mOpen;
    menu.classList.toggle('open', mOpen);
    const ss = burger.querySelectorAll('span');
    if (mOpen) { ss[0].style.transform = 'translateY(7px) rotate(45deg)'; ss[1].style.opacity = '0'; ss[2].style.transform = 'translateY(-7px) rotate(-45deg)'; }
    else ss.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
  document.querySelectorAll('.ml').forEach(l => l.addEventListener('click', () => { mOpen = false; menu.classList.remove('open'); burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; }); }));

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
    });
  });

  // Reveals
  const ro = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const parent = entry.target.closest('.grid4,.news-grid,.stats-strip,.pillars,.sprint-weeks');
      const delay = parent ? [...parent.querySelectorAll('.reveal')].indexOf(entry.target) * 80 : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      ro.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    if (el.closest('.hero')) {
      const i = [...el.closest('.hero-content').querySelectorAll('.reveal')].indexOf(el);
      setTimeout(() => el.classList.add('visible'), 200 + i * 120);
    } else {
      ro.observe(el);
    }
  });

  // Dashboard observer
  const dbEl = document.querySelector('.db-chrome');
  if (dbEl) {
    const dbo = new IntersectionObserver(e => { if (e[0].isIntersecting) { activateDb(); dbo.disconnect(); } }, { threshold: 0.2 });
    dbo.observe(dbEl);
  }

  // Stat counters
  let statsDone = false;
  const strip = document.querySelector('.stats-strip');
  if (strip) {
    const so = new IntersectionObserver(e => {
      if (e[0].isIntersecting && !statsDone) {
        statsDone = true;
        document.querySelectorAll('.sn[data-target]').forEach(el => {
          animNum(el, parseFloat(el.dataset.target), '', el.dataset.sfx || '', 0, 1600);
        });
        so.disconnect();
      }
    }, { threshold: 0.5 });
    so.observe(strip);
  }

  // Tabs
  document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      const idx = t.dataset.tab;
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.tp').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.querySelector('.tp[data-panel="' + idx + '"]')?.classList.add('active');
    });
  });

  // SAM chips
  document.querySelectorAll('.chip').forEach(c => {
    c.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(x => x.classList.remove('chip--active'));
      c.classList.add('chip--active');
      sendQuery(c.dataset.q);
    });
  });

  // SAM input
  const samBtn = document.getElementById('samSend');
  const samIn = document.getElementById('samIn');
  samBtn?.addEventListener('click', () => { const q = samIn?.value.trim(); if (q) sendQuery(q); });
  samIn?.addEventListener('keydown', e => { if (e.key === 'Enter') { const q = samIn.value.trim(); if (q) sendQuery(q); } });

  // Auto-fire first chip when SAM section comes into view
  const samSec = document.getElementById('agent-sam');
  let samFired = false;
  if (samSec) {
    const sao = new IntersectionObserver(e => {
      if (e[0].isIntersecting && !samFired) {
        samFired = true;
        setTimeout(() => {
          const first = document.querySelector('.chip');
          if (first) { first.classList.add('chip--active'); sendQuery(first.dataset.q); }
        }, 1500);
        sao.disconnect();
      }
    }, { threshold: 0.4 });
    sao.observe(samSec);
  }

  // Form
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const b = form.querySelector('button[type="submit"]');
    b.textContent = 'Sending…'; b.disabled = true;

    fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
    .then(res => {
      if (res.ok) {
        form.reset();
        b.textContent = 'Request a Reality Audit';
        b.disabled = false;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4500);
      } else {
        b.textContent = 'Try again';
        b.disabled = false;
      }
    })
    .catch(() => {
      b.textContent = 'Try again';
      b.disabled = false;
    });
  });

  // Parallax hero
  const heroH = document.querySelector('.hero-h');
  window.addEventListener('scroll', () => {
    if (heroH && window.scrollY < window.innerHeight) heroH.style.transform = `translateY(${window.scrollY * 0.07}px)`;
  }, { passive: true });

  // SamoraTrack phone mockup — set today's date
  const stDate = document.getElementById('stPhoneDate');
  if (stDate) {
    stDate.textContent = new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });
  }

  // Animate progress fill when mockup comes into view
  const stMockup = document.querySelector('.st-mockup');
  if (stMockup) {
    const stObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          const fill = document.getElementById('stProgressFill');
          if (fill) fill.style.width = '50%';
        }, 400);
        stObs.disconnect();
      }
    }, { threshold: 0.3 });
    stObs.observe(stMockup);
  }


  // Gold cursor glow on dark sections
  let glow = null;
  document.querySelectorAll('.sec--dark, .hero').forEach(s => {
    s.addEventListener('mousemove', e => {
      if (!glow) { glow = document.createElement('div'); glow.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;width:260px;height:260px;background:radial-gradient(circle,rgba(160,117,42,.07),transparent 70%);border-radius:50%;transform:translate(-50%,-50%);transition:opacity .3s;'; document.body.appendChild(glow); }
      glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; glow.style.opacity = '1';
    });
    s.addEventListener('mouseleave', () => { if (glow) glow.style.opacity = '0'; });
  });
});
