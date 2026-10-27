<script setup lang="ts">
  import { Md1Button, Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  // The last saved profile, which Cancel restores.
  const saved = { name: 'Ali Connors', email: 'ali@example.com' }

  const name = shallowRef(saved.name)
  const email = shallowRef(saved.email)
  const status = shallowRef('')

  function onSave () {
    saved.name = name.value
    saved.email = email.value
    status.value = 'Profile saved'
  }

  function onCancel () {
    name.value = saved.name
    email.value = saved.email
    status.value = 'Changes discarded'
  }
</script>

<template>
  <div class="md1-docs-placement">
    <figure class="md1-docs-placement-item">
      <div class="md1-docs-placement-form">
        <Md1TextField v-model="name" label="Name" />

        <Md1TextField v-model="email" label="Email" type="email" />

        <!-- Forms: start edge, affirmative first. -->
        <div class="md1-docs-placement-actions">
          <Md1Button variant="raised" @click="onSave">Save</Md1Button>

          <Md1Button @click="onCancel">Cancel</Md1Button>
        </div>

        <span class="md1-docs-placement-status" role="status">{{ status }}</span>
      </div>

      <figcaption class="md1-docs-placement-caption">Form: start edge, affirmative first</figcaption>
    </figure>

    <figure class="md1-docs-placement-item">
      <div class="md1-docs-placement-dialog md1-elevation-24">
        <p class="md1-docs-placement-text">Discard draft?</p>

        <!-- Standard dialogs: end edge, affirmative last. -->
        <div class="md1-docs-placement-actions" data-dialog>
          <Md1Button>Cancel</Md1Button>

          <Md1Button>Discard</Md1Button>
        </div>
      </div>

      <figcaption class="md1-docs-placement-caption">Dialog: end edge, affirmative last</figcaption>
    </figure>
  </div>
</template>

<style>
  /* Two figures side by side, stacking on a narrow screen. */
  .md1-docs-placement {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-placement-item {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    width: 280px;
    margin: 0;
  }

  .md1-docs-placement-form {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  /* Logical alignment: start and end follow the writing direction, so both rows mirror under RTL. */
  .md1-docs-placement-actions {
    display: flex;
    justify-content: flex-start;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-placement-actions[data-dialog] {
    justify-content: flex-end;
    padding: var(--md1-spacing-1, 8px);
  }

  /* A static sheet in the dialog's shape: 2 dp radius, 24 dp content padding, 24 dp elevation. */
  .md1-docs-placement-dialog {
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-placement-text {
    margin: 0;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-placement-status,
  .md1-docs-placement-caption {
    min-height: 16px;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    line-height: 16px;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
