<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { SkillLevel } from '@/types/skill'

  import { SKILL_LEVEL_META } from '@/types/skill'

  const {
    level,
    showIcon = true,
    showLabel = true,
    iconSize = 14,
  } = defineProps<{
    /** Skill level (1, 2, or 3) */
    level: SkillLevel
    /** Show the level icon */
    showIcon?: boolean
    /** Show the level label */
    showLabel?: boolean
    /** Icon size in pixels */
    iconSize?: number
  }>()

  const meta = toRef(() => SKILL_LEVEL_META[level])
</script>

<template>
  <HxBadge
    :background-opacity="15"
    :color="meta.color"
    shape="rounded"
    :title="meta.title"
  >
    <AppIcon v-if="showIcon" :icon="meta.icon" :size="iconSize" />
    <span v-if="showLabel">{{ meta.label }}</span>
  </HxBadge>
</template>
