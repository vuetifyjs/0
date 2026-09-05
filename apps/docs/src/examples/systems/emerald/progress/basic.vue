<script setup lang="ts">
  import { EmButton, EmProgress } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const value = shallowRef(35)
  const timer = shallowRef<ReturnType<typeof setInterval>>()

  function onUpload () {
    if (timer.value) return

    value.value = 4

    timer.value = setInterval(() => {
      value.value = Math.min(value.value + 3 + Math.round(Math.random() * 12), 100)

      if (value.value >= 100) {
        clearInterval(timer.value)
        timer.value = undefined
      }
    }, 250)
  }
</script>

<template>
  <div class="emerald-docs-stack">
    <EmProgress v-model="value" label="Upload" show-value />

    <div>
      <EmButton :disabled="!!timer" size="sm" @click="onUpload">
        {{ value >= 100 ? 'Upload again' : 'Start upload' }}
      </EmButton>
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
</style>
