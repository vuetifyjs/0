<script setup lang="ts">
  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  defineOptions({ name: 'DiscoveryTitle' })

  const root = useDiscoveryRootContext('v0:discovery')
</script>

<template>
  <h2 :id="root.titleId">
    <slot />
  </h2>
</template>
