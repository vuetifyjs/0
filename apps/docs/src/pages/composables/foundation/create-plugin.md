---
title: createPlugin
description: A universal plugin factory to reduce boilerplate code for Vue plugin creation.
keywords: createPlugin, plugin, Vue, factory
---

# createPlugin

The `createPlugin` factory function is a universal plugin factory designed to reduce boilerplate code when creating Vue plugins. It provides a structured way to define plugin behavior, including providing context and setting up the application.

## API

### `PluginOptions`

```ts
export interface PluginOptions {
  namespace: string
  provide: (app: App) => void
  setup?: (app: App) => void
}
```

Defines the options for creating a plugin:
- `namespace`: A string that uniquely identifies the plugin.
- `provide`: A function that receives the Vue `App` instance and is used to provide values to the application's context.
- `setup?`: An optional function that receives the Vue `App` instance and is used for additional setup logic after context has been provided.

### `createPlugin(options)`

* **Type**
    
  ```ts
  export function createPlugin<Z> (options: PluginOptions): Z
  ```

* **Details**
    
  - `options`: A `PluginOptions` object that configures the plugin.

  Returns a Vue plugin object with an `install` method. When the plugin is installed with `app.use()`, the `provide` and `setup` functions defined in `options` are executed within the application's context.

## Examples

### Creating a Simple Plugin

```ts
// plugins/my-simple-plugin.ts
import { createPlugin } from '@vuetify/v0/factories/createPlugin'
import { ref } from 'vue'

export const myPlugin = createPlugin({
  namespace: 'my-simple-plugin',
  provide: (app) => {
    // Provide a global reactive counter
    app.provide('myCounter', ref(0))
  },
  setup: (app) => {
    // Optional setup logic, e.g., global mixins or directives
    console.log('My Simple Plugin setup complete!')
  },
})
```

### Using the Plugin in `main.ts`

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { myPlugin } from './plugins/my-simple-plugin'

const app = createApp(App)

app.use(myPlugin)

app.mount('#app')
```

### Consuming the Provided Value in a Component

```html
<template>
  <div>
    <p>Counter: {{ counter }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
  import { inject, Ref } from 'vue'

  const counter = inject<Ref<number>>('myCounter')

  const increment = () => {
    if (counter) {
      counter.value++
    }
  }
</script>
```


