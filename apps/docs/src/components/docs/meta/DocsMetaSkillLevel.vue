<script setup lang="ts">
  // Composables
  import { usePageMetaOptional, type LevelConfig } from '@/composables/usePageMeta'

  // Utilities
  import { toRef } from 'vue'

  // Constants
  import { SKILL_LEVELS_DOCS_HREF } from '@/constants/links'

  const props = defineProps<{
    level?: LevelConfig | null
  }>()

  const pageMeta = usePageMetaOptional()

  const resolvedLevel = toRef(() => props.level ?? pageMeta?.level.value ?? null)
</script>

<template>
  <DocsMetaItem
    v-if="resolvedLevel"
    :color="resolvedLevel.color"
    :href="SKILL_LEVELS_DOCS_HREF"
    :icon="resolvedLevel.icon"
    :text="resolvedLevel.label"
    :title="`${resolvedLevel.label} skill level — filter by level`"
  />
</template>
