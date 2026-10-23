<script setup lang="ts">
  import { Md1Button, Md1ExpansionPanel, Md1ToggleButtons } from '@paper/md1'
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
  <Md1ExpansionPanel v-model="panel" class="md1-docs-panels">
    <Md1ExpansionPanel.Item value="trip">
      <Md1ExpansionPanel.Header label="Trip name" summary="Caribbean cruise" />

      <Md1ExpansionPanel.Content>
        The name shown on the itinerary.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>

    <Md1ExpansionPanel.Item value="cabin">
      <Md1ExpansionPanel.Header label="Cabin class" :summary="LABELS[cabin]" />

      <Md1ExpansionPanel.Content>
        <Md1ToggleButtons v-model="draft" label="Cabin class" mandatory>
          <Md1ToggleButtons.Item value="economy">Economy</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="premium">Premium</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="business">Business</Md1ToggleButtons.Item>
        </Md1ToggleButtons>

        <p class="md1-docs-panel-helper">The fare difference is charged at check-in.</p>

        <Md1ExpansionPanel.Actions>
          <Md1Button @click="onCancel">Cancel</Md1Button>

          <Md1Button @click="onSave">Save</Md1Button>
        </Md1ExpansionPanel.Actions>
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>

    <Md1ExpansionPanel.Item value="travelers">
      <Md1ExpansionPanel.Header label="Travelers" summary="2 adults" />

      <Md1ExpansionPanel.Content>
        Both travelers share one cabin.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>
  </Md1ExpansionPanel>
</template>

<style>
  .md1-docs-panels {
    width: 100%;
    max-width: 640px;
  }

  /* Helper text: the figures draw it in secondary ink at Caption size. */
  .md1-docs-panel-helper {
    margin: var(--md1-spacing-1, 8px) 0 0;
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
