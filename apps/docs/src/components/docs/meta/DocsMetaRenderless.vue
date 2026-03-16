<script setup lang="ts">
  // Composables
  import { usePageMetaOptional } from '@/composables/usePageMeta'

  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    renderless?: boolean
  }>()

  const pageMeta = usePageMetaOptional()

  const resolvedRenderless = toRef(() => props.renderless ?? pageMeta?.renderless.value)
</script>

<template>
  <DocsMetaItem
    v-if="resolvedRenderless === true"
    color="text-secondary"
    icon="renderless"
    text="Renderless"
    title="Component renders no DOM element by default"
  />

  <DocsMetaItem
    v-else-if="resolvedRenderless === false"
    color="text-secondary"
    icon="layers"
    text="Renders element"
    title="Component renders a DOM element by default"
  />
</template>
