# Vuetify Ecosystem Inventory — 2026-08

> **Research artifact. Not product documentation. Do not merge into `master`.**
> Compiled for John and Ash as an input to a focus decision. This document is
> **inventory only** — it deliberately makes no recommendation about what to
> prioritise for subscriber growth.

**Compiled:** 2026-08-16 · **Repo HEAD at time of writing:** `5d686fc2` (`vuetifyjs/0`, `master`)

## Thirteen facts worth knowing before the tables

Each is sourced in the section named.

| # | Fact | Where |
|---|---|---|
| 1 | **19 first-party hosts resolve.** All but the Shopify store run on one Coolify + Caddy + Cloudflare fleet. `try.vuetifyjs.com` and `ots.vuetifyjs.com` do not resolve at all. | §1 |
| 2 | **`api.vuetifyjs.com` is the whole platform** — an OAuth 2.1 authorization server plus subscription, team, playground, bin, link, studio-project, ad-content and docs-AI endpoints. Every property is a client of it. | §5.1 |
| 3 | **All four legacy creation properties paywall cloud persistence.** Play, Bin, Studio and (past a default link) Link gate Save behind Vuetify One, with an identical park-the-payload-then-resume funnel. | §2.5 |
| 4 | **v0play contains no subscriber check at all.** `rg 'isSubscriber\|sponsorship'` across `apps/playground` and `apps/docs` returns nothing; cloud save fails only on `401`. The newest playground gives away what the one it replaces sells. | §2.5 |
| 5 | **Vuetify One costs `$2.99`/mo or `$29.99`/yr solo, `$29.99`/mo or `$299.99`/yr team** — hardcoded in the docs pricing card. Two of the advertised features are flagged `soon`, including playground embeds. | §2.4 |
| 6 | **A `$3`/month GitHub Sponsors tier grants "Vuetify One Access"**, and `@vuetify/auth` models GitHub, Discord, Open Collective and Stripe sponsorships as one `sponsorships[]` entitlement array — while the One FAQ tells users sponsoring is *not* an entitlement path. | §2.2, §5.2 |
| 6b | **`@vuetify/one` peers on `vuetify ^4.0.0` and never references `@vuetify/v0`.** That is the technical reason v0play uses bare `@vuetify/auth`, and therefore has no subscriber gate, no product chrome, and a site id (`vzero`) the One content system cannot target. | §5.3 |
| 6c | **Nine money rails on six billing systems**, including two nobody listed: Discord subscriber tiers (`$2.99`/`$19.99`/`$99.99` per month) and PayPal one-time. Four separate sponsorship ladders describe overlapping inventory. | §2, §2.3 |
| 7 | **GitHub Sponsors points at a personal account** (`github: [johnleider]`), and the $250/$500/$1,500 rungs are duplicated on Open Collective with different impression claims (600k/10m vs 200k/3m). | §2.1, §2.3 |
| 8 | **Snips is still paid**, not free/PWYW: prices hardcoded at 74/74/74, all-access 149, team 399, with a 50%-off sale active and two live Stripe links. | §2.6 |
| 9 | **The Builder is branch-only** — draft PR #241, 108 commits ahead / 64 behind `master`, last touched 2026-08-04 — and already emits a v0play URL as one of its two outputs. | §4 |
| 10 | **Studio is the clearest zombie**: a 3.3 MB Monaco project editor with its own paid cloud-projects tier, last built 2026-01-29, and the only remaining front-end for the still-live SendOwl purchase-downloads endpoint. | §3, §8.2 |
| 11 | **`gh:vuetifyjs/ecosystem` is the org's only first-party property registry**, and it names the six private properties outright: Play, Bin, Studio, Snips, Link, Issues — with One handled separately as the account layer. | "How claims are sourced" |
| 12 | **The MCP server proves One is enforced server-side**: 10 of its 31 tools are gated, and a valid key without entitlement gets `403 Invalid Access` from `api.vuetifyjs.com` → "This tool requires a Vuetify One subscription." | §7.3 |
| 13 | **`cli` (208 commits in 2026) and `nuxt-module` (159) are the real tooling investment.** The 12 theme repos have zero substantive 2026 commits, none are published to npm, and one paid product's demo URL points at the defunct `now.sh`. | §7.4, §6.4 |

## How claims are sourced

| Marker | Meaning |
|---|---|
| `path/to/file.ts:12` | Read from the local `vuetifyjs/0` checkout at `5d686fc2` |
| `gh:owner/repo path` | Read from GitHub via `gh api` (public repo) |
| `live:host` | Observed by HTTP request to the public host on 2026-08-16 |
| `bundle:host` | Read from the production JavaScript bundle served by that host |
| **UNKNOWN** | Could not be verified from an available source |

Two access limits shaped this inventory, and both are load-bearing when reading it:

1. **Private repos are not readable from this environment.** `gh api repos/vuetifyjs/<name>`
   returns a byte-identical `404 Not Found` for `bin`, `play`, `snips`, `studio`, `issues`,
   `api`, `admin`, `ots`, `link`, `links`, `store`, `discord-bot`, `paper`, `emerald`,
   `genesis`, `onyx`, `builder`. GitHub returns the same 404 for "private" and "does not
   exist", so for those properties the evidence below is the **live host and its production
   bundle**, not source.

   **One first-party document settles most of that ambiguity.** `gh:vuetifyjs/ecosystem`
   `README.md` is titled "Vuetify Ecosystem Feedback" and opens: *"Central hub for
   collecting feedback on **private** Vuetify ecosystem projects."* Its scope table names
   exactly six, with hosts — Play, Bin, Studio, Snips, Link, Issues — and its "Not Covered
   Here" section routes the framework to `vuetifyjs/vuetify`, v0 to `vuetifyjs/0`, and
   **Vuetify One to its own support channel at `one.vuetifyjs.com`**. So those six are
   confirmed private-by-design and grouped as one product surface, with One deliberately
   handled separately as the account layer. `api` and `admin` are not in that table; both
   are demonstrably running services with no public repo, so "private" is inference.
   `ots` is NXDOMAIN with zero code references anywhere in the org — it is the one name
   that looks like it simply does not exist.
2. **No revenue or usage data is available.** Nothing in this document is a metric unless
   it is a public count from a public API, and it is labelled as such.

---

## 1. Executive map

Maturity is judged from the `last-modified` header of the deployed `index.html`
(`live:` for each host, all fetched 2026-08-16) plus repo commit activity where the repo
is readable. "Subscriber surface" means the property itself gates features behind
Vuetify One / sponsorship.

| Property | Live host | Repo | What it does | For whom | Maturity (evidence) | Subscriber surface? |
|---|---|---|---|---|---|---|
| Vuetify (core) | `vuetifyjs.com` | `gh:vuetifyjs/vuetify` (public, 41k★) | Vue 3 Material component framework + the docs/marketing site | All Vue developers | **Live**, actively developed (repo pushed 2026-08-16; docs deploy 2026-08-16 12:09 UTC) | Yes — One sign-in and sponsor placement live in the docs shell (§2) |
| Vuetify0 (v0) | `0.vuetifyjs.com` | `gh:vuetifyjs/0` (public, 759★) — this repo | Headless composable UI engine + its docs site | Design-system / framework builders | **Live**, actively developed (docs deploy 2026-08-16 04:43) | No feature gating — docs state "No pro tier, no paywalled features, no plans for either" (`apps/docs/src/pages/introduction/why-vuetify0.md:237`); it does sell sponsorship and services (§2) |
| Vuetify0 Play (v0play) | `v0play.vuetifyjs.com` | this repo, `apps/playground` | In-browser REPL for v0 / Vuetify 4, with One cloud save, export, share links | v0 + Vuetify users, docs readers | **Live, newest** (deploy 2026-08-16 00:42) | Sign-in only — **no subscriber gate anywhere in its source** |
| Vuetify Play (legacy) | `play.vuetifyjs.com` | **UNKNOWN** (no readable repo) | The original Vuetify playground; `@vuetify/one`-integrated, `/playgrounds/:id` cloud save | Vuetify users | **Live but being replaced** (deploy 2026-07-22) | **Yes — cloud Save is subscriber-only** (§2.5), plus One cosmetic gating |
| Vuetify Bin | `bin.vuetifyjs.com` | **UNKNOWN** | Pastebin for Vuetify snippets; `/bins`, `/embed/:id`, socket.io live channel to `api.vuetifyjs.com` | Support / issue triage / sharing | **Live, aging** (deploy 2026-06-08) | **Yes — cloud Save is subscriber-only** (§2.5) |
| Vuetify One | `one.vuetifyjs.com` | `gh:vuetifyjs/one` (public) — app itself **UNKNOWN** | Account, subscription, team and OAuth-consent surface for the whole ecosystem | Subscribers / all signed-in users | **Live, freshest of the satellites** (deploy 2026-08-13) | **This is the subscriber surface** |
| Vuetify Link | `link.vuetifyjs.com` | **UNKNOWN** | Short-URL generator (`VLink`) | Team / community | **Live, aging** (deploy 2026-06-08) | **Yes** — custom slug, expiry, password, timer and click analytics are all subscriber-only (§2.5) |
| Vuetify Snips | `snips.vuetifyjs.com` | **UNKNOWN** | Catalogue of copy-paste Vuetify UI snippets in Application UI / Marketing / Ecommerce categories | Designers & app builders | **Live, active** (deploy 2026-08-10) | **Yes — paid, one-time "all-access"** (§2) |
| Vuetify Admin | `admin.vuetifyjs.com` | **UNKNOWN** | Internal console: `/sponsors`, `/promotions`, `/spots`, `/banners`, `/notifications`, `/users`, `/logs`, `/docs-ask` | Core team only | **Live** (deploy 2026-07-27) | Internal; `/401` route implies role gating |
| Vuetify Studio | `studio.vuetifyjs.com` | **UNKNOWN** | Billed as a "visual theme builder"; the shipped app is a Monaco-based project editor with cloud projects at `/projects/:id` | Vuetify users | **Live but stale — zombie candidate** (Nuxt build id 2026-01-29 17:20 UTC, ~6.5 months; only Nuxt property) | **Yes — cloud projects are subscriber-only** (§2.5); also the only surviving front-end for SendOwl purchase downloads |
| Vuetify Issues | `issues.vuetifyjs.com` | **UNKNOWN** | Bug tracker / feature-request browser | Community + maintainers | **Live** (deploy 2026-07-02) | Sign-in; reads `/one/bins` and `/one/playgrounds` for reproductions |
| Vuetify Store | `store.vuetifyjs.com` | **UNKNOWN** (Shopify-hosted) | Shopify storefront selling themes, templates, Figma UI kits and support packages | Teams buying artefacts | **Live, actively merchandised** (41 products, newest published 2026-03-04) | Separate commerce rail; no One integration observed in the storefront |
| Vuetify API | `api.vuetifyjs.com` | **UNKNOWN** | The backend for every property: OAuth 2.1 server, One subscriptions, playgrounds/bins/links storage, ad & sponsor content, docs Ask-AI | All properties | **Live, central** (root `404`, endpoints respond) | It *is* the entitlement authority |
| Vuetify MCP (hosted) | `mcp.vuetifyjs.com` | `gh:vuetifyjs/mcp` (public, 106★) | Remote MCP server (`v0.9.1`), OAuth-protected via `api.vuetifyjs.com` | AI agents / IDE users | **Live**, repo pushed 2026-08-16 | OAuth via One; scope `mcp` |
| Vuetify New / TryVuetify | `vuetify.new` | `gh:vuetifyjs/tryvuetify` (public) | "Try the latest version of Vuetify with Yarn, Npm, or Pnpm" | New users | **Live but stale** (deploy 2025-05-18, ~15 months) | No |
| `try.vuetifyjs.com` | — | — | — | — | **Does not resolve** (NXDOMAIN 2026-08-16) | — |
| `ots.vuetifyjs.com` | — | — | — | — | **Does not resolve** (NXDOMAIN 2026-08-16) | — |
| Nuxt module docs | `nuxt.vuetifyjs.com` | `gh:vuetifyjs/nuxt-module` (public, 284★) | Zero-config Nuxt module for Vuetify + its docs | Nuxt users | **Live** (deploy 2026-08-02) | No |
| pkg-diff | `pkg-diff.vuetifyjs.com` | `gh:vuetifyjs/pkg-diff` (public) | Client-side npm version differ (Rust→Wasm) | Maintainers | **Live** (deploy 2026-07-26) | No |
| DevKey | `devkey.vuetifyjs.com` | `gh:vuetifyjs/devkey` (public) | Explicitly "an example project… Not a real product" — a v0 reference implementation | v0 evaluators | **Live demo** (deploy 2026-07-12) | No |
| Support redirect | `support.vuetifyjs.com` | — | 302 → `vuetifyjs.com/en/introduction/enterprise-support/` | Enterprise buyers | **Live redirect** | Commercial funnel |
| Community redirect | `community.vuetifyjs.com` | — | 302 → `discord.gg/vuetify` | Community | **Live redirect** | Discord roles are a sponsor perk (§2) |
| Analytics | `swetrix-api.vuetifyjs.com`, `swetrix.vuetifyjs.com` | `gh:vuetifyjs/swetrix-selfhosting` | Self-hosted Swetrix; every property reports to it with its own project ID | Core team | **Live** | No |
| Builder | *not deployed* | this repo, `apps/builder` on `origin/feat/builder` | Wizard that assembles a v0 app and emits a zip + a v0play URL | v0 adopters | **Branch only** — draft PR #241, last commit 2026-08-04 | No |
| `@paper/*` design systems | — | this repo, `packages/emerald`, `packages/genesis`, `packages/paper` | Design systems and kits on v0 | Design-system consumers | Mixed — see §6 | No |

### Hosts that resolve but were not in the original list

Fourteen more first-party hosts are live (`live:` all 2026-08-16). Most were found by
grepping the core docs and `@vuetify/one` for `*.vuetifyjs.com` and then probing.

| Host | What it is | State |
|---|---|---|
| `support.vuetifyjs.com` | 302 → `vuetifyjs.com/en/introduction/enterprise-support/` | Redirect |
| `community.vuetifyjs.com` | 302 → `discord.gg/vuetify` | Redirect |
| `discussions.vuetifyjs.com` | 301 → `github.com/vuetifyjs/vuetify/discussions` | Redirect |
| `figma.vuetifyjs.com` | 302 → `figma.com/community/file/1266515419060480209` | Redirect |
| **`vtfy.link`** | 301 → `link.vuetifyjs.com/` — a vanity apex domain for the shortener | Redirect |
| `cdn.vuetifyjs.com` | Asset CDN (logos, theme thumbnails, suit backgrounds, 14 avatars) | Live, 404 at root |
| `mcp.vuetifyjs.com` | Hosted MCP server, `0.9.1` | Live (§7.3) |
| `status.vuetifyjs.com` | Status page — "No problems detected. \| Vuetify Documentation Status" | Live |
| `glitchtip.vuetifyjs.com` | Self-hosted GlitchTip (Sentry-compatible) error tracking; the docs' `@sentry/vue` target | Live |
| `swetrix-api.vuetifyjs.com`, `swetrix.vuetifyjs.com` | Self-hosted Swetrix analytics | Live |
| `v3.vuetifyjs.com` | Vuetify 3 docs archive | Live, last deploy **2026-08-07** |
| `v2.vuetifyjs.com` | Vuetify 2 docs archive (HeroDevs EOL) | Live, last deploy **2025-08-08** |
| `v15.vuetifyjs.com` | Vuetify 1.5 docs archive | Live, last deploy **2025-03-12** |
| `next.vuetifyjs.com`, `dev.vuetifyjs.com` | Both return the production docs title; what they serve is **UNKNOWN** | Live |

