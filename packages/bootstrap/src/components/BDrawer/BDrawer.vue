<script lang="ts">
  // Framework
  import { Dialog, IN_BROWSER, createContext, isNullOrUndefined, isUndefined, useEventListener, useTimer } from '@vuetify/v0'

  // Utilities
  import { mergeProps, onMounted, onScopeDispose, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  export type BDrawerPlacement = 'start' | 'end' | 'top' | 'bottom' | 'fullscreen'

  export interface BDrawerProps {
    /**
     * Ignore backdrop clicks.
     *
     * Maps to Bootstrap's `backdrop: "static"`. The click bounces and does
     * not close. Escape still closes unless `keyboard` is false.
     */
    blocking?: boolean
    /**
     * Close on Escape.
     *
     * When false, Escape bounces the drawer and does not close it.
     */
    keyboard?: boolean
    /**
     * `.drawer-start` / `.drawer-end` / `.drawer-top` / `.drawer-bottom` /
     * `.drawer-fullscreen`. Bootstrap has no default placement, so omit this
     * and no placement class is rendered.
     */
    placement?: BDrawerPlacement
    /**
     * Leave the page scrollable.
     *
     * The drawer stays modal when it has a backdrop. `dialog-open` is not
     * added, so the document can scroll behind it.
     */
    scroll?: boolean
    /** `.drawer-sheet`. Flush to the viewport edge. */
    sheet?: boolean
  }

  export interface BDrawerContext {
    /** Close the drawer. */
    close: () => void
  }

  const [useBDrawer, provideBDrawer] = createContext<BDrawerContext | null>('bootstrap:drawer', null)

  export { useBDrawer }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BDrawer', inheritAttrs: false })

  defineSlots<{
    /** Header, body, and footer parts. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    blocking = false,
    keyboard = true,
    placement,
    scroll = false,
    sheet = false,
  } = defineProps<BDrawerProps>()

  const model = defineModel<boolean>({ default: false })

  const attrs = useAttrs()
  const dialogEl = useTemplateRef<HTMLDialogElement>('dialog')
  const exitEl = shallowRef<HTMLDialogElement | null>(null)

  const classes = toRef(() => {
    const list = ['drawer']
    if (!isUndefined(placement)) list.push(`drawer-${placement}`)
    if (sheet) list.push('drawer-sheet')
    return list
  })

  function close () {
    model.value = false
  }

  provideBDrawer({ close })

  function animated (element: HTMLElement): boolean {
    if (element.classList.contains('drawer-instant')) return false
    const duration = getComputedStyle(element).transitionDuration
    return duration.split(',').some(part => Number.parseFloat(part) > 0)
  }

  // Same off-screen transform the placement rule uses. Later classes win,
  // matching the pin's cascade (fullscreen and bottom share one value).
  function exitTransform (element: HTMLElement): string | undefined {
    const rtl = getComputedStyle(element).direction === 'rtl'
    const start = rtl
      ? 'translateX(calc(100% + var(--bs-drawer-inset)))'
      : 'translateX(calc(-100% - var(--bs-drawer-inset)))'
    const end = rtl
      ? 'translateX(calc(-100% - var(--bs-drawer-inset)))'
      : 'translateX(calc(100% + var(--bs-drawer-inset)))'

    if (
      element.classList.contains('drawer-fullscreen')
      || element.classList.contains('drawer-bottom')
    ) {
      return 'translateY(calc(100% + var(--bs-drawer-inset)))'
    }
    if (element.classList.contains('drawer-top')) {
      return 'translateY(calc(-100% - var(--bs-drawer-inset)))'
    }
    if (element.classList.contains('drawer-end')) return end
    if (element.classList.contains('drawer-start')) return start
    return undefined
  }

  function clearBackdrop (element: HTMLElement) {
    element.style.removeProperty('--bs-drawer-backdrop-bg')
    element.style.removeProperty('--bs-drawer-backdrop-blur')
  }

  function clearMotion (element: HTMLElement) {
    element.style.removeProperty('transform')
    clearBackdrop(element)
  }

  function unlock () {
    if (!IN_BROWSER) return
    if (isNullOrUndefined(document.querySelector('dialog[open]:modal'))) {
      document.documentElement.classList.remove('dialog-open')
    }
  }

  function clearPending () {
    exitEl.value = null
    fallback.stop()
    backdropHold.stop()
  }

  function show () {
    const element = dialogEl.value
    if (isNullOrUndefined(element) || !IN_BROWSER) return
    clearPending()
    clearMotion(element)
    element.classList.remove('hiding')
    if (!element.open) element.showModal()
    if (!scroll) document.documentElement.classList.add('dialog-open')
  }

  // The pin keeps `::backdrop` up for the discrete exit. Restoring the
  // tokens before that hold ends paints the scrim back at full strength.
  function restoreBackdrop () {
    const node = dialogEl.value
    if (isNullOrUndefined(node) || node.open) return
    clearBackdrop(node)
  }

  function finish () {
    clearPending()
    const node = dialogEl.value
    if (isNullOrUndefined(node)) return
    if (node.open) node.close()
    node.style.removeProperty('transform')
    node.classList.remove('hiding')
    unlock()
    backdropHold.start()
  }

  function endBounce () {
    const element = dialogEl.value
    if (isNullOrUndefined(element)) return
    element.classList.remove('drawer-static')
  }

  const fallback = useTimer(finish, { duration: 400 })
  const backdropHold = useTimer(restoreBackdrop, { duration: 400 })
  const bounceTimer = useTimer(endBounce, { duration: 300 })

  function onExit (event: TransitionEvent) {
    const element = dialogEl.value
    if (isNullOrUndefined(element) || event.target !== element) return
    const pseudo = event.pseudoElement
    if (
      event.propertyName !== 'transform'
      && pseudo !== '::backdrop'
      && pseudo !== 'backdrop'
    ) return
    finish()
  }

  useEventListener(() => exitEl.value, 'transitionend', onExit)

  function hide () {
    const element = dialogEl.value
    if (isNullOrUndefined(element) || !IN_BROWSER) return
    if (!element.open || element.classList.contains('hiding')) return

    element.classList.add('hiding')

    // `close()` drops `::backdrop` immediately, and the pin has no
    // `.drawer.hiding::backdrop` fade. The dialog stays modal so the existing
    // backdrop transition can run. `.drawer[open]` pins `transform: none`,
    // so the slide is an inline transform cleared with the tokens.
    if (!animated(element)) {
      element.close()
      element.classList.remove('hiding')
      unlock()
      return
    }

    element.style.setProperty('--bs-drawer-backdrop-bg', 'transparent')
    element.style.setProperty('--bs-drawer-backdrop-blur', '0px')
    const transform = exitTransform(element)
    if (!isUndefined(transform)) element.style.transform = transform

    exitEl.value = element
    fallback.start()
  }

  function bounce () {
    const element = dialogEl.value
    if (isNullOrUndefined(element)) return
    element.classList.add('drawer-static')
    bounceTimer.start()
  }

  function onCancel (event: Event) {
    event.preventDefault()
    if (!keyboard) {
      bounce()
      return
    }
    close()
  }

  let originX = 0
  let originY = 0
  let tracking = false

  function dialogAttrs (described: Record<string, unknown>) {
    const { onCancel: _cancel, onClose: _close, ...rest } = described
    return rest
  }

  function onPointerDown (event: PointerEvent) {
    if (event.pointerType === 'mouse') return
    tracking = true
    originX = event.clientX
    originY = event.clientY
  }

  function onPointerUp (event: PointerEvent) {
    if (!tracking || event.pointerType === 'mouse') return
    tracking = false

    const element = dialogEl.value
    if (isNullOrUndefined(element) || !element.open) return

    const dx = event.clientX - originX
    const dy = event.clientY - originY
    if (Math.abs(dx) <= 40 && Math.abs(dy) <= 40) return

    const rtl = getComputedStyle(element).direction === 'rtl'
    const horizontal = Math.abs(dx) > Math.abs(dy)
    let dismiss = false

    if (
      element.classList.contains('drawer-bottom')
      || element.classList.contains('drawer-fullscreen')
    ) dismiss = !horizontal && dy > 0
    else if (element.classList.contains('drawer-top')) dismiss = !horizontal && dy < 0
    else if (element.classList.contains('drawer-end')) dismiss = horizontal && (rtl ? dx < 0 : dx > 0)
    else dismiss = horizontal && (rtl ? dx > 0 : dx < 0)

    if (dismiss) close()
  }

  function onBackdrop (event: MouseEvent) {
    if (event.target !== event.currentTarget) return
    if (blocking) {
      bounce()
      return
    }
    close()
  }

  function sync (open: boolean) {
    if (open) show()
    else hide()
  }

  watch(model, open => {
    sync(open)
  })

  onMounted(() => {
    sync(model.value)
  })

  onScopeDispose(() => {
    clearPending()
    const element = dialogEl.value
    if (isNullOrUndefined(element)) return
    clearMotion(element)
    if (element.open) element.close()
    element.classList.remove('hiding')
    unlock()
  })
</script>

<template>
  <Dialog.Root v-model="model">
    <Dialog.Content
      v-slot="{ attrs: described }"
      :blocking
      :close-on-click-outside="false"
      renderless
      :scrim="false"
    >
      <dialog
        ref="dialog"
        :class="classes"
        v-bind="mergeProps(attrs, dialogAttrs(described), {
          onCancel,
          onClick: onBackdrop,
          onPointerdown: onPointerDown,
          onPointerup: onPointerUp,
        })"
      >
        <slot />
      </dialog>
    </Dialog.Content>
  </Dialog.Root>
</template>
