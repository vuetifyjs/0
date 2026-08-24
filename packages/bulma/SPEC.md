# @paper/bulma — Design Spec

## Identity

**Class:** Compat (third class — see [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md)
*Compat class*). This file is the living spec.

Bulma ships zero JavaScript by design — its docs tell you to bring your own JS for modal,
dropdown, navbar burger, and dismissals; `@paper/bulma` is that JS. Components render
Bulma's real markup and classes against the user's own `bulma.css`, while `@vuetify/v0`
provides all behavior, focus management, and accessibility. A second wedge resurrects the
abandoned `bulma-extensions` ecosystem (switch, slider, steps, tooltip, …) on v0
primitives, themed by the user's own Bulma variables.

Component prefix: `Bu*` (`B*` is reserved for a future Bootstrap compat).

## Upstream pin

- **Peer:** `bulma@^1.0` — optional (`peerDependenciesMeta`); zero-config consumers may
  load Bulma off-CDN, so the package never hard-requires the npm dependency.
- Latest verified: **1.0.4**.
- Bulma 0.9.x explicitly unsupported (no CSS variables).
- No stylesheet artifact: the compat class ships no CSS for Tier 1 — the user's own
  `bulma.css` (css, sass, or CDN) is the styling source.

## Declared deviations from DESIGN_SYSTEMS.md

Inherent to the compat class — the package's entire purpose is markup fidelity against an
upstream CSS framework:

1. **No owned token namespace** (deviation from **ruling 1**) — `--bulma-*` belongs to
   upstream. There is no `theme.ts`-owned prefix. Tier 1 ships no plugin; a later
   optional `createBulmaPlugin()` would drive upstream's own `--bulma-*` variables
   and `data-theme` via `V0StyleSheetThemeAdapter`, never an owned prefix.
2. **Upstream state classes, unprefixed** (deviation from **ruling 3**) — `is-active`,
   `is-current`, `is-hoverable` instead of data-attribute hooks, and Bulma's unprefixed
   class names (`.modal`, `.dropdown`) instead of package-prefixed ones (`bulma-*`).
   State classes are owned by the component and driven by v0 state.
3. **Native form controls where Bulma's CSS demands them** (deviation from **ruling 2**,
   "never compose native HTML form controls") — Bulma styles native `<select>`,
   `<input type=checkbox/radio/file>` wrapped in `.select`/`.checkbox`/`.file`; a
   non-native BuSelect gets none of the user's CSS. Tier 1 form components wrap natives;
   rich equivalents (BuCombobox) live in Tier 2 on full v0 primitives. Verified per
   component during build — where v0's primitive already renders a compatible element,
   it is preferred.

Rules kept in full: never `<style scoped>`; behavioral components compose v0 compound
primitives; a11y via v0, verified by the axe sweep; conformance harness diffs rendered
markup against bulma.io's documented fixtures.

## Known limitations (Tier 1)

