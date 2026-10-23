<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Toolbar } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const places = [
    { id: 'harbour', title: 'Harbour at dawn', region: 'Coast', body: 'Fishing boats leave before first light; the market on the quay opens at six.' },
    { id: 'ridge', title: 'Pine ridge', region: 'Highlands', body: 'A four hour loop through old forest, with a fire lookout at the summit.' },
  ]

  const current = shallowRef<string>()

  const place = toRef(() => places.find(item => item.id === current.value))
</script>

<template>
  <div class="md1-docs-screen md1-docs-nav-screen md1-docs-nav-card-screen">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav v-if="place" aria-label="Places" icon="up" @click="current = undefined" />

      <Md1Toolbar.Nav v-else />

      <Md1Toolbar.Title>{{ place ? place.title : 'Places' }}</Md1Toolbar.Title>
    </Md1Toolbar>

    <Transition mode="out-in" name="md1-docs-nav-child">
      <article v-if="place" :key="place.id" class="md1-docs-nav-detail">
        <div class="md1-docs-nav-paper md1-elevation-2">
          <p class="md1-docs-nav-from">{{ place.title }}</p>

          <p class="md1-docs-nav-body">{{ place.body }}</p>
        </div>
      </article>

      <div v-else class="md1-docs-nav-cards">
        <Md1Card v-for="item in places" :key="item.id">
          <Md1Card.Header :subtitle="item.region" :title="item.title" />

          <Md1Card.Media :src="`https://picsum.photos/seed/md1-nav-${item.id}/688/387`" />

          <Md1Card.Actions>
            <Md1Button @click="current = item.id">Explore</Md1Button>
          </Md1Card.Actions>
        </Md1Card>
      </div>
    </Transition>
  </div>
</template>

<style>
  /* A handset screen: the bar's fixed position resolves against this frame, not the page. */
  .md1-docs-nav-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  /*
   * Taller than the shared 360 px frame: one 16:9 card is about 318 px, so
   * under a 56 px bar it would hide its own Explore action at first paint.
   * 420 px shows the first card whole and a peek of the next.
   */
  .md1-docs-screen.md1-docs-nav-card-screen {
    height: 420px;
  }

  /* A scrolling column of cards, 8 dp apart and 8 dp from the screen edge. */
  .md1-docs-nav-cards {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    min-height: 0;
    padding: var(--md1-spacing-1, 8px);
    overflow-y: auto;
  }

  /* The child screen: a raised sheet that the parent-to-child transition expands into place. */
  .md1-docs-nav-detail {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }

  .md1-docs-nav-paper {
    flex: 1 1 auto;
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  .md1-docs-nav-from {
    margin: 0 0 var(--md1-spacing-1, 8px);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    line-height: var(--md1-type-body-2-leading, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-nav-body {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Parent to child: the touched surface lifts and expands from its origin on the standard curve. */
  .md1-docs-nav-child-enter-active,
  .md1-docs-nav-child-leave-active {
    transition:
      opacity var(--md1-duration-enter, 225ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--md1-duration-enter, 225ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
    transform-origin: top center;
  }

  .md1-docs-nav-child-enter-from,
  .md1-docs-nav-child-leave-to {
    opacity: 0;
    transform: scaleY(0.6);
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-nav-child-enter-active,
    .md1-docs-nav-child-leave-active {
      transition: none;
    }
  }
</style>
