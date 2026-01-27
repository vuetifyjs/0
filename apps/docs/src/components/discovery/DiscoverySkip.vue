<script setup lang="ts">
  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { useRouter } from 'vue-router'

  defineOptions({ name: 'DiscoverySkip' })

  const root = useDiscoveryRootContext('v0:discovery')
  const discovery = useDiscovery()
  const router = useRouter()

  function skip () {
    const tour = discovery.tours.selectedItem.value

    if (root.isLast.value) {
      discovery.complete()
      router.push(tour?.completeRoute ?? (tour?.id ? `/skillz/${tour.id}` : '/skillz'))
    } else {
      root.stop()
    }
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
