<script lang="ts" setup>
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AffixKey } from './types'
  import type { V0AffixLoadingProps, V0AffixProvide } from './types'

  defineOptions({ name: 'V0AffixLoading' })

  const {
    as = 'span',
    ...props
  } = defineProps<V0AffixLoadingProps>()

  const injected = inject<V0AffixProvide>(V0AffixKey)

  const isLoading = toRef(() => props.loading || toValue(injected)?.loading)
</script>

<template>
  <V0Atom
    v-if="isLoading"
    aria-label="loading"
    :as="as"
    role="status"
  >
    <slot />
  </V0Atom>
</template>
