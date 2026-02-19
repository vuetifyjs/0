---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Checkboxes for settings

`Checkbox` provides tri-state checkbox controls with group support. Like all v0 components, it handles ARIA attributes and keyboard interaction while you style the visuals.

## Group and Root

```vue
<template>
  <Checkbox.Group v-model="selected">
    <Checkbox.Root value="email">
      <Checkbox.Indicator>✓</Checkbox.Indicator>
      Email notifications
    </Checkbox.Root>
  </Checkbox.Group>
</template>
```

- **`Checkbox.Group`** — manages an array of selected values
- **`Checkbox.Root`** — individual checkbox with `value` prop, renders as a button
- **`Checkbox.Indicator`** — only renders its content when checked

## SelectAll with mixed state

`Checkbox.SelectAll` binds to the group's aggregate state. When some (but not all) items are checked, the indicator receives `isMixed`:

```vue
<template>
  <Checkbox.SelectAll>
    <Checkbox.Indicator v-slot="{ isMixed }">
      <span v-if="isMixed">−</span>
      <span v-else>✓</span>
    </Checkbox.Indicator>
    Select all
  </Checkbox.SelectAll>
</template>
```

## Try it

The Notifications tab now has checkboxes. Try checking a few, then add a `Checkbox.SelectAll` above the list. Watch the indicator change between check, dash, and empty as you toggle items.
