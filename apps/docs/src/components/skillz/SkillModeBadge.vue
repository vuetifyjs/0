<script setup lang="ts">
  // Framework
  import { GnDocsBadge } from '@paper/genesis'

  import { SKILL_MODE_META } from '@/types/skill'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { SkillMode } from '@/types/skill'

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
  <AppTooltip as="span" :text="meta.description">
    <GnDocsBadge :color="meta.color">
      <template v-if="showIcon" #icon>
        <AppIcon :icon="meta.icon" :size="iconSize" />
      </template>

      <template v-if="showLabel">{{ meta.label }}</template>
    </GnDocsBadge>
  </AppTooltip>
</template>
