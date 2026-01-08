---
title: createGroup - Multi-Selection with Tri-State Support
meta:
- name: description
  content: Multi-selection composable with tri-state support. Manage checkbox trees with indeterminate states, batch operations, and select-all patterns for Vue 3 apps.
- name: keywords
  content: createGroup, selection, group selection, composable, Vue 3, indeterminate, tri-state, checkbox tree, select all
features:
  category: Composable
  label: 'E: createGroup'
  github: /composables/useGroup/
  level: 2
related:
  - /composables/selection/create-selection
  - /components/providers/group
---

# createGroup

The `useGroup` composable is designed to manage a group of related components, allowing for shared state and behavior across them. It supports tri-state (mixed/indeterminate) for checkbox trees and similar use cases where items can be selected, unselected, or in a mixed state.

<DocsPageFeatures :frontmatter />

## Usage

The `useGroup` composable manages a group of selectable items, letting you work with both their IDs and their position indexes.
It supports selecting, unselecting, toggling, and reading the indexes of selected items.

```ts
import { createGroup } from '@vuetify/v0'

// Instantiate group
const group = createGroup()

// Register items
group.register({ id: 'apple', value: 'Apple' })
group.register({ id: 'banana', value: 'Banana' })
group.register({ id: 'cherry', value: 'Cherry' })
group.register({ id: 'date', value: 'Date' })

// Select some items
group.select(['apple', 'banana'])
console.log(group.selectedIndexes.value) // Set { 0, 1 }

// Toggle an item (banana will become unselected)
group.toggle('banana')
console.log(group.selectedIndexes.value) // Set { 0 }

// Unselect apple
group.unselect('apple')
console.log(group.selectedIndexes.value) // Set {}
```

## Architecture

`useGroup` extends `useSelection` with multi-select and tri-state capabilities:

```mermaid
flowchart TD
  useRegistry --> useSelection
  useSelection --> useGroup
  useGroup --> mixedIds[mixedIds Set]
  useGroup --> selectedIds[selectedIds Set]
```

<DocsApi />
