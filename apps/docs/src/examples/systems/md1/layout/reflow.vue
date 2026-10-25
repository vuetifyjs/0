<script setup lang="ts">
  import { Md1List, Md1Tabs, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { useElementSize } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const widths: Record<string, string> = { handset: '360px', tablet: '600px', fill: '100%' }
  const size = shallowRef('fill')

  const frame = useTemplateRef<HTMLElement>('frame')
  const { width } = useElementSize(frame)
  const wide = toRef(() => width.value >= 600)

  const sections = [
    { value: 'overview', label: 'Overview', text: 'A two-person tent that pitches in four minutes and packs to the size of a loaf of bread.' },
    { value: 'specs', label: 'Specs', text: '1.6 kg packed. 210 x 130 cm floor. Two doors, two vestibules, 3,000 mm waterproof fly.' },
    { value: 'reviews', label: 'Reviews', text: '4.6 out of 5 from 212 reviews. "Held up through two nights of mountain wind."' },
  ]

  const section = shallowRef('overview')
  const shown = toRef(() => sections.find(entry => entry.value === section.value) ?? sections[0])
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
        <Md1Toolbar variant="primary">
          <Md1Toolbar.Nav icon="up" />

          <Md1Toolbar.Title>Trail tent</Md1Toolbar.Title>
        </Md1Toolbar>

        <!-- Horizontal tabs on a handset reflow into a vertical list beside the content. -->
        <Md1Tabs v-if="!wide" v-model="section" class="md1-docs-layout-reflow-tabs">
          <Md1Tabs.List label="Product">
            <Md1Tabs.Item
              v-for="entry in sections"
              :key="entry.value"
              :label="entry.label"
              :value="entry.value"
            />
          </Md1Tabs.List>
        </Md1Tabs>

        <div class="md1-docs-layout-reflow-body" :data-wide="wide || undefined">
          <nav v-if="wide" aria-label="Product" class="md1-docs-layout-reflow-nav">
            <Md1List v-model="section">
              <Md1List.Item v-for="entry in sections" :key="entry.value" :value="entry.value">{{ entry.label }}</Md1List.Item>
            </Md1List>
          </nav>

          <!-- Within the card, media stacks above the text, then sits beside it when the ratio allows. -->
          <article class="md1-docs-layout-reflow-card md1-elevation-2">
            <img alt="" class="md1-docs-layout-reflow-media" src="https://picsum.photos/seed/md1-reflow-tent/400/400">

            <div class="md1-docs-layout-reflow-text">
              <h3 class="md1-type-title">{{ shown.label }}</h3>

              <p class="md1-type-body-1">{{ shown.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-reflow-tabs {
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-layout-reflow-body {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
    overflow-y: auto;
  }

  .md1-docs-layout-reflow-nav {
    flex: 0 0 160px;
    align-self: flex-start;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-layout-reflow-card {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-self: flex-start;
    min-width: 0;
    overflow: hidden;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-layout-reflow-body[data-wide] .md1-docs-layout-reflow-card {
    flex-direction: row;
  }

  .md1-docs-layout-reflow-media {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .md1-docs-layout-reflow-body[data-wide] .md1-docs-layout-reflow-media {
    width: 160px;
    aspect-ratio: 1;
  }

  .md1-docs-layout-reflow-text {
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-layout-reflow-text > h3,
  .md1-docs-layout-reflow-text > p {
    margin: 0 0 var(--md1-spacing-1, 8px);
  }
</style>
