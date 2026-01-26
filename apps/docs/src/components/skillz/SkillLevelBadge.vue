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
    class="skill-level-badge"
    :style="{ '--level-color': meta.color }"
    :title="meta.label"
  >
    <AppIcon v-if="showIcon" :icon="meta.icon" :size="iconSize" />
    <span v-if="showLabel">{{ meta.label }}</span>
  </span>
</template>

<style scoped>
.skill-level-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--level-color) 15%, transparent);
  color: var(--level-color);
}
</style>
