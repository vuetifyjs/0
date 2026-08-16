# Vuetify Ecosystem Inventory — 2026-08

> **Research artifact. Not product documentation. Do not merge into `master`.**
> Compiled for John and Ash as an input to a focus decision. This document is
> **inventory only** — it deliberately makes no recommendation about what to
> prioritise for subscriber growth.

**Compiled:** 2026-08-16 · **Repo HEAD at time of writing:** `5d686fc2` (`vuetifyjs/0`, `master`)

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
   returns `404 Not Found` for `bin`, `play`, `snips`, `studio`, `issues`, `api`, `admin`,
   `ots`, `link`, `links`, `store`, `discord-bot`, `paper`, `emerald`, `genesis`, `onyx`,
   `builder`. A 404 from this token cannot distinguish "private" from "does not exist",
   so for those properties the evidence below is the **live host and its production
   bundle**, not source.
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
| Vuetify0 Play (v0play) | `v0play.vuetifyjs.com` | this repo, `apps/playground` | In-browser REPL for v0 / Vuetify 4, with One cloud save, export, share links | v0 + Vuetify users, docs readers | **Live, newest** (deploy 2026-08-16 00:42) | Sign-in required for cloud save; no paid gate found |
| Vuetify Play (legacy) | `play.vuetifyjs.com` | **UNKNOWN** (no readable repo) | The original Vuetify playground; `@vuetify/one`-integrated, `/playgrounds/:id` cloud save | Vuetify users | **Live but being replaced** (deploy 2026-07-22) | Sign-in for cloud save; One theme/cosmetic gating via `@vuetify/one` (§2) |
| Vuetify Bin | `bin.vuetifyjs.com` | **UNKNOWN** | Pastebin for Vuetify snippets; `/bins`, `/embed/:id`, socket.io live channel to `api.vuetifyjs.com` | Support / issue triage / sharing | **Live, aging** (deploy 2026-06-08) | Sign-in for saved bins; One cosmetic gating |
| Vuetify One | `one.vuetifyjs.com` | `gh:vuetifyjs/one` (public) — app itself **UNKNOWN** | Account, subscription, team and OAuth-consent surface for the whole ecosystem | Subscribers / all signed-in users | **Live, freshest of the satellites** (deploy 2026-08-13) | **This is the subscriber surface** |
| Vuetify Link | `link.vuetifyjs.com` | **UNKNOWN** | Short-URL generator (`VLink`) | Team / community | **Live, aging** (deploy 2026-06-08) | Sign-in to create links |
| Vuetify Snips | `snips.vuetifyjs.com` | **UNKNOWN** | Catalogue of copy-paste Vuetify UI snippets in Application UI / Marketing / Ecommerce categories | Designers & app builders | **Live, active** (deploy 2026-08-10) | **Yes — paid, one-time "all-access"** (§2) |
| Vuetify Admin | `admin.vuetifyjs.com` | **UNKNOWN** | Internal console: `/sponsors`, `/promotions`, `/spots`, `/banners`, `/notifications`, `/users`, `/logs`, `/docs-ask` | Core team only | **Live** (deploy 2026-07-27) | Internal; `/401` route implies role gating |
| Vuetify Studio | `studio.vuetifyjs.com` | **UNKNOWN** | Billed as a "visual theme builder"; the shipped app is a Monaco-based project editor with cloud projects at `/projects/:id` | Vuetify users | **Live but stale — zombie candidate** (Nuxt build id 2026-01-29 17:20 UTC, ~6.5 months; only Nuxt property) | Ships One chrome and a `/401` route; also the only surviving front-end for SendOwl purchase downloads |
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

`support.vuetifyjs.com`, `community.vuetifyjs.com`, `cdn.vuetifyjs.com`,
`swetrix-api.vuetifyjs.com`, `swetrix.vuetifyjs.com`, `mcp.vuetifyjs.com`,
`next.vuetifyjs.com` and `dev.vuetifyjs.com` all resolve (`live:` 2026-08-16).
`next.vuetifyjs.com` and `dev.vuetifyjs.com` both return the same title as production
(`Vuetify — A Vue Component Framework`); what they actually serve is **UNKNOWN**.

