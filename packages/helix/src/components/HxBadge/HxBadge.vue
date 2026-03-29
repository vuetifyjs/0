<script lang="ts">
  // Types
  import type { Extensible } from '@vuetify/v0/types'

  export interface HxBadgeProps {
    /** Semantic color name or arbitrary CSS color value */
    color?: Extensible<'primary' | 'success' | 'warning' | 'error' | 'info'>
    variant?: 'solid' | 'outlined' | 'subtle'
    size?: 'sm' | 'md'
    /** Text label (alternative to default slot) */
    label?: string
    /** Badge shape */
    shape?: 'rounded' | 'pill'
    /** Background opacity percentage for arbitrary colors (0-100) */
    backgroundOpacity?: number
    /** Tooltip text */
    title?: string
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'HxBadge' })

  const SEMANTIC_COLORS = new Set(['primary', 'success', 'warning', 'error', 'info'])

  const {
    color = 'primary',
    variant = 'subtle',
    size = 'sm',
    label,
    shape = 'pill',
    backgroundOpacity = 15,
    title,
  } = defineProps<HxBadgeProps>()

  const isSemantic = toRef(() => SEMANTIC_COLORS.has(color))

  const customStyle = toRef(() => {
    if (isSemantic.value) return undefined
    return {
      background: `color-mix(in srgb, ${color} ${backgroundOpacity}%, transparent)`,
      color,
    }
  })
</script>

<template>
  <span
    class="helix-badge"
    :data-color="isSemantic ? color : undefined"
    :data-shape="shape"
    :data-size="size"
    :data-variant="isSemantic ? variant : undefined"
    :style="customStyle"
    :title
  >
    <slot>{{ label }}</slot>
  </span>
</template>

<style scoped>
  .helix-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
  }

  .helix-badge[data-shape='pill'] {
    border-radius: 9999px;
  }

  .helix-badge[data-shape='rounded'] {
    border-radius: 0.25rem;
  }

  .helix-badge[data-size='sm'] {
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
  }

  .helix-badge[data-size='md'] {
    padding: 0.25rem 0.625rem;
    font-size: 0.8125rem;
  }
</style>
