<script lang="ts">
  import { useGroup } from '@/composables/group'

  export interface V0GroupItemProps {
    id?: string
    value?: any
    disabled?: boolean
    namespace?: string
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'V0GroupItem' })

  const {
    id = useId(),
    value,
    disabled,
    namespace = 'group',
  } = defineProps<V0GroupItemProps>()

  const [useGroupContext] = useGroup(namespace)

  const group = useGroupContext()

  if (!group) {
    throw new Error(`Failed to get group context at namespace "${namespace}"`)
  }

  const { isActive, toggle } = group.register({
    id,
    value,
    disabled,
  })
</script>

<template>
  <slot :is-active :toggle />
</template>
