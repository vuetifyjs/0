<script setup lang="ts">
  import { Md1DropdownButton, Md1GridList, Md1ToggleButtons } from '@paper/md1'

  import { computed, ref, shallowRef } from 'vue'

  interface Photo {
    id: number
    title: string
    kind: 'nature' | 'city' | 'food'
    /** Date taken, ISO. */
    taken: string
    shown: string
    /** Size in megabytes. */
    size: number
  }

  const photos: Photo[] = [
    { id: 1, title: 'Morning harbour', kind: 'city', taken: '2026-06-02', shown: 'Jun 2', size: 4.1 },
    { id: 2, title: 'Pine ridge', kind: 'nature', taken: '2026-09-14', shown: 'Sep 14', size: 6.8 },
    { id: 3, title: 'Salt flats', kind: 'nature', taken: '2026-03-21', shown: 'Mar 21', size: 3.2 },
    { id: 4, title: 'Old town', kind: 'city', taken: '2026-10-05', shown: 'Oct 5', size: 5.5 },
    { id: 5, title: 'Night market', kind: 'food', taken: '2026-08-19', shown: 'Aug 19', size: 2.7 },
    { id: 6, title: 'Glacier lake', kind: 'nature', taken: '2026-07-30', shown: 'Jul 30', size: 8.9 },
    { id: 7, title: 'Bakery window', kind: 'food', taken: '2026-10-21', shown: 'Oct 21', size: 1.9 },
    { id: 8, title: 'Tram depot', kind: 'city', taken: '2026-01-11', shown: 'Jan 11', size: 3.6 },
  ]

  const orders = {
    taken: 'Date taken',
    size: 'File size',
    title: 'Name',
  }

  const kinds = ref<Photo['kind'][]>(['nature', 'city', 'food'])
  const order = shallowRef<keyof typeof orders>('taken')

  // Newest and largest first, names A to Z.
  function compare (a: Photo, b: Photo) {
    if (order.value === 'title') return a.title.localeCompare(b.title)
    if (order.value === 'size') return b.size - a.size
    return b.taken.localeCompare(a.taken)
  }

  const shown = computed(() => photos
    .filter(photo => kinds.value.includes(photo.kind))
    .toSorted(compare),
  )
</script>

<template>
  <div class="md1-docs-grid-list md1-docs-grid-list-filtering">
    <div class="md1-docs-grid-list-filtering__bar">
      <Md1ToggleButtons v-model="kinds" label="Show" multiple>
        <Md1ToggleButtons.Item value="nature">Nature</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="city">City</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="food">Food</Md1ToggleButtons.Item>
      </Md1ToggleButtons>

      <Md1DropdownButton v-model="order" :aria-label="`Sort by ${orders[order]}`" dense>
        <Md1DropdownButton.Item v-for="(label, value) in orders" :key="value" :value>{{ label }}</Md1DropdownButton.Item>
      </Md1DropdownButton>
    </div>

    <Md1GridList v-if="shown.length > 0">
      <Md1GridList.Tile
        v-for="photo in shown"
        :key="photo.id"
        :src="`https://picsum.photos/seed/md1-grid-${photo.id}/400/400`"
      >
        <Md1GridList.Bar :subtitle="`${photo.shown} · ${photo.size} MB`" :title="photo.title" />
      </Md1GridList.Tile>
    </Md1GridList>

    <p class="md1-docs-grid-list-note" role="status">
      {{ shown.length > 0 ? `${shown.length} of ${photos.length} photos` : 'No photos match. Turn a filter back on.' }}
    </p>
  </div>
</template>

<style>
  .md1-docs-grid-list {
    width: 100%;
    max-width: 480px;
  }

  .md1-docs-grid-list-note {
    margin: var(--md1-spacing-2, 16px) 0 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-grid-list-filtering {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  /* The filter at the start edge and the sort at the end, wrapping on a phone. */
  .md1-docs-grid-list-filtering__bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-grid-list-filtering > .md1-docs-grid-list-note {
    margin: 0;
    text-align: start;
  }
</style>
