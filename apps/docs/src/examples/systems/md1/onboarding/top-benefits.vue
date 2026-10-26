<script setup lang="ts">
  import { Md1Button, Md1Icon } from '@paper/md1'
  import { Button, createStep, useTimer } from '@vuetify/v0'

  import { onMounted, shallowRef, toRef } from 'vue'

  import type { Md1IconName } from '@paper/md1'

  interface Benefit {
    id: string
    icon: Md1IconName
    title: string
    text: string
  }

  const benefits: Benefit[] = [
    { id: 'offline', icon: 'download', title: 'Read without a signal', text: 'Every book you open is kept for the train, the plane and everywhere in between' },
    { id: 'sync', icon: 'bookmark', title: 'Pick up where you left off', text: 'Your page follows you from phone to tablet' },
    { id: 'night', icon: 'visibility', title: 'Easy on the eyes', text: 'The page dims as the sun goes down' },
  ]

  const carousel = createStep({ circular: true })

  carousel.onboard(benefits.map(benefit => ({ id: benefit.id, value: benefit.id })))
  carousel.first()

  const index = toRef(() => Math.max(carousel.selectedIndex.value, 0))
  const current = toRef(() => benefits[index.value]!)

  const auto = shallowRef(true)
  const started = shallowRef(false)

  // The first screen advances sooner than the rest so it reads as a carousel, not a single screen.
  const timer = useTimer(carousel.next, {
    duration: () => (index.value === 0 ? 2000 : 3000),
    repeat: true,
  })

  onMounted(timer.start)

  // Any touch, click or focus inside the carousel hands it to the reader for good.
  function onTouch () {
    if (!auto.value) return

    auto.value = false
    timer.stop()
  }

  function onDot (id: string) {
    onTouch()
    carousel.select(id)
  }

  function onStart () {
    onTouch()
    started.value = true
  }

  function onReplay () {
    started.value = false
    auto.value = true
    carousel.first()
    timer.start()
  }
</script>

<template>
  <div class="md1-docs-onboarding-stack">
    <section
      aria-label="Top benefits"
      aria-roledescription="carousel"
      class="md1-docs-benefits-screen"
      @focusin="onTouch"
      @pointerdown="onTouch"
    >
      <div class="md1-docs-benefits-art">
        <Md1Icon class="md1-docs-benefits-glyph" :name="current.icon" />
      </div>

      <div
        :aria-live="auto ? 'off' : 'polite'"
        class="md1-docs-benefits-copy"
      >
        <div class="md1-docs-benefits-text">
          <h3 class="md1-docs-benefits-headline md1-type-headline">{{ current.title }}</h3>

          <p class="md1-docs-benefits-subhead">{{ current.text }}</p>
        </div>

        <div
          v-for="benefit in benefits"
          :key="benefit.id"
          aria-hidden="true"
          class="md1-docs-benefits-text md1-docs-benefits-sizer"
        >
          <span class="md1-docs-benefits-headline md1-type-headline">{{ benefit.title }}</span>

          <span class="md1-docs-benefits-subhead">{{ benefit.text }}</span>
        </div>
      </div>

      <div class="md1-docs-benefits-footer">
        <Md1Button variant="raised" @click="onStart">Get started</Md1Button>

        <div class="md1-docs-benefits-dots">
          <Button.Root
            v-for="(benefit, position) in benefits"
            :key="benefit.id"
            :aria-current="position === index || undefined"
            :aria-label="`Benefit ${position + 1} of ${benefits.length}`"
            class="md1-docs-benefits-dot"
            :data-active="position === index || undefined"
            @click="onDot(benefit.id)"
          />
        </div>
      </div>
    </section>

    <div class="md1-docs-onboarding-row">
      <Md1Button :disabled="auto" @click="onReplay">Replay</Md1Button>

      <p class="md1-docs-readout md1-docs-onboarding-note" role="status">{{ started ? 'Onboarding finished' : '—' }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-onboarding-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  /*
   * The button on top and its readout below, each centred on its own, so the
   * readout appearing or changing never moves the button.
   */
  .md1-docs-onboarding-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  /* A handset portrait screen: illustration on top, copy and controls built upward from the bottom edge. */
  .md1-docs-benefits-screen {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* The 1:1 illustration. A glyph on the primary 100 tint stands in for the artwork. */
  .md1-docs-benefits-art {
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    background: var(--md1-primary-light, #C5CAE9);
  }

  .md1-docs-benefits-glyph {
    --md1-icon-size: 96px;

    color: var(--md1-primary, #3F51B5);
  }

  /*
   * The copy box is 112 dp tall and centres its text, so the centre of the
   * copy sits 56 dp above the top of the button for one to three lines.
   * Hidden copies of every benefit share its cell, so on a narrow screen it
   * is as tall as the longest benefit and the button and dots never move.
   */
  .md1-docs-benefits-copy {
    box-sizing: border-box;
    display: grid;
    align-items: center;
    min-height: 112px;
    padding-inline: var(--md1-spacing-3, 24px);
    text-align: center;
  }

  .md1-docs-benefits-text {
    display: flex;
    flex-direction: column;
    grid-area: 1 / 1;
  }

  .md1-docs-benefits-sizer {
    visibility: hidden;
  }

  .md1-docs-benefits-headline {
    margin: 0;
  }

  /* Subhead: the page's 24 sp leading at the Subheading size, in the secondary ink. */
  .md1-docs-benefits-subhead {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The fixed controls: the button, then the pagination, 24 dp above the bottom edge. */
  .md1-docs-benefits-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    padding-block-end: var(--md1-spacing-3, 24px);
  }

  .md1-docs-benefits-dots {
    display: flex;
  }

  /* Each dot is a 16 x 32 dp target around an 8 dp mark: the disabled ink, the primary ink when current. */
  .md1-docs-benefits-dot {
    display: grid;
    place-items: center;
    width: 16px;
    height: 32px;
    padding: 0;
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    background: none;
    border: 0;
    cursor: pointer;
  }

  .md1-docs-benefits-dot::before {
    content: '';
    width: 8px;
    height: 8px;
    background: currentColor;
    border-radius: 50%;
  }

  .md1-docs-benefits-dot[data-active] {
    color: var(--md1-primary, #3F51B5);
  }

  .md1-docs-benefits-dot:focus-visible {
    outline: 2px solid var(--md1-primary, #3F51B5);
    outline-offset: -2px;
  }

  /* The current dot keeps the primary 500 on dark, as Md1List does; the focus ring takes the primary's 100 there, because a focus indicator needs 3:1. */
  [data-theme='md1-dark'] .md1-docs-benefits-dot:focus-visible {
    outline-color: var(--md1-primary-light, #C5CAE9);
  }

  .md1-docs-onboarding-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
