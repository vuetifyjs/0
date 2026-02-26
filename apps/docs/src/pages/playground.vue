<script setup lang="ts">
  import { IN_BROWSER } from '#v0/constants/globals'
  import { useHead } from '@unhead/vue'
  import { defineAsyncComponent, shallowRef } from 'vue'

  const isLoaded = shallowRef(false)

  const PlaygroundContent = IN_BROWSER
    ? defineAsyncComponent({
      loader: () => import('@/components/playground/PlaygroundContent.vue'),
      onError: () => {},
    })
    : undefined

  definePage({
    meta: {
      layout: 'playground',
      level: 1,
    },
  })

  useHead({
    title: 'Playground',
    meta: [
      { key: 'description', name: 'description', content: 'Experiment with @vuetify/v0 headless composables and components in an interactive browser-based editor.' },
      { key: 'og:title', property: 'og:title', content: 'Playground' },
      { key: 'og:description', property: 'og:description', content: 'Experiment with @vuetify/v0 headless composables and components in an interactive browser-based editor.' },
    ],
  })
</script>

<template>
  <div class="h-screen flex flex-col bg-surface">
    <!-- SSG/loading skeleton: shown until async component mounts -->
    <template v-if="!PlaygroundContent">
      <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8" />

          <img
            alt="Vuetify Play"
            class="h-7"
            src="https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-dark.svg"
          >
        </div>
      </header>

      <div class="flex-1" />
    </template>

    <!-- Client-only: full playground -->
    <component :is="PlaygroundContent" v-if="PlaygroundContent" />
  </div>
</template>
