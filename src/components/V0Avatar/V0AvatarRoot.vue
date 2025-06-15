<script setup lang="ts">
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AvatarKey } from './types'
  import type { V0AvatarInstance, V0AvatarRootProps, V0AvatarProvide } from './types'

  defineOptions({ name: 'V0AvatarRoot' })

  const {
    src,
    icon,
    loading,
    text,
  } = defineProps<V0AvatarRootProps>()

  const status = shallowRef<V0AvatarInstance['status']>('loading')

  const provides: V0AvatarProvide = toRef(() => ({
    src,
    icon,
    text,
    loading,

    status: status.value,
    setStatus,
  }))

  function setStatus (val: V0AvatarInstance['status']) {
    status.value = val
  }

  provide(V0AvatarKey, provides)
</script>

<template>
  <V0Atom class="v0-avatar-root">
    <slot />
  </V0Atom>
</template>

<style lang="scss">
  @layer v0-components {
    .v0-avatar-root {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: inherit;
      height: inherit;
    }
  }
</style>
