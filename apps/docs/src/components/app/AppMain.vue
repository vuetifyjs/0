<script lang="ts" setup>
  import { useLayout } from '@vuetify/v0'

  const layout = useLayout()

</script>

<template>
  <div
    class="pa-4 fixed inset-0 overflow-y-auto "
    :style="{
      top: layout.main.y.value + 'px',
      width: layout.main.width.value + 'px',
      left: layout.main.x.value + 'px',
    }"
  >
    <div class="max-w-[688px] mx-auto pb-4 ">
      <router-view />

      <DocsBackmatter />
    </div>
  </div>
</template>
