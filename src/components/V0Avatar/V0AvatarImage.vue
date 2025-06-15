<script lang="ts" setup>
  // Types
  import { V0AvatarKey } from './types'
  import type { V0AvatarImageEmits, V0AvatarImageProps, V0AvatarProvide } from './types'

  defineOptions({ name: 'V0AvatarImage' })

  const props = defineProps<V0AvatarImageProps>()

  const emit = defineEmits<V0AvatarImageEmits>()

  const injected = inject<V0AvatarProvide>(V0AvatarKey)

  const src = toRef(() => props.src || toValue(injected)?.src)

  function onLoad (e: Event) {
    toValue(injected)?.setStatus('loaded')

    emit('load', e)
  }

  function onError (e: Event) {
    toValue(injected)?.setStatus('error')

    emit('error', e)
  }
</script>

<template>
  <V0Img
    v-if="src"
    :src
    @error="onError"
    @load="onLoad"
  />
</template>

<style lang="scss">
  //
</style>
