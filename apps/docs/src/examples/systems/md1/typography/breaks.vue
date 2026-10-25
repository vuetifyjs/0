<script setup lang="ts">
  import { Md1Switch } from '@paper/md1'
  import { shallowRef } from 'vue'

  const balanced = shallowRef(true)
</script>

<template>
  <div class="md1-docs-type-breaks">
    <Md1Switch v-model="balanced" label="Considered line breaks" />

    <article class="md1-docs-type-breaks-card md1-elevation-2" :data-balanced="balanced || undefined">
      <h3 class="md1-docs-type-breaks-headline md1-type-headline">A weekend walk along the cliffs above the old harbour</h3>

      <p class="md1-docs-type-breaks-body md1-type-body-1">Start at the lighthouse and follow the coast path north for about two hours. The trail is steep in places, so wear good shoes and bring water for the climb back to town.</p>
    </article>
  </div>
</template>

<style>
  .md1-docs-type-breaks {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  /* 288 dp: a narrow card, where a stray short word at the end of a line shows most. */
  .md1-docs-type-breaks-card {
    box-sizing: border-box;
    width: min(100%, 288px);
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-type-breaks-headline {
    margin: 0 0 var(--md1-spacing-2, 16px);
  }

  .md1-docs-type-breaks-body {
    margin: 0;
  }

  /* Balanced headings leave no ragged gap under the first line; pretty body text keeps a short word off the last line. No hyphenation either way. */
  .md1-docs-type-breaks-card[data-balanced] .md1-docs-type-breaks-headline {
    text-wrap: balance;
  }

  .md1-docs-type-breaks-card[data-balanced] .md1-docs-type-breaks-body {
    text-wrap: pretty;
  }

  .md1-docs-type-breaks-card :is(.md1-docs-type-breaks-headline, .md1-docs-type-breaks-body) {
    hyphens: manual;
  }
</style>
