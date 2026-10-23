<script setup lang="ts">
  import { QuButton, QuFeatureDiscovery } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const saved = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-offset-screen">
    <div class="quantum-docs-offset-row">
      <div class="quantum-docs-offset-copy">
        <span class="quantum-docs-offset-title">Corner Bakery</span>

        <span class="quantum-docs-offset-caption">Open until 6 pm, 0.4 mi</span>
      </div>

      <QuFeatureDiscovery v-model="open">
        <QuFeatureDiscovery.Target>
          <QuButton aria-label="Save place" icon="bookmark" @click="saved = true" />
        </QuFeatureDiscovery.Target>

        <QuFeatureDiscovery.Title>Save places you like</QuFeatureDiscovery.Title>

        <QuFeatureDiscovery.Text>Saved places show up on your map and sync to every device.</QuFeatureDiscovery.Text>
      </QuFeatureDiscovery>
    </div>

    <div class="quantum-docs-offset-actions">
      <QuButton :disabled="open" variant="raised" @click="open = true">Show prompt</QuButton>

      <span v-if="saved" class="quantum-docs-offset-caption" role="status">Saved</span>
    </div>
  </div>
</template>

<style>
  .quantum-docs-offset-screen {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: var(--quantum-background, #FAFAFA);
  }

  /* A place row in the middle of the screen, its action at the end edge and clear of the 88 dp bands. */
  .quantum-docs-offset-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 132px;
    padding: 0 var(--quantum-spacing-1, 8px) 0 var(--quantum-spacing-2, 16px);
    min-height: 72px;
    background: var(--quantum-surface, #FFFFFF);
  }

  .quantum-docs-offset-copy {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .quantum-docs-offset-title {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-subheading-size, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-offset-caption {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-offset-actions {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-2, 16px);
  }
</style>
