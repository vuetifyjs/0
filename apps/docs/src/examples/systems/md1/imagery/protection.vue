<script setup lang="ts">
  import { Md1Slider, Md1ToggleButtons } from '@paper/md1'
  import { shallowRef, toRef, watch } from 'vue'

  type Mode = 'dark' | 'light' | 'gradient'

  // The imagery page's ranges: dark scrims ideally 20% to 40%, light scrims
  // 40% to 60%; its worked example takes 60% black.
  const RANGES = {
    dark: { min: 20, max: 60, start: 40 },
    light: { min: 40, max: 60, start: 50 },
    gradient: { min: 20, max: 60, start: 60 },
  } as const

  const mode = shallowRef<Mode>('dark')
  const opacity = shallowRef<number>(RANGES.dark.start)
  const range = toRef(() => RANGES[mode.value])

  watch(mode, value => {
    opacity.value = RANGES[value].start
  })

  // Three app bar heights long, its centre three tenths of the way from the
  // dark end, fading to 0 at the far end.
  const scrim = toRef(() => {
    const ink = mode.value === 'light' ? '255 255 255' : '0 0 0'

    return {
      background: `linear-gradient(to top, rgb(${ink} / ${opacity.value / 100}), calc(var(--md1-increment, 56px) * 0.9), transparent calc(var(--md1-increment, 56px) * 3))`,
    }
  })
</script>

<template>
  <div class="md1-docs-imagery-stack">
    <div class="md1-docs-imagery-controls">
      <Md1ToggleButtons v-model="mode" label="Protection" mandatory>
        <Md1ToggleButtons.Item value="dark">Dark scrim</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="light">Light scrim</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="gradient">Gradient</Md1ToggleButtons.Item>
      </Md1ToggleButtons>

      <div class="md1-docs-imagery-slider">
        <Md1Slider
          :key="mode"
          v-model="opacity"
          discrete
          label="Dark end opacity"
          :max="range.max"
          :min="range.min"
          :step="5"
        />

        <span class="md1-docs-note md1-docs-imagery-value">{{ opacity }}%</span>
      </div>
    </div>

    <figure class="md1-docs-imagery-figure">
      <div class="md1-docs-imagery-frame" :data-mode="mode">
        <img
          v-if="mode !== 'gradient'"
          alt=""
          class="md1-docs-imagery-image"
          :src="mode === 'light' ? 'https://picsum.photos/seed/md1-imagery-snow/800/600' : 'https://picsum.photos/seed/md1-imagery-coast/800/600'"
        >

        <div class="md1-docs-imagery-scrim" :style="scrim" />

        <div v-if="mode !== 'gradient'" class="md1-docs-imagery-text">
          <p class="md1-docs-imagery-title md1-type-headline">Coastal walks</p>

          <p class="md1-docs-imagery-subtitle md1-type-body-1">Six routes along the cliffs</p>
        </div>

        <ol aria-label="Gradient stops" class="md1-docs-imagery-stops">
          <li class="md1-docs-imagery-stop" data-stop="end">3. End point, 0%</li>

          <li class="md1-docs-imagery-stop" data-stop="centre">2. Centre, 3/10 toward the dark end</li>

          <li class="md1-docs-imagery-stop" data-stop="dark">1. Dark end, {{ opacity }}%</li>
        </ol>
      </div>

      <figcaption class="md1-docs-note">Three app bar heights long (168 dp on a phone, 192 dp from 600 dp), from the dark end at the bottom edge to 0</figcaption>
    </figure>

    <figure class="md1-docs-imagery-figure">
      <div class="md1-docs-imagery-frame md1-docs-imagery-targeted">
        <img alt="" class="md1-docs-imagery-image" src="https://picsum.photos/seed/md1-imagery-forest/800/1000">

        <div class="md1-docs-imagery-target-top">
          <p class="md1-docs-imagery-bar-title md1-type-title">Forest trails</p>
        </div>

        <div class="md1-docs-imagery-target-bottom">
          <p class="md1-docs-imagery-title md1-type-headline">Pine ridge loop</p>

          <p class="md1-docs-imagery-subtitle md1-type-body-1">8 km, 3 hours</p>
        </div>
      </div>

      <figcaption class="md1-docs-note">Large images: protection only where the text is, under the title at the top and the caption at the bottom</figcaption>
    </figure>
  </div>
