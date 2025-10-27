<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createRegistryContext } from '#v0/composables'

  // Utilities
  import { computed, toRef } from 'vue'
  import { genId } from '#v0/utilities'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RegistryContext, RegistryTicket } from '#v0/composables'
  import type { ComputedGetter } from 'vue'

  export interface AvatarRootProps extends AtomProps {}

  interface AvatarTicket extends RegistryTicket {
    type: 'image' | 'fallback'
    priority: number
    status: 'idle' | 'loading' | 'loaded' | 'error'
    isVisible: Readonly<ComputedGetter<boolean>>
  }

  export interface AvatarContext extends RegistryContext<AvatarTicket> {
    reset: () => void
  }

  export const [useAvatarContext, provideAvatarContext, registry] = createRegistryContext<AvatarTicket, AvatarContext>({ namespace: 'avatar' })
</script>

<script setup lang="ts">
  defineOptions({ name: 'AvatarRoot' })

  const { as = 'div', renderless } = defineProps<AvatarRootProps>()

  const imageItems = computed(() => (
    Array.from(registry.collection.values())
      .filter(item => item.type === 'image')
      .toSorted((a, b) => a.priority - b.priority)
  ))

  const fallbackItems = computed(() => (
    Array.from(registry.collection.values())
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

  function register (registration: Partial<AvatarTicket> = {}): AvatarTicket {
    const id = registration.id ?? genId()
    const item: Partial<AvatarTicket> = {
      ...registration,
      id,
      type: registration.type ?? 'fallback',
      priority: registration.priority ?? registry.collection.size,
      status: registration.status ?? 'idle',
      isVisible: toRef(() => visibleItem.value?.id === id),
    }

    const ticket = registry.register(item) as AvatarTicket

    return ticket
  }

  function reset () {
    for (const item of registry.collection.values()) {
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
