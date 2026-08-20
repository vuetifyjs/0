<script setup lang="ts">
  import { EmSwitch } from '@paper/emerald'
  import { shallowRef } from 'vue'

  const notifications = shallowRef(true)
  const autosave = shallowRef(false)
  const telemetry = shallowRef(false)
</script>

<template>
  <div class="emerald-docs-stack">
    <EmSwitch v-model="notifications">Desktop notifications</EmSwitch>

    <EmSwitch v-model="autosave">Autosave drafts</EmSwitch>

    <EmSwitch v-model="telemetry">Share anonymous usage data</EmSwitch>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
  }
</style>
