<script setup lang="ts">
  // Composables
  import { usePageMetaOptional, type BenchmarkConfig } from '@/composables/usePageMeta'

  // Utilities
  import { useScrollToAnchor } from '@/utilities/scroll'
  import { toRef } from 'vue'

  const props = defineProps<{
    benchmark?: BenchmarkConfig | null
    clickable?: boolean
  }>()

  const scroll = useScrollToAnchor()
  const pageMeta = usePageMetaOptional()

  const resolvedBenchmark = toRef(() => props.benchmark ?? pageMeta?.benchmark.value ?? null)
  // Default clickable to true only when injecting from context (real page)
  const isClickable = toRef(() => props.clickable ?? (pageMeta?.benchmark.value != null))
</script>

<template>
  <DocsMetaItem
    v-if="resolvedBenchmark"
    :color="resolvedBenchmark.color"
    :href="isClickable ? '#benchmarks' : undefined"
    :icon="resolvedBenchmark.icon"
    :text="resolvedBenchmark.label"
    :title="isClickable ? 'View performance benchmarks' : undefined"
    @click.prevent="isClickable && scroll.scrollToAnchor('benchmarks')"
  />
</template>
