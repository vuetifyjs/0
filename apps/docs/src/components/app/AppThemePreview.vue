<script setup lang="ts">
  // Composables
  import { useCustomThemes } from '@/composables/useCustomThemes'

  // Utilities
  import { computed } from 'vue'

  const props = defineProps<{
    theme: string
  }>()

  const { allThemes } = useCustomThemes()

  const colors = computed(() => {
    const theme = allThemes.value[props.theme]
    if (!theme) return []

    return [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.accent,
      theme.colors.surface,
      theme.colors.background,
    ]
  })
</script>

<template>
  <div class="flex gap-0.5">
    <span
      v-for="(color, i) in colors"
      :key="i"
      class="w-3 h-3 rounded-sm border border-divider/30"
      :style="{ background: color }"
    />
  </div>
</template>
