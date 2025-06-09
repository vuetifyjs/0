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
     * @default false
     */
    separator?: boolean
  }

  const {
    as = 'div',
    orientation = 'horizontal',
    separator = true,
  } = defineProps<VDividerProps>()

  const role = separator ? 'none' : 'separator'
  const ariaOrientation = computed(() => {
    return separator ? undefined : orientation
  })
</script>
