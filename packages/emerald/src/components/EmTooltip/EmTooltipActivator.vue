<script lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

  // Types
  import type { TooltipActivatorProps } from '@vuetify/v0'

  export interface EmTooltipActivatorProps extends Pick<
    TooltipActivatorProps,
    'as' | 'renderless' | 'namespace'
  > {
    /**
     * When true, Activator is a pure slot host — bind `attrs` onto your own
     * trigger (e.g. EmButton) so you do not nest interactive elements.
     */
    renderless?: TooltipActivatorProps['renderless']
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipActivator' })

  const {
    as,
    renderless = false,
    namespace,
  } = defineProps<EmTooltipActivatorProps>()
</script>

<template>
  <Tooltip.Activator
    v-slot="slotProps"
    :as
    class="emerald-tooltip__activator"
    :namespace
    :renderless
  >
    <slot v-bind="slotProps" />
  </Tooltip.Activator>
</template>
