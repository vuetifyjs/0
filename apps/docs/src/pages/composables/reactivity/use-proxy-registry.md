---
title: useProxyRegistry - Reactive Registry Wrapper for Vue 3
meta:
- name: description
  content: Vue 3 reactive proxy wrapper for registry collections. Automatically updates refs when items are registered or unregistered from the registry system.
- name: keywords
  content: useProxyRegistry, registry, reactive, composable, Vue, state management
features:
  category: Composable
  label: 'E: useProxyRegistry'
  github: /composables/useProxyRegistry/
  level: 3
related:
- /composables/registration/create-registry
---

# useProxyRegistry

A reactive proxy wrapper for registry collections that automatically updates refs when items are registered or unregistered.

<DocsPageFeatures :frontmatter />

## Usage

The `useProxyRegistry` composable creates reactive objects that automatically sync with a registry's state. It listens for registry changes and updates the reactive properties accordingly, making it ideal for template-driven UIs that need to react to registry mutations.

**Important:** The registry must have `events: true` enabled for the proxy to receive updates.

```ts
import { createRegistry, useProxyRegistry } from '@vuetify/v0'

const registry = createRegistry({ events: true })
const proxy = useProxyRegistry(registry)

registry.register({ value: 'Item 1' })
registry.register({ value: 'Item 2' })

console.log(proxy.size) // 2
console.log(proxy.keys) // [id1, id2]
```

## Architecture

`useProxyRegistry` creates a reactive proxy over registry collections:

```mermaid "Proxy Registry Flow"
flowchart LR
  createRegistry --> events[register/unregister events]
  events --> useProxyRegistry
  useProxyRegistry --> reactive[reactive object]
  reactive --> template[Vue template]
```

<DocsApi />
