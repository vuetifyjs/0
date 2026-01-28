<script setup lang="ts">
  // Utilities
  import { computed } from 'vue'

  // Types
  import type { SkillLevel } from '@/types/skill'

  import { SKILL_LEVEL_META } from '@/types/skill'

  const props = withDefaults(defineProps<{
    /** Skill level (1, 2, or 3) */
    level: SkillLevel
    /** Show the level icon */
    showIcon?: boolean
    /** Show the level label */
    showLabel?: boolean
    /** Icon size in pixels */
    iconSize?: number
  }>(), {
    showIcon: true,
    showLabel: true,
    iconSize: 14,
  })

  const meta = computed(() => SKILL_LEVEL_META[props.level])
</script>

<template>
  <span
    class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
    :style="{
      background: `color-mix(in srgb, ${meta.color} 15%, transparent)`,
      color: meta.color,
    }"
    :title="meta.title"
  >
    <AppIcon v-if="showIcon" :icon="meta.icon" :size="iconSize" />
    <span v-if="showLabel">{{ meta.label }}</span>
  </span>
</template>
