# @vuetify/v0

## 1.0.0-rc.9

### Patch Changes

- [#619](https://github.com/vuetifyjs/0/pull/619) [`95d2d34`](https://github.com/vuetifyjs/0/commit/95d2d34c08692b15b9c6d2d173b010d80be7e024) Thanks [@johnleider](https://github.com/johnleider)! - fix(Switch,Form,Slider): correct ARIA states for mixed, native validation, and grouped form controls ([#543](https://github.com/vuetifyjs/0/issues/543))

  - `Switch.Root` and `Switch.SelectAll` no longer emit the spec-invalid `aria-checked="mixed"`; the value is clamped to `false` while indeterminate, so screen readers announce a valid switch state. Style indeterminate switches with `data-state="indeterminate"` as before.
  - `Switch.Thumb` and `Switch.Track` are now marked `aria-hidden="true"`, hiding the decorative visuals from assistive technology.
  - `Form.Root` now renders `novalidate` by default, so the browser's native constraint popups no longer block submit before v0's async validation runs. Opt back into native constraint validation with `:novalidate="false"`.
  - `Slider.Root` now exposes `role="group"` plus optional `label` / `ariaLabelledby` props, giving multi-thumb sliders an accessible group name.

- [#618](https://github.com/vuetifyjs/0/pull/618) [`d611c03`](https://github.com/vuetifyjs/0/commit/d611c03a1c8f462e51cc2a96032a114da8e91328) Thanks [@johnleider](https://github.com/johnleider)! - fix(Avatar,Scrim,Popover,Tooltip,Select,Toggle): restore dropped alt text and complete missing ARIA wiring ([#543](https://github.com/vuetifyjs/0/issues/543))

  - `Avatar.Image` now accepts an `alt` prop and passes consumer attributes (`alt`, `aria-label`, ...) through to the rendered element — previously they were silently dropped
  - `Scrim` backdrops are hidden from assistive technology with `aria-hidden="true"`
  - `Popover.Activator` explicitly exposes `aria-expanded` and `aria-controls` instead of relying on inconsistent native `popovertarget` mapping
  - `Tooltip.Content` closes on Escape when focus is inside interactive tooltip content
  - `Select.Activator` reflects the disabled state (`aria-disabled` + native `disabled`) and stays keyboard-focusable when rendered as a non-button element; `Select.Content` names its listbox via `aria-labelledby`
  - `Toggle.Group` gains `label`, `ariaLabelledby`, and `ariaDescribedby` props so the group can be named

- [#625](https://github.com/vuetifyjs/0/pull/625) [`584668d`](https://github.com/vuetifyjs/0/commit/584668d559add9271593b5089d16c01c25134214) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Carousel): pause autoplay while keyboard focus is inside the carousel ([#625](https://github.com/vuetifyjs/0/issues/625))

  Moving focus into the carousel now pauses auto-rotation and moving focus out resumes it, mirroring the existing pointer/touch behavior and satisfying WCAG 2.2.2 (Pause, Stop, Hide).

- [#627](https://github.com/vuetifyjs/0/pull/627) [`396ea49`](https://github.com/vuetifyjs/0/commit/396ea49d9ddcc17091bfd9907babbb256301e118) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Splitter): give the resize handle a default localized `aria-label` ([#627](https://github.com/vuetifyjs/0/issues/627))

  A `Splitter.Handle` without an explicit `label` now falls back to the localized `Splitter.handle` string ("Resize"), so `role="separator"` always exposes an accessible name to assistive technology (WCAG 4.1.2, Name/Role/Value).

- [#626](https://github.com/vuetifyjs/0/pull/626) [`a1df426`](https://github.com/vuetifyjs/0/commit/a1df4263153830feffacfa23fcab575d1feaf809) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Treeview): expose the active node to assistive technology via `aria-current` ([#626](https://github.com/vuetifyjs/0/issues/626))

  Navigation trees without checkbox selection now convey the current node — the active `treeitem` emits `aria-current="true"` alongside the existing `aria-selected`, so screen readers can announce the focused node.

- [#606](https://github.com/vuetifyjs/0/pull/606) [`9ca3fb3`](https://github.com/vuetifyjs/0/commit/9ca3fb3d23b8b7153083edc2a1dbff48c8b74512) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(useRtl,useTheme): keep SSR head entries in sync with reactive state ([#606](https://github.com/vuetifyjs/0/issues/606))

  During server rendering, the `dir` attribute, `data-theme`, and injected theme styles now update via `entry.patch` when RTL or theme state changes after the initial head push — previously the first-rendered values were frozen for the rest of the request. Adapter disposal also cleans up the new watchers alongside the head entry.

- [#655](https://github.com/vuetifyjs/0/pull/655) [`65952f2`](https://github.com/vuetifyjs/0/commit/65952f27190745da40ff62e82505cf04c56a6a40) Thanks [@johnleider](https://github.com/johnleider)! - chore(maturity): promote the 1.0 component spine to `stable` — 13 headless components are now API-locked for 1.0: the primitives `Atom` and `AspectRatio`, the providers `Theme`, `Group`, `Selection`, `Single`, and `Step`, the `Tabs`, `Toggle`, and `Collapsible` disclosure/interaction components, and the `Checkbox`, `Radio`, and `Switch` form controls. Three supporting composables graduate with them — `useProxyModel`, `toElement`, and `toArray` — because every promoted component rests on them, and a stable component cannot sit on a `preview` logic layer. No behavior or signature changes: this is a stability commitment, not a code change, so no consumer action is required.

- [#589](https://github.com/vuetifyjs/0/pull/589) [`3b5565d`](https://github.com/vuetifyjs/0/commit/3b5565d8450260e4ca27174e710c19082bf82ef1) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): follow a `{alias}` reached through a segment path ([#566](https://github.com/vuetifyjs/0/issues/566))

  `resolve()` now re-resolves an alias that a dotted-segment lookup lands on, instead of returning the raw `'{alias}'` string. This is visible under `flat: true` (where nested groups are stored whole and addressed by segment), so `useTheme` — which resolves theme colors through a `flat: true` token table — no longer drops or leaks an unresolved `{alias}` for a palette entry that is itself an alias. The leaf-value branch already followed terminal aliases; the segment branch now matches it.

- [#648](https://github.com/vuetifyjs/0/pull/648) [`4c2ede3`](https://github.com/vuetifyjs/0/commit/4c2ede35af553631e2af9383014288a476f2636a) Thanks [@johnleider](https://github.com/johnleider)! - fix(Tooltip): expose anchor styles on Tooltip.Activator's renderless slot

  `Tooltip.Activator` now surfaces its CSS anchor-positioning styles as a `styles` slot prop (mirroring `Tooltip.Content`). In renderless mode the activator no longer renders its own element, so previously the anchor name was lost and the tooltip content could not position. Consumers can now bind `attrs` and apply `styles` onto their own trigger element — e.g. attaching a tooltip to a native `<button type="submit">` without the activator overriding its `type`.

## 1.0.0-rc.8

### Patch Changes

- [#546](https://github.com/vuetifyjs/0/pull/546) [`03b298f`](https://github.com/vuetifyjs/0/commit/03b298f61270dea573e64f618b48173de20cbd4d) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - fix(Combobox): route ComboboxEmpty default slot text through useLocale

  The hardcoded `"No results"` fallback in `ComboboxEmpty` was not going through `useLocale`, violating PHILOSOPHY §5.5 (locale-first strings). Added a `Combobox.noResults` key to the English message bundle and changed the default slot content to `{{ locale.ti('Combobox.noResults') ?? 'No results' }}`, matching the pattern used by `Dialog.Close` and other components. Consumers who override the default slot are unaffected.

- [#555](https://github.com/vuetifyjs/0/pull/555) [`9c04ead`](https://github.com/vuetifyjs/0/commit/9c04eadc12c5b2f037aa1202184fe70142646030) Thanks [@johnleider](https://github.com/johnleider)! - perf(createDataGrid): dramatically faster sorting, drag-reordering, and initialization on large grids ([#555](https://github.com/vuetifyjs/0/issues/555))

  Grids with thousands of rows are far faster to sort, drag-reorder, and build — a 10k-row sort is ~28× faster, drag-reordering ~6.5×, and initial construction ~2×. No API change and no migration: existing grids get the speedup on upgrade.

- [#585](https://github.com/vuetifyjs/0/pull/585) [`da2e0c1`](https://github.com/vuetifyjs/0/commit/da2e0c115fb3b1001634a392162c8e22e82a8bfa) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSelection): disabled tickets are now inert to unselect and toggle

  Gesture operations (select, unselect, toggle) no longer mutate disabled tickets in either direction. Wholesale operations (apply/v-model, selectAll, cascade propagation, clear) still drain disabled ids so state can never get stuck.

- [#579](https://github.com/vuetifyjs/0/pull/579) [`23e7a0b`](https://github.com/vuetifyjs/0/commit/23e7a0b421d74397c1a70fbb59c99781c52ebb96) Thanks [@johnleider](https://github.com/johnleider)! - fix(createNested): leaf-mode parent unselect respects mandatory atomically instead of half-clearing the branch

- [#584](https://github.com/vuetifyjs/0/pull/584) [`df823ca`](https://github.com/vuetifyjs/0/commit/df823cad723bb23dc67ce98036d795ce064173dc) Thanks [@johnleider](https://github.com/johnleider)! - fix(createNumberField): commit now no-ops while disabled or readonly, matching increment and decrement

- [#580](https://github.com/vuetifyjs/0/pull/580) [`52b0ea8`](https://github.com/vuetifyjs/0/commit/52b0ea8387242de5f43424d37f2d0c9d80727f74) Thanks [@johnleider](https://github.com/johnleider)! - fix(createProgress): fromValue offsets by min so ProgressFill width matches the ARIA percent

- [#582](https://github.com/vuetifyjs/0/pull/582) [`e741325`](https://github.com/vuetifyjs/0/commit/e741325cf10874c682acd119529e4cdb44a9fb26) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSelection): apply fully replaces the selection under multiple+mandatory instead of stranding a stale id

- [#583](https://github.com/vuetifyjs/0/pull/583) [`9127759`](https://github.com/vuetifyjs/0/commit/9127759efd6dc53b18e260d238277825fed017ea) Thanks [@johnleider](https://github.com/johnleider)! - fix(createSlider): thumb operations (set, up, down, floor, ceil) now no-op while disabled, as documented

- [#581](https://github.com/vuetifyjs/0/pull/581) [`cdc9fb5`](https://github.com/vuetifyjs/0/commit/cdc9fb556844f5545227ca88eb44c4401afc69c7) Thanks [@johnleider](https://github.com/johnleider)! - fix(createForm): submit no longer reports failure when a field validation was superseded by a newer concurrent call

  A superseded validate() now resolves to the latest validation's outcome instead of false, so double-submits and concurrent field validation report the form's actual validity.

- [#587](https://github.com/vuetifyjs/0/pull/587) [`7f01ea0`](https://github.com/vuetifyjs/0/commit/7f01ea01b211bc0c0c3defa86c13c8ab5c6bffa8) Thanks [@johnleider](https://github.com/johnleider)! - fix(useProxyModel): apply the current v-model to late-registering tickets ([#587](https://github.com/vuetifyjs/0/issues/587)) — when the v-model changed before a value's ticket registered (e.g. tabs, carousels, or button groups whose items load asynchronously), the stale value was still selected once the ticket arrived, leaving the registry out of sync with the v-model. Late registration now honours the current model value.

- [#570](https://github.com/vuetifyjs/0/pull/570) [`e770c89`](https://github.com/vuetifyjs/0/commit/e770c89545cf4ec6666cc2b743f78938851fa7c6) Thanks [@johnleider](https://github.com/johnleider)! - fix(createRegistry): dispatch batched events even when the batch callback throws ([#570](https://github.com/vuetifyjs/0/issues/570))

  Event-driven consumers (e.g. `useProxyRegistry` snapshots) no longer go stale when a batch or `onboard` throws after some mutations already applied — the queued events for those applied mutations now flush regardless of whether the callback completes.

- [#565](https://github.com/vuetifyjs/0/pull/565) [`05be673`](https://github.com/vuetifyjs/0/commit/05be673d6affb83143a8dcba04554fac49d43c64) Thanks [@johnleider](https://github.com/johnleider)! - fix(createRegistry): heal offboard reindex, id identity, and batched field-only upserts

  Three correctness fixes to the registry foundation:

  - **`offboard` now eagerly reindexes** when index-derived tickets shift position, so `values()` / `entries()` and `useProxyRegistry` consumers see corrected `index` / `value` immediately — previously a mid-list `offboard()` left the default (index-valued) survivors stale until some later position-reading call drained the deferred reindex, and iteration-only consumers never healed. It also drops the stale iteration cache before the removals so a sync effect firing mid-`offboard` never observes removed ids.
  - **`offboard` preserves a supplied `id`** across a transfer even when the ticket has no explicit value. It previously used `valueIsIndex` as a proxy for "id was auto-generated" and stripped the id of any value-less ticket, so `register({ id: 'a' })` → `offboard(['a'])` returned `{}` and lost identity. Now only ids the registry itself minted are stripped. **Behavior delta for the selection chain:** `createModel` and everything built on it mint ids in their wrappers before calling `register`, so those ids read as supplied to the base registry — `offboard` now preserves them where it previously stripped them for value-less tickets. Downstream transfers (e.g. moving items between selections) keep their identity instead of getting a fresh id on re-onboard.
  - **`batch()` no longer re-notifies iteration subscribers for a field-only upsert (or an empty batch)**, matching the non-batched `upsert` contract (§4.4): a batch that changes no membership or order leaves version subscribers untouched.

- [#569](https://github.com/vuetifyjs/0/pull/569) [`e653ef5`](https://github.com/vuetifyjs/0/commit/e653ef59537ccb489765b505b320a1db18cf5133) Thanks [@sridhar-3009](https://github.com/sridhar-3009)! - test(plugins): lock in SSR safety for every plugin composable ([#569](https://github.com/vuetifyjs/0/issues/569))

  Adds an SSR contract test to each plugin composable — no throw without a provider, and a fresh fallback per call so nothing leaks between requests — plus a guard that fails if a new plugin ships without one. The `useStack` leak these guard against was fixed in [#442](https://github.com/vuetifyjs/0/issues/442).

- [#586](https://github.com/vuetifyjs/0/pull/586) [`562bd14`](https://github.com/vuetifyjs/0/commit/562bd1457c5c5b05c73fa8af69b4a61cef029451) Thanks [@johnleider](https://github.com/johnleider)! - fix(Switch): keep `Switch.Thumb` visible in every state — it no longer forces an inline `visibility: hidden` when the switch is off. The thumb had inherited the "present-when-on" indicator template from `Checkbox`/`Radio`/`Toggle`, but a switch knob is always visible and slides between positions. The inline style also sat at the top of the cascade, forcing consumers to override it with `visibility: visible !important`. Drive the off/on appearance from the `data-state` attribute (`checked` / `unchecked` / `indeterminate`) — e.g. `translate-x-1 data-[state=checked]:translate-x-6` — which now animates directly from the off position. `Switch.Thumb`'s slot `attrs` no longer includes a `style` key.

- [#564](https://github.com/vuetifyjs/0/pull/564) [`ef7316b`](https://github.com/vuetifyjs/0/commit/ef7316bb08861501cf163aebac4c805b61c89da5) Thanks [@johnleider](https://github.com/johnleider)! - fix(createTokens): mutators now forward their `event` argument and `ticket.value` is typed accurately under `flat: true` ([#564](https://github.com/vuetifyjs/0/issues/564))

  `upsert` (and the other registry mutators) silently dropped the optional `event` argument, so custom events never emitted for token registries; the wrappers now forward it and match the inherited `RegistryContext` signatures. `TokenValue` also widens to include `TokenCollection` so `ticket.value` reflects the nested objects stored under `flat: true` — the mode `useTheme`/`useFeatures` rely on — instead of claiming leaf/alias only.

  If you exhaustively narrow a `TokenValue` (or `ticket.value`) in a `switch`/type guard, add a `TokenCollection` (object) branch — the union now has an object member alongside the primitive and alias cases.

- [#588](https://github.com/vuetifyjs/0/pull/588) [`237c90a`](https://github.com/vuetifyjs/0/commit/237c90a6888b364e0c4bb650c8b79e69745c6a5b) Thanks [@johnleider](https://github.com/johnleider)! - fix(createValidation): stop `isValidating` sticking `true` when a silent validation interleaves an async one ([#588](https://github.com/vuetifyjs/0/issues/588)) — triggering a silent `validate()` while a non-silent async validation was still in flight left `isValidating` stuck at `true` (a permanent loading/validating state) until the next clean validation. The flag is now owned by the latest non-silent run and clears reliably.

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
