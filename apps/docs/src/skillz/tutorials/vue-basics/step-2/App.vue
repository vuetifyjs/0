<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  const name = shallowRef('Alex Chen')
  const role = shallowRef('Frontend Developer')
  const email = shallowRef('alex.chen@email.com')
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <div class="max-w-sm rounded-lg border border-solid border-divider bg-surface p-6">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
          AC
        </div>

        <div>
          <h2 class="text-lg font-bold text-on-surface">{{ name }}</h2>
          <p class="text-sm text-on-surface-variant">{{ role }}</p>
        </div>
      </div>

      <p class="text-sm text-on-surface-variant">
        {{ email }}
      </p>
    </div>
  </div>
</template>
