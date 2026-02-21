<script setup>
  // Utilities
  import { ref, watch } from 'vue'

  const model = defineModel({ default: '' })

  const internal = ref(model.value)
  let timeout = null

  watch(internal, val => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      model.value = val
    }, 300)
  })

  watch(model, val => {
    if (val !== internal.value) {
      internal.value = val
    }
  })
</script>

<template>
  <input
    v-model="internal"
    class="w-full px-3 py-2 rounded border border-solid border-divider bg-surface text-on-surface"
    placeholder="Search..."
  >
</template>
