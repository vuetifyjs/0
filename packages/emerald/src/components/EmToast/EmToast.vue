<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmToastVariant = 'primary' | 'success' | 'error' | 'info' | 'warning' | 'neutral'

  export interface EmToastProps extends V0PaperProps {
    variant?: EmToastVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToast' })

  const { variant = 'primary', ...paperProps } = defineProps<EmToastProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    aria-live="polite"
    as="div"
    class="emerald-toast"
    :data-variant="variant"
    role="status"
  >
    <slot />
  </V0Paper>
</template>

<style>
.emerald-toast {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  width: 258px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: #ffffff;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  overflow: hidden;
}

.emerald-toast[data-variant="primary"] {
  border-color: var(--emerald-primary-50, #f5f3ff);
  box-shadow: 0 8px 20px 0 rgb(124 92 246 / 0.13), 0 3px 6px 0 rgb(124 92 246 / 0.09);
  color: var(--emerald-primary-950, #221065);
}

.emerald-toast[data-variant="success"] {
  border-color: var(--emerald-success-50, #f1fcf5);
  box-shadow: 0 8px 20px 0 rgb(30 122 74 / 0.13), 0 3px 6px 0 rgb(30 122 74 / 0.09);
  color: var(--emerald-success-950, #082b1b);
}

.emerald-toast[data-variant="error"] {
  border-color: var(--emerald-error-50, #fdf4f3);
  box-shadow: 0 8px 20px 0 rgb(192 57 43 / 0.13), 0 3px 6px 0 rgb(192 57 43 / 0.09);
  color: var(--emerald-error-950, #41130e);
}

.emerald-toast[data-variant="info"] {
  border-color: var(--emerald-info-50, #f3f6fc);
  box-shadow: 0 8px 20px 0 rgb(42 95 165 / 0.13), 0 3px 6px 0 rgb(42 95 165 / 0.09);
  color: #000000;
}

.emerald-toast[data-variant="warning"] {
  border-color: var(--emerald-warning-50, #fbfaeb);
  box-shadow: 0 8px 20px 0 rgb(176 125 26 / 0.13), 0 3px 6px 0 rgb(176 125 26 / 0.09);
  color: var(--emerald-warning-950, #3b200d);
}

.emerald-toast[data-variant="neutral"] {
  border-color: var(--emerald-secondary-50, #f4f7f9);
  box-shadow: 0 8px 20px 0 rgb(148 163 184 / 0.13), 0 3px 6px 0 rgb(148 163 184 / 0.09);
  color: var(--emerald-secondary-950, #2d3139);
}

.emerald-toast__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: #ffffff;
  overflow: hidden;
}

.emerald-toast[data-variant="primary"] .emerald-toast__icon {
  background: var(--emerald-primary-500, #7c5cf6);
}

.emerald-toast[data-variant="success"] .emerald-toast__icon {
  background: var(--emerald-success-500, #1e7a4a);
}

.emerald-toast[data-variant="error"] .emerald-toast__icon {
  background: var(--emerald-error-500, #c0392b);
}

.emerald-toast[data-variant="info"] .emerald-toast__icon {
  background: var(--emerald-info-500, #2a5fa5);
}

.emerald-toast[data-variant="warning"] .emerald-toast__icon {
  background: var(--emerald-warning-500, #b07d1a);
}

.emerald-toast[data-variant="neutral"] .emerald-toast__icon {
  background: var(--emerald-secondary-500, #94a3b8);
}

.emerald-toast__body {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.emerald-toast__title {
  font-weight: 700;
  font-size: 12px;
  line-height: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.emerald-toast__description {
  font-weight: 400;
  font-size: 12px;
  line-height: normal;
  letter-spacing: -0.12px;
  opacity: 0.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.emerald-toast__close {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  align-self: flex-start;
}

.emerald-toast__close:hover {
  opacity: 1;
}
</style>
