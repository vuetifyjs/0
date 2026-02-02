<script setup lang="ts">
  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { useRouter } from 'vue-router'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'

  defineOptions({ name: 'DiscoverySkip' })

  const root = useDiscoveryRootContext('v0:discovery')
  const discovery = useDiscovery()
  const skillz = useSkillzStore()
  const router = useRouter()

  function skip () {
    const tour = discovery.tours.selectedItem.value
    const returnRoute = tour?.id ? `/skillz/${tour.id}` : '/skillz'

    if (root.isLast.value) {
      skillz.complete()
      router.push(tour?.completeRoute ?? returnRoute)
    } else {
      skillz.stop()
      router.push(returnRoute)
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
