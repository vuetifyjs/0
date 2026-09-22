<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'
  import { isNumber, isUndefined } from '@vuetify/v0/utilities'

  // Utilities
  import { toRef } from 'vue'

  export type EmBadgeVariant = 'neutral' | 'primary' | 'success' | 'danger' | 'info' | 'warning'

  export interface EmBadgeProps {
    variant?: EmBadgeVariant
    /** Numeric or string content when not using the default slot */
    content?: number | string
    /** Cap numeric content (e.g. max=99 → "99+") */
    max?: number
    /** Render as a small empty status dot */
    dot?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBadge' })

  const {
    variant = 'neutral',
    content,
    max,
    dot = false,
  } = defineProps<EmBadgeProps>()

  const text = toRef(() => {
    if (dot) return ''
    if (isUndefined(content)) return undefined
    if (isNumber(content) && !isUndefined(max) && content > max) {
      return `${max}+`
    }
    return String(content)
  })
</script>

<template>
  <Atom
    as="span"
    class="emerald-badge"
    :data-dot="dot || undefined"
    :data-variant="variant"
  >
    <template v-if="!dot">
      <slot v-if="$slots.default" />
      <template v-else>{{ text }}</template>
    </template>
  </Atom>
</template>

<style>
  .emerald-badge {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--emerald-text-b3-height, 18px);
    min-height: var(--emerald-text-b3-height, 18px);
    padding: 0 var(--emerald-spacing-2xs, 4px);
    border-radius: var(--emerald-radius-full, 999px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: var(--emerald-text-b3-bold-weight, 600);
    line-height: var(--emerald-text-b3-height, 18px);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    vertical-align: middle;
  }

  .emerald-badge[data-dot] {
    min-width: 8px;
    min-height: 8px;
    width: 8px;
    height: 8px;
    padding: 0;
  }

  .emerald-badge[data-variant='neutral'] {
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-neutral-900, #494a4c);
  }

  .emerald-badge[data-variant='primary'] {
    background: var(--emerald-primary-600, #1fae60);
    color: var(--emerald-on-primary, #fefefe);
  }

  .emerald-badge[data-variant='success'] {
    background: var(--emerald-status-success-bg, #e7fff2);
    color: var(--emerald-status-success-br, #1fae60);
  }

  .emerald-badge[data-variant='danger'] {
    background: var(--emerald-status-danger-bg, #ffebee);
    color: var(--emerald-status-danger-br, #c61424);
  }

  .emerald-badge[data-variant='info'] {
    background: var(--emerald-status-info-bg, #e4f2ff);
    color: var(--emerald-status-info-br, #3a70e2);
  }

  .emerald-badge[data-variant='warning'] {
    background: var(--emerald-status-warning-bg, #fff7e1);
    color: var(--emerald-neutral-1000, #2b2d2e);
  }

  .emerald-badge[data-dot][data-variant='neutral'] {
    background: var(--emerald-neutral-400, #aeb6be);
  }

  .emerald-badge[data-dot][data-variant='primary'] {
    background: var(--emerald-primary-600, #1fae60);
  }

  .emerald-badge[data-dot][data-variant='success'] {
    background: var(--emerald-status-success-br, #1fae60);
  }

  .emerald-badge[data-dot][data-variant='danger'] {
    background: var(--emerald-status-danger-br, #c61424);
  }

  .emerald-badge[data-dot][data-variant='info'] {
    background: var(--emerald-status-info-br, #3a70e2);
  }

  .emerald-badge[data-dot][data-variant='warning'] {
    background: var(--emerald-status-warning-br, #ffcf06);
  }
</style>
