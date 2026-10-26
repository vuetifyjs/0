<script setup lang="ts">
  import { Md1Button, Md1Dialog } from '@paper/md1'
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
  <div class="md1-docs-dialog-stack">
    <Md1Dialog v-slot="{ close }" v-model="open" :dirty variant="full-screen">
      <Md1Dialog.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" variant="raised">New event</Md1Button>
      </Md1Dialog.Activator>

      <Md1Dialog.Content>
        <div class="md1-docs-bar">
          <Md1Button aria-label="Discard" icon="close" @click="close" />

          <Md1Dialog.Title>New event</Md1Dialog.Title>

          <Md1Dialog.Confirm @confirm="onSave">Save</Md1Dialog.Confirm>
        </div>

        <Md1Dialog.Text>Nothing is saved until you tap Save. Closing with unsaved changes asks before discarding them.</Md1Dialog.Text>

        <div class="md1-docs-inset">
          <Md1Button icon="add" @click="onAdd">Add reminder</Md1Button>

          <span class="md1-docs-note" role="status">{{ reminders }} reminders</span>
        </div>
      </Md1Dialog.Content>
    </Md1Dialog>

    <p class="md1-docs-readout md1-docs-note">{{ saved }} reminders saved</p>
  </div>
</template>

<style>
  /*
   * The activator on top and its readout below, each centred on its own, so the
   * readout changing never moves the button.
   */
  .md1-docs-dialog-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /*
   * Stands in for Md1Toolbar until it lands: a 56 dp primary app bar with the
   * discard X 16 dp from the left (its 48 dp target starts 4 dp in), the title
   * on the 72 dp keyline and the verb with 16 dp of side padding.
   */
  .md1-docs-bar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 var(--md1-spacing-1, 8px) 0 4px;
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
    box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-docs-bar .md1-button[data-variant] {
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-bar .md1-dialog__title {
    flex: 1 1 auto;
    padding: 0 0 0 20px;
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-bar + .md1-dialog__text {
    padding-top: var(--md1-spacing-3, 24px);
  }

  /* Its own row rather than .md1-docs-row: example styles are document-global, and other pages centre that class. Content starts at the sheet's keyline. */
  .md1-docs-inset {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: 0 var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) var(--md1-spacing-1, 8px);
  }
</style>
