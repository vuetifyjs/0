/**
 * @module MenuSub
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * Names one nested menu owned by the root. Place it inside Menu.Content.
 * Do not nest another Menu.Root.
 *
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { useId } from '#v0/utilities'

  // Types
  import type { ID } from '#v0/types'

  export interface MenuSubContext {
    id: ID
  }

  const [useMenuSub, provideMenuSub] = createContext<MenuSubContext>('v0:menu:sub')

  export { useMenuSub }

  export interface MenuSubProps {
    /** Layer id for this submenu. Auto-generated when omitted. */
    value?: ID
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'MenuSub' })

  const { value } = defineProps<MenuSubProps>()

  const id = value ?? useId()

  provideMenuSub({ id })
</script>

<template>
  <slot />
</template>
