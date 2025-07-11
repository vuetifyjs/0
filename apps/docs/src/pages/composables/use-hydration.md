# useHydration

The `useHydration` composable is designed to manage the hydration process of your application. It allows you to control when and how components are hydrated, ensuring that the initial render is optimized for performance and user experience.

## Usage

```ts
// src/app.ts
import { createApp } from 'vue'
import { createHydrationPlugin } from '@vuetify/0'

const app = createApp(App)

app.use(createHydrationPlugin())
```

```vue
// src/components/MyComponent.vue
<template>
  <div v-if="isHydrated">
    <!-- Your component content -->
  </div>
</template>

<script lang="ts" setup>
import { useHydration } from '@vuetify/0'

const { isHydrated } = useHydration()
</script>
```
