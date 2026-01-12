<script setup lang="ts">
  // Composables
  import { useLevelFilterContext, type Level } from '@/composables/useLevelFilter'

  // Utilities
  import { computed } from 'vue'

  const props = defineProps<{
    level: Level
  }>()

  const { toggle, isSelected } = useLevelFilterContext()

  const checked = computed(() => isSelected(props.level))

  const colorClass = computed(() => {
    switch (props.level) {
      case 1: {
        return 'bg-success border-success'
      }
      case 2: {
        return 'bg-info border-info'
      }
      case 3: {
        return 'bg-warning border-warning'
      }
      default: {
        return 'bg-surface border-divider'
      }
    }
  })
</script>

<template>
  <button
    :aria-pressed="checked"
    class="w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors"
    :class="checked ? colorClass : 'border-divider hover:border-on-surface-variant'"
    title="Toggle filter"
    type="button"
    @click="toggle(level)"
  >
    <AppIcon v-if="checked" class="text-white" icon="check" size="14" />
  </button>
</template>
