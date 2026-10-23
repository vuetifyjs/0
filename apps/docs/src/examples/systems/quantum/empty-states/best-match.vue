<script setup lang="ts">
  import { QuCard } from '@paper/quantum'

  const query = 'grren tea'
  const match = 'green tea'

  const results = [
    { id: 'sencha', title: 'Sencha', subtitle: 'Steamed green tea, Shizuoka' },
    { id: 'matcha', title: 'Matcha', subtitle: 'Stone-ground green tea, Uji' },
    { id: 'longjing', title: 'Longjing', subtitle: 'Pan-fired green tea, Hangzhou' },
  ]
</script>

<template>
  <div class="quantum-docs-empty-screen">
    <div class="quantum-docs-empty-results">
      <h3 class="quantum-docs-empty-match quantum-type-body-2">Showing results for “{{ match }}”</h3>

      <p class="quantum-docs-empty-query">No results for “{{ query }}”</p>

      <QuCard v-for="result in results" :key="result.id">
        <QuCard.Header :subtitle="result.subtitle" :title="result.title" />
      </QuCard>
    </div>
  </div>
</template>

<style>
  /* A handset content area on the theme background: the empty state belongs to the screen, it is not a sheet of its own. */
  .quantum-docs-empty-screen {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    min-height: 320px;
    background: var(--quantum-background, #FAFAFA);
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  /* Results are cards, 8 dp apart and 8 dp in from the screen edges, under the heading at the 16 dp keyline. */
  .quantum-docs-empty-results {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-1, 8px);
  }

  /* The heading names the query the results answer, so they are not mistaken for matches to what was typed. */
  .quantum-docs-empty-match {
    margin: var(--quantum-spacing-1, 8px) var(--quantum-spacing-1, 8px) 0;
  }

  .quantum-docs-empty-query {
    margin: 0 var(--quantum-spacing-1, 8px) var(--quantum-spacing-1, 8px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
