<script setup lang="ts">
  import { EmButton, EmCheckbox, EmStep, EmStepItem } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const current = shallowRef('cart')
  const shipping = shallowRef(false)
</script>

<template>
  <div class="emerald-docs-stack">
    <EmCheckbox v-model="shipping">Order needs shipping</EmCheckbox>

    <EmStep v-slot="{ prev, next }" v-model="current">
      <EmStepItem value="cart">Cart</EmStepItem>

      <EmStepItem :disabled="!shipping" value="shipping">Shipping</EmStepItem>

      <EmStepItem value="confirm">Confirm</EmStepItem>

      <div class="emerald-docs-actions">
        <EmButton
          :disabled="current === 'cart'"
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
    </EmStep>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .emerald-docs-actions {
    display: flex;
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
  }
</style>
