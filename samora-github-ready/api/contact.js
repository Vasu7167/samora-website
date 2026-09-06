// ═══════════════════════════════════════════════════════════════════════════
// POST /api/contact — the website enquiry handler.
//
// WHAT THIS REPLACES
// Both forms posted to https://formspree.io/f/YOUR_FORM_ID, the literal
// placeholder from Formspree's own docs. It was never filled in, so every
// enquiry ever submitted got a 404, the visitor saw the button change to
// "Try again", and nothing was stored or emailed anywhere.
//
// THE ORDERING RULE
// Store first, notify second. Email is a notification channel, not a database.
// A provider outage, a rotated key or an unverified domain should cost you a
// notification, never a lead.
//
//   - a failed DB write DOES fail the request, because the lead is genuinely
//     lost and the visitor should be told to retry
//   - a failed email does NOT, because the lead is already safe. Telling
//     someone their enquiry failed when it is sitting in the database is the
//     wrong lie
//
// ENV VARS, on the Vercel project that serves samoraglobal.com:
//   SUPABASE_URL                 same project as SamoraTrack
//   SUPABASE_SERVICE_ROLE_KEY    server side only, never shipped to a browser
//   RESEND_API_KEY
//   RESEND_FROM                  e.g. SAM <sam@samoraglobal.com>
//   CONTACT_TO                   e.g. vasu@samoraglobal.com
//
// CommonJS on purpose: this project has no package.json, so Vercel's Node
// runtime reads a .js file as CommonJS and `export default` would be a syntax
// error at deploy. module.exports works regardless of package.json or Node
// version.
// ═══════════════════════════════════════════════════════════════════════════

const SUPABASE_URL = process.env.SUPABASE_URL;
const SVC = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.RESEND_FROM || 'SAM <sam@samoraglobal.com>';
const CONTACT_TO = process.env.CONTACT_TO || 'vasu@samoraglobal.com';

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'POST only' });
  }

  // Vercel parses a JSON body for us. Guard anyway.
  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_e) { body = {}; }
  }

  // Honeypot. A public endpoint attracts bots within days. A human never sees
  // this field, so anything in it is automated. Return 200 so the bot believes
  // it worked and does not retry.
  if (clean(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, 120);
  const company = clean(body.company, 160);
  const email = clean(body.email, 200);
  const message = clean(body.message, 4000);
  const teamsize = clean(body.teamsize, 60);     // audit form only
  const challenge = clean(body.challenge, 200);  // audit form only

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Please enter a valid work email so we can reply.' });
  }
  if (!name && !company) {
    return res.status(400).json({ ok: false, error: 'Please tell us your name or your company.' });
  }

  const row = {
    name: name || null,
    company: company || null,
    email,
    message: message || null,
    teamsize: teamsize || null,
    challenge: challenge || null,
    // Which form it came from. Sent by the page rather than inferred from the
    // referer, which is missing or wrong often enough to matter.
    source: clean(body.source, 80) || 'website',
    page: clean(req.headers.referer, 300) || null,
    user_agent: clean(req.headers['user-agent'], 300) || null,
  };

  // ── 1. Store ────────────────────────────────────────────────────────────
  if (!SUPABASE_URL || !SVC) {
    console.error('contact: Supabase env vars missing, cannot store enquiry');
    return res.status(500).json({ ok: false, error: 'Something went wrong on our side. Please email vasu@samoraglobal.com.' });
  }

  let stored = null;
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/website_enquiries', {
      method: 'POST',
      headers: {
        apikey: SVC,
        Authorization: 'Bearer ' + SVC,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
    });
    if (!r.ok) {
      console.error('contact: insert failed', r.status, await r.text());
      return res.status(500).json({ ok: false, error: 'Something went wrong on our side. Please email vasu@samoraglobal.com.' });
    }
    const j = await r.json();
    stored = (Array.isArray(j) ? j[0] : j) || null;
  } catch (e) {
    console.error('contact: insert threw', e && e.message);
    return res.status(500).json({ ok: false, error: 'Something went wrong on our side. Please email vasu@samoraglobal.com.' });
  }

  // ── 2. Notify. Logged on failure, never surfaced. ───────────────────────
  let notified = false;
  if (RESEND_KEY) {
    try {
      const line = (k, v) => v ? '<p><strong>' + k + ':</strong> ' + esc(v) + '</p>' : '';
      const html =
        '<h2>New enquiry from samoraglobal.com</h2>' +
        line('Name', name) + line('Company', company) +
        '<p><strong>Email:</strong> <a href="mailto:' + esc(email) + '">' + esc(email) + '</a></p>' +
        line('Team size', teamsize) + line('Challenge', challenge) +
        (message ? '<p><strong>Message:</strong><br>' + esc(message).replace(/\n/g, '<br>') + '</p>' : '') +
        '<hr><p style="color:#888;font-size:12px">Form: ' + esc(row.source) + ' &middot; Page: ' + esc(row.page || 'unknown') + '</p>';

      const text =
        'New enquiry from samoraglobal.com\n\n' +
        'Name: ' + (name || '(not given)') + '\n' +
        'Company: ' + (company || '(not given)') + '\n' +
        'Email: ' + email + '\n' +
        (teamsize ? 'Team size: ' + teamsize + '\n' : '') +
        (challenge ? 'Challenge: ' + challenge + '\n' : '') +
        (message ? '\nMessage:\n' + message + '\n' : '') +
        '\nForm: ' + row.source;

      const mr = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: MAIL_FROM,
          to: [CONTACT_TO],
          // Hitting reply in your inbox goes straight to the enquirer.
          reply_to: email,
          subject: 'Enquiry: ' + (company || name || email),
          html,
          text,
        }),
      });
      if (!mr.ok) {
        // Reading the response is the whole point. Not doing this is what made
        // the digest report "sent to 6 people" while Resend rejected all six.
        const mb = await mr.json().catch(() => ({}));
        console.error('contact: Resend rejected notification:',
          (mb && (mb.message || (mb.error && mb.error.message))) || ('HTTP ' + mr.status));
      } else {
        notified = true;
      }
    } catch (e) {
      console.error('contact: Resend call threw', e && e.message);
    }
  } else {
    console.error('contact: RESEND_API_KEY not set. Enquiry stored, nobody was told.');
  }

  return res.status(200).json({ ok: true, id: stored && stored.id, notified });
};
