/**
 * @module AlertTitle
 *
 * @see https://0.vuetifyjs.com/components/semantic/alert
 *
 * @remarks
 * Title element for an Alert. Renders as a `p` element by default to avoid
 * disrupting the document heading outline — alerts can appear anywhere in
 * the page and a forced heading level would be semantically incorrect.
 * Override with `as` for a different element if needed.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertTitleProps extends AtomProps {}

  export interface AlertTitleSlotProps {
    /** Attributes to bind to the title element */
    attrs: Record<string, never>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'AlertTitle' })

  defineSlots<{
    default: (props: AlertTitleSlotProps) => any
  }>()

  const {
    as = 'p',
    renderless,
  } = defineProps<AlertTitleProps>()

  const slotProps = toRef((): AlertTitleSlotProps => ({
    attrs: {},
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
