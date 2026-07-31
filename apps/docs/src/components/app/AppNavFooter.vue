<script setup lang="ts">
  // Framework
  import { useFeatures } from '@vuetify/v0'

  // Composables
  import { useFreshness } from '@/composables/useFreshness'

  // Utilities
  import { toRef } from 'vue'

  const { overall } = useFreshness()
  const devmode = useFeatures().get('devmode')

  const freshnessLabel = toRef(() => `Docs freshness: ${overall.value} out of 100. Click for details.`)
</script>

<template>
  <div class="shrink-0 p-2 border-t border-divider/50 flex items-center justify-between gap-2">
    <AppVersionChip />

    <AppTooltip
      v-if="devmode?.isSelected.value"
      as="span"
      class="inline-flex"
      :text="freshnessLabel"
    >
      <router-link
        :aria-label="freshnessLabel"
        class="inline-flex items-center justify-center w-7 h-7 rounded-lg hover:bg-surface-tint transition-colors"
        to="/health"
      >
        <AppIcon icon="freshness-avocado" :size="22" />
      </router-link>
    </AppTooltip>
  </div>
</template>
