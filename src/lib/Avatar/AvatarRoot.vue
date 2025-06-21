<script lang="ts">
  import type { AtomProps } from '@/lib/Atom'
  import { AvatarSymbol, useAvatar } from './useAvatar'

  export interface AvatarRootProps extends AtomProps {}

  const [, provideAvatarContext] = useContext(AvatarSymbol)
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '@/lib/Atom'

  defineOptions({ name: 'AvatarRoot' })

  const { as = 'span' } = defineProps<AvatarRootProps>()

  const avatar = useAvatar()

  provideAvatarContext(avatar)
</script>

<template>
  <Atom :as>
    <slot />
  </Atom>
</template>
