<script setup lang="ts">
  // Framework
  import { IN_BROWSER, useDocumentEventListener, useWindowEventListener } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'

  const show = shallowRef(false)

  function updateOverflow () {
    if (!IN_BROWSER) return
    show.value = document.documentElement.scrollHeight > window.innerHeight + 1
  }

  useWindowEventListener('resize', updateOverflow)
  useDocumentEventListener('scroll', updateOverflow)

  function scrollToTop () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>

<template>
  <button
    v-if="show"
    class="inline-flex items-center ms-auto text-sm text-primary mt-16 hover:underline cursor-pointer bg-transparent border-none font-inherit"
    type="button"
    @click="scrollToTop"
  >
    Back to Top ↑
  </button>
</template>
