<script setup lang="ts">
  import { QuButton, QuCard, QuToolbar } from '@paper/quantum'
  import { shallowRef, toRef } from 'vue'

  const places = [
    { id: 'harbour', title: 'Harbour at dawn', region: 'Coast', body: 'Fishing boats leave before first light; the market on the quay opens at six.' },
    { id: 'ridge', title: 'Pine ridge', region: 'Highlands', body: 'A four hour loop through old forest, with a fire lookout at the summit.' },
  ]

  const current = shallowRef<string>()

  const place = toRef(() => places.find(item => item.id === current.value))
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-nav-screen quantum-docs-nav-card-screen">
    <QuToolbar variant="primary">
      <QuToolbar.Nav v-if="place" aria-label="Places" icon="up" @click="current = undefined" />

      <QuToolbar.Nav v-else />

      <QuToolbar.Title>{{ place ? place.title : 'Places' }}</QuToolbar.Title>
    </QuToolbar>

    <Transition mode="out-in" name="quantum-docs-nav-child">
      <article v-if="place" :key="place.id" class="quantum-docs-nav-detail">
        <div class="quantum-docs-nav-paper quantum-elevation-2">
          <p class="quantum-docs-nav-from">{{ place.title }}</p>

          <p class="quantum-docs-nav-body">{{ place.body }}</p>
        </div>
      </article>

      <div v-else class="quantum-docs-nav-cards">
        <QuCard v-for="item in places" :key="item.id">
          <QuCard.Header :subtitle="item.region" :title="item.title" />

          <QuCard.Media :src="`https://picsum.photos/seed/quantum-nav-${item.id}/688/387`" />

          <QuCard.Actions>
            <QuButton @click="current = item.id">Explore</QuButton>
          </QuCard.Actions>
        </QuCard>
      </div>
    </Transition>
  </div>
</template>

<style>
  /* A handset screen: the bar's fixed position resolves against this frame, not the page. */
  .quantum-docs-nav-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--quantum-background, #FAFAFA);
  }

  /*
   * Taller than the shared 360 px frame: one 16:9 card is about 318 px, so
   * under a 56 px bar it would hide its own Explore action at first paint.
   * 420 px shows the first card whole and a peek of the next.
   */
  .quantum-docs-screen.quantum-docs-nav-card-screen {
    height: 420px;
  }

  /* A scrolling column of cards, 8 dp apart and 8 dp from the screen edge. */
  .quantum-docs-nav-cards {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--quantum-spacing-1, 8px);
    min-height: 0;
    padding: var(--quantum-spacing-1, 8px);
    overflow-y: auto;
  }

  /* The child screen: a raised sheet that the parent-to-child transition expands into place. */
  .quantum-docs-nav-detail {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  .quantum-docs-nav-paper {
    flex: 1 1 auto;
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-surface, #FFFFFF);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  .quantum-docs-nav-from {
    margin: 0 0 var(--quantum-spacing-1, 8px);
    font-size: var(--quantum-type-body-2-size, 14px);
    font-weight: var(--quantum-type-body-2-weight, 500);
    line-height: var(--quantum-type-body-2-leading, 24px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-nav-body {
    margin: 0;
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Parent to child: the touched surface lifts and expands from its origin on the standard curve. */
  .quantum-docs-nav-child-enter-active,
  .quantum-docs-nav-child-leave-active {
    transition:
      opacity var(--quantum-duration-enter, 225ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--quantum-duration-enter, 225ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
    transform-origin: top center;
  }

  .quantum-docs-nav-child-enter-from,
  .quantum-docs-nav-child-leave-to {
    opacity: 0;
    transform: scaleY(0.6);
  }

  @media (prefers-reduced-motion: reduce) {
    .quantum-docs-nav-child-enter-active,
    .quantum-docs-nav-child-leave-active {
      transition: none;
    }
  }
</style>
