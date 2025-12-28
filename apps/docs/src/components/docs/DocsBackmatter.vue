<script lang="ts" setup>
  defineProps<{
    frontmatter?: Record<string, unknown>
  }>()
</script>

<template>
  <section id="backmatter">
    <DocsBenchmarks />

    <DocsRelated :frontmatter="frontmatter" />

    <DocsBackToTop />

    <DocsNavigator />
  </section>
</template>
