<script setup lang="ts">
  import { EmRadio, EmRadioGroup } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const plan = shallowRef('starter')
</script>

<template>
  <div class="emerald-docs-stack">
    <EmRadioGroup v-model="plan" label="Billing plan">
      <EmRadio value="starter">Starter</EmRadio>

      <EmRadio value="team">Team</EmRadio>

      <EmRadio value="enterprise">Enterprise</EmRadio>
    </EmRadioGroup>

    <p class="emerald-docs-note">Selected: {{ plan }}</p>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .emerald-docs-note {
    margin: 0;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 16px);
    color: var(--emerald-neutral-600, #939dac);
  }
</style>
