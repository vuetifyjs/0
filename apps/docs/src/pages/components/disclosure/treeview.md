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
  - /composables/selection/create-nested
  - /composables/system/use-roving-focus
  - /components/disclosure/expansion-panel
---

# Treeview

A compound component for building accessible hierarchical tree interfaces with expand/collapse and selection support.

<DocsPageFeatures :frontmatter />

## Usage

Display hierarchical data as an expandable, selectable tree. Nodes open and close, selection cascades through parents and children, and `v-model` tracks the selected nodes.

::: gn-example
/components/treeview/basic
:::

## Anatomy

```vue Anatomy no-filename
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

        <Treeview.Content>
          <Treeview.Group>
            <Treeview.Item />
          </Treeview.Group>
        </Treeview.Content>
      </Treeview.Item>
    </Treeview.List>
  </Treeview.Root>
</template>
```

## Examples

::: gn-example
/components/treeview/SettingNode.vue 2
/components/treeview/settings-panel.vue 1

### Settings Panel

The Settings Panel demonstrates building a real-world tree UI from reactive data — categories with children that can be opened and closed, leaf nodes that activate a detail pane on click, and in-tree functional controls (toggles and selects) that modify the underlying data without leaving the tree.

`SettingNode.vue` handles both categories and leaves in a single recursive component: categories render a `Treeview.Activator` wrapping a chevron, while leaves render a `<button>` that calls `activate()` from the `Item` slot and emits upward. The `--v0-treeview-depth` CSS variable drives `padding-left` on each row, so indentation scales automatically with nesting depth — no manual level counting needed.

The "Experimental" category uses `:disabled` on `Treeview.Item` and is styled via `[data-disabled]` in scoped CSS. The active row is highlighted via `[data-active]` — the `activate` slot method sets this state independently of selection, making it suitable for single-item focus patterns like settings panels, file explorers, and inspector trees.

For trees where the primary interaction is multi-select (not activation), prefer cascade selection with `Treeview.Checkbox` and `Treeview.Indicator` — see the [Cascade Selection recipe](#cascade-selection) below.

| File | Role |
|------|------|
| `SettingNode.vue` | Recursive node component rendering categories and leaf settings |
| `settings-panel.vue` | Root tree with reactive settings data and a detail pane |

:::

## Recipes

### Expansion Mode

Control how many nodes can be open at once with the `open` prop:

```vue
<template>
  <!-- Default: multiple nodes can be open simultaneously -->
  <Treeview.Root open="multiple" />

  <!-- Accordion: only one node open at a time -->
  <Treeview.Root open="single" />
</template>
```

Use `open-all` to expand all nodes on mount:

```vue
<template>
  <Treeview.Root open-all>
    <!-- All nodes start expanded -->
  </Treeview.Root>
</template>
```

### Selection Mode

The `selection` prop controls how selection propagates through the hierarchy:

| Value | Behavior |
|-------|----------|
| `cascade` (default) | Selecting a parent selects all descendants; parents show tri-state when partially selected |
| `independent` | Each node selected independently, no cascading |
| `leaf` | Only leaf nodes can be selected; selecting a parent selects all its leaf descendants |

```vue
<template>
  <Treeview.Root v-model="selected" selection="leaf">
    <!-- Only leaf nodes appear in v-model -->
  </Treeview.Root>
</template>
```

### Active Item

The `active` prop controls single vs. multi-highlight mode (independent of selection):

```vue
<template>
  <!-- Default: only one item highlighted at a time -->
  <Treeview.Root active="single" />

  <!-- Multiple items can be highlighted simultaneously -->
  <Treeview.Root active="multiple" />
</template>
```

### Reveal

Set `reveal` to automatically open all ancestor nodes when a descendant is opened. Useful for "navigate to item" patterns where a deep node is programmatically opened:

```vue
<template>
  <Treeview.Root reveal>
    <!-- Opening a deep node opens its entire ancestor chain -->
  </Treeview.Root>
</template>
```

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

### Styling with Data Attributes

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

## Accessibility

Treeview implements the [WAI-ARIA Tree View pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/). `Treeview.List` establishes roving tabindex, so only one node is in the Tab order at a time and the arrow keys move focus between nodes. The Activator and Checkbox are `tabindex="-1"` and are reached through the tree rather than the page's Tab sequence.

### ARIA Attributes

| Attribute | Value | Element |
|-----------|-------|---------|
| `role` | `tree` | List |
| `aria-multiselectable` | `true` / `false` | List |
| `aria-label` | Provided `label` | List |
| `role` | `group` | Group |
| `role` | `treeitem` | Item |
| `aria-expanded` | `true` / `false` (only when the node has children) | Item |
| `aria-selected` | `true` / `false` | Item |
| `aria-disabled` | `true` / `false` | Item |
| `aria-level` | Depth (1-based) | Item |
| `aria-posinset` | Position among siblings | Item |
| `aria-setsize` | Sibling count | Item |
| `aria-current` | `true` when active | Item |
| `role` | `checkbox` | Checkbox, SelectAll |
| `aria-checked` | `true` / `false` / `mixed` | Checkbox, SelectAll |
| `aria-hidden` | `true` | Cue, Indicator |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowUp` | Moves focus to the previous visible node |
| `ArrowDown` | Moves focus to the next visible node |
| `ArrowRight` | Expands a collapsed node, or moves focus to its first child |
| `ArrowLeft` | Collapses an expanded node, or moves focus to its parent |
| `Home` | Moves focus to the first node |
| `End` | Moves focus to the last visible node |
| `Enter` | Toggles expansion (when expandable) and activates the node |
| `Space` | Toggles selection of the focused node |
| `*` | Expands all sibling nodes at the current level |
| `Tab` | Moves focus to focusable controls inside a row, then out to the next node |

In RTL, the `ArrowRight` and `ArrowLeft` directions are swapped. `Treeview.SelectAll` toggles the whole tree with `Enter` or `Space`.

## FAQ

::: faq

??? What's the difference between the cascade, independent, and leaf selection modes?

`cascade` (default) selects all descendants when you select a parent and shows tri-state for partial selection; `independent` selects each node on its own with no propagation; `leaf` lets only leaf nodes land in `v-model`, so selecting a parent selects all its leaf descendants.

??? What's the difference between the active and selection state?

`selection` (via `v-model` and the checkboxes) tracks which nodes are checked. `active` is a separate single-or-multi highlight, independent of selection, for focus patterns like file explorers, inspectors, and settings panels.

??? How do I indent rows by their nesting depth?

Each `Treeview.Item` sets a `--v0-treeview-depth` CSS variable. Multiply it for `padding-left` — e.g. `padding-left: calc(var(--v0-treeview-depth) * 1rem)` — so indentation scales automatically with depth.

??? How do I make the tree behave like an accordion, with only one node open at a time?

The tree defaults to `open="multiple"`. Set `open="single"` on `Treeview.Root` for accordion behavior, or `open-all` to expand every node on mount.

??? How do I auto-expand a deep node's ancestors when it opens?

Set `reveal` on `Treeview.Root`. Opening a descendant then opens its entire ancestor chain — useful for "navigate to item" patterns where a deep node is opened programmatically.

:::

<DocsApi />
