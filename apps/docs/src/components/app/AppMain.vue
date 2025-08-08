<script lang="ts" setup>
  import { computed } from 'vue'
  import { useBreakpoints, useLayout } from '@vuetify/v0'

  const breakpoints = useBreakpoints()
  const layout = useLayout()
  debugger
  const marginTop = computed(() => layout.main.y.value)
</script>

<template>
  <div
    :class="[
      breakpoints.isMobile ? 'ml-0' : 'ml-[220px]',
      `pa-4 transition-margin duration-200 ease-in-out`
    ]"
    :style="`margin-top: ${marginTop}px`"
  >
    <router-view />
  </div>
</template>
