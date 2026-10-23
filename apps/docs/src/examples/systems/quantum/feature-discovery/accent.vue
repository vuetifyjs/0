<script setup lang="ts">
  import { QuButton, QuFab, QuFeatureDiscovery } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const drafts = shallowRef(0)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-accent-screen">
    <div class="quantum-docs-accent-actions">
      <QuButton :disabled="open" variant="raised" @click="open = true">Show prompt</QuButton>

      <span class="quantum-docs-accent-note" role="status">{{ drafts === 0 ? 'No drafts yet' : `${drafts} draft${drafts === 1 ? '' : 's'}` }}</span>
    </div>

    <div class="quantum-docs-accent-fab">
      <QuFeatureDiscovery v-model="open" color="accent">
        <QuFeatureDiscovery.Target>
          <QuFab aria-label="Compose" icon="edit" position="static" @click="drafts++" />
        </QuFeatureDiscovery.Target>

        <QuFeatureDiscovery.Title>Start a message</QuFeatureDiscovery.Title>

        <QuFeatureDiscovery.Text>Tap compose to write to anyone in your contacts.</QuFeatureDiscovery.Text>
      </QuFeatureDiscovery>
    </div>
  </div>
</template>

<style>
  .quantum-docs-accent-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-accent-actions {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-accent-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The FAB's handset place, 16 dp from the end and bottom edges of the screen. */
  .quantum-docs-accent-fab {
    position: absolute;
    right: var(--quantum-spacing-2, 16px);
    bottom: var(--quantum-spacing-2, 16px);
  }
</style>
