<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createRegistryContext } from '#v0/composables'

  // Utilities
  import { computed, toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RegistryContext, RegistryItem, RegistryTicket } from '#v0/composables'
  import type { ComputedGetter } from 'vue'

  export interface AvatarRootProps extends AtomProps {}

  export interface AvatarItem extends RegistryItem {
    type: 'image' | 'fallback'
    priority: number
    status: 'idle' | 'loading' | 'loaded' | 'error'
  }

  interface AvatarTicket extends RegistryTicket {
    type: AvatarItem['type']
    priority: AvatarItem['priority']
    status: AvatarItem['status']
    isVisible: Readonly<ComputedGetter<boolean>>
  }

  export interface AvatarContext extends RegistryContext<AvatarTicket, AvatarItem> {
    reset: () => void
  }

  export const [useAvatarContext, provideAvatarContext, registry] = createRegistryContext<AvatarTicket, AvatarContext>('avatar')
</script>

<script setup lang="ts">
  defineOptions({ name: 'AvatarRoot' })

  const { as = 'div', renderless } = defineProps<AvatarRootProps>()

  const imageItems = computed(() => (
    Array.from(registry.registeredItems.values())
      .filter(item => item.type === 'image')
      .toSorted((a, b) => a.priority - b.priority)
  ))

  const fallbackItems = computed(() => (
    Array.from(registry.registeredItems.values())
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

  const register: typeof registry.register = createAvatarItem => {
    const ticket = registry.register(order => {
      const avatarItem = registry.intake(order, createAvatarItem)

      return {
        ...avatarItem,
        type: avatarItem?.type ?? 'fallback',
        priority: avatarItem?.priority ?? registry.registeredItems.size,
        status: avatarItem?.status ?? 'idle',
        isVisible: toRef(() => visibleItem.value?.id === order.id),
      }
    })

    return ticket
  }

  function reset () {
    for (const item of registry.registeredItems.values()) {
      if (item.type === 'image') {
        item.status = 'idle'
      }
    }
  }

  provideAvatarContext({
    ...registry,
    register,
    reset,
  })
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
