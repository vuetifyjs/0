---
title: Avatar Component
meta:
- name: description
  content: A headless component for managing image loading with priority-based fallback
    system.
- name: keywords
  content: avatar, image, fallback, loading, component, Vue, headless
features:
  category: Component
  label: 'E: Avatar'
  github: /components/Avatar/
---

<script setup>
import BasicExample from '@/examples/components/avatar/basic.vue'
import BasicExampleRaw from '@/examples/components/avatar/basic.vue?raw'
</script>

# Avatar

A headless component for managing image loading with priority-based fallback system.

<DocsPageFeatures :frontmatter />

## Usage

The Avatar component provides a robust image loading system with automatic fallback handling. It manages multiple image sources with priority ordering and only displays the highest-priority loaded image or fallback content.

<DocsExample file="basic.vue" title="Avatar with Fallback" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>

## API

| Component | Description |
|---|---|
| [Atom](/components/atom) | Foundation component used by Avatar components |

| Composable | Description |
|---|---|
| [useRegistry](/composables/registration/use-registry) | Base registry system for managing images and fallbacks |

### AvatarRoot

The root component that manages image loading state and fallback logic.

- **Props**

  Extends `AtomProps`:

  ```ts
  interface AvatarRootProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
  }
  ```

- **Context**

  ```ts
  interface AvatarContext extends RegistryContext<AvatarTicket> {
    reset: () => void
  }

  interface AvatarTicket extends RegistryTicket {
    type: 'image' | 'fallback'
    priority: number
    status: 'idle' | 'loading' | 'loaded' | 'error'
    isVisible: ComputedGetter<boolean>
  }
  ```

### AvatarImage

Image component that registers with the Avatar context and manages loading state.

- **Props**

  ```ts
  interface AvatarImageProps extends AtomProps {
    src?: string
    priority?: number
    as?: DOMElement | null
    renderless?: boolean
  }
  ```

- **Emits**

  ```ts
  interface AvatarImageEmits {
    load: [e: Event]
    error: [e: Event]
  }
  ```

### AvatarFallback

Fallback content component shown when no images are loaded.

- **Props**

  ```ts
  interface AvatarFallbackProps extends AtomProps {
    as?: DOMElement | null
    renderless?: boolean
  }
  ```
