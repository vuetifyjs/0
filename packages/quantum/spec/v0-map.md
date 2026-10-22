# Quantum v0 primitive map

Implementer reference for building `@paper/quantum` (prefix `Qu*`, tokens `--quantum-*`) on `@vuetify/v0` 1.3.0. Every value is what the v0 source in the quantum worktree does today, not what a docs page promises. Where the two differ, the source wins and the difference is called out.

## Sources

Repo: `/home/john/sites/0/.claude/worktrees/quantum` (branch `feat/quantum`; `packages/0/package.json` version `1.3.0`). Paths below are relative to `packages/0/src/` unless absolute.

| Source | Files read |
|---|---|
| Family contract | `DESIGN_SYSTEMS.md` (rulings 1 to 8, "Per-package SPEC.md") |
| Skill | `/home/john/.claude/skills/vuetify0/SKILL.md`, `references/REFERENCE.md`, `references/component-examples.md`, `references/authoring-guide.md`, `references/anti-patterns.md`, `references/layer-decisions.md` |
| Barrels and metadata | `index.ts`, `components/index.ts`, `composables/index.ts`, `maturity.json`, `packages/0/package.json` (`publishConfig.exports`) |
| Components (barrel plus every part SFC) | `Atom`, `Button`, `Toggle`, `Dialog`, `AlertDialog`, `Popover`, `Tooltip`, `Menu`, `Tabs`, `ExpansionPanel`, `Collapsible`, `Checkbox`, `Radio`, `Switch`, `Slider`, `Input`, `Combobox`, `Select`, `Form`, `Snackbar`, `Progress`, `DataTable`, `Step`, `Single`, `Selection`, `Group`, `Portal`, `Scrim`, `Presence`, `Theme`; `Pagination` (barrel members, `PaginationRoot` props, `PaginationItem` attrs only) |
| Composables (`index.ts` plus adapters) | `createContext`, `createSelection`, `createModel`, `createSingle`, `createStep`, `createPagination`, `createDataTable` (lines 1 to 330 of `index.ts` plus `adapters/*`), `createInput`, `createForm`, `createProgress`, `createTokens`, `usePresence`, `useFocusTrap`, `useRovingFocus`, `useVirtualFocus`, `usePopover` (plus `adapters/adapter.ts`, `v0.ts`, `placement.ts`, `floating-ui.ts`), `useStack`, `useReducedMotion` (plus adapters), `useTheme` (plus `adapters/adapter.ts`, `v0.ts`, `unhead.ts`), `useLocale` (plus `adapters/adapter.ts`, `v0.ts`), `useTooltip`, `useLazy`, `useHotkey`, `useTypeahead`, `useDelay`, `useTimer`, `useEventListener`, `useClickOutside`, `useResizeObserver`, `createPlugin` (`PluginContextConfig`), `useProxyModel` (option names only), `createCombobox` (`ComboboxOptions` and `ComboboxContext` only), `useNotifications` and `createQueue` (timeout option only) |
| Other | `utilities/helpers.ts` (`useId`), `locale/messages/en/index.ts`, `theme/tokens.ts`, `theme/index.ts`, `theme/adapters/index.ts`, `popover/index.ts`, `popover/adapters/floating-ui/index.ts`; `packages/emerald/SPEC.md`, `packages/emerald/src/components/EmCalendar/calendar.ts`, `packages/emerald/src/components/EmTextField/EmTextField.vue`, `packages/emerald/src/components/EmButton/EmButton.vue`; `/home/john/sites/0/.claude/worktrees/bootstrap-v6/packages/bootstrap/SPEC.md` |
| Docs examples (snippets) | `apps/docs/src/examples/components/<name>/basic.vue` for every component above (`radio/group.vue` and `atom/polymorphic.vue` where no `basic.vue` exists) |

Web (fetched with `curl` over `https`; the WebFetch tool refuses `web.archive.org`, and plain `http` does not connect from this sandbox):

| URL | Snapshot | Result |
|---|---|---|
| `https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/` | 2018-12-25 00:22:55 UTC | HTTP 200, 35507 bytes. Used only for the component and pattern page list that heads the mapping table. |
| `https://web.archive.org/web/20181225002255/https://material.io/archive/guidelines/components/buttons.html` | 2018-12-25 | Failed twice (curl exit 7, connection refused). Not read. |

Vuetify 1.5.24 stylus was not consulted. This note carries no visual metrics; those belong to the tokens and component notes.

## Confidence legend

| Value | Meaning in this note |
|---|---|
| high | Read from the v0 source file named in the entry |
| moderate | Read only through a consumer (a Root SFC, a docs example, the generated skill text), not the composable's own file |
| low | Memory, not verified in this worktree |

`dp` and `sp` are `px` on the web, 1:1. Delays are `ms`.

## Pattern vocabulary used in the mapping table

| Pattern | Definition | Precedent |
|---|---|---|
| shell | Fixed anatomy in one `Qu*` SFC that wraps a v0 compound; props for text, no named slots, one default slot | Emerald "Shells" (`EmButton`, `EmTextField`, `EmCheckbox`, `EmSwitch`, `EmSlider`); `packages/emerald/SPEC.md` "Consumer contract" |
| compound | One `Qu*` part per v0 region, attached to the root export (`QuDialog.Title`); the consumer builds the tree | Emerald "Compounds" (`EmDialog`, `EmSelect`, `EmTabs`); Bootstrap "every region is an express part component" (`DESIGN_SYSTEMS.md`, compat addendum) |
| presentational | Semantic element or `Atom`; no behavioral primitive exists and none is invented (`DESIGN_SYSTEMS.md` ruling 2) | `EmCard`, `EmDivider`, `EmBadge`, `EmSpinner` (`Atom` only) |
| DS-owned headless | Behavior the DS must author on v0 composables because no v0 compound covers it; composables hold state, the `Qu*` component binds DOM events | `EmCalendar` on a private `createCalendar`; Bootstrap `BDrawer` on `Dialog` plus `createContext`, `BChips` on `createSelection` |

## Conventions every v0 compound shares (read once)

| Convention | Detail | Confidence |
|---|---|---|
| Rendering | Every DOM-rendering part wraps `Atom` and accepts `as` (any tag or `null`) and `renderless`. Context-only Roots (`Tabs.Root`, `Step.Root`, `Single.Root`, `Selection.Root`, `Group.Root`, `DataTable.Root`) render only their slot. Overlay Roots (`Dialog.Root`, `AlertDialog.Root`, `Popover.Root`, `Tooltip.Root`, `Menu.Root`, `Combobox.Root`, `Select.Root`) render a renderless `Atom` (`as = null`). | high |
| `attrs` slot prop | Interactive parts bind `slotProps.attrs` (role, `aria-*`, `data-*`, `on*` handlers) to their own `Atom`. The same object is exposed as the `attrs` slot prop. Spread it onto your own element only when the part is `renderless`; spreading it on a child inside a rendered part fires every handler twice (bubbling). | high |
| Consumer attrs | Most parts set `inheritAttrs: false` and merge consumer attrs with `mergeProps(attrs, slotProps.attrs)`, so a consumer `@click` chains after the part's own handler instead of replacing it. Parts that do not use `mergeProps` (`Dialog.*`, `AlertDialog.*`, `Popover.*`, `Collapsible.*`, `ExpansionPanel.*`, `Select.*`, `Combobox.*`, `Snackbar.Root/Close`) rely on Vue's default attr fallthrough, which also chains listeners. | high |
| Boolean data attributes | `true` or `undefined` only (`data-disabled`, `data-selected`, `data-open`); `undefined` removes the attribute, so `[data-disabled]` selectors never match a false state. Exceptions that use the empty string: `AlertDialog.Action` and `AlertDialog.Cancel` (`data-disabled: ''`, `data-pending: ''`), `Combobox.Item` and `Select.Item` (`data-highlighted: ''`). | high |
| `data-state` | Semantic strings per family: `open`/`closed` (disclosure, menu), `on`/`off` (Toggle), `checked`/`unchecked`/`indeterminate` (Checkbox, Switch, Radio without indeterminate), `pristine`/`valid`/`invalid` (Input), `determinate`/`indeterminate` (Progress), `dragging`/`idle` (Slider thumb), `closed`/`delayed-open`/`instant-open` (Tooltip), `unmounted`/`mounted`/`present`/`leaving` (Presence), `visible`/`hidden` (Input.Error). | high |
| Disabled | Native `<button>` host: `disabled` attribute, no `aria-disabled`. Non-button host: `aria-disabled` boolean plus `tabindex -1`. Both: `data-disabled`. `Button.Root` always emits both `disabled` and `aria-disabled` (its `aria-disabled` is `disabled || passive`). | high |
| Keyboard polyfill | Parts whose default `as` is `button` attach `onKeydown` (Enter and Space) only when `as !== 'button'`; a native button already fires `click` for those keys. | high |
| Namespace | Every part takes `namespace` (and Roots inside a group take `groupNamespace`) for `createContext` injection. Defaults are listed per entry. Change them only to nest two instances of the same compound. | high |
| Locale | User-facing strings go through `useLocale().ti(key) ?? 'English default'`. Keys used by the primitives in this note: `AlertDialog.close`, `Button.label`, `Combobox.noResults`, `Dialog.close`, `Input.required`, `Menu.label`, `Slider.label`, `Snackbar.close`. English catalog: `import en from '@vuetify/v0/locale/messages/en'`. | high |
| IDs | `useId()` from `@vuetify/v0/utilities`: Vue `useId()` inside a component instance, otherwise a `v0-N` counter (dev warning on the server). Pass explicit `id` props in SSR-sensitive trees. | high |
| SSR | Every DOM branch is gated on `IN_BROWSER` (`@vuetify/v0/constants`). `useStack` returns an ephemeral stack per call on the server unless `createStackPlugin` is installed. Theme and reduced-motion adapters render head state through a duck-typed `@unhead` seam. | high |
| Events rule | Composables never bind DOM handlers; components do. The only composables that call `addEventListener` are `useEventListener`, `useHotkey`, `useClickOutside`, `useMediaQuery`, plus `useRovingFocus`, `useVirtualFocus` and `usePopover`, which route through `useEventListener`. The section "Handlers v0 already binds" lists what a `Qu*` component must not re-bind. | high |

## Components

### Atom

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Atom } from '@vuetify/v0'`; repo `components/Atom/Atom.vue` | high |
| Renders | `as` tag (default `div`); self-closing tags (`img`, `input`, `hr`) render without children; `renderless` or `as={null}` renders the slot only | high |
| Props | `as?: DOMElement \| null`, `renderless?: boolean` | high |
| Slot props | All forwarded attrs (`v-slot="{ ...attrs }"`), generic `AtomSlots<T>` | high |
| Expose | `element: TemplateRef<HTMLElement \| null>` (`AtomExpose`); read it with `toElement(atomRef.value?.element)` | high |
| Emits / data-* | None of its own | high |
| Context | None | high |

```vue
<Atom as="button" @click="onClick">Click me</Atom>
```

### Button

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Button } from '@vuetify/v0'`; repo `components/Button/` | high |
| Parts | `Button.Root` `<button>`; `Button.Content` `<span>` (visibility toggles against Loading; not an Atom, always a span); `Button.Icon` `<span aria-hidden="true">`; `Button.Loading` renderless (slot renders only while loading); `Button.Group` `<div role="group">`; `Button.HiddenInput` `<input type="checkbox" inert tabindex="-1">` visually hidden, auto-rendered by Root when `name` is set | high |
| Model | Root: none (standalone is a plain button). Group: `v-model` `T \| T[]` (`multiple`) via `createSelection` + `useProxyModel` | high |
| Root props | `disabled`, `readonly` (not clickable, still focusable), `passive` (looks disabled via `data-passive`, still focusable), `loading`, `grace` (ms before `isLoading` flips true, default 0 ms, via `useTimer`), `value`, `name`, `form`, `ariaLabel`, `namespace='v0:button:root'`, `groupNamespace='v0:button:group'` | high |
| Group props | `disabled`, `multiple`, `mandatory` (`false \| true \| 'force'`), `label`, `ariaLabelledby`, `ariaDescribedby`, `namespace`; exposes `focus()` | high |
| Root slot props | `isLoading`, `isDisabled`, `isReadonly`, `isPassive`, `isSelected`, `attrs` | high |
| Root attrs | `type="button"` (native host), `role="button"` (always), `disabled`, `aria-disabled` (disabled or passive), `aria-busy`, `aria-pressed` (group mode only), `aria-label` (prop, or `Button.label` when icon-only and not renderless), `tabindex` 0/-1, `data-loading`, `data-passive`, `data-readonly`, `data-disabled`, `data-selected` (group), `data-solo` (icon-only) | high |
| Group attrs | `role="group"`, `aria-label`, `aria-labelledby`, `aria-describedby` | high |
| Events | Root: none declared; native `click` bubbles (consumer `@click` chains via `mergeProps`). Group: `update:model-value` | high |
| Handlers bound | Root `onClick` only in group mode (toggles its ticket; blocked by disabled, readonly, passive, loading); `onKeydown` only when `as !== 'button'` | high |
| Context | `useButtonRoot(namespace)` -> `ButtonRootContext` (`value`, `name`, `form`, `isLoading`, `isDisabled`, `isReadonly`, `isPassive`, `isSelected`, `isSolo`, `single`); `useButtonGroup(groupNamespace)` -> `SelectionContext<ButtonTicket>`; Root detects the group with try/catch (optional) | high |
| Icon-only detection | `Button.Icon` sets `isSolo` on mount when no `Button.Content` registered; Root then emits `aria-label` and `data-solo` | high |
| SSR | No DOM access; `useTimer` is SSR-safe | high |

```vue
<Button.Root class="px-4 py-2 bg-primary text-on-primary rounded-md">
  Click me
</Button.Root>
```

### Toggle

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Toggle } from '@vuetify/v0'`; repo `components/Toggle/` | high |
| Parts | `Toggle.Root` `<button aria-pressed>`; `Toggle.Indicator` `<span>` (visibility hidden when off); `Toggle.Group` `<div role="group">` | high |
| Model | Root standalone: `v-model` boolean (local `pressed` mirror of the model). Group: `v-model` `T \| T[]`; `multiple` picks `createGroup`, otherwise `createSingle` (decided once at setup) | high |
| Root props | `id`, `value`, `disabled`, `namespace='v0:toggle:root'`, `groupNamespace='v0:toggle:group'` | high |
| Group props | `disabled`, `multiple`, `mandatory`, `orientation` (`horizontal` default), `label`, `ariaLabelledby`, `ariaDescribedby`, `namespace`; exposes `focus()` | high |
| Root slot props | `isPressed`, `isDisabled`, `toggle`, `attrs` | high |
| Root attrs | `type`, `role` (polyfill), `aria-pressed`, `aria-disabled` (non-button), `disabled` (button), `tabindex`, `data-state="on" \| "off"`, `data-disabled` | high |
| Indicator attrs | `data-state`, `style.visibility` | high |
| Group attrs | `role="group"`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-orientation`, `aria-disabled`, `data-orientation`, `data-disabled` | high |
| Events | Root `update:model-value` (boolean); Group `update:model-value` | high |
| Handlers bound | Root `onClick` (toggle) always; `onKeydown` polyfill when not a native button. Group binds no keyboard navigation (no roving focus) | high |
| Context | `useToggleRoot(namespace)` (`isPressed`, `isDisabled`, `toggle`); `useToggleGroup(groupNamespace)` (`disabled`, `orientation`, `selection`); Root detects the group with try/catch | high |

