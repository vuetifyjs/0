<script lang="ts">
  // Components
  import { Atom } from '@/lib/components/Atom'

  // Types
  import { useAvatarContext } from './AvatarRoot.vue'
  import type { AtomProps } from '@/lib/components/Atom'

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
  import { onUnmounted } from 'vue'

  defineOptions({
    name: 'AvatarImage',
    inheritAttrs: false,
  })

  const { as = 'img', priority = 0 } = defineProps<AvatarImageProps>()

  const emit = defineEmits<AvatarImageEmits>()

  const context = useAvatarContext()

  const ticket = context.register({
    type: 'image',
    priority,
  })

  ticket.setStatus('loading')

  function onLoad (e: Event) {
    ticket.setStatus('loaded')
    emit('load', e)
  }

  function onError (e: Event) {
    ticket.setStatus('error')
    emit('error', e)
  }

  onUnmounted(() => {
    context.unregister(ticket.id)
  })

</script>

<template>
  <Atom
    v-show="ticket.isVisible.value"
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
