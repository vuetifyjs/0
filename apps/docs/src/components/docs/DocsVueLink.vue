<script setup lang="ts">
  // Framework
/**
   * Handles click events on Vue documentation links in code blocks and inline code.
   *
   * Uses event delegation - listens globally for clicks on [data-vue-href] elements
   * and opens the Vue documentation URL in a new tab.
   */
  import { useDocumentEventListener } from '@vuetify/v0'

  function onClick (e: MouseEvent) {
    const target = e.target
    if (!(target instanceof Element)) return

    const vueLink = target.closest('[data-vue-href]') as HTMLElement | null
    if (!vueLink) return

    const href = vueLink.dataset.vueHref
    if (!href) return

    // Validate URL protocol
    try {
      const url = new URL(href)
      if (!['https:', 'http:'].includes(url.protocol)) return
    } catch {
      return
    }

    e.preventDefault()
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  useDocumentEventListener('click', onClick)
</script>

<template>
  <span />
</template>

<style>
/* Global styles for Vue documentation links */
[data-vue-href] {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 2px;
  text-decoration-color: currentColor;
  text-decoration-thickness: 1px;
  opacity: 0.85;
}

[data-vue-href]:hover {
  opacity: 1;
}
</style>
