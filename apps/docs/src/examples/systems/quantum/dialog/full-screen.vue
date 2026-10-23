<script setup lang="ts">
  import { QuButton, QuDialog } from '@paper/quantum'
  import { shallowRef, toRef, watch } from 'vue'

  const open = shallowRef(false)
  const saved = shallowRef(0)
  const reminders = shallowRef(0)

  // Unsaved changes: closing now asks before discarding them.
  const dirty = toRef(() => reminders.value !== saved.value)

  // Every opening starts from what was last saved.
  watch(open, value => {
    if (value) reminders.value = saved.value
  })

  function onAdd () {
    reminders.value++
  }

  function onSave () {
    saved.value = reminders.value
  }
</script>

<template>
  <div class="quantum-docs-row">
    <QuDialog v-slot="{ close }" v-model="open" :dirty variant="full-screen">
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" variant="raised">New event</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <div class="quantum-docs-bar">
          <QuButton aria-label="Discard" icon="close" @click="close" />

          <QuDialog.Title>New event</QuDialog.Title>

          <QuDialog.Confirm @confirm="onSave">Save</QuDialog.Confirm>
        </div>

        <QuDialog.Text>Nothing is saved until you tap Save. Closing with unsaved changes asks before discarding them.</QuDialog.Text>

        <div class="quantum-docs-row quantum-docs-inset">
          <QuButton icon="add" @click="onAdd">Add reminder</QuButton>

          <span class="quantum-docs-note" role="status">{{ reminders }} reminders</span>
        </div>
      </QuDialog.Content>
    </QuDialog>

    <span class="quantum-docs-note">{{ saved }} reminders saved</span>
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

  /*
   * Stands in for QuToolbar until it lands: a 56 dp primary app bar with the
   * discard X 16 dp from the left (its 48 dp target starts 4 dp in), the title
   * on the 72 dp keyline and the verb with 16 dp of side padding.
   */
  .quantum-docs-bar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 var(--quantum-spacing-1, 8px) 0 4px;
    background: var(--quantum-primary, #3F51B5);
    color: var(--quantum-on-primary, #FFFFFF);
    box-shadow: var(--quantum-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-bar .quantum-button[data-variant] {
    color: var(--quantum-on-primary, #FFFFFF);
  }

  .quantum-docs-bar .quantum-dialog__title {
    flex: 1 1 auto;
    padding: 0 0 0 20px;
    color: var(--quantum-on-primary, #FFFFFF);
  }

  .quantum-docs-bar + .quantum-dialog__text {
    padding-top: var(--quantum-spacing-3, 24px);
  }

  .quantum-docs-inset {
    padding: 0 var(--quantum-spacing-3, 24px) var(--quantum-spacing-3, 24px) var(--quantum-spacing-1, 8px);
  }
</style>
