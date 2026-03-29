<script lang="ts">
  // Framework
  import {
    IN_BROWSER,
    useDocumentEventListener,
    useWindowEventListener,
  } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'

  export interface HxBackToTopProps {
    /** Label text for the button */
    label?: string
    /** Scroll behavior: 'smooth' or 'auto' */
    behavior?: ScrollBehavior
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxBackToTop' })

  const {
    label = 'Back to Top \u2191',
    behavior = 'smooth',
  } = defineProps<HxBackToTopProps>()

  const visible = shallowRef(false)

  function update () {
    if (!IN_BROWSER) return
    visible.value = window.scrollY > 200
  }

  useWindowEventListener('resize', update)
  useDocumentEventListener('scroll', update)

  function onClick () {
    if (!IN_BROWSER) return
    window.scrollTo({ top: 0, behavior })
  }
</script>

<template>
  <button
    v-if="visible"
    :aria-label="label"
    class="helix-back-to-top"
    type="button"
    @click="onClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
  .helix-back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
    background-color: var(--v0-primary);
    color: var(--v0-on-primary);
    border: none;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
    font: inherit;
    font-size: 1.125rem;
    transition: opacity 150ms ease;
    z-index: 100;
  }

  .helix-back-to-top:hover {
    opacity: 0.85;
  }

  .helix-back-to-top:focus-visible {
    outline: 2px solid var(--v0-primary);
    outline-offset: 2px;
  }
</style>
