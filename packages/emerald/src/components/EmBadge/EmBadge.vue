<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmBadgeVariant = 'default' | 'alert'
  export type EmBadgeShape = 'dot' | 'indicator' | 'count'

  export interface EmBadgeProps extends V0PaperProps {
    variant?: EmBadgeVariant
    shape?: EmBadgeShape
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBadge' })

  const {
    variant = 'default',
    shape = 'indicator',
    ...paperProps
  } = defineProps<EmBadgeProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="span"
    class="emerald-badge"
    :data-shape="shape"
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
  box-sizing: border-box;
  white-space: nowrap;
  border: var(--emerald-stroke-m) solid var(--emerald-background);
  border-radius: var(--emerald-radius-full);
  box-shadow: var(--emerald-shadow-badge);
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
  padding: 0 var(--emerald-spacing-2xs);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b3-size);
  line-height: var(--emerald-text-b3-height);
  font-weight: var(--emerald-text-b3-bold-weight);
}

/* Colorways */
.emerald-badge[data-variant="default"] {
  background: var(--emerald-primary-600);
  color: var(--emerald-on-primary);
}

.emerald-badge[data-variant="alert"] {
  background: var(--emerald-danger-400);
  color: var(--emerald-on-danger);
}
</style>