```vue
<Toggle.Root v-model="saved">
  <Toggle.Indicator>*</Toggle.Indicator>
  Bookmark
</Toggle.Root>
```

### Dialog

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Dialog } from '@vuetify/v0'`; repo `components/Dialog/` | high |
| Parts | `Dialog.Root` renderless; `Dialog.Activator` `<button>`; `Dialog.Content` native `<dialog>` opened with `showModal()`; `Dialog.Title` `<h2>`; `Dialog.Description` `<p>`; `Dialog.Close` `<button>` | high |
| Model | Root `v-model` boolean (`isOpen`), default false | high |
| Root props | `id` (auto `useId()`), `namespace='v0:dialog'` | high |
| Content props | `closeOnClickOutside` (default true; `useClickOutside` with `bounds: true` so a backdrop click on the `<dialog>` itself counts as outside), `blocking` (default false; blocks `Scrim` dismissal), `scrim` (default true; set false when the DS paints its own backdrop), `namespace` | high |
| Slot props | Root: `id`, `isOpen`, `open`, `close`. Activator: `isOpen`, `attrs`. Content: `isOpen`, `globalTop`, `zIndex`, `attrs`. Title and Description: `attrs.id`. Close: `isOpen`, `attrs` | high |
| Activator attrs | `type`, `role` (polyfill), `tabindex=0`, `aria-haspopup="dialog"`, `aria-expanded`, `data-open` | high |
| Content attrs | `id`, `role="dialog"`, `aria-modal="true"`, `aria-labelledby` (only while a Title is mounted), `aria-describedby` (only while a Description is mounted), `style.zIndex` from `useStack` | high |
| Close attrs | `type`, `role`, `tabindex=0`, `aria-label` = `Dialog.close` ?? `'Close'` | high |
| Events | Root `update:model-value`; Content `cancel(e)` (native cancel, Escape), `close(e)` (native close) | high |
| Handlers bound | Activator `onClick` (open), Close `onClick` (close), Content `onCancel`/`onClose` (set model false), click outside (Content). Escape and focus containment come from the native `<dialog>`; `useFocusTrap` is only needed when `as` is not `dialog` | high |
| Stack | Content registers a `useStack` ticket (`onDismiss: close`, `blocking`, `scrim`, `el`) and selects it while open; `Scrim` paints one backdrop per selected ticket; `Portal to="top-layer"` teleports into this `<dialog>` | high |
| Context | `useDialogContext(namespace)` -> `DialogContext` (`isOpen`, `id`, `titleId`, `descriptionId`, `hasTitle`, `hasDescription`, `open`, `close`) | high |
| SSR | `showModal()` runs in `onMounted` when already open; no server DOM access | high |
| Backdrop choice | Native `::backdrop` and the global `Scrim` both paint; Bootstrap uses `::backdrop` and does not mount `Scrim` (issue #910 double backdrop). Pick one per design system | high |

```vue
<Dialog.Root>
  <Dialog.Activator>Open</Dialog.Activator>
  <Dialog.Content class="m-auto rounded-xl bg-surface">
    <Dialog.Title as="h3">Deactivate account</Dialog.Title>
    <Dialog.Description>This will permanently deactivate your account.</Dialog.Description>
    <Dialog.Close>Cancel</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
```

### AlertDialog

| Field | Value | Confidence |
|---|---|---|
| Import | `import { AlertDialog } from '@vuetify/v0'`; repo `components/AlertDialog/` | high |
| Parts | `Root` renderless; `Activator` `<button>`; `Content` native `<dialog role="alertdialog">`; `Title` `<h2>`; `Description` `<p>`; `Cancel` `<button>` (receives focus on open); `Action` `<button>` (confirm, deferred close); `Close` `<button>` | high |
| Model | Root `v-model` boolean | high |
| Content props | `closeOnClickOutside` default false, `closeOnEscape` default false (native cancel is `preventDefault`ed), `blocking` default false, `scrim` default true, `namespace='v0:alert-dialog'` | high |
| Action event | `action(event)` with `event.wait()` (keep open, `isPending = true`, `data-pending=""`) and `event.close()`; without `wait()` the dialog closes immediately after the handler | high |
| Attrs | Same as Dialog except `role="alertdialog"`; Action and Cancel use `data-disabled=""` and `data-pending=""` (empty string, not `true`) | high |
| Events | Root `update:model-value`; Content `cancel`, `close`; Action `action` | high |
| Context | `useAlertDialogContext(namespace)` adds `isPending`, `cancelEl` to the Dialog shape | high |

```vue
<AlertDialog.Root>
  <AlertDialog.Activator>Delete Item</AlertDialog.Activator>
  <AlertDialog.Content>
    <AlertDialog.Title>Are you sure?</AlertDialog.Title>
    <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action>Delete</AlertDialog.Action>
  </AlertDialog.Content>
</AlertDialog.Root>
```

### Popover

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Popover } from '@vuetify/v0'`; repo `components/Popover/` | high |
| Parts | `Popover.Root` renderless (`usePopover`); `Popover.Activator` `<button popovertarget>`; `Popover.Content` `<div popover="">` (Atom default tag) | high |
| Model | Root `v-model` boolean | high |
| Root props | `id`, `positionArea` (default `'bottom'`), `positionTry` (default `'most-width bottom'`), `adapter` (`PopoverAdapter`) | high |
| Content props | `id` (custom id pairs with an Activator `target`), `positionArea`, `positionTry` (override Root) | high |
| Activator props | `target` (another popover's id; skips anchor registration) | high |
| Slot props | Root: `id`, `isSelected`, `toggle`. Activator: `isOpen`, `attrs`. Content: `isOpen`, `attrs` | high |
| Activator attrs | `popovertarget`, `type`, `role` (polyfill), `tabindex=0`, `aria-expanded`, `aria-controls`, `data-open`, `style` (`anchorName`) | high |
| Content attrs | `id`, `popover=""` (auto mode: browser light dismiss on click outside and Escape), `style` (adapter output: `position: fixed`, `margin: unset`, `position-area`, `position-anchor`, `position-try-fallbacks` for the default adapter), `onBeforetoggle` | high |
| Events | Root `update:model-value`; Content `beforetoggle(ToggleEvent)` | high |
| Handlers bound | Activator binds no click handler; the native `popovertarget` attribute toggles the popover. Only `onKeydown` (Enter/Space) when `as !== 'button'`. Content syncs state from the native `toggle` event (`usePopover.attach`) | high |
| Context | `usePopoverContext()` static key `'v0:popover:root'` -> `PopoverReturn` (no namespace prop) | high |
| SSR | `showPopover()`/`hidePopover()` are browser-only inside `usePopover` | high |

```vue
<Popover.Root>
  <Popover.Activator>Open Popover</Popover.Activator>
  <Popover.Content class="p-4 rounded-lg bg-surface shadow-lg">
    This is a popover using CSS anchor positioning.
  </Popover.Content>
</Popover.Root>
```

### Tooltip

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Tooltip } from '@vuetify/v0'`; repo `components/Tooltip/` | high |
| Parts | `Tooltip.Root` renderless; `Tooltip.Activator` `<button>` (`inheritAttrs: false`); `Tooltip.Content` `<div role="tooltip" popover="">` | high |
| Model | Root `v-model` boolean | high |
| Root props | `openDelay`, `closeDelay` (fall back to the region plugin: 700 ms open, 150 ms close, 300 ms skip window), `disabled`, `interactive` (content stays open while hovered), `positionArea='top'`, `positionTry='most-height top'`, `namespace='v0:tooltip'`, `adapter` | high |
| Slot props | Root: `isOpen`, `isDisabled`. Activator: `isOpen`, `isDisabled`, `attrs`, `styles` (anchor styles). Content: `isOpen`, `isInteractive`, `attrs`, `styles` | high |
| Activator attrs | `aria-describedby` (content id), `data-state` (`closed`, `delayed-open`, `instant-open`), `aria-disabled`/`disabled`/`type` (host-dependent), `data-disabled`, `onPointerenter`, `onPointerleave`, `onFocus`, `onBlur`, `onClick`, `onKeydown` | high |
| Content attrs | `id`, `role="tooltip"`, `popover=""`, `data-state`, `data-interactive`, `onPointerenter`, `onPointerleave`, `onKeydown` | high |
| Events | Root `update:model-value` | high |
| Handlers bound | Activator: pointer enter/leave (touch pointers ignored), focus (opens instantly only when `:focus-visible`), blur, click (closes), Escape. Content: pointer enter/leave when interactive, Escape | high |
| Region plugin | `createTooltipPlugin({ openDelay, closeDelay, skipDelay, disabled, adapter })`; `useTooltip()` falls back to a per-instance context; open tooltips register with the region so the next one skips its delay | high |
| Context | `useTooltipRoot(namespace)` (suffix `root`, resolved key `v0:tooltip:root`) -> `TooltipRootContext` | high |
| Touch | Long-press tooltips on touch are not provided (touch pointer events are dropped by design) | high |

```vue
<Tooltip.Root :close-delay="200" :open-delay="500">
  <Tooltip.Activator>Hover me</Tooltip.Activator>
  <Tooltip.Content>Helpful description</Tooltip.Content>
</Tooltip.Root>
```

### Menu

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Menu } from '@vuetify/v0'`; repo `components/Menu/` | high |
| Parts | `Menu.Root` renderless; `Menu.Bar` `<div role="menubar">`; `Menu.Activator` `<button aria-haspopup="menu">`; `Menu.Context` `<div>` right-click target (renders a zero-size sentinel `<span>` anchor); `Menu.Content` `<div popover="" role="menu">`; `Menu.Item` `<div role="menuitem">`; `Menu.CheckboxItem` `<div role="menuitemcheckbox">`; `Menu.RadioGroup` `<div role="group">` plus `Menu.RadioItem` `<div role="menuitemradio">`; `Menu.Separator` `<div role="separator">`; `Menu.Sub` renderless layer provider; `Menu.SubActivator` `<div role="menuitem" aria-haspopup="menu">`; `Menu.SubContent` `<div popover="" role="menu">` | high |
| Model | Root `v-model` `ID \| null` (the open top-layer id; `null` closed). CheckboxItem `v-model:checked` boolean. RadioGroup `v-model` (selected item `value`) | high |
| Root props | `id`, `value` (default layer id), `disabled`, `openDelay` 100 ms (hover and pointer opens), `closeDelay` 250 ms (hover-opened menus), `openOnHover`, `namespace='v0:menu'` | high |
| Content props | `value` (layer id), `eager` (render items before first open; otherwise `useLazy`), `positionArea` (default `'bottom'` from `usePopover`), `positionTry` | high |
| SubContent props | `eager`, `positionArea='inline-end span-block-start'`, `positionTry='flip-inline'` | high |
| Item props | `id`, `label` (typeahead text, falls back to `textContent`), `disabled` | high |
| Slot props | Root: `isOpen`, `layer`, `dismiss(restore?)`. Activator: `isOpen`, `isDisabled`, `attrs`. Content: `isOpen`, `attrs`. Item: `isDisabled`, `attrs`. CheckboxItem and RadioItem: `isChecked`, `isDisabled`, `attrs`. Context: `isOpen`, `attrs` | high |
| Activator attrs | `id` (`${rootId}-trigger-${layer}`), `type`, `role` (`undefined` on a native button, `button` polyfill, `menuitem` inside `Menu.Bar`), `tabindex` (roving inside a bar), `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`, `aria-disabled`/`disabled`, `data-open`, `data-state`, `data-disabled`, `data-highlighted` (bar), `style.anchorName` | high |
| Content attrs | `id` (`${rootId}-menu-${layer}`), `popover=""`, `role="menu"`, `aria-orientation="vertical"`, `aria-labelledby` (trigger) or `aria-label` = `Menu.label` ?? `'Menu'`, `tabindex=-1`, `data-open`, `data-orientation`, `style` | high |
| Item attrs | `role="menuitem"`, `tabindex` (roving), `aria-disabled`, `data-disabled`, `data-highlighted`; checkbox and radio items add `aria-checked`, `data-state="checked" \| "unchecked"` | high |
| Events | Root `update:modelValue`; CheckboxItem `update:checked`; RadioGroup `update:modelValue` | high |
| Handlers bound | Activator: click (toggle; keyboard click opens on first item), keydown (ArrowDown first, ArrowUp last, Enter/Space polyfill), pointerenter (hover switching, `openOnHover` scheduling), pointerleave, focus. Content: keydown (Escape dismisses and restores focus, Tab dismisses without restore, arrows via `useRovingFocus` vertical circular, Enter/Space activates, ArrowRight/Left push or pop submenus and shift across bar activators, RTL-aware, single-character typeahead with a 500 ms buffer), pointerenter/leave. Items: click (activate: action items dismiss, checkbox and radio stay open), pointerenter (focus and collapse sibling submenus), pointerleave, focus. SubActivator pointer rest opens after `openDelay`. Bar: keydown across activators | high |
| Context | `useMenuRoot(namespace)` -> `MenuRootContext`; `useMenuLayer()` key `'v0:menu:layer'`; `useMenuBar()` key `'v0:menu:bar'` (default `null`, optional); `useMenuSub()` key `'v0:menu:sub'`; `useMenuRadio()` key `'v0:menu:radio'` | high |
| Nesting rule | Place `Menu.Sub` inside `Menu.Content`; never nest another `Menu.Root` | high |

```vue
<Menu.Root>
  <Menu.Activator>Actions</Menu.Activator>
  <Menu.Content class="min-w-40 rounded-md bg-surface p-1 shadow-lg">
    <Menu.Item class="data-[highlighted]:bg-surface-variant">Copy</Menu.Item>
    <Menu.Item class="data-[highlighted]:bg-surface-variant">Paste</Menu.Item>
  </Menu.Content>
</Menu.Root>
```

