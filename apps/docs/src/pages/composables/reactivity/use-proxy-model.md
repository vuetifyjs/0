---
title: useProxyModel - Bidirectional v-model Binding for Vue 3
meta:
- name: description
  content: Bridge selection context to v-model with bidirectional sync. Supports single value or array modes with custom transform functions for Vue 3 components.
- name: keywords
  content: useProxyModel, v-model, two-way binding, selection, defineModel, composable, Vue 3, bidirectional
features:
  category: Composable
  label: 'E: useProxyModel'
  github: /composables/useProxyModel/
  level: 2
related:
  - /composables/selection/create-selection
  - /composables/selection/create-single
---

# useProxyModel

A composable for syncing refs bidirectionally with selection contexts, enabling seamless v-model integration with selection state.

<DocsPageFeatures :frontmatter />

## Usage

The `useProxyModel` composable syncs an existing ref (like from `defineModel()`) with a selection context bidirectionally. Changes in either direction automatically propagate.

```ts
import { ref } from 'vue'
import { createSelection, useProxyModel } from '@vuetify/v0'

const model = ref<string>()
const selection = createSelection({ events: true })

selection.onboard([
  { id: 'apple', value: 'Apple' },
  { id: 'banana', value: 'Banana' },
])

// Sync model with selection
const stop = useProxyModel(selection, model)

model.value = 'Apple'
console.log(selection.selectedIds) // Set { 'apple' }

selection.select('banana')
console.log(model.value) // 'Banana'
```

## Architecture

`useProxyModel` creates bidirectional sync between v-model refs and selection state:

```mermaid "Proxy Model Flow"
flowchart LR
  subgraph External
    model[v-model ref]
  end

  subgraph Selection
    selectedIds[selectedIds]
    browse[browse]
  end

  model -- transformIn --> browse
  browse --> select/unselect
  select/unselect --> selectedIds
  selectedIds -- transformOut --> model
```

<DocsApi />
