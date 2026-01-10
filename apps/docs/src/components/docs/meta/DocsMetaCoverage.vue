<script setup lang="ts">
  // Composables
  import { usePageMetaOptional, type CoverageConfig } from '@/composables/usePageMeta'

  // Utilities
  import { computed } from 'vue'

  const props = defineProps<{
    coverage?: CoverageConfig | null
    href?: string | null
    title?: string
  }>()

  const pageMeta = usePageMetaOptional()

  const resolvedCoverage = computed(() => props.coverage ?? pageMeta?.coverage.value ?? null)
  const resolvedHref = computed(() => props.href ?? pageMeta?.testFileLink.value ?? null)
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
