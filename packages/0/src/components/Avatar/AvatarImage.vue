<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { onUnmounted, toRef } from 'vue'

  // Types
  import { useAvatarContext } from './AvatarRoot.vue'
  import type { AtomProps } from '#v0/components/Atom'

  export interface AvatarImageProps extends AtomProps {
    src?: string
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

  const { as = 'img', renderless, priority = 0, ...props } = defineProps<AvatarImageProps>()

  const emit = defineEmits<AvatarImageEmits>()

  const context = useAvatarContext()

  const ticket = context.register({
    priority,
    type: 'image',
    disabled: true,
  })

  function onLoad (e: Event) {
    ticket.disabled = false
    ticket.select()
    emit('load', e)
  }

  function onError (e: Event) {
    ticket.disabled = true
    const first = context.seek('first')
    if (first) context.select(first.id)
    emit('error', e)
  }

  onUnmounted(() => {
    context.unregister(ticket.id)
  })

  const bindableProps = toRef(() => ({
    onError,
    onLoad,
    role: 'img',
    ...props,
  }))

  type BindableProps = typeof bindableProps.value

  defineSlots<{ default: (props: BindableProps) => any }>()
</script>

<template>
  <Atom
    v-show="ticket.isSelected.value"
    :as
    :renderless
    v-bind="bindableProps"
  >
    <slot v-bind="bindableProps" />
  </Atom>
</template>
