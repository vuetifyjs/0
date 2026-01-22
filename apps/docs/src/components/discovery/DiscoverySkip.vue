<script setup lang="ts">
  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  defineOptions({ name: 'DiscoverySkip' })

  const root = useDiscoveryRootContext('v0:discovery')

  function skip () {
    root.stop()
  }
</script>

<template>
  <button
    aria-label="Skip tour"
    type="button"
    @click="skip"
  >
    <slot />
  </button>
</template>
