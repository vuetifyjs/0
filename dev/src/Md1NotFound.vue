<script lang="ts">
  // Framework
  import { Md1Button, Md1Icon } from '@paper/md1'

  // Utilities
  import { useRouter } from 'vue-router'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1NotFound' })

  const router = useRouter()
</script>

<template>
  <div class="md1-demo-missing">
    <Md1Icon aria-hidden="true" class="md1-demo-missing__art" name="error-outline" />

    <p class="md1-demo-missing__tagline">Page not found</p>

    <p class="md1-demo-missing__text">Check the address, or head back to the overview.</p>

    <Md1Button @click="router.push('/md1')">Back to overview</Md1Button>
  </div>
</template>

<style>
  /* The empty-states pattern: the state belongs to the screen, not a sheet of its own. */
  .md1-demo-missing {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
    min-height: 60vh;
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
    text-align: center;
  }

  /* The non-interactive image: a 96 dp glyph in the disabled ink. */
  .md1-demo-missing__art {
    --md1-icon-size: 96px;

    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /* The tagline: Subheading in the secondary ink, a statement rather than an instruction. */
  .md1-demo-missing__tagline {
    margin: 0;
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-demo-missing__text {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
