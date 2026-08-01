# V0 API Cheatsheet for @paper/bulma implementers

Ground truth extracted from actual source on this worktree (2026-08-01). Paths below are
relative to `packages/0/src/` unless noted. When this document and source disagree, source wins.

Import everything from `@vuetify/v0` (like `packages/genesis/src/components/GnActionButton/GnActionButton.vue`
does: `import { Button } from '@vuetify/v0'`). The `#v0/` alias is internal to `packages/0` — do NOT use it in `packages/bulma`.

---

## 0. Atom — the rendering substrate (components/Atom/Atom.vue)

Every DOM-rendering v0 part is an `<Atom>`. Its props are inherited by every compound part via `AtomProps`:

| Prop | Default | Effect |
|---|---|---|
| `as` | `'div'` (each part overrides — see per-part tables) | Element to render. `as={null}` = renderless |
| `renderless` | `false` | Render slot content directly, no wrapper element. Slot receives all forwarded attrs as slot props |

- Exposes `element: TemplateRef<HTMLElement | null>` via `defineExpose` (`AtomExpose`) — null in renderless mode.
- Self-closing tags (`input`, `img`, …) render without children.
- **There is no `asChild`** (Radix-style). Element override is `as="tag"`; full markup control is `renderless` + spreading the part's `attrs` slot prop onto your own element.
- **Double-fire hazard** (`.claude/rules/components.md`): slot `attrs` objects contain handlers already bound to the Atom wrapper. Only spread `attrs` onto your own element in **renderless** mode; in wrapped mode spreading them on a child fires handlers twice via bubbling.

The universal per-part shape: `attrs` in slot props = ARIA + data-* + handlers; part template does
`<Atom v-bind="mergeProps(attrs, slotProps.attrs)" :as :renderless><slot v-bind="slotProps" /></Atom>`.

---

## 1. Dialog (components/Dialog/) — for BuModal

Parts: `Dialog.Root`, `.Activator`, `.Content`, `.Title`, `.Description`, `.Close`. Barrel: `components/Dialog/index.ts`.

| Part | Renders (`as` default) | Key props (defaults) | Slot props |
|---|---|---|---|
| Root | renderless (`as = null`, `renderless` hardcoded) | `namespace='v0:dialog'`, `id` (auto `useId()`) | `{ id, isOpen, open, close }` |
| Activator | `button` | `namespace` | `{ isOpen, attrs }` — attrs: `type/role` polyfill, `tabindex:0`, `aria-haspopup='dialog'`, `aria-expanded`, `data-open: true\|undefined`, `onClick` (opens), `onKeydown` (only when `as !== 'button'`) |
| Content | **`dialog`** (native) | `namespace`, `closeOnClickOutside=true`, `blocking=false` | `{ isOpen, globalTop, zIndex, attrs }` — attrs: `id`, `role='dialog'`, `aria-modal`, `aria-labelledby/describedby`, `style:{zIndex}`, `onCancel`, `onClose` |
| Title | `h2` | `namespace` | `{ attrs: { id: titleId } }` |
| Description | `p` | `namespace` | `{ attrs: { id: descriptionId } }` |
| Close | `button` | `namespace` | `{ isOpen, attrs }` — `aria-label` from `locale.ti('Dialog.close') ?? 'Close'`, `onClick` closes |

- **State**: `Root` `defineModel<boolean>({ default: false })` → plain `v-model`. Emits `update:model-value`. Context exposes `open()/close()`.
- **No teleport anywhere in Dialog.** Content renders in place; modality comes from native `<dialog>.showModal()` (top layer). The calls are optional-chained (`element.showModal?.()` — DialogContent.vue), so **`as="div"` is safe**: no crash, but you lose native top layer/focus trap/Esc — which is exactly the BuModal case, since Bulma `.modal` is a fixed-position div overlay, not a `<dialog>`. With `as="div"` you must v-show/class-toggle visibility yourself via `isOpen` (`.modal.is-active`) and Esc handling is yours (stack `onDismiss` covers scrim clicks only).
- Content registers with `useStack()` — ticket select/unselect follows `isOpen`; `zIndex`/`globalTop` in slot props; scrim dismissal calls `context.close()` unless `blocking`.
- `closeOnClickOutside` uses `useClickOutside` with `{ bounds: true }` against the content element.
- Title/Description only emit ids; `aria-labelledby/describedby` on Content point at them unconditionally (render Title/Description or the references dangle).

