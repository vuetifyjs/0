<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { onUnmounted } from 'vue'

  // Types
  import { useAvatarContext } from './AvatarRoot.vue'
  import type { AtomProps } from '#v0/components/Atom'

  export interface AvatarFallbackProps extends AtomProps {}
</script>

<script lang="ts" setup>
  defineOptions({ name: 'AvatarFallback' })

  const { as = 'span', renderless } = defineProps<AvatarFallbackProps>()

  const context = useAvatarContext()

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
