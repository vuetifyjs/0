<script setup lang="ts">
  import { Md1Card } from '@paper/md1'

  const query = 'grren tea'
  const match = 'green tea'

  const results = [
    { id: 'sencha', title: 'Sencha', subtitle: 'Steamed green tea, Shizuoka' },
    { id: 'matcha', title: 'Matcha', subtitle: 'Stone-ground green tea, Uji' },
    { id: 'longjing', title: 'Longjing', subtitle: 'Pan-fired green tea, Hangzhou' },
  ]
</script>

<template>
  <div class="md1-docs-empty-screen">
    <div class="md1-docs-empty-results">
      <h3 class="md1-docs-empty-match md1-type-body-2">Showing results for “{{ match }}”</h3>

      <p class="md1-docs-empty-query">No results for “{{ query }}”</p>

      <Md1Card v-for="result in results" :key="result.id">
        <Md1Card.Header :subtitle="result.subtitle" :title="result.title" />
      </Md1Card>
    </div>
  </div>
</template>

<style>
  /* A handset content area on the theme background: the empty state belongs to the screen, it is not a sheet of its own. */
  .md1-docs-empty-screen {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    min-height: 320px;
    background: var(--md1-background, #FAFAFA);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* Results are cards, 8 dp apart and 8 dp in from the screen edges, under the heading at the 16 dp keyline. */
  .md1-docs-empty-results {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
  }

  /* The heading names the query the results answer, so they are not mistaken for matches to what was typed. */
  .md1-docs-empty-match {
    margin: var(--md1-spacing-1, 8px) var(--md1-spacing-1, 8px) 0;
  }

  .md1-docs-empty-query {
    margin: 0 var(--md1-spacing-1, 8px) var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    letter-spacing: var(--md1-type-body-1-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
