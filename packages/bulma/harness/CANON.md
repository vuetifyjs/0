# @paper/bulma — Implementation Canon (binding for all groups)

# @paper/bulma cross-group canon (binding for G1–G6)

## Imports, files, style
- Import ONLY from `@vuetify/v0` — never `#v0/*` (that alias in tsconfig/tsdown exists for tooling parity with genesis; the cheatsheet forbids its use in package source).
- Layout: `src/components/BuThing/BuThing.vue` + `src/components/BuThing/index.ts` (`export type { BuThingProps } from './BuThing.vue'` + `export { default as BuThing } from './BuThing.vue'`). Append ONE alphabetically-placed line per component to `src/components/index.ts`; touch no other shared file. Never edit root tsconfig.json, vitest.config.ts, pnpm-workspace.yaml, or packages/0.
- Dual-script SFC, `defineOptions({ name: 'BuThing' })`, destructured props (no `withDefaults`), `defineModel` + explicit kebab `defineEmits`, `toRef` slotProps object, no `<style>` block at all in Tier 1, no `<style scoped>` ever.
- Family shape is FLAT components (BuField > BuControl > BuInput composed in userland exactly as Bulma nests classes) — no compound `BuX.Y` namespaces in Tier 1.

## Prop → modifier class mapping (identical across all groups)
| Prop | Type | Class |
|---|---|---|
| `color` | `'primary'\|'link'\|'info'\|'success'\|'warning'\|'danger'` | `is-{color}` |
| `size` | `'small'\|'normal'\|'medium'\|'large'` | `is-{size}` (emit `is-normal` only when explicitly passed) |
| `rounded` / `outlined` / `light` / `boxed` / `fullwidth` / `centered` / `hoverable` / `loading` / `expanded` / `multiple` / `up` / `right` | `boolean` | `is-{name}` (`has-name` etc. noted per component) |
| `plaintext` | `boolean` | `is-static` (+`readonly` attr) — `static` is a reserved word, do not use it as a prop |
| `addons` (BuField) | `boolean\|'centered'\|'right'` | `has-addons[-{v}]` |
| `grouped` (BuField) | `boolean\|'centered'\|'right'\|'multiline'` | `is-grouped[-{v}]` |
| `horizontal` (BuField) | `boolean` | `is-horizontal` (+ renders `.field-label`/`.field-body`) |
| `icons` (BuControl) | `'left'\|'right'\|'both'` | `has-icons-left/right` |

- Undefined prop ⇒ no class. Props are conveniences, never gates: user `class` always merges (single-root Vue merging; verify on any multi-root part).
- STATE classes (`is-active`, `is-current`, `is-selected`, `is-disabled` on pagination anchors) are component-owned, driven ONLY by v0 state. No `active` prop anywhere — controlled state goes through v-model.
- **Alignment is boolean props** — `centered` / `right` (`is-centered` / `is-right`), never an `align` enum. Applies to BuPagination, BuTabs, BuFile, BuBreadcrumb alike; the contradictory `centered right` combination is the user's problem, same as stacking the classes in raw Bulma.
- **Auto `is-danger` on invalid** — every component whose Bulma block accepts color modifiers renders `is-danger` from v0 state (`isValid === false`): BuInput/BuTextarea on the control, BuSelect and BuFile on the wrapper/root. BuCheckbox/BuRadio are exempt (Bulma defines no color modifiers for `.checkbox`/`.radio`; they get `aria-invalid` only).
- **`error` is reserved package-wide** for the manual force-invalid override on form controls. Any prop that *displays* ambient validation state must use another name — BuHelp's display switch is `validation`.
- **Fallthrough attrs on native-wrapping components** (BuSelect/BuCheckbox/BuRadio/BuFile): `inheritAttrs: false`; `class`/`style` merge onto the Bulma wrapper element, every other fallthrough attr (`multiple`, `accept`, `aria-*`, `autofocus`, `data-testid`, …) binds to the native control. BuInput/BuTextarea already bind all attrs to the control (they render no wrapper).
- **Selection anchors bind hand-picked state, never the raw Item attrs spread** — `v-slot="{ isSelected, select }"` driving `:class="{'is-active': isSelected}"`, `:data-selected="isSelected || undefined"`, and `@click="select"`. The Item `attrs` include `aria-selected`/`aria-disabled`, which are INVALID on role-less anchors (axe aria-allowed-attr, critical); `data-selected` keeps the data-attr styling hook. One convention for BuMenu and BuPanel alike.
- Disabled: native `disabled` attr on native controls; `is-disabled` class (never the attr) on pagination anchors; checkbox/radio mirror Bulma's documented non-standard `disabled` attr on the wrapping label AND the input.

