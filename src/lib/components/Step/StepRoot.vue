<script lang="ts">
  import type { StepContext, StepOptions } from '@/lib/composables/useStep'
  import type { ModelRef } from 'vue'

  export interface StepRootProps extends StepOptions {
    namespace?: string
  }

  export interface StepRootSlots {
    default: (scope: StepContext & {
      model: ModelRef<any>
    }) => any
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'StepRoot' })

  defineSlots<StepRootSlots>()

  const { namespace = 'step', ...props } = defineProps<StepRootProps>()

  const model = defineModel<any>()

  const [,provideStepContext] = useStep(namespace, props)

  const { register, unregister, reset, mandate, select, first, last, next, prev, step } = provideStepContext(model)
</script>

<template>
  <slot
    :first
    :last
    :mandate
    :model
    :next
    :prev
    :register
    :reset
    :select
    :step
    :unregister
  />
</template>
