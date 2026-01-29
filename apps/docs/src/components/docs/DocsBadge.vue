<script setup lang="ts">
  // Utilities
/**
   * Unified badge component for displaying colored labels with optional icons.
   * Consolidates patterns from SkillLevelBadge, SkillModeBadge, SkillCategoryTags.
   */
  import { computed } from 'vue'

  const props = withDefaults(defineProps<{
    /** Badge text label */
    label: string
    /** Icon name (optional) */
    icon?: string
    /** Color value (CSS color or CSS variable) */
    color?: string
    /** Background opacity percentage (0-100) */
    backgroundOpacity?: number
    /** Show the icon */
    showIcon?: boolean
    /** Show the label text */
    showLabel?: boolean
    /** Icon size in pixels */
    iconSize?: number
    /** Badge shape */
    shape?: 'rounded' | 'pill'
    /** Tooltip text */
    title?: string
  }>(), {
    backgroundOpacity: 15,
    showIcon: true,
    showLabel: true,
    iconSize: 14,
    shape: 'rounded',
  })

  const badgeStyle = computed(() => {
    if (!props.color) return undefined
    return {
      background: `color-mix(in srgb, ${props.color} ${props.backgroundOpacity}%, transparent)`,
      color: props.color,
    }
  })

  const shapeClass = computed(() => props.shape === 'pill' ? 'rounded-full' : 'rounded')
</script>

<template>
  <span
    class="badge-base"
    :class="shapeClass"
    :style="badgeStyle"
    :title="title"
  >
    <AppIcon v-if="icon && showIcon" :icon="icon" :size="iconSize" />
    <span v-if="showLabel">{{ label }}</span>
  </span>
</template>
