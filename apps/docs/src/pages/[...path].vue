<script lang="ts" setup>
  import { useRoute } from 'vue-router'

  const route = useRoute()
</script>

<template>
  <section class="flex-1 flex flex-col items-center justify-center text-center py-16 md:py-24">
    <div class="text-8xl md:text-9xl font-bold opacity-10 mb-4">
      404
    </div>

    <h1 class="text-3xl md:text-4xl font-bold mb-4">
      Page not found
    </h1>

    <p class="text-lg opacity-60 max-w-[480px] mx-auto mb-8 leading-relaxed">
      The page <code class="bg-surface-tint px-2 py-1 rounded text-sm">{{ route.path }}</code> doesn't exist or has been moved.
    </p>

    <div class="flex gap-4 justify-center">
      <router-link
        class="px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
        to="/"
      >
        Go Home
      </router-link>

      <router-link
        class="px-6 py-3 bg-surface text-on-surface rounded-lg font-semibold hover:bg-surface-tint transition-colors border"
        to="/components"
      >
        Browse Components
      </router-link>
    </div>
  </section>
</template>

<route lang="yaml">
meta:
  layout: fullscreen
</route>
