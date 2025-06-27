<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { onMounted, toRef, useTemplateRef } from 'vue'

  // Types
  import { usePopoverContext } from './PopoverRoot.vue'
  import type { AtomProps } from '#v0/components/Atom'

  export interface PopoverContentProps extends AtomProps {
    id?: string
    positionArea?: string
    positionTry?: string
  }

  export interface PopoverContentEmits {
    beforetoggle: [e: ToggleEvent]
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'PopoverContent' })

  const {
    positionArea = 'bottom',
    positionTry = 'most-width bottom',
    ...props
  } = defineProps<PopoverContentProps>()

  const emit = defineEmits<PopoverContentEmits>()

  const context = usePopoverContext()

  const ref = useTemplateRef('ref')

  const id = toRef(() => props.id ?? context.id)
  const style = toRef(() => ({
    positionArea,
    positionAnchor: `--${id.value}`,
    positionTry,
  }))

  onMounted(() => {
    if (context.isActive.value) {
      ref.value?.element?.showPopover()
    }
  })

  function onBeforeToggle (e: ToggleEvent) {
    context.isActive.value = e.newState === 'open'

    emit('beforetoggle', e)
  }
</script>

<template>
  <Atom
    :id
    ref="ref"
    popover
    :style
    @beforetoggle="onBeforeToggle"
  >
    <slot />
  </Atom>
</template>
