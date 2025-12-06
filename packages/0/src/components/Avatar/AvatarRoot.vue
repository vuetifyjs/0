/**
 * @module AvatarRoot
 *
 * @remarks
 * Root component for avatar display that manages image loading state and fallback logic.
 * Uses selection internally with `mandatory: 'force'` to ensure one item is always visible.
 * Images register with priority values and the highest-priority loaded image is displayed.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SelectionContext, SelectionTicket } from '#v0/composables/useSelection'

  export interface AvatarRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface AvatarTicket extends SelectionTicket {
    type?: 'image' | 'fallback'
    priority?: number
  }

  export interface AvatarContext extends SelectionContext<AvatarTicket> {}

  export const [useAvatarRoot, provideAvatarContext] = createContext<AvatarContext>()
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createSelection } from '#v0/composables/useSelection'

  defineOptions({ name: 'AvatarRoot' })

  const {
    as = 'div',
    renderless,
    namespace = 'v0:avatar',
  } = defineProps<AvatarRootProps>()

  const selection = createSelection<AvatarTicket>({
    mandatory: 'force',
    multiple: false,
  })

  provideAvatarContext(namespace, selection)
</script>

<template>
  <Atom :as :renderless>
    <slot />
  </Atom>
</template>
