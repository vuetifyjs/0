<script setup lang="ts">
  // Composables
  import { TIER_CONFIG, type Tier } from '@/composables/useBenchmarkData'

  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    tier: Tier
    size?: 'sm' | 'md'
  }>()

  const config = toRef(() => TIER_CONFIG[props.tier])
</script>

<template>
  <span
    :aria-label="`${config.label} performance tier`"
    class="inline-flex items-center gap-1 font-medium"
    :class="[
      config.color,
      size === 'sm' ? 'text-xs' : 'text-sm',
    ]"
  >
    <AppIcon :icon="config.icon" :size="size === 'sm' ? 14 : 16" />
    <span>{{ config.label }}</span>
  </span>
</template>
