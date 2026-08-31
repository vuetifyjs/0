<script setup lang="ts">
  import {
    EmExpansionPanel,
    EmExpansionPanelActivator,
    EmExpansionPanelContent,
    EmExpansionPanelCue,
    EmExpansionPanelGroup,
    EmExpansionPanelHeader,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const open = shallowRef<string>()

  const items = [
    {
      value: 'shipping',
      title: 'How long does shipping take?',
      body: 'Orders leave the warehouse within two business days. Domestic delivery takes three to five days after that; international delivery depends on customs.',
    },
    {
      value: 'returns',
      title: 'What is the return policy?',
      body: 'Anything unused can come back within thirty days for a full refund. Open the order in your account and print the prepaid label.',
    },
    {
      value: 'warranty',
      title: 'Is there a warranty?',
      body: 'Every product carries a two-year warranty against manufacturing defects. Normal wear and accidental damage are not covered.',
    },
  ]
</script>

<template>
  <div class="emerald-docs-stack">
    <EmExpansionPanelGroup v-model="open">
      <EmExpansionPanel v-for="item in items" :key="item.value" :value="item.value">
        <EmExpansionPanelHeader>
          <EmExpansionPanelActivator>
            {{ item.title }}

            <EmExpansionPanelCue />
          </EmExpansionPanelActivator>
        </EmExpansionPanelHeader>

        <EmExpansionPanelContent>
          {{ item.body }}
        </EmExpansionPanelContent>
      </EmExpansionPanel>
    </EmExpansionPanelGroup>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 520px;
  }
</style>
