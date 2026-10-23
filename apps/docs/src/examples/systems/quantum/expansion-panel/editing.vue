<script setup lang="ts">
  import { QuButton, QuExpansionPanel, QuToggleButtons } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const LABELS: Record<string, string> = {
    economy: 'Economy',
    premium: 'Premium',
    business: 'Business',
  }

  const panel = shallowRef<string | undefined>('cabin')
  const cabin = shallowRef('economy')
  const draft = shallowRef('economy')

  function onCancel () {
    draft.value = cabin.value
    panel.value = undefined
  }

  function onSave () {
    cabin.value = draft.value
    panel.value = undefined
  }
</script>

<template>
  <QuExpansionPanel v-model="panel" class="quantum-docs-panels">
    <QuExpansionPanel.Item value="trip">
      <QuExpansionPanel.Header label="Trip name" summary="Caribbean cruise" />

      <QuExpansionPanel.Content>
        The name shown on the itinerary.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>

    <QuExpansionPanel.Item value="cabin">
      <QuExpansionPanel.Header label="Cabin class" :summary="LABELS[cabin]" />

      <QuExpansionPanel.Content>
        <QuToggleButtons v-model="draft" label="Cabin class" mandatory>
          <QuToggleButtons.Item value="economy">Economy</QuToggleButtons.Item>

          <QuToggleButtons.Item value="premium">Premium</QuToggleButtons.Item>

          <QuToggleButtons.Item value="business">Business</QuToggleButtons.Item>
        </QuToggleButtons>

        <p class="quantum-docs-panel-helper">The fare difference is charged at check-in.</p>

        <QuExpansionPanel.Actions>
          <QuButton @click="onCancel">Cancel</QuButton>

          <QuButton @click="onSave">Save</QuButton>
        </QuExpansionPanel.Actions>
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>

    <QuExpansionPanel.Item value="travelers">
      <QuExpansionPanel.Header label="Travelers" summary="2 adults" />

      <QuExpansionPanel.Content>
        Both travelers share one cabin.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>
  </QuExpansionPanel>
</template>

<style>
  .quantum-docs-panels {
    width: 100%;
    max-width: 640px;
  }

  /* Helper text: the figures draw it in secondary ink at Caption size. */
  .quantum-docs-panel-helper {
    margin: var(--quantum-spacing-1, 8px) 0 0;
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
