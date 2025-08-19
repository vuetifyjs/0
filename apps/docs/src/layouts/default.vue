<script lang="ts" setup>
  import { shallowRef, computed } from 'vue'

  const current = shallowRef()
  const frontmatter = computed(() => current.value?.frontmatter)

  defineExpose({
    frontmatter,
  })
</script>

<template>
  <AppBanner />
  <AppNav />
  <AppBar />
  <AppMain ref="current" />
  <AppFooter />
</template>