`links.vuetifyjs.com` (plural) does **not** resolve; the live host is the singular
`link.vuetifyjs.com`.

### Everything is one deployment platform

Every first-party host except the Shopify store answers with `via: 1.1 Caddy` behind
`server: cloudflare` (`live:` all hosts). This repo deploys through
`vuetifyjs/coolify-action` (`.github/workflows/docs-deploy.yml:54`,
`.github/workflows/playground-deploy.yml:38`), so the fleet is self-hosted on Coolify
with Cloudflare in front. `store.vuetifyjs.com` answers `powered-by: Shopify`.

---

## 2. Subscriber / monetization surfaces

There are **seven** distinct places money can enter, on five different billing systems.

| Rail | Billing system | Where it is asked for | Evidence |
|---|---|---|---|
| GitHub Sponsors (recurring) | GitHub | `github.com/sponsors/johnleider`, linked from core `FUNDING.yml` and v0 docs | `gh:vuetifyjs/vuetify .github/FUNDING.yml`; `apps/docs/src/constants/services.ts:8` |
| Open Collective (recurring) | Open Collective / Open Source Collective | `opencollective.com/vuetify`, linked from core `FUNDING.yml` | same `FUNDING.yml`; `live:opencollective.com/vuetify` |
| Tidelift | Tidelift | `FUNDING.yml` only — no first-party surface found | `gh:vuetifyjs/vuetify .github/FUNDING.yml` |
| Vuetify One subscription | Stripe, via `api.vuetifyjs.com/one/subscribe` | `vuetifyjs.com/one`, One dashboard, every property's user menu | `gh:vuetifyjs/vuetify packages/docs/src/components/one/SubscribeCard.vue` |
| Snips all-access (one-time) | Stripe payment links | `snips.vuetifyjs.com/all-access` | `bundle:snips.vuetifyjs.com` |
| Store / Services | Shopify (store) and Stripe payment links (v0 services) | `store.vuetifyjs.com`; `0.vuetifyjs.com/services` | `live:store.vuetifyjs.com/products.json`; `apps/docs/src/constants/services.ts:2` |
| Third-party ads (indirect) | Carbon Ads | `vuetifyjs.com` docs pages | `gh:vuetifyjs/vuetify packages/docs/src/components/promoted/Carbon.vue` — `//cdn.carbonads.com/carbon.js?serve=CWYDC27W&placement=v3vuetifyjscom` |

### 2.1 `FUNDING.yml` — verbatim

```yaml
# These are supported funding model platforms

github: [johnleider]
open_collective: vuetify
ko_fi: # Replace with a single Ko-fi username
tidelift: npm/vuetify
custom: # Replace with a single custom sponsorship URL
```

Source: `gh:vuetifyjs/vuetify .github/FUNDING.yml`. Two things follow. GitHub Sponsors
points at a **personal** account (`johnleider`), not an org account. And
`gh:vuetifyjs/0` has **no** `FUNDING.yml` at `.github/FUNDING.yml` (404), so the v0 repo
raises no GitHub "Sponsor" button of its own.

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

The gated features found in the shipped bundle are all **cosmetic / convenience**, not
functional:

| Gated thing | Code evidence (`bundle:snips.vuetifyjs.com`, `@vuetify/one` chunk) |
|---|---|
| Premium docs/app themes — Blackguard, Nebula, Odyssey, High Contrast | each theme object carries `disabled: !t.isSubscriber`, and the card renders `subtitle: S.disabled ? "Unlock with Vuetify One" : S.subtitle` |
| "Suits" (whole-app cosmetic skins, e.g. Odyssey app-bar/drawer/footer imagery) | `if (!n.one.suits.suit \|\| !n.one.suits.enabled \|\| !t.isSubscriber) return {}` |
| Subscriber avatars | `n.isSubscriber && l.unshift("https://cdn.vuetifyjs.com/docs/images/avatars/one.png")`, plus `*-subscriber.png` variants |
| Avatar picker itself | `function r () { n.isSubscriber && (i.value = !i.value) }` |
| Banner / notification preference controls | rendered under `A(t).isSubscriber ? … : Pe("",!0)` |
| User badges | `n.github \|\| n.discord \|\| n.isSubscriber \|\| t.user?.isAdmin` |

