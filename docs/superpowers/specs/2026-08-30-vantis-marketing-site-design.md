# Design — Vantis Marketing Website

Date: 2026-08-30

## Purpose

A static marketing site for Vantis, the pharmacy POS built in the sibling
`POS System` project. Full requirements live in `vantis-website-prd.md`
(same directory) — this doc is the implementation design, not a
restatement of the PRD. Read the PRD first.

## Source-of-truth facts pulled from the POS codebase

These are the concrete mechanics the copy must be built from (file:line
references so claims stay traceable):

- **Split-tender + surcharge**: 2% credit surcharge applies only to the
  card line it's attached to, not the whole sale; two independent card
  lines can each carry their own `processorTransactionId` in one sale
  (`src/__tests__/splitTender.test.ts:99-223`). Customer-facing display
  always shows the surcharge-inclusive total, matching exactly what the
  terminal charges (`src/renderer/src/lib/customerDisplayState.ts:19-21`).
- **McKesson import**: byte-exact WEBCAT parsing, two-table design
  (`CatalogProduct` reference data vs. `Product` actual stock), per-field
  override flags (`nameOverridden`, `costOverridden`, `barcodeOverridden`)
  so a refresh never stomps a manual edit, discontinued items flagged
  never deleted, pre-commit preview showing exact reprice counts
  (`mckesson-catalog-import-spec.md` §2, §6, §10).
- **Customer tab / store credit**: single ledger (not a mutable number),
  FIFO-reconstructable breakdown so a disputed balance can be traced to
  the exact transactions and line items that make it up, with an
  assertion that the breakdown always sums to the live balance
  (`2026-08-12-checkout-link-customer-debt-settlement-design.md`
  "getCustomerDebtBreakdown").
- **Refunds**: manager re-authentication required even mid-cashier-session
  (`RefundsScreen.tsx:15-22`, `ManagerAuthModal.tsx`), four refund types
  — CASH / CARD / E_TRANSFER / TAB_CREDIT (`prisma/schema.prisma:479-484`).
- **Roles**: two roles, MANAGER / CASHIER, with a real gated nav
  (`MANAGER_ONLY` tab list, `App.tsx:36,50,66`) — not just hidden buttons.
- **Reports**: customer debt-age warning threshold is a manager-configurable
  setting (default 30 days), not hardcoded
  (`2026-08-12-customer-reports-debt-warnings-design.md`); complete
  product sales report reconstructs HST per line by proportional
  apportionment and attributes debt-financed sales to their payoff date,
  not their original sale date (`2026-08-13-complete-products-sales-report-design.md`).
- **Backup**: dual format (SQLite copy + human-readable JSON per table),
  SHA-256 checksum verification on every file, 30-day retention scoped
  per destination, prompted on every logout (`data-backup-system-spec.md`
  §1.3, §4, §8.1).
- **Payments**: processor-agnostic adapter interface — Moneris, Global
  Payments, Stripe Terminal, Square, plus Manual/Mock for dev — behind one
  common interface (`CLAUDE.md:40`, `hardware-integration-architecture.md:100`).
- **Auto-update**: `electron-updater` against GitHub releases, checks on
  startup and every 4 hours (`docs/CODE_SIGNING_AND_RELEASES.md:124-153`).
- **Pricing**: no real dollar figures exist anywhere in the codebase.
  Placeholder numbers will be used, visually/structurally final, with an
  inline HTML comment flagging them as placeholders to swap before launch.

## Stack

- **Astro**, static output (`astro build` → `dist/`). Zero client-side JS
  by default; islands only where genuinely needed (mobile nav toggle,
  contact form). Matches PRD §7's "no unnecessary client-side JS."
- **Tailwind CSS**, theme tokens overridden to match
  `pharmacy-pos-ui-ux-guide.md` Part 3 exactly: cool neutral grays, single
  teal accent (`#1D9E75` family, `#085041`→`#1D9E75` gradient reserved for
  the logo mark only), flat 1px borders (no ambient shadows on static
  cards), moderate consistent radius, no gradients elsewhere.
