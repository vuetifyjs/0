<script setup lang="ts">
  // Composables
  import { usePageMetaOptional } from '@/composables/usePageMeta'

  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    date?: string | null
    commit?: { hash: string, url: string } | null
  }>()

  const pageMeta = usePageMetaOptional()

  const resolvedDate = toRef(() => props.date ?? pageMeta?.lastUpdated.value ?? null)
  const resolvedCommit = toRef(() => props.commit ?? pageMeta?.lastCommit.value ?? null)
</script>

<template>
  <DocsMetaItem
    v-if="resolvedDate"
    color="text-secondary"
    :href="resolvedCommit?.url"
    icon="calendar-clock"
    :text="resolvedDate"
    :title="resolvedCommit ? `Last updated in: ${resolvedCommit.hash}` : 'Last updated'"
  />
</template>
