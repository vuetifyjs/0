---
title: createSelection - Item Selection State for Vue 3
meta:
- name: description
  content: Manage item selection in collections with automatic indexing. Supports single and multi-select patterns, mandatory selection, enrollment, and lifecycle management.
- name: keywords
  content: createSelection, selection, composable, Vue 3, state management, multi-select, mandatory
features:
  category: Composable
  label: 'E: createSelection'
  github: /composables/createSelection/
  level: 2
related:
  - /composables/registration/create-registry
  - /composables/selection/create-single
  - /composables/selection/create-group
  - /components/providers/selection
---

# createSelection

A composable for managing the selection of items in a collection with automatic indexing and lifecycle management.

<DocsPageFeatures :frontmatter />

## Usage

`createSelection` extends the functionality of `createRegistry` to manage selection states for a collection of items. It is reactive, supports both single and multi-select patterns, and provides helper properties for working with selected IDs, values, and items.

```ts
import { createSelection } from '@vuetify/v0'

const selection = createSelection()

selection.register({ id: 'apple', value: 'Apple' })
selection.register({ id: 'banana', value: 'Banana' })

selection.select('apple')
selection.select('banana')

console.log(selection.selectedIds) // Set(2) { 'apple', 'banana' }
console.log(selection.selectedValues.value) // Set(2) { 'Apple', 'Banana' }
console.log(selection.has('apple')) // true
```

## Architecture

`createSelection` extends `createRegistry` and is the base for all selection patterns:

```mermaid "Selection Hierarchy"
flowchart TD
  createRegistry --> createSelection
  createSelection --> createSingle
  createSelection --> createGroup
  createSingle --> createStep
```

<DocsApi />
