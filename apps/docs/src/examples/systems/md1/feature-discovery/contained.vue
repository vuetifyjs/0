<script setup lang="ts">
  import { Md1Button, Md1Card, Md1FeatureDiscovery } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const shared = shallowRef(false)
</script>

<template>
  <div class="md1-docs-screen md1-docs-contained-screen">
    <div class="md1-docs-contained-actions">
      <Md1Button :disabled="open" variant="raised" @click="open = true">Show prompt</Md1Button>

      <span v-if="shared" class="md1-docs-contained-note" role="status">Shared</span>
    </div>

    <div class="md1-docs-contained-card">
      <Md1Card>
        <Md1Card.Title :level="5">Kangaroo Valley Safari</Md1Card.Title>

        <Md1Card.Subtitle>Two hours south of Sydney, in the Southern Highlands of New South Wales</Md1Card.Subtitle>

        <Md1Card.Supporting>
          Rolling hills, a river gorge and a sandstone bridge from 1898. The valley is a short drive from the coast and a long way from everything else.
        </Md1Card.Supporting>

        <Md1Card.Actions>
          <Md1Button>Book</Md1Button>

          <Md1FeatureDiscovery v-model="open">
            <Md1FeatureDiscovery.Target>
              <Md1Button aria-label="Share" icon="share" @click="shared = true" />
            </Md1FeatureDiscovery.Target>

            <Md1FeatureDiscovery.Title>Share trips</Md1FeatureDiscovery.Title>

            <Md1FeatureDiscovery.Text>Send this card to friends.</Md1FeatureDiscovery.Text>
          </Md1FeatureDiscovery>
        </Md1Card.Actions>
      </Md1Card>
    </div>
  </div>
</template>

<style>
  /* A desktop screen, tall enough that the card's action clears the 144 dp screen bands. */
  .md1-docs-contained-screen {
    height: 560px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-contained-actions {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-contained-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-contained-card {
    max-width: 400px;
    margin: 40px auto 0;
  }
</style>