## v-model names (plain `v-model` everywhere — no named models except Input's existing `v-model:focused`)
- Open/closed boolean: BuModal, BuDropdown, BuNavbar (burger/menu), BuMessage, BuNotification.
- Selected value (generic `T`): BuTabs, BuPanel (blocks), BuMenu.
- `number` current page (1-indexed): BuPagination.
- `string` value: BuInput, BuTextarea; `string|string[]`: BuSelect (multiple); `boolean`: BuCheckbox; value-compare: BuRadio (+ `value` prop, native `name` grouping).
- BuBreadcrumb: NO v-model (v0 Breadcrumbs has none); last item is declaratively current.

## Slots
- Default slot = the component's main content region. Named slots take the Bulma sub-part name minus block prefix: BuMessage `#header`, BuModal `#header`/`#footer` (card variant), BuDropdown `#trigger`, BuField `#label`.

## Rendering doctrine
- Element TAGS must match fixtures exactly (this is the product). Therefore Dialog.Content is `as="div"` (never native `<dialog>`), Tabs.List is `as="ul"`, etc.
- Wherever Bulma drives display via classes, go renderless and bind the class from v0 slot state — never let the `hidden` attr or `popover` attr land (author CSS beats UA `[hidden]`; `popover` top-layers the element).
- Additive v0 aria/data attrs (`data-*`, `aria-*`, `role`, `tabindex`, `id`) are allowed and expected on top of fixture markup.

## Harness diff-tolerance policy (for the harness task and all groups' self-checks)
1. Tag structure + class sets must match the fixture exactly for component-owned elements.
2. ADDITIONS of `aria-*`, `data-*`, `role`, `tabindex`, `id` are tolerated; aria-label TEXT is tolerated (v0 localizes). `conform()` enforces exactly this list by default (`allowExtraAttrs: false`); any other extra attribute needs an explicit per-test `ignoreAttrs` entry with a comment.
3. Known deliberate deltas: BuNotification adds `aria-label` to `.delete`; dropdown `role=menu`/`menuitem` per the role policy above; BuModal's stack `style="z-index"` and v0 InputControl's `type` on `<textarea>` are per-test `ignoreAttrs` tolerances.
4. Every fixture block carries a `<!-- fixture: <label> -->` comment and tests address blocks by label (`'form-input:color primary'`), never by bare index — positional addressing silently repoints when blocks are inserted.

## Out of scope for this fan-out
`createBulmaPlugin()` / adapter / HSL utility (v0-core prerequisite), all Tier 2/3, vitest wiring, root config edits, changesets.

# Per-group amendments

## G1

BuModal: Dialog.Root + Dialog.Content renderless with `as` unused — render `<div class="modal" :class="{'is-active': isOpen}">` yourself and hand-pick Content attrs (keep id/role/aria-modal/aria-labelledby/zIndex style; you are in renderless mode so spreading attrs is safe — never spread them in wrapped mode, double-fire hazard). Do NOT use v0 Scrim for `.modal-background` even with teleport=false — it renders one element per ACTIVE STACK TICKET globally (Scrim.vue v-for tickets); hand-roll `<div class="modal-background" @click>` that calls close() unless `blocking`. Note in SPEC.md: DialogContent's stack ticket cannot be marked scrim:false, so an app-level global <Scrim> double-backdrops BuModal (known limitation). Esc: as=div gets no native cancel — bind keydown Escape gated on `globalTop` from Content slot props so only the top modal closes. FOCUS TRAP: v0 has no focus-trap composable — hand-roll: on open focus first focusable (or the modal), wrap Tab/Shift+Tab within the .modal subtree, restore prior focus on close; file/flag a v0-core follow-up. `.modal-close` = Dialog.Close as-is (class modal-close is-large tolerable via props); modal-card variant must reproduce fixture exactly (header p.modal-card-title maps to Dialog.Title as="p"; wire aria-labelledby, else the id dangles — render Title or omit hand-picked aria-labelledby). closeOnClickOutside(bounds:true vs .modal-content) already closes on background clicks — don't double-wire. BuMessage/BuNotification: plain v-model + Presence (immediate default, unmount on leave); delete button is a bare button.delete click→model=false; BuNotification MUST add aria-label="delete" (fixture lacks it, deliberate a11y addition); message body-only variant (no header) required.

