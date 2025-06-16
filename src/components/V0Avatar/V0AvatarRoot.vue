<script lang="ts">
  // Types
  import type { V0AtomProps } from '@/components/V0Atom'
  import type { ShallowRef } from 'vue'

  export interface V0AvatarRootProps extends V0AtomProps {}

  export interface V0AvatarContext {
    status: ShallowRef<'idle' | 'loaded' | 'error' | 'loading'>
  }

  export const [provideAvatarContext, useAvatarContext] = useContext<V0AvatarContext>('V0AvatarRoot')
</script>

<script setup lang="ts">
  // Components
  import { V0Atom } from '@/components/V0Atom'

  defineOptions({ name: 'V0AvatarRoot' })

  const { as = 'span' } = defineProps<V0AvatarRootProps>()

  provideAvatarContext({
    status: shallowRef('idle' as const),
  })
</script>

<template>
  <V0Atom :as>
    <slot />
  </V0Atom>
</template>
