<script setup lang="ts">
  import { Md1Icon, Md1Ripple } from '@paper/md1'
  import { Rating } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const score = shallowRef(3)
</script>

<template>
  <div class="md1-docs-ripple-stack">
    <Rating.Root v-slot="{ attrs }" v-model="score" aria-label="Rate this recipe" renderless>
      <div v-bind="attrs" class="md1-docs-ripple-stars">
        <Rating.Item
          v-for="index in 5"
          :key="index"
          v-slot="{ state }"
          class="md1-docs-ripple-star"
          :index
        >
          <Md1Ripple unbounded />

          <Md1Icon class="md1-docs-ripple-glyph" :name="state === 'empty' ? 'star-border' : 'star'" />
        </Rating.Item>
      </div>
    </Rating.Root>

    <span class="md1-docs-ripple-note" role="status">{{ score }} of 5</span>
  </div>
</template>

<style>
  .md1-docs-ripple-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-ripple-stars {
    display: flex;
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-ripple-stars:focus-visible {
    outline: 2px solid var(--md1-accent, #FF4081);
    outline-offset: 2px;
  }

  /* The host: 48 dp touch target, positioned for the ink layer. */
  .md1-docs-ripple-star {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--md1-touch-target, 48px);
    height: var(--md1-touch-target, 48px);
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-docs-ripple-star[data-highlighted] {
    color: var(--md1-accent, #FF4081);
  }

  /* Positioned so the glyph paints above the ink rather than under it. */
  .md1-docs-ripple-glyph {
    position: relative;
  }

  .md1-docs-ripple-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
