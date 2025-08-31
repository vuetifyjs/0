<script lang="ts" setup>
  import { shallowRef, onMounted, onBeforeUnmount, nextTick } from 'vue'

  const show = shallowRef(false)

  function updateOverflow () {
    show.value = document.documentElement.scrollHeight > window.innerHeight + 1
  }

  let resizeObserver: ResizeObserver | undefined

  onMounted(async () => {
    await nextTick()
    updateOverflow()
    window.addEventListener('resize', updateOverflow)
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateOverflow)
      resizeObserver.observe(document.documentElement)
      resizeObserver.observe(document.body)
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateOverflow)
    resizeObserver?.disconnect()
  })

  function scrollToTop () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>

<template>
  <div
    v-if="show"
    class="text-end text-sm text-blue-500 mt-16 underline cursor-pointer"
    @click="scrollToTop"
  >
    <div class="inline-flex align-center gap-1">
      Back to Top

      <AppIcon icon="up" />
    </div>
  </div>
</template>
