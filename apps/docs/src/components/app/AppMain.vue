<script lang="ts" setup>
  import DocsToc from '../docs/DocsToc.vue'
</script>

<template>
  <main class="pa-4 pb-6 ml-0 md:ml-[230px] xl:pr-[232px] relative z-0">
    <div class="max-w-[688px] mx-auto pb-4">
      <router-view />

      <DocsBackmatter />
    </div>

    <DocsToc />
  </main>
</template>
