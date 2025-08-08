---
meta:
  title: Atom
  description: A fundamental building block component in Vuetify0.
  keywords: atom, vuetify0, component
category: Component
performance: 0
---

# Atom Component

## Description

The `Atom` component serves as a fundamental building block within the Vuetify0 framework. It is designed to be a highly flexible and reusable component, often used as a base for more complex UI elements. Its primary purpose is to encapsulate basic rendering logic and provide a consistent foundation for other components.

## API

### Props

- **`as`**: `HTMLElement | null`
  - Specifies the HTML element to render the component as. If `null`, it defaults to a `div`.
- **`renderless`**: `boolean`
  - If `true`, the component will not render any HTML element itself, but will still provide its functionality to its children. This is useful for creating higher-order components or renderless components.

### Slots

- **`default`**: `(props: T) => any`
  - The default slot allows you to inject content into the `Atom` component. The `props` object provides access to internal properties or methods of the `Atom` component, allowing for flexible rendering based on its state.

### Events

There are no specific events emitted by the `Atom` component.

## Examples

### Basic Usage

```html
<template>
  <Atom>
    <div>This is a basic Atom component.</div>
  </Atom>
</template>

<script setup lang="ts">
  import { Atom } from '@vuetify/0/components/Atom'
</script>
```

### Rendering as a different HTML element

```html
<template>
  <Atom as="span">
    <span>This Atom component renders as a span.</span>
  </Atom>
</template>

<script setup lang="ts">
  import { Atom } from '@vuetify/0/components/Atom'
</script>
```

### Renderless Atom

```html
<template>
  <Atom renderless>
    <template #default="{ someInternalProp }">
      <div>This content is rendered by a renderless Atom. Internal prop: {{ someInternalProp }}</div>
    </template>
  </Atom>
</template>

<script setup lang="ts">
  import { Atom } from '@vuetify/0/components/Atom'
</script>
```

### Atom with custom content via slot

```html
<template>
  <Atom>
    <template #default="{ message }">
      <h1>{{ message }}</h1>
    </template>
  </Atom>
</template>

<script setup lang="ts">
  import { Atom } from '@vuetify/0/components/Atom'
</script>
```
