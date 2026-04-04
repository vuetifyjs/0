<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { Feature } from '@/data/types'

  const {
    feature,
    active = false,
    auto = false,
  } = defineProps<{
    feature: Feature
    active?: boolean
    auto?: boolean
  }>()

  const maturityClass = toRef(() => {
    if (feature.maturity === 'stable') return 'bg-success/20 text-success'
    if (feature.maturity === 'preview') return 'bg-info/20 text-info'
    return 'bg-warning/20 text-warning'
  })
</script>

<template>
  <button
    class="flex items-start gap-3 p-4 rounded-lg border text-left transition-all w-full"
    :class="[
      auto
        ? 'border-dashed border-divider bg-surface/50 opacity-70 cursor-default'
        : active
          ? 'border-primary bg-surface-tint cursor-pointer'
          : 'border-divider bg-surface hover:border-primary cursor-pointer',
    ]"
    :disabled="auto"
  >
    <div
      class="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5 text-xs"
      :class="[
        auto
          ? 'bg-surface-variant text-on-surface-variant'
          : active
            ? 'bg-primary text-on-primary'
            : 'bg-surface-variant text-on-surface-variant',
      ]"
    >
      <template v-if="auto">&#8599;</template>
      <template v-else-if="active">&#10003;</template>
      <template v-else>&#9675;</template>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="font-semibold text-on-surface">{{ feature.name }}</span>
        <span class="text-xs px-1.5 py-0.5 rounded-full" :class="maturityClass">
          {{ feature.maturity }}
        </span>
        <span v-if="auto" class="text-xs text-on-surface-variant">auto-included</span>
      </div>
      <p class="text-sm text-on-surface-variant">{{ feature.summary }}</p>
      <p v-if="feature.useCases.length > 0" class="text-xs text-on-surface-variant/70 mt-1">
        {{ feature.useCases.join(' &middot; ') }}
      </p>
    </div>
  </button>
</template>
