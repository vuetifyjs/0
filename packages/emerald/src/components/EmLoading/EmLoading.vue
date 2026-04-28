<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmLoadingSize = 'sm' | 'md' | 'lg'

  export interface EmLoadingProps extends V0PaperProps {
    size?: EmLoadingSize
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmLoading' })

  const { size = 'md', label } = defineProps<EmLoadingProps>()
</script>

<template>
  <V0Paper
    :aria-label="label"
    aria-live="polite"
    as="div"
    class="emerald-loading"
    :data-size="size"
    role="status"
  >
    <span aria-hidden="true" class="emerald-loading__spinner" />
    <span v-if="$slots.default" class="emerald-loading__label">
      <slot />
    </span>
  </V0Paper>
</template>

<style>
.emerald-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: var(--emerald-on-background);
}

.emerald-loading__spinner {
  display: inline-block;
  border-radius: 50%;
  border: 2px solid rgb(var(--emerald-primary-500-channels) / 0.25);
  border-top-color: var(--emerald-primary-500);
  animation: emerald-loading-spin 800ms linear infinite;
}

.emerald-loading[data-size="sm"] .emerald-loading__spinner {
  width: 14px;
  height: 14px;
  border-width: 2px;
}

.emerald-loading[data-size="md"] .emerald-loading__spinner {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.emerald-loading[data-size="lg"] .emerald-loading__spinner {
  width: 28px;
  height: 28px;
  border-width: 3px;
}

@keyframes emerald-loading-spin {
  to { transform: rotate(360deg); }
}
</style>
