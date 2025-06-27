<script lang="ts">
  // Components
  import { Atom } from '@/lib/components/Atom'

  // Types
  import { usePopoverContext } from './PopoverRoot.vue'
  import type { AtomProps } from '@/lib/components/Atom'

  export interface PopoverContentProps extends AtomProps {
    id?: string
    positionArea?: string
  }

  export interface PopoverContentEmits {
    beforetoggle: [e: ToggleEvent]
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'PopoverContent' })

  const {
    positionArea = 'bottom',
    ...props
  } = defineProps<PopoverContentProps>()

  const emit = defineEmits<PopoverContentEmits>()

  const context = usePopoverContext()

  const id = toRef(() => props.id ?? context.id)

  const style = toRef(() => ({
    positionArea,
    positionAnchor: `--${id.value}`,
  }))

  function onBeforeToggle (e: ToggleEvent) {
    context.isActive.value = e.newState === 'open'

    emit('beforetoggle', e)
  }
</script>

<template>
  <Atom
    :id
    popover
    :style
    @beforetoggle="onBeforeToggle"
  >
    <slot />
  </Atom>
</template>
