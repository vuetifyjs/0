<script lang="ts">
  // Framework
  import { createContext, TooltipRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { Ref } from 'vue'

  export interface EmTooltipProps {
    /** Delay in ms before opening; falls back to the v0 tooltip region default */
    openDelay?: number
    /** Delay in ms before closing; falls back to the v0 tooltip region default */
    closeDelay?: number
    /** Disable the tooltip */
    disabled?: boolean
    /** Keep the content open while hovered so the user can interact with it */
    interactive?: boolean
    /** CSS anchor-positioning `position-area` (spec tip positions: `top`, `top span-left`, `top span-right`, `bottom`, `bottom span-left`, `bottom span-right`, `left`, `right`) */
    positionArea?: string
    /** CSS anchor-positioning `position-try` fallbacks */
    positionTry?: string
  }

  export interface EmTooltipContext {
    area: Readonly<Ref<string>>
  }

  export const [useEmTooltip, provideEmTooltip] = createContext<EmTooltipContext>('emerald:tooltip')
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltip' })

  const {
    openDelay,
    closeDelay,
    disabled = false,
    interactive = false,
    positionArea = 'top',
    positionTry = 'most-height top',
  } = defineProps<EmTooltipProps>()

  const model = defineModel<boolean>({ default: false })

  provideEmTooltip({ area: toRef(() => positionArea) })
</script>

<template>
  <TooltipRoot
    v-model="model"
    :close-delay
    :disabled
    :interactive
    :open-delay
    :position-area
    :position-try
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </TooltipRoot>
</template>
