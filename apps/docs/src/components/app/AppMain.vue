<script lang="ts" setup>
  import { useBreakpoints } from '@vuetify/0'

  const breakpoints = useBreakpoints()
</script>

<template>
  <div
    class="pa-4 mt-[48px] transition-margin duration-200 ease-in-out"
    :class="breakpoints.isMobile ? 'ml-0' : 'ml-[220px]'"
  >
    <router-view />
  </div>
</template>
