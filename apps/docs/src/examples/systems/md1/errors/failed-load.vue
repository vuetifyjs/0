<script setup lang="ts">
  import { Md1Button, Md1Divider, Md1ProgressLinear } from '@paper/md1'
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
  <article class="md1-docs-errors-article">
    <p class="md1-docs-errors-headline">Trail conditions after the storm</p>

    <p class="md1-docs-errors-body">The upper loop reopened on Friday. Expect mud below the ridge and a washed-out crossing at mile four; the lower trail is dry.</p>

    <Md1Divider />

    <section aria-labelledby="md1-docs-errors-comments" class="md1-docs-errors-comments">
      <p id="md1-docs-errors-comments" class="md1-docs-errors-title">Comments</p>

      <Md1ProgressLinear v-if="loading" aria-label="Loading comments" />

      <p v-else-if="loaded" class="md1-docs-errors-body">No comments yet.</p>

      <div v-else class="md1-docs-errors-empty">
        <p class="md1-docs-errors-body">Comments couldn't load.</p>

        <Md1Button @click="onRetry">Retry</Md1Button>
      </div>
    </section>
  </article>
</template>

<style>
  .md1-docs-errors-article {
    box-sizing: border-box;
    max-width: 400px;
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  .md1-docs-errors-headline {
    margin: 0 0 var(--md1-spacing-1, 8px);
    font-size: var(--md1-type-headline-size, 24px);
    font-weight: var(--md1-type-headline-weight, 400);
    line-height: var(--md1-type-headline-leading, 32px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-errors-body {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-errors-comments {
    padding-top: var(--md1-spacing-2, 16px);
  }

  .md1-docs-errors-title {
    margin: 0 0 var(--md1-spacing-1, 8px);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    line-height: var(--md1-type-body-2-leading, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-errors-empty {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--md1-spacing-1, 8px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-errors-empty .md1-docs-errors-body {
    margin: 0;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
