<script setup lang="ts">
  // Framework
  import { SplitterPanel } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { onMounted, onUnmounted } from 'vue'

  const playground = usePlayground()

  const ticket = playground.register({ id: 'playground-right' })

  onMounted(() => ticket.select())

  onUnmounted(() => {
    playground.unregister(ticket.id)
  })
</script>

<template>
  <SplitterPanel :default-size="70" :min-size="55">
    <div
      v-if="ticket.isSelected.value"
      class="bg-surface h-full min-w-0"
    >
      <slot />
    </div>
  </SplitterPanel>
</template>
