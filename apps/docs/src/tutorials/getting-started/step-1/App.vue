<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  const count = shallowRef(0)
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <h1 class="text-2xl font-bold mb-4">
      Hello, v0!
    </h1>

    <p class="text-on-surface-variant mb-6">
      This is your first v0 component. Try editing this text!
    </p>

    <div class="flex items-center gap-4">
      <button
        class="px-4 py-2 rounded bg-primary text-on-primary font-medium"
        @click="count++"
      >
        Count: {{ count }}
      </button>
    </div>
  </div>
</template>
