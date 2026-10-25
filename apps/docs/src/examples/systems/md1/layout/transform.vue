<script setup lang="ts">
  import { Md1GridList, Md1List, Md1Tabs, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { useElementSize } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const widths: Record<string, string> = { handset: '360px', tablet: '600px', fill: '100%' }
  const size = shallowRef('fill')

  const frame = useTemplateRef<HTMLElement>('frame')
  const { width } = useElementSize(frame)
  const wide = toRef(() => width.value >= 600)

  const sections = ['Albums', 'Artists', 'Songs']
  const section = shallowRef('Albums')

  const albums = [
    { id: 1, title: 'Morning harbour', artist: 'The Quiet Hours' },
    { id: 2, title: 'Pine ridge', artist: 'Ada Lane' },
    { id: 3, title: 'Salt flats', artist: 'North Fork' },
    { id: 4, title: 'Old town', artist: 'The Quiet Hours' },
    { id: 5, title: 'Night market', artist: 'Ada Lane' },
    { id: 6, title: 'Glacier lake', artist: 'North Fork' },
  ]
</script>

<template>
  <div class="md1-docs-layout-pattern-stack">
    <Md1ToggleButtons v-model="size" label="Window width" mandatory>
      <Md1ToggleButtons.Item value="handset">360 dp</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="tablet">600 dp</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="fill">Fill</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <div ref="frame" class="md1-docs-screen md1-docs-layout-pattern-screen" :style="{ maxWidth: widths[size] }">
      <div class="md1-docs-layout-pattern-column">
        <!-- Side navigation on a handset becomes tabs once the destinations fit across the bar. -->
        <Md1Toolbar variant="primary">
          <Md1Toolbar.Nav v-if="!wide" />

          <Md1Toolbar.Title>{{ wide ? 'Music' : section }}</Md1Toolbar.Title>
        </Md1Toolbar>

        <Md1Tabs v-if="wide" v-model="section" class="md1-docs-layout-transform-tabs">
          <Md1Tabs.List label="Library">
            <Md1Tabs.Item
              v-for="name in sections"
              :key="name"
              :label="name"
              :value="name"
            />
          </Md1Tabs.List>
        </Md1Tabs>

        <div class="md1-docs-layout-transform-body">
          <!-- A list becomes a grid list when the width can hold several columns of artwork. -->
          <Md1GridList v-if="wide" :gutter="4">
            <Md1GridList.Tile
              v-for="album in albums"
              :key="album.id"
              :src="`https://picsum.photos/seed/md1-grid-${album.id}/400/400`"
            >
              <Md1GridList.Bar :subtitle="album.artist" :title="album.title" />
            </Md1GridList.Tile>
          </Md1GridList>

          <Md1List v-else :aria-label="section" :lines="2">
            <Md1List.Item v-for="album in albums" :key="album.id">
              <Md1List.Avatar :src="`https://picsum.photos/seed/md1-grid-${album.id}/80/80`" />

              <Md1List.Content>
                <Md1List.Primary>{{ album.title }}</Md1List.Primary>

                <Md1List.Secondary>{{ album.artist }}</Md1List.Secondary>
              </Md1List.Content>
            </Md1List.Item>
          </Md1List>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-transform-tabs {
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-layout-transform-body {
    flex: 1 1 auto;
    min-height: 0;
    padding: var(--md1-spacing-1, 8px) 0;
    overflow-y: auto;
  }
</style>
