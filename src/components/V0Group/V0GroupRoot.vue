<script lang="ts">
  import { V0Atom } from '@/components/V0Atom'
  import { useGroup, type GroupOptions } from '@/composables/group'
  import type { V0AtomProps } from '@/components/V0Atom'

  export interface V0GroupRootProps extends V0AtomProps, GroupOptions {
    namespace?: string
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'V0GroupRoot' })

  const { namespace = 'group', ...props } = defineProps<V0GroupRootProps>()
  const model = defineModel<any>()

  const [,provideGroupContext] = useGroup(namespace, props)

  provideGroupContext(model)
</script>

<template>
  <V0Atom>
    <slot />
  </V0Atom>
</template>
