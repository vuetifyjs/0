<script lang="ts">
  // Types
  import type { V0ImgProps } from '@/components/V0Img'
  import { useAvatarContext } from './V0AvatarRoot.vue'

  export interface V0AvatarImageProps extends V0ImgProps {
    size?: string
  }

  export interface V0AvatarImageEmits {
    load: [e: Event]
    error: [e: Event]
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'V0AvatarImage' })

  defineProps<V0AvatarImageProps>()

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
  <V0Img
    v-if="!isErrored"
    :height="height || size"
    :width="width ||size"
    @error="onError"
    @load="onLoad"
  />
</template>
