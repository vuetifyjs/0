<script setup lang="ts">
  import { QuIcon, QuRipple } from '@paper/quantum'
  import { Rating } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const score = shallowRef(3)
</script>

<template>
  <div class="quantum-docs-ripple-stack">
    <Rating.Root v-slot="{ attrs }" v-model="score" aria-label="Rate this recipe" renderless>
      <div v-bind="attrs" class="quantum-docs-ripple-stars">
        <Rating.Item
          v-for="index in 5"
          :key="index"
          v-slot="{ state }"
          class="quantum-docs-ripple-star"
          :index
        >
          <QuRipple unbounded />

          <QuIcon class="quantum-docs-ripple-glyph" :name="state === 'empty' ? 'star-border' : 'star'" />
        </Rating.Item>
      </div>
    </Rating.Root>

    <span class="quantum-docs-ripple-note" role="status">{{ score }} of 5</span>
  </div>
</template>

<style>
  .quantum-docs-ripple-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-ripple-stars {
    display: flex;
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-ripple-stars:focus-visible {
    outline: 2px solid var(--quantum-accent, #FF4081);
    outline-offset: 2px;
  }

  /* The host: 48 dp touch target, positioned for the ink layer. */
  .quantum-docs-ripple-star {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--quantum-touch-target, 48px);
    height: var(--quantum-touch-target, 48px);
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .quantum-docs-ripple-star[data-highlighted] {
    color: var(--quantum-accent, #FF4081);
  }

  /* Positioned so the glyph paints above the ink rather than under it. */
  .quantum-docs-ripple-glyph {
    position: relative;
  }

  .quantum-docs-ripple-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
