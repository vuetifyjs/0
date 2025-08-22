<script lang="ts" setup>
  import { useLayout } from '@vuetify/v0'

  const layout = useLayout()

</script>

<template>
  <div
    class="pa-4 fixed transition-all duration-100 ease-in-out"
    :style="{
      top: layout.main.y.value + 'px',
      width: layout.main.width.value + 'px',
      left: layout.main.x.value + 'px',
    }"
  >
    <router-view />
  </div>
</template>
