<script lang="ts">
  // Components
  import { Atom } from '@/lib/Atom'

  // Types
  import { useAvatarContext } from './AvatarRoot.vue'
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
  defineOptions({ name: 'AvatarImage' })

  const { as = 'img' } = defineProps<AvatarImageProps>()

  const emit = defineEmits<AvatarImageEmits>()

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
    :as
    role="img"
    @error="onError"
    @load="onLoad"
  />
</template>
