<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { OverflowRootContext } from './types'

  export interface OverflowRootProps extends AtomProps {
    namespace?: string
  }

  export interface OverflowRootSlotProps {
    capacity: number
    size: number
    isOverflowing: boolean
    attrs: {
      'data-overflow': 'true' | undefined
      'data-priority': 'start' | 'end'
    }
  }

  export const [useOverflowRoot, provideOverflowRoot] = createContext<OverflowRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'OverflowRoot' })

  const { as = 'div', renderless } = defineProps<OverflowRootProps>()
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
