<script setup lang="ts">
  import { QuButton, QuDialog } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const opened = shallowRef(false)

  function onManage () {
    opened.value = true
  }
</script>

<template>
  <div class="quantum-docs-errors-row">
    <QuDialog>
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" variant="raised">Send</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <QuDialog.Text>Your storage is full, so this message can't be sent. Free up space to send and receive mail.</QuDialog.Text>

        <QuDialog.Actions>
          <QuDialog.Cancel>Not now</QuDialog.Cancel>

          <QuDialog.Confirm @confirm="onManage">Manage storage</QuDialog.Confirm>
        </QuDialog.Actions>
      </QuDialog.Content>
    </QuDialog>

    <span v-if="opened" class="quantum-docs-errors-note" role="status">Storage settings opened</span>
  </div>
</template>

<style>
  .quantum-docs-errors-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-errors-note {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
