# Security Review — @vuetify/v0 & @vuetify/paper

**Date:** 2026-07-02
**Scope:** The shipped library packages — `packages/0` (`@vuetify/v0`) and `packages/paper` (`@vuetify/paper`). Plus verification of every "Security Property" claim asserted in the project threat model (`apps/docs/src/pages/introduction/security.md`).
**Out of scope (by request):** the docs site (`apps/docs`), the playground (`apps/playground`), and CI/CD workflows. A few app/CI observations surfaced during exploration are listed in an appendix for completeness but were not the focus of this review.
**Method:** Static review of the source tree, targeting the fixed set of sinks a headless library can expose — DOM/CSS injection, prototype pollution, deserialization of persisted/untrusted state, dynamic code evaluation, unbounded allocation (DoS), and cross-origin messaging. Each finding is anchored to `file:line` and cross-checked against the repo's own `.claude/rules/implementation.md` "Security primitives" table, which names the canonical guard for each sink family.

---

## Executive summary

`@vuetify/v0` is **well-defended**. It is genuinely headless — it renders almost no content itself — and it centralizes each injection/pollution guard into a single reusable primitive (`UNSAFE_KEYS`, `ThemeAdapter`'s `SAFE_IDENT`/`UNSAFE_CSS`, `CSS.escape`, `Map`-based registries). There is **no `eval`/`new Function`, no `v-html`/`innerHTML` in application logic, no `postMessage`, and no unsolicited network activity** anywhere in the library.

The review found **three issues, all Low-to-Medium**, each in the "a sibling missed the guard its twin already has" pattern that the repo's own rules document anticipates. The highest-priority issue in **actually-shipping code** is Finding 2 (`useFeatures` adapters in `@vuetify/v0`). Finding 1 is in `@vuetify/paper`, which is currently a **pre-release placeholder** with no real consumers, so its CSS-injection sink is a latent gap to close before paper goes public rather than an active risk today.

| # | Severity | Location | Issue |
|---|----------|----------|-------|
| 2 | **Low–Medium** | `useFeatures` adapters (launchdarkly / flagsmith / posthog), `@vuetify/v0` | Plain objects are keyed by feature-flag names without the `UNSAFE_KEYS` guard the sibling sinks (`mergeDeep`, `usePermissions`, `createTokens`) all apply → conditional prototype pollution. **Highest-priority shipping issue.** |
| 3 | **Low** | `useLocale` plugin `restore()`, `@vuetify/v0` | Persisted `localStorage` value is applied via `saved as ID` with no validation. (Its siblings `useTheme` and `useRtl` have since been fixed — this is the last remaining blind cast, and the rules doc that lists all three as unfixed is now stale.) |
| 1 | **Low** (latent) | `packages/paper` `useTheme` | Runtime-settable theme color values are written into a `<style>` element with no sanitization → CSS-rule injection. v0's theme adapter has the guard; paper's does not. **Paper is a pre-release placeholder** — harden before it gains real consumers. |

All three are consistent with existing guard patterns already present elsewhere in the codebase, so remediation is "mirror the sibling," not "design something new." A set of informational observations and a full clean-bill-of-health inventory follow.

---

## Threat-model claim verification

The threat model (`apps/docs/src/pages/introduction/security.md:111-120`) asserts six "Security Properties … verified in the codebase." Each was checked against source:

| Claim | Verdict | Evidence |
|-------|---------|----------|
| **No network requests** — v0 makes no HTTP calls; adapters are opt-in | ✅ Confirmed | The only network I/O in the library is inside opt-in third-party notification/feature adapters, and always through a **consumer-supplied client**: `useNotifications/adapters/knock.ts` and `novu.ts` (Novu calls are `IN_BROWSER`-gated and go through the injected `novu` client — `novu.ts:126-135`). No adapter constructs a URL or calls `fetch` on its own. |
| **No dynamic code evaluation** | ✅ Confirmed | Zero `eval`, `new Function`, or string-argument `setTimeout`/`setInterval` in `packages/0/src` or `packages/paper/src`. (All `Function(` grep hits are the `isFunction` type guard.) |
| **Prototype-pollution protection — `mergeDeep` blocks `__proto__`/`constructor`/`prototype`** | ✅ Confirmed | `utilities/helpers.ts:348-376`. `mergeDeep` builds a fresh output object, skips `UNSAFE_KEYS` (`:363`, the set defined at `:312`), skips non-own and `undefined` keys, and only recurses when **both** sides pass `isPlainObject` (`:314`, which requires an `Object.prototype`/`null` prototype). Prototype-pollution-safe. |
| **CSS-injection protection — theme adapters validate names/keys and reject dangerous values** | ✅ True for `@vuetify/v0`; gap in `@vuetify/paper` (pre-release) | v0's `ThemeAdapter` fully implements the guard (`useTheme/adapters/adapter.ts:16-64`): `UNSAFE_CSS = /url\s*\(|@import|expression\s*\(|[{}<>]/i`, `SAFE_IDENT = /^[a-zA-Z0-9_-]+$/`, applied to theme names, color keys, **and** values. `@vuetify/paper`'s `useTheme` has no equivalent (see **Finding 1**), but paper is a pre-release placeholder with no real consumers, so the claim's **practical coverage for what actually ships is intact**. Close the paper gap before it goes public. |
| **SSR-safe globals — all browser access guarded by `IN_BROWSER`** | ✅ Confirmed (spot-checked) | The DOM-touching theme adapter gates every browser branch (`useTheme/adapters/v0.ts:55,125,131,141`), as do the notification/feature adapters (`novu.ts:126`, `posthog.ts:27`). `useStorage` swaps in a `MemoryStorageAdapter` under SSR. |
| **No cross-origin communication — no `postMessage`** | ✅ Confirmed for the library | No `postMessage` or `message`-event listener in `packages/0/src` or `packages/paper/src`. (The playground app depends on `@vue/repl`, which uses `postMessage` internally — but that is the app, explicitly out of scope, and does not contradict the claim about the library.) |
| **Supply chain — "No lifecycle scripts"** | ✅ Confirmed for the published package | `packages/0/package.json` has only `build`/`typecheck` scripts and ships `files: ["dist"]` — no `postinstall`/`preinstall`. `packages/paper/package.json` likewise. (The monorepo **root** `package.json` has a first-party `postinstall`, but the root is never published to npm, so the claim — scoped to the published package — holds.) |

**Net:** every asserted property holds for `@vuetify/v0`. The one gap is that the CSS-injection guarantee does **not** extend to `@vuetify/paper`, which ships from the same repo and is not carved out of the claim's spirit.

---

## Findings

### Finding 1 — Low (latent): `@vuetify/paper` `useTheme` writes unsanitized color values into a `<style>` element (CSS injection)

> **Priority note.** `@vuetify/paper` is currently a **pre-release placeholder** and is not meaningfully consumed yet, so this sink has no real blast radius today. It is recorded as a **latent** gap to close *before* paper gains real consumers, not as an active risk. The technical detail below stands, and the guard to mirror already exists one package over — so the fix is cheap to land ahead of paper's public debut.

**Location:** `packages/paper/src/composables/useTheme/index.ts:141-172`

**Mechanism.** The `css` computed interpolates every theme color value straight into a CSS custom-property declaration with no filtering:

```ts
// packages/paper/src/composables/useTheme/index.ts:149-151
for (const [key, value] of Object.entries(currentTheme.colors)) {
  cssVariables += `  --v0-${toKebabCase(key)}: ${value};\n`   // value is not validated
}
```

and the result is assigned to a live `<style>` element's `textContent` (`:172`). Color values are settable at runtime via `register(name, value)` (`:181-183`) and `set(key, value)` (`:193-199`), so an application that forwards any externally-influenced string into a theme color feeds it directly into the stylesheet.

**Repro sketch.** With a current theme active:

```ts
const theme = createTheme({ current: 'light', /* … */ })
theme.set('primary', 'red } body { display: none } .x { color: red')
```

produces:

```css
:root {
  --v0-primary: red } body { display: none } .x { color: red;
  …
}
```

The injected `} … {` breaks out of the `:root` block and adds attacker-chosen rules. Because the value lands in `textContent` (not `innerHTML`), HTML breakout is not possible, but **CSS-rule injection is** — including `url(https://attacker/beacon)` on `background`/`content` for data exfiltration, full-page `display:none` defacement, and (on legacy engines) `expression(...)`.

**Known pattern, guard already exists.** The repo's own `.claude/rules/implementation.md` lists this exact case in its "Security primitives" table: *"Interpolate a value into a CSS string or `<style>` text → mirror `ThemeAdapter` … v0 `ThemeAdapter` has it; paper `useTheme` didn't."* The guard is battle-tested one package over, so closing this before paper ships is low-effort.

**Recommendation (no new design needed).** Mirror the `private static UNSAFE_CSS` / `SAFE_IDENT` pattern from `packages/0/src/composables/useTheme/adapters/adapter.ts:16-52`: validate each color **key** against `SAFE_IDENT` and reject any **value** matching `UNSAFE_CSS` before appending it to `cssVariables`. Values that fail validation should be skipped (as the v0 adapter does via `.filter(...)`).

**Residual risk if unaddressed.** Low while paper stays a placeholder: no real consumers means no path for untrusted input to reach a theme color today. The risk materializes only when paper gains real adoption, at which point the v0 guard's defense-in-depth rationale applies. Land the fix before that transition.

---

### Finding 2 — Low–Medium: `useFeatures` adapters build plain objects keyed by flag names without the `UNSAFE_KEYS` guard

**Locations:**
- `packages/0/src/composables/useFeatures/adapters/launchdarkly.ts:28-32` — `flags[key] = …`
- `packages/0/src/composables/useFeatures/adapters/flagsmith.ts:34-41` — `adapterFlags[key] = …`
- `packages/0/src/composables/useFeatures/adapters/posthog.ts:34-43` — `flags[key] = …`

**Mechanism.** Each adapter iterates the flags reported by its third-party SDK and assigns them into a **plain object** keyed by the provider's flag names:

```ts
// launchdarkly.ts:28-32
for (const [key, value] of Object.entries(allFlags)) {
  flags[key] = isBoolean(value) ? value : { $value: true, $variation: value }
}
```

There is no `UNSAFE_KEYS` filter. A flag literally named `__proto__` (or `constructor`/`prototype`) would write to the object's prototype chain rather than an own property. This is precisely the shape the repo guards elsewhere — `mergeDeep` (`helpers.ts:363`), `usePermissions` (`usePermissions/index.ts:92,96,98`), and `createTokens` all skip `UNSAFE_KEYS` on the same operation. `useFeatures` is the one sink family in this shape that omits it.

**Exploitability caveat (why Low–Medium, not High).** Flag keys originate from the feature-flag provider (LaunchDarkly / Flagsmith / PostHog), not directly from end-user input. Exploitation requires a compromised or misconfigured flag source, or an attacker who can define flag names. That conditionality is why this ranks below Finding 1. The downstream object is also consumed via lookups rather than merged into further structures, limiting blast radius.

**Recommendation.** Import `UNSAFE_KEYS` from `#v0/utilities` and `continue` on `UNSAFE_KEYS.has(key)` inside each adapter's collection loop — identical to the three sibling sinks. Consider a shared helper so all three adapters stay in lockstep.

---

### Finding 3 — Low: `useLocale` restores persisted state with an unvalidated cast

**Location:** `packages/0/src/composables/useLocale/index.ts:216`

```ts
persist: ctx => ctx.selectedId.value,
restore: (ctx, saved) => ctx.select(saved as ID),   // saved comes from localStorage, unvalidated
```

**Mechanism.** The plugin persist/restore lifecycle (`createPlugin/index.ts:191-196`) reads a value out of `localStorage` and hands it to the plugin's `restore` callback as `unknown`. `useLocale` applies it via `saved as ID` — a blind cast with no type/shape check. `localStorage` is user-tamperable and survives schema drift, so a hand-edited or stale entry is applied to locale state without validation. There is **no code-execution path** here (the value flows into locale selection, not into any sink), so impact is limited to state confusion / unexpected locale.

**Notable nuance — the rules doc is stale.** `.claude/rules/composables.md` states that "`useLocale`, `useTheme`, and `useRtl` still blind-cast (`saved as ID` / `saved as boolean`) — sweep pending." That is **no longer accurate**: `useTheme` now validates with a `typeof` guard (`useTheme/index.ts:403` — `if (typeof saved === 'string' || typeof saved === 'number')`) and `useRtl` does too (`useRtl/index.ts:112` — `if (typeof saved === 'boolean')`). **`useLocale` is the sole remaining blind cast.** The rules note should be updated to reflect that the sweep is nearly complete.

**Recommendation.** Follow the pattern the two siblings already adopted (and the canonical `useReducedMotion` literal-union check): validate `saved` is a string/number before `ctx.select(...)`. Also worth a one-line update to `.claude/rules/composables.md` so the doc matches reality.

---

### Finding 4 — Informational observations

None of these are live vulnerabilities; they are documented for completeness and consumer awareness.

- **`useId()` produces sequential, predictable identifiers** (`utilities/helpers.ts:400` — Vue's `useId()` in components, else a module counter `v0-${idCounter++}`). This is correct and SSR-safe for DOM ids, but the values are **not** unguessable. Consumers must never treat a v0-generated id as a security token (CSRF token, session id, capability). Worth a one-line note in consumer guidance.

- **`V0Error` copies a caller-supplied details bag with `Object.assign(this, rest)`** (`utilities/errors.ts:86`) without an `UNSAFE_KEYS` filter. Because it assigns own properties onto a freshly-constructed error instance (not a shared prototype), this is low risk, but it is technically the same object-from-caller-keys shape as Finding 2. Filtering `UNSAFE_KEYS` here too would make the guard uniform.

- **`useStorage` cross-tab sync deserializes same-origin-attacker-controlled payloads.** On a `storage` event it re-parses `e.newValue` (`useStorage/index.ts` storage-event subscription), whose contents another same-origin context controls. This is mitigated by a `try/catch` around `JSON.parse` and a `Map`-based cache, so a malformed/hostile payload degrades to `undefined` rather than polluting state. Defense-in-depth is adequate; flagged only so the trust assumption (same-origin storage is trusted) is explicit.

- **Consumer-responsibility boundaries (headless design, not library bugs).** `BreadcrumbsLink` renders `<Atom :as="'a'">` and lets **all** attributes (`href`, `target`, `rel`, …) fall through from the consumer (`BreadcrumbsLink.vue:8-9`) — so `javascript:`-URL scheme filtering and `target="_blank"` ↔ `rel="noopener"` pairing are the consuming app's responsibility, by design. Similarly `useImage` binds `src` unfiltered (low risk: `javascript:` in `<img src>` does not execute). The threat model already classifies "XSS from user content" as out-of-scope/consumer responsibility; this review confirms the library never sets these attributes itself, so the boundary is clean but should stay documented.

---

## Verified-safe inventory

The following were checked and found to have **no** issue — recorded so coverage is auditable:

- **No dangerous DOM sinks in application logic.** No `v-html`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, or `dangerouslySetInnerHTML` in library `.vue`/`.ts` source. The only `innerHTML` write is the v0 SSR theme adapter, fed exclusively by the sanitized `ThemeAdapter.generate()` output; the client path uses `CSSStyleSheet.replaceSync`/`adoptedStyleSheets`.
- **Prototype-pollution guards intact** across all three keyed-object sinks that have them: `mergeDeep` (`helpers.ts:363`), `usePermissions` (`usePermissions/index.ts:92,96,98`, guarded at all three nesting levels), and `createTokens` path walk/flatten.
- **Registries are `Map`-based** (`createRegistry` and everything built on it — selection, nested, tokens), which is prototype-pollution-immune by construction.
- **Selector construction is escaped.** `CSS.escape()` is used where an id becomes a selector (`Select/SelectRoot.vue:166`, `createCombobox/index.ts:202`); popover anchor names are sanitized with `String(...).replace(/[^a-zA-Z0-9_-]/g, '')` (`PopoverActivator.vue:57`, `usePopover`).
- **No ReDoS surface in filtering/search.** `createFilter` matches with `String(...).toLowerCase().includes(...)` — no `RegExp` is constructed from input anywhere in the composables.
- **No dynamic evaluation, no `postMessage`, no `window.open`/`location` writes, no `new URL`/`XMLHttpRequest`/`Worker`** in library source.
- **`useHydration` serializes no state** — it exposes two booleans flipped after mount; there is no `window.__STATE__`-style injection.
- **DoS-bound guards on count-driven allocation** exist where required (per `.claude/rules/implementation.md`: `createPagination`, `createRating`), and event-listener wrappers (`useEventListener`, `useHotkey`, `useClickOutside`, `useMediaQuery`) use `addEventListener` with no dynamic dispatch; `useClickOutside` wraps `el.matches(selector)` in `try/catch`.

---

## Appendix

### A. Surface reviewed

- **Composables (74)** across `foundation`, `registration`, `forms`, `selection`, `data`, `semantic`, `plugins`, `system`, `reactivity`, `transformers`.
- **Components (~45)** across `primitives`, `providers`, `actions`, `forms`, `disclosure`, `semantic`, `data`.
- **Utilities:** `helpers.ts` (guards, `mergeDeep`, `useId`, `clamp`, `range`, `UNSAFE_KEYS`), `color.ts`, `apca.ts`, `errors.ts`, `instance.ts`.
- **`@vuetify/paper`:** `useTheme` and styling primitives.

### B. Items observed outside the requested scope (not reviewed in depth)

Surfaced during exploration; recorded so they are not lost, but **not** part of this library review. Each would warrant its own pass if the scope is later widened to the apps and CI:

- **Docs site XSS candidates:** `DocsAskMessage.vue` renders AI-assistant responses and `DocsReleases.vue` renders GitHub release-note bodies via `marked` → `v-html` with no sanitizer/DOMPurify. Externally-sourced text rendered as HTML — the highest-value app-side items to verify.
- **Playground trust boundary:** hash-encoded code → `@vue/repl` sandboxed iframe. The isolation rests entirely on the upstream iframe `sandbox` attribute (which uses `allow-scripts` + `allow-same-origin`); `usePlaygroundFiles.ts` also does string-built `insertAdjacentHTML`/`loadStylesheet` keyed off hash-controlled file content, and `usePreviewHealth.ts` reaches into `contentDocument`.
- **CI/supply chain:** `changeset-reminder.yml` uses `pull_request_target` (written defensively — base-branch checkout only; the referenced `scripts/changeset-reminder.js` was not read). Third-party GitHub Actions (`actions/checkout@v6`, `codecov/codecov-action@v5`, etc.) are pinned to mutable major tags rather than commit SHAs, which is a partial mismatch with the "pinned CI actions" hardening claim (that claim scopes to Vuetify-owned actions, which are SHA-pinned).

### C. Suggested remediation order

Ordered by priority in **actually-shipping** code (`@vuetify/v0`):

1. **Finding 2** (`useFeatures` adapters) — add the `UNSAFE_KEYS` skip to all three adapters. Highest-priority shipping issue.
2. **Finding 3** (`useLocale` restore) — add a `typeof` guard matching its two already-fixed siblings, and update the stale note in `.claude/rules/composables.md`.
3. **Finding 1** (paper `useTheme`) — pre-public hardening: mirror the v0 `ThemeAdapter` sanitizer before `@vuetify/paper` graduates from placeholder to a real, consumed package. Low urgency today, low effort (guard already exists).
4. **Finding 4** informational items — optional hardening and one line of consumer guidance about `useId()` predictability.
