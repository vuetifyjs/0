<script setup lang="ts">
  import { EmTextField } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const locked = shallowRef('acct_8f21c990')
  const plan = shallowRef('Enterprise')
  const seats = shallowRef('0')
</script>

<template>
  <div class="emerald-docs-stack">
    <EmTextField
      v-model="locked"
      description="Generated when the account was created."
      label="Account ID"
      readonly
    />

    <EmTextField v-model="plan" disabled label="Plan" />

    <EmTextField
      v-model="seats"
      error
      error-messages="Buy at least one seat to continue."
      label="Seats"
      type="number"
    />
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 360px;
  }
</style>