## 2. Scrim (components/Scrim/Scrim.vue) — maps to `.modal-background`

Single-file, no compound. Props: `as='div'`, `renderless`, `transition='fade'`, `teleport=true`, `teleportTo='body'`.

- Renders **one Atom per active stack ticket** whose `scrim !== false`, inside a `<TransitionGroup :name="transition">`; teleports to body by default (`teleport=false` renders in place — needed if `.modal-background` must sit inside `.modal`).
- Slot props per ticket: `{ ticket, zIndex (ticket.zIndex - 1), isBlocking, dismiss, attrs }`; attrs: `aria-hidden='true'`, `style:{zIndex}`, `onClick` → dismisses unless blocking.
- It's a **global** scrim keyed off `useStack` — it backs Dialogs and Portals automatically. For a per-modal in-DOM `.modal-background`, set `teleport=false` or hand-roll a div bound to `isOpen` instead.

## 3. Portal (components/Portal/Portal.vue)

Renderless Teleport + stack registration. Props: `to='body'` (`'top-layer'` = topmost open modal element, or HTMLElement), `disabled=false` (render inline), `blocking=false`, `scrim=true`. Emits `close`.

- Registers a stack ticket and **selects it immediately on setup** — a mounted Portal is always "open"; gate with `v-if`.
- Slot props: `{ zIndex, close }`. zIndex must land on a *positioned* element to matter.
- No `as`/`renderless` props (not AtomProps) — it renders only a `<Teleport>`.

## 4. Popover (components/Popover/) — for BuDropdown (read the caveat)

Parts: `Popover.Root`, `.Activator`, `.Content`.

| Part | `as` default | Key props | Slot props |
|---|---|---|---|
| Root | renderless (`as = null`) | `id` (auto) — **no `namespace` prop**; context is `createContext<PopoverContext>('v0:popover')` fixed | `{ id, isSelected, toggle }` |
| Activator | `button` | `target` (override popover id) | `{ isOpen, attrs }` — attrs: **`popovertarget`** (native invoker), `type/role` polyfill, `tabindex:0`, `aria-expanded`, `aria-controls`, `data-open`, `style` (anchor-name), `onKeydown` (non-button only; toggle via context) |
| Content | Atom default `div` | `id`, `positionArea`, `positionTry` | `{ isOpen, attrs }` — attrs: `id`, **`popover: ''`**, `style` (CSS anchor positioning: `position: fixed`, `position-area`, `position-anchor`, `position-try-fallbacks`), `onBeforetoggle` |

- **State**: Root `defineModel<boolean>({ default: false })` (plain `v-model`), wrapped in `usePopover({ id, isOpen })` (composables/usePopover) which returns `{ isOpen, id, open, close, toggle, cancel, anchorStyles, contentAttrs, contentStyles, attach }`.
- **Built on the native Popover API**: content carries the `popover` attribute → browser promotes it to the **top layer** with UA `position: fixed` and `margin: unset`. No Teleport involved.
- **BuDropdown conflict**: the spec wants Bulma's own in-flow absolute positioning (`.dropdown.is-active > .dropdown-menu`). `PopoverContent` *always* emits `popover=""` — top-layer promotion will defeat Bulma's `.dropdown-menu { position: absolute }` styling and the UA popover styles hardcode `margin: unset` (see memory `popover-display-autohide-footgun`). Two viable routes; decide during build:
  1. Use `Popover.*` renderless, spread everything **except** you cannot omit `popover` from Content's attrs — so renderless Content + hand-picked attrs (drop `popover` and `style`, keep `id`) and drive open state from `isOpen` → `.is-active` class. You then own click-outside (`useClickOutside`) and Esc.
  2. Skip Popover entirely: `Toggle.Root` (or bare `shallowRef`) + `useClickOutside` + `.is-active` class binding. Simpler and matches "no floating engine needed".

## 5. Tabs (components/Tabs/) — for BuTabs

Parts: `Tabs.Root`, `.List`, `.Item`, `.Panel`.

