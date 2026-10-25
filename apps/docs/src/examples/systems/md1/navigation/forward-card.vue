<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Toolbar, useMorph } from '@paper/md1'
  import { nextTick, shallowRef, toRef, useTemplateRef } from 'vue'

  const places = [
    { id: 'harbour', title: 'Harbour', region: 'Coast', body: 'Fishing boats leave before first light; the market on the quay opens at six.' },
    { id: 'ridge', title: 'Pine ridge', region: 'Highlands', body: 'A four hour loop through old forest, with a fire lookout at the summit.' },
  ]

  const tiles = useTemplateRef<HTMLElement[]>('tiles')
  const detail = useTemplateRef('detail')
  const image = useTemplateRef('image')
  const current = shallowRef<string>()
  const busy = shallowRef(false)
  const { morph } = useMorph()

  const place = toRef(() => places.find(item => item.id === current.value))

  // Parent to child: the card's surface expands into the screen, width slightly ahead of height,
  // and its image is carried into the header as the shared element.
  function play (index: number, reverse = false) {
    const tile = tiles.value?.[index]
    const rect = { shape: 'rect', lead: 'width', lag: 0.15, reverse } as const

    return Promise.all([
      morph({ ...rect, from: tile, to: detail, move: false }),
      morph({ ...rect, from: tile?.querySelector('img') ?? null, to: image, scale: true }),
    ])
  }

  async function onOpen (id: string) {
    if (busy.value) return

    busy.value = true
    current.value = id
    await nextTick()

    for (const done of await play(places.findIndex(item => item.id === id))) done()

    busy.value = false
  }

  async function onUp () {
    if (busy.value || !current.value) return

    busy.value = true

    const dones = await play(places.findIndex(item => item.id === current.value), true)

    current.value = undefined
    await nextTick()

    for (const done of dones) done()

    busy.value = false
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-nav-screen md1-docs-nav-card-screen">
    <Md1Toolbar class="md1-docs-nav-card-bar" variant="primary">
      <Md1Toolbar.Nav v-if="place" aria-label="Places" icon="up" @click="onUp" />

      <Md1Toolbar.Nav v-else />

      <Md1Toolbar.Title>{{ place ? place.title : 'Places' }}</Md1Toolbar.Title>
    </Md1Toolbar>

    <div class="md1-docs-nav-cards">
      <div v-for="item in places" :key="item.id" ref="tiles" class="md1-docs-nav-card-tile">
        <Md1Card>
          <Md1Card.Media :src="`https://picsum.photos/seed/md1-nav-${item.id}/688/387`" />

          <Md1Card.Header :subtitle="item.region" :title="item.title" />

          <Md1Card.Actions>
            <Md1Button @click="onOpen(item.id)">Explore</Md1Button>
          </Md1Card.Actions>
        </Md1Card>
      </div>
    </div>

    <article v-if="place" ref="detail" class="md1-docs-nav-card-detail">
      <img
        ref="image"
        alt=""
        class="md1-docs-nav-card-image"
        :src="`https://picsum.photos/seed/md1-nav-${place.id}/688/387`"
      >

      <div class="md1-docs-nav-card-paper">
        <p class="md1-docs-nav-card-region">{{ place.region }}</p>

        <p class="md1-docs-nav-card-body">{{ place.body }}</p>
      </div>
    </article>
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

  .md1-docs-screen.md1-docs-nav-card-screen {
    height: 420px;
  }

  .md1-docs-nav-card-bar {
    z-index: 2;
  }

  /* Two cards a row, 8 dp apart and 8 dp from the screen edge. */
  .md1-docs-nav-cards {
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: 1fr 1fr;
    align-content: start;
    gap: var(--md1-spacing-1, 8px);
    min-height: 0;
    padding: var(--md1-spacing-1, 8px);
    overflow-y: auto;
  }

  .md1-docs-nav-card-tile {
    min-width: 0;
  }

  /* The child screen fills the frame under the bar: the surface the card expands into. */
  .md1-docs-nav-card-detail {
    position: absolute;
    inset: 56px 0 0;
    z-index: 1;
    overflow-y: auto;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-nav-card-image {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  /* The text is not shared: it arrives after the surface has mostly grown, cropped by it (choreography page). */
  .md1-docs-nav-card-paper {
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    animation: md1-docs-nav-card-arrive var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)) both;
  }

  @keyframes md1-docs-nav-card-arrive {
    0%,
    40% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-nav-card-paper {
      animation: none;
    }
  }

  .md1-docs-nav-card-region {
    margin: 0 0 var(--md1-spacing-1, 8px);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    line-height: var(--md1-type-body-2-leading, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-nav-card-body {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
