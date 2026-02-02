<script setup lang="ts">
  // Composables
  import { useCustomThemes } from '@/composables/useCustomThemes'

  // Utilities
  import { computed } from 'vue'

  const props = defineProps<{
    theme: string
  }>()

  const themes = useCustomThemes()

  const colors = computed(() => {
    const t = themes.allThemes.value[props.theme]
    if (!t) return []

    return [
      t.colors.primary,
      t.colors.secondary,
      t.colors.accent,
      t.colors.surface,
      t.colors.background,
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
