# @vuetify/v0

## 1.0.0-rc.7

### Patch Changes

- [#540](https://github.com/vuetifyjs/0/pull/540) [`2ed9618`](https://github.com/vuetifyjs/0/commit/2ed9618ed365ef9e1a6c6b3bce6c4c6962f689e0) Thanks [@johnleider](https://github.com/johnleider)! - perf(createRegistry): memoize reactive keys/values/entries behind a version signal

  Reactive-mode iteration reads previously bypassed the result cache and read the
  order array through its shallowReactive proxy — one trap per index and, inside
  an effect, one tracked dependency per index. Reads now touch a single version
  signal (bumped on every structural mutation) and share the non-reactive cache,
  making reactive reads O(1) between mutations and giving subscribing effects one
  dependency regardless of collection size. Mid-batch reads now always reflect
  mutations already applied instead of a stale pre-batch snapshot.

- [#531](https://github.com/vuetifyjs/0/pull/531) [`49e4f8b`](https://github.com/vuetifyjs/0/commit/49e4f8b7235f3c2a5213ccce63850b8b78014f66) Thanks [@johnleider](https://github.com/johnleider)! - perf(createRegistry): use O(1) ticket.index for unregister splice locate (with indexOf fallback); avoid values() allocation/copy in seek first/last; never eagerly drain reindex in unregister to preserve the lazy contract

- [#489](https://github.com/vuetifyjs/0/pull/489) [`5c6d087`](https://github.com/vuetifyjs/0/commit/5c6d0871ddc148c52fe6ba4cbd569b433f7b77fc) Thanks [@johnleider](https://github.com/johnleider)! - fix(security): apply prototype-pollution and CSS-injection guards flagged in the security review

  - `useFeatures` adapters (LaunchDarkly / Flagsmith / PostHog) now skip `UNSAFE_KEYS` (`__proto__` / `constructor` / `prototype`) flag names when building the flags object, matching the guard already used by `mergeDeep`, `usePermissions`, and `createTokens`
  - `useLocale` `restore()` validates the persisted value with `isString` / `isNumber` guards before applying it instead of blind-casting `saved as ID`, completing the persist/restore sweep (`useTheme` and `useRtl` now use the same guards)
  - `ThemeAdapter`'s `UNSAFE_CSS` denylist is hardened against declaration injection: it now also rejects `;`, `\` (CSS escape evasion), and the URL-loading functions `src()` / `image()` / `image-set()` / `cross-fade()`
  - `@vuetify/paper` `useTheme` sanitizes color keys and values before writing them into the injected `<style>` element, mirroring the hardened v0 `ThemeAdapter` `SAFE_IDENT` / `UNSAFE_CSS` guards
  - `@vuetify/paper` `createTheme` now merges `options.themes` into the defaults — previously they were passed as `structuredClone`'s options bag and silently dropped, so a custom `current` theme threw at first render
  - `V0Error` filters `UNSAFE_KEYS` when copying caller-supplied error details onto the instance

- [#500](https://github.com/vuetifyjs/0/pull/500) [`ffc4e5a`](https://github.com/vuetifyjs/0/commit/ffc4e5aaec7df81b1b62f022fe78cb4dfc5ef01b) Thanks [@johnleider](https://github.com/johnleider)! - fix(useRules): accept spec-compliant Standard Schema issue paths

  Widens the vendored `StandardSchemaV1` issue `path` typing to `ReadonlyArray<PropertyKey | PathSegment>` per the Standard Schema v1 spec, so schemas typed with `@standard-schema/spec` (Valibot, Zod, ArkType) are assignable to `rules` again.

- [#542](https://github.com/vuetifyjs/0/pull/542) [`76ca193`](https://github.com/vuetifyjs/0/commit/76ca1933d9c147a1f3ca53e4e9a9f579b49169cc) Thanks [@johnleider](https://github.com/johnleider)! - perf(createRegistry): skip version notification on field-only upsert

  Patching an existing ticket via `upsert` no longer re-notifies version-subscribed
  iterating effects — membership and order are unchanged, and field changes already
  propagate through the shallowReactive ticket proxies and the `update:ticket`
  event. The read cache still refreshes so event-driven snapshot consumers
  (`useProxyRegistry`) observe a fresh array identity. This restores the pre-[#540](https://github.com/vuetifyjs/0/issues/540)
  iteration granularity for field patches.

## 1.0.0-rc.6

### Patch Changes

- [#470](https://github.com/vuetifyjs/0/pull/470) [`38b27ed`](https://github.com/vuetifyjs/0/commit/38b27edba93ecf4b2f9f9fb4d323bce0f4504d05) Thanks [@johnleider](https://github.com/johnleider)! - chore(maturity): promote the v1 stable set to `stable` — the selection family (`createModel`, `createSelection`, `createSingle`, `createStep`, `createGroup`, `createNested`), `createRegistry`, and the plugin trio (`useTheme`, `useStorage`, `useBreakpoints`) are now API-locked for 1.0. They join the already-stable foundation (`createContext`, `createPlugin`, `createTrinity`) and observer (`useIntersectionObserver`, `useMutationObserver`, `useResizeObserver`) composables, bringing the stable surface to 16 composables plus the 17 stable utilities.

## 1.0.0-beta.5

### Patch Changes

- [#451](https://github.com/vuetifyjs/0/pull/451) [`fe12826`](https://github.com/vuetifyjs/0/commit/fe12826195d1d887681c9bab67506de2ddd7b391) Thanks [@johnleider](https://github.com/johnleider)! - fix: bring component ARIA/data attributes into PHILOSOPHY §3.6 compliance — `ExpansionPanel` content now emits `data-selected` as `true | undefined` (it was a raw boolean, so `[data-selected]` matched even when unselected), and `Slider` thumb / `Rating` root now emit `aria-disabled` as a concrete boolean (it was `true | undefined`, which dropped the attribute when not disabled).

## 1.0.0-beta.4

### Minor Changes

- [#372](https://github.com/vuetifyjs/0/pull/372) [`d075615`](https://github.com/vuetifyjs/0/commit/d0756155c3c5a8d480cf32a4d56ec162b1751bc3) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - feat(locale): add `ti()` so components carry inline English aria labels without bundling a locale (WCAG 4.1.2)

  - `locale.ti(key, ...params)` ("translate if exists") returns the translation or `undefined` instead of echoing the key, enabling the `ti(key) ?? '<default>'` pattern at call sites
  - Every v0 component now provides a built-in English aria label via `ti(...) ?? '<default>'`, so apps with no locale plugin get meaningful accessible names — with zero strings bundled into the runtime fallback
  - `@vuetify/v0/locale/messages/en` is exposed as an optional export: the canonical English catalog, handy for seeding a translation or registering full English coverage (never imported by the runtime)

- [#397](https://github.com/vuetifyjs/0/pull/397) [`19aac62`](https://github.com/vuetifyjs/0/commit/19aac62a16c6e236152e176ef6611a07d3ca359b) Thanks [@johnleider](https://github.com/johnleider)! - fix(Dialog, Snackbar): overlays can teleport into the topmost open modal so snackbars shown over a modal Dialog appear above it and stay interactive ([#279](https://github.com/vuetifyjs/0/issues/279))

  A native modal `<dialog>` (`showModal()`) is promoted to the browser **top layer**, which paints above all `z-index` and makes everything outside its subtree inert — so an overlay teleported to `body` rendered beneath the dialog and was unclickable. Overlays can now teleport into the top-layer subtree instead:

  - `Snackbar.Portal` now defaults `teleport` to `'top-layer'`, mounting into the topmost open modal `<dialog>` when one is open and falling back to `body` otherwise. `teleport="body"` (always body) and `:teleport="false"` (render inline) remain escape hatches.
  - `Portal` accepts a new `to="top-layer"` token that resolves to the topmost modal element, or `body` when no modal is open.
  - `useStack` exposes a new `topElement` context field and an `el` option on `register()`, so modal dialogs publish their element as the teleport target.
  - `useClickOutside` bounds mode no longer treats a strict DOM descendant as an outside click, so clicking an overlay teleported into a `<dialog>` (e.g. a Snackbar and its close button) no longer dismisses the dialog. Backdrop clicks (target is the dialog itself) still close it.

### Patch Changes

- [#443](https://github.com/vuetifyjs/0/pull/443) [`2f4275c`](https://github.com/vuetifyjs/0/commit/2f4275cb3dd3162aa89bb0183159380039b5a35d) Thanks [@johnleider](https://github.com/johnleider)! - fix(build): ship type declarations for the `@vuetify/v0/browser` entry — `./browser` mapped to `./dist/browser/index.js` with no `.d.ts`, so `are-the-types-wrong` flagged it `UntypedResolution` and TypeScript consumers importing `@vuetify/v0/browser` got no types. The browser bundle now emits `dist/browser/index.d.ts` (it bundles the same `src/index.ts` as the main entry, so its types are identical), and the `repo:exports` attw check no longer needs to exclude the browser entrypoint.

- [#390](https://github.com/vuetifyjs/0/pull/390) [`5db6a0d`](https://github.com/vuetifyjs/0/commit/5db6a0de80821b48603b876ba420a99c1bcf7ad1) Thanks [@johnleider](https://github.com/johnleider)! - fix(Button): don't auto-set aria-label in renderless mode — in renderless mode the consumer owns the DOM and is responsible for the accessible name; the automatic icon-only fallback no longer overrides visible text in mixed-content renderless usages

  Also migrates the solo icon-only fallback to `locale.ti('Button.label') ?? 'Button'`, matching the inline accessible-name default every other component now ships, so an unconfigured app gets `"Button"` instead of the raw `Button.label` key.

- [#426](https://github.com/vuetifyjs/0/pull/426) [`dc0fc00`](https://github.com/vuetifyjs/0/commit/dc0fc00d5a61dcdfe108ffbb52682407971ef1b5) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSelection): reject disabled items in multiple-mode `apply()` — the v-model sync path (`apply()`) could select a disabled item even though `select`/`unselect`/`toggle` all reject them, violating the "disabled = all selection ops are no-ops" contract. `createModel.apply()`'s browse-fallback now routes through `select()` (which guards instance- and ticket-level `disabled`), and `createSelection.apply()`'s multiple branch gains an inline per-ticket guard before adding (kept inline rather than routed through `select()` so the single-mode `multiple: true` override still works). The ref-write value-sync path is untouched. Affects multiple-mode `createSelection`/`createGroup`/`createNested` via `useProxyModel`.

- [#371](https://github.com/vuetifyjs/0/pull/371) [`3ee1d85`](https://github.com/vuetifyjs/0/commit/3ee1d851b384166217368b6f428c398f18e7515d) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(NumberField): pass parsed value directly to commit() so typed values correctly propagate to the parent v-model on blur and Enter — avoids reading the stale model before Vue's reactivity round-trip completes

- [#417](https://github.com/vuetifyjs/0/pull/417) [`0cd2de5`](https://github.com/vuetifyjs/0/commit/0cd2de57d4e113784ba28a0cb98896386af8755b) Thanks [@johnleider](https://github.com/johnleider)! - perf(Overflow): cache item visibility in a hidden-index set, dropping per-item O(n) rank scans to O(1) (whole-list visibility goes from O(n²) to O(n) per resize)

- [#416](https://github.com/vuetifyjs/0/pull/416) [`6e8f86c`](https://github.com/vuetifyjs/0/commit/6e8f86ceb1fcc59b82b9b1f0e0b3e236438269df) Thanks [@johnleider](https://github.com/johnleider)! - fix(usePopover): coerce the synthesized `anchor-name` / `position-anchor` custom-ident to a valid charset

  A consumer-supplied `id` (or activator `target` / content `_id`) containing non-ident characters produced an invalid `--${id}` custom-property name. The browser rejects it on the client (`style.setProperty` drops the whole inline value), so anchor positioning silently broke. The interpolated identifier is now coerced to `[a-zA-Z0-9_-]`, mirroring the `SAFE_IDENT` guard `ThemeAdapter` already applies. The raw `id` is still used verbatim for the DOM element id and the `popovertarget` linkage — only the CSS custom-ident is coerced, so the native popover wiring is unchanged.

- [#424](https://github.com/vuetifyjs/0/pull/424) [`ceaeba8`](https://github.com/vuetifyjs/0/commit/ceaeba80fd89e1e7e190e82bdc94fea23d9e875f) Thanks [@johnleider](https://github.com/johnleider)! - fix(useTheme): remove the adopted stylesheet on V0 adapter dispose — the browser adapter (`V0StyleSheetThemeAdapter`) appended a `CSSStyleSheet` to `document.adoptedStyleSheets` in `upsert()` but `dispose()` only stopped the Vue watchers, leaking orphaned sheets on repeated mount/unmount (HMR, test suites, micro-frontend teardown). Dispose now filters the sheet out of `adoptedStyleSheets` and clears the ref across all three dispose paths, mirroring the sibling unhead adapter. Follow-up to the leak-safe adapter lifecycle work.

- [#441](https://github.com/vuetifyjs/0/pull/441) [`bf61d28`](https://github.com/vuetifyjs/0/commit/bf61d285eb184ebb8ecf49a73a201e1dc1e5f468) Thanks [@johnleider](https://github.com/johnleider)! - fix(useTheme): apply `cspNonce` on the SSR head path — `V0StyleSheetThemeAdapter` accepted a `cspNonce` option but never applied it: the SSR `head.push` `<style>` was emitted without the nonce, so strict-CSP (`style-src 'nonce-…'`) apps had their server-rendered theme styles blocked (FOUC until client hydration). The nonce is now threaded into the SSR style entry, and `V0UnheadThemeAdapter` accepts and forwards `cspNonce` too (initial push, reactive patch, and `update()`). The nonce is added only when set, so non-CSP usage is unchanged. The client `adoptedStyleSheets` path correctly needs no nonce.

- [#440](https://github.com/vuetifyjs/0/pull/440) [`999c41f`](https://github.com/vuetifyjs/0/commit/999c41fbd960cd394b82974b0ea2618a8aa819d8) Thanks [@johnleider](https://github.com/johnleider)! - fix(useTheme): validate the theme adapter `prefix` against `SAFE_IDENT` — `ThemeAdapter.generate()` sanitized theme names, color keys, and values, but interpolated the adapter `prefix` into the generated CSS (`--${prefix}-…`, `var(--${prefix}-on-background)`) unvalidated, so a malformed prefix (e.g. containing `}`) could break out of the declaration block and inject arbitrary CSS rules. The constructor now rejects any prefix that doesn't match `SAFE_IDENT` (`/^[a-zA-Z0-9_-]+$/`) with a `V0Error` (`V0_THEME_INVALID_PREFIX`), mirroring the guard already applied to adjacent inputs and the `V0_PALETTE_INVALID_SEED` precedent. Both `V0StyleSheetThemeAdapter` and the unhead adapter inherit it. Non-breaking — valid prefixes already match.

- [#427](https://github.com/vuetifyjs/0/pull/427) [`0c355e6`](https://github.com/vuetifyjs/0/commit/0c355e657b37c9254e8159486b69c01b4fdb2c18) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): `resolve()` no longer returns inherited prototype members — the alias-path walk used `segment in current`, which traverses the prototype chain, so resolving a path whose final segment named an `Object.prototype` member (`constructor`, `toString`, `hasOwnProperty`, `__proto__`, …) returned that builtin instead of `undefined` + the "Path not found" warning. `resolve()` now mirrors `flatten()`'s guard (`UNSAFE_KEYS` + `Object.prototype.hasOwnProperty.call`). Correctness/defense-in-depth — config and the resolve argument are developer-authored, so this is a consistency fix, not a security fix.

- [#370](https://github.com/vuetifyjs/0/pull/370) [`7bd450c`](https://github.com/vuetifyjs/0/commit/7bd450c13c6d904bffe16ed320420e8fe78e9dab) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Treeview): don't intercept keyboard events originating from embedded interactive controls (switches, comboboxes, etc.) so they can handle their own key events

- [#341](https://github.com/vuetifyjs/0/pull/341) [`ab6da17`](https://github.com/vuetifyjs/0/commit/ab6da170680a383f26b9292975ef3aa6e2494c4f) Thanks [@J-Sek](https://github.com/J-Sek)! - fix(Treeview): let keyboard focus reach controls inside items

  Tab and Shift+Tab now move focus between a tree node and the focusable controls it contains. Tabbing out of a control advances from that control's own row, and `aria-disabled` controls are skipped.

- [#418](https://github.com/vuetifyjs/0/pull/418) [`9063b2c`](https://github.com/vuetifyjs/0/commit/9063b2c21e1f375b83e5926bd8a911094b3f2771) Thanks [@johnleider](https://github.com/johnleider)! - fix(useStack): make ticket blocking/scrim reactive

  `register()` now accepts `MaybeRefOrGetter` for `blocking`/`scrim` and exposes them as `Readonly<Ref<boolean>>` on the ticket, so a reactive `blocking` (e.g. a Dialog backing VDialog's reactive `persistent`) propagates instead of freezing at registration. `Dialog`/`AlertDialog`/`Portal` now pass them as getters.

  Type change: `StackTicket.blocking`/`scrim` are now `Readonly<Ref<boolean>>` (were `boolean`) — read `.value`. Reads are internal to v0; `register()` still accepts plain booleans.

- [#442](https://github.com/vuetifyjs/0/pull/442) [`789c2e9`](https://github.com/vuetifyjs/0/commit/789c2e94ec6998dc00b815f3aeb856ea40b1ffbb) Thanks [@johnleider](https://github.com/johnleider)! - fix(useStack): don't share the fallback stack across SSR requests — `useStack()` fell back to a module-scoped singleton when no provider existed, so in a long-lived Node SSR process overlay tickets persisted across requests (z-index bleed + unbounded memory growth). Under SSR (`!IN_BROWSER`), `getStackFallback()` now returns a fresh ephemeral `createStack()` per call instead of the shared global; the browser singleton is unchanged. For coordinated per-app SSR z-index, use `createStackPlugin` (as the docs already advise).
