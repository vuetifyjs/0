<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmAlertVariant = 'primary' | 'success' | 'error' | 'info' | 'warning' | 'neutral'

  export interface EmAlertProps extends V0PaperProps {
    variant?: EmAlertVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlert' })

  const { variant = 'primary', ...paperProps } = defineProps<EmAlertProps>()
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

<style>
.emerald-alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  line-height: normal;
  width: 100%;
}

.emerald-alert[data-variant="primary"] {
  background: var(--emerald-primary-50);
  border-color: var(--emerald-primary-200);
  color: var(--emerald-primary-950);
}

.emerald-alert[data-variant="success"] {
  background: var(--emerald-success-50);
  border-color: var(--emerald-success-200);
  color: var(--emerald-success-950);
}

.emerald-alert[data-variant="error"] {
  background: var(--emerald-error-50);
  border-color: var(--emerald-error-200);
  color: var(--emerald-error-950);
}

.emerald-alert[data-variant="info"] {
  background: var(--emerald-info-50);
  border-color: var(--emerald-info-200);
  color: #000000;
}

.emerald-alert[data-variant="warning"] {
  background: var(--emerald-warning-50);
  border-color: var(--emerald-warning-200);
  color: var(--emerald-warning-950);
}

.emerald-alert[data-variant="neutral"] {
  background: #fafafa;
  border-color: #b8b8b8;
  color: #000000;
}

.emerald-alert__icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.emerald-alert__title {
  font-weight: 700;
  font-size: 14px;
  line-height: normal;
  white-space: nowrap;
}

.emerald-alert__description {
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 0.28px;
}

.emerald-alert__body {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.emerald-alert__close {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  border-radius: 4px;
}

.emerald-alert__close:hover {
  opacity: 1;
  background: rgb(0 0 0 / 0.05);
}
</style>
