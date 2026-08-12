/**
 * @module AlertDescription
 *
 * @see https://0.vuetifyjs.com/components/semantic/alert
 *
 * @remarks
 * Description paragraph for an Alert. Renders as a `p` element by default.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertDescriptionProps extends AtomProps {}

  export interface AlertDescriptionSlotProps {
    /** Attributes to bind to the description element */
    attrs: Record<string, never>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'AlertDescription' })

  defineSlots<{
    default: (props: AlertDescriptionSlotProps) => any
  }>()

  const {
    as = 'p',
    renderless,
  } = defineProps<AlertDescriptionProps>()

  const slotProps = toRef((): AlertDescriptionSlotProps => ({
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
