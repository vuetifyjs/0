<script lang="ts">
  import { V0Atom } from '@/components/V0Atom'
  import { useGroup } from '@/composables/group'
  import type { V0AtomProps } from '@/components/V0Atom'

  export interface V0GroupItemProps extends V0AtomProps {
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
  <V0Atom>
    <slot :is-active :toggle />
  </V0Atom>
</template>
