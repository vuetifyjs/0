# Slider Component Design

## Overview

Headless slider component for @vuetify/v0. Provides single and range value selection on a numeric track with full keyboard and pointer interaction support.

## Use Cases

**Direct consumers**: Slider, RangeSlider, ColorPicker hue track, ColorPicker alpha track

**Future consumers**: Gradient editor (N color stops), media scrubber/timeline, before/after image comparison, knob/dial control

## Composable: `createSlider`

Full slider state manager at `packages/0/src/composables/createSlider/index.ts`.

### Options

```ts
interface SliderOptions {
  min?: number                                    // default: 0
  max?: number                                    // default: 100
  step?: number                                   // default: 1
  disabled?: MaybeRef<boolean>
  orientation?: MaybeRef<'horizontal' | 'vertical'>
  minStepsBetweenThumbs?: number                  // default: 0
}
```

### Returned Context

```ts
interface SliderContext {
  values: Ref<number[]>
  min: number
  max: number
  step: number
  disabled: Ref<boolean>
  orientation: Ref<'horizontal' | 'vertical'>

  // Value math (pure)
  snap: (value: number) => number
  percent: (value: number) => number
  fromPercent: (percent: number) => number

  // Thumb operations (by index)
  setValue: (index: number, value: number) => void
  stepUp: (index: number, multiplier?: number) => void
  stepDown: (index: number, multiplier?: number) => void
  setToMin: (index: number) => void
  setToMax: (index: number) => void
}
```

### Value Model

Always `number[]`. Single thumb = `[50]`, range = `[25, 75]`, gradient = `[10, 30, 60, 90]`.

`setValue` enforces constraints: clamps to min/max, snaps to nearest step, maintains minimum distance between adjacent thumbs.

## Component Architecture

```
Slider.Root          ← createSlider + v-model + context provider
├── Slider.Track     ← track element, handles click-to-position
│   └── Slider.Range ← filled portion between thumbs
├── Slider.Thumb     ← draggable handle, one per value (auto-indexed)
└── Slider.HiddenInput ← hidden <input> for form submission
```

### Root Props

```ts
interface SliderRootProps {
  as?: string | Component     // default: 'div'
  renderless?: boolean
  id?: string
  min?: number                // default: 0
  max?: number                // default: 100
  step?: number               // default: 1
  disabled?: boolean
  orientation?: 'horizontal' | 'vertical'
  inverted?: boolean
  minStepsBetweenThumbs?: number
  name?: string               // triggers hidden inputs
  form?: string
}
```

### Slot Props

**Root**: `{ id, values, min, max, disabled, orientation, attrs }`

**Thumb**: `{ index, value, percent, isDragging, attrs }` where attrs includes `role="slider"`, `aria-valuenow/min/max`, `tabindex`, `data-state`

**Range**: `{ start, end }` (percentages)

**Track**: `{ attrs }` (data-disabled, data-orientation)

### Thumb Auto-Indexing

Thumbs register with Root on mount via context and receive index by mount order. First Thumb controls `values[0]`, second controls `values[1]`.

## Interaction Model

### Pointer

- **Thumb drag**: pointerdown captures, pointermove on document updates value via percent calculation, pointerup releases and emits `valueCommit`
- **Track click**: pointerdown calculates value from position, snaps nearest thumb, begins drag immediately

### Keyboard (on focused Thumb)

| Key | Action |
|-----|--------|
| ArrowRight / ArrowUp | stepUp (×1) |
| ArrowLeft / ArrowDown | stepDown (×1) |
| Shift+Arrow | stepUp/Down (×10) |
| PageUp | stepUp (×10) |
| PageDown | stepDown (×10) |
| Home | setToMin |
| End | setToMax |

### Inverted

`inverted` prop flips percent calculation: `percent = 100 - rawPercent`. Arrow key directions also reverse.

### Vertical

Swap X-axis for Y-axis. Bottom = min, top = max.

## Events

- **`update:modelValue`**: fires continuously during drag
- **`valueCommit`**: fires once on pointerup or keyboard change

## ARIA

Each Thumb element gets:
- `role="slider"`
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- `aria-valuetext` (optional, via prop/slot)
- `aria-orientation`
- `aria-disabled`
- `tabindex="0"` (or `-1` if disabled)

## Form Integration

When `name` prop is set on Root, HiddenInput renders one `<input type="hidden">` per thumb value. Supports `form` prop for association.

## Files

```
packages/0/src/composables/createSlider/
└── index.ts

packages/0/src/components/Slider/
├── SliderRoot.vue
├── SliderTrack.vue
├── SliderRange.vue
├── SliderThumb.vue
├── SliderHiddenInput.vue
├── index.ts
└── index.test.ts
```

## Existing v0 Dependencies

- `clamp()`, `useId()` from `#v0/utilities`
- `useEventListener()`, `createContext()`, `useProxyModel()` from `#v0/composables`
- `IN_BROWSER` from `#v0/constants/globals`
- `Atom` from `#v0/components`

## Not In Scope

- RTL (`dir` prop) — not yet implemented in v0
- Marks / step indicators — can be added later
- Tooltip — can be composed with Popover
- Logarithmic scale — future enhancement
