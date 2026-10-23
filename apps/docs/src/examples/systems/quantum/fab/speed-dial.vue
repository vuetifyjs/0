<script setup lang="ts">
  import { QuFab } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const chosen = shallowRef<unknown>()
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-fab-screen">
    <p class="quantum-docs-fab-note" role="status">
      {{ chosen ? `New ${chosen}` : (open ? 'Choose what to create.' : 'Press the button to create.') }}
    </p>

    <QuFab
      v-model="open"
      aria-label="Create"
      icon="add"
      @select="chosen = $event"
    >
      <QuFab.Action icon="email" label="Email" value="email" />

      <QuFab.Action icon="event" label="Event" value="event" />

      <QuFab.Action icon="photo" label="Photo" value="photo" />
    </QuFab>
  </div>
</template>

<style>
  .quantum-docs-fab-screen {
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-fab-note {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
