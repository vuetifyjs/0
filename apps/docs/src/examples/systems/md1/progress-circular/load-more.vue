<script setup lang="ts">
  import { Md1ProgressCircular } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { ref, shallowRef } from 'vue'

  /** Pages after the first; then the list has reached its end. */
  const PAGES = 3
  /** How close to the end of the list, in px, the next page starts loading. A decision: the page gives no number. */
  const EDGE = 48

  const PLACES = ['Beach', 'Harbour', 'Lighthouse', 'Dunes', 'Pier', 'Cliffs', 'Boardwalk', 'Tide pools']

  const items = ref(PLACES.map((place, index) => ({ id: index, label: `${place}, photo ${index + 1}` })))
  const loading = shallowRef(false)
  const page = shallowRef(0)

  const loaded = useTimer(() => {
    const start = items.value.length

    for (let index = 0; index < 6; index++) {
      items.value.push({ id: start + index, label: `${PLACES[(start + index) % PLACES.length]}, photo ${start + index + 1}` })
    }

    page.value++
    loading.value = false
  }, { duration: 1500 })

  function onScroll (event: Event) {
    const el = event.currentTarget

    if (!(el instanceof HTMLElement) || loading.value || page.value >= PAGES) return

    if (el.scrollHeight - el.scrollTop - el.clientHeight <= EDGE) {
      loading.value = true
      loaded.start()
    }
  }
</script>

<template>
  <div class="md1-docs-more md1-elevation-2">
    <div class="md1-docs-more-list" tabindex="0" @scroll="onScroll">
      <div v-for="item in items" :key="item.id" class="md1-docs-more-row md1-type-subheading">{{ item.label }}</div>

      <div class="md1-docs-more-foot">
        <Md1ProgressCircular v-if="loading" aria-label="Loading more photos" />

        <span v-else-if="page >= PAGES" class="md1-docs-more-end md1-type-caption">No more photos</span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-more {
    width: 100%;
    max-width: 360px;
    overflow: hidden;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-more-list {
    height: 320px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .md1-docs-more-list:focus-visible {
    outline: 2px solid var(--md1-accent, #FF4081);
    outline-offset: -2px;
  }

  .md1-docs-more-row {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 var(--md1-spacing-2, 16px);
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* The indicator joins the end of the list, centred in a 64 dp footer, while the next page loads. */
  .md1-docs-more-foot {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
  }

  .md1-docs-more-end {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
