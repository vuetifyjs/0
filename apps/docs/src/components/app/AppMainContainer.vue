<script lang="ts" setup>
  import { useTemplateRef } from 'vue'
  import { useBreakpoints, createLayout, useLayout, provideLayout } from '@vuetify/v0'

  const breakpoints = useBreakpoints()

  const layout = useLayout()
  const mainContainer = useTemplateRef('mainContainer')
  const mainLayout = createLayout({ el: mainContainer })
  provideLayout(mainLayout)
</script>

<template>
  <div
    ref="mainContainer"
    class="pa-4 fixed transition-all duration-100 ease-in-out"
    :style="{
      top: layout.main.y.value + 'px',
      width: layout.main.width.value + 'px',
      left: breakpoints.isMobile ? '0px' : layout.main.x.value + 'px',
    }"
  >
    <AppMain />
  </div>
</template>
