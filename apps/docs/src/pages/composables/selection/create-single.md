---
title: createSingle - Single-Selection State for Vue 3
meta:
- name: description
  content: Single-item selection with automatic deselection. Extends createSelection for radio buttons, tabs, and exclusive choice patterns. Base for createTheme and createLocale.
- name: keywords
  content: createSingle, single selection, radio button, tabs, exclusive, composable, Vue 3, state management
features:
  category: Composable
  label: 'E: createSingle'
  github: /composables/useSingle/
related:
  - /composables/selection/create-selection
  - /composables/selection/create-step
  - /components/providers/single
---

# createSingle

A composable that extends `useSelection` to enforce single-item selection. Automatically clears the previous selection before selecting a new item, ensuring only one item is selected at any time.

<DocsPageFeatures :frontmatter />

## Usage

The `useSingle` composable is used when you have a **collection of items** but want to allow **only one** to be selected at any time.

```ts
import { createSingle } from '@vuetify/v0'

const single = createSingle()

// Register items first
single.register({ id: 'apple', value: 'Apple' })
single.register({ id: 'banana', value: 'Banana' })

// Select by ID
single.select('apple')
console.log(single.selectedId) // 'apple'
console.log(single.selectedValue) // 'Apple'

// Selecting a new item automatically clears the previous selection
single.select('banana')
console.log(single.selectedId) // 'banana' (replaces apple)
```

## Architecture

The `useSingle` composable is comprised of the following hierarchy:

```mermaid
flowchart TD
  useRegistry --> useSelection
  useSelection --> useSingle
```

<DocsApi />
