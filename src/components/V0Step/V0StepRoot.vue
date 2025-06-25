<script lang="ts">
  import type { StepContext, StepOptions } from '@/composables/step'
  import type { ModelRef } from 'vue'

  export interface V0StepRootProps extends StepOptions {
    namespace?: string
  }

  export interface V0StepRootSlots {
    default: (scope: StepContext & {
      model: ModelRef<any>
    }) => any
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'V0StepRoot' })

  defineSlots<V0StepRootSlots>()

  const { namespace = 'step', ...props } = defineProps<V0StepRootProps>()

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