## G2

BuDropdown: SKIP v0 Popover entirely (PopoverContent hardwires `popover:''` → top-layer + UA margin:unset defeats Bulma's in-flow .dropdown-menu absolute positioning). Use Toggle.Root pattern or bare model + useClickOutside; bind `is-active` on .dropdown root. Hand-bind trigger aria: aria-haspopup, aria-controls={menuId via useId}, aria-expanded (Toggle only gives aria-pressed). role policy: emit role="menu" on .dropdown-menu ONLY when items are actionable links rendered with role="menuitem" (verbatim fixture fails axe aria-required-children); arbitrary-content mode emits neither. Own Esc-to-close too, not just click-outside. Support is-hoverable (pure CSS — no JS when set), is-right, is-up as props. BuMenu: markup per fixture — is-active lives on the ANCHOR (unlike tabs/breadcrumb); nested `<ul>` has NO class and is ALWAYS visible in Bulma (no collapse behavior documented — do not invent one for Tier 1); active tracking via createNested `active:'single'` (or Selection) driving v-model; alternating p.menu-label + ul.menu-list sections via slots/items. BuPanel: nav.panel with FLAT heterogeneous children (no list wrapper); .panel-tabs anchors = one single-Selection scope; .panel-block is-active = a second Selection scope (single default, `multiple` prop); spreading Selection.Item attrs directly on your <a class=panel-block> is safe (Item is a pure provider, no wrapper element); label.panel-block>input[checkbox] rows are native passthrough markup.

## G3

BuTabs: Tabs.Root renders NO element (not an Atom) — you render div.tabs (+ is-centered/size/is-boxed/is-toggle props per canon) and `<ul>` (Tabs.List as="ul" is fine, role=tablist lands on it). Items: Tabs.Item RENDERLESS, render `<li :class="{'is-active': isSelected}"><a v-bind="attrs">` yourself — is-active goes on the li per fixture, anchors carry no href. Panels: v0 Tabs.Panel as-is (`hidden` attr fine here — Bulma defines no panel CSS); Panel value prop is required; mandatory='force' default auto-selects first tab. BuNavbar: Toggle model (or plain defineModel) drives BOTH `.navbar-burger.is-active` and `.navbar-menu.is-active`; do NOT use Collapsible.Content (sets hidden attr — .navbar-menu.is-active{display:block} author CSS silently beats it). Burger renders as `<a role="button">` — Toggle.Root as="a" supplies role/tabindex/keydown; you must hand-bind aria-expanded (Toggle only emits aria-pressed) and aria-label="menu"; burger has FOUR aria-hidden spans in 1.0 (fixture-verified), plus data-target=menuId and id on .navbar-menu. navbar-dropdown (has-dropdown/is-hoverable/is-selected) is Tier-1 markup PASSTHROUGH via slot content — hover behavior is Bulma CSS, zero JS; do not build click-dropdown behavior in this pass.

## G4

BuPagination: prop `pages` (total page count) mapped to v0 Root `:size="pages" :items-per-page="1"` (v0 size = TOTAL ITEMS, not pages — do not expose size/itemsPerPage in Tier 1); v-model = current page. DOM order per fixture: a.pagination-previous, a.pagination-next, THEN ul.pagination-list (CSS reorders visually) — the harness diffs order. All interactive parts `as="a"`: verified in source that PaginationPrev/Next/Item with as=a omit the `disabled` attr and emit aria-disabled + tabindex=-1 — bind `:class="{'is-disabled': isDisabled}"` yourself (fixture: class, never attribute, on anchors); current page: `:class="{'is-current': isSelected}"`, no href, aria-current=page comes from Item attrs. Wrap each Item/Ellipsis in `<li>` by iterating Root slot `items`; Ellipsis span.pagination-ellipsis with &hellip;. aria-label text differs from fixture ('Goto page 1' vs localized) — tolerated, don't chase it. BuBreadcrumb: NO v-model (v0 Breadcrumbs has none — current item is declarative). nav.breadcrumb[aria-label=breadcrumbs] > List as="ul"; do NOT render Divider parts (Bulma separators are li+li::before CSS); last item = `<li class="is-active">` wrapping Breadcrumbs.Page `as="a"` with href kept + aria-current=page (fixture keeps the anchor, Bulma styles it inert); separator/align/size = root modifier props per canon (has-*-separator). Skip the Ellipsis/overflow machinery in Tier 1 — it only engages if rendered.

## G5

BuField/BuControl/BuLabel/BuHelp are pure hand-rolled markup (v0 has NO Form.Field/Control/Label/Help) wired to Input context: useInputRoot is exported from the barrel; render `<label class="label" :for="id">` yourself (no Input.Label exists). BuField props per canon: addons/grouped/horizontal — horizontal renders .field-label.is-{size} + .field-body per the form-general fixture (in scope, fixture covers it). BuControl: `icons` prop → has-icons-left/right; `loading` + `size` → is-loading + is-{size} ON THE CONTROL (fixture: spinner sizing duplicates the size class on the control, state classes is-hovered/is-focused are docs demos — skip). BuHelp: when rendering validation errors use Input.Error RENDERLESS for its id/aria-live wiring (registration makes Root's aria-errormessage appear only when mounted), class `help is-danger`; plain help text via Input.Description or bare p.help + color prop. BuInput: Input.Root renderless wrapper is optional-markup (Bulma .input is bare-capable — Root renders div by default; use renderless so no extra wrapper lands) + Input.Control class="input" `:class` color/size/rounded/plaintext (is-static + readonly) and `{'is-danger': isValid === false}`; BuTextarea: Input.Control as="textarea" (+ rows passthrough, has-fixed-size prop `fixed`). Form aggregate: parent v0 Form v-model is WRITTEN BY the form (read-only validity) — don't treat it as a control channel. validateOn default stays v0's 'blur'.

## G6

All four wrap NATIVES (spec deviation 3 — confirmed: v0 Checkbox/Radio render role-button + inline-hidden input, cannot produce Bulma's visible native; v0 Select is a custom listbox). Use createInput for validation/Form auto-registration and bind onInput/onBlur/isFocused yourself (createInput has NO DOM events; InputRoot.vue parseValidateOn is the canonical validateOn pattern). BuSelect: div.select wrapper carries color/size/rounded/multiple/loading classes (is-multiple + native multiple/size attrs); native <select v-model>; is-hovered/is-focused are docs-only demos — skip; icon pairing via BuControl (G5's), not here. BuCheckbox: `<label class="checkbox"><input type=checkbox v-model> {slot}</label>`; BuRadio: `<label class="radio">` + value/name, native name grouping, no group component in Tier 1; disabled mirrors Bulma's documented non-standard label[disabled] AND input[disabled] — keep both, expect axe discussion, note in SPEC.md; .checkboxes/.radios list wrappers = optional presentational props or userland markup. BuFile: div.file root carries ALL modifiers (color/size/boxed/fullwidth/centered/right/`filename` boolean → has-name); structure exactly `label.file-label > input.file-input[type=file] + span.file-cta > span.file-icon + span.file-label` — NOTE Bulma's own class collision: .file-label is BOTH the outer label and the inner CTA text span, reproduce it verbatim; span.file-name text updates from the selected file when `filename` (the docs' bring-your-own-JS pattern is the fixture's last block); wire createInput for validation but the value model is the FileList/filename — keep v-model semantics minimal (emit change + expose files) rather than forcing string v-model.
