---
title: Tabs - Accessible Tab Navigation
meta:
- name: description
  content: Headless tabs component for organizing content into panels. Keyboard navigation, automatic/manual activation modes, and full ARIA compliance built-in.
- name: keywords
  content: tabs, tablist, tabpanel, navigation, accessible, ARIA, Vue 3, headless
features:
  category: Component
  label: 'E: Tabs'
  level: 2
  github: /components/Tabs/
related:
  - /composables/selection/use-step
  - /components/providers/step
---

<script setup>
import BasicExample from '@/examples/components/tabs/basic.vue'
import BasicExampleRaw from '@/examples/components/tabs/basic.vue?raw'
import VerticalExample from '@/examples/components/tabs/vertical.vue'
import VerticalExampleRaw from '@/examples/components/tabs/vertical.vue?raw'
</script>

# Tabs

A headless tabs component for organizing content into panels with keyboard navigation and automatic/manual activation modes.

<DocsPageFeatures :frontmatter />

## Usage

Use `Tabs.Root` to create a tab container with `v-model` to bind the active tab value:

<DocsExample file="basic.vue" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## Anatomy

```vue Anatomy playground
<script setup lang="ts">
  import { Tabs } from '@vuetify/v0'
</script>

<template>
  <Tabs.Root>
    <Tabs.List>
      <Tabs.Item value="a">
        Tab A
        <Tabs.Indicator />
      </Tabs.Item>
      <Tabs.Item value="b">
        Tab B
        <Tabs.Indicator />
      </Tabs.Item>
    </Tabs.List>

    <Tabs.Panel value="a">
      Content for Tab A
    </Tabs.Panel>
    <Tabs.Panel value="b">
      Content for Tab B
    </Tabs.Panel>
  </Tabs.Root>
</template>
```

## Vertical Orientation

Set `orientation="vertical"` for vertical tab navigation. Arrow keys will use up/down instead of left/right:

<DocsExample file="vertical.vue" :code="VerticalExampleRaw">
  <VerticalExample />
</DocsExample>

## Activation Modes

Tabs support two activation modes:

- **automatic** (default): Tab activates immediately when focused via keyboard
- **manual**: Tab only activates when pressing Enter or Space

```vue
<Tabs.Root activation="manual">
  <!-- Tabs only activate on Enter/Space -->
</Tabs.Root>
```

## Mandatory Selection

By default, `mandatory="force"` auto-selects the first non-disabled tab. Set `mandatory` to `false` to allow no selection:

```vue
<Tabs.Root :mandatory="false">
  <!-- No tab selected initially -->
</Tabs.Root>
```

## Accessibility

The Tabs components handle all ARIA attributes automatically:

- `role="tablist"` on the List
- `role="tab"` on each Item
- `role="tabpanel"` on each Panel
- `aria-selected` reflects active state
- `aria-controls` links tabs to panels
- `aria-labelledby` links panels to tabs
- `aria-orientation` reflects orientation
- Roving `tabindex` - only the active tab is tabbable
- Arrow keys navigate between tabs
- Home/End keys jump to first/last tab
- Enter/Space activates tab (in manual mode)

For custom implementations, use `renderless` mode and bind the `attrs` slot prop to your element:

```vue
<Tabs.Item v-slot="{ attrs, isSelected }" renderless value="profile">
  <button v-bind="attrs" :class="{ active: isSelected }">
    Profile
  </button>
</Tabs.Item>
```

## API

<DocsApi name="Tabs" />
