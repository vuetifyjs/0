<script setup lang="ts">
  import { EmButton, EmStep, EmStepItem } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const current = shallowRef('details')

  const copy: Record<string, string> = {
    details: 'Name, email and password — the account itself.',
    payment: 'Card or invoice. Nothing is charged until the last step.',
    confirm: 'Review everything, then submit.',
  }
</script>

<template>
  <EmStep v-slot="{ prev, next }" v-model="current">
    <EmStepItem value="details">Details</EmStepItem>

    <EmStepItem value="payment">Payment</EmStepItem>

    <EmStepItem value="confirm">Confirm</EmStepItem>

    <div class="emerald-docs-panel">
      <p class="emerald-docs-copy">{{ copy[String(current)] }}</p>

      <div class="emerald-docs-actions">
        <EmButton
          :disabled="current === 'details'"
          size="sm"
          variant="secondary"
          @click="prev"
        >
          Back
        </EmButton>

        <EmButton
          :disabled="current === 'confirm'"
          size="sm"
          @click="next"
        >
          Continue
        </EmButton>
      </div>
    </div>
  </EmStep>
</template>

<style>
  .emerald-docs-panel {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
    padding: var(--emerald-spacing-m, 16px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
  }

  .emerald-docs-copy {
    margin: 0;
  }

  .emerald-docs-actions {
    display: flex;
    gap: var(--emerald-spacing-s, 12px);
  }
</style>
