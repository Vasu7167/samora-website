# samoraglobal.com, November 2026 revamp

This folder is the full website, ready to replace `samora-github-ready`.

## Deploy
1. Copy everything in this folder over your website repo (the one Vercel deploys samoraglobal.com from).
2. Delete these old pages from the repo: daily-command.html, pipeline.html, intelligence.html, samagic.html, audit.html.
   Their URLs now redirect (see vercel.json): /daily-command to /today, /pipeline to /deals,
   /intelligence to /discovery, /samagic to /leaders, /audit to /demo.
3. Commit and push. Vercel redeploys.
4. After it is live: submit the enquiry form once on /demo and check it arrives (GET /api/contact shows the health check).

## What did not change
- /privacy and /terms (Google verification is still running, so their URLs and text are untouched)
- /brand and the brand book
- /api/contact (the forms post the same fields as before; source is now "demo" or "contact")
- The Google data disclosure in the footer, word for word

## New
- Pages: index, discovery, sampaigns, deals, today, leaders, why-samora, about, demo, contact
- css/site.css and js/site.js (brand book system: Archivo, sand and gold, no emoji)
- js/map-data.js (the hero world map), img/vasu-bansal.jpg, img/og-samora.jpg (link preview)
- css/style.css and js/main.js are no longer used by any page and can be deleted later.

## Customer results
The "True on day one" strip on the homepage has a marked slot for customer numbers once customers agree to be quoted.
