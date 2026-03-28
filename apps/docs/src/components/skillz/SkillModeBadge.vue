<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { SkillMode } from '@/types/skill'

  import { SKILL_MODE_META } from '@/types/skill'

  const {
    mode,
    showIcon = true,
    showLabel = true,
    iconSize = 14,
  } = defineProps<{
    /** Skill mode ('guided' or 'interactive') */
    mode: SkillMode
    /** Show the mode icon */
    showIcon?: boolean
    /** Show the mode label */
    showLabel?: boolean
    /** Icon size in pixels */
    iconSize?: number
  }>()

  const meta = toRef(() => SKILL_MODE_META[mode])
</script>

<template>
  <HxBadge
    :background-opacity="15"
    :color="meta.color"
    shape="rounded"
    :title="meta.description"
  >
    <AppIcon v-if="showIcon" :icon="meta.icon" :size="iconSize" />
    <span v-if="showLabel">{{ meta.label }}</span>
  </HxBadge>
</template>
