<script setup lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

  // Types
  import type { AtomProps, TooltipRootProps } from '@vuetify/v0'

  defineOptions({ inheritAttrs: false })

  // openDelay/closeDelay/positionArea/disabled forward to Tooltip.Root; their
  // types come from TooltipRootProps so this wrapper can't drift. `disabled` is
  // a declared prop (not a fall-through attr) so a caller's `:disabled` is not
  // clobbered by Tooltip.Activator's mergeProps. openDelay/closeDelay carry no
  // defaults on purpose — undefined lets Tooltip.Root fall back to the region
  // delays from createTooltipPlugin, so timing is configured in one place.
  const {
    text,
    as = 'button',
    openDelay,
    closeDelay,
    positionArea = 'top',
    positionTry,
    disabled = false,
    nowrap = false,
  } = defineProps<{
    /** Tooltip text. When empty the trigger renders on its own, no tooltip. */
    text?: string
    /** Element the trigger renders as; forwarded to Tooltip.Activator. */
    as?: AtomProps['as']
    /** Keep the tooltip on one line. */
    nowrap?: boolean
  } & Pick<TooltipRootProps, 'closeDelay' | 'disabled' | 'openDelay' | 'positionArea' | 'positionTry'>>()

  function tipMargin (area: string): string {
    const token = area.trim().split(/\s+/)[0] ?? ''
    if (
      token === 'left'
      || token === 'right'
      || token === 'start'
      || token === 'end'
      || token === 'inline-start'
      || token === 'inline-end'
      || token === 'x-start'
      || token === 'x-end'
    ) return '0 6px'
    return '6px 0'
  }
</script>

<template>
  <Tooltip.Root
    v-if="text"
    :close-delay
    :disabled
    :open-delay
    :position-area
    :position-try
  >
    <Tooltip.Activator :as v-bind="$attrs">
      <slot />
    </Tooltip.Activator>

    <Tooltip.Content
      class="rounded border border-divider bg-surface px-2 py-1 text-xs text-on-surface shadow-lg"
      :class="nowrap ? 'whitespace-nowrap' : 'max-w-64 whitespace-normal'"
      :style="{ margin: tipMargin(positionArea) }"
    >
      {{ text }}
    </Tooltip.Content>
  </Tooltip.Root>

  <component :is="as" v-else :disabled="disabled || undefined" v-bind="$attrs">
    <slot />
  </component>
</template>
