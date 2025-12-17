<script lang="ts" setup>
  import { useResizeObserver, useWindowEventListener } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const show = shallowRef(false)

  function updateOverflow () {
    show.value = document.documentElement.scrollHeight > window.innerHeight + 1
  }

  useWindowEventListener('resize', updateOverflow)
  useResizeObserver(toRef(() => document.documentElement), updateOverflow)
  useResizeObserver(toRef(() => document.body), updateOverflow)

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
