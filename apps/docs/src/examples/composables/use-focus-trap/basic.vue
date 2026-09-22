<script setup lang="ts">
  import { Button, useFocusTrap } from '@vuetify/v0'
  import { shallowRef, useTemplateRef } from 'vue'

  const isOpen = shallowRef(false)
  const panel = useTemplateRef<HTMLElement>('panel')

  useFocusTrap(panel, {
    active: isOpen,
    onEscape: event => {
      event.preventDefault()
      isOpen.value = false
    },
  })
</script>

<template>
  <div class="flex flex-col gap-3">
    <Button.Root
      class="self-start px-4 py-2 bg-primary text-on-primary rounded"
      @click="isOpen = true"
    >
      Open panel
    </Button.Root>

    <p class="text-sm text-on-surface-variant">
      {{ isOpen
        ? 'Tab from Confirm wraps to First stop. Escape or Cancel returns to Open panel.'
        : 'Open the panel, then Tab — focus stays inside until you close it.' }}
    </p>

    <div
      v-if="isOpen"
      ref="panel"
      aria-label="Trapped panel"
      class="flex flex-col gap-3 p-4 border-2 border-primary rounded bg-surface"
      tabindex="-1"
    >
      <input
        class="px-3 py-2 border border-divider rounded bg-surface"
        placeholder="First stop"
      >

      <input
        class="px-3 py-2 border border-divider rounded bg-surface"
        placeholder="Second stop"
      >

      <div class="flex gap-2">
        <Button.Root
          class="px-3 py-2 bg-surface-tint rounded"
          @click="isOpen = false"
        >
          Cancel
        </Button.Root>

        <Button.Root
          class="px-3 py-2 bg-primary text-on-primary rounded"
          @click="isOpen = false"
        >
          Confirm
        </Button.Root>
      </div>
    </div>
  </div>
</template>
