<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { TooltipContent } from '@vuetify/v0'

  // Context
  import { useEmTooltip } from './EmTooltip.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmTooltipContentProps extends V0PaperProps {
    /** Render the pointing tail (Figma `showTail`) */
    tail?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipContent' })

  const { tail = true, ...paperProps } = defineProps<EmTooltipContentProps>()

  const tooltip = useEmTooltip()

  const side = toRef(() => tooltip.area.value.split(' ')[0] ?? 'top')
  const align = toRef(() => {
    const span = tooltip.area.value.split(' ')[1]
    if (span === 'span-right') return 'start'
    if (span === 'span-left') return 'end'
    return undefined
  })
</script>

<template>
  <TooltipContent class="emerald-tooltip__popover">
    <V0Paper
      v-bind="paperProps"
      as="div"
      class="emerald-tooltip__content"
      :data-align="align"
      :data-side="side"
    >
      <slot />

      <span v-if="tail" aria-hidden="true" class="emerald-tooltip__tail">
        <svg fill="none" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.1895 13.7528C10.3913 14.8589 8.74427 14.8589 7.946 13.7528L3.19557 7.17041C2.24097 5.84768 3.18612 4 4.81733 4L14.3182 4C15.9494 4 16.8946 5.84768 15.94 7.17041L11.1895 13.7528Z" fill="currentColor" />

          <rect
            fill="currentColor"
            height="4.91549"
            width="16.5612"
            x="1.71938"
            y="2.57347"
          />
        </svg>
      </span>
    </V0Paper>
  </TooltipContent>
</template>

<style>
.emerald-tooltip__popover {
  padding: 0;
  margin: 0;
  background: transparent;
  border: 0;
  overflow: visible;
  pointer-events: none;
}

.emerald-tooltip__popover[data-interactive] {
  pointer-events: auto;
}

.emerald-tooltip__popover::backdrop {
  background: transparent;
}

.emerald-tooltip__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--emerald-spacing-3xs, 2px);
  align-items: flex-start;
  width: max-content;
  max-width: 224px;
  padding: var(--emerald-spacing-xs, 8px);
  background: var(--emerald-neutral-1000, #2B2D2E);
  border-radius: var(--emerald-radius-m, 8px);
  /* Figma Elevation/S (box-shadow token: --emerald-shadow-soft) — kept inline: drop-shadow() geometry is tuned for the arrow cutout */
  filter: drop-shadow(0 2px 2px rgba(27, 28, 29, 0.04));
  font-family: var(--emerald-font-sans, Manrope, system-ui, -apple-system, sans-serif);
  font-size: var(--emerald-text-b3-size, 12px);
  font-weight: var(--emerald-text-b3-weight, 400);
  line-height: var(--emerald-text-b3-height, 18px);
  color: var(--emerald-neutral-100, #FEFEFE);
  overflow-wrap: break-word;
}

/* Push the bubble away from the anchor to make room for the tail */
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

/* Tail: 20x16 curved vector, overhangs the bubble by ~8.5px (Figma node 14:36) */
.emerald-tooltip__tail {
  position: absolute;
  display: block;
  width: 20px;
  height: 16px;
  color: var(--emerald-neutral-1000, #2B2D2E);
}

.emerald-tooltip__tail svg {
  display: block;
  width: 100%;
  height: 100%;
}

.emerald-tooltip__content[data-side="top"] .emerald-tooltip__tail {
  bottom: -8.5px;
  left: 50%;
  transform: translateX(-50%);
}
.emerald-tooltip__content[data-side="bottom"] .emerald-tooltip__tail {
  top: -8.5px;
  left: 50%;
  transform: translateX(-50%) rotate(180deg);
}

/* Corner tip positions: tail sits 6px from the bubble edge (Figma node 14:59) */
.emerald-tooltip__content[data-side="top"][data-align="start"] .emerald-tooltip__tail {
  left: 6px;
  transform: none;
}
.emerald-tooltip__content[data-side="top"][data-align="end"] .emerald-tooltip__tail {
  right: 6px;
  left: auto;
  transform: none;
}
.emerald-tooltip__content[data-side="bottom"][data-align="start"] .emerald-tooltip__tail {
  left: 6px;
  transform: rotate(180deg);
}
.emerald-tooltip__content[data-side="bottom"][data-align="end"] .emerald-tooltip__tail {
  right: 6px;
  left: auto;
  transform: rotate(180deg);
}

.emerald-tooltip__content[data-side="left"] .emerald-tooltip__tail {
  top: 50%;
  right: -10.5px;
  transform: translateY(-50%) rotate(-90deg);
}
.emerald-tooltip__content[data-side="right"] .emerald-tooltip__tail {
  top: 50%;
  left: -10.5px;
  transform: translateY(-50%) rotate(90deg);
}
</style>
