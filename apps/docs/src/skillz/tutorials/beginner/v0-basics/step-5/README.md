---
hideFiles: false
hideTabs: true
hideBreadcrumbs: true
---
# Expansion panels

`ExpansionPanel` creates collapsible sections — perfect for organizing dense settings into scannable groups.

## Structure

```vue
<template>
  <ExpansionPanel.Root>
    <ExpansionPanel.Item value="appearance">
      <ExpansionPanel.Header>
        <ExpansionPanel.Activator>Appearance</ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content>
        Theme and color settings...
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>
```

- **`ExpansionPanel.Root`** — manages which panels are open, supports `multiple` prop
- **`ExpansionPanel.Item`** — wraps a single collapsible section
- **`ExpansionPanel.Header`** — non-collapsible header area
- **`ExpansionPanel.Activator`** — clickable trigger that toggles the panel
- **`ExpansionPanel.Content`** — collapsible content area

## Extracting components

Notice the file list on the left — we've extracted `SettingsSection.vue` to keep the General tab clean. This is a normal Vue pattern: break large templates into smaller, focused components.

## Try it

Try switching `ExpansionPanel.Root` to `multiple` mode so several sections can be open at once. You could also add a "Collapse all" button that resets the model to an empty array.
