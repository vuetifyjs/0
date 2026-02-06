<script setup lang="ts">
  // Types
  import type { NormalizedComposable } from '@/composables/useBenchmarkData'

  defineProps<{
    composables: NormalizedComposable[]
    selectedComposables: string[]
  }>()

  const emit = defineEmits<{
    select: [name: string]
  }>()

  function isSelected (name: string, selected: string[]): boolean {
    return selected.length > 0 && selected.includes(name)
  }
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
    <button
      v-for="c in composables"
      :key="c.name"
      :aria-pressed="isSelected(c.name, selectedComposables)"
      class="text-left border rounded-lg p-3 transition-all duration-200"
      :class="isSelected(c.name, selectedComposables)
        ? 'border-primary bg-surface-tint'
        : 'border-divider bg-surface hover:border-primary/50'"
      role="button"
      @click="emit('select', c.name)"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold text-on-surface">{{ c.name }}</span>
        <BenchmarkTierBadge size="sm" :tier="c.tier" />
      </div>

      <div class="text-xs text-on-surface-variant space-y-0.5">
        <div>{{ c.benchmarkCount }} benchmarks &middot; {{ c.groupCount }} groups</div>
        <div class="font-mono truncate" :title="c.fastest.name">
          {{ c.fastest.hzLabel }}
        </div>
      </div>
    </button>
  </div>
</template>
