<script lang="ts">
  // Framework
  import { createContext, isNull, Tooltip, useLogger } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { TooltipRootProps, TooltipRootSlotProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  export interface QuTooltipContext {
    /** The v0 tooltip key the parts resolve when they are given none of their own. */
    namespace: Readonly<Ref<string>>
    /** The open tooltip was summoned by a press and hold: the content takes the touch metrics. */
    touch: Readonly<Ref<boolean>>
    /**
     * Marks the next open as a touch open, or clears the mark. The activator
     * sets it before it opens the tooltip from a hold and clears it when the
     * hold session ends, so a mark never outlives its own gesture.
     */
    arm: (value: boolean) => void
  }

  /**
   * Quantum withholds `interactive`, `positionArea`, `positionTry`, `adapter`,
   * `as` and `renderless` from v0's tooltip root: an MD1 tooltip is a plain
   * label that never takes input, it sits centred below its target (flipping
   * above when there is no room), and the gap to the target is the tooltips
   * page's, which another positioning engine would replace with its own offset.
   */
  export interface QuTooltipProps extends Pick<
    TooltipRootProps,
    'disabled' | 'openDelay' | 'closeDelay' | 'namespace'
  > {}

  export type QuTooltipSlotProps = TooltipRootSlotProps

  export const [useQuTooltip, provideQuTooltip] = createContext<QuTooltipContext | null>('quantum:tooltip', null)

  /** Dev warning for a part rendered outside QuTooltip: it keeps rendering, with no touch metrics to read. */
  export function orphan (part: string, context: QuTooltipContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <QuTooltip>; its state is inert`)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuTooltip' })

  defineSlots<{
    /** The activator and the content. */
    default?: (props: QuTooltipSlotProps) => any
  }>()

  const {
    disabled = false,
    // The tooltips page states no delay before showing; Quantum shows at once (decision).
    openDelay = 0,
    closeDelay,
    namespace = 'v0:tooltip',
  } = defineProps<QuTooltipProps>()

  const model = defineModel<boolean>({ default: false })

  const touch = shallowRef(false)

  let armed = false

  function arm (value: boolean) {
    armed = value
  }

  // Settled on each open, never on close, so a closing tile keeps its metrics through the exit.
  watch(model, open => {
    if (!open) return

    touch.value = armed
    armed = false
  }, { immediate: true })

  // v0 only refuses new opens while disabled; a tooltip that is already showing goes too.
  watch(() => disabled, value => {
    if (value) model.value = false
  })

  provideQuTooltip({
    namespace: toRef(() => namespace),
    touch,
    arm,
  })
</script>

<template>
  <Tooltip.Root
    v-slot="{ isOpen, isDisabled }"
    v-model="model"
    :close-delay
    :disabled
    :namespace
    :open-delay
    position-area="bottom"
    position-try="flip-block"
  >
    <slot :is-disabled :is-open />
  </Tooltip.Root>
</template>

<!--
  Unscoped, like every Quantum stylesheet, and on the root file (the EmCard
  shape): the content part renders the popover and its tile, styled here.
-->
<style>
  /*
   * The popover itself is a transparent frame: its block padding is the gap
   * between the target and the tile (24 dp on touch, 14 dp on desktop). It is
   * symmetric, so the gap holds on whichever side the tile lands after the
   * flip. v0's positioning writes `margin: unset` inline, which rules out a
   * margin for the gap. No `display` of its own: that would override the UA's
   * `display: none` and leave a closed tooltip painted.
   */
  .quantum-tooltip {
    box-sizing: border-box;
    margin: 0;
    padding: var(--quantum-spacing-3, 24px) 0;
    border: 0;
    background: transparent;
    overflow: visible;
    color: var(--quantum-tooltip-text, #FFFFFF);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    /* The label never takes input (tooltips page): the pointer passes through to whatever lies beneath. */
    pointer-events: none;
    opacity: 0;
    transform: scale(0.9);
    transition:
      opacity 150ms var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      transform 150ms var(--quantum-easing-accelerate, cubic-bezier(0.4, 0, 1, 1)),
      overlay 150ms allow-discrete,
      display 150ms allow-discrete;
  }

  /* Entrance: 150 ms on the deceleration curve; the exit above runs 150 ms on the acceleration curve (tooltips page). */
  .quantum-tooltip:popover-open {
    opacity: 1;
    transform: none;
    transition-timing-function: var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @starting-style {
    .quantum-tooltip:popover-open {
      opacity: 0;
      transform: scale(0.9);
    }
  }

  /*
   * The tile: Grey 700 at 90% with white text, one line of Roboto Medium.
   * Touch metrics by default: 32 dp tall, 16 dp side padding, 14 sp. The
   * corner is a decision (the page states none); there is no shadow and no arrow.
   */
  .quantum-tooltip__tile {
    display: block;
    box-sizing: border-box;
    height: 32px;
    max-inline-size: calc(100vw - 2 * var(--quantum-keyline-margin, 16px));
    padding: 0 var(--quantum-spacing-2, 16px);
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-tooltip, rgba(97, 97, 97, 0.9));
    font-size: 14px;
    font-weight: var(--quantum-font-weight-medium, 500);
    line-height: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /*
   * Desktop (mouse and keyboard): a 22 dp tile with 8 dp side padding and
   * 10 sp text, 14 dp below the target. A tooltip summoned by a press and hold
   * keeps the touch metrics on a device that has both (`data-touch`).
   */
  @media (pointer: fine) {
    .quantum-tooltip:not([data-touch]) {
      padding-block: 14px;
    }

    .quantum-tooltip:not([data-touch]) > .quantum-tooltip__tile {
      height: 22px;
      padding-inline: var(--quantum-spacing-1, 8px);
      font-size: 10px;
      line-height: 22px;
    }
  }

  /*
   * Reduced motion: the tile appears and leaves at once. The plugin's body
   * attribute wins over the OS query, so `mode: 'never'` keeps the motion.
   */
  body[data-reduced-motion='reduce'] .quantum-tooltip {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-tooltip {
      transition: none;
    }
  }
</style>
