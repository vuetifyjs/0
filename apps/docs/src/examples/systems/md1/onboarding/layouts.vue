<script setup lang="ts">
  import { Md1Button, Md1Icon, Md1Switch } from '@paper/md1'
  import { shallowRef } from 'vue'

  const frames = [
    { id: 'phone-portrait', label: 'Mobile portrait' },
    { id: 'tablet-portrait', label: 'Tablet portrait' },
    { id: 'phone-landscape', label: 'Mobile landscape' },
    { id: 'tablet-landscape', label: 'Tablet landscape' },
    { id: 'desktop', label: 'Desktop' },
  ]

  const redlines = shallowRef(false)
</script>

<template>
  <div class="md1-docs-layouts-stack">
    <Md1Switch v-model="redlines" label="Show redlines" />

    <div class="md1-docs-layouts" :data-redlines="redlines || undefined">
      <figure v-for="frame in frames" :key="frame.id" class="md1-docs-layouts-figure">
        <div aria-hidden="true" class="md1-docs-layouts-frame" :data-shape="frame.id" inert>
          <div class="md1-docs-layouts-screen">
            <button v-if="frame.id === 'desktop'" class="md1-docs-layouts-arrow" data-redline="6" type="button">
              <Md1Icon name="arrow-back" />
            </button>

            <div class="md1-docs-layouts-slide">
              <div class="md1-docs-layouts-art">
                <Md1Icon class="md1-docs-layouts-glyph" name="language" />
              </div>

              <div class="md1-docs-layouts-text">
                <div class="md1-docs-layouts-copy" data-redline="4">
                  <span class="md1-docs-layouts-headline" data-redline="3"><span data-redline="1">Your lab, everywhere</span></span>

                  <span class="md1-docs-layouts-subhead" data-redline="2">Use everyday objects in your experiments</span>
                </div>

                <div class="md1-docs-layouts-controls" data-redline="5">
                  <Md1Button variant="raised">Get started</Md1Button>

                  <span v-if="frame.id !== 'desktop'" class="md1-docs-layouts-dots"><span class="md1-docs-layouts-dot" /><span class="md1-docs-layouts-dot" data-active /><span class="md1-docs-layouts-dot" /></span>
                </div>
              </div>
            </div>

            <button v-if="frame.id === 'desktop'" class="md1-docs-layouts-arrow" type="button">
              <Md1Icon name="arrow-forward" />
            </button>

            <span v-if="frame.id === 'desktop'" class="md1-docs-layouts-dots md1-docs-layouts-dots--desktop"><span class="md1-docs-layouts-dot" /><span class="md1-docs-layouts-dot" data-active /><span class="md1-docs-layouts-dot" /></span>
          </div>
        </div>

        <figcaption class="md1-docs-layouts-caption">{{ frame.label }}</figcaption>
      </figure>
    </div>

    <ol v-if="redlines" class="md1-docs-layouts-legend">
      <li>Headline: 24 sp on a 32 sp leading</li>

      <li>Subhead: 15 sp on 24 sp on handsets and tablets (the Subheading token's 16 sp here), 16 sp on 24 sp on desktop</li>

      <li>Line height: 32 sp</li>

      <li>56 dp from the top of the button to the centre of the copy, room for one to three lines</li>

      <li>24 dp of vertical padding: below the dots on handsets and tablets, from the card to the dots on desktop</li>

      <li>48 dp from the card to each arrow on desktop</li>
    </ol>
  </div>
</template>

<style>
  .md1-docs-layouts-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  .md1-docs-layouts {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-layouts-figure {
    margin: 0;
  }

  .md1-docs-layouts-caption {
    margin-block-start: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Each frame is the device at its real size in dp, drawn smaller with zoom so the type keeps its proportions. */
  .md1-docs-layouts-frame {
    overflow: hidden;
    border: 2px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-layouts-frame[data-shape='phone-portrait'] { width: 360px; height: 640px; zoom: 0.45; }
  .md1-docs-layouts-frame[data-shape='tablet-portrait'] { width: 600px; height: 800px; zoom: 0.36; }
  .md1-docs-layouts-frame[data-shape='phone-landscape'] { width: 640px; height: 360px; zoom: 0.45; }
  .md1-docs-layouts-frame[data-shape='tablet-landscape'] { width: 800px; height: 600px; zoom: 0.36; }
  .md1-docs-layouts-frame[data-shape='desktop'] { width: 1024px; height: 640px; zoom: 0.3; }

  .md1-docs-layouts-screen {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: var(--md1-surface, #FFFFFF);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  .md1-docs-layouts-slide {
    display: flex;
    width: 100%;
    height: 100%;
  }

  .md1-docs-layouts-art {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    aspect-ratio: 1;
    background: var(--md1-primary-light, #C5CAE9);
    color: var(--md1-primary, #3F51B5);
  }

  .md1-docs-layouts-glyph {
    --md1-icon-size: 120px;
  }

  .md1-docs-layouts-text {
    display: flex;
    flex-direction: column;
  }

  /* The copy box is 112 dp and centres its lines, so its centre sits 56 dp above the button. */
  .md1-docs-layouts-copy {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 112px;
  }

  .md1-docs-layouts-headline {
    font-size: 24px;
    line-height: 32px;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-layouts-subhead {
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: 24px;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-layouts-controls {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding-block-end: var(--md1-spacing-3, 24px);
  }

  .md1-docs-layouts-dots {
    display: flex;
    gap: 8px;
    height: 32px;
    align-items: center;
  }

  .md1-docs-layouts-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-docs-layouts-dot[data-active] {
    background: var(--md1-primary, #3F51B5);
  }

  /* Portrait: the illustration on top, centred copy and controls built upward from the bottom edge. */
  :is([data-shape='phone-portrait'], [data-shape='tablet-portrait']) .md1-docs-layouts-slide {
    flex-direction: column;
    align-items: center;
  }

  [data-shape='phone-portrait'] .md1-docs-layouts-art { width: 100%; }
  [data-shape='tablet-portrait'] .md1-docs-layouts-art { width: 70%; margin-block-start: 48px; }

  :is([data-shape='phone-portrait'], [data-shape='tablet-portrait']) .md1-docs-layouts-text {
    flex: 1 1 auto;
    align-items: center;
    justify-content: flex-end;
    padding-inline: var(--md1-spacing-3, 24px);
    text-align: center;
  }

  :is([data-shape='phone-portrait'], [data-shape='tablet-portrait']) .md1-docs-layouts-controls {
    align-items: center;
  }

  /* Landscape: the illustration at the start edge, left-aligned copy and controls against it, vertically centred. */
  :is([data-shape='phone-landscape'], [data-shape='tablet-landscape']) .md1-docs-layouts-art {
    height: 100%;
  }

  [data-shape='tablet-landscape'] .md1-docs-layouts-art {
    align-self: center;
    height: 75%;
    margin-inline-start: 48px;
  }

  :is([data-shape='phone-landscape'], [data-shape='tablet-landscape']) .md1-docs-layouts-text {
    justify-content: center;
    padding-inline: var(--md1-spacing-3, 24px);
  }

  :is([data-shape='phone-landscape'], [data-shape='tablet-landscape']) .md1-docs-layouts-controls {
    align-items: flex-start;
    padding-block-end: 0;
  }

  /* Desktop: illustration, copy and button in a centred card, arrows 48 dp beside it, dots 24 dp beneath it. */
  [data-shape='desktop'] .md1-docs-layouts-screen {
    position: relative;
    gap: 48px;
    background: var(--md1-background, #FAFAFA);
  }

  [data-shape='desktop'] .md1-docs-layouts-slide {
    flex-direction: column;
    align-items: center;
    width: 400px;
    height: auto;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2);
    border-radius: var(--md1-radius, 2px);
  }

  [data-shape='desktop'] .md1-docs-layouts-art { width: 100%; aspect-ratio: 16 / 9; }

  [data-shape='desktop'] .md1-docs-layouts-text {
    align-items: center;
    text-align: center;
  }

  [data-shape='desktop'] .md1-docs-layouts-controls {
    align-items: center;
  }

  .md1-docs-layouts-dots--desktop {
    position: absolute;
    bottom: 40px;
  }

  .md1-docs-layouts-arrow {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    background: var(--md1-surface, #FFFFFF);
    border: 0;
    border-radius: 50%;
    box-shadow: var(--md1-elevation-2);
  }

  /* Redlines: each measured part takes a magenta outline and its number. */
  [data-redlines] [data-redline] {
    position: relative;
    outline: 2px solid var(--md1-pink-a200, #FF4081);
    outline-offset: 2px;
  }

  [data-redlines] [data-redline]::after {
    content: attr(data-redline);
    position: absolute;
    inset-block-start: -14px;
    inset-inline-start: -14px;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    font-size: 16px;
    font-weight: 500;
    color: var(--md1-white, #FFFFFF);
    background: var(--md1-light-blue-a400, #00B0FF);
  }

  .md1-docs-layouts-legend {
    margin: 0;
    list-style: decimal;
    padding-inline-start: var(--md1-spacing-3, 24px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: 24px;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