Plus **one genuinely functional gate — ad-free.** The "Disable Ads" switch is rendered
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

**The docs site adds three more real gates.** These live in `vuetifyjs.com`'s own bundle,
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

**What is still not gated anywhere in client code: creating, saving, sharing and
embedding.** Save, share, embed and cloud-sync across Play, Bin, Link and v0play require
*authentication*, not a *subscription* (§3). The advertised "Private playgrounds / bins /
links" gate is plausibly enforced server-side inside `api.vuetifyjs.com` — v0play, for
instance, sends `visibility: 'private' | 'public'` with no local subscriber check
(`apps/playground/src/composables/useOnePlaygrounds.ts:239-268`) — but that enforcement
is **UNVERIFIABLE** from here.

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

Content is CMS-backed (`cdn.cosmicjs.com` appears in every property bundle) and edited
through `admin.vuetifyjs.com`, whose route table is exactly
`/sponsors`, `/promotions`, `/spots`, `/banners`, `/notifications`, `/users`, `/logs`,
`/docs-ask`, `/login`, `/401` (`bundle:admin.vuetifyjs.com`).

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
| Cloud sync | debounced autosave, 500 ms | autosave (per v0play's own note: "play uses 100ms after store mutate") | socket.io to `api.vuetifyjs.com` | n/a | n/a | project CRUD, mechanism **UNKNOWN** | **UNKNOWN** |
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
| Docs AI | `/docs/ask` (rate-limited; client throws "Rate limit exceeded" on 429) | `apps/docs/src/composables/useAsk.ts:90,372,387` |
| Realtime | socket.io / `engine.io` transport | `bundle:bin.vuetifyjs.com` (`Wo("https://api.vuetifyjs.com")`, `path:"/engine.io"`) |

`GET /auth/verify` returns `{"user":null,"access":[]}` unauthenticated (`live:`), which
matches the `AuthVerifyResponse` type below. `/one/playgrounds`, `/one/bins` and
`/one/links` return `401 Unauthorized` (`live:`) — user content is properly closed.

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
   "vuetify:authorize:popup", …)` then `postMessage({type:"auth-request"}, http.url)`
   (`@vuetify/auth` dist). One's own login additionally honours a `redirect_uri` query
   param but **only** when it starts with `https://api.vuetifyjs.com/`
   (`bundle:one.vuetifyjs.com`).

### 5.3 Shared clients

| Package | Version | Used by | Note |
|---|---|---|---|
| `@vuetify/auth` | `0.1.8` (npm) | this repo's `apps/playground` and `apps/docs` (`package.json`, `catalog:` → `0.1.8` in `pnpm-lock.yaml:102`) | Low-level: `useAuthStore`, `useHttpStore`, `useDeviceStore`, `useApiKeyStore`, `createAuth`, `createAuthPlugin` |
| `@vuetify/one` | `4.1.0` (npm) | Play, Bin, Link, Snips, Issues, Admin, One | Adds product chrome, settings sync, subscription store, ecosystem menu, ad/banner/notification rendering, premium themes & suits |
| `@vuetify/playgrounds` | — | — | **Not found.** No such npm package resolved, no reference in this repo, no reference in any inspected bundle. If it is planned, it exists only as an intention — **UNKNOWN** |

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
| Loose GitHub repos | `gh:vuetifyjs/{theme-vite-free, landing-theme, landing-theme-free, launcher-theme, flairo-theme, dashboard-widgets-theme, crypto-theme, portfolio-dark-theme, material-kit-theme, nebula-ui-kit, photography-theme, theme-freelancer, templates}` | **Stale.** Twelve of thirteen last pushed 2026-06-16 (a single batch touch); `material-kit-theme` 2024-03-19, `nebula-ui-kit` 2024-03-16, `photography-theme` 2023-12-18, `theme-freelancer` 2022-10-04 |

