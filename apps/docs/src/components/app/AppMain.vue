<script lang="ts" setup>
  import { useBreakpoints } from '@vuetify/v0'

  const breakpoints = useBreakpoints()
</script>

<template>
  <div
    class="pa-4 mt-[72px] transition-margin duration-200 ease-in-out"
    :class="breakpoints.isMobile ? 'ml-0' : 'ml-[220px]'"
  >
    <div class="max-w-[688px] mx-auto">
      <router-view />
    </div>
  </div>
</template>
