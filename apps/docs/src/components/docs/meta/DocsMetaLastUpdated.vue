<script setup lang="ts">
  // Composables
  import { usePageMetaOptional } from '@/composables/usePageMeta'

  // Utilities
  import { computed } from 'vue'

  const props = defineProps<{
    date?: string | null
  }>()

  const pageMeta = usePageMetaOptional()

  const resolvedDate = computed(() => props.date ?? pageMeta?.lastUpdated.value ?? null)
</script>

<template>
  <DocsMetaItem
    v-if="resolvedDate"
    color="text-secondary"
    icon="calendar-clock"
    :text="resolvedDate"
    title="Last updated"
  />
</template>
