<script setup lang="ts">
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Composables
  import { useFreshness, scoreToColor } from '@/composables/useFreshness'

  // Utilities
  import { toRef } from 'vue'

  const { overall } = useFreshness()

  const tint = toRef(() => scoreToColor(overall.value))

  const ariaLabel = toRef(() => `Docs freshness: ${overall.value} out of 100. Click for details.`)
</script>

<template>
  <router-link
    :aria-label
    class="flex items-center justify-center border-t border-divider py-3 hover:bg-surface-variant-50 transition-colors"
    to="/health"
  >
    <span class="inline-flex" :style="{ color: tint }">
      <AppIcon icon="freshness-avocado" :size="28" />
    </span>
  </router-link>
</template>
