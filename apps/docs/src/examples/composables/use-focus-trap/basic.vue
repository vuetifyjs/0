<script setup lang="ts">
  import { Button, useFocusTrap } from '@vuetify/v0'
  import { shallowRef, useTemplateRef } from 'vue'

  const isOpen = shallowRef(false)
  const panel = useTemplateRef<HTMLElement>('panel')

  useFocusTrap(panel, {
    active: isOpen,
    onEscape: () => {
      isOpen.value = false
    },
  })
</script>

<template>
  <div class="relative">
    <Button.Root
      class="px-4 py-2 bg-primary text-on-primary rounded"
      @click="isOpen = true"
    >
      Open panel
    </Button.Root>

    <p class="mt-2 text-sm text-on-surface-variant">
      Tab past the last button — focus wraps back to the first instead of
      reaching this page. Escape or Cancel closes the panel and returns focus
      to the trigger.
    </p>

    <div
      v-if="isOpen"
      class="mt-4 p-4 border border-divider rounded bg-surface"
    >
      <div
        ref="panel"
        aria-label="Trapped panel"
        aria-modal="true"
        class="flex flex-col gap-3"
        role="dialog"
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
  </div>
</template>
