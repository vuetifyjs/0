// Composables
import { useDiscovery } from '@/composables/useDiscovery'

// Utilities
import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useSkillzStore = defineStore('skillz', () => {
  const discovery = useDiscovery()

  function cleanup () {
    //
  }

  async function start (_id: string) {
    console.log(discovery)
  }

  function stop () {
    discovery.stop()
    cleanup()
  }

  function complete () {
    discovery.complete()
    cleanup()
  }

  const items = computed(() => discovery.tours.values())

  return {
    start,
    stop,
    complete,
    items,
  }
})
