<script setup lang="ts">
  import { EmRadio, EmRadioGroup } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const small = shallowRef('weekly')
  const medium = shallowRef('weekly')
  const large = shallowRef('weekly')
</script>

<template>
  <div class="emerald-docs-stack">
    <EmRadioGroup v-model="small" label="Digest frequency, small">
      <EmRadio size="sm" value="daily">Daily</EmRadio>

      <EmRadio size="sm" value="weekly">Weekly</EmRadio>
    </EmRadioGroup>

    <EmRadioGroup v-model="medium" label="Digest frequency, medium">
      <EmRadio value="daily">Daily</EmRadio>

      <EmRadio value="weekly">Weekly</EmRadio>
    </EmRadioGroup>

    <EmRadioGroup v-model="large" label="Digest frequency, large">
      <EmRadio size="lg" value="daily">Daily</EmRadio>

      <EmRadio size="lg" value="weekly">Weekly</EmRadio>
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
