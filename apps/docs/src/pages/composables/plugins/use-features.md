---
title: useFeatures - Feature Flags and Variations for Vue 3
meta:
- name: description
  content: Manage feature flags and variations for A/B testing. Toggle features dynamically and query per-feature variations with automatic selection state for Vue 3.
- name: keywords
  content: features, feature flags, variations, A/B testing, plugin, Vue 3, composable, toggles
features:
  category: Plugin
  label: 'E: useFeatures'
  github: /composables/useFeatures/
  level: 2
related:
  - /composables/registration/create-tokens
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
<script setup lang="ts">
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
<script setup lang="ts">
  import { useFeatures } from '@vuetify/v0'

  const features = useFeatures()

  // Register at runtime
  features.register({ id: 'beta', value: false })

  // Enable/disable via selection helpers
  features.select('beta')
  features.unselect('analytics')
</script>
```

## Architecture

`useFeatures` extends `useGroup` for multi-selection and `useTokens` for variations:

```mermaid "Features Hierarchy"
flowchart TD
  useRegistry --> useSelection
  useSelection --> useGroup
  useGroup --> useFeatures
  useTokens --> useFeatures
```

<DocsApi />
