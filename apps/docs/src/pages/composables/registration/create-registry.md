---
title: createRegistry - Item Registration and Indexing for Vue 3
meta:
- name: description
  content: A foundational composable for building registration-based systems, managing
    collections of registered items with automatic indexing, and lifecycle management.
- name: keywords
  content: createRegistry, registry, composable, Vue, state management
features:
  category: Composable
  label: 'E: createRegistry'
  github: /composables/createRegistry/
  level: 3
related:
- /composables/selection/create-selection
- /composables/registration/create-tokens
- /composables/forms/create-form
---

# createRegistry

A foundational composable for building registration-based systems, managing collections of registered items with automatic indexing, and lifecycle management.

<DocsPageFeatures :frontmatter />

## Usage

The `createRegistry` composable provides a powerful interface for managing collections of items in a registration-based system. It allows you to register, unregister, and look up items efficiently, while maintaining an index for quick access.

```ts
import { createRegistry } from '@vuetify/v0'

const registry = createRegistry()

const ticket1 = registry.register()
const ticket2 = registry.register()
const ticket3 = registry.register()

console.log(registry.size) // 3
```

## Architecture

`createRegistry` is the foundation for specialized registration systems:

```mermaid "Registry Hierarchy"
flowchart TD
  createRegistry --> createSelection
  createRegistry --> createTokens
  createRegistry --> createForm
  createRegistry --> createQueue
  createRegistry --> createTimeline
```

Each branch extends the base ticket pattern with domain-specific capabilities. See individual composable docs for their extension hierarchies.

<DocsApi />
