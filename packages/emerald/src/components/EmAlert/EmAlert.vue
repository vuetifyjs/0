<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmAlertVariant = 'error' | 'success' | 'info' | 'warning'

  export interface EmAlertProps extends V0PaperProps {
    variant?: EmAlertVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlert' })

  const { variant = 'error', ...paperProps } = defineProps<EmAlertProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-alert"
    :data-variant="variant"
    role="alert"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
.emerald-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--emerald-spacing-xs);
  padding: var(--emerald-spacing-s);
  border-radius: var(--emerald-radius-xl);
  border: var(--emerald-stroke-s) solid var(--emerald-alert-accent);
  box-shadow: var(--emerald-shadow-m);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b2-size);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-surface);
  width: 100%;
}

.emerald-alert[data-variant="error"] {
  --emerald-alert-accent: var(--emerald-status-danger-br);
  background: var(--emerald-status-danger-bg);
}

.emerald-alert[data-variant="success"] {
  /* Figma status/success binds to the primary green family (bg #E7FFF2, border #1FAE60) */
  --emerald-alert-accent: var(--emerald-status-success-br);
  background: var(--emerald-status-success-bg);
}

.emerald-alert[data-variant="info"] {
  --emerald-alert-accent: var(--emerald-status-info-br);
  background: var(--emerald-status-info-bg);
}

.emerald-alert[data-variant="warning"] {
  --emerald-alert-accent: var(--emerald-status-warning-br);
  background: var(--emerald-status-warning-bg);
}
</style>
