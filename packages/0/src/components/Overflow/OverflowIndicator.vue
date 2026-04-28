<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { OverflowTicket } from './types'

  export interface OverflowIndicatorProps extends AtomProps {}

  export interface OverflowIndicatorSlotProps {
    count: number
    hidden: OverflowTicket[]
    attrs: {
      'data-overflow-indicator': 'true'
      'aria-live': 'polite'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OverflowIndicator' })

  const { as = 'div', renderless } = defineProps<OverflowIndicatorProps>()
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
