# Switch Component Design

## Summary

Headless Switch component for `@vuetify/v0`. Separate component tree from Checkbox, shared composable layer (`createGroup`). Adds `Switch.Thumb` and `Switch.Track` sub-components for structured switch markup.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Grouping | Yes | Support multi-value groups like Checkbox |
| Tri-state | Yes | Mixed state for partial group selection |
| Architecture | Separate component, shared composable | Independent SFCs, both use `createGroup` |
| Base element | `<button>` | Semantic, focusable, keyboard-activatable |
| Sub-components | Thumb + Track | Structured mounting points for switch styling |

## File Structure

```
packages/0/src/components/Switch/
  SwitchRoot.vue
  SwitchGroup.vue
  SwitchThumb.vue
  SwitchTrack.vue
  SwitchHiddenInput.vue
  SwitchSelectAll.vue
  index.ts
  index.test.ts
```

## Components

### Switch.Root

Dual-mode: standalone boolean `v-model` or group member (try/catch inject for group context).

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `ID` | `useId()` | Element ID |
| `label` | `string` | — | Accessible label |
| `value` | `V` | — | Value when in group |
| `name` | `string` | — | Form field name (auto-renders HiddenInput) |
| `form` | `string` | — | Associated form ID |
| `disabled` | `MaybeRef<boolean>` | `false` | Disabled state |
| `indeterminate` | `MaybeRef<boolean>` | `false` | Mixed/indeterminate state |
| `namespace` | `string` | `'v0:switch:root'` | Context namespace |
| `groupNamespace` | `string` | `'v0:switch:group'` | Group context namespace |
| `ariaLabelledby` | `string` | — | aria-labelledby |
| `ariaDescribedby` | `string` | — | aria-describedby |
| `ariaInvalid` | `boolean` | — | aria-invalid |
| `as` | `DOMElement \| null` | `'button'` | Rendered element |
| `renderless` | `boolean` | `false` | Renderless mode |

**Model:** `defineModel<boolean>()` (standalone mode)

**Slot Props (`SwitchRootSlotProps<V>`):**

```ts
id, label, value, isChecked, isMixed, isDisabled
select(), unselect(), toggle(), mix(), unmix()
attrs: {
  type, role: 'switch', aria-checked, aria-disabled,
  aria-label, aria-labelledby, aria-describedby, aria-invalid,
  tabindex, data-state, data-disabled
}
```

**ARIA:**
- `role="switch"`
- `aria-checked`: `true | false | "mixed"`
- `data-state`: `'checked' | 'unchecked' | 'indeterminate'`

**Keyboard:** Space → `toggle()`, Click → `toggle()`

### Switch.Group

Multi-value container built on `createGroup`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `namespace` | `string` | `'v0:switch:group'` | Context namespace |
| `disabled` | `MaybeRef<boolean>` | `false` | Disable all children |
| `enroll` | `boolean` | — | Auto-enroll items |
| `mandatory` | `false \| true \| 'force'` | `false` | Selection enforcement |
| `label` | `string` | — | Group label |
| `ariaLabelledby` | `string` | — | aria-labelledby |
| `ariaDescribedby` | `string` | — | aria-describedby |

**Model:** `defineModel<T | T[]>()`

**Slot Props:** Group state + `selectAll()`, `unselectAll()`, `toggleAll()`

**ARIA:** `role="group"`

### Switch.Thumb

Sliding knob indicator. Injects `SwitchRootContext`.

- Default element: `<span>`
- Hidden via `visibility: hidden` when unchecked and not mixed
- Exposes `data-state` for CSS transitions/animations

### Switch.Track

Track/rail behind the thumb. Injects `SwitchRootContext`.

- Default element: `<span>`
- Always visible
- Exposes `data-state` for CSS styling (e.g., track color)

### Switch.HiddenInput

Visually hidden `<input type="checkbox">` for form submission.

- `position: absolute; width: 1px` with `inert` and `tabindex="-1"`
- Auto-rendered when `name` prop is set on Root
- Serializes object values to JSON

### Switch.SelectAll

Aggregate toggle for groups. Does not register as a group item.

- Reads group state: `isAllSelected`, `isMixed`
- Calls `toggleAll()` on click
- Provides its own `SwitchRootContext` so Thumb/Track can nest inside

## Context

Two independent contexts via `createContext`:

- **`SwitchRootContext`** — provided by Root, consumed by Thumb, Track, HiddenInput
- **`SwitchGroupContext`** — provided by Group, consumed by Root

Completely separate from Checkbox contexts (different namespaces).

## Usage

```vue
<!-- Standalone -->
<Switch.Root v-model="darkMode" label="Dark mode">
  <Switch.Track>
    <Switch.Thumb />
  </Switch.Track>
</Switch.Root>

<!-- Grouped -->
<Switch.Group v-model="features" label="Features">
  <Switch.Root value="notifications" label="Notifications">
    <Switch.Track><Switch.Thumb /></Switch.Track>
  </Switch.Root>
  <Switch.Root value="sounds" label="Sounds">
    <Switch.Track><Switch.Thumb /></Switch.Track>
  </Switch.Root>
  <Switch.SelectAll label="Toggle all">
    <Switch.Track><Switch.Thumb /></Switch.Track>
  </Switch.SelectAll>
</Switch.Group>
```
