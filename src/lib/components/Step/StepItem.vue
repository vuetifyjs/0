<script lang="ts">
  // Composables
  import { useStep } from '@/lib/composables/useStep'

  // Types
  import type { GroupTicket } from '@/lib/composables/useGroup'
  import type { UnwrapNestedRefs } from 'vue'

  export interface StepItemProps {
    id?: string
    value?: any
    disabled?: boolean
    namespace?: string
  }

  export interface StepItemSlots {
    default: (scope: UnwrapNestedRefs<GroupTicket>) => any
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'StepItem' })

  defineSlots<StepItemSlots>()

  const {
    id = useId(),
    value,
    disabled,
    namespace = 'step',
  } = defineProps<StepItemProps>()

  const [useStepContext] = useStep(namespace)

  const step = useStepContext()

  if (!step) {
    throw new Error(`Failed to get step context at namespace "${namespace}"`)
  }

  const { index, isActive, toggle } = step.register({
    id,
    value,
    disabled,
  })

  onUnmounted(() => {
    step.unregister(id)
  })
</script>

<template>
  <slot
    :index
    :is-active
    :toggle
  />
</template>
