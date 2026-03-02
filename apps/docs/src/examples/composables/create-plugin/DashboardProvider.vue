<script setup lang="ts">
  import { createDashboardPlugin, provideDashboard } from './plugin'

  const context = createDashboardPlugin({
    app: 'My Dashboard',
  })

  // In a real app you'd call app.use(createDashboardPlugin()).
  // Here we simulate the plugin by directly providing the context.
  provideDashboard(context)
</script>

<template>
  <slot />
</template>
