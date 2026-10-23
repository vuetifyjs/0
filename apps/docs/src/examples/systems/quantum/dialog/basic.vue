<script setup lang="ts">
  import { QuButton, QuDialog } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const discarded = shallowRef(false)

  function onDiscard () {
    discarded.value = true
  }
</script>

<template>
  <div class="quantum-docs-row">
    <QuDialog>
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" variant="raised">Discard draft</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <QuDialog.Text>Discard draft?</QuDialog.Text>

        <QuDialog.Actions>
          <QuDialog.Cancel />

          <QuDialog.Confirm @confirm="onDiscard">Discard</QuDialog.Confirm>
        </QuDialog.Actions>
      </QuDialog.Content>
    </QuDialog>

    <span v-if="discarded" class="quantum-docs-note" role="status">Draft discarded</span>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
