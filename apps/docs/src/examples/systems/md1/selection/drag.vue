<script setup lang="ts">
  import { Md1Checkbox } from '@paper/md1'
  import { IN_BROWSER, useEventListener } from '@vuetify/v0'
  import { ref, shallowRef } from 'vue'

  const files = [
    { id: 'photos', name: 'Photos', size: '1.2 GB' },
    { id: 'recipes', name: 'Recipes', size: '24 MB' },
    { id: 'work', name: 'Work', size: '310 MB' },
    { id: 'vacation', name: 'Vacation itinerary', size: '2 MB' },
    { id: 'taxes', name: 'Taxes 2014', size: '18 MB' },
    { id: 'music', name: 'Music', size: '4.6 GB' },
  ]

  const selected = ref<string[]>([])

  // While the button is held, every checkbox the pointer crosses takes the state the first one moved to.
  const paint = shallowRef<boolean>()

  function set (id: string, value: boolean) {
    const has = selected.value.includes(id)

    if (value && !has) selected.value = [...selected.value, id]
    if (!value && has) selected.value = selected.value.filter(item => item !== id)
  }

  function onDown (event: PointerEvent, id: string) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return

    // The checkbox's own click toggles the first one; the drag carries that new state onward.
    paint.value = !selected.value.includes(id)
  }

  function onOver (id: string) {
    if (paint.value === undefined) return

    set(id, paint.value)
  }

  if (IN_BROWSER) {
    useEventListener(window, 'pointerup', () => {
      paint.value = undefined
    })
  }
</script>

<template>
  <div class="md1-docs-selection-stack">
    <div class="md1-docs-drag-sheet md1-elevation-2" :data-painting="paint !== undefined || undefined">
      <div
        v-for="file in files"
        :key="file.id"
        class="md1-docs-drag-row"
        :data-selected="selected.includes(file.id) || undefined"
        @pointerover="onOver(file.id)"
      >
        <span class="md1-docs-drag-box" @pointerdown="onDown($event, file.id)">
          <Md1Checkbox
            :aria-label="file.name"
            :model-value="selected.includes(file.id)"
            @update:model-value="set(file.id, !!$event)"
          />
        </span>

        <span class="md1-docs-drag-name">{{ file.name }}</span>

        <span class="md1-docs-drag-size">{{ file.size }}</span>
      </div>
    </div>

    <span class="md1-docs-selection-note" role="status">{{ selected.length }} selected</span>
  </div>
</template>

<style>
  /* A desktop list: 48 dp rows with the checkbox at the start; dragging down the column selects every row it crosses. */
  .md1-docs-drag-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 480px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-drag-sheet[data-painting] {
    user-select: none;
  }

  .md1-docs-drag-row {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    height: 48px;
    padding-inline-end: var(--md1-spacing-3, 24px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 13px;
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* A selected row takes Md1DataTable's selected fill: Grey 100 on light, the Grey 700 / 800 midpoint on dark. */
  .md1-docs-drag-row[data-selected] {
    background: var(--md1-grey-100, #F5F5F5);
  }

  [data-theme='md1-dark'] .md1-docs-drag-row[data-selected] {
    background: color-mix(in srgb, var(--md1-grey-700, #616161) 50%, var(--md1-grey-800, #424242));
  }

  .md1-docs-drag-box {
    display: grid;
    place-items: center;
    width: 56px;
  }

  .md1-docs-drag-name {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .md1-docs-drag-size {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
