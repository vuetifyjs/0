<script setup lang="ts">
  import { EmRadio, EmRadioGroup } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const region = shallowRef('us-east')
  const runtime = shallowRef('node20')
</script>

<template>
  <div class="emerald-docs-stack">
    <EmRadioGroup v-model="region" label="Primary region">
      <EmRadio value="us-east">US East</EmRadio>

      <EmRadio value="eu-west">EU West</EmRadio>

      <EmRadio disabled value="ap-south">Asia Pacific, coming soon</EmRadio>
    </EmRadioGroup>

    <EmRadioGroup v-model="runtime" disabled label="Runtime, locked by your plan">
      <EmRadio value="node20">Node 20</EmRadio>

      <EmRadio value="node22">Node 22</EmRadio>
    </EmRadioGroup>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }
</style>