### Tabs

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Tabs } from '@vuetify/v0'`; repo `components/Tabs/` | high |
| Parts | `Tabs.Root` slot-only (no element); `Tabs.List` `<div role="tablist">`; `Tabs.Item` `<button role="tab">`; `Tabs.Panel` `<div role="tabpanel">` | high |
| Model | Root `v-model` (single value) via `createStep` + `useProxyModel` | high |
| Root props | `disabled`, `enroll`, `mandatory` (default `'force'`: first enabled tab auto-selected), `circular` (default true), `orientation` (`horizontal` default), `activation` (`automatic` selects on focus, `manual` selects on Enter/Space), `namespace='v0:tabs'` | high |
| Item props | `id`, `value`, `disabled`, `ariaLabel`, `ariaLabelledby`, `ariaDescribedby`, `el` (focus target when renderless) | high |
| Panel props | `value` (required; matched against the Item value through `tabs.browse`) | high |
| Slot props | Root: `isDisabled`, `orientation`, `activation`, `first`, `last`, `next`, `prev`, `step`, `select`, `unselect`, `toggle`, `attrs`. List: `orientation`, `isDisabled`, `attrs`. Item: `id`, `isSelected`, `isDisabled`, `select`, `attrs`. Panel: `isSelected`, `attrs` | high |
| List attrs | `role="tablist"`, `aria-orientation`, `aria-label`, `aria-disabled`, `data-disabled` | high |
| Item attrs | `id` (`${rootId}-tab-${ticketId}`), `role="tab"`, `tabindex` (0 selected, else -1), `aria-selected`, `aria-controls`, `aria-disabled`, `aria-label`, `aria-labelledby`, `aria-describedby`, `data-selected`, `data-disabled`, `disabled`, `type` | high |
| Panel attrs | `id` (`${rootId}-panel-${ticketId}`), `role="tabpanel"`, `aria-labelledby`, `tabindex` (0 selected, else -1), `hidden`, `data-selected` | high |
| Events | Root `update:model-value` | high |
| Handlers bound | Item: click (select), keydown (Arrow keys per orientation, Home, End; manual mode moves focus only, Enter/Space selects), focus (automatic mode selects). Roving focus is implemented inline, not with `useRovingFocus` | high |
| Context | `useTabsRoot(namespace)` -> `TabsContext` (`StepContext` plus `orientation`, `activation`, `circular`, `rootId`) | high |
| Panels | Inactive panels stay mounted with `hidden`; v-if them only when content must unmount | high |

```vue
<Tabs.Root v-model="selected">
  <Tabs.List label="Account settings">
    <Tabs.Item v-for="tab in tabs" :key="tab.value" :value="tab.value">{{ tab.label }}</Tabs.Item>
  </Tabs.List>
  <Tabs.Panel v-for="tab in tabs" :key="tab.value" :value="tab.value">{{ tab.label }}</Tabs.Panel>
</Tabs.Root>
```

### ExpansionPanel

| Field | Value | Confidence |
|---|---|---|
| Import | `import { ExpansionPanel } from '@vuetify/v0'`; repo `components/ExpansionPanel/` | high |
| Parts | `ExpansionPanel.Group` `<div>` (no attrs; `createSelection`); `ExpansionPanel.Root` `<div data-selected>` (one panel; registers a ticket); `ExpansionPanel.Header` `<h3>`; `ExpansionPanel.Activator` `<button>`; `ExpansionPanel.Content` `<div role="region">`; `ExpansionPanel.Cue` `<span aria-hidden>` | high |
| Model | Group `v-model` `T \| T[]` (`multiple`) | high |
| Group props | `disabled`, `enroll`, `mandatory` (`false \| true \| 'force'`), `multiple` (accordion when false), `namespace='v0:expansion-panel'` | high |
| Root props | `id`, `value`, `disabled`, `namespace` | high |
| Slot props | Group: `isDisabled`, `select`, `unselect`, `toggle`. Root and Header: `isSelected`, (`isDisabled` on Root), `attrs`. Activator: `isDisabled`, `isSelected`, `toggle`, `attrs`. Content: `isSelected`, `attrs`. Cue: `isSelected`, `attrs` | high |
| Activator attrs | `id` (`${ticketId}-header`), `role` (polyfill), `tabindex`, `aria-expanded`, `aria-controls`, `aria-disabled` (boolean on every host), `data-disabled`, `data-selected`, `disabled`, `type` | high |
| Content attrs | `id` (`${ticketId}-content`), `role="region"`, `aria-labelledby`, `hidden`, `data-selected` | high |
| Cue attrs | `aria-hidden="true"`, `data-state="open" \| "closed"` | high |
| Events | Group `update:model-value` | high |
| Handlers bound | Activator click (toggle) and keydown polyfill | high |
| Context | `useExpansionPanelGroup(namespace)` -> `SelectionContext`; `useExpansionPanelRoot(namespace)` (suffix `item`, key `v0:expansion-panel:item`) -> `{ ticket, headerId, contentId, isDisabled }` | high |

```vue
<ExpansionPanel.Group v-model="model" multiple>
  <ExpansionPanel.Root v-for="item in panels" :key="item.id" :value="item.id">
    <ExpansionPanel.Activator>
      <ExpansionPanel.Cue />
      {{ item.title }}
    </ExpansionPanel.Activator>
    <ExpansionPanel.Content>{{ item.content }}</ExpansionPanel.Content>
  </ExpansionPanel.Root>
</ExpansionPanel.Group>
```

### Collapsible

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Collapsible } from '@vuetify/v0'`; repo `components/Collapsible/` | high |
| Parts | `Collapsible.Root` `<div>` (`data-state`, `data-disabled`); `Collapsible.Activator` `<button>`; `Collapsible.Content` `<div role="region">`; `Collapsible.Cue` `<span aria-hidden>` | high |
| Model | Root `v-model` boolean (a single implicit `createSingle` ticket) | high |
| Root props | `disabled`, `namespace='v0:collapsible'` | high |
| Slot props | Root: `isOpen`, `isDisabled`, `open`, `close`, `toggle`, `attrs`. Activator: `isOpen`, `isDisabled`, `toggle`, `attrs`. Content: `isOpen`, `attrs`. Cue: `isOpen`, `attrs` | high |
| Activator attrs | `id`, `role` (polyfill), `tabindex`, `aria-expanded`, `aria-controls`, `aria-disabled` (non-button), `data-state`, `data-disabled`, `disabled`, `type` | high |
| Content attrs | `id` (`${id}-content`), `role="region"`, `aria-labelledby`, `hidden`, `data-state`, `data-disabled` | high |
| Events | Root `update:model-value` | high |
| Handlers bound | Activator click and keydown polyfill | high |
| Context | `useCollapsible(namespace)` -> `{ open, disabled, activatorId, contentId, toggle, show, hide }` | high |

```vue
<Collapsible.Root>
  <Collapsible.Activator>
    <Collapsible.Cue />
    Toggle content
  </Collapsible.Activator>
  <Collapsible.Content>This content can be toggled open and closed.</Collapsible.Content>
</Collapsible.Root>
```

### Checkbox

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Checkbox } from '@vuetify/v0'`; repo `components/Checkbox/` | high |
| Parts | `Checkbox.Root` `<button role="checkbox">`; `Checkbox.Indicator` `<span>` (hidden unless checked or mixed); `Checkbox.Group` `<div role="group">` (`createGroup`); `Checkbox.SelectAll` `<button role="checkbox">` bound to the group aggregate; `Checkbox.HiddenInput` `<input type="checkbox" inert>` auto when `name` | high |
| Model | Root standalone: `v-model` boolean. Group: `v-model` array (`multiple: true` always) | high |
| Root props | `id`, `label` (becomes `aria-label`), `value`, `name`, `form`, `disabled`, `indeterminate` (standalone mixed state; in group mode the ticket's `isMixed` wins), `ariaLabelledby`, `ariaDescribedby`, `ariaInvalid`, `namespace='v0:checkbox:root'`, `groupNamespace='v0:checkbox:group'` | high |
| Group props | `disabled`, `enroll`, `mandatory`, `label`, `ariaLabelledby`, `ariaDescribedby`, `namespace`; exposes `focus()` | high |
| Slot props | Root: `id`, `label`, `value`, `isChecked`, `isMixed`, `isDisabled`, `select`, `unselect`, `toggle`, `mix`, `unmix`, `attrs`. Group: `isDisabled`, `isNoneSelected`, `isAllSelected`, `isMixed`, `select`, `unselect`, `toggle`, `selectAll`, `unselectAll`, `toggleAll`, `attrs`. Indicator: `isChecked`, `isMixed`, `attrs` | high |
| Root attrs | `type`, `role="checkbox"`, `aria-checked` (`true`, `false`, `'mixed'`), `aria-disabled` (boolean, every host), `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `tabindex` (0, or `undefined` when disabled; not -1), `data-state`, `data-disabled` | high |
| Events | Root `update:model-value` (boolean); Group `update:model-value` | high |
| Handlers bound | Root click (toggle) and keydown Space (always attached, also on the native button; it prevents default so no double toggle) | high |
| Context | `useCheckboxRoot(namespace)` -> `CheckboxRootContext`; `useCheckboxGroup(groupNamespace)` -> `GroupContext<CheckboxTicket>`; Root detects the group with try/catch | high |
| Label | No `Checkbox.Label` part; wrap in a native `<label>` or point `ariaLabelledby` at your text | high |

```vue
<label class="inline-flex items-center gap-2">
  <Checkbox.Root v-model="agreed">
    <Checkbox.Indicator>*</Checkbox.Indicator>
  </Checkbox.Root>
  <span>I agree to the terms and conditions</span>
</label>
```

### Radio

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Radio } from '@vuetify/v0'`; repo `components/Radio/` | high |
| Parts | `Radio.Group` `<div role="radiogroup">` (`createSingle`); `Radio.Root` `<button role="radio">` (must be inside a Group; the injection throws otherwise); `Radio.Indicator` `<span>` (hidden unless checked); `Radio.HiddenInput` `<input type="radio" inert>` auto when `name` resolves (Root `name` or Group `name`) | high |
| Model | Group `v-model` `T` (single) | high |
| Group props | `disabled`, `mandatory` (`'force'` auto-selects the first enabled radio), `label`, `ariaLabelledby`, `ariaDescribedby`, `ariaRequired`, `name` (shared by all radios), `activation` (`automatic` default: arrows select; `manual`: arrows move focus, Enter/Space selects), `namespace='v0:radio:group'`; exposes `focus()` | high |
| Root props | `id`, `label` (`aria-label`), `value`, `name`, `form`, `disabled`, `ariaLabelledby`, `ariaDescribedby`, `ariaInvalid`, `namespace='v0:radio:root'`, `groupNamespace` | high |
| Slot props | Group: `isDisabled`, `isNoneSelected`, `activation`, `attrs`. Root: `id`, `label`, `value`, `isChecked`, `isDisabled`, `select`, `attrs`. Indicator: `isChecked`, `attrs` | high |
| Root attrs | `type`, `role="radio"`, `aria-checked`, `aria-disabled` (boolean), `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `tabindex` (roving: 0 on the selected radio, or on the first enabled radio when none is selected), `data-state="checked" \| "unchecked"`, `data-disabled`, `data-radio-id` | high |
| Group attrs | `role="radiogroup"`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-required` | high |
| Events | Group `update:model-value` | high |
| Handlers bound | Root click (select), keydown (Space/Enter select; ArrowUp/Left previous, ArrowDown/Right next, wrapping, skipping disabled; automatic mode also selects) | high |
| Context | `useRadioGroup(groupNamespace)` -> `SingleContext<RadioTicket>` plus `name`, `activation`; `useRadioRoot(namespace)` -> `RadioRootContext` | high |

```vue
<Radio.Group v-model="selected">
  <label v-for="option in options" :key="option.value" class="inline-flex items-center gap-2">
    <Radio.Root :value="option.value">
      <Radio.Indicator />
    </Radio.Root>
    <span>{{ option.label }}</span>
  </label>
</Radio.Group>
```

### Switch

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Switch } from '@vuetify/v0'`; repo `components/Switch/` | high |
| Parts | `Switch.Root` `<button role="switch">`; `Switch.Track` `<span aria-hidden="true" dir="ltr">` (the `dir="ltr"` is hard-coded on the Atom); `Switch.Thumb` `<span aria-hidden="true">`; `Switch.Group` `<div role="group">` (`createGroup`); `Switch.SelectAll` `<button role="switch">`; `Switch.HiddenInput` `<input type="checkbox" inert>` auto when `name` | high |
| Model | Root standalone `v-model` boolean; Group `v-model` array | high |
| Root props | Same list as `Checkbox.Root` with `namespace='v0:switch:root'`, `groupNamespace='v0:switch:group'` | high |
| Root attrs | `type`, `role="switch"`, `aria-checked` (boolean; `false` while mixed), `aria-disabled`, `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, `tabindex` (0 or `undefined`), `data-state="checked" \| "unchecked" \| "indeterminate"`, `data-disabled` | high |
| Track and Thumb attrs | `aria-hidden="true"`, `data-state` | high |
| Events | Root `update:model-value`; Group `update:model-value` | high |
| Handlers bound | Root click (toggle), keydown Space | high |
| Context | `useSwitchRoot(namespace)`, `useSwitchGroup(groupNamespace)` | high |

```vue
<Switch.Root v-model="enabled">
  <Switch.Track class="w-11 h-6 rounded-full data-[state=checked]:bg-primary">
    <Switch.Thumb class="size-4 rounded-full translate-x-1 data-[state=checked]:translate-x-6" />
  </Switch.Track>
</Switch.Root>
```

### Slider

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Slider } from '@vuetify/v0'`; repo `components/Slider/` | high |
| Parts | `Slider.Root` `<div role="group">`; `Slider.Track` `<div>` (click-to-position); `Slider.Range` `<span>` (filled region, positioned by percent); `Slider.Thumb` `<span role="slider">` (one per value; registers its index on mount); `Slider.HiddenInput` `<input type="hidden">` one per thumb, auto when `name` | high |
| Model | Root `v-model` `number` (one thumb) or `number[]` (range or multi); decided once from the initial value (`scalar` when the initial model is a number); default `[]` | high |
| Root props | `id`, `min` 0, `max` 100, `step` 1, `disabled`, `readonly`, `orientation` (`horizontal` default), `inverted`, `minStepsBetweenThumbs` 0, `crossover` false, `name`, `form`, `label`, `ariaLabelledby`, `namespace='v0:slider:root'` | high |
| Thumb props | `ariaLabel` (default `Slider.label` ?? `'Slider'` when no `ariaLabelledby`), `ariaLabelledby`, `ariaValuetext` | high |
| Slot props | Root: `id`, `values`, `min`, `max`, `isDisabled`, `isReadonly`, `orientation`, `snap`, `fromValue`, `fromPercent`, `set`, `up`, `down`, `floor`, `ceil`, `attrs`. Thumb: `index`, `value`, `percent`, `isDragging`, `attrs`. Range: `start`, `end` (percent), `attrs`. Track: `attrs` | high |
| Root attrs | `role="group"`, `aria-label`, `aria-labelledby`, `data-disabled`, `data-readonly`, `data-orientation` | high |
| Thumb attrs | `role="slider"`, `tabindex`, `aria-valuenow`, `aria-valuemin`/`aria-valuemax` (constrained by neighbor thumbs unless `crossover`), `aria-valuetext`, `aria-orientation`, `aria-disabled`, `aria-readonly`, `aria-label`, `aria-labelledby`, `data-state="dragging" \| "idle"`, `data-disabled`, `data-readonly`, `style` (`left` or `bottom` in `%`, `touch-action: none`) | high |
| Track attrs | `data-disabled`, `data-readonly`, `data-orientation`, `style` (`touch-action: none`) | high |
| Range attrs | `data-*` as Track plus `style` (`left`/`width` or `bottom`/`height` in `%`) | high |
| Events | Root `update:model-value`, `start(value)` (drag begins), `end(value)` (drag ends) | high |
| Handlers bound | Thumb pointerdown (drag) and keydown (Arrow keys by step, Shift plus Arrow and PageUp/PageDown by 10 steps, Home, End; inverted swaps horizontal arrows); Track pointerdown (snap nearest thumb, start drag); Root binds document `pointermove`/`pointerup` only during a drag and sets `touch-action: none` on `documentElement` for its duration | high |
| Context | `useSliderRoot(namespace)` -> `SliderContext` plus `id`, `name`, `form`, `dragging`, `track`, `onDrag` | high |
| Discrete slider | `step` snapping is built in (`snap`); the value label is DS markup bound to the Thumb `value` slot prop | high |

