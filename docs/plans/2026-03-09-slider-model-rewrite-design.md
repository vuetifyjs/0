# createSlider Model Rewrite

Rewrite `createSlider` to use `createModel` as its proper baseline. Each thumb becomes a model ticket with a `ref(number)` value. The model's `selectedValues` (with ref unwrapping) produces the composite output — no custom `values` ref or array overrides needed.

## Decisions

- **Range mode**: config option `{ range: true }` on `createSlider`, not a separate composable
- **Thumb registration**: each `SliderThumb` self-registers via `model.register()` on mount
- **Apply strategy**: snap + constrain incoming values, then write to ticket refs
- **enroll**: use createModel's default (`true`) — thumbs are selected on registration

## Data Flow

```
v-model=[25, 75]
  → useProxyModel → slider.apply([25, 75])
  → apply snaps/constrains → writes to ticket.value refs
  → model.selectedValues recomputes → Set{25, 75}
  → slider.values computed → [25, 75] (ordered by ticket index)
  → components read slider.values[thumbIndex]
```

## createSlider

- Calls `createModel()` (enroll defaults true)
- `range: true` determines whether 1 or 2 tickets are pre-registered
- `values`: `ComputedRef<number[]>` derived from `selectedItems`, ordered by ticket index, mapped via `toValue(ticket.value)`
- Override `apply`: snap + constrain incoming values, write to each ticket's ref by index
- Math functions unchanged: `snap`, `percent`, `fromPercent`, `setValue`, `stepUp`, `stepDown`, `setToMin`, `setToMax`
- `setValue(index, value)` writes directly to the ticket's ref at that index

## Thumb Registration

- Each `SliderThumb` calls `model.register({ value: ref(initialValue) })` on mount
- Thumb gets back a ticket with `isSelected` (always true via enroll), `id`, `index`
- Thumb reads its value from its own ticket ref

## SliderContext Changes

- Remove standalone `values: Ref<number[]>` — replace with `values: ComputedRef<number[]>` derived from model
- Remove `selectedValues` override — model's version works
- Remove `multiple` override — not needed
- Keep all math functions, disabled, readonly, orientation, inverted, constraints

## Component Impact

- **Root**: stops managing a separate thumbs array, provides slider context
- **Thumb**: self-registers with model, reads own ticket ref
- **Track/Range/HiddenInput**: read `slider.values` same as before — no change in consumption
