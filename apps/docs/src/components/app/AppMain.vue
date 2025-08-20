<script lang="ts" setup>
  import { useBreakpoints, useLayout } from '@vuetify/v0'

  const breakpoints = useBreakpoints()
  const layout = useLayout()

</script>

<template>
  <AppBar />
  <div
    class="pa-4 fixed transition-all duration-100 ease-in-out"
    :style="{
      top: layout.main.y.value + 'px',
      width: layout.main.width.value + 'px',
      left: breakpoints.isMobile ? '0px' : layout.main.x.value + 'px',
    }"
  >
    <router-view />
  </div>
</template>
