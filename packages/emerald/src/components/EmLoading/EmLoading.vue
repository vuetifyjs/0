<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmLoadingSize = 'sm' | 'md' | 'lg'

  export type EmLoadingVariant = 'loader' | 'progress'

  export interface EmLoadingProps extends V0PaperProps {
    size?: EmLoadingSize
    variant?: EmLoadingVariant
    value?: number
    indicator?: boolean
    label?: string
  }
</script>

<script setup lang="ts">
  // Framework
  import { clamp } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'EmLoading' })

  const {
    size = 'md',
    variant = 'loader',
    value = 0,
    indicator = true,
    label = 'Loading',
    ...paperProps
  } = defineProps<EmLoadingProps>()

  const progress = toRef(() => variant === 'progress')
  const percent = toRef(() => clamp(value, 0, 100))
  const display = toRef(() => `${Math.round(percent.value)}%`)
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :aria-label="label"
    :aria-live="progress ? undefined : 'polite'"
    :aria-valuemax="progress ? 100 : undefined"
    :aria-valuemin="progress ? 0 : undefined"
    :aria-valuenow="progress ? percent : undefined"
    as="div"
    class="emerald-loading"
    :data-size="size"
    :data-variant="variant"
    :role="progress ? 'progressbar' : 'status'"
  >
    <span aria-hidden="true" class="emerald-loading__spinner">
      <!-- Spec anatomy (Figma 8940:6118): Background (Stroke) track + Front arc, stroke 16 on a 100 viewBox (16% of diameter) -->
      <svg class="emerald-loading__ring" viewBox="0 0 100 100">
        <circle class="emerald-loading__track" cx="50" cy="50" r="42" />

        <circle
          class="emerald-loading__front"
          cx="50"
          cy="50"
          pathLength="100"
          r="42"
          :stroke-dashoffset="progress ? 100 - percent : undefined"
        />
      </svg>

      <span v-if="progress && indicator" class="emerald-loading__indicator">
        {{ display }}
      </span>
    </span>

    <span v-if="$slots.default" class="emerald-loading__label">
      <slot />
    </span>
  </V0Paper>
</template>

<style scoped>
.emerald-loading {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-xs);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b2-size);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-surface);
}

.emerald-loading__spinner {
  position: relative;
  display: inline-flex;
}

.emerald-loading__ring {
  display: block;
}

.emerald-loading[data-size="sm"] .emerald-loading__ring {
  width: 14px;
  height: 14px;
}

.emerald-loading[data-size="md"] .emerald-loading__ring {
  width: 20px;
  height: 20px;
}

.emerald-loading[data-size="lg"] .emerald-loading__ring {
  width: 28px;
  height: 28px;
}

.emerald-loading__track,
.emerald-loading__front {
  fill: none;
  stroke-width: 16;
}

.emerald-loading__track {
  stroke: var(--emerald-neutral-200);
}

.emerald-loading__front {
  stroke: var(--emerald-secondary-600);
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

.emerald-loading[data-variant="loader"] .emerald-loading__front {
  stroke-dasharray: 25 75;
}

.emerald-loading[data-variant="loader"] .emerald-loading__ring {
  animation: emerald-loading-spin 800ms linear infinite;
}

.emerald-loading[data-variant="progress"] .emerald-loading__front {
  stroke-dasharray: 100;
}

.emerald-loading__indicator {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--emerald-text-b2-size);
  line-height: var(--emerald-text-b2-height);
  font-weight: var(--emerald-text-b2-bold-weight);
  color: var(--emerald-on-surface);
}

@keyframes emerald-loading-spin {
  to { transform: rotate(360deg); }
}
</style>
