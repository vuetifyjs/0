<script lang="ts" setup>
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AvatarKey } from './types'
  import type { V0AvatarLoadingProps, V0AvatarProvide } from './types'

  defineOptions({ name: 'V0AvatarLoading' })

  const {
    as = 'span',
    ...props
  } = defineProps<V0AvatarLoadingProps>()

  const injected = inject<V0AvatarProvide>(V0AvatarKey)

  const isLoading = toRef(() => props.loading || toValue(injected)?.loading)
</script>

<template>
  <V0Atom
    v-if="isLoading"
    :as
    class="v0-avatar-loading"
    role="status"
  >
    <slot />
  </V0Atom>
</template>
