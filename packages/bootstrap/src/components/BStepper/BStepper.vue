<script lang="ts">
  // Framework
  import { createContext } from '@vuetify/v0'
  import { Step } from '@vuetify/v0/components'

  // Types
  import type { Ref } from 'vue'

  export interface BStepperProps {
    /**
     * Scroll a long stepper. Wraps the list in `div.stepper-overflow`,
     * which is where the pinned docs put that class.
     *
     * @default false
     */
    overflow?: boolean
  }

  export interface BStepperContext {
    claim: () => number
    /** Current step index. `.active` is every item at or before this. */
    current: Ref<number>
  }

  /** Step's own inject key. Not the claim counter. */
  export const STEPPER_NS = 'v0:b-stepper'

  export const [useBStepper, provideBStepper] = createContext<BStepperContext>('v0:b-stepper-index')
</script>

<script setup lang="ts">
  defineOptions({ name: 'BStepper' })

  defineSlots<{
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: number]
  }>()

  const model = defineModel<number>({ default: 0 })

  const { overflow = false } = defineProps<BStepperProps>()

  let cursor = 0

  function claim () {
    const index = cursor
    cursor += 1
    return index
  }

  provideBStepper({ claim, current: model })
</script>

<template>
  <Step.Root
    v-model="model"
    mandatory="force"
    :namespace="STEPPER_NS"
  >
    <div v-if="overflow" class="stepper-overflow">
      <ol class="stepper">
        <slot />
      </ol>
    </div>

    <ol v-else class="stepper">
      <slot />
    </ol>
  </Step.Root>
</template>
