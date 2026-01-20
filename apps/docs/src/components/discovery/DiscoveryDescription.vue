<script setup lang="ts">
  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  defineOptions({ name: 'DiscoveryDescription' })

  const root = useDiscoveryRootContext('v0:discovery')
</script>

<template>
  <p :id="root.descriptionId">
    <slot />
  </p>
</template>
