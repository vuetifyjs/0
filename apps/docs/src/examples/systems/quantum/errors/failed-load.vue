<script setup lang="ts">
  import { QuButton, QuDivider, QuProgressLinear } from '@paper/quantum'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const loading = shallowRef(false)
  const loaded = shallowRef(false)

  const timer = useTimer(() => {
    loading.value = false
    loaded.value = true
  }, { duration: 1500 })

  function onRetry () {
    loading.value = true
    timer.start()
  }
</script>

<template>
  <article class="quantum-docs-errors-article">
    <p class="quantum-docs-errors-headline">Trail conditions after the storm</p>

    <p class="quantum-docs-errors-body">The upper loop reopened on Friday. Expect mud below the ridge and a washed-out crossing at mile four; the lower trail is dry.</p>

    <QuDivider />

    <section aria-labelledby="quantum-docs-errors-comments" class="quantum-docs-errors-comments">
      <p id="quantum-docs-errors-comments" class="quantum-docs-errors-title">Comments</p>

      <QuProgressLinear v-if="loading" aria-label="Loading comments" />

      <p v-else-if="loaded" class="quantum-docs-errors-body">No comments yet.</p>

      <div v-else class="quantum-docs-errors-empty">
        <p class="quantum-docs-errors-body">Comments couldn't load.</p>

        <QuButton @click="onRetry">Retry</QuButton>
      </div>
    </section>
  </article>
</template>

<style>
  .quantum-docs-errors-article {
    box-sizing: border-box;
    max-width: 400px;
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-2);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  .quantum-docs-errors-headline {
    margin: 0 0 var(--quantum-spacing-1, 8px);
    font-size: var(--quantum-type-headline-size, 24px);
    font-weight: var(--quantum-type-headline-weight, 400);
    line-height: var(--quantum-type-headline-leading, 32px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-errors-body {
    margin: 0 0 var(--quantum-spacing-2, 16px);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-errors-comments {
    padding-top: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-errors-title {
    margin: 0 0 var(--quantum-spacing-1, 8px);
    font-size: var(--quantum-type-body-2-size, 14px);
    font-weight: var(--quantum-type-body-2-weight, 500);
    line-height: var(--quantum-type-body-2-leading, 24px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-errors-empty {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--quantum-spacing-1, 8px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-errors-empty .quantum-docs-errors-body {
    margin: 0;
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
