import { createStorage, useWindowEventListener } from '@vuetify/v0'
import { IN_BROWSER } from '@vuetify/v0/constants'
import { useRouter } from 'vue-router'

interface ScrollPosition {
  left: number
  top: number
}

export function useScrollPersist () {
  if (!IN_BROWSER) return

  const router = useRouter()

  const storage = createStorage({
    adapter: window.sessionStorage,
    prefix: 'scroll:',
  })

  function getScrollKey () {
    return history.state?.key ?? router.currentRoute.value.fullPath
  }

  useWindowEventListener('beforeunload', () => {
    console.log('here')
    const key = getScrollKey()
    if (key) {
      storage.set<ScrollPosition>(key, {
        left: window.scrollX,
        top: window.scrollY,
      })
    }
  })

  // Restore after hydration
  router.isReady().then(() => {
    const key = getScrollKey()
    const pos = storage.get<ScrollPosition | null>(key, null)
    if (pos.value) {
      window.scrollTo(pos.value.left, pos.value.top)
    }
  })
}
