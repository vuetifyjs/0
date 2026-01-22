<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    frontmatter?: Record<string, unknown>
  }>()

  const features = toRef(() => props.frontmatter?.features as Record<string, unknown> | undefined)
  const hideNavigator = toRef(() => features.value?.hideNavigator === true)
  const hideFeedback = toRef(() => features.value?.hideFeedback === true)
</script>

<template>
  <section id="backmatter">
    <DocsBenchmarks />

    <DocsRelated :frontmatter="frontmatter" />

    <DocsFeedback v-if="!hideFeedback" :frontmatter="frontmatter" />

    <DocsBackToTop />

    <DocsNavigator v-if="!hideNavigator" />
  </section>
</template>
