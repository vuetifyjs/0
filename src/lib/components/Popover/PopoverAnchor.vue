<script lang="ts">
  // Components
  import { Atom } from '@/lib/components/Atom'

  // Types
  import type { AtomProps } from '@/lib/components/Atom'

  export interface PopoverContentProps extends AtomProps {
    target?: string
  }

  import { usePopoverContext } from './PopoverRoot.vue'
</script>

<script lang="ts" setup>
  defineOptions({ name: 'PopoverAnchor' })

  const { as = 'button', ...props } = defineProps<PopoverContentProps>()

  const context = usePopoverContext()

  const popovertarget = toRef(() => props.target ?? context.id)

  const style = toRef(() => ({
    anchorName: `--${popovertarget.value}`,
  }))
</script>

<template>
  <Atom
    :as
    :data-popover-open="context.isActive.value ? '' : undefined"
    :popovertarget
    :style
    :type="as === 'button' ? 'button' : undefined"
  >
    <slot />
  </Atom>
</template>
