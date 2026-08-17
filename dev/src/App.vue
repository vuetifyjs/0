<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Utilities
  import { computed, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const TITLE = 'Emerald'
  const DESCRIPTION = 'Emerald is a complete design system built on Vuetify0 — Figma-derived tokens, an icon set addressed by role, and Em* components that compose v0\'s headless compounds.'
  const IMAGE = 'https://cdn.vuetifyjs.com/docs/images/one/logos/emerald.png'

  const route = useRoute()
  /** Same gate as `main.ts` — the demo deploy (`BASE_URL=/demo/emerald/`) is Emerald. */
  const demo = import.meta.env.BASE_URL.includes('/demo/')
  const emerald = computed(() => demo || route.path === '/emerald' || route.path.startsWith('/emerald/'))

  /** Full-bleed product shells (no playground chrome padding); the demo deploy is always bare. */
  const bare = computed(() => demo || route.path === '/emerald' || route.path.startsWith('/emerald/'))

  useHead({
    title: toRef(() => emerald.value ? TITLE : 'Vuetify0'),
    meta: toRef(() => {
      if (!emerald.value) return []

      return [
        { key: 'description', name: 'description', content: DESCRIPTION },
        { key: 'og:title', property: 'og:title', content: TITLE },
        { key: 'og:description', property: 'og:description', content: DESCRIPTION },
        { key: 'og:image', property: 'og:image', content: IMAGE },
        { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
        { key: 'twitter:site', name: 'twitter:site', content: '@VuetifyJS' },
      ]
    }),
  })

</script>

<template>
  <RouterView v-if="demo" />

  <div
    v-else
    class="min-h-screen bg-background text-on-background"
    :class="bare ? undefined : 'p-4'"
  >
    <RouterView />
  </div>
</template>
