import { useContext } from '../useContext'

import { computed, reactive, toRef, type ComputedRef, type Reactive, type Ref } from 'vue'

export interface AvatarItem {
  id: string | number
  type: 'image' | 'fallback'
  priority: number
  status: 'idle' | 'loading' | 'loaded' | 'error'
}

export interface AvatarTicket {
  id: AvatarItem['id']
  isVisible: Ref<boolean>
  status: Ref<AvatarItem['status']>
  setStatus: (status: AvatarItem['status']) => void
}

export interface AvatarContext {
  register: (item?: Partial<AvatarItem>) => AvatarTicket
  unregister: (id: AvatarItem['id']) => void
  reset: () => void
}

export interface AvatarState {
  registeredItems: Reactive<Map<AvatarItem['id'], AvatarItem>>
  visibleItem: ComputedRef<AvatarItem | undefined>
  hasImages: ComputedRef<boolean>
  hasLoadedImage: ComputedRef<boolean>
}

export function useAvatar<T extends AvatarContext = AvatarContext> (
  namespace = 'Avatar',
) {
  const [useAvatarContext, provideAvatarContext] = useContext<T>(namespace)

  const registeredItems = reactive(new Map<AvatarItem['id'], AvatarItem>())

  const imageItems = computed(() => {
    return Array.from(registeredItems.values())
      .filter(item => item.type === 'image')
      .toSorted((a, b) => a.priority - b.priority)
  })

  const fallbackItems = computed(() => {
    return Array.from(registeredItems.values())
      .filter(item => item.type === 'fallback')
  })

  const hasImages = computed(() => imageItems.value.length > 0)

  const hasLoadedImage = computed(() => {
    return imageItems.value.some(item => item.status === 'loaded')
  })

  const visibleItem = computed(() => {
    const loadedImage = imageItems.value.find(item => item.status === 'loaded')
    if (loadedImage) return loadedImage

    const loadingImage = imageItems.value.find(item => item.status === 'loading')
    if (loadingImage) return loadingImage

    const firstFallback = fallbackItems.value[0]
    if (firstFallback) return firstFallback

    return undefined
  })

  function register (item?: Partial<AvatarItem>): AvatarTicket {
    const registrant: AvatarItem = reactive({
      id: item?.id ?? crypto.randomUUID(),
      type: item?.type ?? 'fallback',
      priority: item?.priority ?? registeredItems.size,
      status: item?.status ?? 'idle',
    })

    registeredItems.set(registrant.id, registrant)

    return {
      id: registrant.id,
      isVisible: toRef(() => visibleItem.value?.id === registrant.id),
      status: toRef(() => registrant.status),
      setStatus: (status: AvatarItem['status']) => {
        registrant.status = status
      },
    }
  }

  function unregister (id: AvatarItem['id']) {
    registeredItems.delete(id)
  }

  function reset () {
    for (const item of registeredItems.values()) {
      if (item.type === 'image') {
        item.status = 'idle'
      }
    }
  }

  return [
    useAvatarContext,
    function (context?: Omit<T, keyof AvatarContext>) {
      const avatar = {
        register,
        unregister,
        reset,
        ...context,
      } as T

      provideAvatarContext(avatar)

      return avatar
    },
    {
      registeredItems,
      visibleItem,
      hasImages,
      hasLoadedImage,
    } as AvatarState,
  ] as const
}
