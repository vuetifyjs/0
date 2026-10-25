<script setup lang="ts">
  import { Md1Button, Md1Fab, Md1Toolbar, useMorph } from '@paper/md1'
  import { nextTick, shallowRef, useTemplateRef } from 'vue'

  const fab = useTemplateRef('fab')
  const bar = useTemplateRef('bar')
  const open = shallowRef(false)
  const busy = shallowRef(false)
  const { morph } = useMorph()

  // Expand, then widen: the circle travels to the bar and grows to its height, then stretches to its width.
  const shape = { shape: 'rect', lead: 'height', lag: 0.5, veil: true } as const

  async function onOpen () {
    if (busy.value) return

    busy.value = true
    open.value = true
    await nextTick()
    ;(await morph({ ...shape, from: fab, to: bar, clip: '.md1-toolbar' }))()
    busy.value = false
  }

  async function onClose () {
    if (!open.value || busy.value) return

    busy.value = true

    const done = await morph({ ...shape, from: fab, to: bar, clip: '.md1-toolbar', reverse: true })

    open.value = false
    await nextTick()
    done()
    busy.value = false
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-fab-screen">
    <div class="md1-docs-fab-scroller" @scroll.passive="onClose">
      <p v-for="index in 12" :key="index" class="md1-docs-fab-note">
        Note {{ index }}: press the button to attach something. Scrolling turns the toolbar back into the button.
      </p>
    </div>

    <Md1Fab
      ref="fab"
      aria-label="Attach"
      :class="{ 'md1-docs-fab-away': open }"
      icon="add"
      @click="onOpen"
    />

    <div v-if="open" ref="bar" class="md1-docs-fab-bar">
      <Md1Toolbar class="md1-docs-fab-toolbar">
        <Md1Toolbar.Actions aria-label="Attach">
          <Md1Button aria-label="Photo" icon="photo" />

          <Md1Button aria-label="Place" icon="place" />

          <Md1Button aria-label="Event" icon="event" />

          <Md1Button aria-label="Voice note" icon="mic" />

          <Md1Button aria-label="Close" icon="close" @click="onClose" />
        </Md1Toolbar.Actions>
      </Md1Toolbar>
    </div>
  </div>
</template>

<style>
  .md1-docs-fab-scroller {
    height: 100%;
    overflow-y: auto;
  }

  /* The FAB keeps its box while the toolbar stands in for it, so the reverse transform can measure it. */
  .md1-docs-fab-away {
    visibility: hidden;
  }

  .md1-docs-fab-bar {
    position: absolute;
    inset: auto 0 0;
    z-index: 2;
  }

  /* The toolbar the FAB becomes keeps the FAB's colour. */
  .md1-docs-fab-toolbar.md1-toolbar {
    background: var(--md1-accent, #FF4081);
    color: var(--md1-on-accent, #FFFFFF);
  }

  .md1-docs-fab-toolbar .md1-toolbar__row {
    justify-content: space-around;
  }

  .md1-docs-fab-toolbar .md1-button {
    color: inherit;
  }
</style>
