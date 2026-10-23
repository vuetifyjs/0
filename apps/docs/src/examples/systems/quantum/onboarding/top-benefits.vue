<script setup lang="ts">
  import { QuButton, QuIcon } from '@paper/quantum'
  import { Button, createStep, useTimer } from '@vuetify/v0'

  import { onMounted, shallowRef, toRef } from 'vue'

  import type { QuIconName } from '@paper/quantum'

  interface Benefit {
    id: string
    icon: QuIconName
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
  <div class="quantum-docs-onboarding-stack">
    <section
      aria-label="Top benefits"
      aria-roledescription="carousel"
      class="quantum-docs-benefits-screen"
      @focusin="onTouch"
      @pointerdown="onTouch"
    >
      <div class="quantum-docs-benefits-art">
        <QuIcon class="quantum-docs-benefits-glyph" :name="current.icon" />
      </div>

      <div
        :aria-live="auto ? 'off' : 'polite'"
        class="quantum-docs-benefits-copy"
      >
        <h3 class="quantum-docs-benefits-headline quantum-type-headline">{{ current.title }}</h3>

        <p class="quantum-docs-benefits-subhead">{{ current.text }}</p>
      </div>

      <div class="quantum-docs-benefits-footer">
        <QuButton variant="raised" @click="onStart">Get started</QuButton>

        <div class="quantum-docs-benefits-dots">
          <Button.Root
            v-for="(benefit, position) in benefits"
            :key="benefit.id"
            :aria-current="position === index || undefined"
            :aria-label="`Benefit ${position + 1} of ${benefits.length}`"
            class="quantum-docs-benefits-dot"
            :data-active="position === index || undefined"
            @click="onDot(benefit.id)"
          />
        </div>
      </div>
    </section>

    <div class="quantum-docs-onboarding-row">
      <QuButton :disabled="auto" @click="onReplay">Replay</QuButton>

      <span v-if="started" class="quantum-docs-onboarding-note" role="status">Onboarding finished</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-onboarding-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-onboarding-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  /* A handset portrait screen: illustration on top, copy and controls built upward from the bottom edge. */
  .quantum-docs-benefits-screen {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    background: var(--quantum-surface, #FFFFFF);
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  /* The 1:1 illustration. A glyph on the primary 100 tint stands in for the artwork. */
  .quantum-docs-benefits-art {
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    background: var(--quantum-primary-light, #C5CAE9);
  }

  .quantum-docs-benefits-glyph {
    --quantum-icon-size: 96px;

    color: var(--quantum-primary, #3F51B5);
  }

  /*
   * The copy box is 112 dp tall and centres its text, so the centre of the
   * copy sits 56 dp above the top of the button for one to three lines.
   */
  .quantum-docs-benefits-copy {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 112px;
    padding-inline: var(--quantum-spacing-3, 24px);
    text-align: center;
  }

  .quantum-docs-benefits-headline {
    margin: 0;
  }

  /* Subhead: the page's 24 sp leading at the Subheading size, in the secondary ink. */
  .quantum-docs-benefits-subhead {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-subheading-size, 16px);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The fixed controls: the button, then the pagination, 24 dp above the bottom edge. */
  .quantum-docs-benefits-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    padding-block-end: var(--quantum-spacing-3, 24px);
  }

  .quantum-docs-benefits-dots {
    display: flex;
  }

  /* Each dot is a 16 x 32 dp target around an 8 dp mark: the disabled ink, the primary ink when current. */
  .quantum-docs-benefits-dot {
    display: grid;
    place-items: center;
    width: 16px;
    height: 32px;
    padding: 0;
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    background: none;
    border: 0;
    cursor: pointer;
  }

  .quantum-docs-benefits-dot::before {
    content: '';
    width: 8px;
    height: 8px;
    background: currentColor;
    border-radius: 50%;
  }

  .quantum-docs-benefits-dot[data-active] {
    color: var(--quantum-primary, #3F51B5);
  }

  .quantum-docs-benefits-dot:focus-visible {
    outline: 2px solid var(--quantum-primary, #3F51B5);
    outline-offset: -2px;
  }

  /* Primary 500 on the dark surface falls under 2:1, so the current dot and the focus ring take the primary's 100 there. */
  [data-theme='quantum-dark'] .quantum-docs-benefits-dot[data-active] {
    color: var(--quantum-primary-light, #C5CAE9);
  }

  [data-theme='quantum-dark'] .quantum-docs-benefits-dot:focus-visible {
    outline-color: var(--quantum-primary-light, #C5CAE9);
  }

  .quantum-docs-onboarding-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
