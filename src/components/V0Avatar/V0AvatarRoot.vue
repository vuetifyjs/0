<script setup lang="ts">
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AvatarKey } from './types'
  import type { V0AvatarContext, V0AvatarRootProps, V0AvatarProvide } from './types'

  defineOptions({ name: 'V0AvatarRoot' })

  const {
    as = 'span',
    ...props
  } = defineProps<V0AvatarRootProps>()

  const status = shallowRef<V0AvatarContext['status']>('loading')

  const provides: V0AvatarProvide = toRef(() => ({
    status: status.value,
    size: props.size,
    setStatus,
  }))

  function setStatus (val: V0AvatarContext['status']) {
    status.value = val
  }

  provide(V0AvatarKey, provides)
</script>

<template>
  <V0Atom :as>
    <slot />
  </V0Atom>
</template>
