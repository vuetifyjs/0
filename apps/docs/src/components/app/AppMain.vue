<script lang="ts" setup>
  import { useBreakpoints } from '@vuetify/v0'

  const breakpoints = useBreakpoints()

  function scrollToTop () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>

<template>
  <div
    class="pa-4 pb-6 mt-[72px] transition-margin duration-200 ease-in-out"
    :class="breakpoints.isMobile ? 'ml-0' : 'ml-[220px]'"
  >
    <div class="max-w-[688px] mx-auto pb-4">
      <router-view />

      <div
        class="text-end text-sm text-blue-500 mt-16 underline cursor-pointer"
        @click="scrollToTop"
      >
        <div class="inline-flex align-center gap-1">
          Back to Top

          <AppIcon icon="up" />
        </div>
      </div>

      <hr class="my-4">

      <DocsBackmatter />
    </div>
  </div>
</template>
