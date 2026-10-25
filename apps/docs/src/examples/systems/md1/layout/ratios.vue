<script setup lang="ts">
  import { Md1Card, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  // The recommended ratios, written width:height.
  const ratios = [
    { label: '16:9', width: 16, height: 9 },
    { label: '3:2', width: 3, height: 2 },
    { label: '4:3', width: 4, height: 3 },
    { label: '1:1', width: 1, height: 1 },
    { label: '3:4', width: 3, height: 4 },
    { label: '2:3', width: 2, height: 3 },
  ]

  const chosen = shallowRef('16:9')
  const ratio = toRef(() => ratios.find(entry => entry.label === chosen.value) ?? ratios[0])

  // Height = width / ratio, on a 360 dp screen and on a card inside its 16 dp margins.
  const screen = 360
  const element = screen - 32

  const tall = toRef(() => Math.round(screen * ratio.value.height / ratio.value.width))
  const short = toRef(() => Math.round(element * ratio.value.height / ratio.value.width))
  const aspect = toRef(() => `${ratio.value.width} / ${ratio.value.height}`)
</script>

<template>
  <div class="md1-docs-layout-pattern-stack">
    <Md1ToggleButtons v-model="chosen" label="Aspect ratio" mandatory>
      <Md1ToggleButtons.Item v-for="entry in ratios" :key="entry.label" :value="entry.label">{{ entry.label }}</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <div class="md1-docs-layout-ratios">
      <figure class="md1-docs-layout-ratios-figure">
        <div class="md1-docs-screen md1-docs-layout-ratios-screen">
          <img
            alt=""
            class="md1-docs-layout-ratios-media"
            src="https://picsum.photos/seed/md1-ratio-coast/720/1080"
            :style="{ aspectRatio: aspect }"
          >

          <p class="md1-type-body-1 md1-docs-layout-ratios-text">The image spans the screen: 360 dp wide, so {{ chosen }} makes it {{ tall }} dp tall.</p>
        </div>

        <figcaption class="md1-docs-layout-ratios-caption">Screen width: {{ screen }} x {{ tall }} dp</figcaption>
      </figure>

      <figure class="md1-docs-layout-ratios-figure">
        <div class="md1-docs-screen md1-docs-layout-ratios-screen">
          <Md1Toolbar variant="primary">
            <Md1Toolbar.Title>Places</Md1Toolbar.Title>
          </Md1Toolbar>

          <div class="md1-docs-layout-ratios-body">
            <Md1Card>
              <img
                alt=""
                class="md1-docs-layout-ratios-media"
                src="https://picsum.photos/seed/md1-ratio-coast/720/1080"
                :style="{ aspectRatio: aspect }"
              >

              <Md1Card.Title>Coastline</Md1Card.Title>
            </Md1Card>
          </div>
        </div>

        <figcaption class="md1-docs-layout-ratios-caption">Element width: {{ element }} x {{ short }} dp</figcaption>
      </figure>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-ratios {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
  }

  .md1-docs-layout-ratios-figure {
    width: 100%;
    max-width: 360px;
    margin: 0;
  }

  .md1-docs-layout-ratios-screen {
    height: 440px;
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-layout-ratios-media {
    display: block;
    width: 100%;
    object-fit: cover;
    transition: aspect-ratio var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-layout-ratios-text {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The element keyline: the card sits inside the 16 dp screen margins. */
  .md1-docs-layout-ratios-body {
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-layout-ratios-caption {
    margin-top: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }
</style>
