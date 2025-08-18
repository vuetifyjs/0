<script lang="ts" setup>
  import { useBreakpoints } from '@vuetify/v0'

  const breakpoints = useBreakpoints()
</script>

<template>
  <div
    class="pa-4 mt-[72px] transition-margin duration-200 ease-in-out"
    :class="breakpoints.isMobile ? 'ml-0' : 'ml-[220px]'"
    style="min-height: calc(100vh - 96px)"
  >
    <router-view />
  </div>
</template>
