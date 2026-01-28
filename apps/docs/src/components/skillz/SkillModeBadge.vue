<script setup lang="ts">
  // Utilities
  import { computed } from 'vue'

  // Types
  import type { SkillMode } from '@/types/skill'

  import { SKILL_MODE_META } from '@/types/skill'

  const props = withDefaults(defineProps<{
    /** Skill mode ('guided' or 'interactive') */
    mode: SkillMode
    /** Show the mode icon */
    showIcon?: boolean
    /** Show the mode label */
    showLabel?: boolean
    /** Icon size in pixels */
    iconSize?: number
  }>(), {
    showIcon: true,
    showLabel: true,
    iconSize: 14,
  })

  const meta = computed(() => SKILL_MODE_META[props.mode])
</script>

<template>
  <span
    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
    :style="{
      background: `color-mix(in srgb, ${meta.color} 15%, transparent)`,
      color: meta.color,
    }"
    :title="meta.description"
  >
    <AppIcon v-if="showIcon" :icon="meta.icon" :size="iconSize" />
    <span v-if="showLabel">{{ meta.label }}</span>
  </span>
</template>
