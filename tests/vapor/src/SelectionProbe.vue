<script setup vapor lang="ts">
  import { createSelection } from '#v0/composables'

  // A representative registry-backed composable: exercises ticket registration,
  // reactive ticket state (isSelected), and a computed Set derivation — all
  // under Vapor's fine-grained reactivity.
  const selection = createSelection()
  const alpha = selection.register({ value: 'alpha' })
  selection.register({ value: 'beta' })

  function toggle () {
    alpha.toggle()
  }
</script>

<template>
  <div>
    <button data-toggle type="button" @click="toggle">toggle</button>
    <span data-alpha-selected>{{ String(alpha.isSelected.value) }}</span>
    <span data-selected-count>{{ selection.selectedValues.value.size }}</span>
  </div>
</template>
