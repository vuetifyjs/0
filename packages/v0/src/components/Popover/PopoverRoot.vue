<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useContext } from '#v0/composables/useContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import { toRef, useId, type ShallowRef } from 'vue'

  export interface PopoverContext {
    isActive: ShallowRef<boolean>
    id: string
    toggle: () => void
  }

  export interface PopoverRootProps extends AtomProps {
    id?: string
  }

  export const [usePopoverContext, providePopoverContext] = useContext<PopoverContext>('Popover')
</script>

<script lang="ts" setup>
  defineOptions({ name: 'PopoverRoot' })

  const { as = null, ...props } = defineProps<PopoverRootProps>()

  const isActive = defineModel<boolean>({ default: false })

  const id = toRef(() => props.id ?? useId())

  function toggle () {
    isActive.value = !isActive.value
  }

  providePopoverContext({
    isActive,
    toggle,
    id: id.value,
  })
</script>

<template>
  <Atom
    :as
    :props="{ isActive, toggle, id }"
    :renderless="renderless || as == null"
  >
    <slot />
  </Atom>
</template>
