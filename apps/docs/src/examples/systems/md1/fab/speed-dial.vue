<script setup lang="ts">
  import { Md1Fab } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const chosen = shallowRef<unknown>()
</script>

<template>
  <div class="md1-docs-screen md1-docs-fab-screen">
    <p class="md1-docs-fab-note" role="status">
      {{ chosen ? `New ${chosen}` : (open ? 'Choose what to create.' : 'Press the button to create.') }}
    </p>

    <Md1Fab
      v-model="open"
      aria-label="Create"
      icon="add"
      @select="chosen = $event"
    >
      <Md1Fab.Action icon="email" label="Email" value="email" />

      <Md1Fab.Action icon="event" label="Event" value="event" />

      <Md1Fab.Action icon="photo" label="Photo" value="photo" />
    </Md1Fab>
  </div>
</template>

<style>
  .md1-docs-fab-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-fab-note {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
