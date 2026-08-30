# PRD — Vantis Marketing Website

## 1. Purpose

A marketing/informational website for **Vantis** — the pharmacy point-of-sale system built
throughout this project. This site's job is to make an independent pharmacy owner (the exact
profile who currently runs Fillware, a Pharmasave/Guardian/IDA-banner pharmacy, or a soon-to-open
independent) understand in under a minute what Vantis is, why it's different from what they're
using now, and how to get in touch to become a client. This is not the app itself — it's the
storefront that gets a real pharmacy owner to reach out.

This is not a generic SaaS landing page template with the brand name swapped in. Every claim on
this site must trace back to something actually built in the Vantis codebase — no invented
features, no vague "powerful analytics" copy that could describe any product. See §6.

---

## 2. Audience

**Primary:** an independent or banner-affiliated pharmacy owner (Pharmasave, Guardian, IDA,
PharmaChoice, Remedy's Rx) currently running an older system like Fillware, evaluating whether to
switch. Not a developer, not a large chain's procurement department. This person cares about:
reliability, not looking outdated to their customers, not getting nickel-and-dimed, and whether
this "new" system is actually going to work on day one without disrupting a working pharmacy.

**Secondary:** anyone Vantis is pitched to directly (a McKesson rep, a Moneris rep, a potential
second pilot pharmacy found through the earlier lead research) who needs the site to read as
credible and real, not like a solo developer's side project — even though right now it is one.

---

## 3. Brand

- **Name:** Vantis
- **Wordmark:** "Vantis" in a clean rounded sans-serif (SF Pro / Apple system font family, with
  Helvetica Neue fallback), tight negative letter-spacing, medium/semi-bold weight
- **Mark:** three ascending bars (left to right, increasing height), teal gradient
  (`#085041` → `#1D9E75`), rounded rectangle bars, positioned close/aligned to the wordmark
- **Color palette:** cool neutral grays as the base, single teal accent (`#1D9E75` family) for
  interactive/highlighted elements — the same locked palette from `pharmacy-pos-ui-ux-guide.md`.
  Light-mode-first. No gradients anywhere except the logo mark itself.
- **Typography:** same Apple-system-font direction as the logo — clean, rounded, modern. Avoid
  default Inter.
- **Tone:** confident, plain-spoken, specific. Not hypey, not full of buzzwords. This audience is
  skeptical of software sales pitches — earn trust with specificity, not adjectives.

---

## 4. NO AI SLOP — explicit anti-pattern list (non-negotiable)

This is the single most important constraint on this project. Every generic AI-generated landing
page shares a recognizable set of tells. None of the following are permitted anywhere on this site:

- Purple/indigo gradient backgrounds or buttons
- Glassmorphism (frosted-glass blur cards)
- Floating decorative blob/orb shapes in the background
- A hero section with a centered headline, centered subheading, centered CTA button, and a stock
  illustration or generic 3D render floating to the side
- Generic 3-card feature grids with a centered icon-above-heading-above-paragraph layout repeated
  identically three (or six, or nine) times
- Default Inter font with no consideration
- Soft ambient drop shadows on every card "for depth"
- Rounded-pill buttons with a subtle gradient and a hover-glow effect
- Stock photography of diverse smiling people in an office that has nothing to do with a pharmacy
- Fake, vague social proof ("Trusted by 10,000+ businesses") — there is exactly one real early
  client relationship at this stage; do not fabricate scale that doesn't exist
- Meaningless stat callouts with no real number behind them ("99.9% uptime" with no basis)
- A pricing table with three tiers named "Starter / Pro / Enterprise" copied from generic SaaS
  convention, when Vantis's actual pricing model (built out earlier in this project) is a flat
  subscription + per-register add-on + setup fee, not a three-tier ladder
- Excessive scroll-triggered fade/slide animations on every single element
- An "Our Mission" paragraph full of abstractions ("empowering pharmacies to reimagine the future
  of care") with no concrete claim in it

**What replaces all of this:** real screenshots or clean UI mockups of actual Vantis screens
(checkout, the customer credit ledger, the reports dashboard), specific named features tied to
specific pharmacy pain points, plain sentences instead of marketing adjectives, and restraint —
generous whitespace, one accent color used deliberately, not everywhere.

---

## 5. Site structure

### Homepage
1. **Header** — logo (bars + wordmark), nav (Features, Pricing, About, Contact), a single clear
   CTA button ("Get in touch" or "Book a walkthrough") — not "Sign up free," since this isn't a
   self-serve product
2. **Hero** — one direct, specific headline about what Vantis actually is and who it's for (not
   a vague "the future of pharmacy" line) + one real screenshot or clean mockup of the checkout
   screen, not a stock image or abstract illustration
3. **The problem** — a short, honest section naming what's actually frustrating about legacy
   pharmacy POS systems (slow, dated interfaces; clunky tab/credit tracking; no real reporting) —
   specific enough that a Fillware user would recognize their own frustration, not generic
4. **Feature sections** — see §6, this is the core of the page. Each major system gets its own
   section with a real description and, where possible, a real UI screenshot/mockup — not a
   uniform icon grid
5. **How it works / what switching looks like** — a short, honest section on what onboarding
   actually involves (catalogue import, hardware pairing, staff training) — sets real expectations
   rather than implying it's a one-click SaaS signup
6. **Pricing** — reflects the actual pricing model already decided on: flat monthly subscription,
   per-register add-on, one-time setup fee. Presented plainly, not as a 3-tier comparison table
   inventing tiers that don't exist
7. **About / why this exists** — short, honest, specific: built by a developer who studied what's
   actually wrong with legacy systems like Fillware and built something modern and dependable in
   its place. No overclaiming about company size or history that doesn't exist yet
8. **Contact / CTA section** — a real contact form or direct email/phone, framed as "talk to us
   about your pharmacy," not a generic "Get Started" button leading nowhere

### Optional secondary pages (build if time allows, homepage is priority)
- `/features` — a deeper dive per feature area, expanding on the homepage sections
- `/pricing` — expanded version of the homepage pricing section
- `/contact` — dedicated contact form page

---

## 6. Feature content — must be sourced from the real system, not invented

Before writing any marketing copy, the actual features and their real behavior must be pulled from
the project's own specs and codebase (see the build prompt for exactly which files). Real feature
areas to draw from, each with genuine specifics available to write from (do not flatten these into
generic bullet points — use the real mechanics as the selling point):

- **Checkout** — full-width cart, flexible split-tender payment (cash, card with optional 2%
  credit surcharge, e-transfer, store credit — in any combination, including two separate cards),
  a customer-facing second screen so customers can watch their total build in real time
- **Customer accounts & store credit (tab system)** — a real ledger-based credit/tab system, not a
  single mutable balance number — every transaction is auditable, with the ability to pull a
  customer's exact itemized debt history if a balance is ever disputed at the counter
- **McKesson catalogue import** — reverse-engineered, byte-exact parsing of McKesson's real WEBCAT
  file format, importing 50,000+ products with a safe reconciliation process that never silently
  overwrites what a pharmacist has manually priced or edited, and never deletes stock history —
  discontinued items are flagged, never erased
- **Tiered markup pricing engine** — cost-based automatic pricing with owner-defined tiers, with
  manual override always available per item
- **Loyalty & discounts** — per-item and whole-bill discounts, configurable loyalty points
- **Refunds** — a manager-authenticated refund flow with full audit trail, supporting cash, card,
  e-transfer, or deposit back to a customer's store credit
- **Reports** — real daily/period sales breakdowns, cashier reconciliation, inventory valuation,
  correctly netting out refunds and discounts (not vanity numbers)
- **Staff accounts & permissions** — manager/cashier roles with real access control, not just
  hidden buttons
- **Data backup** — automatic backup on logout to external drive or cloud (Google Drive/OneDrive),
  with a real, tested restore path — not just a backup button that's never been verified to work
- **Real payment terminal integration** — built against actual Moneris hardware, not a mocked
  demo integration
- **Auto-updates** — the pharmacy never has to manually reinstall software again after the first
  setup

This list itself should not appear verbatim as marketing copy — it's the accurate source material
the actual site copy needs to be written from.

---

## 7. Technical requirements

- **Static site** — no backend needed for the marketing site itself (the contact form can post to
  a simple serverless function or a third-party form service — do not require a database)
- **Deploy target: Cloudflare Pages** — chosen specifically because its free tier has no
  commercial-use restriction (unlike Vercel's Hobby tier) and unlimited bandwidth. Build the site
  as a standard static export (plain HTML/CSS/JS, or a framework that builds to static output) so
  it deploys cleanly there
- **Fast** — this is a marketing site; it should load near-instantly. No heavyweight framework
  bloat, no unnecessary client-side JS for content that's fundamentally static
- **Responsive** — must look intentional on mobile, not just "technically works." A pharmacy owner
  is very likely to first look at this on their phone
- **Accessible** — real semantic HTML, proper contrast, keyboard-navigable nav and forms
- **SEO basics** — proper meta tags, a real page title/description, OpenGraph tags for link
  previews (this will get shared via text/email to pharmacy owners and reps)

---

## 8. Explicit non-goals for this pass

- No blog/CMS
- No customer login/dashboard on the marketing site (that's the actual app, separate)
- No fake testimonials or logos — if there is one real early pilot relationship, it can be
  referenced honestly and modestly once it's live; nothing fabricated before then
- No animated hero video/3D scene — a clean static screenshot or mockup does more for credibility
  with this audience than motion graphics
- No live chat widget for this first version

---

## 9. Success criteria

- A pharmacy owner unfamiliar with Vantis can understand what it is and who it's for within 10
  seconds of landing on the page
- Every feature claim on the site is traceable to something real in the actual codebase — no
  invented capability
- The site does not visually resemble a generic AI-generated SaaS template — someone who has seen
  a hundred of those should immediately notice this one is different
- The site works and looks intentional on a phone, since that's a likely first-viewing device
- The site is live on a real, working Cloudflare Pages URL by the end of this build
