<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
  import { Button } from '@vuetify/v0'
  import { ref, shallowRef, useTemplateRef } from 'vue'

  const tiles = Array.from({ length: 12 }, (_, index) => index + 1)

  const grid = useTemplateRef<HTMLElement>('grid')
  const faded = shallowRef(false)

  // Each tile's delay: one stagger step per 24 dp of distance from the tap point.
  const delays = ref<number[]>([])

  function onTap (event: MouseEvent) {
    const el = grid.value

    if (!el || faded.value) return

    // A keyboard press has no pointer position; react from the pressed tile's centre.
    const target = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const x = event.detail ? event.clientX : target.left + target.width / 2
    const y = event.detail ? event.clientY : target.top + target.height / 2

    delays.value = [...el.children].map(child => {
      const rect = child.getBoundingClientRect()
      const distance = Math.hypot(rect.left + rect.width / 2 - x, rect.top + rect.height / 2 - y)

      return Math.round(distance / 24)
    })

    faded.value = true
  }
</script>

<template>
  <div class="md1-docs-motion-radial">
    <div ref="grid" class="md1-docs-motion-radial-grid" :data-faded="faded || undefined">
      <Button.Root
        v-for="(tile, index) in tiles"
        :key="tile"
        :aria-label="`Photo ${tile}`"
        class="md1-docs-motion-radial-tile"
        :style="{ '--md1-docs-ring': delays[index] ?? 0 }"
        @click="onTap"
      >
        <img alt="" class="md1-docs-motion-radial-image" :src="`https://picsum.photos/seed/md1-grid-${tile}/200/200`">
      </Button.Root>
    </div>

    <Md1Button :disabled="!faded" @click="faded = false">Reset</Md1Button>
  </div>
</template>

<style>
  .md1-docs-motion-radial {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
    max-width: 400px;
  }

  .md1-docs-motion-radial-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2px;
    width: 100%;
  }

  .md1-docs-motion-radial-tile {
    display: block;
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    aspect-ratio: 1;
  }

  .md1-docs-motion-radial-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity var(--md1-duration-leave, 195ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The fade travels outward from the tap: one --md1-stagger step per 24 dp ring. */
  .md1-docs-motion-radial-grid[data-faded] .md1-docs-motion-radial-image {
    opacity: 0;
    transition-delay: calc(var(--md1-docs-ring) * var(--md1-stagger, 20ms));
  }

  body[data-reduced-motion='reduce'] .md1-docs-motion-radial-image {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-docs-motion-radial-image {
      transition: none;
    }
  }
</style>