```vue
<Slider.Root v-model="single" class="relative flex items-center w-full h-5">
  <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
    <Slider.Range class="absolute h-full rounded-full bg-primary" />
  </Slider.Track>
  <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2" />
</Slider.Root>
```

### Input (text field primitive)

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Input } from '@vuetify/v0'`; repo `components/Input/`; composable `createInput` at `composables/createInput/index.ts` | high |
| Parts | `Input.Root` `<div>` (state attrs; owns `createInput`); `Input.Control` `<input>` (`as="textarea"` for multi-line); `Input.Description` `<span>`; `Input.Error` `<span aria-live="polite">`. There is no `Input.Label` part: the visible label is a native `<label :for="id">` | high |
| Model | Root `v-model` string (default `''`), `v-model:focused` boolean | high |
| Root props | `id` (auto), `label`, `name`, `type` (default `'text'`; owned by Root, applied by Control), `form`, `disabled`, `readonly`, `required` (registers a presence rule, message `Input.required` ?? `'Required'`), `rules` (`FormValidationRule \| RuleAlias \| StandardSchemaV1`), `validateOn` (`'blur'` default; `'input'`, `'submit'`, with `lazy` or `eager` modifiers, for example `'input lazy'`), `error`, `errorMessages`, `namespace='v0:input:root'`, `formNamespace='v0:form'` | high |
| Slot props | Root: `id`, `label`, `value`, `isDirty`, `isFocused`, `errors`, `isValid` (`boolean \| null`), `isPristine`, `isValidating`, `isDisabled`, `isReadonly`, `validate`, `reset`, `attrs`. Control: `value`, `isFocused`, `isDisabled`, `isReadonly`, `attrs`. Description: `id`. Error: `errors`, `attrs` | high |
| Root attrs | `data-state="pristine" \| "valid" \| "invalid"`, `data-dirty`, `data-focused`, `data-disabled`, `data-readonly` | high |
| Control attrs | `id`, `type`, `name`, `value`, `form`, `disabled`, `readonly`, `required`, `aria-invalid`, `aria-label` (from the `label` prop), `aria-describedby` (`${id}-description`, only while a Description is mounted), `aria-errormessage` (`${id}-error`, only while an Error is mounted and errors exist), `aria-required`, `data-state`, `data-focused`, `data-disabled`, `data-readonly` | high |
| Error attrs | `id` (`${id}-error`), `aria-live="polite"`, `data-state="visible" \| "hidden"` | high |
| Events | Root `update:model-value`, `update:focused` | high |
| Handlers bound | Control `onInput` (writes the model), `onFocus`, `onBlur` (blur marks touched and validates per `validateOn`) | high |
| Context | `useInputRoot(namespace)` -> `InputRootContext` (ids, registries of mounted descriptions and errors, `value`, `isDirty`, `isFocused`, `isDisabled`, `isReadonly`, `errors`, `isValid`, `isPristine`, `isValidating`, `validate`, `reset`) | high |
| Form wiring | `createInput` calls `createValidation({ rules, value, formNamespace })`, which registers with a parent `Form` through `useForm()` (returns `undefined` when no Form) | high |
| Label duplication | Passing `label` to `Input.Root` sets `aria-label` on the control; with a visible `<label for>` that duplicates the accessible name. Emerald's `EmTextField` keeps `label` for the visible `<label>` only and does not forward it to Root | high |
| createInput API | Options: `value: Ref<T>` (required), `id`, `label`, `name`, `form`, `formNamespace`, `required`, `disabled`, `readonly`, `rules`, `error`, `errorMessages`, `dirty(value)`, `equals(a, b)`. Returns: `id`, `label`, `name`, `form`, `required`, `descriptionId`, `errorId`, `descriptions`, `fieldErrors`, `hasDescription`, `hasError`, `value`, `isDirty`, `isFocused`, `isDisabled`, `isReadonly`, `isPristine`, `isTouched`, `errors`, `isValid`, `isValidating`, `validate()`, `reset()`, `state` | high |

```vue
<Input.Root id="email" v-model="email" type="email" :rules="[v => !!v || 'Email is required']">
  <label for="email">Email</label>
  <Input.Control placeholder="you@example.com" class="data-[focused]:border-primary data-[state=invalid]:border-error" />
  <Input.Description>We will never share your email.</Input.Description>
  <Input.Error v-slot="{ errors }">
    <span v-for="error in errors" :key="error">{{ error }}</span>
  </Input.Error>
</Input.Root>
```

### Combobox (autocomplete)

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Combobox } from '@vuetify/v0'`; repo `components/Combobox/`; composable `createCombobox` | high |
| Parts | `Combobox.Root` renderless (`createCombobox`); `Combobox.Activator` `<div data-state>` (anchor wrapper); `Combobox.Control` `<input role="combobox">`; `Combobox.Cue` `<span aria-hidden>` (click toggles); `Combobox.Content` `<div role="listbox" popover="manual">`; `Combobox.Item` `<div role="option">` (`v-show` while filtered; stays registered); `Combobox.Empty` `<div>` (renders only when no match; default text `Combobox.noResults` ?? `'No results'`); `Combobox.Description` `<span>`; `Combobox.Error` `<span aria-live="polite">`; hidden inputs auto when `name` (one per selected value) | high |
| Model | Root `v-model` `T \| T[]` (`multiple`) | high |
| Root props | `id`, `name`, `form`, `disabled`, `multiple`, `mandatory`, `strict` (unmatched text discarded on confirm; `aria-autocomplete="both"`), `error`, `errorMessages`, `adapter` (`ClientComboboxAdapter` default, `ServerComboboxAdapter`), `positionAdapter` (`PopoverAdapter`), `displayValue(value)`, `namespace='v0:combobox'` | high |
| Control props | `openOn` (`'focus'` default or `'input'`), `placeholder` | high |
| Content props | `eager` (render before first open) | high |
| Item props | `id`, `value`, `disabled`, `el` (host when renderless) | high |
| Slot props | Root: `id`, `query`, `isOpen`, `isEmpty`, `isLoading`, `isDisabled`, `errors`, `isValid`, `open`, `close`, `toggle`, `clear`, `commit`. Control: `query`, `isOpen`, `attrs`. Item: `value`, `isSelected`, `isHighlighted`, `isDisabled`, `isFiltered`, `select`, `attrs`. Empty: `query`. Cue: `isOpen`, `attrs`. Error: `id`, `errors`, `attrs`. Description: `id` | high |
| Control attrs | `id`, `role="combobox"`, `aria-autocomplete` (`list`, or `both` when strict), `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`, `aria-describedby`, `aria-errormessage`, `aria-invalid`, `aria-disabled`, `autocomplete="off"`, `data-disabled`, `disabled`, `placeholder`, `value` (display text) | high |
| Content attrs | `id` (listbox), `role="listbox"`, `aria-labelledby` (input id), `aria-multiselectable`, `popover="manual"` (no browser light dismiss; `useClickOutside` commits and closes), `tabindex=-1`, `style` | high |
| Item attrs | `id` (`${rootId}-option-${ticketId}`), `role="option"`, `aria-selected`, `aria-disabled`, `data-selected`, `data-highlighted=""`, `data-disabled`, `data-id` | high |
| Events | Root `update:model-value` | high |
| Handlers bound | Control input (query), focus (open when `openOn='focus'`), blur (commit and close unless focus moved into the list or activator), keydown (Enter selects the highlighted option or commits text; Escape closes; Tab commits or selects then closes; ArrowDown/Up open or move the virtual cursor; Home/End clear it). Item click (select) and pointerdown (`preventDefault`, keeps input focus). Cue click (toggle). Content click outside | high |
| Context | `useComboboxRoot(namespace)` -> `ComboboxContext` plus `listEl` (`selection`, `popover`, `cursor` (`useVirtualFocus`), `query`, `display`, `pristine`, `filtered`, `isEmpty`, `isLoading`, `isOpen`, ids, `hasDescription`, `hasError`, `errors`, `isValid`, `inputEl`, `multiple`, `strict`, `disabled`, `name`, `form`, `open`, `close`, `toggle`, `commit`, ...) | high |
| Not read | `createCombobox` function body and adapter internals (filtering and loading); the context fields above come from its exported interface | moderate |

```vue
<Combobox.Root v-model="selected">
  <Combobox.Activator class="flex items-center gap-1 rounded-lg border">
    <Combobox.Control placeholder="Search fruits" />
    <Combobox.Cue class="data-[state=open]:rotate-180">v</Combobox.Cue>
  </Combobox.Activator>
  <Combobox.Content :style="{ minWidth: 'anchor-size(width)' }">
    <Combobox.Item v-for="item in fruits" :id="item.id" :key="item.id" :value="item.label">{{ item.label }}</Combobox.Item>
    <Combobox.Empty v-slot="{ query }">No results for "{{ query }}"</Combobox.Empty>
  </Combobox.Content>
</Combobox.Root>
```

### Select

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Select } from '@vuetify/v0'`; repo `components/Select/` | high |
| Parts | `Select.Root` renderless; `Select.Activator` `<button role="combobox">`; `Select.Value` `<span>` (renders only with a value; default text is the first selected value); `Select.Placeholder` `<span>` (renders only without a value); `Select.Cue` `<span aria-hidden>`; `Select.Content` `<div role="listbox" popover="">`; `Select.Item` `<div role="option">`; hidden inputs auto when `name` (internal, not in the compound object) | high |
| Model | Root `v-model` `T \| T[]` (`multiple`) | high |
| Root props | `id`, `name`, `form`, `disabled`, `multiple`, `mandatory` (`false \| true \| 'force'`), `adapter` (`PopoverAdapter`), `namespace='v0:select'` | high |
| Activator props | `label` (`aria-label`), `ariaLabelledby` | high |
| Content props | `eager` | high |
| Item props | `id`, `value`, `disabled`; the item's `textContent` feeds typeahead | high |
| Slot props | Root: `id`, `isOpen`, `isDisabled`, `open`, `close`, `toggle`. Activator: `isOpen`, `attrs`. Value: `selectedItem`, `selectedItems`, `selectedValue`, `selectedValues`, `hasValue`, `attrs`. Placeholder: `hasValue`. Item: `value`, `isSelected`, `isHighlighted`, `isDisabled`, `select`, `attrs`. Cue: `isOpen`, `attrs` | high |
| Activator attrs | `id` (`${id}-activator`), `role="combobox"`, `type`, `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls` (`${id}-listbox`), `aria-label`, `aria-labelledby`, `aria-disabled`, `disabled`, `tabindex` (0 only on a non-button host), `data-disabled`, `data-open`, `style` (anchor) | high |
| Content attrs | `id`, `popover=""` (browser light dismiss), `role="listbox"`, `aria-labelledby`, `aria-multiselectable`, `tabindex=-1`, `style` | high |
| Item attrs | `id` (`${id}-option-${ticketId}`), `role="option"`, `aria-selected`, `aria-disabled`, `data-selected`, `data-highlighted=""`, `data-disabled`, `data-id` | high |
| Events | Root `update:model-value` | high |
| Handlers bound | Activator click (toggle) and keydown (printable characters run `useTypeahead`; open: Space/Enter select the highlighted item, Escape closes, Tab closes, Arrow/Home/End move the virtual cursor; closed: Space/Enter/ArrowDown/ArrowUp open). Item click (select; single mode closes). Virtual focus writes `aria-activedescendant` on the activator and `data-highlighted` on items | high |
| Context | `useSelectContext(namespace)` -> `SelectContext` (`isOpen`, `disabled`, `multiple`, `id`, `listboxId`, `activatorId`, `name`, `form`, `activatorEl`, `selection`, `virtualFocus`, `popover`, `open`, `close`, `toggle`, `select`, `onTypeahead`, `modelValue`) | high |
| SSR | `useVirtualFocus` item lookup uses `document.querySelector` behind `IN_BROWSER` | high |

```vue
<Select.Root v-model="color">
  <Select.Activator class="flex items-center justify-between rounded-lg border">
    <Select.Value v-slot="{ selectedValue }">{{ selectedValue }}</Select.Value>
    <Select.Placeholder>Choose a color</Select.Placeholder>
    <Select.Cue v-slot="{ isOpen }">{{ isOpen ? 'up' : 'down' }}</Select.Cue>
  </Select.Activator>
  <Select.Content :style="{ minWidth: 'anchor-size(width)' }">
    <Select.Item v-for="item in colors" :id="item.id" :key="item.id" :value="item.label">{{ item.label }}</Select.Item>
  </Select.Content>
</Select.Root>
```

### Form

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Form } from '@vuetify/v0'`; repo `components/Form/Form.vue`; composable `createForm` | high |
| Renders | `<form novalidate>` (single component, `inheritAttrs: false`, `mergeProps`) | high |
| Model | `v-model` `boolean \| null` (aggregate validity; `null` until every field validated) | high |
| Props | `disabled`, `readonly` (both exposed to registered fields through the context), `novalidate` (default true), `namespace='v0:form'` | high |
| Slot props | `isValid`, `isValidating`, `isDisabled`, `isReadonly`, `submit()` (`Promise<boolean>`), `reset()`, `attrs` (`novalidate`, `onSubmit`, `onReset`) | high |
| Events | `update:model-value`, `submit({ valid })`, `reset` | high |
| Handlers bound | `onSubmit` (`preventDefault`, validates every registered field, emits `submit`), `onReset` (`preventDefault`, resets fields) | high |
| Context | `provideContext(namespace, form)`; fields read it with `useForm(namespace)` (returns `undefined` outside a Form) | high |
| createForm API | `register({ value: ValidationContext })`, `submit(id?)`, `reset()`, `disabled`, `readonly`, `isValid`, `isValidating`, plus the registry surface | high |

```vue
<Form v-model="valid" @submit="onSubmit" @reset="onReset">
  <Input.Root id="email" v-model="email" type="email" :rules="[v => !!v || 'Email is required']">
    <label for="email">Email</label>
    <Input.Control />
    <Input.Error v-slot="{ errors }"><span v-for="error in errors" :key="error">{{ error }}</span></Input.Error>
  </Input.Root>
  <button type="submit">Sign in</button>
  <button type="reset">Reset</button>
</Form>
```