Several of these repos point their GitHub homepage at Vercel deployments
(`landing-theme-free.vercel.app`, `crypto-theme-vuetifyjs1.vercel.app`,
`flairo-theme.zeroskillz.now.sh`, `nebula-ui-kit.vercel.app`), i.e. outside the
Coolify fleet and outside `vuetifyjs.com` DNS entirely.

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

This makes the separate `gh:vuetifyjs/create` repo (78★, last pushed 2026-07-01)
**redundant with `create-vuetify`** — two scaffolding paths for the same job. Which one
`vuetify.new` / `npm create vuetify` resolves to is **UNKNOWN**.

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
**One subscription → API key → MCP access to your own One data from any IDE.** This is
the only place in the ecosystem where a paid subscription unlocks a *developer-workflow*
capability rather than a cosmetic or ad-related one.

### 7.4 The rest of the tooling estate

| Repo | npm / purpose | Stars | Last push | Maturity read |
|---|---|---|---|---|
| `nuxt-module` | "Zero-config Nuxt Module for Vuetify", docs at `nuxt.vuetifyjs.com` | 284 | 2026-08-02 | Live, maintained |
| `vuetify-loader` | "Webpack and Vite plugins for treeshaking" | 511 | 2026-07-01 | Maintenance |
| `eslint-config-vuetify` | "Opinionated eslint config for the Vuetify ecosystem" | 42 | 2026-07-31 | Maintained |
| `eslint-plugin-vuetify` | "Version upgrade automation eslint plugin" | 132 | 2026-07-01 | Maintenance |
| `unocss-preset-vuetify` | "unocss preset for generating Vuetify CSS utility classes" | 12 | 2026-08-14 | Active |
| `vuetify-codemods` | Upgrade codemods, linked from the upgrade guide | 5 | 2026-04-28 | Maintenance |
| `vuetify-vscode` | VS Code extension | 24 | 2026-02-17 | Aging |
| `vue-repl` | Fork of `@vue/repl` (upstream attribution **UNVERIFIED**) | 3 | 2026-03-17 | Aging; note this repo's apps depend on upstream `@vue/repl`, not the fork |
| `pkg-diff` | Client-side npm version differ (Rust→Wasm), `pkg-diff.vuetifyjs.com` | 1 | 2026-08-08 | Active, niche |
| `devkey` | Explicit demo: "Not a real product" | 7 | 2026-07-22 | Reference implementation |
| `tryvuetify` | `vuetify.new` — "Try the latest version of Vuetify with Yarn, Npm, or Pnpm" | 4 | 2026-06-01 | **Deployed artefact is 15 months old** |
| `indexer` | Purpose **UNKNOWN** | 0 | 2025-06-02 | Stale |
| `awesome` | Awesome-list | 1,746 | 2025-07-01 | Stale (13 months) — the second-most-starred asset in the org |
| `community-bot` | Only Discord-bot candidate found | 3 | **2018-07-21** | Abandoned |
| `swetrix-selfhosting` | Self-hosted analytics for the fleet | 0 | 2025-11-19 | Infra, quiet |
| `ecosystem` | "Report issues regarding Vuetify Ecosystem Sites" — contains only `README.md` + `CONTRIBUTING.md`, **no issue templates and no property list** | 0 | 2026-07-01 | Vestigial |
| GitHub Actions | `close-action`, `triage-action`, `setup-action`, `coolify-action` — the last is what deploys this repo's sites | 0–1 | 2026-06-25 | Infra |
| `pkg` misc | `dom-testing-library`, `babel-plugin-jsx`, `vite-ssg`, `renovate-config`, `conventional-changelog-*`, `templates` | — | 2023–2026 | Forks / infra |
| Archived | `vue-cli-plugins` (424★), `nuxt` (299★), `vuex`, `docs-next`, `legacy-docs`, `vue-cli-preset-vuetify`, `vue-cli-plugin-vuetify-*`, `cz-changelog-vuetify`, `vuex-cognito-example`, `vuetify-helper-json` | — | — | Correctly archived |

