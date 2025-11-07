<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useContext } from '#v0/composables'

  // Utilities
  import { onUnmounted } from 'vue'

  // Types
  import type { AvatarContext } from './AvatarRoot.vue'
  import type { AtomProps } from '#v0/components/Atom'

  export interface AvatarFallbackProps extends AtomProps {
    namespace?: string
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'AvatarFallback' })

  const {
    as = 'span',
    renderless,
    namespace = 'v0:avatar',
  } = defineProps<AvatarFallbackProps>()

  const context = useContext<AvatarContext>(namespace)

  const ticket = context.register({
    type: 'fallback',
  })

  onUnmounted(() => {
    context.unregister(ticket.id)
  })
</script>

<template>
  <Atom
    v-if="ticket.isSelected.value"
    :as
    :renderless
  >
    <slot />
  </Atom>
</template>
