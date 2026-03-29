<script lang="ts">
  export interface HxTooltipProps {
    text: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    delay?: number
  }
</script>

<script setup lang="ts">
  // Framework
  import { usePopover } from '@vuetify/v0'

  // Utilities
  import { useTemplateRef } from 'vue'

  defineOptions({ name: 'HxTooltip' })

  const {
    text,
    placement = 'top',
    delay = 200,
  } = defineProps<HxTooltipProps>()

  const POSITION_AREA: Record<string, string> = {
    top: 'top',
    bottom: 'bottom',
    left: 'left',
    right: 'right',
  }

  const popover = usePopover({
    positionArea: POSITION_AREA[placement],
    showDelay: delay,
  })

  const content = useTemplateRef('content')
  popover.attach(() => content.value)
</script>

<template>
  <span
    :aria-describedby="popover.contentAttrs.value.id"
    class="helix-tooltip-anchor"
    :style="popover.anchorStyles.value"
    tabindex="0"
    @blur="popover.close()"
    @focus="popover.open()"
    @keydown.escape="popover.close()"
    @mouseenter="popover.open()"
    @mouseleave="popover.close()"
  >
    <slot />
  </span>

  <div
    ref="content"
    v-bind="popover.contentAttrs.value"
    class="helix-tooltip"
    role="tooltip"
    :style="popover.contentStyles.value"
  >
    {{ text }}
  </div>
</template>

<style scoped>
.helix-tooltip-anchor {
  display: inline-flex;
}

.helix-tooltip {
  pointer-events: none;
}
</style>