Not live: `links.vuetifyjs.com` (plural — the host is the singular `link.`),
`issues-next.vuetifyjs.com` (referenced in a core-docs blog post), `ots.vuetifyjs.com`,
`try.vuetifyjs.com`, `builder.`/`create.`/`new.vuetifyjs.com`, and
`emerald.`/`genesis.`/`paper.`/`onyx.vuetifyjs.com`.

So the true property count is higher than the brief assumed: **19 live first-party
web properties plus 5 redirect hosts plus 3 versioned docs archives**, on top of the
npm packages.

### Everything is one deployment platform

Every first-party host except the Shopify store answers with `via: 1.1 Caddy` behind
`server: cloudflare` (`live:` all hosts). This repo deploys through
`vuetifyjs/coolify-action` (`.github/workflows/docs-deploy.yml:54`,
`.github/workflows/playground-deploy.yml:38`), so the fleet is self-hosted on Coolify
with Cloudflare in front. `store.vuetifyjs.com` answers `powered-by: Shopify`.

---

## 2. Subscriber / monetization surfaces

There are **nine** distinct places money can enter, on six different billing systems.

| Rail | Billing system | Where it is asked for | Evidence |
|---|---|---|---|
| GitHub Sponsors (recurring) | GitHub | `github.com/sponsors/johnleider`, linked from core `FUNDING.yml` and v0 docs | `gh:vuetifyjs/vuetify .github/FUNDING.yml`; `apps/docs/src/constants/services.ts:8` |
| Open Collective (recurring) | Open Collective / Open Source Collective | `opencollective.com/vuetify`, linked from core `FUNDING.yml` | same `FUNDING.yml`; `live:opencollective.com/vuetify` |
| Tidelift | Tidelift | `FUNDING.yml` only — no first-party surface found | `gh:vuetifyjs/vuetify .github/FUNDING.yml` |
| Vuetify One subscription | Stripe, via `api.vuetifyjs.com/one/subscribe` | `vuetifyjs.com/one`, One dashboard, every property's user menu | `gh:vuetifyjs/vuetify packages/docs/src/components/one/SubscribeCard.vue` |
| Snips all-access (one-time) | Stripe payment links | `snips.vuetifyjs.com/all-access` | `bundle:snips.vuetifyjs.com` |
| Store / Services | Shopify (store) and Stripe payment links (v0 services) | `store.vuetifyjs.com`; `0.vuetifyjs.com/services` | `live:store.vuetifyjs.com/products.json`; `apps/docs/src/constants/services.ts:2` |
| Third-party ads (indirect) | Carbon Ads / BuySellAds | `vuetifyjs.com` docs pages | `gh:vuetifyjs/vuetify packages/docs/src/components/promoted/Carbon.vue` — `//cdn.carbonads.com/carbon.js?serve=CWYDC27W&placement=v3vuetifyjscom`; `packages/docs/public/ads.txt` is a full BuySellAds authorized-sellers file ending `OWNERDOMAIN=vuetifyjs.com` |
| **Discord subscriber tiers** | Discord server subscriptions | `vuetifyjs.com/en/introduction/enterprise-support/` | `gh:vuetifyjs/vuetify packages/docs/src/components/introduction/DiscordDeck.vue` — Wood `$2.99/mo`, Gold `$19.99/mo`, Planetary `$99.99/mo`, all → `discord.com/invite/jZq4rzazEr` |
| **PayPal one-time** | PayPal | `vuetifyjs.com/en/introduction/sponsors-and-backers/` | `packages/docs/src/pages/en/introduction/sponsors-and-backers.md:27` — "One-time donations can be made through [PayPal](https://paypal.me/vuetify)" |
| Enterprise sponsorship (custom-priced) | Invoice / bespoke | `vuetifyjs.com/en/sponsor/` | `packages/docs/src/components/sponsor/FAQ.vue:38` — "Pricing is custom. Email sponsor@vuetifyjs.com" |

### 2.1 `FUNDING.yml` — verbatim

```yaml
# These are supported funding model platforms

github: [johnleider]
open_collective: vuetify
ko_fi: # Replace with a single Ko-fi username
tidelift: npm/vuetify
custom: # Replace with a single custom sponsorship URL
```

That exact file appears **twice**: at `gh:vuetifyjs/vuetify .github/FUNDING.yml` and,
byte-identical, at `gh:vuetifyjs/.github .github/FUNDING.yml` — the latter being the
org-wide default that applies to every repo without its own. So the org default is set,
and `gh:vuetifyjs/0` inherits it despite having no `FUNDING.yml` of its own.

