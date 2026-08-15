<script lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

  export interface EmTooltipProps {
    namespace?: string
    openDelay?: number
    closeDelay?: number
    disabled?: boolean
    interactive?: boolean
    positionArea?: string
    positionTry?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltip' })

  const {
    namespace,
    openDelay,
    closeDelay,
    disabled = false,
    interactive = false,
    positionArea,
    positionTry,
  } = defineProps<EmTooltipProps>()

  const model = defineModel<boolean>()
</script>

<template>
  <Tooltip.Root
    v-model="model"
    :close-delay
    :disabled
    :interactive
    :namespace
    :open-delay
    :position-area
    :position-try
  >
    <slot />
  </Tooltip.Root>
</template>
