<script lang="ts">
  // Types
  import type { V0AtomProps } from '@/components/V0Atom'

  export interface V0AffixLoadingProps extends V0AtomProps {
    loading?: boolean
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'V0AffixLoading' })

  const { as = 'span'} = defineProps<V0AffixLoadingProps>()
</script>

<template>
  <V0Atom
    v-if="loading"
    :as="as"
    aria-label="loading"
    role="status"
  >
    <slot />
  </V0Atom>
</template>
