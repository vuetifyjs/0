<script setup lang="ts">
  // Composables
  import { usePageMetaOptional, type CoverageConfig } from '@/composables/usePageMeta'

  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    coverage?: CoverageConfig | null
    href?: string | null
    title?: string
  }>()

  const pageMeta = usePageMetaOptional()

  const resolvedCoverage = toRef(() => props.coverage ?? pageMeta?.coverage.value ?? null)
  const resolvedHref = toRef(() => props.href ?? pageMeta?.testFileLink.value ?? null)
</script>

<template>
  <DocsMetaItem
    v-if="resolvedCoverage"
    :color="resolvedCoverage.color"
    :href="resolvedHref ?? undefined"
    icon="test"
    :text="resolvedCoverage.label"
    :title="title"
  />
</template>
