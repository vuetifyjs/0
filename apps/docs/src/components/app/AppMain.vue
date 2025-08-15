<script lang="ts" setup>
  import { useBreakpoints, useLayout } from '@vuetify/v0'

  const breakpoints = useBreakpoints()
  const layout = useLayout()
</script>

<template>
  <div
    :class="[
      breakpoints.isMobile ? 'ml-0' : 'ml-[220px]',
      `pa-4 transition-margin duration-200 ease-in-out`
    ]"
    :style="`margin-top: ${layout.main.y.value}px`"
  >
    <router-view />
  </div>
</template>
