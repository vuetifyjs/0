---
title: useSelection - Item Selection State for Vue 3
meta:
- name: description
  content: Manage item selection in collections with automatic indexing. Supports single and multi-select patterns, mandatory selection, enrollment, and lifecycle management.
- name: keywords
  content: useSelection, selection, composable, Vue 3, state management, multi-select, mandatory
features:
  category: Composable
  label: 'E: useSelection'
  github: /composables/useSelection/
related:
  - /composables/registration/use-registry
  - /composables/selection/use-single
  - /composables/selection/use-group
  - /components/providers/selection
---

# useSelection

A composable for managing the selection of items in a collection with automatic indexing and lifecycle management.

<DocsPageFeatures :frontmatter />

## Usage

useSelection extends the functionality of useRegistry to manage selection states for a collection of items. It is reactive, supports both single and multi-select patterns, and provides helper properties for working with selected IDs, values, and items.

```ts
import { useSelection } from '@vuetify/v0'

const selection = useSelection()

selection.register({ id: 'apple', value: 'Apple' })
selection.register({ id: 'banana', value: 'Banana' })

selection.select('apple')
selection.select('banana')

console.log(selection.selectedIds) // Set(2) { 'apple', 'banana' }
console.log(selection.selectedValues) // ComputedRef<Set> { value: Set(2) { 'Apple', 'Banana' } }
console.log(selection.has('apple')) // true
```

## Architecture

`useSelection` extends `useRegistry` and is the base for all selection patterns:

```mermaid
flowchart TD
  useRegistry --> useSelection
  useSelection --> useSingle
  useSelection --> useGroup
  useSingle --> useStep
  useSingle --> useTheme
  useSingle --> useLocale
  useGroup --> useFeatures
```


<DocsApi />
