# Deploying Vantis marketing site to Cloudflare Pages

## First-time setup (Cloudflare dashboard)

1. Push this repo to GitHub (already wired: `origin` → `https://github.com/K4RM-P/VantisPOS-Website.git`).
   ```bash
   git push -u origin main
   ```
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the `VantisPOS-Website` repository.
4. Framework preset: **Astro**.
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy. Cloudflare gives you a `*.pages.dev` URL immediately after the first build finishes.

## Every subsequent deploy

Just push to `main` — Cloudflare Pages rebuilds and redeploys automatically on every push, no manual step needed.

## Environment / secrets

None required. This repo pins Node 22 via `.node-version` — Cloudflare Pages
reads this automatically, no manual Node version configuration needed. The
contact form posts directly to Formspree from the browser
(`YOUR_FORM_ID` in `src/components/sections/Contact.astro` — swap this for
your real Formspree form ID before going live, then create the form at
https://formspree.io).

## Attaching a custom domain later

1. In the Pages project, go to **Custom domains → Set up a custom domain**.
2. Enter the domain (e.g. `vantispos.com`).
3. If the domain's DNS is already on Cloudflare, the CNAME is added automatically.
   Otherwise, add the CNAME record Cloudflare shows you at your current DNS host.
4. Wait for DNS propagation (usually minutes, up to 24h) — Cloudflare provisions
   a free TLS certificate automatically once the CNAME resolves.

## Before going live — placeholders to swap

- `src/components/sections/Contact.astro` — real Formspree form ID
- `src/components/sections/Pricing.astro` — real subscription / per-register / setup fee figures (marked with `<!-- PLACEHOLDER PRICE -->` comments)
- `hello@vantispos.com` in `Contact.astro` — real contact email if different
