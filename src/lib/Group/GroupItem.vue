<script lang="ts">
  // Types
  import type { GroupTicket } from '@/composables/group'

  export interface GroupItemProps {
    id?: string
    value?: any
    disabled?: boolean
    namespace?: string
  }

  export interface GroupItemSlots {
    default: (scope: GroupTicket) => any
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'GroupItem' })

  defineSlots<GroupItemSlots>()

  const {
    id = useId(),
    value,
    disabled,
    namespace = 'group',
  } = defineProps<GroupItemProps>()

  const [useGroupContext] = useGroup(namespace)

  const group = useGroupContext()

  if (!group) {
    throw new Error(`Failed to get group context at namespace "${namespace}"`)
  }

  const { isActive, toggle, index } = group.register({
    id,
    value,
    disabled,
  })

  onUnmounted(() => {
    group.unregister(id)
  })
</script>

<template>
  <slot
    :index
    :is-active
    :toggle
  />
</template>
