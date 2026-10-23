<script setup lang="ts">
  import { QuButton } from '@paper/quantum'
  import { useImage } from '@vuetify/v0'

  import { shallowRef, toRef } from 'vue'

  const load = shallowRef(1)

  const src = toRef(() => `https://picsum.photos/seed/quantum-loading-phases-${load.value}/720/405`)

  // useImage tracks the load; the stylesheet runs the three phases once the state reads `loaded`.
  const image = useImage({ src })
</script>

<template>
  <div class="quantum-docs-loading-stack">
    <div class="quantum-docs-loading-frame">
      <img
        alt=""
        class="quantum-docs-loading-image"
        :data-state="image.status.value"
        :src="image.source.value"
        @error="image.onError"
        @load="image.onLoad"
      >
    </div>

    <QuButton @click="load++">Load another image</QuButton>
  </div>
</template>

<style>
  .quantum-docs-loading-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  /* A 16:9 header image; while it loads the area holds the 12% tone a card's media does. */
  .quantum-docs-loading-frame {
    width: 100%;
    max-width: 480px;
    aspect-ratio: 16 / 9;
    overflow: clip;
    background: var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-loading-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
  }

  /*
   * The three phases of the loading-images page, staggered on one load
   * duration (four times the complex duration, a docs choice; the page asks
   * only for something longer than a transition). Opacity runs 0% to 100%
   * over the first half with a small horizontal shift; exposure (contrast
   * lifted from a flat, low-contrast start) settles at three quarters;
   * saturation climbs from 20% over the whole load, so full colour lands last.
   */
  .quantum-docs-loading-image[data-state='loaded'] {
    opacity: 1;
    animation:
      quantum-docs-loading-fade calc(var(--quantum-duration-complex, 375ms) * 2) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) both,
      quantum-docs-loading-develop calc(var(--quantum-duration-complex, 375ms) * 4) linear both;
  }

  @keyframes quantum-docs-loading-fade {
    from {
      opacity: 0;
      translate: 8px 0;
    }

    to {
      opacity: 1;
      translate: 0 0;
    }
  }

  @keyframes quantum-docs-loading-develop {
    from {
      filter: contrast(0.6) saturate(0.2);
    }

    75% {
      filter: contrast(1) saturate(0.8);
    }

    to {
      filter: contrast(1) saturate(1);
    }
  }

  body[data-reduced-motion='reduce'] .quantum-docs-loading-image {
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-docs-loading-image {
      animation: none;
    }
  }
</style>
