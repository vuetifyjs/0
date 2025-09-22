<script lang="ts" setup>
  import { useBreakpoints } from '@vuetify/v0'

  const breakpoints = useBreakpoints()
</script>

<template>
  <main
    :xclass="breakpoints.isMobile ? 'ml-0' : 'ml-[220px]'"
    xxclass="pa-4 pb-6 mt-[72px] transition-margin duration-200 ease-in-out"
  >
    <div class="max-w-[688px] mx-auto pb-4">
      <router-view />

      <DocsBackmatter />
    </div>
  </main>
</template>
