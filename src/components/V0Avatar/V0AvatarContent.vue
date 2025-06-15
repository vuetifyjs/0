<script lang="ts" setup>
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AvatarKey } from './types'
  import type { V0AvatarContentProps, V0AvatarProvide } from './types'

  defineOptions({ name: 'V0AvatarContent' })

  const {
    as = 'span',
    ...props
  } = defineProps<V0AvatarContentProps>()

  const injected = inject<V0AvatarProvide>(V0AvatarKey)

  const src = toRef(() => props.src || toValue(injected)?.src)
  const icon = toRef(() => props.icon || toValue(injected)?.icon)
  const text = toRef(() => props.text || toValue(injected)?.text)
  const isLoading = toRef(() => props.loading || toValue(injected)?.loading)

  function onLoad () {
    toValue(injected)?.setStatus('loaded')
  }

  function onError () {
    toValue(injected)?.setStatus('error')
  }
</script>

<template>
  <V0Atom
    v-if="!isLoading"
    :as="as"
    class="v0-avatar-content"
  >
    <V0Img
      v-if="src"
      :src="src"
      @error="onError"
      @load="onLoad"
    />

    <V0Icon
      v-else-if="icon"
      :icon="icon"
    />

    <template v-else-if="text">
      {{ text }}
    </template>
  </V0Atom>
</template>

<style lang="scss">
  @layer v0-components {
    .v0-avatar-content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: inherit;
      width: inherit;
    }
  }
</style>
