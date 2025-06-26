<script lang="ts">
  // Types
  import type { GroupContext, GroupOptions } from '@/composables/group'
  import type { ModelRef } from 'vue'

  export interface GroupRootProps extends GroupOptions {
    namespace?: string
  }

  export interface GroupRootSlots {
    default: (scope: GroupContext & {
      model: ModelRef<any>
    }) => any
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'GroupRoot' })

  defineSlots<GroupRootSlots>()

  const { namespace = 'group', ...props } = defineProps<GroupRootProps>()

  const model = defineModel<any>()

  const [,provideGroupContext] = useGroup(namespace, props)

  const { register, unregister, reset, mandate, select } = provideGroupContext(model)
</script>

<template>
  <slot
    :mandate
    :model
    :register
    :reset
    :select
    :unregister
  />
</template>
