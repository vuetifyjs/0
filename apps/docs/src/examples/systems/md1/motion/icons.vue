<script setup lang="ts">
  import { Md1Fab, Md1Ripple } from '@paper/md1'
  import { Toggle, useReducedMotion } from '@vuetify/v0'
  import { nextTick, shallowRef, toRef } from 'vue'

  // Play and pause drawn as two four-point shapes each, so every corner of the
  // triangle has a corner of a bar to travel to and the browser can tween `d`.
  const shapes = {
    play: ['M8 5 L13.5 8.5 L13.5 15.5 L8 19 Z', 'M13.5 8.5 L19 12 L19 12 L13.5 15.5 Z'],
    pause: ['M6 5 L10 5 L10 19 L6 19 Z', 'M14 5 L18 5 L18 19 L14 19 Z'],
  }

  const playing = shallowRef(false)
  const glyph = toRef(() => playing.value ? shapes.pause : shapes.play)

  // The FAB's plus turns into the pencil it stands for: the plus spins out, the pencil spins in.
  const writing = shallowRef(false)
  const motion = useReducedMotion()

  async function onCompose (event: MouseEvent) {
    const button = event.currentTarget as HTMLElement
    const icon = button.querySelector<HTMLElement>('.md1-icon')
    const timing = { duration: 100, easing: 'cubic-bezier(0.4, 0, 1, 1)' }

    if (icon && !motion.isReduced.value) {
      await icon.animate([{ rotate: '0deg', opacity: 1 }, { rotate: '90deg', opacity: 0 }], timing).finished
    }

    writing.value = !writing.value
    await nextTick()

    const next = button.querySelector<HTMLElement>('.md1-icon')

    if (next && !motion.isReduced.value) {
      next.animate([{ rotate: '-90deg', opacity: 0 }, { rotate: '0deg', opacity: 1 }], { duration: 200, easing: 'cubic-bezier(0, 0, 0.2, 1)' })
    }
  }
</script>

<template>
  <div class="md1-docs-motion-icons">
    <figure class="md1-docs-motion-icons-figure">
      <Toggle.Root v-model="playing" :aria-label="playing ? 'Pause' : 'Play'" class="md1-docs-motion-icons-toggle">
        <Md1Ripple center unbounded />

        <svg aria-hidden="true" class="md1-docs-motion-icons-glyph" viewBox="0 0 24 24">
          <path v-for="(shape, index) in glyph" :key="index" :style="{ d: `path('${shape}')` }" />
        </svg>
      </Toggle.Root>

      <figcaption class="md1-docs-motion-icons-caption">{{ playing ? 'Pause' : 'Play' }}: one glyph becoming the other</figcaption>
    </figure>

    <figure class="md1-docs-motion-icons-figure">
      <div class="md1-docs-motion-icons-fab-host">
        <Md1Fab
          :aria-label="writing ? 'Write' : 'Create'"
          :icon="writing ? 'edit' : 'add'"
          position="static"
          @click="onCompose"
        />
      </div>

      <figcaption class="md1-docs-motion-icons-caption">Plus to pencil: the primary way to create</figcaption>
    </figure>
  </div>
</template>

<style>
  .md1-docs-motion-icons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--md1-spacing-5, 40px);
  }

  /*
   * Wide enough for either caption, so Play turning to Pause never changes the
   * row's width and slides the FAB beside it.
   */
  .md1-docs-motion-icons-figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    inline-size: 224px;
    max-inline-size: 100%;
    margin: 0;
  }

  .md1-docs-motion-icons-toggle {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
  }

  .md1-docs-motion-icons-glyph {
    width: 36px;
    height: 36px;
    fill: currentColor;
  }

  /* The morph: each path's corners travel on the standard curve. */
  .md1-docs-motion-icons-glyph > path {
    transition: d var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-motion-icons-fab-host {
    display: flex;
    align-items: center;
    height: 56px;
  }

  .md1-docs-motion-icons-caption {
    margin-top: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }

  body[data-reduced-motion='reduce'] .md1-docs-motion-icons-glyph > path {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-docs-motion-icons-glyph > path {
      transition: none;
    }
  }
</style>
