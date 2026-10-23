<script setup lang="ts">
  import { QuButton, QuDialog } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const deleted = shallowRef(false)

  function onDelete () {
    deleted.value = true
  }
</script>

<template>
  <div class="quantum-docs-confirm-row">
    <QuDialog>
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" :disabled="deleted" variant="raised">Delete album</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <QuDialog.Title>Delete "Summer 2016"?</QuDialog.Title>

        <QuDialog.Text>The album and its 48 photos will be removed from your library and will no longer be available on any of your devices.</QuDialog.Text>

        <QuDialog.Actions>
          <QuDialog.Cancel />

          <QuDialog.Confirm @confirm="onDelete">Delete</QuDialog.Confirm>
        </QuDialog.Actions>
      </QuDialog.Content>
    </QuDialog>

    <span v-if="deleted" class="quantum-docs-confirm-note" role="status">Album deleted</span>
  </div>
</template>

<style>
  .quantum-docs-confirm-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-confirm-note {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
