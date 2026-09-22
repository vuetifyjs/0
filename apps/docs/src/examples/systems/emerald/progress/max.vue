<script setup lang="ts">
  import { EmButton, EmProgress } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const total = 6
  const done = shallowRef(2)

  function onComplete () {
    done.value = Math.min(done.value + 1, total)
  }

  function onReset () {
    done.value = 0
  }
</script>

<template>
  <div class="emerald-docs-stack">
    <EmProgress
      label="Onboarding"
      :max="total"
      :model-value="done"
      show-value
      size="lg"
    />

    <p class="emerald-docs-caption">{{ done }} of {{ total }} steps complete</p>

    <div class="emerald-docs-row">
      <EmButton :disabled="done >= total" size="sm" @click="onComplete">Complete a step</EmButton>

      <EmButton :disabled="done === 0" size="sm" variant="tertiary" @click="onReset">Reset</EmButton>
    </div>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
    max-width: 360px;
  }

  .emerald-docs-caption {
    margin: 0;
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }
</style>
