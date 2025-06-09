<template>
  <VAtom
    :aria-orientation="ariaOrientation"
    :as="as"
    :as-child="asChild"
    :data-orientation="orientation"
    :role="role"
  >
    <slot />
  </VAtom>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { VAtom, type VAtomProps } from '../VAtom/VAtom'

  export interface VDividerProps extends VAtomProps {
    /**
     * The orientation of the divider.
     * @default 'horizontal'
     */
    orientation?: 'horizontal' | 'vertical'

    /**
     * Whether the divider is decorative (no semantic meaning)
     * @default true
     */
    decorative?: boolean
  }

  const {
    as = 'div',
    orientation = 'horizontal',
    decorative = true,
  } = defineProps<VDividerProps>()

  const role = decorative ? 'none' : 'separator'
  const ariaOrientation = computed(() => {
    return decorative ? undefined : orientation
  })
</script>