`gh:vuetifyjs/.github` has **no** `FUNDING.yml` (404), so the org-wide funding default is
unset and each repo relies on its own — which only `vuetifyjs/vuetify` has (§2.1).

**`analyze`** exists as a CLI command (`packages/cli/src/commands/analyze.ts`); what it
analyzes was not read. **UNKNOWN.**

---

## 8. Overlap / fragmentation

### 8.1 Concrete duplication

| # | Duplication | Evidence |
|---|---|---|
| 1 | **Two live playgrounds** writing to one `/one/playgrounds` collection, each with its own `/playgrounds/:id` route | `bundle:play.vuetifyjs.com` route table; `apps/playground/src/composables/useOnePlaygrounds.ts:118-135` |
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
| 11 | **Two scaffolding tools** — `create-vuetify` inside `gh:vuetifyjs/cli` and the standalone `gh:vuetifyjs/create` repo (78★) | `gh:vuetifyjs/cli README.md` |
| 12 | **v0play is invisible to One at three layers** — absent from the ecosystem product menu, absent from the `ecosystem.*` settings namespaces (`bin`, `play`, `studio`, `link`, `docs`, `mcp`), and absent from the `/one` page's "Premium Across the Ecosystem" list | `bundle:bin.vuetifyjs.com`; `packages/docs/src/components/one/Properties.vue` |
| 13 | **Two theme distributions** — Shopify products vs. a dozen stale GitHub theme repos, several deployed to Vercel outside the fleet | §6.4 |
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
  other property funnels users to the one being retired.
- Gap to close: v0play has **no embed mode**, which Play also lacks but Bin has — and
  "Embed playgrounds in your own documentation" is already advertised on the live One
  pricing card with a `soon` flag (`packages/docs/src/components/one/SubscribeCard.vue`).
  A combined app is where that promise would land.

**Bin → a mode of the combined playground.** Bin is a single-artefact, embeddable
paste surface over the same API (`/one/bins`, `/embed/:id`). Its distinctive assets are
(a) `/embed/:id`, which neither playground has, and (b) a socket.io channel to
`api.vuetifyjs.com`. Folding it in means the combined app needs an embed route and an
"unauthenticated quick-paste" path; in exchange the ecosystem stops maintaining a
separate editor whose deploy is already 2+ months behind.

**Builder → a mode, or at minimum a first-class producer.** It is already designed to
hand off: its documented output is "a playground URL carrying the full plugin
configuration", and it duplicates v0play's zip export and dependency substrate
(§4). Its `stores/persistence.ts` is explicitly an "API-swappable seam", i.e. it is
waiting for `/one/*` storage. Keeping it separate means a third save implementation
ships.

**Link → a feature, not a property.** A URL shortener over `/one/links` with a
768 KB bundle and its own Swetrix project is a large surface for one POST. Every
create/share surface wants short links; none of them need a separate SPA and host.

### 9.2 What the evidence says should stay separate

