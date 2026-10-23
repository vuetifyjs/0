<script setup lang="ts">
  import { QuButton, QuCard, QuFeatureDiscovery } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const shared = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-contained-screen">
    <div class="quantum-docs-contained-actions">
      <QuButton :disabled="open" variant="raised" @click="open = true">Show prompt</QuButton>

      <span v-if="shared" class="quantum-docs-contained-note" role="status">Shared</span>
    </div>

    <div class="quantum-docs-contained-card">
      <QuCard>
        <QuCard.Title :level="5">Kangaroo Valley Safari</QuCard.Title>

        <QuCard.Subtitle>Two hours south of Sydney, in the Southern Highlands of New South Wales</QuCard.Subtitle>

        <QuCard.Supporting>
          Rolling hills, a river gorge and a sandstone bridge from 1898. The valley is a short drive from the coast and a long way from everything else.
        </QuCard.Supporting>

        <QuCard.Actions>
          <QuButton>Book</QuButton>

          <QuFeatureDiscovery v-model="open">
            <QuFeatureDiscovery.Target>
              <QuButton aria-label="Share" icon="share" @click="shared = true" />
            </QuFeatureDiscovery.Target>

            <QuFeatureDiscovery.Title>Share trips</QuFeatureDiscovery.Title>

            <QuFeatureDiscovery.Text>Send this card to friends.</QuFeatureDiscovery.Text>
          </QuFeatureDiscovery>
        </QuCard.Actions>
      </QuCard>
    </div>
  </div>
</template>

<style>
  /* A desktop screen, tall enough that the card's action clears the 144 dp screen bands. */
  .quantum-docs-contained-screen {
    height: 560px;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-contained-actions {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-contained-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-contained-card {
    max-width: 400px;
    margin: 40px auto 0;
  }
</style>
