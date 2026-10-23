<script setup lang="ts">
  import { Collapsible } from '@vuetify/v0'
  import { QU_CARD_COLLAPSIBLE, QuButton, QuCard } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const expanded = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-cards">
    <QuCard v-model:expanded="expanded">
      <QuCard.Media src="https://picsum.photos/seed/quantum-card-bread/688/387" />

      <QuCard.Title>Sourdough country loaf</QuCard.Title>

      <QuCard.Subtitle>Two days, mostly waiting</QuCard.Subtitle>

      <QuCard.Actions>
        <QuButton>Save recipe</QuButton>

        <Collapsible.Activator v-slot="{ attrs }" :namespace="QU_CARD_COLLAPSIBLE" renderless>
          <QuButton
            v-bind="attrs"
            aria-label="Method"
            class="quantum-docs-push"
            :icon="expanded ? 'expand-less' : 'expand-more'"
          />
        </Collapsible.Activator>
      </QuCard.Actions>

      <QuCard.Expanded>
        Mix the levain the night before. In the morning, combine flour and water, rest for an hour, then add the levain and salt. Fold every 30 minutes for two hours, shape, and retard in the fridge overnight. Bake at 250 °C in a covered pot for 20 minutes, then uncovered for 25.
      </QuCard.Expanded>
    </QuCard>
  </div>
</template>

<style>
  .quantum-docs-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 344px));
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-1, 8px);
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-push {
    margin-inline-start: auto;
  }
</style>
