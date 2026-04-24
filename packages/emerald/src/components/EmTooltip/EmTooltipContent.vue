<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { PopoverContent, usePopoverContext } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmTooltipContentProps extends V0PaperProps {
    positionArea?: string
    positionTry?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipContent' })

  const {
    positionArea = 'top',
    positionTry = 'most-width top',
    ...paperProps
  } = defineProps<EmTooltipContentProps>()

  const context = usePopoverContext()
  const side = toRef(() => positionArea.split(' ')[0] ?? 'top')
</script>

<template>
  <PopoverContent
    :id="context.id"
    :position-area
    :position-try
  >
    <V0Paper
      v-bind="paperProps"
      as="div"
      class="emerald-tooltip__content"
      :data-side="side"
      role="tooltip"
    >
      <span class="emerald-tooltip__label">
        <slot />
      </span>
      <span aria-hidden="true" class="emerald-tooltip__arrow" />
    </V0Paper>
  </PopoverContent>
</template>

<style>
.emerald-tooltip__content {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background: var(--emerald-neutral-600);
  border-radius: 6px;
  box-shadow:
    0 2px 4px 0 rgba(5, 0, 18, 0.1),
    0 3px 8px 0 rgba(5, 0, 18, 0.13);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  color: #ffffff;
  white-space: nowrap;
  pointer-events: none;
}

.emerald-tooltip__content[data-side="top"] {
  transform: translateY(-9px);
}
.emerald-tooltip__content[data-side="bottom"] {
  transform: translateY(9px);
}
.emerald-tooltip__content[data-side="left"] {
  transform: translateX(-9px);
}
.emerald-tooltip__content[data-side="right"] {
  transform: translateX(9px);
}

.emerald-tooltip__label {
  display: inline-block;
}

.emerald-tooltip__arrow {
  position: absolute;
  left: 50%;
  width: 12px;
  height: 6px;
  background: var(--emerald-neutral-600);
  transform: translateX(-50%);
}

/* Arrow points toward the activator (opposite of tooltip's side) */
.emerald-tooltip__content[data-side="top"] .emerald-tooltip__arrow {
  bottom: -5px;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}
.emerald-tooltip__content[data-side="bottom"] .emerald-tooltip__arrow {
  top: -5px;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
.emerald-tooltip__content[data-side="left"] .emerald-tooltip__arrow {
  top: 50%;
  right: -8px;
  left: auto;
  width: 6px;
  height: 12px;
  transform: translateY(-50%);
  clip-path: polygon(0 0, 100% 50%, 0 100%);
}
.emerald-tooltip__content[data-side="right"] .emerald-tooltip__arrow {
  top: 50%;
  left: -8px;
  width: 6px;
  height: 12px;
  transform: translateY(-50%);
  clip-path: polygon(100% 0, 100% 100%, 0 50%);
}
</style>
