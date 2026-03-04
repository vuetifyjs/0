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
:::

## Anatomy

```vue Anatomy playground no-filename
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

```vue AnatomyWithSelection playground no-filename
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
/components/treeview/file-explorer

### File Explorer

A project directory tree with folder and file icons, three levels of nesting, and extension-based color coding.

:::

::: example
/components/treeview/selection

### Selection

The default selection mode is `cascade` — selecting a parent selects all descendants, and partially-selected parents show an indeterminate state. Use `selection="independent"` for flat, per-item selection without cascade behavior.

:::

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
