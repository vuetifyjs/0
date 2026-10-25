<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Fab, Md1List, Md1NavigationDrawer, Md1Switch, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { useElementSize } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const devices: Record<string, { width: number, height: number }> = {
    mobile: { width: 360, height: 640 },
    tablet: { width: 960, height: 600 },
    desktop: { width: 1280, height: 800 },
  }

  const device = shallowRef('desktop')
  const labels = shallowRef(true)
  const nominal = toRef(() => devices[device.value] ?? { width: 360, height: 640 })

  // The frame is laid out at the device's size and scaled down to fit.
  const stage = useTemplateRef<HTMLElement>('stage')
  const { width } = useElementSize(stage)
  const zoom = toRef(() => width.value ? Math.min(1, width.value / nominal.value.width) : 1)

  const folder = shallowRef('inbox')
  const filter = shallowRef('all')

  const cards = ['Brunch this weekend?', 'Summer BBQ', 'Oui oui', 'Birthday gift']
</script>

<template>
  <div class="md1-docs-layout-pattern-stack">
    <div class="md1-docs-layout-regions-controls">
      <Md1ToggleButtons v-model="device" label="Device" mandatory>
        <Md1ToggleButtons.Item value="mobile">Mobile</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="tablet">Tablet</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="desktop">Desktop</Md1ToggleButtons.Item>
      </Md1ToggleButtons>

      <Md1Switch v-model="labels" label="Label regions" />
    </div>

    <div ref="stage" class="md1-docs-layout-regions-stage">
      <div
        class="md1-docs-screen md1-docs-layout-regions-screen"
        :data-device="device"
        :data-labels="labels || undefined"
        :style="{ width: `${nominal.width}px`, height: `${nominal.height}px`, zoom }"
      >
        <!-- App bar: permanent on every device; on tablet and desktop it absorbs the bottom bar's actions. -->
        <div class="md1-docs-layout-region" data-region="App bar">
          <Md1Toolbar variant="primary">
            <Md1Toolbar.Nav />

            <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>

            <Md1Toolbar.Actions>
              <Md1Button aria-label="Search" icon="search" />

              <template v-if="device !== 'mobile'">
                <Md1Button aria-label="Archive" icon="inbox" />

                <Md1Button aria-label="Delete" icon="delete" />
              </template>

              <Md1Button aria-label="More options" icon="more-vert" />
            </Md1Toolbar.Actions>
          </Md1Toolbar>
        </div>

        <div class="md1-docs-layout-regions-body">
          <!-- Side nav: overlays everything on mobile and tablet, so it is not shown; pinned on desktop. -->
          <div v-if="device === 'desktop'" class="md1-docs-layout-region md1-docs-layout-regions-nav" data-region="Side nav">
            <Md1Toolbar dense>
              <Md1Toolbar.Title>Folders</Md1Toolbar.Title>
            </Md1Toolbar>

            <Md1List v-model="folder">
              <Md1List.Item value="inbox">
                <Md1List.Icon name="inbox" />

                Inbox
              </Md1List.Item>

              <Md1List.Item value="sent">
                <Md1List.Icon name="send" />

                Sent mail
              </Md1List.Item>

              <Md1List.Item value="drafts">
                <Md1List.Icon name="drafts" />

                Drafts
              </Md1List.Item>
            </Md1List>
          </div>

          <div class="md1-docs-layout-region md1-docs-layout-regions-canvas" :data-region="device === 'mobile' ? 'Content area' : 'Content canvas'">
            <Md1Toolbar v-if="device === 'desktop'" dense>
              <Md1Toolbar.Title>Today</Md1Toolbar.Title>

              <Md1Toolbar.Actions>
                <Md1Button aria-label="Sort" icon="sort" />
              </Md1Toolbar.Actions>
            </Md1Toolbar>

            <div class="md1-docs-layout-regions-cards">
              <Md1Card v-for="card in cards" :key="card">
                <Md1Card.Title>{{ card }}</Md1Card.Title>

                <Md1Card.Subtitle>Ali Connors</Md1Card.Subtitle>
              </Md1Card>
            </div>
          </div>

          <!-- Right nav: reached temporarily on mobile; pinned beside the canvas on tablet and desktop. -->
          <div v-if="device !== 'mobile'" class="md1-docs-layout-region md1-docs-layout-regions-nav" data-region="Right nav">
            <Md1Toolbar v-if="device === 'desktop'" dense>
              <Md1Toolbar.Title>Filters</Md1Toolbar.Title>
            </Md1Toolbar>

            <Md1List v-model="filter">
              <Md1List.Item value="all">All mail</Md1List.Item>

              <Md1List.Item value="unread">Unread</Md1List.Item>

              <Md1List.Item value="starred">Starred</Md1List.Item>
            </Md1List>
          </div>
        </div>

        <!-- Bottom bar: optional, for overflow actions; tablet and desktop fold it into the app bar. -->
        <div v-if="device === 'mobile'" class="md1-docs-layout-region" data-region="Bottom bar">
          <Md1Toolbar>
            <Md1Toolbar.Actions>
              <Md1Button aria-label="Archive" icon="inbox" />

              <Md1Button aria-label="Delete" icon="delete" />

              <Md1Button aria-label="Label" icon="label" />
            </Md1Toolbar.Actions>
          </Md1Toolbar>
        </div>

        <Md1Fab aria-label="Compose" class="md1-docs-layout-regions-fab" icon="edit" />
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-regions-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-layout-regions-stage {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .md1-docs-layout-regions-screen {
    display: flex;
    flex-direction: column;
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-layout-region {
    position: relative;
  }

  .md1-docs-layout-regions-body {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
  }

  /* Side and right nav: five increments wide, the drawer width rule. */
  .md1-docs-layout-regions-nav {
    flex: 0 0 calc(5 * var(--md1-increment, 64px));
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-layout-regions-nav:first-child {
    border-inline-end: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-layout-regions-nav:last-child {
    border-inline-start: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-layout-regions-canvas {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
  }

  .md1-docs-layout-regions-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
  }

  /* Region labels: a dashed outline and the region's name, drawn over the real UI. */
  .md1-docs-layout-regions-screen[data-labels] .md1-docs-layout-region {
    outline: 2px dashed #E91E63;
    outline-offset: -2px;
  }

  .md1-docs-layout-regions-screen[data-labels] .md1-docs-layout-region::after {
    content: attr(data-region);
    position: absolute;
    inset-block-end: 4px;
    inset-inline-start: 4px;
    z-index: 3;
    padding: 2px 6px;
    border-radius: 2px;
    background: #E91E63;
    color: #FFFFFF;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 12px;
    line-height: 16px;
    pointer-events: none;
  }
</style>
