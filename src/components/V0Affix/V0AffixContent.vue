<script lang="ts" setup>
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AffixKey } from './types'
  import type { V0AffixContentProps, V0AffixProvide } from './types'

  defineOptions({ name: 'V0AffixContent' })

  const props = defineProps<V0AffixContentProps>()

  const injected = inject<V0AffixProvide>(V0AffixKey)

  const avatar = toRef(() => props.avatar || toValue(injected)?.avatar)
  const icon = toRef(() => props.icon || toValue(injected)?.icon)
  const isLoading = toRef(() => toValue(injected)?.loading)
</script>

<template>
  <V0Atom v-if="!isLoading">
    <slot v-if="$slots.default" />

    <V0AvatarRoot
      v-else-if="avatar || icon"
      :icon="icon"
      :src="avatar"
    />
  </V0Atom>
</template>
