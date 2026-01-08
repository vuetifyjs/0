---
title: createTrinity - Context Provider/Consumer Pattern for Vue 3
meta:
- name: description
  content: Factory for the trinity pattern. Creates a 3-tuple with context consumer, provider, and default instance for type-safe sharable singleton state in Vue apps.
- name: keywords
  content: createTrinity, context, trinity pattern, provide inject, singleton, composable, Vue 3
features:
  category: Factory
  label: 'E: createTrinity'
  github: /composables/createTrinity/
  level: 3
related:
  - /composables/foundation/create-context
  - /composables/foundation/create-plugin
  - /guide/core
---

# createTrinity

The **createTrinity** factory function is a type-safe utility for generating a 3-item tuple—called a **trinity**—which contains a context consumer, a provider, and the underlying context object.

<DocsPageFeatures :frontmatter />

## Usage

The trinity pattern is the marrying of provide and inject with a context object. It provides a clean and type safe way to create a sharable singleton state.

```ts
import { createContext, createTrinity } from '@vuetify/v0'
import { ref } from 'vue'

interface User {
  id: string
  name: string
}

interface UserContext {
  user: Ref<User>
  updateUser: (user: User) => void
}

function createUserContext() {
  const [useContext, provideContext] = createContext<UserContext>('user')

  const user = ref<User>({ id: '123', name: 'John Doe' })

  function updateUser(newUser: User) {
    user.value = newUser
  }

  const context: UserContext = {
    user,
    updateUser
  }

  return createTrinity<UserContext>(useContext, provideContext, context)
}

export const [useUser, provideUser, defaultUserContext] = createUserContext()
```

## Architecture

`createTrinity` builds on `createContext` to provide a standardized 3-tuple pattern:

```mermaid
flowchart LR
  subgraph Trinity Tuple
    A[useContext]
    B[provideContext]
    C[defaultContext]
  end

  createContext --> A
  createContext --> B
  Factory --> C

  A --> Components
  B --> App/Provider
  C --> Fallback
```

<DocsApi />
