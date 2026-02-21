<script setup lang="ts">
  // Components
  import DocsBadge from '@/components/docs/DocsBadge.vue'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { SkillMode } from '@/types/skill'

  import { SKILL_MODE_META } from '@/types/skill'

  const { mode, showIcon = true, showLabel = true, iconSize = 14 } = defineProps<{
    /** Skill mode ('guided' or 'interactive') */
    mode: SkillMode
    /** Show the mode icon */
    showIcon?: boolean
    /** Show the mode label */
    showLabel?: boolean
    /** Icon size in pixels */
    iconSize?: number
  }>()

  const meta = computed(() => SKILL_MODE_META[mode])
</script>

<template>
  <DocsBadge
    :color="meta.color"
    :icon="meta.icon"
    :icon-size="iconSize"
    :label="meta.label"
    :show-icon="showIcon"
    :show-label="showLabel"
    :title="meta.description"
  />
</template>
