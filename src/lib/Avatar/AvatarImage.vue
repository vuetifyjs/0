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
  import { AvatarSymbol } from './useAvatar'
  defineOptions({ name: 'AvatarImage' })

  withDefaults(defineProps<AvatarImageProps>(), {
    as: 'img',
  })

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
</script>

<template>
  <Atom
    v-if="!isErrored"
    :as="as"
    role="img"
    @error="onError"
    @load="onLoad"
  />
</template>