Three things follow. GitHub Sponsors points at a **personal** account (`johnleider`), not
an org account, for the whole organisation. `ko_fi` and `custom` are unfilled template
stubs. And `tidelift: npm/vuetify` is wired at the org level even though no first-party
page markets it — the only Tidelift call-to-action in the org is in individual repo
READMEs (`create`, `eslint-config-vuetify`, `eslint-plugin-vuetify`: *"Becoming a
subscriber on Tidelift"*).

`gh:vuetifyjs/.github profile/README.md` — the org landing page — funnels to only four
properties: `vuetify.new`, `play.vuetifyjs.com`, `issues.vuetifyjs.com` and
`community.vuetifyjs.com`. Neither One nor the store nor v0play is on it.

### 2.2 The sponsor tier that grants One — the single most important coupling

The public GitHub Sponsors tier list for `johnleider` (`live:github.com/sponsors/johnleider`,
2026-08-16) reads:

| Tier | Reward (verbatim) |
|---|---|
| $1 a month | "❤️ A **BIG Thank You** for supporting Vuetify!" |
| $3 a month | "👑 **Vuetify One Access**. Requires login with GitHub on documentation." |
| $5 a month | "🔰 Everything from the $1 tier / ☕ An even **BIGGER Thank You** for bringing coffee!" |
| $10 a month | "🛡️ Everything from the $5 tier / 🛸 Sponsors only role and channel in our Discord community" |
| $250 a month | "✨Your medium logo and link on the homepage of vuetifyjs.com; (600k+ impressions per month)" |
| $500 a month | large homepage logo + "🐦 A tweet from the official Vuetify X (30k followers)" |
| $1,500 a month | "👀 Your large logo and link will be added to every page in the documentation on vuetifyjs.com (10m+ impressions per month)" |
| $2,000 a month | "⛰️ The Vuetify0 Primary Sponsor slot. One company at a time… 📦 Logo on the repo README at github.com/vuetifyjs/0." |

So **Vuetify One entitlement is currently reachable through GitHub Sponsors at $3/month**,
and the tier text itself says it "Requires login with GitHub on documentation". This is
why `@vuetify/auth`'s user model carries a `sponsorships` array (below) rather than a
single subscription field: sponsorship *is* an entitlement path.

Note the tier ladder is not sorted by reward: the $1 and $3 descriptions appear swapped
relative to the $5/$10 "Everything from the $N tier" chain (`live:` same page). Treat the
$1/$3/$5 mapping as **reported-as-rendered, semantics UNKNOWN**.

### 2.3 The same sponsorship product exists twice, with divergent copy

Open Collective (`live:opencollective.com/vuetify/contribute`) exposes 5 tiers:

| OC tier | Description (verbatim) |
|---|---|
| Backers (flexible, monthly) | "Support us with a monthly donation and help us continue our activities." |
| $150 a month | "✨your company logo and link on vuetifyjs.com Sponsors and Backers page" |
| $250 a month | "medium logo and link will be put at the homepage of vuetifyjs.com; (**200k+** impressions per month)" |
| $500 a month | "large logo and link at the homepage… (**200k+** impressions per month)" + Readme logo + X tweet |
| $1,500 a month | "right sidebar of every documentation page on vuetifyjs.com (**3m+** impressions per month)" |

The $250 / $500 / $1,500 rungs are duplicated across GitHub Sponsors and Open Collective
with **different impression claims** — 600k vs 200k for the homepage, 10m vs 3m for the
docs. At least one set is stale. Open Collective also has a $150 rung with no GitHub
Sponsors equivalent, and no Open Collective tier mentions Vuetify One access.

Public, sourced counts from that page (not revenue): `BackersStatsType` reports
`all: 250`, `users: 163`, `organizations: 86`; fiscal host is Open Source Collective.

And a **third** ladder is published in the core docs with different names and a different
bottom rung — `gh:vuetifyjs/vuetify packages/docs/src/pages/en/introduction/sponsors-and-backers.md`:
Diamond "pledged $1,500 per month" (line 50), Platinum "$500 per month" (58), Gold
"$250 per month" (66), Silver "$150 per month" (74), plus Special / Service / Affiliate
tiers, PayPal one-time, GitHub Sponsors, Open Collective and Tidelift. So the same
$150–$1,500 inventory is described three times, under three naming schemes, with two
different impression claims.

A **fourth**, separate ladder sells Discord access rather than logo placement
(`packages/docs/src/components/introduction/DiscordDeck.vue`, rendered on
`pages/en/introduction/enterprise-support.md:22`): Wood `$2.99/mo` ("Start free trial",
perks `#subscribers` / `#subscriber-help`), Gold `$19.99/mo` (adds `🔥dev-stream`),
Planetary `$99.99/mo` (adds a private channel with the core team). These names are why
`cdn.vuetifyjs.com` serves `wood-subscriber.png`, `gold-subscriber.png` and
`planetary-subscriber.png` avatars (§2.5) — the Discord tiers have their own identity
inside One.

**Dead commercial code in the core docs.** `packages/docs/src/components/introduction/SlaDeck.vue`
carries three live Stripe payment links — Galaxy `$250/mo`, Cosmic `$500/mo`, Multiverse
`$1,000/mo` — but no page imports `IntroductionSlaDeck`. The same is true of
`EnterpriseDeck.vue` (Calendly links), `EnterpriseForm.vue` (an EmailJS lead form) and
`DirectSupport.vue`. Those are the *same three tier names and prices* the v0 docs sell
live at `0.vuetifyjs.com/services` (§2.7) — with **different** Stripe links. Whether the
core-docs versions render in production is **UNKNOWN**; they are unreferenced in source.

### 2.4 Vuetify One — the advertised product

`vuetifyjs.com/one` is composed of five components
(`gh:vuetifyjs/vuetify packages/docs/src/pages/en/one.md`), and the price table is
hardcoded in `packages/docs/src/components/one/SubscribeCard.vue`:

```ts
const prices = {
  solo: { month: '2.99 /month',  year: '29.99 /year' },
  team: { month: '29.99 /month', year: '299.99 /year' },
}
```

Solo is labelled "For individual developers"; Team is "For teams up to 25 members" and
carries a "Best Value" chip. Default selected interval is `year`. Checkout calls
`one.subscribe(interval, type)`, i.e. the `/one/subscribe` redirect (§5.1).

Advertised feature list, verbatim from the same file — note which items carry a **`soon`**
flag, meaning they are advertised on the pricing card but not shipped:

| Solo | Flag |
|---|---|
| "Ad-free experience across all Vuetify properties" | — |
| "Private playgrounds, bins, links, and studios with cloud sync" | — |
| "Premium documentation features (pinned nav, rail menu, copy page as markdown)" | — |
| "Early access to new tools and features" | — |
| "Vuetify MCP API (access to your one data anywhere that supports MCP)" | `new: true` |
| "Share live updates on Bins and Playgrounds" | **`soon`** |
| "Embed playgrounds in your own documentation" | **`soon`** |

| Team | Flag |
|---|---|
| "Everything in Solo, for up to 25 members" | — |
| "Centralized team billing and member management" | — |
| "Shared playgrounds and code snippets" | — |
| "Team shared Private Bins and Playgrounds" | **`soon`** |
| "Usage analytics dashboard" | **`soon`** |

The FAQ on the same page states the position on free vs paid, verbatim
(`packages/docs/src/components/one/FAQ.vue`):

> "Nothing changes. Vuetify remains free and open source forever."
> "Subscriptions give you access to premium features across Vuetify properties.
> Sponsoring through GitHub or Open Collective is a way to support development without
> needing those features. Both help fund the project."
> "We don't offer a trial, but you can cancel anytime within the first 30 days for a full
> refund."

That second answer is worth holding next to §2.2: the FAQ frames sponsorship as
*not* an entitlement path, while the $3/month GitHub Sponsors tier explicitly grants
"Vuetify One Access" and `@vuetify/auth` models sponsorships as entitlements (§5.2).

**`OneProperties.vue` is the canonical "what One unlocks where" list** — and it omits
v0play. Verbatim entries (`packages/docs/src/components/one/Properties.vue`):

| Property listed | Features claimed |
|---|---|
| Vuetify Play (`play.vuetifyjs.com`) | "Private playgrounds", "Cloud sync", "Version history" |
| Vuetify Bin | "Private bins", "Embeds", "Real-time editing" |
| Vuetify Studio | "Visual editor", "Component library", "Export code" |
| Vuetify Link | "Click analytics", "Custom slugs", "QR codes" |
| Vuetify Issues | "Guided forms", "Auto-validation", "Issue tracking" |
| Documentation (`vuetifyjs.com`) | (list truncated in read; docs-side premium features) |

Several of these claims could not be verified against shipped code — "Version history",
"QR codes" and Studio's "Export code" appear in no bundle inspected here. Treat the
Properties list as **marketing copy, not a verified feature matrix**.

### 2.5 What Vuetify One verifiably gates in shipped code

`@vuetify/one` (npm `4.1.0`) is installed in every satellite property. Its subscriber
predicate, from `bundle:one.vuetifyjs.com`, is:

```js
T = R(() => !r.url || n.isAdmin || h.value?.isActive || d.value.some(A => ["one","one/team"].includes(A)))
// exported as `isSubscriber`
```

Read in order: **no API URL configured → treated as a subscriber**; or admin; or an
active `sub_*` Stripe sponsorship; or the verify response's `access[]` array contains
`one` or `one/team`.

`access[]` is the ecosystem-wide capability list. The strings observed in shipped code
are `one`, `one/team`, `snips/app-ui`, `snips/marketing`, `snips/ecommerce`, `snips/team`
— with `hasAllAccess = hasAppUI && hasMarketing && hasEcommerce`
(`bundle:snips.vuetifyjs.com`). One entitlement and Snips entitlements share one array.

#### Cosmetic gates in the shared `@vuetify/one` chrome

| Gated thing | Code evidence (`bundle:snips.vuetifyjs.com`, `@vuetify/one` chunk) |
|---|---|
| Premium docs/app themes — Blackguard, Nebula, Odyssey, High Contrast | each theme object carries `disabled: !t.isSubscriber`, and the card renders `subtitle: S.disabled ? "Unlock with Vuetify One" : S.subtitle` |
| "Suits" (whole-app cosmetic skins, e.g. Odyssey app-bar/drawer/footer imagery) | `if (!n.one.suits.suit \|\| !n.one.suits.enabled \|\| !t.isSubscriber) return {}` |
| Subscriber avatars | `n.isSubscriber && l.unshift("https://cdn.vuetifyjs.com/docs/images/avatars/one.png")`, plus `*-subscriber.png` variants |
| Avatar picker itself | `function r () { n.isSubscriber && (i.value = !i.value) }` |
| Banner / notification preference controls | rendered under `A(t).isSubscriber ? … : Pe("",!0)` |
| User badges | `n.github \|\| n.discord \|\| n.isSubscriber \|\| t.user?.isAdmin` |

#### Functional gates on the creation properties — including Save itself

These are **not** in `@vuetify/one`; they live in each app's own lazily-loaded route
chunks, which is why they are invisible from a property's main bundle.

**`play.vuetifyjs.com` — cloud Save is subscriber-only.** From
`PlaygroundSaveAction` in `live:play.vuetifyjs.com/assets/default-CNVf6ojt.js`:

```js
async function u () {                       // the Save button's click handler
  try {
    if (s.user || await v(), !r.isSubscriber) { d(); return }   // r = one store
    _()                                     // _ = the actual playgrounds.store() call
  } catch {}
}
function d () {                             // not a subscriber → divert to checkout
  e.push({ query: { ...o.value, one: 'subscribe' } })
  Q.set(n.data)                             // park the unsaved payload
}
// on mount: resume after returning from checkout
onMounted(async () => {
  const m = Q.get()
  if (m && r.isSubscriber && o.value.save === 'continue') { Q.clear(); _(m) }
})
```

So on the legacy playground, pressing Save signs the user in, and then — if they are not
a subscriber — routes them to `?one=subscribe`, stashes their work, and completes the save
only after the subscription exists. That is a paywall with a resume path, not an
authentication prompt.

**`bin.vuetifyjs.com` — same pattern, same shape.** From
`live:bin.vuetifyjs.com/assets/default-DYiEVt7i.js`:

```js
if (!u.isSubscriber) {
  a.push({ query: { ...t.value, one: 'subscribe' } })
  localStorage.setItem('vuetify@one-bin-save',
    JSON.stringify({ code: n.code, encoded: n.encoded, lang: n.language }))
  return
}
```

**`link.vuetifyjs.com` — most of the product is gated.** From
`live:link.vuetifyjs.com/assets/LinkForm-B6Sxhjpt.js`, every one of these fields carries
`disabled: !isSubscriber`: custom slug ("Custom Link" / "Your Creepy Link"), the
scoped-vs-global toggle, "Expiration Date (Optional)", password protection and its
password field, and the redirect "Timer (seconds)". The form renders a `Subscribe` button
pointing at `https://vuetifyjs.com/one`. And the per-link analytics route hard-blocks,
verbatim from `live:link.vuetifyjs.com/assets/_id_.analytics-C92en7kM.js`:

```js
if (!R.isSubscriber) { z.showError('Analytics requires a Vuetify One subscription'); H.value = false; return }
```

That page otherwise shows Total Visits, Unique Visitors, Countries, Device, Referrer,
Recent Visits and Last Visit — i.e. the "Click analytics" claim in §2.4 is real and paid.

**`studio.vuetifyjs.com` — cloud projects are gated, with the same resume flow.** From
`live:studio.vuetifyjs.com/_nuxt/Bpx2eRwK.js`, the projects dashboard's empty state when
`!isSubscriber` is, verbatim: title `"Start Saving Your Projects"`, body
`"Subscribe to Vuetify One to store and organize your studio projects in the cloud."`,
action `"Subscribe to Vuetify One"`, `to: "?one=subscribe"`. And the same
park-then-resume mechanic:

```js
if (t.value = false, o.pendingSave) {
  const d = a.isSubscriber ? { save: 'continue' } : { one: 'subscribe' }
  e.push({ path: '/', query: d })
}
// snackbar text: "Proceed back to save your project" / action "Continue Saving"
```

**`v0play.vuetifyjs.com` — nothing is gated.** A grep of the entire `apps/playground` and
`apps/docs` source trees for `isSubscriber`, `sponsorship` or any subscription check
returns **no hits** (`rg -n 'isSubscriber|sponsorship' apps/playground/src apps/docs/src`).
Cloud save is authentication-only: the sole failure path is
`if (res.status === 401) throw new Error('Sign in required')`
(`apps/playground/src/composables/useOnePlaygrounds.ts:260,287`).

**This is the sharpest fact in the inventory.** All four legacy creation properties —
Play, Bin, Link and Studio — gate cloud persistence behind a Vuetify One subscription,
using the same park-the-payload-and-resume funnel. The newest and most actively shipped
creation property gives that same capability away for free with an account, and contains
no subscriber check of any kind.

#### The ad-free gate

The "Disable Ads" switch is rendered
only for subscribers, and the docs read the resulting user setting to decide whether to
mount Carbon Ads:

```js
// @vuetify/one settings sheet, bundle:bin.vuetifyjs.com — the switch is inside an
// isSubscriber branch; o is the inverted binding on user.one.ads.enabled
o = k({ get: () => !a.one.ads.enabled, set: u => { a.one.ads.enabled = !u } })
// label:"Disable Ads", messages:"Disable traditional advertisements on all documentation pages."
```

```vue
<!-- gh:vuetifyjs/vuetify packages/docs/src/components/promoted/Entry.vue -->
<PromotedCarbon v-if="user.one.ads.enabled" />
<VoPromotionsCardVuetify v-else-if="user.one.ads.house" />
```

Defaults are `ads: { enabled: !e.disableAds, house: e.showHouseAds || false }`
(`bundle:bin.vuetifyjs.com`), i.e. ads on unless the server-persisted `disableAds` flag
is set. A non-subscriber has no UI to set it. House ads (Vuetify's own promotions) remain
available as the opt-in alternative.

#### Docs gates

**The docs site adds four more.** These live in `vuetifyjs.com`'s own bundle,
not in `@vuetify/one`, which is why they are invisible from the satellite properties.
From `bundle:vuetifyjs.com` (`/assets/index-BsKjhE3E.js`, 18 `isSubscriber` sites):

| Docs feature | Gate | i18n key |
|---|---|---|
| Disable Ads | `disabled: !isSubscriber, readonly: !isSubscriber` | `dashboard.perks.disable-ads` |
| Rail drawer | `disabled: !isSubscriber` | `dashboard.perks.rail-drawer` |
| Page pins (marked **NEW**) | `disabled: !isSubscriber`; the per-page "Pin" action requires `isSubscriber && ecosystem.docs.pins.enabled` | `dashboard.perks.enable-pins` |
| **Copy Page as Markdown** | `disabled: !isSubscriber` | `copy-as-markdown` |

Two of those render an explicit upsell tooltip, verbatim:
`{ disabled: isSubscriber, text: "Subscribe to Vuetify One for access" }`. The i18n
namespace is literally `dashboard.perks.*` — the docs treat these as One "perks", and the
complete perks list in that bundle is exactly three: `disable-ads`, `rail-drawer`,
`enable-pins`.

#### Summary of verified gates

| Property | Subscriber-gated | Free with an account |
|---|---|---|
| `play.vuetifyjs.com` | **cloud Save**, premium themes, suits, avatars | edit, run, share via URL hash |
| `bin.vuetifyjs.com` | **cloud Save**, cosmetics | edit, `/embed/:id` viewing (`200` unauthenticated) |
| `link.vuetifyjs.com` | custom slug, scoping, expiry, password, timer, **analytics** | creating a default short link |
| `snips.vuetifyjs.com` | per-category and team snippet access (one-time purchase, separate from One) | browsing |
| `vuetifyjs.com` | ad-free, rail drawer, page pins, Copy Page as Markdown | all documentation content |
| `studio.vuetifyjs.com` | **cloud projects** | using the editor |
| `0.vuetifyjs.com` | nothing, by stated policy | everything |
| `v0play.vuetifyjs.com` | **nothing** | edit, run, share, export, **cloud save**, fork, private/public |
| MCP (`mcp.vuetifyjs.com`, CLI) | the One API key that exposes your One data to agents | the docs/component tools themselves |

The advertised "Private playgrounds / bins / links" *visibility* flag is a separate
question from Save: v0play sends `visibility: 'private' | 'public'` with no local
subscriber check
(`apps/playground/src/composables/useOnePlaygrounds.ts:239-268`), so whether the API
enforces private-for-subscribers-only is **UNVERIFIABLE** from here.

The One settings schema is versioned and namespaced per property — and again omits
v0play. Verbatim default (`bundle:bin.vuetifyjs.com`):

```js
{ version: 7, ecosystem: { bin: {…}, play: {…}, studio: {}, link: {}, docs: {…}, mcp: {…} },
  one: { avatar, ads, command, theme, direction, colors, suits, notifications, banners,
         quicklinks, ecosystem: { pinned, seen }, sync, devmode } }
```

`ecosystem.docs` carries `api`, `composition`, `pins: {enabled, pinned}`, `mixedTheme`,
`favorites`, `slashSearch`, `railDrawer` — the storage behind the docs perks above.

### 2.6 Vuetify Snips — a real, priced, one-time product

Prices are hardcoded in the Snips Pinia store (`bundle:snips.vuetifyjs.com`):

```js
Xx = Ft("app", { state: () => ({ soon: [], sale: { active: !0, percent: 50 },
  appUIPrice: 74,       appUICompareAtPrice: 149,
  marketingPrice: 74,   marketingCompareAtPrice: 149,
  ecommercePrice: 74,   ecommerceCompareAtPrice: 149,
  allAccessPrice: 149,  allAccessCompareAtPrice: 299,
  teamAllAccessPrice: 399, teamAllAccessCompareAtPrice: 799 }) …
```

Currency symbol is not in that object — **currency UNKNOWN**, presented as `$` on the
page. A 50%-off sale is flagged `active: true`. Checkout is two Stripe payment links
(`bundle:snips.vuetifyjs.com` `all-access` chunk):

- `https://buy.stripe.com/28o3d27c87xc16o14e?prefilled_promo_code=SNIPS50`
- `https://buy.stripe.com/dR67tiaokg3Ig1i8wF?prefilled_promo_code=SNIPS50TEAM`

Page copy, verbatim: *"Gain lifetime access to all of the snippets in the Application UI,
Marketing, and Ecommerce categories for an easy one-time price."* / *"Free updates.
Lifetime access. Unlimited usage."* / *"Unlock all-access for your entire team. Invite up
to 25 people to collaborate on projects and share snippets."*

Entitlement is redeemed server-side: Snips is the only property that calls
`POST /one/snips/activate` (`bundle:snips.vuetifyjs.com`).

**On the discussed free/PWYW pivot:** as deployed on 2026-08-16, Snips is a paid
one-time product with an active 50%-off sale and live Stripe links. No free or
pay-what-you-want path exists in the shipped bundle. Whether a pivot is planned is
**UNKNOWN**.

### 2.7 Vuetify0's own monetization — separate from One

This repo's docs app sells three things, none of which touch One:

**Primary Sponsor slot** — `apps/docs/src/pages/sponsor.md`, priced in
`apps/docs/src/constants/sponsor.ts`:

```ts
export const PRIMARY_SPONSOR: PrimarySponsor | null = null
export const PRIMARY_SPONSOR_PRICE = 2000
export const PRIMARY_SPONSOR_TIER_URL = 'https://github.com/sponsors/johnleider/sponsorships?tier_id=621941'
export const SPECIAL_SPONSOR: SpecialSponsor | null = null
export const SPECIAL_SPONSOR_PRICE = 2000
// TODO(john): paste real $2,000 tier_id from github.com/sponsors dashboard
const SPECIAL_SPONSOR_TIER_ID = ''
```

Both `PRIMARY_SPONSOR` and `SPECIAL_SPONSOR` are `null` at `5d686fc2` — **the slot is
unsold as of this commit**, and the "special" variant's tier ID is still a TODO.

**Direct Support subscriptions** — `apps/docs/src/components/services/ServicesSupportTiers.vue`:

| Tier | Price | Seats | Notable bullet |
|---|---|---|---|
| Galaxy | `$250` | "For 2 developers" | "Direct chat support from the core team on Discord / Same-day response, Monday through Friday" |
| Cosmic | `$500` | "For up to 5 developers" | "Priority on reported v0 and Vuetify GitHub issues" |
| Multiverse | `$1,000` | "For up to 25 developers" | "Monthly strategy session with your team and the creator / Roadmap input and feature prioritization" |

Checkout is three Stripe payment links (`apps/docs/src/constants/services.ts:2-4`).

**Fixed-scope project builds** — `apps/docs/src/components/services/ServicesProjectTiers.vue`:
Custom framework `$5,000` (1–2 weeks), Custom app `$7,500` (2–3 weeks), Custom monorepo
`$10,000` (4–5 weeks); intro call at `https://calendly.com/vuetify/conference-call-30-min`
(`apps/docs/src/constants/services.ts:11`).

And an explicit **anti-gating position**, verbatim from
`apps/docs/src/pages/introduction/why-vuetify0.md:237`:

> "v0 is MIT licensed — every component, composable, and utility. No pro tier, no
> paywalled features, no plans for either."

`apps/docs/src/pages/sponsor.md` reinforces it: *"It isn't ad inventory; Vuetify0 doesn't
run ads, and there are no plans to."*

### 2.8 The store is a fifth, disconnected rail

`live:store.vuetifyjs.com/products.json` returns **41 products** (Shopify). Shape of the
catalogue, from that response:

| Grouping | Evidence |
|---|---|
| Paid third-party admin templates/themes, typically 3 variants around `$59–$99` / `$109–$139` / `$299–$599` | e.g. `Materio - Vuetify 3 - Admin Template` `['139.00','499.00','69.00']` |
| Official Figma UI kits | `Official Vuetify 4 UI Kit for Figma v4.0 — Pro E…` `['279.00','549.00','89.00']`; `Official Vuetify 4 Snips for Figma` `['129.00','399.00','799.00']`; a Free Edition at `0.00` |
| Free themes | `Landing Page Free`, `Berry Free`, `Mantis Free`, `Vite - Vuetify 3 - Theme Free`, `NextKit`, `Portfolio Dark`, all `0.00` |
| **Support sold as products** | `Direct Support (1 Hour)` `$120.00`; `1 Year Galaxy Support Package` `$3,299.00` |
| Newest listing | `Vuetify Blueprint — Inspired by the New York Sty…` `$19.00` (compare `$29.00`), published 2026-03-04 |

The storefront HTML contains **no** reference to `one.vuetifyjs.com` or
`api.vuetifyjs.com` (`bundle:store.vuetifyjs.com`) — only three links to
`snips.vuetifyjs.com`. The only structural link between store and One is that
`@vuetify/auth` supports a `shopify` identity provider (below); what it grants is
**UNKNOWN**.

Note the collision: a support tier called **Galaxy** is sold at `$250/month` on
`0.vuetifyjs.com/services` and as a `$3,299` "1 Year Galaxy Support Package" on the
Shopify store, and `support.vuetifyjs.com` redirects to a third page,
`vuetifyjs.com/en/introduction/enterprise-support/`.

### 2.9 Advertising / promotion inventory is a live, populated system

The public One API serves the ecosystem's own promo inventory (`live:api.vuetifyjs.com`,
all `200` unauthenticated):

| Endpoint | Public count | Sample |
|---|---|---|
| `/one/sponsors` | **22**, all `status: published`, `active: true`, `tier` values from `-2` to `7` | Cloudflare, BrowserStack, Crowdin, Algolia DocSearch (tier 6); VueJobs, Made with Vue.js (tier 5) |
| `/one/promotions` | **88** | "Get Rapidemo", plus many "Vuetify Snips - …" self-promotions |
| `/one/notifications` | **10** | "GitHub Open Source Friday", "Vuetify Link", "v3.6 (Nebula) Release" |
| `/one/banners` | **1** | "Vuetify0 v1.0 is here" (created 2026-07-22) |
| `/one/spots` | **1** | "Vuetify0 v1 Release" (created 2026-07-21) |

Content is CMS-backed and edited through `admin.vuetifyjs.com`, whose route table is
exactly `/sponsors`, `/promotions`, `/spots`, `/banners`, `/notifications`, `/users`,
`/logs`, `/docs-ask`, `/login`, `/401` (`bundle:admin.vuetifyjs.com`). Worth noting:
`vuetifyjs/one` PR #26 was titled "refactor: remove all admin usage" (merged 2025-04-27)
and the word `admin.vuetifyjs.com` appears nowhere in that repo — yet the host is live and
was redeployed 2026-07-27. Which codebase builds it is **UNKNOWN**.

The CMS is **Cosmic JS**, and it is read twice over. The core docs hit Cosmic directly —
`packages/docs/src/composables/cosmic.ts` with `VITE_COSMIC_2_BUCKET_*`, backing
`stores/ads.ts`, `stores/promotions.ts`, `stores/spot.ts`, `stores/sponsors.ts` and
`stores/shopify.ts` (the theme-vendor listings). `@vuetify/one` reads the *same*
collections through `api.vuetifyjs.com/one/{sponsors,promotions,spots,banners,notifications}`.
So sponsor and ad inventory has two independent client paths.

Ad density on the core docs is high: `<PromotedEntry />` is embedded in **199 of 228**
markdown pages under `packages/docs/src/pages`, with a second slot in the right-hand table
of contents (`components/app/Toc.vue:105-117`). Outbound ad links are UTM-tagged
`utm_source=vuetifyads` (`composables/ad.ts:49`) and labelled `ADS VIA VUETIFY`
(`components/promotions/PromotionCard.vue:34`). The service worker deliberately bypasses
`srv.carbonads.net`, `cdn4.buysellads.net`, `pixel.adsafeprotected.com`,
`ad.doubleclick.net` and `tag.researchnow.com` (`packages/docs/src/service-worker.js:65`).

There is also a **sponsor nag with an explicit trigger formula**
(`packages/docs/src/components/sponsor/SnackbarPopup.vue:62`): it fires only when
`!one.isSubscriber && Math.random() > 0.5 && userSessions >= 5 && !localStorage.sponsorPopupDismissed`,
offering GitHub Sponsors, Open Collective and the Discord sponsor channel, and reporting
`sponsorPopupShown` / `sponsorPopupClick` / `sponsorPopupDismissed` to Swetrix. When no
sponsors have loaded, the TOC renders a "Your Logo Here" button pointing at
`github.com/sponsors/johnleider` (`components/app/Toc.vue:89-103`).

Because `isSubscriber` also gates the banner/notification preference panel (§2.5),
"subscribe to control what we show you" is part of the One value proposition.

### 2.10 The ~80% GitHub Sponsors claim

**UNVERIFIED — cannot be checked from any source available here.** GitHub Sponsors
publishes no revenue for `johnleider` (sponsor list shows only "Private Sponsor"
entries), Open Collective's public budget was not read, Stripe and Shopify are not
accessible, and no repo file states a revenue split. What *is* verifiable is that
sponsorship is the only rail wired into the product's entitlement model
(`sponsorships[]` in `@vuetify/auth`, §5) — which is consistent with the claim but is
not evidence for the number.

---

## 3. Creation / share surfaces

Seven properties let a user produce and share an artefact. This is where duplication is
densest.

| | v0play | Play (legacy) | Bin | Link | Snips | Studio | Builder |
|---|---|---|---|---|---|---|---|
| Host | `v0play.vuetifyjs.com` | `play.vuetifyjs.com` | `bin.vuetifyjs.com` | `link.vuetifyjs.com` | `snips.vuetifyjs.com` | `studio.vuetifyjs.com` | none |
| Create | Multi-file REPL (`@vue/repl`) | Multi-file REPL | Paste a snippet | Paste a URL | Browse a catalogue | Monaco-based project editor | Wizard |
| Save (server) | `POST /one/playgrounds` | `/playgrounds/:id` route | `/one/bins` | `/one/links` | `/one/snips/activate` (entitlement) | `/one/studio/projects` | localStorage seam (§4) |
| Canonical URL | `/playgrounds/:id` | `/playgrounds/:id` | `/bins`, `/embed/:id` | short code | category path | `/projects/:id` | n/a |
| Share w/o account | URL hash (zlib+btoa, self-contained) | URL hash | `/embed/:id` returns `200` unauthenticated | the short link | public pages | **UNKNOWN** | emits a v0play URL |
| Embed | **not found** | **not found** | **yes** — `/embed/:id` | n/a | n/a | **not found** | n/a |
| Auth | own dialog on `@vuetify/auth` | `@vuetify/one` | `@vuetify/one` | `@vuetify/one` | `@vuetify/one` | `@vuetify/one` (has a `/401` route) | none |
| Save needs a **subscription**? | **no** | **yes** | **yes** | default link free, everything else paid | purchase-based | **yes** | n/a |
| Cloud sync | debounced autosave, 500 ms | autosave (per v0play's own note: "play uses 100ms after store mutate") | socket.io to `api.vuetifyjs.com` | n/a | n/a | project CRUD with a `pendingSave` resume queue | **UNKNOWN** |
| Analytics ID | (docs/PostHog + Swetrix) | Swetrix `AEQUL1ms1WiI` | Swetrix `iOskPeVuHJ4t` | Swetrix `sl0mkdcMc32W` | Swetrix (own ID) | Swetrix `sKqap3dKP9df` | n/a |

**Studio is more than a theme builder.** Its Nuxt route table is `/`, `/401`,
`/projects/:id`, `/user/dashboard`, its editor chunk is Monaco (3.3 MB, VS Code codicons
and workbench internals), and it persists to `/one/studio/projects` and
`/one/studio/projects/:id` (`bundle:studio.vuetifyjs.com`). One's own product list
describes it as "Visual theme builder" and the `/one` page credits it with "Visual
editor, Component library, Export code" — the shipped app is a project editor with cloud
projects. Its Nuxt build id timestamps at **2026-01-29 17:20:26 UTC**
(`live:studio.vuetifyjs.com/_nuxt/builds/latest.json`), so this is a ~6.5-month-old
build of a substantial app.

Studio is also the **only** property still shipping a purchase-downloads UI: a
`VoDownloadsTable` with "Order ID" / "Items" columns reading `/one/sendowl/downloads`
(`bundle:studio.vuetifyjs.com`). That endpoint is still live (`401` unauthenticated,
`live:api.vuetifyjs.com`), but the newer `@vuetify/one` builds shipped to Bin, Link,
Snips, Issues, Admin and the core docs contain **no** downloads UI at all. SendOwl is
therefore a live delivery vendor whose only remaining front-end is the stalest property
in the fleet.

Sources: `bundle:<host>` for each live property; `apps/playground/src/**` for v0play;
`git show origin/feat/builder:apps/builder/**` for Builder.

### 3.1 v0play in detail

- **Auth**: its own dialog, `apps/playground/src/components/playground/app/PlaygroundAuthDialog.vue`,
  offering GitHub, Discord, Google and Open Collective. Copy is "Sign in to Vuetify One"
  / "Save playgrounds to your account", linking to `https://vuetifyjs.com/one`
  (lines 16-21, 46-79). It uses `useAuthStore` from `@vuetify/auth` — **not**
  `@vuetify/one` (`apps/playground/package.json:15` lists `@vuetify/auth`, and there is
  no `@vuetify/one` dependency).
- **Cloud save**: `apps/playground/src/composables/useOnePlaygrounds.ts` implements the
  full CRUD against `${ONE_API}/one/playgrounds` — `create`, `update`, `patchMeta`,
  `destroy`, `fork`, `fetchById` — with `credentials: 'include'`, 500 ms debounced
  autosave, an owner check (`isOwner`), and `visibility: 'private' | 'public'`
  (lines 40-57, 230-483). `ONE_API` is
  `import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'` (line 57).
- **Share**: self-contained URL hash. `usePlaygroundFiles.ts:300-334` builds the share
  payload; PR #806 describes the encoder as "share hash via existing zlib+btoa encoder".
  The same payload shape is what gets stored as One `content` (`useOnePlaygrounds.ts:3`).
- **Interoperability — the key consolidation datum.** `openPlayground()` accepts three
  payload formats: v0play's own `{files, active, imports, settings}`, **a Vuetify Play
  tuple**, and a legacy plain file map (`usePlaygroundFiles.ts:487-553`). It additionally
  deep-links into the v0 docs registry via `?example=` and into **Vuetify 4 docs
  examples** via `?vuetify=` (`usePlaygroundFiles.ts:118-122`, `573-608`; PR #806: "path
  catalog of public Vuetify docs examples (983 SFCs)… Content loads from
  `raw.githubusercontent.com`").
- **Export**: zip via `client-zip`/`fflate` with a generated `README.md`, plus "Copy
  project" as a multi-file clipboard dump (PR #806;
  `apps/playground/src/util/export-templates/README.md`).
- **Embed mode**: none found.

### 3.2 Overlap, concretely

1. **Two playgrounds, both live, both saving to the same One endpoint.**
   `play.vuetifyjs.com` has a `/playgrounds/:id` route (`bundle:play.vuetifyjs.com`) and
   v0play has the same route, both writing `/one/playgrounds`. A user's saved
   playgrounds are therefore split across two front-ends over one collection, with two
   different editors, two different auth integrations, and two different autosave
   debounces.
2. **Two auth clients.** `@vuetify/one@4.1.0` (Play, Bin, Link, Snips, Issues, Admin,
   One itself) versus bare `@vuetify/auth@0.1.8` (v0play and the v0 docs,
   `apps/playground/package.json:15`, `apps/docs/package.json`). `@vuetify/auth` is the
   lower layer — it is published from the same repo, `packages/auth` of
   `github.com/vuetifyjs/one` (npm `repository.directory` field) — so this is a
   layering split, not two implementations, but it means One's cosmetic gating and
   product chrome are simply absent from the two newest surfaces.
3. **Three ways to share a code artefact**: v0play/Play hash URLs (self-contained, no
   account), Bin (`/bins` + `/embed/:id`, the only embeddable one), and Link (a URL
   shortener that can shorten either).
4. **The `@vuetify/one` product list does not know about the new world.** The
   hardcoded ecosystem menu shipped in every satellite is exactly ten entries — play,
   bin, create, studio, snips, link, mcp, issues, store, figma
   (`bundle:bin.vuetifyjs.com`) — with **no v0play, no `0.vuetifyjs.com`, and no
   admin**. So the app switcher on every property routes users to the *legacy*
   playground.
5. **Studio is the fragmentation tell.** It is the only Nuxt property, has the oldest
   deploy (2026-01-29), is described by One's own product list as "Visual theme builder",
   and overlaps in intent with both the Builder's theme step and the One premium-themes
   feature.

---

## 4. Builder

| Question | Answer | Evidence |
|---|---|---|
| Shipped? | **No.** Branch only, not deployed | `builder.vuetifyjs.com`, `v0builder.`, `create.`, `new.vuetifyjs.com` all NXDOMAIN (`live:` 2026-08-16) |
| Where | `apps/builder/` on `origin/feat/builder` in this repo | `git ls-tree origin/feat/builder -- apps/builder` → 93 files |
| PR | **#241, draft, open** — "chore(builder): complete framework-creation flow, current with v0 master"; opened 2026-05-20, last updated 2026-08-04; `+12,477 −1` across 98 files | `gh pr view 241 --repo vuetifyjs/0` |
| Branch state | 108 commits ahead of `master`, **64 behind**; last commit `70658bfc`, 2026-08-04, John Leider | `git rev-list --count` both directions |
| Predecessor | PR #182 "feat: add framework builder app", opened 2026-04-04, **closed** 2026-05-19 | `gh pr list --repo vuetifyjs/0 --search builder` |
| Package | `@vuetify-private/builder`, `1.0.0-alpha.0`, `private: true` | `git show origin/feat/builder:apps/builder/package.json` |
| Merged into master? | No — no builder commits on `master`, and `apps/builder` does not exist at `5d686fc2` | `ls apps/` → `docs`, `playground` only |

**What it is**, from the PR #241 body verbatim: *"a complete car-configurator wizard for
assembling a v0-based Vue app from selectable plugins and components"* — flow is
*"landing → select plugins (15…) → per-plugin config screens with a live preview aside →
component picker (maturity-aware: draft components are visibly gated) → review build
sheet"*.

**How it relates to v0play** — this is the important part, and it is explicit in the PR:

> **outputs**: a zip starter that installs and builds green, and **a playground URL
> carrying the full plugin configuration**.

> **Playground parity**: payload emits `src/main.ts` so the user's configuration installs
> in the sandbox; `framework.ts` binds through a namespace (vue-repl cannot resolve
> re-exported bindings).

So Builder is already designed as a **producer** of v0play URLs, and both apps share the
same substrate: `@vuetify/v0` workspace, `@paper/genesis`, `fflate`, `shiki`, `pinia`,
`vue-router`, UnoCSS (compare `apps/builder/package.json` on the branch with
`apps/playground/package.json`). It carries its own `engine/zip.ts`, duplicating v0play's
`useExport.ts` zip path.

It also has its own persistence seam rather than using One. From John's PR comment on
2026-07-31: *"**saved builds** (auto-saved multi-build persistence behind an
API-swappable seam in `stores/persistence.ts`, landing resume list + header switcher,
legacy-key migration)"* — i.e. a **third** save-my-work implementation, deliberately
built to be swappable to an API later.

Tests exist: *"`apps/builder` wired into the vitest workspace — 153 tests"* (PR #241).

---

## 5. Platform / API

### 5.1 `api.vuetifyjs.com` is the whole platform

Root is `404` (`live:`), but it hosts at least five subsystems. Endpoint list assembled
from the shipped bundles of every property and from `@vuetify/auth`'s published dist:

| Area | Endpoints | Source |
|---|---|---|
| OAuth 2.1 authorization server | `/oauth/authorize`, `/oauth/token`, `/register`, `/oauth/consent`, `/auth/{provider}/redirect`, `/auth/verify`, `/auth/logout`, `/auth/{identity}/logout` | `live:mcp.vuetifyjs.com/.well-known/oauth-authorization-server`; `bundle:one.vuetifyjs.com`; `@vuetify/auth` dist |
| Device flow (for CLI / MCP) | `/auth/device/{code}/status`, `/auth/device/{code}/authorize` | `@vuetify/auth` dist `stores-ZTrOJ6e2.mjs` |
| One subscription & team | `/one/info`, `/one/subscribe`, `/one/activate`, `/one/modify`, `/one/cancel`, `/one/manage`, `/one/activity`, `/one/team/{id}`, `/one/team/join|leave|remove` | `bundle:one.vuetifyjs.com` |
| User content | `/one/playgrounds`, `/one/playgrounds/{id}`, `/one/bins`, `/one/links`, `/one/studio/projects`, `/one/studio/projects/{id}`, `/one/snips/activate`, `/user`, `/user/settings` | `bundle:*`; `apps/playground/src/composables/useOnePlaygrounds.ts:231-478` |
| Commerce delivery | `/one/sendowl/downloads` (`401` unauthenticated) | `bundle:studio.vuetifyjs.com`; `live:` |
| Public CMS content | `/one/sponsors`, `/one/banners`, `/one/spots`, `/one/promotions`, `/one/notifications` | `live:` — all `200` unauthenticated |
| API keys / MCP tokens | `/one/mcp/getToken`, `/one/mcp/{slug}` | `@vuetify/auth` dist |
| Docs AI + feedback | `/docs/ask` (rate-limited; client throws "Rate limit exceeded" on 429), `/docs/feedback` | `apps/docs/src/composables/useAsk.ts:90,387`; `apps/docs/src/components/docs/DocsFeedback.vue:23` |
| GitHub proxy | `/github/commits`, `/github/releases?page=`, `/github/releases/find?tag=` | `gh:vuetifyjs/vuetify packages/docs/src/stores/commits.ts:24`, `releases.ts:36,64` |
| Realtime | socket.io / `engine.io` transport | `bundle:bin.vuetifyjs.com` (`Wo("https://api.vuetifyjs.com")`, `path:"/engine.io"`) |

`GET /auth/verify` returns `{"user":null,"access":[]}` unauthenticated (`live:`), which
matches the `AuthVerifyResponse` type below. `/one/playgrounds`, `/one/bins` and
`/one/links` return `401 Unauthorized` (`live:`) — user content is properly closed.

The host is **never named in the core-docs or `vuetifyjs/one` source**. Both inject it as
`VITE_API_SERVER_URL`, described in `packages/docs/.env.example` as the
"# Private authentication API" and supplied in CI from `secrets.API_SERVER_URL`. It is
hardcoded in `vuetifyjs/one`'s CI (`VITE_API_SERVER_URL: https://api.vuetifyjs.com`) and as
a literal fallback in this repo (`apps/playground/src/composables/useOnePlaygrounds.ts:57`);
notably the playground deploy workflow does **not** set the variable, so production v0play
uses that fallback.

### 5.2 The identity model

`@vuetify/auth@0.1.8` (`repository.directory: packages/auth` of `vuetifyjs/one`,
`time.modified` 2026-02-25) publishes these types verbatim
(`dist/index-C4NaBbnK.d.mts` from `npm pack @vuetify/auth@0.1.8`):

```ts
interface VOneSponsorship {
  id: string; platform: string; interval: 'month' | 'year' | 'once';
  target: string; tierName: string; amount: number; isActive: boolean; createdAt: Date;
}
type VOneRole = 'super' | 'admin' | 'editor' | 'user';
interface VOneUser {
  id: string; isAdmin: boolean; role: VOneRole; name: string; shortid: string;
  picture: string; settings: Record<string, any> | null; createdAt: string;
  identities: VOneIdentity[]; sponsorships: VOneSponsorship[]; team: VOneTeam;
}
type AuthProvider = 'github' | 'discord' | 'shopify' | 'google' | 'opencollective';
interface AuthVerifyResponse { user: VOneUser | null; access: string[] }
```

Four things worth flagging:

1. **`sponsorships` is plural and multi-platform.** `bundle:one.vuetifyjs.com` reads it
   with `platform === "stripe" && tierName.startsWith("sub_")` for billing,
   `platform === "github"`, `platform === "discord"` and an `opencollective` branch for
   badges, and sums `interval === "month" ? amount : amount/12` into a `monthlyTotal`.
   One's entitlement model already unifies Stripe subscriptions, GitHub Sponsors, Discord
   and Open Collective.
2. **`AuthProvider` includes `shopify`** — the store is modelled as an identity provider
   even though the storefront shows no One integration.
3. **`access: string[]`** is a coarse capability list; `isSubscriber` checks for the
   literal strings `one` and `one/team`, and Snips checks `snips/team`
   (`bundle:one.vuetifyjs.com`).
4. **Login is a popup, not a redirect**: `window.open(`${http.url}/auth/${provider}/redirect`,
   "vuetify:authorize:popup", …)` then `postMessage({type:"auth-request"}, http.url)`,
   origin-validated, with a hard 120-second timeout; the session cookie is named **`sx`**
   and `verify()` short-circuits when it is absent
   (`gh:vuetifyjs/one packages/auth/src/stores/auth.ts`). One's own login additionally
   honours a `redirect_uri` query param but **only** when it starts with
   `https://api.vuetifyjs.com/` (`packages/one/src/stores/auth.ts`).
5. **A `shopify` provider was removed, and it took the store integration with it.**
   `vuetifyjs/one` PR #53 (merged 2026-06-08, the `4.0.0` breaking release) deleted the
   Shopify provider *and* "the Sendowl-backed **Downloads** feature", with the PR body
   noting Shopify "was only an auth/identity provider plus a product-catalog fetch — never
   part of the payment flow (Stripe handles all billing)". `AuthProvider` in the published
   `0.1.8` tarball still lists `'shopify'` because that build predates the removal — which
   also explains why Studio, running the pre-4.0 One, is the only property still showing the
   SendOwl downloads table (§3). **The store and One are now fully decoupled.**

**Cloud settings sync is the real integration mechanism, and it is not paywalled.**
`gh:vuetifyjs/one CLAUDE.md` states user settings have "two sources of truth" —
`localStorage['vuetify@user']` and the server's `user.settings` — reconciled by a 500 ms
debounced `POST /user/settings` plus a pull-on-change guarded by an `externalUpdate` flag
(`packages/one/src/stores/auth.ts`). The synced blob is namespaced per property:
`ecosystem.{bin,play,studio,link,docs,mcp}` plus a cross-property `one.*`. `sync` defaults
to `true` for any signed-in user and is toggleable from the user menu — **no `isSubscriber`
check**. A seven-step migration chain lives in `packages/one/src/stores/migrations.ts`.

This is what "the ecosystem" concretely means: Play, Bin, Studio, Link, Docs and MCP each
keep their per-user editor preferences inside One's synced blob, so settings follow a user
across properties. v0play does not participate — there is no `ecosystem.v0play` namespace.

### 5.3 Shared clients

`gh:vuetifyjs/one` is a two-package pnpm monorepo (root `@vuetify/one-monorepo`,
`private: true`), and both packages are published:

| Package | Version | Used by | Note |
|---|---|---|---|
| `@vuetify/auth` | `0.1.8` (npm, modified 2026-02-25) | this repo's `apps/playground` and `apps/docs` (`catalog:` → `0.1.8`, `pnpm-lock.yaml:102`) | Extracted from One in PR #48 (2026-02-04). Peers on `pinia` + `vue` only — **no `vuetify` dependency**. Exports `useAuthStore`, `useHttpStore`, `useDeviceStore`, `useApiKeyStore`, `createAuth`, `createAuthPlugin`. Its npm build predates PRs #53/#54, so **the published tarball is behind `master`** |
| `@vuetify/one` | `4.1.0` (npm, modified 2026-08-13) | core docs (pinned `^4.0.0`), Play, Bin, Link, Snips, Issues, Admin, Studio, and the One SPA itself | 66 declared components, 12 installed globally by `createOne()`; peers on **`vuetify ^4.0.0`**. Also *is* the `one.vuetifyjs.com` SPA (its own `Dockerfile` → nginx → Coolify image `one`) |
| `@vuetify/playgrounds` | — | — | **Not found.** No such npm package, no reference in this repo, in `vuetifyjs/one`, in the core docs, or in any inspected bundle. If planned, it exists only as an intention — **UNKNOWN** |

**`@vuetify/one` has no dependency on `@vuetify/v0` at all** — a grep of every file in
`vuetifyjs/one` returns zero occurrences. It is a Vuetify 4 library. The only trace of v0
in the entire repo is an orphaned `'vuetify-0'` icon alias in
`packages/one/src/icons/index.ts` with no `ECOSYSTEM_ACTIONS` entry and no usage anywhere.
That is the structural reason v0play cannot simply adopt One: doing so would pull Vuetify 4
into a headless-v0 app.

**Site identifiers are a typed union that does not include v0play.** Declared identically
in `packages/one/src/stores/banners.ts` and `spots.ts`:

```ts
site: ('*' | 'dev' | 'vbin' | 'vplay' | 'docs' | 'home' | 'server' | 'v3')[]
```

The core docs register as `['docs', 'home']` (`packages/docs/src/plugins/pinia.ts:17-22`).
v0play registers itself as **`'vzero'`** (`apps/playground/src/plugins/pinia.ts:30-35`) — an
id absent from that union, so no banner, notification or ad spot can target it.

Every property registers itself with a site ID against the same API. Verbatim from each
bundle: One `use(…(["*"], "https://api.vuetifyjs.com"))`, Play `["vplay","*"]`,
Bin `["vbin"]`, Link `["vlink"]`, Snips `["vsnips"]`, Issues `["vissues"]`,
Admin `["admin"]`.

### 5.4 The hosted MCP server is authenticated by One

`live:mcp.vuetifyjs.com/` returns:

```json
{"name":"Vuetify MCP Server","version":"0.9.1","mcp_endpoint":"/mcp","health_endpoint":"/health"}
```

`/mcp` is POST-only ("stateless mode only supports POST"), `/health` returns
`{"status":"ok"}`, and `/.well-known/oauth-protected-resource` declares
`authorization_servers: ["https://api.vuetifyjs.com"]` with `scopes_supported: ["mcp"]`.
The authorization-server document advertises dynamic client registration,
`authorization_code` + `refresh_token`, PKCE `S256`, and
`protected_resources: ["https://mcp.vuetifyjs.com/mcp"]`.

This is the clearest example of One functioning as ecosystem-wide identity
infrastructure rather than a subscription product.

### 5.5 `0.vuetifyjs.com` also serves a machine-readable registry

`live:0.vuetifyjs.com/registry/index.json` returns `{version: 1, v0Version: "1.0.4",
tokens: [20 items], items: [111 items]}`, each item carrying `name`, `type`, `category`,
`level` (`stable` / `preview`), `title`, `description`, `docs` URL and `examples[]`.
v0play consumes it — `apps/playground/src/data/registry.ts:12` defaults the registry
origin to `https://0.vuetifyjs.com`, and `?example=` deep-links resolve against it
(`apps/playground/src/composables/usePlaygroundFiles.ts:573-598`).

---

## 6. Docs / marketing / store

Two documentation sites, one storefront, and two theme distributions.

### 6.0 Core framework context

Not a property, but it sets the frame for everything else
(`gh:vuetifyjs/vuetify`, verified at `master`):

| Fact | Value |
|---|---|
| Current version | **`4.1.9`** (`packages/vuetify/package.json`, `lerna.json:16`) |
| Cadence | a patch roughly every 1–2 weeks: v4.1.0 2026-06-02 → v4.1.9 2026-08-13, ten releases in ten weeks |
| Parallel maintenance line | 3.x still shipping (v3.13.1 on 2026-08-07); LTS table marks 3.x "🔧 Maintained", EOL 2026-07-27, end of LTS 2027-07-27 |
| Branches | 77 total; the three trains `master` / `dev` / `next` — with **`next` stale at `4.0.4`** — plus `v1-stable`, `v2-stable`, `v2-dev`, `v3-stable` |
| v5 | **Nothing on the roadmap.** `pages/en/introduction/roadmap.md:24-29` plans v4.0 Q1 2026, v4.1 Q2, v4.2 Q3, v4.3 TBD |
| v0 adoption in core | visible as unmerged branches `refactor/zero`, `feat/v0-date-integration`, `feat/v0-locale-integration`, `feat/v0-theme-integration` |
| Scale | 41,031 stars, 7,136 forks, 410 open issues, created 2016-09-12 |

Note the tension with this repo's own copy: `apps/docs/src/pages/sponsor.md` states
"Vuetify 4 depends on Vuetify0 directly from 4.2.0 onward, and Vuetify0 is the foundation
for the Paper design system family and **for Vuetify 5**", while the core repo's roadmap
mentions no v5 and the v0 integration work sits on unmerged branches.

### 6.1 `vuetifyjs.com` — core docs and the commercial front door

| Aspect | Finding | Evidence |
|---|---|---|
| Repo | `packages/docs` inside `gh:vuetifyjs/vuetify` (monorepo, 3,502 tracked paths) | `gh api .../git/trees/HEAD?recursive=1` |
| Stack | Vue + Vite SPA, served as a 3.3 KB shell behind Caddy/Cloudflare | `live:vuetifyjs.com` |
| One integration | `installOne()` registers `createOne()` app-wide and imports `@vuetify/one/styles` | `packages/docs/src/plugins/one.ts` |
| Subscription page | `/one` (`layout: home`) composed of `OneHero`, `OneSubscribeCard`, `OneProperties`, `OneRoadmap`, `OneFAQ` | `packages/docs/src/pages/en/one.md` |
| Third-party ads | Carbon Ads (`serve=CWYDC27W&placement=v3vuetifyjscom`) with a house-ad fallback on script error | `packages/docs/src/components/promoted/Carbon.vue`, `.../Entry.vue` |
| House-ad system | `components/promoted/*` (Base, Carbon, Discovery, Entry, Inline, Promoted, Random, Script, Vuetify) + `components/promotions/PromotionCard.vue`, driven by CMS content via `useAd` | those files; `live:api.vuetifyjs.com/one/promotions` (88 items) |
| Sponsor surfaces | `components/sponsor/*` — CTA, Card, FAQ, Hero, Included, Link, **SnackbarPopup** (an interstitial sponsor prompt) | `packages/docs/src/components/sponsor/` |
| Third-party services in the page head | `api.cosmicjs.com` (CMS), `cdn.carbonads.com` + `srv.carbonads.net` (ads), `www.google-analytics.com` + `googletagmanager.com` (analytics), `cdnjs.cloudflare.com` (polyfills) | `live:vuetifyjs.com` preconnect/dns-prefetch tags |
| Enterprise support | `support.vuetifyjs.com` 302s to `/en/introduction/enterprise-support/` | `live:` |
| Search | **Algolia DocSearch**, app id and key hardcoded (`NHT6C0IV19`) | `packages/docs/src/components/app/search/SearchDialog.vue:130-133` |
| Component API data | Generated at build time by `packages/api-generator`, read from disk via a virtual module — not fetched | `packages/docs/build/api-plugin.ts` |
| Error tracking | `@sentry/vue` pointed at self-hosted `glitchtip.vuetifyjs.com` | `packages/docs/src/main.ts:67` |
| Content volume | 228 markdown pages, ~20 monthly blog posts, Crowdin-backed i18n | `crowdin.yml`, `.github/workflows/crowdin-uploads.yml` |
| Deploy | Coolify image `docs`, artefact baked into `caddy:2.10.2-alpine` with `packages/docs/build/Caddyfile` | `.github/workflows/ci.yml` |

**The docs' playground handoff is anonymous, and it is split between two properties.**
`packages/docs/src/composables/playground.ts:26-42` builds a `[files, vueVersion,
vuetifyVersion, true]` tuple, zlib-compresses and base64s it, and returns
`https://play.vuetifyjs.com#<hash>` — carrying the docs' live Vue and Vuetify versions.
Every example's "Edit in playground" button uses it (`components/examples/Example.vue:242-253`),
as does the usage/props explorer (`UsageExample.vue:49`). But `components/app/Markup.vue:154-160`
routes by payload shape: **array code → Play, plain string → Vuetify Bin**
(`https://bin.vuetifyjs.com?code=<hash>&lang=<lang>`, `composables/bin.ts:47`). So Bin's real
job is "share a single snippet from the docs", which is exactly the niche a combined
playground would have to keep (§9).

There is **no "save to One" or "my playgrounds" path in the docs app** — it only produces
anonymous hash URLs; saved playgrounds live on `play.vuetifyjs.com` itself. And
`v0play.vuetifyjs.com` appears in the core docs **only in blog prose** (seven hits across
monthly-update posts) — never in nav, app code, or an example button.

The core docs' own dashboard route is a stub:
`packages/docs/src/pages/en/user/dashboard.md` renders text reading "This page will soon be
home to the Vuetify One Dashboard."

The core docs are therefore the only property carrying **three** revenue mechanisms at
once: third-party ads, house promotions, and the One subscription that removes the first
of those.

### 6.2 `0.vuetifyjs.com` — v0 docs, deliberately unmonetized as a product

| Aspect | Finding | Evidence |
|---|---|---|
| Repo | `apps/docs` in this repo | `apps/docs/package.json` (`@vuetify-private/docs`, `1.0.0-beta.2`, private) |
| Stack | Vite + `vite-ssg` SSG, UnoCSS, `@paper/emerald` + `@paper/genesis`, `@vue/repl`, `minisearch`, `mermaid` | `apps/docs/package.json`; `apps/docs/CLAUDE.md` |
| Auth | `@vuetify/auth` only — sign-in for settings/identity, **no `@vuetify/one`** | `apps/docs/src/components/app/AppAccount.vue:12`, providers at lines 25-30 |
| Gating | None. "No pro tier, no paywalled features, no plans for either" | `apps/docs/src/pages/introduction/why-vuetify0.md:237` |
| Ads | None, by stated policy: "Vuetify0 doesn't run ads, and there are no plans to" | `apps/docs/src/pages/sponsor.md` |
| Commercial pages | `/sponsor` (single $2,000/mo Primary Sponsor slot, currently `null`) and `/services` (support subscriptions + fixed-scope builds) | §2.7 |
| AI assistant | "Ask AI" against `api.vuetifyjs.com/docs/ask`, rate-limited | `apps/docs/src/composables/useAsk.ts:90,387` |
| Analytics | **two** stacks — `posthog-js` and `swetrix` | `apps/docs/package.json` |
| Doubles as | the `vuetify add` registry host and v0play's example source (§5.5) | `live:0.vuetifyjs.com/registry/index.json` |
| Deploy | Coolify webhook from `.github/workflows/docs-deploy.yml` | that file, line 54 |

### 6.3 `store.vuetifyjs.com` — Shopify, multi-vendor

Covered in §2.8. Structurally: 41 products, `powered-by: Shopify`, collections
`themes` / `ui-kits` / `support` / `vuetify-3` / `top-selling` / `featured-products` /
`news`, plus `/pages/vendor-application` and `/pages/licensing-information`
(`live:store.vuetifyjs.com`). It is a reseller channel — most paid themes are
third-party (Materio, Sneat, Berry, Mantis, Modernize, Flexy, WrapPixel, CodedThemes,
Velora, PrimeDash, MaterialM, MatDash, Spike, AdminPro, MaterialPro, LandingPro) — plus
first-party Figma UI kits and support packages.

Notable: the catalogue already carries **Vuetify 4** SKUs (`Velora - Vuetify 4`,
`PrimeDash - Vuetify 4`, `Mantis - Vuetify 4`, `Berry Vuetify 4`,
`MaterialPro - Vuetify 4`, `Official Vuetify 4 UI Kit for Figma`,
`Official Vuetify 4 Snips for Figma`), and the newest listing is a `$19.00`
"Vuetify Blueprint" tagged `blueprints, Code, Shadcn, Theme` (published 2026-03-04).

### 6.4 Themes — two distributions of the same idea

| Distribution | Where | Status |
|---|---|---|
| Shopify products | `store.vuetifyjs.com` | Actively merchandised; free tiers at `0.00` alongside paid |
| Loose GitHub repos | 12 repos: `theme-vite-free`, `landing-theme`, `landing-theme-free`, `launcher-theme`, `flairo-theme`, `dashboard-widgets-theme`, `crypto-theme`, `portfolio-dark-theme`, `material-kit-theme`, `nebula-ui-kit`, `photography-theme`, `theme-freelancer` | **All abandoned, and none published to npm** (every package name 404s on the registry) |

The GitHub repos need spelling out because the `pushedAt` dates are misleading. Eight of
them share a `2026-06-16` timestamp from a single org-wide sweep
(`docs: update Discord invite link to discord.gg/vuetify`); the last *substantive* work was
an August 2025 dependency-bump pass. The rest have not been touched in years:
`nebula-ui-kit` 2023-12-07, `theme-freelancer` 2022-10-04 (its only commit is the initial
one), `material-kit-theme` 2020-11-27, `photography-theme` 2020-04-26.

Only three READMEs identify themselves as paid: `flairo-theme`
(`# [Flairo Theme PRO](https://store.vuetifyjs.com/products/flairo-theme-pro)`, package
`flairo-theme-pro`), `nebula-ui-kit` (whose heading link contains a **typo** —
`products/nebula-ui-ki`), and `material-kit-theme` ("Thank you for purchasing the Theme").
Two are explicitly free by name (`theme-vite-free`, `landing-theme-free`). The remaining
five ship the generic scaffold README with a boilerplate store link and state nothing;
their `material-kit-*` package names and the existence of a sibling `landing-theme-free`
imply they are the paid variants, but **nothing says so** — UNKNOWN.

Live demos sit outside the fleet: `theme-vite-free.vercel.app`,
`landing-theme-free.vercel.app`, `crypto-theme-vuetifyjs1.vercel.app`,
`portfolio-dark-theme-orcin.vercel.app` on Vercel, and `flairo-theme.zeroskillz.now.sh` on
the **defunct `now.sh`** — a paid product whose demo URL points at a dead host.

### 6.5 Design systems (`@paper/*`) — in this repo, not yet a public property

`DESIGN_SYSTEMS.md` defines the family contract: "**Paper** is the family of design
systems and kits built on `@vuetify/v0`, published under the `@paper/*` scope." It splits
the scope into two classes — **design systems** (exemplars: Material, Emerald, Onyx; own
token namespace, theme plugin required) and **kits** (exemplar: Genesis; consumes
`--v0-*`, theme plugin forbidden). Rulings 1–3 are marked "decided", sections 4–5
"**PROPOSED** and open for review".

| Package | npm name | Version | Published? | Last touched | Notes |
|---|---|---|---|---|---|
| `packages/0` | `@vuetify/v0` | `1.0.4` | Yes | 2026-08-14 | The substrate |
| `packages/genesis` | `@paper/genesis` | `1.0.1` | Yes (not private) | 2026-08-12 | Docs kit; consumed by `apps/docs`, `apps/playground`, and `apps/builder` |
| `packages/emerald` | `@paper/emerald` | `0.0.0` | `private: true` | 2026-08-15 | "Emerald design system — Wave 1–3 (v0-composed, Figma-tokened)" |
| `packages/paper` | `@vuetify/paper` | `1.0.0-rc.9` | `private: true` | 2026-07-21 | Root `CLAUDE.md` calls it "**not published (dormant)**" |
| Onyx | — | — | Branch only | — | Draft PR #759 `feat/onyx` → `dev`, "`@paper/onyx` design system — wave 1" |
| Bulma | — | — | Branch only | — | Draft PR #760 `feat/paper-bulma` → `dev`, "Bulma compat design system (Tier 1)" |
| Material | — | — | Not a `@paper/*` package | — | `DESIGN_SYSTEMS.md`: "vuetify — orchestration + defaults (**Material ships here**)" |

There are no `emerald.`, `genesis.`, `paper.` or `onyx.vuetifyjs.com` hosts (`live:` all
NXDOMAIN). The only public surface for the family today is the `/systems/**` section of
`0.vuetifyjs.com` (`apps/docs/src/pages/systems/`), plus an Emerald demo the repo's most
recent commit serves at `/demo/emerald/` (`5d686fc2`).

---

## 7. Tooling

### 7.1 The CLI is now a monorepo, and `create` is superseded

`gh:vuetifyjs/cli` (root package `cli`, `1.2.1`, `private: true`) declares itself a
pnpm monorepo of four published packages, verbatim from its README:

| Package | Description (README) |
|---|---|
| `@vuetify/cli` | "The main `vuetify` command line tool" |
| `create-vuetify` | "Scaffolding tool for Vuetify projects" |
| `create-vuetify0` | "Scaffolding tool for Vuetify 0 projects" |
| `@vuetify/cli-shared` | "Shared utilities and logic" |

The tree also contains an unlisted `packages/mcp-cli`. Commands live in
`packages/shared/src/commands/`: `add`, `diff`, `docs`, `generate`, `list`, `mcp`,
`presets`, `refresh`, `registry`, `releaseNotes`, `status`, `update`, `upgrade`, plus
top-level `analyze`, `init`, `release-notes` in `packages/cli/src/commands/`.

Plus an unlisted `packages/mcp-cli` (published as `@vuetify/mcp-cli` `1.2.1`) and an
unpublished `@vuetify/cli-shared`. This is the **most active tooling repo in the org: 208
commits in 2026**, last commit 2026-08-13.

`create-vuetify` publishes as **`3.2.1`** despite the in-repo manifest reading `1.2.1` —
`.github/scripts/patch-create-version.mjs` rewrites the major at release to preserve
continuity with the legacy `create` repo's version line. So the standalone
`gh:vuetifyjs/create` repo (78★) is **not accidental duplication; it is an explicitly
retired redirect**, and its README says so in a GitHub warning callout:

> **[!WARNING]**
> The development was moved to https://github.com/vuetifyjs/cli/ repository - please raise
> new issues, discussions and pull requests there 🙏

Corroborated by its commit `chore: redirect development to vuetifyjs/cli repository`
(2026-03-15); every 2026 commit there is a README or badge chore. Scaffolding templates
resolve to `gh:vuetifyjs/cli/templates/<name>#v<version>` — the `templates/` directory
**inside the `cli` repo** (245 tracked paths) — which likewise supersedes the standalone
`gh:vuetifyjs/templates` repo.

### 7.2 `vuetify add` — the registry is served by the v0 docs site

```ts
// gh:vuetifyjs/cli packages/shared/src/constants/registry.ts
/** Static origin publishing the `vuetify add` registry. */
export const REGISTRY_ORIGIN = 'https://0.vuetifyjs.com'
export const REGISTRY_VERSION = 1
```

That endpoint is live and populated: `live:0.vuetifyjs.com/registry/index.json` →
`{version: 1, v0Version: "1.0.4", tokens: [20], items: [111]}`, each item carrying a
maturity `level` of `stable` or `preview` (§5.5). v0play reads the same registry
(`apps/playground/src/data/registry.ts:12`), so **the v0 docs site is simultaneously a
docs site, the CLI registry, and the playground's example source** — one host, three
contracts.

### 7.3 MCP is the newest subscriber-linked surface

| Aspect | Finding | Evidence |
|---|---|---|
| Package | `@vuetify/mcp`, `0.9.1`, `bin: bin/cli.js`, deps `@modelcontextprotocol/sdk`, `octokit`, `zod`, `dotenv` | `gh:vuetifyjs/mcp package.json` |
| Hosted | `https://mcp.vuetifyjs.com/mcp`, added via `claude mcp add --transport http vuetify-mcp …` | README; `live:mcp.vuetifyjs.com` reports `0.9.1` |
| Local | `npx -y @vuetify/mcp` | README |
| Also ships as | an "Agent Plugins 1.0.0 package (`plugin.json` + `mcp.json`)" pointing clients at the hosted server | README |
| Auth | OAuth 2.1 via `api.vuetifyjs.com`, scope `mcp` (§5.4); or a bearer `VUETIFY_API_KEY` | `live:` well-knowns; `gh:vuetifyjs/cli packages/shared/src/commands/mcp.ts:40,508,731` |
| Subscriber link | One's pricing card lists "Vuetify MCP API (access to your one data anywhere that supports MCP)" as `new` | `packages/docs/src/components/one/SubscribeCard.vue` |
| Privacy policy | `vuetifyjs.com/en/legal/mcp-privacy` | README |
| Activity | repo pushed 2026-08-16 | `gh repo list` |

The CLI's `mcp` command treats `VUETIFY_API_KEY` as a secret
(`SENSITIVE_ENV_KEYS = ['VUETIFY_API_KEY']`) and sends it as
`Authorization: Bearer ${value}`. That key is the One access token
(`VOneAccessToken.apiKey` / `/one/mcp/getToken`, §5.2). So the chain is:
**One subscription → API key → MCP access to your own One data from any IDE.**

**The MCP server is where server-side entitlement enforcement is visible in source.** Of
its 31 tools, exactly 10 are gated — the Bin (4), Link (2) and Playground (4) tools,
enumerated as `ONE_TOOL_NAMES` in `gh:vuetifyjs/mcp src/tools/one/names.ts` and used by
`src/transports/http.ts:355` to decide which calls require auth. Each carries the
description string *"Use of this tool requires a vuetify one subscription"*, and the
helper distinguishes two failure modes verbatim:

```ts
const key = extra.authInfo?.token || process.env.VUETIFY_API_KEY || ''
if (!key) { throw new Error('Please re-authenticate with Vuetify One to use this tool.') }
…
if (response.status === 403 && text.trim() === 'Invalid Access') {
  throw new Error('This tool requires a Vuetify One subscription.')
}
```

A valid key with no entitlement gets `403 Invalid Access` **from `api.vuetifyjs.com`**.
That is direct evidence the API enforces One entitlement server-side, which makes the
"private playgrounds/bins/links" claim in §2.5 plausible even though no client-side gate
exists for it. The 17 documentation and 3 API tools need no key at all.

The server is distributed four ways: `npx -y @vuetify/mcp` (stdio), the hosted HTTP
endpoint, an **Agent Plugins 1.0.0 package** (`plugin.json` + `mcp.json`) whose author
field reads "Vuetify LLC / hello@vuetifyjs.com", and self-hosting via its Dockerfile.
It has a published privacy policy at `vuetifyjs.com/en/legal/mcp-privacy`.

### 7.4 The rest of the tooling estate

"2026 commits" is an exact paginated count, which separates real activity from the
org-wide chore sweeps that touched almost every repo in June 2026.

| Repo | npm package / purpose | Version | 2026 commits | Maturity read |
|---|---|---|---|---|
| `cli` | `@vuetify/cli` + `create-vuetify` + `create-vuetify0` + `@vuetify/mcp-cli` | `1.2.1` / `3.2.1` / `1.2.1` / `1.2.1` | **208** | **The strategic centre of tooling** |
| `nuxt-module` | `vuetify-nuxt-module`, docs at `nuxt.vuetifyjs.com` | `1.0.0-rc.4` | **159** | **Actively developed** — still pre-1.0 |
| `mcp` | `@vuetify/mcp` | `0.9.1` | **48** | Actively developed (§7.3) |
| `pkg-diff` | Client-side npm differ (Rust→Wasm) at `pkg-diff.vuetifyjs.com`; has an explicit "CLI (for agents)" mode and is linked from `vuetify release-notes` | `1.0.1`, `private: true`, **unpublished** | 43 | Active, niche |
| `vuetify-codemods` | `vuetify-codemods` — vue-metamorph migration codemods | `1.0.6` | 33 | Maintenance, migration-cycle-driven |
| `eslint-config-vuetify` | `eslint-config-vuetify` | `4.7.2` | 31 | Actively developed |
| `eslint-plugin-vuetify` | `eslint-plugin-vuetify` — upgrade automation | `2.7.2` | 25 | Maintenance |
| `devkey` | Explicit demo — "DevKey is **not a real product**" | `0.0.0`, `private: true`, unpublished | 24 | Maintained reference implementation |
| `unocss-preset-vuetify` | `unocss-preset-vuetify` | `0.3.0` | 18 | Maintenance |
| `create` | `create-vuetify` — **retired redirect to `cli`** | repo `2.8.0`; npm name now published from `cli` | 10 (all chore/docs) | **Deprecated** |
| `templates` | Scaffold sources (`nuxt/base`, `vue/base`, `v0`) | — | 10 | **Superseded** by `cli/templates/` |
| `vuetify-loader` | `vite-plugin-vuetify` `2.1.3`, `webpack-plugin-vuetify` `3.1.3`, `@vuetify/loader-shared` `2.1.2` | see left | 7 (all chore/docs) | **Maintenance** — last code release 2026-01-19 |
| `vue-repl` | `@vuetify/vue-repl` — a **confirmed fork of `vuejs/repl`**, pinned at `2.6.0` while upstream is 4.x | `2.6.0` | 6 | **Orphaned.** No public consumer; v0play uses patched upstream `@vue/repl@4.7.1`. Plausible consumer is the private `play` codebase — inference only |
| `ecosystem` | Feedback hub for the six private properties — **the org's only first-party property registry** | — | 6 | Small but load-bearing |
| `vuetify-vscode` | `vuetify-vscode` (VS Code Marketplace, publisher `vuetifyjs`) | `0.2.0` | 1 (README only) | **Stale — last code commit 2020-04-27, a six-year gap** |
| `tryvuetify` | `vuetify.new` — a one-page package-manager picker (`pnpm/yarn/npm/bun/deno create vuetify`) | `0.0.0`, `private: true` | **0** | **Stale but in production** (deploy 2025-05-18) |
| `awesome` | Curated link list — **1,746★, the org's second-most-starred asset** | — | **0** | **Stale** (13 months) |
| `indexer` | Description promises "extract, embed, and index Vue component snippets"; the package is actually named `github-cloner` and the README describes a repo-cloning script | `1.0.0` | **0** | **Abandoned prototype**, possibly an early Snips experiment (inference) |
| `swetrix-selfhosting` | Fork of Swetrix's self-hosting compose config; vendor Docker/ClickHouse only | — | **0** | Dormant infra |
| `community-bot` | `vuetifybot`, a fork of `An-Idiots-Guide/guidebot`; deploy docs reference the defunct Zeit `now` | `1.0.0` | **0** | **Dead since 2018-07-21.** Whatever serves the live Discord is not this |
| `.github` | Org metadata; hosts the org-wide `FUNDING.yml` and `profile/README.md` | — | 1 | Metadata |
| GitHub Actions | `setup-action`, `close-action`, `triage-action`, `coolify-action` | — | 1 each (Node 24 bump, 2026-06-25) | Infra — see below |
| `pkg` misc | `dom-testing-library`, `babel-plugin-jsx`, `vite-ssg`, `renovate-config`, `conventional-changelog-*` | — | — | Forks / infra |
| Archived | `vue-cli-plugins` (424★), `nuxt` (299★), `vuex`, `docs-next`, `legacy-docs`, `vue-cli-preset-vuetify`, `vue-cli-plugin-vuetify-*`, `cz-changelog-vuetify`, `vuex-cognito-example`, `vuetify-helper-json` | — | — | Correctly archived |

Note `pkg-diff` and `devkey` are both `private: true` and unpublished; the `pkg-diff` and
`devkey` names on npm are **unrelated third-party packages** (last modified 2022 and 2024),
not Vuetify releases.

**`coolify-action` is the deployment substrate for the whole fleet.** It builds and pushes
a Docker image to `ghcr.io/vuetifyjs/<imageName>` and then fires a Coolify deploy webhook,
asserting on `.deployments[0].message | contains("deployment queued")`. Confirmed consumers
span repos: `mcp` (`imageName: mcp`), `tryvuetify`, `vuetifyjs/one` (`imageName: one`), the
core docs (`imageName: docs`), and this repo's `v0-docs` / `v0-playground`. Coolify is
self-hosted, which matches the `via: 1.1 Caddy` fingerprint on every first-party host (§1).

**`triage-action` makes sponsorship confer issue-triage priority** — a monetization-adjacent
surface not visible from any product UI:

```js
const sponsors = YAML.parse(await fs.readFile(sponsorsFile, 'utf8'))
const issueAuthor = context.payload.issue.user.login
for (const { label, members } of sponsors) {
  if (members && ~members.findIndex(v => v.toLowerCase() === issueAuthor.toLowerCase())) {
    labelsToAdd.add(label); break
  }
}
```

`gh:vuetifyjs/vuetify .github/sponsors.yml` declares the label vocabulary — `P: sponsor`
and `P: elite sponsor` — with empty `members` lists in the public file.

**`analyze`** exists as a CLI command (`packages/cli/src/commands/analyze.ts`); what it
analyzes was not read. **UNKNOWN.**

---

## 8. Overlap / fragmentation

### 8.1 Concrete duplication

| # | Duplication | Evidence |
|---|---|---|
| 1 | **Two live playgrounds** writing to one `/one/playgrounds` collection, each with its own `/playgrounds/:id` route — **and charging differently for the same action**: cloud Save is subscriber-only on `play`, free-with-account on v0play | `live:play.vuetifyjs.com/assets/default-CNVf6ojt.js`; `apps/playground/src/composables/useOnePlaygrounds.ts:260` |
| 2 | **Two save-to-One client stacks** — `@vuetify/one@4.1.0` vs raw `@vuetify/auth@0.1.8` + hand-rolled fetch | `bundle:*` vs `useOnePlaygrounds.ts:231-478` |
| 3 | **Three code-artefact share mechanisms** — hash URL (v0play/Play), Bin `/embed/:id`, Link short codes | route tables in each bundle |
| 4 | **Four "save my work" namespaces on one API** — `/one/playgrounds` (used by *two* front-ends), `/one/bins`, `/one/studio/projects`, plus Builder's `stores/persistence.ts` localStorage seam | `bundle:*`; PR #241 comment, 2026-07-31 |
| 5 | **Three project-editing surfaces** — v0play (`@vue/repl`), Studio (Monaco, `/projects/:id`), Builder's wizard + preview | `bundle:studio.vuetifyjs.com`; `apps/playground`; `apps/builder` on `origin/feat/builder` |
| 5b | **Two theme-configuration surfaces** — Studio ("Visual theme builder") and Builder's per-plugin theme step, against One's own premium-themes feature as a third | One product list (`bundle:bin`); `apps/builder/src/plugins/theme/` on `origin/feat/builder` |
| 6 | **Two zip-export implementations** — v0play `useExport.ts` and Builder `engine/zip.ts` | both use `fflate`; separate code paths |
| 7 | **Two sponsorship storefronts with divergent copy** — GitHub Sponsors and Open Collective share the $250/$500/$1,500 rungs but quote different impressions (600k/10m vs 200k/3m) | §2.2, §2.3 |
| 8 | **Two commercial support channels for the same tier name** — "Galaxy" at `$250/mo` on `0.vuetifyjs.com/services` and `$3,299/yr` on the Shopify store, with `support.vuetifyjs.com` redirecting to a third enterprise-support page | §2.7, §2.8 |
| 9 | **Two analytics stacks in one app** — `apps/docs` depends on both `posthog-js` and `swetrix`; `vuetifyjs.com` separately loads Google Analytics + GTM | `apps/docs/package.json`; `live:vuetifyjs.com` head |
| 10 | **A stale product menu** shipped into seven properties, listing the legacy playground and omitting v0play and the v0 docs entirely | `bundle:bin.vuetifyjs.com` |
| 11 | ~~Two scaffolding tools~~ — **not duplication.** `gh:vuetifyjs/create` carries an explicit "development was moved to vuetifyjs/cli" warning and the npm name was handed over; the standalone `gh:vuetifyjs/templates` repo is likewise superseded by `cli/templates/` | `gh:vuetifyjs/create README.md`; `gh:vuetifyjs/cli packages/shared/.../getTemplateSource.ts` |
| 12 | **v0play is invisible to One at three layers** — absent from the ecosystem product menu, absent from the `ecosystem.*` settings namespaces (`bin`, `play`, `studio`, `link`, `docs`, `mcp`), and absent from the `/one` page's "Premium Across the Ecosystem" list | `bundle:bin.vuetifyjs.com`; `packages/docs/src/components/one/Properties.vue` |
| 13 | **Two theme distributions** — Shopify products vs. a dozen stale GitHub theme repos, several deployed to Vercel outside the fleet | §6.4 |
| 15 | **Four parallel sponsorship ladders** — GitHub Sponsors, Open Collective, the core-docs Diamond/Platinum/Gold/Silver page, and the Discord Wood/Gold/Planetary tiers | §2.2, §2.3 |
| 16 | **Two clients for one CMS** — the core docs read Cosmic JS directly (`composables/cosmic.ts`) while `@vuetify/one` reads the same collections through `api.vuetifyjs.com/one/*` | §2.9 |
| 17 | **Dead commercial code shipping the same tiers twice** — `SlaDeck.vue`'s Galaxy/Cosmic/Multiverse Stripe links are unreferenced in the core docs while the v0 docs sell the same three names and prices live, with different Stripe links | §2.3, §2.7 |
| 18 | **v0play is unaddressable by the One content system** — it registers site id `'vzero'`, which is not in `@vuetify/one`'s `site` union (`'*' \| 'dev' \| 'vbin' \| 'vplay' \| 'docs' \| 'home' \| 'server' \| 'v3'`), so no banner, notification or ad spot can target it | §5.3 |
| 19 | **Three versioned docs archives still deployed** — `v3.` (2026-08-07), `v2.` (2025-08-08), `v15.` (2025-03-12) | §1 |
| 14 | **Advertised-but-unshipped One features** — "Share live updates on Bins and Playgrounds" and "Embed playgrounds in your own documentation" carry `soon` flags on the live pricing card; Bin already ships `/embed/:id` | `packages/docs/src/components/one/SubscribeCard.vue`; `bundle:bin.vuetifyjs.com` |

### 8.2 Zombie candidates — live but not maintained

Ordered by staleness of the deployed `index.html` (`live:`, 2026-08-16):

| Property | Deploy age | Corroborating signal |
|---|---|---|
| `vuetify.new` (TryVuetify) | **2025-05-18** (~15 months) | repo `tryvuetify` pushed 2026-06-01, but the deployed artefact is 15 months old |
| `studio.vuetifyjs.com` | **2026-01-29** (~6.5 months) | only Nuxt property; overlaps Builder & One premium themes |
| `bin.vuetifyjs.com` | 2026-06-08 | still the only embeddable share surface |
| `link.vuetifyjs.com` | 2026-06-08 | identical deploy timestamp to Bin — likely last shipped together |
| `issues.vuetifyjs.com` | 2026-07-02 | — |
| `play.vuetifyjs.com` | 2026-07-22 | explicitly being replaced by v0play |

Beyond hosts, four **repo-level** zombies matter because each still fronts something live
or valuable (§7.4): `awesome` (1,746★, zero 2026 commits), `vuetify-vscode` (a shipped
Marketplace extension whose last code commit was 2020-04-27), `community-bot` (dead since
2018, deploy docs reference the defunct Zeit `now`, while the live Discord is served by
something with no public repo), and `vue-repl` (a fork pinned at 2.x against an upstream on
4.x, with no identifiable consumer). Plus the 12 theme repos and the three versioned docs
archives.

For contrast, the actively-shipped end: `vuetifyjs.com` 2026-08-16, `0.vuetifyjs.com`
2026-08-16, `v0play.vuetifyjs.com` 2026-08-16, `one.vuetifyjs.com` 2026-08-13,
`snips.vuetifyjs.com` 2026-08-10.

Also worth flagging as *inventory-live-but-unsold*: the Vuetify0 Primary Sponsor slot
ships as `null` (`apps/docs/src/constants/sponsor.ts:15,21`) with a `TODO(john)` for the
second tier ID, so the `/sponsor` page currently renders an empty flagship placement.

### 8.3 Properties that exist only as a name

`ots.vuetifyjs.com` and `try.vuetifyjs.com` do not resolve, and no readable repo or
bundle references them. Either they were retired or they were never hosts. Per the
research rules, they are recorded here as **unsourced beyond the request itself** rather
than as properties.

---

## 9. Shared-app thesis

Strictly a reading of the evidence above — not a strategy.

### 9.1 What the evidence supports combining

**v0play + Play → one app.** The strongest case, and it is nearly free:

- Both already write the same resource (`/one/playgrounds`) behind the same route shape
  (`/playgrounds/:id`).
- v0play **already parses Play's payload format**: `openPlayground()` handles the
  "Vuetify Play tuple" and the legacy file map alongside its own shape
  (`apps/playground/src/composables/usePlaygroundFiles.ts:487-553`). Existing Play
  content can be opened without a migration.
- v0play already targets Vuetify, not just v0: a `vuetify` preset with an ESM version
  switcher and nightly support (`usePlaygroundFiles.ts:100-108`), plus a 983-example
  Vuetify 4 docs catalogue behind `?vuetify=` (PR #806).
- Cost of *not* combining is a split user history across two editors and, because the
  `@vuetify/one` product menu still points at Play (`bundle:bin.vuetifyjs.com`), every
  other property funnels users to the one being retired — the one that still charges for
  Save (§2.5).
- Gap to close: v0play has **no embed mode**, which Play also lacks but Bin has — and
  "Embed playgrounds in your own documentation" is already advertised on the live One
  pricing card with a `soon` flag (`packages/docs/src/components/one/SubscribeCard.vue`).
  A combined app is where that promise would land.

**Bin → a mode of the combined playground.** Bin is a single-artefact, embeddable
paste surface over the same API (`/one/bins`, `/embed/:id`). Its distinctive assets are
(a) `/embed/:id`, which neither playground has and which serves `200` unauthenticated,
and (b) a socket.io channel to `api.vuetifyjs.com`. Folding it in means the combined app
needs an embed route and an "unauthenticated quick-paste" path; in exchange the ecosystem
stops maintaining a separate editor whose deploy is already 2+ months behind. Note it
carries the same Save paywall as `play` (§2.5), so the pricing question above applies
here too.

**Builder → a mode, or at minimum a first-class producer.** It is already designed to
hand off: `review.vue` builds the manifest and calls
`toPlaygroundUrl(manifest, 'https://v0play.vuetifyjs.com')`, which is
`` `${baseUrl}#${encodeHash(toHashData(input))}` `` — **the same zlib+base64 hash format
v0play already decodes** (`apps/builder/src/engine/manifest.ts:1617-1620` on
`origin/feat/builder`). Note the host is hardcoded there rather than env-configurable as it
is in the docs. It duplicates v0play's zip export (`engine/zip.ts` vs `useExport.ts`, both
on `fflate`) and its dependency substrate. Its `stores/persistence.ts` opens with a comment
saying the swap is deliberate:

> "The ONLY module that knows where builds live. … Swapping localStorage for the Vuetify
> API is meant to be a rewrite of this file and nothing else — which is why every method is
> async even though the current implementation is synchronous."

Keeping it separate means a fourth save implementation ships (keys `builder.builds`,
`builder.active`, `builder.build.<id>`) with no auth and no One integration at all.

**Link → a feature, not a property.** A URL shortener over `/one/links` with a
768 KB bundle and its own Swetrix project is a large surface for one POST. Every
create/share surface wants short links; none of them need a separate SPA and host.
The caveat is that Link is the ecosystem's most thoroughly monetized creation surface
(§2.5) — slug, expiry, password, timer and analytics are all paid — so absorbing it means
carrying those gates into the host app rather than dropping them.

### 9.2 What the evidence says should stay separate

| Keep separate | Why, from the evidence |
|---|---|
| **`vuetifyjs.com` and `0.vuetifyjs.com`** | Opposed monetization postures. v0 docs commit in writing to "No pro tier, no paywalled features, no plans for either" and "Vuetify0 doesn't run ads, and there are no plans to" (`why-vuetify0.md:237`, `sponsor.md`), while `vuetifyjs.com` is the placement inventory the $250–$1,500 tiers are sold against (§2.2). Merging them would collide those promises. |
| **Snips** | The only property with its own priced, one-time entitlement (`/one/snips/activate`, `snips/team` access string, dedicated Stripe links) and its own SEO surface (a sitemap of category/collection paths). Its funnel is "browse → buy", not "create → share". |
| **Store** | Different billing system (Shopify), multi-vendor catalogue with a `/pages/vendor-application`, 41 products, no One integration in the storefront. Nothing in the evidence suggests it can be absorbed. |
| **Admin** | Internal-only, role-gated (`/401`), and manages the *other* properties' content. |
| **`api.vuetifyjs.com`** | Already the single backend; it is what makes consolidation of the front-ends cheap. |
| **Issues** | Overlaps only in that it *reads* `/one/bins` and `/one/playgrounds` for reproductions — consumer, not producer. |
| **Studio** | Not "keep separate" so much as **decide**: a 6.5-month-old deploy of a substantial Monaco editor, alone on Nuxt, with its own paid cloud-projects tier (§2.5) and its stated job (visual theme builder) claimed by both the Builder's theme step and One's premium themes. |

### 9.3 The four cross-cutting concerns a combined app has to answer

1. **Auth — and this is a hard technical constraint, not a preference.** Two clients exist:
   `@vuetify/auth` (v0play, v0 docs) and `@vuetify/one` (everything else), the latter built
   on the former. `@vuetify/one` supplies `isSubscriber`, the product menu, the per-property
   settings sync and all ad/banner rendering; every subscriber gate in the ecosystem is
   written against it. But `@vuetify/one` **peers on `vuetify ^4.0.0` and has no dependency
   on `@vuetify/v0`** (§5.3), so adopting it in a v0-native app means pulling Vuetify 4 in.
   That is why v0play uses `@vuetify/auth` alone, and why it is gate-free and unaddressable
   by the content system. The resolvable path is that `@vuetify/auth` already exposes
   `user.sponsorships` and `access[]`, so `isSubscriber` is *derivable* without
   `@vuetify/one` — no app does that today. Any combined app has to pick: take Vuetify 4 as
   a dependency, or re-implement the subscriber/settings/chrome layer on `@vuetify/auth`.
2. **URL scheme.** Today: `/playgrounds/:id` (twice, on two hosts), Bin `/bins` +
   `/embed/:id`, plus v0play's query deep-links `?playground=`, `?example=`, `?vuetify=`
   and a self-contained hash. Combining means one host owns all of these plus redirects
   from `play.` and `bin.`, and v0play's hash format has to remain readable because
   every previously shared link is self-contained in it.
3. **Embed.** Only Bin has `/embed/:id`. Any consolidation that retires Bin must ship an
   embed route first, or it breaks the one thing Bin is uniquely used for.
4. **SEO.** Snips has a real content sitemap; the playgrounds are app shells (1.1 KB for
   Play, 71 KB for v0play). Consolidating app shells costs little SEO. Consolidating a
   content property into an app shell would.
5. **Subscriber funnel.** The funnel today is: any property → One user menu →
   `one.vuetifyjs.com/user/dashboard` → `/one/subscribe`, with `vuetifyjs.com/one` as the
   pricing page and an alternative entry via the $3/month GitHub Sponsors tier that
   grants One access (§2.2). v0play — the newest and most-shipped creation surface — is
   outside that funnel at three layers simultaneously: no `@vuetify/one` dependency and
   so no ecosystem menu or upsell chrome (only a "What is Vuetify One?" text link,
   `PlaygroundAuthDialog.vue:76`); no `ecosystem.v0play` namespace in the One settings
   schema, so its preferences do not cloud-sync with the rest; and no entry in the `/one`
   page's "Premium Across the Ecosystem" list, which still advertises `play.vuetifyjs.com`
   for "Private playgrounds, Cloud sync, Version history". Whatever gets combined, the
   funnel and the newest surface are currently disjoint.
6. **The paid capability is on the properties being retired.** Cloud persistence is
   subscriber-only on all four legacy creation properties — `play`, `bin`, `studio`, and
   (beyond a default short link) `link`. Cloud Save on `v0play.vuetifyjs.com` is free with an account, and
   nothing in `apps/playground` or `apps/docs` checks `isSubscriber` at all (§2.5). So the
   consolidation question is not only "which app survives" — it is **which pricing model
   survives**, because the two candidates currently disagree about whether saving your
   work is a paid feature. Any combination has to resolve that, and today's trajectory
   (v0play shipping weekly, `play` frozen since 2026-07-22) resolves it toward free by
   default rather than by decision.

---

## 10. Open questions / unknowns

### Blocked by repo access

`gh api repos/vuetifyjs/<name>` returns `404` for `bin`, `play`, `snips`, `studio`,
`issues`, `api`, `admin`, `ots`, `link`, `links`, `store`, `discord-bot`, `paper`,
`emerald`, `genesis`, `onyx`, `builder`. Everything about those properties in this
document comes from live hosts and production bundles. Specifically unresolved:

- Which repo builds `play.vuetifyjs.com`, `bin`, `link`, `snips`, `studio`, `issues`,
  `admin`, and the `api.vuetifyjs.com` service. Whether any of them are a monorepo
  together (Admin and Issues ship byte-identical MDI font asset hashes, which *suggests*
  a shared build, but that is inference, not evidence).
- **What `admin.vuetifyjs.com` is.** It is live, titled "Vuetify Admin", was redeployed
  2026-07-27, and has **zero references in any public repo in the org** — an org-wide
  `gh search code` for the hostname returns no results. It is also absent from the
  `ecosystem` scope table. It is the least-documented live property.
- Whether a `discord-bot` repo exists. `gh api repos/vuetifyjs/discord-bot` 404s, and the
  only public candidate, `gh:vuetifyjs/community-bot`, has been dead since 2018-07-21 with
  deploy instructions for the defunct Zeit `now`. Something serves guild
  `1513968811047522396`; what, is unknown.
- What consumes `@vuetify/vue-repl`. The fork is pinned at `2.6.0` against an upstream on
  4.x and still received a 2026 feature commit, but no public repo depends on it — v0play
  uses patched upstream `@vue/repl@4.7.1`. The plausible consumer is the private `play`
  codebase; that is inference.
- Studio's **share** and **export** behaviour. Its routes, Monaco editor, paid cloud
  projects and SendOwl downloads table are all sourced above; whether it can share or
  export a project is **UNKNOWN**.
- Whether `/studios` was an earlier route name — the Nuxt build manifest carries a
  wildcard redirect `"/studios": {"redirect": "/"}`
  (`live:studio.vuetifyjs.com/_nuxt/builds/meta/<id>.json`), suggesting a renamed
  collection path, but the history is not readable.

### Blocked by lack of a public source

- **The ~80% GitHub Sponsors revenue share.** Unverifiable here (§2.10). No revenue
  figure of any kind should be read out of this document.
- **Whether One + Snips are moving to free/PWYW.** As deployed, One is `$2.99`/`$29.99`
  solo and `$29.99`/`$299.99` team, and Snips is a paid one-time product with a live
  50%-off sale. No pivot artefact exists in code, hosts, or open PRs. A grep of every file
  in `vuetifyjs/one` for `pwyw`, `pay what`, `donat`, `patreon` and `free` returns only the
  MIT licence's "free of charge". The most recent *attempted* Snips pricing change went the
  other way: closed PR #50 "feat: Snips addon" (opened 2026-04-06, closed unmerged
  2026-05-22) would have made Snips a **paid add-on to the One subscription** at
  `snips: { solo: '19.99', team: '49.99' }` per month, monthly-only, with copy "Access to
  all premium code snippets". Its companion redesign, PR #52, was also closed unmerged.
  Neither landed — `master`'s `one.ts` has no `hasSnips` and no `addons`.
- **Server-side enforcement of "private playgrounds / bins / links".** Advertised as a
  subscriber feature; no client-side gate exists; `api.vuetifyjs.com` is not readable.
- **Marketing claims with no code behind them (as far as this pass could see)** —
  Play "Version history", Link "QR codes", Studio "Export code" (§2.4).
- ~~What a `shopify` identity grants in One.~~ **Resolved:** it granted nothing beyond
  identity plus a product-catalog fetch, and it was deleted in `vuetifyjs/one` PR #53
  (2026-06-08) along with the SendOwl downloads feature. The published `@vuetify/auth@0.1.8`
  tarball still lists `'shopify'` only because that build predates the removal (§5.2).
- **`@vuetify/playgrounds`** — no such package or reference found anywhere. If planned,
  it exists only as intent.
- **What `next.vuetifyjs.com` and `dev.vuetifyjs.com` serve.** Both resolve and return
  the production docs title.
- **Whether `ots` and `try` were ever live.** Both NXDOMAIN, no references found.
- **What `vuetify analyze` analyzes.** (`gh:vuetifyjs/indexer` is now partly explained: its
  package is named `github-cloner` and its README describes a repo-cloning script, despite a
  description promising snippet embedding and indexing. An abandoned Snips prototype is a
  plausible reading but is inference.)
- **Free-vs-paid status of five theme repos** — `landing-theme`, `launcher-theme`,
  `dashboard-widgets-theme`, `crypto-theme`, `portfolio-dark-theme` carry no product link
  and state nothing (§6.4).
- **Whether `store.vuetifyjs.com` is backed by any repo at all**, or is purely a hosted
  Shopify storefront. No `store` repo is visible and no deploy config references it.
- **What `swetrix-selfhosting` instruments.** The fork contains only vendor compose config
  with no Vuetify-specific configuration committed.

### Deliberately not answered

Per the brief, this document does not rank properties, propose a roadmap, or recommend
where to focus for subscriber growth. §9 is a reading of what the code and hosts imply
about consolidation mechanics only.
