<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createSelectionContext } from '#v0/composables/useSelection'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionContext, SelectionTicket } from '#v0/composables/useSelection'

  export interface AvatarRootProps extends AtomProps {
    namespace?: string
  }

  interface AvatarTicket extends SelectionTicket {
    type?: 'image' | 'fallback'
    priority?: number
  }

  export interface AvatarContext extends SelectionContext<AvatarTicket> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'AvatarRoot' })

  const {
    as = 'div',
    renderless,
    namespace = 'v0:avatar',
  } = defineProps<AvatarRootProps>()

  const [, provideAvatarContext] = createSelectionContext<AvatarTicket, AvatarContext>({
    namespace,
    mandatory: 'force',
    multiple: false,
  })

  provideAvatarContext()
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
