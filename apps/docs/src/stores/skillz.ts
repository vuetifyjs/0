// Composables
import { useDiscovery } from '@/composables/useDiscovery'

// Utilities
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useSkillzStore = defineStore('skillz', () => {
  const discovery = useDiscovery()
  const router = useRouter()

  function cleanup () {
    //
  }

  async function start (id: string) {
    // Find and load the tour definition
    // const handlerPath = Object.keys(tourHandlers).find(p => p.includes(item.path))
    // if (!handlerPath || !tourHandlers[handlerPath]) return

    // const module = await tourHandlers[handlerPath]()
    // const { steps, handlers } = module.defineTour(composables)

    // discovery.register({
    //   type: 'tour',
    //   id,
    //   steps: [],
    //   handlers: {},
    // }) as DiscoveryTourTicket

    console.log(discovery)
    // await router.push(item.startRoute)
    // discovery.start(id)
  }

  function stop () {
    discovery.stop()
    cleanup()
  }

  function complete () {
    discovery.complete()
    cleanup()
  }

  return {
    start,
    stop,
    complete,
    items: discovery.tours.values(),
  }
})
