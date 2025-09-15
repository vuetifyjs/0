---
meta:
  title: useFeatures
  description: Feature flags and variations composable for toggling features on/off and reading per-feature variations.
  keywords: features, feature flags, variations, A/B testing, plugin, Vue, composable
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
      'analytics': true,
      'debug_mode': false,
      'notifications': false,
      'search': { value: true, variation: 'v2' },
    },
  })
)

app.mount('#app')
```

Now in any component, access current feature flags and variations:

```vue
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

```vue
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
    value: boolean | { value: boolean, variation?: any }
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
  - `variation (id: string, fallback?: any): any`: Get the variation value for a feature, or return the provided fallback if not set.

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
        'new_ui': { value: true, variation: 'A' },
        'old_ui': false,
      },
    })
  )
  ```
  ```vue
  <!-- Component.vue -->
  <script lang="ts" setup>
    import { useFeatures } from '@vuetify/v0'

    const features = useFeatures()

    features.variation('new_ui', 'B') // 'A'
    features.variation('old_ui', 'default') // 'default'
    features.variation('non_existent', 'fallback') // 'fallback'
    features.variation('non_existent') // null
  </script>
