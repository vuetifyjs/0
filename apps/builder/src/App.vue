<script setup lang="ts">
  // Components
  import AppShell from '@/components/app/AppShell.vue'
  import PreviewPane from '@/components/preview/PreviewPane.vue'

  // Utilities
  import { toRef } from 'vue'
  import { RouterView, useRoute } from 'vue-router'

  const route = useRoute()

  const split = toRef(() => route.path.startsWith('/builder'))
</script>

<template>
  <AppShell :split>
    <RouterView />

    <template #preview>
      <PreviewPane />
    </template>
  </AppShell>
</template>
