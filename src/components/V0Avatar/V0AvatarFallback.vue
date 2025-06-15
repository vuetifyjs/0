<script lang="ts" setup>
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AvatarKey } from './types'
  import type { V0AvatarFallbackProps, V0AvatarProvide } from './types'

  const {
    as = 'span',
    ...props
  } = defineProps<V0AvatarFallbackProps>()

  const injected = inject<V0AvatarProvide>(V0AvatarKey)

  const hasMedia = toRef(() => toValue(injected)?.src || toValue(injected)?.icon)
  const isErrored = toRef(() => toValue(injected)?.status === 'error')
  const isLoading = toRef(() => toValue(injected)?.loading)
  const text = toRef(() => props.text || toValue(injected)?.text)
</script>

<template>
  <V0Atom
    v-if="(isErrored || !hasMedia) && !isLoading"
    :as
    class="v0-avatar-fallback"
  >
    <slot>{{ text }}</slot>
  </V0Atom>
</template>

<style lang="scss">
  @layer v0-components {
    .v0-avatar-fallback {
      display: inline-flex;
      align-items: center;
      justify-items: center;
    }
  }
</style>
