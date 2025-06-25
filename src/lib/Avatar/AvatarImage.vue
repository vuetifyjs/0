<script lang="ts">
  // Types
  import type { AtomProps } from '@/lib/Atom'

  export interface AvatarImageProps extends AtomProps {
    size?: string
  }

  export interface AvatarImageEmits {
    load: [e: Event]
    error: [e: Event]
  }
</script>

<script lang="ts" setup>
  import { mergeProps } from 'vue'
  import { AvatarSymbol } from './useAvatar'
  defineOptions({ name: 'AvatarImage' })

  const { as = 'img', renderless, ...avatarImageProps } = defineProps<AvatarImageProps>()

  const emit = defineEmits<AvatarImageEmits>()

  const [useAvatarContext] = useContext(AvatarSymbol)
  const context = useAvatarContext()

  const isErrored = toRef(() => context.status.value === 'error')

  function onLoad (e: Event) {
    context.status.value = 'loaded'

    emit('load', e)
  }

  function onError (e: Event) {
    context.status.value = 'error'

    emit('error', e)
  }

  const props = mergeProps(avatarImageProps, {
    onError,
    onLoad,
  })
</script>

<template>
  <Atom
    v-if="!isErrored"
    v-slot="slotProps"
    :as="as"
    :props="props"
    :renderless="renderless"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
