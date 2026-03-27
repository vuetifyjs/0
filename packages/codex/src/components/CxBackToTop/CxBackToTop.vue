<script lang="ts">
  // Framework
  import {
    IN_BROWSER,
    useDocumentEventListener,
    useWindowEventListener,
  } from '@vuetify/v0'

  // Utilities
  import { shallowRef } from 'vue'

  export interface CxBackToTopProps {
    /** Label text for the button */
    label?: string
    /** Scroll behavior: 'smooth' or 'auto' */
    behavior?: ScrollBehavior
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxBackToTop' })

  const {
    label = 'Back to Top \u2191',
    behavior = 'smooth',
  } = defineProps<CxBackToTopProps>()

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
    class="codex-back-to-top"
    type="button"
    @click="onClick"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
  .codex-back-to-top {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    background: transparent;
    border: none;
    font: inherit;
  }
</style>
