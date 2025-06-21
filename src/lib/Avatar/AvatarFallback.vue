<script lang="ts">
  // Types
  import type { AtomProps } from '@/lib/Atom'

  export interface AvatarFallbackProps extends AtomProps {}
</script>

<script lang="ts" setup>
  // Components
  import { Atom } from '@/lib/Atom'
  import { AvatarSymbol } from './useAvatar'

  defineOptions({ name: 'AvatarFallback' })

  const { as = 'span' } = defineProps<AvatarFallbackProps>()

  const [useAvatarContext] = useContext(AvatarSymbol)
  const context = useAvatarContext()

  const isErrored = toRef(() => context.status.value === 'error')
</script>

<template>
  <Atom
    v-if="isErrored"
    :as
  >
    <slot />
  </Atom>
</template>
