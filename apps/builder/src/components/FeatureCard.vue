<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { Feature } from '@/data/types'

  const {
    feature,
    active = false,
    auto = false,
    reason,
  } = defineProps<{
    feature: Feature
    active?: boolean
    auto?: boolean
    reason?: string
  }>()

  const maturityClass = toRef(() => {
    if (feature.maturity === 'stable') return 'bg-success/20 text-success'
    if (feature.maturity === 'preview') return 'bg-info/20 text-info'
    return 'bg-warning/20 text-warning'
  })
</script>

<template>
  <button
    class="flex items-start gap-3 p-4 rounded-lg border text-left w-full"
    :class="[
      auto && !active
        ? 'border-dashed border-divider bg-surface/50 opacity-70 cursor-pointer transition-all hover:opacity-100'
        : active
          ? 'border-primary bg-primary/5 ring-1 ring-primary/30 cursor-pointer transition-all hover:shadow-sm'
          : 'border-divider bg-surface cursor-pointer transition-all hover:shadow-sm hover:border-primary',
    ]"
  >
    <!-- Checkbox indicator -->
    <div class="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
      <template v-if="auto && !active">
        <svg class="w-5 h-5 text-on-surface-variant" fill="none" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="currentColor"
            stroke-dasharray="3 2"
            stroke-width="1.5"
          />
          <path d="M8 7l4 3-4 3" fill="currentColor" />
        </svg>
      </template>
      <template v-else-if="active">
        <svg class="w-5 h-5" viewBox="0 0 20 20">
          <circle
            class="text-primary"
            cx="10"
            cy="10"
            fill="currentColor"
            r="10"
          />
          <path
            class="text-on-primary"
            d="M6 10l3 3 5-5"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </template>
      <template v-else>
        <svg class="w-5 h-5 text-on-surface-variant/50" fill="none" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
      </template>
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <span class="font-semibold text-on-surface">{{ feature.name }}</span>
        <span class="font-semibold text-xs px-2 py-0.5 rounded-full" :class="maturityClass">
          {{ feature.maturity }}
        </span>
        <span v-if="auto && !active" class="text-xs text-on-surface-variant">
          needed by {{ reason ?? 'another feature' }}
        </span>
      </div>

      <p class="text-sm text-on-surface-variant">
        {{ feature.description || feature.summary }}
      </p>

      <p v-if="feature.useCases.length > 0" class="text-xs text-on-surface-variant/70 mt-1">
        Build: {{ feature.useCases.join(', ') }}
      </p>
    </div>
  </button>
</template>
