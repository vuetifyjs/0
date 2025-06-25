<script lang="ts">
  import type { GroupTicket } from '@/composables/group'

  export interface V0StepItemProps {
    id?: string
    value?: any
    disabled?: boolean
    namespace?: string
  }

  export interface V0StepItemSlots {
    default: (scope: GroupTicket) => any
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'V0StepItem' })

  defineSlots<V0StepItemSlots>()

  const {
    id = useId(),
    value,
    disabled,
    namespace = 'step',
  } = defineProps<V0StepItemProps>()

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
