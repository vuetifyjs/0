/**
 * @module AlertTitle
 *
 * @see https://0.vuetifyjs.com/components/semantic/alert
 *
 * @remarks
 * Heading element for an Alert. Renders as an `h5` element by default so it
 * sits below the page's primary landmark headings without disrupting document
 * outline. Override with `as` for a different heading level.
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
    as = 'h5',
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