| Part | `as` default | Key props (defaults) | Slot props |
|---|---|---|---|
| Root | **no Atom — renders `<slot>` only** (TabsRootProps does NOT extend AtomProps) | `namespace='v0:tabs'`, `disabled=false`, `enroll=false`, `mandatory='force'`, `circular=true`, `orientation='horizontal'`, `activation='automatic'` | `{ isDisabled, orientation, activation, first, last, next, prev, step, select, unselect, toggle, attrs: { 'aria-multiselectable': false } }` |
| List | `div` | `label`, `namespace` | `{ orientation, isDisabled, attrs }` — `role='tablist'`, `aria-orientation`, `aria-label`, `aria-disabled`, `data-disabled` |
| Item | `button` | `id`, `value` (matches Panel), `disabled`, `namespace`, `ariaLabel/Labelledby/Describedby` | `{ id, isSelected, isDisabled, select, attrs }` — `role='tab'`, roving `tabindex 0/-1`, `aria-selected/controls`, `data-selected/disabled`, `disabled` (native btn only), `onClick/onKeydown/onFocus` |
| Panel | `div` | `value` (**required**), `namespace` | `{ isSelected, attrs }` — `role='tabpanel'`, `aria-labelledby`, `tabindex`, **`hidden: !isSelected`**, `data-selected` |

