<script setup lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

  // Types
  import type { AtomProps, TooltipRootProps } from '@vuetify/v0'

  defineOptions({ inheritAttrs: false })

  // openDelay/closeDelay/positionArea/disabled forward to Tooltip.Root; their
  // types come from TooltipRootProps so this wrapper can't drift. `disabled` is
  // a declared prop (not a fall-through attr) so a caller's `:disabled` is not
  // clobbered by Tooltip.Activator's mergeProps.
  const {
    text,
    as = 'button',
    openDelay = 500,
    closeDelay = 200,
    positionArea = 'top',
    disabled = false,
  } = defineProps<{
    /** Tooltip text. When empty the trigger renders on its own, no tooltip. */
    text?: string
    /** Element the trigger renders as; forwarded to Tooltip.Activator. */
    as?: AtomProps['as']
  } & Pick<TooltipRootProps, 'closeDelay' | 'disabled' | 'openDelay' | 'positionArea'>>()
</script>

<template>
  <Tooltip.Root
    v-if="text"
    :close-delay
    :disabled
    :open-delay
    :position-area
  >
    <Tooltip.Activator :as v-bind="$attrs">
      <slot />
    </Tooltip.Activator>

    <Tooltip.Content
      class="max-w-64 whitespace-normal rounded border border-divider bg-surface px-2 py-1 text-xs text-on-surface shadow-lg"
      :style="{ margin: '6px 0' }"
    >
      {{ text }}
    </Tooltip.Content>
  </Tooltip.Root>

  <component :is="as" v-else :disabled="disabled || undefined" v-bind="$attrs">
    <slot />
  </component>
</template>
