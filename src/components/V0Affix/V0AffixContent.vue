<script lang="ts">
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AffixKey } from '@/components/V0Affix'
  import type { V0AffixProvide } from '@/components/V0Affix'
  import type { V0AtomProps } from '@/components/V0Atom'

  export interface V0AffixContentProps extends V0AtomProps {
    avatar?: string
    icon?: string
  }
</script>

<script lang="ts" setup>
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

    <V0Avatar
      v-else-if="avatar || icon"
      :src="avatar"
      :icon="icon"
    />
  </V0Atom>
</template>
