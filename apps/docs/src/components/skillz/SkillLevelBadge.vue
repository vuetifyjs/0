<script setup lang="ts">
  // Components
  import DocsBadge from '@/components/docs/DocsBadge.vue'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { SkillLevel } from '@/types/skill'

  import { SKILL_LEVEL_META } from '@/types/skill'

  const { level, showIcon = true, showLabel = true, iconSize = 14 } = defineProps<{
    /** Skill level (1, 2, or 3) */
    level: SkillLevel
    /** Show the level icon */
    showIcon?: boolean
    /** Show the level label */
    showLabel?: boolean
    /** Icon size in pixels */
    iconSize?: number
  }>()

  const meta = computed(() => SKILL_LEVEL_META[level])
</script>

<template>
  <DocsBadge
    :color="meta.color"
    :icon="meta.icon"
    :icon-size="iconSize"
    :label="meta.label"
    :show-icon="showIcon"
    :show-label="showLabel"
    :title="meta.title"
  />
</template>
