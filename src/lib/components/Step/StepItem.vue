<script lang="ts">
  import type { GroupTicket } from '@/lib/composables/useGroup'

  export interface StepItemProps {
    id?: string
    value?: any
    disabled?: boolean
    namespace?: string
  }

  export interface StepItemSlots {
    default: (scope: GroupTicket) => any
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

  const ticket = step.register({
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
    :index="ticket.index"
    :is-active="ticket.isActive"
    :toggle="ticket.toggle"
  />
</template>
