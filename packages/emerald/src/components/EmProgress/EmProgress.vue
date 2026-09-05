<script lang="ts">
  // Framework
  import { Progress } from '@vuetify/v0'
  import { isArray } from '@vuetify/v0/utilities'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ProgressRootProps } from '@vuetify/v0'

  export type EmProgressSize = 'sm' | 'md' | 'lg'

  export interface EmProgressProps extends Pick<
    ProgressRootProps,
    'max' | 'ariaLabel' | 'name' | 'namespace'
  > {
    /** Accessible name when no visible `label` is rendered */
    ariaLabel?: ProgressRootProps['ariaLabel']
    /** Emerald-owned: v0 infers the indeterminate state from an absent model value */
    indeterminate?: boolean
    size?: EmProgressSize
    /** Show percentage text via Progress.Value */
    showValue?: boolean
    /** Visible label text (Progress.Label) */
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmProgress' })

  const {
    max = 100,
    indeterminate = false,
    size = 'md',
    showValue = false,
    label,
    ariaLabel: _ariaLabel,
    name,
    namespace,
  } = defineProps<EmProgressProps>()

  const model = defineModel<number>()

  // ProgressRoot only emits aria-labelledby="{id}-label" when a Progress.Label
  // child is mounted (gated on hasLabel); otherwise accname falls through to
  // aria-label, which is what we provide here.
  const ariaLabel = toRef(() => label ? undefined : _ariaLabel ?? 'Progress')

  function onModel (value: number | number[] | undefined) {
    if (indeterminate) return
    model.value = isArray(value) ? value[0] : value
  }
</script>

<template>
  <Progress.Root
    :aria-label
    class="emerald-progress"
    :data-indeterminate="indeterminate || undefined"
    :data-size="size"
    :max
    :model-value="indeterminate ? undefined : model"
    :name
    :namespace
    @update:model-value="onModel"
  >
    <div
      v-if="label || (showValue && !indeterminate)"
      class="emerald-progress__meta"
    >
      <Progress.Label v-if="label" as="span" class="emerald-progress__label" :namespace>
        {{ label }}
      </Progress.Label>

      <Progress.Value
        v-if="showValue && !indeterminate"
        class="emerald-progress__value"
        :namespace
      />
    </div>

    <Progress.Track class="emerald-progress__track" :namespace>
      <Progress.Fill class="emerald-progress__fill" :namespace />
    </Progress.Track>
  </Progress.Root>
</template>

<style>
  .emerald-progress {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--emerald-spacing-2xs, 4px);
    width: 100%;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-progress__meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .emerald-progress__label {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: var(--emerald-text-b2-bold-weight, 600);
    line-height: var(--emerald-text-b2-height, 21px);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-progress__value {
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: var(--emerald-text-b3-weight, 400);
    line-height: var(--emerald-text-b3-height, 18px);
    color: var(--emerald-on-surface-variant, #757e85);
    font-variant-numeric: tabular-nums;
  }

  .emerald-progress__track {
    position: relative;
    display: block;
    width: 100%;
    overflow: hidden;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .emerald-progress[data-size='sm'] .emerald-progress__track {
    height: 4px;
  }

  .emerald-progress[data-size='md'] .emerald-progress__track {
    height: 8px;
  }

  .emerald-progress[data-size='lg'] .emerald-progress__track {
    height: 12px;
  }

  .emerald-progress__fill {
    display: block;
    height: 100%;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-primary-600, #1fae60);
    transition: width var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-progress__fill[data-state='indeterminate'],
  .emerald-progress[data-indeterminate] .emerald-progress__fill {
    width: 40% !important;
    transition: none;
    animation: emerald-progress-indeterminate 1.2s ease-in-out infinite;
  }

  @keyframes emerald-progress-indeterminate {
    0% {
      transform: translateX(-100%);
    }

    100% {
      transform: translateX(350%);
    }
  }
</style>
