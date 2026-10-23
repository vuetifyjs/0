<script lang="ts">
  // Framework
  import { Tooltip, useLogger } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Tooltip } from './Md1Tooltip.vue'

  // Utilities
  import { onMounted, toRef, useTemplateRef } from 'vue'

  // Types
  import type { TooltipContentProps } from '@vuetify/v0'

  export interface Md1TooltipContentProps extends Pick<TooltipContentProps, 'namespace'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1TooltipContent' })

  defineSlots<{
    /** The label: one line of plain text. */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<Md1TooltipContentProps>()

  const context = useMd1Tooltip()

  orphan('Md1TooltipContent', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value ?? 'v0:tooltip')
  const touch = toRef(() => context?.touch.value ?? false)

  const tile = useTemplateRef<HTMLElement>('tile')

  // "Tooltips don't display rich information including images and formatted text" (tooltips page).
  if (__DEV__) {
    const logger = useLogger()

    onMounted(() => {
      if (tile.value && tile.value.children.length > 0) {
        logger.warn('[Md1TooltipContent] a tooltip is one line of plain text; images and formatted text are not a spec form')
      }
    })
  }
</script>

<template>
  <Tooltip.Content
    class="md1-tooltip"
    :data-touch="touch || undefined"
    :namespace
  >
    <span ref="tile" class="md1-tooltip__tile">
      <slot />
    </span>
  </Tooltip.Content>
</template>
