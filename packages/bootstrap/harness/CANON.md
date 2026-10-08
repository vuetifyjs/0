# @paper/bootstrap — Implementation Canon

Binding for every component that lands in this package. Per-component amendments
are added under the component's heading when that component is written. Do not
port Bulma class names (`is-active`, `is-primary`) or Bootstrap 5 names
(`modal`, `offcanvas`, `dropdown`, `col-md-6`).

## Imports, files, style

- Import ONLY from `@vuetify/v0`. Never `#v0/*` in package source. The `#v0`
  alias exists for tooling parity.
- Layout: `src/components/BThing/BThing.vue` + `src/components/BThing/index.ts`.
  Append one alphabetically placed line to `src/components/index.ts`.
- Dual-script SFC. `defineOptions({ name: 'BThing' })`. Destructured props, no
  `withDefaults`. `defineModel` plus an explicit kebab `defineEmits`. `toRef`
  for slot props. No `<style>` block.
- Flat components, composed in userland the way Bootstrap nests elements.
  Region parts are flat too (`BDialogHeader`). The current family contract also
  allows attaching a part to the parent export (`BDialog.Header`); the flat
  name stays valid.
- Reach for the v0 primitive named in SPEC.md. Dialog, Popover, Tooltip,
  Button, Tabs, Collapsible, `usePopover`, `createInput`, `createCombobox`,
  `createSlider`, `createOtp`, `createOverflow`, `createQueue`. Do not wrap
  `bootstrap.js`.

## Prop → class

| Prop | Class |
|---|---|
| `theme` | `theme-{theme}` |
| `variant` (buttons) | `btn-{variant}` (`solid` / `outline` / `subtle` / `text`) |
| `size` | `btn-xs` / `btn-sm` / `btn-lg`, `dialog-sm` / `dialog-lg` / `dialog-xl` |
| `show` | **forbidden as a prop** — `v-model` / v0 state only |
| open state | `.show` or native `open` / `showModal()` |

Undefined prop ⇒ no class. A user `class` always merges. State classes are
owned by the component and driven only by v0 state.

## v-model

Plain `v-model`. Open/closed boolean on Dialog, Drawer, Menu, Collapse, Alert,
Toast. No `data-bs-toggle` as behavior.

## Slots

No named slots. The default slot is the content region. Every region Bootstrap
names with a part element is a part component. Parts that need parent state
inject it. Package context is optional and warns in dev when missing. Parts
backed by a v0 context throw.

## Rendering

Element tags match the pinned fixture. `BDialog` is a native `<dialog>`. Do not
copy `BuModal`'s `div.modal`. Do not set the native `popover` attribute on
`BMenu` — it top-layers the menu and fights Bootstrap's CSS. Toggle `.show`
(or `open`) and let Bootstrap's `@starting-style` animate. Do not add a
`.collapsing` class.

## Harness

`conform()` from `harness/conform.ts`. Fixtures are verbatim markup from the
SHA in `PIN.md`, one or more blocks per file, each introduced by
`<!-- fixture: <label> -->`. Tests address blocks by label.

1. Tag structure and class sets match the fixture on component-owned elements.
2. Additions of `aria-*`, `data-*`, `role`, `tabindex`, and `id` are tolerated.
   Any other extra attribute needs an explicit `ignoreAttrs` entry.
3. Colon utility classes (`md:d-none`) are real class tokens. Do not escape
   them.
