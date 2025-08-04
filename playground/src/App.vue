<script lang="ts" setup>
  import { useLayout } from '@vuetify/0'

  const layout = useLayout()

  layout.register({
    id: 'app-bar',
    position: 'top',
    value: 64,
  })

  layout.register({
    id: 'nav-drawer',
    position: 'left',
    value: 200,
  })

  setTimeout(() => {
    layout.unregister('nav-drawer')
  }, 2000)

  layout.on('unregister', item => {
    console.log('unregistered', item)
  })

  // bar.toggle()
  // drawer.toggle()
</script>

<template>
  <div
    class="absolute pa-4 bg-gray"
    :style="{
      top: `${layout.bounds.top.value}px`,
      right: `${layout.bounds.right.value}px`,
      bottom: `${layout.bounds.bottom.value}px`,
      left: `${layout.bounds.left.value}px`,
    }"
  >
    {{ layout.bounds }}
  </div>
  <!-- <Playground /> -->
</template>
