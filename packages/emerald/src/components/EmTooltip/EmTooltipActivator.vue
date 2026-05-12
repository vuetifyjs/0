<script lang="ts">
  // Framework
  import { PopoverActivator, usePopoverContext } from '@vuetify/v0'

  // Utilities
  import { onScopeDispose } from 'vue'

  export interface EmTooltipActivatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipActivator' })

  const popover = usePopoverContext()

  let openTimer: ReturnType<typeof setTimeout> | null = null
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  function clearTimers () {
    if (openTimer) clearTimeout(openTimer)
    if (closeTimer) clearTimeout(closeTimer)
    openTimer = null
    closeTimer = null
  }

  onScopeDispose(clearTimers)

  function onEnter () {
    clearTimers()
    openTimer = setTimeout(() => popover.open(), 200)
  }

  function onLeave () {
    clearTimers()
    closeTimer = setTimeout(() => popover.close(), 100)
  }
</script>

<template>
  <PopoverActivator
    class="emerald-tooltip__activator"
    @blur="onLeave"
    @focus="onEnter"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PopoverActivator>
</template>