- **Global `<Scrim>` double-backdrop:** v0's `DialogContent` registers its stack ticket
  without a way to mark it `scrim: false`, so an app that mounts v0's global `<Scrim>`
  renders a second backdrop behind every `BuModal` (which hand-rolls `.modal-background`,
  since Scrim is global/per-ticket and cannot serve as an in-flow per-modal element).
  Candidate v0-core follow-up alongside a reusable `useFocusTrap`
  ([#910](https://github.com/vuetifyjs/0/issues/910),
  [#909](https://github.com/vuetifyjs/0/issues/909)) — BuModal currently
  hand-rolls focus containment because v0 ships no focus-trap composable.
- **`label[disabled]` (BuCheckbox/BuRadio):** Bulma documents the non-standard `disabled`
  attribute on the wrapping `<label>` and its CSS selects on it; the components reproduce
  it (alongside the input's real `disabled`). Expect axe/validator discussion — deliberate
  markup fidelity.
- **BuModalCard's `aria-labelledby` needs BuModalTitle:** v0's dialog context mints a
  `titleId` whether or not a title is mounted, and BuModalCard binds it unconditionally, so
  a card composed without BuModalTitle points `aria-labelledby` at an element that does not
  exist. Bulma's own card markup always ships a `.modal-card-title`; compose one (or drop
  BuModalHead entirely and label the panel yourself).
- **Esc closes a `blocking` BuModal:** matches v0 Dialog semantics (`blocking` gates
  scrim-click dismissal only, mirroring native `<dialog>` cancel). Revisit if the DS wants
  `blocking` to gate keyboard dismissal too.
- **BuTab arrow keys move selection, not focus:** Tabs.Item renders renderless (the
  fixture demands `li > a` with `is-active` on the `li`), so it registers no element and
  v0's `focusSelectedTab`/`focusAdjacent` are no-ops — ArrowLeft/ArrowRight update
  selection, panels, and `aria-selected`, but the visible focus ring and screen-reader
  announcement stay on the previously focused anchor (APG tabs deviation the axe sweep
  cannot catch). v0-core follow-up: let TabsItem accept an element input via
  registration so renderless consumers can supply the focus target
  ([#912](https://github.com/vuetifyjs/0/issues/912)).
- **BuBreadcrumb hand-rolls its markup:** v0 BreadcrumbsRoot's overflow watcher hides
  middle crumbs whenever measured capacity < item count even with no Ellipsis
  registered — items silently disappear where upstream Bulma flex-wraps. Since
  BuBreadcrumb uses no other compound behavior (no v-model, no overflow UI), Tier 1
  renders plain `nav > ul > li > a` + `aria-current="page"`. v0-core follow-up:
  BreadcrumbsRoot should skip the truncation branch when no ellipsis ticket is
  registered (or expose an overflow opt-out)
  ([#911](https://github.com/vuetifyjs/0/issues/911)).
- **Ambient `Input.Root` owns the whole behavioral surface of BuInput/BuTextarea:**
  inside an ambient root, `v-model`, `type`, `disabled`, `readonly`, `required`,
  `name`, `form`, `id`, and validation props on the Bu component are ignored (the
  root's control attrs win the merge — v0's `mergeProps` assigns even `undefined`
  keys, so a wrapper cannot force `readonly`; v0-core follow-up: InputControl should
  omit falsy keys — [#913](https://github.com/vuetifyjs/0/issues/913)). `plaintext` is class-only there.
- **Ambient `NumberField.Root` owns the whole behavioral surface of
  BuNumberField:** BuNumberField detects an ambient root on its namespace and
  renders a plain `.field.has-addons` div instead of creating a second one (a
  nested root would shadow the outer one for every part). Inside that ambient
  root, `v-model`, `min`/`max`/`step`/`leap`/`wrap`/`clamp`/`commitOn`, `locale`/`format`,
  `wheel`/`spinDelay`/`spinRate`, `id`, `name`, `form`, `label`, `required`,
  `disabled`, `readonly`, and all validation props passed to BuNumberField are
  ignored — the root owns them. Only the presentational modifiers (`color`,
  `size`, `rounded`, `addons`, and the part's `expanded`) still apply. Same
  shape as the BuInput/BuTextarea limitation above.
- **Sibling `BuLabel`/`BuHelp` need `namespace="v0:number-field:root"`:**
  BuNumberField provides v0's number-field context, not `v0:input:root`, so a
  BuLabel/BuHelp left on the default namespace injects nothing and renders
  unwired — the same half-wired trap as BuInput, with a second namespace to get
  wrong. The shapes are compatible (`InputError` uses only `errors`,
  `fieldErrors.register`, and `errorId`; `BuLabel` uses only `id`, and all four
  exist on `NumberFieldRootContext`), so pointing them at the number-field
  namespace works. Compose validation fields as `<NumberFieldRoot renderless
  v-model :rules>` wrapping `BuField`, with `namespace="v0:number-field:root"`
  on the label and help.
- **validateOn machinery is package-local** (`src/utilities/validate.ts`): v0's
  `parseValidateOn` is internal to `InputRoot.vue`. v0-core follow-up: export it from
  the Input barrel ([#914](https://github.com/vuetifyjs/0/issues/914)).
- **`BuHelp validation` requires an ambient `Input.Root`:** BuInput/BuTextarea create
  their own *renderless* root scoped to their subtree, so a sibling BuHelp inside the
  same BuField injects nothing and renders an empty `.help` (while the input still
  shows `is-danger` — deceptively half-wired). Compose validation fields as
  `<InputRoot renderless v-model :rules>` wrapping the whole field; BuHelp warns in
  dev when `validation` is set with no ambient root.
- **Part components are composed, not enforced:** region parts (BuModalHead, BuMessageBody,
  BuDropdownMenu, BuNavbarBrand, …) read their parent's state through an optional context
  and warn in dev when it is missing, so a part rendered outside its parent still emits
  Bulma markup with inert behavior rather than throwing. Parts backed by a v0 context
  (BuPanelBlock, BuPanelTab, BuTab, BuModalTitle) inherit v0's stricter contract instead
  and throw `V0_CONTEXT_MISSING`.
- **A11y improvements over verbatim docs markup:** BuNotification adds
  `aria-label="delete"` (docs ship the delete button unlabeled); BuDropdown emits
  `role="menu"` only when items actually render `role="menuitem"` (the docs' verbatim
  arbitrary-content dropdown fails axe's aria-required-children). The harness tolerates
  aria additions by design.
