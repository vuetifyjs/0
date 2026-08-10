<script lang="ts">
  // Framework
  import { Slider } from '@vuetify/v0'

  // Utilities
  import { toValue } from 'vue'

  // Types
  import type { SliderRootProps } from '@vuetify/v0'

  export type EmSliderOrientation = NonNullable<SliderRootProps['orientation']>

  export interface EmSliderProps extends Omit<SliderRootProps, 'as' | 'renderless'> {
    /** Accessible name for the slider group / default thumb */
    label?: SliderRootProps['label']
    /** Thumb accessible name when no visible label */
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSlider' })

  const {
    disabled = false,
    readonly: isReadonly = false,
    min = 0,
    max = 100,
    step = 1,
    orientation = 'horizontal',
    name,
    label,
    ariaLabelledby,
    ariaLabel,
    inverted = false,
    minStepsBetweenThumbs,
    crossover = false,
    form,
    id,
    namespace,
  } = defineProps<EmSliderProps>()

  const model = defineModel<number | number[]>({ default: 0 })
</script>

<template>
  <div
    class="emerald-slider"
    :data-disabled="toValue(disabled) || undefined"
    :data-orientation="orientation"
    :data-readonly="toValue(isReadonly) || undefined"
  >
    <Slider.Root
      :id
      v-model="model"
      :aria-labelledby
      :crossover
      :disabled
      :form
      :inverted
      :label
      :max
      :min
      :min-steps-between-thumbs
      :name
      :namespace
      :orientation
      :readonly="isReadonly"
      :step
    >
      <slot>
        <Slider.Track class="emerald-slider__track" :namespace>
          <Slider.Range class="emerald-slider__range" :namespace />
        </Slider.Track>

        <Slider.Thumb
          :aria-label="ariaLabel || label"
          class="emerald-slider__thumb"
          :namespace
        />
      </slot>
    </Slider.Root>
  </div>
</template>

<style>
  .emerald-slider {
    position: relative;
    width: 100%;
  }

  .emerald-slider > [data-orientation='horizontal'] {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    min-height: 24px;
  }

  .emerald-slider[data-orientation='vertical'] {
    width: auto;
    height: 160px;
  }

  .emerald-slider > [data-orientation='vertical'] {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .emerald-slider__track {
    position: relative;
    flex: 1 1 auto;
    height: 12px;
    width: 100%;
    overflow: hidden;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-200, #f6f8fa);
    cursor: pointer;
  }

  .emerald-slider[data-orientation='vertical'] .emerald-slider__track {
    width: 12px;
    height: 100%;
  }

  .emerald-slider[data-disabled] .emerald-slider__track,
  .emerald-slider__track[data-disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .emerald-slider[data-readonly] .emerald-slider__track,
  .emerald-slider__track[data-readonly] {
    cursor: default;
  }

  .emerald-slider__range {
    position: absolute;
    top: 0;
    bottom: 0;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-secondary-600, #00b4dc);
    box-shadow: var(--emerald-shadow-field, 0 1px 2px 0 rgba(5, 0, 18, 0.05));
  }

  .emerald-slider[data-orientation='vertical'] .emerald-slider__range {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
  }

  .emerald-slider__thumb {
    position: absolute;
    display: block;
    width: 16px;
    height: 16px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-100, #fefefe);
    box-shadow: var(--emerald-shadow-thumb, 0 1px 3px 0 rgba(5, 0, 18, 0.12));
    cursor: grab;
    transform: translate(-50%, -50%);
    top: 50%;
    z-index: 1;
  }

  .emerald-slider[data-orientation='vertical'] .emerald-slider__thumb {
    top: auto;
    left: 50%;
    transform: translate(-50%, 50%);
  }

  .emerald-slider__thumb:focus-visible {
    outline: none;
    box-shadow:
      var(--emerald-shadow-thumb, 0 1px 3px 0 rgba(5, 0, 18, 0.12)),
      var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
  }

  .emerald-slider__thumb[data-state='dragging'] {
    cursor: grabbing;
  }

  .emerald-slider__thumb[data-disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .emerald-slider[data-readonly] .emerald-slider__thumb,
  .emerald-slider__thumb[data-readonly] {
    cursor: default;
  }
</style>
