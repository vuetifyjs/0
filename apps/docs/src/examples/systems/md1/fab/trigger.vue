<script setup lang="ts">
  import { Md1Fab, useMorph } from '@paper/md1'
  import { nextTick, shallowRef, useTemplateRef } from 'vue'

  const fab = useTemplateRef('fab')
  const layer = useTemplateRef('layer')
  const live = shallowRef(false)
  const busy = shallowRef(false)
  const { morph } = useMorph()

  // The FAB stays: its press radiates the new state across the header from where it was pressed.
  const reaction = { from: fab, to: layer, move: false, hide: false, veil: false } as const

  async function onToggle () {
    if (busy.value) return

    busy.value = true

    if (live.value) {
      const done = await morph({ ...reaction, reverse: true })

      live.value = false
      await nextTick()
      done()
    } else {
      live.value = true
      await nextTick()
      ;(await morph(reaction))()
    }

    busy.value = false
  }
</script>

<template>
  <div class="md1-docs-fab-sheet">
    <div class="md1-docs-fab-header md1-docs-fab-trigger" data-fab-host>
      <div v-if="live" ref="layer" class="md1-docs-fab-live" />

      <span class="md1-docs-fab-title">{{ live ? 'Recording' : 'Voice memo' }}</span>

      <Md1Fab
        ref="fab"
        :aria-label="live ? 'Stop recording' : 'Record'"
        :aria-pressed="live"
        :icon="live ? 'pause' : 'mic'"
        position="seam"
        @click="onToggle"
      />
    </div>

    <p class="md1-docs-fab-body">
      {{ live ? '00:04 recorded. Press the button again to stop.' : 'Press the button to start recording.' }}
    </p>
  </div>
</template>

<style>
  /* The state the press brings in: the header turns red, the colour page's 500 for a live recording. */
  .md1-docs-fab-live {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: #F44336;
  }

  .md1-docs-fab-trigger .md1-docs-fab-title {
    position: relative;
  }
</style>
