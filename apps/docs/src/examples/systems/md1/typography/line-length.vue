<script setup lang="ts">
  import { Md1ToggleButtons } from '@paper/md1'
  import { useResizeObserver } from '@vuetify/v0'
  import { shallowRef, useTemplateRef } from 'vue'

  const measure = shallowRef('ideal')
  const average = shallowRef(0)
  const text = useTemplateRef<HTMLElement>('text')

  // Count the rendered lines and divide the copy among them: the characters per line the reader actually gets.
  function count () {
    const el = text.value
    const node = el?.firstChild

    if (!el || !node) return

    const range = document.createRange()

    range.selectNodeContents(node)

    const tops = new Set([...range.getClientRects()].map(rect => Math.round(rect.top)))

    average.value = Math.round((el.textContent ?? '').trim().length / Math.max(tops.size, 1))
  }

  // A new measure resizes the paragraph, so the observer recounts it.
  useResizeObserver(text, count)
</script>

<template>
  <div class="md1-docs-type-measure">
    <Md1ToggleButtons v-model="measure" label="Line length" mandatory>
      <Md1ToggleButtons.Item value="narrow">Too narrow</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="ideal">Ideal</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="wide">Too wide</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <article class="md1-docs-type-measure-sheet md1-elevation-2">
      <p ref="text" class="md1-docs-type-measure-text md1-type-body-1" :data-measure="measure">Leave the car park by the gate behind the lighthouse and follow the cliff path west. Past the second stile the path drops to the beach, and at low tide it is sand all the way to the harbour wall. Check the tide table before you set out: the last stretch floods two hours either side of high water, and the only way up from the beach is the steps by the lifeboat station.</p>
    </article>

    <span class="md1-docs-type-measure-note md1-type-caption" role="status">About {{ average }} characters per line</span>
  </div>
</template>

<style>
  .md1-docs-type-measure {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  .md1-docs-type-measure-sheet {
    box-sizing: border-box;
    max-width: 100%;
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /*
   * Measures in em, so they hold at the device and desktop Body 1 sizes. Roboto
   * sets about two characters of English body text per em: 12em is about 25
   * characters a line, 30em about 60, the spec's figure, and 54em over 100 where the panel has room.
   */
  .md1-docs-type-measure-text {
    max-width: 30em;
    margin: 0;
  }

  .md1-docs-type-measure-text[data-measure="narrow"] {
    max-width: 12em;
  }

  .md1-docs-type-measure-text[data-measure="wide"] {
    max-width: 54em;
  }

  .md1-docs-type-measure-note {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
