---
title: useFeatures Composable
meta:
- name: description
  content: Feature flags and variations composable for toggling features on/off and
    reading per-feature variations.
- name: keywords
  content: features, feature flags, variations, A/B testing, plugin, Vue, composable
features:
  category: Plugin
  label: 'E: useFeatures'
  github: /composables/useFeatures/
---

# useFeatures

Manage feature flags and simple variations across your app. Register features, toggle them, and query a variation value for A/B-style behavior.

<DocsPageFeatures :frontmatter />

## Usage

Install the Features plugin once, then access the context anywhere via `createFeatures`.

```ts
import { createApp } from 'vue'
import { createFeaturesPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createFeaturesPlugin({
    features: {
      analytics: true,
      debug_mode: false,
      notifications: false,
      search: { $value: true, $variation: 'v2' },
    },
  })
)

app.mount('#app')
```

Now in any component, access current feature flags and variations:

```vue UseFeatures
<script lang="ts" setup>
  import { useFeatures } from '@vuetify/v0'

  const features = useFeatures()
</script>

<template>
  <div>
    <p>Analytics: {{ features.get('analytics') }}</p>
    <p>Debug Mode: {{ features.get('debug_mode') }}</p>
    <p>Notifications: {{ features.get('notifications') }}</p>
    <p>Search Variation: {{ features.variation('search', 'v1') }}</p>
  </div>
</template>
```

Optionally register features at runtime:

```vue UseFeatures
<script lang="ts" setup>
  import { useFeatures } from '@vuetify/v0'

  const features = useFeatures()

  // Register at runtime
  features.register({ id: 'beta', value: false })

  // Enable/disable via selection helpers
  features.select('beta')
  features.unselect('analytics')
</script>
```

## API


| Composable | Description |
|---|---|
| [useTokens](/composables/registration/use-tokens) | Design token system that powers feature values |
| [useGroup](/composables/selection/use-group) | Multi-selection system (features extends this) |
| [useRegistry](/composables/registration/use-registry) | Base registry system |
| [createPlugin](/composables/foundation/create-plugin) | Plugin creation pattern |
### Extensions

| Composable | Description |
|---|---|
| [useRegistry](/composables/registration/use-registry/) | Base registry composable for managing collections of items. |
| [useTokens](/composables/tokens/use-tokens/) | Extends `useRegistry` with token utilities. |
| [useGroup](/composables/selection/use-group/) | Extends `useRegistry` with selection utilities. |

### `useFeatures`

* **Type**
  ```ts
  interface FeatureTicket extends GroupTicket {
    value: TokenValue // string | number | boolean | TokenAlias
  }

  interface TokenAlias<T = unknown> {
    $value: T
    $variation?: any
    $type?: string
    $description?: string
    $extensions?: Record<string, unknown>
    $deprecated?: boolean | string
    [key: string]: unknown
  }

  interface FeatureContext<Z extends FeatureTicket = FeatureTicket> extends GroupContext<Z> {
    variation (id: string, fallback?: any): any
  }

  interface FeaturePluginOptions {
    features?: Record<ID, boolean | TokenCollection>
  }

  interface FeatureOptions extends FeaturePluginOptions {}
  ```
* **Details**
  - `value`: Can be a primitive (string, number, boolean) or a TokenAlias object following the W3C Design Tokens format with `$value`, `$variation`, and other metadata fields.
  - `variation (id: string, fallback?: any): any`: Get the variation value for a feature. Looks for `$variation` property in token objects, or returns the provided fallback if not set.

### `register`

 - **Type**
   ```ts
   function register (item?: Partial<Z>): Z
   ```

- **Details**
  Augments the default `register` method from [useRegistry](/composables/registration/use-registry) to auto-select features that are registered with a truthy value. If a feature is registered with `value: true`, `{ value: true }`, or `{ $value: true }`, it will be automatically selected.

### `variation`

 - **Type**
   ```ts
   function variation (id: string, fallback?: any): any
   ```

- **Details**
  Get the variation value for a feature. If the feature is not found or has no variation, returns the provided fallback value (or `null` if no fallback is provided).

- **Example**
  ```ts
  // main.ts
  import { createApp } from 'vue'
  import { createFeaturesPlugin } from '@vuetify/v0'
  import App from './App.vue'

  const app = createApp(App)

  app.use(
    createFeaturesPlugin({
      features: {
        'new_ui': { $value: true, $variation: 'A' },
        'old_ui': false,
      },
    })
  )
  ```
  ```vue UseFeatures
  <!-- Component.vue -->
  <script lang="ts" setup>
    import { useFeatures } from '@vuetify/v0'

    const features = useFeatures()

    features.variation('new_ui', 'B') // 'A'
    features.variation('old_ui', 'default') // 'default'
    features.variation('non_existent', 'fallback') // 'fallback'
    features.variation('non_existent') // null
  </script>
  ```

### `createFeaturesContext`

- **Type**
  ```ts
  interface FeatureContextOptions extends RegistryOptions {
    namespace: string
    features?: Record<ID, boolean | TokenCollection>
  }

  function createFeaturesContext<
    Z extends FeatureTicket = FeatureTicket,
    E extends FeatureContext<Z> = FeatureContext<Z>
  > (options: FeatureContextOptions): ContextTrinity<E>
  ```

- **Details**

  Creates a features context using the [trinity pattern](/composables/foundation/create-trinity). Returns a readonly tuple of `[useFeaturesContext, provideFeaturesContext, context]` for dependency injection.

  This is useful when you want to create custom feature flag contexts with their own namespaces, separate from the global plugin instance.

- **Parameters**

  - `options`: Configuration object containing:
    - `namespace`: Unique string key for providing/injecting the context
    - `features` (optional): Initial features to register (Record<ID, boolean | TokenCollection>)
    - Other `RegistryOptions` (e.g., `events`)

- **Returns**

  A readonly tuple `[useFeaturesContext, provideFeaturesContext, context]`:
  - **useFeaturesContext**: Function to inject/consume the context
  - **provideFeaturesContext**: Function to provide the context to app or component tree
  - **context**: Default features instance for standalone usage

- **Example**
  ```ts
  import { createFeaturesContext } from '@vuetify/v0'

  // Create a custom features context with its own namespace
  const [useAppFeatures, provideAppFeatures, features] = createFeaturesContext({
    namespace: 'my-app:features',
    features: {
      'dark-mode': true,
      'analytics': false,
      'search': { $value: true, $variation: 'v2' }
    }
  })

  // In root component or main.ts
  provideAppFeatures()

  // In any descendant component
  const features = useAppFeatures()
  features.select('analytics')
  console.log(features.variation('search', 'v1')) // 'v2'
  ```

- **Trinity Pattern**

  The three elements work together:

  ```ts
  const [useContext, provideContext, context] = createFeaturesContext(options)

  // 1. useContext - Inject in child components
  const features = useContext()

  // 2. provideContext - Provide in parent component
  provideContext()

  // 3. context - Direct access without provide/inject
  context.select('feature-id')
  ```

  See [createTrinity](/composables/foundation/create-trinity) for more details on the trinity pattern.
