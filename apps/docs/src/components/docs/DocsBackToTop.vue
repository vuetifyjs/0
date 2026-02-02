<script setup lang="ts">
  // Framework
  import { IN_BROWSER, useDocumentEventListener, useWindowEventListener } from '@vuetify/v0'

  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { shallowRef } from 'vue'

  const settings = useSettings()
  const show = shallowRef(false)

  function updateOverflow () {
    if (!IN_BROWSER) return
    show.value = document.documentElement.scrollHeight > window.innerHeight + 1
  }

  useWindowEventListener('resize', updateOverflow)
  useDocumentEventListener('scroll', updateOverflow)

  function scrollToTop () {
    if (!IN_BROWSER) return
    window.scrollTo({ top: 0, behavior: settings.prefersReducedMotion.value ? 'auto' : 'smooth' })
  }
</script>

<template>
  <button
    v-if="show"
    class="inline-flex items-center ms-auto text-sm text-primary mt-16 hover:underline focus-visible:underline cursor-pointer bg-transparent border-none font-inherit"
    type="button"
    @click="scrollToTop"
  >
    Back to Top ↑
  </button>
</template>
