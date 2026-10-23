<script setup lang="ts">
  import { Md1Button, Md1FeatureDiscovery } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const saved = shallowRef(false)
</script>

<template>
  <div class="md1-docs-screen md1-docs-offset-screen">
    <div class="md1-docs-offset-row">
      <div class="md1-docs-offset-copy">
        <span class="md1-docs-offset-title">Corner Bakery</span>

        <span class="md1-docs-offset-caption">Open until 6 pm, 0.4 mi</span>
      </div>

      <Md1FeatureDiscovery v-model="open">
        <Md1FeatureDiscovery.Target>
          <Md1Button aria-label="Save place" icon="bookmark" @click="saved = true" />
        </Md1FeatureDiscovery.Target>

        <Md1FeatureDiscovery.Title>Save places you like</Md1FeatureDiscovery.Title>

        <Md1FeatureDiscovery.Text>Saved places show up on your map and sync to every device.</Md1FeatureDiscovery.Text>
      </Md1FeatureDiscovery>
    </div>

    <div class="md1-docs-offset-actions">
      <Md1Button :disabled="open" variant="raised" @click="open = true">Show prompt</Md1Button>

      <span v-if="saved" class="md1-docs-offset-caption" role="status">Saved</span>
    </div>
  </div>
</template>

<style>
  .md1-docs-offset-screen {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: var(--md1-background, #FAFAFA);
  }

  /* A place row in the middle of the screen, its action at the end edge and clear of the 88 dp bands. */
  .md1-docs-offset-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 132px;
    padding: 0 var(--md1-spacing-1, 8px) 0 var(--md1-spacing-2, 16px);
    min-height: 72px;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-offset-copy {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .md1-docs-offset-title {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-offset-caption {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-offset-actions {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px);
  }
</style>
