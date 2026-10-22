<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { BProgress } from '@paper/bootstrap'

  const value = shallowRef(40)

  function onDecrease () {
    value.value = Math.max(0, value.value - 10)
  }

  function onIncrease () {
    value.value = Math.min(100, value.value + 10)
  }
</script>

<template>
  <BProgress v-model="value" label="Adjustable example">
    {{ value }}%
  </BProgress>

  <div class="d-flex gap-2 mt-3">
    <button
      class="btn-solid theme-primary"
      type="button"
      @click="onDecrease"
    >
      Decrease
    </button>

    <button
      class="btn-solid theme-primary"
      type="button"
      @click="onIncrease"
    >
      Increase
    </button>
  </div>
</template>
