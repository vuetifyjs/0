<script lang="ts">
  // Types
  import { useAvatarContext } from './V0AvatarRoot.vue'
  import type { V0AtomProps } from '@/components/V0Atom'

  export interface V0AvatarImageProps extends V0AtomProps {
    size?: string
  }

  export interface V0AvatarImageEmits {
    load: [e: Event]
    error: [e: Event]
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'V0AvatarImage' })

  const { as = 'img' } = defineProps<V0AvatarImageProps>()

  const emit = defineEmits<V0AvatarImageEmits>()

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
  <V0Atom
    :as
    v-if="!isErrored"
    @error="onError"
    @load="onLoad"
    role="img"
  />
</template>
