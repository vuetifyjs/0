<script setup lang="ts">
  // Framework
  import { toArray } from '@vuetify/v0'

  import { getPluginBySlug } from '@/data/plugins'

  // Utilities
  import { defineAsyncComponent, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute('/builder/[plugin]')

  // Repeatable params type as string | string[]; this route has exactly one segment.
  const meta = toRef(() => getPluginBySlug(toArray(route.params.plugin)[0] ?? ''))

  const Body = toRef(() => meta.value ? defineAsyncComponent(meta.value.loader) : null)
</script>

<template>
  <component :is="Body" v-if="Body" />
</template>
