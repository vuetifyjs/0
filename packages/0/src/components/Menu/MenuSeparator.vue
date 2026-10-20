/**
 * @module MenuSeparator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks A non-focusable separator between menu items.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface MenuSeparatorProps extends AtomProps {}

  export interface MenuSeparatorSlotProps {
    attrs: {
      role: 'separator'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'MenuSeparator', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: MenuSeparatorSlotProps) => any
  }>()

  const { as = 'div', renderless = false } = defineProps<MenuSeparatorProps>()

  const slotProps = toRef((): MenuSeparatorSlotProps => ({
    attrs: { role: 'separator' },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
