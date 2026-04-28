<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface OverflowItemProps extends AtomProps {
    value?: unknown
    disabled?: boolean
  }

  export interface OverflowItemSlotProps {
    isVisible: boolean
    isHidden: boolean
    attrs: {
      'data-hidden': 'true' | undefined
      'aria-hidden': 'true' | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OverflowItem' })

  const { as = 'div', renderless } = defineProps<OverflowItemProps>()
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
