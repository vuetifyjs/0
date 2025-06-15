<script lang="ts" setup>
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AvatarKey } from './types'
  import type { V0AvatarFallbackProps, V0AvatarProvide } from './types'

  const {
    as = 'span',
  } = defineProps<V0AvatarFallbackProps>()

  const injected = inject<V0AvatarProvide>(V0AvatarKey)

  const isErrored = toRef(() => toValue(injected)?.status === 'error')
  const isLoading = toRef(() => toValue(injected)?.loading)
</script>

<template>
  <V0Atom
    v-if="isErrored && !isLoading"
    :as="as"
  >
    <slot />
  </V0Atom>
</template>
