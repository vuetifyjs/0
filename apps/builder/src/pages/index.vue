<script setup lang="ts">
  import { mdiPuzzle } from '@mdi/js'

  // Utilities
  import { useRouter } from 'vue-router'

  const router = useRouter()

  function onStart () {
    router.push('/wizard')
  }
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-32">
    <h1 class="text-4xl md:text-5xl font-bold mb-3">
      v0 <span class="text-primary">Framework</span> Builder
    </h1>

    <p class="text-on-surface-variant text-lg mb-2">
      Configure the plugins your Vue app needs.
    </p>

    <p class="text-sm text-on-surface-variant/70 mb-12">
      Plugins are the pieces that get installed via app.use() at startup — theming, i18n,
      storage, hydration, feature flags. Everything else (selection, forms, data) is
      imported on-demand and doesn't need configuration here.
    </p>

    <button
      class="px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
      @click="onStart"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24">
        <path :d="mdiPuzzle" fill="currentColor" />
      </svg>
      Start configuring
    </button>
  </div>
</template>
