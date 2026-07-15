<script setup lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

  defineOptions({ inheritAttrs: false })

  const {
    text,
    as = 'button',
    openDelay = 500,
    closeDelay = 200,
    positionArea = 'top',
  } = defineProps<{
    /** Tooltip text. When empty the trigger renders on its own, no tooltip. */
    text?: string
    /** Element the trigger renders as; forwarded to Tooltip.Activator. */
    as?: string
    openDelay?: number
    closeDelay?: number
    positionArea?: string
  }>()
</script>

<template>
  <Tooltip.Root
    v-if="text"
    :close-delay
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

  <component :is="as" v-else v-bind="$attrs">
    <slot />
  </component>
</template>
