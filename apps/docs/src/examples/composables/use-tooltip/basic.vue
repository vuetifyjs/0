<script setup lang="ts">
  import { Button, useTooltip } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const region = useTooltip()
  const opened = shallowRef(0)

  function ping () {
    const ticket = region.register({ id: `demo-${++opened.value}` })
    setTimeout(() => region.unregister(ticket.id), 1000)
  }
</script>

<template>
  <div class="flex flex-col gap-3 items-center">
    <div class="flex gap-2">
      <div
        class="px-2 py-1 rounded text-xs"
        :class="region.isAnyOpen.value
          ? 'bg-success text-on-success'
          : 'bg-surface-variant text-on-surface-variant'"
      >
        isAnyOpen: {{ region.isAnyOpen.value }}
      </div>

      <div class="px-2 py-1 rounded text-xs bg-surface-variant text-on-surface-variant">
        openDelay: {{ region.openDelay.value }}ms
      </div>

      <div class="px-2 py-1 rounded text-xs bg-surface-variant text-on-surface-variant">
        skipDelay: {{ region.skipDelay.value }}ms
      </div>
    </div>

    <Button.Root
      class="px-3 py-1 text-sm rounded border border-divider hover:bg-surface-tint"
      @click="ping"
    >
      Open synthetic tooltip for 1 second
    </Button.Root>

    <p class="text-xs text-on-surface-variant max-w-md text-center">
      Each click registers a tooltip ticket for 1 second. Click rapidly
      to keep `isAnyOpen` true and observe how the skip-window behaves
      via {{ '`shouldSkipOpenDelay()`' }}.
    </p>
  </div>
</template>
