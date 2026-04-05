---
title: Treeview - Hierarchical Tree Component for Vue 3
meta:
- name: description
  content: Accessible hierarchical tree component with expand/collapse, selection, and tri-state checkbox support for Vue 3.
- name: keywords
  content: treeview, tree, hierarchy, collapsible, disclosure, accessible, Vue 3, headless
features:
  category: Component
  label: 'C: Treeview'
  github: /components/Treeview/
  renderless: false
  level: 3
related:
  - /components/disclosure/expansion-panel
---

# Treeview

A compound component for building accessible hierarchical tree interfaces with expand/collapse and selection support.

<DocsPageFeatures :frontmatter />

## Usage

The Treeview component provides a compound pattern for building accessible tree structures. It uses the `createNested` composable internally for hierarchical state management — tracking parent-child relationships, open/close state, and cascade selection.

::: example
/components/treeview/basic

### Hierarchical Tree

A categorized tree with expand/collapse and multi-select checkboxes.

:::

## Anatomy

```vue Anatomy playground no-filename collapse
<script setup lang="ts">
  import { Treeview } from '@vuetify/v0'
</script>

<template>
  <Treeview.Root>
    <Treeview.List>
      <Treeview.Item>
        <Treeview.Activator>
          <Treeview.Cue />
          Label
        </Treeview.Activator>

        <Treeview.Content>
          <Treeview.Group>
            <Treeview.Item>
              <Treeview.Activator>Leaf</Treeview.Activator>
            </Treeview.Item>
          </Treeview.Group>
        </Treeview.Content>
      </Treeview.Item>
    </Treeview.List>
  </Treeview.Root>
</template>
```

For trees with selection, add [Treeview.Checkbox](#treeviewcheckbox) and [Treeview.Indicator](#treeviewindicator):

```vue AnatomyWithSelection playground no-filename collapse
<script setup lang="ts">
  import { Treeview } from '@vuetify/v0'
</script>

<template>
  <Treeview.Root>
    <Treeview.List>
      <Treeview.Item>
        <Treeview.Activator>
          <Treeview.Cue />
        </Treeview.Activator>

        <Treeview.Checkbox>
          <Treeview.Indicator />
        </Treeview.Checkbox>

        Label

        <Treeview.Content>
          <Treeview.Group>
            <Treeview.Item>Leaf</Treeview.Item>
          </Treeview.Group>
        </Treeview.Content>
      </Treeview.Item>
    </Treeview.List>
  </Treeview.Root>
</template>
```

## Examples

::: example
/components/treeview/SettingNode.vue 2
/components/treeview/settings-panel.vue 1

### Settings Panel

A settings tree with functional controls built from reactive data. Click any setting to activate it and view its description in the detail pane.

- **Activation** — `activate` from the `Item` slot highlights the current item. Style the active row with `[data-active]`.
- **Functional controls** — toggles and `<select>` dropdowns modify the reactive data directly.
- **Disabled** — `:disabled` on `Treeview.Item` greys out the "Experimental" category. Style with `[data-disabled]`.
- **Depth indentation** — `--v0-treeview-depth` CSS variable on each item drives `padding-left`, no manual nesting needed.
- **Open/closed** — `isOpen` slot prop on `Item` rotates the chevron via a CSS class.
- **Recursive rendering** — `SettingNode.vue` handles both categories and leaves, recursing through `Treeview.Group` for nested children.

:::

## Recipes

### Cascade Selection

Add `v-model` to `Treeview.Root` for cascade selection. Use `Treeview.Checkbox` and `Treeview.Indicator` for tri-state checkboxes. Use `Treeview.SelectAll` for a tree-wide toggle.

```vue CascadeSelection playground no-filename collapse
<script setup lang="ts">
  import { Treeview } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref<string[]>([])
</script>

<template>
  <Treeview.Root v-model="selected">
    <Treeview.SelectAll>
      <Treeview.Indicator />
      Select All
    </Treeview.SelectAll>

    <Treeview.List>
      <Treeview.Item value="users">
        <Treeview.Checkbox>
          <Treeview.Indicator />
        </Treeview.Checkbox>
        Users

        <Treeview.Group>
          <Treeview.Item value="users:view">
            <Treeview.Checkbox>
              <Treeview.Indicator />
            </Treeview.Checkbox>
            View
          </Treeview.Item>

          <Treeview.Item value="users:create">
            <Treeview.Checkbox>
              <Treeview.Indicator />
            </Treeview.Checkbox>
            Create
          </Treeview.Item>
        </Treeview.Group>
      </Treeview.Item>
    </Treeview.List>
  </Treeview.Root>
</template>
```

## Styling with Data Attributes

All sub-components expose data attributes for CSS-driven state styling:

| Component | Attribute | Values |
|-----------|-----------|--------|
| **Item** | `data-selected` | Present when selected |
| **Item** | `data-disabled` | Present when disabled |
| **Item** | `data-open` | Present when expanded |
| **Item** | `data-active` | Present when active |
| **Activator** | `data-disabled` | Present when disabled |
| **Activator** | `data-open` | Present when expanded |
| **Checkbox** | `data-selected` | Present when checked |
| **Checkbox** | `data-disabled` | Present when disabled |
| **Checkbox** | `data-mixed` | Present when indeterminate |
| **Cue** | `data-state` | `open` or `closed` |
| **Indicator** | `data-state` | `checked`, `unchecked`, or `indeterminate` |

The `--v0-treeview-depth` CSS variable is set on each Item, enabling indentation:

```css
.tree-item {
  padding-left: calc(var(--v0-treeview-depth) * 1rem);
}
```

<DocsApi />
