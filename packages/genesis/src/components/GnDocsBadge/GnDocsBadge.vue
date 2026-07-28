<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export interface GnDocsBadgeProps {
    /** Any CSS color value (e.g. `var(--v0-primary)`) driving the tinted background + matching text. Omit for a neutral badge. */
    color?: string
    /** Background tint strength as a color-mix percentage (0-100). */
    backgroundOpacity?: number
    /** Badge shape. */
    shape?: 'rounded' | 'pill'
    /** Native tooltip text. */
    title?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'GnDocsBadge' })

  const {
    color,
    backgroundOpacity = 15,
    shape = 'rounded',
    title,
  } = defineProps<GnDocsBadgeProps>()

  const badgeStyle = toRef(() => {
    if (!color) return undefined
    return {
      background: `color-mix(in srgb, ${color} ${backgroundOpacity}%, transparent)`,
      color,
    }
  })
</script>

<template>
  <span
    class="genesis-docs-badge"
    :data-shape="shape"
    :style="badgeStyle"
    :title
  >
    <span v-if="$slots.icon" aria-hidden="true" class="genesis-docs-badge__icon">
      <slot name="icon" />
    </span>

    <slot />
  </span>
</template>

<style scoped>
  .genesis-docs-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    color: var(--v0-on-surface-variant, rgb(0 0 0 / 0.6));
    background: color-mix(in srgb, var(--v0-on-surface, #1a1c1e) 8%, transparent);
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1rem;
    white-space: nowrap;
  }

  .genesis-docs-badge[data-shape='pill'] {
    border-radius: 9999px;
  }

  .genesis-docs-badge__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .genesis-docs-badge__icon:empty {
    display: none;
  }
</style>