- **State**: Root is generic `T`; `defineModel<T | T[]>()` — plain `v-model` of the selected Item `value`. Built on `createStep` + `useProxyModel`, `mandatory='force'` auto-selects the first tab.
- Full keyboard nav lives in Item (arrows/Home/End, automatic vs manual activation, focus management via registered `el`).
- **Bulma mapping**: `.tabs > ul > li.is-active > a` — `is-active` goes on the `<li>` but v0 puts state on the Item element. Pattern: `<li :class="{ 'is-active': ... }">` needs the ticket state *outside* the Item; either render `Tabs.Item` `as="a"` and put `is-active` on the `<a>`'s parent via the Item's slot (`v-slot` binds inside, so wrap: `<Tabs.Item as="a" v-slot="{ isSelected }">` can't class its own parent `<li>`) — the working shape is `Tabs.Item` renderless, render `<li :class="{'is-active': isSelected}"><a v-bind="attrs">` yourself. Bulma defines **no panels**; `Tabs.Panel` is ours (`hidden` attr is fine here — Bulma has no competing display rule for panels).

## 6. Toggle (components/Toggle/) — for BuNavbar burger, BuMessage/BuNotification dismissal

Parts: `Toggle.Root`, `.Group`, `.Indicator`. Dual-mode: standalone boolean or grouped selection.

| Part | `as` default | Key props (defaults) | Slot props |
|---|---|---|---|
| Root | `button` | `id`, `value`, `disabled=false`, `namespace='v0:toggle:root'`, `groupNamespace='v0:toggle:group'` | `{ isPressed, isDisabled, toggle, attrs }` — `aria-pressed`, `data-state: 'on'\|'off'`, `data-disabled`, `tabindex`, `onClick`, keydown polyfill |
| Group | `div` | `namespace='v0:toggle:group'`, `disabled`, `multiple=false` (`createSingle` vs `createGroup`), `mandatory=false`, `orientation='horizontal'`, `label`, `ariaLabelledby/Describedby` | `{ isDisabled, attrs }` — `role='group'`, `aria/data-orientation`, `aria-disabled` |
| Indicator | `span` | `namespace='v0:toggle:root'` | `{ isPressed, attrs }` — `data-state`, `style.visibility` hidden when off |

- Standalone Root: `defineModel<boolean>()` plain `v-model` (with internal `shallowRef` shadow for Vue 3.5 re-render quirk). Group: generic `T`, `defineModel<T | T[]>()`.
- Group detection is try/catch injection — Root inside a Group ignores its own v-model and uses the group ticket.
- Burger pattern: `Toggle.Root as="a" class="navbar-burger" :class="{'is-active': isPressed}"` + bind `.navbar-menu.is-active` from the same model. Note the spec also lists Collapsible for this — Toggle is the better fit (see Collapsible caveat below).

## 7. Presence (components/Presence/Presence.vue) — exit animations for dismissals

Fully renderless (no Atom, no `as`). Props: `lazy=false`, `immediate=true`. `defineModel<boolean>({ default: false })` plain `v-model`. Emits `enter`, `leave`, `after-leave`.

- Slot rendered while `isMounted`; during leave, content stays in DOM with `attrs['data-state']='leaving'` until you call `done()` (or next tick if `immediate`).
- Slot props: `{ attrs: { 'data-state': 'unmounted'|'mounted'|'leaving', hidden? }, isPresent, isLeaving, done }`.
- BuMessage/BuNotification: `Toggle`/local state drives `v-model`; wrap `.message`/`.notification` in `<Presence>`; hook CSS animation end → `done()`.

## 8. Collapsible (components/Collapsible/) — BuNavbar alternative

Parts: `Collapsible.Root` (`as='div'`, **renders an Atom**, unlike Tabs.Root), `.Activator` (`button`), `.Content` (`div`), `.Cue` (`span`, decorative, `aria-hidden`).

- Root: `defineModel<boolean>({ default: false })` plain `v-model`; props `namespace='v0:collapsible'`, `disabled`. Slot `{ isOpen, isDisabled, open, close, toggle, attrs: { 'data-state': 'open'|'closed', 'data-disabled' } }`. Built on `createSingle` with one implicit ticket.
- Activator attrs: `id`, `aria-expanded`, `aria-controls`, `disabled`/`type` (native btn) or `role`/`aria-disabled`/`onKeydown` polyfill, `data-state`, `onClick: toggle`.
- **Content sets `hidden: !isOpen`** (UA `display: none`). Bulma's `.navbar-menu` display is class-driven (`.is-active { display: block }` — author CSS beats UA `[hidden]`), so mixing `hidden` with `is-active` produces a fight where author CSS quietly wins and `hidden` is decorative. For Bulma markup fidelity prefer Content `renderless` + own element with `is-active` bound to `isOpen`, or just use Toggle.

## 9. Pagination (components/Pagination/) — for BuPagination

Parts: `Pagination.Root` (`nav`), `.Item` (`button`), `.First/.Prev/.Next/.Last` (`button`), `.Ellipsis` (`span`), `.Status` (visually-hidden live region, `div`).

- Root props: `namespace='v0:pagination'`, **`size=1` = total item count (not page count)**, `itemsPerPage=10`, `totalVisible` (undefined = auto-measure container width), `ellipsis='...'`. **`defineModel<number>({ default: 1 })` — plain `v-model` is the current page, 1-indexed.**
- Root slot: `{ page, size, pages, itemsPerPage, items: PaginationTicket[], pageStart, pageStop, isFirst, isLast, first, last, next, prev, select, attrs }` — `items` is the computed visible page list (numbers + ellipsis tickets) from `createPagination`; iterate it to render `.pagination-list`.
- Item props: `value` (page number, **required**), `disabled`, `id`. Slot `{ page, isSelected, isDisabled, select, attrs }` — `aria-current: 'page' | undefined`, `aria-label` localized, `data-selected`, click/keydown polyfill. Default slot fallback renders the number. Bulma: `as="a"` + `:class="{'is-current': isSelected}"` works (role/keydown polyfill kicks in automatically for non-button `as`).
- Nav buttons auto-disable at edges (`isFirst`/`isLast`); each registers its element in a `controls` registry; Items/Ellipses register in an `items` registry — registration feeds the responsive width auto-measure. This happens via each part's own template ref; it works with `as` overrides.
- Ellipsis: `aria-hidden='true'`, char from prop or Root context.

## 10. Breadcrumbs (components/Breadcrumbs/) — for BuBreadcrumb

Parts: `Breadcrumbs.Root` (`nav`), `.List` (**`ol`** default), `.Item` (`li`), `.Link` (`a`), `.Page` (`span`), `.Divider` (`li`), `.Ellipsis` (`li`), `.Activator`.

- Root props: `namespace='v0:breadcrumbs'`, `divider='/'`, `ellipsis='…'`, `gap=8`, `label`. **No v-model** — Breadcrumbs has no selection model to control; it's a responsive-overflow display compound. Root slot: `{ isOverflowing, capacity, total, depth, isRoot, first, prev, select, attrs: { 'aria-label', role } }`.
- Item registers with two registries (nav model + overflow group); visibility of collapsed crumbs is `v-show` via group `isSelected`; slot `{ id, isSelected, attrs: { inert, 'data-selected' } }`.
- Link is a **pure Atom passthrough** — no state, no context (`BreadcrumbsLink.vue`); `href` falls through.
- Page: `aria-current='page'`. Divider: `aria-hidden`, registers for width measurement.
- **Bulma mapping**: `.breadcrumb > ul > li.is-active > a` — pass `as="ul"` to List. Bulma draws separators with CSS (`li + li::before`), so **do not render `.Divider`** parts; they're optional. `is-active` goes on the last `li` — Bulma's "active" is just "current page", use your own class on the final Item + `Breadcrumbs.Page`-style `aria-current` (or render Link without href).
- The overflow/ellipsis auto-collapse machinery engages only if you render `.Ellipsis`; simple static breadcrumbs work without it.

## 11. Selection (components/Selection/) — for BuPanel (single/multi `.panel-block.is-active`)

Parts: `Selection.Root`, `Selection.Item` — **both are pure providers: no Atom, no `as`/`renderless`, they render `<slot>` only.** You always supply the elements.

- Root props: `namespace='v0:selection'`, `disabled=false`, `enroll=false`, `mandatory=false` (`true` | `'force'`), `multiple=false`. Generic `T`; `defineModel<T | T[]>()` plain `v-model` via `useProxyModel`. Root slot: `{ isDisabled, multiple, select, unselect, toggle, attrs: { 'aria-multiselectable' } }`.
- Item props: `id`, `label`, `value`, `disabled`. Slot: `{ id, label, value, isSelected, isDisabled, select, unselect, toggle, attrs }` — attrs: `aria-selected`, `aria-disabled`, `data-selected`, `data-disabled`, `onClick` (guarded toggle). Registers on setup, unregisters `onBeforeUnmount`.
- BuPanel: `<a class="panel-block" :class="{'is-active': isSelected}" v-bind="attrs">` — safe to spread attrs here because Item has no wrapper element (no double-fire).

## 12. Group (components/Group/) — multi-selection with tri-state

Same pure-provider shape as Selection (no Atom on Root or Item). Built on `createGroup` (always multiple).

- Root props: `namespace='v0:group'`, `disabled`, `enroll`, `mandatory`. `defineModel<T | T[]>()`, proxied `multiple: true`. Root slot adds batch state/ops: `{ isNoneSelected, isAllSelected, isMixed, selectAll, unselectAll, toggleAll, ... }`.
- Item props add `indeterminate`. Item slot adds `{ isMixed, mix, unmix }`; attrs: `role='checkbox'`, `aria-checked: boolean | 'mixed'`, `data-mixed`.

## 13. Form (components/Form/Form.vue) — for BuField/BuControl wiring

Single-file component, `as='form'`. Props: `namespace='v0:form'`, `disabled=false`, `readonly=false`, `novalidate=true`.

- **v-model is `boolean | null` aggregate validity and is written BY the form** (`watchEffect` pushes `form.isValid` into the model) — treat it as read-only output, not a control channel.
- Emits: `submit` (`{ valid }`), `reset`, `update:model-value`. Slot: `{ isValid, isValidating, isDisabled, isReadonly, submit, reset, attrs: { novalidate, onSubmit, onReset } }`. `onSubmit` prevents default, validates all fields.
- Provides `createForm` context at `namespace` via raw `provideContext` — child `Input.Root`s auto-register through `createValidation`'s `useForm()` injection (`composables/createForm/index.ts:239` — returns `undefined` outside injection, never throws).
- **Absent: there are NO `Form.Field` / `Form.Control` / `Form.Label` / `Form.Help` parts.** BuField (`.field`), BuControl (`.control`, `has-addons`, `is-grouped`), BuLabel (`.label`), BuHelp (`.help.is-danger`) are hand-rolled markup. Wire BuHelp/BuLabel to the sibling `Input.Root` context (`useInputRoot(namespace)` is exported from the barrel) or to `Input.Root` slot props (`errors`, `isValid`, `id`).

## 14. Input (components/Input/) — for BuInput/BuTextarea

Parts: `Input.Root` (`div`), `.Control` (**`input` — a real native input**), `.Description` (`span`), `.Error` (`span`).

- Root props (defaults): `id` (auto), `label`, `name`, `type='text'`, `form`, `disabled=false`, `readonly=false`, `required`, `rules=[]` (functions | rule aliases | Standard Schema), `validateOn='blur'` (`'blur'|'input'|'submit'` ± `lazy`/`eager` modifier), `error=false`, `errorMessages`, `namespace='v0:input:root'`.
- **Models**: `defineModel<string>({ default: '' })` plain `v-model` = value; **second named model `v-model:focused`** (boolean).
- Root slot: `{ id, label, value, isDirty, isFocused, errors, isValid: boolean|null, isPristine, isValidating, isDisabled, isReadonly, validate, reset, attrs }` — attrs: `data-state: 'pristine'|'valid'|'invalid'`, `data-dirty/focused/disabled/readonly`.
- Control binds the full native bundle: `id, type, name, value, form, disabled, readonly, required, aria-invalid, aria-label, aria-describedby, aria-errormessage, data-state/focused/disabled/readonly, onInput, onFocus, onBlur`. BuInput: `<Input.Control class="input" :class="{'is-danger': isValid === false}">`. BuTextarea: `as="textarea"` (value binds as prop; onInput handles updates).
- Error: `aria-live='polite'`, slot `{ errors, attrs: { id, 'data-state': 'visible'|'hidden' } }` → `.help.is-danger`. Description → plain help text; both register in Root registries so `aria-describedby`/`aria-errormessage` only appear when the part is mounted.
- **Absent: no `Input.Label` part.** Render `<label class="label" :for="id">` yourself — `id` is in Root slot props and context.
- Auto-registers with a parent `Form` (validation aggregate) with zero wiring.

## 15. Checkbox (components/Checkbox/) — read before building BuCheckbox

Parts: `Checkbox.Root` (**`button`, `role='checkbox'` — NOT a native input**), `.Indicator` (`span`), `.HiddenInput` (visually-hidden native `<input type=checkbox>`, `inert`, `tabindex=-1`), `.Group` (`div`), `.SelectAll` (`button`).

- Root: dual-mode (standalone `defineModel<boolean>()` / registers with `Checkbox.Group` via try/catch injection at `groupNamespace='v0:checkbox:group'`). Props: `id`, `label`, `value`, `name`, `form`, `disabled`, `indeterminate`, `namespace='v0:checkbox:root'`, `ariaLabelledby/Describedby/Invalid`.
- Root slot: `{ id, label, value, isChecked, isMixed, isDisabled, select, unselect, toggle, mix, unmix, attrs }` — attrs: `role='checkbox'`, `aria-checked: boolean|'mixed'`, `data-state: 'checked'|'unchecked'|'indeterminate'`, `onClick`, Space-key `onKeydown` (always bound; checkbox role has its own APG so no `as==='button'` gate here).
- `name` prop → Root auto-renders `<CheckboxHiddenInput>` after the Atom (form submission; objects JSON-serialized).
- Group: `createGroup` + `defineModel<T | T[]>()`; SelectAll drives `selectAll/unselectAll` with mixed state.
- **Bulma fidelity conflict** (spec deviation 3): Bulma `.checkbox` styles `<label class="checkbox"><input type="checkbox">…</label>` — a *visible* native input. v0's Root renders a button-with-role and its HiddenInput is visually hidden by inline styles (not overridable via class). Per spec: verify during build; the likely shape is a hand-rolled native `<input type="checkbox" v-model>` inside `.checkbox` label for Tier 1, since v0 Checkbox cannot produce a visible native input.

## 16. Radio (components/Radio/) — same caveat as Checkbox

Parts: `Radio.Group` (`div`, `role='radiogroup'`), `Radio.Root` (`button`, `role='radio'`), `.Indicator` (`span`), `.HiddenInput`.

- **Group is REQUIRED** — `RadioRoot` calls `useRadioGroup(groupNamespace)` without try/catch (`RadioRoot.vue:200`); a Root outside a Group throws. (Unlike Toggle/Checkbox dual-mode.)
- Group props: `namespace='v0:radio:group'`, `disabled`, `mandatory` (`'force'` = auto-select first), `label`, `ariaLabelledby/Describedby/Required`, `name` (enables hidden inputs for whole group), `activation='automatic'|'manual'`. **`defineModel<T>()` single value** plain `v-model` (`useProxyModel` `multiple:false`).
- Root props: `id`, `label`, `value`, `name` (falls back to group name), `form`, `disabled`, `namespace='v0:radio:root'`, `groupNamespace`. Slot: `{ id, label, value, isChecked, isDisabled, select, attrs }` — roving tabindex (first non-disabled tabbable when none selected), arrow-key group traversal with wrap, `data-state: 'checked'|'unchecked'`, `data-radio-id`.
- `name` → auto `<RadioHiddenInput>` per Root.
- Bulma `.radio` styles a label wrapping a visible native input — same deviation call as Checkbox.

---

## Composables (no component wrapper exists — you build the markup)

### createNested (composables/createNested/) — for BuMenu

**There is no `Menu` or `Nav` component in v0.** (`Treeview/` exists as the component precedent built on createNested — consult it for ARIA tree patterns, but BuMenu's `.menu-list` nesting is its own markup.)

- Exports: `createNested(options)`, `createNestedContext(options)` (trinity `[useX, provideX, context]`), `useNested(namespace = 'v0:nested')`. Full API in `createNested/types.ts`.
- Options (extends GroupOptions): `open: 'multiple'|'single'` (accordion), `openAll`, `reveal`, `selection: 'cascade'|'independent'|'leaf'`, `active: 'single'|'multiple'`.
- `register({ id, parentId, value, children: [...] })` — inline children recursion. Ticket adds: `parentId`, `el`, `isOpen`, `isActive`, `isLeaf`, `depth`, `open/close/flip/reveal/activate/deactivate`, traversal (`getPath`, `getAncestors`, `getDescendants`, `siblings`, `position`).
- Context adds: `openedIds/openedItems`, `activeIds/activeItems`, `open/close/flip/opened`, `unfold/expand/expandAll/collapseAll`, `roots`, `leaves`, `visibleItems()`, cascade-aware `select/unselect/toggle`.
- BuMenu: `is-active` on the current `<a>` ↔ `activate()`/`isActive`; submenu `<ul>` visibility ↔ `isOpen`.

### createInput (composables/createInput/index.ts) — field-state engine behind Input.Root

`createInput<T = string>({ value: Ref<T>, id?, label?, name?, form?, required?, disabled?, readonly?, rules?, error?, errorMessages?, dirty?, equals? })` → `InputContext`:
`id, label, name, form, required, descriptionId ('${id}-description'), errorId ('${id}-error'), descriptions/fieldErrors` (reactive registries), `hasDescription/hasError`, `value`, `isDirty, isFocused (writable ShallowRef), isDisabled, isReadonly, isPristine, isTouched (writable), errors, isValid: Readonly<Ref<boolean|null>>, isValidating, validate(), reset(), state: 'pristine'|'valid'|'invalid'`.
- **No DOM events** — you bind `onInput/onBlur` yourself and write `isFocused`/call `validate()` (Input.Root shows the canonical validateOn parse: `InputRoot.vue` `parseValidateOn` + `shouldValidate`).
- Use for BuSelect/BuFile (native controls that still want v0 validation + Form registration — createInput's `createValidation` auto-registers with a parent form).

### createForm (composables/createForm/index.ts) — behind Form

`createForm({ disabled?, readonly? })` → registry of `ValidationContext`s + `submit(id?): Promise<boolean>`, `reset()`, `isValid: ComputedRef<boolean|null>`, `isValidating`. `createFormContext({ namespace = 'v0:form' })` returns the trinity. `useForm(namespace?)` returns `undefined` (not throw) outside provision — fields work standalone.

---

## House style (enforced — sources: `.claude/rules/components.md`, `implementation.md`, user rules, genesis precedent)

**SFC structure**
- Dual-script SFC: `<script lang="ts">` first (ALL imports, exported `FooProps`/`FooSlotProps` interfaces, `createContext` tuples), then `<script setup lang="ts">` (zero imports). Generic components: `<script lang="ts" setup generic="T">` — `lang` before `setup` only when `generic` is present; plain setup scripts are `<script setup lang="ts">`.
- `defineOptions({ name: 'BuThing' })` always. `inheritAttrs: false` + `useAttrs()` + `mergeProps(attrs, slotProps.attrs)` for any part that binds its own attr bundle.
- Import groups with comments, in order: `// Components`, `// Composables`, `// Utilities` (Vue lives here), `// Types` — `pnpm lint:fix` sorts; don't hand-order.
- `defineSlots<{ default: (props: FooSlotProps) => any }>()` on every part with slot props (Volar inference).

**Props**
- Destructure with defaults — **never `withDefaults`**, never defaults in the interface: `const { color = 'primary' } = defineProps<Props>()`.
- `_`-prefix marks the raw prop when a resolved value supersedes it: `const { name: _name } = defineProps…; const name = toRef(() => _name ?? group.name)`.
- v-model via `defineModel`; **also declare `defineEmits<{ 'update:model-value': [...] }>()`** (kebab-case) — redundant but required for devtools.

**Reactivity**
- `shallowRef` for primitives, `ref` for objects/arrays, **`toRef(() => ...)` as the default derivation**, `computed` only for expensive work. `useTemplateRef` for template refs.
- Slot props always one `toRef((): FooSlotProps => ({ ... }))` named `slotProps`; template is `<slot v-bind="slotProps" />`.

**Naming**
- `index` not `idx`; `on<Action>` (`onClick`, `onToggle`) never `handle<Action>`; single-word names where unambiguous; boolean slot state is `is<State>`.
- No comma-separated declarations.

**Attributes / state classes**
- v0 boolean data attrs are `true | undefined` (undefined removes the attr); `aria-disabled` stays a concrete boolean. In @paper/bulma, upstream **classes** (`is-active`, `is-current`) replace data-attrs per spec deviation 2 — drive them from slot-prop state; still let v0's aria/data attrs land (harmless, a11y-tested).
- Prop→class conveniences (`color="primary"` → `is-primary`) must merge with user `class` — Vue class merging handles this if the class lands on the single root; multi-root parts need explicit handling.

**Styling**
- **Never `<style scoped>`** — scoped `data-v` attrs don't reach multi-root compound children (see the explanatory comment in `packages/genesis/src/components/GnActionButton/GnActionButton.vue`; memory `scoped-css-multiroot-child`). Tier 1 Bulma compat components should need no `<style>` block at all; Tier 2 custom CSS is unscoped and consumes only `--bulma-*` vars.
- No type-guard raw comparisons: `isNull/isUndefined/isNullOrUndefined/isString/...` from `@vuetify/v0` (`#v0/utilities` re-exports through the main barrel).

**Package/barrel (genesis precedent, `packages/genesis/src/components/*/index.ts`)**
- Per-component dir `BuThing/BuThing.vue` + `index.ts`: `export type { BuThingProps } from './BuThing.vue'` + `export { default as BuThing } from './BuThing.vue'`. Never `export *` from a `.vue`. Compound Bu components follow the v0 compound barrel (`components/Dialog/index.ts`): named default re-exports, one `export type` block, then a plain object literal compound with JSDoc per member — never `Object.assign`.
- Package deps: `@vuetify/v0` as `workspace:^` dependency, `vue >=3.5.0` peer (see `packages/genesis/package.json`); `bulma@^1.0` is a peer, never a dependency.

---

## Absences summary — what you hand-roll (nothing here exists in v0)

1. **`Input.Label`** — no label part anywhere; `<label :for="id">` is yours.
2. **`Form.Field` / `.Control` / `.Label` / `.Help`** — BuField/BuControl/BuLabel/BuHelp are pure markup wired to Input.Root context/slot props.
3. **Menu/Nav component** — BuMenu is markup over `createNested`; only Treeview exists as a nested-component precedent.
4. **Upload/File primitive** — no v0 File/Upload anything; BuFile is native `<input type=file>` + `createInput` for validation.
5. **Visible native `<input type=checkbox/radio>`** — v0 Checkbox/Radio render role-carrying buttons + *hidden* native inputs; Bulma's `.checkbox`/`.radio` label-wrapped visible-native styling can't be produced from them (spec deviation 3 — verify per component).
6. **Native `<select>`** — v0 `Select` is a custom listbox (activator + popover), not a native select; BuSelect wraps native `<select>` directly (spec deviation 3).
7. **In-flow dropdown positioning** — PopoverContent hardwires the native `popover` attr (top layer); Bulma's in-flow `.dropdown` likely wants Toggle + `useClickOutside` instead.
8. **Class-driven visibility** — CollapsibleContent/TabsPanel use the `hidden` attr; wherever Bulma controls display via `is-active` classes, go renderless and bind the class yourself.
9. **Per-overlay in-DOM scrim** — Scrim is a global stack-driven teleported layer; an inside-`.modal` `.modal-background` needs `teleport=false` or a hand-rolled div.
10. **Esc-to-close for non-native-dialog modals** — DialogContent's Esc comes free only from native `<dialog>` `cancel`; with `as="div"` you own the key handling (stack `onDismiss` covers scrim clicks only).
