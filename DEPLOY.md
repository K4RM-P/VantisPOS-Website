# Deploying Vantis marketing site to Vercel

This is a fully static Astro site (`output: "static"`, no server routes), so
no adapter is required — Vercel's built-in Astro framework preset builds
`dist/` and serves it directly.

## First-time setup (Vercel dashboard)

1. Push this repo to GitHub (already wired: `origin` → `https://github.com/K4RM-P/VantisPOS-Website.git`).
   ```bash
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import the `VantisPOS-Website` repository.
3. Framework preset: **Astro** (auto-detected via `vercel.json` / `astro.config.mjs`).
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install` (default)
4. Click **Deploy**. Vercel gives you a `*.vercel.app` URL immediately after the first build finishes.

## Every subsequent deploy

Push to `main` — Vercel rebuilds and redeploys automatically on every push
(and creates a preview deployment for every other branch/PR).

## Environment / secrets

None required. Node version is pinned via `"engines"` in `package.json`
(`>=22.12.0`) and `.node-version`; Vercel reads these automatically. The
contact form posts directly to Formspree from the browser (`YOUR_FORM_ID` in
`src/components/sections/Contact.astro` — swap this for your real Formspree
form ID before going live, then create the form at https://formspree.io).

## Attaching a custom domain later

1. In the Vercel project, go to **Settings → Domains**.
2. Enter the domain (e.g. `vantispos.com`) and add it.
3. If the domain's DNS is already on Vercel, it's configured automatically.
   Otherwise, add the A/CNAME records Vercel shows you at your current DNS host.
4. Wait for DNS propagation (usually minutes, up to 24h) — Vercel provisions
   a free TLS certificate automatically once the records resolve.

## Before going live — placeholders to swap

- `src/components/sections/Contact.astro` — real Formspree form ID
- `src/components/sections/Pricing.astro` — real subscription / per-register / setup fee figures (marked with `<!-- PLACEHOLDER PRICE -->` comments)
- `hello@vantispos.com` in `Contact.astro` — real contact email if different
