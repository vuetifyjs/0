<script setup lang="ts">
  // Composables
  import { usePageMetaOptional, type LevelConfig } from '@/composables/usePageMeta'

  // Utilities
  import { computed } from 'vue'

  const props = defineProps<{
    level?: LevelConfig | null
  }>()

  const pageMeta = usePageMetaOptional()

  const resolvedLevel = computed(() => props.level ?? pageMeta?.level.value ?? null)
</script>

<template>
  <DocsMetaItem
    v-if="resolvedLevel"
    :color="resolvedLevel.color"
    :icon="resolvedLevel.icon"
    :text="resolvedLevel.label"
    :title="`${resolvedLevel.label} skill level`"
  />
</template>
