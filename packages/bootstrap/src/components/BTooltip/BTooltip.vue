<script lang="ts">
  // Framework
  import {
    IN_BROWSER,
    clamp,
    isElement,
    isNull,
    isNullOrUndefined,
    isNumber,
    isString,
    useEventListener,
    usePopover,
    useResizeObserver,
  } from '@vuetify/v0'

  // Utilities
  import { mergeProps, shallowRef, toRef, useAttrs, useSlots, useTemplateRef, watch } from 'vue'

  // `span-*` shares an edge with the anchor. A bare second keyword is the
  // diagonal tile. Top and bottom use logical values so `start` follows the
  // writing direction. Left and right stay physical.
  export const TOOLTIP_PLACEMENTS = {
    'bottom-start': 'block-end span-inline-end',
    'bottom': 'block-end',
    'bottom-end': 'block-end span-inline-start',
    'top-start': 'block-start span-inline-end',
    'top': 'block-start',
    'top-end': 'block-start span-inline-start',
    'left-start': 'left span-bottom',
    'left': 'left',
    'left-end': 'left span-top',
    'right-start': 'right span-bottom',
    'right': 'right',
    'right-end': 'right span-top',
  } as const

  export type BTooltipPlacement = keyof typeof TOOLTIP_PLACEMENTS

  export type BTooltipTrigger = 'hover' | 'focus' | 'click' | 'hover focus'

  export interface BTooltipDelay {
    show?: number
    hide?: number
  }

  export interface BTooltipProps {
    /**
     * Tip text. Rendered as text. An empty title does not open.
     * Markup belongs in the `content` slot.
     */
    text?: string
    /**
     * Where the tip sits, and the `data-bs-placement` styling hook.
     * The arrow rules key off that attribute. Default is `top`.
     */
    placement?: BTooltipPlacement
    /**
     * Milliseconds before show and hide. A number applies to both.
     * `{ show, hide }` sets them separately. `0` runs in the same turn.
     */
    delay?: number | BTooltipDelay
    /**
     * `hover focus` (default), `hover`, `focus`, or `click`.
     */
    trigger?: BTooltipTrigger
    /**
     * Adds `.tooltip-instant`, which skips the opacity transition.
     *
     * @default false
     */
    instant?: boolean
  }

  export interface BTooltipSlotProps {
    attrs: {
      'aria-describedby': string | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BTooltip', inheritAttrs: false })

  defineSlots<{
    /** The trigger. Bind `attrs` so it is described by the tip while open. */
    default?: (props: BTooltipSlotProps) => any
    /** Tip body. Replaces `text` when the body is markup. */
    content?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const model = defineModel<boolean>({ default: false })

  const {
    text = '',
    placement = 'top',
    delay = 0,
    trigger = 'hover focus',
    instant = false,
  } = defineProps<BTooltipProps>()

  const attrs = useAttrs()
  const slots = useSlots()
  const triggerEl = useTemplateRef<HTMLElement>('trigger')
  const tipEl = useTemplateRef<HTMLElement>('tip')
  const arrowEl = useTemplateRef<HTMLElement>('arrow')

  const hover = shallowRef(false)
  const focus = shallowRef(false)
  const click = shallowRef(false)
  const pressed = shallowRef(false)
  // True after a click starts a hide, until the model actually closes.
  // An outside open leaves this false, so the first click still dismisses.
  const hiding = shallowRef(false)

  function showDelay () {
    if (isNumber(delay)) return delay
    return delay.show ?? 0
  }

  function hideDelay () {
    if (isNumber(delay)) return delay
    return delay.hide ?? 0
  }

  const popover = usePopover({
    isOpen: model,
    positionArea: () => TOOLTIP_PLACEMENTS[placement],
    openDelay: showDelay,
    closeDelay: hideDelay,
  })

  // attach() calls showPopover() on open. That throws without a popover
  // attribute, and the attribute would put the tip in the top layer, which
  // fights `.tooltip { display: block }`. The no-op keeps the adapter's
  // content element without the promotion.
  watch(tipEl, element => {
    if (isNullOrUndefined(element)) return
    element.showPopover = () => {}
  }, { flush: 'sync' })

  popover.attachAnchor(triggerEl)
  popover.attach(tipEl)

  function filled () {
    if (slots.content) return true
    return isString(text) && text.trim().length > 0
  }

  function allows (which: 'hover' | 'focus' | 'click') {
    return trigger.split(' ').includes(which)
  }

  function contains (target: EventTarget | null) {
    if (!isElement(target)) return false

    const host = triggerEl.value
    const tip = tipEl.value

    if (!isNull(host) && host.contains(target)) return true
    if (!isNull(tip) && tip.contains(target)) return true

    return false
  }

  function engaged () {
    return hover.value || focus.value || click.value || pressed.value
  }

  function schedule () {
    if (!filled()) {
      popover.cancel()
      model.value = false
      return
    }

    if (engaged()) popover.open()
    else popover.close()
  }

  function kind (event: MouseEvent | FocusEvent) {
    if (event.type === 'focusin' || event.type === 'focusout') return 'focus' as const
    return 'hover' as const
  }

  function onEnter (event: MouseEvent | FocusEvent) {
    const which = kind(event)
    if (!allows(which)) return

    if (which === 'focus') focus.value = true
    else hover.value = true

    schedule()
  }

  function onLeave (event: MouseEvent | FocusEvent) {
    const which = kind(event)
    if (!allows(which)) return

    const inside = contains(event.relatedTarget)

    if (which === 'focus') focus.value = inside || pressed.value
    else hover.value = inside

    schedule()
  }

  function onClick () {
    if (!allows('click')) return

    // Outside code can open the tip without setting `click`. That click
    // closes. A second click while a show or hide delay is running toggles
    // `click`, which cancels the delay.
    const external = model.value && !click.value && !hiding.value
    click.value = external ? false : !click.value
    hiding.value = model.value && !click.value
    schedule()
  }

  function onTipDown () {
    if (!allows('focus')) return

    pressed.value = true
    focus.value = true
  }

  function onPointerUp () {
    if (!pressed.value) return

    pressed.value = false
    focus.value = IN_BROWSER && contains(document.activeElement)
    schedule()
  }

  function onEscape (event: KeyboardEvent) {
    if (event.key !== 'Escape' || !model.value) return

    event.preventDefault()
    event.stopPropagation()
    hover.value = false
    focus.value = false
    click.value = false
    pressed.value = false
    popover.cancel()
    model.value = false
  }

  // Capture so the first Escape dismisses the tip before a parent dialog.
  useEventListener(
    () => (model.value && IN_BROWSER ? document : null),
    'keydown',
    onEscape,
    { capture: true },
  )

  useEventListener(
    () => (pressed.value && IN_BROWSER ? document : null),
    'pointerup',
    onPointerUp,
  )

  watch(() => model.value, open => {
    if (!open) hiding.value = false
    if (open && !filled()) model.value = false
  }, { immediate: true })

  function gap () {
    if (placement.startsWith('bottom')) return '0.4rem 0 0'
    if (placement.startsWith('left')) return '0 0.4rem 0 0'
    if (placement.startsWith('right')) return '0 0 0 0.4rem'
    return '0 0 0.4rem'
  }

  // The pin's arrow rules only choose an edge, and they assume the arrow is
  // absolute. Bootstrap's script writes the cross-axis from Floating UI. The
  // same offset is the trigger's center, clamped so the arrow stays on the tip.
  function placeArrow () {
    if (!IN_BROWSER) return

    const host = triggerEl.value
    const tip = tipEl.value
    const arrow = arrowEl.value

    if (isNull(host) || isNull(tip) || isNull(arrow)) return

    arrow.style.position = 'absolute'
    arrow.style.right = ''
    arrow.style.bottom = ''

    const hostBox = host.getBoundingClientRect()
    const tipBox = tip.getBoundingClientRect()
    const vertical = placement.startsWith('top') || placement.startsWith('bottom')

    if (vertical) {
      const size = arrow.offsetWidth
      const room = tipBox.width - size
      const center = hostBox.left + hostBox.width / 2 - tipBox.left
      arrow.style.left = `${clamp(center - size / 2, 0, Math.max(room, 0))}px`
      arrow.style.top = ''
      return
    }

    const size = arrow.offsetHeight
    const room = tipBox.height - size
    const center = hostBox.top + hostBox.height / 2 - tipBox.top
    arrow.style.top = `${clamp(center - size / 2, 0, Math.max(room, 0))}px`
    arrow.style.left = ''
  }

  useResizeObserver(tipEl, placeArrow)
  useResizeObserver(triggerEl, placeArrow)
  watch(() => placement, placeArrow)

  const anchorStyle = toRef(() => popover.anchorStyles.value)

  const tipStyle = toRef(() => ({
    ...popover.contentStyles.value,
    margin: gap(),
  }))

  const tipClass = toRef(() => {
    const list = ['tooltip', 'bs-tooltip-auto']

    if (model.value && filled()) list.push('show')
    else list.push('pe-none')
    if (instant) list.push('tooltip-instant')

    return list
  })

  const triggerAttrs = toRef((): BTooltipSlotProps['attrs'] => ({
    'aria-describedby': model.value && filled() ? popover.id : undefined,
  }))
</script>

<template>
  <span
    ref="trigger"
    v-bind="mergeProps(attrs, { class: 'd-inline-block', style: anchorStyle })"
    @click="onClick"
    @focusin="onEnter"
    @focusout="onLeave"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <slot :attrs="triggerAttrs" />
  </span>

  <div
    :id="popover.id"
    ref="tip"
    :class="tipClass"
    :data-bs-placement="placement"
    role="tooltip"
    :style="tipStyle"
    @focusin="onEnter"
    @focusout="onLeave"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @pointerdown="onTipDown"
  >
    <div ref="arrow" class="tooltip-arrow" />

    <div class="tooltip-inner">
      <slot name="content">{{ text }}</slot>
    </div>
  </div>
</template>
