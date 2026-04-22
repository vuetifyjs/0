<script setup lang="ts">
  import { IN_BROWSER } from '#v0/constants/globals'
  import { useHead } from '@unhead/vue'

  const target = import.meta.env.VITE_PLAYGROUND_URL ?? 'https://v0play.vuetifyjs.com'
  const redirect = `${target}/${IN_BROWSER ? window.location.hash : ''}`

  definePage({
    meta: {
      layout: 'default',
      level: 1,
    },
  })

  useHead({
    title: 'Redirecting to Vuetify Play...',
    meta: [
      { key: 'robots', name: 'robots', content: 'noindex' },
      { 'http-equiv': 'refresh', 'content': `0; url=${redirect}` },
    ],
  })

  if (IN_BROWSER) {
    window.location.replace(redirect)
  }
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p class="text-on-surface-variant">
      Redirecting to <a class="text-primary underline" :href="redirect">Vuetify Play</a>...
    </p>
  </div>
</template>
