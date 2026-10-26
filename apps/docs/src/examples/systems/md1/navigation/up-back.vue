<script setup lang="ts">
  import { Md1Button, Md1List, Md1Toolbar } from '@paper/md1'
  import { ref, toRef } from 'vue'

  interface Scene {
    title: string
    parent?: string
  }

  const scenes: Record<string, Scene> = {
    albums: { title: 'Albums' },
    album: { title: 'Kind of Blue', parent: 'albums' },
    artists: { title: 'Artists' },
    artist: { title: 'Miles Davis', parent: 'artists' },
  }

  const history = ref<string[]>(['albums'])

  const current = toRef(() => history.value.at(-1) ?? 'albums')
  const scene = toRef(() => scenes[current.value] ?? { title: '' })
  const parent = toRef(() => scene.value.parent)
  const trail = toRef(() => history.value.map(id => scenes[id]?.title).join(' > '))

  function go (id: string) {
    history.value = [...history.value, id]
  }

  function onUp () {
    if (parent.value) go(parent.value)
  }

  function onBack () {
    history.value = history.value.slice(0, -1)
  }
</script>

<template>
  <div class="md1-docs-nav-stack">
    <div class="md1-docs-screen md1-docs-nav-screen">
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav v-if="parent" :aria-label="scenes[parent]?.title" icon="up" @click="onUp" />

        <Md1Toolbar.Nav v-else />

        <Md1Toolbar.Title>{{ scene.title }}</Md1Toolbar.Title>
      </Md1Toolbar>

      <div class="md1-docs-nav-sheet">
        <Md1List v-if="current === 'albums'">
          <Md1List.Item @click="go('album')">Kind of Blue</Md1List.Item>
        </Md1List>

        <Md1List v-else-if="current === 'album'">
          <Md1List.Item @click="go('artist')">More by Miles Davis</Md1List.Item>
        </Md1List>

        <Md1List v-else-if="current === 'artists'">
          <Md1List.Item @click="go('artist')">Miles Davis</Md1List.Item>
        </Md1List>

        <p v-else class="md1-docs-nav-text">Trumpeter and bandleader. Up goes to Artists, the parent of this screen; Back returns to the album you came from.</p>
      </div>
    </div>

    <div class="md1-docs-nav-row">
      <Md1Button :disabled="history.length < 2" icon="arrow-back" @click="onBack">Back</Md1Button>

      <p class="md1-docs-readout md1-docs-nav-note" role="status">History: {{ trail }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-nav-stack {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  /* A handset screen: the bar's fixed position resolves against this frame, not the page. */
  .md1-docs-nav-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  /* The screen's content sheet fills the frame under the bar. */
  .md1-docs-nav-sheet {
    flex: 1 1 auto;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-nav-text {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /*
   * Back on top and the history below it, each centred on its own, so the
   * history growing never moves the button.
   */
  .md1-docs-nav-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-nav-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
