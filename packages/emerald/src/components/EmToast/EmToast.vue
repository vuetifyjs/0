<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  /** Figma "informative" is exposed as `info`. */
  export type EmToastVariant = 'error' | 'success' | 'info' | 'warning'

  export interface EmToastProps extends V0PaperProps {
    variant?: EmToastVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToast' })

  const { variant = 'error', ...paperProps } = defineProps<EmToastProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-toast"
    :data-variant="variant"
    role="status"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
.emerald-toast {
  display: flex;
  align-items: flex-start;
  gap: var(--emerald-spacing-xs);
  min-height: var(--emerald-spacing-4xl);
  width: 100%;
  padding: var(--emerald-spacing-xs);
  border-radius: var(--emerald-radius-s);
  background: var(--emerald-background);
  box-shadow: var(--emerald-shadow-l);
  font-family: var(--emerald-font-sans);
  overflow: clip;
}

/* Figma status/{variant}/icon + status/{variant}/text mapped to the family scales */
.emerald-toast[data-variant="error"] {
  --emerald-toast-icon: var(--emerald-danger-500);
  --emerald-toast-title: var(--emerald-danger-600);
}

.emerald-toast[data-variant="success"] {
  --emerald-toast-icon: var(--emerald-success-600);
  --emerald-toast-title: var(--emerald-success-600);
}

.emerald-toast[data-variant="info"] {
  --emerald-toast-icon: var(--emerald-info-500);
  --emerald-toast-title: var(--emerald-info-600);
}

.emerald-toast[data-variant="warning"] {
  --emerald-toast-icon: var(--emerald-alert-600);
  --emerald-toast-title: var(--emerald-alert-600);
}
</style>
