<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useRegistrar } from '#v0/composables'

  // Utilities
  import { computed, toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RegistrarContext, RegistrarItem, RegistrarTicket } from '#v0/composables'
  import type { ComputedGetter } from 'vue'

  export interface AvatarRootProps extends AtomProps {}

  export interface AvatarItem extends RegistrarItem {
    type: 'image' | 'fallback'
    priority: number
    status: 'idle' | 'loading' | 'loaded' | 'error'
  }

  interface AvatarTicket extends RegistrarTicket {
    type: AvatarItem['type']
    priority: AvatarItem['priority']
    status: AvatarItem['status']
    isVisible: Readonly<ComputedGetter<boolean>>
  }

  export interface AvatarContext extends RegistrarContext<AvatarTicket, AvatarItem> {
    reset: () => void
  }

  export const [useAvatarContext, provideAvatarContext, registrar] = useRegistrar<AvatarTicket, AvatarContext>('avatar')
</script>

<script setup lang="ts">
  defineOptions({ name: 'AvatarRoot' })

  const { as = 'div', renderless } = defineProps<AvatarRootProps>()

  const imageItems = computed(() => (
    Array.from(registrar.registeredItems.values())
      .filter(item => item.type === 'image')
      .toSorted((a, b) => a.priority - b.priority)
  ))

  const fallbackItems = computed(() => (
    Array.from(registrar.registeredItems.values())
      .filter(item => item.type === 'fallback')
  ))

  const visibleItem = computed(() => {
    const loadedImage = imageItems.value.find(item => item.status === 'loaded')
    if (loadedImage) return loadedImage

    const loadingImage = imageItems.value.find(item => item.status === 'loading')
    if (loadingImage) return loadingImage

    const firstFallback = fallbackItems.value[0]
    if (firstFallback) return firstFallback

    return undefined
  })

  const register: typeof registrar.register = createAvatarItem => {
    const ticket = registrar.register(order => {
      const avatarItem = registrar.intake(order, createAvatarItem)

      return {
        ...avatarItem,
        type: avatarItem?.type ?? 'fallback',
        priority: avatarItem?.priority ?? registrar.registeredItems.size,
        status: avatarItem?.status ?? 'idle',
        isVisible: toRef(() => visibleItem.value?.id === order.id),
      }
    })

    return ticket
  }

  function reset () {
    for (const item of registrar.registeredItems.values()) {
      if (item.type === 'image') {
        item.status = 'idle'
      }
    }
  }

  provideAvatarContext({
    ...registrar,
    register,
    reset,
  })
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
