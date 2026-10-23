<script setup lang="ts">
  import { QuCheckbox } from '@paper/quantum'
  import { ref, toRef } from 'vue'

  const toppings = ref([
    { name: 'Cheese', on: true },
    { name: 'Olives', on: false },
    { name: 'Basil', on: true },
  ])

  const count = toRef(() => toppings.value.filter(topping => topping.on).length)
  const all = toRef(() => count.value === toppings.value.length)
  const some = toRef(() => count.value > 0 && !all.value)

  function onAll (value: boolean | undefined) {
    for (const topping of toppings.value) topping.on = !!value
  }
</script>

<template>
  <div class="quantum-docs-controls">
    <QuCheckbox
      :indeterminate="some"
      label="All toppings"
      :model-value="all"
      @update:model-value="onAll"
    />

    <div class="quantum-docs-indent">
      <QuCheckbox
        v-for="topping in toppings"
        :key="topping.name"
        v-model="topping.on"
        :label="topping.name"
      />
    </div>
  </div>
</template>

<style>
  .quantum-docs-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .quantum-docs-indent {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-inline-start: var(--quantum-spacing-3, 24px);
  }
</style>
