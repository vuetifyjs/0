<script lang="ts">
  import { useGroup, type GroupOptions } from '@/composables/group'

  export interface V0GroupRootProps extends GroupOptions {
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
  <slot :model />
</template>
