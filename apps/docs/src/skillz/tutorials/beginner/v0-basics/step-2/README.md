---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Tabs for navigation

`Tabs` is a compound component for building tabbed interfaces. It handles keyboard navigation, ARIA roles, and panel switching — you handle the look.

## Structure

```vue
<template>
  <Tabs.Root v-model="activeTab">
    <Tabs.List>
      <Tabs.Item value="general">General</Tabs.Item>
      <Tabs.Item value="notifications">Notifications</Tabs.Item>
    </Tabs.List>

    <Tabs.Panel value="general">General content</Tabs.Panel>
    <Tabs.Panel value="notifications">Notifications content</Tabs.Panel>
  </Tabs.Root>
</template>
```

- **`Tabs.Root`** — provides context and manages active tab
- **`Tabs.List`** — container with `tablist` role and arrow-key navigation
- **`Tabs.Item`** — individual tab trigger with `tab` role
- **`Tabs.Panel`** — content shown when its matching tab is active

## Tab items expose slot props

Just like `Single.Item`, each `Tabs.Item` exposes `isSelected` so you can conditionally style the active tab:

```vue
<template>
  <Tabs.Item value="general" #default="{ isSelected }">
    <span :class="isSelected ? 'border-b-2 border-primary' : ''">
      General
    </span>
  </Tabs.Item>
</template>
```

## Try it

The settings panel now has three tabs. Click between them to switch content. Try adding a fourth tab called "Security" with its own panel, or try adding the `disabled` prop to a tab.
