---
hideFiles: false
hideTabs: false
hideBreadcrumbs: true
---
# Slot props for styling

You've already used `isSelected` and `isChecked` in previous steps. Now let's explore how slot props enable **sophisticated conditional styling** across all v0 components.

## Every component exposes state

Each v0 component provides slot props that describe its current state:

| Component | Slot Props |
|-----------|-----------|
| `Single.Item` | `isSelected`, `select` |
| `Tabs.Item` | `isSelected` |
| `Checkbox.Root` | `isSelected` |
| `Checkbox.Indicator` | `isMixed` |
| `Radio.Root` | `isSelected` |
| `ExpansionPanel.Activator` | `isSelected` |

## Combining slot props with transitions

Since you control all the markup, you can add CSS transitions, animations, and transforms directly:

```vue
<template>
  <ExpansionPanel.Activator #default="{ isSelected }">
    <button class="flex items-center gap-2">
      <span
        class="transition-transform duration-200"
        :class="isSelected ? 'rotate-180' : ''"
      >▾</span>
      Section title
    </button>
  </ExpansionPanel.Activator>
</template>
```

## Try it

This step refines the styling across every component. Notice the smoother transitions on tabs, the refined checkbox and radio indicators, and the polished expansion panel animations. Try styling the `isMixed` indicator on `Checkbox.SelectAll` as a dash icon instead of text.