| Keep separate | Why, from the evidence |
|---|---|
| **`vuetifyjs.com` and `0.vuetifyjs.com`** | Opposed monetization postures. v0 docs commit in writing to "No pro tier, no paywalled features, no plans for either" and "Vuetify0 doesn't run ads, and there are no plans to" (`why-vuetify0.md:237`, `sponsor.md`), while `vuetifyjs.com` is the placement inventory the $250–$1,500 tiers are sold against (§2.2). Merging them would collide those promises. |
| **Snips** | The only property with its own priced, one-time entitlement (`/one/snips/activate`, `snips/team` access string, dedicated Stripe links) and its own SEO surface (a sitemap of category/collection paths). Its funnel is "browse → buy", not "create → share". |
| **Store** | Different billing system (Shopify), multi-vendor catalogue with a `/pages/vendor-application`, 41 products, no One integration in the storefront. Nothing in the evidence suggests it can be absorbed. |
| **Admin** | Internal-only, role-gated (`/401`), and manages the *other* properties' content. |
| **`api.vuetifyjs.com`** | Already the single backend; it is what makes consolidation of the front-ends cheap. |
| **Issues** | Overlaps only in that it *reads* `/one/bins` and `/one/playgrounds` for reproductions — consumer, not producer. |
| **Studio** | Not "keep separate" so much as **decide**: 6.5-month-old deploy, alone on Nuxt, and its stated job (visual theme builder) is claimed by both the Builder's theme step and One's premium themes. |

### 9.3 The four cross-cutting concerns a combined app has to answer

1. **Auth.** Two clients exist: `@vuetify/auth` (v0play, v0 docs) and `@vuetify/one`
   (everything else), the latter built on the former. A combined app has to choose, and
   the choice is not neutral — `@vuetify/one` is what carries the product menu,
   settings sync, ad/banner rendering and *all* subscriber-visible gating (§2.5). Adopt
   `@vuetify/auth` alone and the combined app has no subscriber-visible surface at all.
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
6. **Where the paid value actually sits today.** Every verified functional subscriber
   gate is on `vuetifyjs.com` or in tooling — ad-free, rail drawer, page pins, Copy Page
   as Markdown (§2.5) and the MCP API key (§7.3). On the creation properties themselves
   the only verified gates are cosmetic: themes, suits, avatars, badges. So consolidating
   the creation surfaces does not, on current evidence, move any *existing* paid
   capability; it moves the surface where the two `soon`-flagged ones (live-update
   sharing, playground embeds) would have to land.

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
- Whether a `discord-bot` repo exists. The only public candidate is
  `gh:vuetifyjs/community-bot`, last pushed 2018-07-21.
- Studio's actual capabilities: save, share, export, One integration — all **UNKNOWN**
  beyond "Visual theme builder" in One's product list.

### Blocked by lack of a public source

- **The ~80% GitHub Sponsors revenue share.** Unverifiable here (§2.10). No revenue
  figure of any kind should be read out of this document.
- **Whether One + Snips are moving to free/PWYW.** As deployed, One is `$2.99`/`$29.99`
  solo and `$29.99`/`$299.99` team, and Snips is a paid one-time product with a live
  50%-off sale. No pivot artefact found in code, hosts, or open PRs.
- **Server-side enforcement of "private playgrounds / bins / links".** Advertised as a
  subscriber feature; no client-side gate exists; `api.vuetifyjs.com` is not readable.
- **Marketing claims with no code behind them (as far as this pass could see)** —
  Play "Version history", Link "QR codes", Studio "Export code" (§2.4).
- **What a `shopify` identity grants** in One. `AuthProvider` includes it; the storefront
  shows no One integration.
- **`@vuetify/playgrounds`** — no such package or reference found anywhere. If planned,
  it exists only as intent.
- **What `next.vuetifyjs.com` and `dev.vuetifyjs.com` serve.** Both resolve and return
  the production docs title.
- **Whether `ots` and `try` were ever live.** Both NXDOMAIN, no references found.
- **What `vuetifyjs/indexer` is for**, and what `vuetify analyze` analyzes.
- **Which scaffolding path `vuetify.new` / `npm create vuetify` resolves to** —
  `create-vuetify` in the CLI monorepo, or the standalone `create` repo.
- **What `gh:vuetifyjs/vue-repl` forks and whether anything still uses it.** This repo's
  apps depend on upstream `@vue/repl` (`apps/playground/package.json:14`).

### Deliberately not answered

Per the brief, this document does not rank properties, propose a roadmap, or recommend
where to focus for subscriber growth. §9 is a reading of what the code and hosts imply
about consolidation mechanics only.
