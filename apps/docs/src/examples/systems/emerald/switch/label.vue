<script setup lang="ts">
  import { EmSwitch } from '@paper/emerald'
  import { shallowRef } from 'vue'

  const wifi = shallowRef(true)
  const bluetooth = shallowRef(false)
</script>

<template>
  <div class="emerald-docs-settings">
    <div class="emerald-docs-settings__row">
      <span>Wi-Fi</span>
      <EmSwitch v-model="wifi" label="Wi-Fi" />
    </div>

    <div class="emerald-docs-settings__row">
      <span>Bluetooth</span>
      <EmSwitch v-model="bluetooth" label="Bluetooth" />
    </div>
  </div>
</template>

<style>
  .emerald-docs-settings {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
    max-width: 280px;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    color: var(--emerald-on-background, #2b2d2e);
  }

  .emerald-docs-settings__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-s, 12px);
    font-size: var(--emerald-text-b1-size, 16px);
    line-height: var(--emerald-text-b1-height, 24px);
  }
</style>
