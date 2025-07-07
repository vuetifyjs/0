<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { onUnmounted } from 'vue'

  // Types
  import { useAvatarContext } from './AvatarRoot.vue'
  import type { AtomProps } from '#v0/components/Atom'

  export interface AvatarImageProps extends AtomProps {
    size?: string
    priority?: number
  }

  export interface AvatarImageEmits {
    load: [e: Event]
    error: [e: Event]
  }
</script>

<script lang="ts" setup>
  defineOptions({
    name: 'AvatarImage',
    inheritAttrs: false,
  })

  const { as = 'img', priority = 0 } = defineProps<AvatarImageProps>()

  const emit = defineEmits<AvatarImageEmits>()

  const context = useAvatarContext()

  const ticket = context.register(() => ({
    priority,
    status: 'loading',
    type: 'image',
  }))

  function onLoad (e: Event) {
    ticket.status = 'loaded'
    emit('load', e)
  }

  function onError (e: Event) {
    ticket.status = 'error'
    emit('error', e)
  }

  onUnmounted(() => {
    context.unregister(ticket.id)
  })

</script>

<template>
  <Atom
    v-show="ticket.isVisible"
    v-slot="slotProps"
    :as
    :props="{
      role: 'img',
      onError,
      onLoad,
      ...$attrs
    }"
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
