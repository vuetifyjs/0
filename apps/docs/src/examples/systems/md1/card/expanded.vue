<script setup lang="ts">
  import { Collapsible } from '@vuetify/v0'
  import { MD1_CARD_COLLAPSIBLE, Md1Button, Md1Card } from '@paper/md1'
  import { shallowRef } from 'vue'

  const expanded = shallowRef(false)
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card v-model:expanded="expanded">
      <Md1Card.Media src="https://picsum.photos/seed/md1-card-bread/688/387" />

      <Md1Card.Title>Sourdough country loaf</Md1Card.Title>

      <Md1Card.Subtitle>Two days, mostly waiting</Md1Card.Subtitle>

      <Md1Card.Actions>
        <Md1Button>Save recipe</Md1Button>

        <Collapsible.Activator v-slot="{ attrs }" :namespace="MD1_CARD_COLLAPSIBLE" renderless>
          <Md1Button
            v-bind="attrs"
            aria-label="Method"
            class="md1-docs-push"
            :icon="expanded ? 'expand-less' : 'expand-more'"
          />
        </Collapsible.Activator>
      </Md1Card.Actions>

      <Md1Card.Expanded>
        Mix the levain the night before. In the morning, combine flour and water, rest for an hour, then add the levain and salt. Fold every 30 minutes for two hours, shape, and retard in the fridge overnight. Bake at 250 °C in a covered pot for 20 minutes, then uncovered for 25.
      </Md1Card.Expanded>
    </Md1Card>
  </div>
</template>

<style>
  .md1-docs-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 344px));
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-push {
    margin-inline-start: auto;
  }
</style>
