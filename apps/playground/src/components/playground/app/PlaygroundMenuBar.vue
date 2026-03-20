<script setup lang="ts">
  // Framework
  import { Popover, useBreakpoints, useStorage } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'
  import PlaygroundOpenDialog from './PlaygroundOpenDialog.vue'
  import AppIcon from '@/components/app/AppIcon.vue'

  // Utilities
  import { shallowRef } from 'vue'

  const playground = usePlayground()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const sidePref = storage.get('playground-preview-right', false)

  const confirming = shallowRef(false)
  const dialog = shallowRef(false)
  let confirmTimer = 0

  function onReset () {
    if (confirming.value) {
      clearTimeout(confirmTimer)
      confirming.value = false
      playground.applyPreset(playground.activePreset.value)
    } else {
      confirming.value = true
      confirmTimer = window.setTimeout(() => {
        confirming.value = false
      }, 3000)
    }
  }

  function onIntro () {
    playground.left.value = !playground.left.value
    const open = playground.left.value

    if (open && !breakpoints.isMobile.value && playground.side.value) {
      playground.side.value = false
      playground.bottom.value = true
    } else if (!open && !breakpoints.isMobile.value && sidePref.value && !playground.side.value) {
      playground.side.value = true
      playground.bottom.value = false
    }
  }
</script>

<template>
  <div class="flex items-center gap-1">
    <!-- File menu -->
    <Popover.Root>
      <Popover.Activator
        class="px-2 py-1 text-xs text-on-surface-variant rounded hover:bg-surface-tint transition-colors cursor-pointer"
        target="playground-file-menu"
      >
        File
      </Popover.Activator>

      <Popover.Content
        id="playground-file-menu"
        class="bg-surface border border-divider rounded-md shadow-lg py-1 min-w-48"
        position-area="bottom span-right"
      >
        <button
          class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
          type="button"
          @click="dialog = true"
        >
          Open...
        </button>

        <button
          class="w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors text-left"
          :class="confirming ? 'text-error bg-error/10' : 'text-on-surface hover:bg-surface-tint'"
          type="button"
          @click="onReset"
        >
          {{ confirming ? 'Reset? Click to confirm' : 'Reset Playground' }}
        </button>
      </Popover.Content>
    </Popover.Root>

    <!-- View menu -->
    <Popover.Root>
      <Popover.Activator
        class="px-2 py-1 text-xs text-on-surface-variant rounded hover:bg-surface-tint transition-colors cursor-pointer"
        target="playground-view-menu"
      >
        View
      </Popover.Activator>

      <Popover.Content
        id="playground-view-menu"
        class="bg-surface border border-divider rounded-md shadow-lg py-1 min-w-48"
        position-area="bottom span-right"
      >
        <button
          class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
          type="button"
          @click="onIntro"
        >
          <AppIcon
            v-if="playground.left.value"
            icon="check"
            :size="12"
          />
          <span v-else class="w-3" />
          Intro Panel
        </button>
      </Popover.Content>
    </Popover.Root>
  </div>

  <PlaygroundOpenDialog
    v-if="dialog"
    @close="dialog = false"
  />
</template>
