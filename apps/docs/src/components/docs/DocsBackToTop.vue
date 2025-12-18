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
  <button
    v-if="show"
    class="block ms-auto text-sm text-primary mt-16 underline cursor-pointer bg-transparent border-0"
    type="button"
    @click="scrollToTop"
  >
    <span class="inline-flex align-center">
      Back to Top

      <AppIcon icon="up" />
    </span>
  </button>
</template>
