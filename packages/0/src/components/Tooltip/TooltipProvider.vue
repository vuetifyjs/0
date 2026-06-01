/**
 * @module TooltipProvider
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tooltip
 *
 * @remarks
 * Scoped tooltip-defaults provider. Mirrors the Theme and Locale providers.
 * Overrides openDelay, closeDelay, skipDelay, and disabled for descendants;
 * the underlying registry and warmup window are shared with the parent
 * context (and ultimately with the plugin), so a single open tooltip primes
 * warmup across every scope. Optional — Tooltip.Root works without a wrapper
 * when the plugin defaults are sufficient.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { provideContext } from '#v0/composables/createContext'
  import { useTooltip } from '#v0/composables/useTooltip'

  // Utilities
  import { mergeProps, toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { TooltipContext } from '#v0/composables/useTooltip'

  export interface TooltipProviderProps extends AtomProps {
    openDelay?: number
    closeDelay?: number
    skipDelay?: number
    disabled?: boolean
    namespace?: string
  }

  export interface TooltipProviderSlotProps {
    isAnyOpen: boolean
    attrs: {
      'data-disabled': true | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TooltipProvider', inheritAttrs: false })

  defineSlots<{
    default: (props: TooltipProviderSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    openDelay,
    closeDelay,
    skipDelay,
    disabled,
    namespace = 'v0:tooltip',
  } = defineProps<TooltipProviderProps>()

  const parent = useTooltip()

  const context: TooltipContext = {
    ...parent,
    openDelay: toRef(() => openDelay ?? parent.openDelay.value),
    closeDelay: toRef(() => closeDelay ?? parent.closeDelay.value),
    skipDelay: toRef(() => skipDelay ?? parent.skipDelay.value),
    disabled: toRef(() => disabled ?? parent.disabled.value),
  }

  provideContext(namespace, context)

  const slotProps = toRef((): TooltipProviderSlotProps => ({
    isAnyOpen: context.isAnyOpen.value,
    attrs: { 'data-disabled': context.disabled.value || undefined },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="mergeProps($attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
