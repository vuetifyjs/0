<!--
  @module Tooltip

  @see https://0.vuetifyjs.com/components/disclosure/tooltip

  @remarks
  Scoped tooltip-defaults provider. Mirrors `<Theme>` and `<Locale>`.
  Optional — `<Tooltip.Root>` works without a wrapper when the plugin
  default values are sufficient.
-->

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { provideContext } from '#v0/composables/createContext'
  import { useTooltip } from '#v0/composables/useTooltip'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { TooltipContext } from '#v0/composables/useTooltip'

  export interface TooltipProps extends AtomProps {
    openDelay?: number
    closeDelay?: number
    skipDelay?: number
    disabled?: boolean
    namespace?: string
  }

  export interface TooltipSlotProps {
    isAnyOpen: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Tooltip', inheritAttrs: false })

  defineSlots<{
    default: (props: TooltipSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    openDelay,
    closeDelay,
    skipDelay,
    disabled,
    namespace = 'v0:tooltip',
  } = defineProps<TooltipProps>()

  const parent = useTooltip()

  const context: TooltipContext = {
    ...parent,
    openDelay: toRef(() => openDelay ?? parent.openDelay.value),
    closeDelay: toRef(() => closeDelay ?? parent.closeDelay.value),
    skipDelay: toRef(() => skipDelay ?? parent.skipDelay.value),
    disabled: toRef(() => disabled ?? parent.disabled.value),
  }

  provideContext(namespace, context)

  const slotProps = toRef((): TooltipSlotProps => ({
    isAnyOpen: context.isAnyOpen.value,
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="$attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
