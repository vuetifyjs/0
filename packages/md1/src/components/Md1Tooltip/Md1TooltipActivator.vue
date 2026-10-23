<script lang="ts">
  // Framework
  import { IN_BROWSER, isNull, Tooltip, useEventListener, useTimer, useTooltipRoot } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Tooltip } from './Md1Tooltip.vue'

  // Utilities
  import { toRef, watch } from 'vue'

  // Types
  import type { TooltipActivatorProps, TooltipActivatorSlotProps } from '@vuetify/v0'

  export interface Md1TooltipActivatorProps extends Pick<TooltipActivatorProps, 'namespace'> {}

  /** The control-owned keys v0 writes for a button host; the consumer's control keeps its own. */
  type Owned = 'disabled' | 'aria-disabled' | 'type' | 'data-disabled'

  export interface Md1TooltipActivatorSlotProps extends Pick<TooltipActivatorSlotProps, 'isOpen' | 'isDisabled'> {
    /**
     * Spread onto the control the tooltip describes: `aria-describedby`,
     * `data-state`, the anchor name the tile positions against (`style`), v0's
     * hover, focus, click and Escape handlers, and MD1's press-and-hold
     * handlers for touch. A disabled tooltip leaves the control enabled.
     */
    attrs: Omit<TooltipActivatorSlotProps['attrs'], Owned | 'aria-describedby'> & {
      /** The content id; left off while the tooltip is disabled, which then describes nothing. */
      'aria-describedby': string | undefined
      'style': Record<string, string>
      'onPointerdown': (e: PointerEvent) => void
      'onPointerup': (e: PointerEvent) => void
      'onPointercancel': (e: PointerEvent) => void
      'onContextmenu': (e: MouseEvent) => void
      'onTouchend': (e: TouchEvent) => void
    }
  }

  /** How long a finger rests on the target before the tooltip shows (decision; the page states none). */
  const HOLD = 500

  /** How long the tooltip stays after the finger lifts (tooltips page). */
  const LIFT = 1500
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1TooltipActivator' })

  defineSlots<{
    /** The described control. Spread `attrs` onto it; an `Md1Button` is the usual host. */
    default?: (props: Md1TooltipActivatorSlotProps) => any
  }>()

  const { namespace: _namespace } = defineProps<Md1TooltipActivatorProps>()

  const context = useMd1Tooltip()

  orphan('Md1TooltipActivator', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value ?? 'v0:tooltip')

  const root = useTooltipRoot(namespace.value)

  // v0 drops touch pointers by design, so the press and hold of the tooltips
  // page is MD1's: hold shows, lift keeps it for 1.5 s, any other action hides.
  const hold = useTimer(onHold, { duration: HOLD })
  const lift = useTimer(hide, { duration: LIFT })

  // The tooltip on screen came from a hold on this activator.
  let held = false

  function onHold () {
    if (root.isDisabled.value) return

    held = true
    context?.arm(true)
    root.cancel()
    root.open(true)
  }

  function hide () {
    hold.stop()
    lift.stop()
    context?.arm(false)

    if (!held) return

    held = false
    root.cancel()
    root.isOpen.value = false
  }

  function onPointerdown (e: PointerEvent) {
    if (e.pointerType !== 'touch' || root.isDisabled.value) return

    hide()
    hold.start()
  }

  function onPointerup (e: PointerEvent) {
    if (e.pointerType !== 'touch') return

    // Lifted before the hold completed: a tap, which is the control's own business.
    if (hold.isActive.value) {
      hold.stop()
      return
    }

    if (!held) return

    keep()
    lift.start()
  }

  // The lift ends the gesture outside the popover, so the browser's light
  // dismiss has hidden the tile before any pointerup listener runs. Showing it
  // again in the same task means no frame ever paints the gap, and the toggle
  // events coalesce into one that leaves v0's open state untouched.
  function keep () {
    const el = document.querySelector<HTMLElement>(`#${CSS.escape(root.id)}`)

    if (!isNull(el) && !el.matches(':popover-open')) el.showPopover()
  }

  function onPointercancel (e: PointerEvent) {
    if (e.pointerType === 'touch') hide()
  }

  // The hold is the tooltip's gesture: no context menu while it runs.
  function onContextmenu (e: MouseEvent) {
    if (hold.isActive.value || held) e.preventDefault()
  }

  // A lift that ends a hold is not a tap: cancelling the touchend drops the click it would synthesise.
  function onTouchend (e: TouchEvent) {
    if (held) e.preventDefault()
  }

  // Any other action ends a touch tooltip before its 1.5 s: a press anywhere, a key, a scroll.
  function onAction () {
    if (held) hide()
  }

  if (IN_BROWSER) {
    useEventListener(document, ['pointerdown', 'keydown'], onAction, { capture: true })
    useEventListener(document, 'scroll', onAction, { capture: true, passive: true })
  }

  // Closed by any other path (Escape, the model, a mouse leave): the hold session is over.
  watch(root.isOpen, open => {
    if (open) return

    held = false
    lift.stop()
    context?.arm(false)
  })

  function bind (attrs: TooltipActivatorSlotProps['attrs'], styles: Record<string, string>): Md1TooltipActivatorSlotProps['attrs'] {
    const { 'disabled': _disabled, 'aria-disabled': _aria, 'type': _type, 'data-disabled': _data, ...rest } = attrs

    return {
      ...rest,
      'aria-describedby': root.isDisabled.value ? undefined : rest['aria-describedby'],
      'style': styles,
      onPointerdown,
      onPointerup,
      onPointercancel,
      onContextmenu,
      onTouchend,
    }
  }
</script>

<!--
  Renderless on purpose: the target is the consumer's control, and a button
  rendered around another button is invalid markup with two click targets.
-->
<template>
  <Tooltip.Activator v-slot="{ attrs, styles, isOpen, isDisabled }" :namespace renderless>
    <slot :attrs="bind(attrs, styles)" :is-disabled :is-open />
  </Tooltip.Activator>
</template>
