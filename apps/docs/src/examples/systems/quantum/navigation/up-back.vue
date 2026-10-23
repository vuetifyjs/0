<script setup lang="ts">
  import { QuButton, QuList, QuToolbar } from '@paper/quantum'
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
  <div class="quantum-docs-nav-stack">
    <div class="quantum-docs-screen quantum-docs-nav-screen">
      <QuToolbar variant="primary">
        <QuToolbar.Nav v-if="parent" :aria-label="scenes[parent]?.title" icon="up" @click="onUp" />

        <QuToolbar.Nav v-else />

        <QuToolbar.Title>{{ scene.title }}</QuToolbar.Title>
      </QuToolbar>

      <div class="quantum-docs-nav-sheet">
        <QuList v-if="current === 'albums'">
          <QuList.Item @click="go('album')">Kind of Blue</QuList.Item>
        </QuList>

        <QuList v-else-if="current === 'album'">
          <QuList.Item @click="go('artist')">More by Miles Davis</QuList.Item>
        </QuList>

        <QuList v-else-if="current === 'artists'">
          <QuList.Item @click="go('artist')">Miles Davis</QuList.Item>
        </QuList>

        <p v-else class="quantum-docs-nav-text">Trumpeter and bandleader. Up goes to Artists, the parent of this screen; Back returns to the album you came from.</p>
      </div>
    </div>

    <div class="quantum-docs-nav-row">
      <QuButton :disabled="history.length < 2" icon="arrow-back" @click="onBack">Back</QuButton>

      <span class="quantum-docs-nav-note" role="status">History: {{ trail }}</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-nav-stack {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
  }

  /* A handset screen: the bar's fixed position resolves against this frame, not the page. */
  .quantum-docs-nav-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-nav-sheet {
    background: var(--quantum-surface, #FFFFFF);
  }

  .quantum-docs-nav-text {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-nav-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-nav-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