### Snackbar

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Snackbar } from '@vuetify/v0'`; repo `components/Snackbar/` | high |
| Parts | `Snackbar.Portal` (`Portal` teleport plus `<div>`; registers a non-modal stack ticket with `scrim: false`; nudges a static wrapper to `position: relative`); `Snackbar.Queue` `<div>` (reads `useNotifications`; pauses the queue on hover and focus); `Snackbar.Root` `<div role="status" \| "alert">`; `Snackbar.Content` `<div>`; `Snackbar.Close` `<button>`; `Snackbar.Announcer` two visually hidden live regions (auto-rendered by Portal) | high |
| Portal props | `announcer` (default true), `teleport` (`'top-layer'` default: into the topmost open modal `<dialog>`, else `body`; a selector string; or `false` for inline), `namespace='v0:notifications'` | high |
| Root props | `id`, `urgent` (`role="alert"` and the assertive announcer; otherwise `role="status"`), `namespace` | high |
| Slot props | Portal: `zIndex`, `attrs` (`style.zIndex`). Queue: `items` (`NotificationTicket[]`, newest first), `attrs` (`onMouseenter`, `onMouseleave`, `onFocusin`, `onFocusout`). Root: `id`, `attrs` (`role`). Close: `attrs` | high |
| Close attrs | `type`, `role`, `tabindex=0`, `aria-label` = `Snackbar.close` ?? `'Dismiss'` | high |
| Events | Root `dismiss(id)` (emitted only when no `Snackbar.Queue` context exists; with a Queue it calls `queue.dismiss(id)` which unregisters the notification) | high |
| Handlers bound | Close click and keydown polyfill; Queue mouseenter/leave and focusin/out (pause and resume the timeout) | high |
| Context | `useSnackbarPortalContext(namespace, null)` (suffix `portal`), `useSnackbarQueueContext(namespace, null)` (suffix `queue`), `useSnackbarRootContext(namespace)` (suffix `root`); all optional with `null` default | high |
| Timing | Auto-dismiss comes from `createNotificationsPlugin({ timeout })`, default 3000 ms, per-notification `timeout` override (`useNotifications`, `createQueue`) | high |
| Announcement | Root mirrors its rendered text into the Portal's live regions on mount (clear then fill on the next frame via `useRaf`), because freshly injected `role="status"` nodes are not reliably announced | high |

```vue
<Snackbar.Portal class="absolute bottom-4 right-4" :teleport="false">
  <Snackbar.Root v-if="visible" @dismiss="onDismiss">
    <Snackbar.Content>Changes saved successfully</Snackbar.Content>
    <Snackbar.Close>x</Snackbar.Close>
  </Snackbar.Root>
</Snackbar.Portal>
```

### Progress

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Progress } from '@vuetify/v0'`; repo `components/Progress/`; composable `createProgress` | high |
| Parts | `Progress.Root` `<div role="progressbar">`; `Progress.Track` `<div>`; `Progress.Fill` `<div>` (registers a segment; `style.width` in `%`); `Progress.Buffer` `<div>` (independent percent, `style.width`; not a segment); `Progress.Value` `<span>` (default text `${Math.round(percent)}%`); `Progress.Label` `<label>`; `Progress.HiddenInput` `<input type="hidden">` auto when `name` | high |
| Model | Root `v-model` `number \| number[]` (one entry per Fill segment) | high |
| Root props | `id`, `ariaLabel` (used only when no Label is mounted), `min` 0, `max` 100, `name`, `namespace='v0:progress:root'` | high |
| Fill props | `value` (per-segment; omitted means the segment is driven by the model) | high |
| Buffer props | `value` | high |
| Indeterminate rule | `isIndeterminate` is true when no segment is registered and no initial value exists, or when every registered segment is 0 or less (`createProgress`). A Root with no model value and a value-less Fill is indeterminate; a value of 0 is also reported as indeterminate | high |
| Slot props | Root: `id`, `total`, `percent`, `isIndeterminate`, `segments`, `attrs`. Fill: `value`, `percent`, `index`, `attrs`. Buffer: `value`, `percent`, `attrs`. Value and Label: `total`, `percent`, `isIndeterminate` (Label adds `attrs.id`) | high |
| Root attrs | `role="progressbar"`, `aria-valuenow` (omitted when indeterminate), `aria-valuemin`, `aria-valuemax`, `aria-valuetext` (`N%`), `aria-label`, `aria-labelledby` (`${id}-label` while a Label is mounted), `aria-busy` (indeterminate), `data-state="determinate" \| "indeterminate"`, `data-complete` (total at or above max) | high |
| Fill attrs | `data-index`, `data-state`, `style.width` (`%`, omitted when indeterminate so CSS animation can run) | high |
| Buffer attrs | `data-buffer="true"`, `data-state`, `style.width` | high |
| Events | Root `update:model-value` | high |
| Handlers bound | None | high |
| Context | `useProgressRoot(namespace)` -> `ProgressContext` plus `id`, `name`, `labelId`, `hasLabel` | high |
| Circular use | Track, Fill and Buffer are width-based; for a circular indicator render an SVG from the Root `percent` slot prop and keep the Root attrs | high |

```vue
<Progress.Root v-model="value">
  <Progress.Label>Loading...</Progress.Label>
  <Progress.Track class="h-2 w-full rounded-full bg-surface-variant">
    <Progress.Fill class="h-full rounded-full bg-primary" />
  </Progress.Track>
  <Progress.Value />
</Progress.Root>
```

### DataTable (+ createDataTable, createPagination)

| Field | Value | Confidence |
|---|---|---|
| Import | `import { DataTable } from '@vuetify/v0'`; composables `createDataTable`, `createPagination` from `@vuetify/v0` (also `@vuetify/v0/data-table`, `.../data-table/adapters/{client,server,virtual}`); repo `components/DataTable/`, `composables/createDataTable/`, `composables/createPagination/` | high |
| Parts | `DataTable.Root` slot-only (owns `createDataTable`); `DataTable.Table` `<table role="table">`; `DataTable.Header` `<thead>`; `DataTable.Column` `<th role="columnheader">` (registers a column when `id` is set); `DataTable.Body` `<tbody>`; `DataTable.Row` `<tr role="row">` (registers a row ticket when `value` is set; `v-show` hides off-page rows); `DataTable.Cell` `<td role="cell">`; `DataTable.Empty` `<tr>` rendered only when no items | high |
| Model | Root `v-model:search` string | high |
| Root props | `DataTableOptions`: `filter`, `pagination` (`itemsPerPage` 10, `visible` 7, `ellipsis '...'`, `page`), `sortMultiple`, `mandate` (no `none` state), `firstSortOrder` (`'asc'` default), `selectStrategy` (`'single' \| 'page' \| 'all'`, default `'page'`), `itemSelectable` (row key), `groupBy`, `openAll`, `expandMultiple` (default true), `locale`, `adapter` (`ClientDataTableAdapter` default, `ServerDataTableAdapter({ total, loading, error })`, `VirtualDataTableAdapter`), `namespace='v0:data-table'` | high |
| Column props | `id`, `sortable`, `filterable`, `colspan`, `rowspan` | high |
| Row props | `id`, `value` (row record), `index` (1-based `aria-rowindex`), `selectable` (emit `aria-selected` and bind click) | high |
| Slot props | Root: `context` (`DataTableContext`). Header: `headers` (2D grid), `attrs`. Column: `isSortable`, `direction` (`asc`, `desc`, `none`), `priority`, `toggle`, `attrs`. Body: `items`, `rank(source)` (orders a source array by the pipeline so rows register themselves), `isLoading`, `isEmpty`, `attrs`. Row: `id`, `value`, `isSelected`, `isSelectable`, `isExpanded`, `isVisible`, `toggleSelection`, `toggleExpansion`, `attrs`. Empty: `isLoading`, `columnCount` (bind as Cell `colspan`), `attrs` | high |
| Attrs | Table: `role="table"`, `aria-rowcount` (only when the page is truncated). Column: `role="columnheader"`, `scope` (`col`, or `colgroup` when `colspan > 1`), `aria-sort` (`ascending`, `descending`, `none`; omitted when not sortable), `data-direction` (`asc`/`desc`), `colspan`, `rowspan`. Row: `role="row"`, `aria-selected`, `aria-rowindex`, `data-selected`, `data-expanded`. Cell: `role="cell"`, `colspan`, `rowspan` | high |
| Events | Root `update:search` | high |
| Handlers bound | Row `onClick` (toggle selection) only when `selectable`. Column binds nothing: the sort trigger is consumer markup (a `Button.Root` calling the `toggle` slot prop) | high |
| Context | `useDataTableRoot<T>(namespace)` -> `DataTableContext<T>`: registry surface (`register`, `onboard`, `upsert`, `unregister`, `get`, `has`), `items`, `allItems`, `filteredItems`, `sortedItems`, `rank`, `columns` (registry), `leaves`, `headers`, `search`, `query`, `sort` (`toggle`, `columns`, `order`, `direction`, `priority`, `reset`), `pagination` (`PaginationContext`), `selection` (`selectedIds`, `select`, `unselect`, `toggle`, `isSelected`, `isSelectable`, `selectAll`, `unselectAll`, `toggleAll`, `isAllSelected`, `isMixed`), `expansion` (`expandedIds`, `expand`, `collapse`, `toggle`, `isExpanded`, `expandAll`, `collapseAll`), `grouping` (`groups`, `toggle`, `isOpen`, `open`, `close`, `openAll`, `closeAll`), `total`, `loading`, `error` | high |
| Sort model | Sort state is a `createGroup` tri-state per column: selected is `asc`, mixed is `desc`, unselected is `none`; `toggle` cycles none, asc, desc, none (`mandate` skips none) | high |
| createPagination | Options: `page` (number or `ShallowRef`), `itemsPerPage` 10, `size` 0, `visible` 7, `ellipsis` `'...'` or `false`. Context: `page` (writable, clamped), `itemsPerPage`, `size`, `pages`, `ellipsis`, `items` (`{ type: 'page', value } \| { type: 'ellipsis', value }`), `pageStart`, `pageStop` (0-based, exclusive), `isFirst`, `isLast`, `first`, `last`, `next`, `prev`, `select(n)`. `createPaginationContext({ namespace: 'v0:pagination' })`, `usePagination()` | high |
| Pagination compound | `Pagination.Root` (`<nav>`, props `size`, `totalVisible`, `itemsPerPage`, `ellipsis`), `Item`, `First`, `Prev`, `Ellipsis`, `Next`, `Last`, `Status`; Item attrs include `aria-label`, `aria-current="page"`, `aria-disabled`, `data-selected`, `data-disabled`, `role` polyfill, `onClick`, `onKeydown`; the Root's `as` default was not read | moderate |
| Row selection UI | A per-row checkbox is `Checkbox.Root` inside a Cell bound to `isSelected` and `toggleSelection`; the header select-all binds `context.selection.isAllSelected`, `isMixed`, `toggleAll` | high |
| Not read | `createDataTable` body (lines 330 to 910) and `columns.ts`; the context shape above is its exported interface | moderate |

```vue
<DataTable.Root v-model:search="query">
  <DataTable.Table aria-label="Users table">
    <DataTable.Header>
      <DataTable.Row>
        <DataTable.Column v-for="col in columns" :id="col.id" :key="col.id" v-slot="{ isSortable, toggle, direction }" :sortable="col.sortable">
          <Button.Root v-if="isSortable" @click="toggle">{{ col.title }} {{ direction }}</Button.Root>
          <span v-else>{{ col.title }}</span>
        </DataTable.Column>
      </DataTable.Row>
    </DataTable.Header>
    <DataTable.Body v-slot="{ rank }">
      <DataTable.Row v-for="user in rank(users)" :id="user.id" :key="user.id" :value="user">
        <DataTable.Cell>{{ user.name }}</DataTable.Cell>
      </DataTable.Row>
      <DataTable.Empty v-slot="{ columnCount }">
        <DataTable.Cell :colspan="columnCount">No users found</DataTable.Cell>
      </DataTable.Empty>
    </DataTable.Body>
  </DataTable.Table>
</DataTable.Root>
```

### Step (+ createStep)

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Step, createStep } from '@vuetify/v0'`; repo `components/Step/`, `composables/createStep/` | high |
| Parts | `Step.Root` slot-only; `Step.Item` slot-only (registers a ticket; no element) | high |
| Model | Root `v-model` single value | high |
| Root props | `disabled`, `enroll`, `mandatory`, `namespace='v0:step'` (no `circular` prop on the component; the composable has it) | high |
| Item props | `id`, `label`, `value`, `disabled`, `namespace` | high |
| Slot props | Root: `isDisabled`, `first`, `last`, `next`, `prev`, `step(count)`, `select`, `unselect`, `toggle`, `attrs` (`aria-multiselectable: false`). Item: `id`, `label`, `value`, `isSelected`, `isDisabled`, `select`, `unselect`, `toggle`, `attrs` | high |
| Item attrs | `role="tab"`, `tabindex`, `aria-selected`, `aria-disabled`, `data-selected`, `data-disabled`, `onClick` (toggle), `onKeydown` (Enter/Space). These apply only where the consumer binds `attrs`; `role="tab"` is wrong for a stepper, so bind `isSelected` and `select` instead | high |
| Events | Root `update:model-value` | high |
| Context | `useStepRoot(namespace)` -> `StepContext` | high |
| createStep | Options: `circular` (default false) plus `SingleOptions` (`mandatory`, `enroll`, `disabled`, `events`, `reactive`). Context adds `first`, `last`, `next`, `prev`, `step(count)`; navigation skips disabled tickets; bounded mode stops at the ends. `createStepContext({ namespace: 'v0:step' })`, `useStep()` | high |

```vue
<Step.Root v-model="current" v-slot="{ next, prev }">
  <Step.Item v-for="i in 3" :key="i" :value="i" v-slot="{ isSelected }">
    <div v-if="isSelected">Step {{ i }}</div>
  </Step.Item>
  <Button.Root @click="prev">Previous</Button.Root>
  <Button.Root @click="next">Next</Button.Root>
</Step.Root>
```

### Single (+ createSingle)

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Single, createSingle } from '@vuetify/v0'`; repo `components/Single/`, `composables/createSingle/` | high |
| Parts | `Single.Root` slot-only; `Single.Item` slot-only | high |
| Model | Root `v-model` single value | high |
| Root props | `disabled`, `enroll`, `mandatory`, `namespace='v0:single'` | high |
| Item attrs | `role="option"`, `tabindex`, `aria-selected`, `aria-disabled`, `data-selected`, `data-disabled`, `onClick`, `onKeydown` (Enter/Space); applied only where the consumer binds `attrs` | high |
| Context | `useSingleRoot(namespace)` -> `SingleContext` | high |
| createSingle | Forces `multiple: false`; context = `SelectionContext` plus `selectedId`, `selectedIndex`, `selectedItem`, `selectedValue`; options `mandatory` (`false`, `true`, `'force'`), `enroll`, `disabled`, `events`, `reactive`. `createSingleContext({ namespace: 'v0:single' })`, `useSingle()` | high |

```vue
<Single.Root v-model="selected">
  <Single.Item v-for="size in ['small', 'medium', 'large']" :key="size" v-slot="{ attrs }" :value="size">
    <button v-bind="attrs" class="data-[selected]:border-primary">{{ size }}</button>
  </Single.Item>
</Single.Root>
```