</template>

<style>
  .md1-docs-imagery-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-imagery-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px);
  }

  .md1-docs-imagery-slider {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: min(100%, 280px);
  }

  /*
   * A fixed width for the value, so dragging never changes the text's width,
   * resizes the slider and moves the thumb out from under the pointer.
   */
  .md1-docs-imagery-value {
    flex: none;
    min-inline-size: 4ch;
    font-variant-numeric: tabular-nums;
    text-align: end;
  }

  .md1-docs-imagery-slider > :first-child {
    flex: 1;
    min-width: 0;
  }

  .md1-docs-imagery-figure {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    width: min(100%, 400px);
    margin: 0;
  }

  .md1-docs-imagery-frame {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: clip;
    background: var(--md1-grey-500, #9E9E9E);
  }

  /* The gradient alone, on the light surface it would sit over. */
  .md1-docs-imagery-frame[data-mode='gradient'] {
    background: var(--md1-white, #FFFFFF);
  }

  .md1-docs-imagery-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .md1-docs-imagery-scrim {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .md1-docs-imagery-text {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
  }

  .md1-docs-imagery-title,
  .md1-docs-imagery-subtitle,
  .md1-docs-imagery-bar-title {
    margin: 0;
    color: var(--md1-white, #FFFFFF);
  }

  .md1-docs-imagery-subtitle {
    color: rgb(255 255 255 / 0.7);
  }

  /* Over a light scrim the ink turns dark: 87% and 54% black. */
  .md1-docs-imagery-frame[data-mode='light'] .md1-docs-imagery-title {
    color: rgb(0 0 0 / 0.87);
  }

  .md1-docs-imagery-frame[data-mode='light'] .md1-docs-imagery-subtitle {
    color: rgb(0 0 0 / 0.54);
  }

  /* The three numbered stops, ruled across the frame at the bottom edge, 50 dp and 168 dp. */
  .md1-docs-imagery-stops {
    position: absolute;
    inset: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    pointer-events: none;
  }

  .md1-docs-imagery-stop {
    position: absolute;
    inset-inline-end: 0;
    padding: 0 var(--md1-spacing-1, 8px);
    border-bottom: 1px dashed var(--md1-accent, #FF4081);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 11px;
    line-height: 16px;
    color: var(--md1-accent, #FF4081);
    background: rgb(255 255 255 / 0.85);
  }

  .md1-docs-imagery-stop[data-stop='end'] {
    bottom: calc(var(--md1-increment, 56px) * 3);
  }

  .md1-docs-imagery-stop[data-stop='centre'] {
    bottom: calc(var(--md1-increment, 56px) * 0.9);
  }

  .md1-docs-imagery-stop[data-stop='dark'] {
    bottom: 0;
    border-bottom: 0;
  }

  .md1-docs-imagery-frame:not([data-mode='gradient']) .md1-docs-imagery-stops {
    display: none;
  }

  .md1-docs-imagery-targeted {
    aspect-ratio: 4 / 5;
  }

  /* Each band is as tall as its text needs plus the fade, not a wash over the photograph. */
  .md1-docs-imagery-target-top {
    position: absolute;
    inset-inline: 0;
    top: 0;
    height: calc(var(--md1-increment, 56px) * 2);
    padding: 0 var(--md1-keyline-margin, 16px);
    line-height: var(--md1-increment, 56px);
    background: linear-gradient(to bottom, rgb(0 0 0 / 0.4), calc(var(--md1-increment, 56px) * 0.6), transparent);
  }

  .md1-docs-imagery-bar-title {
    line-height: var(--md1-increment, 56px);
  }

  .md1-docs-imagery-target-bottom {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: var(--md1-spacing-5, 40px) var(--md1-keyline-margin, 16px) var(--md1-spacing-2, 16px);
    background: linear-gradient(to top, rgb(0 0 0 / 0.4), 30%, transparent);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
