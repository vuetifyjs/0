<script lang="ts" setup>
  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { onUnmounted } from 'vue'

  // Types
  import type { Component } from 'vue'

  const props = defineProps<{
    component?: Component
    html?: string
  }>()

  const playground = usePlayground()

  const ticket = playground.register({ id: 'markdown' })

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })
</script>

<template>
  <div class="markdown-body flex-1 min-h-0 overflow-y-auto px-5 py-4">
    <component
      :is="props.component"
      v-if="props.component"
    />

    <div
      v-else-if="props.html"
      v-html="props.html"
    />
  </div>
</template>
