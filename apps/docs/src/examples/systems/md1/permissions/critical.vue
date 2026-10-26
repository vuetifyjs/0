<script setup lang="ts">
  import { Md1Button, Md1Icon } from '@paper/md1'
  import { shallowRef } from 'vue'

  const ACCESS = [
    { icon: 'email', label: 'SMS' },
    { icon: 'person', label: 'Contacts' },
    { icon: 'phone', label: 'Phone' },
  ] as const

  const choice = shallowRef('')
</script>

<template>
  <div class="md1-docs-screen md1-docs-permission-critical">
    <div class="md1-docs-permission-critical-body">
      <h2 class="md1-type-headline md1-docs-permission-critical-title">Grant access</h2>

      <p class="md1-type-subheading md1-docs-permission-critical-text">Change permissions in your device's app settings. Give Messenger access to SMS, Phone, and Contacts.</p>

      <ul aria-label="Permissions Messenger needs" class="md1-docs-permission-critical-needs">
        <li v-for="item in ACCESS" :key="item.icon" class="md1-docs-permission-critical-need">
          <span class="md1-docs-permission-critical-disc">
            <Md1Icon :name="item.icon" />
          </span>

          <span class="md1-type-caption">{{ item.label }}</span>
        </li>
      </ul>

      <p class="md1-type-caption md1-docs-readout md1-docs-permission-critical-status" role="status">{{ choice }}</p>
    </div>

    <div class="md1-docs-permission-critical-actions">
      <Md1Button @click="choice = 'Messenger closed'">Exit</Md1Button>

      <Md1Button @click="choice = 'Opening the app\'s permission settings'">
        Settings

        <Md1Icon name="chevron-right" />
      </Md1Button>
    </div>
  </div>
</template>

<style>
  /* The whole screen is the app's colour, so every ink on it is the on-primary white. */
  .md1-docs-permission-critical {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  /*
   * The body takes what the actions leave and scrolls when a narrow screen
   * wraps it past that, so the actions stay pinned to the foot and a longer
   * status never pushes them down.
   */
  .md1-docs-permission-critical-body {
    flex: 1 1 auto;
    min-block-size: 0;
    overflow-y: auto;
    padding: var(--md1-spacing-4, 32px) var(--md1-spacing-5, 40px) 0;
  }

  .md1-docs-permission-critical-title {
    margin: 0 0 var(--md1-spacing-2, 16px);
  }

  .md1-docs-permission-critical-text {
    margin: 0;
  }

  .md1-docs-permission-critical-needs {
    display: flex;
    justify-content: space-between;
    margin: var(--md1-spacing-4, 32px) 0 0;
    padding: 0;
    list-style: none;
  }

  .md1-docs-permission-critical-need {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-permission-critical-disc {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--md1-on-primary, #FFFFFF) 24%, transparent);
  }

  /* Always rendered and one line tall, empty until an action is chosen. */
  .md1-docs-permission-critical-body > .md1-docs-permission-critical-status {
    margin: var(--md1-spacing-2, 16px) 0 0;
    text-align: start;
  }

  /* A seam above the two actions, the step bar at the foot of a full-screen flow. */
  .md1-docs-permission-critical-actions {
    display: flex;
    justify-content: space-between;
    padding: var(--md1-spacing-1, 8px);
    border-top: 1px solid color-mix(in srgb, var(--md1-on-primary, #FFFFFF) 24%, transparent);
  }

  .md1-docs-permission-critical-actions .md1-button {
    color: var(--md1-on-primary, #FFFFFF);
  }
</style>
