# Splitter Component Design

Minimal headless compound component for resizable panel layouts. Follows v0's existing compound component patterns (Tabs, Dialog). Implements WAI-ARIA window splitter pattern.

## Components

### Splitter.Root

Provides context, sets layout direction.

- **Props**: `orientation` (`'horizontal' | 'vertical'`, default `'horizontal'`), `disabled`
- **Provides**: context with orientation, panel registry, drag state, sizes array
- **Renders**: `<div>` with `display: flex`, direction based on orientation
- **Data attrs**: `data-orientation`

### Splitter.Panel

Resizable pane with flex-based sizing.

- **Props**: `defaultSize` (percent, required), `minSize` (percent, default `0`), `maxSize` (percent, default `100`)
- **Consumes**: root context to register itself and get current size
- **Renders**: `<div>` with `flex-basis` driven by context
- **Slot props**: `size` (current percent)
- **Data attrs**: `data-orientation`

### Splitter.Handle

Draggable separator with keyboard support.

- **Props**: `disabled`
- **Renders**: `<div role="separator">` with `tabindex="0"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-orientation`
- **Pointer**: capture + RAF-batched pointermove, cursor management on `<html>`
- **Keyboard**: Arrow keys (±10%), Home/End for min/max
- **Slot props**: `isDragging`
- **Data attrs**: `data-state` (`drag | hover | inactive`), `data-orientation`, `data-disabled`

## Internal Mechanics

- Root maintains an ordered registry of panels and a reactive `number[]` of sizes
- Handle knows its two adjacent panels by position in the DOM/registry order
- On drag: delta calculated as percent of root element size, redistributed between adjacent panels respecting min/max
- No persistence — consumer reads sizes and stores however they want

## Usage

```vue
<Splitter.Root orientation="horizontal">
  <Splitter.Panel :default-size="60" :min-size="20">
    Left content
  </Splitter.Panel>

  <Splitter.Handle />

  <Splitter.Panel :default-size="40" :min-size="20">
    Right content
  </Splitter.Panel>
</Splitter.Root>
```

## Deliberately Excluded (Future)

- Collapsibility
- Pixel-based sizing
- Persistence (autoSaveId / useStorage)
- Nested splitters
- aria-controls / aria-labelledby (consumer can add)

## Prior Art

- Reka UI SplitterGroup/Panel/ResizeHandle
- Ark UI Splitter.Root/Panel/ResizeTrigger
- WAI-ARIA Window Splitter pattern (separator role, keyboard interactions)
