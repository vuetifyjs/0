<script lang="ts">
  // Components
  import { Atom } from '@/lib/components/Atom'

  // Composables
  import { useContext } from '@/lib/composables/useContext'

  // Types
  import type { AtomProps } from '@/lib/components/Atom'
  import type { ShallowRef } from 'vue'

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

  const { renderless = true, ...props } = defineProps<PopoverRootProps>()

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
    :props="{ isActive, toggle }"
    :renderless
  >
    <slot />
  </Atom>
</template>
