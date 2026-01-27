<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const props = defineProps<{
    frontmatter?: {
      logo?: string
    }
  }>()

  const toggle = useThemeToggle()

  const logo = toRef(() => props.frontmatter?.logo)
  const src = toRef(() => {
    if (!logo.value) return null
    const variant = toggle.isDark.value ? 'dark' : 'light'
    return `https://cdn.vuetifyjs.com/docs/images/one/logos/${logo.value}-logo-${variant}.svg`
  })
</script>

<template>
  <div v-if="src" class="flex justify-center mt-4 mb-8 docs-page-logo">
    <img alt="" aria-hidden="true" class="h-24" :src="src">
  </div>
</template>

<style>
  /* sr-only for first h1 */
  .docs-page-logo ~ .markdown-body > h1:first-of-type {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>
