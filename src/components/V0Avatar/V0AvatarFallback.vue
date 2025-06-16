<script lang="ts">
  // Types
  import { V0AvatarKey } from './V0AvatarRoot.vue'
  import type { V0AvatarProvide } from './V0AvatarRoot.vue'
  import type { V0AtomProps } from '@/components/V0Atom'
</script>

<script lang="ts" setup>
  // Components
  import { V0Atom } from '@/components/V0Atom'
  export interface V0AvatarFallbackProps extends V0AtomProps {}

  const {
    as = 'span',
  } = defineProps<V0AvatarFallbackProps>()

  const injected = inject<V0AvatarProvide>(V0AvatarKey)

  const isErrored = toRef(() => toValue(injected)?.status === 'error')
</script>

<template>
  <V0Atom
    v-if="isErrored"
    :as
  >
    <slot />
  </V0Atom>
</template>
