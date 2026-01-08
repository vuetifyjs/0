---
title: createContext - Type-Safe Dependency Injection for Vue 3
meta:
- name: description
  content: Type-safe Vue dependency injection wrapper. Create reusable context to share state across components without prop drilling. Foundation for all Vuetify0 composables.
- name: keywords
  content: createContext, context, dependency injection, provide inject, composable, Vue 3, state management
features:
  category: Factory
  label: 'E: createContext'
  github: /composables/createContext/
  level: 3
related:
  - /composables/foundation/create-trinity
  - /composables/foundation/create-plugin
  - /guide/core
---

# createContext

The `createContext` factory function is at the heart of all functionality in Vuetify0. It is a small wrapper around the Vue 3 [provide](https://vuejs.org/guide/components/provide-inject.html#provide) and [inject](https://vuejs.org/guide/components/provide-inject.html#inject) APIs, allowing you to create a context that can be shared across components.

<DocsPageFeatures :frontmatter />

## Usage

```ts
import { shallowRef } from 'vue'
import { createContext } from '@vuetify/v0'
import type { ShallowRef } from 'vue'

interface MyContext {
  isDisabled: ShallowRef<boolean>
}

const [useContext, provideContext] = createContext<MyContext>('namespace')

provideContext({ isDisabled: shallowRef(false) })

export { useContext }
```

## Architecture

`createContext` is the foundation for all dependency injection in Vuetify0:

```mermaid "Context Hierarchy"
flowchart TD
  createContext --> createTrinity
  createContext --> createPlugin
  createTrinity --> createRegistry
  createTrinity --> createTokens
  createRegistry --> createSelection
  createSelection --> createSingle
  createSelection --> createGroup
```

<DocsApi />
