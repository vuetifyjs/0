<script lang="ts" setup>
  import { IN_BROWSER, useDocumentEventListener, useWindowEventListener } from '@vuetify/v0'
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
  <a
    v-if="show"
    class="inline-flex items-center ms-auto text-sm text-primary mt-16 hover:underline cursor-pointer"
    href="#"
    @click.prevent="scrollToTop"
  >
    Back to Top ↑
  </a>
</template>
