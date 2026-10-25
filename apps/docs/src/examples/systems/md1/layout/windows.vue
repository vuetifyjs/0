<script setup lang="ts">
  import { Md1Button, Md1List, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { useElementSize } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const windows: Record<string, { width: number, height: number }> = {
    full: { width: 1280, height: 800 },
    horizontal: { width: 960, height: 540 },
    vertical: { width: 400, height: 640 },
  }

  const shape = shallowRef('full')
  const nominal = toRef(() => windows[shape.value] ?? { width: 1280, height: 800 })

  // A desktop window takes the handset or the tablet keylines by its own width.
  const tablet = toRef(() => nominal.value.width >= 600)
  const metrics = toRef(() => tablet.value
    ? { margin: 24, content: 80, increment: 64 }
    : { margin: 16, content: 72, increment: 56 })

  const stage = useTemplateRef<HTMLElement>('stage')
  const { width } = useElementSize(stage)
  const zoom = toRef(() => width.value ? Math.min(1, width.value / nominal.value.width, 360 / nominal.value.height) : 1)

  const rows = [
    { icon: 'folder', title: 'Photos', text: 'Jan 9, 2014' },
    { icon: 'folder', title: 'Recipes', text: 'Jan 17, 2014' },
    { icon: 'folder', title: 'Work', text: 'Jan 28, 2014' },
  ]
</script>

<template>
  <div class="md1-docs-layout-pattern-stack">
    <Md1ToggleButtons v-model="shape" label="Window" mandatory>
      <Md1ToggleButtons.Item value="full">Full screen</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="horizontal">Horizontal</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="vertical">Vertical</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <div ref="stage" class="md1-docs-layout-windows-stage">
      <div
        class="md1-docs-layout-windows-window md1-elevation-8"
        :style="{
          'width': `${nominal.width}px`,
          'height': `${nominal.height}px`,
          zoom,
          '--md1-keyline-margin': `${metrics.margin}px`,
          '--md1-keyline-content': `${metrics.content}px`,
          '--md1-increment': `${metrics.increment}px`,
        }"
      >
        <div aria-hidden="true" class="md1-docs-layout-windows-chrome" />

        <div class="md1-docs-screen md1-docs-layout-windows-app">
          <Md1Toolbar variant="primary">
            <Md1Toolbar.Nav />

            <Md1Toolbar.Title>My files</Md1Toolbar.Title>

            <Md1Toolbar.Actions>
              <Md1Button aria-label="Search" icon="search" />
            </Md1Toolbar.Actions>
          </Md1Toolbar>

          <Md1List aria-label="My files" :lines="2">
            <Md1List.Item v-for="row in rows" :key="row.title">
              <Md1List.Icon :name="row.icon" />

              <Md1List.Content>
                <Md1List.Primary>{{ row.title }}</Md1List.Primary>

                <Md1List.Secondary>{{ row.text }}</Md1List.Secondary>
              </Md1List.Content>
            </Md1List.Item>
          </Md1List>

          <span aria-hidden="true" class="md1-docs-layout-windows-keyline" data-keyline="margin" />

          <span aria-hidden="true" class="md1-docs-layout-windows-keyline" data-keyline="content" />

          <span aria-hidden="true" class="md1-docs-layout-windows-keyline" data-keyline="end" />
        </div>
      </div>
    </div>

    <p class="md1-docs-layout-windows-caption" role="status">
      {{ nominal.width }} x {{ nominal.height }} dp: {{ tablet ? 'tablet' : 'handset' }} keylines, {{ metrics.margin }} dp margins, {{ metrics.content }} dp content keyline, {{ metrics.increment }} dp increment
    </p>
  </div>
</template>

<style>
  .md1-docs-layout-windows-stage {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .md1-docs-layout-windows-window {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-background, #FAFAFA);
  }

  /* The operating system's title bar, drawn only to read as a window. */
  .md1-docs-layout-windows-chrome {
    flex: 0 0 24px;
    background: #E0E0E0;
  }

  [data-theme='md1-dark'] .md1-docs-layout-windows-chrome {
    background: #000000;
  }

  .md1-docs-layout-windows-app {
    flex: 1 1 auto;
    height: auto;
  }

  .md1-docs-layout-windows-keyline {
    position: absolute;
    inset-block: 0;
    width: 0;
    border-inline-start: 2px solid #E91E63;
    pointer-events: none;
  }

  .md1-docs-layout-windows-keyline[data-keyline='margin'] {
    inset-inline-start: var(--md1-keyline-margin);
  }

  .md1-docs-layout-windows-keyline[data-keyline='content'] {
    inset-inline-start: var(--md1-keyline-content);
  }

  .md1-docs-layout-windows-keyline[data-keyline='end'] {
    inset-inline-end: var(--md1-keyline-margin);
  }

  .md1-docs-layout-windows-caption {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }
</style>
