<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmBadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  export type EmBadgeSize = 'sm' | 'md' | 'lg'
  export type EmBadgeShape = 'pill' | 'dot' | 'indicator' | 'count'

  export interface EmBadgeProps extends V0PaperProps {
    variant?: EmBadgeVariant
    size?: EmBadgeSize
    shape?: EmBadgeShape
    /** @deprecated use `shape="dot"` */
    dot?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBadge' })

  const {
    variant = 'primary',
    size = 'md',
    shape,
    dot = false,
    ...paperProps
  } = defineProps<EmBadgeProps>()

  const resolvedShape = shape ?? (dot ? 'dot' : 'pill')
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="span"
    class="emerald-badge"
    :data-shape="resolvedShape"
    :data-size="size"
    :data-variant="variant"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
.emerald-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 700;
  border-radius: 9999px;
  white-space: nowrap;
  line-height: 1;
}

/* Pill (text label) — default */
.emerald-badge[data-shape="pill"][data-size="sm"] {
  padding: 2px 6px;
  font-size: 10px;
  line-height: 14px;
}

.emerald-badge[data-shape="pill"][data-size="md"] {
  padding: 3px 8px;
  font-size: 12px;
  line-height: 16px;
}

.emerald-badge[data-shape="pill"][data-size="lg"] {
  padding: 4px 10px;
  font-size: 14px;
  line-height: 18px;
}

/* Notification indicator variants — bordered + shadowed per Figma spec */
.emerald-badge[data-shape="dot"],
.emerald-badge[data-shape="indicator"],
.emerald-badge[data-shape="count"] {
  border: 2px solid var(--emerald-background, #faf9ff);
  box-shadow:
    0 3px 8px 0 rgb(5 0 18 / 0.13),
    0 2px 4px 0 rgb(5 0 18 / 0.10);
  padding: 0;
  overflow: hidden;
}

/* Dot — 8px */
.emerald-badge[data-shape="dot"] {
  width: 8px;
  height: 8px;
}

/* Indicator — 12px (Figma "Default") */
.emerald-badge[data-shape="indicator"] {
  width: 12px;
  height: 12px;
}

/* Count — 20px with numeric content (Figma "Content") */
.emerald-badge[data-shape="count"] {
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 700;
  color: #000;
}

/* Variants — background color only; border/shadow handled above */
.emerald-badge[data-variant="primary"] {
  background: var(--emerald-primary-500);
  color: var(--emerald-primary-100);
}

.emerald-badge[data-variant="success"] {
  background: var(--emerald-success-500);
  color: #fff;
}

.emerald-badge[data-variant="warning"] {
  background: var(--emerald-warning-500);
  color: #fff;
}

.emerald-badge[data-variant="error"] {
  background: var(--emerald-error-500);
  color: #fff;
}

.emerald-badge[data-variant="info"] {
  background: var(--emerald-info-500);
  color: #fff;
}

.emerald-badge[data-variant="neutral"] {
  background: var(--emerald-neutral-200);
  color: var(--emerald-neutral-800);
}

/* Count content keeps black text regardless of variant (per Figma) */
.emerald-badge[data-shape="count"] {
  color: #000;
}
</style>
