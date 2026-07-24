<script lang="ts">
  // Framework
  import { Slider } from '@vuetify/v0'

  export type EmSliderOrientation = 'horizontal' | 'vertical'

  export interface EmSliderProps {
    disabled?: boolean
    readonly?: boolean
    min?: number
    max?: number
    step?: number
    orientation?: EmSliderOrientation
    name?: string
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
  } = defineProps<EmSliderProps>()

  const model = defineModel<number[]>({ default: () => [0] })
</script>

<template>
  <div class="emerald-slider" :data-orientation="orientation">
    <Slider.Root
      v-model="model"
      :disabled
      :max
      :min
      :name
      :orientation
      :readonly="isReadonly"
      :step
    >
      <slot>
        <Slider.Track class="emerald-slider__track">
          <Slider.Range class="emerald-slider__range" />
        </Slider.Track>

        <Slider.Thumb class="emerald-slider__thumb" />
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
    background: var(--emerald-neutral-200, #ebf0f4);
    cursor: pointer;
  }

  .emerald-slider[data-orientation='vertical'] .emerald-slider__track {
    width: 12px;
    height: 100%;
  }

  .emerald-slider__track[data-disabled] {
    cursor: not-allowed;
    opacity: 0.6;
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
</style>
