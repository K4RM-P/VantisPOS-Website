# Vantis Marketing Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a static, Cloudflare-Pages-ready marketing site for Vantis (pharmacy POS) at `/Users/karmpatel/Desktop/VantisPOS Website`, sourced entirely from the real product specs, following the locked brand/design system, avoiding every banned "AI slop" pattern.

**Architecture:** Astro static site (zero client JS by default, islands only for the mobile nav toggle and the contact form's client-side enhancement), Tailwind CSS with theme tokens overridden to match the app's design system, one homepage composed of section components, hand-built static HTML/CSS mockups (no screenshots exist), Formspree-backed contact form.

**Tech Stack:** Astro (latest stable), Tailwind CSS, TypeScript for config only, no UI framework (no React/Vue islands needed — plain `<details>`/vanilla JS for the two interactive bits), Node 20+.

**Spec:** `docs/superpowers/specs/2026-08-30-vantis-marketing-site-design.md` (and `vantis-website-prd.md` at repo root, which the design doc extends). Executors should read both — the PRD has the full anti-pattern list (§4) and the exact feature-content source material (§6) that copy must trace back to.

## Global Constraints

- **No banned patterns** (PRD §4): no purple/indigo gradients, no glassmorphism, no floating blobs, no centered-hero-with-stock-illustration, no repeated 3-card icon grids, no default Inter, no soft ambient shadows on cards, no gradient-pill hover-glow buttons, no stock photography, no fabricated social proof/stats, no invented 3-tier pricing table, no excessive scroll animation, no vague "Our Mission" copy.
- **Color tokens** (locked, from `pharmacy-pos-ui-ux-guide.md` Part 3 + brand §3): cool neutral grays as base, single teal accent `#1D9E75` family, gradient `#085041` → `#1D9E75` reserved for the logo mark ONLY — nowhere else. Light-mode-first, no dark mode. WCAG AA (4.5:1) contrast minimum on all text.
- **Typography**: Apple system font stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif`) for wordmark/headings; a distinct grotesque (Public Sans via Google Fonts, `font-display: swap`) for body copy. Never unexamined default Inter.
- **Shape**: flat 1px borders on cards, no soft ambient drop shadows on static content (shadows reserved for genuinely elevated/floating elements only — this site has none, so effectively no shadows). Consistent moderate border-radius token, not maximalist rounding.
- **Every feature claim must cite real spec/code mechanics** — no generic capability language. See the design doc's "Source-of-truth facts" section for the citation list; copy must reflect that level of specificity, not flatten it.
- **Pricing**: flat monthly + per-register add-on + one-time setup fee, presented as plain text/two-line layout, never a 3-column tier table. Dollar figures are placeholders (user confirmed placeholders are fine for now) — wrap each in an HTML comment `<!-- PLACEHOLDER PRICE: swap before launch -->` immediately preceding it.
- **No fabricated social proof**, no testimonials, no customer logos, no invented usage stats.
- **Static output only** — `astro build` → `dist/`, deployable to Cloudflare Pages with no backend/database dependency. Contact form posts to Formspree (client-side fetch with graceful native-POST fallback).
- **Responsive**: intentional (not just functional) at 375px, 768px, 1440px.
- **Accessible**: semantic HTML, proper heading hierarchy (one `<h1>` in Hero, `<h2>` per section), keyboard-navigable nav and form.

---

## File Structure

```
VantisPOS Website/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
├── DEPLOY.md
├── public/
│   ├── favicon.svg
│   └── og-image.png            (built in Task 9)
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro    (Task 1: <head>, meta/OG, font loading, skip-link)
│   ├── components/
│   │   ├── Logo.astro          (Task 1: inline SVG mark + wordmark, reusable)
│   │   ├── Header.astro        (Task 2)
│   │   ├── Footer.astro        (Task 2)
│   │   ├── sections/
│   │   │   ├── Hero.astro           (Task 3)
│   │   │   ├── Problem.astro        (Task 3)
│   │   │   ├── Checkout.astro       (Task 4)
│   │   │   ├── CustomerCredit.astro (Task 5)
│   │   │   ├── Catalog.astro        (Task 6)
│   │   │   ├── TieredPricing.astro  (Task 6)
│   │   │   ├── Reports.astro        (Task 7)
│   │   │   ├── BackupStaff.astro    (Task 7)
│   │   │   ├── HowSwitching.astro   (Task 8)
│   │   │   ├── Pricing.astro        (Task 8)
│   │   │   ├── About.astro          (Task 8)
│   │   │   └── Contact.astro        (Task 9)
│   │   └── mockups/
│   │       ├── CheckoutMockup.astro   (Task 4)
│   │       ├── LedgerMockup.astro     (Task 5)
│   │       ├── TierTableMockup.astro  (Task 6)
│   │       └── ReportsMockup.astro    (Task 7)
│   └── pages/
│       └── index.astro         (Task 10: composes all sections)
├── docs/superpowers/... (existing spec/plan docs)
└── vantis-website-prd.md (existing)
```

---

### Task 1: Project scaffold, Tailwind theme tokens, BaseLayout, Logo component

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `.gitignore`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Logo.astro`
- Create: `public/favicon.svg`

**Interfaces:**
- Produces: `BaseLayout.astro` accepting props `{ title: string, description: string }`, wrapping a `<slot />` in `<html><head>…</head><body>…</body></html>` with skip-link, OG/meta tags (image path finalized in Task 9, use `/og-image.png` now), font links.
- Produces: `Logo.astro` accepting prop `{ size?: "sm" | "md" | "lg" }`, rendering the inline SVG three-bar mark (teal gradient `#085041`→`#1D9E75`) + "Vantis" wordmark in Apple-system-font, black wordmark text with the last word/accent styled teal per the real logo file at `/Users/karmpatel/Desktop/POS System/docs/vantispos_logo.png` (bars gradient + "Vantis" in near-black, "POS" in solid teal `#1D9E75` — this site can drop the "POS" suffix and just show "Vantis" if the wordmark reads cleaner alone; match the real logo's proportions and weight either way).

- [ ] **Step 1: Initialize the Astro project**

Run:
```bash
cd "/Users/karmpatel/Desktop/VantisPOS Website"
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```
When prompted (if not fully suppressed by flags), accept minimal/empty template, TypeScript strict, no git init (already a repo).

- [ ] **Step 2: Add Tailwind**

Run:
```bash
npx astro add tailwind -y
```

- [ ] **Step 3: Configure Tailwind theme tokens**

Edit `tailwind.config.mjs` to extend the theme with the locked palette:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#1A1F1D',        // near-black text
        slate: {
          50: '#F7F8F7',
          100: '#EEF0EF',
          200: '#DDE1DF',
          300: '#C3C9C6',
          400: '#9BA39F',
          500: '#6E766F',
          600: '#4E564F',
          700: '#373D38',
          800: '#252A26',
        },
        teal: {
          DEFAULT: '#1D9E75',
          dark: '#085041',
          light: '#E6F5EF',
        },
      },
      fontFamily: {
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Helvetica Neue"', 'sans-serif'],
        body: ['"Public Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Write `BaseLayout.astro`**

```astro
---
export interface Props {
  title: string
  description: string
}
const { title, description } = Astro.props
const siteUrl = 'https://vantispos.pages.dev'
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={`${siteUrl}/og-image.png`} />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="bg-white text-ink font-body antialiased">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-teal focus:text-white focus:px-4 focus:py-2 focus:rounded"
    >
      Skip to content
    </a>
    <slot />
  </body>
</html>
```

- [ ] **Step 5: Write `Logo.astro`**

```astro
---
export interface Props {
  size?: 'sm' | 'md' | 'lg'
}
const { size = 'md' } = Astro.props
const heights = { sm: 'h-6', md: 'h-8', lg: 'h-10' }
const barHeight = heights[size]
---
<div class="flex items-center gap-2">
  <svg class={barHeight} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="vantisBarGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1D9E75" />
        <stop offset="100%" stop-color="#085041" />
      </linearGradient>
    </defs>
    <rect x="4" y="46" width="16" height="30" rx="6" fill="url(#vantisBarGradient)" />
    <rect x="32" y="30" width="16" height="46" rx="6" fill="url(#vantisBarGradient)" />
    <rect x="60" y="6" width="16" height="70" rx="6" fill="url(#vantisBarGradient)" />
  </svg>
  <span class="font-display font-semibold tracking-tight text-ink" style="font-size: 1.375rem;">
    Vantis
  </span>
</div>
```

- [ ] **Step 6: Create a placeholder favicon**

Write `public/favicon.svg` reusing the same three-bar mark markup (viewBox `0 0 80 80`, same rects/gradient) as a standalone file.

- [ ] **Step 7: Install and verify dev server boots**

Run:
```bash
npm install
npm run dev -- --port 4321 &
sleep 3
curl -sf http://localhost:4321/ > /dev/null && echo "DEV SERVER OK"
kill %1
```
Expected: `DEV SERVER OK` printed (index page will be Astro's default template still — that's fine, replaced in Task 10).

- [ ] **Step 8: Commit**

```bash
git add package.json astro.config.mjs tailwind.config.mjs tsconfig.json .gitignore src/layouts/BaseLayout.astro src/components/Logo.astro public/favicon.svg package-lock.json
git commit -m "Scaffold Astro+Tailwind project with brand tokens, BaseLayout, Logo component"
```

---

### Task 2: Header and Footer

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

**Interfaces:**
- Consumes: `Logo.astro` (Task 1) with prop `size="md"`.
- Produces: `Header.astro` (no props — static nav linking to in-page anchors `#features`, `#pricing`, `#about`, `#contact`), `Footer.astro` (no props).

- [ ] **Step 1: Write `Header.astro`**

```astro
---
import Logo from './Logo.astro'
---
<header class="border-b border-slate-200">
  <div class="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
    <a href="/" aria-label="Vantis home">
      <Logo size="md" />
    </a>
    <nav class="hidden md:flex items-center gap-8 font-body text-sm font-medium text-slate-700" aria-label="Primary">
      <a href="#features" class="hover:text-ink">Features</a>
      <a href="#pricing" class="hover:text-ink">Pricing</a>
      <a href="#about" class="hover:text-ink">About</a>
      <a href="#contact" class="hover:text-ink">Contact</a>
    </nav>
    <a
      href="#contact"
      class="hidden md:inline-flex items-center rounded bg-teal px-4 py-2 text-sm font-semibold text-white hover:bg-teal-dark"
    >
      Book a walkthrough
    </a>
    <details class="md:hidden relative">
      <summary
        class="list-none cursor-pointer rounded border border-slate-300 px-3 py-2 text-sm font-medium"
        aria-label="Open menu"
      >
        Menu
      </summary>
      <nav
        class="absolute right-0 top-full mt-2 w-56 rounded border border-slate-200 bg-white p-4 shadow-none flex flex-col gap-3 font-body text-sm font-medium text-slate-700 z-50"
        aria-label="Primary mobile"
      >
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="#contact" class="rounded bg-teal px-4 py-2 text-center text-white font-semibold">
          Book a walkthrough
        </a>
      </nav>
    </details>
  </div>
</header>
```

Note: `shadow-none` explicit — the `<details>` popover must not gain a default browser/Tailwind ambient shadow; borders communicate the boundary per the design system.

- [ ] **Step 2: Write `Footer.astro`**

```astro
---
import Logo from './Logo.astro'
const year = new Date().getFullYear()
---
<footer class="border-t border-slate-200 mt-24">
  <div class="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
    <Logo size="sm" />
    <nav class="flex flex-wrap gap-6 text-sm text-slate-600" aria-label="Footer">
      <a href="#features" class="hover:text-ink">Features</a>
      <a href="#pricing" class="hover:text-ink">Pricing</a>
      <a href="#about" class="hover:text-ink">About</a>
      <a href="#contact" class="hover:text-ink">Contact</a>
    </nav>
    <p class="text-sm text-slate-500">&copy; {year} Vantis. All rights reserved.</p>
  </div>
</footer>
```

- [ ] **Step 3: Smoke-render check**

Temporarily import both into `src/pages/index.astro` (will be rebuilt fully in Task 10) to confirm no Astro compile errors:
```bash
cat > src/pages/index.astro << 'EOF'
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Header from '../components/Header.astro'
import Footer from '../components/Footer.astro'
---
<BaseLayout title="Vantis" description="test">
  <Header />
  <main id="main"><p class="p-6">placeholder</p></main>
  <Footer />
</BaseLayout>
EOF
npm run build
```
Expected: build succeeds with no errors, `dist/index.html` produced.

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro src/pages/index.astro
git commit -m "Add Header and Footer components"
```

---

### Task 3: Hero and Problem sections

**Files:**
- Create: `src/components/sections/Hero.astro`
- Create: `src/components/sections/Problem.astro`

**Interfaces:**
- No props on either — both are static content sections for the homepage.

**Copy sourcing:** Hero headline must be specific per PRD §2 audience ("independent pharmacy owner currently running Fillware or similar, evaluating a switch") — not a vague "future of pharmacy" line. Problem section must name real legacy-system frustrations recognizable to a Fillware user (slow/dated interfaces, clunky tab/credit tracking bolted onto a mutable-balance model, no real reporting beyond canned X/Z reports) — contrast against Vantis's actual ledger-based tab system and complete-products-sales-report, both sourced in the design doc.

- [ ] **Step 1: Write `Hero.astro`**

Two-column layout (headline+CTA left, checkout mockup placeholder right on desktop; stacked on mobile) — explicitly NOT centered-headline-with-floating-illustration.

```astro
---
---
<section class="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
  <div>
    <h1 class="font-display text-4xl md:text-5xl font-semibold tracking-tight text-ink leading-tight">
      A pharmacy POS built for the register, not a demo.
    </h1>
    <p class="mt-6 text-lg text-slate-600 max-w-md">
      Vantis replaces aging systems like Fillware with real split-tender checkout,
      an auditable customer credit ledger, byte-exact McKesson catalogue import,
      and reporting that actually nets out refunds and discounts — built by
      studying what independent pharmacies are stuck fighting today.
    </p>
    <div class="mt-8 flex gap-4">
      <a href="#contact" class="inline-flex items-center rounded bg-teal px-6 py-3 font-semibold text-white hover:bg-teal-dark">
        Book a walkthrough
      </a>
      <a href="#features" class="inline-flex items-center rounded border border-slate-300 px-6 py-3 font-semibold text-ink hover:border-slate-400">
        See what it does
      </a>
    </div>
  </div>
  <div class="rounded border border-slate-200 bg-slate-50 p-3">
    <div class="rounded border border-slate-200 bg-white p-4">
      <p class="text-xs font-medium text-slate-500 mb-2">Checkout — Cart</p>
      <div class="space-y-2 font-mono text-sm">
        <div class="flex justify-between"><span>Metformin 500mg (30ct)</span><span class="tabular-nums">$14.20</span></div>
        <div class="flex justify-between"><span>Cough drops x2</span><span class="tabular-nums">$6.24</span></div>
        <div class="flex justify-between text-slate-500"><span>Card surcharge (2%)</span><span class="tabular-nums">$0.41</span></div>
        <div class="border-t border-slate-200 mt-2 pt-2 flex justify-between font-semibold">
          <span>Total</span><span class="tabular-nums">$20.85</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Write `Problem.astro`**

Asymmetric two-column (text left, small contrast list right) — not centered, not a 3-card grid.

```astro
---
const painPoints = [
  {
    title: 'A tab that’s just a number',
    body: 'Legacy systems store one mutable balance for a customer’s tab. When it’s disputed at the counter, there’s no way to show which sale or which items it came from — just the number, and an argument.',
  },
  {
    title: 'Reporting that doesn’t net out anything',
    body: 'Daily sales reports that don’t correctly subtract refunds and discounts aren’t reports — they’re vanity numbers a pharmacist has to double-check by hand.',
  },
  {
    title: 'A catalogue refresh that risks your own edits',
    body: 'Re-importing a supplier catalogue on most systems means re-checking every price you manually fixed last time, because there’s no reliable way to tell the system “I already changed this one.”',
  },
]
---
<section class="bg-slate-50 border-y border-slate-200">
  <div class="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-5 gap-10">
    <div class="md:col-span-2">
      <h2 class="font-display text-2xl md:text-3xl font-semibold text-ink">
        If you’ve run Fillware, you already know the problems.
      </h2>
      <p class="mt-4 text-slate-600">
        These aren’t abstract "pain points" — they’re the specific things that
        make a shift on a legacy pharmacy POS harder than it needs to be.
      </p>
    </div>
    <div class="md:col-span-3 space-y-6">
      {painPoints.map((p) => (
        <div class="border-l-2 border-teal pl-5">
          <h3 class="font-display font-semibold text-ink">{p.title}</h3>
          <p class="mt-1 text-sm text-slate-600">{p.body}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Build check**

Add both sections into `index.astro` temporarily after `Header`, run `npm run build`, expect success.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.astro src/components/sections/Problem.astro src/pages/index.astro
git commit -m "Add Hero and Problem sections"
```

---

### Task 4: Checkout feature section + mockup

**Files:**
- Create: `src/components/mockups/CheckoutMockup.astro`
- Create: `src/components/sections/Checkout.astro`

**Interfaces:**
- Consumes: nothing.
- Produces: `Checkout.astro` (no props, self-contained `<section id="features">` — this is the FIRST feature section so it owns the `id="features"` anchor that Header/Footer nav links target).

**Copy sourcing (from design doc):** split-tender across cash/card/e-transfer/store credit including two independent cards each with their own surcharge line; 2% card surcharge applies per-card-line, not to the whole sale; customer-facing display always shows the surcharge-inclusive total matching exactly what the terminal charges.

- [ ] **Step 1: Write `CheckoutMockup.astro`**

A static split-tender mockup showing two card lines with independent surcharges, matching the UI guide's tabular-figure/1px-border rules.

```astro
---
---
<div class="rounded border border-slate-200 bg-white p-5 font-mono text-sm">
  <p class="text-xs font-sans font-medium text-slate-500 mb-3">Tender — split payment</p>
  <div class="space-y-2">
    <div class="flex justify-between"><span>Cash</span><span class="tabular-nums">$20.00</span></div>
    <div class="flex justify-between">
      <span>Card ····4242</span>
      <span class="tabular-nums">$15.00</span>
    </div>
    <div class="flex justify-between text-slate-500 text-xs pl-4">
      <span>+2% surcharge</span><span class="tabular-nums">$0.30</span>
    </div>
    <div class="flex justify-between">
      <span>Card ····8891</span>
      <span class="tabular-nums">$10.00</span>
    </div>
    <div class="flex justify-between text-slate-500 text-xs pl-4">
      <span>+2% surcharge</span><span class="tabular-nums">$0.20</span>
    </div>
    <div class="border-t border-slate-200 mt-3 pt-3 flex justify-between font-sans font-semibold text-base">
      <span>Customer display total</span><span class="tabular-nums text-teal-dark">$45.50</span>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Write `Checkout.astro`**

Image-right layout (mockup right, copy left) on desktop.

```astro
---
import CheckoutMockup from '../mockups/CheckoutMockup.astro'
---
<section id="features" class="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
  <div>
    <p class="text-sm font-semibold text-teal-dark uppercase tracking-wide">Checkout</p>
    <h2 class="mt-2 font-display text-2xl md:text-3xl font-semibold text-ink">
      Split any sale across cash, card, e-transfer, and store credit — in any combination.
    </h2>
    <p class="mt-4 text-slate-600">
      Including two separate cards on the same sale, each carrying its own transaction ID
      and its own optional 2% surcharge — the surcharge applies to that card line only,
      never to the whole ticket. The customer-facing second screen always shows the exact
      surcharge-inclusive total the terminal is about to charge, live, as each tender is added.
    </p>
  </div>
  <CheckoutMockup />
</section>
```

- [ ] **Step 3: Build check, then commit**

```bash
npm run build
git add src/components/mockups/CheckoutMockup.astro src/components/sections/Checkout.astro
git commit -m "Add Checkout feature section with split-tender mockup"
```

---

### Task 5: Customer Credit (tab/ledger) feature section + mockup

**Files:**
- Create: `src/components/mockups/LedgerMockup.astro`
- Create: `src/components/sections/CustomerCredit.astro`

**Copy sourcing:** ledger-based tab (not a mutable number), FIFO-reconstructable breakdown so a disputed balance traces to exact transactions/line items, assertion that breakdown always sums to live balance.

- [ ] **Step 1: Write `LedgerMockup.astro`**

Ledger shown as a real transaction list, owed balance distinguished by more than color (explicit "−" sign + label), per UI guide.

```astro
---
---
<div class="rounded border border-slate-200 bg-white p-5">
  <p class="text-xs font-medium text-slate-500 mb-3">Customer tab — Alice Chen</p>
  <div class="space-y-2 text-sm font-mono">
    <div class="flex justify-between"><span class="font-sans text-slate-600">Fill — Jul 15</span><span class="tabular-nums text-teal-dark">+$50.00</span></div>
    <div class="flex justify-between"><span class="font-sans text-slate-600">Sale #2847 — Jul 30</span><span class="tabular-nums">−$37.50</span></div>
    <div class="border-t border-slate-200 mt-2 pt-2 flex justify-between font-sans font-semibold">
      <span>Current balance</span><span class="tabular-nums">$12.50 credit</span>
    </div>
  </div>
  <div class="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
    Balance disputed? Every line above traces back to a real transaction and its items —
    not just a number.
  </div>
</div>
```

- [ ] **Step 2: Write `CustomerCredit.astro`**

Image-left layout (mockup left, copy right) — alternates from Task 4's image-right, per the "vary layouts" design mandate.

```astro
---
import LedgerMockup from '../mockups/LedgerMockup.astro'
---
<section class="bg-slate-50 border-y border-slate-200">
  <div class="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
    <div class="order-2 md:order-1">
      <LedgerMockup />
    </div>
    <div class="order-1 md:order-2">
      <p class="text-sm font-semibold text-teal-dark uppercase tracking-wide">Customer accounts</p>
      <h2 class="mt-2 font-display text-2xl md:text-3xl font-semibold text-ink">
        A real ledger, not a mutable balance.
      </h2>
      <p class="mt-4 text-slate-600">
        Every fill, short-pay, and applied-balance event is its own timestamped line,
        tied to a user and station. If a customer disputes what they owe at the counter,
        pull up exactly which past sales and which items make up that number — the
        system can reconstruct the full breakdown on demand, and it’s built to always
        sum to the live balance, not just look like it does.
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Build check, then commit**

```bash
npm run build
git add src/components/mockups/LedgerMockup.astro src/components/sections/CustomerCredit.astro
git commit -m "Add Customer Credit feature section with ledger mockup"
```

---

### Task 6: Catalog import + Tiered Pricing feature sections + tier table mockup

**Files:**
- Create: `src/components/mockups/TierTableMockup.astro`
- Create: `src/components/sections/Catalog.astro`
- Create: `src/components/sections/TieredPricing.astro`

**Copy sourcing:** McKesson byte-exact WEBCAT parsing, two-table design (CatalogProduct reference vs Product stock), per-field override flags so refresh never stomps manual edits, discontinued items flagged never deleted, pre-commit preview with exact reprice counts. Tiered pricing: cost-based tiers, auto-calculated retail price, per-item override always available.

- [ ] **Step 1: Write `TierTableMockup.astro`**

```astro
---
const tiers = [
  { range: '$0.00 – $3.00', markup: '200%', example: '$1.00 cost → $3.00 retail' },
  { range: '$3.01 – $10.00', markup: '100%', example: '$5.00 cost → $10.00 retail' },
  { range: '$10.01 – $30.00', markup: '60%', example: '$20.00 cost → $32.00 retail' },
]
---
<div class="rounded border border-slate-200 bg-white overflow-hidden">
  <table class="w-full text-sm">
    <thead class="bg-slate-50 border-b border-slate-200">
      <tr class="text-left text-xs font-medium text-slate-500">
        <th class="px-4 py-2">Cost range</th>
        <th class="px-4 py-2">Markup</th>
        <th class="px-4 py-2">Example</th>
      </tr>
    </thead>
    <tbody>
      {tiers.map((t) => (
        <tr class="border-b border-slate-100 last:border-0">
          <td class="px-4 py-2 font-mono tabular-nums">{t.range}</td>
          <td class="px-4 py-2 font-mono tabular-nums">{t.markup}</td>
          <td class="px-4 py-2 text-slate-600 font-mono text-xs">{t.example}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

- [ ] **Step 2: Write `Catalog.astro`**

Full-width layout with mockup below copy — third distinct layout pattern (image-right, image-left, now full-width-stacked).

```astro
---
---
<section class="mx-auto max-w-6xl px-6 py-16 md:py-20">
  <div class="max-w-2xl">
    <p class="text-sm font-semibold text-teal-dark uppercase tracking-wide">Catalogue import</p>
    <h2 class="mt-2 font-display text-2xl md:text-3xl font-semibold text-ink">
      Imports McKesson’s real WEBCAT file, byte-exact.
    </h2>
    <p class="mt-4 text-slate-600">
      Upload the raw file and every product lands in a searchable catalogue — including
      the ones you don’t stock, so a barcode scan always finds something. When you re-import
      a new catalogue, it reconciles safely: fields you’ve edited by hand are never
      silently overwritten, and a discontinued item is flagged, never deleted — it stays
      sellable if there’s still stock on the shelf. Before anything commits, you see exactly
      how many items would be repriced and which ones dropped from the file.
    </p>
  </div>
  <div class="mt-8 rounded border border-slate-200 bg-slate-50 p-5 font-mono text-sm">
    <p class="font-sans text-xs font-medium text-slate-500 mb-3">Catalogue refresh preview</p>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div><p class="text-2xl font-semibold text-ink tabular-nums">53,208</p><p class="font-sans text-xs text-slate-500 mt-1">products in new file</p></div>
      <div><p class="text-2xl font-semibold text-ink tabular-nums">127</p><p class="font-sans text-xs text-slate-500 mt-1">will be repriced</p></div>
      <div><p class="text-2xl font-semibold text-ink tabular-nums">14</p><p class="font-sans text-xs text-slate-500 mt-1">manual overrides preserved</p></div>
      <div><p class="text-2xl font-semibold text-ink tabular-nums">23</p><p class="font-sans text-xs text-slate-500 mt-1">discontinued, kept sellable</p></div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Write `TieredPricing.astro`**

Dense side-by-side layout — fourth distinct pattern.

```astro
---
import TierTableMockup from '../mockups/TierTableMockup.astro'
---
<section class="bg-slate-50 border-y border-slate-200">
  <div class="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-start">
    <div>
      <p class="text-sm font-semibold text-teal-dark uppercase tracking-wide">Pricing engine</p>
      <h2 class="mt-2 font-display text-2xl md:text-3xl font-semibold text-ink">
        Cost-based tiers, not one flat markup.
      </h2>
      <p class="mt-4 text-slate-600">
        A flat markup breaks at both ends of the price range — too thin on cheap items,
        too much on expensive ones. Set cost-based tiers instead: every item’s retail
        price is calculated automatically from its supplier cost the moment that cost
        changes, no per-item work required. Any item can still be pinned to a manual
        price when you want to override the formula — a loss leader, a price match —
        the tiers set the default, not a hard rule.
      </p>
    </div>
    <TierTableMockup />
  </div>
</section>
```

- [ ] **Step 4: Build check, then commit**

```bash
npm run build
git add src/components/mockups/TierTableMockup.astro src/components/sections/Catalog.astro src/components/sections/TieredPricing.astro
git commit -m "Add Catalog import and Tiered Pricing feature sections"
```

---

### Task 7: Reports section + Backup/Staff section + reports mockup

**Files:**
- Create: `src/components/mockups/ReportsMockup.astro`
- Create: `src/components/sections/Reports.astro`
- Create: `src/components/sections/BackupStaff.astro`

**Copy sourcing:** complete products sales report reconstructs HST per line by proportional apportionment, attributes debt-financed sales to their payoff date not original sale date, correctly nets out refunds/discounts. Backup: dual format (SQLite + JSON), SHA-256 checksum verification, 30-day retention, prompted on logout. Staff: two roles (MANAGER/CASHIER) with real gated nav.

- [ ] **Step 1: Write `ReportsMockup.astro`**

```astro
---
---
<div class="rounded border border-slate-200 bg-white p-5">
  <p class="text-xs font-medium text-slate-500 mb-3">Complete Products Sales Report</p>
  <table class="w-full text-xs font-mono">
    <thead>
      <tr class="text-left text-slate-500 border-b border-slate-200">
        <th class="py-1 pr-3">Product</th>
        <th class="py-1 pr-3 text-right">Qty</th>
        <th class="py-1 pr-3 text-right">Total</th>
        <th class="py-1 text-right">Profit</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-slate-100"><td class="py-1 pr-3 font-sans">Tylenol 500mg</td><td class="py-1 pr-3 text-right tabular-nums">1</td><td class="py-1 pr-3 text-right tabular-nums">$3.72</td><td class="py-1 text-right tabular-nums text-teal-dark">$1.62</td></tr>
      <tr><td class="py-1 pr-3 font-sans">Cough drops</td><td class="py-1 pr-3 text-right tabular-nums">2</td><td class="py-1 pr-3 text-right tabular-nums">$6.24</td><td class="py-1 text-right tabular-nums text-teal-dark">$5.24</td></tr>
    </tbody>
  </table>
</div>
```

- [ ] **Step 2: Write `Reports.astro`** (image-right layout, matches Task 4's pattern reused deliberately since we're now varying the sequence, not every section needs a unique layout family — two repeats among eight is fine, three+ identical in a row is the banned pattern)

```astro
---
import ReportsMockup from '../mockups/ReportsMockup.astro'
---
<section class="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
  <div>
    <p class="text-sm font-semibold text-teal-dark uppercase tracking-wide">Reports</p>
    <h2 class="mt-2 font-display text-2xl md:text-3xl font-semibold text-ink">
      Numbers that net out, not vanity counts.
    </h2>
    <p class="mt-4 text-slate-600">
      The products sales report reconstructs tax per line item and correctly nets
      out refunds and discounts — and a product paid off through a customer’s tab
      shows up on the date the debt was actually settled, not buried on the original
      sale date, so what you see matches what actually happened at the register.
    </p>
  </div>
  <ReportsMockup />
</section>
```

- [ ] **Step 3: Write `BackupStaff.astro`**

Full-width two-column-of-facts layout (fifth distinct pattern — no mockup, deliberately text-only to vary rhythm).

```astro
---
---
<section class="bg-slate-50 border-y border-slate-200">
  <div class="mx-auto max-w-6xl px-6 py-16 md:py-20 grid md:grid-cols-2 gap-12">
    <div>
      <p class="text-sm font-semibold text-teal-dark uppercase tracking-wide">Data backup</p>
      <h2 class="mt-2 font-display text-xl font-semibold text-ink">A backup that’s actually verified.</h2>
      <p class="mt-3 text-slate-600 text-sm">
        Every backup writes a SQLite copy and human-readable JSON exports side by side,
        then computes a SHA-256 checksum on every file before calling it done —
        so "backup complete" means the files are actually readable, not just written.
        You’re prompted at logout, and backups age out on a 30-day retention clock
        per destination.
      </p>
    </div>
    <div>
      <p class="text-sm font-semibold text-teal-dark uppercase tracking-wide">Staff & permissions</p>
      <h2 class="mt-2 font-display text-xl font-semibold text-ink">Manager and cashier roles, actually enforced.</h2>
      <p class="mt-3 text-slate-600 text-sm">
        Manager-only screens are gated in the app’s own navigation, not just hidden
        behind a button a curious cashier could still reach. Refunds require a manager
        to re-authenticate on the spot, even mid-shift — every void, discount, and
        override is tied to a user and a timestamp.
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Build check, then commit**

```bash
npm run build
git add src/components/mockups/ReportsMockup.astro src/components/sections/Reports.astro src/components/sections/BackupStaff.astro
git commit -m "Add Reports and Backup/Staff feature sections"
```

---

### Task 8: How Switching Works, Pricing, About sections

**Files:**
- Create: `src/components/sections/HowSwitching.astro`
- Create: `src/components/sections/Pricing.astro`
- Create: `src/components/sections/About.astro`

**Copy sourcing:** onboarding is honest about catalogue import + hardware pairing + staff training (PRD §5.5) — not implying one-click SaaS signup. Pricing: flat monthly + per-register add-on + one-time setup fee, plain layout, placeholder $ figures flagged. About: short, honest, no overclaiming about company size/history (PRD §5.7).

- [ ] **Step 1: Write `HowSwitching.astro`**

Numbered-steps layout (sixth distinct pattern).

```astro
---
const steps = [
  { n: '01', title: 'Catalogue import', body: 'Upload your McKesson WEBCAT file (or start from a spreadsheet) — we walk through the preview together before anything commits.' },
  { n: '02', title: 'Hardware pairing', body: 'Receipt printer, barcode scanner, signature pad, and payment terminal get paired and tested on-site, not shipped as a hope-it-works kit.' },
  { n: '03', title: 'Staff training', body: 'A real walkthrough at the register with your cashiers and pharmacist — checkout, refunds, and the tab system — before go-live day.' },
]
---
<section id="how-it-works" class="mx-auto max-w-6xl px-6 py-16 md:py-20">
  <div class="max-w-2xl">
    <h2 class="font-display text-2xl md:text-3xl font-semibold text-ink">What switching actually looks like.</h2>
    <p class="mt-4 text-slate-600">
      This isn’t a self-serve signup. Onboarding is hands-on because a working
      pharmacy can’t afford downtime at the register.
    </p>
  </div>
  <div class="mt-10 grid md:grid-cols-3 gap-8">
    {steps.map((s) => (
      <div>
        <p class="font-mono text-sm text-teal-dark tabular-nums">{s.n}</p>
        <h3 class="mt-2 font-display font-semibold text-ink">{s.title}</h3>
        <p class="mt-2 text-sm text-slate-600">{s.body}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Write `Pricing.astro`**

Plain two-line layout, explicitly not a 3-column table.

```astro
---
---
<section id="pricing" class="bg-slate-50 border-y border-slate-200">
  <div class="mx-auto max-w-3xl px-6 py-16 md:py-20">
    <h2 class="font-display text-2xl md:text-3xl font-semibold text-ink">Pricing, plainly.</h2>
    <p class="mt-4 text-slate-600">
      One flat subscription per pharmacy, a per-register add-on if you run more than
      one till, and a one-time setup fee that covers catalogue import, hardware pairing,
      and staff training.
    </p>
    <div class="mt-8 rounded border border-slate-200 bg-white divide-y divide-slate-200">
      <div class="flex items-center justify-between px-5 py-4">
        <span class="text-ink font-medium">Base subscription</span>
        <!-- PLACEHOLDER PRICE: swap before launch -->
        <span class="font-mono tabular-nums text-ink">$149/mo</span>
      </div>
      <div class="flex items-center justify-between px-5 py-4">
        <span class="text-ink font-medium">Additional register</span>
        <!-- PLACEHOLDER PRICE: swap before launch -->
        <span class="font-mono tabular-nums text-ink">$39/mo each</span>
      </div>
      <div class="flex items-center justify-between px-5 py-4">
        <span class="text-ink font-medium">One-time setup</span>
        <!-- PLACEHOLDER PRICE: swap before launch -->
        <span class="font-mono tabular-nums text-ink">$499</span>
      </div>
    </div>
    <p class="mt-4 text-xs text-slate-500">
      Figures above are placeholders pending final pricing — ask us for current rates.
    </p>
  </div>
</section>
```

- [ ] **Step 3: Write `About.astro`**

```astro
---
---
<section id="about" class="mx-auto max-w-3xl px-6 py-16 md:py-20">
  <h2 class="font-display text-2xl md:text-3xl font-semibold text-ink">Why this exists.</h2>
  <p class="mt-4 text-slate-600">
    Vantis was built by studying what’s actually wrong with legacy pharmacy POS
    systems like Fillware — not by guessing. It’s early: this is a focused,
    independently-built product, not a large company with years of history behind
    it. What it does have is a system built with real care around the specific
    problems pharmacies deal with every day — disputed tabs, catalogue refreshes
    that don’t wreck manual pricing, reports that actually net out.
  </p>
</section>
```

- [ ] **Step 4: Build check, then commit**

```bash
npm run build
git add src/components/sections/HowSwitching.astro src/components/sections/Pricing.astro src/components/sections/About.astro
git commit -m "Add How Switching Works, Pricing, and About sections"
```

---

### Task 9: Contact section (Formspree) + static OG image

**Files:**
- Create: `src/components/sections/Contact.astro`
- Create: `public/og-image.png` (built via a small script, see Step 2)

**Interfaces:**
- Produces: `Contact.astro`, a `<section id="contact">` with a native `<form>` posting to Formspree via `method="POST" action="https://formspree.io/f/{FORM_ID}"`. `{FORM_ID}` is a placeholder the user must swap for their real Formspree endpoint — flag with an HTML comment.

- [ ] **Step 1: Write `Contact.astro`**

```astro
---
---
<section id="contact" class="mx-auto max-w-3xl px-6 py-16 md:py-24">
  <h2 class="font-display text-2xl md:text-3xl font-semibold text-ink">Talk to us about your pharmacy.</h2>
  <p class="mt-4 text-slate-600">
    Tell us a bit about your pharmacy and what you’re running now — we’ll set up
    a real walkthrough.
  </p>
  <!-- PLACEHOLDER: replace YOUR_FORM_ID with a real Formspree form ID before launch -->
  <form
    action="https://formspree.io/f/YOUR_FORM_ID"
    method="POST"
    class="mt-8 grid gap-4 max-w-lg"
  >
    <div>
      <label for="name" class="block text-sm font-medium text-ink">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        required
        class="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
      />
    </div>
    <div>
      <label for="pharmacy" class="block text-sm font-medium text-ink">Pharmacy name</label>
      <input
        id="pharmacy"
        name="pharmacy"
        type="text"
        required
        class="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
      />
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-ink">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        class="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
      />
    </div>
    <div>
      <label for="phone" class="block text-sm font-medium text-ink">Phone (optional)</label>
      <input
        id="phone"
        name="phone"
        type="tel"
        class="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
      />
    </div>
    <div>
      <label for="message" class="block text-sm font-medium text-ink">What are you running now, and what’s not working?</label>
      <textarea
        id="message"
        name="message"
        rows="4"
        class="mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
      ></textarea>
    </div>
    <button
      type="submit"
      class="mt-2 inline-flex items-center justify-center rounded bg-teal px-6 py-3 font-semibold text-white hover:bg-teal-dark"
    >
      Send
    </button>
  </form>
  <p class="mt-6 text-sm text-slate-500">
    Prefer email or phone? <a href="mailto:hello@vantispos.com" class="text-teal-dark underline">hello@vantispos.com</a>
  </p>
</section>
```

No client-side JS island needed — a native `<form method="POST" action="...">` to Formspree works fully without JS (progressive enhancement satisfied by default, not added).

- [ ] **Step 2: Generate the static OG image**

Since no design tool is available in this environment, build the OG image as an SVG and rasterize it with a tiny Node script (avoids requiring a browser/canvas dependency at build time — this runs once, not part of the build pipeline).

Create `scripts/generate-og-image.mjs`:
```js
import sharp from 'sharp'
import { writeFileSync } from 'fs'

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#F7F8F7"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1D9E75"/>
      <stop offset="100%" stop-color="#085041"/>
    </linearGradient>
  </defs>
  <rect x="460" y="330" width="40" height="80" rx="14" fill="url(#g)"/>
  <rect x="520" y="270" width="40" height="140" rx="14" fill="url(#g)"/>
  <rect x="580" y="190" width="40" height="220" rx="14" fill="url(#g)"/>
  <text x="600" y="470" font-family="Helvetica, Arial, sans-serif" font-size="56" font-weight="600" fill="#1A1F1D" text-anchor="middle">Vantis</text>
  <text x="600" y="510" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#4E564F" text-anchor="middle">Pharmacy point of sale, built for the register</text>
</svg>
`

await sharp(Buffer.from(svg)).png().toFile('public/og-image.png')
console.log('OG image written to public/og-image.png')
```

Run:
```bash
npm install --save-dev sharp
node scripts/generate-og-image.mjs
```
Expected: `public/og-image.png` created, 1200×630.

- [ ] **Step 3: Build check, then commit**

```bash
npm run build
git add src/components/sections/Contact.astro scripts/generate-og-image.mjs public/og-image.png package.json package-lock.json
git commit -m "Add Contact section with Formspree form and static OG image"
```

---

### Task 10: Compose homepage, finalize `index.astro`, meta content

**Files:**
- Modify: `src/pages/index.astro` (rewrite fully, replacing the Task-2 placeholder)

**Interfaces:**
- Consumes: every section component from Tasks 2–9, `BaseLayout` from Task 1.

- [ ] **Step 1: Rewrite `index.astro` to compose the full page in PRD §5 order**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Header from '../components/Header.astro'
import Footer from '../components/Footer.astro'
import Hero from '../components/sections/Hero.astro'
import Problem from '../components/sections/Problem.astro'
import Checkout from '../components/sections/Checkout.astro'
import CustomerCredit from '../components/sections/CustomerCredit.astro'
import Catalog from '../components/sections/Catalog.astro'
import TieredPricing from '../components/sections/TieredPricing.astro'
import Reports from '../components/sections/Reports.astro'
import BackupStaff from '../components/sections/BackupStaff.astro'
import HowSwitching from '../components/sections/HowSwitching.astro'
import Pricing from '../components/sections/Pricing.astro'
import About from '../components/sections/About.astro'
import Contact from '../components/sections/Contact.astro'
---
<BaseLayout
  title="Vantis — Pharmacy POS built for the register"
  description="Vantis is a pharmacy point-of-sale system with real split-tender checkout, an auditable customer credit ledger, byte-exact McKesson catalogue import, and reporting that actually nets out refunds. Built to replace legacy systems like Fillware."
>
  <Header />
  <main id="main">
    <Hero />
    <Problem />
    <Checkout />
    <CustomerCredit />
    <Catalog />
    <TieredPricing />
    <Reports />
    <BackupStaff />
    <HowSwitching />
    <Pricing />
    <About />
    <Contact />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Full build verification**

```bash
npm run build
ls dist/
```
Expected: build succeeds, `dist/index.html` and `dist/_astro/` (or similar asset dir) present, no errors/warnings about missing imports.

- [ ] **Step 3: Visual smoke test across viewports**

```bash
npm run preview -- --port 4322 &
sleep 2
curl -sf http://localhost:4322/ | grep -q "Vantis" && echo "PAGE RENDERS"
kill %1
```
Then manually open `http://localhost:4322` in a browser (start `npm run preview` again interactively) and resize to 375px, 768px, 1440px — confirm:
- Header collapses to the `<details>` menu below 768px, no layout overflow
- No horizontal scroll at any width
- All section headings form a single logical `<h1>` → `<h2>` hierarchy (verify via browser dev tools accessibility tree or `grep -o '<h[1-6]' dist/index.html`)
- Tab through the header nav and the contact form with keyboard only — confirm visible focus states throughout (Tailwind's default focus ring plus the explicit `focus:ring-teal` on inputs)

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "Compose full homepage from all sections in PRD order"
```

---

### Task 11: DEPLOY.md and final repo cleanup

**Files:**
- Create: `DEPLOY.md`
- Modify: `.gitignore` (verify `node_modules/`, `dist/`, `.astro/` are ignored)

- [ ] **Step 1: Write `DEPLOY.md`**

```markdown
# Deploying Vantis marketing site to Cloudflare Pages

## First-time setup (Cloudflare dashboard)

1. Push this repo to GitHub (already wired: `origin` → `https://github.com/K4RM-P/VantisPOS-Website.git`).
   \`\`\`bash
   git push -u origin main
   \`\`\`
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the `VantisPOS-Website` repository.
4. Framework preset: **Astro**.
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy. Cloudflare gives you a `*.pages.dev` URL immediately after the first build finishes.

## Every subsequent deploy

Just push to `main` — Cloudflare Pages rebuilds and redeploys automatically on every push, no manual step needed.

## Environment / secrets

None required. The contact form posts directly to Formspree from the browser
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
```

- [ ] **Step 2: Verify `.gitignore` covers build artifacts**

Read `.gitignore` (created by `astro create` in Task 1) and confirm it includes at minimum:
```
node_modules/
dist/
.astro/
.env
```
If any are missing, add them.

- [ ] **Step 3: Final full build from clean state**

```bash
rm -rf dist .astro node_modules
npm install
npm run build
test -f dist/index.html && echo "CLEAN BUILD OK"
```
Expected: `CLEAN BUILD OK`.

- [ ] **Step 4: Commit**

```bash
git add DEPLOY.md .gitignore
git commit -m "Add DEPLOY.md and finalize .gitignore"
```

Do **not** push in this step — pushing to the real `origin` remote is a user-visible action outside this plan's scope; confirm with the user before running `git push`.

---

## Self-review notes (completed during plan authoring)

- **Spec coverage:** every homepage section in the design doc's "Site structure" list has a task (Hero/Problem → Task 3, Checkout → 4, CustomerCredit → 5, Catalog/TieredPricing → 6, Reports/BackupStaff → 7, HowSwitching/Pricing/About → 8, Contact → 9, composition → 10, Header/Footer → 2, scaffold/tokens → 1, deploy → 11). SEO/OG covered in Tasks 1 and 9. Responsive/keyboard checks covered in Task 10 Step 3.
- **Placeholder scan:** the only intentional placeholders are the pricing dollar figures and the Formspree form ID, both explicitly flagged per the user's decision to ship with marked placeholders — these are not plan-authoring placeholders, they're shipped-and-labeled content gaps the user will fill in.
- **Type/name consistency:** `Logo` prop `size: 'sm'|'md'|'lg'` used consistently in Header (`md`) and Footer (`sm`); all section components take no props and are composed directly in `index.astro`; color tokens (`teal`, `teal-dark`, `slate-*`, `ink`) defined once in Task 1's Tailwind config and referenced identically throughout.