### Selection (+ createSelection)

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Selection, createSelection } from '@vuetify/v0'`; repo `components/Selection/`, `composables/createSelection/` | high |
| Parts | `Selection.Root` slot-only; `Selection.Item` slot-only | high |
| Model | Root `v-model` `T \| T[]` (`multiple`) | high |
| Root props | `disabled`, `enroll`, `mandatory`, `multiple`, `namespace='v0:selection'` | high |
| Root slot props | `isDisabled`, `multiple`, `select`, `unselect`, `toggle`, `attrs` (`aria-multiselectable`) | high |
| Item attrs | Same shape as `Single.Item` (`role="option"`) | high |
| createSelection | Options: `multiple`, `mandatory` (`true` blocks deselecting the last item; `'force'` auto-selects the first enabled item on registration), `enroll` (default false), `disabled`, `events`, `reactive`. Context: `selectedIds` (reactive `Set`), `selectedItems`, `selectedValues`, `multiple`, `register`, `onboard`, `select`, `unselect`, `toggle`, `selected(id)`, `apply`, `mandate`, `seek('first' \| 'last', from)`, `reset`, `clear`, registry methods (`get`, `has`, `browse`, `lookup`, `values`, `keys`, `upsert`). Ticket: `id`, `index`, `value`, `disabled`, `isSelected`, `select()`, `unselect()`, `toggle()`, `unregister()`. `createSelectionContext({ namespace: 'v0:selection' })`, `useSelection()` | high |
| useProxyModel | `useProxyModel(context, model, { multiple, transformIn, transformOut })` bridges a `defineModel` ref to any `createModel` descendant; the registry must be created with `events: true` | high |

```vue
<Selection.Root v-model="selected" multiple>
  <Selection.Item v-for="item in items" :key="item" :value="item" v-slot="{ isSelected, toggle }">
    <button :data-selected="isSelected || undefined" @click="toggle">{{ item }}</button>
  </Selection.Item>
</Selection.Root>
```

### Group (+ createGroup)

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Group, createGroup } from '@vuetify/v0'`; repo `components/Group/`, `composables/createGroup/` | high |
| Parts | `Group.Root` slot-only; `Group.Item` slot-only | high |
| Model | Root `v-model` array (`multiple: true`) | high |
| Root props | `disabled`, `enroll`, `mandatory`, `namespace='v0:group'` | high |
| Root slot props | `isDisabled`, `isNoneSelected`, `isAllSelected`, `isMixed`, `select`, `unselect`, `toggle` (each accepts `ID \| ID[]`), `selectAll`, `unselectAll`, `toggleAll`, `attrs` (`aria-multiselectable: true`) | high |
| Item props | `id`, `label`, `value`, `disabled`, `indeterminate`, `namespace` | high |
| Item attrs | `role="checkbox"`, `tabindex`, `aria-checked` (`true`, `false`, `'mixed'`), `aria-disabled`, `data-selected`, `data-disabled`, `data-mixed`, `onClick`, `onKeydown` (Space) | high |
| Item slot props | `isSelected`, `isMixed`, `isDisabled`, `select`, `unselect`, `toggle`, `mix`, `unmix` | high |
| createGroup | Tri-state multi-selection; ticket adds `isMixed`, `mix()`, `unmix()`, `indeterminate`; context adds `isNoneSelected`, `isAllSelected`, `isMixed`, `selectAll`, `unselectAll`, `toggleAll`. Read through `GroupRoot.vue` and `CheckboxGroup.vue`, not the composable file | moderate |

```vue
<Group.Root v-model="selected">
  <Group.Item v-for="item in items" :key="item" v-slot="{ attrs }" :value="item">
    <button v-bind="attrs">{{ item }}</button>
  </Group.Item>
</Group.Root>
```

### Portal

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Portal } from '@vuetify/v0'`; repo `components/Portal/Portal.vue` | high |
| Renders | Vue `<Teleport>` wrapper; renderless (the consumer renders the positioned element) | high |
| Props | `to` (`'top-layer'` resolves to the topmost open modal `<dialog>`; default is `createStackPlugin({ default })` then `'body'`), `disabled` (render inline), `blocking`, `scrim` (default true), `promote` (`true` or a rank number; keeps the portal above overlays that open later) | high |
| Slot props | `zIndex` (apply to a positioned element), `close()` (dismisses the stack ticket) | high |
| Events | `close` (from `onDismiss`, for example a scrim click) | high |
| Stack | Registers a `useStack` ticket and selects it immediately on mount, so a mounted Portal is an open overlay; `v-if` the Portal to open and close it | high |
| SSR | `Teleport` behaves as Vue's does on the server; the stack fallback is per-call | high |

```vue
<Portal v-if="show" @close="show = false" v-slot="{ zIndex, close }">
  <div class="fixed bottom-4 right-4" :style="{ zIndex }">
    <button @click="close">close</button>
  </div>
</Portal>
```

### Scrim

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Scrim } from '@vuetify/v0'`; repo `components/Scrim/Scrim.vue` | high |
| Renders | One `<div aria-hidden="true">` per selected stack ticket whose `scrim` is not false, inside a `<TransitionGroup :name="transition">`, teleported to `body` by default | high |
| Props | `transition` (default `'fade'`), `teleport` (default true), `teleportTo` (default `'body'`), `as`, `renderless` | high |
| Slot props | `ticket`, `zIndex` (ticket z-index minus 1), `isBlocking`, `dismiss`, `attrs` (`aria-hidden`, `style.zIndex`, `onClick`) | high |
| Handlers bound | Click dismisses the ticket unless it is `blocking` | high |
| Requirement | Reads `useStack()`; install `createStackPlugin` for one shared stack (the fallback is a lazy browser singleton) | high |
| Conflict | Native `<dialog>` already paints `::backdrop`; mounting `Scrim` as well paints two backdrops (issue #910). Quantum must choose: `Scrim` with `scrim: true` tickets and a transparent `::backdrop`, or `::backdrop` and `scrim: false` on every `Dialog.Content` | high |

```vue
<Scrim class="fixed inset-0 bg-black/50" />
```

### Presence (+ usePresence)

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Presence, usePresence } from '@vuetify/v0'`; repo `components/Presence/Presence.vue`, `composables/usePresence/` | high |
| Renders | Renderless; the slot renders while `isMounted` (through the `leaving` state) | high |
| Model | `v-model` boolean | high |
| Props | `lazy` (defer first mount until first true; stays mounted and `hidden` after leave), `immediate` (default true: a leave that never calls `done()` resolves on the next tick) | high |
| Slot props | `attrs` (`data-state`, optional `hidden`), `isPresent`, `isLeaving`, `done()` (call when the exit animation ends) | high |
| Events | `enter`, `leave`, `after-leave` | high |
| State machine | `unmounted` -> `mounted` (one tick) -> `present` -> `leaving` -> `unmounted` (or back to `mounted` when lazy); re-entry during `leaving` returns to `present` | high |
| usePresence | `usePresence({ present, lazy, immediate })` -> `state`, `isMounted`, `isPresent`, `isLeaving`, `done` | high |
| Reduced motion | Not consulted by Presence; the DS gates its keyframes on `body[data-reduced-motion="reduce"]` or `useReducedMotion().isReduced` | high |

```vue
<Presence v-slot="{ attrs, done }" v-model="show" :immediate="false">
  <div v-bind="attrs" class="toast" @animationend="done">Animates out, then unmounts</div>
