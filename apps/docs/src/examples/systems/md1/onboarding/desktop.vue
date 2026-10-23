<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Icon } from '@paper/md1'
  import { createStep } from '@vuetify/v0'

  import { shallowRef, toRef } from 'vue'

  import type { Md1IconName } from '@paper/md1'

  interface Benefit {
    id: string
    icon: Md1IconName
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
  <div class="md1-docs-carousel-stack">
    <section
      aria-label="Top benefits"
      aria-roledescription="carousel"
      class="md1-docs-carousel"
    >
      <Md1Button aria-label="Previous" class="md1-docs-carousel-prev" icon="arrow-back" @click="carousel.prev()" />

      <div class="md1-docs-carousel-card">
        <Md1Card>
          <div aria-live="polite" class="md1-docs-carousel-slide">
            <div class="md1-docs-carousel-art">
              <Md1Icon class="md1-docs-carousel-glyph" :name="current.icon" />
            </div>

            <div class="md1-docs-carousel-copy">
              <h3 class="md1-docs-carousel-headline md1-type-headline">{{ current.title }}</h3>

              <p class="md1-docs-carousel-subhead">{{ current.text }}</p>
            </div>
          </div>

          <div class="md1-docs-carousel-action">
            <Md1Button variant="raised" @click="started = true">Get started</Md1Button>
          </div>
        </Md1Card>
      </div>

      <Md1Button aria-label="Next" class="md1-docs-carousel-next" icon="arrow-forward" @click="carousel.next()" />

      <div aria-hidden="true" class="md1-docs-carousel-dots">
        <span
          v-for="(benefit, position) in benefits"
          :key="benefit.id"
          class="md1-docs-carousel-dot"
          :data-active="position === index || undefined"
        />
      </div>
    </section>

    <span v-if="started" class="md1-docs-carousel-note" role="status">Onboarding finished</span>
  </div>
</template>

<style>
  .md1-docs-carousel-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-3, 24px) 0;
    background: var(--md1-background, #FAFAFA);
  }

  /*
   * The desktop layout: the card in the centre, Previous and Next 48 dp from
   * it, the pagination 24 dp beneath it. Below 600 px, where this layout does
   * not apply, the arrows drop into the pagination row so the card keeps its width.
   */
  .md1-docs-carousel {
    display: grid;
    grid-template-areas:
      'card card card'
      'prev dots next';
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    width: 100%;
    max-width: 360px;
    row-gap: var(--md1-spacing-1, 8px);
  }

  @media (min-width: 600px) {
    .md1-docs-carousel {
      grid-template-areas:
        'prev card next'
        '. dots .';
      grid-template-columns: auto minmax(0, 360px) auto;
      width: auto;
      max-width: none;
      column-gap: 48px;
      row-gap: var(--md1-spacing-3, 24px);
    }
  }

  .md1-docs-carousel-card {
    grid-area: card;
  }

  .md1-docs-carousel-prev {
    grid-area: prev;
  }

  .md1-docs-carousel-next {
    grid-area: next;
  }

  .md1-docs-carousel-dots {
    display: flex;
    grid-area: dots;
    justify-content: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-carousel-dot {
    width: 8px;
    height: 8px;
    background: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    border-radius: 50%;
  }

  /* The current dot takes the primary, as in the handset carousel; the primary's 100 on the dark theme, where 500 falls under 2:1. */
  .md1-docs-carousel-dot[data-active] {
    background: var(--md1-primary, #3F51B5);
  }

  [data-theme='md1-dark'] .md1-docs-carousel-dot[data-active] {
    background: var(--md1-primary-light, #C5CAE9);
  }

  /* The 1:1 illustration, centred at the top of the card. A glyph on the primary 100 tint stands in for the artwork. */
  .md1-docs-carousel-art {
    display: grid;
    place-items: center;
    width: 75%;
    margin-inline: auto;
    aspect-ratio: 1;
    background: var(--md1-primary-light, #C5CAE9);
  }

  .md1-docs-carousel-glyph {
    --md1-icon-size: 96px;

    color: var(--md1-primary, #3F51B5);
  }

  /* 112 dp of copy, centred, puts the centre of the copy 56 dp above the top of the button. */
  .md1-docs-carousel-copy {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 112px;
    padding-inline: var(--md1-spacing-3, 24px);
    text-align: center;
  }

  .md1-docs-carousel-headline {
    margin: 0;
  }

  /* Subhead: Subheading, 16 sp on a 24 sp leading, in the secondary ink. */
  .md1-docs-carousel-subhead {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-carousel-action {
    display: flex;
    justify-content: center;
    padding-block-end: var(--md1-spacing-3, 24px);
  }

  .md1-docs-carousel-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
