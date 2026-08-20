<script setup lang="ts">
  import { EmAlert, EmAlertDescription, EmAlertTitle, EmButton } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const outcome = shallowRef<'saved' | 'failed' | null>(null)

  function onSave () {
    // Rendering the alert after the fact is what makes it announce —
    // a live region speaks when content appears, not when the page loads.
    outcome.value = 'saved'
  }

  function onFail () {
    outcome.value = 'failed'
  }
</script>

<template>
  <div class="emerald-docs-stack">
    <div class="emerald-docs-row">
      <EmButton variant="secondary" @click="onSave">Simulate success</EmButton>

      <EmButton variant="secondary" @click="onFail">Simulate failure</EmButton>
    </div>

    <EmAlert v-if="outcome === 'saved'" variant="success">
      <EmAlertTitle>Saved</EmAlertTitle>

      <EmAlertDescription>Announced politely — success renders role status.</EmAlertDescription>
    </EmAlert>

    <EmAlert v-if="outcome === 'failed'" variant="error">
      <EmAlertTitle>Save failed</EmAlertTitle>

      <EmAlertDescription>Announced immediately — error renders role alert.</EmAlertDescription>
    </EmAlert>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
  }

  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }
</style>
