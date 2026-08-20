<script setup lang="ts">
  import { EmStep, EmStepItem } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const current = shallowRef('account')
</script>

<template>
  <div class="emerald-docs-stack">
    <EmStep v-model="current">
      <EmStepItem value="account">Account</EmStepItem>

      <EmStepItem value="profile">Profile</EmStepItem>

      <EmStepItem value="review">Review</EmStepItem>
    </EmStep>

    <p class="emerald-docs-note">Current: {{ current }}</p>
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
