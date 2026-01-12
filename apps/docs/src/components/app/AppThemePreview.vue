<script setup lang="ts">
  // Utilities
  import { computed } from 'vue'

  // Themes
  import { getPreviewColors, type ThemeId } from '@/themes'

  const props = defineProps<{
    theme: ThemeId
  }>()

  const colors = computed(() => getPreviewColors(props.theme))
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
