<script lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

  export interface EmTooltipActivatorProps {
    /**
     * When true, Activator is a pure slot host — bind `attrs` onto your own
     * trigger (e.g. EmButton) so you do not nest interactive elements.
     */
    renderless?: boolean
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipActivator' })

  const {
    renderless = false,
    namespace,
  } = defineProps<EmTooltipActivatorProps>()
</script>

<template>
  <Tooltip.Activator
    v-slot="slotProps"
    class="emerald-tooltip__activator"
    :namespace
    :renderless
  >
    <slot v-bind="slotProps" />
  </Tooltip.Activator>
</template>
