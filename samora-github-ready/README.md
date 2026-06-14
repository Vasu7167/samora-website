# Samora — The Honest CRM

Marketing website for Samora Global Growth Consultants.

**Live site:** https://samora-crm.vercel.app *(update after deploy)*

## Stack
- Pure HTML + CSS + Vanilla JS
- No build step, no dependencies, no npm
- Formspree for contact form submissions

## Running locally

```bash
# Option 1: VS Code Live Server (recommended)
# Install Live Server extension → right-click index.html → Open with Live Server

# Option 2: Python
python3 -m http.server 5500

# Option 3: just open index.html in a browser
```

## Deploying to Vercel

Automatic — every push to `main` branch redeploys the site.

```bash
git add .
git commit -m "your message"
git push
```

## Connecting the contact form

In `js/main.js`, replace `YOUR_FORM_ID` with your Formspree form ID:

```js
fetch('https://formspree.io/f/YOUR_FORM_ID', { ... })
```

## Structure

```
├── index.html          # Full single-page site
├── css/style.css       # All styles
├── js/main.js          # Interactions + Agent SAM + Dashboard
├── vercel.json         # Vercel config (caching, clean URLs)
└── .gitignore
```

Built for Samora Global Growth Consultants · samora.global
