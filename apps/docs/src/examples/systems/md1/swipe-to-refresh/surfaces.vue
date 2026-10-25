<script setup lang="ts">
  import { Md1Button, Md1ProgressCircular } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const frames = [
    { id: 'extended', title: 'Extended app bar', rows: 3 },
    { id: 'raised', title: 'Raised sheet', rows: 3 },
    { id: 'coplanar', title: 'Coplanar region', rows: 3 },
    { id: 'below', title: 'Below the app bar', rows: 3 },
  ] as const

  const active = shallowRef<string[]>([])
  const status = shallowRef('')

  const timers = frames.map(frame => useTimer(() => {
    active.value = active.value.filter(id => id !== frame.id)
    status.value = `${frame.title} updated.`
  }, { duration: 1800 }))

  function onRefresh (index: number) {
    const frame = frames[index]!

    if (active.value.includes(frame.id)) return

    active.value = [...active.value, frame.id]
    status.value = `Refreshing ${frame.title.toLowerCase()}.`
    timers[index]!.start()
  }
</script>

<template>
  <div class="md1-docs-refresh-surfaces">
    <div
      v-for="(frame, index) in frames"
      :key="frame.id"
      class="md1-docs-refresh-frame"
      :data-variant="frame.id"
    >
      <div class="md1-docs-refresh-frame-bar">
        <span class="md1-docs-refresh-frame-title">{{ frame.title }}</span>

        <Md1Button
          :aria-label="`Refresh ${frame.title.toLowerCase()}`"
          :disabled="active.includes(frame.id)"
          icon="refresh"
          @click="onRefresh(index)"
        />
      </div>

      <div class="md1-docs-refresh-frame-region">
        <div
          :aria-hidden="active.includes(frame.id) ? undefined : 'true'"
          class="md1-docs-refresh-frame-disc"
          :data-active="active.includes(frame.id) || undefined"
        >
          <Md1ProgressCircular
            :aria-label="`Refreshing ${frame.title.toLowerCase()}`"
            :size="28"
            :value="active.includes(frame.id) ? undefined : 80"
          />
        </div>

        <div v-for="row in frame.rows" :key="row" class="md1-docs-refresh-frame-row" />
      </div>
    </div>

    <span class="md1-docs-refresh-frame-status" role="status">{{ status }}</span>
  </div>
</template>

<style>
  .md1-docs-refresh-surfaces {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  /* A small handset frame: a bar, then the region that refreshes. */
  .md1-docs-refresh-frame {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 280px;
    overflow: hidden;
    background: var(--md1-background, #FAFAFA);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-refresh-frame-bar {
    position: relative;
    z-index: 2;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: var(--md1-increment, 56px);
    padding-inline: var(--md1-keyline-margin, 16px) 4px;
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
    box-shadow: var(--md1-elevation-4);
  }

  .md1-docs-refresh-frame-bar .md1-button[data-variant] {
    color: inherit;
  }

  .md1-docs-refresh-frame-title {
    overflow: hidden;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: 500;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* The refreshing content clips the indicator, so it always enters from this surface's top edge. */
  .md1-docs-refresh-frame-region {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }

  .md1-docs-refresh-frame-row {
    height: 56px;
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* The indicator: the 40 dp disc on the surface colour at 3 dp, waiting above the region's edge. */
  .md1-docs-refresh-frame-disc {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-3);
    transform: translate(-50%, -48px) scale(1);
    transition: transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-refresh-frame-disc[data-active] {
    transform: translate(-50%, 16px);
  }

  /* 1. Extended app bar: the flexible space is tall, and the indicator drops from its bottom edge. */
  .md1-docs-refresh-frame[data-variant='extended'] .md1-docs-refresh-frame-bar {
    align-items: flex-start;
    height: 112px;
    padding-block-start: 4px;
  }

  .md1-docs-refresh-frame[data-variant='extended'] .md1-docs-refresh-frame-title {
    align-self: flex-end;
    padding-block-end: var(--md1-spacing-2, 16px);
    font-size: var(--md1-type-title-size, 20px);
  }

  /* 2. Raised sheet: the content sits at 2 dp over the background, so the indicator enters from the sheet's edge, not the bar's. */
  .md1-docs-refresh-frame[data-variant='raised'] .md1-docs-refresh-frame-region {
    margin: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px) 0;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2);
  }

  .md1-docs-refresh-frame[data-variant='raised'] .md1-docs-refresh-frame-bar {
    box-shadow: none;
  }

  /* 3. Coplanar: bar and content share one plane; only a divider marks the edge the indicator enters from. */
  .md1-docs-refresh-frame[data-variant='coplanar'] .md1-docs-refresh-frame-bar {
    background: var(--md1-background, #FAFAFA);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    box-shadow: none;
  }

  /* 4. Below another surface: cards scroll under a 4 dp app bar, and the indicator slides out from under it. */
  .md1-docs-refresh-frame[data-variant='below'] .md1-docs-refresh-frame-region {
    padding: var(--md1-spacing-1, 8px);
  }

  .md1-docs-refresh-frame[data-variant='below'] .md1-docs-refresh-frame-row {
    margin-block-end: var(--md1-spacing-1, 8px);
    background: var(--md1-surface, #FFFFFF);
    border: 0;
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2);
  }

  .md1-docs-refresh-frame-status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-refresh-frame-disc {
      transition: none;
    }
  }
</style>
