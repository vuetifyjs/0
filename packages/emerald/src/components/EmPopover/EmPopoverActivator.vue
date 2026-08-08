<script lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  // Types
  import type { PopoverActivatorProps } from '@vuetify/v0'

  export interface EmPopoverActivatorProps extends Pick<PopoverActivatorProps, 'as'> {
    /**
     * When true, Activator is a pure slot host — bind `attrs` onto your own
     * trigger (e.g. EmButton) so you do not nest interactive elements.
     */
    renderless?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPopoverActivator' })

  const {
    as,
    renderless = false,
  } = defineProps<EmPopoverActivatorProps>()
</script>

<template>
  <!-- `attrs` carries the CSS anchor-name in its `style` entry, so binding
       `attrs` alone anchors the content — unlike Tooltip.Activator, which
       exposes `styles` separately. -->
  <Popover.Activator
    v-slot="slotProps"
    :as
    class="emerald-popover__activator"
    :renderless
  >
    <slot v-bind="slotProps" />
  </Popover.Activator>
</template>
