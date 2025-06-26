<script lang="ts">
  // Components
  import { Atom } from '@/lib/Atom'

  // Types
  import type { AtomProps } from '@/lib/Atom'
  import type { ShallowRef } from 'vue'

  export interface AvatarRootProps extends AtomProps {}

  export interface AvatarContext {
    status: ShallowRef<'idle' | 'loaded' | 'error' | 'loading'>
  }

  export const [useAvatarContext, provideAvatarContext] = useContext<AvatarContext>('Avatar')
</script>

<script setup lang="ts">
  defineOptions({ name: 'AvatarRoot' })

  const { as = 'span' } = defineProps<AvatarRootProps>()

  provideAvatarContext({
    status: shallowRef('idle' as const),
  })
</script>

<template>
  <Atom :as>
    <slot />
  </Atom>
</template>
