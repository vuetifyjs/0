<script lang="ts">
  // Types
  import { useAvatarContext } from './V0AvatarRoot.vue'
  import type { V0AtomProps } from '@/components/V0Atom'

  export interface V0AvatarFallbackProps extends V0AtomProps {}
</script>

<script lang="ts" setup>
  // Components
  import { V0Atom } from '@/components/V0Atom'

  const { as = 'span' } = defineProps<V0AvatarFallbackProps>()

  const context = useAvatarContext()

  const isErrored = toRef(() => context.status.value === 'error')
</script>

<template>
  <V0Atom
    v-if="isErrored"
    :as
  >
    <slot />
  </V0Atom>
</template>
