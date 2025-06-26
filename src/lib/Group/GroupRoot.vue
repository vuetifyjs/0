<script lang="ts">
  // Types
  import type { GroupContext, GroupOptions } from '@/composables/group'
  import type { ModelRef } from 'vue'

  export interface V0GroupRootProps extends GroupOptions {
    namespace?: string
  }

  export interface V0GroupRootSlots {
    default: (scope: GroupContext & {
      model: ModelRef<any>
    }) => any
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'V0GroupRoot' })

  defineSlots<V0GroupRootSlots>()

  const { namespace = 'group', ...props } = defineProps<V0GroupRootProps>()

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
