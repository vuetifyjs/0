<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
  import { shallowRef } from 'vue'

  const back = shallowRef(0)
  const front = shallowRef(0)

  // Position on each axis: x and y move the sheet in the plane, z lifts it.
  const moved = shallowRef<'x' | 'y' | 'z'>()

  function onMove (axis: 'x' | 'y' | 'z') {
    moved.value = moved.value === axis ? undefined : axis
  }

  const LINES = ['Lisbon', 'Porto', 'Faro', 'Sintra', 'Évora', 'Braga', 'Coimbra', 'Óbidos']
</script>

<template>
  <div class="md1-docs-material">
    <figure class="md1-docs-material-item">
      <div class="md1-docs-material-stage">
        <div class="md1-docs-material-sheet md1-docs-material-wide md1-elevation-2" />

        <div class="md1-docs-material-sheet md1-docs-material-square md1-elevation-2" />

        <div class="md1-docs-material-sheet md1-docs-material-tall md1-elevation-2" />
      </div>

      <figcaption class="md1-docs-note">Height and width vary</figcaption>
    </figure>

    <figure class="md1-docs-material-item">
      <div class="md1-docs-material-stage">
        <div class="md1-docs-material-sheet md1-docs-material-circle md1-elevation-6" />

        <div class="md1-docs-material-sheet md1-docs-material-teal md1-elevation-2" />

        <div class="md1-docs-material-sheet md1-docs-material-amber md1-elevation-2" />
      </div>

      <figcaption class="md1-docs-note">Any shape and colour</figcaption>
    </figure>

    <figure class="md1-docs-material-item">
      <div class="md1-docs-material-stage">
        <div aria-label="Cities, scrollable" class="md1-docs-material-sheet md1-docs-material-scroller md1-elevation-2" tabindex="0">
          <p v-for="line in LINES" :key="line" class="md1-docs-material-line md1-type-body-1">{{ line }}</p>
        </div>
      </div>

      <figcaption class="md1-docs-note">Content scrolls; the sheet stays where it is</figcaption>
    </figure>

    <figure class="md1-docs-material-item">
      <div class="md1-docs-material-stage md1-docs-material-layers">
        <div class="md1-docs-material-sheet md1-docs-material-back md1-elevation-2">
          <Md1Button variant="raised" @click="back++">Back sheet</Md1Button>
        </div>

        <div class="md1-docs-material-sheet md1-docs-material-front md1-elevation-8" @click="front++" />
      </div>

      <figcaption class="md1-docs-note" role="status">Taps: back sheet {{ back }}, front sheet {{ front }}</figcaption>
    </figure>

    <figure class="md1-docs-material-item">
      <div class="md1-docs-material-stage">
        <div
          class="md1-docs-material-sheet md1-docs-material-mover"
          :class="moved === 'z' ? 'md1-elevation-8' : 'md1-elevation-2'"
          :data-axis="moved"
        />
      </div>

      <div class="md1-docs-material-axes">
        <Md1Button v-for="axis in (['x', 'y', 'z'] as const)" :key="axis" @click="onMove(axis)">{{ axis }} axis</Md1Button>
      </div>
    </figure>
  </div>
</template>

<style>
  .md1-docs-material {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
    gap: var(--md1-spacing-3, 24px) var(--md1-spacing-2, 16px);
    width: 100%;
  }

  .md1-docs-material-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
  }

  .md1-docs-material-item > figcaption {
    text-align: center;
  }

  .md1-docs-material-stage {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
    box-sizing: border-box;
    width: 100%;
    height: 176px;
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-background, #FAFAFA);
    box-shadow: inset 0 0 0 1px var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-material-sheet {
    flex: none;
    box-sizing: border-box;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-material-wide {
    width: 64px;
    height: 32px;
  }

  .md1-docs-material-square {
    width: 56px;
    height: 56px;
  }

  .md1-docs-material-tall {
    width: 32px;
    height: 104px;
  }

  .md1-docs-material-circle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--md1-accent, #FF4081);
  }

  .md1-docs-material-teal {
    width: 48px;
    height: 88px;
    background: var(--md1-teal-500, #009688);
  }

  .md1-docs-material-amber {
    width: 64px;
    height: 40px;
    border-radius: 20px 2px;
    background: var(--md1-amber-500, #FFC107);
  }

  .md1-docs-material-scroller {
    width: 160px;
    height: 128px;
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px);
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .md1-docs-material-line {
    margin: 0;
    line-height: 32px;
  }

  /* Two sheets at 2 dp and 8 dp, the front one over the back one's button. */
  .md1-docs-material-back {
    display: flex;
    align-items: center;
    padding: var(--md1-spacing-2, 16px);
    width: 168px;
    height: 104px;
  }

  .md1-docs-material-front {
    position: absolute;
    top: 72px;
    left: calc(50% + 8px);
    width: 96px;
    height: 80px;
  }

  .md1-docs-material-mover {
    width: 64px;
    height: 64px;
    transition:
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-material-mover[data-axis='x'] {
    transform: translateX(56px);
  }

  .md1-docs-material-mover[data-axis='y'] {
    transform: translateY(-40px);
  }

  .md1-docs-material-axes {
    display: flex;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  body:not([data-reduced-motion='no-preference']) .md1-docs-material-mover {
    transition: none;
  }
</style>
