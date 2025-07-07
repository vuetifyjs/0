<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { usePopoverContext } from './PopoverRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface PopoverAnchorProps extends AtomProps {
    target?: string
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'PopoverAnchor' })

  const { as = 'button', ...props } = defineProps<PopoverAnchorProps>()

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
