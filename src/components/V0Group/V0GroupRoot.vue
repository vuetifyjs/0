<script lang="ts">
  import { useGroup, type GroupContext, type GroupItem, type GroupOptions } from '@/composables/group'

  export interface V0GroupRootProps extends GroupOptions {
    namespace?: string
  }

  export interface V0GroupRootSlots {
    default: GroupContext & {
      model: any
    }
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'V0GroupRoot' })
  defineSlots<V0GroupRootSlots>()

  const { namespace = 'group', ...props } = defineProps<V0GroupRootProps>()
  const model = defineModel<any>()

  const [,provideGroupContext] = useGroup(namespace, props)

  const { register, unregister, reset, mandate } = provideGroupContext(model)
</script>

<template>
  <slot
    :mandate
    :model
    :register
    :reset
    :unregister
  />
</template>
