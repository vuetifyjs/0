<script lang="ts">
  // Components
  import { Atom } from '@/lib/components/Atom'

  // Types
  import { useAvatarContext } from './AvatarRoot.vue'
  import type { AtomProps } from '@/lib/components/Atom'

  export interface AvatarFallbackProps extends AtomProps {}
</script>

<script lang="ts" setup>
  defineOptions({ name: 'AvatarFallback' })

  const { as = 'span', renderless = true } = defineProps<AvatarFallbackProps>()

  const context = useAvatarContext()

  const isErrored = toRef(() => context.status.value === 'error')
</script>

<template>
  <Atom
    v-if="isErrored"
    :as
    :renderless
  >
    <slot />
  </Atom>
</template>
