<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { SliderRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  import type { MaybeRefOrGetter } from 'vue'

  export type EmSliderOrientation = 'horizontal' | 'vertical'

  export interface EmSliderProps extends V0PaperProps {
    disabled?: MaybeRefOrGetter<boolean>
    readonly?: MaybeRefOrGetter<boolean>
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
    readonly: _readonly = false,
    min = 0,
    max = 100,
    step = 1,
    orientation = 'horizontal',
    name,
    ...paperProps
  } = defineProps<EmSliderProps>()

  const model = defineModel<number | number[]>({ default: 0 })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-slider"
    :data-orientation="orientation"
  >
    <SliderRoot
      v-model="model"
      :disabled
      :max
      :min
      :name
      :orientation
      :readonly="_readonly"
      :step
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </SliderRoot>
  </V0Paper>
</template>

<style>
.emerald-slider {
  position: relative;
  width: 205px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
}

.emerald-slider > [data-orientation="horizontal"] {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.emerald-slider[data-orientation="vertical"] {
  width: auto;
  height: 100%;
}

.emerald-slider > [data-orientation="vertical"] {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
