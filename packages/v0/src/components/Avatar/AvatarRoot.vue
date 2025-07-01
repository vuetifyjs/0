<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useAvatar } from '#v0/composables/useAvatar'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AvatarRootProps extends AtomProps {}

  export const [useAvatarContext] = useAvatar('avatar')
</script>

<script setup lang="ts">
  defineOptions({ name: 'AvatarRoot' })

  const { as = 'div', renderless } = defineProps<AvatarRootProps>()

  const [, provideAvatarContext] = useAvatar('avatar')
  provideAvatarContext()
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
