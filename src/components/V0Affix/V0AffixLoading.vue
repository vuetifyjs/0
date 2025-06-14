<script lang="ts">
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import { V0AffixKey } from './V0AffixRoot.vue'
  import type { V0AffixProvide } from './V0AffixRoot.vue'
  import type { V0AtomProps } from '@/components/V0Atom'

  export interface V0AffixLoadingProps extends V0AtomProps {
    loading?: boolean
  }
</script>

<script lang="ts" setup>
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
    :as="as"
    aria-label="loading"
    role="status"
  >
    <slot />
  </V0Atom>
</template>
