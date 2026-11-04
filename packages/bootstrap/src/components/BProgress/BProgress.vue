<script lang="ts">
  // Framework
  import { createProgress, isString } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BProgressProps {
    min?: number
    max?: number
    label?: string
    /** `.progress-bar-striped` on the bar. */
    striped?: boolean
    /** `.progress-bar-animated` on the bar. */
    animated?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BProgress' })

  defineSlots<{
    default?: (props: { percent: number, value: number }) => any
  }>()

  const {
    min = 0,
    max = 100,
    label,
    striped = false,
    animated = false,
  } = defineProps<BProgressProps>()

  const model = defineModel<number>({ default: 0 })

  defineEmits<{
    'update:modelValue': [value: number]
  }>()

  const progress = createProgress({ min, max })

  progress.register({ value: model })

  const percent = toRef(() => progress.fromValue(model.value))

  const name = toRef(() => isString(label) && label.length > 0 ? label : undefined)

  const classes = toRef(() => {
    const list = ['progress-bar']

    if (striped) list.push('progress-bar-striped')
    if (animated) list.push('progress-bar-animated')

    return list
  })
</script>

<template>
  <div
    :aria-label="name"
    :aria-valuemax="max"
    :aria-valuemin="min"
    :aria-valuenow="model"
    class="progress"
    role="progressbar"
  >
    <div
      :class="classes"
      :style="{ width: `${percent}%` }"
    >
      <slot :percent :value="model" />
    </div>
  </div>
</template>
