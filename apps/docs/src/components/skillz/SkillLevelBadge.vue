<script setup lang="ts">
  // Framework
  import { GnDocsBadge } from '@paper/genesis'

  import { SKILL_LEVEL_META } from '@/types/skill'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { SkillLevel } from '@/types/skill'

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
  <AppTooltip as="span" :text="meta.title">
    <GnDocsBadge :color="meta.color">
      <template v-if="showIcon" #icon>
        <AppIcon :icon="meta.icon" :size="iconSize" />
      </template>

      <template v-if="showLabel">{{ meta.label }}</template>
    </GnDocsBadge>
  </AppTooltip>
</template>
