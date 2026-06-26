<script setup lang="ts">
  // Components
  import DocsBadge from '@/components/docs/DocsBadge.vue'

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
  <DocsBadge
    :color="meta.color"
    :icon="meta.icon"
    :icon-size
    :label="meta.label"
    :show-icon
    :show-label
    :title="meta.description"
  />
</template>
