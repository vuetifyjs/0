<script setup lang="ts">
  import { duration, easing, md1Palette, Md1Tabs, Md1Toolbar } from '@paper/md1'
  import { usePrefersReducedMotion, useReducedMotion } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Example content: each section of the library owns a primary 500 swatch, all three with white ink.
  const SECTIONS = [
    { value: 'music', label: 'Music', color: md1Palette['indigo-500'], text: 'Recently played albums and the playlists you follow.' },
    { value: 'movies', label: 'Movies', color: md1Palette['teal-500'], text: 'Films you rented, with the ones still to finish first.' },
    { value: 'books', label: 'Books', color: md1Palette['deep-orange-500'], text: 'Your shelf, sorted by the last page you read.' },
  ]

  const tab = shallowRef('music')
  const section = toRef(() => SECTIONS.find(item => item.value === tab.value) ?? SECTIONS[0]!)

  // The colour under the wave, and the colour the wave carries; at rest the wave covers the whole bar.
  const base = shallowRef(section.value.color)
  const wave = shallowRef(section.value.color)

  const stage = useTemplateRef<HTMLElement>('stage')
  const layer = useTemplateRef<HTMLElement>('layer')

  // The docs install no reduced-motion plugin: follow the OS preference unless a plugin picks a mode.
  const motion = useReducedMotion()
  const media = usePrefersReducedMotion()
  const reduced = toRef(() => motion.isReduced.value || (motion.selectedMode.value === 'system' && media.matches.value))

  // Where the last press landed, relative to the bar; a keyboard selection has none.
  let press: { x: number, y: number } | undefined
  let animation: Animation | undefined

  function onPointerdown (event: PointerEvent) {
    const box = stage.value?.getBoundingClientRect()

    if (box) press = { x: event.clientX - box.left, y: event.clientY - box.top }
  }

  // A keyboard selection reacts from the centre of the tab it selected.
  function origin () {
    const box = stage.value?.getBoundingClientRect()
    const selected = stage.value?.querySelector('[role="tab"][aria-selected="true"]')?.getBoundingClientRect()

    if (!box || !selected) return { x: 0, y: 0 }

    return { x: selected.left - box.left + selected.width / 2, y: selected.top - box.top + selected.height / 2 }
  }

  watch(section, ({ color }) => {
    // The bar now rests in the colour the last wave carried, and the new wave starts from nothing over it.
    animation?.cancel()

    const point = press ?? origin()
    const box = stage.value?.getBoundingClientRect()
    const el = layer.value

    press = undefined
    base.value = reduced.value ? color : wave.value
    wave.value = color

    if (!box || !el || reduced.value) return

    // The circle grows from the press point until it covers the farthest corner of the bar.
    const radius = Math.hypot(Math.max(point.x, box.width - point.x), Math.max(point.y, box.height - point.y))

    animation = el.animate([
      { clipPath: `circle(0px at ${point.x}px ${point.y}px)` },
      { clipPath: `circle(${radius}px at ${point.x}px ${point.y}px)` },
    ], { duration: Number.parseFloat(duration.standard), easing: easing.standard })
  }, { flush: 'post' })
</script>

<template>
  <div class="md1-docs-motion-reveal md1-elevation-2">
    <div ref="stage" class="md1-docs-motion-reveal-bar" @pointerdown.capture="onPointerdown">
      <div aria-hidden="true" class="md1-docs-motion-reveal-layer" :style="{ background: base }" />

      <div ref="layer" aria-hidden="true" class="md1-docs-motion-reveal-layer" :style="{ background: wave }" />

      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav aria-label="Show/hide navigation menu" />

        <Md1Toolbar.Title>Library</Md1Toolbar.Title>

        <Md1Toolbar.Extension>
          <Md1Tabs v-model="tab">
            <Md1Tabs.List label="Library">
              <Md1Tabs.Item v-for="item in SECTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </Md1Tabs.List>
          </Md1Tabs>
        </Md1Toolbar.Extension>
      </Md1Toolbar>
    </div>

    <p class="md1-docs-motion-reveal-text md1-type-body-1">{{ section.text }}</p>
  </div>
</template>

<style>
  /* 480 dp: room for three fixed tabs at their 160 dp minimum. */
  .md1-docs-motion-reveal {
    width: 100%;
    max-width: 480px;
    overflow: clip;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-background, #FAFAFA);
  }

  /* The bar's colour lives on two layers behind a transparent toolbar: the resting colour, and the new one clipped to a growing circle. */
  .md1-docs-motion-reveal-bar {
    position: relative;
    isolation: isolate;
  }

  .md1-docs-motion-reveal-layer {
    position: absolute;
    inset: 0;
  }

  .md1-docs-motion-reveal-bar .md1-toolbar[data-variant='primary'] {
    background: transparent;
  }

  .md1-docs-motion-reveal-text {
    min-height: 120px;
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