</Presence>
```

### Theme (scoped provider component)

| Field | Value | Confidence |
|---|---|---|
| Import | `import { Theme } from '@vuetify/v0'`; repo `components/Theme/Theme.vue` | high |
| Renders | `<div data-theme="<id>">` that re-provides the theme context with `selectedId` overridden for its subtree | high |
| Props | `theme` (an id registered on the plugin), `namespace='v0:theme'` | high |
| Slot props | `attrs` (`data-theme`), `theme`, `isDark` | high |
| Use | Dark surfaces inside a light page: the adapter's `[data-theme="quantum-dark"]` block applies to the subtree | high |

## Composables

### createContext

| Field | Value | Confidence |
|---|---|---|
| Import | `import { createContext, useContext, provideContext } from '@vuetify/v0'`; repo `composables/createContext/index.ts` | high |
| Static key | `createContext<T>('quantum:card')` -> `[useX, provideX]`; `useX()` throws `V0Error` (`V0_CONTEXT_MISSING`) when absent unless a default was passed; string keys must contain `:` (dev warning otherwise) | high |
| Dynamic key | `createContext<T>()` or `createContext<T>({ suffix: 'item' })` -> `[useX(key, default?), provideX(key, ctx)]`; the suffix is appended as `${key}:${suffix}` | high |
| Optional injection | Static: `createContext<T \| null>('quantum:list', null)`. Dynamic: `useX(namespace, null)` returns `null` instead of throwing (the Snackbar parts use this) | high |
| App level | `provideContext(key, ctx, app)` provides on the app (plugins) | high |

### useId

| Field | Value | Confidence |
|---|---|---|
| Import | `import { useId } from '@vuetify/v0/utilities'` (also from the main barrel); repo `utilities/helpers.ts` | high |
| Behavior | Inside a component instance returns Vue's `useId()`; otherwise `v0-${counter}` and warns on the server in dev. Pass explicit ids for hydration-sensitive trees | high |

### useLocale

| Field | Value | Confidence |
|---|---|---|
| Import | `import { useLocale, createLocalePlugin } from '@vuetify/v0'` (also `@vuetify/v0/locale`); repo `composables/useLocale/` | high |
| Plugin | `createLocalePlugin({ messages: { en }, default: 'en', fallback, adapter, persist })`; `V0LocaleAdapter` default, `VueI18nLocaleAdapter` under `@vuetify/v0/locale/adapters/vue-i18n` | high |
| Context | `t(key, ...params)` (echoes the key on a miss), `ti(key, ...params)` (returns `undefined` on a miss), `n(value)` (`Intl.NumberFormat`), `register({ id, messages })`, `select(id)`, `selectedId`, `adapter`; fallback without the plugin: `t` returns the key, `ti` returns `undefined`, `n` is `String` | high |
| Interpolation | `{name}` named and `{0}` positional placeholders; `{other.key}` references resolve across the catalog | high |
| House convention | `locale.ti('Quantum.close') ?? 'Close'` so every string has an inline default | high |

### createTokens

| Field | Value | Confidence |
|---|---|---|
| Import | `import { createTokens, createTokensContext, useTokens, flatten } from '@vuetify/v0'`; repo `composables/createTokens/index.ts` | high |
| Signature | `createTokens(tokens: TokenCollection, { flat, prefix, ...RegistryOptions })` -> registry plus `isAlias(token)`, `resolve(token \| TokenAlias)` | high |
| Aliases | `'{colors.primary}'` strings; nested resolution, path walking into object values, circular detection (logger warning), resolution cache invalidated on any mutation; W3C `$value`/`$type`/`$description`/`$extensions`/`$deprecated` objects | high |
| Flattening | Nested collections flatten to dot ids (`colors.blue.500`); `flat: true` keeps one level | high |
| DI | `createTokensContext({ namespace: 'v0:tokens', tokens })`, `useTokens(namespace)` | high |
| Icon roles | `DESIGN_SYSTEMS.md` ruling 6 names `createTokens` as the icon role registry (`{ envelope: '{mail}' }`) | high |

### useTheme, createThemePlugin, V0StyleSheetThemeAdapter

| Field | Value | Confidence |
|---|---|---|
| Import | `import { useTheme, createThemePlugin, createThemeContext, createTheme, V0StyleSheetThemeAdapter, V0UnheadThemeAdapter, ThemeAdapter } from '@vuetify/v0'` (also `@vuetify/v0/theme`, `@vuetify/v0/theme/adapters`); repo `composables/useTheme/` | high |
| Plugin options | `themes: Record<id, { dark?, lazy?, colors }>`, `default`, `system: { light, dark }` (follows `prefers-color-scheme` until an explicit `select`), `palette` (TokenCollection resolvable by alias), `foreground` (APCA `on-*` generation for keys lacking one), `rgb` (emit `R, G, B` channels), `target` (element or selector that receives `data-theme`; default app container, `#app`, then `body`; `null` disables), `adapter`, `persist`, `devtools`, `namespace='v0:theme'` | high |
| Context | `SingleContext` of theme tickets plus `colors` (resolved `Record<id, Colors>`; lazy themes resolve only while selected), `isDark`, `isSystem`, `select(id)`, `reset()`, `cycle(ids?)`, `register({ id, dark, lazy, colors })`, `onboard`, `dispose`, `adapter`, `selectedId`, `selectedItem`, `keys()` | high |
| Alias resolution | Theme colors are flattened with `flat: true` into one `createTokens` with the palette; a color value such as `'{palette.blue.500}'` resolves at read time | high |
| Adapter contract | `ThemeAdapter` abstract: constructor `prefix` (must match `/^[a-zA-Z0-9_-]+$/`), `stylesheetId` (`'v0-theme-stylesheet'`), `rgb`, `generate(colors, isDark)`, abstract `setup(app, context, target)` and `update(colors, isDark)`, optional `dispose` | high |
| generate() output | For each theme: `[data-theme="<id>"] { --<prefix>-<key>: <value>; ... }`; then `:root { color-scheme: dark \| light }` for the selected theme. Keys and theme ids must pass `SAFE_IDENT`; values matching `UNSAFE_CSS` (`url(`, `@import`, `;`, `{`, `}`, `<`, `>`, `\`, `/*`, ...) are dropped | high |
| V0StyleSheetThemeAdapter | `new V0StyleSheetThemeAdapter({ prefix: 'quantum', cspNonce, stylesheetId })`. Browser: writes the generated CSS into a `CSSStyleSheet` added to `document.adoptedStyleSheets` (`replaceSync` on change), sets `data-theme` on the target synchronously, watches `colors`, `isDark`, `selectedId`. Server: pushes `htmlAttrs['data-theme']` and a `<style id>` through a duck-typed `@unhead` head when one is provided | high |
| V0UnheadThemeAdapter | Same output through `@unhead` on both server and client (one patch per change); for SSR or SSG apps | high |
| data-theme | The attribute value is the theme id; a Quantum theme named `quantum-light` yields `[data-theme="quantum-light"]`. The `Theme` component sets the same attribute for a subtree | high |
| Semantic floor | `theme/tokens.ts` `SEMANTIC_COLORS` (20 names: `background`, `divider`, `error`, `info`, `on-background`, `on-error`, `on-info`, `on-primary`, `on-secondary`, `on-success`, `on-surface`, `on-surface-variant`, `on-warning`, `primary`, `secondary`, `success`, `surface`, `surface-tint`, `surface-variant`, `warning`); not exported yet | high |
| Kit bridge | Ruling 1 asks the DS adapter to also emit `--v0-*` aliases for the roles kits read (`surface`, `on-surface`, `surface-tint`, `on-surface-variant`, `primary`, `on-primary`, `pre`, `background`, `on-background`, severities); a subclass can append `--v0-<key>: var(--quantum-<key>)` lines inside `generate()` | high |
| Prebake | `dist/theme.css` for the zero-config path is `adapter.generate(colors, isDark)` run at build time against the default theme (ruling 1); the Emerald pipeline does this (`packages/emerald/SPEC.md` "Pipeline") | moderate |
| Plugin machinery | `createPluginContext(namespace, factory, { setup, fallback, persist, restore, devtools, inspect })` returns `[createXContext, createXPlugin, useX]`; `persist: true` stores through `useStorage` (`v0:storage`); fallback contexts make `useX()` safe without the plugin (theme fallback: empty `colors`, `isDark` false, no-op methods) | high |

### useReducedMotion

| Field | Value | Confidence |
|---|---|---|
| Import | `import { useReducedMotion, createReducedMotionPlugin, V0ReducedMotionAdapter } from '@vuetify/v0'`; repo `composables/useReducedMotion/` | high |
| Plugin | `createReducedMotionPlugin({ mode: 'system' \| 'always' \| 'never', adapter, persist })` | high |
| Context | `selectedMode`, `isReduced`, `select(mode)`, `dispose`, `adapter`; fallback without the plugin: `isReduced` always false | high |
| DOM hook | `V0ReducedMotionAdapter` writes `document.body.dataset.reducedMotion` as `'reduce'` or `'no-preference'` (attribute `data-reduced-motion`); server renders the same attribute through `@unhead` with `'no-preference'` in `system` mode | high |
| CSS | Pair `body[data-reduced-motion="reduce"] .quantum-ripple { animation: none }` with a native `@media (prefers-reduced-motion: reduce)` rule for pre-hydration coverage | high |

### usePopover (+ adapters, plugin)

| Field | Value | Confidence |
|---|---|---|
| Import | `import { usePopover, createPopoverPlugin, createPopoverContext, PopoverAdapter, V0PopoverAdapter, toPlacement } from '@vuetify/v0'` (also `@vuetify/v0/popover`); `FloatingUIPopoverAdapter` from `@vuetify/v0/popover/adapters/floating-ui` (peer `@floating-ui/dom >= 1.8.0`); repo `composables/usePopover/` | high |
| Options | `id`, `positionArea` (default `'bottom'`), `positionTry` (default `'most-width bottom'`), `isOpen` (external ref), `openDelay` 0 ms, `closeDelay` 0 ms, `adapter` | high |
| Return | `isOpen`, `id`, `open()`, `close()`, `toggle()`, `cancel()`, `anchorStyles` (`{ anchorName: '--<id>' }`), `contentAttrs` (`{ id, popover: '' }`), `contentStyles` (adapter output), `positionArea` and `positionTry` (writable), `attach(contentEl)` (wires `showPopover`/`hidePopover` on `isOpen` and syncs back from the native `toggle` event), `attachAnchor(anchorEl)` | high |
| V0PopoverAdapter | CSS anchor positioning: `position: fixed; margin: unset; inset-area; position-area; position-anchor; position-try-fallbacks` | high |
| FloatingUIPopoverAdapter | `computePosition` with `strategy: 'fixed'`, middleware `[offset(8), flip(), shift({ padding: 8 })]` (8 px), `autoUpdate` while open; `positionTry` ignored; one instance may be shared app-wide | high |
| Plugin | `createPopoverPlugin({ adapter })` namespace `'v0:popover'`; resolution order is per-instance `adapter`, then plugin adapter, then `new V0PopoverAdapter()` | high |
| toPlacement | Normalizes `position-area` to `{ side, align, raw }` for JS engines (`'top span-left'` -> top, start) | high |
| Native popover modes | `popover=""` (auto) gives browser light dismiss (outside click and Escape) and top-layer rendering; `popover="manual"` (Combobox) needs `useClickOutside` | high |
| SSR | DOM calls are gated; `useId` supplies the id | high |

### useStack

| Field | Value | Confidence |
|---|---|---|
| Import | `import { useStack, createStack, createStackPlugin, createStackContext } from '@vuetify/v0'`; repo `composables/useStack/index.ts` | high |
| Plugin | `createStackPlugin({ baseZIndex: 2000, increment: 10, default: 'top-layer' \| element, devtools })` | high |
| register() | `register({ id, onDismiss, blocking, scrim, el })` -> ticket with `zIndex` (base plus position times increment), `globalTop`, `dismiss()` (no-op when blocking), `select()`, `unselect()`, `blocking`, `scrim`; auto-unregisters on scope dispose inside a component | high |
| Context | `isActive`, `top`, `scrimZIndex` (top minus 1), `isBlocking`, `topElement` (topmost modal element; non-modal `scrim: false` tickets excluded), `default`, plus the selection surface | high |
| Fallback | `useStack()` without the plugin returns a lazy singleton in the browser and a fresh stack per call on the server | high |

### useFocusTrap

| Field | Value | Confidence |
|---|---|---|
| Import | `import { useFocusTrap, FOCUSABLE, tabbable } from '@vuetify/v0'`; repo `composables/useFocusTrap/` | high |
| Signature | `useFocusTrap(target, { active, initial, restore: true, listen: true, onEscape })` -> `isActive`, `activate()`, `deactivate()`, `onKeydown(event)` | high |
| Behavior | Capture-phase `keydown` on `document`; wraps Tab and Shift+Tab at the edges; recovers focus that escaped; focuses the first tabbable descendant (or `initial`, or the root when it has `tabindex="-1"`) on activate; restores the previous element on deactivate unless focus already moved outside; nested traps resolve through a module stack (last connected trap owns Tab; last connected trap with `onEscape` owns Escape); `onEscape` never closes anything by itself | high |
| When | Only for overlays that are not a native `<dialog>` opened with `showModal()` (drawers rendered as `div`, bottom sheets, command palettes) | high |

### useRovingFocus

| Field | Value | Confidence |
|---|---|---|
| Import | `import { useRovingFocus } from '@vuetify/v0'`; repo `composables/useRovingFocus/index.ts` | high |
| Signature | `useRovingFocus(() => items, { target, orientation: 'horizontal' \| 'vertical' \| 'both', circular, columns, onFocus })`; items are `{ id, disabled?, el? }` | high |
| Return | `focusedId`, `isTabbable(id)` (focused item, else the first enabled item), `focus(id)`, `next()`, `prev()`, `first()`, `last()`, `onKeydown(e)` | high |
| Grid | `columns` turns Arrow keys into row-major 2D movement with Home/End row-scoped and Ctrl plus Home/End overall; use it for a calendar grid | high |
| Events | Attaches `keydown` only when `target` is passed (through `useEventListener`); otherwise the component calls `onKeydown` | high |
| Consumers in v0 | `Menu.Content`, `Menu.Bar`, `Treeview`; `Tabs` implements roving inline | high |

### usePresence, useDelay, useTimer

| Field | Value | Confidence |
|---|---|---|
| useTimer | `useTimer(handler, { duration: 1000 ms, repeat: false })` -> `start()`, `stop()`, `pause()`, `resume()`, `remaining` (updated every 100 ms in the browser), `isActive`, `isPaused`; `duration` is `MaybeRefOrGetter` read on each `start()` | high |
| useDelay | `useDelay(callback?, { openDelay, closeDelay })` -> `start(isOpening, { minDelay })` returning `Promise<boolean>`, `stop()`, `pause()`, `resume()`, `isActive`, `isPaused`, `remaining`, `isOpening`; a zero delay fires synchronously | high |
| usePresence | See the Presence entry | high |

### useEventListener, useClickOutside, useResizeObserver

| Field | Value | Confidence |
|---|---|---|
| useEventListener | `useEventListener(target, event \| events[], listener \| listeners[], options)` -> cleanup; reactive target, events and listeners (`flush: 'post'`); `useWindowEventListener` and `useDocumentEventListener` are SSR no-ops | high |
| useClickOutside | `useClickOutside(target \| targets[], handler, { capture: true, touchScrollThreshold: 30 px, detectIframe, ignore: [refs or selectors], bounds })` -> `isActive`, `isPaused`, `pause()`, `resume()`, `stop()`; two-phase `pointerdown` then `pointerup` on `document` in the capture phase; `bounds: true` for native `<dialog>` backdrop clicks | high |
| useResizeObserver | `useResizeObserver(target, callback, { immediate, once, box })` -> `isActive`, `isPaused`, `pause()`, `resume()`, `stop()`; entries carry `contentRect`, `borderBoxSize`, `contentBoxSize`; `useElementSize(target)` -> `width`, `height` | high |

### useHotkey, useTypeahead

| Field | Value | Confidence |
|---|---|---|
| useHotkey | `useHotkey(keys, callback, { event: 'keydown', inputs: false, preventDefault: true, stopPropagation: false, sequenceTimeout: 1000 ms })` -> `isActive`, `isPaused`, `pause()`, `resume()`, `stop()`; combos `ctrl+k`, sequences `g-h`; `cmd` maps to `meta` on Apple platforms and `ctrl` elsewhere; skipped while a text input, textarea, contenteditable or `role=textbox/searchbox/combobox/spinbutton` has focus unless `inputs: true`; window listener | high |
| useTypeahead | `useTypeahead(() => items, { text, duration: 1000 ms })` -> `typeahead(char)` returning `{ item, index } \| undefined`, `reset()`; case-insensitive prefix match, repeated letter cycles; pure (no DOM, no selection) | high |

### createDatePicker and createTimePicker

| Field | Value | Confidence |
|---|---|---|
| Export status | Not implemented. Neither name appears in `composables/index.ts`; no `composables/createDatePicker/` or `createTimePicker/` directory exists; no docs page or example exists; `git log --all -S createDatePicker` finds no implementation commit | high |
| maturity.json | `createDatePicker` and `createTimePicker`: `level: "draft"`, `category: "forms"`, description only, no `since`. Components `DatePicker`, `DateRangePicker`, `TimePicker`: `draft`, no description | high |
| Skill text | `SKILL.md` lists both as `(draft)` and lists the picker components under "Planned (not yet exported, do not import)" | high |
| Full API | Not found (no source) | high |
| Nearest code | Emerald incubates `createCalendar` privately at `packages/emerald/src/components/EmCalendar/calendar.ts` (not exported from any barrel): options `month`, `min`, `max`, `disabled`, `firstDayOfWeek`, `fixedWeeks`; context `months` (`CalendarMonth[]` of `weeks: CalendarCell[][]`, cells `{ iso, day, disabled, today, outside }`), `weekdays`, `label`, `anchor`, `focused`, `isFirst`, `isLast`, `first`, `last`, `next`, `prev`, `step`, `goto`, `today`, `move(unit, amount)`; no selection state. Bootstrap's `BDatepicker` is explicitly blocked on `createDatePicker` | high |
| Date engine | `useDate` requires `createDatePlugin` with an adapter (`V0DateAdapter` bundled); calling it without the plugin throws | moderate |

## Mapping table: MD1 component to v0 primitive

MD1 component pages in the 2018-12-25 snapshot index (`guidelines/components/`): bottom-navigation, bottom-sheets, buttons, buttons-floating-action-button, cards, chips, data-tables, dialogs, dividers, expansion-panels, grid-lists, lists, lists-controls, menus, pickers, progress-activity, selection-controls, sliders, snackbars-toasts, steppers, subheaders, tabs, text-fields, toolbars, tooltips, widgets. Pattern pages relevant here: `patterns/navigation-drawer.html`, `patterns/search.html`. "Widgets" is an Android launcher concept and has no web component.

| MD1 component | v0 primitive(s) | Pattern | Reasoning | Confidence |
|---|---|---|---|---|
| Bottom navigation | `createSingle` (or `Single.Root` plus `Single.Item`) wrapping `Button.Root` destinations inside a `<nav>`; `aria-current="page"` on the selected item | compound (`QuBottomNavigation`, `QuBottomNavigation.Action`) | Single-choice navigation of 3 to 5 destinations; `Tabs` would impose `role="tab"` and panel semantics the spec does not have. Emerald `EmList` uses the same `Single` plus `aria-current` shape | high |
| Bottom sheet (modal) | `Dialog.Root`, `Dialog.Content` (native `<dialog>` positioned at the bottom edge), `Dialog.Close` | compound | Modal behavior, Escape, focus containment and stacking come from the native dialog; only the edge placement is CSS | high |
| Bottom sheet (persistent) | `Portal` (`scrim: false`) plus `useStack`; `Collapsible` for the expand/collapse state | DS-owned headless | A persistent sheet is non-modal and co-exists with page content; v0 has no sheet compound | high |
| Button (flat, raised) | `Button.Root` plus `Button.Content` | shell | Direct wrap; MD1 has no loading state, so do not expose `loading` (ruling 7 exclusivity). Emerald `EmButton` precedent | high |
| FAB | `Button.Root` plus `Button.Icon` (`ariaLabel` required; `isSolo` is detected automatically) | shell | An icon-only button; mini and extended variants are `data-*` driven CSS. The FAB speed-dial fly-out maps to `Menu.Root` with `positionArea` above the activator, pending the spec page | high (speed dial: low) |
| Icon toggle | `Toggle.Root` plus `Toggle.Indicator` | shell | `aria-pressed` on/off state is exactly `Toggle`; `data-state="on"` drives the icon swap | high |
| Card | `Atom` (semantic `article`/`section`), `Button.Root` for actions | presentational compound (`QuCard`, `.Media`, `.Title`, `.Supporting`, `.Actions`) | No behavior to compose; Emerald `EmCard` is `Atom` only | high |
| Chip (display, deletable) | `Atom` for the chip; `Button.Root` plus `Button.Icon` for the delete affordance | presentational | A chip is static text with an optional remove button | high |
| Chip sets (selectable) | `createSelection` (`multiple`) or `Selection.Root` plus `Selection.Item`; `Toggle.Group` when the chip is pressed-state | compound | Bootstrap `BChips` is built on `createSelection`; expose only if the pinned spec page documents selectable chips | moderate |
| Data table | `DataTable.*`, `Checkbox.Root` in row cells for selection, `Button.Root` on `DataTable.Column` for sort, `Pagination.*` or `createPagination` for the footer, `Menu.*` for row actions | compound | Sorting, filtering, selection, pagination and ARIA grid semantics are all in `createDataTable`; the DS adds table chrome only | high |
| Dialog: alert | `AlertDialog.*` (`Cancel`, `Action` with deferred `wait()`/`close()`) | compound | `role="alertdialog"`, Escape and outside-click blocked by default, cancel focused on open | high |
| Dialog: simple (list) | `Dialog.*` plus `Single.Root`/`Single.Item` (or `Menu`-free list buttons) for the choices | compound | A simple dialog is a list of actions that closes on choice; `Dialog.Close` wraps each choice or the choice calls `close` from the Root slot | high |
| Dialog: confirmation | `Dialog.*` plus `Radio.Group` (or `Checkbox.Group`) plus `Dialog.Close` for Cancel and a confirming `Button.Root` | compound | Selection persists until OK; v0 radio and checkbox groups carry the state | high |
| Dialog: full-screen | `Dialog.*` with `Dialog.Content` styled to the viewport and `Dialog.Close` in its app bar | compound | Same primitive; only layout differs | high |
| Divider | `Atom as="hr"` (or `role="separator"` on a `div`); `Menu.Separator` inside menus | presentational | Emerald `EmDivider` precedent; inset variants are `data-inset` CSS | high |
| Expansion panel | `ExpansionPanel.Group` (`multiple` false for accordion), `Root`, `Header`, `Activator`, `Cue`, `Content` | compound | One-to-one with the v0 anatomy; MD1 header actions are DS children of `Header` | high |
| Grid list | `Atom` (`ul`/`li`), `Button.Root` for tile actions; optional `useRovingFocus({ columns })` | presentational compound (`QuGridList`, `.Tile`, `.Bar`) | Layout only; keyboard grid navigation is optional and DS-owned if added | high |
| List | `Atom` (`ul`/`li`) for static lists; `Single.Root`/`Single.Item` for single-select (`aria-current`); `Selection.Root`/`Selection.Item` for multi-select; `createNested` or `Treeview` for nested lists | compound (`QuList`, `.Item`, `.Avatar`, `.Icon`, `.Content`, `.Primary`, `.Secondary`, `.Action`, `.Group`) | Emerald `EmList` precedent (`Single` plus `ul`/`li`/`button`); `role="option"` from the Item attrs belongs only inside a real listbox, so bind state, not `attrs` | high (nested: moderate) |
| List controls | `Checkbox.Root`, `Switch.Root`, `Radio.Root` (inside a `Radio.Group`), `Collapsible.*` for expand/collapse, `Menu.*` for overflow | compound | Each control is its own primitive placed in `QuList.Action` (a part, not a slot) | high |
| Menu (simple) | `Menu.Root`, `Menu.Activator`, `Menu.Content`, `Menu.Item`, `Menu.Separator`; `Menu.CheckboxItem` and `Menu.RadioGroup` for stateful items | compound | Full APG menu button behavior, typeahead, focus restore and anchor positioning are built in | high |
| Menu (cascading) | `Menu.Sub`, `Menu.SubActivator`, `Menu.SubContent` inside `Menu.Content` | compound | Submenus open on pointer rest after `openDelay` (100 ms) and on ArrowRight; never nest a second `Menu.Root` | high |
| Context menu, menubar | `Menu.Context`, `Menu.Bar` | compound | Both exist in v0; include only if the pinned spec page lists them | high |
| Date picker | None in v0 (`createDatePicker` is a draft placeholder). Build on `useRovingFocus({ columns: 7 })` for the grid (`orientation` is ignored when `columns` is set), `Dialog.*` for the modal shell, `Button.Root` for month navigation, `useDate` plus `createDatePlugin` for locale formatting, and a DS-private calendar core modeled on Emerald's `createCalendar` (copy the approach, not the file) | DS-owned headless | Spec-in with no v0 primitive still ships (Emerald `EmCalendar` precedent); flag for graduation to v0 once a second consumer exists | high |
| Time picker | None in v0 (`createTimePicker` is a draft placeholder). Build on `Dialog.*`, `Radio.Group mandatory="force"` plus `Radio.Root` for AM/PM and for the clock face numbers (`radiogroup` / `radio` with roving tabindex and wrapping arrow keys built in; `Toggle.Group` renders `role="group"` with `aria-pressed` and binds no keyboard navigation, and an extra `useRovingFocus` would double-handle the keys), `Toggle.Group` for the hour/minute view switch, `createNumeric`/`createNumberField` for the typed hour and minute fields; the clock geometry is DS code | DS-owned headless | Same reasoning as the date picker; `createNumberField` not read in this pass | high (number field: moderate) |
| Linear progress | `Progress.Root`, `Progress.Track`, `Progress.Fill`; `Progress.Buffer` for the buffer variant; indeterminate when no value; query variant is the indeterminate animation reversed in CSS | shell | Every MD1 linear type maps to a Progress part or a `data-state` | high |
| Circular progress | `Progress.Root` only (`role="progressbar"`, `percent` slot prop) with a DS-drawn SVG arc; `data-state="indeterminate"` drives the spinner keyframes | shell | Track and Fill are width-based; the arc needs the percent, not a width | high |
| Checkbox | `Checkbox.Root`, `Checkbox.Indicator`; `Checkbox.Group` and `Checkbox.SelectAll` for parent/child tri-state | shell | Direct wrap; the visible label is a native `<label>` | high |
| Radio button | `Radio.Group`, `Radio.Root`, `Radio.Indicator` | compound (group) with shell items | `Radio.Root` cannot stand alone; the group owns name, activation and roving focus | high |
| Switch | `Switch.Root`, `Switch.Track`, `Switch.Thumb` | shell | Direct wrap; note the hard-coded `dir="ltr"` on Track when styling RTL | high |
| Slider (continuous, discrete) | `Slider.Root`, `Slider.Track`, `Slider.Range`, `Slider.Thumb` | shell | Step snapping and keyboard are built in; the discrete value label binds the Thumb `value` slot prop | high |
| Snackbar, toast | `Snackbar.Portal`, `Snackbar.Queue` (with `createNotificationsPlugin`), `Snackbar.Root`, `Snackbar.Content`, `Snackbar.Close`; the MD1 action is a `Button.Root` inside `Root`; `Presence` for the enter and exit animation | compound | Queueing, auto-dismiss (3000 ms default), pause on hover and focus, live-region announcement are all provided | high |
| Stepper | `Step.Root`, `Step.Item` for the sequence; `Button.Root` for Continue and Back; `Collapsible` for vertical step content | compound | `createStep` gives bounded next/prev with disabled skipping; render `<ol>`/`<li>` with `aria-current="step"` and ignore the Item `attrs` (`role="tab"` is wrong here) | high |
| Subheader | `Atom` (`h6` or `li` with `role="presentation"` in lists) | presentational | Text only | high |
| Tabs (fixed, scrollable, icon) | `Tabs.Root`, `Tabs.List`, `Tabs.Item`, `Tabs.Panel`; `createOverflow` optional for scroll arrows | compound | Full tab semantics and roving focus are built in; scrollable is CSS plus optional overflow measurement (`createOverflow` not read) | high (overflow: moderate) |
| Text field | `Input.Root`, `Input.Control`, `Input.Description` (helper text), `Input.Error`; native `<label :for>` for the floating label; `data-dirty` and `data-focused` drive the float | shell | Emerald `EmTextField` precedent; character counter is DS text bound to the Root `value` slot prop | high |
| Textarea (multi-line) | Same with `Input.Control as="textarea"` | shell | Emerald `EmTextarea` precedent | high |
| Autocomplete | `Combobox.*` | compound | Query, filtering, virtual focus, listbox ARIA and hidden inputs are provided | high |
| Toolbar, app bar | `Atom` (`header`, `div role="toolbar"` for the action strip), `Button.Root` plus `Button.Icon` for actions, `Menu.*` for the overflow menu, `createOverflow` for responsive action collapse | presentational compound (`QuToolbar`, `.Title`, `.Actions`) | No behavioral primitive; scroll behaviors (hide on scroll) are DS code on `useEventListener` | high |
| Tooltip | `Tooltip.Root`, `Tooltip.Activator`, `Tooltip.Content` plus `createTooltipPlugin` for region delays | compound | Delays, skip window, focus-visible opening and anchor positioning are provided; touch long-press is not (DS-owned if the spec requires it) | high |
| Navigation drawer (temporary) | `Dialog.Root`, `Dialog.Content` (native `<dialog>` positioned at the start edge), `Dialog.Close` | compound | Bootstrap `BDrawer` precedent (`Dialog` plus `createContext`); modal semantics, Escape and containment come free | high |
| Navigation drawer (persistent, mini, permanent) | `Atom` (`nav`/`aside`), `Collapsible` or `Single` for nested sections, `useResizeObserver` or `useBreakpoints` for the responsive switch | DS-owned headless | Non-modal variants have no overlay and no v0 compound; swipe-to-open is DS pointer handling | high |
| Search bar | `Input.Root` plus `Input.Control type="search"` inside the toolbar (`role="search"` on the wrapping form); `Combobox.*` for suggestions | shell | Spec pattern page, not a component page; composition of existing primitives | high |
| Ink ripple (press feedback) | None in v0 (no `ripple` anywhere in `packages/0/src`). DS-owned `useRipple`-style helper: state in a composable, the `Qu*` component binds `pointerdown`/`pointerup`/`keydown` through `useEventListener`; gate on `useReducedMotion().isReduced` and `body[data-reduced-motion="reduce"]` | DS-owned headless | The house rule forbids a composable attaching DOM events except through the listener primitives; a CSS-only `:active` pseudo-element ripple is the fallback | high |
| Theme plugin | `createThemePlugin({ themes, default, system, foreground })` with `QuantumStyleSheetAdapter extends V0StyleSheetThemeAdapter` constructed with `prefix: 'quantum'`; `Theme` for scoped dark subtrees; `createTokens` for icon roles; `createReducedMotionPlugin` composed by `createQuantumPlugin()` | plugin (ruling 1) | Emerald pipeline precedent: `theme.ts`, `adapter.ts`, `plugin.ts`, prebaked `dist/theme.css` | high |

## Handlers v0 already binds (do not double-handle)

The house rule `feedback_events_in_components`: composables never attach DOM handlers; components do. A `Qu*` wrapper that re-binds any handler below causes double toggles, double opens or double submits. Consumer listeners passed as attrs chain after the part's own handler (`mergeProps`), which is safe for side effects but not for state changes.

| Part | Bound handlers | Do not add |
|---|---|---|
| `Button.Root` | group mode: `click` (toggle ticket); non-button host: `keydown` Enter/Space | A second group toggle; a `keydown` polyfill on a native button |
| `Toggle.Root` | `click` (toggle); non-button host: `keydown` | Any toggle logic |
| `Dialog.Activator`, `AlertDialog.Activator` | `click` (open); non-button host: `keydown` | Open logic |
| `Dialog.Close`, `AlertDialog.Close`, `AlertDialog.Cancel` | `click` (close) | Close logic |
| `AlertDialog.Action` | `click` (emit `action`, close unless `wait()`) | Closing after the action handler |
| `Dialog.Content`, `AlertDialog.Content` | native `cancel` and `close`; outside click when `closeOnClickOutside` | Escape handling, `useFocusTrap`, click-outside |
| `Popover.Activator` | none (native `popovertarget`); non-button host: `keydown` | A click toggle (it would fight the native toggle) |
| `Popover.Content` | native `toggle` sync (`usePopover.attach`), `beforetoggle` emit | Manual `showPopover()` calls |
| `Tooltip.Activator` | `pointerenter`, `pointerleave`, `focus`, `blur`, `click`, `keydown` | Hover or focus handling |
| `Tooltip.Content` | `pointerenter`, `pointerleave` (interactive), `keydown` | Hover handling |
| `Menu.Activator` | `click`, `keydown`, `pointerenter`, `pointerleave`, `focus` | Any open logic |
| `Menu.Content`, `Menu.SubContent` | `keydown` (full menu keyboard model), `pointerenter`, `pointerleave` | Arrow, Escape, Tab or typeahead handling |
| `Menu.Item`, `Menu.CheckboxItem`, `Menu.RadioItem`, `Menu.SubActivator` | `click`, `pointerenter`, `pointerleave`, `focus` | Activation or hover focus |
| `Menu.Context` | `contextmenu` | Right-click handling |
| `Menu.Bar` | `keydown` | Arrow handling |
| `Tabs.Item` | `click`, `keydown`, `focus` | Selection or arrow handling |
| `ExpansionPanel.Activator`, `Collapsible.Activator` | `click`; non-button host: `keydown` | Toggle logic |
| `Checkbox.Root`, `Checkbox.SelectAll`, `Switch.Root`, `Switch.SelectAll` | `click`, `keydown` Space | Toggle logic |
| `Radio.Root` | `click`, `keydown` (Space, Enter, arrows) | Select or arrow logic |
| `Slider.Thumb` | `pointerdown`, `keydown` | Drag start, keyboard stepping |
| `Slider.Track` | `pointerdown` | Click-to-position |
| `Slider.Root` | document `pointermove`, `pointerup` during a drag | Drag tracking |
| `Input.Control` | `input`, `focus`, `blur` | Model writes, focus tracking, blur validation |
| `Combobox.Control` | `input`, `focus`, `blur`, `keydown` | Query writes, open on focus, commit on blur, keyboard model |
| `Combobox.Item` | `click`, `pointerdown` (`preventDefault`) | Selection |
| `Combobox.Cue` | `click`, `pointerdown` | Toggle |
| `Combobox.Content` | click outside (commit and close) | Outside-click handling |
| `Select.Activator` | `click`, `keydown` (typeahead, open, navigate, select, close) | Any keyboard or click logic |
| `Select.Item` | `click` | Selection |
| `Form` | `submit`, `reset` (both `preventDefault`) | Native submit handling; use the `submit` event payload |
| `Snackbar.Close` | `click`; non-button host: `keydown` | Dismiss logic |
| `Snackbar.Queue` | `mouseenter`, `mouseleave`, `focusin`, `focusout` | Pause and resume |
| `DataTable.Row` | `click` when `selectable` | Row selection toggling |
| `Scrim` | `click` (dismiss unless blocking) | Backdrop click handling |
| `Step.Item`, `Single.Item`, `Selection.Item`, `Group.Item`, `Pagination.Item` | `onClick` and `onKeydown` inside `attrs`; active only where the consumer binds `attrs` | A second handler on the same element that binds `attrs` |

Composables that do bind listeners (allowed by the rule): `useEventListener`, `useHotkey` (window `keydown`/`keyup`), `useClickOutside` (document `pointerdown`/`pointerup`, window `blur`), `useMediaQuery`, `useRovingFocus` and `useVirtualFocus` (only when `target` is passed), `usePopover` (content `toggle` event), `useFocusTrap` (document capture `keydown` unless `listen: false`).

## Gaps and not-found

| Item | Status | Confidence |
|---|---|---|
| `createDatePicker`, `createTimePicker` | Draft placeholders in `maturity.json` only; no source, no export, no docs. Full API: not found | high |
| Ink ripple | No v0 primitive; DS-owned | high |
| Drawer, bottom sheet, toolbar, app bar, card, chip, list, grid list, subheader, divider, FAB, bottom navigation | No dedicated v0 compound; mapped to `Atom`, `Dialog`, `Portal`, `Single`, `Selection`, `Button` above | high |
| `createOverflow`, `createNumberField`, `createNumeric`, `createNested`, `Treeview`, `Pagination` internals, `useNotifications` beyond `timeout`, `createCombobox` body, `createGroup` file, `useDate` | Named in the mapping table but not read in this pass; treat their option names as moderate until read | moderate |
| MD1 spec pages | Only the guidelines index was fetched; per-component pages (buttons, menus, pickers, ...) were not read here. The mapping rows for speed dial, selectable chips, context menu and menubar are therefore conditional on those pages | high |
| Vuetify 1.5 stylus | Not consulted for this note | high |
| Visual metrics (sizes, elevations, durations) | Out of scope for this note; `not found` here by design | high |
