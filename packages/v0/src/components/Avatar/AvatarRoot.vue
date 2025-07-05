<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useRegistrar, useContext } from '#v0/composables'

  // Utilities
  import { computed, toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RegistrarItem, RegistrarTicket } from '#v0/composables'
  import type { ComputedGetter, Reactive } from 'vue'
  import type { ID } from '#v0/types'

  export interface AvatarRootProps extends AtomProps {}

  export interface AvatarImage extends RegistrarItem {
    type: 'image'
    priority: number
    status: 'idle' | 'loading' | 'loaded' | 'error'
  }

  export interface AvatarFallback extends RegistrarItem {
    type: 'fallback'
  }

  interface AvatarImageTicket extends Required<AvatarImage>, RegistrarTicket {
    isVisible: Readonly<ComputedGetter<boolean>>
  }

  interface AvatarFallbackTicket extends Required<AvatarFallback>, RegistrarTicket {
    isVisible: Readonly<ComputedGetter<boolean>>
  }

  type AvatarItem = AvatarImage | AvatarFallback
  type AvatarTicket = AvatarImageTicket | AvatarFallbackTicket

  type AvatarContext = {
    unregister: (id: ID) => void
    register:
      & ((item: AvatarImage) => Reactive<NoInfer<AvatarImageTicket>>)
      & ((item: AvatarFallback) => Reactive<NoInfer<AvatarFallbackTicket>>)
    reset: () => void
  }

  export const [useAvatarContext, provideAvatarContext] = useContext<AvatarContext>('avatar')
</script>

<script setup lang="ts">
  defineOptions({ name: 'AvatarRoot' })

  const { as = 'div', renderless } = defineProps<AvatarRootProps>()

  const registrar = useRegistrar<AvatarTicket>()

  const imageItems = computed(() => (
    Array.from(registrar.definedItems.value.values())
      .filter(item => item.type === 'image')
      .toSorted((a, b) => a.priority - b.priority)
  ))

  const fallbackItems = computed(() => (
    Array.from(registrar.definedItems.value.values())
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

  function register (item: AvatarImage): Reactive<AvatarImageTicket>
  function register (item: AvatarFallback): Reactive<AvatarFallbackTicket>
  function register (item: AvatarItem) {
    const order = registrar.register(item)

    const ticket = order.define(data => {
      if (item?.type === 'image') {
        return {
          ...data,
          type: 'image',
          isVisible: toRef(() => visibleItem.value?.id === ticket.id),
          priority: item.priority ?? registrar.registeredItems.size,
          status: item.status ?? 'idle',
        }
      }

      return {
        ...data,
        type: 'fallback',
        isVisible: toRef(() => visibleItem.value?.id === ticket.id),
      }
    })

    return ticket
  }

  function reset () {
    for (const item of registrar.definedItems.value.values()) {
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
