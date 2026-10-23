<script setup lang="ts">
  import { QuButton, QuCard, QuIcon } from '@paper/quantum'
  import { createStep } from '@vuetify/v0'

  import { shallowRef, toRef } from 'vue'

  import type { QuIconName } from '@paper/quantum'

  interface Benefit {
    id: string
    icon: QuIconName
    title: string
    text: string
  }

  const benefits: Benefit[] = [
    { id: 'lab', icon: 'language', title: 'Your lab, everywhere', text: 'Use everyday objects in your experiments' },
    { id: 'record', icon: 'mic', title: 'Record as you go', text: 'Sound, light and motion, straight from your phone' },
    { id: 'share', icon: 'share', title: 'Share what you find', text: 'Send a whole experiment to your class in one tap' },
  ]

  const carousel = createStep({ circular: true })

  carousel.onboard(benefits.map(benefit => ({ id: benefit.id, value: benefit.id })))
  carousel.first()

  const index = toRef(() => Math.max(carousel.selectedIndex.value, 0))
  const current = toRef(() => benefits[index.value]!)

  const started = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-carousel-stack">
    <section
      aria-label="Top benefits"
      aria-roledescription="carousel"
      class="quantum-docs-carousel"
    >
      <QuButton aria-label="Previous" class="quantum-docs-carousel-prev" icon="arrow-back" @click="carousel.prev()" />

      <div class="quantum-docs-carousel-card">
        <QuCard>
          <div aria-live="polite" class="quantum-docs-carousel-slide">
            <div class="quantum-docs-carousel-art">
              <QuIcon class="quantum-docs-carousel-glyph" :name="current.icon" />
            </div>

            <div class="quantum-docs-carousel-copy">
              <h3 class="quantum-docs-carousel-headline quantum-type-headline">{{ current.title }}</h3>

              <p class="quantum-docs-carousel-subhead">{{ current.text }}</p>
            </div>
          </div>

          <div class="quantum-docs-carousel-action">
            <QuButton variant="raised" @click="started = true">Get started</QuButton>
          </div>
        </QuCard>
      </div>

      <QuButton aria-label="Next" class="quantum-docs-carousel-next" icon="arrow-forward" @click="carousel.next()" />

      <div aria-hidden="true" class="quantum-docs-carousel-dots">
        <span
          v-for="(benefit, position) in benefits"
          :key="benefit.id"
          class="quantum-docs-carousel-dot"
          :data-active="position === index || undefined"
        />
      </div>
    </section>

    <span v-if="started" class="quantum-docs-carousel-note" role="status">Onboarding finished</span>
  </div>
</template>

<style>
  .quantum-docs-carousel-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-3, 24px) 0;
    background: var(--quantum-background, #FAFAFA);
  }

  /*
   * The desktop layout: the card in the centre, Previous and Next 48 dp from
   * it, the pagination 24 dp beneath it. Below 600 px, where this layout does
   * not apply, the arrows drop into the pagination row so the card keeps its width.
   */
  .quantum-docs-carousel {
    display: grid;
    grid-template-areas:
      'card card card'
      'prev dots next';
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    width: 100%;
    max-width: 360px;
    row-gap: var(--quantum-spacing-1, 8px);
  }

  @media (min-width: 600px) {
    .quantum-docs-carousel {
      grid-template-areas:
        'prev card next'
        '. dots .';
      grid-template-columns: auto minmax(0, 360px) auto;
      width: auto;
      max-width: none;
      column-gap: 48px;
      row-gap: var(--quantum-spacing-3, 24px);
    }
  }

  .quantum-docs-carousel-card {
    grid-area: card;
  }

  .quantum-docs-carousel-prev {
    grid-area: prev;
  }

  .quantum-docs-carousel-next {
    grid-area: next;
  }

  .quantum-docs-carousel-dots {
    display: flex;
    grid-area: dots;
    justify-content: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-carousel-dot {
    width: 8px;
    height: 8px;
    background: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    border-radius: 50%;
  }

  .quantum-docs-carousel-dot[data-active] {
    background: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* The 1:1 illustration, centred at the top of the card. A glyph on the primary 100 tint stands in for the artwork. */
  .quantum-docs-carousel-art {
    display: grid;
    place-items: center;
    width: 75%;
    margin-inline: auto;
    aspect-ratio: 1;
    background: var(--quantum-primary-light, #C5CAE9);
  }

  .quantum-docs-carousel-glyph {
    --quantum-icon-size: 96px;

    color: var(--quantum-primary, #3F51B5);
  }

  /* 112 dp of copy, centred, puts the centre of the copy 56 dp above the top of the button. */
  .quantum-docs-carousel-copy {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 112px;
    padding-inline: var(--quantum-spacing-3, 24px);
    text-align: center;
  }

  .quantum-docs-carousel-headline {
    margin: 0;
  }

  /* Subhead: Subheading, 16 sp on a 24 sp leading, in the secondary ink. */
  .quantum-docs-carousel-subhead {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-subheading-size, 16px);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-carousel-action {
    display: flex;
    justify-content: center;
    padding-block-end: var(--quantum-spacing-3, 24px);
  }

  .quantum-docs-carousel-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