- **Typography**: Apple system font stack for the wordmark/headings
  (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue"`),
  paired with a distinct grotesque (Public Sans, self-hosted or Google
  Fonts) for body copy — not Inter.
- No CMS, no database, no server runtime.

## Site structure

Homepage only for this pass (PRD priority), single `src/pages/index.astro`
composed from section components in `src/components/sections/`:

1. `Header.astro` — logo mark (inline SVG, three ascending bars, teal
   gradient) + wordmark, nav links, "Book a walkthrough" CTA. Mobile: a
   disclosure-pattern menu (no JS framework, `<details>`/small island).
2. `Hero.astro` — direct headline, one static checkout mockup (built as
   real HTML/CSS matching the UI guide, not an illustration).
3. `Problem.astro` — named legacy-system frustrations, asymmetric
   two-column layout (text left, a small "Fillware-style" contrast
   mockup right) — not centered.
4. Feature sections — **one Astro component per feature area**, each with
   a distinct layout (alternating image-left/right, some full-width with
   a mockup below, one dense side-by-side comparison) so no two look
   alike:
   - `Checkout.astro` (split-tender + surcharge + customer display)
   - `CustomerCredit.astro` (ledger mockup)
   - `Catalog.astro` (McKesson import + reconciliation)
   - `Pricing Engine section` folded into Catalog or its own
     `TieredPricing.astro` (tier table mockup)
   - `Reports.astro` (dashboard mockup)
   - `Backup.astro` + `Staff.astro` combined into one lower-priority
     section (checksum/retention + role-gated nav facts) since neither
     needs a full-width treatment
5. `HowSwitching.astro` — honest onboarding steps (catalogue import,
   hardware pairing, staff training).
6. `Pricing.astro` — flat monthly + per-register add-on + setup fee,
   plain two-line layout, **not** a 3-column table. Placeholder $ figures
   with an inline comment flag.
7. `About.astro` — short, no overclaiming.
8. `Contact.astro` — Formspree-backed `<form>` (name, pharmacy name,
   email, phone, message) posting to a Formspree endpoint, progressive
   enhancement (works with JS off via native form POST); plus direct
   email/phone as a fallback per PRD.
9. `Footer.astro` — minimal, logo mark small, links repeat nav.

Mockups (`src/components/mockups/`): `CheckoutMockup.astro`,
`LedgerMockup.astro`, `ReportsMockup.astro`, `TierTableMockup.astro` — hand-built
static HTML/CSS styled per the UI guide's checkout/ledger/reports rules
(tabular-figure prices, 1px borders, teal only on actionable elements,
owed-vs-credit distinguished by more than color). These are illustrative
of the real UI, explicitly not claimed as literal screenshots.

## SEO / meta

`src/layouts/BaseLayout.astro` sets `<title>`, meta description, OG tags
(title/description/image — a static OG image built once, 1200×630, logo +
tagline on the brand palette, no photo). Semantic landmarks (`<header>`,
`<nav>`, `<main>`, `<section>` per homepage section, `<footer>`).

## Testing / verification

- `astro build` must succeed with zero errors → confirms static output.
- Manual check of `dist/` structure (flat HTML + `_astro/` assets)
  against Cloudflare Pages' static-site expectations.
- Responsive check at 375px/768px/1440px viewports (via dev server +
  browser resize, described in the completion summary since no visual
  regression tooling is set up).
- Lighthouse-style manual check: no render-blocking web fonts without
  `font-display: swap`, images (mockups are inline SVG/CSS, no raster
  assets to optimize).
- Keyboard nav check: tab through header nav + contact form.

## Deploy

`DEPLOY.md` at repo root: `npm run build`, connect repo (or direct
upload) to Cloudflare Pages, framework preset "Astro" (build command
`npm run build`, output directory `dist`), steps to attach a custom
domain afterward.

## Out of scope (per PRD §8)

No blog/CMS, no login/dashboard, no fabricated testimonials/logos, no
animated hero video, no live chat, no `/features` `/pricing` `/contact`
subpages unless time remains after the homepage is solid (stretch, not
required for this design).
