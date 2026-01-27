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
    class="skill-mode-badge"
    :style="{ '--mode-color': meta.color }"
    :title="meta.description"
  >
    <AppIcon v-if="showIcon" :icon="meta.icon" :size="iconSize" />
    <span v-if="showLabel">{{ meta.label }}</span>
  </span>
</template>

<style scoped>
.skill-mode-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--mode-color) 15%, transparent);
  color: var(--mode-color);
}
</style>
