<script lang="ts" setup>
  import { useLayout } from '@vuetify/v0'

  const layout = useLayout()

</script>

<template>
  <div
    class="pa-4 fixed"
    :style="{
      top: layout.main.y.value + 'px',
      width: layout.main.width.value + 'px',
      left: layout.main.x.value + 'px',
    }"
  >
    <div class="max-w-[688px] mx-auto pb-4">
      <router-view />

      <DocsBackToTop />

      <hr class="my-4">

      <DocsBackmatter />
    </div>
  </div>
</template>
