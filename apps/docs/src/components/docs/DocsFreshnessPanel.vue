<script setup lang="ts">
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Composables
  import { useFreshness } from '@/composables/useFreshness'

  // Utilities
  import { toRef } from 'vue'

  const { overall } = useFreshness()

  const ariaLabel = toRef(() => `Docs freshness: ${overall.value} out of 100. Click for details.`)
</script>

<template>
  <router-link
    :aria-label
    class="flex items-center justify-center border-t border-divider py-3 hover:bg-surface-variant-50 transition-colors"
    to="/health"
  >
    <AppIcon icon="freshness-avocado" :size="28" />
  </router-link>
</template>
