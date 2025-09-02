---
meta:
  title: createPlugin
  description: A foundational composable for registering Vue plugins with context support.
  keywords: createContext, context, composable, Vue, state management
features:
  category: Factory
  label: 'E: createPlugin'
  github: /factories/createPlugin/
---

# createPlugin

This composable allows you to create a Vue plugin with specific functionality that can be registered and used within your application.

<DocsPageFeatures :frontmatter />

## Usage { id="usage" }

Use in conjunction with the [createContext](/composables/foundation/create-context "createContext Documentation") composable to make [Vue plugins](https://vuejs.org/guide/reusability/plugins "Vue Plugins Documentation") that work seemlessly with [Vue Provide / Inject](https://vuejs.org/guide/components/provide-inject "Vue Provide / Inject Documentation").

```ts
import { createContext, createPlugin } from '@vuetify/v0'

interface MyPluginContext {
  app: string
}

// use is the inject function and provide is the provide function
export const [useMyContext, provideMyContext] = createContext<MyPluginContext>('provide-namespace')

export function createMyPlugin () {
  const context = {
    app: 'my-app'
  }

  return createPlugin({
    namespace: 'provide-namespace',
    provide: (app: App) => {
      provideMyContext(context, app)
    },
    setup: (app: App) => {
      // For everything else not provide related
    }
  })
}
```

> The **setup** and **provide** functions do the same thing, they are separated for semantic purposes.

Then, in your main application file, register the plugin like so:

```ts { resource="src/main.ts" }
import { createApp } from 'vue'
import { createMyPlugin } from './path/to/plugin'

const app = createApp(App)

app.use(createMyPlugin())
```

Now, whenever your application starts, the plugin is registered and the context is provided. Use the `useMyContext` function to access this context in any component:

```vue { resource="src/components/MyComponent.vue" }
<template>
  <div>{{ context.app }}</div>
</template>

<script lang="ts" setup>
  import { useMyContext } from './path/to/plugin'

  const context = useMyContext()
</script>
```

## API

- **Type**

  ```ts
  export interface PluginOptions {
    namespace: string
    provide: (app: App) => void
    setup?: (app: App) => void
  }

  export interface Plugin {
    install: (app: App, ...options: any[]) => void
  }

  function createPlugin<Z extends Plugin = Plugin> (options: PluginOptions): Z
  ```

-  **Details**
  - `namespace: string` - The namespace for the context being provided.
  - `provide: (app: App) => void` - A function that takes the Vue application instance and provides the context using Vue's Provide/Inject system.
  - `setup?: (app: App) => void` - An optional function for any additional setup that needs to be done when the plugin is installed.
  - `install: (app: App, ...options: any[]) => void` - The install method that Vue calls when the plugin is used. It runs the `provide` and `setup` functions with the application instance.

- **Options**
  - `app: App` - The Vue application instance.
