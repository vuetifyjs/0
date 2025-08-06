---
meta:
  title: Context
  description: A component for providing and injecting context data within a component tree.
  keywords: context, vuetify0, component, dependency injection
category: Component
performance: 0
---

# Context Component

## Description

The `Context` component in Vuetify0 facilitates dependency injection by providing a mechanism to share data down the component tree without explicitly passing props at each level. It leverages Vue's `provide` and `inject` functionalities, wrapped in a convenient component structure, to manage and retrieve contextual data.

## API

### Props

- **`contextKey`**: `InjectionKey<T> | string`
  - The key used to identify the context. This can be a Vue `InjectionKey` or a string.
- **`value`**: `T`
  - The value to be provided as context. This value can be of any type `T`.

### Slots

- **`default`**: `() => any`
  - The default slot allows you to place child components that will have access to the provided context.

### Events

There are no specific events emitted by the `Context` component.

## Examples

### Basic Context Provision and Injection

```vue
<template>
  <Context :contextKey="myContextKey" :value="myContextValue">
    <ChildComponent />
  </Context>
</template>

<script setup lang="ts">
import { provide, inject, InjectionKey, ref } from 'vue';
import { Context } from '@vuetify/0/components/Context';

interface MyContextType {
  message: string;
}

const myContextKey: InjectionKey<MyContextType> = Symbol('my-context-key');
const myContextValue = ref({ message: 'Hello from Context!' });

const ChildComponent = {
  setup() {
    const context = inject(myContextKey);
    return {
      context,
    };
  },
  template: `<div>{{ context?.message }}</div>`,
};
</script>
```

### Using String as Context Key

```vue
<template>
  <Context contextKey="myStringContext" value="This is a string context.">
    <AnotherChildComponent />
  </Context>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { Context } from '@vuetify/0/components/Context';

const AnotherChildComponent = {
  setup() {
    const context = inject('myStringContext');
    return {
      context,
    };
  },
  template: `<div>{{ context }}</div>`,
};
</script>
```

