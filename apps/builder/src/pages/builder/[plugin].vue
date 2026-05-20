<script setup lang="ts">
  import { getPluginBySlug } from '@/data/plugins'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { computed, defineAsyncComponent, toRef } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const store = useBuilderStore()

  const meta = toRef(() => {
    const slug = route.params.plugin as string
    return getPluginBySlug(slug)
  })

  if (!meta.value || !store.isPluginSelected(meta.value.id)) {
    router.replace('/builder')
  }

  const Body = computed(() => meta.value ? defineAsyncComponent(meta.value.loader) : null)
</script>

<template>
  <component :is="Body" v-if="Body" />
</template>
